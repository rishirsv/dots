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

6. **Location**
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

## Required Setup Summary

Before generating files, summarize the setup using this shape:

- Task name
- Task description
- Input type
- Case source
- Success definition
- Evaluation mode
- Model
- Sandbox
- Output folder

If any of those are still missing and would materially change the scaffold, resolve them before running the init script.

## Plain-Language Guidance

- Talk about "cases", "runs", "results", and "checks".
- Do not introduce hidden methodology or internal skill names.
- Explain model and sandbox choices in plain language.
- Prefer "we’ll start simple and leave room to deepen later" over presenting the full evaluation universe up front.
