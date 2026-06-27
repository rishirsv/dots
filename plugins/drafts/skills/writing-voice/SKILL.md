---
name: writing-voice
description: "Use for Drafts style work: creating personal or brand writing styles, reading samples, cleaning references, writing voice guides, managing style sync, and explaining style selection. Not for drafting content, generic tone advice, or hidden style selection."
---

# Writing Voice

Help the user turn samples, corrections, or brand guidance into practical voice
guidance for writing. Start with the smallest useful result: a quick voice
read, a rewrite direction, or a light guide. Save durable style guides
only when the user asks to reuse, name, sync, or maintain the style.

Use this skill after `drafts` routes writing style, sample, or voice work here,
or when the user explicitly invokes `writing-voice` for style guide setup or
sample handling.

Read [style-guide.md](references/style-guide.md), starting with `Start Light`,
before accepting samples, generating or updating a guide, extracting repeated
choices, writing reference records, or checking a guide against a draft.
Use [style.md](assets/style.md) as the guide template and
[email-style.md](examples/email-style.md) and
[brand-style.md](examples/brand-style.md) as fully baked examples. Read
[state.md](../../references/state.md) before moving, syncing, exporting,
importing, or backing up a style library, and before mentioning style storage,
lookup, automatic style selection, or state changes.

## Building A Style

Choose the path that matches the user's actual need:

- Quick voice read: identify the useful patterns in the supplied text, keep the
  result session-only, and do not create style files.
- First-run "sound like me": ask for 2-3 things the user wrote in roughly this
  context, or offer a non-personalized humanize pass now. With one or a few
  direct samples, produce a useful provisional read or rewrite first. Keep the
  reusable guide modest and store sample detail in `references/`, not in
  `style.md`.
- Reusable guide: create or update durable style state only when the user asks
  to save, reuse, name, sync, or maintain the style.
- Brand or house guide: separate voice from house mechanics, terms, entity
  names, claims, locale, and channel rules before writing the guide.
- Refresh or check: use corrections and rejected outputs to update the guide.
  Promote only reusable guidance into `style.md`.

For every path, keep these boundaries:

- User-authored samples and scoped corrections can inform personal voice.
- Admired writing can shape an aspirational target, but it does not prove the
  user's current voice.
- Brand guidelines, editorial rules, terminology, and claims controls are house
  overlays, not personal voice.
- Current-task context supplies content; it is not voice evidence.
- Weak, duplicated, noisy, mixed-author, or automatic material belongs in a
  session-only read or a reference note until the user chooses durable guidance.

## Style Sync

Use `DRAFTS_STYLE_HOME` only as a narrow override for the reusable style
library. Do not recommend syncing all of `CODEX_HOME` for style guides.

For ordinary style sync, export, import, or backup, include `style.md`,
`style-library.json`, and selected `references/`. Do not include unrelated
sample corpora, raw archives, or maintenance material unless the user asks for
those explicitly.

For import or sync conflicts, keep both style versions unless the user chooses
an overwrite. Do not merge style guides automatically.

## Guide Creation

Use [style-guide.md](references/style-guide.md) for the extraction method,
guide spine, and placement rules. Do not restate that spine here. When creating
durable guidance, write reusable voice instructions to `style.md` and put
sample/source detail in `references/`.

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
handoff. Mention them only when they affect future edits.

## What The User Sees

Lead with the useful style result: the new guide, the changed section, or the
decision to keep the work session-only.

After that, add only the notes the user needs for the next step:

- Which samples became reference records, when durable state changed.
- Observable patterns that changed the guide.
- Caveats or mixed-author warnings when they change whether the work should stay
  session-only.
- Registry, sync, export, or import changes when those actually happened.
- The selected style ID, mode, or relevant reference detail `compose` needs for
  the next draft.

Do not turn style work into a category dump. Keep source handling out of
`style.md`; summarize it in chat or reference records only when it changes the
next move.
