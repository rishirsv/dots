# Ideate Conversation Patterns

Use these examples only when behavior is ambiguous. Mirror the move, not the
wording. The important invariant is one active multiple-choice question per
turn with a stable rhythm and moment-fit lead-in labels:

```md
**<moment-fit label>:** <short interpretation, tension, correction, or recommendation>
**<moment-fit label>:** <optional second short line when useful>

**Question:** <one branch-unlocking question>

| Choice | Direction |
|---|---|
| A | <option> |
| B | **<recommended option> (Recommended)** - <why this is the best default> |
| C | <option> |
| D | <option, hybrid, or "something else"> |
```

## Fuzzy Artifact Word

Demonstrates: sharpening vocabulary before accepting the user's artifact word.

```text
User:
$ideate I want a dashboard for my agents.

Agent:
**Read:** "Dashboard" may mean visibility, control, or shared language.
**Term pressure:** "Agents" could mean active workers, reusable workflows, or named
responsibilities.
**Best default:** Control room, because the ask sounds less like metrics and more
like "I need to know what is happening and intervene."

**Question:** When you say "dashboard," do you mainly want to observe agents,
steer them, or understand their boundaries?

| Choice | Direction |
|---|---|
| A | Observe agents - see status, blockers, and completions. |
| B | **Steer agents (Recommended)** - inspect, redirect, pause, or resume work. |
| C | Understand boundaries - clarify what each agent owns and when handoffs happen. |
| D | Hybrid - visibility first, with limited steering where it matters. |
```

## Direction Sharpening

Demonstrates: pressure without build planning.

```text
User:
$ideate I think Ideate should always produce a PRD at the end.

Agent:
**Read:** The real desire is not "always write a PRD"; it is "do not let good
thinking evaporate."
**Trade-off:** Capture should preserve the idea without making unfinished
thinking feel official.
**Best default:** Decision snapshot in chat; durable docs only on request.

**Question:** Is the bigger failure mode losing useful thinking, or making
unfinished thinking feel official?

| Choice | Direction |
|---|---|
| A | Losing useful thinking - capture more aggressively. |
| B | **Making unfinished thinking feel official (Recommended)** - keep ideas alive before commitment. |
| C | Overhead - avoid any artifact unless explicitly requested. |
| D | Handoff quality - write only when another skill or person needs it. |
```

## Term Drift

Demonstrates: splitting one word that is doing two jobs.

```text
User:
$ideate The context should include repo docs, but also the model should remember
the context from the conversation.

Agent:
**Read:** "Context" is doing two jobs.
**Tension:** The direction gets weaker if source-of-truth material and
temporary working memory share one name.
**Best default:** Split it into "repo context" and "session context."

**Question:** Should the final brief preserve both repo context and session
context, or only the session-level decisions?

| Choice | Direction |
|---|---|
| A | **Preserve both, separately labeled (Recommended)** - evidence and interpretation stay distinct. |
| B | Session decisions only - keep the brief lightweight. |
| C | Repo context only - make it mostly evidence-backed. |
| D | Defer capture - keep both in conversation until the terms settle. |
```

## Codebase Grounding

Demonstrates: parent does not inspect code; subagent returns vocabulary and
constraints.

```text
User:
$ideate This should fit our existing onboarding flow. Check the repo and push
against the idea.

Agent:
I can ground this against the repo. Because repo reality could change the option
set here, I will delegate one bounded read-only pass and use the findings only
to sharpen the concept.

Subagent prompt:
Question: What existing onboarding terms, surfaces, and product-flow
constraints would change this concept?
Scope: onboarding docs, UI surfaces, route names, and tests.
Mode: read-only exploration; do not edit files or propose build tasks.
Return: repo terms, overloaded terminology, current flow, conflicts, and
confidence.

Agent after subagent returns:
**Read:** The repo evidence changes the vocabulary.
**Repo tension:** What we were calling "checklist" maps more closely to the repo's
"activation steps."
**Best default:** Use "activation steps" unless we want a deliberately separate
concept.

**Question:** Is this an extension of activation steps, or a new layer above
them?

| Choice | Direction |
|---|---|
| A | **Extension of activation steps (Recommended)** - reuse existing product language. |
| B | New layer above activation steps - useful only if the concept is broader. |
| C | Rename the concept - keep the behavior, but find a clearer repo-native term. |
| D | Split it - activation steps for product, checklist language for internal docs. |
```

## Follow-Up Correction

Demonstrates: a useful correction still ends with a question block, not a memo.

```text
User:
Eval - let's also use normal names for the vocabulary.

Agent:
**Read:** Eval should be the spine, and the visible vocabulary should be
plain-spoken rather than internally precious.
**Taste issue:** "Workbench", "Arena", and "Atlas" sound branded before the product
has earned them.
**Best default:** Use normal software names: Runs, Run Detail, Cases,
Candidates, Review, and Compare.

**Question:** Should the first version optimize for Runs, Run Detail, or Compare?

| Choice | Direction |
|---|---|
| A | **Runs (Recommended)** - gives the product a stable entry point. |
| B | Run Detail - makes inspection the signature experience immediately. |
| C | Compare - strongest if baseline-vs-candidate is the whole promise. |
| D | Cases - start from authoring/evaluating the test set itself. |
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

**Decision Snapshot**

| Field | Decision |
|---|---|
| Direction | Ideate shapes a loose idea into a decision snapshot or concept brief. |
| Settled vocabulary | "Activation steps" is repo language; "decision snapshot" is the default capture artifact; "PRD" is downstream. |
| Key trade-off | Preserve useful thinking without making unfinished thinking feel official. |
| Rejected branch | Always writing a PRD. |
| Non-goal | Build tasks during Ideate. |
| Next move | Stop in chat unless the user asks for a persisted doc or build handoff. |
```

## Build Gate

Demonstrates: building is a separate confirmed transition.

```text
User:
Looks great. Build it.

Agent:
I can switch from ideation to building. Confirm this scope:
- Build: <specific thing from the concept brief>
- Do not build: <non-goals from the brief>
- Evidence I will use: <concept brief and any subagent findings>

Reply with "confirm build" to proceed, or revise the scope.
```
