---
name: self-improve
description: "Explicit-only workflow for mining prior Codex or Claude Code sessions for durable corrections, preferences, and file-grounded improvement proposals. Invoke as $self-improve in Codex or /dots:self-improve in Claude Code. Not for implementing a known one-off change."
disable-model-invocation: true
---

# Self Improve

Find evidence-backed changes that make future agent runs better. Inspect prior
sessions and the files they touched, distinguish repeatable patterns from
one-offs, and return a small proposal set. Do not edit anything until the user
approves a concrete proposal.

After approval, this skill may update the closest-scope instruction file
(`AGENTS.md` for Codex, `CLAUDE.md` for Claude Code). Route every other change
to its owner: skill edits to `skill-doctor`; docs, scripts, checks, and harness
changes to the workflow that owns them. Never edit generated memory stores;
propose a memory note instead.

## Workflow

1. **Set scope.** Confirm the platform, time range, repositories, and whether
   the user wants a broad review or a named thread/workflow investigated. Use
   the current platform unless the user names another one.
2. **Inventory and triage.** Confirm the session sources exist, then rank
   threads by explicit corrections, preferences, repeated friction, failed
   checks, and relevance to the current repo. Read only the highest-signal
   threads deeply.
3. **Read the evidence.** For each candidate, inspect the conversation, tool
   calls, and referenced files. Establish the request, expected behavior,
   actual behavior, correction, and the files or configuration that governed
   the outcome.
4. **Qualify the pattern.** Deduplicate related threads, separate direct facts
   from inference, mark contradictions, and reject one-off implementation
   requests. A script score or keyword match is a lead, never a verdict.
5. **Propose the smallest durable change.** Name the target, exact behavior
   change, supporting threads and files, strength, trade-off, owner, and proof
   check. Stop for approval.
6. **Apply or route after approval.** Apply approved instruction-file changes
   directly. Route every other approved change to its owner, validate it, and
   record the proposal decision so settled items do not resurface.

## Session Sources

Load only the references needed for the active platform:

- [references/thread-evidence.md](references/thread-evidence.md) defines the
  common evidence packet, file-reference rules, strength labels, privacy
  boundary, and proposal shape.
- [references/codex-sessions.md](references/codex-sessions.md) covers Codex
  thread tools, `state_5.sqlite`, rollout JSONL, memories, and goals.
- [references/claude-sessions.md](references/claude-sessions.md) covers Claude
  Code JSONL, `history.jsonl`, subagent transcripts, auto-memory, retention,
  and schema-drift limits.
- [references/instructions.md](references/instructions.md) covers approved
  `AGENTS.md` and `CLAUDE.md` proposals and edits.

Prefer live thread tools or platform export interfaces when they expose the
requested session. Use local stores for historical or multi-session mining.
Never treat a convenience index, generated summary, or built-in insights
report as stronger evidence than the underlying transcript and files.

## Helper

Run from this skill directory, or invoke the script by its absolute packaged
path. Pass the platform explicitly when mining a different host:

```bash
python3 scripts/self_improve.py --platform codex inventory
python3 scripts/self_improve.py --platform codex triage --days 30 --top 20
python3 scripts/self_improve.py --platform codex show <thread-id>
python3 scripts/self_improve.py --platform claude files <session-id>
python3 scripts/self_improve.py --platform claude review --days 30
python3 scripts/self_improve.py --platform codex review --target skills --days 90
python3 scripts/self_improve.py --platform codex decide accept <proposal-key>
```

The helper performs deterministic discovery, extraction, and ranking. The
agent still owns interpretation: inspect cited sessions and files before
recommending or applying a change.

## Strength

- **Strong:** repeated explicit corrections or accepted behavior across
  independent thread clusters.
- **Medium:** a repeated accepted choice or one clear correction with narrow
  scope.
- **Weak:** one ambiguous thread or an unverified heuristic match.
- **Contradicted:** credible evidence points in different directions; ask the
  user to resolve it.

Support is a count of deduplicated thread clusters, not a probability. Do not
invent numeric confidence.

## Output

Return at most three proposals, ordered by likely future impact:

```md
### <proposal title> (`<proposal-key>`)
Target: <file or durable destination>
Change: <exact behavior change>
Owner: <this skill or routed workflow>
Support: <thread-cluster count>; <strength>
Evidence: <thread/session ids, dates, and relevant files>
Why durable: <repeatable failure or preference>
Trade-off: <cost or residual risk>
Proof: <validation or behavior check>
Approval needed: yes
```

Put conflicting evidence under `Needs judgment` and plausible but unsupported
ideas under `Watchlist`. Do not expose transcript contents, secrets, private
file contents, or raw memory text beyond what the user needs to judge the
proposal.
