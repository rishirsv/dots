---
name: self-improve
description: "Mines Codex or Claude Code sessions, memories, skill usage, and instructions for repeated evidence of durable workflow improvements. Explicit-only; proposes changes before applying approved instruction edits. Not for one-off fixes or already-specified changes."
---

# Self Improve

Help the user understand how they work with Codex or Claude Code, where
friction repeats, and which durable improvements would make future sessions
better. Mine the selected host's sessions and supporting state, qualify the
evidence, then propose the smallest useful changes.

Do not edit anything until the user approves a concrete proposal. After
approval, this skill may update the selected host's closest-scope instruction
file. Route every other change to its owner. Never edit generated memory stores
directly; propose a memory note instead.

## Workflow

1. **Select one platform.** Use the current host unless the user names another.
   Do not combine Codex and Claude evidence implicitly. A cross-platform review
   must name both platforms, preserve the source on every evidence item, and
   deduplicate only after each host has been analyzed separately.
2. **Inventory and triage.** Confirm the selected session source exists, then
   rank sessions by explicit corrections, preferences, repeated friction,
   failed checks, and relevance to the current repository.
3. **Read the evidence.** Inspect the conversation, tool calls, and referenced
   files. Establish the request, expected behavior, actual behavior, correction,
   and governing files.
4. **Qualify the pattern.** Keep direct facts separate from inference, attach
   subagent evidence to its parent session, mark contradictions, and reject
   one-off implementation requests. Before proposing a skill change, pass the
   generalization gate in [references/thread-evidence.md](references/thread-evidence.md).
   Script scores are leads, not verdicts.
5. **Propose the smallest durable change.** Name the exact behavior, target,
   evidence, strength, owner, and verification. Stop for approval.
6. **Apply or route.** Apply only approved instruction-file changes directly.
   Route skill, documentation, script, harness, and validation changes to their
   owners. Record the decision so settled proposals do not resurface.

## Platform Sources

Load [references/thread-evidence.md](references/thread-evidence.md) for the
common evidence packet, privacy boundary, file confidence, and proposal method.
Then load exactly one host reference for an ordinary review:

- [references/codex-sessions.md](references/codex-sessions.md) for Codex thread
  tools, `state_5.sqlite`, rollout JSONL, memories, and durable goals.
- [references/claude-sessions.md](references/claude-sessions.md) for Claude Code
  project JSONL, prompt history, subagent transcripts, auto-memory, retention,
  and schema-drift limits.

Load [references/instructions.md](references/instructions.md) only when a
proposal targets `AGENTS.md`, `CLAUDE.md`, or `.claude/rules/*.md`. Load
[references/skill-analytics.md](references/skill-analytics.md) when interpreting
`skill-usage` output.

Prefer live thread tools or supported export interfaces when they expose the
named current session. Use local stores for historical or multi-session mining.
Never treat a convenience index or generated summary as stronger evidence than
the underlying transcript and files.

## Helper

Run from the skill directory or use the packaged absolute path. The helper
defaults to the detected current host; pass `--platform` whenever the requested
host differs or detection would be ambiguous.

```bash
python3 scripts/self_improve.py --platform codex inventory --memories 10
python3 scripts/self_improve.py --platform claude inventory --memories 10
python3 scripts/self_improve.py --platform codex triage --days 30 --cwd "$PWD"
python3 scripts/self_improve.py --platform claude triage --days 30 --cwd "$PWD"
python3 scripts/self_improve.py --platform codex show <thread-id>
python3 scripts/self_improve.py --platform claude show <session-id>
python3 scripts/self_improve.py --platform claude files <session-id>
python3 scripts/self_improve.py --platform codex dream --days 90 --min-support 2
python3 scripts/self_improve.py --platform claude deep --days 30
python3 scripts/self_improve.py --platform claude decide accept <proposal-key>
```

The shared modes are `inventory`, `list`, `triage`, `show`, `files`, `dream`,
`skill-audit`, `skill-usage`, `scaffold`, `memory-audit`, `deep`, and `decide`.
`goal-health` is Codex-only because Claude Code has no equivalent durable goals
database. Claude `memory-audit` inventories project auto-memory and its limits;
it does not emulate the Codex memory-consolidation database.

The helper isolates platform state:

- Codex sessions come only from `CODEX_HOME` or `~/.codex`.
- Claude sessions come only from `CLAUDE_CONFIG_DIR` or `~/.claude`.
- Skill roots, memories, personal instructions, and proposal decisions resolve
  from the selected host.
- Proposal and cluster keys include the selected platform.
- Unsupported host-specific commands stop rather than borrowing another host's
  state.

## Evidence Strength

Score support, not probability:

- **strong** — explicit preferences, repeated corrections, or accepted
  workflows across multiple session clusters;
- **medium** — a repeated accepted choice or a clear but narrow signal;
- **weak** — one ambiguous session;
- **contradicted** — conflicting evidence that the user must resolve.

Support is the deduplicated parent-session cluster count. Do not count subagent
transcripts independently or invent a numeric confidence score.

## Result Types and Destinations

Keep observations and implementation routing separate:

- **Usage observation** describes a recurring task or workflow.
- **Behavioral insight** interprets what the evidence suggests and states its
  uncertainty.
- **Durable change proposal** names a specific edit or action and requires
  approval.

Choose one destination per proposal:

- `Skills`
- `New Skills`
- `Project Instructions`
- `Personal Instructions`
- `Memory Notes`
- `Repo Docs`
- `Scripts Or Harnesses`
- `Validation Checks`
- `Conflicts Or Deletions`

Project-specific preferences stay out of personal instructions. Memory facts
stay out of skills unless they define portable runtime behavior. Prefer a
script, validator, or harness when a mechanical check is stronger than prose.

## Proposal Rules

- Cite concrete session and file evidence; label inference.
- Filter one-off implementation requests unless the user explicitly states a
  durable preference or correction.
- Inspect the cited transcript before proposing or applying a change.
- For skill changes, pass the generalization gate before including the proposal.
- Keep proposal destinations disjoint.
- Prefer the smallest change that prevents recurrence.
- Do not expose secrets, private transcript contents, or local transcript paths
  in portable guidance.
- Record accepted, rejected, and applied decisions with `decide`.
- Validate every approved source edit or state why validation was unavailable.

## Output

Lead with what the evidence says about the user's work. Put change mechanics
last. A useful review can contain observations and insights even when no source
change is justified.

```md
## Agent Usage Review — <Codex|Claude Code>

### How You Work
- Recurring work: <patterns>
- Skill usage: <counts and limits>
- Collaboration style: <directions, corrections, accepted work>

### What Is Working
- Pattern: <successful workflow>
  Evidence: <deduplicated session support>

### Where Friction Appears
- Pattern: <recurring friction>
  Expected: <expected behavior>
  Actual: <observed behavior>
  Support: <cluster count and strength>

### Recommended Improvements
- Change: <specific proposal>
  Target: <path or destination> (key <proposal-key>)
  Destination: <one bucket>
  Support: <cluster count>
  Strength: <strong|medium|weak|contradicted>
  Generalization: <failure class, incident-independent rule, adjacent-skill boundary, and falsifier>
  Evidence: <platform, session id, update time, minimum private locator>
  Approval needed: <yes and why>

### Evidence Coverage
- Platform: <Codex|Claude Code>
- Sessions: <available or missing>
- Memories: <available, missing, and role used>
- Goals: <Codex state or Claude unsupported>
- Important limits: <retention, schema, or detection gaps>
```

When the user approves instruction changes, write only the approved subset to
the selected platform's closest-scope file. Route other approved work to its
owner and validate the resulting source.
