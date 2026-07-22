---
name: research
description: "Produces evidence-backed answers and reports from delegated research across code, docs, web sources, and technical options. Use when explicitly asked for research, a research report, or deep research; not for implementation or formal planning."
---

# Research

Produce evidence-backed answers and research reports through delegated
researchers. The parent thread scopes the question, dispatches workers,
evaluates their reports, requests follow-up, and writes the synthesis. Workers
perform all codebase searches, source reads, web searches, and evidence
collection.

## Workflow

1. State the question, scope, intended output, and what will make the research
   complete. Keep this to one compact update unless the user requested a formal
   research contract.
2. Dispatch at least one bounded research worker. Split independent source
   classes, claims, or open questions into separate workers when that improves
   coverage or keeps their evidence focused.
3. Require each worker to return a compact claim-level report: answer and
   implications first, then supporting citations, confidence, contradictions,
   gaps, and useful next checks. Raw search trails, page dumps, transcripts, and
   broad file contents stay out of the parent thread.
4. Evaluate whether the returned reports answer the question. For material
   gaps, contradictions, or weak claims, dispatch a focused follow-up or an
   independent verification worker.
5. Synthesize the reports by claim, distinguish fact from inference and
   recommendation, preserve consequential uncertainty, and deliver the
   requested output.

If delegation is unavailable or the user forbids it, explain that this workflow
cannot perform the research without putting source context in the parent thread.
Do not silently fall back to direct research.

## Worker Briefs

Every brief should name:

- the bounded question or claim
- the allowed source boundary and any date or version constraint
- the evidence and citation standard
- the compact return shape
- the budget or stop condition when the work could sprawl
- read-only and no-edit constraints

Choose the worker by evidence source:

- **Codebase**: trace relevant files, symbols, flows, tests, commands, and
  observed behavior. Report what exists before recommending change.
- **Web and documentation**: prefer current primary sources, record dates or
  versions when freshness matters, and report conflicting guidance.
- **Mixed**: use separate local and external workers when their searches are
  independent, then compare their reports in the parent synthesis.
- **Verification**: give the worker the claims and cited reports to challenge.
  It should return supported, refuted, downgraded, contradicted, or unresolved
  findings without producing the final answer.

Workers save detailed notes only when they need to survive the session or would
otherwise overflow a compact return. Use the repository's scratch convention
and return the report path plus the minimum findings needed for synthesis.

## Deep Research

For broad, ambiguous, high-impact, or cross-cutting questions that need several
workers, iterative follow-up, or adversarial verification, read
[deep-research.md](references/deep-research.md). It owns decomposition,
barriers, verification passes, and deep-research artifact handling.

## Evidence And Synthesis

Treat worker reports as evidence, not final answers:

- **Fact**: directly supported by a cited source, command, test, or file.
- **Inference**: reasoned from reported evidence; state confidence.
- **Recommendation**: a proposed choice after weighing evidence and tradeoffs.
- **Open question**: uncertainty that could change the answer or next action.

The parent verifies at the report level: check completeness, compare independent
reports, identify unsupported claims, and delegate source-level verification.
Do not open underlying sources in the parent thread. Use only evidence returned
by workers, and never invent citations, URLs, paths, quotes, or command results.

## Output And Artifacts

Lead with the conclusion or recommendation, then give the evidence, material
tradeoffs, and gaps. Cite claims close to where they are used.

Read [report-standards.md](references/report-standards.md) only when saving a
research artifact. Research may provide evidence or a handoff for planning, but
the planning workflow owns the implementation plan.

## Final Check

- At least one worker performed all source investigation.
- The parent used compact reports rather than raw source context.
- Material contradictions and weak claims were resolved or named.
- The answer distinguishes evidence, inference, recommendation, and uncertainty.
- Durable artifacts were created only when requested or justified by repository
  conventions.
