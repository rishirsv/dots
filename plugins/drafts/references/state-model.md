# State Model

Use this reference when creating, updating, or naming Drafts state.

## State Authority

Drafts v1 uses two durable locations:

- Project draft state lives in the current workspace under `.drafts/`.
- User writing styles live under
  `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

Before reading or writing state, detect whether the relevant location exists or
whether the user provided an explicit file path. Use the observed location and
its existing naming conventions.

Do not invent persistence paths, object IDs, or saved versions. When no durable
state location is available, return the artifact in chat or in the requested
file and describe the version boundary, provenance, and assumptions instead of
claiming that state was saved. Ask before creating `.drafts/` or the user style
library unless the user explicitly requests durable Drafts state or style
intake.

Do not edit installed plugin cache files for user state. Shipped defaults are
runtime payload; user changes belong in the user state root or the current
workspace.

## Workspace Layout

Use a draft-centered layout:

```text
.drafts/
  sessions/
  drafts/
    <draft-id>/
      draft.md
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
```

Each draft owns its brief, contract, sections, versions, reviews, and source
packs. Shared user styles do not live here by default.

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

Store reusable user styles in:

```text
${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/
  <style-id>/
    style.md
    references/
      001-sample.md
```

The shipped `default` style is the read-only fallback asset at
`assets/styles/default/style.md`. A user-customized `default` style, if any,
lives in the user style library.

Style lookup order:

1. Explicit workspace override.
2. User-global style.
3. Shipped `default` style.

Auto Style considers user-global styles plus the shipped default. Workspace
style overrides are considered only when the user explicitly asks to use or
consider project-specific styles. Auto Style must write the concrete selected
style ID, such as `style: default` or `style: report`, never an auto
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

## Core Objects

| Object | Purpose |
| --- | --- |
| `workspace` | Current project folder that may contain `.drafts/` |
| `session` | Continuing writing conversation and decision history |
| `writing_brief` | Structured user intent before planning |
| `document_contract` | Executable plan for substantial writing |
| `draft` | User-facing writing artifact |
| `section` | One Markdown section or chapter that can be compiled into a draft |
| `draft_version` | Saved revision of a draft |
| `style` | Named voice profile |
| `style_reference` | Sample attached to a named style |
| `style_guide` | Generated style instructions, evidence, freshness, and warnings |
| `channel_recipe` | Reusable destination or format recipe |
| `source_pack` | Draft-level source context |
| `review_pass` | Version-tied critique and findings |

Writing rules are resolved from AGENTS.md plus explicit session or draft
instructions; they are not a `.drafts/` state object.

## Brief Before Contract

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

## Style State

Keep these distinct:

- `style`: the selected style ID, stored in draft or section frontmatter.
- `style_reference`: evidence for a named user style.
- `style_guide`: the `style.md` instructions generated or updated from
  evidence and user edits.
- `style_provenance`: runtime trace of which style was selected and why.

Styles do not have a status field. Put evidence limits, confidence, freshness,
and contamination warnings in the style guide body.
