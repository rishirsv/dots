// node --test scripts/chart.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chart, parseSpec, normalizeSpec, linearScale, regenerateCharts } from "./chart.mjs";

const BAR = {
  title: "Spend by team, $k",
  data: [["platform", 412], ["growth", 255], ["ml", 104]],
  emphasis: "platform",
};
const SPARK = { data: [96, 120, 118, 180, 210, 260, 312], value: "312/wk" };

// ---------- primitives ----------

test("linearScale maps domain to range and rejects zero span", () => {
  const s = linearScale([0, 10], [0, 100]);
  assert.equal(s(5), 50);
  assert.equal(s(-5), -50);
  assert.throws(() => linearScale([3, 3], [0, 1]));
});

// ---------- normalization ----------

test("rows accept arrays and objects; sort and limit apply", () => {
  const a = normalizeSpec("bar", { title: "t", data: [["a", 1], ["b", 3]], sort: "desc" });
  const b = normalizeSpec("bar", { title: "t", data: [{ label: "a", value: 1 }, { label: "b", value: 3 }], sort: "desc" });
  assert.deepEqual(a.data, b.data);
  assert.deepEqual(a.data.map((r) => r[0]), ["b", "a"]);
  const limited = normalizeSpec("bar", { title: "t", data: [["a", 1], ["b", 3], ["c", 2]], limit: 2 });
  assert.equal(limited.data.length, 2);
});

test("invalid specs fail loudly", () => {
  assert.throws(() => normalizeSpec("pie", BAR), /unknown type/);
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [] }), /non-empty/);
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [["a", NaN]] }), /finite/);
  assert.throws(() => chart("bar", { title: "t", data: [["a", 5], ["b", -1]] }), /non-negative/);
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [["a", 1]], emphasis: "zzz" }), /matches no row/);
  assert.throws(() => normalizeSpec("bar", { data: [["a", 1]] }), /title is required/);
  assert.throws(() => normalizeSpec("bar", { title: "x -- y", data: [["a", 1]] }), /--/);
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [["a--b", 1]] }), /--/);
  assert.throws(() => normalizeSpec("sparkline", { data: [1], value: "v" }), /at least two/);
  assert.throws(() => normalizeSpec("stacked", { title: 't', series: ['Done', 'Done'], data: [['A', 2, 5]] }), /distinct series/);
  assert.throws(() => normalizeSpec("stacked", { title: 't', series: ['label', 'Done'], data: [['A', 2, 5]] }), /reserved/);
});

// ---------- fragment contracts ----------

const CASES = [
  ["bar", BAR],
  ["sparkline", SPARK],
];

for (const [type, spec] of CASES) {
  test(`${type}: fragment carries data-component, spec comment, and only chart tokens`, () => {
    const out = chart(type, spec);
    assert.match(out, /data-component="/);
    assert.match(out, /<!-- chart-spec \{/);
    assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(out), "no raw hex");
    assert.ok(!/<script/i.test(out), "no script tags");
    const varsUsed = [...out.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]);
    for (const v of varsUsed) {
      assert.ok(v.startsWith("--chart-") || v === "--font-sans", `unexpected token ${v}`);
    }
  });

  test(`${type}: edit loop — parseSpec(output) re-renders to identical output`, () => {
    const out = chart(type, spec);
    const reparsed = parseSpec(out);
    assert.equal(chart(reparsed.type, reparsed), out);
  });
}

// ---------- preset-specific behavior ----------

test("bar: widths proportional to max; emphasis styled", () => {
  const out = chart("bar", BAR);
  assert.match(out, /class="bar-fill emphasis" style="width:100%"/);
  assert.match(out, /style="width:61\.89%"/); // 255/412
  assert.match(out, /style="width:25\.24%"/); // 104/412
  assert.match(out, /var\(--chart-value-emphasis\)/);
  const names = [...out.matchAll(/bar-name">([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(names, ["platform", "growth", "ml"]); // desc default
});

test("sparkline: one point per datum, dot on the last point, visible value", () => {
  const out = chart("sparkline", SPARK);
  const points = out.match(/points="([^"]+)"/)[1].trim().split(/\s+/);
  assert.equal(points.length, SPARK.data.length);
  const [lastX, lastY] = points[points.length - 1].split(",");
  assert.match(out, new RegExp(`cx="${lastX}" cy="${lastY}"`));
  assert.match(out, />312\/wk</);
});

test('line and stacked charts print all values and preserve source on regeneration', () => {
  for (const [type, spec, value] of [
    ['line', { title: 'Trend', data: [['W1', 1], ['W2', 3]], source: 'APM' }, 'W2: 3'],
    ['stacked', { title: 'Work', series: ['Done', 'Open'], data: [['Search', 5, 2]], source: 'Tracker' }, 'Search: Done 5, Open 2'],
  ]) {
    const output = chart(type, spec);
    assert.match(output, /data-source="/);
    assert.ok(output.includes(`<li>${value}</li>`));
    assert.equal(regenerateCharts(output), output);
    assert.equal(parseSpec(output).source, spec.source);
  }
});

test('regeneration migrates provenance from older chart roots into their spec', () => {
  const older = chart('line', { title: 'Trend', data: [['W1', 1], ['W2', 3]] })
    .replace('data-component="line-chart"', 'data-component="line-chart" data-source="APM &amp; logs"');
  const updated = regenerateCharts(older);
  assert.equal(parseSpec(updated).source, 'APM & logs');
  assert.match(updated, /data-source="APM &amp; logs"/);
  assert.equal(regenerateCharts(updated), updated);
});

test("labels with markup characters are escaped everywhere except the inert spec comment", () => {
  const out = chart("bar", { title: "t", data: [["a<b>&c", 5]] });
  assert.match(out, /a&lt;b&gt;&amp;c/);
  const outsideComment = out.replace(/<!-- chart-spec \{.*?\} -->/s, "");
  assert.ok(!outsideComment.includes("a<b>&c"), "raw label leaked outside the spec comment");
  // and the comment still round-trips it faithfully
  assert.equal(parseSpec(out).data[0][0], "a<b>&c");
});

test("--from-fragment rewrites the fragment file in place", () => {
  const dir = mkdtempSync(join(tmpdir(), "dots-chart-"));
  const file = join(dir, "chart.html");
  const original = chart("bar", BAR);
  const edited = { ...parseSpec(original), data: [["platform", 500], ["growth", 255], ["ml", 104]] };
  const withEditedSpec = original.replace(/<!-- chart-spec \{.*?\} -->/s, `<!-- chart-spec ${JSON.stringify(edited)} -->`);
  writeFileSync(file, withEditedSpec);

  try {
    const script = fileURLToPath(new URL("./chart.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [script, "--from-fragment", file], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(file, "utf8"), chart("bar", edited));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--from-fragment updates edited charts inside a full page and preserves surrounding bytes", () => {
  const dir = mkdtempSync(join(tmpdir(), "dots-chart-page-"));
  const file = join(dir, "page.html");
  const first = chart("bar", BAR);
  const second = chart("sparkline", SPARK);
  const edited = { ...parseSpec(first), data: [["platform", 500], ["growth", 255], ["ml", 104]] };
  const input = `<!doctype html>\n<html><body>\n<header>$& untouched</header>\n${first.replace(/<!-- chart-spec \{.*?\} -->/s, `<!-- chart-spec ${JSON.stringify(edited)} -->`)}\n<aside>Between charts</aside>\n${second}\n<footer>untouched $'</footer>\n</body></html>\n`;
  writeFileSync(file, input);
  try {
    const script = fileURLToPath(new URL("./chart.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [script, "--from-fragment", file], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(file, "utf8"), input.replace(first.replace(/<!-- chart-spec \{.*?\} -->/s, `<!-- chart-spec ${JSON.stringify(edited)} -->`), chart("bar", edited)));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
