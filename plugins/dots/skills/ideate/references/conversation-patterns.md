# Ideate Conversation Patterns

Use these examples when the right Ideate behavior is ambiguous. Do not copy the
wording verbatim. Mirror the moves: sharpen vocabulary, offer forms, recommend a
read, ask one branch-unlocking question, test the plan when it becomes
plan-shaped, and stop before implementation.

## Example 1: Fuzzy Artifact Word

Demonstrates: vocabulary sharpening, possible forms, one branch question.

Avoids: accepting "dashboard" and "agents" as settled terms.

```text
User:
$ideate I want a dashboard for my agents.

Agent:
My read: "dashboard" may be a placeholder for visibility, control, or shared
language, and "agents" could mean active workers, reusable workflows, or named
responsibilities.

This could be:
1. Agent status surface - shows what is running, blocked, or complete.
2. Control room - lets you inspect, pause, redirect, or resume active work.
3. Shared vocabulary map - clarifies what each agent owns and when handoffs
   happen.

My instinct: control room, because the phrase sounds less like metrics and more
like "I need to know what is happening and intervene when needed."

Question: When you say "dashboard," do you mainly want to observe agents, steer
them, or understand their boundaries?
Guess: steer them, because visibility without control probably will not solve
the anxiety underneath the ask.
```

Why this works:

- It does not accept artifact words literally.
- It turns fuzzy vocabulary into branch choices.
- It recommends a read while staying easy to correct.

## Example 2: Sharpening A Plan Without Implementing

Demonstrates: dynamic plan pressure, reversibility, no task list.

Avoids: jumping from a plan-shaped idea into implementation planning.

```text
User:
$ideate I think Ideate should always produce a PRD at the end.

Agent:
My read: the real desire is not "always write a PRD"; it is "do not let good
thinking evaporate." The plan-shaped decision is what artifact, if any, should
become durable.

The branch that gets expensive first is capture policy:
1. Always PRD - strongest handoff, but makes weak ideas feel settled.
2. Concept brief by default - preserves thinking without pretending we are
   ready to build.
3. No artifact unless requested - lightest, but risks losing decisions.

My instinct: concept brief by default, durable docs only on request.

Question: Is the bigger failure mode losing useful thinking, or accidentally
making unfinished thinking feel official?
Guess: the second one, because Ideate is supposed to keep the idea alive before
commitment.
```

Why this works:

- It sharpens the plan by identifying the expensive decision.
- It separates "capture" from "PRD."
- It refuses to turn the answer into implementation tasks.

## Example 3: Shared Vocabulary From Term Drift

Demonstrates: catching the same word doing two jobs.

Avoids: letting vocabulary drift quietly.

```text
User:
$ideate The context should include repo docs, but also the model should remember
the context from the conversation.

Agent:
Small vocabulary snag: "context" is doing two jobs here.

I would split it:
1. Repo context - durable facts from docs, code, conventions, and product
   language.
2. Conversation context - what the user and agent have established in this
   session.

My instinct: use "repo context" and "session context" as the canonical terms.
That keeps the plan from mixing durable source-of-truth material with temporary
working memory.

Question: Should Ideate's final brief preserve both, or only the session-level
decisions?
Guess: both, but with repo context cited separately so the brief does not blur
evidence with interpretation.
```

Why this works:

- It turns fuzzy language into shared vocabulary.
- It proposes canonical terms.
- It asks only where the term split changes the plan.

## Example 4: Codebase Grounding Through Subagents

Demonstrates: read-only subagent grounding.

Avoids: parent-agent code inspection.

```text
User:
$ideate This should fit our existing onboarding flow. Check the repo and push
against the idea.

Agent:
I can ground the concept against the repo, but I will keep Ideate's boundary:
the codebase pass needs to be delegated read-only. I will ask a bounded
subagent question and use the findings only to sharpen the concept.

Subagent prompt:
Question: What terms, existing onboarding surfaces, and product-flow constraints
would change this concept?
Scope: onboarding-related docs, UI surfaces, route names, and tests.
Mode: read-only exploration; do not edit files or propose implementation tasks.
Return: repo terms, overloaded terminology, current onboarding flow, conflicts,
and confidence.

Agent after subagent returns:
The repo evidence changes the vocabulary. What we were calling "checklist" maps
more closely to the repo's existing "activation steps." I would use that term
unless you want a deliberately separate concept.

Question: Is this idea an extension of activation steps, or a new layer above
them?
Guess: extension, because a new layer would duplicate the existing product
language.
```

Why this works:

- Parent does not inspect code directly.
- The subagent returns vocabulary and constraints, not implementation tasks.
- Evidence sharpens the concept instead of shrinking it prematurely.

## Example 5: Push Against Implementation

Demonstrates: feasibility pressure without code edits.

Avoids: treating "implementation" as permission to build.

```text
User:
$ideate Push against implementation here. I do not want to build yet.

Agent:
Got it. I will treat this as feasibility pressure, not implementation.

The plan risk I see: if this becomes a persistent workflow, the hard part is not
the UI. It is deciding what state is canonical: user intent, agent progress,
handoff brief, or implementation approval.

Concrete scenario: a user changes their mind after the concept brief but before
the build gate. Which state wins?

My instinct: user intent wins, and the concept brief becomes a snapshot, not a
source of truth.

Question: Should Ideate preserve prior decisions as history, or overwrite the
working concept as the user refines it?
Guess: preserve history only in durable docs; in chat, keep the working concept
current.
```

Why this works:

- It pressures the plan.
- It tests with a concrete scenario.
- It does not edit files or create implementation tasks.

## Example 6: Broad Discovery Without A Named Mode

Demonstrates: dynamic candidate discovery.

Avoids: asking the user to choose "candidate discovery mode."

```text
User:
$ideate What should I improve in onboarding?

Agent:
My read: this is broader than refining one idea. I should first surface strong
candidate directions, then we can sharpen one.

I would look for candidates across:
1. friction - where users stall or repeat work
2. language - where labels or expectations are unclear
3. leverage - where one change improves many future steps
4. removal - what onboarding might not need at all

My instinct: start with friction and language, because onboarding usually fails
when users cannot tell what matters next.

Question: Should I ground this in an existing product/repo, or treat it as a
general concept exercise?
Guess: existing product/repo, because "onboarding" usually means a specific
flow with existing terms.
```

Why this works:

- It adapts to broad discovery without exposing a mode switch.
- It generates candidate directions before choosing one.
- It still asks only one branch-unlocking question.

## Example 7: Non-Code Idea

Demonstrates: Ideate outside software.

Avoids: forcing a PRD or implementation frame.

```text
User:
$ideate I want a Sunday ritual that helps me stop carrying all my projects in
my head.

Agent:
My read: you want a weekly decompression ritual that turns mental clutter into
trusted external shape.

This could be:
1. Reset ritual - clears open loops and chooses next actions.
2. Project weather report - names what is alive, blocked, stale, or complete.
3. Personal operating review - connects projects to energy, time, and values.

My instinct: project weather report, because the phrase "carrying all my
projects in my head" sounds like you need status and emotional relief before
planning.

Question: Should the ritual end with a plan for the week, or just a clear map of
what exists?
Guess: clear map first. A plan too early may recreate the pressure you are
trying to escape.
```

Why this works:

- It treats a ritual as a valid artifact.
- It sharpens the core desire.
- It avoids software assumptions.

## Example 8: Visual Exploration

Demonstrates: offering a visual aid only when seeing beats reading.

Avoids: jumping to UI implementation.

```text
User:
$ideate I cannot tell if this should be a timeline, a board, or a map.

Agent:
This is a good visual decision because the difference is spatial, not just
conceptual. I can sketch lightweight layout options or keep it text-only.

My read:
1. Timeline - best if sequence and aging matter.
2. Board - best if state and ownership matter.
3. Map - best if relationships and dependencies matter.

My instinct: board, unless dependencies are the whole point.

Question: Would seeing three rough layouts help you choose, or should we decide
from the trade-offs in text?
Guess: seeing them would help, because "timeline vs board vs map" is hard to
feel from words alone.
```

Why this works:

- It offers visuals only when useful.
- It keeps visual exploration separate from implementation.
- It still gives a conceptual read first.

## Example 9: Stop Condition

Demonstrates: stopping instead of over-interviewing.

Avoids: asking more questions after the shape is clear enough.

```text
User:
Yes, that feels right. It is a concept brief, not a PRD, and "activation steps"
is the right term.

Agent:
I think we can stop exploring. I can predict the next few branch answers well
enough: you want this to preserve thinking, avoid premature durability, and use
repo language where it exists.

Synthesis before capture:
- Core direction: Ideate shapes a loose idea into a concept brief.
- Shared vocabulary: "activation steps" is repo language; "concept brief" is
  the default capture artifact; "PRD" is downstream.
- Key trade-off: preserve useful thinking without making unfinished thinking
  feel official.
- Rejected branch: always writing a PRD.
- Non-goal: implementation tasks during Ideate.
- Next artifact: concept brief in chat unless you ask to persist it.
```

Why this works:

- It names the stop condition.
- It does not keep asking questions for polish.
- It synthesizes before capture.

## Example 10: Build Gate

Demonstrates: separate implementation confirmation.

Avoids: treating momentum as approval.

```text
User:
Looks great. Build it.

Agent:
I can switch from ideation to implementation. Confirm this scope:
- Build: <specific thing from the concept brief>
- Do not build: <non-goals from the brief>
- Evidence/handoff I will use: <concept brief and any subagent findings>

Reply with "confirm build" to proceed, or revise the scope.
```

If the user replies "sounds good":

```text
Agent:
I need the explicit build confirmation before leaving Ideate. Reply with
"confirm build" to proceed, or revise the scope.
```

Why this works:

- It treats implementation as a separate mode.
- It preserves the user's explicit approval boundary.
- It does not confuse "sounds good" with permission to edit.
