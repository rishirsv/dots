---
name: writing-voice
description: "Use for Drafts style work: creating user writing styles, reading samples, cleaning references, writing voice guides, checking guide limits, and explaining style use. Not for drafting content, standalone review, generic tone advice, or hidden style selection."
---

# Writing Voice

Build and maintain reusable user writing styles as inspectable evidence, not as
uninspectable style inference. Use this skill after `drafts` routes writing
style, sample, or voice work here, or when the user explicitly invokes
`writing-voice` for style guide setup or sample handling.

Read [style-guide.md](../../references/style-guide.md) before accepting samples,
generating a guide, testing a guide, or explaining style limits. Read
[style-library-sync.md](../../references/style-library-sync.md) before moving,
syncing, exporting, importing, or backing up a style library. Read
[provenance.md](../../references/provenance.md) before mentioning style usage or
automatic style selection. Read
[state-model.md](../../references/state-model.md), especially its State
Authority and User Style Library sections, for style storage and lookup.

## Building A Style

1. Create or select a user-global `style`.
2. Classify incoming material as style reference, workspace sample, Knowledge,
   draft context, or session-only context.
3. Extract authorship, channel, audience, relationship, thread context, intent,
   and cleaned user-authored text before deciding what guide the material can
   support.
4. For large or multi-context corpora, build a corpus map. Prefer one guide per
   channel family, with relationship and task differences expressed as modes.
   Split only when the modes contradict each other.
5. Ingest accepted style samples as `style_reference` records for that named
   style.
6. Preserve cleaned notes only when useful for future maintenance.
7. Run quality checks for length, duplication, boilerplate, author consistency,
   source noise, distinctiveness, channel coverage, relationship coverage, and
   contamination.
8. Generate or update `style.md` from accepted references and scoped user
   corrections.
9. Keep `style.md` as a voice manual: stable voice, rhythm, common moves, modes,
   examples, and guardrails.
10. Test the guide when feasible and record caveats or maintenance notes outside
   the guide body unless they change writing behavior.
11. Update the style library registry when persistent style state exists.
12. Surface warnings at runtime when a guide is weak, noisy, duplicated, too
   small, mixed-author, or only inferred through automatic selection.

## Moving Style Guides Between Machines

Use `DRAFTS_STYLE_HOME` as the narrow sync override for reusable styles when the
user wants the same style library across machines. Do not recommend syncing all
of `CODEX_HOME` for style guides.

Default to syncing only `style.md`, `notes.md` when present, and
`style-library.json`. Do not move sample corpora as part of ordinary guide sync.

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

If samples contain separable contexts such as close friend chat, client email,
peer collaboration, or coaching a junior teammate, first try to model the
difference as a mode inside the channel guide. Propose a separate guide only
when a mode would make the shared guide confusing. If a cluster is thin, say so
instead of inventing a confident mode.

## Choosing A Style

Automatic style selection chooses a concrete style ID. It never writes an
`auto` placeholder as the style value.

For a new draft or section with no pinned style, choose from user-global styles
plus the shipped `default` style. Pick the guide that best matches the content,
channel, audience, relationship, and user request. If no user guide is a clear
fit, use `style: default`.

Workspace-local styles are considered only when the user explicitly asks to use
or consider project-specific style overrides. Changing an existing style value
requires user confirmation.

Keep the selected style, one-line reason, and useful alternatives available for
handoff. Mention them only when they affect trust or future edits.

## What Makes A Guide Useful

A useful style guide should contain:

- A compact voice thesis.
- Stable voice: how the writing earns trust, shows warmth, handles uncertainty,
  and carries authority.
- Shape and rhythm: openings, paragraph length, sentence movement, list use,
  signoffs, and when structure helps.
- Common moves for the channel, such as requests, follow-ups, recommendations,
  critiques, updates, or escalations.
- Modes for audience, relationship, or task differences inside the channel.
- Good and bad examples tied to observable patterns.
- Guardrails: what not to imitate, invent, overfit, or carry across contexts.
- Notes or limits only when they change how the guide should be used.

If the guide is based on insufficient evidence, say so instead of hiding it. If
the evidence appears mixed-author or noisy, ask before generating a reusable
guide or keep the result as session-only guidance.

Inline examples make the guide usable at drafting time. Prefer short invented
or redacted examples that demonstrate the style move. Avoid examples so close
to source samples that the compose skill may copy them.

Write the guide as a compact but complete voice manual, not a filled form.
Prefer outcome-first guidance: define the writing effect, the observable move,
and the example that teaches it. Avoid process instructions unless the process
changes the final writing.

## What The User Sees

Lead with the useful style result: the new guide, the changed section, or the
decision about whether the evidence is strong enough to become a reusable
style.

After that, add only the notes the user needs to trust or use the guide:

- Which samples were accepted, rejected, or warned on.
- Observable patterns that will change drafting.
- Limits, caveats, contamination warnings, or mixed-author risks.
- Registry, sync, export, or import changes when those actually happened.
- The short handoff `compose` needs to use the guide well.

Do not turn style work into a category dump. Evidence and caveats matter here,
but they should read like practical guidance for future writing.
