# Runtime Adapters

Read this when the current runtime does not provide Claude Code's Workflow
primitive or schema-enforced subagents.

## Required Behavior

Replicate observable behavior, not provider internals:

- deterministic phase order
- parallel critics when available
- independent verification for every finding
- schemas or strict output checks
- journaled prompts/results when the pass is long
- resumable or at least restartable state
- explicit approval before execution

If the runtime cannot provide true parallelism, run the roles sequentially and
label the pass `sequential Ultraplan`. Do not claim a multi-agent pass happened.

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

## Degraded Mode

Use degraded mode for medium tasks when multi-agent tools are unavailable:

1. Map locally.
2. Run the six lenses as separate labeled passes.
3. Create a finding table.
4. Run a separate refutation pass over every finding.
5. Draft three designs.
6. Judge them with an explicit score table.
7. Synthesize and validate.

Report the degradation honestly. The upgraded plan can still be useful, but the
validation boundary is weaker than a true independent multi-agent run.

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
