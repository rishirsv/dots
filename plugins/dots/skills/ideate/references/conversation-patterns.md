# Ideate Conversation Patterns

Use these examples only when behavior is ambiguous. Mirror the move, not the
wording. The important invariant is one active multiple-choice question per
turn:

```md
**Question:** <one branch-unlocking question>

A. <option>
B. **<recommended option> (Recommended)** - <why this is the best default>
C. <option>
D. <option, hybrid, or "something else">
```

## Fuzzy Artifact Word

Demonstrates: sharpening vocabulary before accepting the user's artifact word.

```text
User:
$ideate I want a dashboard for my agents.

Agent:
My read: "dashboard" may mean visibility, control, or shared language. "Agents"
could mean active workers, reusable workflows, or named responsibilities.

This could be:
1. Agent status surface - what is running, blocked, or complete.
2. Control room - inspect, pause, redirect, or resume active work.
3. Vocabulary map - what each agent owns and when handoffs happen.

My instinct: control room, because the ask sounds less like metrics and more
like "I need to know what is happening and intervene."

**Question:** When you say "dashboard," do you mainly want to observe agents,
steer them, or understand their boundaries?

A. Observe agents - see status, blockers, and completions.
B. **Steer agents (Recommended)** - inspect, redirect, pause, or resume work.
C. Understand boundaries - clarify what each agent owns and when handoffs happen.
D. Hybrid - visibility first, with limited steering where it matters.
```

## Plan Sharpening

Demonstrates: pressure without implementation planning.

```text
User:
$ideate I think Ideate should always produce a PRD at the end.

Agent:
My read: the real desire is not "always write a PRD"; it is "do not let good
thinking evaporate." The expensive decision is capture policy.

This could be:
1. Always PRD - strong handoff, but weak ideas feel too settled.
2. Concept brief by default - preserves thinking without pretending we are
   ready to build.
3. No artifact unless requested - light, but risks losing decisions.

My instinct: concept brief by default, durable docs only on request.

**Question:** Is the bigger failure mode losing useful thinking, or making
unfinished thinking feel official?

A. Losing useful thinking - capture more aggressively.
B. **Making unfinished thinking feel official (Recommended)** - keep ideas alive
   before commitment.
C. Overhead - avoid any artifact unless explicitly requested.
D. Handoff quality - write only when another skill or person needs it.
```

## Term Drift

Demonstrates: splitting one word that is doing two jobs.

```text
User:
$ideate The context should include repo docs, but also the model should remember
the context from the conversation.

Agent:
Small vocabulary snag: "context" is doing two jobs.

I would split it:
1. Repo context - durable facts from docs, code, conventions, and product
   language.
2. Session context - what the user and agent establish in this conversation.

My instinct: use "repo context" and "session context" as canonical terms so the
plan does not mix source-of-truth material with temporary working memory.

**Question:** Should the final brief preserve both repo context and session
context, or only the session-level decisions?

A. **Preserve both, separately labeled (Recommended)** - evidence and
   interpretation stay distinct.
B. Session decisions only - keep the brief lightweight.
C. Repo context only - make it mostly evidence-backed.
D. Defer capture - keep both in conversation until the terms settle.
```

## Codebase Grounding

Demonstrates: parent does not inspect code; subagent returns vocabulary and
constraints.

```text
User:
$ideate This should fit our existing onboarding flow. Check the repo and push
against the idea.

Agent:
I can ground this against the repo, but the codebase pass needs to be delegated
read-only. I will use the findings only to sharpen the concept.

Subagent prompt:
Question: What existing onboarding terms, surfaces, and product-flow
constraints would change this concept?
Scope: onboarding docs, UI surfaces, route names, and tests.
Mode: read-only exploration; do not edit files or propose implementation tasks.
Return: repo terms, overloaded terminology, current flow, conflicts, and
confidence.

Agent after subagent returns:
The repo evidence changes the vocabulary. What we were calling "checklist" maps
more closely to the repo's "activation steps." I would use that term unless we
want a deliberately separate concept.

**Question:** Is this an extension of activation steps, or a new layer above
them?

A. **Extension of activation steps (Recommended)** - reuse existing product
   language.
B. New layer above activation steps - useful only if the concept is broader.
C. Rename the concept - keep the behavior, but find a clearer repo-native term.
D. Split it - activation steps for product, checklist language for internal docs.
```

## Follow-Up Correction

Demonstrates: a useful correction still ends with a question block, not a memo.

```text
User:
Eval - let's also use normal names for the vocabulary.

Agent:
Good correction. Eval should be the spine, and the visible vocabulary should be
plain-spoken rather than internally precious.

I would move away from "Workbench", "Arena", and "Atlas". The product gets
stronger if the navigation sounds like software people already trust:

- Runs - every evaluation run, status, pass rate, candidate, and notes.
- Run Detail - case rows, outputs, grades, notes, and diffs.
- Cases - prompts or tasks used to judge behavior.
- Candidates - versions being compared.
- Review - human judgment queue.
- Compare - baseline vs candidate outcomes.

My read: the signature surface should be Run Detail, not a map. The ambitious
part is making subjective agent behavior reviewable, comparable, and debuggable.

**Question:** Should the first version optimize for Runs, Run Detail, or Compare?

A. **Runs (Recommended)** - gives the product a stable entry point.
B. Run Detail - makes inspection the signature experience immediately.
C. Compare - strongest if baseline-vs-candidate is the whole promise.
D. Cases - start from authoring/evaluating the test set itself.
```

## Stop Condition

Demonstrates: stop instead of asking another polishing question.

```text
User:
Yes, that feels right. It is a concept brief, not a PRD, and "activation steps"
is the right term.

Agent:
I think we can stop exploring. The next branch answers are predictable enough:
preserve thinking, avoid premature durability, and use repo language where it
exists.

Synthesis before capture:
- Core direction: Ideate shapes a loose idea into a concept brief.
- Shared vocabulary: "activation steps" is repo language; "concept brief" is
  the default capture artifact; "PRD" is downstream.
- Key trade-off: preserve useful thinking without making unfinished thinking
  feel official.
- Rejected branch: always writing a PRD.
- Non-goal: implementation tasks during Ideate.
- Next artifact: concept brief in chat unless the user asks to persist it.
```

## Build Gate

Demonstrates: implementation is a separate confirmed transition.

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
