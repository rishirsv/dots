// node --test scripts/build.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, checkPage } from "./assemble.mjs";
import { build, extract, parseCsv } from "./build.mjs";
import { html, raw, replaceLiteral, SafeHtml, svg } from "./lib/html.mjs";
import { ContractError, helpers, meta } from "./kits/report.mjs";
import { rules, ruleDescriptions } from './lib/contracts.mjs';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "assets", "registry", "registry.json"), "utf8"));
const NOT_CONTENT = new Set(["page-shell", "page-behavior", "sequence-nav", "chapter-index", "toc-rail", "theme-toggle"]);
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function withTempDir(run) {
  const dir = mkdtempSync(join(tmpdir(), "dots-build-"));
  return Promise.resolve(run(dir)).finally(() => rmSync(dir, { recursive: true, force: true }));
}

/** Every element path (tag.sorted-classes chain) starting at any element; svg content is opaque. */
function skeleton(markup, { fromAnyAncestor }) {
  const paths = new Set();
  const stack = [];
  let svgDepth = 0;
  const cleaned = markup.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "");
  for (const [, closing, tag, attributes] of cleaned.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
    const name = tag.toLowerCase();
    if (closing) {
      if (svgDepth && name === "svg") svgDepth -= 1;
      if (!svgDepth || name === "svg") stack.pop();
      continue;
    }
    if (svgDepth) { if (name === "svg") svgDepth += 1; continue; }
    const classes = (attributes.match(/\sclass\s*=\s*"([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean).sort();
    const node = [name, ...classes].join(".");
    const chain = [...stack, node];
    const starts = fromAnyAncestor ? chain.map((_, index) => index) : [0];
    for (const start of starts) paths.add(chain.slice(start).join(" > "));
    if (VOID.has(name) || attributes.trim().endsWith("/")) continue;
    stack.push(node);
    if (name === "svg") svgDepth = 1;
  }
  return paths;
}

function fragmentMarkup(file) {
  const source = readFileSync(join(root, "assets", "registry", file), "utf8");
  return source.slice(source.lastIndexOf("</style>") + "</style>".length);
}

function runExample(example) {
  const names = Object.keys(helpers);
  const value = new Function(...names, `return (${example});`)(...names.map((name) => helpers[name]));
  return Array.isArray(value) ? value.map(String).join("") : String(value.body ?? value);
}

// ---------- lib/html.mjs ----------

test("html escapes interpolations and passes SafeHtml through", () => {
  const unsafe = `<script>"a" & 'b'</script>`;
  assert.equal(String(html`<p title="${unsafe}">${unsafe}</p>`),
    `<p title="&lt;script&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/script&gt;">&lt;script&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/script&gt;</p>`);
  assert.equal(String(html`<div>${html`<b>${"x<y"}</b>`}</div>`), "<div><b>x&lt;y</b></div>");
  assert.equal(String(html`${["a", html`<i>b</i>`, 3]}`), "a<i>b</i>3");
  assert.equal(String(html`[${null}${undefined}${false}${0}]`), "[0]");
  assert.equal(String(raw("<hr>")), "<hr>");
  assert.equal(svg, html);
  assert.ok(html`x` instanceof SafeHtml);
});

test("dollar patterns in interpolations stay literal", () => {
  assert.equal(String(html`<p>${"Cost $& more $' $`"}</p>`), "<p>Cost $&amp; more $&#39; $`</p>");
  assert.equal(replaceLiteral("before SLOT after", "SLOT", "$& $' $` $$"), "before $& $' $` $$ after");
});

function unsafeReplacements(source) {
  const tokens = [];
  const failures = [];
  for (let i = 0; i < source.length;) {
    const start = i, char = source[i];
    if (/\s/.test(char)) { i++; continue; }
    if (source.startsWith('//', i)) { i = source.indexOf('\n', i + 2); if (i < 0) break; continue; }
    if (source.startsWith('/*', i)) { i = source.indexOf('*/', i + 2) + 2; if (i < 2) break; continue; }
    if ('"\'`'.includes(char)) {
      const quote = char; i++;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (quote === '`' && source.startsWith('${', i)) {
          const expressionStart = i + 2;
          i = expressionStart;
          let braces = 1;
          while (i < source.length && braces) {
            if (source[i] === '\\') { i += 2; continue; }
            if (source[i] === '{') braces++;
            if (source[i] === '}') braces--;
            i++;
          }
          failures.push(...unsafeReplacements(source.slice(expressionStart, i - 1)));
          continue;
        }
        if (source[i++] === quote) break;
      }
      tokens.push({ value: source.slice(start, i), start }); continue;
    }
    if (char === '/' && ['(', ',', '=', ':', 'return', '=>'].includes(tokens.at(-1)?.value)) {
      i++; let inClass = false;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === '[') inClass = true;
        if (source[i] === ']') inClass = false;
        if (source[i++] === '/' && !inClass) break;
      }
      while (/[a-z]/i.test(source[i] ?? '')) i++;
      tokens.push({ value: source.slice(start, i), start }); continue;
    }
    if (/[\w$]/.test(char)) { i++; while (/[\w$]/.test(source[i] ?? '')) i++; }
    else i++;
    tokens.push({ value: source.slice(start, i), start });
  }
  for (let i = 0; i < tokens.length - 3; i++) {
    if (tokens[i].value !== '.' || !['replace', 'replaceAll'].includes(tokens[i + 1].value) || tokens[i + 2].value !== '(') continue;
    let depth = 0, comma = -1, close = -1;
    for (let j = i + 3; j < tokens.length; j++) {
      const value = tokens[j].value;
      if (value === '(' || value === '[' || value === '{') depth++;
      if (value === ')' || value === ']' || value === '}') {
        if (depth === 0 && value === ')') { close = j; break; }
        depth--;
      }
      if (value === ',' && depth === 0 && comma < 0) comma = j;
    }
    if (comma < 0 || close < 0) continue;
    const replacement = tokens.slice(comma + 1, close);
    const first = replacement[0]?.value ?? '';
    const literal = replacement.length === 1 && (first.startsWith('"') || first.startsWith("'")) || replacement.length === 1 && first.startsWith('`') && !first.includes('${');
    let nesting = 0, arrow = -1;
    replacement.forEach((token, index) => {
      if (['(', '[', '{'].includes(token.value)) nesting++;
      if ([')', ']', '}'].includes(token.value)) nesting--;
      if (nesting === 0 && token.value === '=' && replacement[index + 1]?.value === '>') arrow = index;
    });
    const prefix = replacement.slice(0, arrow).map((token) => token.value);
    const arrowParams = arrow >= 0 && (prefix.length === 1 && /^[\w$]+$/.test(prefix[0]) || prefix[0] === '(' && prefix.at(-1) === ')' && prefix.slice(1, -1).every((value) => /^[\w$]+$/.test(value) || value === ','));
    const callback = arrowParams || first === 'function' && replacement.at(-1)?.value === '}';
    if (!literal && !callback) failures.push(source.slice(tokens[i].start, tokens[close].start + 1));
  }
  return failures;
}

test('scripts never pass dynamic text as a plain replace or replaceAll replacement', () => {
  for (const sample of [
    '.replace("</body>", `<script>${payload}</script>`)',
    '.replace(/a{1,2}/,\n payload)',
    '.replaceAll("__SLOT__", theme)',
    '`render ${source.replace(/a{1,2}/, payload)}`',
    'text.replace("x", values.map(x => x).join(""))',
    'text.replace("x", function () { return payload; }())',
    'text.replace("x", condition ? value => value : payload)',
  ]) assert.equal(unsafeReplacements(sample).length, 1, sample);
  assert.deepEqual(unsafeReplacements('.replace(/a{1,2}/, () => payload)'), []);
  const scripts = join(root, 'scripts');
  const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : entry.name.endsWith('.mjs') && !entry.name.endsWith('.test.mjs') ? [join(dir, entry.name)] : []);
  for (const file of files(scripts)) {
    const source = readFileSync(file, 'utf8');
    assert.deepEqual(unsafeReplacements(source), [], file);
  }
});

// ---------- kits/report.mjs ----------

test("every content component in the registry has a report helper", () => {
  const covered = new Set(Object.values(meta).map((entry) => entry.component));
  const missing = registry.items.map((item) => item.name).filter((name) => !NOT_CONTENT.has(name) && !covered.has(name));
  assert.deepEqual(missing, []);
});

test('every catalog helper prints its specific contract rules', () => {
  const catalog = join(root, 'scripts', 'catalog.mjs');
  for (const name of Object.keys(meta)) {
    assert.ok(Object.keys(rules[name] ?? {}).length, `${name} needs rules`);
    const help = execFileSync(process.execPath, [catalog, '--help', name], { encoding: 'utf8' });
    assert.ok(help.includes(`Rules: ${ruleDescriptions(name)}`), name);
    assert.doesNotMatch(help, /Pass required fields/);
  }
  assert.throws(() => helpers.comparison([{ title: 'A', recommended: true }, { title: 'B', recommended: true }]), (error) => error.message.includes(rules.comparison.recommendation));
  assert.throws(() => helpers.flow({ nodes: Array.from({ length: 13 }, (_, i) => `n${i}`), edges: [], summary: 'Many nodes.' }), (error) => error.message.includes(rules.flow.nodes));
});

test("each helper example matches its registry fragment's element and class skeleton", () => {
  const files = new Map(registry.items.map((item) => [item.name, item.file]));
  for (const [name, entry] of Object.entries(meta)) {
    const output = runExample(entry.example);
    if (entry.component === "page-shell") continue; // page structure is covered by the page tests below
    assert.match(output, new RegExp(`data-component="${entry.component}"`), `${name} example must render ${entry.component}`);
    const allowed = skeleton(fragmentMarkup(files.get(entry.component)), { fromAnyAncestor: true });
    const extra = [...skeleton(output, { fromAnyAncestor: false })].filter((path) => !allowed.has(path));
    assert.deepEqual(extra, [], `${name} emits anatomy its fragment does not define`);
  }
});

test("page() is pure and returns a PageSpec; strings become paragraphs", () => {
  const spec = helpers.page({ title: "T", layout: "wide", behavior: true }, [helpers.section("one", "One", ["Hello & bye"])]);
  assert.equal(spec.kit, "report");
  assert.equal(spec.toc, "auto");
  assert.deepEqual(spec.components, ["page-behavior"]);
  assert.equal(String(spec.body), '<section id="one"><h2>One</h2><p>Hello &amp; bye</p></section>');
  assert.ok(Object.isFrozen(spec));
  assert.throws(() => helpers.page({ title: "T", layout: "poster" }, []), /layout/);
  assert.throws(() => helpers.section("Not A Slug", "x", []), /slug/);
});

test("helpers reject invalid arguments with the helper name", () => {
  assert.throws(() => helpers.finding({ severity: "urgent", title: "x" }), /report\.finding: severity/);
  assert.throws(() => helpers.findings([html`<li>x</li>`]), /report\.findings/);
  assert.throws(() => helpers.comparison([{ title: "only", body: "one" }]), /two to four/);
  assert.throws(() => helpers.figure({ src: "a.png" }), /alt is required/);
  assert.throws(() => helpers.flowDiagram({ viewBox: "0 0 1 1", content: svg`<g/>` }), /accessible description/);
});

// ---------- build.mjs ----------

test("committed outcome page modules rebuild their committed pages exactly", async () => {
  for (const name of ["status-report", "decision-comparison"]) {
    const built = await build(join(root, "assets", "outcomes", `${name}.page.mjs`));
    assert.equal(built, readFileSync(join(root, "assets", "outcomes", `${name}.html`), "utf8"), `${name}.html is stale`);
  }
});

test("build loads json, csv, and txt inputs from the module directory", () => withTempDir(async (dir) => {
  writeFileSync(join(dir, "sizes.json"), JSON.stringify([["cli", 12], ["docs", 4]]));
  writeFileSync(join(dir, "runs.csv"), 'name,ms,note\nbuild,1200,"slow, cold"\nverify,-3.5e2,""\n');
  writeFileSync(join(dir, "intro.txt"), "Plain <intro>");
  writeFileSync(join(dir, "page.mjs"), `
export const kit = "report";
export const inputs = { sizes: "./sizes.json", runs: "runs.csv", intro: "intro.txt" };
export default ({ page, section, bars, table }, { sizes, runs, intro }) =>
  page({ title: "Inputs" }, [section("data", "Data", [intro, bars(sizes, { title: "Size", source: "fixture" }), table({ columns: [{ label: "Step", key: "name" }, { label: "ms", key: "ms", numeric: true }], rows: runs })])]);
`);
  const out = await build(join(dir, "page.mjs"));
  assert.match(out, /<p>Plain &lt;intro&gt;<\/p>/);
  assert.match(out, /<div class="bar-name">cli<\/div>/);
  assert.match(out, /<td class="col-num">-350<\/td>/);
  assert.match(out, /data-component="bar-chart"/);
  assert.match(out, /\.bar-track/); // CSS inferred from the helper's markup
}));

test("build rejects inputs outside the module directory and a missing kit", () => withTempDir(async (dir) => {
  writeFileSync(join(dir, "escape.mjs"), `export const kit = "report"; export const inputs = { secret: "../secret.txt" }; export default ({ page }) => page({ title: "x" }, []);`);
  await assert.rejects(build(join(dir, "escape.mjs")), /inside the page module directory/);
  writeFileSync(join(dir, "nokit.mjs"), `export default () => ({});`);
  await assert.rejects(build(join(dir, "nokit.mjs")), /must export kit/);
  writeFileSync(join(dir, "wrong.mjs"), `export const kit = "report"; export default () => ({ kit: "report" });`);
  await assert.rejects(build(join(dir, "wrong.mjs")), /must return/);
}));

test("build rejects symlinked inputs outside the module folder", () => withTempDir(async (dir) => {
  const external = join(dirname(dir), `${basename(dir)}-secret.txt`);
  writeFileSync(external, "private input");
  try {
    symlinkSync(external, join(dir, "facts.txt"));
    const file = join(dir, "page.mjs");
    writeFileSync(file, 'export const kit="report"; export const inputs={facts:"facts.txt"}; export default ({page,section}, {facts}) => page({title:"x"}, [section("facts","Facts",[facts])]);');
    await assert.rejects(build(file), /inside the page module directory/);
    await assert.rejects(build(file, { embedSource: true }), /inside the page module directory/);
  } finally { rmSync(external, { force: true }); }
}));

test("build reloads an edited module instead of using the ESM cache", () => withTempDir(async (dir) => {
  const file = join(dir, "page.mjs");
  const write = (title) => writeFileSync(file, `export const kit = "report"; export default ({ page }) => page({ title: ${JSON.stringify(title)} }, []);`);
  write("First");
  assert.match(await build(file), /<h1>First<\/h1>/);
  write("Second");
  assert.match(await build(file), /<h1>Second<\/h1>/);
}));

test("parseCsv handles quotes, escaped quotes, CRLF, and numeric fields", () => {
  assert.deepEqual(parseCsv('a,b,c\r\n"x, y","say ""hi""",007\r\n'), [{ a: "x, y", b: 'say "hi"', c: 7 }]);
  assert.deepEqual(parseCsv("n\n1.5\n.5\n1e3\nv1\n"), [{ n: 1.5 }, { n: 0.5 }, { n: 1000 }, { n: "v1" }]);
  assert.throws(() => parseCsv("a,b\n1\n"), /row 2/);
});

// ---------- assemble.mjs ----------

test("component inference ignores attribute text inside code, pre, textarea, and comments", () => {
  const body = `<section id="a"><h2>A</h2>
<p>Mark roots with <code>data-component="&lt;name&gt;"</code> or <code>data-component="made-up"</code>.</p>
<pre>data-component="also-made-up"</pre><textarea>data-component="nope"</textarea><!-- data-component="comment" -->
<div data-component="callout" class="callout"><p>Real.</p></div></section>`;
  const out = assemble({ title: "Inference", body });
  assert.match(out, /\.callout \{/);
});

test("toc: auto generates a rail for six or more top-level sections", () => {
  const sections = (count) => Array.from({ length: count }, (_, index) =>
    `<section id="s${index}"><h2>Part <code>${index}</code> &amp; more</h2><section id="nested${index}"><h2>Nested</h2></section></section>`).join("\n");
  const six = assemble({ title: "Six", body: sections(6), toc: "auto" });
  assert.match(six, /data-component="toc-rail"/);
  assert.equal((six.match(/href="#s\d"/g) ?? []).length, 12); // wide and compact lists
  assert.doesNotMatch(six, /href="#nested/);
  assert.match(six, /<a href="#s0">Part 0 &amp; more<\/a>/);
  assert.match(six, /\.toc-rail \{/);
  assert.doesNotMatch(assemble({ title: "Five", body: sections(5), toc: "auto" }), /data-component="toc-rail"/);
  assert.match(assemble({ title: "Forced", body: sections(2), toc: true }), /data-component="toc-rail"/);
  assert.doesNotMatch(assemble({ title: "Default", body: sections(7) }), /data-component="toc-rail"/);
  assert.throws(() => assemble({ title: "Bad", body: "", toc: "yes" }), /toc must be/);
});

test("toc is not duplicated when the body already has a rail", () => {
  const body = `<nav data-component="toc-rail" class="toc-rail"></nav>` +
    Array.from({ length: 6 }, (_, index) => `<section id="s${index}"><h2>S${index}</h2></section>`).join("");
  const out = assemble({ title: "Has rail", body, toc: true });
  assert.equal((out.match(/data-component="toc-rail"/g) ?? []).length, 1);
});

test('report contracts name the helper and rule', () => {
  const invalid = [
    [() => helpers.finding({ severity: 'urgent', title: 'Risk' }), /severity must be high/],
    [() => helpers.figure({ src: 'image.png' }), /alt is required/],
    [() => helpers.comparison([{ title: 'A' }, { title: 'B' }], { columns: 3 }), /option count must match columns/],
    [() => helpers.flowDiagram({ viewBox: '0 0 100 100', content: svg`<rect/>`, caption: 'Flow', emphasis: ['a', 'b', 'c'] }), /at most two nodes/],
    [() => helpers.stats([{ value: 1, label: 'Count' }, { value: 2, label: 'Other' }]), /source/],
    [() => helpers.bars([['a', 1]], { title: 'Count' }), /source/],
    [() => helpers.sparkline([1, 2], { value: '2' }), /source/],
  ];
  for (const [call, rule] of invalid) assert.throws(call, (error) => error instanceof ContractError && rule.test(error.message) && /^report\.[a-zA-Z]+:/.test(error.message));
  assert.match(String(helpers.stats([{ value: 1, label: 'Count' }, { value: 2, label: 'Other' }], { source: 'illustrative' })), /data-source="illustrative"/);
});

test('page checks one recommendation, unique ids, and top-level h2s', () => {
  assert.deepEqual(checkPage('<section id="a"><h2>A</h2></section>'), []);
  assert.match(checkPage('<div data-component="recommendation"></div><div data-component="recommendation"></div>').join(' '), /at most one recommendation/);
  assert.match(checkPage('<section id="a"><h2>A</h2></section><section id="a"><h2>B</h2></section>').join(' '), /duplicate section id/);
  assert.match(checkPage('<section id="a"><p>Missing heading</p></section>').join(' '), /needs an h2/);
  assert.match(checkPage('<section id="unfinished"><p>Missing heading</p>').join(' '), /unfinished.*needs an h2/);
  assert.match(checkPage('<section id="first"><h2>First</h2><div data-component="recommendation"></div></section><section id="second"><h2>Second</h2><div data-component="recommendation"></div></section>').join(' '), /sections: "first", "second"/);
});

test('table accepts rich labels for object keys and responsive labels', () => {
  const markup = String(helpers.table({ columns: [{ label: html`<strong>Cost &amp; fees</strong>` }], rows: [{ 'Cost & fees': '$5' }], stacked: true }));
  assert.match(markup, /<th><strong>Cost &amp; fees<\/strong><\/th>/);
  assert.match(markup, /data-label="Cost &amp; fees">\$5<\/td>/);
});

test('sources are collected once and remain legible beside a footer', () => {
  const page = assemble({ title: 'Sources', footer: 'Reading notes', sources: 'collect', body: '<section id="a"><h2>A</h2><div data-component="stat-tiles" data-source="API &amp; logs"></div><div data-component="bar-chart" data-source="API &amp; logs"></div></section>' });
  assert.match(page, /<footer class="sources"><p>Reading notes<\/p><ul><li>API &amp; logs<\/li><\/ul><\/footer>/);
  assert.equal((page.match(/<li>API &amp; logs<\/li>/g) ?? []).length, 1);
});

test('every committed full page passes page checks', () => {
  for (const dir of ['assets/outcomes', 'assets', '../how/assets']) {
    const names = readdirSync(join(root, dir)).filter((name) => name.endsWith('.html'));
    for (const name of names) {
      const source = readFileSync(join(root, dir, name), 'utf8');
      const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
      if (body) assert.deepEqual(checkPage(body), [], `${dir}/${name}`);
    }
  }
});

test('build rejects a page-wide contract violation', () => withTempDir(async (dir) => {
  const file = join(dir, 'bad.page.mjs');
  writeFileSync(file, 'export const kit="report"; export default ({page,section,recommendation}) => page({title:"Bad"}, [section("one","One",[recommendation("First")]),section("two","Two",[recommendation("Second")])]);');
  await assert.rejects(build(file), /at most one recommendation/);
}));

test('embedded source extracts and rebuilds byte-identically', () => withTempDir(async (dir) => {
  const module = join(dir, 'roundtrip.page.mjs');
  const input = join(dir, 'facts.json');
  const source = 'export const kit="report"; export const inputs={facts:"./facts.json"}; export default ({page,section}, {facts}) => page({title:"Roundtrip"}, [section("facts","Facts",[facts.note])]);\n';
  writeFileSync(module, source);
  writeFileSync(input, '{"note":"Cost < $10"}\n');
  const first = await build(module, { embedSource: true });
  assert.match(first, /application\/vnd\.dots-source\+json/);
  assert.match(first, /\\u003c/);
  const page = join(dir, 'page.html');
  writeFileSync(page, first);
  const target = join(dir, 'extracted');
  const extractedModule = extract(page, target);
  assert.equal(readFileSync(extractedModule, 'utf8'), source);
  assert.equal(await build(extractedModule, { embedSource: true }), first);
  assert.throws(() => extract(page, target), /refusing to overwrite/);
  writeFileSync(join(target, '.dots-source.json'), '{"kitVersion":"2.0.0"}\n');
  writeFileSync(extractedModule, 'throw new Error("executed before version check")');
  await assert.rejects(build(extractedModule), /matching major version/);
}));

test('embedded source preserves replacement metacharacters in module and inputs', () => withTempDir(async (dir) => {
  const file = join(dir, 'dollars.page.mjs');
  const source = 'export const kit="report"; export const inputs={facts:"facts.txt"}; export default ({page,section},{facts}) => page({title:"Dollars"}, [section("facts","Facts",[facts, `Cost $${5} and $& more`, "$` and $\' and $$"])]);\n';
  const input = 'Price $& $` $\' $$ ${5}';
  writeFileSync(file, source);
  writeFileSync(join(dir, 'facts.txt'), input);
  const page = join(dir, 'page.html');
  writeFileSync(page, await build(file, { embedSource: true }));
  const extracted = extract(page, join(dir, 'restored'));
  assert.equal(readFileSync(extracted, 'utf8'), source);
  assert.equal(readFileSync(join(dir, 'restored', 'facts.txt'), 'utf8'), input);
  assert.equal(await build(extracted, { embedSource: true }), readFileSync(page, 'utf8'));
}));

test('extract rejects path traversal without running embedded code', () => withTempDir((dir) => {
  const payload = { kitVersion: '1.0.0', module: { name: '../escape.page.mjs', source: 'throw new Error("executed")' }, inputs: {} };
  const page = join(dir, 'unsafe.html');
  writeFileSync(page, `<html><body><script type="application/vnd.dots-source+json">${JSON.stringify(payload)}</script></body></html>`);
  assert.throws(() => extract(page, join(dir, 'out')), /must stay inside/);
  payload.module.name = 'safe.page.mjs';
  payload.inputs = { './safe.page.mjs': 'collision' };
  writeFileSync(page, `<html><body><script type="application/vnd.dots-source+json">${JSON.stringify(payload)}</script></body></html>`);
  assert.throws(() => extract(page, join(dir, 'out')), /duplicate embedded file/);
  assert.throws(() => extract(join(dir, 'missing.html'), join(dir, 'out')), /ENOENT/);
}));
