# Provenance

Use this reference before reporting generated, revised, transformed, styled, or
reviewed work.

## Required Provenance

Every substantial Drafts result should expose:

- `style_mode`: `no_style`, `pinned_style`, `auto_style`, or
  `channel_recipe_only`.
- `style_provenance`: selected style, candidate styles, workspace samples,
  selected examples, freshness, sample count, evidence quality, and confidence
  warnings.
- `rules_provenance`: active rules, overlays, conflicts, deterministic checks,
  and generative cleanup passes.
- `source_provenance`: source packs, knowledge items, attached files, cited
  claims, and persistence policy.
- `draft_provenance`: source draft, source version, target version, edit intent,
  and whether the result creates a new draft or updates an existing one.
- `review_provenance`: reviewed version, rubric, reviewer mode, findings, and
  follow-up revision link.

## Style Modes

Use explicit style modes:

- `no_style`: user or surface requested no voice profile.
- `pinned_style`: user selected a named style.
- `auto_style`: system selected relevant style evidence.
- `channel_recipe_only`: channel structure applied without voice evidence.

Auto Style must distinguish:

- `auto_none`.
- `auto_workspace_samples`.
- `auto_named_style`.
- `auto_combined`.

## Source Persistence

Do not assume every attachment becomes durable knowledge. Label source context
as:

- `session_only`.
- `persisted_knowledge`.
- `workspace_reference`.
- `unknown_persistence`.

## Reporting Pattern

Use a compact provenance block when useful:

```text
Provenance
- Style: auto_style, auto_workspace_samples, low confidence
- Rules: global banned phrases checked; no conflicts found
- Sources: session_only source pack, 3 files
- Draft: revised version v3 from v2
```

For small tasks, prose is enough if it names the same facts.
