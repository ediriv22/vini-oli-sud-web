// Black-box tests for the PHP admin panel: the real index.php is served with
// the PHP built-in server and a throwaway config. No network access to GitHub
// is needed for the cases below.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

const hasPhp = spawnSync("php", ["-v"]).status === 0;
const PASSWORD = "test-password-123";

async function freePort() {
  return new Promise((resolve) => {
    const s = createServer().listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

async function startServer() {
  const root = mkdtempSync(join(tmpdir(), "admin-"));
  cpSync("public/admin", join(root, "admin"), { recursive: true });
  writeFileSync(
    join(root, "admin", "config.php"),
    `<?php return ['GITHUB_REPO' => 'example/none', 'GITHUB_BRANCH' => 'main', 'GITHUB_TOKEN' => '', 'ADMIN_PASSWORD' => '${PASSWORD}'];\n`,
  );
  const port = await freePort();
  const proc = spawn("php", ["-S", `127.0.0.1:${port}`, "-t", root], { stdio: "ignore" });
  const base = `http://127.0.0.1:${port}/admin/index.php`;
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  return { base, stop: () => { proc.kill(); rmSync(root, { recursive: true, force: true }); } };
}

const login = (base, password) =>
  fetch(base, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ login_password: password }),
  });

const opts = { skip: !hasPhp && "php is not installed" };
let server;
before(async () => { if (hasPhp) server = await startServer(); });
after(() => server?.stop());

test("shows the login form to anonymous visitors", opts, async () => {
  const res = await fetch(server.base);
  const html = await res.text();
  assert.equal(res.status, 200);
  assert.match(html, /name="login_password"/);
  assert.doesNotMatch(html, /name="csrf"/, "editor must not be rendered before login");
});

test("rejects a wrong password and stays on the login form", opts, async () => {
  const res = await login(server.base, "wrong");
  const html = await res.text();
  assert.equal(res.status, 200);
  assert.match(html, /Password errata/);
  assert.match(html, /name="login_password"/);
});

test("accepts the right password with a hardened session cookie", opts, async () => {
  const res = await login(server.base, PASSWORD);
  assert.equal(res.status, 302);
  assert.match(res.headers.get("location"), /index\.php/);
  const cookie = res.headers.get("set-cookie") ?? "";
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Strict/i);
});

test("refuses to save without a valid CSRF token", opts, async () => {
  const res = await login(server.base, PASSWORD);
  const sid = (res.headers.get("set-cookie") ?? "").split(";")[0];
  const post = await fetch(`${server.base}?area=home-layout`, {
    method: "POST",
    headers: { cookie: sid, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ save: "1", area: "home-layout", csrf: "forged" }),
  });
  assert.match(await post.text(), /Sessione scaduta/);
});

test("blocks logins after 5 wrong passwords, even with the right one", opts, async () => {
  const fresh = await startServer();
  try {
    for (let i = 0; i < 5; i++) await login(fresh.base, `wrong-${i}`);
    const res = await login(fresh.base, PASSWORD);
    assert.equal(res.status, 200, "must not redirect while blocked");
    assert.match(await res.text(), /Troppi tentativi/);
  } finally {
    fresh.stop();
  }
});
