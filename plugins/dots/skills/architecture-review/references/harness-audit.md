# Harness Audit

Review the software around an AI model for avoidable cost, lost context, and
duplicated policy. Aim to lower price-weighted token cost per completed task
without reducing task quality. Keep the parent skill's candidate-first scope
and implementation authorization; an audit does not authorize edits or commits.

Apply these checks to the agent subsystem in scope. A repository containing
only agent instructions or skills supports an instruction review, but runtime
findings require access to the harness implementation or traces.

## Map and measure

Locate request assembly, system instructions, tool definitions and loading,
tool-result formatting, retrieval, history and compaction, and agent spawning.
Identify who owns each instruction and decision, including framework or SDK
hooks that determine the actual request.

Inspect representative rendered requests and execution traces, not just prompt
templates. Look for duplication, volatile values in reusable context, retries,
and information that disappears between turns. Check current provider docs for
the models in use: billing categories, caching rules, and required continuation
items. Treat these as provider contracts rather than universal prompt patterns.

Use available usage data to establish:

- Cost by source and billing type: instructions, tool schemas, setup, user
  messages, tool results, history, summaries, and subagents; distinguish output,
  uncached input, and cached input. Label section attribution as estimated when
  only request-level billing is available, and avoid double-counting history.
- Turns, retries, tool errors, latency, and cache reuse per task, including the
  entire subagent tree and failed attempts.
- Which tools are used across representative tasks, and which fail or must be
  available immediately.

If telemetry is missing, propose the smallest instrumentation needed to measure
the suspected waste. Continue with supported structural findings, but mark
savings and quality effects as unmeasured. Do not turn another team's reported
percentage into an estimate for this harness.

## Inspect the likely sources of waste

Use the relevant checks below, guided by the observed spend and failures.

- **Instructions and injected context.** Classify material as keep, rewrite,
  delete, or load on demand. Preserve product knowledge, environment constraints,
  and rules tied to observed failures. Look for repeated tool descriptions,
  conflicting owners, and obsolete workarounds. Treat removals as hypotheses to
  validate on the current model. Moving text between message roles changes its
  authority; preserve that contract when changing request layout. Improve what
  the harness supplies rather than telling the model to conserve tokens or do
  less work.
- **Tool discovery.** Keep frequent and immediately required tools available.
  Consider loading rare schemas on demand only when discovery and invocation
  remain reliable. A smaller tool list that causes extra searches or calls to
  absent tools can cost more overall.
- **Reusable request context.** Check deterministic tool order and serialization,
  stable message prefixes, and placement of timestamps or request-specific data.
  Evaluate cache boundaries using the provider's supported behavior. Preserve
  instruction authority and conversation semantics while improving reuse.
- **Tool results and retrieval.** Find oversized logs, repeated paths or headers,
  and unnecessary formatting. Consider returning a useful excerpt plus a durable,
  accessible file location for large outputs. Preserve a way to retrieve omitted
  details. Evaluate retrieval by whether it finds needed evidence and reduces
  exploration turns, not just by the size of each result. Trace recurring tool
  errors to argument, environment, provider, or harness causes.
- **Long-run memory.** Check that compaction preserves decisions, constraints,
  unfinished work, and access to details it omits. Look for notes that grow by
  appending instead of replacing stale state. Preserve provider-required history
  and reasoning continuation items; removing them can force reconstruction or
  break continuity. Test summary changes on tasks that cross compaction.
- **Agent coordination and model fit.** Measure duplicated exploration, stale
  handoffs, and coordination overhead across the whole tree. Assess edit formats,
  tool descriptions, and targeted instructions against actual model failures.
  Model routing, reasoning effort, and division of work are separate design
  candidates with quality and cache consequences, not automatic cost fixes.

## Rank and validate candidates

Prioritize candidates by observed share of spend, plausible removable work, and
quality risk. Connect each to its owner and concrete evidence. Include estimated
savings only with a stated basis; otherwise name the measurement needed. Add the
validation and rollback approach to the parent skill's candidate report.

For authorized implementation, keep changes independently reversible. Use flags
or isolated experiments when prompt, schema-loading, output-format, compaction,
or coordination changes need comparison. Even apparently mechanical cache or
formatting changes must preserve request semantics and information access.

Compare before and after on a fixed set of realistic tasks drawn from usage,
including short or ambiguous requests and relevant failure cases. Measure cost
per completed task alongside success, turns, tool errors, and latency. For a
deployed product, use an authorized controlled rollout to check the real task
mix; offline evaluations alone do not establish production savings.

Report measured improvements, null results, and unresolved gaps separately.
Recommend rollout only when cost improves without a quality or reliability
regression beyond measurement noise. Without adequate success measurements,
describe the result as a candidate or experiment, not a proven optimization.
