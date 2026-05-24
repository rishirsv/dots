# {{PROJECT_NAME}} Project Specification

Template usage: replace all `{{...}}` placeholders before finalizing. Keep the
level of detail, but adapt the domain terms, sections, and entities to the
actual project. This template works for code repositories, services, products,
research programs, operations playbooks, and other knowledge-work projects.

Status: {{STATUS}} (for example `Draft v1`, `Accepted`, `Living`)

Purpose: Define {{PROJECT_NAME}} clearly enough that a human or coding agent can
understand the project, make scoped changes, verify outcomes, and preserve the
project's operating contract.

Project type: {{PROJECT_TYPE}} (examples: code repository, automation service,
knowledge-work program, research corpus, internal process, publication workflow)

Primary audience: {{PRIMARY_AUDIENCE}}

## 1. Problem Statement

{{PROJECT_NAME}} exists to {{PROJECT_OUTCOME}}.

Today, {{CURRENT_STATE_OR_PAIN}}.

The project solves {{PROBLEM_COUNT}} operational problems:

- {{PROBLEM_1}}
- {{PROBLEM_2}}
- {{PROBLEM_3}}
- {{PROBLEM_4}}

Important boundary:

- {{BOUNDARY_1}}
- {{BOUNDARY_2}}
- {{BOUNDARY_3}}

For code repositories, include what the software owns and what integrations,
platforms, or users own. For knowledge-work projects, include what the project
will decide, produce, or maintain, and what remains outside its authority.

## 2. Goals and Non-Goals

### 2.1 Goals

- {{GOAL_1}}
- {{GOAL_2}}
- {{GOAL_3}}
- {{GOAL_4}}
- {{GOAL_5}}
- {{GOAL_6}}

### 2.2 Non-Goals

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}
- {{NON_GOAL_3}}
- {{NON_GOAL_4}}

## 3. System or Work Overview

Use this section to name the main moving pieces. For a software project, these
are components, modules, services, data stores, and external integrations. For a
knowledge-work project, these are workstreams, source collections, decision
forums, deliverables, review loops, and publication channels.

### 3.1 Main Parts

1. `{{PART_1_NAME}}`
   - {{PART_1_RESPONSIBILITY}}
   - {{PART_1_INPUTS}}
   - {{PART_1_OUTPUTS}}

2. `{{PART_2_NAME}}`
   - {{PART_2_RESPONSIBILITY}}
   - {{PART_2_INPUTS}}
   - {{PART_2_OUTPUTS}}

3. `{{PART_3_NAME}}`
   - {{PART_3_RESPONSIBILITY}}
   - {{PART_3_INPUTS}}
   - {{PART_3_OUTPUTS}}

4. `{{PART_4_NAME}}`
   - {{PART_4_RESPONSIBILITY}}
   - {{PART_4_INPUTS}}
   - {{PART_4_OUTPUTS}}

### 3.2 Abstraction or Work Layers

{{PROJECT_NAME}} is easiest to maintain when kept in these layers:

1. `{{LAYER_1_NAME}}`
   - {{LAYER_1_DESCRIPTION}}

2. `{{LAYER_2_NAME}}`
   - {{LAYER_2_DESCRIPTION}}

3. `{{LAYER_3_NAME}}`
   - {{LAYER_3_DESCRIPTION}}

4. `{{LAYER_4_NAME}}`
   - {{LAYER_4_DESCRIPTION}}

5. `{{LAYER_5_NAME}}`
   - {{LAYER_5_DESCRIPTION}}

### 3.3 External Dependencies

- {{DEPENDENCY_1}}
- {{DEPENDENCY_2}}
- {{DEPENDENCY_3}}
- {{DEPENDENCY_4}}

## 4. Core Domain Model

### 4.1 Entities and Concepts

#### 4.1.1 {{ENTITY_1_NAME}}

{{ENTITY_1_DESCRIPTION}}

Fields or attributes:

- `{{ENTITY_1_FIELD_1}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_1_MEANING}}
- `{{ENTITY_1_FIELD_2}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_2_MEANING}}
- `{{ENTITY_1_FIELD_3}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_3_MEANING}}

#### 4.1.2 {{ENTITY_2_NAME}}

{{ENTITY_2_DESCRIPTION}}

Fields or attributes:

- `{{ENTITY_2_FIELD_1}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_1_MEANING}}
- `{{ENTITY_2_FIELD_2}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_2_MEANING}}
- `{{ENTITY_2_FIELD_3}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_3_MEANING}}

#### 4.1.3 {{ENTITY_3_NAME}}

{{ENTITY_3_DESCRIPTION}}

Fields or attributes:

- `{{ENTITY_3_FIELD_1}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_1_MEANING}}
- `{{ENTITY_3_FIELD_2}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_2_MEANING}}
- `{{ENTITY_3_FIELD_3}}` ({{TYPE_OR_SHAPE}})
  - {{FIELD_3_MEANING}}

### 4.2 Stable Identifiers and Naming Rules

- `{{IDENTIFIER_1}}`
  - {{IDENTIFIER_1_RULE}}
- `{{IDENTIFIER_2}}`
  - {{IDENTIFIER_2_RULE}}
- `{{IDENTIFIER_3}}`
  - {{IDENTIFIER_3_RULE}}

### 4.3 Source of Truth Rules

- {{SOURCE_OF_TRUTH_RULE_1}}
- {{SOURCE_OF_TRUTH_RULE_2}}
- {{SOURCE_OF_TRUTH_RULE_3}}

## 5. Operating Contract

This is the contract future maintainers must preserve. For code repositories,
describe runtime behavior, configuration, APIs, schemas, state machines, and
module boundaries. For knowledge-work projects, describe intake, source review,
decision-making, drafting, approval, publication, and archival rules.

### 5.1 Inputs

- {{INPUT_1}}
- {{INPUT_2}}
- {{INPUT_3}}

### 5.2 Outputs

- {{OUTPUT_1}}
- {{OUTPUT_2}}
- {{OUTPUT_3}}

### 5.3 Required Workflow

1. {{WORKFLOW_STEP_1}}
2. {{WORKFLOW_STEP_2}}
3. {{WORKFLOW_STEP_3}}
4. {{WORKFLOW_STEP_4}}
5. {{WORKFLOW_STEP_5}}

### 5.4 Configuration or Policy Surface

Document the knobs that change behavior.

- `{{CONFIG_1}}`
  - Default: {{CONFIG_1_DEFAULT}}
  - Valid values: {{CONFIG_1_VALUES}}
  - Applies: {{CONFIG_1_APPLIES_WHEN}}
- `{{CONFIG_2}}`
  - Default: {{CONFIG_2_DEFAULT}}
  - Valid values: {{CONFIG_2_VALUES}}
  - Applies: {{CONFIG_2_APPLIES_WHEN}}
- `{{CONFIG_3}}`
  - Default: {{CONFIG_3_DEFAULT}}
  - Valid values: {{CONFIG_3_VALUES}}
  - Applies: {{CONFIG_3_APPLIES_WHEN}}

### 5.5 Error, Exception, or Escalation Surface

- `{{ERROR_OR_EXCEPTION_1}}`
  - Meaning: {{MEANING}}
  - Response: {{RESPONSE}}
- `{{ERROR_OR_EXCEPTION_2}}`
  - Meaning: {{MEANING}}
  - Response: {{RESPONSE}}
- `{{ERROR_OR_EXCEPTION_3}}`
  - Meaning: {{MEANING}}
  - Response: {{RESPONSE}}

## 6. State, Lifecycle, and Recovery

### 6.1 Lifecycle States

1. `{{STATE_1}}`
   - {{STATE_1_MEANING}}
2. `{{STATE_2}}`
   - {{STATE_2_MEANING}}
3. `{{STATE_3}}`
   - {{STATE_3_MEANING}}
4. `{{STATE_4}}`
   - {{STATE_4_MEANING}}
5. `{{STATE_5}}`
   - {{STATE_5_MEANING}}

### 6.2 Transition Triggers

- `{{TRIGGER_1}}`
  - {{TRIGGER_1_EFFECT}}
- `{{TRIGGER_2}}`
  - {{TRIGGER_2_EFFECT}}
- `{{TRIGGER_3}}`
  - {{TRIGGER_3_EFFECT}}
- `{{TRIGGER_4}}`
  - {{TRIGGER_4_EFFECT}}

### 6.3 Idempotency and Recovery Rules

- {{RECOVERY_RULE_1}}
- {{RECOVERY_RULE_2}}
- {{RECOVERY_RULE_3}}
- {{RECOVERY_RULE_4}}

## 7. Detailed Behavior or Workstream Requirements

Use one subsection per major behavior, module, or workstream. Keep each section
implementation-ready: inputs, decisions, outputs, edge cases, and verification.

### 7.1 {{BEHAVIOR_OR_WORKSTREAM_1}}

Purpose:

- {{PURPOSE}}

Required behavior:

- {{REQUIREMENT_1}}
- {{REQUIREMENT_2}}
- {{REQUIREMENT_3}}

Edge cases:

- {{EDGE_CASE_1}}
- {{EDGE_CASE_2}}

Verification:

- {{VERIFICATION_1}}

### 7.2 {{BEHAVIOR_OR_WORKSTREAM_2}}

Purpose:

- {{PURPOSE}}

Required behavior:

- {{REQUIREMENT_1}}
- {{REQUIREMENT_2}}
- {{REQUIREMENT_3}}

Edge cases:

- {{EDGE_CASE_1}}
- {{EDGE_CASE_2}}

Verification:

- {{VERIFICATION_1}}

## 8. Integration, Interface, or Collaboration Contracts

### 8.1 Required Operations

- `{{OPERATION_1}}`
  - Input: {{OPERATION_1_INPUT}}
  - Output: {{OPERATION_1_OUTPUT}}
  - Failure modes: {{OPERATION_1_FAILURES}}
- `{{OPERATION_2}}`
  - Input: {{OPERATION_2_INPUT}}
  - Output: {{OPERATION_2_OUTPUT}}
  - Failure modes: {{OPERATION_2_FAILURES}}
- `{{OPERATION_3}}`
  - Input: {{OPERATION_3_INPUT}}
  - Output: {{OPERATION_3_OUTPUT}}
  - Failure modes: {{OPERATION_3_FAILURES}}

### 8.2 Boundary Contracts

- {{BOUNDARY_CONTRACT_1}}
- {{BOUNDARY_CONTRACT_2}}
- {{BOUNDARY_CONTRACT_3}}

### 8.3 Change Management

- {{CHANGE_RULE_1}}
- {{CHANGE_RULE_2}}
- {{CHANGE_RULE_3}}

## 9. Safety, Trust, and Permissions

Every project spec should state its trust posture explicitly.

- Data sensitivity: {{DATA_SENSITIVITY}}
- Access model: {{ACCESS_MODEL}}
- Approval model: {{APPROVAL_MODEL}}
- Destructive action policy: {{DESTRUCTIVE_ACTION_POLICY}}
- Audit trail: {{AUDIT_TRAIL}}

Safety invariants:

- {{SAFETY_INVARIANT_1}}
- {{SAFETY_INVARIANT_2}}
- {{SAFETY_INVARIANT_3}}

## 10. Observability, Review, and Status

### 10.1 Required Visibility

- {{VISIBILITY_1}}
- {{VISIBILITY_2}}
- {{VISIBILITY_3}}

### 10.2 Metrics or Quality Signals

- {{SIGNAL_1}}
- {{SIGNAL_2}}
- {{SIGNAL_3}}
- {{SIGNAL_4}}

### 10.3 Human-Readable Status

If a status surface exists, it should show:

- {{STATUS_FIELD_1}}
- {{STATUS_FIELD_2}}
- {{STATUS_FIELD_3}}

## 11. Verification

### 11.1 Acceptance Criteria

- Given {{STATE_OR_CONTEXT}}, when {{ACTION}}, then {{EXPECTED_RESULT}}.
- Given {{STATE_OR_CONTEXT}}, when {{ACTION}}, then {{EXPECTED_RESULT}}.
- Given {{STATE_OR_CONTEXT}}, when {{ACTION}}, then {{EXPECTED_RESULT}}.

### 11.2 Automated Checks

- `{{CHECK_COMMAND_1}}`
- `{{CHECK_COMMAND_2}}`

### 11.3 Manual or Review Checks

- {{MANUAL_CHECK_1}}
- {{MANUAL_CHECK_2}}
- {{MANUAL_CHECK_3}}

### 11.4 Evidence Requirements

- {{EVIDENCE_1}}
- {{EVIDENCE_2}}
- {{EVIDENCE_3}}

## 12. Risks and Open Questions

### 12.1 Risks

- {{RISK_1}}
  - Mitigation: {{MITIGATION_1}}
- {{RISK_2}}
  - Mitigation: {{MITIGATION_2}}
- {{RISK_3}}
  - Mitigation: {{MITIGATION_3}}

### 12.2 Open Questions

- {{QUESTION_1}}
- {{QUESTION_2}}
- {{QUESTION_3}}

## 13. Appendix: Variant Guidance

### 13.1 Code Repository Variant

For a code repository, make these sections concrete:

- Main parts: application targets, packages, services, queues, storage layers,
  test harnesses, build/release surfaces, and external APIs.
- Domain model: persisted schemas, runtime entities, config objects, events,
  state machines, IDs, and normalization rules.
- Operating contract: commands, configuration files, environment variables,
  migration rules, API contracts, CLI behavior, job behavior, and failure modes.
- Verification: exact test commands, build commands, lint/typecheck commands,
  manual QA flows, fixture expectations, and logs/screenshots required as proof.

### 13.2 Knowledge-Work Variant

For a knowledge-work project, make these sections concrete:

- Main parts: source library, research questions, decision records, review
  forum, deliverables, publication/archive locations, and stakeholder roles.
- Domain model: source types, claims, evidence levels, decisions, owners,
  status values, review artifacts, and final deliverables.
- Operating contract: intake rules, source acceptance criteria, synthesis
  method, review cadence, sign-off process, change log, and archive policy.
- Verification: source traceability, reviewer sign-off, unresolved-question log,
  contradiction checks, freshness dates, and final artifact acceptance criteria.

## 14. Appendix: Worked Example Shape

Use this example to preserve specificity when creating a real spec. Do not copy
it blindly into unrelated projects; translate the structure and detail level to
the target domain.

### Symphony Service Specification

Status: Draft v1 (language-agnostic)

Purpose: Define a service that orchestrates coding agents to get project work
done.

Problem statement:

Symphony is a long-running automation service that continuously reads work from
an issue tracker, creates an isolated workspace for each issue, and runs a
coding agent session for that issue inside the workspace.

The service solves four operational problems:

- It turns issue execution into a repeatable daemon workflow instead of manual
  scripts.
- It isolates agent execution in per-issue workspaces so agent commands run only
  inside per-issue workspace directories.
- It keeps workflow policy in-repo with `WORKFLOW.md` so teams version the agent
  prompt and runtime settings with their code.
- It provides enough observability to operate and debug multiple concurrent
  agent runs.

Main parts:

1. `Workflow Loader`
   - Reads `WORKFLOW.md`, parses YAML front matter and prompt body, and returns
     `{config, prompt_template}`.
2. `Issue Tracker Client`
   - Fetches candidate issues, refreshes active issue states, fetches terminal
     issues for cleanup, and normalizes tracker payloads into a stable issue
     model.
3. `Orchestrator`
   - Owns the poll tick, dispatch decisions, retry queue, reconciliation, and
     authoritative in-memory runtime state.
4. `Workspace Manager`
   - Maps issue identifiers to sanitized per-issue workspace paths, runs hooks,
     and removes workspaces for terminal issues.
5. `Agent Runner`
   - Creates or reuses the workspace, renders the issue prompt, launches the
     coding-agent app-server process, and streams runtime events back to the
     orchestrator.

Core domain model:

- `Issue`: tracker ID, human identifier, title, description, priority, state,
  branch metadata, URL, labels, blockers, and timestamps.
- `Workflow Definition`: front matter config plus trimmed prompt template.
- `Workspace`: root-contained filesystem path, sanitized workspace key, and
  `created_now` hook flag.
- `Run Attempt`: issue ID, issue identifier, attempt number, workspace path,
  start time, status, and error.
- `Live Session`: thread ID, turn ID, app-server PID, last event, token totals,
  rate-limit data, and turn count.
- `Retry Entry`: issue ID, identifier, retry attempt, due timestamp, timer
  handle, and error.

Operating contract:

- Poll the tracker on a fixed cadence.
- Reconcile running issues before dispatching new work.
- Dispatch only active, unclaimed, unblocked issues while global and per-state
  concurrency slots are available.
- Run coding agents only inside validated per-issue workspace paths.
- Preserve workspaces across successful runs and clean terminal workspaces on
  startup or terminal-state reconciliation.
- Treat workflow read/parse errors as dispatch blockers.
- Treat template rendering errors as run-attempt failures.
- Recover transient worker failures with exponential backoff.

Safety invariants:

- The agent subprocess `cwd` must equal the assigned per-issue workspace path.
- The workspace path must remain inside the configured workspace root.
- Workspace directory names must be derived from sanitized issue identifiers.
- Ticket writes are not orchestrator business logic; they belong to the agent
  workflow/tooling contract.

Verification:

- Unit-test config parsing, issue normalization, workspace path safety, retry
  backoff, and prompt rendering.
- Integration-test tracker fetches, app-server handshake, event streaming, and
  cancellation behavior.
- Manually verify structured logs, status snapshots, and terminal cleanup using
  representative active, blocked, failed, and terminal issues.
