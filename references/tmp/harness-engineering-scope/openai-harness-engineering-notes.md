# OpenAI Harness Engineering Article Notes

Source: https://openai.com/index/harness-engineering/
Published: 2026-02-11
Author: Ryan Lopopolo

## Core Thesis

Harness engineering shifts human engineering work from writing code to designing environments, specifying intent, and building feedback loops that let coding agents do reliable work. The scarce resource is human attention, so the repository should make more of the system legible, enforceable, and recoverable by agents.

## Durable Concepts For The Skill

- Humans steer; agents execute. The skill should evaluate where humans still have to manually translate, inspect, or operate things that could be made agent-legible.
- Environment underspecification is the core failure mode. When an agent struggles, the diagnostic question is what missing capability, map, boundary, tool, or feedback loop would let the agent succeed next time.
- Application legibility matters. UI, logs, metrics, traces, screenshots, navigation, and local runtime state should be inspectable by agents, ideally per worktree or isolated task environment.
- Repository knowledge should be the system of record. `AGENTS.md` should act as a table of contents, while deeper maps, specs, architecture docs, plans, quality notes, and generated references live in repo-local files.
- Progressive disclosure beats giant manuals. Agents need a compact map first, then pointers to deeper source-of-truth material.
- Mechanical enforcement beats prose-only guidance. Useful repositories encode boundaries, dependency directions, schema parsing, logging structure, naming, file-size limits, and reliability rules in tests, lints, scripts, or CI.
- Agent legibility is the design target. Knowledge that lives only in chat, docs outside the repo, or human memory is invisible to agents.
- Taste should be captured and compounded. Review comments, bug patterns, and architectural preferences should be promoted into docs or enforcement when repeated.
- Entropy needs garbage collection. Recurring background agents can scan for drift, update quality grades, and open small cleanup PRs.
- Autonomy requires a whole loop. The article's autonomy example includes current-state validation, bug reproduction, evidence capture, fix implementation, app-driven validation, PR creation, feedback handling, build repair, escalation, and merge.

## Evaluation Axes Suggested By The Article

- Repo map quality: entry points, domain boundaries, ownership, docs index, active/completed plans, tech-debt tracking.
- Agent-legible runtime: local boot, worktree isolation, UI/browser automation, screenshots/video, logs, metrics, traces, deterministic fixtures.
- Feedback loops: tests, lints, CI, review agents, evidence artifacts, quality scores, recurring docs or cleanup agents.
- Boundary enforcement: architecture layering, provider interfaces, schema parsing at boundaries, dependency direction rules, generated references.
- Human-attention bottlenecks: tasks where humans must still copy/paste, inspect GUIs, interpret noisy output, manually QA, or remember tacit context.
- Garbage collection: recurring doc gardening, drift detection, quality grading, cleanup PR generation, stale-plan maintenance.

## Technology-Agnostic Translation

Specific tools in the article, such as Chrome DevTools Protocol, LogQL, PromQL, worktrees, or particular linter implementations, should be treated as examples. The portable principle is: expose important state through text/tool APIs agents can inspect; isolate task environments; encode high-value constraints mechanically; and keep repo-local knowledge navigable.
