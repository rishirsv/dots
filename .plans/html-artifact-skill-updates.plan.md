# Implementation Plan — HTML Artifact Skill: Primitive & Capability Updates

**Route:** Standard Plan (no prior written plan existed).
**Lens:** Improving an existing skill → skill-doctor model (source-owned edits +
validation), planned via ultraplan.
**Target skill:** `plugins/dots/skills/html-artifact/`
**Status:** Planning only. No source edited. Execution is a separate, approved step.

---

## 1. Objective

Turn the dogfood-grounded primitive roadmap (developed this session, captured in
`~/Desktop/html-artifact-skill-explainer.html` and memory
`html-artifact-primitive-roadmap`) into concrete, verifiable additions to the
html-artifact skill — **without** bloating the catalog or breaking the
single-file, static-first contract.

The roadmap proposed ~19 primitives. This plan's central move is to **collapse
that to a small set of genuinely-new primitives plus reuse-variants on existing
ones**, because the skill already owns 47 primitives and most proposals overlap.

---

## 2. Repo facts established (grounded, load-bearing)

| Fact | Evidence | Consequence for the plan |
|---|---|---|
| Source lives in `plugins/`, `dist/` is generated and must not be edited | root `AGENTS.md` "Source Map" / "Boundaries"; `diff -q plugins/.../SKILL.md dist/.../SKILL.md` → identical | Edit `plugins/dots/skills/html-artifact/**`; regenerate with `scripts/package-plugins.sh` |
| The skill validator does **not** enforce a closed primitive allow-list | `.html-artifact/scripts/validate-artifacts.mjs` lines 80–130: it only checks `requiredByArtifact[artifact]` and `requiredSlots[prim]` | A new primitive needs a validator edit **only if** it becomes recipe-required or we want its slots enforced. Low per-primitive burden |
| Validator runs over a directory of `.html` artifacts, not the skill's own docs | `validate-artifacts.mjs` `targetDir`; fixtures live in `.html-artifact/cases/*` and `runs/` | Eval coverage = add a fixture `.html` + register a case in `.html-artifact/evals.json` |
| Validator already enforces: inline CSS, no external runtime (`http(s)://`/`cdn.`/`<link>`/`<script src>`), no contamination, viewport+responsive rule, containment hooks, reduced-motion, image hygiene | `validate-artifacts.mjs` lines 84–129 | Every new primitive's fixture must pass these as-is. JS-using primitives must still satisfy "no external runtime" (inline only) |
| Syntax-highlight token classes already exist | `assets/primitive-atlas.html` `<style>`: `.kw/.str/.cm/.fn` | `code-panel` highlighting is a **doc + atlas** task, not new CSS invention |
| `step-flow` already has `data-variant="timeline"`; `milestone-strip` has `when/marker`; `comparison-grid` has `split`; `meta-strip` has `cells` variant; `hero-summary` has an optional `meta` slot; `audit-trail` holds references | `references/primitives.md` | Several roadmap items become **variants/slots on these**, not new primitives |
| Recipes declare "Required primitives" / "Optional primitives" lists; `requiredByArtifact` mirrors the required set | `references/recipes.md`; `validate-artifacts.mjs` lines 30–48 | Wiring a primitive into a recipe = edit both the recipe prose and (if required) the validator map |
| Validation entrypoints | root `AGENTS.md` "Validation"; `scripts/verify.sh` | `scripts/verify.sh` packages dist + runs a markdown link check (relative `references/*` links must stay valid); skill artifacts checked via `validate-artifacts.mjs` |

---

## 3. Design principle for this plan (anti-overengineering)

1. **Reuse before adding.** Prefer a `data-variant`/`data-slot` on an existing
   primitive over a new `data-primitive`. A new primitive must have no adequate
   existing owner.
2. **Producer/consumer/verification per addition.** Add a primitive only when a
   named recipe consumes it and a fixture verifies it. No speculative primitives.
3. **Static-first contract is non-negotiable.** Anything interactive
   (tabs, sort/filter, sidenote toggle, slide nav) must render and read fully
   with JS disabled (progressive enhancement), inline JS only.
4. **No new design tokens unless required.** Reuse `DESIGN.md` palette/spacing;
   diagram/chart strokes reuse `accent`/`border`/severity colors.
5. **Interactive editors stay out.** Kanban/feature-flag/prompt-tuner/live-slider
   UIs (dogfood files 06, 15, 18–20) are app UI → `visual-design`, not this skill.

---

## 4. Scope consolidation — 19 proposals → buildable set

| Roadmap proposal | Disposition | Owner |
|---|---|---|
| `inline-schematic` (node/edge/data-flow SVG) | **NEW primitive** | new |
| `sparkline`, `distribution-bar`, `small-multiples` | **ONE NEW primitive** `inline-chart` with `data-variant="sparkline\|bar\|distribution\|multiples"` | new |
| `status-banner` (top-of-doc state strip) | **NEW primitive** | new |
| `sidenote` (gutter aside) | **NEW primitive** (genuinely new gutter layout) | new |
| `metric-tile` (value+delta+source) | **variant** `meta-strip` `data-variant="metric"` (+ `delta`, `source` slots) | reuse |
| `incident-timeline` (timestamped) | **variant** `milestone-strip` `data-variant="timeline"` (+ `timestamp` slot) | reuse |
| `feature-matrix` (options×criteria ✓/✗) | **variant** `comparison-grid` `data-variant="matrix"` | reuse |
| `code-tabs` + syntax highlighting | **variant** `code-panel` `data-variant="tabs"` + document `.kw/.str/.cm/.fn` | reuse |
| `data-table` (sort/filter/search) | **capability** on `risk-table`/table: optional progressive-enhancement JS, `data-variant="data"` | reuse |
| `byline` (author+avatar+date) | **doc-only**: `hero-summary` `meta` slot pattern | reuse |
| `citation` + `reference-list` | **variant** `audit-trail` `data-variant="references"` + inline `cite` pattern | reuse |
| `wide-figure` / `svg-illustration` | **layout capability** (`figure` `data-variant="wide\|full-bleed"`); `svg-illustration` = inline SVG in a `figure` (doc-only) | reuse |
| `inline-define` (hover/tap define) | **doc-only** authoring pattern (native `<details>`/`<abbr>`) | reuse |
| `changelog-entry` | **variant** `decision-log`/`milestone-strip` (defer; low value vs existing) | defer |
| `action-items` | **fold** into `handoff-packet` / `acceptance-gate` (doc note) | reuse |
| `slide-deck` (paged deck) | **Removed from plan** — decks are `visual-design`'s job | out of scope |
| `status-report` (dogfood file 11) | **NEW recipe** assembling the above | Phase 3 |

**Net new `data-primitive`s: 4** (`inline-schematic`, `inline-chart`,
`status-banner`, `sidenote`). Everything else is a variant, slot, capability,
doc pattern, or deferred — down from 19.

---

## 5. The change model (files each addition touches)

For a **new primitive**:
1. `references/primitives.md` — add the anatomy block (Purpose / Use / Avoid /
   Semantic base / Root attrs / Required+Optional slots / Variants / States /
   Mobile-overflow rule / Common failure), matching the existing format.
2. `assets/primitive-atlas.html` — add a `.specimen` (head with `.pname` +
   anatomy chips, `.specimen-body` demo) **and** the primitive's CSS in the
   atlas `<style>`, reusing existing CSS variables.
3. `references/recipes.md` — list it under the consuming recipe's Required/Optional.
4. `.html-artifact/scripts/validate-artifacts.mjs` — add to `requiredSlots`
   (if it has required slots) and/or `requiredByArtifact` (if recipe-required).
5. `.html-artifact/cases/<case>/` + `.html-artifact/evals.json` — add a fixture
   artifact that uses it and a registered case.
6. `references/DESIGN.md` — only if it needs a token not already present.
7. `SKILL.md` — only if it changes the recipe list, non-goals, or workflow prose.

For a **variant/slot/capability**: steps 1–3 + a fixture; usually no new validator
entry unless slots become required.

After any edit: regenerate (`scripts/package-plugins.sh`), then verify (§7).

---

## 6. Phased work

### Phase 0 — Foundations (cross-cutting, low risk, no new primitives)
- **Print baseline.** Add an `@media print` guidance section to
  `references/authoring.md` and a baseline rule set to the atlas (hide nav,
  avoid breaks inside code/callouts, ink-friendly code). *Why:* artifacts are
  shareable documents people print/PDF; cheap and self-contained.
- **Dark mode (now specified — implement this pass).** Every generated artifact
  ships a standardized dark theme **and** an anchored moon toggle, implemented
  identically everywhere:
  - A new **`theme-toggle`** primitive: a `<button>` carrying an inline-SVG moon,
    `position: fixed` top-right, ≥40px touch target, `aria-label` + `aria-pressed`.
  - A canonical token system in `references/DESIGN.md`: light values on `:root`;
    the same dark values in **both** `@media (prefers-color-scheme: dark)
    :root:not([data-theme="light"])` (OS-driven, works with **JS off**) and
    `:root[data-theme="dark"]` (manual override). Code surfaces stay dark in both
    themes via dedicated `--code-surface`/`--code-text` tokens (never `--ink`).
  - One tiny inline script toggles `data-theme` on `<html>` and persists it to
    `localStorage`; with JS disabled, the OS preference still drives dark mode and
    the button is simply inert (progressive enhancement).
  - The exact CSS + button + script live once in `DESIGN.md` as the source of
    truth; `authoring.md` makes the toggle mandatory; the fixture generator's
    `shell()` template emits it so every fixture is identical; the validator gains
    a global check that each artifact carries `theme-toggle` + a dark mirror.
  - **Done this pass:** implemented in `DESIGN.md` (canonical tokens/button/script),
    `primitives.md` (`theme-toggle`), `authoring.md`, `SKILL.md` Default Path, the
    generator + 17 regenerated fixtures, and the atlas (code surfaces repointed off
    `--ink` to `--code-surface`). Validator 213/213; `metaskill validate` 16/16;
    verified in-browser at light and forced-dark (code panels stay dark, contrast holds).
- **Document existing syntax highlighting.** Add `.kw/.str/.cm/.fn` to the
  `code-panel` anatomy in `primitives.md` (CSS already in the atlas).
- **Tighten the contract language** in `authoring.md`: (a) make the
  progressive-enhancement rule explicit for tabs/sort/disclosure (“reads fully
  with JS off”); (b) state the interactive-editor → `visual-design` boundary.
- **Verify:** `scripts/verify.sh` (markdown link check passes; no broken
  `references/*` links); browser-check the atlas print + dark rendering.

### Phase 1 — New primitives (highest value: show data & relationships, declare status)
1. **`inline-schematic`** — inline-SVG boxes-and-arrows (nodes, gates, arrowed
   edges, data-flow). Slots: `node`, `edge`, `caption`; variants `flow|deps`.
   Consumers: `architecture-map` (Optional), `explainer`, `postmortem`.
   Complements existing list-form `dependency-map`. No external runtime.
2. **`inline-chart`** — inline SVG/CSS, `data-variant="sparkline|bar|distribution|multiples"`.
   Slots: `series`/`bar`, `label`, `value`, `caption`. Data-ink ≈ 1.0.
   Consumers: `eval-report`, `research-report`, `release-readiness`, new `status-report`.
   Provenance: requires a real source/caption (guards the "fake KPI" ban).
3. **`status-banner`** — top-of-document state strip: `Draft|Beta|Verified <date>|Stale as of <date>|Superseded`.
   Slots: `state`, `detail`; `data-state` drives color (reuse severity tokens).
   Consumable by any recipe via the shell header (Optional on all).
- **Each:** primitives.md anatomy → atlas specimen+CSS → recipe wiring →
  `requiredSlots` entry → one fixture case → validator + browser QA.

### Phase 2 — Reuse variants on existing primitives
- `comparison-grid` `data-variant="matrix"` (feature-matrix: labeled rows, ✓/partial/✗ cells, sticky header; cap columns, stack on mobile).
- `meta-strip` `data-variant="metric"` (+ `delta` up/flat/down slot, required `source` slot) — the `metric-tile`.
- `milestone-strip` `data-variant="timeline"` (+ `timestamp` slot) — the `incident-timeline`; wire into `postmortem` (Optional).
- `code-panel` `data-variant="tabs"` (tabbed multi-file/multi-language with copy; panels stack with JS off).
- `risk-table`/table `data-variant="data"` capability — optional inline sort/filter/search JS; renders as a plain table with JS off (NN/g find+compare).
- `hero-summary` byline pattern documented via its `meta` slot (no new primitive).
- **Verify:** extend existing recipe fixtures to exercise variants; validator + browser QA.

### Phase 3 — Editorial primitives + new `status-report` recipe
- **`sidenote`** (NEW primitive): gutter `<aside>` on wide screens, inline/disclosure on mobile; readable with JS off. Consumers: `explainer`, `research-report`, `decision-brief`.
- `audit-trail` `data-variant="references"` + inline `cite` markers (folds in `citation`/`reference-list`).
- `figure` `data-variant="wide|full-bleed"` layout capability (folds in `wide-figure`); document `svg-illustration` as inline SVG in a `figure`.
- `inline-define` documented as a native `<details>`/`<abbr>` authoring pattern.
- **NEW recipe `status-report`** (dogfood file 11): assembles `status-banner`,
  `meta-strip[metric]`, `inline-chart`, `milestone-strip[timeline]`, `risk-table`,
  byline. Add to `recipes.md`, `requiredByArtifact`, SKILL.md recipe list, +
  fixture case. This is the **real consumer** that justifies Phase 1/2 pieces.

### Phase 4 — Out of scope (explicit)
- **`slide-deck` — removed from this plan.** Paged, keyboard-driven decks are a
  different artifact mode; route deck requests to `visual-design`.
- **Interactive editors (→ `visual-design`):** component-variant sliders, kanban
  triage board, feature-flag editor, prompt tuner (dogfood 06, 15, 18–20).

---

## 7. Verification (per phase, before handoff)

**Automated**
- `node plugins/dots/skills/html-artifact/.html-artifact/scripts/validate-artifacts.mjs <fixtures-dir>` → all checks pass (`ok:true`) for each new/updated fixture.
- `scripts/verify.sh` → packages `dist/` cleanly and the markdown link check passes (catches broken `references/*` links introduced by edits).
- `scripts/package-plugins.sh` alone if only re-syncing dist.
- (If applicable) `plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/html-artifact --json` — confirm it accepts a non-meta-skill skill dir at implementation time; if it is meta-skill-specific, rely on `verify.sh` + the skill validator instead.

**Manual (per `references/browser-checks.md`)**
- Open the atlas and each new fixture in a browser at **1280 / 375 / 320px**:
  no page-level horizontal overflow; tables/code/diagrams contained; the
  document reads top-to-bottom with **JS disabled**; reduced-motion honored.
- Confirm no reader-facing text leaks `data-*`/slot names.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Catalog bloat / overengineering | Reuse-first consolidation (4 new primitives, not 19); each tied to a consuming recipe + fixture |
| JS-using variants break the static contract | Progressive-enhancement gate in fixtures: every such fixture must pass a JS-disabled read; validator's "no external runtime" already blocks CDNs |
| `inline-chart`/`metric-tile` invite fabricated metrics | Required `source`/`caption` slot; reuse the existing contamination + "mark unknowns" rules |
| Editing `dist/` by mistake | Plan edits only `plugins/**`; regenerate via `package-plugins.sh`; AGENTS.md boundary |
| Broken cross-references after adding files | `scripts/verify.sh` markdown link check runs every phase |
| Atlas/SKILL.md contamination (provider names, scratch paths) | `validate-artifacts.mjs` `forbidden[]` already guards; keep new specimens generic |
| `metaskill validate` may not target dots skills | Verify at implementation; fall back to `verify.sh` + skill validator |

---

## 9. Out of scope
- The Desktop explainer artifact and `~/Desktop/html-artifact-guidance/` downloads
  (reference material, not shipped skill payload).
- Any change to `visual-design`, or interactive app-UI widgets.
- Publishing/committing — local edits + validation only unless asked.

---

## 10. Open decisions (need the user; repo cannot answer)
1. **Scope of first cut:** ship Phase 0 + Phase 1 (foundations + 4 new
   primitives) first, or commit to all of Phases 0–3? *(Recommend 0+1 first.)*
2. **`status-report` recipe:** add it (Phase 3), or keep status reports under
   existing recipes? *(Recommend add — dogfood shows it's a distinct, common type.)*
3. ~~**`slide-deck`:** build the paged-deck recipe or leave decks to
   `visual-design`?~~ **Resolved: removed from plan** (decks → `visual-design`).
4. **JS-using variants** (`code-panel[tabs]`, table `data` sort/filter): accept
   the progressive-enhancement bar (works with JS off), or keep the skill fully
   zero-JS? *(Recommend accept PE; it's already allowed by authoring.md.)*
