# Session Capture

Read this when the user wants to turn the current or a named Codex task into a
new skill or an update to an existing skill.

## Choose The Capture

Use session distillation when the task contains several attempts, corrections,
or decisions and the goal is to recover the reusable method. Use recent-success
capture when the user points to one completed flow and wants to preserve what
worked.

Treat a flow as successful only when there is evidence such as an accepted
output, completed artifact, passing validation, or a tool sequence that reached
its stated result. A confident final message alone is not proof.

## Read Only The Relevant Evidence

Use the supplied transcript or supported read-only session tools to locate the
named task. Do not scan unrelated history. Keep thread identifiers, timestamps,
local paths, raw prompts, and private details in the evidence packet; they do
not belong in portable runtime guidance.

Extract:

- the user's natural trigger language and closest non-trigger
- the recurring job and final output contract
- the successful workflow spine
- decisions or transformations that required real judgment
- essential tools, files, references, and ordering constraints
- user corrections and the failure class each correction reveals
- approval, privacy, or external-action boundaries
- validation or acceptance evidence

Separate the final successful slice from exploratory detours. Preserve a failed
path only when it teaches a reusable condition and remedy.

## Distill, Do Not Replay

Rewrite session evidence as future-facing behavior:

- replace the one-time request with a natural trigger condition
- replace local file names with the role those files played
- replace a particular correction with the general failure and desired move
- keep exact commands only when they are stable runtime dependencies
- preserve user-authored constraints that remain part of the recurring job

Ask only the questions needed to settle ownership, output, or a consequential
boundary. Infer everything else from the evidence and mark uncertainty in the
handoff.

Return to [source-distillation.md](source-distillation.md) when the session has
paired inputs and outputs, multiple exemplars, or conflicting source roles.
Return to [skill-design.md](skill-design.md) to settle discovery, runtime
placement, and completion before editing.
