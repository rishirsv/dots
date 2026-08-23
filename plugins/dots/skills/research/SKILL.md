---
name: research
description: "Research a question and produce an evidence-backed answer through delegated source investigation. Use only when the user writes `$research`; not for implementation or formal planning."
---

# Research

Research the user's question or topic and return an evidence-backed answer. Delegate
source investigation by default. Use the main task to frame the question, check
coverage, reconcile findings, and write the answer; keep searches and long
excerpts with the researchers.

## Workflow

1. Define the question, scope, intended output, and what would count as enough
   evidence. Share that framing in one compact update. The frame is ready when
   a researcher can tell what to answer, which sources and time period count,
   and what evidence would support, qualify, or leave the answer open.
2. Dispatch one researcher by default. Use several in parallel only when they
   cover independent questions or source types. Work directly only for a
   trivial lookup in one known, bounded source; delegate any search, survey,
   comparison, or substantial reading. Dispatch is complete when every
   necessary question is assigned to a researcher or explicitly qualifies for
   the direct-lookup exception, and every researcher brief follows the
   requirements below.
3. Evaluate the reports and synthesize by claim. Reuse the same researcher for
   clarification or a source follow-up; use a fresh researcher when independent
   verification would change confidence. Continue until every important
   question is answered or left as a visible gap, conflicting evidence is
   reconciled or preserved, and each consequential claim has suitable support.

If delegation is unavailable or forbidden, return the strongest bounded result
and state the coverage limit instead of silently loading a broad corpus into the
main task.

## Brief Researchers

Every brief names the question, source boundary, relevant date or version,
evidence standard, return shape, stopping condition, and read-only constraint.

Every report leads with the answer and implications, followed by claim-level
citations, confidence, contradictions, gaps, and useful next checks. Save
detailed notes only when they must survive the session or would overflow the
compact return. Follow the repository's scratch convention and return the path
when notes are saved.

Choose the researcher by evidence source:

- **Codebase**: trace relevant files, symbols, flows, tests, commands, and
  observed behavior. Report what exists before recommending change.
- **Web and documentation**: prefer current primary sources, record dates or
  versions when freshness matters, and report conflicting guidance.
- **Mixed**: use separate local and external workers when their searches are
  independent, then compare their reports in the main task.
- **Verification**: give a fresh researcher the claims and cited reports to
  challenge. For each claim, it returns one verdict: supported, refuted,
  downgraded, contradicted, or unresolved. It does not write the final answer.

## Deep Research

For broad, ambiguous, high-impact, or cross-cutting questions that need several
researchers, iterative follow-up, or adversarial verification, read
[deep-research.md](references/deep-research.md) before dispatching. Use it to
divide the work, check reports between waves, verify contested claims, and save
research notes when needed.

## Return The Answer

Lead with the conclusion or recommendation, followed by evidence, important
tradeoffs, contradictions, and gaps. Cite claims close to where they are used.
Read [report-standards.md](references/report-standards.md) only when saving an
artifact. Research may inform a plan; use `$plan` when the user wants one.
