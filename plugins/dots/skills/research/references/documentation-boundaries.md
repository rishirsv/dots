# Documentation Boundaries

Read this before saving research, plans, decisions, or proof artifacts.

## Artifact Routing

Use the repository's documented conventions first. When a repository does not define a location, ask before creating a durable artifact unless the user explicitly requested one.

| Artifact | Use For | Durability Rule |
|---|---|---|
| Scratch research | Raw notes, source dumps, search trails, excerpts, one-off hypotheses, subagent working notes | Keep in ignored scratch space when defined; otherwise keep in the thread or temporary storage. Do not add it to durable docs. |
| Curated research summary | Stable synthesis that changes how future work should think about the product, architecture, market, API, or workflow | Save only when the summary changes durable thinking and the repo has a durable docs convention. |
| Deep research report | Parent-agent synthesis from a confirmed deep research workflow | Always durable; save to the repository-conventional research or docs location because the synthesis is the deliverable. |
| Decision document | A product, architecture, or workflow decision with owner-visible rationale and consequences | Save only after a real decision was made or the user asks for a decision record. |
| Implementation plan | Sequenced work for an active change | Save under the repo's active plans convention. Treat as temporary and remove or close it when shipped. |
| Proof | Tests, reproducible commands, screenshots, logs, PR body evidence, benchmark output, or source paths | Keep proof where it can be rerun or reviewed. Do not bury proof only in prose notes. |

## Promotion Test

Promote scratch into a durable artifact only when all are true:

- The conclusion will matter after the current thread ends.
- The information is curated, not a raw trail.
- The artifact type matches the repo's conventions.
- The source or evidence is cited well enough that a future agent can verify it.
- The artifact will not become stale faster than the repo can maintain it.

If a finding is useful only for the active implementation, put it in the plan, the final handoff, a test, or the PR body instead of durable docs.

## Research Report Structure

Choose a report structure from the research topic and the reader's next action. Do not force every report into the same headings. A good structure makes the answer easy to trust: source-backed claims are clear, uncertainty is named, and the most important conclusion appears before supporting detail.

Put sources once at the bottom of the report under `## Sources`. Do not use inline citations, footnotes, source IDs, or `Sources for this section` callouts. Keep detailed claim-to-source mapping in scratch when needed, but keep the durable report readable.

Use these questions to shape the outline:

- Is the report helping choose an option, understand a system, compare prior art, verify current external behavior, or prepare a plan?
- Does the reader need chronological evidence, an option comparison, a system map, a risk register, or a recommendation memo?
- Which headings would let a future agent verify the conclusion without rereading all scratch notes?
- What belongs in durable synthesis, and what should stay in scratch because it is raw trail?

Example structure for an option comparison:

```markdown
# <Decision Or Topic>

## Recommendation
## Options Considered
## Evidence By Option
## Tradeoffs
## Risks And Unknowns
## Sources
```

Example structure for codebase behavior research:

```markdown
# <Behavior Or System Area>

## Short Answer
## How It Works Today
## Key Files And Flows
## Evidence
## Implications For Future Work
## Open Questions
```

Example structure for external/API research:

```markdown
# <API, Library, Or Market Question>

## Current State
## Version Or Date Constraints
## Supported Claims
## Deprecated Or Conflicting Guidance
## Practical Guidance
## Sources
```

Deep research reports should include enough source detail in the final `Sources` section to verify the synthesis, but they should not preserve raw search trails, duplicate subagent transcripts, every rejected source, or per-section citation scaffolding.

## Writing Style

Write research reports as decision-ready internal memos.

Lead with the answer. Put the main conclusion, recommendation, or state of uncertainty in the first section, before evidence detail.

Use plain language and short sections. Prefer concrete headings that match the topic over generic labels. Avoid academic framing, literature-review prose, and long chronological source summaries unless chronology is the point.

Make claims feel supported without making the page noisy. Do not use inline citations, footnotes, source IDs, or per-section source callouts. Keep sources once at the bottom under `## Sources`. In the body, mention source names only when the source identity matters to the reader, such as `OpenAI's current guidance` or `the local test suite`.

Separate evidence from judgment. Say what is known, what is inferred, what is recommended, and what remains uncertain. Do not bury uncertainty in caveats; give it its own short paragraph or bullet when it could change the decision.

Use bullets for scanability, but do not turn the whole report into a checklist. Use prose for synthesis and tradeoffs; use bullets for options, risks, evidence summaries, and open questions.

Keep raw research out of the report. Do not include search trails, rejected sources, subagent transcripts, or exhaustive notes unless they directly change the conclusion.

## Compound Learning

After a research-backed implementation ships, consider whether the work changed future behavior. If it did, propose a durable learning capture in the repository's conventional knowledge store, skill, spec, or decision surface. If the lesson was local to the shipped change, keep it in tests, PR evidence, or the final handoff instead.

## Cleanup

When implementation ships, remove stale plan items and temporary planning docs according to repository conventions. Keep durable decisions, specs, and curated research summaries that still describe real product or architecture thinking.

Do not delete durable decisions or specs as cleanup unless the user or repo workflow explicitly says they are superseded.
