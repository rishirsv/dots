---
name: explain-code
description: "Use only when the user writes `$explain-code`. Investigate and explain code, systems, changes, diffs, commits, branches, or pull requests through delegated read-only tracing; not for critique, review, approval, implementation, or quick ELI5 explanations."
---

# Explain Code

Trace the actual source, then explain how the code or change works. Keep the
work read-only and explanatory; review and implementation belong elsewhere.

## Trace Before Explaining

Work out exactly which code or change the user means and whether they want chat
or HTML. Ask only when the ambiguity would change the work. Read
[tracing.md](references/tracing.md) before briefing tracers; for a diff, commit,
branch, pull request, or completed change, also read
[changes.md](references/changes.md).

Delegate the factual tracing:

- For a narrow question or localized change, send one read-only tracer to
  follow the relevant path and return source locations, causal steps, and gaps.
- For a cross-cutting system or substantial change, send two to four read-only
  tracers in parallel. Give each a different part to follow, such as entry and
  control flow, state changes, external handoffs, or test coverage. Do not split
  one path merely to reach a count.
- After parallel tracing, have a synthesis agent combine the reports, resolve
  disagreements, connect the end-to-end path, and point out anything no tracer
  reached. Keep the original source locations.

Inspect source directly only to close a specific conflict, missing handoff, or
evidence gap in the returned findings.

## Choose The Depth

**Question mode** answers the user's actual question. Trace only the execution,
responsibility, or data path needed to answer it. Stop when every consequential
step is grounded and no remaining gap changes the answer.

**Change mode** explains the complete meaningful change. Inventory behavior,
data, responsibilities, external handoffs, validation, and unfinished work
before writing. A narrow fix can be short; a pull request must account for every
meaningful change without giving supporting implementation equal weight.

## Explain The Result

Lead with the answer or visible result. Then explain the traced path at the
reader's level, using the change guidance when the target is a completed change.

Return chat unless the user asks for HTML or a durable, visual, or shareable
artifact. For HTML, pass `artifact-template.json` and the finished content and
structure to `$html`; it handles the page itself.

The explanation is complete when it answers the user's question or covers the
meaningful change, traces consequential claims to actual source, makes material
gaps visible, and can be understood without opening the repository.
