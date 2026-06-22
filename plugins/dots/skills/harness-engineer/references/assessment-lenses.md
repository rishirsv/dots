# Assessment Lenses

Use these lenses for broad or deep repo readiness assessment. Report strengths
before gaps.

## 1. Repo Map And Source Of Truth

Check whether a fresh agent can identify:

- what code is source vs generated;
- where durable docs live;
- where task-local plans/state live;
- which files should not be edited;
- where architecture, ownership, or domain context is documented.

Good signal: root instructions route to exact docs and paths instead of
duplicating them.

## 2. Runtime Legibility

Check whether a fresh agent can set up and run the repo without guessing:

- package manager and language versions;
- bootstrap command;
- dev server command and expected URL;
- environment variables and secret boundaries;
- migrations, fixtures, sample data, or external services.

Good signal: setup commands are non-interactive or clearly documented, with
concise failure modes.

## 3. Feedback Loops

Check whether agents can validate changes cheaply and reliably:

- format, lint, typecheck, unit, integration, build;
- targeted vs full-suite checks;
- browser/E2E checks when UI behavior matters;
- CI parity and generated-file checks.

Good signal: the repo tells agents which checks to run after which kinds of
changes.

## 4. Architecture Boundaries

Check whether the repo makes important boundaries visible:

- module ownership;
- API boundaries;
- generated artifacts;
- public vs internal interfaces;
- data/schema migration rules;
- cross-cutting invariants.

Good signal: important boundaries are backed by tests, lint rules, schemas, or
CI where practical.

## 5. Agent Workflow Ergonomics

Check whether future agents can resume and hand off:

- existing plan/ledger convention;
- current task state;
- command history and results;
- known blockers and approval gates;
- acceptance criteria and next step.

Good signal: a fresh agent can continue without chat history.

## 6. Entropy Control

Check whether harness surfaces stay clean:

- no duplicate command maps;
- no stale generated files;
- no conflicting instructions;
- no long root instruction manuals;
- no abandoned plans masquerading as durable docs.

Good signal: validation or review catches stale links, stale commands, and
generated/source drift.

## Priority Bands

- `Highest leverage`: likely to prevent repeated failure or unblock many future
  tasks.
- `Near-term`: useful and bounded, but not the next bottleneck.
- `Later`: valuable after higher-risk gaps are fixed.
- `Already strong`: preserve; do not rewrite without need.
