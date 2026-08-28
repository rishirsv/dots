# User Coaching

Read this when the user asks for a reflection, evaluation, or rating of how they
prompt, reason, steer, decide, or work with agents. Evaluate the work in scope,
not the person's intelligence, personality, or general potential.

This route is report-only. It may suggest experiments or identify a lead for a
separate workflow improvement review, but it never edits instructions, skills,
memory, or the harness.

## Select representative work

Use the active task by default. When the user requests a broader judgment,
select representative tasks from the named project, task family, or window.
Include successful, ordinary, and difficult work instead of sampling only
frustrating sessions. State the scope before making a broad claim.

For each task family, reconstruct:

- what the user was trying to accomplish;
- what made the task ambiguous, risky, or expensive;
- what an effective collaboration could reasonably have looked like with the
  available agent and tools;
- how the user's prompts, interventions, and decisions changed the path; and
- whether the final outcome was accepted or verified.

Do not treat message length, number of corrections, or tool-call volume as
inherently good or bad. Interpret them through the task and outcome.

## Develop categories from what good looks like

Create three to five categories that explain the largest meaningful differences
between the effective route and the observed work. Derive them after inspecting
the representative tasks; do not begin with a universal rubric.

Use the user's language and the task domain. Each category must:

- describe an observable behavior the user can change;
- matter to success, cost, or decision quality in the selected tasks;
- distinguish stronger from weaker performance without rewarding mere style;
- have enough evidence to support a pattern at the stated scope; and
- produce a practical experiment or behavior worth keeping.

For example, repeated debugging work might yield “getting to a falsifiable
symptom,” “choosing the next discriminating check,” “steering before rework
compounds,” and “closing with proof.” Research, design, planning, and operational
work should produce different categories.

For each category, show:

```md
### <category in the language of the work>
- What good looked like here: <task-specific standard>
- What you did: <supported pattern, including a counterexample when present>
- Effect: <how it changed the work>
- Keep or try: <one behavior or experiment>
```

A single task can support a reflection on that task. It does not establish a
broad trait. Narrow the wording or request a wider scope when repetition would
change the conclusion.

## Rate only when asked

If the user requests ratings, define observable anchors for each derived
category before assigning a score. Use a compact scale such as 1–5 only when
the evidence can distinguish its levels. Explain the score with representative
evidence and name coverage that could move it.

Do not create one overall user score unless the user defines what it should
mean and how the categories should be weighted. Do not average unlike task
families into false precision. When evidence is insufficient, say `not enough
evidence` instead of using a neutral score.

## Output

Lead with the most useful reflection, not the scoring mechanics:

```md
## Read on your work
<the strongest supported pattern and why it matters>

## Categories from these tasks
<three to five derived categories>

## What to keep
<behaviors already helping>

## Experiments
<one or two changes worth trying next>

## Coverage
<tasks, window, exclusions, and limits>
```

Include scores inside the relevant categories only when requested. Avoid
flattery, blame, generic prompting advice, and recommendations that amount only
to “provide more context.”
