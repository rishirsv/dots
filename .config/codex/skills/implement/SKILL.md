---
name: implement
description: Execute a plan or issue end-to-end with review checkpoints and clean commits. Use only when you begin work on implementing a formal plan or issue.
---

# Implement

Execute an existing plan or issue from start to finish, with verification and review checkpoints.

## Process

### Review task document

- Read the user provided plan or issue document.
- Read all documents or links referenced in the plan or issue document.
- If the user does not provide a formal document, create a checklist of tasks to complete.
- In one message:
  - Concisely summarize your understanding of the plan.
  - If any tasks are unclear or ambiguous, ask clarifying questions to the user.
  - Obtain user approval to proceed.

### Execute Tasks

- Execute the tasks in order. For each task:
  - Understand similar codebase patterns.
  - Follow existing conventions.
  - Update the plan or issue document to reflect the progress.
  - Note any blockers or discovering in the plan or issue document.
  - Update the plan or issue document to reflect progress and findings with each task.

## Rules

- You may be in a dirty git worktree.
- NEVER revert existing changes you did not make unless explicitly requested, since these changes were made by the user or other agents.
- If asked to make a commit or code edits and there are unrelated changes to your work or changes that you didn't make in those files, DO NOT revert those changes and DO NOT checkout or restore affected files.
- If the changes are in files you've touched recently, you should read carefully and understand how you can work with the changes rather than reverting them.
- If the changes are in unrelated files, just ignore them and don't revert them, don't checkout and don't restore.

Stop and ask for help immediately when:

- Missing dependency or environment blocker
- Tests or manual verification fails repeatedly without a confident root cause
- Plan/Issue instructions are unclear/contradictory
- Proceeding could risk data loss or security issues

Never:

- Proceed with failing tests (or skip validation).
- Skip review checkpoints.
- Discard work without typed confirmation.

Always:

- Keep the plan or issue document in sync with what actually happened.
- Prefer the smallest change that satisfies the Plan/Issue.
- Add docstrings for new functions.
- Add concise code comments before code blocks.

### Frontend tasks

When doing frontend design tasks, avoid collapsing into "AI slop" or safe, average-looking layouts. Aim for interfaces that feel intentional, bold, and a bit surprising.

- Typography: Use expressive, purposeful fonts and avoid default stacks (Inter, Roboto, Arial, system).
- Color & Look: Choose a clear visual direction; define CSS variables; avoid purple-on-white defaults. No purple bias or dark mode bias.
- Motion: Use a few meaningful animations (page-load, staggered reveals) instead of generic micro-motions.
- Background: Don't rely on flat, single-color backgrounds; use gradients, shapes, or subtle patterns to build atmosphere.
- Overall: Avoid boilerplate layouts and interchangeable UI patterns. Vary themes, type families, and visual languages across outputs.
- Ensure the page loads properly on both desktop and mobile
- Exception: If working within an existing website or design system, preserve the established patterns, structure, and visual language.

### Completion

- For code changes:
- Concisely explain the changes you made and the underlying reasons in non-technical langage to help the user understand the impact of your edits.
- Lead with a quick explanation of the change, and then give more details on the context covering where and why a change was made. Do not start this explanation with "summary", just jump right in.
- If there are natural next steps the user may want to take, suggest them at the end of your response. Do not make suggestions if there are no natural next steps.
- When suggesting multiple options, use numeric lists for the suggestions so the user can quickly respond with a single number.
