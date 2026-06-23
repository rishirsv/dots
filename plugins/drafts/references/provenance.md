# Provenance

Use this reference before reporting generated, revised, transformed, styled, or
reviewed work.

## Purpose

Drafts v1 provenance optimizes for revision traceability. It should answer:

- What artifact changed?
- What version did it come from?
- Which concrete style was used?
- Which draft-level source pack was used?
- Which AGENTS.md guidance and explicit instructions were applied?
- Which review, if any, drove the change?

Prefer small frontmatter plus a compact report. Do not build a separate
provenance database in v1.

## Frontmatter

Use frontmatter for stable identity and version lineage:

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

Do not store rules in frontmatter. Rules come from AGENTS.md and explicit user
instructions.

Sources are draft-level by default. Record them once in the draft's source pack
instead of repeating source lists in every section.

## Style Provenance

The durable value is the concrete selected style ID, such as `style: default` or
`style: report`.

Auto Style is a selection behavior, not a stored style value. When Auto Style
chooses a style for new durable work, report:

- selected style ID
- one-line reason
- notable alternatives when useful
- whether workspace-local overrides were considered

Changing an existing style value requires user confirmation.

## Rules Provenance

Report the AGENTS.md guidance and explicit instructions that affected the
output. If deterministic or hybrid checks were possible, say what was checked.
If a rule was applied only as a writing pass, say so.

## Source Provenance

Use draft-level source packs under the draft folder. Do not promote attachments
to durable source state unless the user asks or a `.drafts/` source pack exists.

For source context, report:

- source pack used, if any
- attached files or links used in the current session
- claims cited or checked when relevant
- whether the source context is durable or session-only

## Reporting Pattern

Use a compact provenance block when useful:

```text
Provenance
- Draft: client-memo v002 from v001
- Style: report, selected from user styles
- Rules: AGENTS.md applied; length cap checked
- Sources: draft source pack used
- Review: applied 3 findings from review-v001-quality
```

For small tasks, prose is enough if it names the same facts.
