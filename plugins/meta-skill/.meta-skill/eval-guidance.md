# Meta Skill Plugin Eval Guidance

Use this file before authoring, running, or interpreting the plugin self-evals.

## Scope

This is one plugin-level `.meta-skill` project for all focused Meta Skill lanes:

- `create-skill`
- `evaluate-skill`
- `improve-skill`
- `meta-skill` router handoffs across the lanes

The evals are not scoped to one portable skill root. They test whether the plugin behaves as a coherent skill workbench.

## Registry Quality Basis

The shape is based on public registry surfaces for a reference skill-creation workflow:

- Quality page:
  - Discovery: Specificity, Completeness, Trigger Term Quality, Distinctiveness Conflict Risk
  - Implementation: Conciseness, Actionability, Workflow Clarity, Progressive Disclosure
  - Validation: deterministic warnings and errors only
- Evals page:
  - realistic scenario tasks
  - concrete criteria names
  - before/after skill lift
  - eval cases for infrastructure setup, skill authoring, and trigger-query generation

Use Quality-page depth when reviewing results: cite exact phrases, files, sections, artifacts, and missing evidence.

## Eval Inventory

| Eval | Lane focus | What it proves |
|---|---|---|
| `create-project-mode-skill` | Create Skill | The plugin can turn a repeated workflow into a portable skill plus project-mode eval scenario plan. |
| `author-eval-infrastructure` | Evaluate Skill | The plugin can turn high-level scenarios into `task.md`, `criteria.json`, fixture declarations, flat deterministic tests, and an honest run plan. |
| `complete-quality-review` | Improve Skill | The plugin can complete a registry-quality review without fake Judge or Total scores. |
| `generate-trigger-boundary-eval-queries` | Evaluate -> Improve handoff | The plugin can create realistic trigger eval queries and defer description edits until evidence exists. |
| `route-broad-meta-skill-request` | Meta Skill router | The plugin can sequence Create -> Evaluate -> Improve and preserve package approval gates. |

## Deterministic Tests

Run from the repo root:

```bash
set -e
for test in plugins/meta-skill/.meta-skill/tests/*.sh; do
  "$test"
done
```

The tests check:

- all three lane skills plus the router are represented
- eval folders have `task.md` and `criteria.json`
- criteria cover Quality, Implementation, and Validation
- tests are flat under `.meta-skill/tests`
- review output keeps the Quality-page shape
- deprecated `Judge Score`, `Total Score`, and `.meta-skill/reviews/` surfaces stay removed
- frontmatter descriptions and OpenAI metadata stay user-facing, avoid implementation-plumbing terms, and include default prompts for each lane skill

## Review Rules

- Treat deterministic tests as structural evidence, not proof of good skill behavior.
- Treat eval responses as behavior evidence, not automatic pass/fail proof.
- Criteria stay evaluator-only in `criteria.json`.
- Task text should read like a real user request or scenario, not a rubric dump.
- `task.md` should not expose `Capability:` or `Topics:` metadata; do not model eval selection around capability or topics.
- Fixtures are optional and should exist only when the task needs provided files, source packets, screenshots, or generated evidence.
- Subagent sampling should follow `references/subagent-patterns.md`: keep subagents isolated, keep criteria hidden, and keep solver prompts free of test or benchmark framing.
- Findings should name the defect, evidence, agent-behavior impact, smallest useful fix, and next validation command.

## Known Runner Boundary

The current Meta Skill CLI runner is built around one portable skill root. This plugin-level project intentionally spans multiple lane skills. Until plugin-level mounting is supported, use these evals as authored scenario definitions and run lane-specific checks manually or through a future plugin-bundle runner.
