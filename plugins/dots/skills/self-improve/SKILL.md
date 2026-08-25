---
name: self-improve
description: "Use only when the user selects `$self-improve` to mine Codex or Claude Code sessions for recurring paper cuts, happy paths, and durable workflow improvements; not for one-off fixes or static skill-source review."
---

# Self-Improve

Find recurring workflow friction and the smallest durable changes that prevent
it. Treat scripts and aggregate counts as leads; base conclusions on the
underlying conversations, tool calls, and files.

## Routes

- **Improvement review, default.** Find the happy path, recurring paper cuts,
  and up to three justified changes.
- **Insights, only when the user passes `insights`.** Produce the report-only
  profile in [references/insights-report.md](references/insights-report.md).
  Never edit on this route.

Use the current host unless the user names another. Never mix Codex and Claude
evidence without naming both and analyzing each separately first.

## Review

1. Read [references/thread-evidence.md](references/thread-evidence.md) and the
   selected host reference:
   [Codex](references/codex-sessions.md) or [Claude Code](references/claude-sessions.md).
2. Start with the last 30 days and at most 100 sessions. Expand only to answer a
   named evidence gap, and state the gap first.
3. Read the relevant conversations and tool calls. Establish the request,
   expected behavior, actual behavior, correction, and governing source.
4. For a named skill, inspect every actual invocation in scope, including
   successful and friction candidates. Mentions are not invocations. A failure
   elsewhere in the same thread is not a skill failure without a causal link.
   Run `skill-usage --skill <id>` once and keep its frozen representative ledger
   as the read list; do not rebuild the cohort after delegating audit work.
5. Separate facts from inference, deduplicate retries and delegated work by
   parent session, note contradictions, and reject one-off incidents. Before
   proposing a skill change, pass the generalization gate in
   [references/thread-evidence.md](references/thread-evidence.md).
6. State the happy path, recurring paper cuts, and the smallest durable change.
   Name the exact target, owner, evidence strength, and verification.

Load [references/skill-analytics.md](references/skill-analytics.md) for a named
skill review. Load [references/instructions.md](references/instructions.md) only
when a proposal targets `AGENTS.md`, `CLAUDE.md`, or `.claude/rules/*.md`.

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
- `stats` supports the `insights` route and reports its coverage and exclusions.
- `decide` records accepted, rejected, and applied proposals so they do not
  resurface.

Skill-use and friction counts are discovery aids. Read every cited transcript
before drawing a conclusion.

## Result

Default to a concise report:

```md
## Verdict
<what the evidence says>

## Happy path
<what reliably works and why>

## Recurring paper cuts
<pattern, expected versus actual, support, and causal evidence>

## Proposed changes
1. <smallest change, exact target, owner, strength, and verification>

## Coverage
<host, window, sessions or invocations inspected, and important limits>
```

Include a deeper evidence appendix only when it materially helps the decision or
the user asks for it. A valid result may recommend no change.

## Approval And Ownership

Do not edit until the user approves a concrete proposal. If the original request
already explicitly authorizes implementation, that satisfies the approval gate
once the exact target is established; do not ask again.

Approval does not expand write authority. This skill may directly update only
the approved closest-scope instruction file. Route skill, script, documentation,
harness, validation, and memory-note changes through their owning workflow.
Never edit generated memory stores directly. Validate every approved source
change or state why validation was unavailable.
