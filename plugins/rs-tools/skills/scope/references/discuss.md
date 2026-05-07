# Discuss

## Contents

- Goal
- Workflow
- Question Voice
- What To Discuss
- Terminology Pressure Testing
- Output

Use Discuss when the user has an existing idea, plan, architecture, workflow, implementation direction, new-feature concept, or decision and wants to examine it carefully before planning or coding.

If the user is not asking for critique and the direction is already accepted, exit Scope and proceed directly instead of reopening settled decisions.

## Goal

Interview the user persistently until there is shared understanding of what is sound, what is uncertain, what needs evidence, and what might be simpler before the direction hardens.

Keep asking until the direction is genuinely clear. Do not settle for surface agreement, but ask with curiosity rather than pressure.

When the discussion scopes a new feature or materially reshapes a feature, the durable output should usually be a clean spec. Capture the contents of the discussion as settled requirements and decisions, not as a transcript.

## Workflow

1. Restate the idea in one or two sentences as **Current Understanding**.
2. If project, product, repo, or workflow claims are checkable, inspect the source of truth before treating them as true.
3. Ask one focused question at a time. Each question should expose a meaningful uncertainty, tradeoff, assumption, term, boundary, or decision.
4. Include your recommended answer or likely default when useful.
5. Use plain English. Start with the simple version, explain why the question matters in one short sentence when helpful, and avoid dense implementation language unless the topic requires it.
6. Use a topic label when it helps the user follow the branch being explored, such as `On artifact routing:` or `Switching to the data model:`.
7. Name topic transitions naturally: "That settles the user-facing flow. Next I want to test the rollout risk."
8. After 3-4 questions, or at a natural topic boundary, give a brief 2-3 sentence checkpoint of what has resolved before continuing.
9. Treat a branch as settled when the answer resolves the decision, the remaining unknowns are optional, or another branch now carries the real risk.
10. Use the lenses in What To Discuss below to guide your questions, but let the conversation determine which branches to explore and in what order.
11. If the discussion reveals the user does not have a direction yet, offer to shift into Ideate before planning or implementation.
12. When multiple plausible directions remain after the relevant branch has been explored, present 2-3 options before recommending one.
13. If the result should guide feature implementation, create or update the repo's canonical spec with the clarified decisions and requirements.
14. End with the **Scoped Direction** shape from `SKILL.md`.

## Question Voice

Ask in a short, simple, practical voice. Write for a smart non-technical user who needs enough context to answer well without reading an engineering memo.

Use:

- short sentences
- plain words
- one question at a time
- one sentence of context before a question, only when it helps
- a recommended/default answer when there is a sensible default
- a short "why this matters" when the practical impact is not obvious

Prefer:

- "This decides whether we make a small change or reshape the workflow."
- "I think the default should be X because it keeps the current behavior stable."
- "If you are not sure, I can use the existing project pattern."

Avoid:

- long setup paragraphs
- unexplained acronyms
- abstract framework language
- questions that sound like an engineering intake form
- deep implementation trivia unless the decision depends on it

Example:

```md
On web authentication:

Right now, the product has both password login and magic-link login. I think the safer default is to keep both for existing users, but make magic links the primary path for new users because it reduces password reset support.

Does that match your intent, or should password login stay equally prominent?
```

## What To Discuss

Look for:

- hidden assumptions
- unclear ownership
- unsupported user or business value
- duplicated systems or duplicate truth
- simpler alternatives
- scope that should be separated into different deliverables
- edge cases and failure modes
- migration or compatibility costs
- verification gaps
- places where the idea solves the symptom but not the underlying problem

For product or UX work, also discuss:

- whether the proposed flow matches the real user moment
- whether the UI burden is proportionate to the value
- whether empty, error, and transition states are accounted for
- whether the idea adds surface area instead of reducing friction

For fuzzy product or workflow direction, use these as optional product probes when the existing lenses are not specific enough:

- **Evidence**: what observable behavior, request, workaround, or pain says this matters?
- **Specificity**: who exactly is affected, and what changes for them?
- **Counterfactual**: what happens today if nothing changes?
- **Smallest proving version**: what is the smallest version that would prove the bet?
- **Durability**: only when relevant, what plausible near-term change would make this idea weaker?

These probes supplement the lenses above. Do not run them as a checklist.

## Terminology Pressure Testing

Use this only for project, product, architecture, workflow, or domain discussions where shared language affects the work.

When grounding reveals a term that conflicts with the user's language, or when the user uses a vague or overloaded term:

- Name the conflict plainly.
- Ask whether the terms are the same or distinct.
- Recommend the canonical term when existing project language, code, or prior decisions point to one.
- Name aliases or meanings to avoid.
- Test the distinction with a concrete scenario when the boundary is still fuzzy.
- Once a term is resolved, use it consistently in later questions and in the final output.
- Do not create a glossary, language doc, or extra output section just because terminology was discussed; fold important terms into the existing decision, spec, or Scoped Direction only when they affect the next step.

Frame this as discovery, not prescription. Prefer: "The code uses `Account`, but you are saying `Customer`. Are those the same thing here, or is there a distinction we should preserve?"

Do not pressure-test terminology during loose Ideate sessions unless the user has narrowed to a direction and asks to discuss it.

## Output

End with the **Scoped Direction** shape from `SKILL.md`.

Do not use `Proceed`, `Revise`, `Split`, or `Drop` as formal verdicts. If the work should be separated, say so naturally inside `Chosen Direction`, `What We Resolved`, or `Recommended Next Step`.

When options were compared, put the selected option in `Chosen Direction`. Mention rejected alternatives only when they materially explain the choice.

Include:

- strong parts
- risks
- hidden assumptions
- simpler alternative when one exists
- recommended next step

Default to chat. Save only when `SKILL.md` says the result needs a durable artifact or the discussed direction should become a context or product spec.

If saving a product spec, write it cleanly from the discussion using the repo's canonical template, or read `assets/product-spec-template.md` when no project template exists.

Do not create a separate "discussion" artifact for feature scope. The spec is the durable source of truth; an ExecPlan may come later for sequencing implementation work.
