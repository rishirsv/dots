# Oracle Prompt Templates

Use these templates to generate `prompt.md` for Oracle handoffs.

- `review` templates assume the downstream model sees only `context.zip`
- `planning` templates assume the downstream model sees only `context.txt`

Copy the smallest template that fits, then trim anything that does not matter for the task.

## Scope Map

- Role values: choose the downstream reviewer or planner posture.
- Planning template: use with `context.txt`.
- Review, debugging, recommendation, and prompt-critique templates: use with `context.zip`.
- Grounding rules: keep every downstream answer tied to the uploaded bundle.

## Role Values

Replace `{ROLE}` with one of these:

| Task Type | Role Value |
|-----------|------------|
| Code review | a staff engineer doing a careful code review for correctness and maintainability |
| Debugging | a senior engineer debugging a tricky issue with limited context |
| Architecture | a principal engineer reviewing system design |
| Prompting | a prompt engineer improving Codex or GPT prompts for reliability and clarity |
| Planning | a principal engineer creating a high-confidence implementation plan for a complex change in an unfamiliar codebase |

## Planning Template

```xml
<task>
You are {ROLE}.

I am uploading `context.txt` containing a curated repository slice and manifest.
Treat `context.txt` as authoritative.
Start by reading the manifest section at the top of `context.txt`.

Create a high-confidence implementation plan for this task.
Do not write code.
Do not stop for routine clarification.
Proceed with the best reasonable assumptions and label them explicitly.

Task: {TASK}
Success criteria: {SUCCESS_CRITERIA}
Constraints: {CONSTRAINTS}
Draft plan to refine, if provided: {SEED_PLAN}
</task>

<structured_output_contract>
Return exactly these sections:
1. Current understanding
2. Assumptions and unknowns
3. Relevant file and system touchpoints
4. Options considered
5. Recommended approach
6. ## Approved Plan
7. Validation checklist
8. Risks and follow-ups

Inside `## Approved Plan`, include:
- phases with a short non-technical outcome for each phase
- an implementation checklist
- concrete validation steps
</structured_output_contract>

<default_follow_through_policy>
Default to the most reasonable low-risk interpretation and keep going.
Only stop to ask questions when a missing detail changes correctness or safety materially.
</default_follow_through_policy>

<grounding_rules>
Ground every concrete claim in `context.txt`.
Cite file paths for codebase claims.
If a point is an inference, label it clearly.
</grounding_rules>

<action_safety>
Keep the recommended plan tightly scoped to the stated task.
Avoid unrelated refactors or cleanup unless they are required for correctness.
</action_safety>

<verification_loop>
Before finalizing, verify that the plan matches the uploaded repository slice and requested outcome.
</verification_loop>
```

## Review Template

```xml
<task>
You are {ROLE}.

I am uploading `context.zip` containing repository files. Treat those files as authoritative.
Start by reading `MANIFEST.md` at the root of the archive.

Review the change, design, or implementation described below.
Focus on correctness, maintainability, safety, and fit with the existing codebase.

User goal: {USER_GOAL}
Constraints: {CONSTRAINTS}
What changed or is proposed: {CHANGE_SUMMARY}
</task>

<structured_output_contract>
Return:
1. short summary of what the code does and your overall assessment
2. findings ordered by severity with why each matters
3. smallest safe fixes or follow-ups
4. overall verdict: Correct, Probably correct with caveats, or Not correct
</structured_output_contract>

<default_follow_through_policy>
Keep going until you have enough evidence to identify the material review points.
Do not ask questions; proceed with assumptions and label them.
</default_follow_through_policy>

<grounding_rules>
Ground every claim in the uploaded bundle.
For concrete claims, cite file paths and line numbers when available.
If a point is an inference, label it clearly.
</grounding_rules>

<verification_loop>
Before finalizing, verify that each finding is material, actionable, and supported by the bundle.
</verification_loop>
```

## Debugging Template

```xml
<task>
You are {ROLE}.

I am uploading `context.zip` containing repository files. Treat those files as authoritative.
Start by reading `MANIFEST.md` at the root of the archive.

Diagnose the most likely root cause of this issue.

Expected behavior: {EXPECTED}
Actual behavior: {ACTUAL}
Error or logs: {ERROR_TEXT}
Repro steps: {REPRO_STEPS}
Constraints: {CONSTRAINTS}
</task>

<structured_output_contract>
Return:
1. most likely root cause
2. evidence with file-path citations
3. smallest safe fix
4. verification steps
5. risks, assumptions, or unknowns
</structured_output_contract>

<default_follow_through_policy>
Keep going until you have enough evidence to identify the most likely root cause confidently.
Do not ask questions unless a missing detail changes correctness materially.
</default_follow_through_policy>

<missing_context_gating>
Do not guess missing repository facts.
If required context is absent from the bundle, state exactly what remains unknown.
</missing_context_gating>

<grounding_rules>
Ground every claim in the uploaded bundle.
Prefer falsifiable hypotheses over broad speculation.
</grounding_rules>
```

## Recommendation Template

```xml
<task>
You are {ROLE}.

I am uploading `context.zip` containing repository files. Treat those files as authoritative.
Start by reading `MANIFEST.md` at the root of the archive.

Use the uploaded repository context to answer this task:
{TASK}

Constraints or preferences: {CONSTRAINTS}
What good looks like: {SUCCESS_CRITERIA}
</task>

<structured_output_contract>
Return:
1. observed facts
2. recommendation
3. tradeoffs
4. implementation notes with likely repo touchpoints
5. risks or open questions
</structured_output_contract>

<default_follow_through_policy>
Do not ask questions; proceed with assumptions and label them.
</default_follow_through_policy>

<research_mode>
Separate observed facts, reasoned inferences, and open questions.
</research_mode>

<grounding_rules>
Ground repo-specific claims in the uploaded bundle.
</grounding_rules>
```

## Prompt-Critique Template

```xml
<task>
You are {ROLE}.

I am uploading `context.zip` containing repository files. Treat those files as authoritative.
Start by reading `MANIFEST.md` at the root of the archive.

Diagnose why this prompt, skill, or instruction set is underperforming and propose the smallest high-impact changes.

Target prompt or skill: {PROMPT_SCOPE}
Observed failure modes: {FAILURE_MODES}
Constraints: {CONSTRAINTS}
</task>

<structured_output_contract>
Return:
1. failure modes
2. root causes in the current prompt or instructions
3. revised prompt or instruction blocks
4. why the revision should work better
5. residual risks or follow-ups
</structured_output_contract>

<grounding_rules>
Base your diagnosis on the prompt text, instruction files, and failure examples in the bundle.
Do not invent failure modes that are not supported by the provided material.
</grounding_rules>

<verification_loop>
Before finalizing, make sure the revised prompt resolves the cited failure modes without creating contradictory instructions.
</verification_loop>
```
