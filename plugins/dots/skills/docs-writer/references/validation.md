# Validation

Prove the claims and surfaces the current documentation change depends on. Run
only applicable checks; this is documentation QA, not an application release
gate.

## Check truth

- Verify behavior against source code, config, CLI help, tests, schemas, or
  authoritative docs when the claim depends on them.
- Check that examples, commands, paths, flags, environment variables, and output
  names match the current repo.
- Label inference, proposals, and partial evidence near the affected claim.
- Claim verification only for checks run now or supplied as fresh evidence.

## Check the document

- Confirm the selected document recipe and repository conventions are met.
- Check heading order, links, code fences, tables, inline code, and terminology
  where the change touches them.
- Keep link text meaningful without surrounding prose.
- Keep essential text available as text; give informative images alt text and
  do not encode meaning through color, shape, size, or position alone.
- Distinguish required actions, optional actions, expected outcomes, and
  possible outcomes.

## Preserve protected content

- Compare protected sections before and after the edit.
- Keep their heading, markers, body, formatting, and position unchanged unless
  the user requested that section.
- Place generated content outside protected sections.

## Check agent-readable bundles

- Parse required frontmatter and require a non-empty `type`.
- Match index entries to added, removed, and renamed concept files.
- Keep descriptions useful as one-sentence search or index snippets.
- Existing unknown frontmatter fields are preserved unless the user asks to
  remove them.
- Cross-links are intentional and use the repo's preferred path style.
- External claims have inline source links or a `# Citations` section when
  source authority matters.

## Check the selected specialist recipe

Validate design docs against the review checklist in
[design-docs.md](design-docs.md). Validate other specialist documents against
their selected recipe in [document-types.md](document-types.md). Do not repeat
those checklists here.

## Final report

Report the files and document types changed, checks performed, material checks
skipped, and open verification gaps.
