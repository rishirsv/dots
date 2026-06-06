# Skill Review

Skill: evaluate-skill
Target: /Users/rishi/Code/agent/plugins/meta-skill/skills/evaluate-skill
Generated: 2026-06-06T18:31:59.402Z

## Score

Quality Score: 85%
Validation Score: 73%

## Quality

Discovery and Implementation were completed by agent review against `references/review-criteria.md`. The target has no authored eval suite under `.meta-skill/evals/`, so there are no extra eval dimensions to mirror in this review.

### Discovery

Based on the skill's description, can an agent find and select it at the right time? Clear, specific descriptions lead to better discovery.

Overall Assessment: The description is specific and well-bounded: it names "creating a skill eval suite," "running skill evals," "auditing eval evidence," and "interpreting .meta-skill eval runs." Those phrases cover both natural user language and internal Meta Skill vocabulary. The exclusions are clear enough to route rewriting to `improve-skill`, creation to `create-skill`, and packaging or installing away from this lane.

| Dimension | Reasoning | Score |
|---|---|---:|
| Specificity | The description names concrete eval jobs: creating suites, running evals, auditing evidence, and interpreting runs. It is narrow enough to select for eval work and avoid ordinary skill editing. | 3 |
| Completeness | The description covers what to do and what not to do: "not for rewriting skills, best-practice skill review, packaging, or installing." That gives a clear handoff boundary to improve, review, package, and install lanes. | 3 |
| Trigger Term Quality | It includes natural phrases such as "creating a skill eval suite" and "running skill evals," while preserving precise `.meta-skill eval runs` language for internal requests. | 3 |
| Distinctiveness Conflict Risk | The exclusions separate this from `improve-skill`, `create-skill`, and `meta-skill` routing. Overlap risk is low because the description keeps this lane on eval evidence rather than edits or packaging. | 3 |
| Total | Strong discovery with natural and internal trigger language. | 12 / 12 |

### Implementation

Reviews the quality of instructions and guidance provided to agents. Good implementation is clear, handles edge cases, and produces reliable results.

Overall Assessment: The implementation gives a usable loop from project init through eval creation, lint, run, and evidence interpretation. It protects the important boundaries: criteria stay evaluator-only, prompts must read like real user requests, subagents stay isolated/read-only, and completed execution is not a pass verdict. The main body is still dense because it carries runner semantics, token telemetry, overflow behavior, and score limits; the local `eval-authoring.md` reference absorbs most authoring detail, but a future pass could move more runner internals into a reference.

| Dimension | Reasoning | Score |
|---|---|---:|
| Conciseness | The skill is short enough to scan, but the Operating Rules section includes low-level runner details about token usage, retry behavior, and buffer overflow. Those are correct, yet they make the lane feel more mechanical than the core authoring workflow. | 2 |
| Actionability | The Beginner Path gives concrete commands, and later sections name exact files to author and inspect: `task.md`, `criteria.json`, `cases/<eval>/rpc.jsonl`, `transcript.json`, and `response.md`. The Output section tells the agent what to return for setup versus interpretation. | 3 |
| Workflow Clarity | The main path and branch points are clear: optional scenario generation, direct authoring, linting, running, inspecting evidence, and handing off edits to `improve-skill`. The proof limits for mounted-skill behavior, no-skill controls, hidden criteria, and subagent ownership are explicit. | 3 |
| Progressive Disclosure | The local `eval-authoring.md` reference provides strong authoring detail without bloating `SKILL.md`. Shared references are named as literal paths rather than Markdown links to keep packaging validation clean, which is practical but slightly less discoverable than direct links. | 2 |
| Total | Ready for repeated use, with density and shared-reference ergonomics as the remaining improvement areas. | 10 / 12 |

### Validation

73%

Warnings & errors only

Checks the skill against the spec for correct structure and formatting. All validation checks must pass before discovery and implementation can be finalized.

Validation -- 8 / 11 Passed

| Criteria | Description | Result |
|---|---|---|
| frontmatter_valid | YAML frontmatter parses successfully | Pass |
| name_field | `name` field is present and valid | Pass |
| description_field | `description` field is present, routed, and bounded | Pass |
| body_present | SKILL.md body is present | Pass |
| resource_links | Runtime references, scripts, and assets are directly linked | Pass |
| link_integrity | Markdown links resolve inside the packaged payload | Pass |
| agent_manifest | agents/openai.yaml metadata is valid when present | Pass |
| workbench_shape | .meta-skill workbench shape is valid when present | Warning |
| eval_definitions | Eval task and criteria files are complete when present | Warning |
| deterministic_tests | 1 deterministic tests discovered; review does not execute them | Pass |
| lint_total | 0 failures and 2 warnings recorded | Warning |

## Findings

### [Medium] Evaluate-skill has deterministic coverage but no self-eval suite

Source: Quality
Phase: Validation
Evidence: eval_definitions and deterministic_tests
Impact: The prompt-boundary invariant is now protected by one deterministic test, but this lane still has no authored eval suite to exercise its full create/run/interpret workflow against realistic cases.
Fix: Add authored evals only if this skill itself becomes a target for deeper eval development; do not create filler evals just to silence warnings.
Next Step: Keep the warning accepted for this narrow invariant test, or add real `.meta-skill/evals/` cases when evaluating `evaluate-skill` becomes a dedicated task.

### [Medium] 0 failures and 2 warnings recorded

Source: Quality
Phase: Validation
Evidence: lint_total
Impact: Validation is failure-free, but the review score remains lower because the workbench intentionally lacks scenario-plan and eval folders.
Fix: Accept the warnings for the current deterministic-test-only workbench, or add a real scenario plan and eval suite when useful.
Next Step: Rerun `meta-skill review plugins/meta-skill/skills/evaluate-skill` after any future eval-suite additions.

## Deterministic Output

```text
WARN: .meta-skill/eval-scenarios.md is missing; add it only when you want scenario-plan-driven eval generation (/Users/rishi/Code/agent/plugins/meta-skill/skills/evaluate-skill/.meta-skill/eval-scenarios.md)
WARN: no evals folder yet (/Users/rishi/Code/agent/plugins/meta-skill/skills/evaluate-skill/.meta-skill/evals)
OK: no failures (2 warnings)
```
