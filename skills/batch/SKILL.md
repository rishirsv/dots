---
name: batch
description: "Orchestrate a large, parallelizable codebase change by researching scope, decomposing the work into independent units, defining shared validation, and coordinating parallel workers. Use only when invoked explicitly; do not auto-activate."
---

# Batch

You are orchestrating a large, parallelizable change across this codebase.

## User Instruction

Use the user's current request as the instruction input.

## Phase 1: Research and Plan (Plan Mode)

Call the `update_plan` tool now to enter planning workflow, then:

1. **Understand the scope.** Launch one or more Explore agents (in the foreground - you need their results) to deeply research what this instruction touches. Find all the files, patterns, and call sites that need to change. Understand the existing conventions so the migration is consistent.

2. **Decompose into independent units.** Break the work into 5-30 self-contained units. Each unit must:
   - Be independently implementable in an isolated git worktree (no shared state with sibling units)
   - Be mergeable on its own without depending on another unit's PR landing first
   - Be roughly uniform in size (split large units, merge trivial ones)

   Scale the count to the actual work: few files -> closer to 5; hundreds of files -> closer to 30. Prefer per-directory or per-module slicing over arbitrary file lists.

3. **Determine the e2e test recipe.** Figure out how a worker can verify its change actually works end-to-end - not just that unit tests pass. Look for:
   - A `agent-browser` skill or browser-automation tool (for UI changes: click through the affected flow, screenshot the result)
   - A `tmux` or CLI-verifier skill (for CLI changes: launch the app interactively, exercise the changed behavior)
   - A dev-server + curl pattern (for API changes: start the server, hit the affected endpoints)
   - An existing e2e/integration test suite the worker can run

   If you cannot find a concrete e2e path, ask the user how to verify this change end-to-end. Offer 2-3 specific options based on what you found (e.g., "Screenshot via chrome extension", "Run `bun run dev` and curl the endpoint", "No e2e - unit tests are sufficient"). Do not skip this - the workers cannot ask the user themselves.

   Write the recipe as a short, concrete set of steps that a worker can execute autonomously. Include any setup (start a dev server, build first) and the exact command/interaction to verify.

4. **Write the plan.** In your plan file, include:
   - A summary of what you found during research
   - A numbered list of work units - for each: a short title, the list of files/directories it covers, and a one-line description of the change
   - The e2e test recipe (or "skip e2e because ..." if the user chose that)
   - The exact worker instructions you will give each agent (the shared template)

5. Present the plan for approval.

## Phase 2: Spawn Workers (After Plan Approval)

Once the plan is approved, spawn one agent per work unit using the `spawn_agent` tool. Launch all workers in parallel in a single `multi_tool_use.parallel` call.

For each agent, the prompt must be fully self-contained. Include:

- The overall goal (the user's instruction)
- This unit's specific task (title, file list, change description - copied verbatim from your plan)
- Any codebase conventions you discovered that the worker needs to follow
- The e2e test recipe from your plan (or "skip e2e because ...")
- The worker instructions below, copied verbatim from your shared template:

```text
<WORKER_PROMPT_FROM_PLAN>
```

Use `agent_type: "worker"` unless a more specific agent type fits.

This is the prompt template you should provide to each worker agent, with the placeholders filled in:

```text
You are implementing a specific task from a development plan.

## Context
- Plan: [filename]
- Goals: [relevant overview from plan]
- Dependencies: [prerequisites for this task]
- Related tasks: [tasks that depend on or are depended on by this task]
- Constraints: [risks from plan]

## Your Task
**Task [ID]: [Name]**

Location: [File paths]
Description: [Full description]

Acceptance Criteria:
[List from plan]

Validation:
[Unit Tests or verification from plan]

## Instructions
1. Examine working plan and any relevant or dependent files
2. Implement changes for all acceptance criteria
3. Keep work **atomic and committable**
4. For each file: read first, edit carefully, preserve formatting
5. Run validation if feasible
6. **ALWAYS mark completed tasks IN THE *-plan.md file AS SOON AS YOU COMPLETE IT!** and update with:
    - Concise work log
    - Files modified/created
    - Errors or gotchas encountered
7. Commit your work
   - Note: There are other agents working in parallel to you, so only stage and commit the files you worked on. NEVER PUSH. ONLY COMMIT.
8. Double Check that you updated the *-plan.md file and committed your work before yielding
9. Return summary of:
   - Files modified/created
   - Changes made
   - How criteria are satisfied
   - Validation performed or deferred

## Important
- Be careful with paths
- Stop and describe blockers if encountered
- Focus on this specific task
```

## Phase 3: Track Progress

After launching all workers, render an initial status table:

| #   | Unit    | Status  | PR  |
| --- | ------- | ------- | --- |
| 1   | <title> | running | -   |
| 2   | <title> | running | -   |

As worker completion notifications arrive, parse the `PR: <url>` line from each agent's result and re-render the table with updated status (`done` / `failed`) and PR links. Keep a brief failure note for any agent that did not produce a PR.

When all agents have reported, render the final table and a one-line summary (e.g., "22/24 units landed as PRs").
