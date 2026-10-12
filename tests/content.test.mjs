import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "content/settings";
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const load = (f) => JSON.parse(readFileSync(join(dir, f), "utf8"));

test("every settings file is valid JSON", () => {
  assert.ok(files.length >= 3, "expected the site, sections and layout files");
  for (const f of files) assert.doesNotThrow(() => load(f), f);
});

test("home layout lists each section once, with an explicit enabled flag", () => {
  const { sections } = load("home-layout.json");
  assert.ok(Array.isArray(sections) && sections.length > 0);
  const keys = sections.map((s) => s.key);
  assert.equal(new Set(keys).size, keys.length, "duplicate section keys");
  for (const s of sections) {
    assert.equal(typeof s.key, "string");
    assert.equal(typeof s.enabled, "boolean", `enabled missing on ${s.key}`);
  }
});

test("local files referenced from the content exist in public/", () => {
  const refs = [];
  const walk = (value, where) => {
    if (typeof value === "string") {
      if (/^\/[^\s]+\.(png|jpe?g|webp|svg|pdf|mp4|ico)$/i.test(value)) refs.push([value, where]);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${where}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, `${where}.${k}`);
    }
  };
  for (const f of files) walk(load(f), f);
  assert.ok(refs.length > 0, "expected at least one asset reference");
  const missing = refs.filter(([p]) => !existsSync(join("public", p)));
  assert.deepEqual(missing, [], "assets referenced in content but missing from public/");
});

test(".htaccess does not force a Content-Encoding on static files", () => {
  // A forced "gzip" on uncompressed woff2 files makes browsers reject the fonts.
  const htaccess = readFileSync("public/.htaccess", "utf8");
  assert.doesNotMatch(htaccess, /^\s*Header\s+set\s+Content-Encoding/im);
});

test("CSP lets the admin panel embed the site (visual editor and preview)", () => {
  // The panel shows the live site in an iframe. Without 'self' in frame-src
  // the browser blocks it ("Questi contenuti sono bloccati").
  const htaccess = readFileSync("public/.htaccess", "utf8");
  const csp = /Content-Security-Policy\s+"([^"]+)"/.exec(htaccess)?.[1] ?? "";
  const frameSrc = /(?:^|;)\s*frame-src\s+([^;]+)/.exec(csp)?.[1] ?? "";
  assert.match(frameSrc, /'self'/, "frame-src must include 'self'");
});
