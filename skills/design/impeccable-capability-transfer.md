# Impeccable Capability Transfer Map For `design`

Date: 2026-05-02

## Goal

Create our own RS Tools `design` skill by studying Impeccable capability by capability and deciding what to port directly, what to adapt, and what to leave behind.

This file is a shaping document, not the final skill.

## Core Read

Impeccable's public docs describe it as **1 skill with 23 commands**. Its model is a single design intelligence with specialized modes for create, evaluate, refine, simplify, harden, and system work. The docs explicitly say the point is a shared design vocabulary with commands that encode specific design disciplines.

That command taxonomy is valuable. The exact command surface is too large for RS Tools.

Our target should be:

- one explicit `design` skill
- fewer user-facing lanes
- Impeccable references ported mostly intact behind those lanes
- repo context first, especially existing `docs/DESIGN.md`, product specs, review docs, and app conventions
- no mandatory `PRODUCT.md` preflight gate
- no pin/unpin command management

## Transfer Decision Legend

- **Direct port**: carry over the implementation guidance with minimal edits.
- **Adapt**: keep the capability, but reshape it for RS Tools conventions.
- **Park**: keep as reference material, but do not expose in the first `design` skill.
- **Skip**: do not carry forward.

## Capability Map

| Impeccable capability | Category | Transfer | RS Tools lane | Why |
|---|---|---:|---|---|
| `/impeccable` home command | Create / route | Adapt | `design` router | Keep the central router idea, but reduce commands and make it explicit-only. |
| `craft` | Create | Adapt | `build` | Strong shape-then-build-then-inspect loop, but its hard gates and mandatory mock logic need softening for product/native work. |
| `shape` | Create | Adapt | `shape` | Excellent discovery brief. Must coordinate with our existing `scope` skill and avoid duplicating general ideation. |
| `audit` | Evaluate | Direct port with light adaptation | `audit` | The 5-dimension technical audit is strong and practical. Add stack-agnostic/native variants. |
| `critique` | Evaluate | Adapt | `critique` | Strong design review model, but required subagents conflict with our runtime policy unless user authorizes delegation. |
| `animate` | Refine | Direct port as reference | `polish` / `motion` lens | Strong motion rules. Keep as a reference, not a top-level user lane at first. |
| `bolder` | Refine | Adapt | `polish` lens | Useful for bland brand surfaces; dangerous for Steady-style product UI. Make it context-sensitive. |
| `colorize` | Refine | Direct port as reference | `polish` / `visual` lens | Good strategic color guidance. Product default should stay restrained. |
| `delight` | Refine | Adapt | `polish` lens | Useful for empty/success/loading moments; for Steady it should be quiet and earned. |
| `layout` | Refine | Direct port | `polish` / `critique` lens | Strong spacing, hierarchy, rhythm, density guidance. Highly relevant to Steady and Capital Next. |
| `overdrive` | Refine | Park | maybe future `brand`/`hero` lane | Too spectacle-heavy for product UI. Useful for rare landing/brand hero moments. |
| `quieter` | Refine | Direct port as reference | `polish` lens | Very relevant. Product UIs often need de-emphasis, calmer density, less visual noise. |
| `typeset` | Refine | Direct port with adaptation | `typography` lens | High-value capability. Need native/platform language, not just CSS/web. |
| `adapt` | Simplify | Direct port with adaptation | `harden` / `responsive` lens | Strong principle: adapt, do not amputate. Needs native/mobile equivalents. |
| `clarify` | Simplify | Adapt | `copy` lens | Good UX copy capability, but avoid name collision with our `scope` clarify lane. Call it UX copy inside `design`. |
| `distill` | Simplify | Direct port | `polish` / `critique` lens | Strong subtractive design pass. Useful for dense product surfaces. |
| `harden` | Harden | Direct port with adaptation | `harden` | One of the best capabilities for Steady. Port strongly. Add SwiftUI/native resilience equivalents. |
| `onboard` | Harden | Adapt | `harden` / `product` lens | Useful for empty states and activation. Keep as a capability, not a separate lane initially. |
| `optimize` | Harden | Adapt | `audit` / `harden` lens | Web performance guidance is strong, but needs stack-specific branching. |
| `polish` | Harden | Direct port with adaptation | `polish` | Core lane. Keep meticulous pass logic but route through repo screenshots/runtime conventions. |
| `document` | System | Adapt | `context` | Keep DESIGN.md generation/refresh idea. Use repo convention first; do not require Google Stitch format unless chosen. |
| `extract` | System | Adapt | `system` / future | Useful but close to design-system refactor work. Keep later or fold into tech debt/design-system pass. |
| `live` | System / alpha | Park | future | Powerful but script-heavy and web/HMR-specific. Not first version. |
| `teach` | System | Adapt | `context` | Keep codebase-first interview and register idea. Do not require PRODUCT.md or overwrite repo conventions. |
| `pin` / `unpin` | Management | Skip | none | Not aligned with RS Tools. We do not want this skill writing shortcut skills into harness folders. |

## Shared Foundation Transfer

### Product vs Brand Register

**Decision: direct port the concept, adapt the persistence.**

Impeccable's docs make register central: brand surfaces are where design is the product; product surfaces are where design serves the task. This is extremely useful for Steady and Capital Next.

Transfer:

- Keep `brand` vs `product` as a first-order design decision.
- Default Steady and Capital Next to `product`.
- Allow per-surface override for launch pages, public marketing, onboarding, and App Store-ish surfaces.
- Store or read the register from repo design context if present; do not require `PRODUCT.md`.

### Context Pair: PRODUCT.md And DESIGN.md

**Decision: adapt.**

Impeccable uses `PRODUCT.md` for strategy and `DESIGN.md` for visual system. The split is good, but RS Tools already has broader artifact conventions.

Transfer:

- Prefer existing repo sources first: `docs/DESIGN.md`, product specs, contexts, review docs, app code, tokens, previews, and shipped screens.
- Treat `PRODUCT.md` as one possible source, not the required source.
- If design context is missing, offer a `context` lane that creates or refreshes the repo's chosen design context.

### Shared Design Laws

**Decision: direct port selectively.**

Keep:

- avoid generic AI UI
- cards are not the default answer
- no nested cards
- avoid gradient text
- avoid decorative glassmorphism
- no lazy hero metric template
- theme should come from user context, not category reflex
- motion must communicate state
- every word earns its place

Adapt:

- OKLCH and CSS-specific rules become web guidance, not universal rules.
- "No em dashes" conflicts with our broader writing style guidance only if treated as global. Keep it as UI-copy guidance if wanted, not system-wide behavior.
- Font ban lists should be used as warning heuristics, not absolute across all product UI.

### Product Register Rules

**Decision: direct port heavily.**

This is the most relevant part for Steady.

Keep:

- design serves the task
- earned familiarity matters
- restrained color default
- standard navigation and controls are features
- one well-tuned sans/system family is often right
- every interactive component needs states
- motion conveys state, not atmosphere
- density is allowed when users need it

Adapt:

- Translate web-specific examples into native/platform examples when the repo is native.
- In Steady, use "trustworthy training log" as the product taste: calm, durable, readable, resilient.

### Brand Register Rules

**Decision: keep as reference, not default.**

Useful for landing pages, portfolios, marketing surfaces, launch screens, and public pages. Not the default for Steady app surfaces.

Transfer:

- Keep distinctiveness, imagery, stronger typography, and richer color strategies for brand work.
- Keep reflex checks against generic category aesthetics.
- Do not let brand rules bleed into product UI unless the user explicitly asks.

## Recommended RS Tools Lanes

The new `design` skill should not expose all 23 Impeccable commands. It should expose a smaller set of lanes and load the ported references as needed.

### 1. `shape`

Purpose: define a design brief before a significant new surface.

Port from:

- `shape`
- parts of `craft`
- product/brand register

Changes:

- Coordinate with `$scope`; if the request is broad idea shaping, use Scope. If the product goal is already clear and the missing piece is design intent, use `design shape`.
- Ask fewer questions for existing product surfaces when repo docs already answer them.
- Save a brief only when the user wants a durable artifact.

### 2. `build`

Purpose: design and implement a new or redesigned UI surface.

Port from:

- `craft`
- OpenAI/frontend build guidance
- visual direction probes from `shape`/`craft`

Changes:

- Keep structure -> hierarchy -> type/color -> states -> motion -> responsive order.
- Require visual/runtime inspection when feasible.
- Make image generation optional and value-driven for product UI, not mandatory.
- For native repos, use screenshots/previews/simulator instead of browser-only evidence.

### 3. `critique`

Purpose: assess a surface without editing first.

Port from:

- `critique`
- cognitive load
- heuristics scoring
- personas
- design-audit scorecard shape

Changes:

- Subagents only when explicitly authorized and runtime allows.
- Default output concise: findings first, ranked by user/product risk.
- For Steady, read review guidance and product specs before judging.

### 4. `audit`

Purpose: technical UI quality review.

Port from:

- `audit`
- design-audit
- accessibility/responsive/performance checks

Changes:

- Keep compact scorecard when useful.
- For native, replace semantic HTML/CSS checks with platform equivalents: accessibility labels, Dynamic Type, dark/light mode, navigation state, preview/simulator evidence.

### 5. `polish`

Purpose: improve an existing UI surface.

Port from:

- `polish`
- layout
- typeset
- quieter/bolder/colorize/delight as lenses

Changes:

- Product default: quiet, trustworthy, readable, resilient.
- Brand default: more distinctive and image/type-led.
- Fix 1-3 high-impact issues per pass.

### 6. `harden`

Purpose: make UI production-ready.

Port from:

- `harden`
- adapt
- onboard
- optimize where relevant

Changes:

- Hardening should be first-class for Steady.
- Include long text, no data, huge data, sync/offline/errors, permission states, Dynamic Type, dark/light, reduced motion/transparency, responsive/device size, keyboard/focus, i18n/RTL where applicable.

### 7. `context`

Purpose: create or refresh design context only when explicitly requested.

Port from:

- `teach`
- `document`
- parts of `extract`

Changes:

- Do not require `PRODUCT.md`.
- Prefer existing repo convention.
- If the repo has `docs/DESIGN.md`, update that.
- If the repo has a different context/spec setup, follow it.
- Ask before overwriting durable context.

### 8. `mockup` Or Visual Probe

Purpose: explore visual direction with image generation.

Port from:

- `shape` visual probes
- `craft` north-star comps
- local `interface-mockups`

Changes:

- Keep as a capability inside `shape`/`build` initially.
- Split into a separate skill only if image mockups become frequent.

## Command-By-Command Notes

### `/impeccable`

Direct idea: central router.

Our change: `design` should not show a 23-command menu by default. It should infer a lane from the explicit request and ask one concise clarification only when lane choice materially changes the work.

### `craft`

Direct ideas to port:

- shape before build
- references loaded based on the brief
- implementation order matters
- visual/runtime iteration is required
- first working version is not shipped quality

Adapt:

- Remove hard dependency on `PRODUCT.md`.
- Change `browser evidence` to `runtime evidence` so native previews/simulator count.
- Make generated visual comps mandatory only when the work is net-new or directionally open and image generation will materially improve the result.

### `shape`

Direct ideas to port:

- design brief as compass, not spec
- purpose, user context, content/data, states, constraints, anti-goals
- ask in rounds, not a giant form
- visual direction probes when helpful

Adapt:

- Avoid duplicating our Scope skill. `design shape` is for UI/design intent, not product ideation broadly.

### `audit`

Direct ideas to port:

- accessibility, performance, theming, responsive, anti-patterns
- P0-P3 severity
- positive findings plus prioritized next actions

Adapt:

- Add native-platform audit branches.
- Keep concise unless the user asks for a deep audit.

### `critique`

Direct ideas to port:

- AI slop detection
- holistic design review
- cognitive load
- emotional journey
- Nielsen heuristics
- persona red flags

Adapt:

- No mandatory subagents unless user authorizes delegation.
- Avoid over-scoring product UI if the user just needs a fast design read.

### `animate`

Direct ideas to port:

- motion communicates state
- transform/opacity over layout animation
- reduced motion fallback
- 150-300ms product ranges

Adapt:

- Translate into native motion idioms when not web.

### `bolder`

Direct ideas to port:

- safe designs sometimes need presence
- amplify scale, contrast, color commitment, composition

Adapt:

- Use sparingly for product UI.
- In Steady, bolder usually means clearer hierarchy, not louder style.

### `colorize`

Direct ideas to port:

- color has roles
- avoid garish palettes
- accent color should be rare and meaningful

Adapt:

- Product default is restrained.
- For Capital Next, financial clarity and trust should outrank decorative color.

### `delight`

Direct ideas to port:

- delight belongs in empty, loading, success, and tiny copy moments
- delight must not carry core usability

Adapt:

- In Steady, delight should be quiet and motivating, not cute.

### `layout`

Direct ideas to port:

- spacing scale
- squint test
- hierarchy through multiple dimensions
- cards are not required
- density must match the task

Adapt:

- Add native layout equivalents and Dynamic Type constraints.

### `overdrive`

Park.

Reason: useful for rare brand/landing moments, but too spectacle-forward for Steady and Capital Next product surfaces.

### `quieter`

Direct ideas to port:

- reduce visual noise without losing intent
- demote secondary actions
- calmer density

Very relevant to product UI.

### `typeset`

Direct ideas to port:

- fewer sizes with clearer hierarchy
- system fonts are legitimate for product UI
- line length and line-height discipline
- font pairing only when needed

Adapt:

- Add SwiftUI/native typography guidance.

### `adapt`

Direct ideas to port:

- adapt, do not amputate
- touch targets
- content priority
- navigation patterns by context

Adapt:

- Include phone/tablet, portrait/landscape, sidebar/sheet, watch for hover-only assumptions.

### `clarify`

Direct ideas to port:

- UX copy should be specific and action-oriented
- errors explain what happened and how to fix
- empty states orient and provide action
- consistent terminology

Adapt:

- Do not name this lane `clarify` in our skill, because `$scope` already owns that term. Use `copy` or treat as a UX-writing lens.

### `distill`

Direct ideas to port:

- subtraction as design
- one job per interface
- remove competing buttons, redundant information, excessive variants

Very relevant to dense product surfaces.

### `harden`

Direct ideas to port:

- extreme inputs
- errors, permissions, network, rate limits
- i18n and RTL
- text overflow/wrapping
- no perfect-data-only designs

Adapt:

- Add native/mobile equivalents: Dynamic Type, safe areas, sheet detents, system appearance, reduced transparency, offline/sync state.

### `onboard`

Direct ideas to port:

- define aha moment
- empty states as activation surfaces
- avoid tours as default answer
- reduce setup friction

Adapt:

- For Steady, onboarding includes first workout, empty progress, no plan, no history, iCloud/sync readiness.

### `optimize`

Direct ideas to port:

- measure before optimizing
- rendering, assets, motion, bundle cost
- rollback if metric does not improve

Adapt:

- For native, include render invalidation, list performance, preview/runtime jank, data loading, and startup cost.

### `polish`

Direct ideas to port:

- final pass between good and great
- small diffs that add up
- alignment, spacing, type, color, states, transitions, copy

Adapt:

- Preserve product truth and repo design context before taste changes.

### `document`

Direct ideas to port:

- durable design context keeps future agents on-brand
- scan current code before writing
- do not overwrite existing design context silently
- distinguish strategy and visual system

Adapt:

- Use repo conventions first.
- Do not force Google Stitch format unless desired.
- For Steady, `docs/DESIGN.md` remains the likely home.

### `extract`

Adapt later.

Useful for design-system consolidation, but it overlaps with tech debt/refactor if it starts changing component architecture.

### `live`

Park.

Reason: powerful and interesting, but script-heavy, HMR/web-specific, and alpha. We can revisit after the core `design` skill exists.

### `teach`

Direct ideas to port:

- scan code before asking questions
- form a register hypothesis
- ask only what cannot be inferred
- separate strategy from visuals

Adapt:

- Do not require `PRODUCT.md`.
- Do not force a project-wide interview for a small design pass.
- Use as explicit `context` lane only.

### `pin` / `unpin`

Skip.

Reason: RS Tools should not let a design skill create shortcut skills or write into harness folders.

## First Version Recommendation

Build `skills/design` as a new draft skill with this tree:

```text
design/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── product-register.md
    ├── brand-register.md
    ├── shape.md
    ├── build.md
    ├── critique.md
    ├── audit.md
    ├── polish.md
    ├── harden.md
    ├── context.md
    └── lenses.md
```

`lenses.md` can initially carry the smaller commands as subsections:

- animate
- bolder
- colorize
- delight
- layout
- quieter
- typeset
- adapt
- copy
- distill
- onboard
- optimize

This keeps the implementation close to Impeccable while avoiding 23 public lanes.

## Open Decisions

1. Should `design shape` create a durable design brief, or only chat output unless requested?
2. Should `context` write `docs/DESIGN.md` only, or support repo-specific alternatives?
3. Should product-vs-brand register be stored anywhere, or inferred per task?
4. Should generated visual probes be allowed for Steady product UI, or only for open-ended/new surfaces?
5. Should `mockup` stay inside `design`, or remain a separate future skill?

## Current Default Answers

1. Chat by default; durable brief only when requested.
2. Use repo convention first; `docs/DESIGN.md` for Steady-style repos.
3. Infer per task from repo context; store only when creating/updating design context.
4. Allow probes for net-new or directionally ambiguous work, but do not require them for routine product UI.
5. Keep mockup inside `design` for now; split later only if it becomes frequent.
