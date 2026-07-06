// node --test scripts/chart.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { chart, parseSpec, normalizeSpec, escapeText, escapeAttr, linearScale } from "./chart.mjs";

const BAR = {
  title: "Spend by team, $k",
  data: [["platform", 412], ["growth", 255], ["ml", 104]],
  emphasis: "platform",
};
const DIV = {
  title: "Latency delta by service, ms",
  data: [["checkout", 41], ["search", -18], ["auth", 7]],
  emphasis: "search",
};
const SLOPE = {
  title: "p95 before/after, ms",
  data: [["checkout", 410, 255], ["search", 220, 205]],
  fromLabel: "wk 27",
  toLabel: "wk 28",
  emphasis: "checkout",
};
const SPARK = { data: [96, 120, 118, 180, 210, 260, 312], value: "312/wk" };

// ---------- primitives ----------

test("escaping covers text and attribute contexts", () => {
  assert.equal(escapeText('a<b>&"c'), 'a&lt;b&gt;&amp;"c');
  assert.equal(escapeAttr('a<b>&"c\''), "a&lt;b&gt;&amp;&quot;c&#39;");
});

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
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [["a", 1]], emphasis: "zzz" }), /matches no row/);
  assert.throws(() => normalizeSpec("bar", { data: [["a", 1]] }), /title is required/);
  assert.throws(() => normalizeSpec("bar", { title: "x -- y", data: [["a", 1]] }), /--/);
  assert.throws(() => normalizeSpec("bar", { title: "t", data: [["a--b", 1]] }), /--/);
  assert.throws(() => normalizeSpec("sparkline", { data: [1], value: "v" }), /2\+/);
});

// ---------- fragment contracts ----------

const CASES = [
  ["bar", BAR],
  ["diverging", DIV],
  ["slope", SLOPE],
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

test("diverging: zero rule present; pos/neg/emphasis colored by direction", () => {
  const out = chart("diverging", DIV);
  assert.match(out, /var\(--chart-grid\)/);
  assert.match(out, /var\(--chart-pos\)/);
  assert.match(out, /var\(--chart-emphasis\)/); // search is emphasized, so its neg bar uses emphasis
  assert.match(out, /<details class="chart-data">/);
  // auth (7, non-emphasis, positive) and checkout (41) both pos; search overridden
  assert.equal([...out.matchAll(/var\(--chart-pos\)/g)].length, 2);
  assert.equal([...out.matchAll(/var\(--chart-neg\)/g)].length, 0);
});

test("slope: endpoints map to value scale; labels include values", () => {
  const out = chart("slope", SLOPE);
  assert.match(out, /wk 27/);
  assert.match(out, /checkout 410/);
  assert.match(out, /text-anchor="start" style="[^"]*--chart-value-emphasis/);
  assert.match(out, /<details class="chart-data">/);
});

test("sparkline: one point per datum, dot on the last point, visible value", () => {
  const out = chart("sparkline", SPARK);
  const points = out.match(/points="([^"]+)"/)[1].trim().split(/\s+/);
  assert.equal(points.length, SPARK.data.length);
  const [lastX, lastY] = points[points.length - 1].split(",");
  assert.match(out, new RegExp(`cx="${lastX}" cy="${lastY}"`));
  assert.match(out, />312\/wk</);
});

test("labels with markup characters are escaped everywhere except the inert spec comment", () => {
  const out = chart("bar", { title: "t", data: [["a<b>&c", 5]] });
  assert.match(out, /a&lt;b&gt;&amp;c/);
  const outsideComment = out.replace(/<!-- chart-spec \{.*?\} -->/s, "");
  assert.ok(!outsideComment.includes("a<b>&c"), "raw label leaked outside the spec comment");
  // and the comment still round-trips it faithfully
  assert.equal(parseSpec(out).data[0][0], "a<b>&c");
});
