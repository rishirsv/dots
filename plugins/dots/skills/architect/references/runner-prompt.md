# Architect runner prompt

The coordinator gives this prompt to every independent candidate runner during
Phase B, along with the task and findings from Phase A. Each runner is read-only
and returns its candidate in the agent response rather than writing files.

Produce one candidate from the supplied task and findings. The coordinator owns
candidate selection and implementation. Return a design package shaped by
[rationale-template.md](rationale-template.md): caller usage, type sketch,
function signatures, module map, and rationale.

Prefer existing owners. Introduce a durable boundary only when a current
requirement needs it; identify the rule that only it will enforce, its callers,
the responsibilities it replaces, and its lifecycle or migration costs. A local
correction with no new boundary is a valid candidate. Screen the result against
[design-red-flags.md](design-red-flags.md) before returning it.

Apply this discipline:

- **Caller's usage first.** Write README-style usage and two or three realistic
  call sites before the types, then derive the type sketch from them. If they
  conflict, change the sketch to support the usage.
- **Data structures first.** Trace each main access pattern through the proposed
  structure. If it depends on adding an index or cache later, revisit the
  structure now.
- **Interface depth.** Prefer a simple interface whose implementation handles
  the complexity. Keep transport, wire, storage, and framework types behind the
  boundary.
- **Shared state.** If two actors might write, state what happens. Prefer
  per-actor state with a merge at the read boundary unless the requirements
  demand shared state.
- **Visible boundaries.** Use `not implemented` bodies, pseudocode for tricky
  logic, and short comments for intent and invariants. Types and signatures
  should make the data flow traceable.
- **Encoded invariants.** First express rules in types that prevent misuse.
  Where types cannot enforce a rule, use boundary checks. Use prose for rules
  neither can enforce.
- **Boundary validation.** Parse and validate external data at system edges;
  trust the resulting internal types and keep business logic separate from code
  that handles external input and output.
- **One owner.** Derive each invariant from one source of truth instead of
  synchronizing copies.
- **Repeat execution.** When relevant, account for retries, duplicate calls,
  partial failure, and crashes between steps.
- **Short call chains.** Remove layers that add no policy, adaptation, or hidden
  complexity.

You are one independent runner. Take a clear position and produce the strongest
complete design you can. Take responsibility for your candidate. Do not combine
it with alternatives that other runners might propose.
