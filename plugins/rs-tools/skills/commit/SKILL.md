---
name: commit
description: Create one safe, focused git commit from the current repository state. Use when the user asks to commit, save changes, make a git commit, or turn completed work into a commit. Stages only intended files, preserves unrelated work, checks the staged diff, and writes a concise repo-consistent message.
---

# Commit

Create one clean commit without pulling unrelated work into it.

## Fast path

Move quickly when the intent is obvious:

1. Inspect the current git state.
2. Infer the intended scope from the user's request and the files touched in this session.
3. Stage only the relevant paths.
4. Write one concise commit message in the repo's style.
5. Commit and report the result.

## Inspect first

Start with the highest-signal commands:

```bash
git status --short
git diff --staged
git diff
git branch --show-current
git log --oneline -10
```

Narrow to file-specific diffs when the worktree is large:

```bash
git diff -- path/to/file
git diff --staged -- path/to/file
```

## Scope rules

- Keep the commit focused on one logical change.
- Ignore unrelated files and changes you did not make.
- Prefer explicit path staging over broad staging.
- If the user gave an exact scope or exact message, follow it unless it is clearly wrong.
- If the user named a clear slice such as a feature, screen, or directory, infer that as the intended commit scope and proceed unless the diff contradicts it.
- If there is already a clean staged set that matches the request, prefer committing it instead of restaging everything.
- If there is nothing to commit, say so plainly and stop.

## Safety rules

- Never use destructive cleanup commands.
- Never amend, rebase, squash, or push unless asked.
- Never use `git add .` or `git commit -a` for this skill.
- Avoid interactive git flows by default.
- Do not stop just because the worktree is dirty or detached if the intended commit subset is still obvious.
- If only part of a file should be committed and there is no safe non-interactive split available, stop and ask instead of guessing.
- If staged changes appear to include unrelated work, do not silently commit them.
- If multiple plausible commit scopes exist, ask one concise question before proceeding.

## Staging strategy

Prefer the cheapest safe option:

1. If the staged set is already correct, keep it.
2. If the intended files are clear, stage explicit paths:

```bash
git add -- path/to/file another/path
```

3. If the worktree is mixed but the intended subset is still obvious, stage only that subset and leave the rest untouched.
4. If the scope is ambiguous, pause and ask.

Use `git restore --staged -- <path>` only when you need to remove clearly unintended staged files from the commit scope and doing so will not discard any work.

## Commit message rules

Match the repository's recent style before inventing a new one.

- Prefer a short, recallable subject line.
- Use imperative phrasing.
- Keep the subject specific to the change.
- Add a body only when extra context materially helps.
- Avoid vague subjects like `updates`, `misc fixes`, or `wip`.

Good patterns:

- `add prompt-backed commit skill`
- `fix branch slug generation for PR creation`
- `update plan skill save-path behavior`

## Validation

Stay fast and proportional.

- Reuse validation the user already ran in this session when it is still relevant.
- Run a quick targeted check only when there is an obvious command and a failure would invalidate the commit.
- Do not expand into a full test, lint, or build pass unless the user asked for it or the change clearly needs it.
- If validation is skipped, say so in the final report.

## Commit flow

Follow this order:

1. Inspect status, diffs, branch, and recent commit style.
2. Determine the exact commit scope.
3. Stage only the intended files if needed.
4. Recheck the staged diff.
5. Commit with a concise message.
6. Report:
   - commit hash and subject
   - files included
   - validation run or skipped
   - any leftover uncommitted changes worth noting

Use this command shape:

```bash
git commit -m "your concise subject"
```

For a body:

```bash
git commit -m "subject" -m "optional body"
```

## Failure handling

- If hooks fail, show the failure, fix it if straightforward, then retry.
- If git refuses to commit because nothing is staged, re-check scope instead of forcing it.
- If the branch or worktree state looks unusual but not dangerous, state the assumption you are making.
- If the request is part of a larger "open a PR" flow, treat a focused commit as a stepping stone, not a blocker that requires a separate user decision.
- If proceeding could capture someone else's work, stop and ask.
