/**
 * Report kit: helpers that emit the registry fragments' anatomy for pages
 * built as modules. Registry fragments stay the source of anatomy and CSS;
 * the skeleton test keeps each helper aligned with its fragment.
 *
 * Content parameters accept a string (escaped), a number, SafeHtml from the
 * `html` tag or another helper, or an array of those. Block children given as
 * plain strings become paragraphs.
 */

import { chart } from "../chart.mjs";
import { SafeHtml, escapeHtml, html, raw, svg, tagged } from "../lib/html.mjs";

export const version = "1.0.0";

const LAYOUTS = ["article", "wide", "canvas"];
const SEVERITIES = ["high", "medium", "low"];

export class ContractError extends Error {
  constructor(helper, rule) {
    super(`report.${helper}: ${rule}`);
    this.name = "ContractError";
    this.helper = helper;
  }
}
function fail(helper, message) { throw new ContractError(helper, message); }

function required(helper, name, value) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) fail(helper, `${name} is required`);
  return value;
}

function list(helper, name, value) {
  if (!Array.isArray(value) || value.length === 0) fail(helper, `${name} must be a non-empty array`);
  return value;
}

/** Strings become paragraphs; markup passes through. */
function blocks(children) {
  const items = Array.isArray(children) ? children : [children];
  return html`${items.map((child) => (typeof child === "string" || typeof child === "number" ? html`<p>${child}</p>` : child))}`;
}

/** `{ lead, text }` renders a bold run-in lead; anything else renders as content. */
function leadText(value) {
  if (value && typeof value === "object" && !(value instanceof SafeHtml) && !Array.isArray(value)) {
    return value.lead ? html`<strong>${value.lead}</strong> ${value.text}` : html`${value.text}`;
  }
  return html`${value}`;
}

function paragraphs(lead, body) {
  const [first, ...rest] = Array.isArray(body) ? body : [body];
  return html`<p>${lead ? html`<strong>${lead}</strong> ` : ""}${first}</p>${rest.map((text) => html`<p>${text}</p>`)}`;
}

function withSource(markup, component, source, helper) {
  required(helper, "source (or \"illustrative\")", source);
  const attribute = ` data-source="${escapeHtml(source)}"`;
  return raw(markup.replace(`data-component="${component}"`, (match) => match + attribute));
}

// ---------- page structure ----------

function page(meta, children) {
  if (!meta || typeof meta !== "object") fail("page", "meta must be an object");
  required("page", "title", meta.title);
  const layout = meta.layout ?? "article";
  if (!LAYOUTS.includes(layout)) fail("page", `layout must be one of ${LAYOUTS.join(", ")}`);
  return Object.freeze({
    kit: "report",
    title: String(meta.title),
    context: meta.context ?? "",
    dek: meta.dek ?? "",
    footer: meta.footer ?? "",
    layout,
    toc: meta.toc ?? "auto",
    sources: "collect",
    components: meta.behavior ? ["page-behavior"] : [],
    body: blocks(children ?? []),
  });
}

function section(id, title, children) {
  if (typeof id !== "string" || !/^[a-z][a-z0-9-]*$/.test(id)) fail("section", "id must be a short lowercase slug");
  required("section", "title", title);
  return html`<section id="${id}"><h2>${title}</h2>${blocks(children ?? [])}</section>`;
}

const readingColumn = (children) => html`<div class="reading-column">${blocks(children)}</div>`;

// ---------- prose and emphasis ----------

function callout(lead, body, { variant = "note" } = {}) {
  if (!["note", "warn", "danger"].includes(variant)) fail("callout", "variant must be note, warn, or danger");
  required("callout", "body", body);
  const className = variant === "note" ? "callout" : `callout ${variant}`;
  return html`<div data-component="callout" class="${className}">${paragraphs(lead, body)}</div>`;
}
callout.note = (lead, body) => callout(lead, body, { variant: "note" });
callout.warn = (lead, body) => callout(lead, body, { variant: "warn" });
callout.danger = (lead, body) => callout(lead, body, { variant: "danger" });

const calloutStack = (items) => html`<div class="callout-stack">${list("calloutStack", "items", items)}</div>`;

function recommendation(lead, ...body) {
  required("recommendation", "lead", lead);
  return html`<div data-component="recommendation" class="recommendation">${paragraphs(lead, body.length ? body : [""])}</div>`;
}

function quote(text, attribution) {
  required("quote", "text", text);
  return html`<p data-component="pull-quote" class="pull-quote">${text}${attribution ? html` <span class="pull-quote-attr">— ${attribution}</span>` : ""}</p>`;
}

function disclosure(summary, children, { plain = false } = {}) {
  required("disclosure", "summary", summary);
  return html`<details data-component="disclosure" class="${plain ? "disclosure-plain" : "disclosure"}"><summary>${summary}</summary><div class="disclosure-content">${blocks(children)}</div></details>`;
}

// ---------- measures and data ----------

function stats(items, { source } = {}) {
  list("stats", "items", items);
  if (items.length > 5) fail("stats", "use two to five tiles");
  const markup = html`<div data-component="stat-tiles" class="kpi-grid">${items.map(({ value, label, note }) =>
    html`<div class="kpi-tile"><div class="kpi-value">${required("stats", "value", value)}</div><div class="kpi-label">${required("stats", "label", label)}</div>${note != null ? html`<div class="kpi-note">${note}</div>` : ""}</div>`)}</div>`;
  return withSource(markup.__html, "stat-tiles", source, "stats");
}

function table({ columns, rows, stacked = false, labelFirst = false }) {
  list("table", "columns", columns);
  list("table", "rows", rows);
  const cols = columns.map((column) => (typeof column === "object" && !(column instanceof SafeHtml) ? column : { label: column }));
  const labelText = (column) => (column.label instanceof SafeHtml ? column.label.__html.replace(/<[^>]+>/g, "") : String(column.label));
  const cell = (row, index) => (Array.isArray(row) ? row[index] : row[cols[index].key ?? labelText(cols[index])]);
  const cellClass = (column, index) => [index === 0 && labelFirst ? "cell-label" : "", column.numeric ? "col-num" : ""].filter(Boolean).join(" ");
  const attrs = (column, index) => {
    const className = cellClass(column, index);
    return html`${className ? html` class="${className}"` : ""}${stacked ? html` data-label="${labelText(column)}"` : ""}`;
  };
  return html`<div data-component="data-table" class="${stacked ? "table-scroll table-stack" : "table-scroll"}"><table><thead><tr>${cols.map((column) =>
    html`<th${column.numeric ? html` class="col-num"` : ""}>${column.label}</th>`)}</tr></thead><tbody>${rows.map((row) =>
    html`<tr>${cols.map((column, index) => html`<td${attrs(column, index)}>${cell(row, index)}</td>`)}</tr>`)}</tbody></table></div>`;
}

function bars(data, { title, emphasis, sort, limit, source } = {}) {
  const spec = { title, data };
  if (emphasis != null) spec.emphasis = emphasis;
  if (sort != null) spec.sort = sort;
  if (limit != null) spec.limit = limit;
  return withSource(chart("bar", spec), "bar-chart", source, "bars");
}

function sparkline(data, { value, source } = {}) {
  return withSource(chart("sparkline", { data, value }), "sparkline", source, "sparkline");
}

// ---------- sequences and structure ----------

function steps(items) {
  list("steps", "items", items);
  return html`<ol data-component="process-steps" class="process-steps">${items.map(({ title, detail, current }, index) =>
    html`<li class="${current ? "process-step is-current" : "process-step"}"><span class="process-marker">${index + 1}</span><div class="process-title">${required("steps", "title", title)}</div>${detail != null ? html`<p class="process-detail">${detail}</p>` : ""}</li>`)}</ol>`;
}

function timeline(items) {
  list("timeline", "items", items);
  return html`<ol data-component="timeline" class="timeline">${items.map(({ title, date, detail, state }) => {
    if (state != null && !["current", "pending"].includes(state)) fail("timeline", "state must be current or pending");
    return html`<li class="${state ? `milestone is-${state}` : "milestone"}"><span class="milestone-marker" aria-hidden="true"></span><div class="milestone-body"><div class="milestone-head"><span class="milestone-title">${required("timeline", "title", title)}</span>${date != null ? html`<span class="milestone-date">${date}</span>` : ""}</div>${detail != null ? html`<p class="milestone-detail">${detail}</p>` : ""}</div></li>`;
  })}</ol>`;
}

function finding({ severity, title, evidence, consequence, action }) {
  if (!SEVERITIES.includes(severity)) fail("finding", "severity must be high, medium, or low");
  required("finding", "title", title);
  const label = severity[0].toUpperCase() + severity.slice(1);
  return tagged("finding", html`<li class="finding" data-severity="${severity}"><div class="finding-severity">${label}</div><div><h3>${title}</h3>${evidence != null ? html`<p><strong>Evidence.</strong> ${evidence}</p>` : ""}${consequence != null ? html`<p><strong>Consequence.</strong> ${consequence}</p>` : ""}${action != null ? html`<p class="finding-action"><strong>Action.</strong> ${action}</p>` : ""}</div></li>`);
}
for (const severity of SEVERITIES) finding[severity] = (fields) => finding({ ...fields, severity });

function findings(items) {
  list("findings", "items", items);
  const rendered = items.map((item) => (item instanceof SafeHtml ? item : finding(item)));
  if (rendered.some((item) => item.kind !== "finding")) fail("findings", "items must be finding() results or finding fields");
  return html`<ol data-component="finding-list" class="finding-list">${rendered}</ol>`;
}

function fileMap(items) {
  list("fileMap", "items", items);
  return html`<ul data-component="file-map" class="file-map">${items.map(({ path, lead, role }) =>
    html`<li class="file-map-item"><div class="file-path">${required("fileMap", "path", path)}</div><div class="file-role">${lead ? html`<strong>${lead}</strong> ` : ""}${role}</div></li>`)}</ul>`;
}

function comparison(options, { columns = options?.length } = {}) {
  list("comparison", "options", options);
  if (options.length < 2 || options.length > 4) fail("comparison", "use two to four options");
  if (columns !== options.length) fail("comparison", "option count must match columns");
  return html`<div data-component="comparison-grid" class="comparison-grid" data-columns="${options.length}">${options.map(({ title, body, bestFor, recommended }) =>
    html`<div class="${recommended ? "option-card recommended" : "option-card"}"><h3>${required("comparison", "title", title)}</h3><p>${recommended ? html`<span class="recommend-mark">Recommended.</span> ` : ""}${body}</p>${bestFor != null ? html`<div class="best-for">best for: ${bestFor}</div>` : ""}</div>`)}</div>`;
}

// ---------- code ----------

function code(source, { title } = {}) {
  required("code", "source", source);
  return html`<div data-component="code-panel" class="code-panel">${title ? html`<div class="code-head">${title}</div>` : ""}<pre><code>${source}</code></pre></div>`;
}

const DIFF_OPS = { "+": ["add", "+"], "-": ["del", "-"], " ": ["ctx", " "] };

function diff({ title, lines, note }) {
  list("diff", "lines", lines);
  const rendered = lines.map(([op, text, number]) => {
    const [className, gutter] = DIFF_OPS[op] ?? fail("diff", 'line op must be "+", "-", or " "');
    return html`<div class="diff-line ${className}">${number != null ? html`<span class="diff-line-number">${number}</span>` : ""}<span class="diff-gutter">${gutter}</span>${text}</div>`;
  });
  const head = title ? html`<div class="diff-head">${title}</div>` : "";
  const bodyMarkup = note
    ? html`<div class="diff-annotation"><pre class="diff-annotation-code">${rendered}</pre><p class="diff-note">${leadText(note)}</p></div>`
    : html`<pre>${rendered}</pre>`;
  return html`<div data-component="diff-block" class="diff-block">${head}${bodyMarkup}</div>`;
}

// ---------- figures ----------

function visual(helper, { src, svg: svgContent, viewBox, alt, label, eager }) {
  if (src) {
    required(helper, "alt", alt);
    return html`<img data-embed-src="${src}" alt="${alt}" decoding="async" loading="${eager ? "eager" : "lazy"}">`;
  }
  if (svgContent) {
    required(helper, "label", label);
    return html`<svg${viewBox ? html` viewBox="${viewBox}"` : ""} role="img" aria-label="${label}">${svgContent}</svg>`;
  }
  return fail(helper, "src (with alt) or svg (with label) is required");
}

function figure({ caption, contained = false, ...content }) {
  return html`<figure data-component="wide-figure" class="${contained ? "wide-figure is-contained" : "wide-figure"}">${visual("figure", content)}${caption != null ? html`<figcaption>${leadText(caption)}</figcaption>` : ""}</figure>`;
}

function gallery(items) {
  list("gallery", "items", items);
  if (items.length > 4) fail("gallery", "use two to four items");
  return html`<div data-component="evidence-gallery" class="evidence-gallery">${items.map(({ featured, caption, ...content }) =>
    html`<figure class="${featured ? "evidence-item is-featured" : "evidence-item"}">${visual("gallery", content)}${caption != null ? html`<figcaption>${leadText(caption)}</figcaption>` : ""}</figure>`)}</div>`;
}

function flowDiagram({ viewBox, content, caption, notes, minWidth, emphasis = [] }) {
  required("flowDiagram", "viewBox", viewBox);
  required("flowDiagram", "content", content);
  if ((Array.isArray(emphasis) ? emphasis.length : 1) > 2) fail("flowDiagram", "at most two nodes may be emphasized");
  if (caption == null && notes == null) fail("flowDiagram", "caption or notes is required as the accessible description");
  const style = minWidth ? html` style="min-width:${minWidth}px"` : "";
  const description = notes
    ? html`<ol class="flow-notes">${list("flowDiagram", "notes", notes).map((note) => html`<li>${note}</li>`)}</ol>`
    : html`<p class="flow-caption">${caption}</p>`;
  return html`<div data-component="flow-diagram" class="flow-diagram-wrap"><svg class="flow-diagram" viewBox="${viewBox}"${style} aria-hidden="true">${content}</svg></div>${description}`;
}

const MOCKUP_SKELETON = html`<div class="mockup-toolbar" aria-hidden="true"><span></span><span></span><span></span></div><div class="mockup-layout" aria-hidden="true"><div class="mockup-nav"><div class="mockup-line is-accent"></div><div class="mockup-line"></div><div class="mockup-line"></div><div class="mockup-line"></div></div><div class="mockup-main"><div class="mockup-line is-strong"></div><div class="mockup-line"></div><div class="mockup-line is-short"></div><div class="mockup-block"></div></div></div>`;

function mockup({ label, caption, content }) {
  required("mockup", "label", label);
  required("mockup", "caption", caption);
  return html`<figure data-component="mockup-frame" class="mockup-frame"><div class="mockup-surface" role="img" aria-label="${label}">${content ?? MOCKUP_SKELETON}</div><figcaption>${leadText(caption)}</figcaption></figure>`;
}

export const helpers = Object.freeze({
  html, svg, raw,
  page, section, readingColumn,
  callout, calloutStack, recommendation, quote, disclosure,
  stats, table, bars, sparkline,
  steps, timeline, finding, findings, fileMap, comparison,
  code, diff,
  figure, gallery, flowDiagram, mockup,
});

export const meta = Object.freeze({
  page: { component: "page-shell", summary: "The page: title, context line, dek, footer, layout, and body. Returns a PageSpec for build.mjs.", params: "page({ title, context?, dek?, footer?, layout?: 'article'|'wide'|'canvas', toc?: 'auto'|true|false, behavior?: boolean }, children)", example: `page({ title: "Release status", context: "dots / release" }, [section("state", "Current state", ["One candidate passed verification."])])` },
  section: { component: "page-shell", summary: "A top-level section with a stable id and an h2. Strings become paragraphs.", params: "section(id, title, children)", example: `section("state", "Current state", ["One candidate passed verification."])` },
  readingColumn: { component: "page-shell", summary: "Keeps prose at article width inside a wide or canvas page.", params: "readingColumn(children)", example: `readingColumn([section("frame", "The decision", ["Choose one release boundary."])])` },
  callout: { component: "callout", summary: "A fact the reader must not scroll past. callout.note, callout.warn, callout.danger.", params: "callout.note(lead, body) | callout.warn(lead, body) | callout.danger(lead, body)", example: `calloutStack([callout.note("Note.", "Old configs keep working through v3."), callout.warn("Alpha spec.", "The schema may change."), callout.danger("Blocked.", "Staging credentials expired.")])` },
  calloutStack: { component: "callout", summary: "Stacks several callouts with consistent spacing.", params: "calloutStack(callouts)", example: `calloutStack([callout.note("Note.", "One."), callout.warn("Caution.", "Two.")])` },
  recommendation: { component: "recommendation", summary: "The one committing conclusion, near the end.", params: "recommendation(lead, ...paragraphs)", example: `recommendation("Ship the migration in Q3.", "The vendor shuts the legacy endpoint in September.", "Freeze unrelated auth changes around cutover.")` },
  quote: { component: "pull-quote", summary: "One thesis line worth isolating.", params: "quote(text, attribution?)", example: `quote("The migration is safe because callers observe nothing until v3.", "Migration plan")` },
  disclosure: { component: "disclosure", summary: "Progressive detail: sources, raw data, appendix.", params: "disclosure(summary, children, { plain? })", example: `[disclosure("Raw latency samples", ["p50 88ms, p99 640ms."]), disclosure("Sources", ["Incident report."], { plain: true })]` },
  stats: { component: "stat-tiles", summary: "Two to five supplied headline measures.", params: "stats([{ value, label, note? }], { source? })", example: `stats([{ value: "14", label: "PRs merged", note: "+3 vs last week" }, { value: "6", label: "deploys" }], { source: "GitHub, week 38" })` },
  table: { component: "data-table", summary: "Rows compared line by line. Columns may be labels or { label, key?, numeric? }; rows arrays or objects.", params: "table({ columns, rows, stacked?, labelFirst? })", example: `table({ columns: ["Risk", "Owner", { label: "Exposure", numeric: true }], rows: [["Vendor SSO", "Priya", "$180k"]], stacked: true, labelFirst: true })` },
  bars: { component: "bar-chart", summary: "Ranked magnitudes with one emphasized row (via chart.mjs).", params: "bars(rows, { title, emphasis?, sort?, limit?, source? })", example: `bars([["checkout", 412], ["search", 255], ["auth", 104]], { title: "p95 latency, ms", emphasis: "checkout", source: "APM, last 7 days" })` },
  sparkline: { component: "sparkline", summary: "An inline trend with visible value text.", params: "sparkline(numbers, { value, source })", example: `sparkline([96, 120, 180, 260, 312], { value: "312/wk", source: "APM, last 7 days" })` },
  steps: { component: "process-steps", summary: "A linear sequence of two to six stages.", params: "steps([{ title, detail?, current? }])", example: `steps([{ title: "Collect evidence", detail: "Record current behavior." }, { title: "Verify", detail: "Run focused checks.", current: true }])` },
  timeline: { component: "timeline", summary: "Milestones in order; order must carry information.", params: "timeline([{ title, date?, detail?, state?: 'current'|'pending' }])", example: `timeline([{ title: "Detected", date: "14:02", detail: "Alert fired." }, { title: "Rollback", date: "14:24", state: "current" }, { title: "Postmortem", date: "pending", state: "pending" }])` },
  finding: { component: "finding-list", summary: "One evidence-backed finding: finding.high, finding.medium, finding.low. Place inside findings().", params: "finding.high({ title, evidence?, consequence?, action? })", example: `findings([finding.high({ title: "Candidates differ", evidence: "The upload rebuilds.", consequence: "A pass proves nothing shipped.", action: "Upload the verified path." })])` },
  findings: { component: "finding-list", summary: "The list that holds finding() items or finding field objects.", params: "findings([finding.high({...}) | { severity, title, ... }])", example: `findings([finding.medium({ title: "Receipt omits the stage", action: "Record the stage name." }), { severity: "low", title: "Log noise", action: "Drop debug lines." }])` },
  fileMap: { component: "file-map", summary: "The few files responsible for a behavior.", params: "fileMap([{ path, lead?, role }])", example: `fileMap([{ path: "src/release/candidate.ts", lead: "Owns candidate identity.", role: "Creates the immutable reference." }])` },
  comparison: { component: "comparison-grid", summary: "Two to four options side by side.", params: "comparison([{ title, body, bestFor?, recommended? }])", example: `comparison([{ title: "Managed queue", body: "Hosted broker.", bestFor: "small teams" }, { title: "Worker pool", body: "Our retry logic.", bestFor: "this migration", recommended: true }])` },
  code: { component: "code-panel", summary: "Multi-line code on a dark surface. Pass html\`\` for highlighted spans.", params: "code(source, { title? })", example: `code(html\`<span class="tok-k">export</span> const retries = <span class="tok-n">5</span>;\`, { title: "retry.config.ts" })` },
  diff: { component: "diff-block", summary: "Before/after lines; a note switches to the annotated layout.", params: "diff({ title?, lines: [[op, text, lineNumber?]], note? })", example: `[diff({ title: "retry.config.ts", lines: [["-", "  maxAttempts: 3,"], ["+", "  maxAttempts: 5,"], [" ", "};"]] }), diff({ title: "gate.ts", lines: [["-", "publish(build);", 42], ["+", "publish(candidate);", 42]], note: { lead: "Ownership moves.", text: "Publication consumes the verified candidate." } })]` },
  figure: { component: "wide-figure", summary: "One screenshot, image, or SVG wider than the column.", params: "figure({ src + alt | svg + label + viewBox?, caption?, contained?, eager? })", example: `figure({ svg: svg\`<rect width="1040" height="360" fill="var(--a4)" />\`, viewBox: "0 0 1040 360", label: "Wide comparison", caption: "The focal view stays readable." })` },
  gallery: { component: "evidence-gallery", summary: "Two to four screenshots with point-specific captions.", params: "gallery([{ src + alt | svg + label + viewBox?, caption?, featured? }])", example: `gallery([{ svg: svg\`<rect width="960" height="540" fill="var(--a4)" />\`, viewBox: "0 0 960 540", label: "Desktop report", caption: { lead: "Desktop.", text: "Evidence shares the first frame." }, featured: true }, { svg: svg\`<rect width="640" height="360" fill="var(--a4)" />\`, viewBox: "0 0 640 360", label: "Mobile report", caption: { lead: "Mobile.", text: "Status follows the title." } }])` },
  flowDiagram: { component: "flow-diagram", summary: "A hand-authored branching SVG with its text description.", params: "flowDiagram({ viewBox, content: svg\`\`, caption | notes, minWidth? })", example: `flowDiagram({ viewBox: "0 0 640 260", content: svg\`<rect class="flow-node-rect" x="12" y="110" width="112" height="44" rx="8" />\`, caption: "A commit triggers a build." })` },
  mockup: { component: "mockup-frame", summary: "A labeled static concept view; never observed UI.", params: "mockup({ label, caption, content? })", example: `mockup({ label: "Concept layout with navigation", caption: { lead: "Concept — not observed UI.", text: "The action and its evidence share one path." } })` },
});
