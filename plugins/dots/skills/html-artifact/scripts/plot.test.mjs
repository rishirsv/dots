#!/usr/bin/env node
// Tests for the author-time SVG charting module. Semantic assertions catch the
// failures that matter (escaping, raw hex, NaN, missing viewBox, accessibility
// pattern, clipped labels); small snapshots catch silent geometry churn.
//
// Run: node plugins/dots/skills/html-artifact/scripts/plot.test.mjs

import assert from "node:assert/strict";
import {
  barRanking,
  divergingBar,
  lollipop,
  slope,
  dataTable,
  escapeText,
  escapeAttr,
  estimateLabelWidth,
} from "./plot.mjs";

let passed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
  }
}

const PRESETS = {
  barRanking: () => barRanking([{ label: "R1", value: 61 }, { label: "R2", value: 94 }], { format: (v) => v + "%" }),
  divergingBar: () => divergingBar([{ label: "Up", value: 12 }, { label: "Down", value: -8 }], { format: (v) => v + "%" }),
  lollipop: () => lollipop([{ label: "A", value: 42 }, { label: "B", value: 88 }]),
  slope: () => slope([{ label: "X", from: 2, to: 5 }, { label: "Y", from: 6, to: 4 }]),
};

// ---- escaping --------------------------------------------------------------

test("escapeText escapes <, >, &", () => {
  assert.equal(escapeText("A&B <Q1>"), "A&amp;B &lt;Q1&gt;");
});

test("escapeAttr escapes quotes", () => {
  assert.equal(escapeAttr(`a"b'c`), "a&quot;b&#39;c");
});

test("source-grounded labels are escaped in output, never raw", () => {
  const svg = barRanking([{ label: "A&B <script>", value: 5 }], { width: 400 });
  assert.ok(svg.includes("A&amp;B &lt;script&gt;"), "escaped label missing");
  assert.ok(!svg.includes("<script>"), "raw markup leaked into SVG");
  assert.ok(!/A&B <Q/.test(svg), "raw ampersand/angle leaked");
});

// ---- per-preset contract ---------------------------------------------------

for (const [name, make] of Object.entries(PRESETS)) {
  const svg = make();

  test(`${name}: has a viewBox`, () => {
    assert.match(svg, /viewBox="0 0 \d+(?:\.\d+)? \d+(?:\.\d+)?"/);
  });

  test(`${name}: is aria-hidden and not role=img`, () => {
    assert.ok(svg.includes('aria-hidden="true"'), "missing aria-hidden");
    assert.ok(!svg.includes('role="img"'), "must not set role=img (table is the source)");
    assert.ok(!svg.includes("aria-label"), "must not set aria-label");
  });

  test(`${name}: no raw hex colors`, () => {
    assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(svg), "raw hex color found");
  });

  test(`${name}: every fill/stroke is var(--chart-*) or currentColor`, () => {
    for (const m of svg.matchAll(/(?:fill|stroke)="([^"]*)"/g)) {
      const v = m[1];
      assert.ok(
        v === "currentColor" || /^var\(--chart-[a-z]+\)$/.test(v),
        `color "${v}" is not a chart token`,
      );
    }
  });

  test(`${name}: no NaN or Infinity in output`, () => {
    assert.ok(!/NaN|Infinity/.test(svg), "non-finite value rendered");
  });

  test(`${name}: no negative coordinates clipping off the canvas`, () => {
    for (const m of svg.matchAll(/(?:x|y|cx|cy|x1|y1|x2|y2)="(-?\d+(?:\.\d+)?)"/g)) {
      assert.ok(Number(m[1]) >= 0, `coordinate ${m[1]} is negative (clipped)`);
    }
  });
}

// ---- label / margin behavior ----------------------------------------------

test("estimateLabelWidth grows with the longest label", () => {
  assert.ok(estimateLabelWidth(["a very long category label"]) > estimateLabelWidth(["short"]));
});

test("long category labels are not clipped (left text x stays >= 0)", () => {
  const svg = barRanking([{ label: "An extremely long category label that would clip", value: 10 }], { width: 720 });
  const xs = [...svg.matchAll(/<text x="(-?\d+(?:\.\d+)?)"/g)].map((m) => Number(m[1]));
  assert.ok(xs.every((x) => x >= 0), "a label x is negative");
});

// ---- numeric guards --------------------------------------------------------

test("non-finite value throws", () => {
  assert.throws(() => barRanking([{ label: "a", value: "oops" }]), /finite number/);
});

test("empty data throws", () => {
  assert.throws(() => lollipop([]), /non-empty array/);
});

// ---- dataTable helper ------------------------------------------------------

test("dataTable builds an escaped data-table slot", () => {
  const html = dataTable([{ k: "A&B", v: 1 }], [
    { head: "Name", cell: (r) => r.k },
    { head: "Count", cell: (r) => r.v },
  ]);
  assert.ok(html.includes('data-slot="data-table"'));
  assert.ok(html.includes("<table>"));
  assert.ok(html.includes("A&amp;B"));
});

// ---- snapshots (update intentionally if geometry changes) ------------------

const SNAPSHOTS = {
  barRanking: barRanking([{ label: "Alpha", value: 3 }, { label: "Beta", value: 6 }], { width: 300, sort: false }),
  slope: slope([{ label: "X", from: 2, to: 5 }], { width: 300, height: 160 }),
};

const EXPECTED = {
  barRanking:
    '<svg viewBox="0 0 300 76" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><line x1="48" y1="25" x2="248" y2="25" stroke="var(--chart-axis)" stroke-width="0.75"/><rect x="48" y="12" width="100" height="26" rx="3" fill="var(--chart-primary)"/><text x="40" y="25" text-anchor="end" dominant-baseline="middle" fill="currentColor" font-size="12">Alpha</text><text x="154" y="25" dominant-baseline="middle" fill="currentColor" font-size="12">3</text><line x1="48" y1="63" x2="248" y2="63" stroke="var(--chart-axis)" stroke-width="0.75"/><rect x="48" y="50" width="200" height="26" rx="3" fill="var(--chart-primary)"/><text x="40" y="63" text-anchor="end" dominant-baseline="middle" fill="currentColor" font-size="12">Beta</text><text x="254" y="63" dominant-baseline="middle" fill="currentColor" font-size="12">6</text></svg>',
  slope:
    '<svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><line x1="38" y1="22" x2="38" y2="146" stroke="var(--chart-axis)" stroke-width="1"/><line x1="275" y1="22" x2="275" y2="146" stroke="var(--chart-axis)" stroke-width="1"/><text x="38" y="16" text-anchor="middle" fill="currentColor" font-size="11">Before</text><text x="275" y="16" text-anchor="middle" fill="currentColor" font-size="11">After</text><line x1="38" y1="146" x2="275" y2="34" stroke="var(--chart-primary)" stroke-width="1.5"/><circle cx="38" cy="146" r="4" fill="var(--chart-primary)"/><circle cx="275" cy="34" r="4" fill="var(--chart-primary)"/><text x="28" y="146" text-anchor="end" dominant-baseline="middle" fill="currentColor" font-size="11">X 2</text><text x="285" y="34" dominant-baseline="middle" fill="currentColor" font-size="11">5</text></svg>',
};

for (const [name, svg] of Object.entries(SNAPSHOTS)) {
  test(`snapshot: ${name}`, () => {
    assert.equal(svg, EXPECTED[name]);
  });
}

// ---- report ----------------------------------------------------------------

if (failures.length) {
  console.error(`plot.test.mjs: ${failures.length} failed, ${passed} passed`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`plot.test.mjs: ${passed} passed`);
