# Explain a complex subject

For a narrow question, inspect and explain in one pass. For a subsystem, split
the question into the few parts needed to trace its complete input-to-output or
trigger-to-effect path.

For code, find the real entry point and follow only the callers, callees, data
flow, and types needed for that path. Read the actual code. Stop when no step
requires hand-waving. Mention surprising behavior or proof gaps that change the
mental model.

Lead with where the reader is going and a short map. Adapt what follows:

- **Operational workflow:** Start with one compact runnable sequence,
  numbered only when numbering improves it. Add one brief proof or decision
  note for each step. Omit alternate variants and internal mechanics unless
  they change what the reader should do.
- **Comparison or routing question:** Start with a compact table of ownership,
  trigger, and output. Follow it with one or two examples that settle the
  ambiguous boundaries, then stop unless the user asks for comprehensive
  coverage.
- **Complete walkthrough:** Cover only what it is, its key concepts and flow,
  where relevant code lives, and consequential gotchas. Do not force headings.
