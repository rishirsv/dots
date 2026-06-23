---
name: writing-style
description: "Use for Drafts style work: creating user writing styles, ingesting samples, cleaning references, generating style guides, checking freshness or evidence limits, and explaining style provenance. Not for drafting content, standalone review, generic tone advice, or hidden Auto Style selection."
---

# Writing Style

Build and maintain reusable user writing styles as inspectable evidence, not as
uninspectable style inference. Use this skill after `drafts` routes writing
style, sample, or voice work here, or when the user explicitly invokes
`writing-style` for style setup or sample intake.

Read [style-intake.md](../../references/style-intake.md) before accepting
samples or generating a guide. Read [provenance.md](../../references/provenance.md)
before reporting style usage or Auto Style behavior. Read
[state-model.md](../../references/state-model.md), especially its State
Authority and User Style Library sections, for style storage and lookup.

## Style Lifecycle

1. Create or select a user-global `style`.
2. Ingest samples as `style_reference` evidence for that named style.
3. Preserve raw source and cleaned text when possible.
4. Run quality checks for length, duplication, boilerplate, author consistency,
   source noise, and distinctiveness.
5. Record a few observable style patterns, such as sentence cadence,
   punctuation habits, opener repetition, paragraph shape, and avoidances.
6. Update `style.md` sections in place after recording sample quality.
7. Keep confidence, freshness, and warnings in the style guide body.
8. Surface warnings at runtime when style evidence is weak, stale,
   contaminated, duplicated, noisy, or too small.

## Observable Patterns

Use measurements as supporting evidence, not as a new style object or scoring
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

Auto Style chooses a concrete style ID. It never writes an auto placeholder as
the style value.

For a new draft or section with no pinned style, choose from user-global styles
plus shipped `default`, then write the selected ID, such as `style: default` or
`style: report`, when durable frontmatter is being created.

Workspace-local styles are considered only when the user explicitly asks to use
or consider project-specific style overrides. Changing an existing style value
requires user confirmation.

Report the selected style, one-line reason, and useful alternatives.

## Style Guide Requirements

A useful style guide should contain:

- Style summary.
- Voice rules and avoidances.
- Evidence list.
- Sample count and total word count.
- Observable style patterns.
- Freshness notes.
- Confidence notes.
- Warnings and invalidation reasons.

If the guide is based on insufficient evidence, report the limitation instead
of hiding it. Do not use a lifecycle field.

## Output

Return:

- Style object created or updated.
- Samples accepted, rejected, or warned on.
- Observable style patterns recorded.
- Guide freshness and evidence limits.
- Confidence and contamination warnings.
- Runtime usage guidance for `writer`.
