# Review Criteria

Read this when completing `.meta-skill/review.md`.

The review mirrors the registry Quality page shape:

- one `Quality Score`
- `Discovery`
- `Implementation`
- `Validation`
- a combined severity-ordered findings list

`meta-skill review <skill-dir>` writes the deterministic validation evidence and a worksheet. The reviewing agent must complete Discovery, Implementation, the overall Quality Score, and combined findings. The TypeScript command must not fabricate Discovery, Implementation, or judge-style scores.

## Review Flow

1. Run `meta-skill review <skill-dir>`.
2. Read the target `SKILL.md` and directly linked references needed to judge runtime behavior.
3. Use the criteria below to replace every `Agent review required` placeholder in `.meta-skill/review.md`.
4. Compute Discovery and Implementation scores from the completed dimensions.
5. Use the deterministic Validation score already written by the command.
6. Compute `Quality Score` as the average of Discovery, Implementation, and Validation percentages.
7. Merge deterministic validation findings with agent-authored Discovery and Implementation findings in severity order.

Do not add `Judge Score`, `Total Score`, confidence, basis, unavailable states, sidecar JSON, or review folders.

## Reasoning Standard

The completed review should read like a compact expert quality assessment, not a checklist fill-in.

- Write Discovery and Implementation overall assessments as 2-4 substantive sentences each.
- For each dimension, write 1-3 sentences that cite concrete evidence from the description, `SKILL.md` sections, reference links, deterministic output, or missing artifacts.
- Explain both the score and the tradeoff. If a dimension is `3`, say why it is strong enough to avoid a lower score. If it is `2` or lower, name the exact weakness and what would raise it.
- Prefer quoting short phrases or naming exact sections/files over summarizing vaguely.
- Mention interactions between dimensions when they matter, such as a strong description weakened by a generic name, or clear workflow weakened by oversized references.
- Keep scoring calibrated. Do not give all `3`s unless there are no meaningful routing, runtime, disclosure, or validation weaknesses.
- Findings should be deeper than the score table: include the observed defect, why it matters in agent behavior, and the smallest useful next step.

## Score Calibration

Use strict but fair scoring.

| Score | Meaning |
|---:|---|
| 3 | Strong, specific, and ready for repeated agent use. Minor wording improvements would not materially change behavior. |
| 2 | Usable but meaningfully improvable. A future agent could still select or run the skill correctly, but there is a concrete weakness. |
| 1 | Weak or risky. The skill may be selected incorrectly, produce inconsistent work, or require the agent to infer missing process. |
| 0 | Missing, misleading, or actively unsafe for the dimension. |

Phase percentage is `phase total / 12`. Overall `Quality Score` is the rounded average of Discovery, Implementation, and Validation percentages.

## Discovery

Question: Based on the skill's description, can an agent find and select it at the right time?

Write a 2-4 sentence overall assessment before the table. Cover trigger clarity, natural user language, exclusions, and overlap risk. Do not simply restate the table.

| Dimension | Question | Scoring guidance |
|---|---|---|
| Specificity | Does the description name a concrete recurring job rather than a broad topic? | `3` concrete and scoped; `2` understandable but broad; `1` vague or mostly category-level; `0` absent/misleading. |
| Completeness | Does it say both what the skill does and when to use or not use it? | `3` what/when/not-for are clear; `2` one part is thin; `1` major trigger or boundary missing; `0` unusable. |
| Trigger Term Quality | Does it include natural terms users would actually say? | `3` strong natural and domain terms; `2` mostly technical/internal terms; `1` sparse trigger language; `0` not discoverable. |
| Distinctiveness Conflict Risk | Does it avoid overlap with nearby or generic skills? | `3` clear niche and exclusions; `2` likely usable with some overlap; `1` high conflict risk; `0` actively conflicts. |

## Implementation

Question: Does the skill give agents clear, useful runtime guidance?

Write a 2-4 sentence overall assessment before the table. Cover runtime path, output contract, reference strategy, stop/ask behavior, and whether guidance would change future agent behavior. Do not simply restate the table.

| Dimension | Question | Scoring guidance |
|---|---|---|
| Conciseness | Is the skill lean enough to read during work? | `3` tight and purposeful; `2` somewhat redundant/verbose; `1` hard to scan; `0` bloated or confusing. |
| Actionability | Does it tell the agent what to do or produce next? | `3` concrete steps, outputs, examples, checks, or commands; `2` usable but abstract; `1` mostly principles; `0` no operational guidance. |
| Workflow Clarity | Is the main path and important branching clear? | `3` clear default path and checkpoints; `2` mostly clear with gaps; `1` ambiguous sequencing; `0` no workflow. |
| Progressive Disclosure | Are optional details linked instead of bloating the main body? | `3` well-signaled local references; `2` acceptable but uneven; `1` details hidden or overstuffed; `0` broken/missing structure. |

## Validation

Validation is deterministic. Do not rescore it by feel.

The command writes:

- validation percentage
- validation pass/warning/failure table
- deterministic lint output

Use validation findings as evidence. If validation has warnings or failures, they must appear in the combined findings unless there is a more specific agent-authored finding that subsumes them.

## Findings

Write findings only for issues that materially affect discovery, implementation, validation, or later improvement work. A finding should be specific enough that another agent can apply the fix without redoing the whole review.

Use this shape:

```md
### [High] <specific issue>

Source: Quality
Phase: Discovery | Implementation | Validation
Evidence: <exact phrase, section, criterion, file, or deterministic output>
Impact: <why future skill behavior suffers>
Fix: <smallest useful change>
Next Step: <exact edit or validation command>
```

Findings must name the observed defect. Avoid vague findings like "make it clearer" or "improve implementation."
