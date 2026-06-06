# Eval Scenarios Shape From Registry And Notion Research

This planning note records the current decision for Meta Skill's
`.meta-skill/eval-scenarios.md` file. It is a create-time planning artifact, not
an executable eval file.

## Sources Used

- External registry quality pages: base quality phases and universal dimensions.
- External registry eval pages: scenario-level evidence should compare baseline risk and
  skill lift, but full problem descriptions and output specs belong in
  executable evals.
- Notion eval scenarios: domain-specific criteria such as comprehensiveness,
  structure, actionability, linking, accuracy, required captures, optional
  captures, and prohibited behavior.

## Decision

Every skill shares the same base evaluation framework. Skill-specific
dimensions are additive only, and they must live inside the same Quality,
Implementation, and Validation phases.

`.meta-skill/eval-scenarios.md` should stay compact:

```markdown
# Eval Scenarios

## Evaluation Purpose

<What this skill should improve compared with a base agent.>

## Source Distillation

| Source | Claim / rule / pattern | Why it matters for evals |
|---|---|---|

## Evaluation Framework

### Quality

Base dimensions:
- Specificity
- Completeness
- Trigger Term Quality
- Distinctiveness / Conflict Risk

Additive dimensions:
- <skill-specific quality dimension>

### Implementation

Base dimensions:
- Conciseness
- Actionability
- Workflow Clarity
- Progressive Disclosure

Additive dimensions:
- <skill-specific implementation dimension>

### Validation

Base dimensions:
- Structural correctness
- Metadata correctness
- Required body/content presence
- Formatting compatibility

Additive dimensions:
- <skill-specific validation dimension>

## Scenario Plan

| Scenario | Phase focus | Capability | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|---|
```

## Notion Criteria Mapping

Notion-style criteria become additive dimensions, not a separate framework:

| Notion criterion | Phase | Additive dimension |
|---|---|---|
| Comprehensiveness | Implementation | Required Coverage |
| Structure | Implementation | Output Organization |
| Actionability | Implementation | User-Usable Next Steps |
| Linking | Validation | Relationship / Metadata Integrity |
| Accuracy | Validation | Source Faithfulness |
| `must_capture` | Validation | Required Content Capture |
| `should_capture` | Implementation | High-Value Content Capture |
| `must_not_do` | Validation | Prohibited Behavior Avoidance |

## Ownership

- `create-skill` creates `.meta-skill/eval-scenarios.md` in project mode.
- `evaluate-skill` owns `.meta-skill/evals/<slug>/task.md`,
  `.meta-skill/evals/<slug>/criteria.json`, and `meta-skill evals create`.
- `meta-skill evals create` reads the high-level Scenario Plan table and drafts
  executable eval files, which still need refinement before running.
