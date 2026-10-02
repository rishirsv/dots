# Trace Code And Systems

Use this reference for question mode and as the tracing foundation for change
mode.

## Assign Each Tracer A Question

Give each tracer one question the source can answer. Name the target, the part
of the system to follow, the evidence to return, and what the other tracers are
covering. Ask for:

- the real entry point and what triggers it
- each caller, callee, state transition, or data transformation that affects the answer
- the important types, boundaries, asynchronous handoffs, storage, and external
  effects needed to understand the path
- the visible result and important failure or alternate state
- exact source locations, uncertainty, conflicting evidence, untraced handoffs,
  and unexpected behavior or failure risks supported by source

Each tracer follows the runtime path. A file list does not show that path.
It can omit unchanged supporting code that does not affect the explanation. It should stop only
when its assigned path reaches the visible result or a specifically named gap.

## Connect The Findings

For a narrow question, use the traced path to organize the evidence.
Investigate any missing handoff before writing.

For parallel work, connect the paths found by each tracer. Explain how one
path passes control or data to the next. Resolve differences caused by separate versions, entry points,
states, or definitions. If the accounts conflict, state the conflict
and the evidence needed to settle it. Leave a missing handoff as an unknown; do
not fill it with a guess.

Choose one representative action, input, or state and carry it through the
system. Explain the general mechanism only after showing how the example works.
Include branches only when they change the result, recovery, trust
relationship, or answer.

## Teach At The Reader's Level

Treat the reader as intelligent without assuming codebase vocabulary they have
not used. Start with a short map of where the explanation is going. Introduce a
technical term only when it becomes useful, explain the behavior it names, and
then use the precise term consistently.

Name the process, component, service, function, or person that performs the
action. Explain its responsibility before giving its file or symbol. A file
does not perform work; a process, component, service, function, or person does.
Use file and symbol names as supporting evidence, not as the explanation.

Adapt the structure to the question:

- **Operational workflow:** give the shortest runnable sequence, with verification or
  an explanation of a decision only where it changes what the reader should do.
- **Routing or responsibility:** compare trigger, responsible component,
  handoff, and result, then use one example to explain the ambiguous case.
- **System walkthrough:** explain what it does, its key actors, one end-to-end
  path, states that affect the result, and important gaps.
- **Data flow:** follow a real value from its origin through transformations,
  storage, external handoffs, and its visible use or failure.

## Evidence Check

Before delivery, verify that each claim about cause and effect points to source, each inference
shows its reasoning, and each unknown names the missing handoff. Remove detail
that does not help answer the question. If the reader would still need to open
the source to understand a handoff that affects the answer, the trace is incomplete.
Link source locations that support separate claims about cause and effect. Concentrate
navigation-only links in Where Things Live instead of linking every symbol
mention in the explanation.
