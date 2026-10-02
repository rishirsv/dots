# Capture a session as reusable instructions

Read this when the user wants to turn the current or a named Codex task into a
new skill or an update to an existing skill.

## Choose what to capture

If the task contains several attempts, corrections, or decisions, extract the
method that future tasks can reuse. If the user identifies one completed
workflow, focus on the steps that made it succeed.

Treat a flow as successful only when there is evidence such as an accepted
output, completed artifact, passing validation, or a tool sequence that reached
its stated result. A confident final message alone is not proof.

## Read only the relevant evidence

Use the supplied transcript or supported read-only session tools to locate the
named task. Do not scan unrelated history. Keep thread identifiers, timestamps,
local paths, raw prompts, and private details in the working evidence record.
Do not include them in the shipped skill.

Extract:

- requests that should select the skill and similar requests that should not
- the recurring job and required final output
- the main steps of the successful workflow
- decisions or transformations that required real judgment
- essential tools, files, references, and ordering constraints
- user corrections and the failure class each correction reveals
- permitted tools and data, and conditions that require the agent to stop
- validation or acceptance evidence

Separate the successful workflow from earlier experiments. Preserve a failed
path only when it teaches a reusable condition and remedy.

## Write instructions for future tasks

Turn the evidence into instructions that future runs can follow:

- replace the one-time request with a natural trigger condition
- replace local file names with the role those files played
- explain the failure behind a correction and the action that prevents it
- keep exact commands only when future runs depend on those commands
- preserve user-authored constraints that remain part of the recurring job

Ask only the questions needed to settle ownership, output, or a boundary that
changes the requested action. Infer everything else from the evidence and mark
uncertainty in the authoring note.

Return to [source-distillation.md](source-distillation.md) when the session has
paired inputs and outputs, several examples, or sources that teach conflicting rules.
Return to [standards.md](standards.md) to settle
selection criteria, where instructions belong, and completion requirements before editing.
