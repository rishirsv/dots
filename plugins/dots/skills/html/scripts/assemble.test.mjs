// node --test scripts/assemble.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { assemble, assembleSet } from "./assemble.mjs";

function pageSetFixture() {
  const root = mkdtempSync(join(tmpdir(), "dots-html-set-"));
  for (const name of ["intro", "build", "review"]) {
    writeFileSync(join(root, `${name}.body.html`), `<section id="${name}"><h2>${name}</h2><p>Complete.</p></section>`);
  }
  return {
    root,
    manifest: {
      schemaVersion: 1,
      title: "Atelier agentique",
      lang: "fr",
      pages: [
        { id: "intro", label: "Introduction", title: "Start here", body: "intro.body.html", output: "index.html" },
        { id: "build", label: "Build", title: "Build a slice", body: "build.body.html", output: "chapters/build.html", components: ["process-steps"] },
        { id: "review", label: "Review", title: "Review the result", body: "review.body.html", output: "review.html" },
      ],
    },
  };
}

function learningSiteFixture() {
  const root = mkdtempSync(join(tmpdir(), "dots-html-learning-"));
  for (const name of ["contents", "foundations", "mental-model", "boundaries", "tool-use", "contracts", "state"]) {
    writeFileSync(join(root, `${name}.body.html`), `<section id="${name}"><h2>${name}</h2><p>Complete.</p></section>`);
  }
  return {
    root,
    manifest: {
      schemaVersion: 1,
      title: "Agent systems field guide",
      pages: [
        { id: "contents", label: "Contents", title: "Field guide", body: "contents.body.html", output: "index.html" },
        { id: "foundations", parent: "contents", number: "1", label: "Foundations", title: "Foundations", dek: "Name the system.", body: "foundations.body.html", output: "chapters/foundations/index.html" },
        { id: "mental-model", parent: "foundations", number: "1.1", label: "Mental model", title: "Mental model", dek: "See the loop.", body: "mental-model.body.html", output: "chapters/foundations/mental-model.html" },
        { id: "boundaries", parent: "foundations", number: "1.2", label: "Boundaries", title: "Boundaries", dek: "Assign ownership.", body: "boundaries.body.html", output: "chapters/foundations/boundaries.html" },
        { id: "tool-use", parent: "contents", number: "2", label: "Tool use", title: "Tool use", dek: "Make actions inspectable.", body: "tool-use.body.html", output: "chapters/tool-use/index.html" },
        { id: "contracts", parent: "tool-use", number: "2.1", label: "Contracts", title: "Contracts", context: "tool boundary / public contract", dek: "Narrow ambiguity.", body: "contracts.body.html", output: "chapters/tool-use/contracts.html" },
        { id: "state", parent: "tool-use", number: "2.2", label: "State", title: "State", dek: "Keep truth distinct.", body: "state.body.html", output: "chapters/tool-use/state.html" },
      ],
    },
  };
}

test("assembles one self-contained page and deduplicates selected component CSS", () => {
  const body = `<section id="result"><h2>Result</h2>
    <div data-component="callout" class="callout"><p><strong>Ready.</strong> Focused checks passed.</p></div>
    <div data-component="callout" class="callout"><p><strong>Scope.</strong> No migration required.</p></div>
  </section>`;
  const html = assemble({
    title: "Release <readiness>",
    context: "project / release",
    dek: "The decision and its evidence.",
    footer: "Sources: supplied release checks.",
    layout: "wide",
    body,
    components: ["callout", "page-behavior", "callout"],
  });

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<h1>Release &lt;readiness&gt;<\/h1>/);
  assert.ok(!html.includes('class="status"'));
  assert.match(html, /data-layout="wide"/);
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

test("CLI writes the requested file and rejects unsupported input", () => {
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

    const status = spawnSync(process.execPath, [script, "--title", "One", "--body", bodyPath, "--out", outPath, "--status", "ready"], { encoding: "utf8" });
    assert.equal(status.status, 1);
    assert.match(status.stderr, /--status is not supported/);
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
  assert.throws(() => assemble({
    title: "Bad layout",
    body: "<section><h2>One</h2></section>",
    layout: "dashboard",
  }), /unknown layout/);
});

test("assembles ordered page sets from one manifest", () => {
  const { root, manifest } = pageSetFixture();
  try {
    const rendered = assembleSet({ manifest, manifestRoot: root });
    assert.deepEqual([...rendered.keys()], ["index.html", "chapters/build.html", "review.html"]);
    assert.match(rendered.get("index.html"), /href="chapters\/build\.html" rel="next"/);
    assert.doesNotMatch(rendered.get("index.html"), /rel="prev"/);
    assert.match(rendered.get("chapters/build.html"), /href="\.\.\/index\.html" rel="prev"/);
    assert.match(rendered.get("chapters/build.html"), /href="\.\.\/review\.html" rel="next"/);
    assert.doesNotMatch(rendered.get("review.html"), /rel="next"/);
    for (const html of rendered.values()) {
      assert.match(html, /<html lang="fr">/);
      assert.equal((html.match(/<a[^>]+aria-current="page"/g) ?? []).length, 1);
      assert.doesNotMatch(html, /class="sequence-time"><\/span>/);
      assert.ok(!/(?:href|src)="https?:/i.test(html));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("assembles hierarchical learning sites with scoped navigation and generated curriculum", () => {
  const { root, manifest } = learningSiteFixture();
  try {
    const rendered = assembleSet({ manifest, manifestRoot: root });
    const contents = rendered.get("index.html");
    const chapter = rendered.get("chapters/tool-use/index.html");
    const lesson = rendered.get("chapters/tool-use/contracts.html");

    assert.match(contents, /data-component="chapter-index"/);
    assert.match(contents, /href="chapters\/tool-use\/index\.html"/);
    assert.match(contents, /href="chapters\/tool-use\/contracts\.html"/);
    assert.doesNotMatch(contents, /class="sequence-controls"/);

    assert.match(chapter, /aria-label="Breadcrumb"/);
    assert.match(chapter, /href="\.\.\/\.\.\/index\.html"/);
    assert.match(chapter, /<h2>Lessons<\/h2>/);
    assert.match(chapter, /href="contracts\.html"/);

    assert.match(lesson, /<span class="sequence-index">2\.1<\/span>Contracts/);
    assert.match(lesson, /class="context-line sequence-page-context">tool boundary \/ public contract<\/p>/);
    assert.match(lesson, /href="state\.html" rel="next"/);
    assert.doesNotMatch(lesson, />Foundations<\/a>/);
    assert.doesNotMatch(lesson, /data-component="chapter-index"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects invalid learning-site hierarchies", () => {
  const { root, manifest } = learningSiteFixture();
  try {
    const missing = structuredClone(manifest);
    missing.pages.find((page) => page.id === "contracts").parent = "missing";
    assert.throws(() => assembleSet({ manifest: missing, manifestRoot: root }), /missing parent/);

    const multipleRoots = structuredClone(manifest);
    delete multipleRoots.pages.find((page) => page.id === "tool-use").parent;
    assert.throws(() => assembleSet({ manifest: multipleRoots, manifestRoot: root }), /exactly one root/);

    const cycle = structuredClone(manifest);
    cycle.pages.push({ id: "loop-a", parent: "loop-b", label: "Loop A", title: "Loop A", body: "contents.body.html", output: "loop-a.html" });
    cycle.pages.push({ id: "loop-b", parent: "loop-a", label: "Loop B", title: "Loop B", body: "contents.body.html", output: "loop-b.html" });
    assert.throws(() => assembleSet({ manifest: cycle, manifestRoot: root }), /contains a cycle/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("assemble CLI publishes a complete page set and rejects unsafe manifests", () => {
  const { root, manifest } = pageSetFixture();
  const script = fileURLToPath(new URL("./assemble.mjs", import.meta.url));
  const manifestPath = join(root, "manifest.json");
  const outDir = join(root, "published");
  writeFileSync(manifestPath, JSON.stringify(manifest));
  try {
    const ok = spawnSync(process.execPath, [script, "--manifest", manifestPath, "--out", outDir], { encoding: "utf8" });
    assert.equal(ok.status, 0, ok.stderr);
    assert.ok(existsSync(join(outDir, "chapters", "build.html")));

    const overwrite = spawnSync(process.execPath, [script, "--manifest", manifestPath, "--out", outDir], { encoding: "utf8" });
    assert.equal(overwrite.status, 1);
    assert.match(overwrite.stderr, /output directory already exists/);

    manifest.pages[1].output = "../outside.html";
    assert.throws(() => assembleSet({ manifest, manifestRoot: root }), /stay inside the output directory/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
