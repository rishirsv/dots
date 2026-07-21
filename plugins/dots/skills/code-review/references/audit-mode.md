# Audit Mode

Audit an explicit repository, subsystem, package, branch, or category. Find and
verify the highest-value improvements, write the audit report, and stop. A
separate task owns any selected fix or implementation plan.

Read [Review Checklists](review-checklists.md). Apply intent, standards,
correctness, all three Simplify lanes—including the required over-engineering
scan—and only the conditional risk checks the target activates. Skip changed-
code-only Code Judo unless the audit target is a branch or diff.

## Keep The Audit Report-Only

1. Write only the audit document. Do not edit source, configuration, tests,
   fixtures, or generated product files.
2. Run only read-only, side-effect-free checks such as no-emit typechecks,
   check-mode lint, dependency audits, and cheap non-mutating tests.
3. Never reproduce secret values. Cite only the file, line, and credential type;
   recommend rotation.
4. Follow repository instructions and distinguish governing docs from ordinary
   source, comments, fixtures, and generated files.
5. State what was not audited.

## Declare Scope

Derive the target from the user's named repo, subsystem, paths, branch, or
category. Ask one concise question only when ambiguity would materially change
cost or coverage.

Record:

- **Target**: repo, subsystem, package, branch, paths, or category
- **Coverage**: full, hotspot-weighted, sampled, or branch changes plus direct
  callers/importers
- **Depth**: Direct or Deep
- **Skipped**: generated, vendored, dependency, build, media, or out-of-scope
  surfaces
- **Validation**: exact read-only commands

Do not widen a change review into an audit or narrow a repository audit to the
current diff.

## Map The Target

- Read the main README, repository instructions, contributor guidance, root
  configuration, manifests, CI, module docs, and top-level structure.
- Identify languages, frameworks, package managers, deployment targets, and the
  available build, test, lint, typecheck, and dependency checks.
- Capture repository conventions for ownership, layout, state, errors, and
  tests.
- Read governing product, architecture, schema, decision, plan, and test-
  ownership docs.
- Use git history and churn only when they help locate risk or unclear
  ownership.

Record missing or broken verification rather than pretending a baseline exists.

## Set Depth And Lanes

Use Direct for a narrow target. Use Deep for broad or high-risk targets and
explicit exhaustive requests. Declare whether Deep coverage is full, hotspot-
weighted, or sampled; Deep never implies uncapped whole-repository coverage.

For broad targets, run independent read-only finder lanes when they improve
coverage. Give each finder the same packet:

- target, coverage, depth, and skipped paths;
- repository guidance and governing intent;
- language, framework, commands, key directories, and local risk hints;
- decided tradeoffs that must not become findings;
- assigned categories and required finding fields; and
- report-only, secret-handling, and repository-instruction rules.

Require findings only, no fixes or file dumps, and `no findings` when clean.
Treat finder locations and claims as leads until the parent confirms them.

## Inspect Applicable Categories

### Correctness

Trace errors, state transitions, cleanup, null and empty flows, boundaries,
races, idempotency, resource ownership, impossible states, and direct contracts.

### Security

Trace credentials, identity and ownership checks, request authenticity,
untrusted data crossing into SQL, shell, HTML, dynamic execution, filesystem, or
privileged APIs, dangerous uploads, reachable dependency advisories, production
configuration, and sensitive logging. Describe defensive remediation without
runnable misuse instructions. Do not report documented platform conventions or
intentional tradeoffs as defects.

### Performance

Look for algorithmic and architectural wins: N+1 work, repeated scans or calls,
over-fetching, missing pagination, large payloads, hot-path work, avoidable
render or bundle waterfalls, missing indexes implied by queries, and redundant
CI/build work. Skip speculative micro-optimizations.

### Test Coverage

Map critical and high-churn paths to meaningful tests. Flag dangerous gaps and
tests that assert little, test mocks instead of behavior, rely on unread
snapshots, use real time or networks unnecessarily, or place slow coverage at
the wrong layer.

### Architecture And Maintainability

Report incidental duplicated policy, layering violations, cycles, or unclear
ownership. Route architecture-first seam discovery and interface design to
Architecture Review.

Aggressively identify over-engineering using the checklist definition. Include
extra process, documents, schemas, and compatibility machinery when their
results change no decision or protect no real boundary.

### Dependencies And Migrations

Check major-version lag with concrete cost, announced deprecations, abandoned
critical dependencies, duplicate dependencies, manifest/lockfile drift, and
inconsistent pinning. Estimate blast radius before recommending migration.

### DX, Tooling, And Docs

Check broken or missing feedback paths, slow loops, setup drift, undocumented
environment requirements, missing examples, unstructured logs, and stale public
or architectural docs only when the gap has concrete user or maintenance cost.

## Verify And Prioritize

Open every cited source before keeping a finding. Correct, merge, downgrade, or
reject by-design behavior, weak evidence, duplicates, and fixes whose benefit
does not justify their risk.

Order findings by leverage: impact divided by effort, discounted by confidence
and fix risk. Prefer high-confidence findings with clean verification. Record
`not worth doing` when that decision prevents repeat investigation.

## Write The Report

Use the user-named path or
`.agents/outputs/code-review-audit-<target>.md`. Write a report even when no
findings are confirmed.

Lead with Target, Coverage, Depth, Reviewed, Skipped, and Validation. For each
finding include:

- imperative title and category;
- evidence at `path:line` and the established mechanism;
- concrete user, production, maintenance, or verification impact;
- S, M, or L effort, including tests;
- LOW, MED, or HIGH fix risk and what could break;
- HIGH, MED, or LOW confidence; and
- a short fix sketch, not an implementation plan.

Put credible unconfirmed claims under `Needs verification` with the exact
evidence needed. Add dependency ordering when fixes depend on one another,
rejected candidates when they prevent repeat investigation, unaudited areas
when coverage is incomplete, and a next task only for warranted follow-up.
Return the report path and concise result in chat; do not continue into planning
or implementation.
