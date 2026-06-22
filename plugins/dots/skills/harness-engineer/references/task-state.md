# Task State

Use this for long-running, multi-step, multi-agent, browser-facing, or resumable
work.

## Required Sections

A good task-state artifact lets a fresh agent continue without chat history.

Include:

- objective;
- non-goals;
- constraints and approval gates;
- relevant instructions and source-of-truth docs;
- command map;
- verification map;
- acceptance criteria;
- progress ledger;
- decisions made;
- files touched or likely to touch;
- blockers and open questions;
- next step.

## Command Map

Group commands by purpose:

- bootstrap/setup;
- format;
- lint;
- typecheck;
- unit tests;
- integration tests;
- build/package;
- dev server;
- browser/E2E;
- generate/sync;
- CI parity.

Mark unverified commands as candidates.

## Verification Map

For each change type, list:

- relevant check;
- expected signal;
- fast local command;
- full local command if different;
- CI equivalent if known;
- when it can be skipped and why.

## Browser/Runtime Checks

For UI or browser-facing work, capture:

- dev server command;
- expected URL;
- routes or workflows to inspect;
- required viewport/device states;
- console/runtime error checks;
- screenshot or visual evidence expectation;
- known flaky or external dependencies.

## Progress Ledger

Each entry should include:

- timestamp or sequence number;
- action taken;
- files changed;
- commands run and result;
- validation completed;
- blockers;
- next step.

## Resume Handoff

End task state with one plain-language sentence:

`The next agent should start by ...`
