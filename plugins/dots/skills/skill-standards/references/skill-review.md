# Reviewing a skill

Diagnose the skill from source and existing evidence, one instruction at a
time. The review produces findings and proposed edits. A review-only request
leaves source unchanged and presents the edits for the maintainer to take
selectively. When the request also authorizes fixes, apply the supported edits
through the default `skill-creator` workflow, including its criteria for
behavioral trials.

## 1. Define the review

Take the scope and decision from the user's request.

- A broad review covers all instructions and resources the skill uses, related skill descriptions,
  repository instructions, validation evidence, and existing evaluation
  artifacts.
- A narrow review covers every file or behavior that can change the requested diagnosis.

Identify the recurring job, related work it excludes, required inputs, common
workflow, and alternative paths. Identify its output, evidence of completion,
authorization requirements, and stopping conditions. Use the relevant guidance in `standards.md`; inspect supporting
domain references only when their method can affect the diagnosis.

State the scope and any assumptions at the top of the review instead of
pausing to confirm them. The user can narrow the scope and rerun.

## 2. List the files and resources

List everything the agent loads or runs before judging any of it:

- discovery metadata: the frontmatter `description` and agent metadata such as
  `agents/openai.yaml`;
- `SKILL.md` and every reference, with the condition that loads each one;
- scripts, including their arguments, output, and failure messages;
- assets, templates, and embedded examples; and
- descriptions the skill writes for tools, subagents, or other skills.

Include the inventory in the review so the user can correct it.

## 3. Classify every instruction

Read each sentence, bullet, and example in the listed files. Ask what the agent
would do differently without it, then sort it:

- **Context only the author has:** audience, deliverable, environment facts,
  script and tool contracts, the quality bar, hard judgment calls, domain
  methods, and the reasons behind constraints. Keep it. Missing context is a
  defect.
- **A constraint on behavior:** a rule, prohibition, sequence, or limit. Check
  that it has a stated reason, a real ordering dependency, or a reader or
  consumer that requires it.
- **A restated default:** generic virtues, instructions to be thorough or
  careful, and behavior the agent already shows unprompted. It is a removal
  candidate.

Keep this distinction between context and constraints. A review that only
tries to shorten the skill can delete information the agent needs.

## 4. Scan for defects

Apply [Writing style](../../../references/writing-style.md) to descriptions,
instructions, supporting references, and embedded prompts. Check the meaning
before polishing the style.

For a prose defect, identify the action or condition that is unclear. Quote the
wording, describe a plausible misreading, and provide the exact replacement.
Check that the replacement preserves who acts, when, with what authority, and
what must be true at completion. If the original meaning is unresolved, report
that uncertainty rather than inventing a new rule.

Inspect for:

- descriptions that overlap other skills or select similar but unrelated requests;
- an opener that promises quality, confidence, or impact without naming the
  work; prose that says how the result should feel instead of what the agent
  should do; or compression that removes actions, artifacts, decision rules,
  or completion conditions;
- vague, contradictory, duplicated, no-op, or unjustifiably rigid instructions;
- emphasis without a reason, requirements softened by `try to` or
  `if possible`, and runs of prohibitions with no stated constraint;
- history in the runtime: incident narratives, relative phrasing such as “now”
  or “no longer”, stacked single-incident conditionals, and unverified paths,
  versions, or flags;
- a single example the agent will copy as a template, or numeric length limits
  that no reader or consumer requires;
- behavioral guidance in bare lists that drop each rule's reason or hide
  which rules take priority;
- a menu of equal alternatives where one default would do, and scoring
  language that describes a grader instead of stating the requirement;
- deterministic work left to the agent, such as lookup tables, point systems,
  arithmetic, or fixed formatting that a data file or script should own;
- missing modes, decisions, examples, output fields, or completion conditions;
- instructions in the wrong file and resources that no workflow loads;
- validators that accept plausible bad results;
- missing authorization, failure, stop, or partial-success behavior;
- private, source-specific, or maintainer material in the runtime; and
- tests that assert wording rather than observable behavior.

Search for the textual signals rather than eyeballing them: all-caps
`MUST|NEVER|ALWAYS|CRITICAL|IMPORTANT`, `try to|if possible|ideally`, runs of
`Do not|Never|Avoid`, `now|no longer|instead of` attached to rules, `STEP \d`
sequences for judgment work, and repeated sentences across files. A match is a
lead; confirm it with the classification in step 3.

Do not flag these, even when a search matches:

- context, as defined in step 3;
- length alone; never justify a removal by size;
- exact steps for fragile operations, such as destructive commands,
  authentication, compliance steps, or file formats where one sequence is
  safe;
- script and tool contract detail, such as arguments, limits, failure modes,
  and what a call does not return; it often needs more text, not less;
- prohibitions against a failure that still occurs, or that encode a real
  business, data, or policy constraint;
- examples that pin a required output format;
- a one-line role statement, unless it replaces the audience and deliverable;
  and
- a single closing recap of the few key constraints.

Under-specification is a defect too. When a step is vague, a contract is
missing, or completion is undefined, the correction adds text.

A file with no supported defects is a valid result. Report a defect only when you can name the
pattern and its consequence for the job; otherwise record it as an open
question.

Trace edge cases only when they can change the verdict. Structural validation
can support a mechanical claim, but it cannot prove that the skill works well.

## 5. Write findings a maintainer can use

Separate direct observation from inferred consequence. Each finding includes:

- the location as `path:line` or a line range;
- the exact text, quoted;
- the pattern it matches, from step 4 or `standards.md`;
- the likely consequence and, if it is uncertain, what evidence would disprove it;
- a confidence level: high when source, a check, or a reproduced failure shows
  the defect; medium when it matches a pattern in step 4 or `standards.md`
  with a concrete consequence; low when it rests on style or inference alone;
- an action: `remove`, `rewrite` with the replacement text, `move` with the
  destination, `add` with the new text, or `flag` with no edit; and
- static or behavioral evidence that could verify the correction.

Use the user's verdict and severity vocabulary when supplied. Otherwise lead
with `Accept`, `Accept with conditions`, `Revise`, or `Insufficient evidence`,
then order findings by likely consequence. Do not add a numeric score unless
the user supplies the question and scale.

Give every high- or medium-confidence finding a concrete action; do not
downgrade one to `flag` because it seems minor, since the maintainer can
decline it. Reserve `flag` for low-confidence items and items outside the
scope.

## 6. Propose edits

- Include only high- and medium-confidence findings whose action is not
  `flag`. Write one finding per edit so the maintainer can take them
  selectively.
- Show each edit as a diff hunk against the current source, with the
  `path:line` and the finding it resolves. The removed lines must match the
  source exactly, and the added lines are the full replacement text, not a
  description of it.
- Prefer a rewrite to a bare deletion when the instruction has a live purpose:
  restate the concern simply instead of keeping the verbose original or
  dropping it.
- Complete each removal by following “Remove dependents with the text” and
  “Do not treat self-report as evidence” in `standards.md`. When stakes are
  high, trial contested removals one at a time so a regression points to its
  cause.
- Present the edits and stop. Do not pause mid-review to ask whether to
  continue or end by asking whether to apply them. Apply edits only when the
  request authorizes fixes, and leave `flag` and low-confidence items out of
  the applied set.

## 7. Return the review

Return chat by default:

1. Verdict, scope, and assumptions.
2. The inventory.
3. A summary: finding counts by pattern and the two or three
   highest-consequence findings in prose.
4. Findings in consequence order.
5. Proposed edits, including exact replacements for prose defects.
6. Relevant rubric areas where no defect was supported.
7. Limits, `flag` items, and open questions that could change the verdict.

When the user requests a durable machine-readable review receipt, copy
[`review.json`](../assets/review.json) to the selected output location. Replace
every placeholder, repeat the finding and edit entries once per item, record the content hash of each inspected file that supports the verdict or a
finding. Do not change the receipt after completing it. Recheck relevant hashes
before consuming it later.

When a claim needs fresh behavioral evidence, state the limitation and the
smallest useful forward test. Apply supported fixes when the current request
already authorizes an update; do not add another approval gate.
