# State Model

Use this reference when creating, updating, or naming Drafts state.

## State Authority

Before reading or writing state, detect whether the current surface exposes an
existing Drafts state backend, workspace store, mounted project file, or
explicit file path. Use that observed location and its existing naming
conventions.

Do not invent persistence paths, object IDs, or saved versions. When no durable
state backend is available, return the artifact in chat or in the requested
file and describe the version boundary, provenance, and assumptions instead of
claiming that state was saved.

If the user asks for durable state and no backend is visible, ask where it
should live or create only the explicitly requested file.

## Core Objects

| Object | Purpose |
| --- | --- |
| `workspace` | Top-level container for styles, rules, knowledge, sessions, and drafts |
| `session` | Continuing writing conversation and decision history |
| `writing_brief` | Structured user intent before planning |
| `document_contract` | Executable plan for substantial writing |
| `draft` | User-facing writing artifact |
| `draft_version` | Saved revision of a draft |
| `style` | Named voice profile |
| `style_reference` | Sample attached to a named style |
| `workspace_sample` | Workspace-level sample that may influence Auto Style |
| `style_guide` | Generated style instructions, evidence, freshness, and warnings |
| `writing_rules` | Durable writing policies and overlays |
| `channel_recipe` | Reusable destination or format recipe |
| `source_pack` | Mounted task-specific source context |
| `knowledge_item` | Durable reusable workspace knowledge |
| `review_pass` | Version-tied critique and findings |
| `rubric_scorecard` | Structured review scores and rationale |
| `benchmark_run` | Future repeatable evaluation over writing workflows |

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

- `style_reference`: evidence for a named style.
- `workspace_sample`: general workspace voice evidence.
- `style_guide`: generated instructions from style evidence.
- `style_provenance`: runtime trace of what style evidence was loaded.

Do not use readiness alone as proof of quality. Track confidence, freshness,
sample quality, and contamination warnings separately.
