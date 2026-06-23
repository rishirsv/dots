---
name: writing-style
description: "Use for Drafts style work: creating writing styles, ingesting samples, cleaning references, generating style guides, checking readiness or freshness, and explaining style provenance. Not for drafting content, standalone review, generic tone advice, or hidden Auto Style selection."
---

# Writing Style

Build and maintain writing styles as inspectable evidence, not as uninspectable
style inference. Use this skill after `drafts` routes style-profile, sample, or
voice readiness work here, or when the user explicitly invokes `writing-style`
for style setup, sample intake, or style readiness work.

Read [style-intake.md](../../references/style-intake.md) before accepting
samples or generating a guide. Read [provenance.md](../../references/provenance.md)
before reporting style usage or Auto Style behavior. Read
[state-model.md](../../references/state-model.md), especially its State
Authority section, for the difference between `style_reference`,
`workspace_sample`, `style_guide`, and `style_provenance`.

## Style Lifecycle

1. Create or select a `style`.
2. Ingest samples as `style_reference` or `workspace_sample`; do not blur the
   two.
3. Preserve raw source and cleaned text when possible.
4. Run quality checks for length, duplication, boilerplate, author consistency,
   source noise, and distinctiveness.
5. Record a few observable style patterns, such as sentence cadence,
   punctuation habits, opener repetition, paragraph shape, and avoidances.
6. Generate or update the `style_guide` only after recording sample quality.
7. Mark readiness, freshness, confidence, and warnings separately.
8. Surface warnings at runtime when style evidence is weak, stale,
   contaminated, duplicated, noisy, or too small.

## Observable Patterns

Use measurements as supporting evidence, not as a new profile object or scoring
system. The goal is to make the style guide less impressionistic.

Record only patterns that will change drafting or review:

- Sentence and paragraph cadence.
- Punctuation density.
- Repeated opener patterns.
- Channel layout habits.
- Recurring rhetorical moves.
- Terms, transitions, or structures to avoid.

If samples are all from one topic, channel, or source type, warn that topic or
format may be leaking into the guide.

## Auto Style

Auto Style must expose what it loaded. Use these provenance states:

- `auto_none`: no usable style evidence was selected.
- `auto_workspace_samples`: workspace-level samples influenced the draft.
- `auto_named_style`: a named style guide influenced the draft.
- `auto_combined`: named style and workspace samples both influenced the draft.
- `pinned_style`: the user explicitly selected a named style.

Do not report `style_used: null` or an equivalent vague placeholder when style
evidence affected output.

## Style Guide Requirements

A useful style guide should contain:

- Style summary.
- Voice rules and avoidances.
- Evidence list.
- Sample count and total word count.
- Observable style patterns.
- Freshness state.
- Confidence state.
- Warnings and invalidation reasons.

If the guide is based on insufficient evidence, report the limitation instead
of normalizing the style as ready.

## Output

Return:

- Style object created or updated.
- Samples accepted, rejected, or warned on.
- Observable style patterns recorded.
- Guide freshness and readiness.
- Confidence and contamination warnings.
- Runtime usage guidance for `writer`.
