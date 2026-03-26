# Polish Design Evaluator Revamp Plan

## Summary

Revamp `polish-design` so it keeps the current fast single-agent polish loop by default, adds an explicit evaluator-led path when the user asks for subagents or multi-pass critique, and ships with a dedicated project-scoped `design_evaluator` agent. The runtime shape should follow official Codex conventions under `.agents/skills` and `.codex/agents`.

## Phase Outcomes

### Phase 1

Outcome: the skill and evaluator live in the official Codex runtime locations, so the workflow is discoverable by Codex without relying on legacy repo layout.

### Phase 2

Outcome: users can choose between a lightweight polish pass and a stricter evaluator-led loop without changing the main skill entrypoint.

### Phase 3

Outcome: the evaluator judges with an explicit, skeptical rubric grounded in `frontend-skill` and the harness principles from the Anthropic article.

### Phase 4

Outcome: a reusable `design_evaluator` agent exists for standalone critique and for optional use inside the polish workflow.

### Phase 5

Outcome: evaluator-led runs keep compact artifacts and concise in-chat summaries so iteration quality improves without turning into report-writing.

## Implementation Checklist

- [x] 1.0 Add `.agents/skills/polish-design/` as the runtime skill home
- [x] 1.1 Mirror the `polish-design` skill there as the canonical runtime entrypoint
- [x] 1.2 Add `.agents/skills/polish-design/agents/openai.yaml`
- [x] 1.3 Keep `allow_implicit_invocation` enabled for the main skill
- [x] 1.4 Add `.codex/agents/design-evaluator.toml` as a project-specific custom agent
- [x] 1.5 Keep AGENTS guidance in the repo root as the policy layer above both the skill and the custom agent
- [x] 2.0 Rewrite `polish-design` so it defines default and evaluator-led paths
- [x] 2.1 Keep the current review + screenshot + fix + confirm loop as the default path
- [x] 2.2 Add an explicit evaluator-led path for subagents, evaluator requests, and multi-pass polish
- [x] 2.3 Add a short pre-pass polish contract in advanced mode
- [x] 2.4 Require concise in-chat summaries for each advanced pass
- [x] 2.5 Make the evaluator choose `refine`, `pivot`, or `stop`
- [x] 3.0 Add `references/design-evaluation.md` inside the `polish-design` skill
- [x] 3.1 Make that file the evaluator’s primary methodology document
- [x] 3.2 Base the rubric on `frontend-skill` plus the article’s evaluator principles
- [x] 3.3 Add weighted categories for quality, originality, states, platform fidelity, and regression awareness
- [x] 3.4 Add explicit AI-slop and anti-pattern fail conditions
- [x] 3.5 Add calibration examples so the evaluator is harsh by default
- [x] 4.0 Author `.codex/agents/design-evaluator.toml`
- [x] 4.1 Keep the prompt narrow, critique-first, and read-only
- [x] 4.2 Instruct it to use the project `polish-design` skill and evaluator reference
- [x] 4.3 Instruct it to defer to `docs/DESIGN.md` first when present
- [x] 4.4 Instruct it to use `frontend-skill` as the aesthetic baseline
- [x] 4.5 Keep it project-specific
- [x] 4.6 Give it read-only sandbox and medium reasoning defaults
- [x] 5.0 Store advanced-run artifacts under `.agents/polish-design/`
- [x] 5.0a Store any saved screen captures under `.agents/polish-design/<run-id>/screens/`, never under `docs/`
- [x] 5.1 Keep artifacts compact and operational
- [x] 5.2 Define the core file set: `brief.md`, `pass-01-eval.md`, `pass-01-plan.md`, `pass-02-eval.md`, `summary.md`
- [x] 5.3 Track pass history: scores, blockers, changes attempted, unresolved issues, recommendation
- [x] 5.4 Require concise chat summaries after each advanced pass
- [x] 5.5 Add plateau logic for `refine`, `pivot`, and `stop`
- [x] 5.6 Refresh the legacy `skills/polish-design` copy so it does not drift from the new runtime skill
- [x] 5.7 Validate the new files and move the plan to `docs/exec-plans/completed/`
