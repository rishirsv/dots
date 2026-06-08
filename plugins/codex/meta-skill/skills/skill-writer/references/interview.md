# Interview

Read this before scaffolding. The interview is the primary user-context surface:
complete the answer-set from existing context first, then ask only for the
decisions context cannot answer. Draft the settled intake into `SKILL.md`
itself as the initial outline, then iterate that file into final runtime
guidance.

## Required Answer-Set

Know all of these before scaffolding. Answers may come from the conversation, a
captured session, source material, comparable skills, repo conventions, or a
question.

| Field | Required answer |
|---|---|
| Job | The one recurring job the skill does, not what happened once. |
| Trigger | Real user language that should fire the skill, plus the nearest `not for` boundary. |
| Inputs and output | What the skill consumes and the expected output shape or artifact. |
| Invariants and failure shields | What the skill should reliably preserve, prevent, or flag; include common mistakes and user corrections. |
| Fragility | Whether the work is judgment prose, fixed-shape output, script-backed, or a strict sequence. |
| Gates | Approvals required before external writes, destructive actions, publishing, sending, install/sync, or final client-facing delivery. |
| Project mode | Portable-only, or project mode with `.meta-skill/` docs, research, fixtures, package artifacts, and team reuse material. |

If a required answer is thin but not blocking, record the best defensible default
and mark the remaining uncertainty in `Still open`.

## Context-First Intake

Resolve answers before asking:

1. Mine the current conversation, provided files, source pack, and user
   corrections.
2. If the user points to a current or prior thread, use
   [session-capture.md](session-capture.md) to extract the same answer-set.
3. Skim one or two comparable skills for trigger phrasing, section shape, gates,
   and resource choices.
4. Infer sensible defaults from the skill type in [design.md](design.md).

Ask only for decisions that change routing, runtime behavior, resources,
approval gates, or project mode.

## Tight Question Shape

Use one screen. Ask numbered questions with lettered options and a recommended
default. Prefer a `defaults` fast path so the user can answer in seconds.

Pattern:

```md
Skill outline - a couple of quick decisions before I scaffold.

1. When should it trigger?
a) <real user phrasing inferred from context> (recommended)
b) <broader alternative>
c) Not sure — use default

2. Set up a workbench?
a) Portable-only, no workbench (recommended)
b) Project mode with `.meta-skill/` authoring docs, research, fixtures, and package output
c) Not sure — use default

Reply with: `defaults`, or a compact answer like `1a 2b`.
```

Always recommend an answer. Do not ask open-ended questions when tight choices
would resolve the ambiguity faster.

## Draft Skill Outline

Log the settled result in `SKILL.md` before runtime drafting. The scaffolded
skill can start with this outline, but the final skill should rewrite or delete
intake scaffolding once the runtime guidance is settled:

```md
Draft Skill Outline
- Job: <one recurring job>
- Trigger (+ not for): <real user phrasing>; not for <nearest boundary>
- Inputs and output: <inputs -> output shape>
- Invariants and failure shields: <must preserve/prevent/flag>
- Fragility: <judgment prose | fixed shape | script-backed | strict sequence>
- Gates: <approval gates or none>
- Project mode: <portable-only | project mode with .meta-skill/...>
- Still open: <none, or the smallest unresolved uncertainty>
```

When project mode exists, use `.meta-skill/` only for durable non-runtime
authoring material: docs, research reports, source-pack notes, fixtures,
rejected approaches, review decisions, package artifacts, and future
measurement artifacts once that process is designed. Runtime-relevant guidance
belongs in `SKILL.md` or a linked runtime file.

## Skip Rules

The interview self-bypasses; the user does not need to ask.

- Context complete: if conversation, files, source material, comparable skills,
  or session extraction answer every required item, confirm the draft outline in
  one compact block and proceed.
- Single-shot: if the user says "just build it," "no questions," or "one-shot,"
  take the strongest defensible interpretation, record unresolved choices in the
  draft outline, and proceed.
- Not skill-shaped: if routing shows the idea belongs in an answer, doc, memory,
  validator, app, or managed system, do not interview for a skill.

Skipping changes the clarification budget, not the quality budget. The draft
outline still needs a real job sentence, trigger contract, and output shape
before runtime drafting.
