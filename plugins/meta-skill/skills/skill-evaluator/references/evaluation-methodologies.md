# Evaluation Methodologies

Read this when selecting prompts, comparisons, or graders.

## Choose The Claim

| Mode | Use | Required design |
|---|---|---|
| `diagnostic` | A focused question or immediate failure investigation | One to three distinct cases; one trial may support only a single-run observation. |
| `readiness` | A general claim that the skill handles its recurring job across broad coverage | At least 20 selected cases, declared coverage requirements, and coverage tags on every case. |
| `benchmark` | A comparison against a named benchmark | Readiness-level breadth plus versioned provenance, one selected split per run, a held-out split, and contamination controls. |

Do not generalize a diagnostic result into readiness. For readiness, map the
important capability branches, decision points, boundaries, near misses,
regressions, and applicable adversarial failures before selecting cases. For a
benchmark, tune only against development data and run the held-out split after
the variant and graders are frozen.

Before making a readiness or benchmark claim, record a validity review with a
`pass`, `fail`, or `unknown` status. Check four things: the tasks are solvable,
the graders measure the claimed behavior, the harness represents real use, and
the cases do not reward shortcuts. Only `pass` supports the claim.

## Start With Real Signal

Prefer prompts grounded in observed failures, accepted outputs, common user
requests, or existing runs. Use synthetic prompts as hypotheses until the user
confirms that they represent real use.

Keep a prompt when it tests a distinct behavior and its result can change a
decision. Start with two or three prompts for a diagnostic. For readiness or a
benchmark, stratify real cases across the declared coverage map and add grounded
synthetic cases only for uncovered combinations. Keep development and held-out
cases mutually exclusive and keep related or duplicate cases in the same split.

Use an ad hoc run when one prompt can answer the immediate question. Save it as
a durable case only after confirming the prompt and expected behavior.

## Choose The Comparison

Keep the prompt, fixtures, environment, and execution settings fixed while the
variant changes.

| Question | Comparison |
|---|---|
| Does the skill improve the task? | No skill vs current skill |
| Did a revision improve behavior? | Current skill vs variant revision |
| Does one implementation outperform another? | Named variant vs named variant |
| How does a prompt or skill perform against a benchmark? | Run the same benchmark cases and scoring method against each prompt or skill |

If both variants pass, the task demonstrates no uplift. If both fail, the
comparison is inconclusive until the failure is diagnosed.

Use unattended Codex Exec for comparisons so user configuration, rules,
plugins, apps, and memories do not contaminate the baseline. Native subagents inherit an
uncontrolled inventory and are limited to one-variant observations.

The built-in comparison lane therefore covers skills whose cases use core tools or
frozen fixtures. A skill that requires authenticated app or plugin tools needs an
externally controlled environment with equivalent isolation; do not claim a baseline
effect from a native observation or from variants run with different tool access.
Natural skill discovery and multi-turn behavior also need an external harness;
the built-in lane evaluates an explicitly attached skill in one task.

## Choose Repetitions And Reliability

Predeclare what reliability means:

- use `any_trial` when one success across repeated attempts satisfies the
  product requirement;
- use `all_trials` when every attempt must succeed; and
- use one trial only for a diagnostic observation when consistency is not the
  claim.

Use one trial per selected case and variant by default. Repetition is an
explicit reliability study, not a benchmark prerequisite. When reliability is
part of the claim, explain why repeated attempts are needed, show the user the
exact expanded trial count plus expected time and usage, and wait for approval
before passing `--approve-trial-count`. Preserve passed, failed, inconclusive,
ungraded, skipped, and runtime-failed trials. Report successes over all planned
trials with a binomial confidence interval. Use paired trials and the exact
McNemar test for the variant-vs-baseline inference; raw rate deltas remain
descriptive.

## Choose The Grader

Every durable graded case needs an explicit grading method. Use the most exact method that
accepts every valid result.

| Result being judged | Grader |
|---|---|
| File existence, schema, exit status, formulas, calculations, tests, or required actions | Deterministic validator |
| Correctness, usefulness, completeness, or structure with multiple valid answers | LLM judge; read [judge.md](judge.md) |
| Preference or specialist judgment that cannot be specified reliably | Human judgment |

Use transcript evidence only when the process itself is part of the expected
behavior. Keep expected outputs, judge guidance, validators, and human labels
hidden from trial workers.

Expectations without an explicit grader create advisory model feedback only;
they cannot decide a verdict. A load-bearing exact deterministic grader needs
executable known-Pass and known-Fail fixtures. For open-ended output, make
deterministic checks advisory, test at least two valid alternatives plus one
invalid result, and route the verdict to a human or calibrated model judge. A
load-bearing model judge needs
a case-local prompt, pinned executor settings, and held-out calibration whose
TPR and TNR confidence lower bounds clear the declared trust thresholds.

## Add Safety Cases When Applicable

When the task handles untrusted content, private data, or external actions, add
cases for indirect prompt injection, unauthorized actions, data disclosure,
and unintended side effects as applicable. Grade the resulting state and tool
actions, not whether the response merely uses refusal language.

When a result fails or the variants disagree unexpectedly, read
[error-analysis.md](error-analysis.md) and review the traces with the user
before changing the suite or skill.
