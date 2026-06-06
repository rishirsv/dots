# Eval Scenarios

## Evaluation Framework

### Quality

Base dimensions:
- Specificity
- Completeness
- Trigger Term Quality
- Distinctiveness / Conflict Risk

### Implementation

Base dimensions:
- Conciseness
- Actionability
- Workflow Clarity
- Progressive Disclosure

Additive dimensions:
- Source Grounding
- Output Organization

### Validation

Base dimensions:
- Structural correctness
- Metadata correctness
- Required body/content presence
- Formatting compatibility

Additive dimensions:
- Source Faithfulness
- Prohibited Behavior Avoidance

## Scenario Plan

| Scenario | Phase focus | Capability | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|---|
| Source-grounded route docs | Implementation | API docs from route source | Document a FastAPI router for internal consumers | Invents schema details | Separates source facts from missing details | Implementation: Source Grounding; Validation: Source Faithfulness | SKILL.md and route fixture |
