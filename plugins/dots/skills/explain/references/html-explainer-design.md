# HTML Explainer Build Guide

How to assemble an explainer from the design system. `../DESIGN.md` owns the
look, motion, and anti-slop rules; this file is the component catalog and the
build workflow. Read both before writing an artifact.

## Workflow

1. Pick the archetype from the table in `../DESIGN.md` based on the material.
2. Start from [../assets/html-explainer-template.html](../assets/html-explainer-template.html).
   Keep the `<style>` and `<script>` kits **verbatim** — they are the design
   system and the helpers (charts, tabs, copy, reveal). Replace the `<main>`.
3. Always write the masthead (answer-as-title + provenance). Then add only the
   modules the archetype needs, composed from the catalog below.
4. Delete the sample sections and every word of sample content. No leftover
   placeholder text, no unused empty modules.
5. Open the rendered file in a browser and run the `../DESIGN.md` verification
   rubric at desktop and mobile widths. Prefer Codex Browser when available.

The kit classes already carry the visual language — write semantic HTML with
these classes; do not add one-off CSS unless a module genuinely needs it. Unused
CSS in the kit is harmless; unused HTML sections are not.

## Charts — declarative, no coordinates

Add a `<figure class="chart">` with data attributes; the helper renders it on
load (animated, axis labels, gridlines, theme colors). You never compute SVG
coordinates.

```html
<!-- bar: peak bar highlighted green, others neutral -->
<figure class="chart" data-chart="bar"
  data-values="120,140,90,260,150,110,95"
  data-labels="11h,12h,13h,14h,15h,16h,17h"
  data-peak="3" data-caption="Keys per hour. Peak = post-deploy retry storm."></figure>

<!-- line: green series + optional blue dashed comparison series -->
<figure class="chart" data-chart="line"
  data-values="42,55,48,70,66,90,120"
  data-series2="40,44,46,52,55,60,64"
  data-labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
  data-caption="p95 latency (green) vs target (blue dashed)."></figure>
```

`data-peak` (bar) defaults to the max value's index. `data-max` overrides the
axis ceiling. `data-series2` (line) draws a second dashed comparison line. Use a
chart only for real quantitative data; for relationships use a diagram.

Make a chart narrate, not just plot. Two optional attributes work on bar and line:

- `data-threshold="100"` draws a dashed rust reference line (SLA, budget, limit);
  `data-threshold-label="SLA ceiling"` labels it. The axis grows to include it.
- `data-annotate="4:deploy"` marks point/bar index 4 with a thin green guide and a
  label. Separate multiple with `;` — `data-annotate="3:retry storm;6:rollback"`.

## Flow / architecture diagram

Inline SVG inside `.diagram`. Boxes use `.box` (`.box.hot` = the focus node,
`.box.dark` = a store/terminal with light text). Edges use `.edge` (`.alt`
dashed green, `.good` green, `.bad` dashed rust). Two arrowhead markers cover most
needs; add olive/rust markers when you use those edges.

```html
<div class="diagram">
  <svg viewBox="0 0 720 220" role="img" aria-label="Request flow">
    <defs>
      <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#87867F"/></marker>
      <marker id="ac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#0F8F6A"/></marker>
    </defs>
    <rect class="box" x="20" y="84" width="150" height="52" rx="10"/>
    <text x="95" y="108" text-anchor="middle" font-size="12" font-weight="600">Client</text>
    <text class="sub" x="95" y="124" text-anchor="middle" font-size="10">retries on timeout</text>
    <rect class="box hot" x="250" y="84" width="170" height="52" rx="10"/>
    <text x="335" y="108" text-anchor="middle" font-size="12" font-weight="600">handler</text>
    <rect class="box dark" x="500" y="84" width="190" height="52" rx="10"/>
    <text class="on-dark" x="595" y="108" text-anchor="middle" font-size="12" font-weight="600">store</text>
    <path class="edge" d="M170 110 L250 110" marker-end="url(#a)"/>
    <path class="edge alt" d="M420 110 L500 110" marker-end="url(#ac)"/>
  </svg>
  <p class="caption">Solid = request path. Dashed green = retry reuse.</p>
</div>
```

Decision diamond: `<path class="box" d="M cx,cy-32 L cx+42,cy L cx,cy+32 L cx-42,cy Z"/>`.
Keep diagram text mono and labels short. If labels would shrink below legibility
on mobile, give the `<svg>` a `min-width` so `.diagram`'s `overflow-x:auto`
scrolls it instead of squashing.

## Code, diff, tabs

```html
<!-- code card: language label + copy button + dark block with span highlighting -->
<div class="codecard">
  <div class="bar"><span class="name">routes/charge.ts</span><button class="copy" data-copy="#snip">Copy</button></div>
  <pre class="code" id="snip"><span class="cm">// reuse stored response</span>
<span class="kw">const</span> prior = <span class="fn">findKey</span>(key);
<span class="kw">if</span> (prior) <span class="kw">return</span> prior.response;   <span class="hl">// short-circuit</span></pre>
</div>
```

Highlight spans: `.kw` keyword, `.str` string, `.fn` function, `.num` number,
`.cm`/`.dim` comment, `.hl` green emphasis. Escape `<` `>` `&` inside `.code`.

```html
<!-- diff: line# / mark / code columns; row state tints the background -->
<div class="diff">
  <div class="row hunk"><span class="ln"></span><span class="mk"></span><span class="cd">@@ -42,7 +42,9 @@</span></div>
  <div class="row ctx"><span class="ln">42</span><span class="mk"> </span><span class="cd">  const { data } = useTasks(id);</span></div>
  <div class="row del"><span class="ln">43</span><span class="mk">-</span><span class="cd">  const [p,setP]=useState(null);</span></div>
  <div class="row add"><span class="ln">43</span><span class="mk">+</span><span class="cd">  const { mutate }=useOptimistic(id);</span></div>
</div>

<!-- tabs: alternate views of the same thing -->
<div class="tabs">
  <div class="tabbar"><button class="on">limits.yaml</button><button>route.ts</button></div>
  <div class="pane on"><pre class="code">rate: 20/min</pre></div>
  <div class="pane"><pre class="code">lookup(bucket)</pre></div>
</div>
```

## Sequence & structure modules

```html
<!-- event timeline: dot color = severity -->
<div class="timeline">
  <div class="tl"><span class="d"></span><span class="t">14:02</span><div class="b">Config promoted.</div></div>
  <div class="tl"><span class="d focus"></span><span class="t">14:06</span><div class="b"><strong>Impact starts.</strong> 502s appear.</div></div>
  <div class="tl"><span class="d good"></span><span class="t">14:44</span><div class="b"><strong>Mitigated.</strong></div></div>
</div>

<!-- milestone plan: .pt.done = complete, .pt = pending -->
<div class="milestone"><div class="when">Wk 1</div><div class="col"><span class="pt done"></span><span class="ln"></span></div>
  <div class="body"><h3>Schema</h3><p>New tables.</p><div class="tags"><span class="tag">packages/db</span></div></div></div>
<div class="milestone"><div class="when">Wk 2</div><div class="col"><span class="pt"></span><span class="ln"></span></div>
  <div class="body"><h3>Rollout</h3><p>Flag on for 5%.</p></div></div>

<!-- numbered walkthrough: .step.hot = the key step -->
<div class="step hot"><div class="num">2</div><div>
  <div class="loc">middleware/auth.ts<span class="rng"> :14-31</span></div>
  <p>The trust boundary — verify the signed cookie here.</p></div></div>
```

## Evidence, callouts, table

```html
<!-- evidence rows: source label + annotation + plain status -->
<div class="ev">
  <div class="row"><span class="src">db/keys.sql:3</span><p class="ann">Unique index makes duplicate insert fail fast.</p><span class="status confirmed">confirmed</span></div>
  <div class="row"><span class="src">charge.ts:41</span><p class="ann">Two concurrent first-calls can both miss the lookup.</p><span class="status assumption">inference</span></div>
</div>

<!-- callouts: tinted surface + marker. variants: good / warn / bad / soft -->
<div class="callout warn"><span class="ico">!</span><p>Watch this edge case.</p></div>

<!-- comparison table: td.good / td.bad / td.mono -->
<table>
  <thead><tr><th>Aspect</th><th>mod N</th><th>consistent hash</th></tr></thead>
  <tbody><tr><td>Keys moved</td><td class="bad">~all</td><td class="good">~1/N</td></tr></tbody>
</table>
```

Status values: `confirmed`, `inferred`, `assumption`, and `gap` render as plain
mono labels, not chips. Use `.status.gap` for source that was not inspected or
an open question that must not be presented as fact. Avoid pills and badges for
metadata, section labels, evidence state, or navigation.

## Investigative primitives

Use these for issue traces, change pressure, ownership maps, failure paths, and
concept-to-code bridges. They are semantic structures, not decoration. Prefer
them only when they make causality, ownership, evidence, or uncertainty easier
to read.

```html
<!-- cause ladder: symptom -> trigger -> mechanism -> boundary -> implication -->
<div class="cause-ladder">
  <div class="cause-hop"><span class="k">Symptom</span><p>Settings save appears to work.</p></div>
  <div class="cause-hop"><span class="k">Trigger</span><p>The optimistic path updates local state.</p></div>
  <div class="cause-hop hot"><span class="k">Cause boundary</span><p>The service write is skipped when the account id is missing.</p></div>
  <div class="cause-hop gap"><span class="k">Gap</span><p>Retry behavior was not inspected.</p></div>
</div>

<!-- claim board: keep facts, inferences, and gaps visibly separate as rows -->
<div class="claim-board">
  <div class="claim confirmed"><span class="status confirmed">confirmed</span><p>View model owns the submit action.</p><span class="src">SettingsViewModel.swift:42</span></div>
  <div class="claim inferred"><span class="status inferred">inferred</span><p>Service likely owns persistence policy.</p><span class="src">SettingsService.swift</span></div>
  <div class="claim gap"><span class="status gap">gap</span><p>No retry tests were inspected.</p></div>
</div>

<!-- source stack: what was read and why it mattered -->
<div class="source-stack">
  <div><span class="src">SettingsView.swift</span><p>Entry point for the failing interaction.</p></div>
  <div><span class="src">SettingsService.swift</span><p>Persistence boundary and error handling.</p></div>
</div>

<!-- pressure ledger: table + static meter, not a chart -->
<div class="table-scroll">
  <table class="pressure" data-sort>
    <thead><tr><th>Force</th><th>Evidence</th><th data-sort="num">Pressure</th></tr></thead>
    <tbody><tr><td>Call-site spread</td><td class="mono">8 files</td><td><span class="meter bad" role="img" aria-label="high pressure"><i style="width:82%"></i></span> high</td></tr></tbody>
  </table>
</div>
```

For SVG diagrams, use `.box.cause` for the single cause boundary and `.lane`
with `.lane-label` for ownership bands:

```html
<rect class="lane" x="16" y="20" width="320" height="160" rx="12"/>
<text class="lane-label" x="30" y="44">Runtime owner</text>
<rect class="box cause" x="72" y="82" width="180" height="56" rx="10"/>
<text x="162" y="114" text-anchor="middle" font-size="12" font-weight="600">missing account id</text>
```

Compose higher-level patterns from these primitives:

- Issue Trace: cause ladder, `.box.cause`, code card, evidence rows.
- Change Pressure: pressure ledger, current/proposed tabs, source stack.
- Ownership Map: lanes, detail panel, ownership evidence rows.
- Failure Path: stepper diagram with `.edge.bad`, `.box.cause`, claim board.
- Concept-To-Code Bridge: mapping table, glossary, source stack, code card.

Do not use a meter without a number or label, a lane without a real owner, a
claim board without source labels, or a cause ladder that merely restates prose.

## Workbench, Inspector, Mobile Trace

For investigative explainers, prefer a workbench pairing: the dominant visual on
the left, evidence inspector on the right. The inspector is one tool panel; do
not put cards inside it. Detail content inside the inspector uses rules and
spacing, not nested rounded boxes.

```html
<div class="workbench">
  <div class="diagram">
    <svg data-mobile-list viewBox="0 0 720 220" role="img" aria-label="Failure path">…</svg>
    <ol class="trace-list" aria-label="Mobile trace summary">
      <li><span>Sensor</span><b>Bad frame</b><p>The reading enters the system.</p></li>
      <li class="cause"><span>Boundary</span><b>Late veto</b><p>The guard runs after ranking.</p></li>
    </ol>
    <p class="caption">Desktop gets the spatial diagram. Mobile gets the trace list.</p>
  </div>
  <aside class="inspector">
    <h3>Evidence inspector</h3>
    <aside class="detail-panel"><h4>Late veto</h4><p>Why this is the cause boundary.</p><span class="status inferred">inferred</span></aside>
    <div class="inspector-list">
      <div class="inspector-item"><b>Current read</b><span>Ordering issue, not noise alone.</span><span class="source-chip">trace-flow</span></div>
    </div>
  </aside>
</div>
```

Use `<svg data-mobile-list>` when the diagram would require horizontal panning
on phones; the kit hides that SVG under 640px and shows `.trace-list` instead.
Keep the mobile list shorter than the diagram and preserve the same causal
order. Do not provide a mobile list that says something different from the
desktop visual.

## Layout, nav, carry-forward

```html
<!-- quiet app chrome: optional but preferred for standalone workbench explainers -->
<div class="appbar"><div class="appbar-inner">
  <div class="appmark"><i></i><span>Explain workbench</span></div>
  <div class="app-actions"><a class="ghost-btn" href="#evidence">Evidence</a><button class="solid-btn copy" data-copy=".carry p">Copy next move</button></div>
</div></div>

<!-- two-column with a sticky in-page nav (use .layout.left to put nav first) -->
<div class="layout">
  <div><!-- main content --></div>
  <aside class="side"><p class="label">On this page</p>
    <nav><a href="#path">The path</a><a href="#proof" class="sub">Evidence</a></nav></aside>
</div>

<!-- carry forward: the one thing to do next, copyable -->
<div class="carry"><p><strong>Carry forward:</strong> add a row lock so concurrent first-calls can't both reach the provider.</p>
  <button class="copy" data-copy=".carry p">Copy</button></div>
```

Wrap a section in `class="reveal"` to give it the gentle fade-in entrance.

## Interaction primitives (markup only — the kit wires them)

The kit's `<script>` auto-wires every primitive below from `data-*` attributes on
load, exactly like the chart helper. You write semantic markup; you never write
JS. Each one degrades to readable content with JS off, is keyboard-operable, and
honors `prefers-reduced-motion`. Reach for one only when it removes reading
effort — an interaction that just decorates is slop.

**Step-through player** — walk a flow one hop at a time. Put `data-stepper` on a
`.diagram`; give each node a `data-step="N"` and a `data-note` (HTML allowed). The
kit injects Prev/Next + a counter, dims the off-step nodes, and outlines the
active one. Notes render into an optional `<div class="step-note" data-step-note></div>`
(else into the control bar). Arrow keys step when the diagram is focused.

```html
<div class="diagram" id="flow" data-stepper>
  <svg …>
    <g data-step="1" data-note="<strong>Request arrives.</strong> Reads the API key.">…</g>
    <g data-step="2" data-note="Looks up the bucket.">…</g>
  </svg>
  <div class="step-note" data-step-note></div>
</div>
```

**Click-to-reveal node detail** — click a node to load depth into a panel that
sits *outside* the diagram (so it escapes the diagram's `overflow-x:auto`). Nodes
carry `data-detail="key"`; detail bodies live in `<template data-detail="key">`;
the `<aside class="detail-panel" data-detail-panel>` shows the first by default.

```html
<div class="diagram"><svg …><g data-detail="store">…</g></svg></div>
<aside class="detail-panel" data-detail-panel data-empty="Pick a component."></aside>
<template data-detail="store"><h4>token store</h4><p>Redis hash keyed by API key.</p></template>
```

**Scroll-spy nav** — add `data-scrollspy` to a `.side` nav; the link whose section
is in view gets the active marker. Links stay plain anchors without JS.

```html
<nav data-scrollspy><a href="#flow">The path</a><a href="#proof" class="sub">Evidence</a></nav>
```

**Reading-level toggle** — one control that flips the page between brief and
detailed, making the knowledge dial something the reader holds. Drop an empty
`<span data-level-toggle></span>` for the injected Brief/Detailed switch; mark
extra depth with `data-level="detail"` (hidden until Detailed; visible with JS off).

```html
<span data-level-toggle></span>
<p>The bucket refills at a fixed rate.</p>
<p data-level="detail">Refill is lazy: each request adds elapsed×rate, capped at burst.</p>
```

**Glossary** — dotted `.term[data-term="key"]` spans show their definition on
hover/focus and light the matching row in `<dl data-glossary>` (pairs wrapped in
`<div><dt data-term="key">…</dt><dd>…</dd></div>`). The `<dl>` reads fine alone.

```html
A <span class="term" data-term="token-bucket">token bucket</span> refills steadily.
<dl data-glossary><div><dt data-term="token-bucket">Token bucket</dt><dd>A refilling counter.</dd></div></dl>
```

**Tooltip** — `data-tip="…"` on any element. The kit renders one floating node on
`<body>`, so it is never clipped by an overflow container; shows on hover and
keyboard focus, hides on Escape.

```html
<span class="src" data-tip="Returned when the bucket is empty.">HTTP 429</span>
```

**Live control** — a slider whose readout *is* the explanation. `data-control` on
an `<input type="range">`; `data-bind="#out"` writes a formatted value to an
`<output>`; `data-template="{v} tokens"` (or `data-unit`) formats it; `data-bar="#fill"`
drives a `.barwrap > i` fill. Optional `data-scale` / `data-round="int"`. No `eval`.

```html
<div class="control">
  <label for="b">Burst</label>
  <input id="b" type="range" min="1" max="200" value="60" data-control data-bind="#bo" data-bar="#bf" data-template="{v} tokens">
  <output id="bo"></output>
  <div class="barwrap"><i id="bf"></i></div>
</div>
```

**Collapsible diff context** — `data-collapse-context="2"` on a `.diff` folds runs
of unchanged `.ctx` rows longer than the number behind a clickable "⋯ N unchanged
lines" bar. Without JS the full diff shows.

**Filter / sort table** — `data-filter` adds a search box that hides non-matching
rows with a live count; `data-sort` makes headers click-to-sort. Mark numeric
columns `data-sort="num"` and opt a column out with `data-sort="none"`.

```html
<table data-filter="Filter tiers…" data-sort>
  <thead><tr><th>Tier</th><th data-sort="num">Burst</th><th data-sort="none">Notes</th></tr></thead>
  <tbody><tr><td class="mono">free</td><td>20</td><td>per key</td></tr></tbody>
</table>
```

The base kit also wires tabs, accordion (`[data-accordion]` closes siblings),
copy buttons, charts, and reveal-on-scroll. Every primitive is deletable without
breaking the explanation; none use dependencies or network calls.

## Before delivery

- Replaced all sample content; no placeholders or empty modules.
- First viewport answers the question and shows provenance.
- Charts/diagrams render; no console errors.
- Every primitive used actually fires: step the stepper, toggle the level, sort
  and filter the table, expand the diff, hover a term. A tooltip or detail panel
  near a diagram must not be clipped by its scroll box.
- Desktop and mobile: readable, no horizontal page scroll (only diagrams, code,
  and table wrappers scroll inside their own box).
- Browser geometry checks pass: page `scrollWidth` fits the viewport, visible
  content does not bleed past the viewport edge, and any wider-than-screen SVG,
  table, code block, or comparison board scrolls only inside its own framed
  container.
- Screenshot inspection shows no duplicated side-by-side sections, offscreen
  option panels, clipped labels, overlapping annotations, or table columns
  escaping the article on desktop or mobile.
- Re-read the anti-slop list in `../DESIGN.md`: no gradients, glassmorphism,
  side-tab borders, icon tiles, or hype copy.
