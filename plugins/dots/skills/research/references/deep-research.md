# Deep Research

Read this when a research question is broad, ambiguous, high-impact, cross-cutting, or likely to benefit from multiple bounded investigations.

## When To Fan Out

Single-threaded research is the default. Use a deeper subagent-led flow only when the user explicitly asks for deep research or confirms a proposed dispatch, and at least two are true:

- The question spans multiple source classes, such as local code, official docs, ecosystem practice, issue trackers, and design tradeoffs.
- Several hypotheses need independent checking.
- The user needs a recommendation with evidence, not just a quick answer.
- Current web facts or product behavior materially affect the result.
- One agent's context would get crowded with raw evidence before synthesis.

Stay single-threaded when the question is narrow, the answer is already in a few local files, fan-out would mostly duplicate work, or the user has not approved a multi-agent research pass.

Before dispatch, tell the user the planned source classes, approximate number of subagents, and stop condition. In headless or non-interactive contexts, fan out only when the original request clearly asks for deep research.

## Decomposition

Run deep research in three passes:

1. Plan: list 3-6 subquestions with source boundaries, budgets, and stop conditions.
2. Retrieve: search each subquestion and follow 1-2 second-order leads when they could change the conclusion.
3. Synthesize: group evidence by claim, resolve contradictions, and write the durable report with one final `Sources` section.

Turn the research contract into subquestions with explicit source boundaries. Good splits include:

- Codebase architecture: "Trace how this behavior works locally and record files."
- Official documentation: "Verify current API behavior and record docs."
- Prior art: "Find comparable approaches and tradeoffs."
- Risk review: "Look for failure modes, security concerns, migration risks, and missing proof."
- Decision synthesis: "Compare evidence from other subagents and identify what remains unresolved."

Avoid sending multiple agents the same broad prompt. If two agents have the same source class and question, tighten the split or use one agent.

## Dispatch Patterns

Use these as starting points and adapt them to the research contract:

| Pattern | Use When | Source Boundary | Expected Output |
|---|---|---|---|
| Repo conventions | The answer depends on how this repository wants work done | Repository instructions, README, contribution docs, existing plans or decision docs | Conventions, required paths, workflow constraints, and conflicts |
| Implementation patterns | The answer depends on existing local architecture or examples | Target modules, tests, call sites, nearby implementations | Existing pattern, files to follow, edge cases, and missing proof |
| Official docs/current API | The answer depends on external APIs, SDKs, standards, or current behavior | Official docs, specs, release notes, package docs, changelogs | Current behavior, version constraints, deprecations, and source links |
| Prior art/web landscape | The answer benefits from external examples or alternatives | Primary project docs, reputable engineering writeups, papers, market/product docs | Named approaches, tradeoffs, source authority, and relevance |
| Risk review | The answer needs failure modes before a recommendation | Local code risks, security/performance constraints, issue trackers, postmortems | Risks, likelihood, mitigation options, and blocking unknowns |
| Synthesis support | The parent needs a second pass over gathered evidence | Subagent reports and source list only | Contradictions, convergence, unsupported claims, and confidence |

## Subagent Prompt Shape

Give each subagent a purpose-built brief. The prompt should make the research
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

If a requested subagent scope is too broad, split it before dispatch. If a
subagent receives an unbounded prompt anyway, it should return `Scope too broad`
with a recommended split instead of wandering.

## Synthesis

The parent agent owns synthesis and writes the durable deep research report. Subagents gather evidence; they do not make final product decisions or write the report.

After subagents report:

1. Group findings by claim, not by subagent.
2. Prefer primary and local evidence over secondary commentary.
3. Mark contradictions and decide whether they block the answer.
4. Keep raw subagent notes scratch-only unless the user requested saved evidence.
5. Write a durable deep research report in the repository-conventional location.

If the evidence does not support a confident recommendation, return the best-supported partial answer and the specific research needed next.
