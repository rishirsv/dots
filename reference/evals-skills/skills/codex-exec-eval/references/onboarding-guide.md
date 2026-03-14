# Onboarding Guide

Use this guide when interviewing the user before generating a `codex exec` eval harness.

## Goal

Get enough information to scaffold the right harness without making the user think in terms of hidden eval frameworks.

## Interview Order

Keep the interview in this order:

1. **Task**
   - What should Codex do?
   - What would a good answer or output look like?

2. **Input shape**
   - Is this prompt-only, file transformation, or prompt-plus-file?
   - Will each case contain text, file paths, or both?

3. **Case source**
   - Do cases already exist?
   - Are they in JSON, CSV, or another format?
   - If they do not exist, should the harness start with manual starter cases?

4. **Success criteria**
   - Can success be checked with simple rules?
   - Does the user mainly care about text markers, file creation, or structured output?
   - Is there any subjective quality bar that may later need human or model judgment?

5. **Run settings**
   - Which model should run the task?
   - Which sandbox should be used?
   - Should runs be ephemeral?
   - Should the harness capture JSONL output?

6. **Target skill**, when the user wants self-improvement
   - Which skill is being improved?
   - Where does it live on disk?
   - Which files belong to that skill package?
   - Is the whole skill folder in scope, or only a subset?

7. **Improvement loop settings**
   - How many training cases should be human-graded each round?
   - Which cases are holdout?
   - What should count as a winning candidate?

8. **Location**
   - Where should the mini eval project be generated?

## Recommended Defaults

Use these defaults when the user has no strong preference:

- model: `gpt-5.4`
- sandbox: `workspace-write`
- `full_auto`: `false`
- `ephemeral`: `true`
- `json_output`: `true`
- evaluation mode: `deterministic`
- case source: existing real cases first, manual starter cases second
- review batch size: `3` starter cases in v1 unless the user specifies a larger batch
- holdout pass target: `10`
- promotion mode: stage first, approve later

## Required Setup Summary

Before generating files, summarize the setup using this shape:

- Task name
- Task description
- Input type
- Case source
- Success definition
- Target skill path
- Baseline version
- Mutation scope
- Review batch size
- Holdout validation rule
- Promotion policy
- Evaluation mode
- Model
- Sandbox
- Output folder

If any of those are still missing and would materially change the scaffold, resolve them before running the init script.

## Plain-Language Guidance

- Talk about "cases", "runs", "results", and "checks".
- When improving a skill, talk about "candidate versions" and "review batches".
- Do not introduce hidden methodology or internal skill names.
- Explain model and sandbox choices in plain language.
- Prefer "we’ll start simple and leave room to deepen later" over presenting the full evaluation universe up front.
