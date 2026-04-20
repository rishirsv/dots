---
name: skill-autoresearch
description: Use when a Codex skill needs measurable improvement against calibration and holdout checks instead of a one-shot rewrite.
---

# Skill Autoresearch

Improve one skill through measured checks.

Default to the smallest honest matrix. Deepen only when the target skill or the evidence demands it.

## Reference Files

Read these files only when they are needed:

| File | When to read it |
|---|---|
| [references/session-contract.md](references/session-contract.md) | Read before creating or repairing `.autoresearch/`. |
| [references/eval-matrix-design.md](references/eval-matrix-design.md) | Read before defining failure modes, scenarios, or checks. |
| [references/anti-overfitting.md](references/anti-overfitting.md) | Read before changing the eval contract or keeping a claimed win. |
| [references/judge-design.md](references/judge-design.md) | Read only when code cannot reliably decide a failure mode. |
| [references/run-review.md](references/run-review.md) | Read when the user wants a visual review surface for recent benchmark runs or needs to refresh the static site. |
| [assets/session-template.md](assets/session-template.md) | Copy into `.autoresearch/session.md` during setup. |
| [assets/config-template.json](assets/config-template.json) | Copy into `.autoresearch/config.json` during setup. |
| [assets/matrix-template.json](assets/matrix-template.json) | Copy into `.autoresearch/evals/matrix.json` before the first baseline run. |

## Inputs

- Accept a path to the target skill root.
- If the user gives `SKILL.md`, resolve its parent directory as the skill root.
- Default scope to the whole skill root.
- Resolve the session root from the target skill root, not from the surrounding workspace.

## Core Rules

- Target one skill root at a time.
- Resolve the target skill root, live `SKILL.md`, and session root deterministically before editing.
- Treat `SKILL.md` as the primary editable surface unless the failure mode clearly lives in a bundled reference or asset.
- Session state belongs at `<target-skill-root>/.autoresearch/`, never at the outer workspace root.
- Treat invocation quality as part of skill quality. If the target's frontmatter is weak, the kept version must make the job-to-be-done explicit.
- Default to a stable operational structure for rewritten skills: explicit frontmatter trigger plus `## Inputs`, `## Workflow`, and `## Guardrails`, unless the target already has a stronger established shape.
- Mandatory checks every run: invocation clarity, scope boundary, and session placement.
- When a scope boundary matters, prefer direct prohibitions such as `Do not translate...` or `Out of scope: translation` over softer contrastive wording.
- Use code checks before judge checks.
- Default to a fast matrix: 3 calibration and 2 holdout checks, code-first when possible.
- Escalate to deep mode only for larger skills, ambiguous checks, repeated losses, or explicit user request.
- Use git as memory when the skill lives in a git repo.
- Keep the eval contract stable once the baseline is established.
- One hypothesis per iteration. Keep only holdout wins.
- Stop when the skill is clearly better, clearly blocked, or clearly plateaued.

## Workflow

### Phase 1: Resolve And Mode

1. Confirm the target skill root and read `SKILL.md` fully.
2. Write down the resolved session root before creating files. It should be `<target-skill-root>/.autoresearch/`.
3. Read only the bundled resources needed to understand the current behavior.
4. Pick mode:
   - `fast`: small matrix, up to 2 iterations
   - `deep`: larger matrix, more references, judge use only when code cannot decide

### Phase 2: Setup And Baseline

1. Create `.autoresearch/` using the layout in [references/session-contract.md](references/session-contract.md).
2. Copy:
   - [assets/session-template.md](assets/session-template.md) -> `.autoresearch/session.md`
   - [assets/config-template.json](assets/config-template.json) -> `.autoresearch/config.json`
   - [assets/matrix-template.json](assets/matrix-template.json) -> `.autoresearch/evals/matrix.json`
3. Create empty run logs and report stubs if they do not exist.
4. Copy the current `SKILL.md` into:
   - `.autoresearch/working/SKILL.original.md`
   - `.autoresearch/working/SKILL.current.md`
   - `.autoresearch/working/SKILL.best.md`
5. If git is available, record the branch and current commit in `session.md`, then read recent `git log` and the last relevant diff before designing changes.
6. Read [references/eval-matrix-design.md](references/eval-matrix-design.md).
7. Identify 3 to 5 failure modes by default.
8. Prefer deterministic checks:
   - required text or structure
   - schema validity
   - broken-link checks
   - frontmatter and section checks
   - file existence or diff-based checks
9. Unless the target already has a clearly better structure, treat these sections as required in the winning rewrite:
   - `## Inputs`
   - `## Workflow`
   - `## Guardrails`
10. If a candidate improves one failure mode by dropping previously established structural or safety sections, treat that as a regression rather than a win.
11. Unless the target already has a strong trigger, include one explicit check for invocation clarity:
   - `description` should say when to use the skill
   - prefer wording that starts with `Use when...` or is equivalently direct
   - the trigger should name the real job-to-be-done, not only the artifact type
12. Use a judge only when code cannot decide the criterion.
13. Split scenarios into:
   - calibration scenarios used during tuning
   - holdout scenarios used to confirm real gains
14. Record the full matrix in `.autoresearch/evals/matrix.json`.
15. Run the unchanged skill against the matrix.
16. Record one baseline entry in `.autoresearch/results.jsonl`.
17. Write the main weak points and invariants to preserve in `.autoresearch/reports/baseline.md`.
18. Do not start rewriting until the baseline exists.

### Phase 3: Iterate

For each iteration:

1. Read `.autoresearch/session.md`, `.autoresearch/results.jsonl`, and recent git history.
2. Pick one focused hypothesis.
3. Edit only the minimum in-scope files needed to test that hypothesis.
4. Sync the latest candidate into `.autoresearch/working/SKILL.current.md`.
5. Run calibration checks first.
6. If calibration does not improve:
   - discard or revert the change
   - log why it failed
   - move on
7. If calibration improves, run holdout checks.
8. Keep the change only if the holdout result still holds.
9. When a change is kept:
   - sync the winner into `.autoresearch/working/SKILL.best.md`
   - log the reason the change matters
   - update `session.md` with what was learned
10. Default cap: stop after 2 serious iterations unless the user asks for deeper work or the current evidence clearly justifies one more pass.

### Phase 4: Finish

1. Compare `SKILL.original.md` against `SKILL.best.md`.
2. Write `.autoresearch/reports/final.md` with:
   - what improved
   - what regressed or stayed risky
   - what was intentionally preserved
   - whether to adopt, adopt with review, or reject
3. If the user wants the winning version applied, sync the best candidate back to the live skill files and leave the session artifacts for traceability.
4. If the user wants a visual review surface for benchmarked runs, refresh the static run-review site using [references/run-review.md](references/run-review.md).

## Sub-Agent Guidance

Use sub-agents only when they materially improve setup or validation.

Good roles:

- `failure-mode scout`
- `holdout writer`
- `judge reviewer`
- `independent verifier`

Do not delegate the main keep or discard decision for each iteration.

## Anti-Patterns

- Building a huge matrix by default.
- Optimizing only against the prompts that invented the rubric.
- Changing the matrix every time the current candidate loses.
- Using one vague judge for “overall quality”.
- Keeping a calibration win that fails holdout.
- Making multiple unrelated edits in one iteration.
- Letting the rewrite win by broadening scope.
- Creating `.autoresearch/` at the workspace root.
- Treating `plugin-eval` or `skill-audit` as the sole success function.
- Leaving `.autoresearch/` inside this skill bundle instead of the target project.
