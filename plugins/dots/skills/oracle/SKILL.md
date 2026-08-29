---
name: oracle
description: "Use only when the user selects `$oracle` to request critique, missing-proof checks, or implementation guidance from an external or differently specialized model; not for routine local work, subagent review, or orchestration."
---

# Oracle

Get advice from an external or differently specialized model. The oracle
advises; the primary agent applies, verifies, and owns the work.

Use Oracle when a second model could change a decision about a plan,
implementation, architecture, missing proof, or stalled investigation. Do not
use it for routine local work, subagent review, orchestration, or implementation
handoff.

## Choose the handoff

Inspect the available advisors and how each can receive context. Honor a
provider the user names when it is available. Do not assume model names,
relative strength, repository access, attachment support, or context limits.

- If the advisor can inspect the repository, give it the repository, revision,
  and a few useful file or symbol pointers. Attach only essential local changes
  or evidence it cannot access.
- If the advisor can read the local workspace, use exact paths rather than an
  archive.
- If the advisor needs attachments, create a prompt and the smallest context
  archive that supports the decision.
- If the user names no provider, create a local Desktop handoff containing the
  prompt and any required local context. Do not call or upload it.

Before an external call or upload, name the provider, the content being sent,
and any likely cost, then get approval. Never send credentials. Get explicit
approval before sending private or proprietary material.

## Frame the request

State the question or decision and the advice needed. Add the current
hypothesis, alternatives, or evidence that would change the answer only when
they help the advisor decide. Do not turn a focused question into a general
review.

Package evidence only when the advisor cannot reach it directly. Include a file,
excerpt, error, test, or constraint only when a likely claim depends on it. Point
to an accessible review method or repository source instead of copying its full
procedure into the prompt. Read
[context-development.md](references/context-development.md) only when the right
evidence boundary is unclear.

Write a standalone prompt that identifies the decision, relevant facts and
constraints, available context, and the answer the primary agent needs next.
Tell the advisor to identify the smallest missing context that would materially
change its answer rather than guessing.

## Build an attachment handoff

Use [oracle_package.py](scripts/oracle_package.py) only for a Desktop or
attachment handoff. Prepare the authored prompt under `.agents/tmp/`, preview
the exact package, then build it:

```bash
python3 plugins/dots/skills/oracle/scripts/oracle_package.py \
  --prompt-file .agents/tmp/oracle-prompt.md \
  --file src/parser.ts \
  --file tests/parser.test.ts \
  --dry-run

python3 plugins/dots/skills/oracle/scripts/oracle_package.py \
  --prompt-file .agents/tmp/oracle-prompt.md \
  --file src/parser.ts \
  --file tests/parser.test.ts
```

Omit `--file` for a prompt-only handoff. The default destination is
`~/Desktop/oracle-<prompt-topic>/`; pass `--output-dir` when the user chooses a
different exact directory. Inspect `prompt.md` and any `context.zip` entries
before reporting the handoff ready.

## Use the answer

Explain the recommendation and any material disagreement with local evidence.
Verify claims that affect the next decision before adopting them. If no provider
was called, say that the handoff is ready and no model answer has been retrieved.
