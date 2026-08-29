---
name: self-improve
description: "Use only when the user selects `$self-improve` to reflect on an agent task, diagnose workflow or harness friction, evaluate how they work with agents, or mine Codex or Claude sessions for durable improvements; not for personal mode creation, product fixes, or static skill review."
---

# Self-Improve

Reflect on agent work, explain what helped or hindered it, and turn supported
lessons into the smallest useful next move. Treat scripts and aggregate counts
as leads; base conclusions on the underlying conversations, tool calls, files,
and observed outcomes.

This improves shared instructions, skills, scripts, harnesses, or workflows.

## Classify, then route

Infer the route from the user's full prompt. `reflect` and `insights` remain
compatible aliases, not required command words.

1. **Lock the scope.** Default to the active task. Use a named task, project,
   time window, or historical corpus only when the user asks for it or the
   active task cannot answer the request. If the user says `all`, do not quietly
   narrow it to a recent window. If the prompt already supplies a sufficient
   state capsule, use it instead of mining the same context again.
2. **Identify the subject.** The task itself, repeated workflow friction,
   testing or validation cost, agent-experienced friction, the harness, a named
   skill, or the user's way of working.
3. **Identify the result.** A reflection, diagnosis, durable change proposal,
   insights report, coaching report, or rating.
4. **Load only the needed branch.** A prompt may combine branches; omit
   unrelated sections rather than forcing one universal report.

Route as follows:

- **Active reflection, default.** Reflect on this task and give the user a
  useful next move. Do not scan other tasks.
- **Workflow or harness audit.** For friction, slow testing, a suboptimal path,
  agent frustration, or harness engineering, read
  [workflow-audit.md](references/workflow-audit.md).
- **Historical improvement review.** When the user asks what is recurring,
  recent, or shared across tasks, mine the bounded corpus through **Review
  repeated work** below.
- **Named-skill review.** When the user identifies a skill, inspect its actual
  successful and friction invocations through **Review repeated work** and
  [skill-analytics.md](references/skill-analytics.md).
- **User coaching or rating.** When the user asks to evaluate their prompting,
  thinking, decisions, or effectiveness with agents, read
  [user-coaching.md](references/user-coaching.md). This route is report-only.
- **Insights.** When the user asks for `insights`, a usage profile, or
  a view across the whole retained window, read
  [insights-report.md](references/insights-report.md). This route is report-only.

Use the current host unless the user names another. Never mix Codex and Claude
evidence without naming both and analyzing each separately first.

## Reflect on the active task

Use the current conversation, tool calls, changed files, and observed
validation. When compaction or a handoff removed material needed to judge the
causal chain, recover only this task through the host's supported read-only
history.

1. Establish the original request, intended outcome, governing instructions,
   actual path, user corrections, and final evidence. A confident completion
   message without an accepted artifact or observed check is not a successful
   path.
2. Recover the shortest successful route. Keep a failed attempt only when it
   exposes a reusable failure class and the task demonstrated a better remedy.
3. Compare what happened with the better route. Account for what worked, what
   dragged, what did not happen but should have, and any second-order effect the
   task missed.
4. Give one concrete next move. When the user asked to improve shared behavior,
   test candidates against [thread-evidence.md](references/thread-evidence.md)
   and classify them as:
   - **Ready now:** a durable correction, authoritative contract, or costly
     observed failure with a demonstrated reusable remedy supports a change.
   - **Needs repetition:** the lesson is plausible but this task is its only
     support. Preserve it for a later historical improvement review; do not edit
     shared behavior now.
   - **Encode structurally:** a check, script, metadata field, or runtime
     invariant would enforce the lesson more reliably than prose.
   - **Reject:** the lesson is task-specific, contradicted, already owned, or
     did not affect the outcome.
5. For every non-rejected candidate, name the behavior it would change, closest
   owner, evidence strength, smallest durable change, verification, and a
   falsifier. Keep transcript identifiers, private examples, and raw task
   content out of proposed runtime text.
6. Present the full classification before editing. Apply only the approved
   subset through the owner named in the proposal.

Return only the sections that carry a real finding:

```md
## Outcome
<what succeeded, failed, or remains uncertain>

## What worked
<the useful path or decision>

## What dragged
<friction and its effect>

## Better path
<the shortest defensible route in hindsight>

## Next move
<one concrete action for the user, agent, workflow, or harness>
```

A valid reflection may find no reusable lesson.

## Review repeated work

1. Read [thread-evidence.md](references/thread-evidence.md) and the selected host
   reference: [Codex](references/codex-sessions.md) or
   [Claude Code](references/claude-sessions.md).
2. Use the scope the user requested. When they ask for recurring improvement
   without a window, start with the last 30 days and at most 100 sessions.
   Expand only to answer a named evidence gap, and state the gap first.
3. Read only what the in-scope threads need, then stop. Establish the request,
   expected behavior, actual behavior, correction, governing source, and
   outcome. A transcript records history; verify live state when the conclusion
   depends on current files, branches, reviews, or tickets.
4. For a named skill, inspect every actual invocation in scope, including
   successful and friction candidates. Mentions are not invocations. A failure
   elsewhere in the same thread is not a skill failure without a causal link.
   Run `skill-usage --skill <id>` once and keep its frozen representative ledger
   as the read list; do not rebuild the cohort after delegating audit work.
5. Separate facts from inference, deduplicate retries and delegated work by
   parent session, preserve contradictions, and reject one-off incidents.
   Before proposing a shared change, pass the generalization gate in
   [thread-evidence.md](references/thread-evidence.md).
6. State the happy path, recurring friction, and the smallest durable change.
   Name the exact target, owner, evidence strength, verification, and falsifier.

Load [instructions.md](references/instructions.md) only when a proposal targets
`AGENTS.md`, `CLAUDE.md`, or `.claude/rules/*.md`.

## Helper

Run from this skill directory. Pass `--platform` when the requested host differs
from the current one.

```bash
python3 scripts/self_improve.py --platform codex triage --days 30 --limit 100
python3 scripts/self_improve.py --platform claude show <session-id>
python3 scripts/self_improve.py --platform codex files <thread-id>
python3 scripts/self_improve.py --platform codex skill-usage --skill dots:pr --days 30 --limit 100
python3 scripts/self_improve.py --platform codex stats --top 10
python3 scripts/self_improve.py --platform claude decide accept <proposal-key>
```

- `triage` ranks likely evidence.
- `show` renders a transcript.
- `files` lists structured file references.
- `skill-usage` separates mentions, actual invocations, and friction candidates,
  including historical or checkout-local structured invocations.
- `stats` supplies the insights route and validation-cost leads, with
  coverage and exclusions.
- `decide` records accepted, rejected, and applied proposals so they do not
  resurface.

Skill-use, timing, and friction counts are discovery aids. Read every cited
transcript before drawing a causal conclusion.

## Result for improvement reviews

Default to a concise report:

```md
## Verdict
<what the evidence says>

## Happy path
<what reliably works and why>

## Recurring friction
<pattern, expected versus actual, cost, support, and causal evidence>

## Proposed changes
1. <smallest change, exact target, owner, strength, verification, and falsifier>

## Coverage
<host, window, sessions or invocations inspected, and important limits>
```

Include a deeper evidence appendix only when it materially helps the decision or
the user asks for it. A valid result may recommend no change.

## Approval and ownership

Do not edit until the user approves a concrete proposal. If the original request
already explicitly authorizes implementation, that satisfies the approval gate
once the exact target is established; do not ask again.

Approval does not expand write authority. This skill may directly update only
the approved closest-scope instruction file. Route skill, script,
documentation, harness, validation, and memory-note changes through their
owning workflow. Never edit generated memory stores directly. Validate every
approved source change or state why validation was unavailable.
