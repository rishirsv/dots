# Skill Review

Skill: improve-skill
Target: /Users/rishi/Code/agent/plugins/meta-skill/skills/improve-skill
Generated: 2026-06-06T05:47:45.200Z

## Score

Quality Score: 100%
Validation Score: 100%

## Quality

The review uses the target's declared eval dimensions as additional evidence lenses and preserves deterministic Validation exactly as generated.

### Discovery

Based on the skill's description, can an agent find and select it at the right time? Clear, specific descriptions lead to better discovery.

Overall Assessment: The description is concrete and discoverable for existing-skill review and improvement work. It includes natural trigger language such as "skill review," "fix my skill," "update a skill," and "improve an existing reusable skill from evidence," while excluding adjacent lanes such as creating skills, running evals, packaging, installing, and publishing. The evidence requirement in the description keeps it distinct from generic editing or broad rewrite requests. The lane is specific enough for repeated routing without needing another skill to infer the boundary.

| Dimension | Reasoning | Score |
|---|---|---:|
| Specificity | The description names the concrete recurring job: reviewing, fixing, updating, or improving an existing reusable skill from evidence. It also names concrete edit surfaces such as `SKILL.md`, references, scripts, and assets, which avoids category-level vagueness. | 3 |
| Completeness | The description covers what the lane does, when to use it, and when not to use it. The negative scope explicitly excludes creating new skills, running evals, broad rewrites without evidence, packaging, installing, and publishing. | 3 |
| Trigger Term Quality | The description includes user-natural terms and domain terms: "skill review," "fix my skill," "update a skill," "improve," "lint issues," "eval," "trace," and "human-feedback findings." These terms should catch both casual user asks and evidence-specific follow-up work. | 3 |
| Distinctiveness Conflict Risk | The lane overlaps near Create Skill and Evaluate Skill, but the description's "existing reusable skill from evidence" condition and "not for" exclusions make the boundary clear. It is unlikely to steal new-skill creation or eval-running work when those descriptions are available. | 3 |
| Total | Discovery is ready for repeated agent use. | 12 / 12 |

### Implementation

Reviews the quality of instructions and guidance provided to agents. Good implementation is clear, handles edge cases, and produces reliable results.

Overall Assessment: The runtime contract gives a clear review-first path, then gates edits on explicit evidence. The skill now tells reviewers to mirror `.meta-skill/eval-scenarios.md` and `criteria.json` dimensions, which directly addresses the plugin's own eval philosophy instead of creating a separate review rubric. The guidance also forbids fabricated validation rows, lint output, deterministic test status, run IDs, evidence files, and scores, closing the failure found in the subagent eval round. References are local and purposeful, and the workbench includes a deterministic contract test that protects the new behavior.

| Dimension | Reasoning | Score |
|---|---|---:|
| Conciseness | `SKILL.md` is 46 lines and keeps the main lane contract compact. The deeper scoring and review rules live in `references/review-criteria.md`, while surgical edit guidance stays in `references/prompt-doctor.md`, so the entrypoint remains easy to scan. | 3 |
| Actionability | The skill names the concrete command `meta-skill review <skill-dir>`, the output `.meta-skill/review.md`, the evidence required before patching, and the validation to rerun after edits. It also names exact prohibited invented proof surfaces, which gives agents operational stop rules. | 3 |
| Workflow Clarity | The main sequence is explicit: choose review-only or edit mode, run/read review evidence, complete the Quality page, require evidence before patching, then rerun lint and relevant evals after edits. The new eval-dimension rule clarifies how review hands off from Evaluate Skill artifacts. | 3 |
| Progressive Disclosure | The reference map links only local packaged references for prompt-doctor behavior and review criteria. The removed sibling CLI link eliminates the prior packaging warning, and the workbench spec/eval/test files keep project evidence separate from runtime instructions. | 3 |
| Total | Implementation is ready for repeated agent use. | 12 / 12 |

### Validation

100%

Warnings & errors only

Checks the skill against the spec for correct structure and formatting. All validation checks must pass before discovery and implementation can be finalized.

Validation -- 10 / 10 Passed

| Criteria | Description | Result |
|---|---|---|
| frontmatter_valid | YAML frontmatter parses successfully | Pass |
| name_field | `name` field is present and valid | Pass |
| description_field | `description` field is present, routed, and bounded | Pass |
| body_present | SKILL.md body is present | Pass |
| resource_links | Runtime references, scripts, and assets are directly linked | Pass |
| link_integrity | Markdown links resolve inside the packaged payload | Pass |
| agent_manifest | agents/openai.yaml metadata is valid when present | Pass |
| workbench_shape | .meta-skill workbench shape is valid when present | Pass |
| eval_definitions | Eval task and criteria files are complete when present | Pass |
| deterministic_tests | 1 deterministic tests discovered; review does not execute them | Pass |

## Findings

No deterministic quality findings.

## Deterministic Output

```text
OK: no failures or warnings
```
