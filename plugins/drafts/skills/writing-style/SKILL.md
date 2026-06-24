---
name: writing-style
description: "Use for Drafts style work: creating user writing styles, ingesting samples, cleaning references, generating style guides, checking guide freshness or confidence limits, and explaining style provenance. Not for drafting content, standalone review, generic tone advice, or hidden style selection."
---

# Writing Style

Build and maintain reusable user writing styles as inspectable evidence, not as
uninspectable style inference. Use this skill after `drafts` routes writing
style, sample, or voice work here, or when the user explicitly invokes
`writing-style` for style guide setup or sample handling.

Read [style-guide.md](../../references/style-guide.md) before accepting samples,
generating a guide, testing a guide, or reporting style confidence. Read
[style-library-sync.md](../../references/style-library-sync.md) before moving,
syncing, exporting, importing, or backing up a style library. Read
[provenance.md](../../references/provenance.md) before reporting style usage or
automatic style selection. Read
[state-model.md](../../references/state-model.md), especially its State
Authority and User Style Library sections, for style storage and lookup.

## Style Lifecycle

1. Create or select a user-global `style`.
2. Classify incoming material as style reference, workspace sample, Knowledge,
   source pack, or session-only context.
3. Extract authorship, channel, audience, relationship, thread context, intent,
   and cleaned user-authored text before deciding what guide the material can
   support.
4. For large or multi-context corpora, build a corpus map and split materially
   different contexts into separate concrete style guides.
5. Ingest accepted style samples as `style_reference` records for that named
   style.
6. Preserve raw, extracted, and cleaned text when safe and useful.
7. Run quality checks for length, duplication, boilerplate, author consistency,
   source noise, distinctiveness, channel coverage, relationship coverage, and
   contamination.
8. Generate or update `style.md` from accepted references and scoped user
   corrections.
9. Set guide status: `ready`, `stale`, `insufficient_evidence`, `contaminated`,
   or `failed`.
10. Test the guide when feasible and record confidence, freshness, warnings, and
   runtime handoff guidance.
11. Update the style library registry when persistent style state exists.
12. Surface warnings at runtime when a guide is weak, stale, contaminated,
   duplicated, noisy, too small, or only inferred through automatic selection.

## Style Library Sync

Use `DRAFTS_STYLE_HOME` as the narrow sync override for reusable styles when the
user wants the same style library across machines. Do not recommend syncing all
of `CODEX_HOME` for style guides.

Default to `guides_only` sync: `style.md` files plus `style-library.json`.
Include raw or cleaned references only after explicit user approval.

For import or sync conflicts, keep both style versions unless the user chooses
an overwrite. Do not merge style guides automatically.

## Observable Patterns

Use measurements as supporting evidence, not as a new style object or scoring
system. The goal is to make the style guide less impressionistic.

Record only patterns that will change drafting or review:

- Sentence and paragraph cadence.
- Punctuation density.
- Repeated opener patterns.
- Channel layout habits.
- Audience and relationship shifts.
- Recurring rhetorical moves.
- Terms, transitions, or structures to avoid.

If samples are all from one topic, channel, or source type, warn that topic or
format may be leaking into the guide.

If samples contain separable contexts such as flirting in text messages, close
friend chat, client email, peer collaboration, or coaching a junior teammate,
do not blend them into one guide. Propose or create separate style guides, and
mark thin clusters `insufficient_evidence`.

## Automatic Style Selection

Automatic style selection chooses a concrete style ID. It never writes an
`auto` placeholder as the style value.

For a new draft or section with no pinned style, choose from user-global styles
plus the shipped `default` style. Pick the guide that best matches the content,
channel, audience, relationship, and user request. If no user guide is a clear
fit, use `style: default`.

Workspace-local styles are considered only when the user explicitly asks to use
or consider project-specific style overrides. Changing an existing style value
requires user confirmation.

Report the selected style, one-line reason, and useful alternatives.

## Style Guide Requirements

A useful style guide should contain:

- A compact voice thesis.
- Guide status.
- Model control hints for `text.verbosity`, `reasoning.effort`, formatting
  density, rationale depth, clarification threshold, and validation rules.
- Personality and collaboration controls.
- Writer-native voice sections: sentence architecture, paragraph rhythm, point
  of view, punctuation, vocabulary, and tone.
- Relationship and channel adaptations.
- Do-not-do rules and safer substitutes.
- Inline example moves tied to voice rules and observable patterns.
- Fully worked examples when evidence supports them.
- Evidence list.
- Sample count and total word count.
- Audience and relationship contexts.
- Test results when feasible.
- Freshness notes.
- Confidence notes.
- Warnings and invalidation reasons.

If the guide is based on insufficient evidence, report the limitation instead
of hiding it. If the evidence appears mixed-author or noisy, set the guide
status to `contaminated` or ask before generating a reusable guide.

Inline examples make the guide usable at drafting time. Prefer short invented
or redacted examples that demonstrate the style move. Quote raw source text only
when it is public, already included in the style library, or explicitly approved
for reuse.

Write the guide as a concise voice manual, not a filled form. Prefer
outcome-first guidance: define the writing effect, the observable move, and the
example that teaches it. Avoid long process instructions unless the process
changes the final writing.

## Output

Return:

- Style object created or updated.
- Samples accepted, rejected, or warned on.
- Observable style patterns recorded.
- Guide freshness and confidence limits.
- Registry, sync, export, or import changes when relevant.
- Confidence and contamination warnings.
- Runtime usage guidance for `writer`.
