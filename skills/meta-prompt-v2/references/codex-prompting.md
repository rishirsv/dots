# Codex Prompting

Use for prompts targeting Codex, coding agents, repo work, debugging, implementation, code review, tests, terminal workflows, tool-harness instructions, AGENTS.md, or prompt debugging for coding agents.

Sources: official OpenAI Codex prompting guide, Codex docs bundle, and local `official-openai/codex-prompting-guide.md`.

## What Codex Prompts Need

- State whether the downstream agent should inspect only, implement, review, plan, write tests, or produce a patch.
- Include repo/path scope, ownership boundaries, and what not to touch when known.
- Tell the agent how autonomous to be: continue with reasonable assumptions, or ask before high-risk ambiguity.
- Include validation expectations: targeted tests, type checks, lint, build, smoke test, screenshot/render check, or explicit "no tests needed."
- Preserve unrelated user changes and forbid destructive git actions unless the user explicitly requests them.
- Ask for a concise final report: files changed, validation run, and blockers.

## Codex Starter Prompt Ingredients

Use these as ingredients, not all at once:

```text
You are Codex, a coding agent working in this repository. Deliver working code, not just a plan. Read the relevant code first, follow existing patterns, preserve unrelated changes, implement the requested behavior, run the most relevant validation, and report changed files plus any checks you could not run.
```

```text
When searching, use `rg` or `rg --files` first. When editing manually, prefer `apply_patch`. Batch independent reads when possible. Do not use destructive git commands unless explicitly asked.
```

```text
For frontend work, inspect the existing design system and verify the result in a browser or rendered screenshot when feasible. Fix layout, clipping, responsiveness, and visual regressions before finalizing.
```

## User Task Prompt Examples

### Focused Implementation

```markdown
Implement the requested change in this repo.

Scope:
- Work only in `[paths/modules]` unless you find a directly required dependency.
- Preserve existing behavior outside the requested change.
- Reuse existing helpers and patterns before adding new abstractions.

Validation:
- Run the most relevant targeted tests or checks.
- If a check cannot run, explain why and name the next best check.

Final response:
- Summarize changed files, behavior changed, and validation results.
```

### Debugging

```markdown
Diagnose and fix the bug described below.

Instructions:
- Reproduce or trace the failure before editing when feasible.
- Identify the root cause, not just the symptom.
- Make the smallest coherent code change that fixes the behavior.
- Add or update a focused regression test if the repo has a relevant test pattern.

Final response:
- State root cause, fix, files changed, and validation run.
```

### Code Review

```markdown
Review the changes for correctness.

Focus on bugs, behavioral regressions, data loss, security issues, missing tests, and mismatches with the stated requirement. Lead with findings ordered by severity. For each finding, include file and line reference when possible. If you find no issues, say that clearly and mention residual risk or test gaps.
```

### ExecPlan / Multi-Session Work

```markdown
Create or update an ExecPlan for this substantial change.

The plan must include purpose, phase outcomes, implementation checklist, exact validation, decision log, surprises/discoveries, and completion notes. Make the plan restartable from the file plus current working tree. Do not create addendums; rewrite the existing plan if one exists.
```

## Tool-Harness Prompt Patterns

### Dedicated Tools Over Terminal

Use when the target agent has named tools:

```text
Prefer dedicated tools over raw shell commands when an appropriate tool exists. Use shell only when no dedicated tool can perform the action or the shell is the intended interface.
```

### Apply Patch

Use when the target agent can patch files:

```text
Use `apply_patch` for manual file edits. Keep patches scoped and coherent. Do not use patches for generated files, formatter output, or large mechanical rewrites where a command is safer.
```

### Shell Command

Good shell tool descriptions include:

- command as a single string, not an argv array, when the harness behaves like a terminal
- required or strongly recommended `workdir`
- timeout controls for long commands
- explicit approval/escalation fields only if the harness supports them

### Parallel Reads

Use when the target supports parallel tools:

```text
Before reading files, decide which independent files or searches are needed. Batch independent reads/searches in one parallel tool call. Only make sequential calls when the next read depends on the previous result.
```

### Tool Result Truncation

For harness authors, preserve beginning and end of long outputs and mark middle truncation clearly. Keep search results visually distinct from semantic search or memory results so the model does not confuse tool types.

## AGENTS.md / Instruction Injection

When generating Codex repo instructions:

- Put durable repo rules in `AGENTS.md`.
- Keep global instructions separate from repo-local instructions.
- Later/deeper directory instructions override earlier/root instructions.
- Include only rules the agent should follow repeatedly.
- Avoid turning one-off task details into permanent repo rules.

## Preambles, Phase, And Personality

- For modern Codex surfaces that support preambles, ask for short human updates before tool-heavy work and at real milestones.
- Avoid log-style updates. Prefer paired-work phrasing that says what is being learned and what happens next.
- For API harnesses that preserve assistant message phases, keep commentary/preamble and final-answer metadata intact.
- Add personality only when it changes the user experience. Use pragmatic style for speed; friendly style for onboarding, ambiguity, or higher-stakes collaboration.

## Codex Metaprompting

Use this when improving a Codex prompt after a bad run:

```text
Review the previous run and propose targeted instruction changes that would produce the same or better quality faster next time. Focus on reducing slow starts, excessive status logging, repeated tool loops, and unclear stopping rules. Generalize the changes so they apply beyond this one task.
```
