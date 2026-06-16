# Validation

Read this before finalizing documentation work.

## Evidence Checks

- Verify behavior against source code, config, CLI help, tests, schemas, or
  authoritative docs when the claim depends on them.
- Distinguish observed facts from inference. If evidence is partial, state the
  limitation near the affected claim.
- Check that examples, commands, paths, flags, environment variables, and output
  names match the current repo.
- Do not claim a command, example, link, render, or test was verified unless it
  was actually checked in the current run or provided as fresh evidence.

## Markdown Checks

- Headings are nested logically and describe the section.
- Links point to the intended files or URLs. Report links that could not be
  checked.
- Code fences have language tags when a language is known.
- Tables are readable in plain Markdown and do not hide long prose.
- Inline code is used for commands, file paths, flags, field names, and literal
  values.

## Knowledge Bundle Checks

For OKF-style or agent-readable knowledge docs:

- Every concept file has parseable YAML frontmatter.
- Every concept file has a non-empty `type`.
- Frontmatter omits `timestamp`.
- `index.md` entries match added, removed, or renamed concept files.
- Frontmatter descriptions are one sentence and useful for search or index
  snippets.
- Existing unknown frontmatter fields are preserved unless the user asks to
  remove them.
- Cross-links are intentional and use the repo's preferred path style.
- External claims have inline source links or a `# Citations` section when
  source authority matters.

## Final Report

Report:

- Files created or changed.
- The doc types written or updated.
- Validation performed.
- Validation skipped and why.
- Any open source-evidence gaps or follow-up work.
