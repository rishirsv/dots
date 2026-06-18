# Codex Session Evidence

Read this when a Meta-Skill workflow needs prior Codex thread evidence: a
reported skill failure happened in an earlier session, the user points to a
thread id or title, or a new skill should be distilled from a Codex workflow.

This is a Meta-Skill evidence path, not a dependency on another skill.

## When To Use

Use Codex session evidence for:

- reconstructing a specific Skill Doctor failure from a prior Codex thread
- capturing a successful Codex workflow as source material for Skill Writer
- checking repeated corrections only when the user asks for pattern mining
- finding the exact prompt, tool sequence, approval point, or validation proof
  that a later skill change depends on

Do not use session mining for ordinary static reviews when the current files and
user report are already enough. Do not browse unrelated sessions to hunt for
patterns unless the user asks for broader pattern analysis.

## Commands

Use the shared Meta-Skill CLI surface:

```sh
plugins/meta-skill/scripts/metaskill sessions list --limit 25 --archived all --query "<terms>"
plugins/meta-skill/scripts/metaskill sessions show <thread-id> --max-chars 12000
```

Useful filters:

```sh
plugins/meta-skill/scripts/metaskill sessions list --cwd "<project-root>" --days 30 --archived all
plugins/meta-skill/scripts/metaskill sessions list --query "<skill name or failure phrase>" --json
plugins/meta-skill/scripts/metaskill sessions show <thread-id> --json
```

## Source Of Truth

- Treat `~/.codex/state_5.sqlite` as the authoritative session index.
- Use each thread row's `rollout_path` to inspect the full rollout JSONL
  transcript.
- Treat `~/.codex/session_index.jsonl` as an incomplete convenience index, not
  the source of truth.
- Memory summaries may support orientation, but they are not primary evidence
  for a reported failure or reusable workflow.

## Evidence Discipline

When using session evidence:

- cite concrete thread ids, timestamps, cwd values, and rollout paths when
  possible
- separate facts visible in the transcript from inferences about what caused the
  behavior
- inspect the rendered transcript before proposing a source edit or new skill
  rule
- prefer a concrete failure transcript, successful final slice, or repeated
  correction over a one-off phrase
- do not copy raw prompts, thread ids, local paths, model/provider names, or
  transient errors into portable runtime guidance unless they are direct runtime
  dependencies
- do not edit memory files from this workflow
- do not patch skill source, instruction files, or project docs from session
  evidence unless the user explicitly approves a concrete source change

## Extract Only What Matters

For a Skill Doctor diagnosis, extract:

- the user's expected behavior
- the actual agent behavior
- the prompt or turn where the failure appeared
- relevant tool calls, files, approvals, or validation output
- the smallest likely source of the skill failure

For Skill Writer session capture, extract:

- the recurring job, not just the one-off result
- real trigger language and nearest non-trigger boundary
- the workflow spine that succeeded
- user corrections, gates, and failure shields
- essential tools, commands, resources, and validation proof
- output shape and stop condition

Keep heavy provenance in the workbench or diagnosis notes. Put only generalized
runtime behavior into portable skill payloads.
