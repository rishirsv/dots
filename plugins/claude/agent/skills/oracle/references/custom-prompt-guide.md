# Custom Prompt Guide

Use a custom prompt only when none of the bundled templates fit cleanly.

The goal is not to write a long prompt. The goal is to assemble the smallest prompt that still makes the downstream model reliable, grounded, and easy to use.

See [prompt-blocks.md](prompt-blocks.md) for reusable blocks.

## Core Rules

- Start with one concrete task and one desired end state.
- Use XML blocks so the prompt shape is stable.
- Add an explicit output contract instead of vague prose.
- Tell the model to proceed with assumptions and list unknowns instead of asking routine questions.
- Keep the prompt short enough that you can also show it inline in chat.

## Minimum Viable Review Prompt

```xml
<task>
You are {ROLE}.

I am uploading `context.zip` containing repository files. Treat those files as authoritative.
Start by reading `MANIFEST.md` at the root of the archive.

{TASK_DESCRIPTION}
</task>

<structured_output_contract>
Return:
1. {PRIMARY_OUTPUT}
2. {SUPPORTING_OUTPUT}
3. {NEXT_STEPS_OR_RISKS}
</structured_output_contract>

<default_follow_through_policy>
Default to the most reasonable low-risk interpretation and keep going.
Only stop to ask questions when a missing detail changes correctness or safety materially.
</default_follow_through_policy>
```

## Minimum Viable Ultraplan Prompt

```xml
<task>
You are {ROLE}.

I am uploading `context.txt` containing a curated repository slice and manifest.
Treat `context.txt` as authoritative.
Start by reading the manifest section at the top of `context.txt`.

{TASK_DESCRIPTION}
</task>

<structured_output_contract>
Return:
1. current understanding
2. assumptions and unknowns
3. recommended approach
4. ## Approved Plan
5. validation checklist
</structured_output_contract>
```

## Add More Only When Needed

Add these blocks when they materially improve quality:

- `verification_loop`: correctness-sensitive tasks
- `completeness_contract`: planning or multi-step diagnosis
- `missing_context_gating`: dangerous to guess
- `grounding_rules`: repo-based critique, review, or diagnosis
- `action_safety`: change recommendations that could sprawl
- `research_mode`: tradeoff-heavy recommendation work

If a bundled template already fits, use it instead of rebuilding the prompt from scratch.
