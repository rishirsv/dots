# Skill Standards

Use this standard to create, update, or review Dots skills. The environment's
`skill-creator` provides authoring and validation instructions. This reference
adds requirements for clear prose, behavior preservation, and methods for
specific kinds of work.

Follow the host's requirements for valid skills. Use its default `skill-creator`
or `plugin-creator` for schemas, initial files, packaging, installation, and
validation commands.

## How to use this reference

The two parts below have different force:

- **Guidelines are judgment.** Follow them by default. Adapt them when the job,
  evidence, or target environment calls for a different shape.
- **Rules are requirements.** Do not waive them for convenience or a smaller
  file. Only a higher-authority constraint, such as host validity, repository
  instructions, or an explicit user decision, can override them.

Apply these standards to the skill being authored or reviewed, including the
instructions its future users will load. Encode task-specific decisions in that
skill; do not copy this reference wholesale. Apply only relevant sections.
This reference is not a fixed template, checklist, or scoring system.

## Guidelines

### Make discovery sound like the request

- **Describe when the skill applies.** Metadata must identify the work and the
  requests that should load the skill. The agent cannot use the skill body to
  correct an unclear description before that body has loaded.
- **Keep descriptions brief and specific.** Name the job and its trigger in
  words people naturally use. Remove broad claims about related topics and
  repeated capabilities. Long descriptions may be shortened before selection.
- **Distinguish related skills when needed.** Add an exclusion only when it
  prevents the agent from choosing the wrong skill.
- **Check description changes.** Compare a request that should select the
  skill, a similar request that should not, and a request for a related skill.
- **Follow the host invocation policy.** Let the default skill creator govern
  invocation settings; preserve existing user choices.
- **Collapse synonyms.** Give each distinct trigger branch one strong phrase
  instead of listing every way to say the same thing.

For a pull-request publishing skill:

- **Before:** “Publish a pull request. Use for code changes, Git, or GitHub work.”
- **After:** “Publish finished changes as a pull request. Use when the user asks
  to open or update a PR for review.”

The narrower trigger avoids loading the publishing workflow for ordinary code
edits or Git questions.

### Load only what the task needs

Keep the purpose, essential constraints, and choice of workflow in `SKILL.md`.
When a skill has several substantial modes, link each reference where its
content is needed. State when to read it. A simple skill can stay in one file.
Check whether the common workflow loads unrelated modes, manuals, or repository
maps. Load those resources only when the task needs them.

For a skill that authors and reviews other skills:

- **Before:** “Before every task, read the review, session-capture, and template
  execution references.”
- **After:** “Read the review reference for a source audit, session capture when
  turning a completed task into a skill, and template execution when the skill
  operates on a supplied template.”

A description edit can proceed without loading those unrelated methods. These
examples are illustrations, not required wording for generated skills.

### Write instructions that change behavior

- **Leave room for judgment.** Specify the outcome, relevant context, and
  decision criteria. Prescribe an exact sequence only when order protects a
  concrete dependency, permission boundary, or fragile operation. Avoid
  recipes that merely rehearse work the target model already handles.
- **Specify output needs.** When tone, length, or format affects usefulness,
  describe the audience and required result. Avoid imposing elaborate headings
  or recurring phrases on every response.
- **Frame length by the reader.** Prefer “answer only what the reader asked”
  to word counts. Keep an exact limit only when the deliverable or a consumer
  sets one.
- **Make delegation conditional.** When parallel work benefits the recurring
  job, state which independent work can be delegated and who integrates it.
  Respect the host's available agents and authorization; keep simple work local.
- **Write for the agent's decisions.** Keep a sentence when it changes an
  action, clarifies a decision or limit, or provides useful understanding.
- **Open with the work, not an aspiration.** Name what the agent inspects,
  creates, changes, decides, or verifies. A promise about quality, confidence,
  or impact does not replace the work that produces it.
- **Make the work concrete before making it shorter.** Write the actions,
  artifacts, roles, and decisions plainly. Then remove repetition without
  replacing those details with umbrella nouns or compressed policy language.
- **Apply the shared prose rules.** Use [Writing style](../../../references/writing-style.md)
  while drafting, not only after the skill is complete. Keep specialized terms
  when they express a precise concept the reader needs. Define unfamiliar terms
  before relying on them.
- **Say what it does, not how it feels.** Prefer a concrete instruction,
  mechanism, fact, or observable consequence. If a sentence only says that the
  result should be rigorous, trustworthy, useful, or high quality, state what
  produces that property or remove the sentence.
- **Use a clear actor, verb, and object.** “The grader compares each output with
  the approved criteria” is easier to execute than “Ensure robust assessment.”
  Prefer ordinary verbs such as `read`, `inspect`, `compare`, `write`, `run`,
  `check`, and `stop`.
- **Use familiar terms only when they carry stable behavior.** A word such as
  `audit` can replace repeated explanation when it reliably activates the same
  method. Do not use `evidence`, `confidence`, `quality`, or another broad noun
  as a substitute for naming the method.
- **State the positive behavior.** Use prohibitions for real guardrails and
  pair them with what the agent should do instead.
- **Write at normal volume.** State requirements plainly. Reserve capitals,
  `CRITICAL`, or stacked `must` for an instruction that an observed failure
  shows is underweighted, and put the reason beside it. When several lines are
  all marked critical, the markers stop carrying information. Write a real
  requirement as a requirement: `try to`, `if possible`, and `ideally` read as
  permission to skip it.
- **Keep examples from becoming templates.** The target copies an example's
  length, tone, and structure. When an example teaches judgment, show
  contrasting cases and label them illustrative. Use a single exact example
  only when it pins a required format.
- **Give one default.** Name the default path and when to depart from it
  instead of offering a menu of equal alternatives.
- **State the requirement, not the grader.** Replace “you will be graded on”
  with each requirement the grader checks.
- **Keep reasons attached to rules.** Explain why a rule matters when the
  reason affects judgment. Make its priority clear. A bare list can make all
  rules seem equally important, and its format may be copied into the output.
  Use lists and tables for reference data, options, and checks. A behavioral
  rule can use a bullet when the rule and its reason stay together.
- **Explain why when it changes judgment.** Keep the reason when it helps the
  agent choose between plausible actions, understand a non-obvious constraint,
  or remember the method. Do not add reasons that merely advertise the value
  of following the instruction.
- **Check whether the sentence belongs here.** If it could appear unchanged
  in unrelated skills, check whether it gives guidance this job needs. Make
  the guidance specific or remove it when it adds nothing.
- **Keep a natural voice.** Vary sentence rhythm and use examples for real
  distinctions. Read changed prose aloud. If it sounds like rubric labels,
  product copy, or institutional policy, rewrite the instruction rather than
  decorating it.

### Prune without flattening the skill

- **Check what a sentence changes.** Ask what the agent would do differently
  because it exists. Delete it only when it changes nothing and its removal
  loses no useful explanation, emphasis, voice, or navigation.
- **Account for the target model.** A workaround for an older model may now
  constrain useful judgment. Preserve operational invariants; treat uncertain
  behavioral benefits as hypotheses. Use a focused trial only when it would
  materially change the decision and the active workflow permits it.
- **Keep context only the author has.** Audience, environment facts, tool and
  script contracts, the quality bar, hard judgment calls, and the reasons
  behind constraints are not pruning targets. Prune restatements of what the
  agent already does unprompted.
- **Write current rules, not history.** Remove incident IDs, PR numbers,
  past-tense narratives, and relative phrasing such as “now”, “no longer”, or
  “also counts”; the agent never saw the earlier version. Keep a pinned
  version, path, or flag only when the job depends on it, and check it against
  the current environment.
- **Combine rules that address the same cause.** When several conditions each
  address one past incident, state their shared principle or add the missing
  context. Check that the revised rule still handles each original case.
- **Delete unnecessary sentences in full.** Do not replace an unnecessary
  sentence with a shorter, more abstract version.
- **Preserve the method while pruning.** Keep the actions, artifacts, decision
  rules, examples, and completion conditions that make the workflow
  executable.
- **Shorten structurally first.** Remove obsolete branches, duplicated
  procedures, unnecessary templates, and unconditional ceremony before
  rewriting good local prose.
- **Do not use length as evidence.** A shorter skill is better only when it
  preserves or improves the behavior, judgment, and writing quality that the
  job requires.
- **Use the environment as the source of truth.** Point to cheap authoritative
  sources such as configuration, schemas, directory structure, and `--help`.
  Keep the reason, convention, or failure pattern the environment cannot show.

### Define what done means

- **Define the finished result.** Specify the deliverable and necessary checks
  without turning every routine action into a separate gate.
- **Make completion clear and demanding.** The agent must be able to tell done
  from not-done, and the condition should require all important work. “Every
  changed caller is accounted for” drives more useful work than “review the
  callers.”
- **Match proof to risk.** Open-ended work needs an outcome and decision
  criteria. Fragile work may need exact checks, scripts, or known-fail cases.
- **Make broad work exhaustive where it matters.** Name the relevant set that
  must be accounted for, such as every selected file, finding, caller, or
  required field.
- **State what happens when the task cannot proceed normally.** Say whether
  the agent asks a question, makes an assumption, preserves partial work,
  reports that it found nothing, or stops.
- **Keep authorization concrete.** Continue work already authorized by the
  request and session. Ask only for missing decisions that materially affect
  the result or actions outside that scope; prepare independent work first.
- **Bound verification.** Keep required checks and checks for meaningful risks.
  After they pass, broaden or repeat them only for a new change, failure, or
  unresolved concern.

### Ground important decisions in evidence

- **Trace important rules.** Support them with an explicit user requirement,
  repository contract, accepted output, observed failure, or credible domain
  source.
- **Treat weak evidence as provisional.** A generated example or one unexplained
  failure is usually a hypothesis, not a universal rule.
- **Generalize only as far as the evidence allows.** Keep a narrow correction
  narrow until repeated evidence supports a broader standard.
- **Enforce checkable rules with checks.** When a script, schema, or validator
  can enforce a rule, prefer it to prose; keep the prose for why and when.
  Put lookups, scoring arithmetic, and fixed formatting in data files or
  scripts, and leave the agent the judgment.
- **Use checks that can catch a plausible error.** A failed check must change
  the next action or the reported status.

### Write knowledge-worker skills for the deliverable

- **Start with the audience and decision.** Identify who will use the result,
  what they need to decide or understand, and which sources control the answer.
- **Keep setup proportional.** A knowledge worker should receive a trustworthy
  result, not a report about the agent's process.
- **Separate kinds of claims.** Distinguish sourced facts, calculations,
  interpretations, assumptions, estimates, and unresolved gaps.
- **Make important claims traceable.** Point to a source location, calculation,
  or artifact a reader can inspect.
- **State limitations that change the decision.** Omit generic disclaimers that
  do not affect how the result should be used.

### Load the method for the artifact

The summaries below route to domain methods. Read a reference when its method
can affect the requested creation, update, review, or evaluation design; a
metadata-only edit does not need the whole domain workflow:

- **[Research and synthesis](research-synthesis.md).**
  Use for investigation, source comparison, evidence synthesis, research
  briefs, and recommendations.
- **[Reports and presentations](reports-presentations.md).**
  Use for reports, decks, briefings, memos, and other reader-facing artifacts.
- **[Spreadsheet analysis](spreadsheet-analysis.md).**
  Use for spreadsheet creation, editing, cleaning, analysis, transformation,
  and audit.
- **[Financial modelling](financial-modelling.md).**
  Use when the workbook is a financial model whose formulas, assumptions,
  scenarios, schedules, and controls carry domain meaning.
- **[Template execution](template-execution.md).**
  Use in addition to the artifact-specific reference when the skill fills,
  refreshes, converts, or edits a supplied template.

## Rules

### Write and review clear instructions

Apply [Writing style](../../../references/writing-style.md) to every skill's
instructions, descriptions, supporting references, and embedded prompts.
Use its rules for procedures, evidence, explanation, and voice as the content
requires. Exact meaning and required formats take priority over stylistic
preferences.

Before completion, review the prose as well as the skill's structure. Identify
ambiguous actors, conditions, pronouns, term changes, hidden actions, and dense
noun groups. For each defect, quote the wording, describe the possible
misreading, and supply a concrete replacement. Do not accept a skill merely
because it avoids a list of words or uses short sentences.

Compare revised instructions with the originals. Preserve selection criteria,
permissions, required actions, exceptions, examples, output fields, and
completion conditions. If the original meaning is unclear, resolve it from
source or report the uncertainty. Do not create policy through paraphrase.

For a collection-wide rewrite, record every instructional file inspected and
whether it changed, remained clear, or needs follow-up. Include supporting
references and prompts outside `SKILL.md`. Keep this coverage record with the
work's development evidence, outside the shipped skill.

### Preserve existing skills deliberately

- **Preserve accepted wording.** Keep language the user praised or asked to
  retain exactly unless the requested behavior requires a change.
- **Limit edits to the requested change.** Preserve unrelated behavior,
  judgment, explanations, examples, output quality, and authorization limits.
- **Account for every removal.** Before finishing, compare old and new source
  and identify every removed mode, branch, decision rule, example, output field,
  and accepted passage.
- **Remove dependents with the text.** When removing an instruction, mode, or
  name, search the package and repository for references to it, including
  tests, evaluations, docs, other skills, and scripts that match its wording.
  Update or remove each one.
- **Do not use line count as evidence.** A shorter file is not better unless it
  preserves or improves capability, judgment, and writing quality.
- **Do not paraphrase for uniformity.** Leave clear prose alone when the edit
  does not require it to change.

### Keep discovery complete

- **State the complete selection criteria in metadata.** The skill body
  loads after selection, so it cannot correct a vague description or one that
  overlaps another skill.
- **Treat description edits as behavior changes.** Recheck matching requests,
  similar requests that should not match, invocation mode, and related skills
  whenever the description changes.
- **Use real component names.** Do not document a skill, agent, tool, app, or
  connector that the target package does not provide.

### Keep one owner for each instruction

- **Do not duplicate authoritative rules.** Link to the owner instead of
  copying a second version that can drift.
- **Make each resource reachable when needed.** Remove empty folders,
  placeholder files, broken references, unused scripts, and assets that no
  workflow uses.
- **Keep development records outside the shipped skill.** Plans, research
  notes, rejected drafts, source collections, run history, and private examples
  belong with the maintainer's working files.
- **Keep secrets and local state out of skills.** Use the host's supported
  authentication, configuration, or state mechanism.
- **Describe composition accurately.** Loading another skill adds instructions
  to the current agent. Say to read, load, or apply that skill. Reserve
  `handoff`, `pass`, and `give` for a real change of owner or context, such as a
  subagent, another task, or an external system.

### Prove the result honestly

- **Verify the required result.** Creating a file or calling a tool alone
  does not prove completion. Finish the remaining authorized work before
  reporting success.
- **Do not present structural validation as behavioral proof.** Syntax, file
  existence, and schema checks prove structure only.
- **Do not treat self-report as evidence.** Asking a model whether it needs an
  instruction does not show what the instruction does. Use a behavioral trial
  when a removal's effect is contested. If a removal regresses, restore the
  minimal form rather than the verbose original.
- **Test meaningful failures when they matter.** Run valid and failing inputs
  for scripts or workflows whose failure handling is part of the contract.
- **Act on validation results.** A failed check must change the next action
  or the reported status.
- **State remaining uncertainty.** Do not turn missing evidence into a confident
  success claim.

### Preserve user artifacts

- **Keep original files unless the user requests in-place editing.** Work on a
  copy when the artifact format or repository policy calls for one.
- **Preserve unrequested structure.** Keep formulas, links, validations,
  relationships, numbering, layouts, styles, fields, and editable objects
  outside the requested change.
- **Do not invent missing source material.** Ask, leave an explicit gap, or use
  an authorized assumption.
- **Inspect the actual deliverable.** Check content and non-visible structure.
  Render and inspect visual artifacts when layout affects correctness.
