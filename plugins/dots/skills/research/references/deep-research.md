# Deep Research

## Decompose

Split the research question into two to six parts whose source boundaries do
not overlap unnecessarily. Useful divisions include local architecture,
official documentation, current external behavior, prior art, risks, and
important claims that need independent verification.

Give every researcher a focused question, source boundary, evidence bar, compact
return shape, and stop condition. Dispatch independent researchers concurrently.
If a question is too broad for one researcher, split it before dispatch.

## Check Reports Before The Next Wave

Wait for related reports when they affect what to investigate next:

- collect source reports before comparing local and external behavior
- collect competing evidence before resolving a contradiction
- collect verification reports before promoting a contested claim
- collect all conclusion-changing evidence before final synthesis

Group reports by claim and decide what is answered, what is contradicted, and
what could still change the conclusion. Dispatch another researcher only for
an important gap or a promising but incomplete line of evidence.

While researchers run, refine briefs, track coverage, prepare the answer, and
update the user. Keep underlying source searches and reading with the
researchers.

## Verify Claims

When a claim is stale, surprising, contested, high-impact, or weakly supported,
decide whether an independent check could change confidence. If so, give a
fresh researcher the claim, the compact reports and citations that support it,
and a mandate to refute or downgrade it.

Use the verification verdicts defined in the main skill. Preserve disagreement
when evidence does not justify resolution. Decide what enters the final answer,
but delegate any new source inspection.

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
independent source check. Return a verification verdict for each claim with
concise evidence. Do not write the final synthesis.
```

## Reports And Synthesis

For deep runs with saved evidence, assign each researcher a separate path
under the repository's scratch convention. Use descriptive numbered names such
as `01-local-routing.md`, `02-current-api.md`, and `03-verification.md`.

Write the final answer or report in the main task:

1. Group findings by claim rather than by worker.
2. Prefer directly supported and independently verified claims.
3. Preserve important contradictions and confidence limits.
4. Separate facts, inferences, recommendations, and open questions.
5. Return the best-supported partial answer when evidence cannot justify a
   confident conclusion.

Create a durable report only when the user requests one or repository
conventions make it the justified deliverable.
