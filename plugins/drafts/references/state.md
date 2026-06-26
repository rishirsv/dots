# Drafts State

Use this reference when Drafts creates, updates, syncs, reviews, versions, or
explains durable writing state.

State exists for continuity, trust, and revision safety. It should stay in the
background while the user is writing. The default response is the artifact:
draft, rewrite, plan, review, or style guide. Mention state only when it affects
trust, persistence, version safety, or the user's next decision.

## Durable Locations

Drafts uses two durable locations:

- Project draft state lives in the current workspace under `.drafts/`.
- Reusable user styles live under `DRAFTS_STYLE_HOME` when set, otherwise
  `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

Before reading or writing state, detect whether the relevant location exists or
whether the user provided an explicit path. Use observed paths and existing
naming conventions.

Do not invent persistence paths, object IDs, saved versions, style libraries,
or workspace overrides. Ask before creating `.drafts/` or the user style
library unless the user explicitly requests durable Drafts state, a file edit,
a reusable style guide, or style-library sync.

Do not edit installed plugin cache files for user state. Shipped defaults belong
to the package. User changes belong in the user state root or current workspace.

## Project State

Use a draft-centered layout with as few durable files as the work needs:

```text
.drafts/
  sessions/
  drafts/
    <draft-id>/
      context.md
      plan.md
      draft.md
      versions/
        v001.md
      reviews/
        review-v001-quality.md
      variants/
        010-contrarian-opening.md
      sections/
        010-introduction.md
  channel-recipes/
    <recipe-id>.md
```

`context.md` is the raw pile and working memory for the piece: fragments, notes,
links, transcript excerpts, source notes, examples, reader assumptions,
candidate directions, language worth preserving, unanswered questions, and
unresolved choices. Use it to close the gap between what the user knows and what
Drafts knows. Do not force early material into an outline or draft. A new
writing project may have only `context.md` for a while.

`plan.md` is the collaborative outline once the user and Drafts have a direction
worth shaping. It can include working title options, accepted direction,
rejected or parked directions, reader spine, grounding path, section purposes,
section status, assumptions, source or example slots, format, length, and next
decisions. Keep updating it as the user reacts; the first outline is not final.

`draft.md` is the current working prose. Create it only after the user has asked
for direct prose, accepted a working outline, or explicitly asked to
`draft anyway`. For short and medium pieces, keep the draft in one file. Use
`sections/` when the piece is too large to revise comfortably as one document,
or when section-by-section co-authoring would make the work easier.

Each draft owns its context, plan, draft, versions, reviews, and optional
sections. Shared user styles do not live in a draft folder by default.

Workspace-local style overrides are allowed only when the user explicitly asks
for a project-specific override:

```text
.drafts/
  styles/
    <style-id>/
      style.md
      references/
```

When such an override is used, say so briefly if it affects trust or future
edits.

## User Style Library

Reusable user styles live in the resolved user style library root:

```text
<style-library-root>/
  style-library.json
  <style-id>/
    style.md
    references/
```

`style.md` is the standalone voice manual. `references/` holds accepted
reference records for reusable styles: samples, corrections, and source evidence
that support the guide. Each reference record is a self-contained Markdown file,
not a required companion to `style.md`:

```text
references/
  <yyyymmdd>-<short-title>.md
```

Use each reference record for cleaned sample text, source quality, reusable voice
evidence, stylometric observations, caveats, representative examples, and
correction history tied to that sample or correction. Do not create generic
auxiliary files, aggregate evidence files, evidence audits, extraction ledgers,
source maps, holdout ledgers, or other maintenance surfaces. The durable style
library is `style.md`, `references/`, and `style-library.json`.

Resolve the root in this order:

1. Explicit path supplied by the user for the current operation.
2. `DRAFTS_STYLE_HOME`, when set.
3. `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

If `DRAFTS_STYLE_HOME` is set, treat it as the style library root itself, not as
a parent folder. Do not recommend syncing all of `CODEX_HOME` just to move
Drafts styles.

The shipped `default` style is the read-only general style at
`styles/default.md`. A user-customized `default` style, if any, lives in the
user style library.

Maintain `style-library.json` when the style library exists or changes. Keep it
minimal and inspectable:

```json
{
  "styles": [
    {
      "id": "email-rishi",
      "title": "Rishi Email Style",
      "channel": "email",
      "path": "email-rishi/style.md"
    }
  ]
}
```

Do not put technical bookkeeping, model settings, counts, sample corpora, or
maintenance details in the guide. Keep the registry to lookup fields unless
routing behavior explicitly needs more. Modes belong inside the style guide.
Aliases need an explicit resolution rule before they belong in the registry.

Style lookup order:

1. Explicit workspace override.
2. User-global style.
3. Shipped `default` style.

Automatic style selection chooses and stores a concrete style ID, such as
`style: default` or `style: report`. It never stores an `auto` placeholder.
Changing the `style` field on an existing draft requires user confirmation.

## Style Sync

Ordinary style sync, backup, export, or import copies:

- `style-library.json`
- each selected `style.md`
- selected `references/` for reusable styles

Do not infer approval to sync unrelated source corpora from a general request to
"sync my styles." References that belong to the selected style are part of the
style library; unrelated archives, message exports, and raw source folders are
not.

When exporting a style library, create a bundle rather than a loose folder copy:

```text
drafts-style-library/
  manifest.json
  style-library.json
  styles/
    <style-id>/
      style.md
      references/
```

Before importing, read `manifest.json` and `style-library.json` when present.
List style IDs, titles, channels, and style paths. Ask before
overwriting any existing style ID. Import unknown styles directly. For conflicts,
keep both versions unless the user explicitly chooses an overwrite.

Conflict-safe names may use:

```text
<style-id>-imported-<yyyymmdd>
```

After sync, export, import, or root changes, report only what matters:
resolved library root, styles included, reference records included, and
conflicts created or resolved.

## Markdown Metadata

Use small YAML metadata blocks on Markdown artifacts. Keep durable metadata
readable and avoid turning it into a database.

Section example:

```yaml
---
id: sec_intro
title: Introduction
draft: client-memo
version: first-draft
style: report
order: 10
---
```

Review example:

```yaml
---
id: quality-review
title: Quality Review
draft: client-memo
version: first-draft
---
```

Rules do not belong in artifact metadata. Rules come from AGENTS.md and explicit
user instructions. Sources are draft-level by default. Record them once in
`context.md` instead of repeating source lists in every section.

## Working Pieces

| Piece | Purpose |
| --- | --- |
| Workspace | Current project folder that may contain `.drafts/` |
| Session | Continuing writing conversation and decision history |
| Context | Raw pile: fragments, notes, sources, reader assumptions, open questions, and unresolved choices |
| Plan | Promoted shape: title options, core argument, reader spine, grounding path, structure, source/example slots, and next decisions |
| Draft | User-facing writing artifact |
| Variant | Sibling candidate with a real editorial difference from the working draft |
| Section | One Markdown section or chapter that can be compiled into a draft |
| Draft version | Saved revision of a draft |
| Style | Concrete selected voice guide ID |
| Style reference | Self-contained sample or correction record attached to a named style |
| Style guide | Voice manual with instructions, modes, examples, and guardrails |
| Style evidence | Repeated-choice evidence captured in reference records or promoted into a style guide |
| Channel recipe | Reusable destination or format recipe |
| Saved review | Review tied to a draft version |
| Rewrite | Fast transformation of existing text, durable only when tied to a draft version |

The style terms intentionally describe different layers:

- Style is the selected identifier, such as `default` or a user style ID. It is
  the pointer saved with the draft or section.
- A style reference is source evidence for a named style: user-authored samples,
  corrections, or explicitly aspirational examples. For reusable styles, it
  lives as a self-contained record under `references/`. It is input to guide
  creation, not a voice guide by itself.
- A style guide is the standalone `style.md` voice manual generated from
  accepted references and corrections. It tells Compose and Review how to write
  or judge voice.
- Style evidence is the observed repeated-choice analysis behind the guide:
  cadence, punctuation, pronouns, openers, transitions, structures,
  anti-patterns, and drafting implications. Capture it inside the relevant
  reference record or promote the drafting implication into `style.md`; do not
  create a separate evidence surface by default.

Writing rules are resolved from AGENTS.md plus explicit session or draft
instructions. They are not a `.drafts/` state object.

## Chat-Only Versus Saved

New writing may create or update durable state when the user asks for a
recurring project, an existing draft, persistence, or a file edit. Otherwise,
return chat-only output without claiming a saved state object.

Rewriting is chat-only by default when the user pastes text. It becomes durable
when it revises a selected draft version, updates `draft.md`, creates a new
version, or the user explicitly asks to save the rewrite.

When durable state exists, store useful context answers, fragments, source
notes, and possible directions in `context.md`. Promote material into `plan.md`
as a working outline once the user and Drafts are shaping a direction together.
Create `draft.md` only after the user has asked for prose, accepted a working
outline, or explicitly chosen `draft anyway`.

Create or describe a new draft version for material changes:

- New draft.
- Section expansion.
- Targeted revision.
- Review fixes.
- Restore.
- Channel variant source update.

A channel variant should usually be a separate draft linked to its source draft
and source version. Angle, opening, structure, audience, and voice variants may
live under `variants/` while the user is choosing; the chosen candidate becomes
the working `draft.md`. Minor wording changes to one candidate are versions,
not variants.

## Saved Reviews

A saved review must target a specific draft version. If no version is
available, label the result as one-off advice and ask whether to create or
select a version when saved review matters.

Before reviewing, load or identify:

- draft
- draft version
- `context`, when available
- `plan`, when available
- channel recipe or intended destination
- applicable AGENTS.md guidance and explicit instructions
- selected concrete style ID and style guide
- draft-level source material from `context.md`, if it exists
- the kind of review the user asked for, and any rubric

Each issue should have severity, location, evidence, why it matters, and a
recommended fix. Order issues by impact on the next draft.

If the user asks for scoring, keep it inside the saved review rather than
creating a separate state object. Name the rubric, criteria, scores, rationale,
evidence, confidence, and version reviewed.

When a review becomes a revision, preserve lineage:

```text
reviewed draft version
-> saved review
-> selected issues
-> revision priorities
-> new draft version
```

Do not overwrite the reviewed version.

## User-Facing State Notes

Keep state details out of ordinary writing replies, with one exception: announce
durable state at the first transition. The first time a session makes Drafts
state durable — creating `.drafts/`, a draft, a version, a section, a style, or
a style library, or editing a file the user named — say so in one plain line
that includes the path. This way the user is never silently committed to disk.

After that first announcement, keep later saves in the same session silent
unless a save is risky: an overwrite, a destructive change, a new durable
location, or a version-safety concern. Surface those, and otherwise let the
artifact stand on its own.

Beyond the first-transition announcement, add one short natural-language note
after the writing only when the user needs it to understand trust, persistence,
or a material assumption:

```text
I treated this as a humanize pass, not a personal voice match.
```

```text
I used `email-rishi` and assumed this is for an internal peer.
```

```text
I did not save this as Drafts state.
```

```text
I revised this from v001 and would save it as a new version before overwriting
anything.
```

If the user asks how Drafts worked, explain the relevant route, style, source,
rule, or version detail directly. Treat that as an answer to the user's
question, not a standing response shape.
