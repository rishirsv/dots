# Assessment Lenses

Read this before assessing a repo or project for harness-engineering
opportunities. Adapt the lenses to the project's stack, maturity, risk, and
existing conventions; do not treat every lens as equally important for every
project.

## Repository Map And Source Of Truth

Ask whether agents can quickly answer:

- What are the main domains, packages, apps, services, or deliverables?
- Where are architecture rules, product rules, plans, validation commands, and
  generated artifacts documented?
- Is the instruction entrypoint a compact map, or a stale manual?
- Are deeper docs indexed, current, and linked to the code they describe?
- Are active plans, completed plans, trackers, and architecture docs versioned
  in predictable locations?

Good harness state: short entrypoint instructions, deeper source-of-truth docs,
current architecture map, clear plan/tracker conventions, and checks for
drift-prone docs.

## Runtime Legibility And Local Reproducibility

Ask whether agents can boot, inspect, and validate the system without human
handholding:

- Is there a single local setup path?
- Can branches or worktrees run isolated app instances?
- Are seed data, fixtures, test accounts, or local services documented?
- Are UI, API, CLI, simulator, logs, screenshots, traces, or metrics accessible
  through text or tool interfaces?
- Can agents capture before/after evidence for a bug or feature?

Good harness state: repo-local setup/boot/test commands, deterministic fixtures,
runtime evidence artifacts, and minimal manual copying from external tools.

## Feedback Loops And Validation

Ask whether the repo can tell an agent when work is correct:

- Are there fast focused checks and slower comprehensive checks?
- Are tests discoverable by feature or domain?
- Are lints, typechecks, and structural tests enforcing high-value rules?
- Are manual QA steps captured as scripts, ledgers, screenshots, videos, or
  acceptance checks?
- Does CI output help agents fix failures quickly?
- Are flaky tests tracked instead of normalized?

Good harness state: clear command menu, focused verification modes, concise
failure output, evidence artifacts, and validation expectations embedded in
plans and PR workflows.

## Architecture Boundaries And Enforceable Invariants

Ask whether architecture is merely described or mechanically guarded:

- Are dependency directions clear and enforced?
- Are generated artifacts separated from source-of-truth files?
- Are data boundaries parsed or typed at ingress and egress?
- Are cross-cutting concerns routed through explicit interfaces?
- Are naming, logging, telemetry, schema, security, reliability, and migration
  conventions enforceable?

Good harness state: structural tests, custom lints, type rules, schema checks,
or CI gates with remediation guidance.

## Agent Workflow And Tool Ergonomics

Ask whether agents can perform normal engineering loops end to end:

- Can agents inspect issues, PRs, reviews, and CI through tools or CLIs?
- Are commands stable, documented, and token-efficient?
- Do scripts suppress passing noise and surface actionable failures?
- Are common tasks encoded as skills, scripts, prompts, or repo-local
  instructions?
- Are escalation points for human judgment explicit?

Good harness state: stable CLI surfaces, agent-friendly help output, review and
feedback loops agents can consume, and low-copy handoffs.

## Entropy Control And Garbage Collection

Ask whether the repo prevents agent-generated drift from compounding:

- Are repeated review comments promoted into docs, lints, tests, or scripts?
- Is there recurring cleanup or doc-gardening?
- Are stale plans, stale docs, and known debt tracked?
- Are bad patterns detected before they spread?
- Is there a quality/readiness tracker that reflects real code behavior?

Good harness state: continuous small cleanup, drift detection, evidence-backed
debt items, and durable rules promoted only when recurrence is likely.

## Priority Bands

Use priority bands instead of numeric maturity scores:

- `Highest leverage`: materially increases agent autonomy, validation quality,
  architectural coherence, or human attention savings across the repo.
- `Near-term`: valuable and bounded; likely to fit a focused plan or PR.
- `Later`: useful after foundational harnesses exist, lower risk, or blocked by
  missing context.
- `Already strong`: preserve and route future agents through this existing
  harness.
