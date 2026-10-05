---
name: publish-pr
description: "Commits and pushes finished changes, then opens or updates a non-draft GitHub pull request ready for review. Use when the user asks to publish completed work as a PR. Not for merging, addressing review feedback, or monitoring checks and reviews."
---

# Publish PR

For commit messages, the pull-request title, and its description, apply
[Writing style](../../references/writing-style.md)
as an editing standard. `$publish-pr` still owns these publishing artifacts.

1. Confirm the GitHub repository and active account. If necessary, run
   `gh auth switch` and confirm access again.

2. Exclude unrelated changes. If the work is not on a branch, follow the
   repository's naming convention or name the branch after the result. Ask only
   when the change scope or branch starting point is unclear.

3. Fetch the remote and check the branch against the PR's current base. Resolve
   conflicts before publishing. Rebase when required by repository policy or
   when base changes affect this work. Reuse the completed task's checks and
   visual evidence. After rebasing or splitting the work, inspect changes to
   code, dependencies and build configuration; rerun only checks whose evidence
   no longer covers the delivered PR. A patch applying without conflicts does
   not prove that the behavior is unchanged, and publication alone does not
   require a new verification pass. Avoid rewriting shared branches without
   coordination. If a previously pushed branch is rebased, push with
   `--force-with-lease`.

4. Commit and push the requested changes.

5. Update the branch's existing pull request to describe the latest changes, or
   open one if none exists. Make it ready for review; never create or leave a
   draft.

6. Confirm that the pull request contains the pushed commit. Report its URL,
   automated checks, and anything that remains unverified. Do not merge it.

## Commit messages and titles

Keep commit subjects and PR titles terse and specific. Follow the repository's
type-prefix convention and add a scope only when useful. Name the result in
plain language. Omit a commit body unless a material reason or caveat is unclear
from the subject; keep any body brief.

## Description

Keep the body terse: one or two sentences stating the change and reason, then
brief validation. Include a material risk, limitation, or unverified behavior
only when it affects review. Preserve required template fields.

Name the relevant check and its observed result, including what behavior it
verifies. Use before-and-after evidence when the completed task produced it.
Distinguish observed results from expected behavior. Claim that a check failed
before the change only when that failure was observed.

Assess who or what the change can affect and whether reverting the code
restores the previous behavior. Describe material consequences and any
recovery work a revert would leave, such as restoring data or coordinating
consumer changes.

Use short paragraphs or bullets. Omit background, walkthroughs, file lists,
commit history, generic checklists, and agent narration. For a performance
change, give the primary measurement with its unit as before → after.

When prose alone makes a structural or behavioral change hard to follow,
add a compact diff sketch, call tree, or Mermaid diagram beside the
explanation. Include only the context needed to understand the change.

## Visual Evidence

Upload visual evidence only when the completed task already produced a
screenshot or short video; `$publish-pr` does not capture or recapture it.

Check the applicable `gh pr create --help` or `gh pr edit --help` before using
`--attach`; availability belongs to the installed CLI, not this example. If it
is unavailable, use another already-authorized attachment interface when one
exists. Otherwise preserve the evidence locally and report the attachment gap.
Remove local paths from the published body. If required attachments are missing,
report that the pull request lacks that evidence.

When supported, use `gh pr create` or `gh pr edit` with `--attach`. Write the description to a
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
