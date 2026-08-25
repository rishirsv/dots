# Skill Practices

This is the shared Dots quality standard for agent skills. `skill-standards`
uses it when creating, updating, or reviewing skill source. `skill-evaluator`
uses the same standard when deciding what behavior an evaluation should test.

Use the host's validity requirements first. Let the environment's default
`skill-creator` or `plugin-creator` own schemas, scaffolding, packaging,
installation, and current validation commands.

## How to use this reference

The two parts below have different force:

- **Guidelines are judgment.** Follow them by default. Adapt them when the job,
  evidence, or target environment calls for a different shape.
- **Rules are requirements.** Do not waive them for convenience or a smaller
  file. Only a higher-authority constraint, such as host validity, repository
  instructions, or an explicit user decision, can override them.

Apply only the sections relevant to the skill. This reference is not a fixed
template, checklist, or scoring system.

## Guidelines

### Give the skill a job worth loading

- **Start with the recurring job.** A useful skill handles work that comes up
  again and has a recognizable result.
- **Add missing leverage.** The skill should supply judgment, knowledge,
  resources, or tools that change how a capable agent works.
- **Use the narrowest durable owner.** Put repository conventions in project
  instructions, stable preferences in configuration or memory, mechanical work
  in a script, reader-facing decisions in documents, and authenticated actions
  in apps or services. Use a skill for portable judgment.
- **Keep one job together.** Several branches do not require several skills.
  Split only when a branch needs independent discovery or a real context
  boundary.

### Make discovery sound like the request

- **Treat metadata as a context pointer.** Its wording must say what sits behind
  it and which distinct requests should load it. The target cannot repair a
  weak pointer because the target is still out of context.
- **Front-load the job.** Use words people naturally type when they want the
  capability.
- **Name the nearest boundary.** Say what the skill owns and which nearby job it
  does not own.
- **Test three requests.** Check one clear trigger, the closest near miss, and
  one request that belongs to a neighboring skill.
- **Choose invocation deliberately.** Automatic discovery is useful when an
  ordinary request or another skill must reach the capability. Explicit-only
  invocation is useful when the user should choose the workflow deliberately.
- **Spend the right load.** Automatic discovery spends context on every turn.
  Explicit-only invocation spends the user's attention because they must
  remember the skill. Make that trade deliberately instead of treating either
  mode as free.
- **Collapse synonyms.** Give each distinct trigger branch one strong phrase
  instead of listing every way to say the same thing.

### Match the structure to the work

- **Lead with the common path.** Put the job, default approach, and important
  judgment where the agent sees them first.
- **Separate steps from reference.** Steps say what the agent does now.
  Reference supplies definitions, rules, facts, examples, or templates used
  while doing it.
- **Number real sequences.** Use numbered steps when order affects correctness.
  Use bullets for principles, choices, tests, applications, and guardrails.
- **Keep judgment flexible.** Use prose and decision points when several
  approaches can work.
- **Make fragile work exact.** Use a short fixed sequence, script, or validator
  when mistakes are costly and the operation does not vary much.
- **Use headings to carry meaning.** A heading should tell the reader what the
  section helps them do, not merely name a category.
- **Put detail where it is needed.** Keep common guidance in `SKILL.md`. Move
  branch-specific facts and procedures into a reference with a direct
  read-when link.
- **Disclose by branch.** Keep material inline when every path needs it. Put
  material behind a pointer when only one path needs it. Do not split a file
  merely to make the top level shorter.
- **Keep concepts together.** Put a definition, its rules, and its caveats in
  one place instead of scattering them across the payload.

### Write like a capable colleague

- **Treat voice as part of the contract.** Agent-facing prose is both
  instruction and interface. It should sound like a person explaining the job,
  not a compressed policy document.
- **Be tight, not terse.** Remove padding, ceremony, and repeated explanation.
  Keep the thought that makes the workflow understandable.
- **State the job plainly.** Open with a sentence a person would naturally say
  aloud. Name the action and the reason it matters.
- **Prefer concrete actions and consequences.** “Ask the minimum set of
  clarifying questions needed to avoid wrong work” says what to do and why.
  “Resolve material ambiguity” hides both behind a label.
- **Use ordinary words.** Prefer `use`, `read`, `compare`, `write`, `run`, and
  `stop` over abstract or institutional language.
- **Let one familiar word carry repeated guidance.** A strong term such as
  `audit` can replace several restatements because the agent already knows how
  to think with it. Repeat the term, not its definition. If the term needs a
  paragraph of explanation, use a plain instruction instead.
- **State the target behavior.** Tell the agent what to do. Use prohibitions
  only for real guardrails, and pair them with the behavior that should replace
  the forbidden action.
- **Watch abstract clusters.** Words such as `material`, `consequential`,
  `applicable`, `scope`, and `context` are sometimes correct. Several in one
  sentence usually mean it needs a concrete subject, verb, or example.
- **Explain why when it carries judgment.** Keep the reason when it helps the
  agent choose between plausible actions or remember the operating model.
- **Use examples for real distinctions.** An example earns its place when it
  clarifies a boundary, transformation, output, or failure that prose alone
  leaves fuzzy.
- **Vary the rhythm.** Short sentences land a point. Longer sentences can carry
  one idea with its condition or consequence. Do not clip every sentence into
  the same cadence.
- **Read it aloud.** If the prose sounds like rubric labels joined together,
  restore the plain-language account and cut somewhere else.

### Prune without flattening the skill

- **Keep** a sentence when it changes an action, decision, boundary, authority,
  completion condition, or justified confidence.
- **Keep** a sentence when it establishes the purpose, teaches the mental
  model, preserves an accepted voice, or makes another instruction concrete
  enough to use.
- **Consolidate** repeated meaning only when the surviving version keeps the
  clearer wording, explanation, and rhythm.
- **Delete** a sentence only when a capable agent would behave the same and the
  skill loses no useful explanation, emphasis, voice, or navigational cue.
- **Run the no-op test sentence by sentence.** Ask what the agent would do
  differently because this sentence exists. Delete the whole sentence when the
  honest answer is nothing. When the default behavior is uncertain, test it
  instead of calling the sentence redundant by intuition.
- **Shorten structurally first.** Remove obsolete branches, duplicated
  procedures, unnecessary templates, and unconditional ceremony before
  rewriting good local prose.
- **Use the environment as the cache.** Point to cheap authoritative sources
  such as config, schemas, and `--help` instead of copying facts that will go
  stale. Keep the unwritten reason or failure pattern the environment cannot
  show.

### Define what done means

- **End steps with evidence.** A step is done when its result can be observed,
  not when the agent says it acted.
- **Make completion clear and demanding.** The agent must be able to tell done
  from not-done, and the condition should require all important work. “Every
  changed caller is accounted for” drives more useful work than “review the
  callers.”
- **Match proof to risk.** Open-ended work needs an outcome and decision
  criteria. Fragile work may need exact checks, scripts, or known-fail cases.
- **Make broad work exhaustive where it matters.** Name the relevant set that
  must be accounted for, such as every selected file, finding, caller, or
  required field.
- **Name useful failure behavior.** Say whether the skill asks, makes an
  assumption, preserves partial work, reports a positive-null result, or stops.

### Build only useful runtime resources

- **Use references for conditional knowledge.** A reference should have a
  caller and a clear branch that needs it.
- **Use scripts for repeated execution.** A script should replace logic that is
  safer, cheaper, or more reliable to run than to reconstruct in prose.
- **Use assets for output material.** Templates, media, and source artifacts
  belong in assets when the skill uses them to build the user's deliverable.
- **Keep the runtime portable.** Prefer relative links, stable identifiers, and
  host-supported configuration over machine-specific paths and private state.

### Ground important decisions in evidence

- **Trace important rules.** Support them with an explicit user requirement,
  repository contract, accepted output, observed failure, or credible domain
  source.
- **Treat weak evidence as provisional.** A generated example or one unexplained
  failure is usually a hypothesis, not a universal rule.
- **Generalize only as far as the evidence allows.** Keep a narrow correction
  narrow until repeated evidence supports a broader standard.
- **Let checks reject something plausible.** A validation step is useful when a
  bad result can fail it and that failure changes the workflow or final status.

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

The summaries below are pointers, not substitutes for the full guidance. Read
each matching reference when creating, updating, statically reviewing, or
designing an evaluation for that kind of skill:

- **[Research and synthesis](../skills/skill-standards/references/research-synthesis.md).**
  Use for investigation, source comparison, evidence synthesis, research
  briefs, and recommendations.
- **[Reports and presentations](../skills/skill-standards/references/reports-presentations.md).**
  Use for reports, decks, briefings, memos, and other reader-facing artifacts.
- **[Spreadsheet analysis](../skills/skill-standards/references/spreadsheet-analysis.md).**
  Use for spreadsheet creation, editing, cleaning, analysis, transformation,
  and audit.
- **[Financial modelling](../skills/skill-standards/references/financial-modelling.md).**
  Use when the workbook is a financial model whose formulas, assumptions,
  scenarios, schedules, and controls carry domain meaning.
- **[Template execution](../skills/skill-standards/references/template-execution.md).**
  Use in addition to the artifact-specific reference when the skill fills,
  refreshes, converts, or edits a supplied template.

## Rules

### Respect authority and scope

- **Follow host validity requirements.** A Dots preference cannot make the
  skill invalid in its target environment.
- **Follow repository instructions.** Use the repository's source locations,
  validation policy, packaging conventions, and authorization boundaries.
- **Preserve explicit user decisions.** Do not weaken or reinterpret a stated
  requirement to make the skill cleaner or shorter.
- **Do not expand the job silently.** A source edit does not authorize
  installation, publication, external writes, or unrelated refactors.

### Preserve existing skills deliberately

- **Preserve accepted wording.** Keep language the user praised or asked to
  retain exactly unless the requested behavior requires a change.
- **Modify only the seams.** Keep unrelated behavior, judgment, mental models,
  examples, output quality, and authorization boundaries unchanged.
- **Account for every removal.** Before finishing, compare old and new source
  and identify every removed mode, branch, decision rule, example, output field,
  and accepted passage.
- **Do not use line count as evidence.** A shorter file is not better unless it
  preserves or improves capability, judgment, and writing quality.
- **Do not paraphrase for uniformity.** Leave clear prose alone when the edit
  does not require it to change.

### Keep discovery complete

- **Put the whole discovery boundary in metadata.** The body cannot repair a
  vague or overlapping description because it loads after selection.
- **Treat description edits as behavior changes.** Recheck triggers, near
  misses, invocation mode, and neighboring skills whenever discovery text
  changes.
- **Use real component names.** Do not document a skill, agent, tool, app, or
  connector that the target package does not provide.

### Keep one owner for each instruction

- **Do not duplicate authoritative rules.** Link to the owner instead of
  copying a second version that can drift.
- **Give every resource a caller.** Remove empty folders, placeholder files,
  dead references, unused scripts, and assets that no runtime path uses.
- **Keep maintainer material out of runtime.** Plans, research notes, rejected
  drafts, source packs, run history, and private examples belong in development
  state, not the portable skill.
- **Keep secrets and local state out of skills.** Use the host's supported
  authentication, configuration, or state mechanism.
- **Describe composition accurately.** Loading another skill adds instructions
  to the current agent. Say to read, load, or apply that skill. Reserve
  `handoff`, `pass`, and `give` for a real change of owner or context, such as a
  subagent, another task, or an external system.

### Make instructions safe and executable

- **Reserve hard absolutes for real guardrails.** Use `must`, `always`, and
  `never` for safety, irreversible actions, explicit user constraints, or a
  costly observed failure.
- **Put conditions before guarded actions.** The agent should know when a rule
  applies before it acts.
- **Name side effects.** A script or tool instruction must make writes,
  external actions, deletion, and failure behavior clear.
- **Define stop conditions.** Stop when required authority, input, evidence, or
  tool access is missing and a reasonable assumption would change the result.

### Prove the result honestly

- **Give every ordered step a completion criterion.** Creating a file, calling
  a tool, or describing intended work is not completion by itself.
- **Do not present structural validation as behavioral proof.** Syntax, file
  existence, and schema checks prove structure only.
- **Test meaningful failures when they matter.** Run valid and failing inputs
  for scripts or workflows whose failure handling is part of the contract.
- **Consume validation results.** A failed check must change the workflow or
  final status.
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
