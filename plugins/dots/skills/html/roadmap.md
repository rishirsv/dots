# html skill — roadmap

Goal: **first-in-class HTML artifacts across every use case a working session
produces** — each one performant, self-contained, and visually stunning at the
treatment the content deserves. The skill already has the hard part right: a
token identity, a component catalog instead of page templates, and hard
identity rules. What it lacks is **genre depth** (the recurring artifact types
have no strong defaults), **iteration** (artifacts are living documents, but
the contract is one-shot), and **media** (images, screenshots, and diagrams are
bolted on, not core).

Evidence base: Codex sessions from 2026-07-06 mined via self-improve —
travel plan thread `019f39e6` (living document, imagegen invoked manually,
"should read as a beautiful travel guide"), PR-explainer threads `019f39e8` and
`019f39ea` (explain + html chained by hand, twice), comparison-board thread
`019f39fb` ("visually interesting, like reading a magazine article for PR"),
plus the user's direct observations on plan rendering.

---

## Principles (what "first in class" means here)

- **Genres, not templates.** The catalog philosophy stays: form follows the
  content's job. A "genre" is a documented default composition + a maintained
  exemplar + a content contract (what must be present for the artifact to be
  complete). It is a strong starting point the model deviates from with
  reason — never a fill-in-the-blanks page.
- **An artifact is a living document.** Most real artifacts get edited five
  more times with the browser tab open. Authoring must produce pages that are
  cheap to edit surgically, and the skill must treat "update the artifact"
  as a first-class entry point, not a re-render.
- **Performance is a budget, not a vibe.** Numbers, enforced by a script.
- **Media earns its place.** Images and diagrams are core when the genre
  calls for them (travel guide, explainer hero, PR screenshots) and banned
  as decoration everywhere else.
- **Nothing external, ever.** The self-contained rule is the moat. No CDN,
  no framework runtime, no build step in the artifact itself.

---

## Phase 1 — Genre system (the demand is proven; do this first)

### 1.1 Plan genre: full parity with a Markdown plan, plus visual structure
The current `implementation-plan.html` exemplar is a summary, not a plan.
A rendered plan must be the **superset** of the Markdown plan it replaces —
if the reader would ever need to open the .md, the artifact failed.

Default composition:
- Hero: goal in one sentence, status pill, scope-in/scope-out pair.
- Phase timeline (existing `timeline` fragment) with per-phase status.
- **Implementation checklist** — every task as a real checkbox, grouped by
  phase, with file paths as code spans. Checkbox state persists to
  `localStorage` so the plan tracks execution across days. Degrades to
  static checkmarks with JS off.
- File-touch map (which files each phase changes) via `data-table`.
- Risks/open questions as callouts; acceptance criteria per phase via
  `disclosure` so detail is present but not oppressive.
- Verbatim-detail rule: every constraint, command, and edge case from the
  source plan appears somewhere (disclosure is fine; omission is not).

Acceptance: render an ultraplan output; a reader can execute the plan without
ever opening the source Markdown.

### 1.2 PR-explainer genre: the explain+html chain becomes one default
Two threads in one day chained explain + html manually. Make "HTML explainer
of this PR" a named genre with a non-technical default register:

- Audience defaults to **non-technical**; a depth toggle (or layered
  sections) carries the engineer-level detail below the plain-language pass.
- Structure: what changed and why (one paragraph, zero jargon) → concept
  glossary (each technical term the PR forces, explained once) → guided
  walkthrough section per user-visible behavior → annotated diffs
  (`diff-block`) only inside disclosures → before/after screenshots
  mandatory for any UI change → "what could break" honesty section.
- Diagrams by default where flow changed (`flow-diagram`).
- Content contract: someone who cannot read code finishes the page able to
  say what the PR does and why it's safe.

Acceptance: point at a PR number; the skill produces the explainer with no
manual explain-skill chaining.

### 1.3 Comparison-board genre
Proven twice (PR-body A/B with screenshots; ticket-option comparison).
Default composition: `comparison-grid` at page scale — N columns or stacked
panels, each variant labeled, a criteria `data-table` scoring them, and a
`recommendation` block that actually picks one. Screenshots and embedded
fragments both supported as panel content.

### 1.4 Genre routing table in SKILL.md
A short table mapping ask → genre → default composition, so the model (and
the user) stops improvising: plan, PR explainer, comparison board, status
brief, research report, review verdict, guide (see 3.1), showroom (see 4).
Each genre gets a maintained exemplar in `assets/exemplars/`.

---

## Phase 2 — Living documents (iteration as a contract)

- **Third entry point** alongside handoff and pointed-at-source: **update**.
  When the target file exists, the skill edits it surgically — never
  regenerates — and the identity rules apply to the diff, not just fresh
  pages.
- **Authoring for editability**: every section gets a stable, meaningful
  `id`; section boundaries are clean; no cross-section CSS coupling. A
  future session (or another agent) can replace one section blind.
- **Artifact manifest**: an HTML comment block at the top of every artifact
  recording genre, sources (paths, PR numbers, thread context), section map,
  and last-updated stamp. An update session reads the manifest instead of
  reverse-engineering the page.
- **Provenance footer** grows a revision line ("updated 2026-07-06: added
  flight confirmations") so shared artifacts show their history.

Acceptance: the travel-plan thread's edit sequence ("remove X", "add my
confirmations", "don't add ticket info until finalized") works as cheap
targeted edits with zero identity drift.

## Phase 3 — Media as a core capability

- **Imagegen integration**: the skill decides when images earn their place —
  genre-driven (guide hero and section art: yes; status brief: no) — and
  invokes the platform's image-generation skill itself instead of waiting
  for the user to name it. Images embed as optimized data URIs or sibling
  files with a size budget (see Phase 5). Prompt guidance lives in a new
  `references/media.md`: consistent art direction per artifact, not one-off
  images that fight the identity.
- **3.1 Guide genre (editorial treatment, formalized)**: the travel-guide /
  "magazine article" ask, twice in one day. Editorial tier gets a real spec:
  full-bleed hero image, section art, pull quotes, generous scale — as a
  documented treatment with its own exemplar, still on the same tokens.
  Consider a sibling `DESIGN.md` variant (warmer palette) generated through
  the existing theme pipeline for lifestyle content.
- **Screenshot pipeline**: PR explainers and comparison boards need real
  screenshots. Document the capture path (browser tooling / simulator
  tooling already in the toolbox) and the embed rules (max width, borders,
  dark-mode handling, alt text).
- **Diagram library expansion**: `flow-diagram` is one shape. Add inline-SVG
  fragments for sequence (A calls B calls C), architecture blocks
  (boxes + boundaries), and state (before/after). These carry the
  non-technical PR explainers.

## Phase 4 — Prototype showroom

Scale the skill up to hosting: a **showroom** genre where a reader scrolls
through N prototype variants and picks a winner.

- Each prototype renders in a sandboxed `<iframe srcdoc>` panel — the
  showroom's identity chrome never leaks in, the prototype's styles never
  leak out. Self-contained rule holds: srcdoc, not file references.
- Per-variant: label, one-paragraph design intent, tradeoff notes, and a
  "winner" affordance (localStorage, same pattern as plan checkboxes) so the
  user's pick survives the session.
- Boundary stays honest: **visual-design builds the prototypes; html builds
  the showroom.** The genre's contract is "given N HTML variants (from
  visual-design, Matt Pocock-style prototype skills, or anywhere), present
  them for judgment." This is an explicit carve-out to the "no product UI"
  boundary — hosting, not building.
- Stretch: side-by-side compare mode (two iframes synced-scrolled) for
  close-call variants.

## Phase 5 — Performance and verification as code

The verification checklist is prose today; make it a script.

- `scripts/verify-artifact.mjs <file.html>` checks: zero external requests,
  total size budget (target ≤ 500 KB including images; hard warn beyond),
  JS-off completeness (content present without script), reduced-motion
  coverage on every animation, dark-mode token usage, heading/landmark
  structure, contrast on token pairs, and identity-rule lint (accent-stripe
  patterns, chip count, letter-spaced uppercase labels).
- Explicit budgets in `references/authoring.md`: first paint instant from
  file://, no layout shift after load, motion compositor-only
  (transform/opacity), images sized to display resolution.
- The skill runs the verifier before handoff the way generate-theme has
  `--check` — verification becomes evidence, not intention.

## Phase 6 — Delivery polish

- One documented delivery flow per surface: Claude artifact tool, Codex
  in-app browser (file:// open), and a tiny repo-owned static-serve helper
  replacing today's ad-hoc `localhost:8765`.
- Output-location convention (`.agents/outputs/<topic>/<slug>.html`) and
  naming rules, so artifacts are findable across sessions.
- Print stylesheet in theme.css: every artifact exports to a clean PDF —
  the non-technical audience for PR explainers often gets a PDF, not a URL.

---

## Explicitly not doing

- **No page templates.** Genres are default compositions with exemplars;
  the registry stays the unit of reuse.
- **No framework runtime, no build step in artifacts.** Vanilla HTML/CSS
  with choreographed vanilla JS is the ceiling; it's also why the pages are
  fast.
- **No new identity per genre.** One token system; editorial is a treatment
  (and at most a sibling theme through the existing pipeline), not a fork.
- **No form-state product UI.** The showroom hosts prototypes; anything with
  real application state routes to visual-design, unchanged.

## Sequencing rationale

Phase 1 first because every piece is demanded by an actual session from the
last 24 hours. Phase 2 second because iteration friction compounds — every
artifact shipped before it is more expensive to update. Media (3) before
showroom (4) because the showroom's wow depends on the media pipeline.
Verification (5) can start anytime; it's listed fifth only because it gates
nothing. Each phase ends with its exemplar checked into `assets/exemplars/`
and the atlas regenerated.
