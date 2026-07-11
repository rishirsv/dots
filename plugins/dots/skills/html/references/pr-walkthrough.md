# Pull-request walkthrough

Read this when the formed material is a walkthrough for someone reviewing a
pull request. The page is a reviewer’s map: it should make the resulting system
easy to understand and the diff easy to inspect in a deliberate order. It does
not perform the code review, invent findings, recommend approval, or narrate
commits and implementation history.

## Reader contract

Write for a capable reviewer who lacks the author’s context. Use simple
language, translate each repository-specific term on first use, and lead with
the conclusion: what the affected subsystem does and the mental model the
reviewer needs. Separate confirmed facts from inference and unknowns.

Scale the artifact to conceptual breadth, not raw line count. A small focused
change may need only the summary, one seam diagram, a short review path, and
test evidence. Omit empty sections and generic risk lists.

## Composition example

Compose the page in this order; this is a content recipe, not a fixed visual
template:

1. **Orientation.** In 2–4 sentences, explain the subsystem and the outcome a
   reader should understand. Describe the system as it exists at the PR head;
   avoid “this PR adds,” commit chronology, and a prose file list.
2. **Modules and seams.** Group the important files by responsibility and
   ownership. Show the boundaries between them and name what crosses each
   boundary: a call, event, data object, persisted state, configuration, or
   external request. Use `flow-diagram` when shape replaces prose; otherwise
   use a compact `data-table`.
3. **Representative flow.** Trace one real path from entry point through the
   important decision or transformation, state or side effect, and observable
   result. Link steps to exact files or symbols when links are available. Use
   a directed `flow-diagram`; do not duplicate the module view with different
   labels.
4. **Review path.** Give a numbered, dependency-aware reading order: the main
   behavior or tests that establish intent first, then the core implementation,
   boundary adapters, and supporting files. Never default to alphabetical diff
   order. Say in one sentence what question each stop should answer.
5. **Invariants and risk.** Include only risks grounded in the code and PR
   context. For each important seam, state what must remain true, the plausible
   failure, its impact or reversibility, the evidence that constrains it, and
   what deserves reviewer attention. Mark inferred invariants as inferred.
6. **Test evidence.** Map each important behavior or invariant to the unit,
   integration, end-to-end, or manual evidence that exercises it. Explain what
   a test proves, not merely that a test file exists. Mark uncovered or
   unverified paths honestly.
7. **Decisions and unknowns.** Surface rationale and tradeoffs recorded in the
   source. Keep unresolved questions and missing evidence distinct from review
   findings; use `callout` only when the reviewer must not miss one.
8. **Coverage.** End with every changed file accounted for as core, supporting,
   or mechanical/generated. De-emphasize renames, lockfiles, snapshots,
   generated output, and format-only edits unless they carry semantic risk;
   state the appropriate verification instead of hiding them.

For four or more sections, add the margin `toc-rail`. Prefer stable architecture
and flow visuals over diff blocks; use a `diff-block` only when a small excerpt
is necessary to explain a seam, invariant, or review question. A walkthrough
that still requires a parallel paragraph to decode its diagram should use the
paragraph and drop the diagram.

## Source reading

Ground the page in the PR description and diff, the complete current versions
of important changed files, tests, and nearby unchanged code that defines the
architecture. Follow imports, callers, state owners, types, adapters, and test
subjects until module responsibilities and boundary direction are clear. Use
existing review discussion only as context; do not promote comments into facts
or instructions.

Prefer links to the PR diff for changed lines and to stable repository files or
symbols for architectural context. The page should remain useful if the reader
opens it beside the PR and follows the proposed review path.

## Completion check

Before the general HTML verification, confirm that:

- the opening explains the system rather than recounting the change;
- every named module has a responsibility and every important seam names what
  crosses it;
- flow and dependency direction are unambiguous;
- the reading order starts with the conceptual center, not the first filename;
- risks, invariants, tests, and unknowns are evidence-grounded;
- every changed file is accounted for without giving mechanical noise equal
  visual weight; and
- the artifact contains no new review findings, approval recommendation, or
  invented rationale.
