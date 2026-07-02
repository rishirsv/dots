# Validation

Read this before finalizing documentation work.

## Evidence checks

- Verify behavior against source code, config, CLI help, tests, schemas, or
  authoritative docs when the claim depends on them.
- Distinguish observed facts from inference. If evidence is partial, state the
  limitation near the affected claim.
- Check that examples, commands, paths, flags, environment variables, and output
  names match the current repo.
- Do not claim a command, example, link, render, or test was verified unless it
  was actually checked in the current run or provided as fresh evidence.

## Markdown checks

- Headings are nested logically and describe the section.
- Links point to the intended files or URLs. Report links that could not be
  checked.
- Link text is meaningful without surrounding prose; avoid link text such as
  "here", "link", or a bare URL unless the URL itself is the subject.
- Code fences have language tags when a language is known.
- Tables are readable in plain Markdown and do not hide long prose.
- Tables are introduced before they appear, especially when the table carries
  important information.
- Inline code is used for commands, file paths, flags, field names, and literal
  values.
- Images have alt text or an equivalent text explanation. Decorative images use
  empty alt text when the target renderer supports it.
- Images do not contain text, code samples, or terminal output that should be
  available as real text.
- Important meaning is not conveyed only by color, icon shape, size, position,
  or other visual cues.
- Procedures and UI instructions avoid directional language such as "above",
  "below", "left", or "right" when a label, heading, or preceding/following
  reference would be clearer.

## Global audience checks

- Terms, abbreviations, and acronyms are defined at first use when the audience
  might not know them.
- Terminology, phrasing, formatting, and capitalization are consistent within
  the doc or doc set.
- Sentences are short enough to translate and do not rely on idioms,
  colloquialisms, culture-specific examples, seasonal references, or humor.
- Conditions appear before instructions when the condition changes what the
  reader should do.
- Prescriptive wording distinguishes required actions, optional actions,
  expected outcomes, and possible outcomes. Avoid ambiguous `should`.

## Knowledge bundle checks

For OKF-style or agent-readable knowledge docs:

- Every concept file has parseable YAML frontmatter.
- Every concept file has a non-empty `type`.
- `index.md` entries match added, removed, or renamed concept files.
- Frontmatter descriptions are one sentence and useful for search or index
  snippets.
- Existing unknown frontmatter fields are preserved unless the user asks to
  remove them.
- Cross-links are intentional and use the repo's preferred path style.
- External claims have inline source links or a `# Citations` section when
  source authority matters.

## Design doc checks

For design docs, technical designs, architecture proposals, or implementation
designs:

- The first page explains the objective, background, and review context without
  requiring outside explanation.
- Goals describe outcomes; design sections describe implementation choices.
- Non-goals are explicit enough to prevent predictable scope creep.
- The doc focuses most detail on choices with high penalty for being wrong.
- Scenarios cover happy path, important edge cases, failures, and permission or
  trust boundaries.
- Interfaces, data shapes, commands, APIs, config, schemas, or file formats are
  concrete when other systems or users depend on them.
- "How to build it" or implementation sequencing is included when rollout,
  migration, integration, or staged validation affects the design.
- Security, privacy, logging, retention, legal, SLO, monitoring, alerting,
  rollout, and rollback sections are included when the risk profile calls for
  them, or the omission is intentional and clear from scope.
- Open issues include options and next steps. Resolved issues record the
  decision and rationale.
- Alternatives considered answer the obvious "why not this?" questions without
  becoming an exhaustive diary.

## Final report

Report:

- Files created or changed.
- The doc types written or updated.
- Validation performed.
- Validation skipped and why.
- Any open verification gaps or follow-up work.
