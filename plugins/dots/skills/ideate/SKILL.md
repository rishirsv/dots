---
name: ideate
description: "Explicit-only skill invoked as Ideate or $ideate for exploring, sharpening, or stress-testing a loosely formed idea or plan before a PRD, design brief, spec, implementation plan, or build; sharpens vocabulary, turns fuzzy terms into shared language, maps branches, tests the plan, and keeps implementation gated across product, UX, workflow, writing, strategy, architecture, and personal systems."
---

# Ideate

Sharpen a loose idea until its vocabulary, branches, trade-offs, plan shape, and
next artifact are clear enough to carry forward.

Ideation is exploration before commitment. Start spacious, then get sharper as
the idea reveals its terms, decisions, and risks. The goal is not to interview
forever, write a PRD by reflex, or jump into implementation. The goal is to help
the user understand what the idea is trying to become, what words mean, what
branches matter, and what should happen next.

Do not implement, scaffold, edit product code, or write durable docs while this
skill is active. Switch to durable docs only when the user explicitly asks to
capture or write them; switch to implementation only through the implementation
gate.

## Route

Activation boundary: Ideate runs only after the user explicitly invokes
`Ideate` or `$ideate`.

After explicit invocation, it is appropriate for requests to:

- explore, ideate on, riff on, or sharpen a loose idea
- turn fuzzy terms into shared vocabulary before a plan, PRD, spec, or build
- explore UX, user moments, metaphors, possible forms, workflows, rituals,
  strategies, architecture directions, or personal systems
- map branches before deciding what the idea is
- sharpen a plan or design without implementing it
- stress-test a concept, plan, or workflow before it becomes durable
- push against implementation without starting implementation
- get a thoughtful concept partner rather than a quick blocker checklist

Do not use this skill for:

- minimum blocking clarification before ordinary implementation; ask the small
  clarification directly or use the repo's clarification pattern
- an existing code-grounded implementation plan that needs deep repo refutation;
  use a planning upgrade workflow instead
- direct implementation, code review, visual polish, prose cleanup, or durable
  documentation writing
- broad research where the main job is evidence gathering rather than concept
  shaping

## Reference Examples

Read [conversation-patterns.md](references/conversation-patterns.md) when the
right behavior is ambiguous, especially for fuzzy vocabulary, plan sharpening,
codebase grounding, "push against implementation", broad discovery, non-code
ideas, visual exploration, stop conditions, or the build gate. Do not copy the
examples verbatim; mirror their moves.

## Operating Rules

- Sharpen the idea, the vocabulary, and the plan together. Do not treat words
  as settled just because the user used them confidently.
- Start open, then increase pressure dynamically. Do not ask the user to choose
  a "mode"; adapt to the idea's maturity, ambiguity, and stakes.
- Ask only branch-unlocking questions. Prefer a reflective read, two or three
  plausible forms, a recommended instinct, and one question with a guess.
- Walk branches in dependency order. Resolve decisions one by one instead of
  spraying a questionnaire.
- Give recommended defaults. A useful Ideate question should expose the
  agent's current read, not make the user generate every option from scratch.
- Turn fuzzy terms into shared vocabulary. Split overloaded words, propose
  canonical terms, and reuse settled language consistently.
- Test with concrete scenarios. When relationships or states are vague, invent
  small edge cases that force boundaries into view.
- Treat codebase exploration as a delegated evidence pass. The parent agent must
  not inspect repository code, tests, git history, or local implementation docs
  for this skill's codebase grounding.
- Use read-only subagents for codebase exploration whenever implementation
  reality, repo vocabulary, current UX, or existing architecture matters.
- Keep synthesis local. Subagents gather evidence; the parent agent owns the
  concept, vocabulary, trade-offs, recommendation, and handoff.
- Stop before implementation. "Push against implementation" allows feasibility
  pressure and codebase evidence, not code changes.
- Switch to implementation only after a build-style request and a separate
  confirmation. "Build it", "implement it", "make the change", "code it", or
  "ship it" starts the confirmation gate; vague agreement does not.
- Write durable docs only when the user explicitly asks to capture, write,
  update, or persist a document. Otherwise produce a chat brief or recommend a
  handoff.

## Workflow

### 1. Open The Idea

Start by reflecting what the idea might be trying to make possible. Name the
core desire, not only the requested artifact.

Use this shape by default:

```text
My read: <one-sentence interpretation of the underlying idea>

This could be:
1. <form A> - <what it optimizes for>
2. <form B> - <what it optimizes for>
3. <form C> - <what it optimizes for>

My instinct: <recommended starting form and why>
Question: <one branch-unlocking question>
Guess: <the answer I would assume and why>
```

When the prompt is especially fuzzy, add confidence:

```text
Confidence: <low|medium|high> - <what is still unresolved>
```

Use the opening for non-code ideas too. The form may be a product surface,
ritual, process, narrative, policy, artifact, service, system, habit, internal
tool, document, strategy, event, or operating model.

### 2. Sharpen Vocabulary

Maintain a lightweight working vocabulary while exploring. This is not a durable
glossary unless the user later asks to capture it.

When the user uses a fuzzy, overloaded, or conventional term:

1. Name the ambiguity.
2. Offer likely meanings.
3. Recommend the meaning that best fits the current idea.
4. Ask only if the meaning changes the branch.

Examples of words that often need sharpening:

- dashboard, workflow, agent, tool, system, context, memory, automation
- user, owner, reviewer, collaborator, operator, customer
- plan, spec, PRD, brief, handoff, prototype, implementation
- done, success, quality, fast, simple, robust, scalable, polished

Useful vocabulary moves:

- Split one word into two concepts when it is carrying two jobs.
- Merge two words when they are accidental synonyms.
- Propose a canonical term when the user is circling a concept.
- Call out term drift when the same word starts meaning something else.
- Capture a short "Shared vocabulary" section in the final brief when terms
  became important to the idea.

Do not write or update glossary/context docs unless the user explicitly asks to
capture durable documentation.

### 3. Map Branches

Walk the meaningful branches in dependency order. For each branch, state why it
matters, give the strongest current read, recommend a default, and ask only if
the branch changes the concept.

Useful branch types:

- audience, actor, beneficiary, owner, or reviewer
- user moment, trigger, job, emotion, or pain being relieved
- artifact form: app surface, workflow, document, ritual, automation, policy,
  service, dashboard, checklist, prompt, prototype, or operating model
- interaction model, UX feel, fidelity, density, rhythm, or user control
- vocabulary: terms that need canonical meaning before the plan can hold
- scope: smallest useful version, ambitious version, and tempting non-goals
- trade-offs: speed vs depth, flexibility vs simplicity, automation vs control,
  public artifact vs private tool, durable process vs one-time assist
- plan risks: confusing metaphor, wrong user, false constraint, hidden fork,
  overbuilt implementation, premature documentation, missing owner, weak
  payoff, or unstated success criteria

Do not exhaustively interview by default. Get more exacting when terms are
unstable, branches conflict, the idea becomes plan-shaped, or a wrong decision
would create costly work.

### 4. Sharpen The Plan

When the idea becomes a plan, sharpen it. Do not wait for the user to request a
separate stress-test mode.

Plan sharpening means:

- walk down each branch of the design tree in dependency order
- resolve decisions one by one
- ask what becomes expensive to reverse first
- distinguish product behavior from implementation approach
- identify hidden non-goals and excluded branches
- test claims with concrete scenarios
- surface contradictions between the plan, vocabulary, user moment, and
  evidence
- keep recommending defaults while making uncertainty visible

Useful plan-pressure questions:

- Which decision would make the next five decisions easier or harder?
- What term must be stable before this plan can be trusted?
- What user moment would make this artifact obviously useful?
- What edge case would make the current vocabulary break?
- What would we regret making durable too early?
- If this became half as complex, what would remain?
- If this did not ship, what pain would still exist?

Keep implementation out of the plan unless the idea is specifically about a
technical or architectural decision. If implementation reality matters, use
read-only subagents as described below.

### 5. Ground Only When Needed

Stay free of implementation constraints while the concept is still opening. Add
evidence only when it would change a branch, sharpen vocabulary, test the plan,
or answer a user request.

Use subagent codebase exploration when any of these are true:

- the idea should fit an existing app, repo, codebase, workflow, or
  documentation system
- a branch depends on current terminology, current UX, implementation reality,
  repo conventions, or existing architecture
- the user asks to "ground this", "push against implementation", "check the
  codebase", "see how this would fit", "sharpen this against the repo", or
  similar

The parent agent must not read repository source, tests, git history, or local
implementation docs for Ideate's codebase grounding. Delegate bounded read-only
questions to subagents.

Subagent prompt shape:

```text
Question: <one bounded codebase or docs question>
Scope: <repo area, docs, product surface, symbols, or terms to inspect>
Mode: read-only exploration; do not edit files or propose implementation tasks
Evidence standard: cite files, symbols, commands, contradictions, and confidence
Return:
- terms already used in the repo
- conflicting or overloaded terminology
- relevant product flows or implementation constraints
- contradictions between the user's idea and current reality
- findings that could change the concept branch or sharpen the plan
Stop condition: enough evidence to answer the bounded question
```

If several evidence questions matter, split them across bounded subagents rather
than asking one broad agent to wander. Keep raw exploration out of the final
brief unless the evidence changes the idea.

### 6. Synthesize Before Capture

Before writing any durable artifact or recommending a handoff, synthesize the
current shape in chat. This is the last cheap moment to correct the concept.

Use a compact synthesis:

```text
Synthesis before capture:
- Core direction: <what the idea now is>
- Shared vocabulary: <settled terms that matter>
- Key trade-off: <the main choice still shaping the idea>
- Rejected branch: <what we are not doing and why>
- Non-goal: <what should not sneak back in>
- Next artifact: <none yet|concept brief|PRD|spec|design brief|implementation plan|visual exploration>
```

If the user asked only for a chat brief, continue to the brief. If the user asks
to write or persist a doc, hand off to the appropriate documentation workflow
after the synthesis.

### 7. Stop Condition

Stop exploring when enough shared understanding exists to predict the user's
reaction to the next few branch questions and additional questioning is unlikely
to change the direction.

The stop condition is met when:

- the core desire is clear
- the important terms have stable meanings
- major branches have been explored, chosen, or rejected
- the recommended direction is defensible
- the plan has been sharpened enough for the current stage
- non-goals and excluded branches are explicit
- codebase grounding, if needed, came from read-only subagents
- the next artifact is obvious or intentionally deferred
- the implementation boundary is clear

If several rounds pass and you still cannot predict the user's reaction, stop
and say what foundational piece is missing. Do not keep grinding.

### 8. Converge Into A Concept Brief

When the useful branches are clear enough, produce a concept brief. Do not turn
it into a PRD, spec, or implementation plan unless the user explicitly asks for
that artifact after seeing the brief.

Default brief shape:

```md
Concept Brief

Raw idea:
- <starting idea in plain language>

Core desire:
- <what the idea is really trying to make possible>

Shared vocabulary:
- <canonical term> - <meaning>
- <canonical term> - <meaning>

Possible forms:
- <form A and trade-off>
- <form B and trade-off>
- <form C and trade-off>

Recommended form:
- <chosen direction and why>

UX or experience concept:
- <user moment, interaction model, feel, density, or ritual>

Plan sharpened:
- <decisions resolved>
- <reversible vs hard-to-reverse choices>
- <concrete scenarios or edge cases tested>

Branches explored:
- <major alternatives and what was learned>

Branches rejected:
- <rejected branch and why>

Open questions:
- <only questions that still change the direction, each with a default>

Next artifact:
- <PRD, design brief, spec, implementation plan, repo-grounded brief, docs
  handoff, prototype request, visual exploration, or no artifact yet>

Implementation boundary:
- <what is not being built yet and what explicit approval would be required>
```

Adapt headings to the idea. Keep the brief recognizable even when the idea is
not a product or code feature.

## Handoffs

Recommend the next mode; do not silently enter it.

- Stay in `ideate` when the selected concept still needs vocabulary sharpening,
  branch mapping, plan pressure, or read-only repo grounding before it becomes
  durable.
- Use `docs-writer` when the user asks to turn the brief into durable
  documentation, a PRD, a spec, an ADR/design note, or a concept doc.
- Use `visual-design` when seeing the idea would be clearer than describing it:
  UI concepts, visual direction, journey maps, mockups, diagrams, image
  generation, or implementation of a visible surface.
- Use `research` when the next step depends on external evidence, market/tech
  landscape, current facts, or multiple source classes.
- Use implementation only after the implementation gate below is satisfied.

For visual work, offer a visual aid only when seeing would be clearer than
reading. A UI topic is not automatically a visual task; a layout choice,
journey map, spatial relationship, mockup, or side-by-side comparison usually
is.

## Implementation Gate

While Ideate is active, implementation is a separate mode.

If the user says "build it", "implement it", "make it", "ship it", "code it",
or otherwise asks to act on the shaped concept, stop and confirm the transition:

```text
I can switch from ideation to implementation. Confirm this scope:
- Build: <specific thing>
- Do not build: <explicit non-goals>
- Evidence/handoff I will use: <concept brief, subagent findings, docs>

Reply with "confirm build" to proceed, or revise the scope.
```

Do not implement after "sounds good", "sure", "let's do it", "whatever you
think", or silence. Those are momentum, not confirmation.

If the user says "push against implementation", "check feasibility", or "how
would this land", run implementation pressure through read-only subagents and
update the concept brief. Do not code.

## Gotchas

- A loose idea needs room before discipline. If the first response is a
  requirements checklist, the skill has failed.
- Dynamic pressure is not a named mode. Do not ask whether the user wants
  "grill mode"; just get sharper when the idea demands it.
- "Dashboard", "workflow", "agent", "doc", "automation", and "system" are often
  placeholder words. Translate them into user moments and shared vocabulary
  before accepting them.
- "Plan" is often a premature word for a branchy idea. Sharpen the plan without
  turning it into implementation tasks.
- Codebase evidence can overpower concept exploration. Use it to choose between
  branches, sharpen terms, or test feasibility, not to shrink the idea before
  the user understands what it could be.
- A concept brief is allowed to say "no artifact yet". Not every useful
  ideation session should create a PRD.
- Do not ask generic questions that the prompt, prior conversation, supplied
  files, or subagent evidence already answer.

## Final Check

Before stopping, confirm:

- The brief names the core desire, shared vocabulary, plausible forms,
  recommended form, major branches, rejected branches, plan pressure, open
  questions, next artifact, and implementation boundary.
- Important fuzzy terms were sharpened or explicitly left open.
- Any codebase grounding was delegated to read-only subagents, or was explicitly
  skipped because subagents were unavailable or the idea did not need it.
- No implementation, durable doc write, external action, or repo edit happened
  without explicit approval.
