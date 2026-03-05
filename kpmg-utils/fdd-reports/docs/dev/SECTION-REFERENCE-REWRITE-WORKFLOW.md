---
status: active
last-reviewed: 2026-03-05
review-cycle-days: 30
source-of-truth: docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md
verification-state: verified
---

# DEV: Section Reference Rewrite Workflow

This document captures the full workflow used to rewrite the Business Overview reference and generalizes it into a repeatable process for other FDD section references.

Use this when rewriting or materially restructuring any file under `skill/kpmg-fdd/references/` using:
- the mined section corpuses in `docs/report-mining/section-corpus/sections/`
- the active section reference being rewritten
- adjacent reference files for pattern calibration
- downstream consumer context when relevant

This is a development workflow. Keep it in `docs/dev/` so the distributed skill bundle stays focused on portable reference artifacts.

## What This Workflow Produces

For each section rewrite, the expected deliverables are:

1. A saved accepted plan in `docs/exec-plans/active/<feature-slug>-plan.md`
2. A rewritten section reference in `skill/kpmg-fdd/references/<section>.md`
3. A synced completed plan moved to `docs/exec-plans/completed/<feature-slug>-plan.md`
4. Optional follow-up notes in `TODOS.md` if something should be revisited after testing

## Core Operating Principles

1. Explore first, ask second. Most structural questions can be answered by reading the current reference, corpus, adjacent references, and downstream artifacts.
2. Treat the corpus as the primary evidence for how real sections behave. Do not overfit to one elegant theory if the corpus shows a different practical pattern.
3. Separate universal writing rules from section-specific logic. If a rule works without naming the section, it likely belongs in `global-writing-conventions.md`, not the section file.
4. Design the section around authoring primitives that match the section’s real job. For business overview, that meant narrative components. For other sections, it may mean exhibits, bridges, adjustment cards, watchlists, or line-item walkthroughs.
5. Keep the number of mandatory blocks as small as possible. Add optional blocks only when their activation can be described with explicit trigger rules.
6. Prefer one integrated verification section over scattered quality notes unless the section clearly benefits from separate headings.
7. Do not invent “common mistakes” in advance. Add a local mistakes section only after testing reveals recurring failure modes.
8. Examples should teach the local pattern with minimal jumping. Inline micro-examples are usually better than a detached example appendix.
9. Keep downstream presentation concerns out of the FDD reference unless the downstream interface materially changes authoring decisions.
10. Preserve compatibility with later transformation layers by writing in semantic terms, not presentation-slot terms.

## When To Use This Workflow

Use this workflow when:
- an existing section reference feels overfit to slots, templates, or rigid render shapes
- the corpus suggests a different, more natural section structure
- the section needs a clearer split between mandatory blocks and conditional blocks
- you want to generalize a successful rewrite pattern across multiple section references

Do not use this workflow when:
- the task is a light wording cleanup only
- the section reference is already structurally sound and only needs examples or minor fixes
- the user wants immediate drafting help for one report rather than a rewrite of the reference contract

## Required Inputs

Before rewriting any section, gather these artifacts:

1. The active section reference:
   `skill/kpmg-fdd/references/<section>.md`
2. The corresponding corpus:
   `docs/report-mining/section-corpus/sections/<section>.md`
3. Global rules:
   `skill/kpmg-fdd/references/global-writing-conventions.md`
4. The section index:
   `skill/kpmg-fdd/references/INDEX.md`
5. The section contract meta-pattern, if relevant:
   `skill/kpmg-fdd/references/section-contract-standard.md`
6. Adjacent or analogous section references for calibration
7. Any already-completed plan or rewrite artifacts for the pilot section
8. Downstream consumer artifacts when the section has an important transformation target

## Recommended End-to-End Process

### Phase 1: Ground in the current state

Read the current section reference in full.

Goals:
- identify what the file is trying to do
- identify where it is over-prescriptive, under-specified, or structurally inconsistent
- identify whether it is mixing global rules and section-specific rules

Read the full corpus for that section.

Goals:
- identify recurring content moves in strong examples
- identify optional patterns that appear only in some examples
- identify extraction artifacts that should be ignored
- distinguish real section behavior from template wishful thinking

Read adjacent references.

Goals:
- identify repo-level conventions worth preserving
- identify where the section should stay aligned versus where it should intentionally diverge

Read relevant downstream artifacts only if they materially affect how the section should be authored.

Goals:
- confirm whether the current section is incorrectly hard-coding downstream presentation choices
- determine whether the reference should emit semantic content rather than downstream slots

### Phase 2: Run focused explorations with subagents

Use subagents only for narrow questions that reduce ambiguity.

The two most useful subagent roles from the Business Overview rewrite were:

1. A downstream-interface explorer
2. A corpus-pattern explorer

You may also add:
- an adjacent-reference-pattern explorer
- a quality-gate explorer
- a section-specific exhibit explorer for highly quantitative sections

### Phase 3: Synthesize the rewrite strategy

After exploration, write down:
- what the corpus actually does
- what the current reference overfits
- what the new authoring model should be
- what should remain global versus local
- how examples should be handled
- how verification should be handled

This is the point where you decide the new contract shape.

### Phase 4: Chat to decision-complete plan

Before editing, resolve these decisions with the user:
- where section-specific writing guidance ends and global guidance begins
- whether examples should be inline or separate
- what should be mandatory versus optional
- whether optional blocks need activation rules
- whether a local mistakes section is wanted now or deferred until testing
- whether verification should be separate from split guidance or merged

If the user accepts a rewrite plan, save it to:
- `docs/exec-plans/active/<feature-slug>-plan.md`

### Phase 5: Rewrite the reference

When editing:
- replace the old structure fully rather than partially layering over it
- remove obsolete headings instead of trying to preserve them
- keep the new section internally consistent in one pass
- ground the new structure in the actual corpus, not only in abstract design principles

### Phase 6: Validate and close out

After the rewrite:
- run targeted text checks for obsolete terms or headings
- re-read the full file for internal consistency
- confirm the examples reflect the new model
- sync the plan checklist with what was actually done
- move the plan file to `docs/exec-plans/completed/`
- add follow-up testing items to `TODOS.md` when needed

## Best-Practice Rewrite Pattern

This is the general pattern that worked best for Business Overview and should be the default starting point for other sections.

### 1. Start from the section’s real analytical job

Ask:
- What is this section for in the report?
- What decision-useful understanding should the reader gain after reading it?

Do not start with:
- what headings seem tidy
- what slide layout might eventually consume it
- what slots are easy to define

### 2. Let the authoring primitive match the section

Choose the local authoring model based on the section’s natural evidence shape.

Examples:
- Business overview: `narrative components`
- QoE adjustments: likely `adjustment cards` or `adjustment rationale units`
- Net working capital: likely `definition table + bridge + rationale items + driver commentary`
- Reporting environment: likely `watchlists + comparability notes + structured exhibits`
- Historical performance: likely `headline summary + line-item walkthrough + evidence-backed driver bullets`

Do not force the same authoring primitive onto every section.

### 3. Keep mandatory structure minimal

The section should have only the minimum mandatory blocks needed to guarantee usefulness.

Everything else should be optional with explicit trigger rules.

This improves:
- drafting flexibility
- corpus fidelity
- transferability across industries
- robustness when source material is incomplete

### 4. Put trigger rules before the component catalog

If the user or agent does not know when to activate optional blocks, the contract will drift.

Therefore:
- define required vs optional blocks before the lower-level components
- add explicit activation triggers
- add the inverse rule: do not include an optional block just because the source mentions it

### 5. Keep global rules global

Do not restate these locally unless the section needs a real override:
- placeholder policy
- base tone rules
- generic evidence/source-note policy
- banned language
- generic density or date-anchoring policy

Local section files should add only:
- section-specific analytical sequencing
- section-specific authoring primitives
- section-specific inclusion logic
- section-specific verification checks

### 6. Inline examples where they teach best

Use:
- a short example inside each local component when the component needs clarification
- one or two full examples at the end to show full assembly

Avoid:
- forcing the reader to jump to a detached “component examples” section
- adding many full examples before the contract is stable

### 7. Add a local mistakes section only after testing

Do not guess at mistakes prematurely.

Instead:
- capture a TODO after testing begins
- add local mistakes later if they become real recurring failure modes

### 8. Use one verification section by default

For most section references, combine:
- structural checks
- optional-block activation checks
- readability/splitting checks
- local semantic checks

This is usually easier to use than separate `preflight` and `split policy` sections unless the section is exhibit-heavy and benefits from stricter decomposition.

## Exact Subagent Pattern Used In The Business Overview Rewrite

### Subagent 1: Downstream-interface explorer

Purpose:
- determine whether the section reference should be slot-first or semantic-first
- identify the best upstream interface for later transformation

Copy-ready prompt template:

```text
Inspect /Users/rishi/Code/ai-tools/kpmg-utils/<downstream-project> and answer these questions concisely:
1) How does the downstream system think about content today?
2) For <section>-like content, what content granularity is most natural upstream: sentence-level bullets, semantic components, structured facts, exhibit objects, or something else?
3) If the upstream FDD writing skill should avoid hard-coding downstream slots, what interface would best preserve transformability later?
Cite the most relevant file paths you used.
```

Business Overview instance used:

```text
Inspect /Users/rishi/Code/ai-tools/kpmg-utils/kpmg-slidegen and answer these questions concisely:
1) How does deckSpec authoring think about slots and slide types today?
2) For narrative/business-overview-like content, what content granularity is most natural upstream of deckSpec: sentence-level bullets, semantic narrative components, structured facts, or something else?
3) If an upstream FDD writing skill should avoid hard-coding deckSpec slots, what interface would best preserve transformability later?
Cite the most relevant file paths you used.
```

When to use:
- when the section has a meaningful downstream consumer
- when the current reference appears overfit to a downstream presentation schema

When not to use:
- when the rewrite is purely internal to report drafting and has no downstream structure pressure

### Subagent 2: Corpus-pattern explorer

Purpose:
- summarize what strong corpus examples actually do
- identify where the current reference is overfit or underfit
- propose a generalized outline shape

Copy-ready prompt template:

```text
Inspect /Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports and answer these questions concisely:
1) Across the <section> corpus, what recurring analytical or narrative components show up in strong examples?
2) Which parts of the current <section> reference feel overfit to templates, slots, or rigid structure versus aligned to real corpus patterns?
3) What outline shape would generalize best across future rewrites of similar section references?
Cite the most relevant file paths you used.
```

Business Overview instance used:

```text
Inspect /Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports and answer these questions concisely:
1) Across the business overview corpus, what recurring narrative components show up in strong examples?
2) Which parts of the current business-overview reference feel overfit to slots versus aligned to real corpus patterns?
3) What outline shape would generalize best across other section reference files too?
Cite the most relevant file paths you used.
```

When to use:
- always for meaningful section rewrites

### Optional Subagent 3: Adjacent-reference explorer

Purpose:
- identify what should stay consistent with nearby references
- find reusable structure patterns worth preserving

Copy-ready prompt template:

```text
Inspect the section references adjacent to /Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/references/<section>.md and answer:
1) Which structural conventions appear intentionally shared across the current reference set?
2) Which of those conventions are worth preserving for <section>, and which are likely artifacts of an older contract pattern?
3) Are there any nearby references whose quality-gate or example strategy should be borrowed for <section>?
Cite the most relevant file paths you used.
```

### Optional Subagent 4: Exhibit-shape explorer

Purpose:
- determine the best section-specific authoring primitive for table- and bridge-heavy sections

Recommended for:
- QoE
- Net working capital
- Net debt
- Reporting environment
- Balance sheet
- Quality of net assets

Copy-ready prompt template:

```text
Inspect the corpus and active reference for <section> and answer:
1) What is the smallest set of recurring exhibit or reasoning units needed to write this section well?
2) Should this section be organized around narrative components, exhibit contracts, rationale cards, line-item walkthroughs, watchlists, or another primitive?
3) Which blocks should be mandatory versus optional, based on the corpus?
Cite the most relevant file paths you used.
```

## Recommended Human/Agent Conversation Flow

This was the effective sequence for the Business Overview rewrite and should be reused.

1. Read everything first.
2. Present an independent view of what is structurally wrong and what should replace it.
3. Let the user react to the structure, not just the wording.
4. Resolve these four decisions explicitly:
   - global vs local guidance
   - inline vs separate examples
   - mandatory vs optional blocks
   - how verification should be structured
5. Convert the aligned view into a full rewrite plan.
6. Save the accepted plan.
7. Rewrite the file.
8. Run targeted QA.
9. Capture deferred items in `TODOS.md`.

## Reusable Prompt For Planning A New Section Rewrite

Use this prompt in plan mode or as the working brief before implementation:

```text
Rewrite `skill/kpmg-fdd/references/<section>.md` so it reflects the actual patterns in `docs/report-mining/section-corpus/sections/<section>.md` rather than inherited slot or template assumptions.

Goals:
- identify the section’s real analytical job
- separate global writing rules from section-specific logic
- minimize mandatory blocks
- define explicit trigger rules for optional blocks
- choose the best authoring primitive for this section
- add examples that teach the contract efficiently
- produce a verification section grounded in actual drafting needs

Required exploration:
- read the current section reference in full
- read the full section corpus
- read `global-writing-conventions.md`
- read adjacent section references for calibration
- inspect downstream consumer artifacts only if they materially shape the authoring interface
- use a corpus-pattern explorer subagent
- use a downstream-interface explorer subagent if downstream structure pressure exists

Deliver:
- an independent diagnosis of what is wrong with the current section reference
- a proposed new heading structure
- a recommendation for the local authoring primitive
- a clear split between mandatory and optional blocks
- a recommendation for inline versus separate examples
- a recommendation for how verification should be structured
- a decision-complete implementation plan
```

## Reusable Prompt For Implementation After The Plan Is Accepted

Use this once the user approves the plan:

```text
Implement the accepted rewrite plan for `skill/kpmg-fdd/references/<section>.md`.

Requirements:
- save the accepted plan to `docs/exec-plans/active/<feature-slug>-plan.md` if it is not already saved
- rewrite the section reference in one internally consistent pass
- keep global rules in `global-writing-conventions.md` rather than duplicating them locally
- ground the rewrite in the corpus, ignoring extraction artifacts
- add examples only where they improve teachability
- validate the new structure against the corpus and targeted text checks
- sync the plan checklist with the work performed
- move the plan file to `docs/exec-plans/completed/<feature-slug>-plan.md` when done
- add any deferred post-testing items to `TODOS.md`
```

## Section-Specific Recommendations For Other References

Do not blindly apply the Business Overview structure to every section. Reuse the process, not the exact headings.

### Executive summary

Best likely authoring primitive:
- `decision blocks` or `workstream conclusion units`

Recommended focus:
- scope
- core conclusions
- key risks and mitigants
- missing information that could change conclusions

### Historical / financial performance

Best likely authoring primitive:
- `headline summary + line-item walkthrough`

Recommended focus:
- quantified summary
- ordered commentary by P&L line
- explicit evidence-backed drivers
- comparability notes only when needed

### QoE and earnings adjustments

Best likely authoring primitive:
- `adjustment cards` or `adjustment rationale units`

Recommended focus:
- what the adjustment is
- why it is treated as non-recurring/run-rate/other
- how it is quantified
- residual sensitivity
- evidence basis

### Net working capital

Best likely authoring primitive:
- `definition table + bridge + numbered rationale items + driver commentary`

Recommended focus:
- definitional boundary
- normalization bridge
- period behavior
- target/peg implications

### Net debt

Best likely authoring primitive:
- `debt-like item cards` plus structured schedules

Recommended focus:
- debt definition
- included/excluded treatment
- item-level rationale
- purchase-price implications

### Reporting environment

Best likely authoring primitive:
- `watchlists + comparability implications + systems/control exhibits`

Recommended focus:
- framework and assurance status
- close process
- systems architecture
- accounting policy watchlist
- implications for diligence interpretation

## Verification Method

This workflow is marked `verified` because it is grounded in the completed Business Overview rewrite and cross-checked against:
- [business-overview.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/references/business-overview.md)
- [business-overview-reference-rewrite-plan.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/docs/exec-plans/completed/business-overview-reference-rewrite-plan.md)
- [global-writing-conventions.md](/Users/rishi/Code/ai-tools/kpmg-utils/fdd-reports/skill/kpmg-fdd/references/global-writing-conventions.md)
- the business overview corpus in `docs/report-mining/section-corpus/sections/business-overview.md`

## Save Summary

Recommended canonical use:
- keep this file as the reusable workflow for future section-reference rewrites
- use this file as the process source of truth and derive each section's final contract shape from the corpus, adjacent rewritten references, and the section's real analytical job
