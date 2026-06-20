# Thread-To-Skill Improvement

Use this when the user points to a Codex thread and asks Meta-Skill to evaluate
what happened there, then improve an existing skill. This is not Skill Writer
session capture unless the user wants a new reusable skill.

## Goal

Turn one thread into disciplined improvement evidence:

1. locate the thread
2. identify the target skill
3. extract the expected behavior, actual behavior, and likely defect
4. choose the smallest route: Doctor proposal, Evaluator suite, or no change
5. keep source edits behind explicit approval

The thread is evidence, not authority. A specialist still has to inspect the
skill source and decide whether the thread shows a real skill defect.

## Locate Evidence

Prefer a live thread tool when the user gave a current app thread, title, or URL.
When local session files are the available source, use the shared CLI:

```sh
<meta-skill-root>/scripts/metaskill sessions list --limit 25 --archived all --query "<terms>"
<meta-skill-root>/scripts/metaskill sessions show <thread-id> --max-chars 12000
```

For the specific improvement handoff, use:

```sh
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> --target <skill-dir>
```

The extractor is read-only. It produces a handoff packet with thread metadata,
target skill metadata, visible user requests, visible assistant responses, an
`extracted_handoff` block, potential eval seeds, approval boundary, and coverage
limits. It does not grade the thread, diagnose root cause by itself, or edit
source.

## Classify The Thread

After reading the handoff and transcript, classify the useful signal:

| Signal | Route |
|---|---|
| One concrete skill failure | `skill-doctor` Doctor mode |
| Static design issue in one skill | `skill-doctor` Review or Doctor mode |
| Need to compare current skill and candidate skill | `skill-evaluator` |
| Trigger or routing reliability question | `skill-evaluator` trigger tuning |
| Repeated release gate or scorecard need | `skill-benchmarker` after a suite exists |
| Thread shows a new reusable workflow | `skill-writer` session capture |
| Thread has no clear skill implication | no source change |

If the target skill is ambiguous, ask one compact question for the skill name or
path. Do not scan unrelated sessions unless the user asks for pattern mining.

## Handoff Shape

Use this packet when moving from thread evidence to Doctor or Evaluator:

```md
## Thread-To-Skill Improvement Handoff
Decision: <claim or risk the thread raises>
Target skill: <path>
Thread evidence: <thread id, cwd, updated time, rollout path>
Expected behavior: <what should have happened>
Actual behavior: <what the thread shows>
Likely source: <description, workflow branch, output contract, reference, or missing gate>
Rejected alternate causes: <task ambiguity, model variance, harness issue, or user-scope mismatch>
Suggested route: <skill-doctor | skill-evaluator | no change>
Task seeds: <prompts or failure cases that could become eval tasks>
Approval boundary: <what is still read-only and what would need user approval>
Coverage limits: <what this one thread cannot prove>
```

The generated `extracted_handoff` block should be enough for a happy-path
specialist handoff:

- **Decision** names whether the thread should change the target skill.
- **Expected behavior** anchors on the latest user request.
- **Actual behavior** anchors on the latest assistant response.
- **Suggested route** chooses Doctor by default when a target skill is known,
  with Evaluator reserved for measured current-vs-candidate claims.
- **Likely source** stays non-magical: the specialist must inspect the target
  skill before naming a root cause.
- **Task seeds** preserve realistic prompts that can become eval tasks.

## Doctor Use

Use Skill Doctor when the thread shows a concrete failure or static source gap.
The Doctor diagnosis must still inspect the current skill payload and relevant
references, cite transcript facts separately from inference, and propose the
smallest source change.

Source edits require explicit approval for a concrete change. A thread handoff,
review finding, or diagnosis is not approval by itself.

## Evaluator Use

Use Skill Evaluator when the improvement claim needs behavioral evidence:

- current skill vs candidate skill
- no-skill vs current skill
- should-trigger or should-not-trigger behavior
- repeated runs or variance
- held-out tasks or release-readiness evidence

Turn thread prompts into visible `task.md` text only when they are realistic user
tasks. Keep expected behavior, judge guidance, validators, and handoff metadata
hidden in the suite. Mark single-thread seeds as directional until a human
accepts them as fair gating tasks.

## Closeout

End with one of these outcomes:

- **No source change**: the thread did not show a skill defect.
- **Doctor proposal**: a concrete source edit is recommended and awaiting
  approval.
- **Approved edit verified**: validation passed and the affected behavior was
  rechecked within the approved scope.
- **Evaluator handoff**: the thread became task seeds for measured current vs
  candidate evidence.

Do not claim broad improvement from one thread unless a suite or focused
candidate comparison measured that claim.
