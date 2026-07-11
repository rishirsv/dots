# Skill-Usage Analytics

How to use `skill-usage` to explain which skills shape the user's workflow, how
often they run, where outcomes appear smooth or difficult, and what may improve.

```bash
python3 scripts/self_improve.py skill-usage --days 7 --limit 250
```

## What the script measures (and what it cannot)

This is **heuristic candidate detection, not telemetry**. The script scans
rollout transcripts and counts, per skill:

- **Uses** — total detected invocations.
- **Threads** — distinct threads the skill appeared in.
- **Friction** — threads where the skill co-occurred with a friction signal.

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

Limits to state honestly:

- A skill loaded by description match (no `$` token, no marker) may be missed.
- Friction in a thread is **correlation, not causation** — the error may be
  unrelated to the skill.
- A skill that runs silently and well produces low counts; absence of friction
  is not proof of quality.

So treat every row as a **thread to read**, never as a verdict.

## Reading the output

```
Uses  Threads Friction Skill
----- ------- -------- --------------------------------
12    8       3        visual-design
3     1       1        explain
```

- High **Uses** + high **Friction** → the most valuable threads to review.
- High **Uses** + zero **Friction** → still worth a quality read; this skill
  carries a lot of your workflow.
- One **Use** + one **Friction** → likely a one-off; weight it low.

The "Recurring Friction To Understand" section lists the specific friction
threads per skill. These are your read list.

## From analytics to a usage interpretation

1. **Describe adoption.** Identify the skills with the broadest thread coverage,
   the most repeated use, and meaningful combinations with other skills.
2. **Read successful and friction threads.** Establish what the user asked, what
   the skill did, the outcome, and whether the user intervened or accepted it.
   Do not analyze only failures.
3. **Separate skill failure from trigger failure.** Did the skill run and behave
   badly, or did the wrong skill (or no skill) run? They need different fixes —
   guidance vs. the `description`/trigger. (See `references/agents-md.md` on
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
- **The biggest single lever** — when one skill dominates Uses, a small quality
  gain there outweighs fixing several rare ones. Prioritize by Uses × friction,
  not by friction alone.

## In the deep pass

`deep` runs `skill-usage` near the start so the full review begins with how the
user works. Repository scaffolding is a conditional addendum, not a default
substitute for usage analysis.
