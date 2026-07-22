# Skill-Usage Analytics

How to use `skill-usage` to explain which skills shape the user's workflow, how
often they run, where outcomes appear smooth or difficult, and what may improve.

```bash
python3 scripts/self_improve.py skill-usage --days 7 --limit 250
```

## What the script measures (and what it cannot)

This is **heuristic candidate detection, not telemetry**. The script scans
rollout transcripts and reports, per skill:

- **Markers** — deduplicated transcript mentions detected from invocation
  tokens, explicit launch wording, or matching tool calls.
- **Threads** — distinct rollout threads containing any marker, including
  delegated copies and assistant-only mentions.
- **Organic** — parent-session clusters containing an explicit user invocation,
  explicit invocation wording, or matching tool call. Exact retry threads and
  delegated children collapse into one cluster.
- **Friction** — organic parent-session clusters where the skill co-occurred
  with a friction signal.

Detection signals, in order of trust:

1. An explicit invocation marker (`Launching skill: <name>`, `Invoking skill …`).
2. A `$skill-name` token that **matches a known installed skill** (so `$PATH` and
   other shell variables are ignored).
3. A tool/function call whose exact name or namespace matches a known skill.

Friction signals are co-occurring in the same thread:

- Tool-output errors (narrow markers: `Traceback`, `fatal:`, `command not
  found`, `permission denied`, non-zero exit, etc.).
- Frustration cues in user messages (`come on`, `can't you just`, `keep going`,
  `don't stop`, `why did you`, `I already told you`).

The script removes duplicate transport copies of the same message before
counting. This prevents Codex rollouts that store both `response_item` and
`event_msg` representations from doubling one invocation.

Limits to state honestly:

- A skill loaded by description match (no `$` token, no marker) may be missed.
- Friction in a thread is **correlation, not causation** — the error may be
  unrelated to the skill.
- Assistant mentions can still raise Markers or Threads without increasing
  Organic; use Organic when discussing adoption.
- Exact-title retry clustering is a heuristic and can merge genuinely separate
  attempts with the same working directory and title.
- A skill that runs silently and well produces low counts; absence of friction
  is not proof of quality.

Treat every row as a lead, then read representative successful and friction
clusters before reaching a verdict.

## Reading the output

```
Markers Threads Organic Friction Skill
------- ------- ------- -------- --------------------------------
12      8       4       2        visual-design
3       1       1       1        explain
```

- Large Markers/Threads but low Organic → inspect delegation or retry fan-out
  before interpreting adoption.
- High **Organic** + high **Friction** → the most valuable clusters to review.
- High **Organic** + zero **Friction** → still worth a quality read; this skill
  carries a lot of your workflow.
- One **Organic** cluster + one **Friction** cluster → likely a one-off; weight
  it low.

The "Recurring Friction To Understand" section lists one representative thread
for each friction cluster. These are the starting points for the read list.

## From analytics to a usage interpretation

1. **Describe adoption.** Identify the skills with the broadest thread coverage,
   the most repeated use, and meaningful combinations with other skills.
2. **Read successful and friction threads.** Establish what the user asked, what
   the skill did, the outcome, and whether the user intervened or accepted it.
   Do not analyze only failures.
3. **Separate skill failure from trigger failure.** Did the skill run and behave
   badly, or did the wrong skill (or no skill) run? They need different fixes —
   guidance vs. the `description`/trigger. (See `references/instructions.md` on
   testing the trigger separately from the guidance.)
4. **Look for a pattern across threads**, not a single bad run. One screenshot is
   not a rule.
5. **Explain the user-level meaning first.** State what the pattern says about
   the user's normal workflow, preferences, or recurring intervention. Keep
   correlation and uncertainty explicit.
6. **Write the smallest durable fix** only when the evidence justifies one:
   - A wording or rule change inside the skill → bucket `Skills`.
   - A `description`/trigger change (affects discovery) → call it out explicitly.
   - A missing skill the workflow clearly needs → bucket `New Skills`.
7. **Route the edit, don't make it here.** Skill source changes go through the
   available Meta-Skill lifecycle (`skill-doctor` when exposed), which owns the
   edit-and-validate machinery. Self-Improve packages the evidence.

## Big-picture and workflow improvements

Skill analytics also feeds higher-altitude proposals:

- **Workflow gaps** — a manual step the user repeats across many threads that no
  skill covers. Describe the cost before proposing a new skill or automation.
- **Skill overlap or misuse** — two skills fighting over the same trigger, or a
  skill being used for something it was not built for.
- **The biggest single lever** — when one skill dominates Organic usage, a small
  quality gain there outweighs fixing several rare ones. Prioritize organic
  cluster coverage and repeated friction, not raw marker volume.

## In the deep pass

`deep` runs `skill-usage` near the start so the full review begins with how the
user works. Repository scaffolding is a conditional addendum, not a default
substitute for usage analysis.
