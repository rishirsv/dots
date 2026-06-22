---
name: self-improve
description: "Explicit-only skill for mining Codex sessions, memories, and instruction state to propose evidence-backed improvements to skills, AGENTS.md files, memories, docs, scripts, harnesses, or validation checks. Never edits without approval."
---

# Self Improve

Find durable ways to make future agent runs better. Mine prior Codex threads,
memory summaries, and instruction files; qualify the evidence; then propose
specific changes. Do not patch anything until the user approves a concrete
change.

## Sources

Use available sources in this order:

1. Current user request and current conversation.
2. Codex thread index: `~/.codex/state_5.sqlite`.
3. Rollout transcripts from each thread row's `rollout_path`.
4. Memory summaries: `~/.codex/memories/MEMORY.md`,
   `~/.codex/memories/rollout_summaries/`, and `~/.codex/memories_1.sqlite`.
5. Current repo instructions, global `~/.codex/AGENTS.md`, and installed/source
   skill files.

Treat memories as supporting context. Verify proposed instruction or skill
changes against thread evidence before patching. Treat `~/.codex/session_index.jsonl`
as a convenience index only.

## Modes

- **Inventory**: list available session, memory, instruction, and skill sources.
- **Triage**: rank threads likely to contain improvement evidence before reading
  deeply.
- **Thread review**: inspect one thread and extract expected behavior, actual
  behavior, likely fix target, and limits.
- **Dream pass**: mine many sessions for repeated preferences, corrections, and
  workflow failures.
- **Skill audit**: restrict proposals to existing or new skills.
- **Memory audit**: compare memory state to session evidence and propose memory
  update notes, not direct memory edits.
- **Deep improvement**: combine all modes for broad system improvement.

## Commands

Run from the skill directory unless paths are adjusted:

```bash
python3 scripts/self_improve.py inventory --memories 10
python3 scripts/self_improve.py triage --limit 100 --days 30 --archived all
python3 scripts/self_improve.py list --limit 25 --archived all
python3 scripts/self_improve.py show <thread-id>
python3 scripts/self_improve.py show latest
python3 scripts/self_improve.py dream --limit 250 --days 365 --min-support 2 --min-confidence 0.6 --emit-patch
python3 scripts/self_improve.py skill-audit --limit 500 --days 365 --min-support 1 --min-confidence 0.6 --emit-patch
python3 scripts/self_improve.py memory-audit --limit 20
```

Use live Codex thread tools when they are available and the user points to a
current app thread. Otherwise use the local state and rollout files above.

## Evidence Triage

Before a broad pass, rank candidate threads. Prefer threads with:

- explicit corrections or preferences;
- frustration cues such as `Come on`, `can't you just`, `continue`, `keep
  going`, or `don't stop`;
- skill, plugin, instruction, memory, validation, harness, commit, PR, review,
  or tool-selection discussion;
- failed validation, repeated retries, or a final successful workflow after
  dead ends;
- recent work in the current repository.

Read only the highest-signal threads deeply. Do not expose local transcript
paths, secrets, private content, or raw memory text in portable guidance unless
it is required evidence for the user's review.

## Extract Evidence

For each useful thread, extract:

- trigger: what the user asked for;
- expected behavior: what should have happened;
- actual behavior: what the agent did;
- correction or signal: what makes this durable;
- likely target: skill, instruction file, memory note, doc, script, harness,
  validation check, or deletion;
- confidence: strong, medium, weak, contradicted;
- evidence: thread id, update time, cwd, and rollout path.

Use strong confidence for explicit user preferences, repeated corrections, or
accepted workflows across multiple threads. Use medium confidence for repeated
agent choices that the user accepted. Use weak confidence for one ambiguous
thread. Mark contradictions instead of smoothing them over.

## Proposal Destinations

Choose exactly one destination per proposal:

- `Skills`
- `New Skills`
- `Project AGENTS.md`
- `Global AGENTS.md`
- `Memory Notes`
- `Repo Docs`
- `Scripts Or Harnesses`
- `Validation Checks`
- `Conflicts Or Deletions`

Keep project-specific preferences out of global files. Keep memory facts out of
skills unless they define runtime behavior. Use scripts, validators, or harnesses
when repeated prose would be weaker than a check.

## Updating AGENTS.md

Update `AGENTS.md` only for guidance that should load every relevant session.
Prefer concise, specific rules for repo layout, commands, conventions, review
expectations, constraints, and done checks.

- Add rules after repeated mistakes, repeated review feedback, or context the
  user keeps re-explaining.
- Put guidance in the closest `AGENTS.md` whose scope matches the rule; use
  global guidance only for personal defaults across repos.
- Replace or delete stale/conflicting text instead of appending another patch.
- Move long procedures to docs or skills, and use scripts, hooks, linters, or
  tests when enforcement is more reliable than prose.
- Include exact commands, paths, and verification signals when possible.

## Proposal Rules

- Propose first. Do not edit skills, instructions, memories, docs, scripts,
  validators, or harnesses without approval.
- Cite concrete evidence. Separate transcript facts from inference.
- Deduplicate support by thread cluster, not raw message count.
- Filter one-off implementation requests.
- Inspect cited transcripts before applying any proposal.
- Keep proposal buckets disjoint.
- Prefer the smallest durable change that prevents recurrence.

## Output

Return a proposal report:

```md
## Self-Improve Review

### Evidence Sources
- Sessions: <available/missing, count or gap>
- Memories: <available/missing, role used>
- Instructions: <files inspected>
- Skills: <roots inspected>

### Recommended Now
- Target: `<path or destination>`
  Change: <specific proposed change>
  Destination: <one bucket>
  Support: <deduped count>
  Confidence: <strong|medium|weak|contradicted>
  Evidence:
  - `<thread-id>` updated <timestamp> at `<rollout-path>`
  Approval needed: <yes/no and why>

### Needs Human Judgment
...

### Watchlist
...
```

When patch drafts are emitted, treat them as proposals. Apply only the approved
subset, then validate the touched skill, doc, script, or instruction file.

## Final Check

Before finishing, confirm:

- every recommendation has evidence or is labeled as inference;
- one-off task noise was filtered out;
- memories were not edited directly;
- source edits had explicit approval;
- destinations are disjoint;
- validation ran for any approved source edit, or the skip reason is stated.
