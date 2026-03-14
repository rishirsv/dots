# Plan: `codex-exec-eval` as a Single Guided Eval Skill

## Summary

Create a new framework-style skill named `codex-exec-eval` under `reference/evals-skills/skills/codex-exec-eval`. This skill will be the only user-facing entrypoint for setting up and running a `codex exec` eval harness.

The existing eval skills remain as internal source material only. The user should not need to know they exist, choose between them, or invoke them directly. `codex-exec-eval` will absorb that methodology into one guided onboarding flow that asks the right questions, scaffolds the right files, and chooses the appropriate eval workflow behind the scenes.

## Phase Outcomes

### Phase 1: Define a single user-facing onboarding flow

Non-technical outcome: the user experiences one guided setup assistant that walks them through everything without exposing the underlying eval-skill library.

- [x] 1.1 Save the accepted plan in the repo and establish the implementation checklist
- [x] 1.2 Write `SKILL.md` with trigger language for harness setup, batch testing, transformation evaluation, regression suites, and existing-harness improvement
- [x] 1.3 Build a fixed onboarding interview that collects task, inputs, case source, success criteria, evaluation mode, model, sandbox, and target location
- [x] 1.4 Require the skill to summarize the setup choices back to the user before scaffolding
- [x] 1.5 Validation for 1.0: review the final `SKILL.md` to confirm the flow is single-skill, guided, and does not expose other eval skills

### Phase 2: Hide the underlying multi-skill methodology

Non-technical outcome: the skill internally uses eval best practices, but the user only sees one coherent workflow.

- [x] 2.1 Internalize the needed eval methodology into this skill’s own references instead of sending users to other skills
- [x] 2.2 Cover dataset discovery, synthetic case generation, failure review, deterministic checks, optional LLM judging, and evaluator validation in simplified language
- [x] 2.3 Keep the other eval skills invisible in the normal operator flow
- [x] 2.4 Validation for 2.0: verify the new skill can guide a full setup without instructing the user to invoke another eval skill

### Phase 3: Make configuration explicit and editable

Non-technical outcome: all important behavior is visible in one place and easy to change without touching code.

- [x] 3.1 Define a human-readable config file as the source of truth for the generated harness
- [x] 3.2 Expose `model`, `sandbox`, `full_auto`, `ephemeral`, `skip_git_repo_check`, `json_output`, `output_schema`, and `add_dirs` as explicit config fields
- [x] 3.3 Make the generated runner derive the `codex exec` command from config instead of hard-coding an opaque shell string
- [x] 3.4 Add a plain-English config reference for every major field
- [x] 3.5 Validation for 3.0: confirm model and sandbox can be changed by editing config only

### Phase 4: Scaffold a self-contained mini eval project

Non-technical outcome: after onboarding, the user gets a small folder they can understand, rerun, and edit.

- [x] 4.1 Create reusable templates for the generated eval project
- [x] 4.2 Include a config file, canonical JSON cases file, optional CSV support, runner script, output/result folders, summary template, and short operator guide
- [x] 4.3 Keep the scaffold self-contained in one folder with a predictable structure
- [x] 4.4 Validation for 4.0: generate a sample scaffold and confirm the folder is understandable and rerunnable

### Phase 5: Support open-ended task types cleanly

Non-technical outcome: the skill works for many kinds of Codex tasks without becoming vague.

- [x] 5.1 Support prompt-only, file-to-file, and prompt-plus-file task shapes in the cases format and templates
- [x] 5.2 Standardize case records around IDs, prompt data, optional source files, optional expected checks, and optional notes/tags
- [x] 5.3 Keep JSON canonical and CSV convenience-only
- [x] 5.4 Validation for 5.0: confirm the case schema and templates cover the intended task shapes

### Phase 6: Default to simple evaluation, escalate only when needed

Non-technical outcome: the harness is useful immediately and only becomes more complex when the task really needs that complexity.

- [x] 6.1 Make deterministic checks the default path
- [x] 6.2 Support text checks, file existence checks, structured output checks, exit-state checks, and simple custom assertions
- [x] 6.3 Add optional references and config hooks for judge-based evaluation without requiring a separate user-facing skill
- [x] 6.4 Validation for 6.0: confirm the scaffold works without any judge setup and can represent deeper review paths when needed

### Phase 7: Validate both skill UX and generated harness UX

Non-technical outcome: the skill is understandable for a non-technical user and the scaffold feels usable from the first run.

- [x] 7.1 Validate the skill folder with the standard validator
- [x] 7.2 Generate a sample mini eval project in a disposable location
- [x] 7.3 Check the onboarding flow, config clarity, and generated folder usability
- [x] 7.4 Validation for 7.0: record the validation commands and results in the final implementation summary

## Important Interfaces

- User-facing skill: `codex-exec-eval`
- Generated config sections: `task`, `codex_exec`, `inputs`, `cases`, `evaluation`, `outputs`
- Canonical cases format: JSON with optional CSV import/export
- Generated workflow:
  1. define task
  2. create or import cases
  3. run `codex exec` across cases
  4. save raw outputs and metadata
  5. apply deterministic checks
  6. optionally run deeper review or judging
  7. produce a summary for iteration or regression reruns

## Assumptions and Defaults

- The skill lives under `reference/evals-skills/skills/`
- The skill name is `codex-exec-eval`
- The user-facing experience is single-skill and guided
- The existing eval skills remain internal source material, not normal operator dependencies
- JSON is canonical and CSV is convenience-only
- Deterministic checks are the default
- LLM judging is optional and introduced only when subjective quality requires it
