# Verify

Use Verify after an approved source edit. It is a narrow post-edit closeout:
validation, targeted behavioral evidence, a quick regression scan, and a clear
escalation decision.

## What Verify Can Prove

Verify can support narrow claims:

- the edited skill still passes canonical validation checks
- the approved finding or reported failure was rechecked
- one reproduced case or affected trial now behaves acceptably
- the edit did not obviously damage triggering, references, or ownership

Verify cannot prove broad release readiness, outcome superiority, trigger
reliability across a task bank, or improvement over a no-skill/current-skill
baseline. Route those questions to `skill-evaluator` or `skill-benchmarker`.

## Start From The Approved Change

Before running checks, name the verification target:

- approved change or proposal id
- source files changed
- original Judge finding or Doctor failure being closed
- intended behavior after the edit
- whether any prior trial, child thread, eval run, or `judge-review.md` exists

Do not verify a broader scope than the user approved. If the edit drifted beyond
the approved scope, return to Doctor with the expanded scope before claiming the
fix is verified.

## Run Validation

Run the canonical validator for the touched skill:

```sh
plugins/meta-skill/scripts/metaskill validate <skill-dir> --json
```

This runs package structure checks and authoring lint from the plugin-level CLI
source. It refreshes the **Validation %** used by a Judge review.

Score handling:

- If a current `judge-review.md` exists, update or report the Validation third
  and say the Overall Judge Review Score is refreshed from that review basis.
- If no current Judge review exists, report validation as pass/fail/% only. Do
  not invent an Overall Judge Review Score from validation alone.

Report validation with enough detail to audit the claim:

- command
- exit code
- `ok` value
- pass/total
- Validation %
- `Fail` checks, if any
- `Warning` checks, if any
- compact JSON output or saved output path

## Rerun Behavioral Evidence

Validation is necessary but not enough when the edit was meant to change
runtime behavior.

Use the smallest evidence path that matches the original work:

| Situation | Verify action |
|---|---|
| Doctor used guidance-first diagnosis only | Re-check the exact wording, branch, or reference that caused the failure. |
| Doctor reproduced one failure locally | Re-run that same case or prompt and compare expected vs actual behavior. |
| Doctor used a child/worktree trial | Read [skill-trial-runs.md](../../../references/skill-trial-runs.md), rerun the affected prompt through the same isolation route when practical and requested, and require the `META_SKILL_TRIAL_RESULT` block. |
| Judge finding was a static design gap | Re-check only the addressed finding heading and cite the changed text. |
| `description` or trigger behavior changed | Run validation, then recommend `skill-evaluator` trigger tuning for any confidence claim beyond the single checked prompt. |

For trial reruns, classify the result:

- `pass` — the affected case now behaves as intended; continue to regression
  scan.
- `partial` — the fix improved the case but leaves a concrete residual risk;
  report the risk and either revise with approval or escalate.
- `fail` — the targeted failure still occurs; return to Doctor.
- `blocked` — evidence could not run; report why and do not claim behavioral
  verification.

Child thread or worktree output is evidence, not authority. The parent owns the
final verification call and any parent-checkout source edits.

## Regression Scan

Use inspectable checks, not taste labels:

- Validation pass-rate did not drop.
- Any changed `description` matches the intended trigger scope; call out
  broadening or narrowing explicitly.
- All new and existing local references resolve.
- Required linked references still cover the workflow after the edit.
- No generated packages, installed plugin caches, synced config targets, or
  child worktree copies were promoted accidentally.
- New guidance is tied to the approved finding or reported failure.
- Verify did not copy evaluator suite mechanics into Skill Doctor; broader
  measurement remains owned by `skill-evaluator`.

## Escalation Decision

Use this routing table:

| User need or evidence gap | Route |
|---|---|
| One reproduced failure or one approved Judge finding | Stay in Skill Doctor Verify. |
| Two or three examples and the user wants lightweight iteration | Use the shared trial-run workflow; keep it small. |
| Should-trigger, should-not-trigger, near-miss, or trigger reliability confidence | Route to `skill-evaluator` for trigger tuning. |
| No-skill/current/candidate comparison, held-out tasks, repeated runs, variance, scoring, or release-readiness evidence | Route to `skill-evaluator`. |
| Recurring gates, publish-readiness history, or benchmark trend reporting with an existing stable suite/profile | Route to `skill-benchmarker`. |
| Recurring gates, publish-readiness history, or benchmark trend reporting without an existing stable suite/profile | Route to `skill-evaluator` first. |
| A recurring validation failure that should apply to every skill | Record a Meta-Skill validation follow-up with the failing pattern and proposed shared check; implement validator code only when the user explicitly asks for Meta-Skill validation changes. |

When escalating, pass the useful Doctor evidence forward: changed files,
approved proposal, failing prompt or finding, trial result if any, validation
output, and the claim that still needs broader evidence.

Use this handoff packet for `skill-evaluator` or `skill-benchmarker`:

```md
## Measurement Handoff
Decision to measure: <claim or risk that Verify cannot prove>
Route: <skill-evaluator | skill-benchmarker>
Target skill: <path>
Changed source files: <paths>
Candidate sources: <current skill, edited skill, child candidate, or other>
Task seeds: <prompts, failure cases, or finding headings>
Expected behavior: <what success should look like>
Suggested graders/gates: <judge rubric, validation checks, human spot check>
Existing evidence refs: <validation output, trial result, Judge finding, session>
Proof limits: <what Skill Doctor did and did not prove>
Non-claims: <claims the handoff must not assume>
```

## Verify Report

End with a compact report:

```md
## Verify Result
Approved change: <proposal or direct edit request>
Changed source files: <paths>
Validation: <command, exit code, ok, pass/total, %, Fail list, Warning list>
Behavioral evidence: <none | static re-check | reproduced case | trial result>
Closed finding/failure: <what is now resolved>
Regression scan: <pass | issue found, with detail>
Score handling: <Judge review refreshed | validation only, no score invented>
Escalation decision: <none | trial-run workflow | skill-evaluator | skill-benchmarker>
Residual risk: <remaining uncertainty>
```

Keep the report honest. If validation passed but behavioral evidence was not
run, say so directly and avoid claiming the runtime behavior is fixed.
