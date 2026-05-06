# Scope Skill Upgrade ExecPlan

## Purpose

Upgrade the `scope` skill so it works as the larger, inverted counterpart to `clarify`: Clarify asks the minimum needed to proceed; Scope asks persistently until a broad or fuzzy direction reaches shared understanding. The user-visible outcome is a more coherent discussion flow, a stronger final output contract, and cleaner durable artifact routing with reusable templates.

## Phase Outcomes

- Phase 1: The skill's role, output contract, and Discuss flow are clear and natural.
- Phase 2: Durable artifact routing lives in `SKILL.md`, while reusable templates stay in `assets/`.
- Phase 3: Ideate, metadata, and validation are aligned with the upgraded Scope behavior.
- Phase 4: The upgrade is independently reviewed against skill best practices and adjusted from feedback.

## Implementation Checklist

- [x] 1.0 Update core Scope contract
  - [x] 1.1 Make the Clarify/Scope relationship explicit in `SKILL.md`.
  - [x] 1.2 Replace the fallback ending with the shared `Scoped Direction` output contract.
  - [x] 1.3 Keep Scope broad across coding and knowledge work while making Discuss the deeper interview lane.
  - [x] 1.4 Validation for 1.0: read `SKILL.md` and confirm the trigger, workflow, guardrails, and output contract do not conflict.
- [x] 2.0 Rework Discuss around persistent shared-understanding interviews
  - [x] 2.1 Replace `Proceed / Revise / Split / Drop` with a natural single-block `Scoped Direction`.
  - [x] 2.2 Add topic labels, topic transitions, and 2-3 sentence checkpoint guidance after 3-4 questions or at natural boundaries.
  - [x] 2.3 Add a concrete good-question example with topic label, context, recommended default, and the actual question.
  - [x] 2.4 Add gated terminology pressure-testing for repo, product, architecture, and domain discussions.
  - [x] 2.5 Validation for 2.0: read `references/discuss.md` and confirm it is persistent but not interrogative or form-like.
- [x] 3.0 Rework artifact routing and templates
  - [x] 3.1 Create `assets/context-template.md`, `assets/domain-context-template.md`, `assets/product-spec-template.md`, and `assets/exec-plan-template.md`.
  - [x] 3.2 Move artifact decision logic into `SKILL.md`: need artifact, artifact family, exact template to read.
  - [x] 3.3 Add concrete artifact restraint rules and a negative example.
  - [x] 3.4 Validation for 3.0: confirm template names match routing instructions and each template has a `Use When` header.
- [x] 4.0 Align Ideate and metadata
  - [x] 4.1 Keep ranked survivors as Ideate's primary ending, with `Open Questions` and `Recommended Next Step` as the shared footer.
  - [x] 4.2 Add guidance for transitioning from Ideate into Discuss when a survivor is worth pressure-testing.
  - [x] 4.3 Update `agents/openai.yaml` to match the upgraded behavior.
  - [x] 4.4 Validation for 4.0: run the skill validator and inspect metadata for drift.
- [ ] 5.0 Review, subagent validation, and apply feedback
  - [x] 5.1 Self-review the updated skill against `skill-creator` guidance.
  - [x] 5.2 Have a subagent review the updated skill against skill best practices.
  - [x] 5.3 Apply useful review feedback.
  - [x] 5.4 Validation for 5.0: rerun validation and inspect final diffs.

## Validation

- Run `/Users/rishi/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/rs-tools/skills/scope` and expect a passing result.
- Read the updated Scope files and confirm progressive disclosure is preserved: `SKILL.md` handles routing and the shared contract, `references/` handles lane logic, and `assets/` holds output templates.
- Confirm the final Discuss output is one `Scoped Direction` block with seven fields, not a heavy two-block synthesis.
- Confirm Ideate keeps ranked survivors and does not force a full Discuss-style output.
- Confirm artifact routing explicitly says to read the chosen template file before writing an artifact.

## Decision Log

- Scope will be framed as inverted Clarify: Clarify minimizes questions for small work; Scope asks persistently for big work until shared understanding exists.
- Use "persistent" instead of "relentless" to keep the skill thorough without encouraging an interrogative tone.
- Use "What We Resolved" language only inside the single `Scoped Direction` block where useful; do not create a separate synthesis block.
- Keep general context and domain context as separate templates so Scope works across coding and knowledge work.
- Keep Ideate's ranked-survivor output because generation-and-filtering needs a different shape than Discuss.

## Surprises And Discoveries

- The final feedback showed that the earlier two-block ending risked becoming heavier than the verdict system it replaced.
- The best Scope/Clarify boundary is not "questions vs no questions"; it is minimum-question execution readiness vs persistent shared-understanding work.
- Skill-creator guidance treats process docs as clutter inside a skill folder, so the comparison artifact was moved to `docs/skill-reviews/`.

## Completion Notes

- Shipped: Upgraded Scope's trigger, shared contract, Discuss flow, Ideate footer, artifact routing, reusable templates, and OpenAI metadata.
- Remaining: None.
- Follow-up: Include the new `plugins/rs-tools/skills/scope/assets/` files when committing or syncing this skill, since artifact routing depends on them.
