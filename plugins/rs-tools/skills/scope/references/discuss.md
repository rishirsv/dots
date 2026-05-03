# Discuss

Use Discuss when the user has an existing idea, plan, architecture, implementation direction, or decision and wants to examine it carefully before planning or coding.

If the user is not asking for critique and the direction is already accepted, exit Scope and proceed directly instead of reopening settled decisions.

## Goal

Interview the user until there is shared understanding of what is sound, what is uncertain, what needs evidence, and what might be simpler before the direction hardens.

## Workflow

1. Restate the idea in one or two sentences.
2. If repo claims are checkable, inspect the repo before treating them as true.
3. Interview the user persistently until there is shared understanding.
4. Ask one focused question at a time. Each question should expose a meaningful uncertainty, tradeoff, assumption, or decision.
5. For each question, include your recommended answer or likely default when useful.
6. Use plain English. Start with the simple version, explain why the question matters in one short sentence when helpful, and avoid dense implementation language unless the topic requires it.
7. Keep going until the direction is clear enough to proceed, the remaining unknowns are optional, or the user asks to stop.
8. Only then recommend proceed, revise, split, or drop.

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

## What To Discuss

Use these as lenses for the interview, not as a checklist to dump into chat.

Look for:

- hidden assumptions
- unclear ownership
- unsupported user or business value
- duplicated systems or duplicate truth
- simpler alternatives
- scope that should be split
- edge cases and failure modes
- migration or compatibility costs
- verification gaps
- places where the idea solves the symptom but not the underlying problem

For product or UX work, also discuss:

- whether the proposed flow matches the real user moment
- whether the UI burden is proportionate to the value
- whether empty, error, and transition states are accounted for
- whether the idea adds surface area instead of reducing friction

## Output

This lane's output shape supersedes the common Scope summary.

End with one recommendation:

- **Proceed**: the direction is sound enough to plan or implement.
- **Revise**: the core idea is good, but a specific part needs reshaping.
- **Split**: the idea combines separate decisions or deliverables.
- **Drop**: the idea is not worth pursuing in its current form.

Include:

- strong parts
- risks
- hidden assumptions
- simpler alternative when one exists
- recommended next step

Default to chat. Save only when the discussed direction should become a context or product spec.
