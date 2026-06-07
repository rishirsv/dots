# Meta Skill Codex-First Eval Cutover Spec

## Purpose

Meta Skill moves from a hidden App Server eval runner to a Codex-first workflow
where child threads, isolated workspaces, transcripts, diffs, and checks are the
primary evaluation experience.

The default user experience is visible and resumable:

```text
Start a Meta Skill eval or improvement loop
-> spawn child Codex threads
-> isolate each attempt in a worktree or fallback workspace
-> let users inspect and resume the attempts in Codex
-> archive transcript, workspace state, diff, checks, final answer, and parent review
```

The CLI remains useful, but it stops pretending to be the main orchestrator. Its
job is to scaffold eval definitions, normalize saved Codex evidence, render run
views, compare attempts, lint/package skills, and preserve durable archives.

## Product Thesis

The Codex app is the product surface users want for skill evaluation:

- attempts are visible as normal Codex threads
- work is naturally parallel
- each attempt has an inspectable diff and conversation
- users can resume, redirect, archive, or keep a branch
- evidence is understandable without opening opaque runner traces

OpenAI's public Codex app positioning matches this shape: Codex is a command
center for supervising multiple agents, agents run in separate project threads,
the app supports worktrees so agents can work on isolated copies of a repo, and
users can review agent changes in-thread. The public Codex changelog also treats
thread, worktree, plugin, automation, and SDK/thread primitives as first-class
Codex surfaces.

Meta Skill should lean into that instead of rebuilding a less visible harness in
Node.

Sources checked:

- https://openai.com/index/introducing-the-codex-app/
- https://openai.com/index/introducing-upgrades-to-codex/
- https://developers.openai.com/codex/changelog

## Hard Cut

App Server stops being the default or supported eval runner.

Remove or replace:

- `plugins/meta-skill/src/app-server/`
- App Server live smoke tests and transcript/client/runner tests
- App Server-specific flags and concepts:
  - `--no-skill`
  - `working_payload`
  - `no_skill`
  - `SkillActivation`
  - trace buffer limits
  - `rpc.jsonl` as the current runner's canonical raw trace
  - App Server token-usage semantics
- docs that teach mounted-skill or App Server execution as the eval model
- lint rules that only exist to police App Server-era wording

Existing App Server evidence becomes legacy evidence. It can be read by a legacy
viewer if necessary, but new code does not preserve the runner as an alternate
default.

## New Runner Boundary

The new runner boundary is:

```text
(project, evals, thread plan, isolation policy) -> saved Codex attempt evidence
```

The runner does not need to force-mount a skill. The child thread receives the
real task, relevant visible fixtures, and a compact envelope describing the
workspace and permissions. The parent keeps criteria, expected answers, scoring
notes, and hypotheses out of the child context.

The parent owns:

- selecting evals
- spawning child threads
- choosing isolation backend
- collecting transcript and workspace evidence
- scoring or marking review-required criteria
- choosing candidate attempts
- merging or discarding worktree changes
- writing the final run summary

Child threads own:

- answering a user-like task
- editing only when the attempt is explicitly an improvement attempt
- running requested checks when allowed
- returning a final answer in the thread

## Isolation Backends

Git worktrees are the default isolation backend for Git projects, but Git is not
a product requirement.

```text
git-worktree
  default for Git repositories
  creates a Codex project thread in a new worktree
  records branch, HEAD, diff, status, and worktree path

scratch-copy
  fallback for non-Git folders or when Git worktree setup is unavailable
  copies the project into an ignored scratch directory
  records file snapshots, changed files, and best-effort patch output

local-thread
  minimal mode for read-only sampling or explicit user choice
  uses the existing checkout
  records transcript and final answer, but marks isolation as weak
```

The product default is `git-worktree` when available. `scratch-copy` exists so
Meta Skill remains useful without Git integration. `local-thread` is acceptable
for read-only review and quick sampling, but not for enterprise-quality
candidate edits.

## Codex Capabilities To Use

The Codex Desktop tool surface supports the shape this cutover needs:

- create a new project thread in either the local checkout or a worktree
- fork a thread into a same-directory child or a worktree child
- list, read, continue, hand off, rename, pin, and archive threads
- read thread summaries through `read_thread`
- store raw session JSONL under the Codex session directory

Observed local storage:

```text
/Users/rishi/.codex/worktrees/<slug>/<repo>
/Users/rishi/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<thread-id>.jsonl
/Users/rishi/.codex/session_index.jsonl
```

The stable join is:

```text
thread id
-> session_meta.payload.id in rollout JSONL
-> session_meta.payload.cwd
-> worktree checkout path
-> git state from that checkout
```

`session_index.jsonl` is useful for thread title and updated-at lookup, but it
is an index, not the source of lineage or tool output. Thread titles are
mutable. Thread IDs are stable.

## Evidence Shape

New run evidence stays under `.meta-skill/runs/`, but the case evidence becomes
thread-centered.

```text
.meta-skill/runs/<run-id>/
  run.json
  attempts/
    <attempt-id>/
      manifest.json
      prompt.md
      visible-files.txt
      transcript.jsonl
      turns.jsonl
      transcript.md
      final.md
      worktree.json
      git-status.txt
      diff.patch
      checks.json
      parent-review.md
```

`run.json` contains:

- run id
- project root
- selected eval ids
- isolation backend
- parent thread id
- child thread ids
- attempt ordering
- result categories
- evidence paths

`manifest.json` contains:

- attempt id
- eval id
- thread id
- parent thread id
- thread title
- source session JSONL path
- capture time
- child cwd
- isolation backend
- model and effort when available
- agent role or nickname when available
- whether the attempt edited files
- parent decision:
  - `accepted`
  - `rejected`
  - `partial`
  - `review-required`
  - `errored`

`worktree.json` contains:

- cwd
- repo root
- `.git` pointer when present
- branch
- HEAD
- dirty status
- changed paths
- whether the workspace is preserved or disposable

`turns.jsonl` is the normalized transcript:

- timestamp
- turn id
- role
- item type
- message text
- tool call name
- tool call arguments
- tool output summary or saved output reference
- final answer marker

Encrypted reasoning payloads are never treated as evidence.

## Eval Definition Shape

The authored eval shape remains:

```text
.meta-skill/evals/<slug>/
  task.md
  criteria.json
  fixtures/
```

`task.md` remains solver-visible and user-like. It must not tell the child
thread it is running a benchmark, grader pass, or self-eval.

`criteria.json` remains evaluator-only. It is never sent to the child thread.

Optional fixtures are copied or made visible according to the isolation backend.
The child sees only task text, allowed fixtures, and the workspace envelope.

## Workflow: Eval Sampling

`evaluate-skill` uses Codex child threads to sample behavior.

1. Parent validates eval definitions and fixture references.
2. Parent creates a run id and selected attempt plan.
3. For each eval, parent spawns a child thread.
4. Each child receives:
   - the user-like task
   - relevant fixtures
   - a compact workspace envelope
   - no criteria or expected answer
5. Parent waits for completion or timeout.
6. Parent archives transcript and workspace evidence.
7. Parent reviews `final.md`, `turns.jsonl`, checks, and diff.
8. Parent records criteria as review-required, passed by explicit evidence, or
   failed by explicit evidence.

This is behavior evidence, not a sealed benchmark verdict. The default report
must say what evidence was captured and what still needs human review.

## Workflow: Improve Loop

`improve-skill` becomes a Codex-thread-native improvement loop.

```text
scan evidence
-> write non-overlapping attempt briefs
-> spawn child worktree threads
-> collect transcripts, diffs, checks
-> review attempts
-> accept one candidate or synthesize follow-up attempts
```

The Evo-inspired operating loop is:

```text
scan -> aggregate -> brief -> execute -> verify -> collect
```

Useful attempt roles:

- `research`: gather external or local evidence without editing
- `candidate`: make a bounded edit in an isolated workspace
- `review`: inspect one candidate's diff and transcript
- `baseline`: answer the same task without seeing the candidate diff

Do not create a hidden automatic optimizer first. Start with a visible,
parent-supervised loop. Add frontier policy, repeated rounds, and proposal logs
after the single-round attempt flow is reliable.

## Workflow: Auto-Research And Iteration

Auto-research is a first-class workflow, but it uses the same evidence spine.

```text
.meta-skill/runs/<run-id>/
  proposals.jsonl
  attempts/<attempt-id>/
```

`proposals.jsonl` is append-only. Each proposal includes:

- proposal id
- source evidence path
- hypothesis
- intended eval or improvement target
- suggested child role
- expected validation signal
- parent decision

Research threads should write report-ready notes into their attempt folder, not
directly into runtime skill payloads. The parent decides which findings become
skill edits, eval seeds, review notes, or discarded observations.

## Command Surface

Hard-cut the App Server-shaped `run` semantics. Keep the top-level command small
and Codex-first.

Recommended surface:

```text
meta-skill evals create <project>
meta-skill run <project> [--eval <id>] [--attempts <n>] [--isolation <mode>]
meta-skill view <project> [--run <id>|--last] [--json]
meta-skill harvest <project> --thread <thread-id> --run <run-id>
meta-skill review <project>
meta-skill package <project>
```

`meta-skill run` in Codex Desktop should use native thread creation. Outside
Codex Desktop, it may print the required prompts and stop, or run only the
evidence parsing/reporting portions that do not require thread creation.

`meta-skill harvest` is important because it makes the model testable. Given a
thread id, it can locate raw session JSONL, normalize it, join to cwd/worktree,
capture git state, and write the attempt evidence folder. This command can be
tested without spawning live Codex threads.

## Codex Desktop Dependency

This cutover intentionally makes the full runner a Codex Desktop/plugin
workflow.

The CLI should detect whether native thread/worktree capabilities are available:

- if available, run the full flow
- if unavailable, print the child-thread prompt plan and explain that harvesting
  can run after the user supplies thread IDs
- never silently fall back to App Server

This keeps the product honest. The default is Codex-first, not CLI-first.

## Cutover Phases

### Phase 1: Specify And Freeze The New Evidence Contract

Actions:

1. Add this spec.
2. Add fixture transcript JSONL for one child thread.
3. Add tests for transcript normalization into `turns.jsonl`.
4. Add tests for worktree metadata extraction from a fake checkout.
5. Add tests for evidence folder rendering.

Acceptance:

- A fixture Codex transcript can become `manifest.json`, `turns.jsonl`,
  `transcript.md`, and `final.md`.
- Worktree metadata can be recorded without live Codex tools.

### Phase 2: Build Harvest And View First

Actions:

1. Implement `meta-skill harvest`.
2. Implement `meta-skill view`.
3. Keep existing eval generation and lint behavior.
4. Do not yet spawn live child threads from the CLI.

Acceptance:

- Given a real thread id, the command archives transcript and workspace evidence
  under `.meta-skill/runs/<run-id>/attempts/<attempt-id>/`.
- `view` renders attempts, final answers, diffs, checks, and review status.

### Phase 3: Replace `run` With Codex Thread Orchestration

Actions:

1. Change `meta-skill run` to create child Codex threads when available.
2. Use `git-worktree` isolation by default for Git repos.
3. Support `scratch-copy` for non-Git folders.
4. Save prompts and visible-file manifests before sending child tasks.
5. Harvest each child thread after completion.

Acceptance:

- A multi-eval run creates visible Codex child threads.
- Each child attempt has transcript, workspace, final, and diff evidence.
- The run report links thread IDs and saved evidence paths.

### Phase 4: Hard-Cut App Server Code And Docs

Actions:

1. Delete `src/app-server/`.
2. Remove App Server tests.
3. Remove App Server flags, model fields, docs, and lint wording.
4. Rewrite `ARCHITECTURE.md`, `evaluate-skill`, `improve-skill`,
   `create-skill`, `meta-skill`, and `cli-conventions`.
5. Refresh `.plans/WORK-TRACKER.md` around Codex-first evidence and viewing.

Acceptance:

- `rg -n "App Server|app-server|rpc.jsonl|mounted-skill|--no-skill" plugins/meta-skill`
  returns only legacy notes or no matches.
- `npm test`, `npm run typecheck`, and relevant skill lints pass.

### Phase 5: Add Improvement Attempts And Research Proposals

Actions:

1. Teach `improve-skill` to write attempt briefs.
2. Add attempt roles: research, candidate, review, baseline.
3. Add append-only `proposals.jsonl`.
4. Add parent review summaries that cite saved attempt evidence.

Acceptance:

- A user can run a visible three-attempt improvement loop.
- The parent can accept, reject, or request follow-up attempts from saved
  evidence.

## Test Strategy

Unit tests:

- parse Codex session JSONL
- normalize turns and final answers
- ignore encrypted reasoning as evidence
- join thread id to session path
- extract cwd and worktree metadata
- render `transcript.md`
- write attempt evidence folders
- classify attempt decisions

Integration tests:

- harvest from fixture session JSONL
- harvest from a fake Git worktree
- view a run with multiple attempts
- run with unavailable thread capabilities prints a clear handoff plan
- package still excludes `.meta-skill/`
- lint still protects runtime skill payload boundaries

Live smoke tests:

- optional and explicitly gated
- create a Codex child thread in a worktree
- complete a tiny read-only task
- harvest transcript and workspace evidence
- verify no App Server process starts

## Risks

### Native Thread API Availability

The current tool surface exposes thread and worktree creation to Codex Desktop,
but the standalone Node CLI does not automatically have those tools. Treat this
as a Codex Desktop/plugin workflow first. Build CLI fallbacks for harvesting and
viewing, not for recreating the full UX.

### Transcript Format Drift

Raw session JSONL is rich but internal. Normalize only stable fields:

- session id
- cwd
- parent/source ids
- turn ids
- messages
- tool calls
- tool outputs
- timestamps

Keep raw `transcript.jsonl` beside normalized extracts so future parsers can
recover from drift.

### Gitless Projects

Worktrees are enterprise-worthy for Git repos, but Meta Skill should not require
Git. `scratch-copy` keeps the workflow usable. Evidence reports must clearly
mark the isolation backend so weak isolation is not mistaken for worktree-grade
evidence.

### Baselines And Skill Uplift

The App Server `--no-skill` model was not true natural trigger proof. Removing
it is acceptable. Baseline attempts should become ordinary child threads with
different prompt visibility or different payload exposure, and reports should
describe them as comparative behavior evidence, not automatic proof.

### Enterprise Controls

The new flow is enterprise-friendly when it preserves:

- isolated workspaces
- exact diffs
- branch and HEAD metadata
- visible threads
- transcript archives
- explicit parent decisions
- no hidden criteria in child prompts
- clean packaging boundaries

It is not enterprise-friendly if child threads can edit shared files without
disjoint scope or if evidence depends only on mutable thread titles.

## Open Questions

1. Should `meta-skill run` spawn child threads directly through a plugin tool, or
   should the skill workflow orchestrate threads while the CLI only harvests?
2. Should attempt worktrees be preserved by default, or disposed unless the user
   accepts a candidate?
3. Should accepted attempts merge into the source checkout automatically, or
   should they always require a separate user-approved handoff?
4. Should `scratch-copy` attempt to produce patches, or only changed-file
   snapshots?
5. Should `view` link to Codex thread IDs through a local app URL once that URL
   scheme is confirmed?

## Recommended Direction

Make Codex-first evaluation the default product experience and hard-cut App
Server runner support.

Build the first implementation around harvesting and viewing Codex child-thread
evidence. Then add child-thread spawning. This order proves the evidence spine
before coupling Meta Skill to live Desktop orchestration.

The result is a more visible, recoverable, and user-preferred eval loop:

```text
Codex is the evaluator interface.
Worktrees are the preferred isolation unit.
Local files are the durable archive.
Meta Skill is the scaffold, harvester, viewer, and reviewer.
```
