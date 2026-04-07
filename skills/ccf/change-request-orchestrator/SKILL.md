---
name: change-request-orchestrator
description: Analyze a change request, an overwritten requirements document, or a prompt-defined requirements change against existing code and repository artifacts, write a durable change-request artifact, determine whether `solution-designer`, `task-designer`, and/or `task-implementor` are needed, and recommend only the immediate next phase. Use for end-to-end bug fixes, feature changes, or requirements updates that may require planning, task design, approval pauses, implementation sequencing, artifact updates, and validation.
---

# Change Request Orchestrator

Use this skill when a user gives a change request and wants Codex to decide whether the work needs:

- feature planning
- task design
- task implementation
- or a combination of those stages

This skill does not replace `solution-designer`, `task-designer`, or `task-implementor`. It analyzes the change, writes the analysis to a durable change-request artifact, determines the required phase sequence, and recommends only the next skill the user should run based on the current repo state.

## When To Use

Use this skill when the user provides:

- a bug fix request
- a feature change request
- a refactor request tied to existing artifacts
- an overwritten or revised requirements document under `requirements/`
- a prompt-defined requirements change that may alter scope, acceptance criteria, or execution sequencing
- a request that may or may not already be covered by `features/**`

Do not use this skill when:

- the user clearly asks for planning only
- the user clearly asks for implementation of one already-known task file only
- the user clearly asks for design only

In those cases, invoke the narrower skill directly.

## Skill Selection Rules

Choose the entry point using these rules:

1. Use `solution-designer` only when the request is not already covered by an existing feature or task execution artifact, or when the request requires changes to:
   - feature scope
   - acceptance criteria
   - task sequencing
   - cross-feature dependencies
   - execution planning
2. Use `task-designer` when the feature already exists but the relevant task must be:
   - created
   - corrected
   - enriched into an implementation-ready `task_[FRD_ID]_[TASK_ID].md`
3. Use `task-implementor` only when an implementation-ready task artifact already exists and the work is ready to execute.
4. If multiple stages are needed, the required overall order is:
   - `solution-designer`
   - `task-designer`
   - `task-implementor`
5. In a single run of this skill, recommend only the immediate next phase. Do not initiate it yourself.
6. If no additional phase is needed, say so explicitly and stop.
7. When recommending a direct handoff to `task-designer` or `task-implementor`, the approved change-request artifact remains the authoritative change-context input until the downstream artifacts absorb that change.

## Change Request Artifact

- Persist the full analysis in `change_requests/change_request_[CHANGE_ID].md`.
- Start from `assets/change_request_template.md` and preserve its section order unless the request truly does not need a section.
- Create one artifact per logical user change request.
- If the user is clarifying or revising the same not-yet-executed request, update the existing artifact in place instead of creating a duplicate.
- Generate `CHANGE_ID` as `YYYYMMDD-HHMMSS-<3-6hex>` using current local time when creating a new artifact.
- Use the artifact as the durable handoff record for later phases. Do not rely on conversational history as the only source of change context.

## Requirements Source Of Truth

- Treat `requirements/` as normally containing:
  - one architecture-guidance source such as `requirements/CCF-Architecture-Guidelines.md`
  - one detailed product requirements source provided by the user
- The user may overwrite either file in place when uploading a revision.
- Do not keep multiple versions of the same requirements document in `requirements/`.
- A change request may also be prompt-defined without overwriting a file.
- If both files are replaced, treat the current files on disk as the authoritative sources and record that in the change-request artifact.
- When a requirements upload is the trigger, record:
  - which requirements file was overwritten
  - whether the change affected the architecture-guidance source, the detailed product requirements source, or both
  - the currently authoritative file paths after upload
  - whether the current execution artifacts were planned from an older document state
- When the trigger is prompt-defined:
  - treat the current contents of `requirements/` as the baseline source of truth
  - treat the prompt as the change trigger that must be normalized into concrete planning implications
  - record that no file overwrite was required for this change request
- When a requirements upload changes scope or acceptance criteria, default the next phase to `solution-designer`.
- When a prompt-defined change alters scope, acceptance criteria, feature boundaries, task sequencing, or execution planning, default the next phase to `solution-designer`.

## Approval Gate

Before telling the user to start any phase, write the following into the change-request artifact:

- root cause or required change
- whether existing feature or task artifacts already cover the request
- the required phase sequence, if any
- the immediate next skill to run after approval
- code files to update
- artifact files to update
- artifacts that do not need updates, and why
- proposed implementation approach

In the conversation itself, keep the response brief:

- tell the user the created or updated change-request file path
- tell the user the immediate next phase that is pending approval
- tell the user to approve that artifact before any phase transition

Pause for explicit user approval before any phase transition.

## Execution Boundary

- This skill owns change analysis and phase recommendation only.
- It may create or update exactly one `change_requests/change_request_[CHANGE_ID].md` artifact.
- Do not create, update, or delete code files or planning artifacts in this skill.
- After approval, update the artifact's approval section, then tell the user to run exactly one next skill and pass the approved change-request artifact as input context.
- If the next phase is `solution-designer`, stop after recommending `solution-designer`.
- If the next phase is `task-designer`, stop after recommending `task-designer`.
- If the next phase is `task-implementor`, stop after recommending `task-implementor`.
- Never automatically invoke `solution-designer`, `task-designer`, or `task-implementor`.
- Never chain multiple phases in one run.
- When the next phase is `task-designer` or `task-implementor`, require the downstream phase to preserve the exact `CR-[CHANGE_ID]` from this artifact in any refreshed downstream change logs.

## Workflow

1. Analyze the change request against the repo and existing `features/**` artifacts.
   - if the trigger is an overwritten requirements document, compare the current requirements source of truth against the current planning artifacts and note the likely planning impact
   - if the trigger is a prompt-defined change, normalize the prompt into a concrete change request before deciding the required phase sequence
2. Determine whether the request is already covered, needs `solution-designer`, needs `task-designer`, or is ready for `task-implementor`.
3. Determine the full required phase sequence using the mandated order:
   - `solution-designer`
   - `task-designer`
   - `task-implementor`
4. Create or update exactly one `change_requests/change_request_[CHANGE_ID].md` artifact by starting from `assets/change_request_template.md` and filling it with request-specific details.
5. In the conversation, point the user to that artifact and ask for approval to proceed to the immediate next phase only.
6. After approval, update `## Approval Status` in the artifact to reflect the approved phase and timestamp.
7. After approval, tell the user exactly which single skill to run next and to include the approved change-request artifact path in that phase's context.
8. Do not repeat the full analysis in the conversation when it already exists in the artifact unless the user explicitly asks for it.
9. Stop and wait for the user or the next skill invocation. Do not continue into later phases automatically.

## Artifact Contract

### `change_requests/change_request_[CHANGE_ID].md`

Use `assets/change_request_template.md` as the starter shape. Replace placeholders instead of leaving template text behind.

Emit these sections in order:

1. `# Change Request CR-[CHANGE_ID] <Short Title>`
2. `## Request Summary`
   - concise restatement of the user's requested change
3. `## Repo Context Reviewed`
   - list artifacts and code areas inspected
4. `## Requirements Source Update`
   - include only when the trigger is a requirements upload or overwrite
   - include:
     - `Overwritten file`
     - `Current source-of-truth file`
     - `Why the overwrite matters`
5. `## Change Request Normalization`
   - include:
     - `Trigger type`: `Requirements overwrite` or `Prompt-defined change`
     - `Planning authority`
     - `Normalization notes`
     - `Execution folder affected`, when known
6. `## Change Analysis`
   - root cause or required change
   - relevant repo findings
   - whether existing artifacts already cover the request
7. `## Impacted Files`
   - table: `Path | Type | Planned action | Why`
   - `Type` must be `Code`, `Planning artifact`, `Task artifact`, `Implementation note`, or `Other`
8. `## Non-Impacted Artifacts`
   - table: `Path | Why no change is needed`
9. `## Phase Assessment`
   - table: `Phase | Needed | Why`
   - phases: `solution-designer`, `task-designer`, `task-implementor`
10. `## Recommended Phase Sequence`
   - ordered list of required phases, or `None`
11. `## Immediate Next Phase`
   - include:
     - `Recommended skill`
     - `Why this is the next phase`
     - `Inputs the next phase must read`
12. `## Proposed Approach`
13. `## Approval Status`
   - table: `Status | Approved next phase | Timestamp | Notes`
   - initial value must be `Pending user approval`
   - after approval, update the row to `Approved`
   - if the request is abandoned or replaced, update the row to `Superseded` or `Rejected` instead of leaving it ambiguous
14. `## Source References`

## Writing Rules

- The artifact is the durable handoff record. Put the complete change analysis there instead of relying on the conversation.
- The conversation should stay short and should mainly direct the user to the artifact and the pending approval decision.
- Replace placeholder rows and example values from the template with real repo-specific content before finishing.
- When the trigger is a requirements overwrite, name the exact file in `requirements/` that now serves as the single source of truth.
- When the trigger is prompt-defined, state that explicitly and record the prompt as the change trigger while keeping the current `requirements/` contents as the baseline source of truth.
- If the request is already fully covered and no phase is needed, still create the artifact and record `Recommended Phase Sequence: None`.
- If the request maps to an existing execution, name the exact `features/[execution_id]/` folder in the artifact.
- If the next phase is `task-designer` or `task-implementor`, name the exact task or task artifact when the repo already makes that concrete.
- If the next phase is `solution-designer`, list the approved change-request artifact and the authoritative `requirements/` inputs explicitly under `Inputs the next phase must read`.
- If the next phase is `task-designer`, list the approved change-request artifact, the exact owning `feature_[FRD_ID].md`, and the exact `Task ID` or task reference under `Inputs the next phase must read`.
- If the next phase is `task-implementor`, list the approved change-request artifact, the exact `task_[FRD_ID]_[TASK_ID].md`, and any current `feature_summary.md` or `feature_[FRD_ID].md` files the implementor must treat as hard constraints.
