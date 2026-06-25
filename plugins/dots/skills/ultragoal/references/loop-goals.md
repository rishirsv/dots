# Loop Goals

Use when a durable goal needs repeated attempts where the next action depends
on feedback.

A loop goal is:

```text
outcome + verifier + iteration policy + stop condition + evidence trail
```

## When To Use

Use a loop goal when success needs retries, waiting, repair, research rounds,
benchmark improvement, review cycles, scheduled checks, or bounded delegation.

Do not use a loop to hide uncertainty, expand scope, poll idly, or avoid a
needed user decision.

## Loop Contract

Record these in `goal.md` or `progress.md`:

- **Outcome:** the durable end state.
- **Baseline:** current metric, failure, artifact, or claim set.
- **Primary verifier:** strongest check that can fail.
- **Supporting checks:** regressions, quality bars, safety checks.
- **Iteration policy:** what changes between attempts.
- **Wake-up gate:** test, webhook, queue, schedule, file change, human event, or
  other signal that makes another pass worthwhile.
- **Evidence trail:** attempts, outputs, deltas, screenshots, links, logs.
- **Stop conditions:** success, blocker, retry limit, no new evidence, approval
  boundary, or exhausted safe paths.
- **Cost posture:** attempt cap, model/tool tiering, or wrap-up rule.
- **Anti-cheating rules:** do not weaken the verifier, benchmark, or scope.
- **Completion proof:** exact evidence required before completion.

Prefer deterministic wake-up gates. Do not spend model calls discovering that no
work exists when tests, queues, webhooks, or schedules can decide that first.

## Patterns

### Verifier Loop

Inspect, change one meaningful thing, run verifier, record evidence, choose the
next action from the failure.

Best for coding goals, UI fixes, migrations, and integration work.

### Benchmark Loop

Improve a named metric below or above a threshold while keeping regression
checks green. Record each experiment, metric delta, and next hypothesis.

Stop on success, invalid benchmark, exhausted defensible experiments, or user
approval boundary.

### Repair-Until-Green Loop

Review failure, repair, validate, feed remaining failure into the next pass.

Stop when validation passes, remaining failure stops changing, retry limit is
hit, or the next repair would weaken scope.

### Research / Audit Loop

Attempt each claim, separate confirmed findings from approximations and blocked
claims, then close with explicit uncertainty.

Stop when the claim set is covered, sources are exhausted, access blocks further
work, or new research would change the scope.

### Evaluator-Optimizer Loop

Generate candidate, grade against rubric, revise from feedback, repeat until
criteria pass or retries expire.

Best when the grader is stable and the output can be judged without taste drift.

### Reflection Loop

After a failed attempt, write the lesson, apply it to the next attempt, and
avoid repeating the same path without new evidence.

Best for long investigations and tricky repair tasks.

### Maintenance Checkback Loop

On a schedule or event, check only the declared surface, act on authorized work,
record status, and wait for the next trigger.

Best for PR maintenance, CI watch, release health, issue triage, or recurring
ops. No new initiatives unless the goal says so.

### Delegated Fan-Out Loop

Split into bounded child lanes with separate evidence. Parent integrates,
resolves conflicts, and owns completion.

Best for independent research lanes, environment discovery, alternative
approaches, or validation from a second surface.

## Progress Entry

Use this shape in `progress.md`:

```text
### Attempt N
Trigger:
Action:
Verifier:
Evidence:
Result:
Lesson:
Next action:
Stop check:
```

## Weak To Strong

- Weak: "Improve performance."
  Strong: reduce p95 below `<threshold>` on `<benchmark>` while keeping
  `<regression suite>` green; log each experiment and metric delta.
- Weak: "Keep checking the PR."
  Strong: on CI, review, or conflict changes, inspect `<PR>`, fix only
  authorized failures, rerun checks, and report status; otherwise wait.
- Weak: "Research this trend."
  Strong: produce an evidence-backed report covering `<claim set>`, separating
  confirmed, approximate, blocked, and uncertain claims.
- Weak: "Try until it works."
  Strong: run repair passes against `<verifier>` for at most `<N>` attempts,
  stop if failures repeat without new information, and preserve all evidence.
