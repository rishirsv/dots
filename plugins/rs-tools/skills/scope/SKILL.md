---
name: scope
description: "Use for broad, fuzzy, consequential, or pre-plan work before execution: Codex goals, substantial features, coding tasks, documents, presentations, research, strategy, workflow design, plugin/skill design, artifact design, and general knowledge work. Scope runs a persistent one-question-at-a-time discussion until shared understanding exists and the next chat decision, artifact, plan, Codex goal, research handoff, implementation handoff, or decision to stop is genuinely clear. Do not use for narrow requirements clarification, accepted plans where the user wants execution, routine edits, direct implementation, code review, or fully settled work."
---

# Scope

Scope turns broad or fuzzy work into shared understanding clear enough to act on.

<what-to-do>

Run a pre-plan discussion. Do not implement during Scope. Do not offer to implement inside Scope. Do not produce a detailed execution plan while material scoping questions remain unanswered.

Ask one focused question at a time, waiting for the user's answer before continuing. If a question can be answered by inspecting the workspace, provided materials, or current sources, inspect those sources instead of asking.

Walk the decision tree until every open trail that would change the next artifact, plan, goal, research handoff, implementation handoff, or decision has either been resolved, explicitly deferred, or marked as a non-blocking risk.

End only with a concise **Scoped Direction** that makes closure explicit: Scope is concluded or not concluded, whether any open trails remain, what durable capture exists, and what the next handoff is.

If the chosen next move is implementation, phrase it as a handoff after Scope, not as work this skill is starting. Scope may say implementation is ready; it must not begin implementation or drift into implementation advice beyond the decisions needed for the handoff.

</what-to-do>

<supporting-info>

## Scope vs Clarify

Use **Clarify** when the user already has a concrete request and only the minimum must-have questions are needed before execution.

Use **Scope** when the work is broad, fuzzy, high-consequence, multi-session, strategic, creative, agentic, or likely to shape future work.

Clarify asks the fewest questions needed to avoid wrong execution.

Scope asks as many useful questions as needed to build shared understanding.

Do not collapse Scope into Clarify. Do not turn Scope into implementation.

## When To Use Scope

Use Scope for:

- Codex goals, long-running autonomous work, or multi-agent setup
- substantial feature, architecture, refactor, migration, or implementation setup
- documents, presentations, memos, briefs, research plans, or strategy work
- workflow design, process design, plugin design, skill design, or agent-workflow design
- broad ideation before choosing a direction
- pressure-testing an existing idea, plan, artifact, workflow, or decision
- deciding what the next durable artifact should be
- work where ambiguity would compound if an agent started executing too soon

Do not use Scope for:

- a small request that is already clear enough to execute
- routine edits or mechanical changes
- code review
- accepted plans where the user wants execution
- narrow requirements clarification that belongs in Clarify
- full sourced research briefs, unless the next scoped move is to define and hand off the research

If Scope is not needed, say so briefly and recommend the direct next move.

## Operating Modes

Choose the lightest mode that fits.

### Short Scope

Use for small but fuzzy topics. Ask only the questions needed to choose the next move, often 1-5 total. End in chat unless the result needs to persist.

### Persistent Scope

Use for substantial, high-consequence, multi-session, agentic, or durable work.

Ask one focused question at a time. For substantial topics, expect a real scoping conversation, often roughly 20-50 focused questions total when that materially reduces ambiguity.

This is not a quota. Do not ask filler questions. Stop earlier when the next move is genuinely clear. Continue longer when unresolved ambiguity would change the artifact, plan, Codex goal, implementation path, audience experience, domain meaning, validation approach, or future-agent instructions.

### Ideation To Discussion

Use when the user wants options before choosing a direction. Generate possibilities before evaluating them. Filter weak, generic, duplicative, or unsupported ideas before presenting survivors. Once a promising direction emerges, shift into the one-question-at-a-time scoping loop before planning or execution.

## The Scoping Loop

Follow this loop until the next move is clear.

1. **Ground first.** Inspect the relevant source of truth before asking questions the workspace, repo, docs, files, existing artifacts, user-provided context, or current sources can answer.
2. **State current understanding.** Restate the goal or direction in 1-3 concise sentences.
3. **Choose the highest-leverage branch.** Focus on the uncertainty that most affects the next artifact, plan, Codex goal, research handoff, implementation handoff, or decision.
4. **Ask one focused question.** Ask only one question at a time unless a tiny grouped choice is clearly faster.
5. **Give a recommended default.** When useful, state the likely default or recommended answer and why.
6. **Challenge language and assumptions.** When terms are vague, overloaded, or inconsistent with project language, call that out and propose a precise meaning. Use concrete scenarios to test boundaries.
7. **Record what changed.** Treat the answer as a decision, constraint, assumption, term, non-goal, validation expectation, artifact-routing choice, open question, or future-agent instruction.
8. **Keep support separate from action.** Use the lenses below to decide what to ask or inspect, but do not dump them as the answer. Output only the current understanding, the question, checkpoints, durable capture, and the final Scoped Direction.
9. **Checkpoint every 3-4 questions.** Briefly summarize what has resolved, what remains live, and which branch you are moving to next.
10. **Continue persistently.** Do not end because the conversation has become long. End only when the next handoff is genuinely clear or the user asks to stop.
11. **Run the ending audit.** Before ending, ask internally: "Is there any unresolved question whose answer would change the next artifact, plan, Codex goal, implementation path, audience-facing result, domain meaning, validation approach, or future-agent instruction?" If yes, ask that question instead of ending.
12. **Capture durable outcomes.** If future work will rely on the discussion, update or create the appropriate source-of-truth artifact before Scope ends.

The user should experience a calm sequence of sharp questions, not a giant questionnaire.

## Question Style

Ask in plain English for a smart non-technical user unless the topic itself requires technical language.

Use:

- short questions
- one question at a time
- concrete choices when helpful
- a recommended/default answer when helpful
- one sentence of context before the question when needed
- one sentence explaining why the answer matters when the impact is not obvious

Avoid:

- giant questionnaires
- mechanical intake forms
- dense implementation language
- implementation suggestions before Scope has concluded
- asking trivia that does not change the next move
- asking the user to decide things the project already decides
- turning every answer into a new artifact
- pretending surface agreement is shared understanding

Good question shape:

```md
**On the audience:**

I think the default should be to write this for future agents first, then humans second, because the artifact will mainly guide follow-through work.

**Question:** Should the source of truth be optimized for future agents, human reviewers, or both equally?
```

Good checkpoint shape:

```md
**Checkpoint:** We have settled the target reader, the non-goals, and the validation bar. The remaining risk is artifact shape: whether this should become a short context note, a full spec, or a Codex goal setup. I want to resolve that next.
```

## Conversation Formatting

Make Scope easy to scan while the discussion is still in progress.

- Use short structured blocks when sharing current understanding, a recommendation, a checkpoint, or the next question.
- Bold lead-in labels including the colon, for example `**Current Understanding:**`, `**Recommended Default:**`, `**Why This Matters:**`, `**Question:**`, and `**Checkpoint:**`.
- Separate the current understanding, recommendation, and question into distinct paragraphs when more than one is present.
- Keep labels natural and task-neutral. The same formatting should work for coding, documents, research, strategy, workflows, and other knowledge work.
- Put examples, candidate wording, tables, or concrete options on their own lines when that makes the decision easier to inspect.
- Do not over-template casual turns. Use structure to improve readability, not to make the conversation feel mechanical.

## What To Explore

Use these lenses as prompts, not a checklist.

- **Outcome**: what success looks like, who it serves, and what should be different when the work is done
- **Audience or user**: the reader, user, stakeholder, operator, reviewer, or future agent
- **Scope boundaries**: what is in scope, out of scope, deferred, and explicitly not worth doing
- **Evidence and motivation**: the pain, request, observation, risk, opportunity, or strategic reason behind the work
- **Terms and shared language**: vague, overloaded, or conflicting terms that affect the work
- **Source of truth**: where future agents or collaborators should look first
- **Constraints**: style, tone, time, budget, dependencies, compatibility, privacy, safety, data, migration, rollout, maintainability, or reversibility
- **Tradeoffs and alternatives**: live options, smaller versions, simpler alternatives, and rejected directions that explain the choice
- **Edge cases and failure modes**: empty states, error states, transition states, permission issues, operational burden, adoption risk, and symptom-vs-cause gaps
- **Validation**: how the user, reviewer, future agent, test suite, reader, or stakeholder will know the work is done
- **Future-agent instructions**: what future agents must preserve, avoid, check, update, and report

## Pressure Testing

Borrow the useful shape of a grilling session without making Scope combative.

- Challenge conflicts with the project language, source material, or prior decisions immediately.
- Sharpen fuzzy terms by proposing a canonical meaning and asking whether it is right.
- Discuss concrete scenarios when relationships, workflow boundaries, ownership, or edge cases are unclear.
- Cross-reference source material when the user states how something works and the workspace may already answer it.
- Separate settled decisions from supporting observations, assumptions, and inference.
- Do not treat pressure testing as permission to design the implementation. Keep it at the level needed to resolve the scoped direction.

## Grounding And Research

Grounding is required when it would prevent avoidable questions or wrong framing.

For local project or workspace topics, inspect relevant sources such as:

- `AGENTS.md`
- `README.md`
- existing specs, plans, briefs, notes, TODOs, and context docs
- active or completed ExecPlans
- nearby source files, examples, tests, configs, routes, schemas, or artifacts
- user-provided files and conversation context

For external or current facts, use web or source research when current outside information materially affects the scoped decision.

Use research proportionally. Scope should not become a full research-brief workflow. If the main task is research, Scope should define the research question, sources, output shape, depth, validation bar, and next artifact, then hand off to research.

Keep sourced findings separate from assumptions and inference.

## Ideation Behavior

When ideating:

1. Ground enough to avoid generic ideas.
2. Generate broadly before judging.
3. Use varied lenses: removal, simplification, inversion, leverage, compounding, analogy, constraint flip, and smallest useful version.
4. Merge and dedupe overlapping ideas.
5. Reject weak ideas before presenting survivors.
6. Give each serious survivor a warrant:
   - **Direct**: user-provided context, local project evidence, docs, shipped behavior, examples, or explicit quotes
   - **External**: current source, prior art, market pattern, platform guidance, or named reference
   - **Reasoned**: first-principles argument tied to the user's goal
7. Recommend what to develop or discuss next.
8. Shift into Persistent Scope before substantial planning or execution.

Do not present a long undifferentiated idea dump.

## Durable Capture

Default to chat for small, throwaway, or fully resolved conversations.

Create or update a durable artifact when any of these are true:

- the user asks for one
- another agent, session, collaborator, plan, or Codex goal will rely on the result
- the session produces reusable decisions, terms, constraints, assumptions, non-goals, validation expectations, artifact-routing choices, or future-agent instructions
- the work is substantial, multi-session, high-consequence, or likely to be resumed later
- the result would be hard to reconstruct from chat

Hard invariant:

If an artifact is created or updated, it must contain every durable outcome of the Scope session before Scope ends.

Durable outcomes include:

- goal and desired outcome
- audience, reader, user, stakeholder, or future-agent target
- decisions made and why they were made
- constraints and accepted defaults
- canonical terms, aliases, and rejected meanings
- assumptions the next agent may rely on
- non-goals and deferred work
- in-scope and out-of-scope boundaries
- tradeoffs and rejected options when they explain the choice
- validation expectations and definition of done
- artifact-routing decisions
- open questions and whether they block action
- instructions future agents must follow
- context needed to avoid re-litigating settled points

Write durable artifacts as source-of-truth substance, not as transcripts. Do not paste the conversation. Do not write a vague summary. The artifact should be complete enough for a future agent to continue without rereading the chat.

Capture decisions and constraints only. Do not expand durable capture into execution, implementation, or detailed project planning unless the user explicitly asks for that separate next move.

When a canonical artifact already exists, update it instead of creating a competing source of truth.

If the right artifact does not exist but durable decisions are being made, create the smallest appropriate artifact in the project's conventional location, or ask where it should live when there is no convention and the location materially matters.

## Artifact Routing

Choose the smallest durable structure future work will actually use. Prefer one canonical source of truth. Use a small bundle only when a Codex goal, long-running workflow, or project convention truly requires multiple maintained files.

When using a Scope asset template, read the matching file before writing:

- **Context note**: shared understanding, constraints, terminology, assumptions, non-goals, and next-step guidance that future agents need but that is not yet a full spec or plan. Read `assets/context-template.md`.
- **Domain context**: terminology, ownership boundaries, structural relationships, or flagged ambiguity that should become canonical. Read `assets/domain-context-template.md`.
- **Brief or product spec**: documents, presentations, research, strategy, product work, workflows, plugins, skills, or features where the desired outcome and acceptance criteria need to guide later drafting, planning, or implementation. Read `assets/product-spec-template.md`.
- **ExecPlan**: substantial implementation sequencing. Follow local planning instructions first; if the project has no stronger convention, read `assets/exec-plan-template.md`.
- **Codex goal setup**: long-running autonomous work, multi-agent work, or work that must stay alive across turns. Capture the goal, why it matters, scope, non-goals, standards, workflow instructions, validation expectations, progress logging expectations, decision-log expectations, risks, assumptions, and continuation instructions. Use supporting files only when they will actually be read and maintained.
- **Project-native artifact**: use the repo, workspace, or organization's existing artifact type when it is the real source of truth.

Do not create an ExecPlan while scope-level decisions remain unsettled. Scope may create or update the decisions that an ExecPlan will rely on, then recommend the ExecPlan as the next move.

## Final Chat Output

End every Scope session with a concise **Scoped Direction** unless the user explicitly asks for a different format.

Use this shape:

```md
## Scoped Direction

**Chosen Direction:** The direction to carry forward, or the remaining live options if no direction is chosen.

**What We Resolved:** Decisions, terms, constraints, assumptions, non-goals, validation expectations, and artifact-routing choices settled during Scope.

**In Scope:** What belongs in the next move.

**Out Of Scope:** What should stay out for now.

**Remaining Risks:** The main uncertainties, costs, or failure modes still worth watching.

**Open Trails:** Unresolved questions, ambiguities, branches, or assumptions, or `None`. Say whether each one blocks the next handoff.

**Durable Capture:** `Chat only`, or the artifact path(s) updated/created and what they now contain.

**Planning Closure:** `Scope concluded` or `Scope not concluded`. If concluded, say whether there are no more open trails that would change the next handoff. If not concluded, say what remains unresolved.

**Recommended Handoff:** The exact next chat, artifact, plan, Codex goal, research handoff, implementation handoff, or decision. If implementation is ready, say what should be handed to the implementing agent without starting the work.
```

For ideation, include a ranked survivor list before **Scoped Direction**.

For substantial Scope sessions, the final output should be short because the durable artifact carries the source-of-truth substance.

## Guardrails

- Do not implement during Scope.
- Do not offer to start implementation during Scope.
- Do not let a final handoff become implementation advice in disguise.
- Do not produce a detailed execution plan while important scoping questions remain.
- Do not dump a giant questionnaire.
- Do not ask mechanical questions just to reach a target count.
- Do not stop early when unresolved ambiguity would change the next move.
- Do not conclude Scope without explicitly saying whether open trails remain.
- Do not turn every conversation into an artifact.
- Do not leave durable decisions only in chat when future work will rely on them.
- Do not create competing artifacts when a canonical artifact already exists.
- Do not make Scope coding-biased; use the same discipline for documents, decks, research, strategy, workflows, skills, and general knowledge work.
- Do not ask the user to answer what source material can answer.
- Do not hide uncertainty. Mark assumptions and open questions clearly.

</supporting-info>
