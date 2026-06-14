# Long-Running State

Read this when creating or auditing harness state for a multi-step task.

Long-running agent work needs enough durable state that a fresh agent can resume
without reconstructing the task from chat history.

## Init Checklist

Capture these surfaces before implementation:

- Objective, non-goals, constraints, and user approval gates.
- Relevant instruction files and ownership boundaries.
- Command map for setup, lint, test, build, typecheck, dev server, database, and
  CI where applicable.
- Verification map with cheap checks, targeted checks, full checks, and manual
  checks.
- Acceptance criteria tied to observable behavior.
- Progress ledger path and update cadence.
- Browser/dev-server checks for UI work.
- External dependencies, credentials, services, migrations, and data risks.
- Handoff notes for known unknowns and deferred checks.

## Progress Ledger

Use a ledger when the task may span more than one turn, thread, day, or agent.

Keep it compact and append-friendly:

- current status
- decisions made
- commands run and results
- files changed or expected to change
- validation completed
- blockers and open questions
- next step for a fresh agent

Do not store secrets, credentials, private messages, or external-write targets
unless the user explicitly approves the location and purpose.

## Command Map

Group commands by intent, not by package manager:

- setup/install
- lint/static analysis
- unit tests
- integration/end-to-end tests
- build/typecheck
- dev server
- database/migrations/seed data
- format/generate
- CI/release

If a command is inferred from convention rather than found in files, mark it
`candidate` and verify before using it as evidence.

## Verification Map

For each acceptance criterion, name the cheapest reliable check:

- file inspection for static changes
- unit or targeted tests for local behavior
- typecheck/lint/build for integration risk
- browser render checks for UI
- screenshot or canvas-pixel checks for visual/canvas/3D work
- log or observability checks for background services
- human review for judgment-heavy claims

Report skipped checks honestly with the reason.

## Browser And Dev-Server Checks

For frontend work, identify:

- command to start the app
- expected URL or how to discover it
- viewport sizes that matter
- primary route or workflow to inspect
- nonblank render check
- overlap/layout check
- console/runtime error check
- screenshot or visual evidence when useful

Do not leave a needed dev server running at final delivery unless the user asked
for it or it is clearly part of the active task.

## Resume Handoff

End each long-running segment with:

- what is done
- what is unverified
- exact next command or file to inspect
- any user decision needed before writes, destructive actions, sync, install,
  publish, or commit
