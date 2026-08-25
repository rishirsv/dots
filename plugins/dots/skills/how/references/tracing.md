# Trace Code And Systems

Use this reference for question mode and as the tracing foundation for change
mode.

## Give Tracers A Causal Job

Give each tracer one question the source can answer. Name the target, the part
of the system to follow, the evidence to return, and what the other tracers are
covering. Ask for:

- the real entry point and what triggers it
- each consequential caller, callee, state transition, or data transformation
- the important types, boundaries, asynchronous handoffs, storage, and external
  effects needed to understand the path
- the visible result and important failure or alternate state
- exact source locations, uncertainty, conflicting evidence, untraced handoffs,
  and non-obvious behavior or sharp edges supported by source

A tracer should follow the runtime path, not inventory files. It may omit
unchanged plumbing that does not affect the explanation. It should stop only
when its assigned path reaches the visible result or a specifically named gap.

## Build One Coherent Model

For a narrow question, use the tracer's path as the evidence map and reconcile
any missing handoff before writing.

For parallel work, synthesis must connect the lanes rather than concatenate
their reports. Resolve differences caused by separate versions, entry points,
states, or definitions. When accounts genuinely conflict, state the conflict
and the evidence needed to settle it. Leave a missing handoff as an unknown; do
not bridge it with a plausible guess.

Choose one representative action, input, or state and carry it through the
system. Generalize only after the concrete path establishes the mechanism.
Include branches only when they change the result, recovery, trust
relationship, or answer.

## Teach At The Reader's Level

Treat the reader as intelligent without assuming codebase vocabulary they have
not used. Start with a short map of where the explanation is going. Introduce a
technical term only when it becomes useful, explain the behavior it names, and
then use the precise term consistently.

Name the runtime actor and responsibility before the file or symbol. A file
does not perform work; a process, component, service, function, or person does.
Use file and symbol names as supporting evidence, not as the explanation.

Adapt the structure to the question:

- **Operational workflow:** give the shortest runnable sequence, with proof or
  a decision note only where it changes what the reader should do.
- **Routing or responsibility:** compare trigger, responsible component,
  handoff, and result, then use one example to explain the ambiguous case.
- **System walkthrough:** explain what it does, its key actors, one end-to-end
  path, consequential states, and important gaps.
- **Data flow:** follow a real value from its origin through transformations,
  storage, external handoffs, and its visible use or failure.

## Evidence Check

Before delivery, verify that each causal claim points to source, each inference
shows its reasoning, and each unknown names the missing handoff. Remove detail
that does not help answer the question. If the reader would still need to open
the source to understand a consequential handoff, the trace is incomplete.
Link source locations that support distinct causal claims. Concentrate
navigation-only links in Where Things Live instead of linking every symbol
mention in the explanation.
