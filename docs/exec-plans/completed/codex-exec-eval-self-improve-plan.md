# Plan: Add Self-Improving `codex-exec-eval` Loop, Skill Versioning, and Local Grading UI

## Summary

Extend `codex-exec-eval` from a scaffold-and-run eval skill into a guided self-improving skill system for any skill under evaluation. The workflow should onboard the user around the skill to improve, scaffold the harness and test suite without exposing the underlying eval-skill library, create versioned candidate skill revisions, run every candidate through the eval suite with deterministic checks plus a fixed human-grading batch, use those results to revise the skill package itself, require `10/10` on a separate held-out validation set before promotion, and stage the winning revision for human approval before replacing the real skill.

## Phase Outcomes

### Phase 1: Document the visible workflow

Non-technical outcome: users can understand the self-improvement system in one place without needing to know the internal eval methodology.

- [x] 1.1 Add a real README inside `reference/evals-skills/skills/codex-exec-eval`
- [x] 1.2 Explain onboarding, cases, runs, grading, candidate versions, and staged promotion in plain language
- [x] 1.3 Update `SKILL.md` and onboarding references to include the new “improve a skill” mode
- [x] 1.4 Validation for 1.0: confirm the docs describe one visible workflow and do not expose hidden eval skills

### Phase 2: Model target skill improvement explicitly

Non-technical outcome: the system understands which skill is being improved, which files belong to it, and how candidate revisions are versioned.

- [x] 2.1 Expand the generated config with `target_skill`, `optimization`, `grading`, and `ui`
- [x] 2.2 Add baseline and candidate version tracking (`V1`, `V2`, `V3`, ...)
- [x] 2.3 Make the scaffold import the target skill into a candidate workspace
- [x] 2.4 Validation for 2.0: confirm baseline import and candidate version metadata are present in a generated project

### Phase 3: Add the orchestration loop

Non-technical outcome: the harness can run a real improvement cycle rather than only a single eval pass.

- [x] 3.1 Upgrade `run_eval.py` so runs are candidate-aware and produce candidate-specific outputs
- [x] 3.2 Add orchestration scripts to create next candidates, summarize failures, and stage winners
- [x] 3.3 Use fixed review batches for training labels and separate held-out validation for promotion
- [x] 3.4 Validation for 3.0: confirm the scaffold can represent `V1 -> V2 -> V3` progression and staged promotion

### Phase 4: Add the local review app

Non-technical outcome: a human can open a browser, inspect runs, and grade them without reading raw JSON files.

- [x] 4.1 Generate a local review server and static UI inside the eval project
- [x] 4.2 Show test cases, prompt/result details, deterministic checks, candidate version, and grading controls
- [x] 4.3 Persist labels and notes locally in JSON
- [x] 4.4 Validation for 4.0: confirm the app can load cases/results and save grades

### Phase 5: Enforce staged promotion

Non-technical outcome: the system can identify a winner, but it does not overwrite the real skill without an explicit approval step.

- [x] 5.1 Add holdout gate checking for `10/10`
- [x] 5.2 Add a staging area for winning candidates
- [x] 5.3 Generate promotion summaries and diffs before approval
- [x] 5.4 Validation for 5.0: confirm winners are staged and not auto-promoted

## Important Interfaces

- User-facing README: `reference/evals-skills/skills/codex-exec-eval/README.md`
- Generated config: `codex-eval.json`
- Generated review app: local web UI inside the eval project
- Candidate workspace: `candidates/V1`, `candidates/V2`, `candidates/V3`, ...
- Promotion staging area: generated inside the eval project, not applied to the source skill automatically

## Assumptions and Defaults

- The self-improvement target is the skill package itself, not only the task prompt
- Candidate versions use `V1`, `V2`, `V3`, etc.
- Human review uses a fixed review batch each round
- Promotion requires `10/10` on a separate held-out validation set
- Review labels persist locally in JSON in v1
- Promotion is staged first and requires explicit approval
