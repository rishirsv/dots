# Evaluation Vocabulary

| Term | Meaning |
|---|---|
| **scenario** | One standard `evals/<id>/` task, weighted checklist, and fixture definition. |
| **variant** | One frozen execution environment: runner, provider, model, prompt, skill, tools, plugins, and retrieval. |
| **experiment** | One immutable selection of scenarios, variants, repetitions, and execution settings. |
| **run** | The recorded execution of one experiment, with frozen inputs and derived reports. |
| **trial** | One scenario × variant × repetition, with response, events, artifacts, state, and grades. |
| **checklist score** | Awarded points divided by available weighted-checklist points. |
| **custom grader** | An independent code, calibrated model, human, or state-aware grader outside default grading scoring. |
| **controlled comparison** | A comparison where variants differ in one declared dimension. |
| **stack comparison** | A comparison where several execution dimensions differ; conclusions apply only to the whole variant. |

Keep execution success separate from evaluation quality. A checklist percentage
is not a binary release verdict. Custom grader verdicts are not checklist
points and must not be averaged into the weighted-checklist score.

An explicitly supplied skill measures attached-skill behavior, not natural
platform discovery or routing. A scenario difference is descriptive. General
improvement claims require representative coverage and appropriate repeated or
paired evidence.
