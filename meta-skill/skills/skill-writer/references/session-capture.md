# Session Capture

Read this when the user activates Skill Writer during a Codex session, or points
to a prior Codex thread/session, and wants the observed workflow turned into a
durable skill.

## Aim

Mine the thread as evidence for a reusable workflow, then return to the normal
Skill Writer flow. The output is an ordinary portable skill, not a transcript
summary.

Stay narrow: use the current thread or the specific thread/session the user
identified. Do not scan unrelated sessions to hunt for patterns unless the user
explicitly asks.

Treat session capture as one context source for ordinary skill authoring. It
does not replace the skill-or-not gate, trigger design, payload rules, or final
validation.

## Lesson Gate

A thread can contain many durable lessons. Do not turn all of them into skills.

- One-off result: no durable artifact.
- Simple preference or fact: memory or operating rule.
- Project-specific behavior: repo doc or local instruction.
- Lightweight repeated wording: prompt or snippet.
- Portable, recurring, multi-step capability: skill.

Create a skill only for the last case. If the captured workflow appears once and
the user has not said it should recur, treat it as provisional and confirm the
recurring job in the Current Understanding.

## Locate Thread Evidence

Prefer the highest-level thread surface available:

- If thread tools are available, use the current thread context or read the
  user-identified thread by title, id, or URL.
- If local session files are the only source, inspect only the matching
  `~/.codex/sessions/**/rollout-*.jsonl` or archived session file. Use
  `session_meta.payload.id`, `turn_context`, `event_msg`, and `response_item` to
  orient the read.
- If the target thread is ambiguous, ask one question for the thread identifier
  or title before reading broadly.

Pull enough evidence to recover the repeatable workflow. Do not load the whole
session when a bounded turn range, user story, or file/tool cluster gives the
answer.

## Extract

Capture the parts that change skill behavior:

- **Trigger language**: user phrases, symptoms, file types, and handoff moments
  that should activate the new skill.
- **Non-trigger boundary**: nearby requests that appeared in the thread but
  should route elsewhere.
- **Workflow spine**: the useful sequence of decisions, reads, commands, tool
  calls, edits, checks, and finalization. Separate the recommended path from
  one-off detours.
- **Invariants**: steps or checks that held across turns, files, attempts, or
  examples. These are stronger skill material than isolated actions.
- **Tool surface**: tools, CLIs, scripts, MCP/thread/browser/computer tools,
  package managers, auth assumptions, network needs, sandbox constraints, and
  commands that were essential.
- **Files and sources**: source-of-truth files, generated files, references,
  assets, local-only scratch, and paths that must not be copied into runtime.
- **Corrections and decisions**: user corrections, rejected directions,
  approval gates, naming decisions, hard cuts, and scope boundaries.
- **Validation proof**: tests, lint, build, screenshots, rendered checks,
  diffs, package syncs, or manual inspections that proved the workflow.
- **Failure modes**: mistakes, missing inputs, broken tools, ambiguous states,
  or misleading intermediate conclusions the skill should prevent.
- **Output contract**: final answer shape, created artifact shape, caveats,
  positive-null behavior, and stop condition.

Keep provenance for reasoning while drafting, but keep it out of runtime unless
the skill directly depends on that exact source.

## Clarify Budget

Ask at most one or two questions before building. Ask only for decisions the
thread cannot answer:

1. The recurring job and nearest `not for` boundary.
2. Whether to preserve a tool/script/resource as runtime payload or leave it as
   prose guidance.

If the thread evidence gives a defensible default, state the default in the
Current Understanding and build.

## Distill

Generalize the session before writing runtime:

- Turn commands and tools into reusable operating rules only when they were
  essential to the workflow.
- Keep exact commands when deterministic repetition matters; otherwise name the
  tool choice and the reason.
- Convert specific values, paths, filenames, users, repos, dates, and failures
  into roles or conditions.
- Drop one-off file paths, thread ids, raw prompts, provider/model names,
  transient errors, and local provenance from runtime.
- Preserve user corrections as guardrails when they prevent likely future
  mistakes.
- Preserve source-vs-generated boundaries when a future agent could edit the
  wrong surface.
- Seed future eval ideas only when they naturally fall out of the session:
  a normal-path prompt and one observed failure-mode prompt are enough.

## Handoff Back

Before editing files, produce a compact Current Understanding:

```md
Current Understanding
- Job: <recurring workflow captured from the thread>
- Trigger: <user phrase>; not for <nearest boundary>
- Inputs -> output: <thread-derived input and output shape>
- Tools/resources: <essential tools, scripts, references, or none>
- Guardrails: <corrections, gates, failure modes>
- Skill shape: <candidate sections/resources/eval seeds, if any>
- Still open: <one or two questions, or none>
```

When `Still open` is `none`, create the skill. Use
[design.md](design.md) for the trigger/body design and
[cookbook.md](cookbook.md) only for the smallest useful runtime snippet.
Author the payload from the Current Understanding, not from the raw transcript.
