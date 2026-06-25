# Drafts State

Use this reference when Drafts creates, updates, syncs, reviews, versions, or
explains durable writing state.

State exists for continuity, trust, and revision safety. It should stay in the
background while the user is writing. The default response is the artifact:
draft, rewrite, plan, review, or style guide. Mention state only when it affects
trust, persistence, version safety, or the user's next decision.

## Durable Locations

Drafts v1 uses two durable locations:

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

Do not edit installed plugin cache files for user state. Shipped defaults are
runtime payload. User changes belong in the user state root or current
workspace.

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

`context.md` is the raw pile and working memory for the piece: fragments,
notes, links, transcript excerpts, source notes, examples, reader assumptions,
unanswered questions, and unresolved choices. Use it to close the gap between
what the user knows and what Drafts knows. Do not force early material into an
outline or draft. A new writing project may have only `context.md` for a while.

`plan.md` is the promoted shape once the piece has a recognizable reader, core
argument, and likely structure. It can include working titles, the core
argument, reader spine, grounding path, assumptions, proposed structure, source
or example slots, format, length, and next decisions.

`draft.md` is the current working prose. Create it only after the context pass
has produced enough context to write without guessing at the point, reader, or
supporting material, or after the user explicitly asks to `draft anyway`. For
short and medium pieces, keep the draft in one file. Use `sections/` only when
the piece is too large to revise comfortably as one document or the user
explicitly wants section files.

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

`style.md` is the runtime voice manual. `references/` holds accepted
`style_reference` records when the user explicitly creates a reusable style
library and wants the underlying evidence preserved. Each reference record is a
self-contained Markdown file, not a required companion to `style.md`:

```text
references/
  <yyyymmdd>-<short-title>.md
```

Use each reference record for cleaned sample text, source quality, reusable voice
evidence, stylometric observations, caveats, and correction history tied to that
sample or correction. Do not create generic auxiliary files, aggregate evidence
files, corpus maps, holdout ledgers, or other maintenance surfaces unless the
product model explicitly defines them. Do not sync or export references unless
the user explicitly asks.

Resolve the root in this order:

1. Explicit path supplied by the user for the current operation.
2. `DRAFTS_STYLE_HOME`, when set.
3. `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

If `DRAFTS_STYLE_HOME` is set, treat it as the style library root itself, not as
a parent folder. Do not recommend syncing all of `CODEX_HOME` just to move
Drafts styles.

The shipped `default` style is the read-only fallback at `styles/default.md`. A
user-customized `default` style, if any, lives in the user style library.

Maintain `style-library.json` when the style library exists or changes. Keep it
minimal and inspectable:

```json
{
  "schema": "drafts/v1",
  "kind": "style_library",
  "updated_at": "",
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

Do not put lifecycle fields, model settings, counts, source hashes, generated
timestamps, or sample corpora in the runtime guide. Keep the registry to lookup
fields unless routing behavior explicitly needs more. Modes belong inside the
runtime style guide. Aliases require an explicit resolution or migration contract
before they belong in the registry.

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

Do not infer approval to sync sample corpora from a general request to "sync my
styles." If the user explicitly asks to export or move references, treat that as
a separate operation and state what will be included before copying.

When exporting a style library, create a bundle rather than a loose folder copy:

```text
drafts-style-library/
  manifest.json
  style-library.json
  styles/
    <style-id>/
      style.md
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
resolved library root, styles included, reference records included only when
explicitly requested, and conflicts created or resolved.

## Frontmatter

Use small YAML frontmatter on Markdown artifacts. Keep durable metadata
readable and avoid turning frontmatter into a database.

Section example:

```yaml
---
schema: drafts/v1
kind: section
id: sec_intro
title: Introduction
draft: client-memo
version: v001
style: report
order: 10
---
```

Review example:

```yaml
---
schema: drafts/v1
kind: review_pass
id: review_v001_quality
title: Quality Review
draft: client-memo
version: v001
---
```

Rules do not belong in frontmatter. Rules come from AGENTS.md and explicit user
instructions. Sources are draft-level by default. Record them once in
`context.md` instead of repeating source lists in every section.

## Working Pieces

| Object | Purpose |
| --- | --- |
| `workspace` | Current project folder that may contain `.drafts/` |
| `session` | Continuing writing conversation and decision history |
| `context` | Raw pile: fragments, notes, sources, reader assumptions, open questions, and unresolved choices |
| `plan` | Promoted shape: title options, core argument, reader spine, grounding path, structure, source/example slots, and next decisions |
| `draft` | User-facing writing artifact |
| `variant` | Sibling candidate with a real editorial difference from the working draft |
| `section` | One Markdown section or chapter that can be compiled into a draft |
| `draft_version` | Saved revision of a draft |
| `style` | Concrete selected voice guide ID |
| `style_reference` | Self-contained sample or correction record attached to a named style |
| `style_guide` | Generated voice manual with instructions, modes, examples, and guardrails |
| `stylometric_evidence` | Repeated-choice evidence captured in reference records or promoted into a style guide |
| `channel_recipe` | Reusable destination or format recipe |
| `review_pass` | Saved review tied to a draft version |
| `rewrite_run` | Fast transformation of existing text, durable only when tied to a draft version |

The style terms intentionally describe different layers:

- `style` is the selected identifier, such as `default` or a user style ID. It
  is the pointer saved in frontmatter or state.
- `style_reference` is source evidence for a named style: user-authored samples,
  corrections, or explicitly aspirational examples. It lives as a
  self-contained record under `references/` only when the user wants durable
  evidence preserved. It is input to guide creation, not a voice guide by itself.
- `style_guide` is the standalone runtime `style.md` voice manual generated
  from accepted references and corrections. It tells Compose and Review how to
  write or judge voice.
- `stylometric_evidence` is the observed repeated-choice analysis behind the
  guide: cadence, punctuation, pronouns, openers, transitions, structures,
  anti-patterns, and drafting implications. Capture it inside the relevant
  `style_reference` record or promote the drafting implication into `style.md`;
  do not create a separate evidence surface by default.

Writing rules are resolved from AGENTS.md plus explicit session or draft
instructions. They are not a `.drafts/` state object.

## Chat-Only Versus Saved

New writing may create or update durable state when the user asks for a
recurring project, an existing draft, persistence, or a file edit. Otherwise,
return chat-only output without claiming a saved state object.

Rewriting is chat-only by default when the user pastes text. It becomes durable
when it revises a selected `draft_version`, updates `draft.md`, creates a new
version, or the user explicitly asks to save the rewrite.

When durable state exists, store useful context answers in `context.md`.
Promote material into `plan.md` only when the reader, core argument, and likely
shape are clear enough to guide the piece. Create `draft.md` only after the user
has asked for prose, accepted a direction, or explicitly chosen `draft anyway`.

Create or describe a new `draft_version` for material changes:

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

A saved review must target a specific `draft_version`. If no version is
available, label the result as one-off advice and ask whether to create or
select a version when saved review matters.

Before reviewing, load or identify:

- `draft`
- `draft_version`
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
draft_version reviewed
-> saved review
-> selected issues
-> revision priorities
-> new draft_version
```

Do not overwrite the reviewed version.

## User-Facing State Notes

Keep state details out of ordinary writing replies. Add one short
natural-language note after the writing only when the user needs it to
understand trust, persistence, or a material assumption:

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
