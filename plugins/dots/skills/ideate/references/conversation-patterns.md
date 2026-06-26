# Ideate Conversation Patterns

Use these examples only when behavior is ambiguous. Mirror the move, not the
wording. The invariant is one live move per turn.

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

The user is anchored on one solution, so show distinct shapes before choosing.

```text
User:
$ideate We should add a dashboard so managers can see agent quality.

Agent:
**Read:** The desire is not necessarily "dashboard"; it is trust that agent work
is healthy enough to use.
**Diverge:** A few shapes solve different trust problems.

| Shape | What it tests |
|---|---|
| Dashboard | Managers want persistent monitoring. |
| Review queue | The real need is intervention on uncertain work. |
| Digest | Managers want awareness, not another surface. |
| Coach | Agents improve through examples, rubrics, and feedback. |
| Removal path | Reducing risky actions matters more than reporting. |

**Question:** Which shape best matches the trust problem?

| Choice | Direction |
|---|---|
| A | Dashboard - persistent monitoring is the main value. |
| B | **Review queue (Recommended)** - trust improves fastest when uncertain work has an intervention path. |
| C | Digest or coach - lightweight awareness or improvement loops. |
| D | Removal path - reduce risky actions instead of adding visibility. |

**Why this recommendation:**
- A dashboard creates visibility, but not necessarily a way to intervene.
- A review queue can start narrow and later feed a digest or dashboard.
- It tests the core trust assumption before adding a new reporting surface.
```

## Creative Unlocker

Use one unlocker when the first option set is too predictable.

```text
User:
$ideate We need a way to make onboarding less overwhelming.

Agent:
**Read:** The obvious answers are checklist, tips, and progress indicators. Those
may help, but they keep the same onboarding shape.
**Diverge:** Use `Inversion`: make onboarding worse, then reverse the failure.

| Failure | Reversal |
|---|---|
| Show every setup task at once | Reveal only the next useful commitment. |
| Explain everything before value | Let the user do one valuable action first. |
| Ask for data before trust exists | Delay requests until the user sees why they matter. |

**Question:** Which reversal should define the first version?

| Choice | Direction |
|---|---|
| A | Progressive setup - reveal only the next useful commitment. |
| B | **Value-first onboarding (Recommended)** - get the user to one meaningful result before setup expands. |
| C | Trust-gated data requests - ask for inputs only after their value is visible. |
| D | Hybrid - value-first path with progressive setup behind it. |

**Why this recommendation:**
- Value-first changes the sequence, not just the presentation.
- It creates a stronger test: does one early win reduce setup resistance?
- Progressive setup still fits later if the first win exposes the next need.
```

## Term Drift

Split words that are doing more than one job.

```text
User:
$ideate The context should include repo docs, but also the model should remember
the context from the conversation.

Agent:
**Read:** "Context" is doing two jobs.
**Best default:** Split it into source context and session context.

**Question:** What should the carry-forward brief preserve?

| Choice | Direction |
|---|---|
| A | **Both, separately labeled (Recommended)** - evidence and interpretation stay distinct. |
| B | Session decisions only - keep the brief lightweight. |
| C | Source context only - make the brief evidence-first. |
| D | Defer capture - keep both in chat until the terms settle. |
```

## Pressure-Test One Assumption

Challenge the load-bearing premise, then return to a choice.

```text
User:
$ideate I want Ideate to always produce a PRD at the end.

Agent:
**Read:** The real desire is "do not let good thinking evaporate."
**Assumption:** Durable output helps only if it does not make unfinished thinking
feel official.
**Best default:** Decision snapshot in chat; durable docs only on request.

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
set. I will delegate one bounded read-only pass and use the findings only to
sharpen the concept.

Subagent prompt:
Question: What existing onboarding terms, surfaces, and product-flow constraints
would change this concept?
Scope: onboarding docs, UI surfaces, route names, and tests
Mode: read-only exploration; do not edit files or propose build tasks
Return: repo terms, overloaded terminology, current flow, conflicts, and findings
that could change the concept
Stop condition: enough evidence to answer the bounded question

Agent after subagent returns:
**Read:** The repo evidence changes the vocabulary.
**Best default:** Use the repo term unless we want a deliberately separate
concept.

**Question:** Is this an extension of the existing flow, or a new layer above it?

| Choice | Direction |
|---|---|
| A | **Extension of the existing flow (Recommended)** - reuse product language. |
| B | New layer above it - useful only if the concept is broader. |
| C | Rename the concept - keep the behavior, find a clearer term. |
| D | Split it - product language externally, separate internal shorthand. |
```

## New Shape Is Not Closure

Agreement plus new architecture means explore the new branch first.

```text
User:
My idea is that this should interview the user, review guidance with a subagent,
then create a durable project guide. Let's go with that.

Agent:
**Read:** This is now a self-bootstrapping workflow, not just a routing idea.
**Tension:** "Let's go with that" settles direction, but the new workflow creates
a more important question: what becomes durable state?

**Question:** What should the first project guide primarily own?

| Choice | Direction |
|---|---|
| A | Interview answers only - a lightweight profile. |
| B | **Operating contract (Recommended)** - sources, ranking rules, gates, and recurring workflow. |
| C | Working memory and scratch - evolving drafts and temporary notes. |
| D | Full local workspace - guide, scratch, research notes, and brief history. |
```

## Stop Instead Of Polishing

When the next answer is predictable, capture and stop.

```text
User:
Yes, that feels right. It is a concept brief, not a PRD, and "activation steps"
is the right term.

Agent:
Stop here. The remaining choices are wording polish.

**Decision Snapshot**

| Field | Decision |
|---|---|
| Direction | Ideate shapes a loose idea into a decision snapshot or concept brief. |
| Settled vocabulary | "Activation steps" is repo language; "PRD" is downstream. |
| Key trade-off | Preserve thinking without making unfinished thinking feel official. |
| Rejected branch | Always writing a PRD, because it turns exploration into premature documentation. |
| Assumption to test | None surfaced. |
| Non-goal | Build tasks during Ideate. |
| Next move | Stop in chat unless the user asks for a persisted doc or build handoff. |
```

## Build Gate

Building is a confirmed mode switch.

```text
User:
Looks great. Build it.

Agent:
I can switch from ideation to building. Confirm this scope:
- Build: <specific thing from the decision snapshot>
- Do not build: <non-goals from the snapshot>
- Evidence I will use: <decision snapshot and any grounding findings>

Reply with "confirm build" to proceed, or revise the scope.
```
