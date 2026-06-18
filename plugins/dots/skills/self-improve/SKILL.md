---
name: self-improve
description: "Use when the user asks to inspect prior Codex sessions, run a dream pass over past interactions, mine repeated corrections or preferences, improve or draft skills, update repo/project AGENTS.md guidance, or propose durable edits to global ~/.codex/AGENTS.md; not for applying instruction edits without explicit approval."
---

# Self Improve

Inspect prior Codex threads and generate evidence-backed improvement proposals
for skills, project-local `AGENTS.md`, and global `~/.codex/AGENTS.md`.

This skill depends on Codex local session state:

- `~/.codex/state_5.sqlite`
- rollout JSONL files under `~/.codex/sessions`
- rollout JSONL files under `~/.codex/archived_sessions`

It is Codex-specific and is not intended to work unchanged in non-Codex agent
runtimes.

## Workflow

1. Run the session browser to identify candidate threads:

   ```bash
   python3 scripts/self_improve.py list --limit 25 --archived all
   ```

2. Render specific sessions as readable transcripts when direct evidence is
   needed:

   ```bash
   python3 scripts/self_improve.py show <thread-id>
   ```

3. Run a dream pass to mine repeated user corrections and workflow preferences:

   ```bash
   python3 scripts/self_improve.py dream --limit 250 --days 365 --min-support 2 --min-confidence 0.6 --emit-patch
   ```

4. Run a skill audit when the question is which existing skills should improve:

   ```bash
   python3 scripts/self_improve.py skill-audit --limit 500 --days 365 --min-support 1 --min-confidence 0.6 --emit-patch
   ```

5. Read the proposal buckets and decide what to patch:

   - `Skills`: tighten existing `SKILL.md`, add scripts/references, or create a
     new skill.
   - `Project AGENTS.md`: update the nearest repo instruction file for a
     project-specific preference.
   - `Global AGENTS.md`: add durable defaults that should apply across repos.

6. When the user asks about frustration or persistence, inspect cited examples
   with `show` and look for repeated `continue`, `keep going`, `don't stop`,
   `Come on`, and "can't you just..." messages before proposing global behavior
   rules.

## Source Of Truth

- Treat `~/.codex/state_5.sqlite` as the authoritative session index.
- Use each row's `threads.rollout_path` to load full rollout JSONL transcripts.
- Treat `~/.codex/session_index.jsonl` as an incomplete convenience index, not
  the source of truth.
- Use `~/.codex/memories/MEMORY.md` and memory summaries as supporting context
  only. Do not write them by default.

## Proposal Rules

- Default to propose-first. Do not patch `SKILL.md`, project `AGENTS.md`, or
  global `~/.codex/AGENTS.md` until the user explicitly approves edits.
- Separate facts from inference. Every proposal should cite concrete thread IDs
  plus timestamps and rollout paths when possible.
- Do not overfit one-off phrasing. Prefer repeated corrections, repeated
  style/tooling requests, and instructions likely to recur.
- Treat `Support` as deduped thread clusters, not raw thread IDs.
- Use `Confidence` to suppress one-off task noise. If a proposal reads like a
  transient implementation ask, inspect cited sessions with `show` before
  patching.
- Keep proposal buckets disjoint. If a preference belongs in a project
  `AGENTS.md`, do not also copy it into global `~/.codex/AGENTS.md` unless it
  clearly applies across repos.
- For project proposals, infer the nearest target `AGENTS.md` from the session
  `cwd`; prefer the closest existing `AGENTS.md` or repo-root `AGENTS.md`.
- For skill proposals, map edits to an existing skill folder under
  `~/.codex/skills`, `~/.agents/skills`, or the current repo's plugin skills
  when the transcript or cwd makes that unambiguous. Otherwise propose a new
  skill path.
- Use `skill-audit` when the question is "which existing skills should be
  improved?" because it suppresses suggestions already present in each target
  `SKILL.md`.

## Output Shape

Default output is a proposal report, not an applied patch:

```md
## Self-Improve Proposals

### Skills
- Target: `<path>`
  Suggestion: <durable rule or edit>
  Support: <deduped support count>
  Confidence: <0.0-1.0>
  Evidence:
  - `<thread-id>` updated <timestamp> at `<rollout-path>`

### Project AGENTS.md
...

### Global AGENTS.md
...
```

When `--emit-patch` output is available, treat it as a draft patch. Read it,
inspect its evidence, and apply only the edits the user approves.

## Final Check

Before proposing or applying self-improvement edits, confirm:

- every proposal has evidence from current session records;
- one-off implementation requests were filtered out;
- proposed destinations are disjoint;
- project-specific preferences did not leak into global defaults;
- no memory files were edited directly;
- no instruction file or skill was patched without explicit user approval.

### scripts/

- `scripts/self_improve.py` provides `list`, `show`, `dream`, and `skill-audit`
  subcommands.
