# Ideate Conversation Patterns

Use these examples only when behavior is ambiguous. Mirror the move and the visible thinking, not the wording — the invariant is one live move per turn, and real reasoning around it, not just the format.

## Frame Before Choice

The idea is broad, so ask one question that makes later options real.

```text
User:
$ideate I need a Chief of Staff agent. It should understand me, track projects,
wake up on a schedule, and route work.

Agent:
**Read:** You are reaching for a personal operating layer, not a reminder bot.
The unclear part is the first failure it should prevent.

**Question:** What failure should the first useful version prevent?
```

## Diverge Before Converge

The user is anchored on one solution, so show distinct shapes before choosing — and say what you actually think, not just what the shapes are.

```text
User:
$ideate We should add a dashboard so managers can see agent quality.

Agent:
**Read:** The desire is not necessarily "dashboard"; it is trust that agent work
is healthy enough to use. That reframing changes what "good" looks like here.
**Diverge:** A few shapes solve different trust problems.

| Shape | What it tests |
|---|---|
| Dashboard | Managers want persistent monitoring. |
| Review queue | The real need is intervention on uncertain work. |
| Digest | Managers want awareness, not another surface. |
| Removal path | Reducing risky actions matters more than reporting. |

**Question:** Which shape best matches the trust problem?

| Choice | Direction |
|---|---|
| A | Dashboard - persistent monitoring is the main value. |
| B | **Review queue (Recommended)** - trust improves fastest when uncertain work has an intervention path. |
| C | Digest - lightweight awareness without a new workflow. |
| D | Removal path - reduce risky actions instead of adding visibility. |

**Why this recommendation:** A dashboard creates visibility but no way to act on it. A review queue tests the core trust assumption first and can still feed a digest or dashboard later.
```

## Pressure-Test One Assumption

Challenge the load-bearing premise, then return to a choice.

```text
User:
$ideate I want Ideate to always produce a PRD at the end.

Agent:
**Read:** The real desire is "do not let good thinking evaporate."
**Assumption:** Durable output helps only if it does not make unfinished thinking
feel official — a PRD implies more certainty than most sessions earn.

**Question:** Which failure mode matters more?

| Choice | Direction |
|---|---|
| A | Losing useful thinking - capture more aggressively. |
| B | **Premature durability (Recommended)** - preserve ideas without hardening them. |
| C | Overhead - avoid any artifact unless requested. |
| D | Handoff quality - write only when another skill or person needs it. |
```

## Ground Repo Reality

Delegate bounded evidence without turning Ideate into code review.

```text
User:
$ideate This should fit our existing onboarding flow. Check the repo and push
against the idea.

Agent:
I can ground this against the repo because repo reality could change the option
set. Delegating one bounded read-only pass and using findings only to sharpen
the concept — not to start reviewing code.

Subagent prompt:
Question: What existing onboarding terms, surfaces, and flow constraints would
change this concept?
Scope: onboarding docs, UI surfaces, route names, and tests; read-only
Return: repo terms, overloaded terminology, current flow, and conflicts

Agent after subagent returns:
**Read:** The repo already has a term for this, and it carries different
assumptions than the one we were using — worth reconciling before choosing.

**Question:** Is this an extension of the existing flow, or a new layer above it?

| Choice | Direction |
|---|---|
| A | **Extension of the existing flow (Recommended)** - reuse product language. |
| B | New layer above it - useful only if the concept is broader. |
| C | Rename the concept - keep the behavior, find a clearer term. |
```

## Build Gate

Building is a confirmed mode switch, but the confirmation doesn't have to be a magic word.

```text
User:
Looks great. Build it.

Agent:
I can switch from ideation to building. Confirm this scope:
- Build: <specific thing from the decision snapshot>
- Do not build: <non-goals from the snapshot>
- Evidence I will use: <decision snapshot and any grounding findings>

Reply with "confirm build," or confirm in your own words, to proceed.

User:
Yes, do that — just the review queue, not the dashboard.

Agent:
That's a clear, scoped confirmation — proceeding with the review queue only.
```
