# Ideate Conversation Patterns

Use these examples only when behavior is ambiguous. Mirror the move, not the
wording. The important invariant is one live move per turn. Use the Product
Brainstorming vocabulary directly: Problem Exploration, Solution Ideation,
Assumption Testing, Strategy Exploration, Frame, Diverge, Provoke, Converge,
and Capture. When the idea is choice-ready, use one active multiple-choice
question, moment-fit lead-in, A/B/C/D choices, and optional context after the
choices when the idea needs room to breathe:

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

**<optional context label>:** <what an answer could look like, how to choose,
or analysis that helps the options breathe>
```

When the idea is not choice-ready, one compact Frame, Diverge, or Provoke pass
can come first:

```md
**Read:** <what the user is really reaching for>
**Frame/Diverge/Provoke:** <one pattern, provocation, rough option set, or
assumption that needs air before choices are useful>

**Question:** <one open question that would make the next A/B/C/D real>
```

Return to the A/B/C/D spine as soon as there is a meaningful branch.

## Problem Exploration Before Choice

Demonstrates: the user is thinking out loud and the concept is not yet
choice-ready, so Ideate uses Problem Exploration before offering choices.

```text
User:
$ideate I think I need a general Chief of Staff agent. It should understand me,
keep track of projects, maybe wake up on a schedule, and help route work.

Agent:
**Read:** You are reaching for more than a reminder bot. This sounds like a
personal operating layer that notices, prioritizes, and routes work.
**Problem Exploration:** The missing distinction is whether "Chief of Staff"
means calendar/time leverage, project memory, decision support, or delegation
control. Those imply different first versions and very different durable state.

**Question:** What failure do you most want this to prevent in the first useful
version?
```

## Fuzzy Artifact Word

Demonstrates: sharpening vocabulary before accepting the user's artifact word.

```text
User:
$ideate I want a dashboard for my agents.

Agent:
**Read:** "Dashboard" may mean visibility, control, or shared language.
**Problem Exploration:** "Agents" could mean active workers, reusable workflows, or
named responsibilities.
**Best default:** Control room, because the ask sounds less like metrics and
more like "I need to know what is happening and intervene."

**Question:** When you say "dashboard," do you mainly want to observe agents,
steer them, or understand their boundaries?

| Choice | Direction |
|---|---|
| A | Observe agents - see status, blockers, and completions. |
| B | **Steer agents (Recommended)** - inspect, redirect, pause, or resume work. |
| C | Understand boundaries - clarify what each agent owns and when handoffs happen. |
| D | Hybrid - visibility first, with limited steering where it matters. |

**How to choose:** Pick B if the pain is "I need to intervene before the wrong
thing happens." Pick C if the pain is "I do not know which agent owns what."
```

## Solution Ideation

Demonstrates: the user is anchored on one solution, so Ideate opens the space
before narrowing.

```text
User:
$ideate We should add a dashboard so managers can see agent quality.

Agent:
**Read:** The desire is not necessarily "dashboard"; it is confidence that agent
work is healthy enough to trust.
**Brainstorming anti-pattern:** This is close to a one-idea brainstorm, so the
next move is to Diverge before choosing.

| Shape | What it tests |
|---|---|
| Dashboard | Managers want a persistent place to monitor quality. |
| Review queue | The real need is intervention on uncertain outputs. |
| Digest | Managers want periodic awareness, not another surface. |
| Coach | Agents improve because they get examples, rubrics, and feedback loops. |
| Removal path | Fewer low-confidence agent actions create more trust than more reporting. |

**Question:** Which shape best matches the actual trust problem?

| Choice | Direction |
|---|---|
| A | Dashboard - persistent monitoring is the main value. |
| B | **Review queue (Recommended)** - trust usually improves most when uncertain work has an intervention path. |
| C | Digest or coach - lightweight awareness, or improvement loops instead of operational control. |
| D | Removal path - reduce risky actions instead of adding visibility. |

**What an answer could look like:** "B, but with a weekly digest later" is a
valid answer. That would make intervention the first version and awareness a
secondary surface.
```

## Implementation Shape Without Build

Demonstrates: Ideate makes the future implementation shape clearer without
starting a task plan or writing files.

```text
User:
$ideate Let's make Ideate more like a thinking partner, but it should also help
us understand how the idea would eventually be implemented.

Agent:
**Read:** The differentiator is not "brainstorm plus plan." It is a conversation
that keeps future buildability visible while the idea is still soft.
**Implementation shape:** The live question is what kind of implementation
reality Ideate should expose: runtime behavior, source of truth, persistent
state, or validation.
**Best default:** Expose implementation shape as choice dimensions, not tasks.

**Question:** Which implementation dimension should Ideate usually clarify
first when an idea may become real?

| Choice | Direction |
|---|---|
| A | User-facing behavior - what the user or agent will actually experience. |
| B | **Source of truth and durable state (Recommended)** - what gets trusted, saved, and kept separate from scratch. |
| C | Runtime loop - first run, repeat runs, stop conditions, and handoffs. |
| D | Validation shape - how we would know the thing worked before building it. |

**Why this matters:** B prevents the common failure where a good concept becomes
implementation-shaped too late, after the agent has already mixed memory,
scratch, source evidence, and durable docs.
```

## Assumption Testing

Demonstrates: challenge one load-bearing assumption, then return to the question
block.

```text
User:
$ideate I want Ideate to always produce a PRD at the end.

Agent:
**Read:** The real desire is not "always write a PRD"; it is "do not let good
thinking evaporate."
**Assumption Testing:** The risky assumption is that durable output always
helps. It may also make unfinished thinking feel official.
**Best default:** Decision snapshot in chat; durable docs only on request.

**Question:** Is the bigger failure mode losing useful thinking, or making
unfinished thinking feel official?

| Choice | Direction |
|---|---|
| A | Losing useful thinking - capture more aggressively. |
| B | **Making unfinished thinking feel official (Recommended)** - preserve ideas without prematurely hardening them. |
| C | Overhead - avoid any artifact unless explicitly requested. |
| D | Handoff quality - write only when another skill or person needs it. |

**Why this matters:** If B wins, Ideate should improve capture without turning
every exploration into a formal downstream document.
```

## Term Drift

Demonstrates: splitting one word that is doing two jobs.

```text
User:
$ideate The context should include repo docs, but also the model should remember
the context from the conversation.

Agent:
**Read:** "Context" is doing two jobs.
**Tension:** The direction gets weaker if source-of-truth material and temporary
working memory share one name.
**Best default:** Split it into "repo context" and "session context."

**Question:** Should the final brief preserve both repo context and session
context, or only the session-level decisions?

| Choice | Direction |
|---|---|
| A | **Preserve both, separately labeled (Recommended)** - evidence and interpretation stay distinct. |
| B | Session decisions only - keep the brief lightweight. |
| C | Repo context only - make it mostly evidence-backed. |
| D | Defer capture - keep both in conversation until the terms settle. |

**Context:** The choice is not about how much text to save. It is about whether
source evidence and conversational interpretation should remain separable.
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
**Repo tension:** What we were calling "checklist" maps more closely to the
repo's "activation steps."
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

**Implication:** A keeps planning anchored to existing product language. B or C
needs a stronger reason to introduce a second concept.
```

## Follow-Up Correction

Demonstrates: a useful correction still ends with a question block, not a memo.

```text
User:
Eval - let's also use normal names for the vocabulary.

Agent:
**Read:** Eval should be the spine, and the visible vocabulary should be
plain-spoken rather than internally precious.
**Taste issue:** "Workbench", "Arena", and "Atlas" sound branded before the
product has earned them.
**Best default:** Use normal software names: Runs, Run Detail, Cases,
Candidates, Review, and Compare.

**Question:** Should the first version optimize for Runs, Run Detail, or Compare?

| Choice | Direction |
|---|---|
| A | **Runs (Recommended)** - gives the product a stable entry point. |
| B | Run Detail - makes inspection the signature experience immediately. |
| C | Compare - strongest if baseline-vs-candidate is the whole promise. |
| D | Cases - start from authoring/evaluating the test set itself. |

**What an answer could look like:** "A now, C later" would mean Runs becomes the
home surface, while Compare is treated as a high-value workflow inside it.
```

## Needs Research

Demonstrates: stop brainstorming when the next answer depends on evidence.

```text
User:
I don't know whether users would switch for this. Let's keep brainstorming.

Agent:
**Read:** The conversation is circling because the adoption question is factual.
**Brainstorming anti-pattern:** This is brainstorming when we should be
researching.
**Best default:** Stop Ideate here and hand the adoption question to research.

**Decision Snapshot**

| Field | Decision |
|---|---|
| Direction | The idea is promising only if users would switch behavior for it. |
| Settled vocabulary | "Adoption" means switching from the current workaround, not merely liking the concept. |
| Key trade-off | Keep exploring in chat and risk inventing confidence, or gather evidence first. |
| Rejected branch | More hypothetical feature brainstorming, because it would not answer the adoption question. |
| Assumption to test | Users would change behavior for this instead of staying with the current workaround. |
| Non-goal | Treating brainstorm confidence as market evidence. |
| Next move | Research the adoption assumption, then return to Ideate if the evidence changes the shape. |
```

## New Shape Is Not Closure

Demonstrates: a user says "let's go with that" while introducing a richer
workflow shape, so Ideate explores the new branch instead of capturing and
build-gating immediately.

```text
User:
My idea is that this should be a general adaptable Chief of Staff skill. On
first run it interviews the user, reviews guidance with a subagent, then creates
a durable project guide in `.agents/agents/chief-of-staff/`. Let's go with that.

Agent:
**Read:** This is no longer just "router plus playbooks." You are proposing a
self-bootstrapping skill that creates a project operating guide.
**Provoke:** "Let's go with that" settles the broad direction, but the new shape
creates a more important implementation question: what should become durable
state, and what should stay scratch?
**Best default:** Make the guide an operating contract first, with scratch as a
separate subfolder.

**Question:** What should the first project guide primarily own?

| Choice | Direction |
|---|---|
| A | Interview answers only - a lightweight profile of how the user wants support. |
| B | **Operating contract (Recommended)** - sources to inspect, ranking rules, approval gates, and recurring workflow shape. |
| C | Working memory and scratch - evolving state, drafts, and temporary notes. |
| D | Full local workspace - guide, scratch, research notes, and generated brief history. |

**What an answer could look like:** "B plus scratch" would keep the durable
guide clean while still giving the skill a place to work.
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
| Rejected branch | Always writing a PRD, because it turns exploration into premature documentation. |
| Assumption to test | None surfaced. |
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
