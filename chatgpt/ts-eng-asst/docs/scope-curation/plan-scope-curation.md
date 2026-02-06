# Implementation Plan: Scope Curation + Reduced Interview UX (TS-SoW)

**Spec:** `chatgpt/ts-sow/docs/spec-ts-sow.md`

## Description

Improve the TS-SoW (engagement letter) ChatGPT user flow so users answer fewer questions, can provide “bulk input anytime”, and can optionally curate the generated Statement of Work scope (especially industry-specific analysis) without having to manually delete large blocks. This keeps the existing **“generate”** hard gate and keeps Canvas as the single source of truth, while making scope bullets properly nested/indented (top-level bullets vs sub-analysis).

## Scope

- In:
  - Fewer “interview questions” by asking only what’s missing and by supporting bulk input parsing from any user message.
  - Keep Canvas as the authoritative place values live; chat stays minimal.
  - Add a “scope curation” step where users can include/exclude top-level scope bullets (and optionally sub-bullets).
  - Fix bullet indentation by introducing explicit nesting/levels in the scope library (instead of relying on “default vs industry” to decide indentation).
  - Keep the “generate” gate (no document generation unless the user types `generate`).
- Out:
  - Changing legal wording in templates.
  - New templates or external integrations.
  - Fully reworking the placeholder schema beyond what’s needed to support the improved UX and scope selection.

## Tasks

### Phase 1: Decide the new conversation structure

Define what the user sees and when, without changing the underlying legal constraints.

- [x] 1.0 Define umbrella groups (3 + scope)
  - [x] 1.1 Umbrella groups: (1) deal setup (2) parties (3) terms (4) scope of work (curate)
  - [x] 1.2 Prompts: 2–3 short prompts per group, grouped as bullets, written in natural language (no schema/key names)
  - [x] 1.3 “Never ask if known” + “bulk fill anytime”: any user message or upload is parsed into all matching fields and pushed into Canvas immediately
  - [ ] 1.4 Validation: write 2–3 example conversations (short) showing (a) interview-only, (b) bulk paste, (c) document upload + gap fill

#### Draft question sets (natural language, 2–3 per group, multiple choice)

Notes:
- The assistant should **skip any question it already knows** from the user’s message or from document ingestion.
- The user can answer with the option letters (a/b/c) or respond in normal text; the assistant still parses and fills Canvas.
- These are “starter defaults”; implementation should keep questions short and avoid any schema/key names in the user-visible text.

**Group 1 — deal setup**
- is this buy side or sell side?
  - (a) buy side
  - (b) sell side
- what’s the project code name?
  - (a) use what’s in the uploaded document
  - (b) i’ll type it: ___
- what industry best matches the target?
  - (a) healthcare
  - (b) tech
  - (c) manufacturing
  - (d) other: ___

Implementation mapping (internal):
- buy side / sell side → `TEMPLATE_TYPE`
- project code name → `PROJECT_CODE_NAME`
- industry → `INDUSTRY`
- deal type / deal description: ask *only if still required and unknown* after side selection
  - buy side: “deal type?” (a) investment in (b) acquisition of (c) other: ___ → `CHOICE_DEAL_TYPE`
  - sell side: “how would you describe the transaction?” (a) potential divestment (b) auction process (c) other: ___ → `DEAL_DESCRIPTION`

**Group 2 — parties (client + target)**
- how should we capture the client details?
  - (a) extract from uploaded document
  - (b) i’ll paste the client signature block
  - (c) i’ll type it in chat
- how should we capture the target details?
  - (a) extract from uploaded document
  - (b) i’ll paste a target summary
  - (c) i’ll type it in chat
- is there a private equity owner / sponsor to include?
  - (a) yes (i’ll provide it)
  - (b) no
  - (c) not sure

Implementation mapping (internal):
- group 2 should primarily populate “client information” + “target information” schema fields
- “PE owner / sponsor” should populate the relevant sponsor/owner field(s) (exact key(s) depend on template/schema)

**Group 3 — terms (timing + team + fees + required disclosures)**
- do you have key dates ready (letter date + commence + delivery)?
  - (a) yes (i’ll provide them)
  - (b) no / not sure
- do you have the engagement team names ready?
  - (a) yes (i’ll provide them)
  - (b) no / not sure
- how are fees stated?
  - (a) a range
  - (b) fixed fee
  - (c) other: ___

Implementation mapping (internal):
- group 3 should populate “dates & timing”, “team”, “fees & invoicing”, and any *required* “relationship disclosures”
- the assistant should still “bulk fill anytime”: if the user pastes fee ranges, SEC status, report format, etc., populate immediately and do not re-ask

**Group 4 — scope of work (curate)**
- do you want to review the proposed scope items before generation?
  - (a) yes (show scope checklist)
  - (b) no (use defaults)
- if yes: “uncheck anything that doesn’t apply”
  - default: all checked
  - show top-level bullets only; sub-bullets follow the parent by default

### Phase 2: Update the assistant prompt + Canvas format (UX only)

Adjust the system prompt so the GPT’s behavior matches the intended UX while keeping Canvas as the source of truth.

- [x] 2.0 Update `dist/ts-engagement-assistant.md` to match the desired flow
  - [x] 2.1 Replace “2 interview groups” with 3 groups + SoW curation step (deal setup / parties / terms / scope)
  - [x] 2.2 Explicitly require “bulk fill anytime”: parse any user message or upload into Canvas immediately
  - [ ] 2.3 Ask only what’s missing and required (2–3 questions per group, in batches)
  - [x] 2.4 Keep chat minimal: do not re-list filled values in chat; Canvas is the source of truth
  - [x] 2.5 Ensure Canvas stays short: show required fields + filled optional fields (do not dump the full schema)

### Phase 3: Add a scope selection model (data + UI)

Give users control over what scope content is inserted, with defaults that avoid extra work.

- [x] 3.0 Define and implement a “scope selection” UX that works in Canvas (simple, no modes)
  - [x] 3.1 Selection granularity: top-level bullets only; children follow the parent
  - [x] 3.2 Default behavior: everything included; user unchecks what doesn’t apply
  - [x] 3.3 Canvas design: “scope of work” checklist with stable ids (default checked)
  - [x] 3.4 Missing selection behavior: if the user never unchecks anything, include all
  - [x] 3.5 “Smart surfacing” rules (keep the list short)
    - Show section headings (e.g., “business overview”, “quality of earnings”) as plain text (not selectable)
    - Under each section, show only **top-level** bullets as checkboxes
    - Under each checked top-level bullet, render child bullets as indented plain bullets for context (not separately selectable)
    - Keep ids user-ignorable: use global ids like `scope.001` (not section-key ids)

### Phase 4: Introduce explicit nesting in the scope library (indentation fix)

Fix “sub-analysis is not visually nested” by making nesting explicit in the JSON and having the generator honor it.

- [ ] 4.0 Extend `dist/scope-library.json` to support nested bullets
  - [ ] 4.1 New bullet representation (supports nesting + stable ids)
    - `ScopeBullet = {"id": "revenue_analysis.99519c05", "text": "…including:", "children": [ScopeBullet, ...]}`
    - Backward compatibility: generator supports both legacy string bullets and new objects during migration
  - [ ] 4.2 Deterministic parent/child rules (what changes and why)
    - Parent bullets: lines ending with `:` become parents
    - Child bullets: following lines attach under the nearest parent until a “new directive” bullet starts (e.g., starts with “obtain / analyze / perform / consider …”)
    - Nested parents: a `:` line inside an existing parent becomes a nested parent (depth 3 is allowed)
    - This is the exact mechanism that fixes cases like “obtain…including:” + list items being incorrectly rendered at the same level today
  - [ ] 4.3 Generate and review a migration report (the authoritative “which bullets change” list)
    - [x] 4.3.1 Produce a markdown report showing the exact parent/child structure per section and per industry
    - [ ] 4.3.2 Review the report for obvious mis-groupings; adjust rules or add small explicit overrides where needed
  - [ ] 4.4 Apply the migration to the scope library files
    - [ ] 4.4.1 Update `dist/scope-library.json` (used by the GPT + dist generator)
    - [ ] 4.4.2 Keep `reference/fdd_scope_library.json` in sync (used by existing local test scripts)
  - [ ] 4.5 Validation: spot-check a few known-problem sequences to confirm nesting/indentation matches the intended hierarchy

#### Current review artifacts (created during planning)

- `chatgpt/ts-sow/docs/scope-curation/fdd-scope-nesting-report.md`: draft “which bullets change” report generated from today’s JSON
- `chatgpt/ts-sow/docs/scope-curation/fdd-scope-top-level-summary.md`: quick summary of “how many items the user will see” per section/industry
- `chatgpt/ts-sow/docs/scope-curation/screenshots/buyside-healthcare-scope-08.png`: example page where scope starts (for visual reference)
- `chatgpt/ts-sow/docs/scope-curation/screenshots/buyside-healthcare-scope-09.png`: continuation (useful to inspect nested bullets)
- `chatgpt/ts-sow/docs/scope-curation/screenshots/sellside-healthcare-scope-08.png`: sellside example page where scope starts

#### Exact scope-library change (what will be modified)

Today, each section’s bullets are a flat list of strings. During implementation we will:

0) Current implementation (no schema changes)
- Nesting + indentation are inferred using a deterministic heuristic (colon-parents + “new directive” boundaries).
- Stable ids are generated in insertion order as global ids (`scope.001`, `scope.002`, ...).
- This is implemented in:
  - `chatgpt/ts-sow/dist/el-generate.py`
  - `chatgpt/ts-sow/reference/helper_functions.py`

1) Convert “flat” lists into a nested bullet tree
- Every bullet string becomes either:
  - a parent `ScopeBullet` object with `children` (if it ends in `:`), or
  - a leaf `ScopeBullet` object (no children)
- Bullets that become **children** are the exact ones listed under each parent in `chatgpt/ts-sow/docs/scope-curation/fdd-scope-nesting-report.md`.
- Result: those child bullets are no longer “top-level” items shown to users as checkboxes.

2) Assign stable ids to top-level bullets for user selection
- Each `ScopeBullet` gets an `id` that is stable across edits.
- Proposed id scheme (to keep ids user-ignorable): a global id like `scope.001` plus a stable internal key stored in JSON (used for diff/migration).
- The user-facing Canvas checklist shows ids only for **top-level** bullets; children follow the parent automatically.

3) Keep both scope library copies in sync
- `dist/scope-library.json` is the one referenced by the GPT/generator in dist.
- `reference/fdd_scope_library.json` is used by existing local scripts; keep it identical to avoid drift.

### Phase 5: Update the generator to render nested bullets + apply selection

Make `el-generate.py` insert bullets with correct indentation and omit excluded items.

- [x] 5.0 Update `dist/el-generate.py` scope insertion (heuristic-based)
  - [x] 5.1 Infer nesting from colon-parents; indent by depth (top-level vs sub-analysis)
  - [x] 5.2 Support user selection via `scope_selection.excluded_top_level_ids` (skip unchecked parents + all their children)
  - [x] 5.3 Default: if no selection, include everything
  - [ ] 5.4 Validation: extend `chatgpt/ts-sow/scripts/test-scope-replacement.py` to generate a doc with one excluded id and visually confirm omission + indentation

### Phase 6: End-to-end validation (non-technical checklist)

Confirm the overall experience is simpler and the generated document looks correct.

- [ ] 6.0 Manual validation checklist (for a non-technical user)
  - [ ] 6.1 Flow: start → pick template → paste details → see Canvas fill → missing required fields list stays short
  - [ ] 6.2 Upload: upload a document → Canvas fills with extracted values → only asks for gaps
  - [ ] 6.3 Scope curation: uncheck 2–3 bullets → generated doc omits those areas
  - [ ] 6.4 Formatting: visually confirm nested bullets are indented correctly in the final `.docx`

## Context

**Key files:**
- `chatgpt/ts-sow/dist/ts-engagement-assistant.md`: current system prompt that defines the ChatGPT user flow and Canvas rules
- `chatgpt/ts-sow/dist/el-placeholder-schema.json`: source of truth for all placeholders, required flags, and grouping metadata
- `chatgpt/ts-sow/dist/scope-library.json`: industry scope content with nesting/ids for selection + indentation
- `chatgpt/ts-sow/dist/el-generate.py`: generation pipeline; scope insertion + indentation logic lives here
- `chatgpt/ts-sow/scripts/test-scope-replacement.py`: likely place for an automated “generate and inspect” check

## Open Questions

- None (current decisions)
  - Umbrella groups: 3 groups + scope curation step
  - Prompts: 2–3 short, bulleted, multiple-choice questions per group; user can answer in free text
  - Modes: no “basic/advanced”; keep one simple flow
  - Scope selection granularity: top-level bullets surfaced; children follow parent
  - Defaults: everything included; user unchecks what doesn’t apply

## Optional Add-ons

**Assumptions**

- Canvas remains the single source of truth; chat stays minimal and does not restate values.
- Required-field gating remains unchanged: no `generate` without all required variables.
- Scope bullets will be assigned stable ids to support selection without relying on exact text matching.

**Design Decisions**

| Aspect | Decision |
| ------ | -------- |
| Umbrella groups count | 3–4 groups (not 7) |
| Bulk input | Always parse any user message into fields |
| Scope selection UI | Canvas checkboxes keyed by bullet ids |
| Nested bullets | Explicit JSON structure (no indentation guessing at render time) |
