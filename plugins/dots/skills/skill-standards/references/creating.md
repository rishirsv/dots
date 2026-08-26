# Creating a skill

Create a skill when a recurring job needs portable judgment or reusable
resources that a capable agent would otherwise have to reconstruct. The goal is
predictable decisions, not a large instruction file.

## 1. Define the job

- Name the recurring request in words a user would naturally say.
- Name the nearest request that belongs somewhere else.
- State what the user receives and what proves the skill is finished.
- Collect a representative trigger, the closest near miss, and one difficult
  case that exposes useful judgment.
- Infer answers from the repository and supplied evidence. Ask only when a
  missing choice changes ownership, output, safety, or authority.

Do not create a skill when project instructions, configuration, a script, a
document, or a connector is the better owner.

## 2. Build the smallest useful runtime

Create the source from:

- the target source location and repository instructions;
- the job, discovery boundary, examples, output, and finish condition;
- the applicable guidelines and rules from `skill-practices.md`; and
- the references, scripts, assets, or templates the job actually needs.

Keep the common path and its judgment in `SKILL.md`. Put conditional detail
behind direct read-when links. Build real resources before instructions refer
to them. Do not create placeholders or empty directories.

## 3. Review the source with fresh eyes

Re-read the effective runtime as an agent encountering the skill for the first
time. Look for:

- discovery overlap and weak boundaries;
- no-op, duplicated, contradictory, or overly rigid instructions;
- an opener that describes an aspiration instead of the work, flattened voice,
  or compressed language that hides actions and artifacts;
- detail in the wrong layer or references without callers;
- vague completion, failure, or stop behavior; and
- source-specific, private, or maintainer material in the runtime.

For a complex or risky skill, use the loaded creator's independent
forward-testing guidance. Give the fresh reviewer the intended contract,
complete runtime payload, repository instructions, and `skill-practices.md`,
but keep the authoring rationale and expected verdict out of its context.
Ordinary skill creation does not require a subagent review.

## 4. Prove the skill is ready

- Resolve every link and component name from the packaged layout.
- Confirm that every reference, script, and asset has a runtime caller.
- Run the repository's applicable skill validation and changed scripts.
- Test valid and failing inputs when failure handling is part of the contract.

Finish when the source matches the job, applicable validation passes, and every
supported material review finding is resolved or reported as a blocker.

When the user needs behavioral readiness rather than source readiness, load
`skill-evaluator` after source validation. Let it design the cases, approval
contract, workers, graders, and evidence; do not recreate that workflow here.
