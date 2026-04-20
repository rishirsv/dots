# Prompt Blocks

Use these blocks when a bundled template needs one extra constraint.

## `structured_output_contract`

```xml
<structured_output_contract>
Return exactly the requested sections.
Keep the answer compact.
Put the highest-value findings or decisions first.
</structured_output_contract>
```

## `default_follow_through_policy`

```xml
<default_follow_through_policy>
Default to the most reasonable low-risk interpretation and keep going.
Only stop to ask questions when a missing detail changes correctness, safety, or an irreversible action materially.
</default_follow_through_policy>
```

## `verification_loop`

```xml
<verification_loop>
Before finalizing, verify the result against the task requirements and uploaded bundle.
If a check fails, revise the answer instead of keeping the first draft.
</verification_loop>
```

## `missing_context_gating`

```xml
<missing_context_gating>
Do not guess missing repository facts.
If required context is absent, state exactly what remains unknown.
</missing_context_gating>
```

## `grounding_rules`

```xml
<grounding_rules>
Ground every claim in the uploaded bundle.
Do not present inferences as facts.
If a point is a hypothesis, label it clearly.
</grounding_rules>
```

## `action_safety`

```xml
<action_safety>
Keep changes tightly scoped to the stated task.
Avoid unrelated refactors or cleanup unless they are required for correctness.
</action_safety>
```

## `research_mode`

```xml
<research_mode>
Separate observed facts, reasoned inferences, and open questions.
</research_mode>
```
