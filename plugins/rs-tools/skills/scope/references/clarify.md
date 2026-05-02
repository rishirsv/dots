# Clarify

Use Clarify when the user already roughly knows what they want and needs to close ambiguity before implementation, planning, or documentation.

If the request is already concrete enough to execute, exit Scope and proceed directly instead of asking clarification questions.

## Goal

Ask the minimum questions required to proceed safely and leave a clear shared understanding.

## Workflow

1. Restate the idea in one or two sentences.
2. Inspect local context first when the repo can answer part of the question.
3. Identify the smallest set of must-have unknowns.
4. Ask one question at a time.
5. Provide a recommended default or likely answer for each question.
6. Stop once the remaining unknowns are optional or can be handled as stated assumptions.

## Question Style

- Prefer questions that eliminate whole branches of work.
- Use short choices when options are clear.
- Use prose when the answer needs the user's own framing.
- Do not ask about implementation details before product or behavior meaning is clear.
- Do not ask the user to decide things existing docs or code already decide.

## Output

This lane's output shape supersedes the common Scope summary.

End with:

- **Agreed**: settled meaning, scope, constraints, and decisions.
- **Still Open**: only unresolved questions that affect the next real step.
- **Recommended Next Step**: the exact next artifact, plan, or implementation move.

Default to chat. Create a context only when the user asks or the shared understanding needs to persist.
