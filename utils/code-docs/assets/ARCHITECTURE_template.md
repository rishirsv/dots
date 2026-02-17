---
name: architecture
description: High-signal architecture template for ARCHITECTURE.md (bird's-eye view + codemap + invariants).
---

# ARCHITECTURE.md

## Purpose
Describe the stable, high-level architecture so contributors can quickly answer:
- What problem does this system solve?
- Where does each responsibility live?
- What constraints must never be broken?

Keep this document concise and durable. Prefer stable structure and invariants over volatile implementation details.

## Bird's-Eye View

- **System goal:** <one sentence>
- **Primary inputs:** <events/requests/data>
- **Primary outputs:** <user-visible behavior/artifacts>
- **Success condition:** <how we know the architecture is working>

## System Boundaries

- **In scope:** <what this repo/system owns>
- **Out of scope:** <external systems and non-owned concerns>

Boundary list (explicitly call these out):
- **API boundary:** <module or package boundary with separate consumers>
- **Runtime boundary:** <process/thread/device/network boundary>
- **Data boundary:** <database/file/queue/storage boundary>

## Code Map

Use coarse-grained modules. This section should help a reader answer "where is X?" without reading the whole repo.

### <Area A>
- **Owns:** <responsibilities>
- **Key files/modules:** <names, not brittle deep links>
- **Architecture invariants:**
  - <must always be true>
  - <absence-based rule, if relevant>
- **Not owned here:** <what belongs elsewhere>
- **API boundary:** <Yes/No + why>

### <Area B>
- **Owns:** <responsibilities>
- **Key files/modules:** <names>
- **Architecture invariants:**
  - <must always be true>
- **Not owned here:** <what belongs elsewhere>
- **API boundary:** <Yes/No + why>

### <Area C>
- **Owns:** <responsibilities>
- **Key files/modules:** <names>
- **Architecture invariants:**
  - <must always be true>
- **Not owned here:** <what belongs elsewhere>
- **API boundary:** <Yes/No + why>

## Core Flows

Describe only the highest-impact flows.

### Flow: <name>
1. <entry point>
2. <major processing step>
3. <result>

**Failure behavior:** <how errors/degraded behavior is handled>

### Flow: <name>
1. <entry point>
2. <major processing step>
3. <result>

**Failure behavior:** <how errors/degraded behavior is handled>

## Cross-Cutting Concerns

- **State and persistence:** <where state lives + lifecycle>
- **Error handling:** <policy and escalation>
- **Observability:** <logs/metrics/traces and where they originate>
- **Configuration and secrets:** <where config is defined and how secrets are protected>
- **Performance constraints:** <critical latency/memory/throughput assumptions>

## Design Constraints and Forbidden Couplings

- <anti-pattern> -> <required pattern>
- <anti-pattern> -> <required pattern>

## Optional Project Add-ons

Include only when useful for this repo:
- **Stack snapshot:** runtime/language/framework/tooling
- **Data and integrations:** datastores + external services + failure modes
- **Deployment and environments:** dev/stage/prod differences
- **Decision log:** major architecture decisions and tradeoffs
- **Diagrams:** context/container/component maps
- **Verification:** commands/checks that validate architecture assumptions

## Open Questions (Optional)

- <question> - <why it matters>
