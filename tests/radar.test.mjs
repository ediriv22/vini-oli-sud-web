import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const script = resolve("scripts/import-food-radar.mjs");

function item(overrides = {}) {
  return {
    category: "Radar del Sud",
    title: "Titolo di prova",
    source: "Fonte di prova",
    url: "https://example.org/a",
    note: "Nota breve di prova.",
    ...overrides,
  };
}

function check(payload, { raw = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "radar-"));
  const file = join(dir, "in.json");
  writeFileSync(file, raw ? payload : JSON.stringify(payload));
  const r = spawnSync("node", [script, "--check", file], { encoding: "utf8" });
  const counts = /Validi: (\d+) · Unici: (\d+) · Pubblicati: (\d+)/.exec(r.stdout);
  return {
    status: r.status,
    stderr: r.stderr,
    valid: counts ? Number(counts[1]) : null,
    unique: counts ? Number(counts[2]) : null,
    published: counts ? Number(counts[3]) : null,
  };
}

test("accepts a well formed item", () => {
  const r = check([item()]);
  assert.equal(r.status, 0);
  assert.deepEqual([r.valid, r.unique, r.published], [1, 1, 1]);
});

test("discards items with missing or invalid fields, without failing the batch", () => {
  const r = check([
    item(),
    item({ title: "", url: "https://example.org/b" }),
    item({ source: "", url: "https://example.org/c" }),
    item({ url: "ftp://example.org/d" }),
    item({ note: "", url: "https://example.org/e" }),
    item({ category: "Inventata", url: "https://example.org/f" }),
    item({ date: "ieri", url: "https://example.org/g" }),
    item({ title: "x".repeat(161), url: "https://example.org/h" }),
    item({ note: "x".repeat(221), url: "https://example.org/i" }),
    "non un oggetto",
  ]);
  assert.equal(r.status, 0);
  assert.equal(r.valid, 1);
  assert.match(r.stderr, /category "Inventata" non consentita/);
});

test("accepts ISO dates with and without time", () => {
  const r = check([
    item({ date: "2026-10-12" }),
    item({ date: "2026-10-12T08:30:00Z", url: "https://example.org/b" }),
  ]);
  assert.equal(r.valid, 2);
});

test("removes duplicate URLs, ignoring case", () => {
  const r = check([item(), item({ url: "https://EXAMPLE.org/A", title: "Altro" })]);
  assert.deepEqual([r.valid, r.unique], [2, 1]);
  assert.match(r.stderr, /URL duplicato/);
});

test("publishes at most 30 items", () => {
  const many = Array.from({ length: 35 }, (_, i) => item({ url: `https://example.org/${i}` }));
  const r = check(many);
  assert.deepEqual([r.unique, r.published], [35, 30]);
});

test("fails on input that is not a JSON array", () => {
  const r = check({ items: [] });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /deve contenere un array/);
});

test("fails on invalid JSON", () => {
  const r = check("{ non json", { raw: true });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /JSON non valido/);
});

test("fails without an input path", () => {
  const r = spawnSync("node", [script, "--check"], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /mancante/);
});

test("the published radar data passes validation untouched", () => {
  const r = spawnSync("node", [script, "--check", "src/data/foodRadar.generated.json"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.doesNotMatch(r.stderr, /scartato/, "published data must not contain invalid items");
});
