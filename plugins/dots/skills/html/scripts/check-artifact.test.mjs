// node --test scripts/check-artifact.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { checkArtifact } from "./check-artifact.mjs";

const codes = (html) => checkArtifact(html).map((failure) => failure.code);

test("accepts semantic, self-contained controls and figures", () => {
  const html = `<!doctype html><html><head><style>.note{font-size:11px}</style></head><body>
    <a href="#result">Result</a>
    <button type="button" aria-label="Toggle color theme"><svg aria-hidden="true"></svg></button>
    <label for="period">Period</label><select id="period"><option>Week</option></select>
    <img src="data:image/png;base64,AA==" alt="A release chart with one emphasized bar">
    <svg role="img" aria-label="Three releases, with the newest emphasized"></svg>
  </body></html>`;
  assert.deepEqual(checkArtifact(html), []);
});

test("rejects host-only behavior and external resource loads", () => {
  assert.ok(codes('<script>window.openai.sendFollowUpMessage({})</script>').includes("host-api"));
  assert.ok(codes('<img src="https://example.com/chart.png" alt="Chart">').includes("external-request"));
  assert.ok(codes('<img src="./chart.png" alt="Chart">').includes("external-request"));
  assert.ok(codes('<script src="./behavior.js"></script>').includes("external-request"));
  assert.ok(codes('<img data-embed-src="./chart.png" alt="Chart">').includes("unembedded-asset"));
  assert.ok(codes('<script>fetch("/data.json")</script>').includes("external-request"));
});

test("rejects custom tab order and unnamed actions", () => {
  const result = codes('<button tabindex="0"><svg aria-hidden="true"></svg></button><a href="#x"></a>');
  assert.ok(result.includes("tab-order"));
  assert.ok(result.includes("control-name"));
  assert.ok(result.includes("link-name"));
});

test("rejects unlabeled form controls but accepts explicit labels", () => {
  assert.ok(codes('<input id="query" type="text">').includes("control-label"));
  assert.ok(!codes('<label for="query">Query</label><input id="query" type="text">').includes("control-label"));
  assert.ok(!codes('<textarea aria-label="Release notes"></textarea>').includes("control-label"));
});

test("rejects inaccessible raster and SVG content", () => {
  assert.ok(codes('<img src="data:image/png;base64,AA==" alt="">').includes("image-alt"));
  assert.ok(codes('<svg><path></path></svg>').includes("svg-name"));
  assert.ok(!codes('<svg role="img"><title>Build duration by phase</title></svg>').includes("svg-name"));
});

test("rejects text smaller than the supported minimum", () => {
  assert.ok(codes('<style>.tiny{font-size:10px}</style>').includes("text-size"));
  assert.ok(!codes('<style>.small{font-size:11px}</style>').includes("text-size"));
});

test("CLI failure changes the exit status", () => {
  const dir = mkdtempSync(join(tmpdir(), "dots-html-check-"));
  const good = join(dir, "good.html");
  const bad = join(dir, "bad.html");
  const script = fileURLToPath(new URL("./check-artifact.mjs", import.meta.url));
  writeFileSync(good, '<button aria-label="Open details"></button>');
  writeFileSync(bad, '<button tabindex="1"></button>');
  try {
    assert.equal(spawnSync(process.execPath, [script, good], { encoding: "utf8" }).status, 0);
    const failed = spawnSync(process.execPath, [script, bad], { encoding: "utf8" });
    assert.equal(failed.status, 1);
    assert.match(failed.stderr, /tab-order/);
    assert.match(failed.stderr, /control-name/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
