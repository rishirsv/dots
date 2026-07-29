---
name: docs-writer
description: "Use when writing, revising, or reviewing durable repository documentation such as READMEs, how-tos, runbooks, design docs, ADRs, troubleshooting guides, changelogs, release notes, PRDs, and agent-readable knowledge. Not for project instructions, code comments, chat explanations, publishing, or broad implementation."
---

# Docs writer

Write the smallest durable document that lets its reader act or understand
correctly. Lead with the outcome, preserve technical truth, and stop when the
document has done its job.

## References

Load only the guidance the current job needs:

- Read [technical-writing-guidance.md](references/technical-writing-guidance.md)
  for a substantial rewrite or style-heavy edit.
- Read the selected recipe in
  [document-types.md](references/document-types.md) after choosing the
  document type.
- Read [design-docs.md](references/design-docs.md) for a design doc,
  architecture proposal, or durable build plan.
- Read [validation.md](references/validation.md) before completion.

Apply repository and user-named style guides before these defaults.

## Workflow

1. Define the reader, job, document type, controlling sources, destination,
   and requested mode: edit, draft, or review. Infer clear answers from the
   request and repository.
2. Ground the claims in the smallest authoritative source set. Expand only to
   resolve a concrete gap or conflict. Derive changelogs and release notes
   from history and merged changes since the last release.
3. Follow repository structure, metadata, and ownership conventions; otherwise
   use the closest document recipe. Prefer updating or consolidating an owner
   document over creating another index, status surface, or copy of facts that
   source code already owns.
4. Lead with what the reader can do, decide, or understand. Keep background
   proportional to that job. Preserve caveats and uncertainty; label proposals
   and unverified claims. Leave explicitly protected sections unchanged.
5. Make the requested artifact, then run only the applicable checks in
   [validation.md](references/validation.md). Report the changed files,
   document types, validation, and material gaps.

For review-only requests, lead with material findings and cite their locations
and evidence. State the reviewed scope and say plainly when no material issue
was found.

## Frontmatter

Do not add generic frontmatter. Preserve existing fields and add metadata only
when the repository convention or selected agent-readable format requires it.

## Boundaries

`AGENTS.md` and project instruction files are repo-local guidance surfaces, not
ordinary durable docs. Update them only when the user asks for instruction
changes.
