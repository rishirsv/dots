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

Omit file-by-file narration, raw commit history, generic checklists, and agent
narration. Mention files, symbols, schemas, frameworks, or data flows when they
help a reviewer verify the change.

## Visual Evidence

Upload visual evidence only when the completed task already produced a
screenshot or short video; `$pr` does not capture or recapture it.

Use `gh pr create` or `gh pr edit` with `--attach` first. Write the description
to a Markdown file, reference each image where it belongs using its local path,
then attach that path. For example:

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

Before using `--attach`, check the selected command's `--help` output for the
flag. After publishing, confirm that the saved body contains
`github.com/user-attachments` links instead of local paths and that each image
or video renders.

If `gh` lacks `--attach` or the upload fails, use a signed-in GitHub browser:
edit the description, upload through the attachment control or drag-and-drop
target, wait for GitHub to insert its `github.com/user-attachments` link, save,
and confirm that it renders. Never paste a local path into the pull request.
