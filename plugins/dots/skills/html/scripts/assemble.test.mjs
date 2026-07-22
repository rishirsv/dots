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
  assert.ok(!html.includes("gotchas:"), "component header comments must not leak into CSS");
  assert.equal((html.match(/^<style>$/gm) ?? []).length, 1, "the document must contain one style element");
  assert.equal((html.match(/^<\/style>$/gm) ?? []).length, 1, "the document style element must close once");
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

test("embeds project-local raster images and removes their source paths", () => {
  const dir = mkdtempSync(join(tmpdir(), "dots-html-image-"));
  const imagePath = join(dir, "focal.png");
  const bodyPath = join(dir, "body.html");
  const outPath = join(dir, "brief.html");
  const body = '<section id="image"><h2>Image</h2><figure><img data-embed-src="./focal.png" alt="A calm project workspace"></figure></section>';
  writeFileSync(imagePath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  writeFileSync(bodyPath, body);

  try {
    const html = assemble({
      title: "Illustrated brief",
      body,
      assetRoot: dir,
    });
    assert.match(html, /src="data:image\/png;base64,iVBORw0KGgo="/);
    assert.ok(!html.includes("data-embed-src"));
    assert.ok(!html.includes(imagePath));

    const script = fileURLToPath(new URL("./assemble.mjs", import.meta.url));
    const cli = spawnSync(process.execPath, [script, "--title", "Illustrated brief", "--body", bodyPath, "--out", outPath], { encoding: "utf8" });
    assert.equal(cli.status, 0, cli.stderr);
    const cliHtml = readFileSync(outPath, "utf8");
    assert.match(cliHtml, /src="data:image\/png;base64,iVBORw0KGgo="/);
    assert.ok(!cliHtml.includes("data-embed-src"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects ambiguous or unsupported embedded image sources", () => {
  assert.throws(() => assemble({
    title: "Bad image",
    body: '<section id="image"><h2>Image</h2><img src="fallback.png" data-embed-src="./focal.png" alt=""></section>',
    assetRoot: "/tmp",
  }), /both src and data-embed-src/);
  assert.throws(() => assemble({
    title: "Bad image",
    body: '<section id="image"><h2>Image</h2><img data-embed-src="./focal.svg" alt=""></section>',
    assetRoot: "/tmp",
  }), /unsupported embedded image type/);
});
