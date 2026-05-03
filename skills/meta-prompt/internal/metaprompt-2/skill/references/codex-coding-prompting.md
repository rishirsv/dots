# Codex Coding Prompting

Use this reference when the downstream prompt is for Codex, a coding agent, or a codebase task such as implementation, debugging, refactoring, review, frontend buildout, test repair, repo automation, or tool-driven engineering work.

This reference is grounded in OpenAI's official Codex Prompting Guide, saved locally at `../../sources/official-openai/codex-prompting-guide.md`.

## When To Route Here

Route here when the user asks for a prompt that should cause another assistant to:

- inspect or edit a repository
- use shell, file, search, patch, browser, image, or planning tools
- implement working code rather than only advise
- review code for bugs and risks
- debug failing tests, builds, UI behavior, or runtime issues
- build or polish a frontend
- operate over a dirty worktree or respect repo-local instructions

Do not route here for simple code snippets, tiny algorithm explanations, or one-off SQL/regex/code transforms unless the user wants a coding-agent workflow.

## Core Shape

For Codex-style prompts, prefer Standard unless the user explicitly needs a compact strict-output prompt.

A good Codex prompt should define:

1. Role and working environment
2. Scope of the task
3. Autonomy and clarification rules
4. Codebase exploration rules
5. Tool and edit rules
6. Verification expectations
7. Final response expectations

Avoid adding visible plans, preambles, or status-update requirements by default. The Codex guide warns that prompting for upfront plans, preambles, or status updates can cause premature stopping in some Codex configurations. Add user updates only when the target is known to support them and the user asks for that behavior.

## Prompting Principles

- Bias the downstream agent toward working code, not advice-only output.
- Tell it to gather enough context before editing and to follow existing project patterns.
- Prefer root-cause fixes over narrow symptom patches.
- Require it to respect existing user changes and avoid reverting unrelated work.
- Make tool use explicit only where it changes behavior.
- For search, prefer fast codebase search such as `rg` when available.
- For file edits, prefer the target environment's patch/edit tool where available.
- For independent file reads or searches, instruct it to parallelize only when the target environment supports safe parallel tool use.
- For long tasks, require completion accounting: no unfinished checklist items in the final state unless explicitly blocked.
- For high-risk changes, require focused verification before finalizing.

## Coding-Agent Output Contract

Use one compact output contract. Include only the pieces that matter:

- Final answer should lead with what changed or what was found.
- For reviews, findings come first, ordered by severity, with file/line references.
- For implementation, include changed files and verification performed.
- If verification could not be run, say so plainly.
- Do not dump large file contents.
- Do not end with open-ended offers; suggest concrete next steps only when useful.

## Template

```markdown
# Role and Objective
You are a senior coding agent working in the user's repository. Complete the requested task end to end: inspect the relevant code, make the necessary changes, verify them, and report the outcome.

# Instructions
- Gather enough context before editing; follow existing architecture, naming, formatting, and helper patterns.
- Prefer the smallest correct change that fixes the root cause or completes the requested behavior.
- Use available tools deliberately: search before adding new helpers, patch files through the editing tool when possible, and avoid destructive git operations unless explicitly requested.
- Respect unrelated existing changes in the worktree.
- If a requirement is genuinely blocked, stop with the specific blocker and the smallest question needed.

# Verification
- Run the most relevant tests, build, type-check, or manual check available for the change.
- If a check cannot be run, explain why in the final answer.

# Output Format
- Start with a concise description of the outcome.
- Mention key files changed or findings found.
- Include verification performed.
- Keep the final response brief and practical.
```

## Specialized Variants

For code review prompts:

- Tell the agent to prioritize bugs, regressions, risks, and missing tests.
- Findings should lead the answer.
- Summaries are secondary and brief.
- If there are no findings, the agent should say so and note remaining risk.

For frontend prompts:

- Add product-quality expectations: responsive layout, real assets when needed, no overlapping text, polished states, and browser/screenshot validation when feasible.
- Tell the agent to preserve existing design systems unless the task asks for a redesign.

For debugging prompts:

- Require reproduction or log inspection first where feasible.
- Ask for the underlying cause, not just the first passing patch.
- Require a focused regression check.

For repo automation prompts:

- Specify exact allowed side effects.
- Separate read-only analysis, file edits, git staging, commits, pushes, and PR creation.
- Ask before irreversible or externally visible actions unless the user already requested them.
