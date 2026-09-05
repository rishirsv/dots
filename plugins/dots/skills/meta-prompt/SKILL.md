---
name: meta-prompt
description: "Create, rewrite, or tighten a standalone prompt for another assistant from a task description, existing prompt, or supplied context. Use for prompt-writing requests, including coding-agent prompts; not for performing the task described in the prompt or explaining prompting techniques."
---

# Meta Prompt

Write the prompt the user can give to another assistant. The deliverable is
the complete prompt itself: no acknowledgment, preamble, explanation, change
summary, or offer after it. Do not answer or execute the task being described.
For a revision, return the full revised prompt rather than a diff.

Use clear intent, explicit boundaries where they matter, and proportionate
verification. Keep the prompt usable across capable models; do not detect a
model, change runtime settings, or add model-specific ceremony.

## Compose from the request

Recover the intended result and the context needed to produce it. Preserve
the user's decisions, facts, exact text, constraints, and requested output.
Treat the described work as instructions for the recipient, not an assignment
to perform while writing the prompt.

Read supplied material when needed to understand what the prompt must retain.
Do not investigate the underlying problem, run the described program or its
tests, create the requested artifact, or load an execution skill merely because
the prompt mentions it.
Preserve a named skill or tool in the resulting prompt when the user wants the
recipient to use it. Do not assume the recipient can see this conversation:
include the necessary context or name the supplied attachment it must read.

Choose which instructions materially affect the result:

- What should be accomplished, for whom, and why the distinction matters.
- What is already decided, must be preserved, or is outside the assignment.
- What evidence or input the recipient must use rather than invent.
- Whether the recipient should explain, investigate, propose, implement, or
  publish, and what event ends the authorized work.
- What the answer or artifact must contain and how completion can be checked.

These are composition decisions, not required headings. Write a simple request
as direct prose. Use a list when its items need to be tracked separately; reserve
sections for complex prompts with distinct stages or substantial groups of
requirements. Avoid generic “Instructions” and “Output Format” scaffolding when
the same information fits naturally in the prompt. Do not impose a persona,
word budget, fixed sequence, visible plan, or reasoning instruction without a
task-specific reason.

Direct prose need not be one dense paragraph. Group related instructions and
start a new paragraph when moving from the assignment to output constraints or
source context. Keep a useful list or label when it makes requirements easier
to find; remove structure that merely announces instructions already clear from
the text.

Improve clarity without adding product scope, dependencies, metrics, or
approval gates the user did not ask for. Leave the recipient room to choose
the method unless the sequence is necessary or explicitly prescribed.
Preserve meaningful constraints even when they make the prompt longer.

Routine gaps can remain for the recipient to resolve from its environment.
For a missing decision that changes the task, put the necessary investigation
or focused clarification into the prompt, before the affected action. Do not
invent the decision or replace the prompt with a question to the user. When
the request supplies no usable task at all, write a brief prompt asking the
recipient to establish the intended outcome before proceeding.

## Read only what changes composition

- Read [guidance.md](references/guidance.md) when uncertainty, multiple stages,
  evidence requirements, preservation, or an exact output contract makes the
  prompt nontrivial. Apply the relevant distinctions together; do not force a
  request into one exclusive category.
- Read [coding.md](references/coding.md) for prompts about code, software
  behavior, development plans, implementation, or code review.

Examples illustrate judgment. Transfer the relevant distinction, not their
headings, domain facts, or entire instruction set. Keep a simple request simple.

## Check the prompt, then return it

Before responding, remove repeated instructions and process that does not change
the recipient's work. Prefer useful detail over an arbitrary word count; retain
the context, constraints, and necessary sequence that make the prompt complete.
Check that the prompt preserves every explicit requirement, contains no
invented commitments or unsupported facts, and has one coherent
instruction about the recipient's authority and output. Remove contradictory
instructions and explanation addressed to the current user rather than the
recipient. Distinguish the recipient's output format from this skill's output:
if the user wants a prompt requesting JSON, return that prompt, not JSON results.

Return only the prompt, without an outer code fence unless the user requests
one. Internal examples or schemas may use fences when they belong in the
prompt. Prompt-only behavior applies to this prompt-writing task and its
revisions; an explicit change away from prompt work ends it. This skill does
not override higher-priority host instructions.
