# <Project / Service / Application> Specification

Purpose: Define <the project/service/application/workflow> so implementers can build interoperable behavior without relying on hidden context.

## Normative Language

The key words `MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` carry their common requirements meanings in this document.

`Implementation-defined` means the behavior is part of the implementation contract, but this specification does not prescribe one universal policy. Implementations MUST document the selected behavior.

## 1. Problem Statement

Describe the operational, user, or system problem this project solves. Include the current failure mode, the repeated work or risk it removes, and the durable boundary of the system.

Important boundary:

- <What this system is responsible for.>
- <What adjacent systems remain responsible for.>
- <Where successful completion may stop, if not at a final "done" state.>

## 2. Goals and Non-Goals

### 2.1 Goals

- <Required outcome or capability.>
- <Required outcome or capability.>
- <Required outcome or capability.>

### 2.2 Non-Goals

- <Explicitly excluded adjacent capability.>
- <Explicitly excluded policy or implementation choice.>
- <Future work not required by this spec.>

## 3. System Overview

### 3.1 Main Components

1. `<Component Name>`
   - <Responsibility.>
   - <Inputs it accepts.>
   - <Outputs or side effects it produces.>

2. `<Component Name>`
   - <Responsibility.>
   - <Inputs it accepts.>
   - <Outputs or side effects it produces.>

3. `<Component Name>` (OPTIONAL)
   - <Responsibility and when it is required.>

### 3.2 Abstraction Levels

List the layers in the order implementers should reason about them.

1. `<Policy / Product Layer>`
   - <User-owned rules, prompts, product policy, or durable configuration.>

2. `<Configuration Layer>`
   - <Typed parsing, defaults, environment resolution, and validation.>

3. `<Coordination Layer>`
   - <Scheduling, orchestration, routing, retries, or state ownership.>

4. `<Execution Layer>`
   - <Filesystem, runtime, subprocess, worker, network, or UI execution.>

5. `<Integration Layer>`
   - <External API adapters, persistence adapters, protocol bridges.>

6. `<Observability Layer>`
   - <Logs, status surfaces, metrics, audit records, debug artifacts.>

### 3.3 External Dependencies

- <External service, executable, API, datastore, filesystem, model, or platform dependency.>
- <Authentication or host environment requirement.>
- <Optional dependency and fallback.>

## 4. Core Domain Model

### 4.1 Entities

#### 4.1.1 <Entity Name>

Normalized record used by <components or flows>.

Fields:

- `id` (string)
  - Stable identifier.
- `<field>` (<type>)
  - <Meaning, normalization, nullability, and examples.>
- `<field>` (<type or null>)
  - <Meaning, normalization, nullability, and examples.>

#### 4.1.2 <Entity Name>

Fields:

- `<field>` (<type>)
  - <Meaning and constraints.>

### 4.2 Configuration Model

Define every configuration value that affects behavior.

- `<config.path>` (<type>, default: <value or none>)
  - <Purpose.>
  - <Validation.>
  - <Environment variable indirection, if supported.>

### 4.3 Runtime State

The implementation MUST maintain authoritative state for:

- <In-flight work, current selection, active sessions, or open operations.>
- <Retry, backoff, cancellation, reconciliation, or restart metadata.>
- <Operator-visible summaries or durable records.>

### 4.4 Error Model

Classify errors by handling policy.

- **Validation error:** <when it occurs; MUST fail fast or prevent dispatch.>
- **Transient external error:** <retry/backoff policy.>
- **Permanent external error:** <how it is surfaced and whether work is released.>
- **Runtime crash:** <restart/recovery behavior.>

## 5. Functional Requirements

### 5.1 <Capability Area>

- The system MUST <observable requirement>.
- The system SHOULD <recommended behavior>.
- The system MUST NOT <forbidden behavior>.

### 5.2 <Capability Area>

- The system MUST <observable requirement>.
- The system MAY <optional behavior and constraints>.

## 6. Lifecycle and Flows

### 6.1 Startup

On startup, the implementation MUST:

1. <Load config, validate prerequisites, recover state, or reconcile external truth.>
2. <Initialize observability, adapters, workspaces, caches, or queues.>
3. <Enter the steady-state loop only after required checks pass.>

### 6.2 Steady State

In steady state, the implementation MUST:

1. <Poll, subscribe, watch, or accept work.>
2. <Normalize and filter candidates.>
3. <Dispatch work within concurrency, permission, or capacity constraints.>
4. <Track and surface progress.>

### 6.3 Stop, Cancel, or Terminal Flow

The implementation MUST define how work stops when:

- <The external state changes.>
- <The operator cancels work.>
- <The runtime exits successfully.>
- <The runtime fails.>

## 7. State Machine

Define the allowed states and transitions.

| State | Meaning | Allowed transitions | Required side effects |
|---|---|---|---|
| `<state>` | <Meaning> | `<state>`, `<state>` | <Logs, writes, cleanup, notifications> |
| `<state>` | <Meaning> | `<state>` | <Logs, writes, cleanup, notifications> |

Transitions outside this table MUST be rejected or treated as implementation-defined and documented.

## 8. Interfaces and Contracts

### 8.1 Public API / CLI / UI Surface

Define commands, endpoints, events, screens, or public methods.

- `<interface name>`
  - Input: <shape and validation>
  - Output: <shape and examples>
  - Side effects: <writes, network calls, logs, state changes>
  - Errors: <error shape and handling>

### 8.2 Adapter Contracts

Each adapter MUST normalize external data into the core domain model before it reaches coordination logic.

- `<adapter>`
  - Source: <external system>
  - Normalized output: <entity>
  - Retry behavior: <policy>
  - Failure handling: <policy>

## 9. Workspace, Filesystem, and Persistence

Define durable paths, generated files, cache rules, and cleanup behavior.

- `<path or location>`
  - Managed by: <component>
  - Created when: <flow>
  - Safe to delete: <yes/no/conditions>
  - Contents: <schema or purpose>

The implementation MUST document whether state survives restart and which state is reconstructed from external systems.

## 10. Observability

At minimum, the implementation MUST expose:

- <Structured log event, status surface, metric, trace, or artifact.>
- <Operator-visible success and failure signal.>
- <Correlation identifier used across flows.>

Every externally visible failure SHOULD include enough context for an operator to determine the affected entity, attempted action, and next safe step.

## 11. Safety, Trust, and Permissions

The implementation MUST document:

- <Sandbox, approval, authentication, or permission posture.>
- <Allowed and forbidden filesystem/network scopes.>
- <Human confirmation points, if any.>
- <Data privacy and retention assumptions.>

## 12. Recovery, Retry, and Reconciliation

The implementation MUST specify:

- Retry limits and backoff policy.
- Which failures are retried, released, or terminal.
- How in-memory state is reconciled with external state after restart.
- How partial side effects are detected and made safe.

## 13. Testing and Validation

### 13.1 Required Tests

- <Unit or contract test for configuration/domain parsing.>
- <Integration test for the primary flow.>
- <Failure/retry/recovery test.>
- <End-to-end or manual smoke test proving the user-visible outcome.>

### 13.2 Acceptance Signals

The implementation is acceptable when:

- <Command, route, UI action, or workflow produces expected output.>
- <Logs or status surface show expected state transitions.>
- <Regression tests pass and cover the new contract.>

## 14. Implementation-Defined Behavior

List choices this spec allows implementations to select, provided they document the selected behavior.

- <Policy or behavior>
  - Required documentation: <what implementers must state>

## 15. Open Questions

- <Question that blocks implementation or standardization.>
- <Question deferred to a later spec revision.>

## 16. Change Log

- Draft v1: Initial specification.
