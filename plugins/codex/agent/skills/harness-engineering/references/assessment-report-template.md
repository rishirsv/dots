# Harness Engineering Assessment Template

Write the final assessment as a polished Markdown report. Keep it detailed enough for future agents to act, but not a file-by-file change list.

## Title

```markdown
# Harness Engineering Assessment: <Project Name>

Assessed: <date>
Repo: `<absolute-or-project path>`
Mode: Deep read-mostly scan
```

## Executive Summary

Include:

- One-paragraph verdict.
- 3-5 highest-leverage themes.
- The main human-attention bottleneck.
- The most important next artifact to create, if any.

## Repo Map

Summarize:

- Project shape and primary deliverables.
- Main domains/packages/apps/services.
- Key docs and source-of-truth files.
- Validation surfaces: tests, scripts, CI, local boot, manual QA, release tools.
- Agent guidance and existing skills/plugins/automation.

## Existing Harness Strengths

List evidence-backed strengths to preserve. Include representative files, commands, or docs. Keep this concise.

## Current Harness Readiness

Describe the current state across the main lenses:

- Repository knowledge and maps.
- Runtime legibility and local reproducibility.
- Validation and feedback loops.
- Architecture boundaries and invariants.
- Agent workflow and tooling.
- Entropy control and garbage collection.

Do not use numeric scores.

## Highest-Leverage Opportunities

Group opportunities by theme. Use the following shape for each theme:

```markdown
### Theme: <Theme Name>

Why this theme matters in this repo.

#### Opportunity: <Title>

**Priority:** Highest leverage / Near-term / Later

**Current State:** What exists now, including whether parts are already strong.

**Target Harness State:** What the repo would look like if this were harness-engineered well.

**Evidence:** Representative files, commands, docs, modules, or runtime surfaces.

**Agent Leverage:** Why this lets agents do more valuable work with less human supervision.

**Implementation Grain:** Whole-codebase refactor / focused ExecPlan / small patch / recurring automation / architecture capture.

**Suggested Downstream Artifact:** ExecPlan / architecture diagram / ARCHITECTURE.md / AGENTS.md patch / tracker item / none.

**Validation Evidence:** What future agents should produce to prove it works.
```

Grouping rules:

- Group repeated instances of the same concept when they would be fixed together.
- Name representative files and surfaces, not every file.
- Separate truly different opportunities even if they live in the same folder.
- Include enough detail for a future agent to draft a plan without rediscovering the repo.

## Future-State Harness Architecture

Describe the target operating model in prose:

- How agents discover project truth.
- How agents validate behavior.
- How architecture boundaries are enforced.
- How runtime evidence is captured.
- How cleanup and drift prevention work.
- Where humans still make judgment calls.

Add a small Mermaid diagram only if it clarifies the target architecture.

## Recommended Next Artifacts

Offer concrete options, not automatic creation:

- Option name.
- What it would create.
- Which opportunities it covers.
- Why it should be next.
- Estimated implementation grain.

Include an option for a broad harness-engineering ExecPlan only if the repo has enough evidence for that scope.

## Agent Handoff Notes

Include:

- Scratch findings path.
- Important commands inspected or run.
- Areas not inspected.
- Assumptions and confidence notes.
- Suggested first prompt for the next agent.

## Open Questions

List only questions that would affect follow-up planning or implementation. Mark whether each blocks action.
