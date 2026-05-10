# Harness Engineering Skill Scope Seed

## Working Skill Name

`harness-engineering`

## Provisional Purpose

Evaluate a repository or project for agent-readiness and propose how it could become more harness engineered: more legible to agents, more mechanically constrained, more locally reproducible, and better equipped with feedback loops that let high-intelligence agents do value-add work with less human supervision.

## Provisional User Outcome

After running the skill, the user should receive a repo-specific harness engineering assessment and future-state recommendation: what maps, boundaries, validation loops, tools, docs, scripts, subagent workflows, and recurring cleanup mechanisms would most increase agent leverage in this project.

## Settled Decisions

- Default output is an assessment report in Markdown with a strong reusable format.
- The assessment should not immediately create implementation plans or rewrite repo artifacts.
- The assessment should offer downstream artifact generation after the user chooses a path.
- Downstream artifacts can include a minimal ExecPlan, architecture diagram, and `ARCHITECTURE.md` or equivalent architecture doc.
- The user may choose a whole-codebase harness-engineering refactor plan or pick individual options from the assessment.
- ExecPlan generation should follow OpenAI's self-contained, living-document guidance while also respecting the target repo's local planning conventions.
- The default report should avoid numerical scores and use priority/action bands backed by evidence.
- The report audience is equally the human project owner and future agents who may implement follow-up work.
- At the end of assessment, ask where to write the final report. Propose `docs/harness-engineering-assessment.md` when the repo has a `docs/` folder. If the user wants chat-only output, keep the final report in chat and leave scratch artifacts temporary.
- If the target repo already has clear conventions for plans, architecture docs, trackers, reports, or assessment artifacts, follow those conventions over the skill's defaults when they are discoverable and reasonable.
- Draft the skill first as a loose source skill at `skills/harness-engineering/`; review and iterate there before syncing or bundling it into `plugins/rs-tools/skills/harness-engineering/`.
- The report should organize opportunities by themes, with detailed opportunities nested under each theme.
- Opportunities should be grouped at the right working level: not every individual file change, but detailed enough to name related files, modules, docs, commands, or surfaces that support the finding.
- Repeated instances of the same concept across multiple files should be grouped into one opportunity when they would be fixed or planned together.
- The default scan should be deep and should use high-intelligence subagents when available.
- During long-running scans, the skill should maintain a progressive `findings.md` working file and update it at sensible intervals so the run can recover, resume, or synthesize without losing discoveries.
- Default temporary scan artifacts should live under `.codex/tmp/harness-engineering/` when that path is safe for the repo, with a fallback to `/tmp/harness-engineering-<repo-name>/` if repo-local scratch is inappropriate.
- Subagent assignment should be hybrid and adaptive to the repo: split by repo area, domain, layer, runtime, docs/tests surface, or harness theme based on what best exposes cross-cutting opportunities.
- Assessment should be read-mostly by default, but may run safe non-mutating discovery or verification commands. Avoid long, mutating, destructive, network-heavy, or environment-changing commands unless the user explicitly asks.

## Subagent Output Contract

Each subagent should return:

- Scope inspected.
- Evidence, including representative paths and commands.
- Candidate themes.
- Opportunities.
- Non-opportunities or already-good harnesses.
- Open questions and confidence notes.

## Provisional Report Format

- Executive Summary.
- Repo Map.
- Existing Harness Strengths.
- Current Harness Readiness.
- Highest-Leverage Opportunities, grouped by theme.
- Future-State Harness Architecture.
- Recommended Next Artifacts.
- Agent Handoff Notes.

## Opportunity Detail Standard

Each opportunity should include:

- Theme name.
- Opportunity title.
- Current state.
- Target harness-engineered state.
- Current evidence, including representative files, docs, scripts, commands, or runtime surfaces.
- Why it matters for agent leverage.
- Recommended harness-engineered future state.
- Suggested implementation grain: whole-codebase refactor, focused ExecPlan, small targeted patch, recurring automation, or documentation/architecture capture.
- Suggested downstream artifact, if useful.
- Validation evidence future agents should produce.

## Progressive Findings Log

During deep scans, write and maintain a `findings.md` file that captures:

- Scan timestamp and repo path.
- Current scan phase.
- Subagent assignments and status when subagents are used.
- Evidence discovered so far.
- Candidate themes.
- Confirmed opportunities.
- Open questions or areas not yet inspected.
- Synthesis notes needed for the final assessment.

Update this file after major repo-map discoveries, after each subagent result, before long-running validation commands, and before final synthesis.

Preferred path: `.codex/tmp/harness-engineering/findings.md`. Before writing, check whether the scratch path is ignored or otherwise accepted by the target repo. Do not pollute tracked project docs with temporary scan notes unless the user explicitly asks for durable capture there.

## Early Skill Shape Hypothesis

- Start with grounding: read repo instructions, README, docs index, architecture docs, package/config files, test/CI scripts, and existing agent/skill/plugin docs.
- Build a repo map: domains, runtime surfaces, tests, scripts, CI, docs, data boundaries, ownership, and local boot paths.
- Run parallel high-intelligence subagents when available, choosing assignments after the initial repo map:
  - Repo knowledge and docs legibility.
  - Architecture boundaries and enforceable invariants.
  - Runtime observability and validation loops.
  - Agent workflow/tooling and CLI ergonomics.
  - Entropy/garbage-collection and recurring maintenance.
- Synthesize into a technology-agnostic harness evaluation with concrete stack-native examples.
- Distinguish present-state findings from future-state recommendations.
- Prioritize recommendations by agent leverage, implementation cost, and risk reduction.
- End by offering concrete next artifacts rather than creating them automatically.

## Important Non-Goals

- Do not assume every repo should copy OpenAI's exact stack.
- Do not turn this into a generic tech-debt scan.
- Do not grade docs volume as harness quality without executable proof.
- Do not prescribe multi-agent autonomy unless the repo has or can cheaply gain the required feedback loops.
- Do not require a specific tool such as Chrome DevTools, LogQL, PromQL, GitHub, Linear, or worktrees when equivalent project-native mechanisms exist.

## Open Scoping Questions

- Should subagents be mandatory when available, or recommended only for larger repos?
- What should the default deliverable be: chat report, repo-local artifact, or both?
- Should the skill include a formal rubric/score, or avoid scoring and focus on prioritized recommendations?
