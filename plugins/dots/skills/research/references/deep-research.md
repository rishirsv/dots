# Deep Research

Read this after selecting deep research for a broad, ambiguous, high-impact, or
cross-cutting question. The base Research workflow already requires delegation;
this reference governs multi-worker decomposition, iteration, verification, and
synthesis.

## Decompose

Split the research contract into two to six questions whose source boundaries
do not overlap unnecessarily. Useful divisions include local architecture,
official documentation, current external behavior, prior art, risks, and
load-bearing claims that need independent verification.

Give every worker a bounded question, source boundary, evidence bar, compact
return shape, and stop condition. Dispatch independent workers concurrently.
If a question is too broad for one worker, split it before dispatch rather than
letting the worker wander.

## Iterate At Barriers

Use barriers where one evidence set changes the next decision:

- collect source reports before comparing local and external behavior
- collect competing evidence before resolving a contradiction
- collect verification reports before promoting a contested claim
- collect all conclusion-changing evidence before final synthesis

At each barrier, group reports by claim and decide what is answered, what is
contradicted, and what could still change the conclusion. Dispatch another
bounded worker only for a consequential gap or a promising but incomplete
line of evidence.

While workers run, the parent may refine briefs, track coverage, prepare the
synthesis structure, and update the user. It does not search or read underlying
code, documents, or web sources.

## Verify Claims

Use an independent verification worker for claims that are stale, surprising,
contested, high-impact, or weakly supported. Give it the claim, the compact
reports and citations that support it, and a mandate to refute or downgrade it.

Verification returns one of: supported, refuted, downgraded, contradicted, or
unresolved. Preserve disagreement when evidence does not justify resolution.
The parent decides what enters the final synthesis but delegates any new source
inspection.

## Dispatch Shapes

Adapt these concise briefs to the question:

```text
Trace <behavior> through <repo area>. Return the answer and implications,
supporting files/symbols/tests grouped by claim, contradictions, confidence,
gaps, and the next check that could change the answer. Do not edit files or
return broad source dumps.
```

```text
Verify current guidance for <API/product/standard>. Prefer primary sources.
Return supported claims, date/version constraints, source URLs, conflicts,
practical implications, confidence, and gaps. Do not return search logs or page
dumps.
```

```text
Challenge these claims using the supplied reports and, where needed, a bounded
independent source check. Return each claim as supported, refuted, downgraded,
contradicted, or unresolved, with concise evidence. Do not write the final
synthesis.
```

## Reports And Synthesis

For deep runs with saved worker evidence, assign each worker a disjoint path
under the repository's scratch convention. Use descriptive numbered names such
as `01-local-routing.md`, `02-current-api.md`, and `03-verification.md`.

The parent owns the final answer or durable report:

1. Group findings by claim rather than by worker.
2. Prefer directly supported and independently verified claims.
3. Preserve material contradictions and confidence limits.
4. Separate facts, inferences, recommendations, and open questions.
5. Return the best-supported partial answer when evidence cannot justify a
   confident conclusion.

Create a durable report only when the user requests one or repository
conventions make it the justified deliverable.
