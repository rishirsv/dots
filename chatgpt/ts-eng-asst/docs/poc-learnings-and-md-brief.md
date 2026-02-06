# TS Engagement Assistant POC Learnings and MD Brief

## MD-ready briefing (non-technical)

### What this proof of concept now does well
- Converts a short interview into a legally faithful buyside or sellside engagement letter.
- Preserves approved legal wording by design and only fills placeholders.
- Lets teams optionally remove top-level scope sections before generation.
- Produces a downloadable `.docx` with dynamic numbering and appendix structure intact.

### Why this matters
- Reduces turnaround time for first-draft engagement letters.
- Reduces drafting inconsistency across teams and industries.
- Keeps legal risk lower than freeform generation by constraining output to approved templates.

### What changed to make it reliable
- We moved from “assistant improvisation” to explicit runtime contracts.
- We removed avoidable interview friction by deriving defaults where practical.
- We hardened scope selection so exclusions map reliably to generator behavior.
- We added checks that prevent prompt drift and hidden regressions.

## Core learnings from this and related iterations

## 1) Reliability improves when invocation is contract-based
- Problem seen: inconsistent generator calls (`import` path mistakes, positional/flag mismatch, retries without clarity).
- Learning: one canonical subprocess contract must be preserved in the system prompt.
- Implementation pattern:
  - Always call `el-generate.py` via flags.
  - Retry once, then surface error text.
  - Keep back-compat parsing in generator for positional legacy calls.

## 2) Long JSON in CLI args is brittle
- Problem seen: `OSError: [Errno 36] File name too long` when variable payload was treated as a path.
- Learning: write variables to a temp JSON file and pass file path to `--variables`.
- Current state: this is now part of immutable prompt contract and generator-compatible behavior.

## 3) Canvas must be review-only, not truth source
- Problem seen: canvas patch failures blocked generation even when values were captured.
- Learning: working variables are source of truth; Canvas is a re-rendered review layer.
- Rule adopted:
  - Re-render full Canvas each turn.
  - Never perform partial-line patch edits.
  - If Canvas fails, continue using working variables and warn briefly.

## 4) Ask less: derive/default more
- Problem seen: over-questioning and hard gates on fields users do not care about during intake.
- Learning: only ask user-facing required fields; derive secondary fields deterministically.
- Current examples:
  - `BILLING_ENTITY_NAME` derived from `CLIENT_LEGAL_NAME` unless override.
  - Date defaults (`LETTER_DATE`, `DATE_COMMENCE`, `TBD` fields) auto-applied.
  - Report format defaulted when not specified.

## 5) Conditional legal sections must be deterministic
- Problem seen: independence/SEC logic created strictness and wrong asks for non-applicable scenarios.
- Learning: section applicability should be explicit and enforced in generator.
- Current behavior:
  - If independence does not apply, generator removes that section block.
  - `CHOICE_SEC_STATUS` is required only when independence applies.

## 6) Scope controls should be at section level
- Problem seen: child-level scope controls were too complex for chat UX.
- Learning: users need quick top-level control, not deep bullet editing in-chat.
- Current behavior:
  - Pre-generate scope review shows section-level include/exclude only.
  - Child bullets remain hidden and can be edited later in Word if needed.

## 7) Section-key exclusion is safer than id-only exclusion
- Problem seen: id-level exclusions missed industry-specific equivalents (for example, debt-like sections).
- Learning: use `excluded_section_keys` as primary exclusion contract.
- Improvement added:
  - `concept_aliases` + `concept_to_sections` allow concept-wide expansion (for example, debt concept).
  - Bucket config helps users express intent in plain language.

## 8) Numbering quality in Word requires template-aware handling
- Problem seen: numbering drift when scope sections were added/removed.
- Learning: clone numbering archetypes from template and restart sequences per tier.
- Result:
  - Tier 1 remains numeric by section.
  - Tier 2 lettering resets within each section.
  - Tier 3 roman formatting remains stable under parent bullets.

## 9) Appendix boundaries are fragile and must be preserved
- Problem seen: scope insertion/removal risked pushing content into wrong appendix context.
- Learning: preserve section-break paragraphs during scope replacement.
- Result: scope remains in Appendix A while terms/conditions structure remains intact.

## 10) Mined content must be curated before productization
- Problem seen: one-off deal artifacts leaked into shared scope content.
- Learning: mined data is a starting point, not production truth.
- Operational rule:
  - Remove dated/project-specific artifacts.
  - Keep `dist/`, `reference/`, and exported docs synchronized.
  - Run spelling/export checks after scope edits.

## 11) Prompt budget pressure needs structure, not trimming hacks
- Problem seen: behavior regressions when trying to fit within system prompt limits.
- Learning: separate immutable runtime contracts from advisory playbook content.
- Controls in place:
  - Prompt budget checker (`<= 7200` target headroom under 8000 cap).
  - Immutable snippet presence assertions.
  - Structural marker assertions for critical behavior.

## 12) Terminology alignment reduces user confusion
- Problem seen: “working capital and debt” vs “balance sheet analysis” and scope phrasing ambiguity.
- Learning: bucket labels and aliases should map user language to canonical section keys.
- Current state:
  - `working_capital`, `net_debt`, and `locked_box` grouped under `Balance Sheet Analysis`.
  - Aliases supported for user phrasing.

## Practical talking points for demos

1. Start with “legal fidelity by construction”:
   - We do not rewrite legal clauses; we only fill approved placeholders.
2. Show reliability improvements:
   - Canonical generation path, retries, surfaced errors, no silent failures.
3. Show low-friction intake:
   - Derived defaults reduce unnecessary questions.
4. Show user control without complexity:
   - Section-level scope review before generation.
5. Show auditability:
   - Updated fields, schema-driven required logic, and contract-check scripts.

## Known limitations (transparent for stakeholders)
- Scope review is currently section-level only; not bullet-level interactive editing.
- Concept-wide aliasing exists for selected concepts (for example, debt-like), not every domain.
- Prompt behavior still depends on keeping immutable contract snippets intact.
- This is file-based architecture (no persistent DB/workflow state).

## Recommended next improvements

1. Add CI-level checks for prompt contract and scope QA scripts.
2. Expand concept alias coverage for other common removal intents.
3. Add a minimal demo harness that records run manifest inputs/outputs for reproducibility.
4. Continue reducing schema fields that are effectively derived/defaulted.

## Verification checklist for release readiness

```bash
python3 scripts/check-system-prompt-contract.py --prompt dist/ts-engagement-assistant.md --max-chars 7200
python3 scripts/check-scope-spelling.py
python3 scripts/validate-scope-exports.py
python3 -m py_compile dist/el-generate.py
```

Expected outcome:
- Prompt contract check passes.
- Scope QA passes.
- Generator compiles and can produce a `.docx` with no unresolved placeholders.
