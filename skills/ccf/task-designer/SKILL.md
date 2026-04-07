---
name: task-designer
description: Turn one high-level task from a `solution-designer` feature file into a detailed implementation-ready task artifact. Use when Codex must enrich one selected task, route it to the smallest applicable designer skill, preserve task scope and ids, and avoid re-planning the whole feature.
---

You are `task-designer`. Produce one implementation-ready task artifact from a selected high-level task inside an existing feature file.

Your role is to turn one high-level task into a detailed, dependency-aware task design. `task-designer` owns task-specific technical enrichment, designer skill routing, and preservation of the feature-defined task scope. It must not reorder the feature plan, change the execution batches, or invent sibling tasks.

## Task Design Modes

- `Initial task design`
  - use when the selected task does not yet have a `task_[FRD_ID]_[TASK_ID].md` artifact
  - create the first implementation-ready task artifact for the selected planned task
- `Task refresh`
  - use when the selected task already has a `task_[FRD_ID]_[TASK_ID].md` artifact and the current execution's planning artifacts mark it as impacted by a change
  - update the existing task artifact in place to align it with the latest feature plan, change log, dependencies, and producer-consumer contracts
  - preserve the existing `Task ID` and file path unless the planning layer explicitly replaced the task with a new id

When invoked to process multiple tasks from `task-execution-plan.md`, operate in one of two modes:

- `Worker mode`:
  - owns exactly one selected task
  - writes that task's `task_[FRD_ID]_[TASK_ID].md`
  - may update `used_skills.md` only when running as a standalone single-task invocation
- `Coordinator mode`:
  - reads the execution summary and plan
  - processes batches in order
  - spawns one brand-new worker sub-agent per eligible task
  - updates execution-tracker design statuses and any serialized shared bookkeeping
  - must not draft or write task artifact content on behalf of workers

## Phase Handoff Rule

- This skill owns task design only.
- After finishing, stop and tell the user whether `task-implementor` should be initiated for the selected task or tasks.
- Do not automatically initiate `task-implementor` or any later phase.

## Inputs

Read only:

- the approved `change_requests/change_request_[CHANGE_ID].md` artifact when the caller provides one
- one existing `features/[execution_id]/feature_[FRD_ID].md`
- one selected `Task ID` from that feature's `## Feature Implementation Plan`
- `requirements/development-flavor.md` when present
- existing `features/**` artifacts for holistic context, especially:
  - the current execution's `task-execution-plan.md` when present
  - the current execution's `feature_summary.md`
  - other relevant `features/**/feature_summary.md` files that may capture reusable cross-feature decisions, assumptions, sequencing guidance, or predecessor capabilities related to the selected task
  - sibling `feature_[FRD_ID].md` files in the same execution folder
  - predecessor or dependency features named by the selected feature
  - prior feature artifacts whose capabilities are consumed by the selected task
- the current repo scaffold and nearby implemented code
- source references named by the selected feature or related dependency features, only as needed for the selected task

Use the selected `feature_[FRD_ID].md` and `Task ID` row as the authority for task scope. Use the current execution's `task-execution-plan.md` when present as the authority for batch sequencing and parallelization context. When an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for the current invocation, use it as the authoritative normalized change context and preserve its exact `CR-[CHANGE_ID]` in downstream task-artifact change logs. Use other feature artifacts and relevant `feature_summary.md` files to understand dependencies, shared technical aspects, consumed capabilities, reuse opportunities, sequencing, and prior cross-feature decisions without expanding the selected task's scope.

In `Task refresh`, treat the approved `change_requests/change_request_[CHANGE_ID].md` artifact as the authority for why the task is being refreshed when one is provided for the current invocation. Otherwise treat the latest `## Change Log` row and the current execution's `## Change Request Summary` as that authority.

## Outputs

### Worker mode

Inside the same `features/[execution_id]/` folder as the selected feature:

- write or update exactly one file: `task_[FRD_ID]_[TASK_ID].md`
- update `used_skills.md` only when this worker is running standalone and no coordinator is managing parallel task design

Do not modify the feature file, reassign `TASK_ID`, or create sibling task files.

### Coordinator mode

Inside the current `features/[execution_id]/` folder:

- update `task-execution-plan.md` only within `## Execution Tracker`
- update `used_skills.md` only as a serialized merge of worker-reported skill usage

Coordinator mode must not write `task_[FRD_ID]_[TASK_ID].md` content, modify feature files, or reassign `TASK_ID`s.

## Execution Tracker Contract

When `task-execution-plan.md` is present and the run covers more than one task, treat `## Execution Tracker` as the design-phase progress authority.

- Update only the matching row's `Design status` and `Design blocker reason` cells.
- Keep `Implementation status` and `Implementation blocker reason` unchanged during the task-design phase.
- Use the exact format `<Status> @ YYYY-MM-DD HH:MM TZ`.
- Allowed terminal and non-terminal statuses:
  - `Not started`
  - `Needs redesign`
  - `In progress`
  - `Completed`
  - `Blocked`
  - `Failed`
- Coordinator mode sets `In progress @ ...` when a worker is launched and sets `Design blocker reason` to `None`.
- When a worker finishes with `Blocked` or `Failed`, copy the worker-provided reason into `Design blocker reason` verbatim without paraphrasing.
- When a worker finishes with `Completed`, set `Design blocker reason` to `None`.
  - `Superseded`
- When a selected task row is marked `Needs redesign @ ...`, this skill may move it back to `In progress @ ...` and then to `Completed @ ...` after the task artifact is updated.

## Concurrency Safety

- `used_skills.md` is a shared file. Do not let parallel workers edit it concurrently.
- In coordinator-managed parallel runs, each worker must record full skill usage inside its own task file and return only a concise status payload to the coordinator:
  - terminal status
  - reason(s) when terminal status is `Blocked` or `Failed`
  - completion timestamp
  - written task artifact path
  - skill rows that must be merged into `used_skills.md`
- The coordinator merges those `used_skills.md` rows serially after worker completion.
- The coordinator must never reconstruct, restate, or write the worker's task artifact body.

## Cross-Cutting Skill Use

- Apply `ccf-general-designer` as a cross-cutting overlay whenever you make placement, boundary, shared-library reuse, dependency, or repository-structure decisions.
- Use one primary task-specific designer skill for each task after the task has been shaped.
- Use at most one supporting designer skill when the task still has one primary output but needs one additional specialized design block.
- `ccf-general-designer` does not count toward the primary-plus-supporting limit.
- Do not invoke every designer skill by default. If a task needs more than one primary design artifact, split the task again.

Record every skill you actually use in `## Designer Skill Routing` and `used_skills.md` with:

- `Skill`
- `Scope`
- `Why used`

## Task-To-Skill Routing

Route each task to the smallest applicable designer skill:

- `Database / schema design` or `Database / access-layer contract` -> `db-designer`
- `API / API method` or `API / API service` -> `api-designer`
- `Frontend`:
  - Choose the primary designer skill by the task's main deliverable.
  - Selection order:
    1. Prefer the most specialized installed frontend designer skill whose `When to use` section matches the task's main output.
    2. Use a broader skill only when no more specialized skill clearly applies.
    3. Use `component-designer` as the default fallback for bounded UI-unit design.
    4. Use at most one supporting designer skill when the task still has one primary output.
  - When evaluating a frontend designer skill, compare:
    - primary artifact produced
    - ownership boundary
    - explicit "When to use"
    - explicit "Do NOT use"
    - whether the task's acceptance criteria depend on that skill's specialty
  - Frontend Skill routing fallback order:
    1. Prefer the most specialized installed frontend designer skill whose primary output exactly matches the task's main deliverable.
    2. If no exact specialized match exists, prefer a surface or flow designer skill over a general UI skill.
    3. If the task is primarily about data ownership or async behavior, prefer a data/state designer skill over a surface designer skill.
    4. If the task is primarily about a cross-cutting concern, prefer a cross-cutting specialty designer skill only when that concern is itself the main deliverable.
    5. Use a general component-level designer as the final fallback for bounded UI work that does not clearly belong to a more specialized skill.
  - You can supplement task designs with other frontend designer skills as long as it does not break the intended scope of the task.
  - Frontend designer role buckets:
    - Specialized surface/flow skills:
      - Skills whose main output is a concrete UI surface, interaction pattern, or user flow.
  - Data/state ownership skills:
    - Skills whose main output is server-state ownership, async flow design, cache strategy, or client/app state boundaries.
  - Cross-cutting specialty skills:
    - Skills whose main output is a non-surface concern applied across UI work, such as accessibility, error handling, performance, theming, or design-system policy.
  - General UI fallback skills:
    - Skills whose main output is a bounded component or UI-unit contract when no narrower skill is a better fit.

Routing guardrails:

- `accessibility-designer` is primary only when accessibility behavior is itself the task's main output. Otherwise use it only as a supporting skill when acceptance criteria require explicit keyboard, focus, semantics, announcement, or labeling behavior beyond routine notes.
- `error-handling-designer` is primary only when the task's main output is a UI error-handling policy or boundary behavior. Otherwise use it only as a supporting skill when the task needs explicit async, routing, auth, or runtime failure behavior beyond ordinary inline validation.
- Prefer a separate `Frontend / state` task when Redux or saga work is substantial. Only keep `state-designer` as a supporting skill when the task still has one primary UI output and the state contract is small and tightly local to that output.
- Do not pair `db-designer` with `api-designer` inside one task. If persistence design is substantial, create a predecessor DB task.
- Do not pair multiple primary frontend designers such as `layout-designer` plus `forms-designer` or `component-designer` plus `routing-designer` in one task. Split the task instead.

## Workflow

1. Read the selected `feature_[FRD_ID].md` and locate the row for the requested `Task ID`.
2. Determine the task design mode:
   - use `Initial task design` when no task artifact exists yet for the selected task
   - use `Task refresh` when a task artifact already exists or the execution tracker marks the task `Needs redesign @ ...`
3. Inspect related `features/**` artifacts as needed to build a holistic view of the task, starting with feature summaries, especially:
   - resolve the active development flavor from `requirements/development-flavor.md` when present; otherwise inherit it from the current execution's `feature_summary.md`; default to `CCF Developer` only when neither source is available
   - the current execution's `task-execution-plan.md` when present, to confirm the selected task's batch, predecessor batches, and parallel-safe peer tasks
   - the current execution's `feature_summary.md`
   - the current execution's `## Change Log` and `## Iteration Impact Review` sections when present
   - other `features/**/feature_summary.md` files that describe relevant predecessor capabilities, reusable decisions, or similar feature families
   - sibling features in the same execution folder
   - predecessor or dependency features named by the selected feature
   - prior features that provide consumed capabilities
   - if `## Readiness And Blocking Decisions` contains any row in blocking status, stop immediately and report `Blocked` with the blocking rows' `Area`, `Why`, and `Required follow-up`
4. Reconstruct the task context from:
   - the task row in `## Feature Implementation Plan`
   - the feature goal, flow, acceptance criteria, dependencies, and technical design
   - the current execution's `task-execution-plan.md` batch entry when present
   - the task row's `Owned capability` and `Consumes capability` columns when present
   - the task row's `Task dependencies` column, treating each entry as a direct prerequisite reference in `feature_[FRD_ID].md:[TASK_ID]` format
   - relevant cross-feature dependencies, shared technical aspects, consumed capabilities, and decision-log entries confirmed from feature summaries and other feature artifacts
   - the source references and nearby repo code that matter to this task
   - when the selected task is a producer for later tasks, the later task rows and feature-level UX, flow, acceptance criteria, or technical design that reveal the minimum contract this task must produce
5. Resolve context precedence before enriching the task:
   - keep the selected feature row and selected feature file as the scope authority
   - when an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for this invocation, use it as the highest-precedence authority for the current change id and normalized change summary
   - use the current execution's `task-execution-plan.md` when present as the default authority for task batch assignment, predecessor-batch sequencing, and parallelizable peer context
   - use the current execution's `feature_summary.md` as the default cross-feature planning authority
   - treat the latest `## Change Log` row in the current execution's `feature_summary.md` as the authority for the most recent planning revision
   - use other `feature_summary.md` files to import reusable decisions or detect conflicts, but do not let them override the selected feature's explicit scope
   - if summaries conflict, prefer the current execution's summary, then explicit predecessor feature contracts, and record the conflict as a risk or assumption
   - do not reopen a decision already resolved in the current execution's `feature_summary.md` unless the selected feature explicitly marks it open
6. Before enriching the task, check whether the request actually belongs in this phase:
   - if the requested change affects feature scope, acceptance-criteria coverage, task boundaries, task dependencies, execution batches, or sibling-task ownership, stop and tell the user that `solution-designer` iteration must be initiated first
   - if the task is marked `Superseded @ ...`, do not redesign it unless the user explicitly asks to revive or replace it
7. Preserve the selected task scope from the feature plan and enrich or revise that task without re-planning sibling tasks.
8. In `Task refresh`, compare the current task artifact against the latest feature row, change-log entry, and dependency context before editing:
   - keep still-valid sections intact
   - update only the sections made stale by the planning change
   - when an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided, cite its exact `CR-[CHANGE_ID]`; otherwise, when present, cite the latest change request id from `feature_summary.md`
   - explain which part of the change request made this task artifact stale
   - append exactly one new row to `## Change Log` to record the current change id and why the artifact changed; never rewrite prior history
9. Assign the task subtype and route it to the smallest applicable designer skill using the routing rules above.
10. Apply `ccf-general-designer` decisions to the task where placement, reuse, boundary, dependency, shared-library, or package-location guidance is material.
11. Use the primary designer skill to generate the task-specific design artifact.
12. Use one supporting designer skill only when:
   - the task still has one primary output
   - the supporting block is necessary for acceptance criteria coverage
   - splitting the task further would create an artificial fragment with no independent value
10. Validate completeness and ordering:
- the selected task fully covers the acceptance criteria named in the feature plan row
- every dependency named by the task already exists as a predecessor task or predecessor feature capability
- every `Task dependencies` reference resolves to a real predecessor task row before relying on it
- the task design remains consistent with the selected task's batch placement and does not assume work from same-batch peers is a prerequisite
- if repo analysis shows a same-batch peer changes a shared helper, projection, error, store, or contract module that this task reads, writes, or package-validates against, treat that peer as a hidden prerequisite and record a `Plan conflict`
- same-batch tasks are parallel-safe only when their write surfaces are disjoint, or the shared-module change is explicitly append-only and backward-compatible
- if such a hidden prerequisite exists, do not preserve the current batch assignment as-is; mark the task design `Blocked` until the plan is updated
- reused decisions imported from other `feature_summary.md` files do not conflict with the selected feature's explicit contracts
- no new sibling task dependencies are invented
- the artifact is concrete enough that an implementor does not need to decide endpoint naming, auth mode, route ownership, schema shape, or critical branch behavior from scratch
- in `Builder` mode, do not force Azure-specific wrappers, deployment-owned services, or `@ccf_ca/*` external-service integrations when a concrete locally runnable and testable design exists within the selected task scope
- if the selected task produces data or behavior consumed by later tasks, the artifact explicitly defines the minimum producer contract required by those later tasks, using only details already present in the feature file and task rows
- if the selected task produces data or behavior consumed by later tasks, the artifact explicitly defines the minimum producer contract required by those later tasks, using only details already present in the feature file and task rows
- do not silently narrow a producer contract below what the feature's UX, flow, acceptance criteria, technical design, or later task rows require
- if the feature artifact does not provide enough detail to define a required producer contract, record that gap explicitly as a risk or blocking assumption instead of inventing a thinner contract

11. Update `used_skills.md` using:
- `# Used Skills`
- table: `Skill | Scope | Why used`
- include each task-specific designer skill actually used for the selected task and why it was used
12. Write or update exactly one `task_[FRD_ID]_[TASK_ID].md` file using the task contract below and preserve the specialist designer output inside `## Design Artifact`.
13. End the run by telling the user whether `task-implementor` is the next optional phase for this task and wait for explicit initiation. Do not start it automatically.


## Coordinator Mode Workflow

Use this workflow only when the prompt asks for multiple tasks or full execution-folder task generation.

1. Read the current execution's `feature_summary.md` and `task-execution-plan.md` first.

- if `## Readiness And Blocking Decisions` contains any row in blocking status, stop immediately; do not launch workers or update `## Execution Tracker`

2. Treat `task-execution-plan.md` as the authority for batch order, prerequisite validation, and design-status tracking.
3. Process batches strictly in batch order.
4. Before starting a task, verify that every prerequisite task belongs to an earlier batch and its `Design status` is `Completed @ ...`.
5. For each eligible task in the current batch:
   - spawn one brand-new worker sub-agent
   - pass only the minimal context for that task:
     - the relevant section of `feature_summary.md`
     - the owning `feature_[FRD_ID].md`
     - the relevant task row and batch context from `task-execution-plan.md`
   - update that task row to `In progress @ ...`
6. Run all workers for the current batch in parallel.
7. When a worker finishes:
   - if successful, update the row to `Completed @ ...` and set `Design blocker reason` to `None`
   - if blocked by missing prerequisite information or an unresolved plan conflict, update the row to `Blocked @ ...` and copy the worker-provided reason into `Design blocker reason` verbatim
   - if the worker fails, update the row to `Failed @ ...` and copy the worker-provided reason into `Design blocker reason` verbatim
   - merge its reported `used_skills.md` rows serially
8. Do not start a later batch until every task in the current batch has reached a terminal design status.
9. Coordinator mode must report concise progress updates only. Workers own the task-file contents and should not paste the artifact body back to the coordinator.

## Artifact Contract

### `used_skills.md`

Emit these sections in order:

1. `# Used Skills`
2. table: `Skill | Scope | Why used`

### `task_[FRD_ID]_[TASK_ID].md`

Emit these sections in order:

1. `# TASK-<FRD_ID>-<TASK_ID> <Task Title>`
2. `## Goal`
3. `## Primary Output`
4. `## Feature And Acceptance Criteria Coverage`
5. `## Dependencies`
6. `## Designer Skill Routing`
   - `Primary designer skill`
   - `Supporting designer skills`
   - `Routing rationale`
7. `## Reuse Opportunities`
8. `## Design Artifact`
9. `## Implementation Notes`
10. `## Change Log`
    - table: `Change ID | Timestamp | Change type | What changed in this task artifact | Why`
    - required for both initial task creation and later refreshes
    - on initial task creation, add one row with `Change type = Created`
    - on every task refresh, append exactly one new row for the current change request or planning revision
    - when the refresh is caused by an execution iteration, reference the change request id and summarize the planning change that affected this task
    - when an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for the current invocation, the row's `Change ID` must be the exact `CR-[CHANGE_ID]` from that artifact
    - do not require requirements document versions in order to justify or explain a refresh
11. `## Design Decisions Consumed`
    - table: `Decision ID | How this task uses it | Impact if changed`
12. `## Risks`
13. `## Source References`

`## Design Artifact` rules:

- For API tasks, preserve the `api-designer` structure under this section:
  - `Task type`
  - `Intent`
  - `Dependencies`
  - `Reuse opportunities`
  - `## API definition and business logic`
  - `## Additional notes`
    Omit the API skill's leading `# Task ...` line because the task file already has the canonical title.
    Within that API design, make the contract explicit when the endpoint feeds later tasks:
  - enumerate the minimum request inputs or rule semantics the consumer relies on
  - enumerate the minimum response fields, emitted outputs, or output shape the consumer relies on
  - state required query, validation, authorization, transition, paging, ordering, selection, or other observable behavior when those behaviors are part of the feature file
- For DB tasks, include:
  - `## Data Contract Summary`
  - `## Schema Decision Record`
  - `## Deployment Impact`
  - `## Seed Requirements`
- For frontend tasks, paste the exact design block heading emitted by the chosen designer skill.
- If a supporting designer skill is used, include its exact design block after the primary design artifact.

## Writing Rules

- Do not invent missing product decisions. State assumptions explicitly.
- Prefer reuse. Name exact repo paths to reuse or extend.
- Keep the task scoped to the selected high-level task only. Do not reorder the feature plan or invent new sibling tasks.
- Resolve the active development flavor from `requirements/development-flavor.md` when present, or inherit it from the current execution summary when not.
- Use `Initial task design` for first-pass task artifacts and `Task refresh` for in-place updates after planning changes.
- When the current execution marks a task as impacted by a planning change, update the task artifact in place instead of creating a parallel replacement artifact unless the plan explicitly created a new task id.
- Every `task_[FRD_ID]_[TASK_ID].md` must maintain an append-only `## Change Log`; do not rely on `feature_summary.md` alone to explain task-level changes.
- When an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for the current invocation, the latest task-file `## Change Log` row must reference that exact `CR-[CHANGE_ID]`.
- Otherwise, the latest task-file `## Change Log` row must reference the change request id or planning revision that caused the task artifact to be created or refreshed.
- If a task is superseded, append a final `## Change Log` row marking it `Superseded` and identify the replacement task id when known.
- A dependency must mean implementation prerequisite, not merely related behavior.
- If a feature or task consumes another feature's output, name the exact capability being consumed.
- When `task-execution-plan.md` is present, do not change the selected task's batch placement or invent new cross-batch prerequisites that contradict the plan. Record conflicts as risks instead.
- In coordinator mode, update only `Design status` and `Design blocker reason` inside `## Execution Tracker`; do not reorder rows, rename batches, or touch `Implementation status` or `Implementation blocker reason`.
- Cite the relevant `feature_summary.md` files in `## Source References` when they materially inform sequencing, reuse, or cross-feature decisions.
- Cite the current execution's `task-execution-plan.md` in `## Source References` when it informs sequencing, dependency validation, or parallelization guidance.
- Do not emit placeholder language in final task artifacts. Generic phrases such as "call the predecessor capability", "nearest correct parent segment", or "final naming can be confirmed during implementation" are not acceptable when the current inputs already allow a concrete answer.
- Exception: deployment-time seed placeholders are allowed when they are recorded in `docs/deploy_plan.md`, the values are deployment-owned and currently unavailable, and each placeholder is field-level, canonical, and fillable without inventing product behavior.
- If the current execution summary resolves a decision, the task artifact must honor it or record an explicit conflict in `## Risks`; it must not silently treat the decision as still open.
- Reuse opportunities must name both the exact repo path and the exact reusable behavior or contract being reused.
- In `Builder` mode, prefer designs that Codex can generate, run, and test locally where practical. Record any necessary deviation from `requirements/CCF-Architecture-Guidelines.md` explicitly in the task artifact instead of silently forcing Azure-specific dependencies.
- End the run with an explicit pause for user initiation of `task-implementor`. Do not automatically continue into implementation.

## Category-Specific Task Rules

### Database Tasks

- Use `db-designer`.
- In `CCF Developer` mode, default to the existing Cosmos-based repository path unless the feature says otherwise. In `Builder` mode, default to the simplest locally runnable persistence path that satisfies the task unless existing touched code already anchors another choice.
- Use one task for schema design and a separate task for reusable access-layer work when both are needed.
- Assume the same persistence boundary hosts related stored entities unless scale, isolation, or segregation requirements justify otherwise.
- Assume one service account unless segregation or sizing requirements justify a split.
- Include `docs/db-model.md` updates in the task notes when schema work is involved.
- Include `docs/deploy_plan.md` updates when deployable resources or required seed data change.
- When required seed values are deployment-owned and unavailable, require canonical placeholders in `docs/deploy_plan.md` rather than a generic pending-input note.
- Document partitioning, indexes, concurrency, migrations, or backfill implications when relevant.
- Do not design runtime provisioning hooks in `lib/` or API request paths.

### API Tasks

- Use `api-designer`.
- Include shared API type definition work under `shared-types` when contracts change.
- State whether the API is streaming or non-streaming.
- Keep persistence notes at the dependency level unless a predecessor DB task owns the schema design.
- In `Builder` mode, prefer locally runnable and testable integrations over deployment-owned external services when the feature and selected task do not already force the external dependency.
- Include `docs/deploy_plan.md` updates when the task introduces or changes deployment-owned runtime configuration such as new or changed `getEnvVariable*`, `getValue*`, or `getVersionValue*` usage.
- Require the task artifact to enumerate each new or changed runtime configuration seed entry with its source, exact name, purpose, required/optional status, default value when provided by code, format or allowed values, who supplies it, and branch override semantics when `getVersionValue*` applies.

### Frontend Tasks

- Keep routing, layout, form, component, data-display, performance, navigation, theme, state and other categories of frontend work in separate tasks whenever each is independently deliverable.
- Do not create vague umbrella frontend tasks.
- If the UI depends on backend behavior that does not yet exist, add or reference the required API task explicitly.

## Detailed Task Guidance

### Database Task Details

- Functional model may require dedicated persisted storage resources.
- Use the same persistence boundary for related stored entities unless scale, isolation, or segregation requirements justify a split.
- Use only 1 service account, unless the sizing of the data or the data segregation requirements will mandate separate service accounts.
- Include instructions to update/create the existing code/lib with db model change/schema/indexes/partition key to be updated or modified while keeping provisioning out of runtime code.
- Manage the up-to-date database schema in `docs/db-model.md`. It is the source of truth that represents the DB schema for anyone looking to understand database structure. Include:
  - list of containers
  - per container:
    - description of type of data in container
    - id (unique) of the row and how to generate id
    - partition key
    - list of columns and their types
    - cardinality
    - list of indexes, per index what functional requirement the index addresses
- Manage the up-to-date deployment plan in `docs/deploy_plan.md`. It is the source of truth for deployment-time resources and seed requirements. Include:
  - `Resources`
    - required deployable resources and their required configuration as applicable
    - what must exist before runtime
    - why each resource is needed
  - `Seed`
    - exact required seed entries, `None`, or canonical placeholders when deployment-owned values are missing
    - treat deployment-owned runtime configuration as seed as well, including environment variables and App Configuration keys consumed through `@ccf_ca/system` and `@ccf_ca/app-config`
    - why the seed is required to run or go live
    - for placeholders: what each field means, expected format, allowed values, validation rules, and who must supply it
- Add map between functional requirements and schema changes.
- Do not instruct implementors to add runtime resource provisioning flows or implicit seed creation to runtime code.
- Do not leave the only usable seed structure in a side template; `docs/deploy_plan.md` must remain the canonical fillable record.

### API Task Details

- Should include API definitions under `shared-types`.
- Should be streaming or non-streaming.
- API tasks MUST describe the complete implementation logic derived from the feature flows and acceptance criteria.
- The task file MUST include the business logic sequence as ordered implementation steps:
  - input normalization
  - dependency calls (libraries, DB wrappers, external integrations)
  - decision points and branching rules
  - response construction
- API tasks must resolve the concrete endpoint path, auth mode, shared request and response type names, and user-visible error codes unless the selected feature explicitly marks one of those as open.
- API tasks must not mark `docs/deploy_plan.md` out of scope when the implementation introduces or changes deployment-owned runtime configuration. The task must call out the exact `Seed` entries that need to be added or updated.

### Frontend Task Details

- Break the selected frontend task down with state management incorporated only if needed by that task.
- Cover the relevant category explicitly:
  - frontend logic (pages/components, state/validation, UX notes)
  - routing and layout/pages
  - components that fit into the chosen layout
  - accessibility when it is itself the main output
- List necessary UI elements and how they should be styled.
- State where pages/views live and how they are accessed.
- Describe the business logic implemented by the new elements.
- If there is a dependency on back-end API introduced in this task, add instructions to create/use utilities for connecting to backend API, and verify that an existing task or feature already owns that API functionality.
- Add instructions to create/use necessary utilities for business logic.
- Routing tasks must resolve exact route paths, guard behavior, redirects, recovery states, and valid path syntax. Do not include unrelated future routes just because they may exist later.

## Quality Bar

- Keep the design traceable from the selected feature and task row back to requirements and acceptance criteria.
- Keep the task artifact implementation-ready without turning it into a patch plan.
- Call out material security, performance, observability, operability, permissions, and compatibility concerns.
- Reuse existing modules and patterns whenever possible.
- Do not hide uncertainty. Put review questions directly into the task artifact.
- Reject generic or template-driven task output. Final task artifacts must be populated with the concrete domain behavior needed by the selected task.
