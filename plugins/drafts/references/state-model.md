# Drafts State And Saved Work

Use this reference when creating, updating, or naming Drafts state.

## Where Saved Work Lives

Drafts v1 uses two durable locations:

- Project draft state lives in the current workspace under `.drafts/`.
- User writing styles live under
  `${DRAFTS_STYLE_HOME}` when set, otherwise
  `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

Before reading or writing state, detect whether the relevant location exists or
whether the user provided an explicit file path. Use the observed location and
its existing naming conventions.

Do not invent persistence paths, object IDs, or saved versions. When no durable
state location is available, return the artifact in chat or in the requested
file. Add one short note only when the user needs to know that the work was not
saved or versioned. Ask before creating `.drafts/` or the user style library
unless the user explicitly requests durable Drafts state or style-guide work.

Do not edit installed plugin cache files for user state. Shipped defaults are
runtime payload; user changes belong in the user state root or the current
workspace.

## Workspace Layout

Use a draft-centered layout. Recurring writing projects expose a simple standing
pad to the writing lane:

```text
.drafts/
  sessions/
  drafts/
    <draft-id>/
      draft.md
      pad.md
      brief.md
      contract.md
      sections/
        010-introduction.md
      versions/
        v001.md
      reviews/
        review-v001-quality.md
      sources/
        source-pack.md
  channel-recipes/
    <recipe-id>.md
```

`pad.md` is the visible standing pad when a recurring writing project needs
one. It should contain only:

```text
# Ideas bank

# Outline

# Draft
```

Raw fragments, messy notes, links, and voice transcripts belong in
`Ideas bank`. Usable clusters, argument order, claims, examples, and marked
assumptions belong in `Outline`. The selected working prose belongs in `Draft`.

Each draft owns its visible pad plus any internal brief, contract, sections,
versions, reviews, and source packs. Shared user styles do not live here by
default.

Do not add visible pad sections for style, archive context, questions,
decisions, source packs, versions, reviews, or provenance. Use side records for
those when durable state exists.

Workspace-local style overrides are allowed only when the user explicitly asks
for a project-specific override:

```text
.drafts/
  styles/
    <style-id>/
      style.md
      references/
```

When such an override is used, say so.

## User Style Library

Store reusable user styles in the resolved user style library root:

```text
<style-library-root>/
  style-library.json
  <style-id>/
    style.md
    references/
      001-sample.md
```

`<style-library-root>` is `DRAFTS_STYLE_HOME` when set, otherwise
`${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`. Use
`DRAFTS_STYLE_HOME` only for Drafts styles; do not use `CODEX_HOME` as a broad
sync mechanism for style guides.

The shipped `default` style is the read-only fallback asset at
`assets/styles/default/style.md`. A user-customized `default` style, if any,
lives in the user style library.

Maintain `style-library.json` as the inspectable index for user styles. Keep it
to lookup and routing fields such as ID, title, channel, path, modes, aliases,
notes path, and optional update time.

Style lookup order:

1. Explicit workspace override.
2. User-global style.
3. Shipped `default` style.

Automatic style selection considers user-global style guides plus the shipped
default. Workspace style overrides are considered only when the user explicitly
asks to use or consider project-specific styles. It must write the concrete
selected style ID, such as `style: default` or `style: report`, never an `auto`
placeholder.

Changing the `style` field on an existing draft requires user confirmation.

## Frontmatter

Use small YAML frontmatter on Markdown artifacts. Keep durable metadata readable
and avoid turning frontmatter into a database.

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

Rules do not belong in frontmatter. Sources belong at the draft level unless a
specific section truly has separate source constraints.

## Working Pieces

| Object | Purpose |
| --- | --- |
| `workspace` | Current project folder that may contain `.drafts/` |
| `session` | Continuing writing conversation and decision history |
| `standing_pad` | Visible three-section project surface: Ideas bank, Outline, Draft |
| `writing_brief` | Structured user intent before planning |
| `document_contract` | Executable plan for substantial writing |
| `draft` | User-facing writing artifact |
| `section` | One Markdown section or chapter that can be compiled into a draft |
| `draft_version` | Saved revision of a draft |
| `style` | Named voice guide |
| `style_reference` | Sample attached to a named style |
| `style_guide` | Generated voice manual with instructions, modes, examples, and guardrails |
| `channel_recipe` | Reusable destination or format recipe |
| `source_pack` | Draft-level source context |
| `review_pass` | Version-tied critique and findings |
| `rewrite_run` | Fast transformation of existing text, durable only when tied to a draft version |

Writing rules are resolved from AGENTS.md plus explicit session or draft
instructions; they are not a `.drafts/` state object.

## Chat-Only Versus Saved Writing

New writing may create or update durable state when the user asks for a
recurring project, an existing draft, persistence, or a file edit. Otherwise,
return chat-only output without claiming a saved state object.

Rewriting is chat-only by default when the user pastes text. It becomes
durable when it revises a selected `draft_version`, updates `pad.md`, creates a
new version, or the user explicitly asks to save the rewrite.

When `Draft` asks context questions, store useful answers in `Outline` when a
standing pad exists. Do not create a visible `Brief` section. Internal
`writing_brief`, `document_contract`, or `clarification_state` records are
allowed only when the state location exists or the user has approved durable
Drafts state.

## Plan Before Section Work

Use `writing_brief` for intent:

- Audience.
- Purpose.
- Format.
- Scope.
- Voice mode.
- Source constraints.
- Success criteria.
- Call to action.
- Open questions.
- Assumptions.

Use `document_contract` for execution:

- Title or working thesis.
- Outline.
- Section goals.
- Length target.
- Source plan.
- Quality bar.
- Review criteria.
- Section status.
- Decisions and unresolved assumptions.

## Draft Versions

Create or describe a new `draft_version` for material changes:

- New draft.
- Section expansion.
- Targeted revision.
- Review fixes.
- Restore.
- Channel variant source update.

A `channel_variant` should usually be a separate `draft` linked to its source
draft and source version.

## Style Guides And Evidence

Keep these distinct:

- `style`: the selected style ID, stored in draft or section frontmatter.
- `style_reference`: evidence for a named user style.
- `style_guide`: the `style.md` instructions generated or updated from
  accepted references and user corrections.
- `style_provenance`: private working context for which style was selected and
  why.

Style identity and guide usefulness are separate. A style can exist while the
evidence is thin, mixed, stale, or noisy. Put limitations in `style.md` only
when they change drafting behavior; otherwise keep them in maintenance notes or
a brief handoff note.

For multi-context corpora, prefer one concrete style ID per channel family with
modes for relationship or task differences. Split into multiple style IDs only
when one guide would make contradictory voice instructions, such as mixing
intimate text messages with formal client email.

## Channel Recipes

Keep channel recipes separate from style guides. A `channel_recipe` sets output
shape, destination, platform constraints, CTA patterns, and validation checks.
A style guide supplies the voice overlay inside that recipe.

Built-in channel recipes are plugin assets. Workspace-local overrides may live
under `.drafts/channel-recipes/` when the user explicitly wants project-specific
recipes.
