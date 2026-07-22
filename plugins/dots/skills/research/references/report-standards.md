# Report Standards

Read this only when saving a research artifact.

## Artifact Routing

Follow the repository's documented locations and durability rules. When none
exist, ask before creating a durable artifact unless the user explicitly
requested one.

| Artifact | Use For | Durability Rule |
|---|---|---|
| Scratch research | Worker notes, source trails, excerpts, and unresolved hypotheses | Keep in ignored scratch or temporary storage. Do not publish raw notes as durable documentation. |
| Curated research summary | Stable findings that will guide later product, architecture, API, market, or workflow decisions | Save only when the conclusion will remain useful and the repository has an appropriate durable location. |
| Deep research report | A decision-ready synthesis from a multi-worker investigation | Save when requested or when repository conventions make the report the intended deliverable. |
| Decision document | A settled decision with rationale and consequences | Save only after a real decision is made or the user requests a record. |

Promote scratch only when the conclusion matters beyond the current thread, the
content is curated rather than a raw trail, the artifact matches repository
conventions, sources support future verification, and the result is maintainable.

## Report Shape

Choose headings that match the research question and the reader's next action.
Lead with the conclusion, recommendation, or state of uncertainty. Then present
the evidence, tradeoffs or implications, material risks, and open questions.

Common shapes include:

- option comparison: recommendation, options, evidence, tradeoffs, risks
- codebase behavior: short answer, current flow, key files, evidence,
  implications
- external or API research: current state, date/version constraints, supported
  claims, conflicting guidance, practical implications

Finish with a single `## Sources` section containing enough detail to verify the
synthesis. Keep detailed claim-to-source mappings in scratch when they would
make the report harder to read.

## Writing Standard

Write a decision-ready internal memo in plain language. Separate reported
evidence from inference, recommendation, and uncertainty. Use prose for
synthesis and tradeoffs; use bullets or tables where comparison matters.

Do not include search trails, page dumps, rejected-source inventories, worker
transcripts, or exhaustive notes. A saved report is curated synthesis, not a
record of the research process.
