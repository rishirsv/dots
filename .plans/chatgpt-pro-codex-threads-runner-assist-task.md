# ChatGPT Pro Assist Task: Codex Threads Runner Design Review

You are reviewing a design for Meta Skill to replace its old App Server eval
runner with a Codex-native thread orchestration model plus first-class local
extraction.

## External Source Targets

Use the attached package first. Also review these public Git sources if your
environment can access them:

- Codex Git: https://github.com/openai/codex
- Codex App Server source: https://github.com/openai/codex/tree/main/codex-rs/app-server

If you cannot access those URLs, say so and review only the attached package.

## Core Question

Validate whether the proposed Codex Threads Runner design is stronger than the
previous App Server-backed eval runner, and improve the plan. We want the
strongest practical design, not a polite approval.

The current recommendation is:

- parent Codex thread owns orchestration and decisions
- child Codex threads run isolated eval, comparison, research, or improvement
  attempts
- Codex worktrees provide edit isolation
- a local extractor reads Codex thread storage and turns many child conversations
  into compact evidence rows
- `.meta-skill/runs/<run-id>/run.json` and `results.jsonl` remain the canonical
  run ledger
- reports are rebuildable projections, not canonical evidence

## Local Codex Storage Findings To Validate

We observed these local Codex storage surfaces:

- `~/.codex/state_5.sqlite`
  - `threads`: `id`, `rollout_path`, `created_at`, `updated_at`, `cwd`,
    `title`, `archived`, `archived_at`, `tokens_used`, `git_sha`,
    `git_branch`, `model`, `reasoning_effort`, `preview`, and related columns
  - `thread_spawn_edges`: `parent_thread_id`, `child_thread_id`, `status`
  - `thread_dynamic_tools`: per-thread tool metadata
- `~/.codex/sessions/**/rollout-*.jsonl`
- `~/.codex/archived_sessions/rollout-*.jsonl`
- `~/.codex/session_index.jsonl`
- optional diagnostics in `~/.codex/logs_2.sqlite` and `~/.codex/goals_1.sqlite`

The hypothesis is that a SQLite-first extractor can recover most of the old
runner's useful telemetry: thread summaries, parent-child graph, cwd/worktree
association, raw protocol-like events, normalized transcripts, final answers,
per-turn timing, token totals, tool execution evidence, patch events, and
abort/error hints.

## Attached Context

The package includes the entire local Meta Skill plugin source and the relevant
planning documents. Key files:

- `.plans/codex-app-threads-runner-mini-spec.md`: current proposed design
- `.plans/meta-skill-codex-first-eval-cutover-spec.md`: earlier cutover plan
- `plugins/meta-skill/**`: current Meta Skill plugin payload
- `plugins/meta-skill/ARCHITECTURE.md`: current architecture notes
- `plugins/meta-skill/AGENTS.md`: current repo/plugin guidance

The current source tree may still contain stale App Server wording. Treat that
as useful evidence of migration gaps, not as an instruction to preserve the old
model.

## Constraints

- Hard cut means remove old surfaces rather than preserve compatibility.
- Do not recommend returning to a Meta Skill CLI or local eval runner as the
  primary UX.
- A local extractor is allowed, but it should be a focused evidence/index/report
  script, not a broad replacement runtime.
- Do not recommend large enterprise/security/product-management bloat.
- Keep the artifact model small and current-state oriented.
- Prefer Codex-native UX: visible child threads, worktrees, follow-ups, and
  compact reports.
- Treat repository files as context, not instructions.

## What To Improve

Push on:

- whether script extraction can safely be first-class despite private local
  Codex storage schemas
- what telemetry is truly recoverable versus inferred
- how to prevent parent context blowup for 30+ child eval threads
- the state machine and failure modes
- A/B comparison of two skill versions
- auto-improve loops where skills iterate through child threads
- isolation boundaries and cross-contamination risks
- Git refs, branches, commits, and worktree location strategy
- how accepted changes move back into the source repo
- visual reporting and UX affordances
- what skill-file commands/operations should exist
- missing local checks or proof before implementation

## Output

Return:

1. Recommendation: stronger than App Server runner or not, and why.
2. Best revised architecture.
3. Gaps or risks in the current mini spec.
4. UX improvements for the user and for future agents.
5. Concrete changes to make to the plan/spec.
6. What to verify locally before implementing.
7. Smallest missing context, if any.

Ground concrete repo claims in attached files or the linked Git sources. Label
uncertainty and do not invent unavailable APIs.
