# Ideate Skill Landscape Comparison

Date checked: 2026-06-18

This document compares the Dots `ideate` skill against Matt Pocock's
`grill-with-docs` stack, Addy Osmani's `interview-me`, Compound Engineering's
`ce-ideate` and `ce-brainstorm`, Superpowers `brainstorming`, and nearby Dots
skills. The goal is not to crown one universal workflow. It is to choose the
right lane for Ideate, identify features worth borrowing, and avoid accidental
scope creep.

## Source Set

- Dots `ideate`: `plugins/dots/skills/ideate/SKILL.md`
- Dots legacy `align`: `plugins/dots/skills/align/SKILL.md`
- Dots `clarify`: `plugins/dots/skills/clarify/SKILL.md`
- Dots `ultraplan`: `plugins/dots/skills/ultraplan/SKILL.md`
- Matt Pocock `grill-with-docs`: https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md
- Matt Pocock `grilling`: https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md
- Matt Pocock `domain-modeling`: https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md
- Addy Osmani `interview-me`: https://github.com/addyosmani/agent-skills/blob/main/skills/interview-me/SKILL.md
- Compound Engineering `ce-ideate`: https://github.com/EveryInc/compound-engineering-plugin/blob/main/plugins/compound-engineering/skills/ce-ideate/SKILL.md
- Compound Engineering `ce-brainstorm`: https://github.com/EveryInc/compound-engineering-plugin/blob/main/plugins/compound-engineering/skills/ce-brainstorm/SKILL.md
- Compound Engineering `ce-ideate` docs: https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/skills/ce-ideate.md
- Compound Engineering `ce-brainstorm` docs: https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/skills/ce-brainstorm.md
- Superpowers README: https://github.com/obra/superpowers/blob/main/README.md
- Superpowers `brainstorming`: https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md
- Superpowers visual companion: https://github.com/obra/superpowers/blob/main/skills/brainstorming/visual-companion.md

## Executive Verdict

Ideate should stay upstream of requirements and implementation. Its strongest
lane is: "I have a loose idea, or a half-shaped desire, and I want a thinking
partner to explore what it could become before it hardens into a PRD, design
doc, or build request."

The strongest outside patterns to borrow are:

- From Matt: relentless branch walking as an optional mode, plus the idea that
  docs can be composed through another skill rather than built into the
  interview skill.
- From Interview Me: explicit hypotheses, confidence, guesses attached to
  questions, and a concrete stop condition for shared understanding.
- From Compound Engineering: a clean separation between discovery,
  definition, planning, and work; product pressure lenses; synthesis before an
  artifact lands; and stronger anti-slop evidence rules.
- From Superpowers: just-in-time visual companion, explicit approval gates, and
  spec self-review.

The strongest patterns to avoid are:

- Making Ideate mandatory before every creative or implementation task.
- Auto-writing and committing specs or docs.
- Letting the parent agent inspect code directly during Ideate, because the
  user explicitly wants codebase exploration delegated to subagents only.
- Turning Ideate into both a candidate-discovery engine and a requirements-doc
  writer by default. It can offer those as modes or handoffs, but the core UX
  should remain exploratory.

## The First-Principles Map

There are five different jobs that these skills sometimes blend together:

1. Intent extraction: discover what the user actually wants.
2. Candidate discovery: generate many possible directions and select the strong
   survivors.
3. Concept exploration: take one loose idea and explore its possible shapes.
4. Definition: resolve scope, user behavior, non-goals, success criteria, and
   produce a handoff-ready requirements artifact.
5. Plan or implementation pressure: test an already-formed plan against code,
   docs, risks, and constraints before building.

Ideate is best positioned at job 3, with light intake from job 1 and optional
handoffs to jobs 2, 4, and 5.

If it tries to own all five jobs, the user experience becomes muddy:

- It asks too many questions when the user wanted a creative jam.
- It writes too much when the user wanted a concept conversation.
- It grounds too early when the user wanted unconstrained exploration.
- It goes too abstract when the user needed a repo-checked plan.

The central design rule should be: Ideate opens possibilities first, then earns
convergence.

## Skill-by-Skill Comparison

### Dots Ideate

Core job: explore a loose idea freely, map branches, recommend a form, and stop
with a concept brief or handoff.

Best at:

- Starting from an underformed idea.
- Exploring UX, artifacts, rituals, workflows, concepts, and personal systems.
- Keeping the first pass imaginative and not too constrained.
- Maintaining an explicit implementation boundary.
- Delegating codebase grounding to read-only subagents.

UX shape:

- Reflect the "core desire" behind the idea.
- Offer two or three plausible forms.
- Recommend a starting direction.
- Ask one branch-unlocking question with a guess.
- Walk branches only when they change the concept.
- Produce a concept brief, not a PRD by default.

Current differentiator:

- It is deliberately not a pure interrogation skill. It is a concept-shaping
  skill. The agent contributes taste, alternatives, and synthesis instead of
  merely extracting requirements.

Current risk:

- It does not yet have as crisp a mode split as Compound Engineering. A prompt
  like "what should I improve?" and a prompt like "I have this idea, what could
  it become?" may both trigger Ideate, but they are different jobs.

### Matt Pocock Grill With Docs

Core job: a relentless interview that sharpens a plan or design while updating
domain docs as terms and decisions crystallize.

Important detail: `grill-with-docs` is a composition wrapper. The current skill
routes to `/grilling` using `/domain-modeling`. The value is not the wrapper
itself; it is the pairing of a tough question engine with an active shared
language/doc discipline.

Best at:

- Stress-testing a plan before build.
- Walking a design tree one branch at a time.
- Forcing decisions in dependency order.
- Calling out domain terminology drift.
- Capturing glossary terms and ADRs when they become real.
- Checking code when a claim about the system needs verification.

UX shape:

- User brings a plan or design.
- Agent interviews relentlessly.
- Each turn asks one question.
- Each question includes the agent's recommended answer.
- If code can answer a question, the agent checks code rather than asking.
- As terms resolve, domain docs can be updated inline.

Where it beats Ideate:

- Sharper for plan stress-testing.
- Stronger at domain language discipline.
- Better at turning fuzzy terms into durable shared vocabulary.
- Better when the user explicitly wants "grill me" energy.

Where Ideate beats it:

- Better when the idea is not yet a plan.
- Better when the user wants generative exploration rather than a pressure
  interview.
- Better for non-code artifacts where docs are optional and not glossary/ADR
  shaped.
- Better aligned with the user's rule that codebase exploration must be done by
  subagents, not the parent agent.

What Ideate should borrow:

- Optional "grill mode" when the user asks to be pushed hard.
- Branch walking in dependency order.
- Recommended answer attached to each hard question.
- A domain-language pressure pass before handoff.

What Ideate should not borrow:

- Inline doc updates by default.
- Parent-agent code inspection as a fallback.
- Treating every concept conversation as a docs-maintenance session.

### Addy Osmani Interview Me

Core job: extract what the user actually wants instead of what they think they
should want.

Best at:

- Catching conventional requests that hide a different desire.
- Interrupting premature planning.
- Surfacing "want" versus "should want."
- Producing a confirmed intent statement.

UX shape:

- Start with a one-sentence hypothesis and confidence number.
- Ask one question at a time.
- Attach a guess to each question.
- Watch for best-practice theater and social desirability answers.
- Restate intent as outcome, user, why now, success, constraint, and out of
  scope.
- Require explicit confirmation.

Where it beats Ideate:

- Cleaner stop condition: "can I predict the user's reaction to the next three
  questions?"
- Stronger anti-assumption discipline.
- Better at not accepting "whatever you think" as real agreement.

Where Ideate beats it:

- More generative and imaginative.
- Better at exploring alternate forms.
- Better at UX/concept expansion.
- Less likely to feel like an interview when the user wants a collaborator.

What Ideate should borrow:

- Hypothesis plus confidence in the opening read, especially when the prompt is
  vague.
- A guess on every question.
- A stronger "out of scope" line in final briefs.
- A checkable stop condition for enough shared understanding.

What Ideate should not borrow wholesale:

- Interview-first posture for every loose idea.
- The 95 percent confidence framing as the main product of the skill. Ideate's
  product is not only confirmed intent; it is shaped possibility.

### Compound Engineering CE Ideate

Core job: discover strong, qualified directions worth exploring when the user
does not yet know which ideas matter.

Best at:

- Greenfield candidate generation.
- "What should I improve?" or "surprise me" prompts.
- Large-scale evidence gathering before ideas.
- Generating many ideas, critiquing them, and showing only survivors.
- Auditable basis for each idea.
- Repo-grounded, product, and non-software ideation.

UX shape:

- Identify or ask for the subject.
- Classify whether the run is repo-grounded, software outside the repo, or
  non-software.
- Ground first through agents and external prior art.
- Decompose the topic into axes.
- Generate ideas across several frames.
- Verify basis.
- Present 5-7 ranked survivors and explain rejections.
- Write an ideation artifact automatically by default.

Where it beats Ideate:

- Much stronger for "discover candidates from a broad area."
- Stronger anti-slop mechanism: evidence basis plus rejection reasons.
- More robust for large multi-agent discovery runs.
- Better at "surprise me" because it has an explicit mode.

Where Ideate beats it:

- Lighter, more conversational, less process-heavy.
- Better for a user who already has an idea and wants to explore its shape.
- Less likely to generate an artifact before the user has asked for one.
- Better aligned with a preference for explicit docs/handoff approval.

What Ideate should borrow:

- The explicit split: discovery asks "what directions are worth exploring?"
  while definition asks "what does one chosen direction mean?"
- A "surprise me" or "candidate discovery" branch only when the user asks for
  broad ideation.
- Rejection summaries when many options were explored.
- A basis requirement for claims that materially affect the recommendation.

What Ideate should not borrow wholesale:

- The default large agent fleet.
- Auto-written HTML artifacts.
- Treating external prior art as mandatory for every small concept jam.

### Compound Engineering CE Brainstorm

Core job: collaboratively define what a chosen feature, improvement, project,
or decision should be, then write a right-sized requirements document.

Best at:

- Vague feature ideas.
- Ambitious product decisions.
- Turning conversation into a planning-ready artifact.
- Keeping implementation details out of requirements.
- Scaling ceremony by scope.
- Universal non-software brainstorming.

UX shape:

- Ask for the feature/problem if missing.
- Assess scope: lightweight, standard, deep, or deep-product.
- Ask one question at a time, often with single-select options.
- Run product pressure lenses where needed.
- Explore two or three approaches before recommending one.
- Emit a Synthesis Summary before writing.
- Write a requirements document with stable IDs.
- Hand off to planning.

Where it beats Ideate:

- Stronger at converging into a PRD-like artifact.
- Better at product rigor: evidence, specificity, counterfactual, attachment,
  durability.
- Better downstream traceability with stable requirements IDs.
- Better at keeping planning from inventing product behavior.

Where Ideate beats it:

- Better before the user knows the idea is worth defining.
- Better for metaphor, UX feel, ritual, and alternate form exploration.
- Lighter when no durable requirements doc is desired.

What Ideate should borrow:

- Named pressure lenses.
- Synthesis Summary before final artifact or handoff.
- Scope tiers, but lighter than CE.
- "Implementation stays out of the requirements/concept doc by default."

What Ideate should not borrow wholesale:

- Always writing a requirements doc.
- Stable IDs in every output. They are useful only when handing to plan/build.
- Inline fallback codebase exploration, because Ideate has a stricter
  subagent-only grounding rule.

### Superpowers Brainstorming

Core job: mandatory design refinement before coding inside a full software
development methodology.

Best at:

- Preventing agents from jumping straight to code.
- Turning rough build requests into approved designs.
- Requiring user approval before implementation.
- Writing and reviewing design specs.
- Moving from design to implementation plan to TDD execution.
- Using a visual companion when seeing options is clearer than text.

UX shape:

- Explore project context.
- Ask clarifying questions one at a time.
- Propose two or three approaches.
- Present design in digestible sections.
- Get user approval section by section.
- Write and commit a design doc.
- Self-review the spec.
- Ask the user to review the written spec.
- Invoke the writing-plans skill as the only next implementation step.

Where it beats Ideate:

- Stronger end-to-end build methodology.
- Stronger approval gates.
- Stronger design-doc validation.
- Better at visual exploration through a just-in-time browser companion.

Where Ideate beats it:

- Less heavy.
- More suitable outside software.
- Better when the user is not asking to build yet.
- Better for reversible concept exploration.
- Does not require docs/commits as part of the flow.

What Ideate should borrow:

- Just-in-time visual companion rule: offer visuals only when seeing would be
  clearer than reading.
- Section-by-section validation for complex concept briefs.
- Self-review before final handoff: placeholder scan, contradiction scan,
  ambiguity scan.

What Ideate should not borrow:

- Mandatory use before every creative task.
- Auto-writing and committing design docs.
- Forcing the terminal state to implementation planning.

### Dots Clarify

Core job: ask the minimum blocking questions needed to make implementation safe
enough, then proceed.

Best at:

- Ordinary implementation ambiguity.
- Scope, destructive actions, publishing, credentials, validation, and
  irreversible decisions.
- Keeping the agent moving.

UX shape:

- Inspect repo/context first.
- Bucket uncertainty into known, safe assumption, or blocking decision.
- Ask one to three blocking questions with defaults.
- Proceed after answers or defaults.

Where it beats Ideate:

- Faster.
- Better when the user actually wants implementation.
- Less likely to overthink a small reversible task.

Where Ideate beats it:

- Deeper.
- More imaginative.
- Better for product, UX, strategy, and concept work.

Recommended lane:

- Clarify remains the implementation-safety skill.
- Ideate should not absorb Clarify.

### Legacy Dots Align

Core job: align or stress-test an idea, plan, PRD, spec, domain model, or
architecture direction against codebase and docs before action.

Best at:

- Repo-grounded concept or plan critique.
- Shared language and domain model alignment.
- Inspecting existing docs/code before interviewing.
- Producing doc briefs after decisions settle.

Why it overlaps:

- Ideate now owns concept exploration.
- Ultraplan owns deep code-grounded plan upgrade.
- Clarify owns minimal blockers.
- Docs-writer owns durable docs.

Recommended lane if Align is killed:

- Absorb only its best constraints into Ideate:
  - define fuzzy terms before using them in a handoff
  - do not ask what repo evidence can answer
  - keep doc writes lazy and explicit
  - stop at a doc brief unless the user asks to write
- Do not absorb its parent-agent repo inspection model. Ideate should preserve
  the stricter subagent-only rule for codebase exploration.

### Dots Ultraplan

Core job: upgrade an existing implementation plan/spec with repo-grounded
critique and verification.

Best at:

- Already-written plans.
- False-premise detection.
- Independent verification.
- Refuting weak findings.
- Writing upgraded plan artifacts.

Recommended lane:

- Ultraplan is downstream of Ideate. If the user has a concept brief but no
  implementation plan, do not use Ultraplan yet. If they have a plan and want it
  attacked, Ideate should hand off.

## Capability Matrix

| Capability | Ideate | Grill With Docs | Interview Me | CE Ideate | CE Brainstorm | Superpowers Brainstorming |
|---|---|---|---|---|---|---|
| Primary question | What could this become? | Does this plan/design survive pressure? | What do you actually want? | What directions are worth exploring? | What exactly should this chosen thing mean? | What design should be approved before coding? |
| Best starting input | Loose idea | Plan or design | Underspecified ask | Topic or broad improvement area | Feature/problem/decision | Build request |
| Main motion | Expand then converge | Relentless branch interview | Hypothesis and intent extraction | Generate, critique, select | Define, approach, document | Design, approve, plan |
| Question cadence | One branch-unlocking question | One relentless question | One question plus guess | One question for gates, then agent fleet | One question at a time | One question at a time |
| Agent posture | Concept partner | Tough interviewer | Intent diagnostician | Discovery orchestrator | Requirements partner | Software methodology coach |
| Codebase grounding | Read-only subagents only | Parent can explore code | Not primary | Agent fleet, repo scans | Scout/verifier agents, inline fallback | Parent explores context |
| Durable output | Concept brief unless asked otherwise | Glossary/ADR/context docs as terms resolve | Confirmed intent; optional intent doc | Auto ideation artifact | Auto requirements doc | Auto design spec and commit |
| Non-software fit | Strong | Medium | Strong | Strong | Strong | Weak to medium, despite some process portability |
| UX/visual exploration | Conceptual UX focus | Not visual by default | Not visual by default | Artifact can be rich HTML | Mostly requirements | Strong visual companion |
| Implementation gate | Explicit build plus confirm build | Stops before build unless user proceeds | Stops at confirmed intent | Routes to brainstorm | Routes to plan/work | Mandatory approval then plan |
| Best thing to steal | Branch map and optional grill | Domain-doc composition | Hypothesis, confidence, guess | Basis and rejection discipline | Pressure lenses and synthesis | Visual companion and approval gates |

## User Experience Differences

### Ideate Feels Like A Concept Jam

The user says:

> I have this rough idea for a tool that helps me think through projects before
> I overbuild them.

Ideate should respond:

```text
My read: you want a pre-build thinking surface that keeps ideas alive long
enough to choose the right shape, then makes the next artifact obvious.

This could be:
1. A conversational concept partner - best for fluid exploration.
2. A branching map generator - best for seeing alternatives and trade-offs.
3. A handoff brief creator - best for converting messy thought into next steps.

My instinct: start as a concept partner with a visible branch map, because the
costly failure mode is collapsing too early into a PRD.

Question: Is the win mainly emotional clarity, better product decisions, or a
cleaner handoff to implementation?
Guess: better product decisions, with emotional clarity as the thing that makes
you actually use it.
```

The tone is spacious. The agent is allowed to have taste. It does not behave as
though the only valid endpoint is a spec.

### Grill With Docs Feels Like A Pressure Interview

The user says:

> I have a plan for adding project templates and want you to grill it.

Grill With Docs should respond:

```text
Question: What is the first decision that becomes expensive to reverse:
template format, where templates live, or how users choose one?

Recommended answer: template format. If the format is wrong, every later
template and migration inherits that mistake.
```

As terms resolve, the domain-modeling side may record vocabulary or propose an
ADR. The energy is less "what could this become?" and more "where will this
break, confuse future readers, or contradict the system?"

### Interview Me Feels Like Intent Extraction

The user says:

> Build me a dashboard for my writing projects.

Interview Me should respond:

```text
HYPOTHESIS: You want a way to know which writing projects need attention, and
"dashboard" is the conventional shape that came to mind.
CONFIDENCE: ~35% - missing: who it is for, what attention means, and what
success looks like.

Q: Is the real problem that you cannot see project status, or that you cannot
decide what to work on next?
GUESS: deciding what to work on next, because a dashboard that only shows status
may still leave you stuck.
```

The endpoint is a confirmed statement of intent. It is narrower than Ideate,
but more disciplined about preventing the wrong artifact.

### CE Ideate Feels Like A Discovery Machine

The user says:

> What should we improve in onboarding?

CE Ideate should respond by first making sure the subject is identifiable, then
grounding in repo/product evidence, prior art, and possibly user research. It
should generate a broad set of candidates, critique them, and present survivors:

```text
Treating this as an onboarding topic in this codebase.

I will ground first, generate candidates across several frames, then return the
survivors with rejection reasons.
```

The user experience is less conversational minute-to-minute and more like
commissioning a structured discovery report.

### CE Brainstorm Feels Like A Requirements Workshop

The user says:

> Let's brainstorm a better onboarding checklist.

CE Brainstorm should respond:

```text
What kind of onboarding checklist are we defining?

1. A user-facing checklist in the app
2. An internal implementation checklist for the team
3. A lifecycle checklist that spans docs, email, and app surfaces

Recommended: 1, unless the real gap is operational ownership.
```

The flow then pressure-tests premises, explores two or three approaches, emits a
synthesis, and writes a requirements doc.

### Superpowers Feels Like A Build-Gate Methodology

The user says:

> Add an onboarding checklist.

Superpowers brainstorming should respond by exploring project context, asking
questions, presenting design sections, requiring approval, writing a design doc,
self-reviewing it, asking the user to review it, and only then invoking an
implementation-planning skill.

This is excellent when the goal is "build this correctly." It is too heavy when
the goal is "help me think."

## What Ideate Should Incorporate

### 1. A Mode Gate

Add a small early classification without making the UX bureaucratic:

- Specific loose idea: use core Ideate.
- Broad "what should I improve?" prompt: run candidate discovery mode or
  recommend a discovery handoff.
- Existing plan/design: offer grill mode or hand off to Ultraplan if repo-plan
  critique is the main need.
- Implementation request: use Clarify or implementation flow, not Ideate,
  unless the user asked to think first.

Suggested language:

```text
First, classify the session:
- Concept shaping: the user has a loose idea and wants possible forms.
- Candidate discovery: the user wants strong directions generated from a broad
  area.
- Definition: the user has chosen a direction and wants requirements.
- Pressure: the user has a plan/design and wants it attacked.

Default to concept shaping unless the prompt clearly asks for another mode.
```

### 2. Hypothesis, Confidence, And Guess

Ideate already asks with a guess. It should borrow Interview Me's stronger
opening when the prompt is vague:

```text
My read: <hypothesis>
Confidence: <number> - <what is missing>
```

Use this when ambiguity is high. Do not force it into every tiny concept jam.

### 3. Product Pressure Lenses

Borrow CE Brainstorm's named pressure lenses, tuned for Ideate:

- Evidence: what real behavior or need makes this worth shaping?
- Specificity: who benefits, and in what moment?
- Counterfactual: what happens if nothing changes?
- Attachment: are we attached to a solution shape too early?
- Durability: will this still matter when the current context changes?
- Form-fit: does the proposed artifact match the core desire?

These should not become a checklist at the opening. Use them when a branch feels
weak, conventional, or overly confident.

### 4. Optional Grill Mode

When the user says "grill me," "be relentless," "stress-test this," or the idea
has already become a plan, Ideate should switch posture:

- Ask one hard branch question at a time.
- Give the recommended answer.
- Explain what risk the question reduces.
- Keep a running list of resolved decisions and unresolved forks.

This should remain optional. Relentlessness is useful when requested; exhausting
when imposed.

### 5. Synthesis Summary Before Any Durable Artifact

Before writing a PRD, spec, docs, or durable handoff, emit a short synthesis:

```text
Synthesis before capture:
- Core direction:
- Key trade-off:
- Deferred:
- Non-goal:
- Open fork:
```

Then ask if the user wants to capture it. This borrows CE Brainstorm's "last
cheap moment to correct" without forcing auto-docs.

### 6. Just-In-Time Visual Companion

Borrow the Superpowers rule:

- Offer visuals only when seeing would be clearer than reading.
- Use visuals for UI layouts, journey maps, flow diagrams, concept comparisons,
  architecture diagrams, and spatial relationships.
- Keep text for scope, goals, trade-offs, terminology, and non-goals.

For Ideate, this should usually be a handoff to `visual-design` or a temporary
diagram/mockup, not implementation.

### 7. Rejection Reasons When Many Options Are Explored

When Ideate explores more than three serious alternatives, the final brief
should include:

- kept directions
- rejected directions
- why they were rejected
- what evidence or reasoning changed the decision

This borrows CE Ideate's anti-slop mechanism but keeps it lightweight.

### 8. Explicit Codebase Grounding Contract

Keep Ideate's strictest differentiator:

- Parent agent does not inspect code for Ideate's codebase grounding.
- Read-only subagents inspect code/docs/tests/git/local implementation docs.
- Parent synthesizes.
- No subagent path means concept-only or switch modes.

This differs from Matt, CE, and Superpowers. That is okay. It is a deliberate
workflow preference.

### 9. Self-Review Before Final Brief

Borrow a small Superpowers-style self-review:

- Did the brief collapse into implementation?
- Did it name the core desire?
- Did it preserve meaningful alternatives?
- Did it state non-goals?
- Did any codebase claim come from a subagent?
- Did it avoid durable docs unless explicitly requested?

## What Ideate Should Not Incorporate

### Do Not Auto-Write Docs

Matt's domain-modeling and CE workflows often create or update docs as part of
the run. Superpowers writes and commits a design spec. Ideate should not do that
by default.

Reason: the user is still deciding whether the idea deserves a durable artifact.
Writing too early makes the artifact feel more settled than the thinking.

### Do Not Become A Full Compound Engineering Clone

CE Ideate and CE Brainstorm are powerful because they are embedded in a large
methodology with many agents, output formats, config, artifact directories, and
downstream plan/work skills. Ideate should borrow principles, not the machinery.

### Do Not Make "Relentless" The Default Tone

Relentless questioning is useful for stress-testing. It is a poor default for
creative exploration. Ideate should start spacious and become harder only when
the user asks or when the concept remains unstable.

### Do Not Ask Generic Questions When Context Exists

Superpowers and CE both emphasize context. The caution for Ideate is: do not ask
questions that the prompt, prior conversation, files supplied by the user, or a
subagent evidence pass already answer.

The best Ideate questions should unlock a branch, not collect a bio.

### Do Not Let "Push Against Implementation" Become Implementation

The user explicitly wants this boundary:

- "Push against implementation" means feasibility pressure and codebase
  evidence.
- It does not mean code edits.
- A build-style request plus separate confirmation is required to implement.

## Recommended Lane For Ideate

Ideate should be the Dots skill for concept shaping.

Use it when:

- The user has a loose idea.
- The user wants to explore form, UX, branches, alternatives, or a possible
  future artifact.
- The user is not ready to write a PRD or build.
- The domain may be software, product, writing, strategy, workflows, personal
  systems, or something else.

Do not use it when:

- The user only needs minimum blockers before coding: use Clarify.
- The user has an existing implementation plan and wants deep repo refutation:
  use Ultraplan.
- The user wants a durable PRD/spec/doc now: use Docs Writer after a concept
  brief or use a dedicated requirements flow.
- The user wants visual UI implementation: use Visual Design after the concept
  direction is chosen.

## Recommended Workflow Shape

The best singular Ideate flow looks like this:

1. Opening read
   - Name the core desire.
   - State confidence if the read is uncertain.
   - Offer two or three plausible forms.
   - Recommend a starting form.
   - Ask one branch-unlocking question with a guess.

2. Branch exploration
   - Walk branches in dependency order.
   - Use pressure lenses only where useful.
   - Offer alternatives before narrowing.
   - Become relentless only on request or when needed.

3. Evidence grounding
   - Stay free while the concept is opening.
   - If the idea must fit a repo, delegate bounded read-only evidence passes to
     subagents.
   - Use codebase evidence only to choose between branches or expose
     constraints.

4. Convergence
   - Summarize the direction.
   - Name rejected alternatives if meaningful.
   - State open questions with recommended defaults.
   - Name non-goals and implementation boundary.

5. Handoff choice
   - No artifact yet.
   - Concept brief in chat.
   - Durable doc via Docs Writer.
   - Visual exploration via Visual Design.
   - Requirements/spec flow.
   - Implementation only after the explicit build gate.

## Concrete Patch Ideas For Ideate

These are likely worth adding to `plugins/dots/skills/ideate/SKILL.md`:

1. Add a "Mode Gate" section near `Workflow`.
2. Add a "Pressure Lenses" subsection under `Map Branches`.
3. Add "Synthesis Before Capture" under `Converge Into A Concept Brief`.
4. Add "Visual Thought Aid" under `Handoffs`.
5. Add an explicit "Do not ask generic questions when context already answers
   them" gotcha.
6. Add "candidate discovery mode" as optional, but keep it lightweight and
   explicitly different from concept shaping.
7. Add "rejection reasons" when many alternatives were explored.

Recommended caution: do not add all of Compound Engineering's artifact and
agent machinery. The point is to preserve Ideate's lighter conversational feel
while raising its rigor at the moments where weak ideas usually sneak through.

## The Cleanest Mental Model

Use this routing sentence:

```text
Interview Me finds the real desire.
CE Ideate finds candidate directions.
Ideate shapes one loose direction into a coherent concept.
CE Brainstorm defines the chosen direction into requirements.
Grill With Docs attacks a plan/design while preserving shared language.
Superpowers turns approved design into a software build methodology.
Clarify removes minimum blockers before implementation.
Ultraplan attacks an existing repo-grounded plan.
```

If Align is killed, Ideate should inherit only the concept-facing parts of
Align: term discipline, doc laziness, explicit action boundaries, and
repo-grounded pressure through subagents.

## Bottom Line

The best Ideate is not "Interview Me plus Grill Me plus CE Brainstorm." That
would become heavy, interrogative, and over-artifacted.

The best Ideate is:

- lighter than CE Brainstorm
- more generative than Interview Me
- less adversarial than Grill With Docs by default
- less build-mandatory than Superpowers
- stricter than all of them about subagent-only codebase grounding
- explicit about when it is exploring, defining, pressuring, documenting, or
  building

The workflow should feel like a smart collaborator helping a rough idea breathe
before deciding what it deserves to become.
