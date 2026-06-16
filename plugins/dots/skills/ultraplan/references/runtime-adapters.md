# Runtime Adapters

Read this when the current runtime does not provide a Workflow primitive,
schema-enforced subagents, or cheap parallel fan-out.

## Required Behavior

Replicate observable behavior, not provider internals:

- deterministic phase order
- repo-grounded critique before plan edits
- fresh verification for plan-changing findings
- schemas or strict output checks when using subagents
- journaled prompts/results for Focused or Full passes
- resumable or at least restartable state
- explicit approval before execution

Lean mode is expected to run locally or sequentially. Do not label it degraded.
If Focused or Full mode cannot provide true parallelism, run roles sequentially
and label the pass `sequential Focused Ultraplan` or `sequential Full
Ultraplan`. Do not claim a multi-agent pass happened.

## Tool Mapping

| Claude Workflow Feature | Local Approximation |
|---|---|
| `Workflow` script | parent agent coordinates phases with available subagent tools, or runs each role sequentially |
| `parallel()` | launch independent subagents concurrently when the runtime has them |
| `pipeline()` | verify each lens's findings as soon as they return; otherwise batch after all critics finish |
| schema-enforced output | ask for JSON matching the schema, parse/validate with local tooling when available, reprompt on invalid output |
| journal/resume | save prompts and returned JSON under the chosen plan directory or thread state |
| `AskUserQuestion` | ask one concise structured approval question in chat |
| `EnterPlanMode` / `ExitPlanMode` | read-only planning posture plus explicit user approval before edits |

## Lean Local Mode

Use this as the normal daily path:

1. Map locally.
2. Run one bundled six-lens critique.
3. Create a finding table.
4. Select the top 3-5 plan-changing findings.
5. Run a separate refutation pass over selected findings.
6. Choose one re-scope, usually minimal-correct with reuse-maximal pressure.
7. Synthesize the upgraded plan and changelog.
8. Validate structure, evidence, and diff.

Report the mode honestly. The upgraded plan can still be strong because the key
control is fresh verification, not the number of agents.

## Focused Or Full Mode

Use subagents or external calls for Focused and Full modes when independence
matters. Keep prompts and results restartable:

- save each role's prompt, result, and validation status
- validate structured outputs before synthesis
- rerun only invalid or stale role outputs when possible
- keep raw transcripts out of the final plan; summarize them in the changelog

## State Files

When writing local state, keep it beside the plan or in the repo's plan
directory:

```text
<base>.ultra.<ext>
<base>-ultra-changelog.md
<base>-ultra-run.jsonl       optional prompt/result journal
<base>-ultra-findings.json   optional structured findings
```

Do not store secrets, credentials, or private external context in these files.
