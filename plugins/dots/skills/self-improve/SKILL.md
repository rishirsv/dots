---
name: self-improve
description: "Explicit-only skill that mines Codex sessions, memories, skill usage, and goal state to surface evidence-backed proposals — skill fixes, new skills, memory promotions, docs, scripts, validation checks — and to propose and, after approval, apply AGENTS.md/instruction-file changes. Not for one-off bug fixes or user-specified changes."
---

# Self Improve

Find durable ways to make future agent runs better. Mine prior Codex threads,
memory summaries, skill usage, goal state, and instruction files; qualify the
evidence; then propose specific changes. Do not patch anything until the user
approves a concrete change — the one exception is AGENTS.md/instruction-file
edits, which this skill applies itself once approved.

## The Loop

Every mode feeds one pipeline with one approval gate, and the script and the
agent do different jobs within it:

**intake** (surface candidates) → **judge** (verify evidence, score strength) →
**human approves** → **apply or route**: AGENTS.md/instruction-file changes are
applied by this skill; every other change routes to the owner that applies it.

- **The script surfaces candidates**: it scans sessions for preference and
  correction sentences, scores evidence strength, ranks threads, detects skill
  usage and friction, flags unconsolidated memory summaries, flags stale
  durable goals, and inspects a repo for missing scaffolding.
- **You (the agent) extract the real evidence**: read the cited threads, derive
  expected vs actual behavior and the durable correction, and propose the
  smallest change. The script's buckets and scores are hints, not verdicts.

Self-Improve owns finding and packaging every proposal, plus one applying job:
`Project AGENTS.md` and `Global AGENTS.md` changes. For those, propose the
observable rule per [references/agents-md.md](references/agents-md.md), then,
once approved, write it to the closest-scope file yourself. Everything else
routes elsewhere to apply: skill source edits go to `skill-doctor`; memory
promotions are proposed as new `Memory Notes` entries, never edited in place.

## Sources

Use available sources in this order:

1. Current user request and current conversation.
2. Codex thread index: `~/.codex/state_5.sqlite`.
3. Rollout transcripts from each thread row's `rollout_path`.
4. Memory summaries: `~/.codex/memories/MEMORY.md`,
   `~/.codex/memories/rollout_summaries/`, and `~/.codex/memories_1.sqlite`
   (table `stage1_outputs`, one row per consolidated thread summary). A row
   with `selected_for_phase2 = 0` never made it into `MEMORY.md` — `memory-audit`
   surfaces these as memory-promotion candidates.
5. Durable goals: `~/.codex/goals_1.sqlite` (table `thread_goals`) —
   `goal-health` flags goals stuck `blocked`/`paused`/`usage_limited`/
   `budget_limited` with no recent `updated_at_ms`.
6. Current repo instructions, global `~/.codex/AGENTS.md`, and installed/source
   skill files.

Treat memories as supporting context. Verify proposed instruction or skill
changes against thread evidence before patching. Treat
`~/.codex/session_index.jsonl` as a convenience index only.

## Modes

| Mode | Command | Purpose |
|---|---|---|
| Inventory | `inventory` | list session, memory, instruction, skill, and decision sources |
| Triage | `triage` | rank threads likely to hold improvement evidence |
| Thread review | `show` | read one thread; extract expected/actual/correction |
| Dream pass | `dream` | mine many sessions for proposals across all buckets |
| Skill audit | `skill-audit` | restrict proposals to existing or new skills |
| Skill usage | `skill-usage` | which skills ran, how often, where they hit friction |
| Scaffold | `scaffold` | inspect a repo for missing scaffolding + research handoff |
| Memory audit | `memory-audit` | list memory sources and flag unconsolidated summaries for promotion |
| Goal health | `goal-health` | flag blocked/paused/stale durable goals for revive-or-close review |
| Decide | `decide` | record accept/reject/apply so proposals stop resurfacing |
| **Deep improvement** | `deep` | flagship pass: orchestrate all modes into one report |

## Commands

Run from the skill directory unless paths are adjusted:

```bash
python3 scripts/self_improve.py inventory --memories 10
python3 scripts/self_improve.py triage --limit 100 --days 30 --archived all
python3 scripts/self_improve.py list --limit 25 --archived all
python3 scripts/self_improve.py show <thread-id>        # or: show latest
python3 scripts/self_improve.py dream --limit 250 --days 365 --min-support 2 --min-strength medium --emit-patch
python3 scripts/self_improve.py skill-audit --limit 500 --days 365 --min-support 1 --min-strength weak
python3 scripts/self_improve.py skill-usage --days 7 --limit 250
python3 scripts/self_improve.py scaffold --path .
python3 scripts/self_improve.py memory-audit --limit 20
python3 scripts/self_improve.py goal-health --stale-days 7
python3 scripts/self_improve.py deep --days 30 --min-strength medium --path .
python3 scripts/self_improve.py decide accept <proposal-key> --note "approved"
python3 scripts/self_improve.py decide status
```

Use live Codex thread tools when they are available and the user points to a
current app thread. Otherwise use the local state and rollout files above.

## Evidence Triage

Before a broad pass, rank candidate threads (`triage`). Prefer threads with:

- explicit corrections or preferences;
- frustration cues (the script owns the list; see
  [references/skill-analytics.md](references/skill-analytics.md));
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
- evidence strength (see below);
- evidence: thread id, update time, cwd, and rollout path.

## Evidence Strength

Score support, not probability. The script reports a qualitative label from
deduped support, explicit directive language, cross-repo spread, and whether a
correction (not just a preference) was seen:

- **strong** — explicit preferences, repeated corrections, or accepted workflows
  across multiple thread clusters.
- **medium** — a repeated choice the user accepted, or a clear but narrow signal.
- **weak** — one ambiguous thread.
- **contradicted** — mark conflicting evidence instead of smoothing it over;
  surface the conflict for the user to resolve.

There is no numeric confidence score; do not invent one. Support is the deduped
thread-cluster count.

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

## References

Load the matching reference when a proposal or request enters its area:

- **[references/agents-md.md](references/agents-md.md)** — how Codex loads
  AGENTS.md, what belongs in it, observable-rule writing, structure, the
  decision-authority order, and editing discipline. Use it for any
  `Project AGENTS.md` or `Global AGENTS.md` proposal, when the user asks to
  structure, write, or clean up an agent instruction file, and when applying an
  approved AGENTS.md change.
- **[references/skill-analytics.md](references/skill-analytics.md)** — how to read
  `skill-usage` output and turn it into per-skill, workflow, and big-lever
  improvement proposals.
- **[references/scaffolding-and-automations.md](references/scaffolding-and-automations.md)**
  — how to turn a `scaffold` scan into CI/CD verification steps, which-skills-fit
  recommendations, and Codex automation suggestions.

## Proposal Rules

- Propose first. Do not edit skills, instructions, memories, docs, scripts,
  validators, or harnesses without approval.
- Cite concrete evidence. Separate transcript facts from inference.
- Deduplicate support by thread cluster, not raw message count.
- Filter one-off implementation requests; require a repeated pattern.
- Inspect cited transcripts before applying any proposal.
- Keep proposal buckets disjoint.
- Prefer the smallest durable change that prevents recurrence.
- Never edit memories directly; propose them as new `Memory Notes` entries.
- After the user decides, record it with `decide accept|reject|apply <key>` so
  the proposal does not resurface on the next pass.
- Validate the touched skill, doc, script, or instruction file after any
  approved source edit, or state the reason validation was skipped.

## Output

Return a proposal report:

```md
## Self-Improve Review

### Evidence Sources
- Sessions: <available/missing, count or gap>
- Memories: <available/missing, role used, unconsolidated summary count>
- Goals: <available/missing, blocked/paused/stale count>
- Instructions: <files inspected>
- Skills: <roots inspected>

### Recommended Now
- Target: `<path or destination>`  (key `<proposal-key>`)
  Change: <specific proposed change>
  Destination: <one bucket>
  Kind: <preference|correction>
  Support: <deduped cluster count>
  Strength: <strong|medium|weak|contradicted>
  Evidence:
  - `<thread-id>` updated <timestamp> at `<rollout-path>`
  Approval needed: <yes/no and why>

### Needs Human Judgment
...

### Watchlist
...
```

When patch drafts are emitted, treat them as proposals. Apply only the approved
subset: write `Project AGENTS.md`/`Global AGENTS.md` changes yourself; route
skill source edits through `skill-doctor`; propose (never directly edit)
memory notes and goal actions. Validate the touched skill, doc, script, or
instruction file after applying.
