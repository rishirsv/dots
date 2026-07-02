---
name: release-notes
description: "Derives release notes and changelog entries from actual git history and merged PRs between two refs, classifying changes for the audience, leading with breaking changes, and matching the repo's existing changelog format. Use for draft release notes, update the changelog, or what changed since a tag or release; not for PR descriptions, durable docs unrelated to a release, or publishing a GitHub release without explicit approval."
---

# Release Notes

Turn real repo history into release notes or changelog entries. Every line is
traceable to a commit or merged PR; nothing is invented, upgraded in
significance, or padded with marketing language.

The boundary with [docs-writer](../docs-writer/SKILL.md): this skill owns
deriving the content from git and GitHub evidence; docs-writer owns durable
documentation that is written from known content. PR titles and descriptions
belong to the publish workflow, not here.

## Determine The Range

Default to the last release tag through the current head. Confirm the range
before writing:

- Find the previous anchor: latest tag (`git describe --tags --abbrev=0`), the
  latest GitHub release, or the last CHANGELOG entry — whichever the repo
  actually uses.
- If the user names a version, tag, date, or "since X", use that range.
- State the resolved range in the output so the reader can check coverage.
- If the repo has no tags, releases, or changelog history, say so and confirm
  the intended starting point instead of guessing.

## Gather The Evidence

Collect what actually changed, preferring merged PRs over raw commits when the
repo uses PRs:

- merged PR titles, bodies, and labels in the range
- commits not covered by any PR
- breaking-change markers: conventional-commit `!`/`BREAKING CHANGE` footers,
  PR labels, or migration notes in PR bodies
- for behavior claims that matter, spot-check the diff rather than trusting a
  title

Exclude noise: merge commits, version bumps, lockfile churn, formatting-only
and CI-only changes — unless one of them is itself the story (a dependency
upgrade users must know about, a CI change that alters release artifacts).

## Classify And Order

Group entries in reader-priority order:

1. Breaking changes, each with what breaks and the migration step
2. New features and improvements
3. Fixes
4. Performance, security, and deprecations, when present
5. Internal/maintenance, only when the audience is developers

One entry per meaningful change. Collapse stacks of PRs that deliver one
feature into one entry; do not pad the list by enumerating every commit.

## Write For The Audience

- User-facing notes lead with what changed for the user in plain language, not
  internal mechanics ("Exports now include archived items" rather than
  "Refactor export query builder").
- Developer changelogs can be denser and name modules, flags, and APIs.
- Match the repo's existing conventions first: CHANGELOG format (for example
  Keep a Changelog), heading style, tense, linking style, and how previous
  GitHub releases were written. Consistency beats a better format.
- Keep each entry to one line where possible, with the PR or commit reference
  (`#123` or short SHA) at the end.
- No superlatives, no invented user impact, no "various improvements" filler.
  If an entry cannot be explained concretely, read the diff or drop it into
  the developer section as what it literally is.

## Destinations

- Update `CHANGELOG.md` in place, following its established format and
  inserting above the previous entry, when the repo keeps one or the user asks.
- Provide GitHub release notes as text or a notes file when the user is
  cutting a release.
- Otherwise return the notes in chat.

Publishing is gated: do not create or edit a GitHub release, push a tag, or
post the notes anywhere external unless the user explicitly approved that
exact action. Preparing the text is this skill's default job; publishing is a
separate decision.

## Final Check

Before delivering:

- the stated range matches what was actually scanned
- every entry traces to a PR or commit in that range
- breaking changes are first and include migration steps
- excluded-noise categories were actually excluded, and nothing user-visible
  was silently dropped — name anything ambiguous instead of omitting it
