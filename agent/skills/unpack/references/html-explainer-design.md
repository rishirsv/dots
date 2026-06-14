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
5. Open the rendered file and run the `../DESIGN.md` verification rubric.

The kit classes already carry the visual language — write semantic HTML with
these classes; do not add one-off CSS unless a module genuinely needs it. Unused
CSS in the kit is harmless; unused HTML sections are not.

## Charts — declarative, no coordinates

Add a `<figure class="chart">` with data attributes; the helper renders it on
load (animated, axis labels, gridlines, theme colors). You never compute SVG
coordinates.

```html
<!-- bar: peak bar highlighted clay, others oat -->
<figure class="chart" data-chart="bar"
  data-values="120,140,90,260,150,110,95"
  data-labels="11h,12h,13h,14h,15h,16h,17h"
  data-peak="3" data-caption="Keys per hour. Peak = post-deploy retry storm."></figure>

<!-- line: clay series + optional sky dashed comparison series -->
<figure class="chart" data-chart="line"
  data-values="42,55,48,70,66,90,120"
  data-series2="40,44,46,52,55,60,64"
  data-labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
  data-caption="p95 latency (clay) vs target (sky dashed)."></figure>
```

`data-peak` (bar) defaults to the max value's index. `data-max` overrides the
axis ceiling. `data-series2` (line) draws a second dashed comparison line. Use a
chart only for real quantitative data; for relationships use a diagram.

## Flow / architecture diagram

Inline SVG inside `.diagram`. Boxes use `.box` (`.box.hot` = the focus node,
`.box.dark` = a store/terminal with light text). Edges use `.edge` (`.alt`
dashed clay, `.good` olive, `.bad` dashed rust). Two arrowhead markers cover most
needs; add olive/rust markers when you use those edges.

```html
<div class="diagram">
  <svg viewBox="0 0 720 220" role="img" aria-label="Request flow">
    <defs>
      <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#87867F"/></marker>
      <marker id="ac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#D97757"/></marker>
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
  <p class="caption">Solid = request path. Dashed clay = retry reuse.</p>
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
`.cm`/`.dim` comment, `.hl` clay emphasis. Escape `<` `>` `&` inside `.code`.

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
<!-- evidence rows: source chip + annotation + status -->
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

Status values: `confirmed` (olive), `inferred`/`assumption` (oat/clay). Pills:
`.pill.sev`, `.pill.ok`, `.pill.neutral`. Severity badges: `.badge.high/.med/.low`.

## Layout, nav, carry-forward

```html
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

## Optional interactions (add inline JS)

The base kit handles tabs, accordion (`[data-accordion]` closes siblings), copy,
charts, and reveal. For these archetype-specific interactions, add a small
`<script>` and matching markup:

- **Click-to-reveal diagram node** — give each `<g class="node" data-k="x">` a
  key, keep a `DETAIL` object, and write its fields into a sticky side panel on
  click; toggle an `.active` class for the clay outline.
- **Live control** — a `<input type="range">` or button whose handler recomputes
  a readout or redraws an SVG, when manipulating it *is* the explanation. Use a
  deterministic hash for stable layout. Add `transition` on the SVG attributes so
  nodes glide.
- **Glossary hover-link** — dotted `.term` spans (`border-bottom:1.5px dotted`)
  whose `mouseenter` highlights the matching `<dt>` in a sticky aside.

Keep every interaction deletable without breaking the explanation, no
dependencies, no network calls.

## Before delivery

- Replaced all sample content; no placeholders or empty modules.
- First viewport answers the question and shows provenance.
- Charts/diagrams render; no console errors.
- Desktop and mobile: readable, no horizontal page scroll (only diagrams/code
  scroll inside their box).
- Re-read the anti-slop list in `../DESIGN.md`: no gradients, glassmorphism,
  side-tab borders, icon tiles, or hype copy.
