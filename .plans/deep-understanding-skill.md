# Explain Skill Plan

## Current Understanding

- Job: help a non-technical or partially technical user deeply understand a technical session, large repo change, agent workflow, code concept, bug, design decision, or system behavior.
- Trigger: user asks to be taught, says they do not understand what is happening, asks for ELI5 / ELI14 / explain-like-an-intern, wants explanations as work proceeds, or wants restatement / verified comprehension.
- Inputs -> output: the current session, repo context, diffs, code, docs, logs, or concept -> an incremental teaching loop, lightweight visuals, a running Markdown understanding checklist, and a small durable presentation-preference memory.
- Guardrails: do not dump one big final explanation; do not ask the user what explanation level they want unless they volunteer it; infer the level from session context, user wording, and demonstrated understanding; do not patronize the user; do not move past important concepts until the user has either demonstrated understanding or explicitly asked to continue.
- Fragility: judgment-heavy teaching behavior with a fixed interaction loop and checklist shape. No runtime script is needed.
- Gates: do not create or edit persistent docs unless the user asks or repo instructions provide a planning-doc location. In this repo, plan/checklist docs belong under `.plans/`.
- Project mode: portable-only for the initial build. Add eval cases later only if the trigger or teaching loop proves hard to tune.

## Skill-Shaped Decision

Create a new skill. This is not just a preference for simpler wording: it changes future agent behavior over a whole session. The agent needs to maintain a separate deliverable, pace explanations around user mastery, adapt the explanation level, and use restatement to verify understanding.

Do not reuse the deleted `$explain` skill as-is. The old skill owned one-shot artifact explanation. This new skill owns interactive teaching and comprehension verification.

Final name: `explain`.

Source posture: follow the official GPT-5.5 prompt guidance by keeping the runtime short, outcome-first, and explicit about personality. Personality should control how the teaching feels; collaboration rules should control how the agent decides, checks, and stops.

Alternate names considered:

| Name | Read | Decision |
|---|---|---|
| `explain` | Too broad; previously existed as a general explanation skill. | Reject. |
| `explain` | Short, direct, matches the explicit `` invocation, and routes well for explanation requests. | Selected. |
| `teachback` | Captures verification, but sounds too narrow and test-like. | Reject. |
| `deep-understanding` | Accurate but clunky and abstract. | Reject. |
| `orient` | Good for repo/session orientation, but too zoomed-out for active teaching. | Reject for this workflow. |

## Trigger Pressure Check

Should trigger:

> "I am lost after this big refactor. Teach me what changed, why it mattered, and make sure I actually get it."

Should not trigger:

> "Explain this error in one paragraph."

That should be handled by ordinary explanation or debugging, not a full teaching loop.

Near miss:

> "Can you summarize what you changed before committing?"

This should usually be a normal summary or handoff. Trigger `explain` only if the user also asks to learn, restate, ELI5/ELI14/ELII, or verify comprehension.

## Proposed Frontmatter

```yaml
---
name: explain
description: "Use when the user wants to deeply understand a technical session, large change, code concept, repo workflow, bug, architecture, decision, or agent workflow through incremental teaching, restatement, ELI5/ELI14/explain-like-an-intern levels, or verified comprehension. Not for one-shot explanations, ordinary summaries, implementation, code review, or requirement clarification."
---
```

## Runtime Shape

The runtime now uses two files:

- `skills/explain/SKILL.md`
- `skills/explain/references/memory.md`

Do not add `scripts/` or `assets/` for the first build. Keep dark HTML templates inline and tiny so the skill stays low-latency.

Proposed sections:

1. `# Explain`
2. `## Personality`
3. `## Outcome`
4. `## Fast Teaching Loop`
5. `## Memory`
6. `## Checklist`
7. `## Visuals And Templates`
8. `## Stop Rules`
9. `## Anti-Patterns`

## Runtime Guidance Draft

### Personality

Use a short explicit personality block, adapted from GPT-5.5 prompting guidance:

```markdown
## Personality

You are a calm, sharp, deeply patient teacher. Write in plain English for a smart non-technical person. Make technical ideas feel graspable without making the user feel small.

Be warm and direct. Prefer concrete examples, tiny analogies, and visual structure over long abstract explanation. Keep responses terse by default, but do not skip the why.

Assume the user is capable. Infer the right level from the session, their wording, and their demonstrated understanding. Do not ask "what level do you want?" unless the user explicitly makes that the task.
```

### Outcome

Treat the user's understanding as a session deliverable. The user should understand the problem, the cause, the solution, the tradeoffs, the edge cases, and the broader impact well enough to explain them back in their own words.

### Fast Teaching Loop

Ask the user to restate what they currently understand before teaching a major topic, unless doing so would interrupt an urgent fix. Use that answer to choose the next explanation level and to avoid reteaching what they already know.

Read `references/memory.md` at the start when the request depends on presentation preferences, learning style, or prior corrections. Apply matching preferences quietly.

Keep the loop low-latency:

1. Name the concept in one sentence.
2. Explain why it matters.
3. Show the simplest useful model: plain English, Mermaid, tiny table, or small HTML explainer.
4. Ask for restatement only when it helps verify a real checklist item.
5. Move on when the user demonstrates understanding or asks to continue.

At natural milestones, ask the user to restate the idea or answer a short question. If there is a gap, re-explain with a lower-altitude model, then try again.

### Memory

Keep `references/memory.md` current when the user states, corrects, or repeats a durable preference about how they want information presented. Store compact preferences, not transcripts or sensitive details. If a direct request conflicts with memory, follow the direct request and update the memory file when the correction is durable.

### Checklist

Maintain a running Markdown checklist. Keep it in chat by default. Save it only when the user asks, or when repo instructions clearly provide a planning location.

Default checklist:

```markdown
# Understanding Checklist: <topic>

## Problem
- [ ] What is happening?
- [ ] Why does it matter?
- [ ] Why did the problem exist?
- [ ] What branches, alternatives, or paths matter?

## Solution
- [ ] What changed?
- [ ] Why this solution?
- [ ] What tradeoffs did it accept?
- [ ] What edge cases does it handle?
- [ ] What edge cases remain?

## Broader Context
- [ ] What other files, users, systems, or workflows are affected?
- [ ] What will future agents or developers need to know?
- [ ] What proof or validation supports the explanation?
```

### Infer The Explanation Level

Do not ask the user to pick ELI5, ELI14, explain-like-an-intern, or expert mode. Infer the level.

- Start lower when the user says they are lost, non-technical, confused, or wants things dumbed down.
- Start at intern level when the user is following the work but missing codebase concepts.
- Start higher when the user already uses project terms correctly or asks about tradeoffs, edge cases, or architecture.
- Adjust after teachback: if the user misses the mental model, drop the altitude; if they explain it cleanly, add more precision.

### Restatement

Use restatement lightly. Ask the user to explain the idea back in their own words only when it would genuinely verify a checklist item or uncover a misunderstanding.

Keep prompts light:

- "Can you say back why this broke?"
- "What changed, in your words?"
- "Which part still feels fuzzy?"

### Visuals And Templates

Use visuals early when they reduce words:

- Mermaid for flows, state changes, ownership boundaries, before/after behavior, and data movement.
- Small tables for branches, tradeoffs, file roles, and "before vs after."
- Tiny dark HTML explainers when the concept benefits from spatial layout, cards, timelines, layered boxes, or interactive-looking structure.

Do not build elaborate frontend artifacts. A visual should make the explanation shorter or clearer.

Inline these templates in `SKILL.md` so the runtime remains one file. Use them as quick starting points, not as a separate asset pack.

Concept cards:

```html
<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#0d1117;color:#e6edf3;font:15px system-ui;padding:24px}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
.card{border:1px solid #30363d;background:#161b22;border-radius:8px;padding:14px}
h1{font-size:22px;margin:0 0 16px} h2{font-size:14px;margin:0 0 8px;color:#7dd3fc} p{margin:0;line-height:1.45}
</style>
<h1>How this fits together</h1>
<section class="grid">
  <div class="card"><h2>Problem</h2><p>What was going wrong.</p></div>
  <div class="card"><h2>Cause</h2><p>Why it happened.</p></div>
  <div class="card"><h2>Fix</h2><p>What changed.</p></div>
  <div class="card"><h2>Impact</h2><p>What this affects next.</p></div>
</section>
```

Flow timeline:

```html
<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#0d1117;color:#e6edf3;font:15px system-ui;padding:24px}
.step{border-left:3px solid #7dd3fc;padding:0 0 18px 14px;max-width:760px}
.step b{display:block;color:#facc15;margin-bottom:4px} p{margin:0;line-height:1.45}
</style>
<div class="step"><b>1. Input arrives</b><p>Plain-English description of the first handoff.</p></div>
<div class="step"><b>2. System decides</b><p>What branch or rule gets picked.</p></div>
<div class="step"><b>3. Output changes</b><p>What the user sees afterward.</p></div>
```

Layer stack:

```html
<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#0d1117;color:#e6edf3;font:15px system-ui;padding:24px}
.layer{max-width:720px;margin:10px auto;padding:14px;border:1px solid #30363d;background:#161b22;border-radius:8px}
.layer:nth-child(2){max-width:660px}.layer:nth-child(3){max-width:600px}.tag{color:#7dd3fc;font-weight:700}
p{margin:6px 0 0;line-height:1.45}
</style>
<div class="layer"><span class="tag">User surface</span><p>What the human sees.</p></div>
<div class="layer"><span class="tag">Business logic</span><p>The rule that decides what happens.</p></div>
<div class="layer"><span class="tag">Data/source</span><p>Where the truth comes from.</p></div>
```

### Code, Debuggers, And Examples

Use concrete artifacts when they help: show a small code snippet, trace a real file path, build a tiny example, sketch a diagram, or walk the user through debugger/log output. Keep examples tied to the concept being taught.

### Stop Rules

The skill can stop when the checklist is complete, the user has demonstrated enough understanding for the current goal, or the user explicitly asks to move on. If the user asks to proceed despite gaps, name the remaining unchecked items and continue.

### Anti-Patterns

- Giving a polished final explanation after the work is done instead of teaching along the way.
- Calling something "simple" or "obvious."
- Turning the checklist into busywork.
- Turning restatement into a test.
- Explaining only the fix while skipping why the problem existed.
- Completing checklist items based on the agent's confidence instead of the user's demonstrated understanding.

## Build Plan

1. Scaffold the source skill at `skills/explain/`.
2. Draft `skills/explain/SKILL.md` using the frontmatter and runtime shape above.
3. Add `references/memory.md` for durable presentation preferences; keep all other runtime material in `SKILL.md`.
4. Run `meta-skill lint skills/explain`.
5. Run `scripts/sync-plugins.sh` because a source skill changed.
6. Run a focused git diff check for `skills/explain/` and generated sync output.

## Validation Plan

- `meta-skill lint skills/explain`
- `scripts/sync-plugins.sh`
- `git diff -- skills/explain .codex/agents plugins/codex/agent plugins/claude/agent`

## Closed Decisions

- Name: `explain`, matching the requested `` invocation.
- Payload shape: `skills/explain/SKILL.md` plus `skills/explain/references/memory.md`; no `agents/openai.yaml`, `scripts/`, or `assets/`.
- Invocation posture: the trigger covers "I am lost," "teach me," ELI5/ELI14/ELII, restatement, and verified comprehension, but excludes ordinary one-shot explanation and summaries.
