# Instruction Files

Use this reference when a proposal targets agent instructions. Self-Improve
may apply an instruction change only after the user approves the exact rule and
target file.

## Choose the platform surface

| Runtime | Project instructions | Personal instructions | Generated memory |
|---|---|---|---|
| Codex | closest in-scope `AGENTS.md` or `AGENTS.override.md` | `~/.codex/AGENTS.md` | `~/.codex/memories/` |
| Claude Code | closest in-scope `CLAUDE.md` or `.claude/rules/*.md` | `~/.claude/CLAUDE.md` | `~/.claude/projects/<project>/memory/` |

Claude Code does not load `AGENTS.md` directly. When a repository uses shared
instructions, prefer a small `CLAUDE.md` containing `@AGENTS.md`, with only
genuinely Claude-specific guidance below it. Do not duplicate the shared rules.

Generated memory is not an instruction file. Propose memory additions or
deletions for the user to review; do not silently rewrite auto-memory or Codex
memory stores.

## Choose the closest scope

Put a rule in the narrowest file that covers every place it should apply:

- personal defaults that hold across repositories belong in the personal file;
- repository-wide commands and conventions belong at the repository root;
- component-specific rules belong in the closest nested instruction file or
  path-scoped Claude rule;
- deterministic requirements belong in tests, linters, or validators instead
  of prose;
- long procedures belong in a skill or durable document, linked from the
  instruction file only when every session needs the pointer.

Before writing, verify how the active runtime discovers and merges instruction
files. Check existing imports and nested files so the proposal does not create
duplicate or contradictory guidance.

## Write observable rules

Describe behavior an agent can follow and a reviewer can verify:

- Weak: `Handle errors gracefully.`
- Strong: `On a failed write, preserve the user's input and show a recoverable
  error; do not clear the form.`

For a non-trivial rule, capture:

```text
Scope: when and where the rule applies
Rule: the observable decision
Why: the evidence-backed reason
Exceptions: when deviation is allowed
Source: approved thread, review, or decision
```

Short commands and settled conventions can remain one line. Delete or replace
stale text instead of appending another layer.

## Evidence and edit gate

Require repeated mistakes, repeated review feedback, or durable context the
user keeps re-explaining. One isolated bug is not an instruction rule.

For every proposal:

1. Cite the supporting thread cluster and governing files.
2. Show the exact rule and target file.
3. Explain why a check, skill, doc, or memory note is not the stronger home.
4. Wait for approval.
5. Re-read the current file, apply the smallest edit, and inspect the merged
   instruction chain for contradictions.
6. Run the relevant repository checks and report what they prove.
