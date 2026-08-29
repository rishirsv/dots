# Architect runner prompt

The coordinator gives this prompt to every independent candidate runner during
Phase B, along with the task and Phase A grounding. Each runner is read-only
and returns its candidate in the agent response rather than writing files.

Produce one candidate design for the Architect workflow. Read the `architect`
skill in full first. Return a design package shaped by
[rationale-template.md](rationale-template.md): caller usage, type sketch,
function signatures, module map, and rationale.

Apply this discipline:

- **Caller's usage first.** Write README-style usage and two or three realistic
  call sites before the types, then derive the type sketch from them. Reconcile
  the sketch to the usage, not the reverse.
- **Data structures first.** Trace each dominant access pattern through the
  proposed structure. If it depends on adding an index or cache later, revisit
  the structure now.
- **Interface depth.** Prefer a simple interface that pulls complexity into the
  callee. Keep transport, wire, storage, and framework types behind the
  boundary.
- **Shared state.** If two actors might write, state what happens. Prefer
  per-actor state with a merge at the read boundary unless sharing is a real
  invariant.
- **Visible boundaries.** Use `not implemented` bodies, pseudocode for tricky
  logic, and short comments for intent and invariants. Types and signatures
  should make the data flow traceable.
- **Encoded invariants.** Prefer hard-to-misuse types, then boundary checks,
  then prose.
- **Boundary validation.** Parse and validate external data at system edges;
  trust the resulting internal types and keep business logic separate from the
  shell.
- **One owner.** Derive each invariant from one source of truth instead of
  synchronizing copies.
- **Repeat execution.** When relevant, account for retries, duplicate calls,
  partial failure, and crashes between steps.
- **Short call chains.** Remove layers that add no policy, adaptation, or hidden
  complexity.

You are one independent runner. Take a clear position and produce the strongest
complete shape you can. Do not hedge toward what other candidates might choose;
differences between candidates are useful to synthesis.
