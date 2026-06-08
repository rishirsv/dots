# Isolated Thread Trial Workflow

## Purpose

Add a shared Meta-Skill workflow for testing one skill draft or candidate edit in
an isolated Codex child thread. This is not the full eval system. It is the
lightweight path for one prompt, one isolated thread, and one inspectable
result.

## Decisions

- Use a Codex project worktree thread by default. The worktree snapshots the
  current working tree, so a newly written skill or candidate edit can be tested
  without landing it in the parent checkout.
- Keep local child threads as a fallback only when the task is read-only and
  does not need file isolation.
- Do not make this mandatory for every `skill-writer` run. Offer it after
  deterministic validation, and use it when the user asks for one-off testing or
  when the skill is high-risk enough that one isolated trial changes confidence.
- For `skill-doctor`, candidate edits happen in a child worktree when possible.
  The child proposes and demonstrates; the parent decides what to apply to the
  source skill.
- Share one plugin-level reference so `skill-writer` and `skill-doctor` use the
  same isolated-thread contract.

## V1 Workflow

1. Parent identifies the target skill path and one realistic prompt.
2. Parent creates a project worktree child thread from the current working tree.
3. Child receives a compact prompt with:
   - target skill path
   - prompt to test
   - expected behavior or review lens
   - instruction to return a structured result block first
4. Child runs the prompt or review in isolation.
5. Child returns:
   - status
   - whether the skill helped or the candidate improved behavior
   - evidence summary
   - recommended next action
6. Parent records only compact evidence when needed:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

The child thread and its worktree remain the heavy evidence surface.

## Skill Writer Use

After creating and validating a new skill, `skill-writer` may offer an isolated
test. If requested, it creates a child worktree thread seeded with the draft
skill and asks the child to try one should-trigger prompt.

The trial is not release proof. It is a fast signal for activation, runtime
clarity, and obvious missing resources.

## Skill Doctor Use

For one-off improvement, `skill-doctor` may create a child worktree thread that
applies or tests a candidate edit there. The parent reads the result and applies
the approved source edit in the parent checkout only when the user authorized
payload changes.

This keeps prompt-doctor work small and inspectable without turning every
improvement into a full evaluation suite.

## Current Tool Boundary

The current `create_thread` tool supports project targets with `local` or
`worktree` environments. It does not expose an immediate environment setup
script parameter. For V1, the environment script idea is represented by the
worktree snapshot plus explicit child prompt instructions. If a future tool
adds setup config for immediate thread creation, this workflow can seed a
purpose-built setup script without changing the parent/child contract.
