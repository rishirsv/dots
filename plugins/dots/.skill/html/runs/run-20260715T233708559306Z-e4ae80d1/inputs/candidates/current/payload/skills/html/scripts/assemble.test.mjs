// node --test scripts/assemble.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { assemble } from "./assemble.mjs";

test("assembles one self-contained page and deduplicates selected component CSS", () => {
  const body = `<section id="result"><h2>Result</h2>
    <div data-component="callout" class="callout"><p><strong>Ready.</strong> Focused checks passed.</p></div>
    <div data-component="callout" class="callout"><p><strong>Scope.</strong> No migration required.</p></div>
  </section>`;
  const html = assemble({
    title: "Release <readiness>",
    context: "project / release",
    dek: "The decision and its evidence.",
    status: "verified",
    footer: "Sources: supplied release checks.",
    body,
    components: ["callout", "page-behavior", "callout"],
  });

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<h1>Release &lt;readiness&gt;<\/h1>/);
  assert.match(html, /<span class="status">verified<\/span>/);
  assert.equal((html.match(/\.callout \{/g) ?? []).length, 1);
  assert.equal((html.match(/data-component="callout"/g) ?? []).length, 2);
  assert.equal((html.match(/GENERATED from DESIGN\.md/g) ?? []).length, 1);
  assert.equal((html.match(/<script data-component="page-behavior">/g) ?? []).length, 1);
  assert.ok(!/(?:href|src)="https?:/i.test(html));
});

test("expands component dependencies and omits optional shell fields cleanly", () => {
  const html = assemble({
    title: "Diff review",
    body: '<section id="diff"><h2>Diff</h2><div data-component="diff-block" class="diff-block"></div></section>',
    components: ["diff-block"],
  });
  assert.match(html, /\.diff-block \{/);
  assert.match(html, /\.code-panel \{/);
  assert.ok(!html.includes('class="context-line"'));
  assert.ok(!html.includes('class="status"'));
  assert.ok(!html.includes('class="dek"'));
  assert.ok(!html.includes('class="sources"'));
});

test("CLI writes the requested file and rejects an unknown component", () => {
  const dir = mkdtempSync(join(tmpdir(), "dots-html-assemble-"));
  const bodyPath = join(dir, "body.html");
  const outPath = join(dir, "out.html");
  const script = fileURLToPath(new URL("./assemble.mjs", import.meta.url));
  writeFileSync(bodyPath, '<section id="one"><h2>One</h2><p>Complete.</p></section>');

  try {
    const ok = spawnSync(process.execPath, [script, "--title", "One", "--body", bodyPath, "--out", outPath], { encoding: "utf8" });
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(readFileSync(outPath, "utf8"), /<h1>One<\/h1>/);

    const bad = spawnSync(process.execPath, [script, "--title", "One", "--body", bodyPath, "--out", outPath, "--components", "missing"], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /unknown component/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
