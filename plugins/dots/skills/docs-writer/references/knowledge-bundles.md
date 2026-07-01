# Knowledge Bundles

Read this when writing docs intended to serve as durable agent context, a
Markdown knowledge base, or an OKF-inspired bundle.

## Purpose

Knowledge docs are structured Markdown artifacts. They should remain readable
without tooling, parseable by agents, diffable in git, and portable across
projects. Use them when ordinary prose is not enough because future agents need
to discover concepts, follow relationships, filter by type, or verify sources.

## Bundle Shape

Use a directory tree of Markdown files:

```text
docs/knowledge/
├── index.md
├── concepts/
│   ├── index.md
│   └── routing.md
├── runbooks/
│   ├── index.md
│   └── ship.md
└── references/
    ├── index.md
    └── git-scope.md
```

`docs/knowledge/` is a default suggestion, not a requirement. Follow the repo's
existing docs layout when it has one.

## Concept Frontmatter

Use frontmatter when it helps agents or humans navigate the corpus:

```yaml
---
type: Runbook
title: Ship PR workflow
description: How the agent publishes scoped work as a ready-to-go pull request.
resource: plugins/dots/skills/ship/SKILL.md
tags: [git, pr, workflow]
---
```

Fields:

- `type`: required for knowledge concepts. Use a short descriptive type such as
  `Concept`, `Runbook`, `Reference`, `ADR`, `Troubleshooting`, `Schema`, or a
  domain-specific type.
- `title`: human-readable title.
- `description`: one sentence that can appear in an index or search result.
- `resource`: canonical file, URL, command, service, or asset the concept
  describes.
- `tags`: short categorization terms.
- Extra fields are allowed when the repo benefits from them, such as `owner`,
  `status`, `source_files`, or `verified_by`.

See SKILL.md's Knowledge Docs section for the `timestamp` and `log.md`
restriction, which applies to knowledge bundles as well.

## Index Files

Use `index.md` for progressive disclosure: it lets a human or agent see what is
available before opening every file.

Recommended shape:

```markdown
# Runbooks

* Ship PR workflow (`ship.md`) - How the agent publishes a scoped
  branch and ready-to-go pull request.
* Commit workflow (`commit.md`) - How the agent creates scoped local commits.
```

Rules:

- Keep index entries short.
- Use descriptions from frontmatter when available.
- Update indexes when adding, removing, or renaming concept docs.
- Do not add YAML frontmatter to `index.md` unless the target format requires
  bundle-level metadata.

## Links And Relationships

- Prefer bundle-root-relative links in knowledge bundles when the repo renderer
  supports them. Use normal relative links when that is more portable in the
  current repo.
- Treat links as relationship edges. Surrounding prose should explain the
  relationship: depends on, replaces, supports, joins with, validates, or
  belongs to.
- Tolerate missing links in drafts, but report them before final delivery.
- Link to source files when a concept describes code behavior. This lets future
  agents refresh the doc against the source.

## Citations

Use a `# Citations` section when the body makes claims from external materials
or mirrored sources:

```markdown
# Citations

[1] [External source title](https://example.com/source)
```

For repo-internal docs, inline links to source files are often enough. Use a
dedicated citations section when source authority matters or when claims draw
from multiple external sources.

## Writing For Agents And Humans

- Put structured metadata in frontmatter and readable explanation in the body.
- Use stable headings and tables for information that agents may extract later.
- Keep each concept focused. Split large documents when separate concepts need
  separate metadata, links, or update cycles.
- Preserve unknown frontmatter fields when editing an existing concept.
- Do not reject partially complete knowledge docs solely because a link or
  optional field is missing; fix what is in scope and report the rest.
