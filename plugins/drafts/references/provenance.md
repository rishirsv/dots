# Provenance

Use this reference when Drafts needs to stay honest about style, sources,
versions, reviews, or saved state.

## Purpose

Drafts provenance is for trust and revision safety. It should help the agent
know:

- What artifact changed?
- What version did it come from?
- Which concrete style was used?
- Which draft-level source pack was used?
- Which AGENTS.md guidance and explicit instructions were applied?
- Which review, if any, drove the change?

Keep this information in working notes, frontmatter, or side records where it
belongs. Do not turn ordinary writing replies into provenance reports. Do not
build a separate provenance database in v1.

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

Automatic style selection is a selection behavior, not a stored style value.
When the agent chooses a style for new durable work, record the selected style
ID and why it fits. Mention it to the user only when the choice affects trust,
persistence, or a future edit.

Changing an existing style value requires user confirmation.

## Rules Provenance

Track the AGENTS.md guidance and explicit instructions that affected the output.
If deterministic or hybrid checks were possible, know what was checked. If a
rule was applied only as a writing pass, do not imply mechanical certainty.
Mention rule handling only when it affects trust, validation, or the user's next
decision.

## Source Provenance

Use draft-level source packs under the draft folder. Do not promote attachments
to durable source state unless the user asks or a `.drafts/` source pack exists.

For source context, track:

- source pack used, if any
- attached files or links used in the current session
- claims cited or checked when relevant
- whether the source context is durable or session-only

## Reporting Pattern

Keep provenance out of the way while the user is drafting or rewriting. The
default response is the writing.

Add one short natural-language note after the writing only when the user needs
it to understand trust, persistence, or a material assumption:

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
rule, or version details directly in prose or short bullets. Treat that as an
answer to the user's question, not a standing response shape.
