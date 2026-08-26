# Evaluate skill triggering

Trigger evaluation asks whether the host selects a skill. Keep it separate from
behavior after the skill is loaded.

1. Name the target host, version, invocation policy, and discovery metadata.
2. Build substantive should-trigger requests, difficult near misses, and
   requests owned by neighboring skills.
3. Preserve ordinary user language and avoid naming the expected skill in the
   query unless explicit invocation is the behavior under test.
4. Repeat queries only when selection varies enough to affect the conclusion.
5. Use a working set for description iteration and held-out queries for the
   readiness check.
6. Record the resolved host and observed selection for every attempt.

Use the review interface when a human should correct expected trigger labels or
inspect failures. If evidence supports a description change, load
`skill-standards`, then rerun only affected working queries before one held-out
confirmation. Do not ship Anthropic's Claude CLI optimizer or assume Claude and
Codex select skills identically.
