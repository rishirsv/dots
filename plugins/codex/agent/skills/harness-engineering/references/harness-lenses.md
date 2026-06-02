# Harness Engineering Lenses

Use these lenses to find repo-specific harness opportunities. Do not treat them as a checklist that every project must satisfy equally. Adapt to the project's stack, maturity, risk, and existing conventions.

## 1. Repository Map And Source Of Truth

Look for whether agents can quickly answer:

- What are the main domains, packages, apps, services, or deliverables?
- Where are architecture rules, product rules, plans, and validation commands documented?
- Is `AGENTS.md` a compact table of contents, or a stale manual?
- Are deeper docs indexed, current, and linked to the code they describe?
- Are active plans, completed plans, trackers, generated references, and architecture docs versioned in the repo?

Good harness shape:

- Short agent entry point.
- Deeper source-of-truth docs in predictable locations.
- Current architecture map.
- Clear plan/tracker conventions.
- Mechanical checks or recurring doc gardening for drift-prone docs.

## 2. Agent-Legible Runtime And Local Reproducibility

Look for whether agents can boot, inspect, and validate the system without human handholding:

- Is there a single local setup path?
- Can separate worktrees or branches run isolated app instances?
- Are seed data, fixtures, test accounts, or local services documented?
- Are UI, API, CLI, mobile simulator, logs, screenshots, traces, or metrics accessible to agents through text/tool interfaces?
- Can agents capture before/after evidence for a bug or feature?

Good harness shape:

- Repo-local commands for setup, boot, test, and focused validation.
- Deterministic fixtures or seeded states.
- Screenshots/video/logs/metrics/traces where relevant.
- Minimal human copying between external tools and the agent runtime.

Examples:

- Web app: browser automation, DOM snapshots, screenshots, journey scripts, logs.
- iOS app: simulator build/run/test tools, screenshots/video, OS logs, UI tests, fixture-backed flows.
- Backend service: local service boot, API contract tests, logs, traces, metrics, seed data.
- Library: type checks, unit/property tests, API docs, examples, release dry-runs.
- Data/ML project: dataset manifests, reproducible scripts, eval sets, metric reports.

## 3. Feedback Loops And Validation

Look for whether the repo can tell an agent when work is correct:

- Are there fast focused checks and slower comprehensive checks?
- Are tests discoverable by feature/domain?
- Are lints and structural tests enforcing high-value rules?
- Are manual QA steps captured as scripts, ledgers, screenshots, videos, or acceptance checks?
- Does CI output help agents fix failures quickly?
- Are flaky tests tracked and handled without hiding real regressions?

Good harness shape:

- Clear command menu.
- Focused verification modes.
- Concise failure output.
- Evidence artifacts for user-visible flows.
- Validation expectations embedded in plans and PR/review workflows.

## 4. Architecture Boundaries And Enforceable Invariants

Look for whether architecture is merely described or mechanically guarded:

- Are data boundaries parsed or typed at ingress/egress?
- Are dependency directions clear and enforced?
- Are cross-cutting concerns routed through explicit interfaces?
- Are naming, logging, telemetry, file-size, schema, and reliability conventions enforced?
- Are generated artifacts separated from source-of-truth files?

Good harness shape:

- Structural tests, custom lints, type rules, or CI checks.
- Error messages that tell agents how to remediate.
- Centralized helpers for repeated invariants.
- Explicit allowed edges between domains/layers.

## 5. Agent Workflow And Tool Ergonomics

Look for whether agents can perform normal engineering loops end to end:

- Can agents inspect PRs/issues/reviews through tools or CLIs?
- Are commands stable, documented, and token-efficient?
- Do scripts suppress passing noise and surface actionable failures?
- Are common tasks encoded as skills, scripts, prompts, or repo-local instructions?
- Are there clear escalation points for human judgment?

Good harness shape:

- Stable CLI surfaces for repo operations.
- Agent-friendly help output.
- Review and feedback loops that agents can consume.
- Minimal copy/paste from inaccessible systems.

## 6. Entropy Control And Garbage Collection

Look for whether the repo prevents agent-generated drift from compounding:

- Are repeated review comments promoted into docs, lints, tests, or scripts?
- Is there a recurring cleanup or doc-gardening process?
- Are stale plans, stale docs, and known debt tracked?
- Are bad patterns detected before they spread?
- Is there a quality or readiness tracker that reflects real code behavior?

Good harness shape:

- Continuous small cleanup tasks.
- Drift detection.
- Quality/readiness notes with evidence.
- Debt items that point to executable proof, not only prose.

## Priority Bands

Use priority bands instead of numeric scores:

- `Highest leverage`: materially increases agent autonomy, validation quality, or architectural coherence across the repo.
- `Near-term`: valuable and bounded, likely to fit a focused plan or PR series.
- `Later`: useful after foundational harnesses exist, or lower risk.
- `Already strong`: preserve and route future agents through this existing harness.
