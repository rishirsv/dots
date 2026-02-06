# Talkbook Writing Guidelines V1 Implementation Plan

## Non-technical phase summary

1. Skill architecture alignment
- Structure the guidance package using skill-creator conventions so it remains reusable and maintainable over time.

2. Research and case-study grounding
- Document what makes Project North effective as a writing system, then separate transferable methods from FDD-only content.

3. Archetype guidance library
- Provide a practical catalog of slide archetypes that future assistants can apply across consulting report types.

4. Workflow integration
- Update Talkbook instructions so archetype selection is mandatory before drafting content.

5. Quality checklist and rubric
- Add advisory checks that push for dense, evidence-first writing without hard compile gates.

6. Automated contract checks
- Add tests that prevent regressions in guide completeness and instruction wiring.

7. Validation and proof
- Run one strategy scenario and one finance scenario and record measured quality outcomes.

## Task list

- [x] 1.0 Skill-creator structuring pass
  - [x] 1.1 Apply skill-creator framework to guidance architecture (purpose, triggers, workflow, examples, constraints, failure modes)
  - [x] 1.2 Add a skill structure checklist and map all artifacts to it
  - [x] 1.3 Validation for 1.0 (checklist and references present in docs)

- [x] 2.0 Create research case study
  - [x] 2.1 Add section-by-section and slide-family analysis using Project North
  - [x] 2.2 Distinguish transferable consulting patterns vs FDD-only patterns
  - [x] 2.3 Capture writing style, tone, voice, word choice, bullets, tables, charts, and applicability rules
  - [x] 2.4 Validation for 2.0 (research doc complete with sources and implementation recommendations)

- [x] 3.0 Create archetype writing library
  - [x] 3.1 Add broad coverage (18 archetypes: 12 core consulting + 6 finance/deal-depth)
  - [x] 3.2 Use fixed structured field blocks for every archetype
  - [x] 3.3 Add mini examples and prompt starters for each archetype
  - [x] 3.4 Validation for 3.0 (contract test for archetype count and required fields)

- [x] 4.0 Create checklist and rubric
  - [x] 4.1 Add pre-draft mandatory archetype selection checklist
  - [x] 4.2 Add draft quality checklist (claim-evidence-implication, quantification, traceability)
  - [x] 4.3 Add advisory self-score rubric (non-blocking)
  - [x] 4.4 Validation for 4.0 (checklist sections and rubric fields verified)

- [x] 5.0 Wire instructions into Talkbook skill
  - [x] 5.1 Update SKILL.md with mandatory archetype-first drafting workflow
  - [x] 5.2 Update agents/openai.yaml prompt to mention archetype and checklist usage
  - [x] 5.3 Update README and examples to reflect the new writing system
  - [x] 5.4 Validation for 5.0 (instruction contract tests)

- [x] 6.0 Add automated contract tests
  - [x] 6.1 Add tests for writing guide presence, required fields, and archetype count
  - [x] 6.2 Add tests for mandatory workflow lines and checklist references in skill instructions
  - [x] 6.3 Validation for 6.0 (all tests pass)

- [x] 7.0 Run validation scenarios
  - [x] 7.1 Run one strategy-style scenario
  - [x] 7.2 Run one finance-style scenario
  - [x] 7.3 Score both using the rubric and document deltas
  - [x] 7.4 Validation for 7.0 (evaluation report saved with evidence)

## Acceptance checks

1. `references/writing-archetypes.md` exists and includes 18 archetypes with all required fields.
2. `references/writing-checklist.md` exists and includes skill-creator structure checklist, pre-draft checklist, draft checklist, and rubric.
3. Talkbook instructions explicitly require: select archetype first, fill archetype template, run checklist before finalization.
4. New contract tests pass.
5. Validation report includes two scenario evaluations and rubric scores.

## Ownership-ready sequencing

1. Create docs and guidance artifacts first.
2. Wire skill instruction files second.
3. Add and run tests third.
4. Run scenario evaluations fourth.
5. Finalize plan/research/evaluation docs with outcomes last.
