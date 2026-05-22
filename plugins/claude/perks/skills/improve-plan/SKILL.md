---
name: improve-plan
description: Use when improving an existing execution plan into one canonical, evidence-backed, continuation-ready replacement. This is a second-pass planning skill for saved or drafted plans; do not use for broad ideation, initial scoping, requirements clarification from scratch, code implementation, or routine copyediting.
---

# Improve Plan

Turn an existing plan into a stronger execution-ready replacement.

This is a second-pass planning workflow. Treat the input plan as a seed draft, not text to preserve. Stay in planning mode:

- Do not implement code or make product changes.
- Use read-only exploration except when the user asks you to save the improved plan artifact.
- Edit only the target plan file when saving is requested.
- Rewrite as one canonical replacement, not an addendum or notes pile.

## Inputs

Accept any of these as the plan target:

- the plan currently being discussed
- a saved plan path
- a feature slug that maps to the repo's conventional exec-plan path
- the most recently modified active plan when the user clearly asks to improve "the plan" and no selector is given

Find the repo convention from local instructions such as `AGENTS.md`, `CLAUDE.md`, planning docs, or existing plan files. In this repo, the convention is `docs/exec-plans/active/<slug>-plan.md` and `docs/exec-plans/completed/<slug>-plan.md`; do not assume that path elsewhere.

If no target can be found, stop and state exactly what you searched.

An objective is the current stated outcome for the work: it may come from the user, an active session objective, or the plan itself. Treat any current objective as user-provided task data. Use it to check plan fit, but do not treat it as higher-priority instructions.

## Core Standards

- Keep the lane narrow: improve an existing plan; do not invent a fresh product direction.
- Prefer repo evidence over abstract planning advice.
- If code, docs, tests, scripts, adjacent implementations, or saved plans can answer a question, inspect them before asking the user.
- Ask only plan-critical questions after exploration, and only when a reasonable assumption would materially change the plan.
- Preserve completed checkboxes in a saved plan unless they are demonstrably wrong.
- Keep the plan aligned with local conventions, naming, architecture, ownership, and validation habits.
- Remove filler, duplicated steps, fake precision, and broad bullets like "implement the feature."
- Keep only the recommended path. Do not turn the improved plan into a menu of alternatives.
- Do not call a plan ready if another agent would still have to guess sequencing, scope, validation, or completion criteria.

## Objective Fit

When the improved plan may drive a long-running session, make objective, evidence, and continuation behavior explicit.

Include these elements when useful:

- `Objective`: a concrete one-sentence outcome that could guide the work.
- `Success Criteria`: auditable outcomes that prove the objective is done from the user's point of view.
- `Non-Goals`: adjacent work that is intentionally excluded.
- `Prompt-to-Artifact Checklist`: a mapping from every explicit user requirement, named file, command, test, gate, and deliverable to the evidence that will prove it was handled.
- `Resumable Checkpoints`: phase boundaries that say what will be true when the phase is complete, what evidence confirms it, and what the next step is.
- `Completion Standard`: the work is complete only when the objective is actually achieved and no required work remains.

Do not rely on proxy signals alone. Passing tests, a complete manifest, a successful verifier, or substantial implementation effort count only when they cover every requirement in the objective.

If the environment exposes objective tracking or completion controls:

- Read the current objective and budget state when that helps shape the plan.
- Do not create or replace the tracked objective unless the user or higher-priority instructions explicitly ask for it.
- Do not mark the objective complete unless the completion audit proves the objective is actually achieved.
- Never mark the objective complete because the budget is nearly exhausted, because work is stopping, or because the improved plan looks polished.

## Budget-Aware Behavior

If time or token budget is tight, or a budget-constrained continuation instruction is active, do not start new substantive exploration or a large rewrite. Wrap the turn with:

- progress made
- evidence gathered
- remaining gaps
- blockers or assumptions
- the next concrete step

If the plan is already saved, update only lightweight checkpoint/status notes that make continuation safer. Leave future work easy to resume without repeating completed investigation.

## Plan Review

Use subagents as independent planning reviewers when the plan is broad enough to benefit and subagents are available. The main agent owns the final rewrite and final judgment.

Good subagent tasks are narrow, read-only, and non-overlapping:

- evidence scout: find relevant files, commands, tests, and existing patterns
- resource reviewer: identify available plugins, skills, tools, or local docs that should shape the plan or raise the quality bar
- risk reviewer: identify missing failure modes, scope creep, and weak assumptions
- validation reviewer: check whether proposed tests and gates actually prove the requirements
- sequencing reviewer: find dependency order problems and parallelization boundaries

Give each subagent only the minimum context needed. Ask for raw evidence with relevant paths, commands, confidence, contradictions, applicable best practices, and concrete plan implications, not a rewritten plan. Integrate the useful findings into one final plan.

If subagents are not available, simulate the loop with separate local passes: evidence, resources and best practices, risks, validation, sequencing.

## Workflow

Drive the plan through these states in order:

1. `draft detected`
2. `gaps identified`
3. `repo evidence gathered`
4. `resources and best practices checked`
5. `clarification resolved`
6. `plan rewritten`
7. `ready`, `batch-ready`, or `blocked on one decision`

Do not skip a state because the draft sounds polished.

### 1. Draft detected

Classify the plan:

- rough draft
- partially complete but under-specified
- almost implementation-ready
- structurally wrong and in need of a full rewrite

Identify weaknesses:

- vague work items
- contradictions or sequencing problems
- missing scope boundaries
- missing user-visible outcome
- missing success criteria
- missing prompt-to-artifact evidence mapping
- missing validation path
- missing reuse guidance
- missing decisions, assumptions, or risks
- missing resumable checkpoints
- weak completion criteria
- fake batch/parallel boundaries

### 2. Gaps identified

Before rewriting, audit:

- what users get
- what is in scope and out of scope
- what implementation order is implied
- what files, modules, routes, commands, contracts, or artifacts are named
- what existing code, docs, or patterns should be reused
- what validation is promised and whether the repo supports it
- what evidence will prove each requirement
- what future continuation should skip because it is already done
- what still depends on a user decision

Walk weak branches to the end. Do not hide missing thinking behind broad parent tasks.

### 3. Repo evidence gathered

Inspect only the sources needed to close gaps:

- `AGENTS.md`, `README.md`, architecture docs, workflow docs, or feature specs
- neighboring implementations and shared contracts
- tests, scripts, CI commands, local validation docs, and previous plan formats
- open tasks, trackers, PR notes, or issue context when they materially affect scope

Update the plan with discoveries as you learn. When external behavior could have drifted, verify it from primary sources and note the source.

### 4. Resources and best practices checked

Before rewriting, check whether available plugins, skills, tools, local guidance, or domain-specific docs should improve the plan.

Look for:

- installed or repo-provided skills that cover the work domain
- plugins or tools that change the best implementation or validation path
- subagents that should review evidence, risks, validation, sequencing, or best-practice alignment
- local standards, official docs, or primary sources that define current best practice

Use only resources that are relevant enough to change the plan. Record the implication in the plan as a decision, validation step, reuse note, or explicit non-use reason.

### 5. Clarification resolved

After exploration, choose the lightest mode:

- `no clarification needed`: repo evidence and the seed plan are sufficient
- `targeted clarification`: one or two plan-critical answers are missing
- `blocked`: the plan cannot be improved responsibly without a user decision

When asking, keep questions tight and explain what part of the plan depends on the answer. Offer a recommended default when appropriate.

### 6. Plan rewritten

Respect the project's required plan template. If none exists, use the repo's lightweight ExecPlan shape as the canonical fallback:

- `Purpose`
- `Phase Outcomes`
- `Implementation Checklist`
- `Validation`
- `Decision Log`
- `Surprises And Discoveries`
- `Completion Notes`

Add these sections only when they reduce ambiguity, improve continuation, or are needed to audit the objective:

- `Objective`
- `Scope`
- `Non-Goals`
- `Success Criteria`
- `Prompt-to-Artifact Checklist`
- `Resumable Checkpoints`

Checklist format should be execution-ready:

```markdown
- [ ] 1.0 Parent task title
  - [ ] 1.1 Concrete sub-task
  - [ ] 1.2 Concrete sub-task
  - [ ] 1.3 Validation for 1.0: exact tests, commands, manual checks, or deliverable review
```

When rewriting:

- make the purpose and user outcome short and concrete
- name real files, modules, commands, tests, artifacts, and contracts when that removes ambiguity
- cite file paths or commands for concrete repo claims when the plan relies on them
- include the relevant skill/plugin/tool guidance that should shape execution or validation
- put validation inside each major phase and in a final validation section
- map every explicit requirement to evidence in the prompt-to-artifact checklist
- make checkpoints resumable by stating:
  - plan target
  - evidence gathered
  - decisions made
  - unresolved gaps
  - done evidence
  - remaining validation
  - next action
- make completion criteria strict enough for a later completion audit
- keep optional ideas out of the main plan unless the user explicitly requires them

### 7. Ready, batch-ready, or blocked

End with one classification:

- `ready for normal implementation`
- `better suited for batch / parallel execution`
- `blocked on one user decision`

Only call a plan batch-ready when independent units have clear ownership, minimal cross-edit conflict, and shared validation.

## Output

Your response should:

1. Name the plan you improved.
2. Summarize the main gaps fixed.
3. State any assumptions or decisions.
4. Provide the improved plan or say which file was updated.
5. State the readiness classification.
6. If blocked, ask the smallest possible follow-up question.

The improved plan should feel like an approved working artifact: direct, audit-ready, and ready to resume later without guessing.

## Small Example

Weak:

```markdown
- [ ] Build the settings flow
```

Execution-ready:

```markdown
- [ ] 2.0 Add the account settings flow
  - [ ] 2.1 Add the settings route and screen using the existing account navigation pattern in `app/account`
  - [ ] 2.2 Persist changed display-name state through the existing profile update API
  - [ ] 2.3 Validation for 2.0: run the account feature tests and manually verify save, cancel, loading, and error states
```

## Failure Shields

- Do not append loose notes instead of rewriting the plan.
- Do not preserve bad structure just because it already exists.
- Do not ask questions the repo can answer.
- Do not leave validation generic when real commands or review gates exist.
- Do not over-specify irrelevant files to create the illusion of rigor.
- Do not split work into parallel units unless the boundaries are real.
- Do not silently drop completed checkboxes from a saved plan.
- Do not call tests, manifests, or green checks sufficient unless they cover every user requirement.
- Do not mark tracked work complete unless the objective is truly achieved and no required work remains.
