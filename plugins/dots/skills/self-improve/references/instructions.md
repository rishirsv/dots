# Instruction Files

Use this reference when a proposal targets agent instructions. Apply the edit
authorization in Self-Improve's parent skill: an explicit request to audit and
implement instruction changes already authorizes supported edits in that scope.
For proposal-only work, obtain approval of the exact rule and target before editing.

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

Use the generalization gate in [thread-evidence.md](thread-evidence.md) for
claims about repeated behavior. A source-visible contradiction can support a
narrow correction without inventing a history of failures; one task can also
support an exact durable behavior the user explicitly requests.

For every proposal:

1. Cite the governing files and any supporting thread clusters. Distinguish a
   source correction from a behavior claim that still needs transcript evidence.
2. Show the exact rule and target file.
3. Explain why a check, skill, doc, or memory note is not the stronger home.
4. Check whether the request already authorizes the rule and target scope.
   Wait for approval only when that authority is missing or a material decision
   remains unresolved.
5. Re-read the current file, apply the smallest edit, and inspect the merged
   instruction chain for contradictions.
6. Run the relevant repository checks and report what they prove.
