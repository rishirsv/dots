# Style Intake

Use this reference before accepting samples or generating a style guide.

## Intake Stages

1. Preserve raw source.
2. Extract useful authored text.
3. Clean boilerplate, navigation, comments, ads, cookie text, and unrelated UI.
4. Classify sample ownership as `style_reference` or `workspace_sample`.
5. Run quality checks.
6. Record only observable style patterns that will change drafting or review.
7. Record approval, warnings, and rejection reasons.
8. Generate or update the `style_guide`.

## Quality Checks

Check:

- Word count.
- Duplicate or near-duplicate content.
- Boilerplate and source noise.
- Author consistency.
- Mixed-author contamination.
- Topic narrowness.
- Distinctiveness.
- Permission or privacy concerns when relevant.

Approval should not mean "high-quality style evidence." Keep approval,
readiness, freshness, and confidence separate.

## Observable Style Patterns

Measure only what helps the agent write or review better. Prefer simple,
explainable observations:

- Sentence and paragraph cadence.
- Repeated opener patterns.
- Punctuation habits.
- Channel layout habits.
- Recurring rhetorical moves.
- Terms, transitions, or structures to avoid.

## Topic And Genre Leakage

Watch for style guides that learn topic instead of voice. Separate:

- Stable voice features.
- Domain vocabulary.
- Channel conventions.
- One-off topic terms.
- Publication or brand requirements.

When samples come mostly from one topic, channel, or source type, lower
confidence and warn that the profile may be learning topical vocabulary instead
of voice.

Do not compare a short social post directly against a long essay without
channel context.

## Readiness Signals

Use these states:

- `not_enough_evidence`.
- `weak_evidence`.
- `ready_with_warnings`.
- `ready`.
- `stale`.
- `contaminated`.

Do not mark a tiny, duplicate, noisy, or mixed-author sample set as cleanly
ready without warnings.

## Style Guide Content

A style guide should include:

- Summary.
- Voice rules.
- Structure tendencies.
- Vocabulary and rhythm notes.
- Avoidances.
- Example evidence.
- Observable style patterns.
- Confidence state.
- Freshness state.
- Warnings.

## Runtime Handoff

When handing style context to `writer`, include:

- Style mode.
- Selected style or sample set.
- Relevant examples for the requested channel or task.
- Confidence.
- Warnings.
- Whether the style should influence voice only, structure, vocabulary, or
  content selection.
