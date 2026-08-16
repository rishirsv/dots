---
name: publish-pull-request
description: "Use when finished changes should be committed, pushed, and published as a GitHub pull request; updates the branch's existing pull request or opens a new one ready for review. Not for merging or monitoring checks and reviews."
---

# Publish Pull Request

Publish the requested changes as a pull request ready for review.

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

Open the pull request in a signed-in GitHub browser, edit the description, and
upload each file through GitHub's attachment control or drag-and-drop target.
Wait for GitHub to insert its `github.com/user-attachments` link before saving.
If the upload interaction does nothing, retry it in the editor. Reopen the pull
request and confirm that the image or video renders.

The GitHub connector and `gh` can edit the description but cannot upload local
media. Do not paste a local file path into the pull request.
