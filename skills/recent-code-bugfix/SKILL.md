---
name: recent-code-bugfix
description: Find and fix a bug introduced by the current author within the last week in the current working directory. Use when a user wants a proactive bugfix from their recent changes, when the prompt is empty, or when asked to triage or fix issues caused by their recent commits. Require the root cause to map directly to the author's own changes.
---

# Recent Code Bugfix

Find a bug introduced by the current author in the last week, implement a minimal fix, and verify it when possible. Work in the current directory and require the root cause to tie directly to the author's recent edits.

## Workflow

### 1. Establish the recent-change scope

- Determine the author from `git config user.name` and `git config user.email`.
- If git config is unavailable, infer the current user from the environment. Ask once only if the author identity is still unclear.
- Use `git log --since=1.week --author=<author>` to identify recent commits and the files they touched.
- Focus investigation on files changed by those commits.
- If the user prompt is empty, use this default scope immediately.

### 2. Find a concrete failure tied to recent changes

- Prioritize defects that are directly attributable to the author's edits.
- Look for recent failures first: targeted test failures, lint failures, runtime errors, or local CI output that touches the changed files.
- If no failure is already available, run the smallest relevant verification for the edited area, such as a single test, file-level lint, or targeted repro.
- Confirm that the failing behavior is caused by the author's recent changes rather than unrelated legacy issues.
- If only unrelated failures are found, stop and report that no qualifying recent-author bug was detected.

### 3. Implement the fix

- Make the smallest change that resolves the confirmed issue.
- Update only the files needed for the fix.
- Follow local conventions, tests, and project patterns.
- Avoid unrelated refactors, speculative cleanups, or extra fallback logic unless the user asks for them.

### 4. Verify

- Prefer the smallest validation step that proves the fix, such as a targeted test, focused lint run, or direct reproduction command.
- If stronger verification is cheap and relevant, run it after the targeted check.
- If verification cannot be run, state exactly what would be run and why it was not executed.

### 5. Report

- Summarize the bug, root cause, and fix.
- State how the root cause ties directly to the author's recent changes.
- Summarize the verification that was run, or the verification that remains pending.

## Guardrails

- Stay focused on bugs introduced by the current author's changes within the last week.
- Do not claim a qualifying bug unless the root cause maps directly to those changes.
- Do not expand scope into general bug hunting, cleanup, or historical triage unless the user asks.
