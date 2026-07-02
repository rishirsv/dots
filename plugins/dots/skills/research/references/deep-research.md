# Deep Research

Read this when a research question is broad, ambiguous, high-impact,
cross-cutting, or likely to benefit from multiple bounded investigations.

Deep research is a parent-led orchestration pattern. The parent scopes the
question, dispatches bounded workers only when the user has authorized parallel
agent work, collects evidence at barrier points, pressure-tests important
claims, and writes the synthesis. Delegated workers gather and verify evidence;
they do not own the final decision.

## When To Fan Out

See SKILL.md's "Runtime Flow" section for the default invocation and delegation
framing. Use multiple workers only when at least two are true:

- The question spans multiple source classes, such as local code, official docs, ecosystem practice, issue trackers, and design tradeoffs.
- Several hypotheses need independent checking.
- The user needs a recommendation with evidence, not just a quick answer.
- Current web facts or product behavior materially affect the result.
- One worker's context would get crowded with raw evidence before synthesis.

Stay with direct parent-agent research when the user asks for a quick/simple
answer, forbids delegation, no delegation mechanism is available, the answer is
already in a few local files, or delegation would mostly duplicate a two-minute
lookup.

Before dispatch, tell the user the planned source classes, approximate number
of workers, and stop condition. In headless or non-interactive contexts, fan out
only when the original request clearly asks for deep research or the Research
workflow invocation itself supplies the research task.

## Decomposition

Run deep research in four passes:

1. Plan: list 3-6 subquestions with source boundaries, budgets, and stop conditions.
2. Retrieve: search each subquestion and follow 1-2 second-order leads when they could change the conclusion.
3. Verify: identify load-bearing claims and adversarially check disputed,
   surprising, current, high-impact, or weakly supported claims.
4. Synthesize: group evidence by claim, resolve contradictions, and write the
   durable report with one final `Sources` section.

Turn the research contract into subquestions with explicit source boundaries. Good splits include:

- Codebase architecture: "Trace how this behavior works locally and record files."
- Official documentation: "Verify current API behavior and record docs."
- Prior art: "Find comparable approaches and tradeoffs."
- Risk review: "Look for failure modes, security concerns, migration risks, and missing proof."
- Decision synthesis: "Compare evidence from other workers and identify what remains unresolved."

Avoid sending multiple workers the same broad prompt. If two workers have the
same source class and question, tighten the split or use one worker.

## Orchestration

Use the active harness's delegation mechanism when one is available and
explicitly authorized. Choose the worker role or prompt shape from the slice:

- Research worker: bounded codebase, documentation, web, or technical-option
  research.
- Exploration worker: narrow codebase discovery, file finding, symbol tracing,
  and quick local orientation.
- Adversarial reviewer: pressure-test a research summary, candidate
  recommendation, prompt, workflow, or individual high-impact claim.
- Implementation worker: implement only after research has produced a concrete
  approved change with a disjoint write scope.

Use barriers deliberately:

- Collect all source-lane reports before deduping overlapping evidence.
- Collect local and external facts before deciding whether they align.
- Collect adversarial reviews before promoting a contested claim.
- Collect implementation-worker results before final integration.

Do not block the main thread on a worker unless the next critical-path action
needs that result. While workers run, continue non-overlapping local work such
as reading repository instructions, preparing the synthesis outline, or checking
source conventions.

## Claim Verification

Borrow the useful part of workflow-harness deep research: make important claims
earn their place in the answer. This is not mandatory for every run; use it when
the recommendation depends on claims that are likely to be stale, contested,
surprising, high-impact, or thinly sourced.

A verification pass should:

- turn evidence into falsifiable or checkable claims;
- ask one or more independent reviewers to refute or downgrade each claim;
- default ambiguous evidence toward lower confidence;
- preserve contradictions instead of smoothing them away;
- promote only claims that survive with enough support for the user's decision.

For expensive web-heavy research, a 3-reviewer majority rule is a good pattern:
if at least two reviewers refute a claim, drop it or mark it unsupported. For
ordinary codebase or mixed research, one focused adversarial reviewer is often
enough.

## Dispatch Patterns

Use these as starting points and adapt them to the research contract:

| Pattern | Use When | Source Boundary | Expected Output |
|---|---|---|---|
| Repo conventions | The answer depends on how this repository wants work done | Repository instructions, README, contribution docs, existing plans or decision docs | Conventions, required paths, workflow constraints, and conflicts |
| Implementation patterns | The answer depends on existing local architecture or examples | Target modules, tests, call sites, nearby implementations | Existing pattern, files to follow, edge cases, and missing proof |
| Official docs/current API | The answer depends on external APIs, SDKs, standards, or current behavior | Official docs, specs, release notes, package docs, changelogs | Current behavior, version constraints, deprecations, and source links |
| Prior art/web landscape | The answer benefits from external examples or alternatives | Primary project docs, reputable engineering writeups, papers, market/product docs | Named approaches, tradeoffs, source authority, and relevance |
| Risk review | The answer needs failure modes before a recommendation | Local code risks, security/performance constraints, issue trackers, postmortems | Risks, likelihood, mitigation options, and blocking unknowns |
| Synthesis support | The parent needs a second pass over gathered evidence | Worker reports and source list only | Contradictions, convergence, unsupported claims, and confidence |

## Worker Prompt Shape

Give each worker a purpose-built brief. The prompt should make the research
slice obvious without forcing every run into the same fields.

Good prompts usually name:

- the question, decision, or claim to investigate
- the source boundary and any date/version constraint
- the evidence standard and citation expectations
- the output the parent needs for synthesis, with the answer and implications
  before source inventory
- no-edit constraints and any assigned report path
- the budget or stop condition when the slice could sprawl

Use concise shapes like these and adapt them:

```text
Trace <behavior> through <repo area>. Identify the relevant files, symbols,
tests, and missing proof. Return answer, what it means, supporting evidence
grouped by claim, caveats, confidence, next checks, and a compact audit trail.
Do not edit code.
```

```text
Verify current guidance for <external API/product/standard>. Prefer primary
sources. Return supported claims, version/date constraints, source URLs,
practical implications, conflicts, confidence, and a compact source audit trail.
```

```text
Compare these subreports for contradictions and unsupported claims. Use only the
provided reports and source lists. Return convergence, disagreements, evidence
gaps, and confidence.
```

Do not hard-code local directory names into reusable prompt bodies. Put
repo-specific paths only in the parent prompt for a specific run when the
repository conventions or assigned report path require them.

If a requested worker scope is too broad, split it before dispatch. If a worker
receives an unbounded prompt anyway, it should return `Scope too broad`
with a recommended split instead of wandering.

## Synthesis

The parent agent owns synthesis and writes the durable deep research report.
Delegated workers gather evidence; they do not make final product decisions or
write the report.

Use `research.md` for the parent synthesis. Use numbered subreport names that
describe the source class and question, such as
`01-codebase-routing-patterns.md`, `02-official-docs-current-api.md`, or
`03-risks-and-gaps.md`. Add `99-source-audit.md` only when the source inventory
or command trail is large enough to distract from the subreports.

After workers report:

1. Group findings by claim, not by worker.
2. Prefer primary and local evidence over secondary commentary.
3. Mark contradictions and decide whether they block the answer.
4. Preserve verification results for load-bearing claims: supported, refuted,
   downgraded, contradicted, or unresolved.
5. Write a durable deep research report in the repository-conventional location.

If the evidence does not support a confident recommendation, return the best-supported partial answer and the specific research needed next.
