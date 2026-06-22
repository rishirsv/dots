# Primitive Catalog

A registry of the reusable blocks an HTML artifact is assembled from. Compose
these instead of improvising one-off layouts. Each primitive is plain semantic
HTML plus a predictable anatomy of data attributes — no framework, no runtime.

Read [authoring.md](authoring.md) for semantic, runtime, and hygiene rules,
[../assets/theme.css](../assets/theme.css) for canonical primitive styling, and
[recipes.md](recipes.md) for recipe defaults and conditional choices. The
[../assets/primitive-atlas.html](../assets/primitive-atlas.html) file shows every
primitive below rendered with its anatomy visible.

## Primitive Chooser

Use this before scanning the full catalog. Pick primitives for the reader job,
then keep only the ones supported by the source material.

| Reader job | Prefer | Add when |
|---|---|---|
| Orient the reader | `hero-summary`, `meta-strip`, `section-nav` | Use `section-nav` only for four or more major sections. |
| Give the answer | `tldr`, `callout` | Use `callout` for one emphasized point only. |
| Compare choices/states | `comparison-grid`, `focused-compare`, `screenshot-gallery` | Use tables or ledgers when axes matter more than visuals. |
| Show evidence | `claim-evidence-matrix`, `audit-trail`, `evidence-limits` | Use the cards variant for fewer claims or narrow screens. |
| Review defects | `finding-card`, `diff-review`, `mismatch-ledger` | Use `mismatch-ledger` for many similar issues. |
| Plan work | `milestone-strip`, `dependency-map`, `risk-table`, `verification-matrix`, `acceptance-gate` | Add owners or handoff only when known. |
| Present visual QA | `qa-metadata`, `screenshot-gallery`, `screenshot-triptych`, `token-delta` | Use `screenshot-triptych` only when a revised mockup exists. |
| Enable reuse | `copy-export`, `handoff-packet`, `action-list` | Never make export the only readable path. |

## Primitive Anatomy Contract

Every primitive in this catalog follows the same contract:

- **Root element** — the outermost tag, chosen for meaning first.
- **Semantic base** — the native HTML the primitive is built on, so it still
  reads if CSS and JS fail.
- **`data-primitive`** — set on the root, naming the primitive (e.g.
  `risk-table`). Exactly one per block.
- **Required `data-slot` parts** — the named inner parts that must be present.
- **Optional `data-slot` parts** — parts included only when the content needs them.
- **`data-variant`** — documented visual or density variants, set on the root.
  Omit the attribute when the default is used.
- **`data-state`** — a meaningful UI or review state, set only when state changes
  the reader's job (e.g. a finding's severity, a milestone's status). Never for
  decoration.
- **Mobile/overflow rule** — how the primitive behaves at ~375px and what scrolls.
- **Common failure to avoid** — the mistake that most often degrades this block.

Slot names are CSS and inspection hooks, not reader text. Generated reader copy
must never display slot names, primitive names, variant labels, or "template"
chrome.

## Layout helpers (internal only)

`stack`, `cluster`, `grid`, `split`, `frame`, `side`, and `table-wrap` are
low-level CSS class helpers used *inside* primitives for vertical rhythm,
wrapping inline groups, responsive columns, two-column comparison, fixed-ratio
media, a slim side column, and scroll-contained tables. They are implementation
glue, not the user-facing system — never document or expose them to the reader
as primitives, and never give a layout helper a `data-primitive` value.

---

## artifact-shell

- **Purpose:** the self-contained page frame that holds the whole artifact and
  carries the recipe identity.
- **Use when:** always — it is the root of every artifact.
- **Avoid when:** never omit it; it is what makes the file a recognizable artifact.
- **Semantic base:** `body > main`.
- **Root attributes:** `data-artifact="<recipe>"` (e.g. `implementation-plan`)
  and `data-primitive="artifact-shell"` on the same shell element.
- **Required slots:** `header` (the hero region), `body` (the main content flow).
- **Optional slots:** `nav` (when a `section-nav` is present), `footer` (for
  `audit-trail` or provenance).
- **Supported variants:** `data-variant="side"` when the page has a sticky side
  navigation; default is a single centered column.
- **Supported states:** none.
- **Mobile/overflow rule:** centered column, `max-width` ~920–1180px, generous
  side padding; `overflow-x` must never appear at the page level.
- **Common failure:** wrapping the whole page in a decorative card or nesting
  the shell inside another card. The shell is the page, not a panel.

## hero-summary

- **Purpose:** first-viewport identity — what this is, the one-line read, and the
  primary conclusion or answer.
- **Use when:** every artifact, as the first thing in the shell `header`.
- **Avoid when:** never; the first viewport must state purpose and value.
- **Semantic base:** `header` containing an eyebrow, `h1`, and a lead paragraph
  or prompt box.
- **Root attributes:** `data-primitive="hero-summary"`.
- **Required slots:** `eyebrow` (artifact type / scope), `title` (`h1`),
  `summary` (the one-sentence read or primary conclusion).
- **Optional slots:** `prompt` (the originating request, in a bordered box),
  `meta` (an inline `meta-strip`).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** title wraps cleanly; cap measure at ~820px so the
  lead stays readable; nothing fixed-width.
- **Common failure:** a generic hero with a decorative gradient and no real
  conclusion. Lead with the answer, not chrome.

## meta-strip

- **Purpose:** compact scannable facts about the artifact — scope, source,
  status, date, owner, confidence, path.
- **Use when:** the reader needs provenance or key stats up front.
- **Avoid when:** there are no real meta facts; do not invent them to fill a row.
- **Semantic base:** `dl` of `dt`/`dd` pairs, or a small grid of labeled cells.
- **Root attributes:** `data-primitive="meta-strip"`.
- **Required slots:** `item` (repeated; each holds a `key` and a `value`).
- **Optional slots:** none.
- **Supported variants:** `data-variant="cells"` (bordered card cells, 4-up) or
  `data-variant="inline"` (a single wrapping `cluster` of key/value pairs).
- **Supported states:** none.
- **Mobile/overflow rule:** cell grid collapses 4→2→1 columns; inline variant
  wraps. Keys stay in the mono label style.
- **Common failure:** a value with no key, or fabricated metrics. Mark unknowns
  explicitly rather than guessing.

## section-nav

- **Purpose:** slim in-page jump navigation for long artifacts.
- **Use when:** the artifact has four or more major sections worth jumping between.
- **Avoid when:** short artifacts — side navigation on a two-section page is noise.
- **Semantic base:** `nav` with a list of hash `<a>` links to section ids.
- **Root attributes:** `data-primitive="section-nav"`.
- **Required slots:** `link` (repeated; each targets a section `id`).
- **Optional slots:** `group` (a labeled cluster of links, e.g. files consulted);
  in the `map` variant each `link` pairs a `tick` (the collapsed marker, decorative
  and `aria-hidden`) with a `label` (the text revealed on expand).
- **Supported variants:** `data-variant="map"` (the preferred index for long
  artifacts — an anchored index pinned to the right edge that shows collapsed tick
  marks and expands to labeled jump links on hover or keyboard focus, like a
  document message-map), `data-variant="side"` (sticky side column, pairs with the
  shell `side` variant), or `data-variant="bar"` (a horizontal strip near the top).
  Prefer `map` over `bar`: keep the index out of the first viewport and anchored to
  the side rather than stacked on top of the content.
- **Supported states:** `data-state="active"` on the current-section link when JS
  scroll-spy is used; optional but recommended for `map` so the active tick reads
  at a glance.
- **Mobile/overflow rule:** the `map` and `side` variants are hidden below ~960px
  and the shell collapses to one column; the index never overlays or squeezes the
  body on small screens, and never causes horizontal scroll. The expanded `map`
  panel is a hover/focus overlay only.
- **Common failure:** stacking a long table of contents on top of the first
  viewport, using a colored stripe as decoration, or keeping the index visible on
  mobile so it covers the body.

## callout

- **Purpose:** set one fact, inference, caveat, warning, or success apart from
  the main flow.
- **Use when:** a single point needs emphasis or a different reading mode.
- **Avoid when:** more than a sentence or two — promote longer content to its own
  section.
- **Semantic base:** `aside` (or `p`) with an icon/marker and body text.
- **Root attributes:** `data-primitive="callout"`.
- **Required slots:** `body` (the point being made).
- **Optional slots:** `marker` (a small icon or symbol), `label` (a short kind label).
- **Supported variants:** `data-variant` of `note` (default), `warning`,
  `success`, or `danger`.
- **Supported states:** none.
- **Mobile/overflow rule:** full-width block, icon and text stay aligned; wraps
  freely.
- **Common failure:** colored left bars or rainbow walls of callouts. Use sparingly
  and use text, marker, and border treatment rather than decorative stripes.

## tldr

- **Purpose:** the short answer or claim in plain language, before any detail.
- **Use when:** explainers, research reports, and any artifact whose reader wants
  the bottom line first.
- **Avoid when:** the hero summary already carries the full answer.
- **Semantic base:** a leading `p` or small `section` with a label and restrained
  full-border note treatment.
- **Root attributes:** `data-primitive="tldr"`.
- **Required slots:** `body` (the answer in one to three sentences).
- **Optional slots:** `label` (a small "TL;DR" tag).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** full-width, capped measure; wraps freely.
- **Common failure:** burying a real conclusion under hedging, or using a tinted
  stripe to make weak prose look important. State the claim, then qualify it.

## step-flow

- **Purpose:** an ordered flow — request path, lifecycle, or procedure — with
  inputs, operation, and output per step.
- **Use when:** order or data movement matters and a diagram would be heavier
  than needed.
- **Avoid when:** the items are unordered — use a list or `comparison-grid`.
- **Semantic base:** `ol` of `li` steps, or a vertical sequence of step blocks.
- **Root attributes:** `data-primitive="step-flow"`.
- **Required slots:** `step` (repeated; each holds a `step-title` and `step-body`).
- **Optional slots:** `index` (a step number/marker), `io` (inputs/outputs note),
  `connector` (the line/arrow between steps).
- **Supported variants:** `data-variant="numbered"` (default) or
  `data-variant="timeline"` (dotted connector line down the left).
- **Supported states:** none.
- **Mobile/overflow rule:** stacks vertically; connectors stay inside the column.
- **Common failure:** turning a simple ordered list into a heavy diagram. Use the
  lightest shape that shows the order.

## comparison-grid

- **Purpose:** lay alternatives, options, or before/after states side by side.
- **Use when:** the reader is choosing between options or contrasting two states.
- **Avoid when:** there is only one option, or the differences are a single axis
  — use a `risk-table` or prose.
- **Semantic base:** a `grid` of `article` cards, or a `split` of two columns.
- **Root attributes:** `data-primitive="comparison-grid"`.
- **Required slots:** `option` (repeated; each holds an `option-title` and `option-body`).
- **Optional slots:** `option-meta` (effort/tradeoff tags), `recommended` (a mark
  on the chosen option).
- **Supported variants:** `data-variant="cards"` (responsive card grid, default)
  or `data-variant="split"` (two-column before/after).
- **Supported states:** `data-state="recommended"` on the selected option, when one
  is chosen.
- **Mobile/overflow rule:** grid collapses to one column; split stacks; cards
  never shrink below readable width.
- **Common failure:** more than three or four side-by-side columns on desktop,
  which become unreadable. Cap the columns and let them wrap.

## risk-table

- **Purpose:** structured rows of risk / likelihood / impact / mitigation / owner,
  or any tradeoff matrix.
- **Use when:** plans and reviews need a scannable risk or tradeoff register.
- **Avoid when:** there is a single risk — state it in a `callout`.
- **Semantic base:** `table` with `thead`/`tbody`, wrapped in a `table-wrap`.
- **Root attributes:** `data-primitive="risk-table"`.
- **Required slots:** `head` (column labels), `row` (repeated; cells per column).
- **Optional slots:** `severity` (a severity badge inside a cell).
- **Supported variants:** none.
- **Supported states:** `data-state` of `high`, `med`, or `low` on a severity badge.
- **Mobile/overflow rule:** the table scrolls horizontally inside `table-wrap`, or
  collapses each row to a stacked card below ~780px — the page never scrolls.
- **Common failure:** a dense uncontained table that forces page-level horizontal
  scroll on mobile. Always wrap and choose a mobile strategy.

## milestone-strip

- **Purpose:** phases of a plan with goal, time, and status, on a timeline.
- **Use when:** an implementation plan or roadmap has ordered, dated slices.
- **Avoid when:** the work is not phased — use a `step-flow` or list.
- **Semantic base:** an ordered list of milestone rows with a connecting line.
- **Root attributes:** `data-primitive="milestone-strip"`.
- **Required slots:** `milestone` (repeated; each holds `when`, `marker`,
  `milestone-title`, `milestone-body`).
- **Optional slots:** `tags` (a cluster of file/scope tags per milestone).
- **Supported variants:** none.
- **Supported states:** `data-state` of `done`, `current`, or `upcoming` on a
  milestone marker (controls the dot fill).
- **Mobile/overflow rule:** the `when` column narrows or moves above the body;
  the timeline line stays inside the column.
- **Common failure:** a timeline with no status differentiation, so every
  milestone looks identical and progress is invisible.

## code-panel

- **Purpose:** a readable, labeled code block with its file/source identity.
- **Use when:** showing the key code a reader must read or write.
- **Avoid when:** a single inline token — use `<code>` inline instead.
- **Semantic base:** `figure` with a `figcaption` label wrapping `pre > code`.
- **Root attributes:** `data-primitive="code-panel"`.
- **Required slots:** `label` (file path or source), `code` (the `pre`/`code` body).
- **Optional slots:** `copy` (a `copy-export` button for the snippet).
- **Supported variants:** `data-variant="dark"` (slate surface, default) or
  `data-variant="light"` (paper surface for short snippets).
- **Supported states:** none.
- **Mobile/overflow rule:** `pre` keeps `white-space: pre` and scrolls
  horizontally inside the panel; the page never scrolls.
- **Common failure:** wrapping or reflowing code so indentation breaks. Contain
  it and let it scroll internally.

## code-note

- **Purpose:** an annotation attached to a code span or line that explains why,
  not just what.
- **Use when:** a specific line or token needs a margin/inline explanation.
- **Avoid when:** the explanation belongs in prose above the panel.
- **Semantic base:** a `<span>`/`<mark>` reference plus an annotation block, often
  inside or beside a `code-panel`.
- **Root attributes:** `data-primitive="code-note"`.
- **Required slots:** `anchor` (the code span or line referenced), `note` (the
  explanation).
- **Optional slots:** `index` (a marker linking anchor to note).
- **Supported variants:** `data-variant="inline"` (comment-style, default) or
  `data-variant="margin"` (a side note).
- **Supported states:** none.
- **Mobile/overflow rule:** margin notes move below the code on narrow screens.
- **Common failure:** annotations that restate the code. Explain the reason or
  the risk.

## diff-review

- **Purpose:** an added/removed/context diff with optional inline comments.
- **Use when:** a code review needs to render the actual change.
- **Avoid when:** describing a change conceptually — use prose or a `code-panel`.
- **Semantic base:** `figure` with a labeled `pre` of diff rows (gutter, marker,
  code), wrapped to scroll.
- **Root attributes:** `data-primitive="diff-review"`.
- **Required slots:** `file` (path + add/del delta), `hunk` (repeated diff rows).
- **Optional slots:** `comment` (an inline reviewer note on a row), `collapse`
  (a `details` wrapper to fold a long file).
- **Supported variants:** none.
- **Supported states:** `data-state` of `add`, `del`, or `ctx` on each diff row.
- **Mobile/overflow rule:** the diff scrolls horizontally inside its panel; the
  gutter stays aligned; the page never scrolls.
- **Common failure:** color-only add/remove with no `+`/`-` marker, which fails
  for low-vision readers. Keep the marker glyph.

## claim-evidence-matrix

- **Purpose:** map each claim to its supporting evidence, source, and confidence.
- **Use when:** a research report must show its work, not just its conclusion.
- **Avoid when:** there is one claim — use a `tldr` plus a `callout` or
  `audit-trail` when source provenance matters.
- **Semantic base:** `table` (claim / evidence / source / confidence) in a
  `table-wrap`, or a list of claim cards.
- **Root attributes:** `data-primitive="claim-evidence-matrix"`.
- **Required slots:** `head` (column labels), `row` (repeated; `claim`, `evidence`,
  `source`, `confidence`).
- **Optional slots:** `link` (a source link inside a cell).
- **Supported variants:** `data-variant="table"` (default) or
  `data-variant="cards"` (one card per claim, better on mobile).
- **Supported states:** `data-state` of `high`, `med`, or `low` on a confidence cell.
- **Mobile/overflow rule:** table scrolls inside `table-wrap` or switches to the
  `cards` variant below ~780px.
- **Common failure:** evidence cells that just restate the claim. Cite the actual
  source or value.

## finding-card

- **Purpose:** one review or QA finding — severity, location, evidence, impact,
  recommendation.
- **Use when:** code reviews, design QA, and audits list discrete findings.
- **Avoid when:** a single observation fits in a `callout`.
- **Semantic base:** `article` with a header (severity + location) and body.
- **Root attributes:** `data-primitive="finding-card"`.
- **Required slots:** `severity` (a badge), `location` (file/line or screen),
  `finding` (what is wrong), `recommendation` (the fix).
- **Optional slots:** `evidence` (a snippet, value, or screenshot reference),
  `impact` (why it matters).
- **Supported variants:** none.
- **Supported states:** `data-state` of `high`, `med`, `low`, or `info` on the card
  (drives the severity color).
- **Mobile/overflow rule:** full-width card; any embedded code or image is
  contained and scrolls internally.
- **Common failure:** a finding with no location or no recommendation — half a
  finding the reader cannot act on.

## screenshot-gallery

- **Purpose:** ordered captures with captions and file names, for design QA, UX
  audits, or before/after evidence.
- **Use when:** the artifact must show what was rendered or observed.
- **Avoid when:** there are no real captures — never use placeholder images.
- **Semantic base:** `figure` elements with `img` and `figcaption`, in a `grid`
  or `reel`.
- **Root attributes:** `data-primitive="screenshot-gallery"`.
- **Required slots:** `shot` (repeated; each holds a `frame` image and a `caption`).
- **Optional slots:** `compare` (a source-vs-render `split` pair), `annotation`
  (labels over a shot).
- **Supported variants:** `data-variant="grid"` (default) or `data-variant="compare"`
  (source beside render).
- **Supported states:** `data-state` of `pass` or `blocked` on a compared pair.
- **Mobile/overflow rule:** images use `max-width: 100%`; grids collapse to one
  column; a `reel` scrolls horizontally inside its own container.
- **Common failure:** uncontained full-resolution images that overflow the page.
  Always cap image width and wrap reels.

## token-swatch

- **Purpose:** show design tokens — color, type, spacing, radius, elevation — as a
  reference contact sheet.
- **Use when:** a design-QA packet or design reference documents tokens.
- **Avoid when:** the artifact is not about visual design.
- **Semantic base:** a `grid` of swatch `figure`s (chip + hex + token name).
- **Root attributes:** `data-primitive="token-swatch"`.
- **Required slots:** `swatch` (repeated; each holds a `chip`, a `value`, and a
  `token-name`).
- **Optional slots:** `group-label` (a heading for a swatch group).
- **Supported variants:** `data-variant` of `color`, `type`, `radius`, or `space`.
- **Supported states:** none.
- **Mobile/overflow rule:** `auto-fill` grid reflows to fewer columns; chips keep
  a fixed size and wrap.
- **Common failure:** putting token swatches into ordinary reader artifacts.
  Swatches are for design QA and reference material only.

## copy-export

- **Purpose:** a button (or small group) that copies the artifact or a part as
  Markdown, JSON, a prompt, a diff, or changed values.
- **Use when:** the reader will paste the result back into a workflow.
- **Avoid when:** there is nothing meaningful to export.
- **Semantic base:** a `button` with a clear label, enhanced by tiny inline JS.
- **Root attributes:** `data-primitive="copy-export"`.
- **Required slots:** `action` (the button), `payload` (the source text to copy,
  e.g. a hidden `<template>` or `data-` value).
- **Optional slots:** `confirm` (a transient "copied" acknowledgement).
- **Supported variants:** `data-variant` of `markdown`, `json`, `prompt`, or `diff`.
- **Supported states:** `data-state="copied"` briefly after a successful copy.
- **Mobile/overflow rule:** button stays tappable (≥40px touch target); never the
  only way to read the content.
- **Common failure:** an export button whose payload was never wired up, or that
  is the sole path to the content. The artifact must read fully without it.

## audit-trail

- **Purpose:** a compact, honest record of commands run, sources consulted, and
  files checked — the artifact's provenance.
- **Use when:** research reports, reviews, and QA packets that need to be trusted.
- **Avoid when:** there is no real trail — do not fabricate one.
- **Semantic base:** `footer` or `section` with a list of entries, often in mono.
- **Root attributes:** `data-primitive="audit-trail"`.
- **Required slots:** `entry` (repeated; each a command, source, or file checked).
- **Optional slots:** `group` (labeled groups: searched / consulted / not consulted).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** entries wrap; long commands/paths sit in a `table-wrap`
  or scroll inside a `pre`.
- **Common failure:** a vague trail ("researched the web"). List the actual
  searches, sources, and files so a reader can verify.

## action-list

- **Purpose:** ordered actions the reader can execute, with optional owner,
  status, proof, and rationale.
- **Use when:** a review, QA packet, plan, release check, or postmortem ends in
  concrete follow-up.
- **Avoid when:** the content is just findings or evidence — use `finding-card`
  or `claim-evidence-matrix` instead.
- **Semantic base:** `ol` or `ul` of action items.
- **Root attributes:** `data-primitive="action-list"`.
- **Required slots:** `action` (repeated).
- **Optional slots:** `owner`, `status`, `proof`, `due`, `rationale`.
- **Supported variants:** `data-variant="checklist"` or
  `data-variant="ordered"`.
- **Supported states:** `data-state` of `pending`, `blocked`, `done`, or
  `recommended` on an action.
- **Mobile/overflow rule:** actions stack; long paths or proof strings wrap or
  sit in mono.
- **Common failure:** vague actions with no verb, or missing owner/status when
  the source provides one.

---

## Planning & document primitives

These extend the catalog for plans, specs, decision records, and handoffs. They
follow the same anatomy contract; slot names remain CSS/inspection hooks only.
`theme-toggle` remains global shell furniture, not a recipe primitive.

## scope-boundary

- **Purpose:** draw the line between what is in scope and what is explicitly out,
  so a reader knows the edges of the work.
- **Use when:** plans, specs, migrations, and briefs that must fence their scope.
- **Avoid when:** scope is a single sentence — state it in prose.
- **Semantic base:** a `split` of two `section`s (in / out), each a list.
- **Root attributes:** `data-primitive="scope-boundary"`.
- **Required slots:** `in-scope` (what is included), `out-scope` (what is
  excluded).
- **Optional slots:** `boundary-note` (why the line sits where it does).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** the two columns stack below ~720px; lists wrap.
- **Common failure:** listing only in-scope items, leaving the exclusions
  implicit — the out-scope side is what prevents scope creep.

## acceptance-gate

- **Purpose:** the conditions that must hold before work is accepted, with the
  gate's overall pass/blocked state.
- **Use when:** plans, releases, and specs that gate handoff on explicit criteria.
- **Avoid when:** there is no real gate — do not invent acceptance theater.
- **Semantic base:** a `section` with a status label and a checklist of criteria.
- **Root attributes:** `data-primitive="acceptance-gate"`.
- **Required slots:** `criterion` (repeated; each a pass condition), `gate-status`
  (the overall gate state in text).
- **Optional slots:** `proof` (the evidence that satisfies a criterion).
- **Supported variants:** none.
- **Supported states:** `data-state` of `pass`, `blocked`, or `pending` on the
  gate or an individual criterion.
- **Mobile/overflow rule:** criteria stack; the status label stays with the gate.
- **Common failure:** a green gate with no stated criteria, so "pass" is
  unverifiable. State each condition and its proof.

## verification-matrix

- **Purpose:** map each check to how it is run and the proof expected, with a
  pass/blocked status.
- **Use when:** plans and releases that must show verification, not just claim it.
- **Avoid when:** there is a single check — use a `callout` or `acceptance-gate`.
- **Semantic base:** `table` (check / method / expected proof / status) in a
  `table-wrap`, or a list of cards.
- **Root attributes:** `data-primitive="verification-matrix"`.
- **Required slots:** `head` (column labels), `row` (repeated; `check`, `method`,
  `expected`).
- **Optional slots:** `status` (a state cell).
- **Supported variants:** `data-variant="table"` (default) or
  `data-variant="cards"` (one card per check, better on mobile).
- **Supported states:** `data-state` of `pass`, `blocked`, or `pending` on a
  status cell.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or switches to
  `cards` below ~780px.
- **Common failure:** an "expected proof" cell that restates the check. Name the
  concrete artifact the check produces.

## decision-log

- **Purpose:** a record of decisions, their rationale, and their status over time.
- **Use when:** briefs, plans, and postmortems that need a traceable decision history.
- **Avoid when:** a single decision — state it in a `callout` or prose.
- **Semantic base:** an ordered list of decision entries.
- **Root attributes:** `data-primitive="decision-log"`.
- **Required slots:** `decision` (repeated; each holds a `decision-title` and a
  `rationale`).
- **Optional slots:** `when` (date), `alternatives` (what was rejected), `status`.
- **Supported variants:** none.
- **Supported states:** `data-state` of `accepted`, `superseded`, or `proposed`
  on an entry.
- **Mobile/overflow rule:** entries stack; dates move above the body if narrow.
- **Common failure:** logging the decision without the rationale, so a later
  reader cannot tell whether it still holds.

## owner-matrix

- **Purpose:** who owns each area of the work, with role and backup.
- **Use when:** plans, releases, and handoffs that must assign responsibility.
- **Avoid when:** a single owner — name them in the `meta-strip`.
- **Semantic base:** `table` (area / owner / role / backup) in a `table-wrap`.
- **Root attributes:** `data-primitive="owner-matrix"`.
- **Required slots:** `head` (column labels), `row` (repeated; `area`, `owner`).
- **Optional slots:** `role`, `backup`.
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or collapses
  each row to a stacked card below ~780px.
- **Common failure:** areas with no named owner, which defeats the matrix. Mark an
  unassigned area as unknown rather than leaving it blank.

## dependency-map

- **Purpose:** show what each item depends on and where a dependency blocks.
- **Use when:** plans and migrations whose ordering hinges on dependencies.
- **Avoid when:** the items are independent — use a list.
- **Semantic base:** a list of dependency edges, or a contained SVG/CSS graph.
- **Root attributes:** `data-primitive="dependency-map"`.
- **Required slots:** `node` (repeated; each holds a `node-title` and its
  `depends-on`).
- **Optional slots:** `blocker` (a hard-blocker marker), `note`.
- **Supported variants:** `data-variant="list"` (default) or `data-variant="graph"`
  (a contained SVG that scrolls inside its own panel).
- **Supported states:** `data-state="blocked"` on a node with an unmet dependency.
- **Mobile/overflow rule:** the list wraps; the graph scrolls inside its panel,
  never the page.
- **Common failure:** an unreadable hairball graph. Prefer the list unless the
  graph genuinely clarifies ordering, and contain it.

## handoff-packet

- **Purpose:** the compact set of things the next agent needs to pick the work up.
- **Use when:** plans, migrations, and reviews that end in a handoff.
- **Avoid when:** the artifact is not being passed on.
- **Semantic base:** a `section` with a labeled list and a clear next step.
- **Root attributes:** `data-primitive="handoff-packet"`.
- **Required slots:** `item` (repeated; each a `key` and `value`), `next-step`
  (the single first action for the next agent).
- **Optional slots:** `open` (open items still unresolved), `entry-point` (where
  to start reading or working).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** items stack; long paths sit in mono and wrap.
- **Common failure:** a handoff with state but no next step, leaving the reader to
  reconstruct where to begin.

## state-grid

- **Purpose:** show a set of UI or review states side by side — empty/loading/error
  or pass/blocked/evidence-limited.
- **Use when:** design QA, specs, and audits that must cover multiple states.
- **Avoid when:** there is a single state — show it once.
- **Semantic base:** a `grid` of state cells, each a labeled frame.
- **Root attributes:** `data-primitive="state-grid"`.
- **Required slots:** `cell` (repeated; each holds a `state-label` and a
  `state-body`).
- **Optional slots:** `frame` (a capture or schematic of the state).
- **Supported variants:** none.
- **Supported states:** `data-state` of `pass`, `blocked`, `evidence-limited`,
  `empty`, `loading`, or `error` on a cell.
- **Mobile/overflow rule:** the grid collapses to one column; frames stay contained.
- **Common failure:** labelling cells by color alone. The `state-label` must name
  the state in text.

## constraint-ledger

- **Purpose:** record the constraints shaping the work and what each implies.
- **Use when:** briefs, plans, and decisions bounded by real constraints.
- **Avoid when:** there are no binding constraints to record.
- **Semantic base:** `table` (constraint / source / implication) in a `table-wrap`,
  or a list of cards.
- **Root attributes:** `data-primitive="constraint-ledger"`.
- **Required slots:** `head` (column labels), `row` (repeated; `constraint`,
  `implication`).
- **Optional slots:** `source` (where the constraint comes from).
- **Supported variants:** `data-variant="table"` (default) or `data-variant="cards"`.
- **Supported states:** `data-state` of `hard` or `soft` on a constraint to mark
  whether it is negotiable.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or switches to
  `cards` below ~780px.
- **Common failure:** listing constraints with no implication, so the reader
  cannot tell how each one changes the work.

---

## QA & comparison primitives

These extend the catalog for detailed design QA, comparison workbenches, and the
evidence honesty those artifacts require. Captures are owned by the `design-qa`,
`ux-audit`, and `visual-design` skills; these primitives only present them.

## screenshot-triptych

- **Purpose:** show source design, rendered build, and a revised mockup together,
  three-up, for detailed fidelity review.
- **Use when:** detailed design QA proposes a fix, not just reports a mismatch.
- **Avoid when:** there is no revised mockup — use `screenshot-gallery` in
  `compare` variant for source-vs-render only.
- **Semantic base:** three `figure`s in a three-column `grid`.
- **Root attributes:** `data-primitive="screenshot-triptych"`.
- **Required slots:** `source` (the source design figure), `render` (the rendered
  build figure), `revised` (the proposed revision figure).
- **Optional slots:** `caption` (per figure), `verdict` (the pass/blocked read).
- **Supported variants:** none.
- **Supported states:** `data-state` of `pass`, `blocked`, or `evidence-limited`
  on the triptych.
- **Mobile/overflow rule:** the three frames stack to one column; each image is
  contained with `max-width: 100%`.
- **Common failure:** three unaligned crops at different scales, so differences
  are noise. Normalize crop, scale, and state first.

## focused-compare

- **Purpose:** a zoomed before/after of one region where fidelity depends on
  detail too small to judge in the full view.
- **Use when:** the mismatch is in precise type, spacing, alignment, or an asset.
- **Avoid when:** the whole-view compare already makes the gap clear.
- **Semantic base:** a `split` pair of `figure`s of the cropped region, with a
  region label.
- **Root attributes:** `data-primitive="focused-compare"`.
- **Required slots:** `region-label` (which region), `before` (source crop),
  `after` (render crop).
- **Optional slots:** `note` (the specific fidelity issue).
- **Supported variants:** none.
- **Supported states:** `data-state` of `pass` or `blocked` on the pair.
- **Mobile/overflow rule:** the pair stacks; crops stay contained.
- **Common failure:** zooming without saying which region or what to look at,
  leaving the reader to hunt for the difference.

## annotation-pin

- **Purpose:** numbered pins placed over a capture, each tied to a matching note.
- **Use when:** several findings sit on one screen and need to be located precisely.
- **Avoid when:** one finding — use a `finding-card` with a location.
- **Semantic base:** a `figure` with positioned numbered markers over the image,
  plus a keyed list of notes.
- **Root attributes:** `data-primitive="annotation-pin"`.
- **Required slots:** `frame` (the capture), `pin` (repeated; a numbered marker),
  `pin-note` (the matching numbered note).
- **Optional slots:** none.
- **Supported variants:** none.
- **Supported states:** `data-state` of `high`, `med`, or `low` on a pin (severity).
- **Mobile/overflow rule:** pins stay anchored to the image as it scales; notes
  move below the image and remain readable.
- **Common failure:** pins with no matching note, or notes whose number does not
  line up with a pin.

## fidelity-coverage

- **Purpose:** state which fidelity dimensions were checked and which were not, so
  the verdict's scope is explicit.
- **Use when:** a QA packet should not imply more coverage than it has.
- **Avoid when:** coverage is trivially complete and stated in the summary.
- **Semantic base:** a `grid` or list of coverage rows: dimension + status + note.
- **Root attributes:** `data-primitive="fidelity-coverage"`.
- **Required slots:** `dimension` (repeated; each a `dimension-label` and a
  `coverage`).
- **Optional slots:** `note`.
- **Supported variants:** none.
- **Supported states:** `data-state` of `checked`, `partial`, or `not-checked` on
  a dimension.
- **Mobile/overflow rule:** rows stack; labels stay with their status.
- **Common failure:** implying full coverage by omission. Name the dimensions left
  unchecked rather than dropping them.

## qa-metadata

- **Purpose:** the run conditions a comparison was made under — viewport, theme,
  route, density, auth/interaction state, date — so it can be reproduced.
- **Use when:** any QA or audit packet where matched state is what makes the
  comparison valid.
- **Avoid when:** there is no rendered comparison to characterize.
- **Semantic base:** a `dl` of `dt`/`dd` pairs, like a QA-specific `meta-strip`.
- **Root attributes:** `data-primitive="qa-metadata"`.
- **Required slots:** `item` (repeated; each holds a `key` and a `value`).
- **Optional slots:** none.
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** the grid collapses 4→2→1 columns; keys stay in the
  mono label style.
- **Common failure:** a comparison with no recorded state, so a mismatch caused by
  a viewport or theme difference looks like a real defect.

## evidence-limits

- **Purpose:** name what could not be verified and how that bounds the verdict.
- **Use when:** any QA, audit, or research artifact where evidence is incomplete.
- **Avoid when:** nothing limits the evidence — do not manufacture caveats.
- **Semantic base:** a `section` or `aside` with a labeled list of limits.
- **Root attributes:** `data-primitive="evidence-limits"`.
- **Required slots:** `limit` (repeated; each a missing-evidence statement).
- **Optional slots:** `impact` (what the limit means for the verdict).
- **Supported variants:** none.
- **Supported states:** `data-state="evidence-limited"` on the block when the
  limits change the verdict from pass/blocked to evidence-limited.
- **Mobile/overflow rule:** limits stack and wrap freely.
- **Common failure:** claiming a complete comparison when key evidence was missing.
  State the limit and downgrade the verdict honestly.

## mismatch-ledger

- **Purpose:** a scannable register of source-vs-render mismatches with severity.
- **Use when:** a detailed QA packet has several mismatches to track at once.
- **Avoid when:** one or two mismatches — use `finding-card`s.
- **Semantic base:** `table` (region / expected / actual / severity) in a
  `table-wrap`, or a list of cards.
- **Root attributes:** `data-primitive="mismatch-ledger"`.
- **Required slots:** `head` (column labels), `row` (repeated; `region`,
  `expected`, `actual`).
- **Optional slots:** `severity` (a badge cell).
- **Supported variants:** `data-variant="table"` (default) or `data-variant="cards"`.
- **Supported states:** `data-state` of `high`, `med`, or `low` on a severity cell.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or switches to
  `cards` below ~780px.
- **Common failure:** an "actual" cell that just says "wrong". State the observed
  value against the expected one.

## revision-strip

- **Purpose:** show a before → after → revised sequence so the proposed fix reads
  as a progression.
- **Use when:** a QA or design artifact proposes a concrete revision.
- **Avoid when:** there is no revision to show — use `screenshot-gallery`.
- **Semantic base:** an ordered horizontal sequence of `figure`s with connectors.
- **Root attributes:** `data-primitive="revision-strip"`.
- **Required slots:** `step` (repeated; each holds a `frame` and a `step-label`).
- **Optional slots:** `connector` (the arrow between frames).
- **Supported variants:** none.
- **Supported states:** `data-state="recommended"` on the chosen revision frame.
- **Mobile/overflow rule:** the strip scrolls horizontally inside its own
  container, or stacks; the page never scrolls.
- **Common failure:** a strip with no clear "recommended" end state, so the reader
  cannot tell what is being proposed.

## token-delta

- **Purpose:** compare expected design-token values against the actual rendered
  values, with a match/mismatch state.
- **Use when:** token fidelity (color, type, spacing, radius) is in QA scope.
- **Avoid when:** the artifact is not about token fidelity — use `token-swatch`
  for reference only.
- **Semantic base:** `table` (token / expected / actual / match) in a `table-wrap`,
  each value paired with a small chip.
- **Root attributes:** `data-primitive="token-delta"`.
- **Required slots:** `head` (column labels), `row` (repeated; `token-name`,
  `expected`, `actual`).
- **Optional slots:** `chip` (a color/spacing chip beside a value), `match` (the
  match state cell).
- **Supported variants:** none.
- **Supported states:** `data-state` of `match` or `mismatch` on a row.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap`; chips keep a
  fixed size.
- **Common failure:** showing values without a match verdict, so the reader must
  eyeball whether each token passed.

---

## Image Gen & design-handoff primitives

These extend the catalog for Image Gen concept packets and design-handoff specs.
Concepting and asset generation are owned by the `visual-design` skill; these
primitives present the selected concepts, sources, and handoff details.

## concept-gallery

- **Purpose:** a gallery of generated concept directions with a selection state.
- **Use when:** an Image Gen packet presents candidate directions to choose from.
- **Avoid when:** there is a single accepted direction — show it once.
- **Semantic base:** a `grid` of `figure` concept cards with captions.
- **Root attributes:** `data-primitive="concept-gallery"`.
- **Required slots:** `concept` (repeated; each holds a `frame` and a
  `concept-label`).
- **Optional slots:** `rationale` (why this direction), `selected` (a mark on the
  chosen concept).
- **Supported variants:** none.
- **Supported states:** `data-state` of `selected` or `rejected` on a concept.
- **Mobile/overflow rule:** the grid collapses to one column; frames stay contained.
- **Common failure:** a gallery with no selection state, so the reader cannot tell
  which direction was accepted.

## source-manifest

- **Purpose:** list the source inputs a design or concept was built from.
- **Use when:** an Image Gen packet or handoff spec must show its grounding.
- **Avoid when:** there is no real source set to record.
- **Semantic base:** a list or `table` of source inputs.
- **Root attributes:** `data-primitive="source-manifest"`.
- **Required slots:** `source` (repeated; each a `source-name` and `source-kind`).
- **Optional slots:** `origin` (path, URL, or "provided").
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** entries wrap; long paths sit in mono.
- **Common failure:** a manifest that lists outputs instead of inputs. Record what
  the work was grounded in, not what it produced.

## asset-inventory

- **Purpose:** the assets to be produced or delivered, with spec, format, and status.
- **Use when:** a design-handoff spec enumerates deliverable assets.
- **Avoid when:** there are no discrete assets to track.
- **Semantic base:** `table` (asset / spec / format / status) in a `table-wrap`.
- **Root attributes:** `data-primitive="asset-inventory"`.
- **Required slots:** `head` (column labels), `row` (repeated; `asset`, `spec`).
- **Optional slots:** `format`, `status`.
- **Supported variants:** none.
- **Supported states:** `data-state` of `delivered` or `pending` on a status cell.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or collapses to
  stacked cards below ~780px.
- **Common failure:** an asset row with no spec, so the implementer cannot produce
  it to the right size or format.

## allowed-copy-list

- **Purpose:** the approved copy strings and where each one is placed, so handoff
  text is exact and not paraphrased.
- **Use when:** a handoff spec or concept packet ships finalized copy.
- **Avoid when:** copy is still in flux — mark it as draft instead.
- **Semantic base:** a list of approved strings, each with a placement note.
- **Root attributes:** `data-primitive="allowed-copy-list"`.
- **Required slots:** `copy` (repeated; each an approved string and a `placement`).
- **Optional slots:** `note` (length limit, tone, or constraint).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** strings wrap; placements stay with their string.
- **Common failure:** approving copy without placement, so the same string lands
  in the wrong slot.

## imagegen-prompt-card

- **Purpose:** a self-contained prompt card for generating an image, with intent
  and constraints, ready to copy.
- **Use when:** an Image Gen packet hands off reusable generation prompts.
- **Avoid when:** the artifact is not about generating imagery.
- **Semantic base:** a `figure` or `article` card holding intent, prompt text, and
  constraints, with an optional copy control.
- **Root attributes:** `data-primitive="imagegen-prompt-card"`.
- **Required slots:** `intent` (what to generate), `prompt-text` (the prompt).
- **Optional slots:** `constraints` (style/format limits), `copy` (a `copy-export`
  for the prompt).
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** the card is full-width; long prompt text wraps and the
  copy control stays tappable.
- **Common failure:** a prompt with no stated intent or constraints, so a
  regeneration drifts from the accepted direction.

## design-system-extract

- **Purpose:** the tokens and component notes extracted from a source design, as a
  reference for faithful implementation.
- **Use when:** a handoff spec documents the design system the build must match.
- **Avoid when:** there is no system to extract — a one-off needs no extract.
- **Semantic base:** a `section` grouping `token-swatch` sets and component notes.
- **Root attributes:** `data-primitive="design-system-extract"`.
- **Required slots:** `group` (repeated; each a `group-label` and its `tokens`).
- **Optional slots:** `note` (usage guidance per group).
- **Supported variants:** `data-variant="tokens"` (default) or
  `data-variant="components"`.
- **Supported states:** none.
- **Mobile/overflow rule:** swatch grids reflow to fewer columns; notes wrap.
- **Common failure:** extracting values with no usage note, so the implementer
  knows the hex but not where it applies.

---

## Motion & performance primitives

These extend the catalog for motion proofs, viewport proofs, and performance
budgets. They keep animation honest and document that the artifact was actually
rendered and measured.
Use `motion-proof`, `viewport-matrix`, `performance-budget`, and `render-proof`
only when real measured or rendered evidence exists.

## motion-proof

- **Purpose:** show an animated element together with its reduced-motion behavior,
  proving the animation degrades safely.
- **Use when:** an artifact uses motion and must show the fallback is real.
- **Avoid when:** there is no animation in the artifact.
- **Semantic base:** a `figure` with the animated demo and a stated reduced-motion
  behavior.
- **Root attributes:** `data-primitive="motion-proof"`.
- **Required slots:** `demo` (the animated element), `reduced` (the reduced-motion
  behavior, in text).
- **Optional slots:** `tokens` (the duration/easing used), `caption`.
- **Supported variants:** none.
- **Supported states:** `data-state="reduced-motion"` on the demo when reduce is
  active.
- **Mobile/overflow rule:** the demo stays contained; nothing depends on motion to
  be readable.
- **Common failure:** an animation with no reduced-motion path, so the final state
  is unreachable when motion is disabled.

## viewport-matrix

- **Purpose:** show the same content rendered at several viewport widths, as proof
  of responsive behavior.
- **Use when:** an artifact must demonstrate desktop/tablet/mobile reflow.
- **Avoid when:** a single viewport is the whole story.
- **Semantic base:** a `grid` of `figure` frames, one per width.
- **Root attributes:** `data-primitive="viewport-matrix"`.
- **Required slots:** `viewport` (repeated; each holds a `frame` and a
  `width-label`).
- **Optional slots:** `note`.
- **Supported variants:** none.
- **Supported states:** none.
- **Mobile/overflow rule:** frames stack to one column; each frame is contained
  and never forces page scroll.
- **Common failure:** frames that are decorative mockups rather than real renders
  at the stated widths.

## performance-budget

- **Purpose:** the size/performance budget for the artifact, with budget vs actual
  and a within/over status.
- **Use when:** a release-readiness or large artifact must show it stayed in budget.
- **Avoid when:** there is no real measurement — do not invent metrics.
- **Semantic base:** `table` (metric / budget / actual / status) in a `table-wrap`.
- **Root attributes:** `data-primitive="performance-budget"`.
- **Required slots:** `head` (column labels), `row` (repeated; `metric`, `budget`,
  `actual`).
- **Optional slots:** `status`.
- **Supported variants:** none.
- **Supported states:** `data-state` of `within` or `over` on a status cell.
- **Mobile/overflow rule:** the table scrolls inside `table-wrap` or collapses to
  stacked cards below ~780px.
- **Common failure:** a budget table with fabricated "actual" numbers. Measure the
  real file size and mark anything unmeasured as unknown.

## render-proof

- **Purpose:** the record of rendered browser checks — width, tool, and result —
  so the QA in `browser-checks.md` is visible in the artifact.
- **Use when:** an artifact wants to ship its rendered-QA evidence inline.
- **Avoid when:** the trail is unverified — do not claim checks that did not run.
- **Semantic base:** a `section` or `footer` list of rendered checks.
- **Root attributes:** `data-primitive="render-proof"`.
- **Required slots:** `check` (repeated; each a `check-label` and a `result`).
- **Optional slots:** `tool` (the browser tool used, with any fallback reason).
- **Supported variants:** none.
- **Supported states:** `data-state` of `pass` or `fail` on a check.
- **Mobile/overflow rule:** entries wrap; widths and tools stay in mono.
- **Common failure:** a render-proof that lists widths never actually opened. Record
  only the checks performed, and which browser tool ran them.

## theme-toggle

- **Purpose:** let the reader switch between light and dark, and mark the artifact
  as dark-mode capable. Implemented identically in every artifact.
- **Use when:** every artifact — it is standard shell furniture, not optional.
- **Avoid when:** never omit it; dark mode is a baseline.
- **Semantic base:** a `button` holding an inline-SVG moon, anchored fixed to the
  top-right corner.
- **Root attributes:** `data-primitive="theme-toggle"`.
- **Required slots:** `action` (the button itself; carries `aria-label` and
  `aria-pressed`).
- **Optional slots:** none.
- **Supported variants:** none — one implementation everywhere.
- **Supported states:** the theme lives on the document root as
  `data-theme="dark"` or `data-theme="light"`; the button mirrors it via
  `aria-pressed`.
- **Mobile/overflow rule:** a fixed ~40px target in the top-right; it never
  overlaps the mid-right section index and is hidden in print.
- **Common failure:** keying code or panel backgrounds off text color variables,
  or requiring JavaScript for dark mode. Dark mode must work from
  `prefers-color-scheme` alone; the button only adds manual override and
  persistence. See [../assets/theme.css](../assets/theme.css).
