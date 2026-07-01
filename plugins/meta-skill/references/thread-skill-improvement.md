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

## When To Use Session Evidence

Use Codex session evidence for:

- reconstructing a specific Skill Doctor failure from a prior Codex thread
- capturing a successful Codex workflow as source material for Skill Writer
- checking repeated corrections only when the user asks for pattern mining
- finding the exact prompt, tool sequence, approval point, or validation proof
  that a later skill change depends on

Do not use session mining for ordinary static reviews when the current files
and user report are already enough. Do not browse unrelated sessions to hunt
for patterns unless the user asks for broader pattern analysis.

## Source Of Truth

- Treat `~/.codex/state_5.sqlite` as the authoritative session index.
- Use each thread row's `rollout_path` to inspect the full rollout JSONL
  transcript.
- Use `sessions extract` for existing-skill improvement handoffs; it is a
  read-only packet generator, not a diagnosis or edit command.
- Treat `~/.codex/session_index.jsonl` as an incomplete convenience index, not
  the source of truth.
- Memory summaries may support orientation, but they are not primary evidence
  for a reported failure or reusable workflow.

## Evidence Discipline

When using session evidence:

- cite concrete thread ids, timestamps, cwd values, and rollout paths when
  possible
- separate facts visible in the transcript from inferences about what caused
  the behavior
- inspect the rendered transcript before proposing a source edit or new skill
  rule
- prefer a concrete failure transcript, successful final slice, or repeated
  correction over a one-off phrase
- do not copy raw prompts, thread ids, local paths, model/provider names, or
  transient errors into portable runtime guidance unless they are direct
  runtime dependencies
- do not edit memory files from this workflow
- do not patch skill source, instruction files, or project docs from session
  evidence unless the user explicitly approves a concrete source change

## Locate Evidence

Prefer a live thread tool when the user gave a current app thread, title, or URL.
When local session files are the available source, use the shared CLI:

```sh
<meta-skill-root>/scripts/metaskill sessions list --limit 25 --archived all --query "<terms>"
<meta-skill-root>/scripts/metaskill sessions show <thread-id> --max-chars 12000
```

Useful filters:

```sh
<meta-skill-root>/scripts/metaskill sessions list --cwd "<project-root>" --days 30 --archived all
<meta-skill-root>/scripts/metaskill sessions list --query "<skill name or failure phrase>" --json
<meta-skill-root>/scripts/metaskill sessions show <thread-id> --json
```

For the specific improvement handoff, use:

```sh
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> --target <skill-dir>
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> --target <skill-dir> --json
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

## Extract Only What Matters

For a Skill Doctor diagnosis, extract:

- the user's expected behavior
- the actual agent behavior
- the prompt or turn where the failure appeared
- relevant tool calls, files, approvals, or validation output
- the smallest likely source of the skill failure

For a thread-to-skill improvement handoff, extract:

- the target skill path or the blocking ambiguity about which skill is in
  scope
- the thread facts needed for evidence provenance
- observed user request and assistant behavior
- the expected-vs-actual behavior a specialist can inspect
- prompts or failure cases that could become eval seeds
- approval boundary and coverage limits

For Skill Writer session capture, extract:

- the recurring job, not just the one-off result
- real trigger language and nearest non-trigger boundary
- the workflow spine that succeeded
- user corrections, gates, and failure shields
- essential tools, commands, resources, and validation proof
- output shape and stop condition

Keep heavy provenance in the workbench or diagnosis notes. Put only
generalized runtime behavior into portable skill payloads.

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
