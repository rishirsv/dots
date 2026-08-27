---
name: pr
description: "Commits and pushes finished changes, then opens or updates a non-draft GitHub pull request ready for review. Use when the user asks to publish completed work as a PR. Not for merging, addressing review feedback, or monitoring checks and reviews."
---

# Publish PR

Publish the requested changes as a pull request ready for review.

Before writing commit messages, the pull-request title, or its description,
read and apply
[Technical writing guidance](../docs-writer/references/technical-writing-guidance.md).
Keep `$pr` as the owner of these publishing artifacts; use the shared guidance
as an editing standard, not as a documentation workflow.

1. Confirm that the GitHub repository and active account are correct. If the
   wrong account is active, use `gh auth switch`, then confirm access again.

2. Keep unrelated changes out of the commit. If the work is not on a branch,
   follow the repository's branch naming convention or name it after the
   result. Ask only when it is unclear which changes belong or where the branch
   should begin.

3. Commit and push the requested changes.

4. Check whether the branch already has a pull request:
   - If one exists, update it to describe the latest changes.
   - Otherwise, open a new one.
   - Make sure it is ready for review. Never create or leave a draft.

5. Confirm that the pull request contains the pushed commit. Report its URL,
   automated checks, and anything that remains unverified. Do not merge it.

## Title

Describe the result in plain language. Do not describe the coding work.

When the repository uses titles such as `fix(home):`, follow that format. The
rest of the title must still describe the result clearly.

| Avoid | Write instead |
| --- | --- |
| `Enforce semantic design token consistency` | `Keep colors and spacing consistent across screens` |
| `Progress: truthful analysis and exercise progression` | `Show accurate progress and exercise trends` |
| `Home Controller: require a real push to page the deck` | `Prevent accidental card paging on Home` |
| `Backend refactor: one save path, 3-state receipts, definition-driven loggers` | `Save workout and health data through one path` |

## Description

Write for someone who will not read the code.

The opening should explain:

- what changes when this is merged;
- what was wrong before;
- why the change matters.

Then state what was tested and what remains unverified.

Keep any fields required by the repository's pull-request template.

Do not fill the description with file names, class names, database tables,
framework details, commit history, generic checklists, or agent narration.

## Visual Evidence

Upload visual evidence only when the completed task already produced a
screenshot or short video. Publishing a pull request does not capture or
recapture evidence.

Use `gh pr create` or `gh pr edit` with `--attach` as the primary upload path.
Write the description to a Markdown file, place each image where it belongs
with ordinary Markdown image syntax whose destination is the local path, then
attach that same path. For example, use `Settings screen` as the alt text and
`./settings.png` as both the Markdown destination and attachment:

```bash
gh pr create --title "Show account status in Settings" \
  --body-file pr-body.md \
  --attach ./settings.png
```

For an existing pull request, preserve its required template fields and run:

```bash
gh pr edit 123 --body-file pr-body.md --attach ./settings.png
```

Repeat `--attach` for multiple files. `gh` uploads each file and rewrites a
matching local Markdown link to its GitHub-hosted URL. If the body does not
reference an attached file, `gh` appends it. For an appended image, supply alt
text with a quoted `file#alt text` value:

```bash
gh pr edit 123 --attach './settings.png#Account status in Settings'
```

Check support with `gh pr create --help` when needed; the flag first appeared
in the `2.99.0-attach-preview` build. After publishing, inspect the saved body
and confirm that local paths were replaced with `github.com/user-attachments`
links and that the image or video renders.

If the active `gh` lacks `--attach` or the upload fails, use a signed-in GitHub
browser as the fallback: edit the description, upload through the attachment
control or drag-and-drop target, wait for GitHub to insert its
`github.com/user-attachments` link, save, and confirm that it renders. Never
paste a local file path into the pull request.
