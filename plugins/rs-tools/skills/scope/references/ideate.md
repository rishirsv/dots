# Ideate

Use Ideate when the user wants broad options, surprising directions, or a stronger candidate set before choosing what to develop.

If the user has already selected a concrete direction and only wants execution, exit Scope and proceed directly instead of ideating.

## Goal

Generate many grounded possibilities, critique them, and present only the strongest survivors.

## Workflow

1. Identify the subject. If the subject is too vague for useful generation, ask one plain-language scope question with a recommended default and a one-sentence explanation of why it matters.
2. Ground first. Use local project context, user-provided context, or web research when it materially changes the ideas.
3. Generate before evaluating.
4. Use varied lenses:
   - pain and friction
   - removal or simplification
   - inversion
   - leverage and compounding
   - cross-domain analogy
   - constraint flip
5. Merge, dedupe, and combine overlapping ideas.
6. Reject weak ideas before presenting survivors.
7. Recommend what to develop next.
8. If a survivor becomes promising but still needs pressure testing, offer to shift into Discuss before planning or implementation.

## Warrants

Each serious idea needs a warrant:

- `direct`: local project evidence, user-provided context, docs, code, tracker item, shipped behavior, or explicit quote.
- `external`: named source, current web/source research, prior art, or known pattern.
- `reasoned`: written first-principles argument.

Reject ideas whose warrant does not support the move.

## Rejection Criteria

Reject ideas that are:

- vague
- not actionable
- duplicative of a stronger idea
- not grounded in context
- too expensive for likely value
- already covered by existing docs, plans, or workflows
- generic advice that ignores the project, workspace, or domain
- subject replacement rather than improvement

## Output

Present a ranked set of survivors. For each survivor include:

- what it is
- why it fits
- warrant
- tradeoffs
- risk or unknown
- recommended next step

Include a short rejected or parked-ideas summary when it helps the user trust the narrowing.

End with:

- **Open Questions**: unresolved questions, or `None`.
- **Recommended Next Step**: the exact next chat, artifact, plan, Discuss session, or implementation move.

Default to chat. Save only when `SKILL.md` says the selected direction or important rejected options need a durable artifact.
