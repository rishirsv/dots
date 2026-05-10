# Latent Space Harness Engineering Transcript Notes

Source: https://www.latent.space/p/harness-eng

## Core Additions Beyond The Article

- The no-human-code constraint forced the team to make agents capable of doing the engineer's job, not merely assisting with snippets.
- Harness work encodes non-functional requirements into docs, tests, review agents, and tools that can influence agent behavior during a run.
- Agent mistakes are treated as evidence that some requirement, invariant, capability, or feedback loop has not yet been encoded.
- Worktrees and disposable environments reduce the need for synchronous human supervision; merge conflicts are acceptable when agents can resolve them.
- CLIs are especially valuable because they are token-efficient and easier for agents to use than visual-only workflows.
- Tool output should be agent-friendly. Wrappers that suppress passing noise and surface only failures can materially improve agent effectiveness.
- A good harness can be specified as a blueprint rather than a single stack. GitHub can be swapped for Jira/Bitbucket-style equivalents, and implementation choices should adapt to the project environment.
- Agents should compress their own trajectory into reviewable evidence for humans rather than requiring humans to inspect every action.
- Company or product context belongs in repo-local artifacts when it affects engineering judgment: team, customers, product lines, vision, culture, and domain terms.

## Skill Implications

- The skill should ask agents to look for missing non-functional requirements, not only missing tests.
- The skill should inventory whether the repo has agent-friendly commands, concise failure output, local reproducibility, and clear tool contracts.
- The skill should separate harness principles from stack-specific exemplars.
- The skill should produce a future-state harness design that is realistic for the repo's current maturity, not a direct clone of the OpenAI example.
- The skill should likely use high-intelligence subagents for bounded slices: repo map, runtime/evidence loops, architecture boundaries, docs/knowledge system, and agent workflow/tooling.

## Candidate Technology-Agnostic Patterns

- Browser app: use browser automation, screenshots, DOM snapshots, logs, and journey scripts.
- iOS app: use simulator build/run/test tools, screenshots/video, OS logs, UI tests, and fixture-backed flows.
- Backend service: use local service boot, API contract tests, logs, traces, metrics, seed data, and load/perf scripts.
- Library/package: use type checks, unit/property tests, API docs, examples, compatibility fixtures, and release dry-runs.
- Data/ML project: use dataset manifests, reproducible notebooks/scripts, evaluation sets, metrics dashboards, and model-card-style repo docs.

## Caution

Do not make the skill prescribe a specific vendor, language, observability stack, planning format, or review tool. It should identify the harness role a project needs and suggest stack-native implementations.
