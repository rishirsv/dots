# Source Distillation

Read this when the user wants a skill created from source packs, example
input/output pairs, transcripts plus strong notes, prior artifacts, research
materials, or comparable finished work.

## Aim

Turn source material into reusable skill rules before drafting runtime guidance.
The output is not a source summary. It is a candidate operating model for the
future skill: trigger language, input requirements, output contract, workflow
moves, evidence rules, style constraints, failure shields, resources, and future measurement
seeds.

Keep raw source, provenance, client facts, and one-off examples out of runtime
unless they are approved reusable runtime material.

## Source Roles

Classify files before extracting rules:

| Role | Use for | Do not use for |
|---|---|---|
| Raw inputs | What the future skill must inspect or transform. | Runtime wording or final style. |
| Exemplar outputs | Output shape, tone, structure, judgment moves, omissions, and caveat style. | Source facts unless the output cites or preserves them. |
| User instructions or corrections | Trigger language, priority rules, non-goals, and approval gates. | Background filler or one-off preferences. |
| Process evidence | Repeated steps, tool choices, validation, and handoff points. | Detours that did not improve the result. |
| Reference material | Domain concepts, schemas, rubrics, or policy that future runs need. | Copying source-specific text into runtime. |
| Weak or noisy material | Failure modes, anti-patterns, and near misses. | Positive examples to imitate. |

If roles conflict, prefer explicit user corrections, accepted final artifacts,
and repeated patterns over draft material.

## Pair Inputs To Outputs

When past inputs and outputs are available, build a small pairing matrix before
writing runtime:

| Pair | Input signal | Output move | Candidate rule | Confidence |
|---|---|---|---|---|
| `<file or group>` -> `<output>` | `<what mattered in the input>` | `<what changed in the output>` | `<reusable rule>` | `<high/medium/low>` |

Use the matrix to find the rules that actually explain the good output:

- What did the output preserve from the input?
- What did it compress, merge, reframe, reorder, or omit?
- What evidence standard did it apply before making a claim?
- What did it refuse to infer?
- What section names, labels, voice, and caveat patterns repeat?
- What would a weaker generic agent likely miss?

Do not overfit to a single file name, speaker, client, date, tool, or anecdote.
Convert instances into roles and conditions.

## Promote Rules Carefully

Promote a candidate rule into runtime when one of these is true:

- It appears across multiple good examples.
- It is explicitly stated or corrected by the user.
- It is required by a source-of-truth document, schema, template, policy, or
  accepted artifact.
- It prevents a likely, costly, or repeated failure.

Mark a rule as provisional when it appears in only one example but seems
important. Ask only when the answer changes routing, runtime behavior, resource
choice, or approval gates.

When examples conflict, do not average them. Name the conflict, choose the
authority order if one is clear, or preserve the branch condition in the draft
outline.

## Knowledge Work Examples

For transcript-to-notes, interview-to-brief, research-to-memo, or similar
knowledge work skills, distill the transformation rather than the topic:

- Which raw signals become the synthesis spine: decisions, action items,
  stakeholder concerns, themes, evidence, chronology, risks, or open questions?
- How does the exemplar handle uncertainty, missing attribution, weak evidence,
  tangents, and duplicated discussion?
- What is intentionally absent from the good output, such as full chronology,
  filler, raw transcript blocks, or unsupported interpretation?
- What tone and density does the output use for the likely reader?
- What final artifact shape should recur: notes, minutes, action register,
  decision brief, readout, memo, tracker, or handoff?

Example: when transcripts plus strong meeting notes are the source pack, extract
rules such as "group discussion into reusable themes before chronology," "name
owners only when the transcript supports ownership," and "separate decisions
from follow-ups." Do not copy participant names, client facts, or the specific
meeting storyline into runtime unless the skill is intentionally
organization-specific.

## Runtime Placement

After distillation, decide where each rule belongs:

| Distilled material | Put it here |
|---|---|
| Default workflow, trigger boundary, input requirements, output contract, and failure handling | `SKILL.md` |
| Conditional procedures, source hierarchies, rubrics, long examples, style calibration, or source-specific branches that should be loaded only when needed | `references/` |
| Deterministic transformations, validators, extractors, converters, or artifact checks | `scripts/` |
| Approved reusable templates, schemas, boilerplate, sample workbooks, or starter files | `assets/` |
| Approved runtime datasets or structured maps that the skill must consult | `resources/` |
| Scrubbed examples that future agents should inspect for shape or tone during runtime | `examples/` |
| Raw source packs, private examples, future measurement notes, rejected rules, provenance notes, and research reports | `.meta-skill/` project workbench or external project docs |

Use `examples/` only when the examples are approved runtime calibration
material. If the examples are sensitive, client-specific, source evidence, or
only useful during authoring, keep them out of the portable payload.

## Distillation Notes

Before drafting or editing `SKILL.md`, produce compact notes in chat or in
`.meta-skill/docs/` for project mode:

```md
Source Distillation Notes
- Source roles: <raw inputs, exemplar outputs, corrections, references, weak material>
- Reusable job: <the recurring skill job inferred from the source>
- Trigger language: <phrases, file types, handoff moments, and nearest not-for boundary>
- Output contract: <shape, tone, density, required sections, positive-null behavior>
- Candidate rules: <promoted and provisional rules with confidence>
- Runtime resources: <references/scripts/assets/resources/examples needed, or none>
- Keep out of runtime: <raw source, client facts, provenance, one-off examples>
- Open decisions: <only decisions that change routing, runtime behavior, resources, or gates>
```

Then map the promoted rules into the required answer-set in
[interview.md](interview.md), return to [design.md](design.md) for trigger and
runtime shape, and use [cookbook.md](cookbook.md) only for the smallest snippets
that make the distilled behavior executable.
