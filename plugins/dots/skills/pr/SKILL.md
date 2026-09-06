---
name: pr
description: "Commits and pushes finished changes, then opens or updates a non-draft GitHub pull request ready for review. Use when the user asks to publish completed work as a PR. Not for merging, addressing review feedback, or monitoring checks and reviews."
---

# Publish PR

For commit messages, the pull-request title, and its description, apply
[Technical writing guidance](../../references/technical-writing-guidance.md)
as an editing standard. `$pr` still owns these publishing artifacts.

1. Confirm the GitHub repository and active account. If necessary, run
   `gh auth switch` and confirm access again.

2. Exclude unrelated changes. If the work is not on a branch, follow the
   repository's naming convention or name the branch after the result. Ask only
   when the change scope or branch starting point is unclear.

3. Commit and push the requested changes.

4. Update the branch's existing pull request to describe the latest changes, or
   open one if none exists. Make it ready for review; never create or leave a
   draft.

5. Confirm that the pull request contains the pushed commit. Report its URL,
   automated checks, and anything that remains unverified. Do not merge it.

## Title

Describe the result in plain language, not the coding work.

When the repository uses titles such as `fix(home):`, follow that format. The
rest of the title must still describe the result clearly.

| Avoid | Write instead |
| --- | --- |
| `Enforce semantic design token consistency` | `Keep colors and spacing consistent across screens` |
| `Progress: truthful analysis and exercise progression` | `Show accurate progress and exercise trends` |
| `Home Controller: require a real push to page the deck` | `Prevent accidental card paging on Home` |
| `Backend refactor: one save path, 3-state receipts, definition-driven loggers` | `Save workout and health data through one path` |

## Description

Lead with what changes for users or the system:

- what changes when this is merged;
- what was wrong before;
- why the change matters.

Then include the implementation details needed to review the approach, risks,
and affected boundaries. State what was tested and what remains unverified.
Preserve fields required by the repository's pull-request template.

By default, present each substantive change as a top-level bullet with one to
three explanatory sub-bullets. Keep the main bullet precise enough to review;
use the sub-bullets to explain what it means, how the relevant behavior works,
and why it matters.

Write these explanations for a reader without specialist knowledge of the
codebase. Use a conversational, respectful ELI5 tone: familiar words, concrete
behavior, and enough background to understand the change without teaching the
whole subject. Translate the technical claim rather than repeating it with
simpler synonyms. Explain the behavior first, then define necessary technical
terms where they appear. Use a small example or analogy only when it makes the
mechanism clearer or shorter. Preserve the distinctions and caveats needed for
an accurate review; plain language should not hide them.

Omit file-by-file narration, raw commit history, generic checklists, and agent
narration. Mention files, symbols, schemas, frameworks, or data flows when they
help a reviewer verify the change.

## Visual Evidence

Upload visual evidence only when the completed task already produced a
screenshot or short video; `$pr` does not capture or recapture it.

Use `gh pr create` or `gh pr edit` with `--attach`. Write the description to a
Markdown file, reference each image or video where it belongs using its local
path, then attach that path. Put a video reference in its own paragraph so it
renders as a player. For example:

```bash
gh pr create --title "Show account status in Settings" \
  --body-file pr-body.md \
  --attach ./settings.png
```

For an existing pull request, preserve its required template fields and run:

```bash
gh pr edit 123 --body-file pr-body.md --attach ./settings.png
```

Repeat `--attach` for multiple files. `gh` uploads each file and replaces a
matching local Markdown link with its GitHub-hosted URL. Without a matching
reference, it appends the file; set appended-image alt text with a quoted
`file#alt text` value:

```bash
gh pr edit 123 --attach './settings.png#Account status in Settings'
```

After publishing, confirm that the saved body contains
`github.com/user-attachments` links instead of local paths and that each image
or video renders. Never leave a local path in the pull request.
