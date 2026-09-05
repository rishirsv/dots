---
name: meta-prompt
description: "Create, rewrite, or tighten a standalone prompt for another assistant from a task description, existing prompt, or supplied context. Use for prompt-writing requests, including coding-agent and image prompts; not for performing the task described in the prompt or explaining prompting techniques."
---

# Meta Prompt

Write the prompt the user can give to another assistant. The deliverable is
the complete prompt itself: no acknowledgment, preamble, explanation, change
summary, or offer after it. Do not answer or execute the task being described.
For a revision, return the full revised prompt rather than a diff.

Keep the prompt usable across capable models; do not detect a model, change
runtime settings, or add model-specific ceremony.

## Compose from the request

Recover the intended result and the context needed to produce it. Preserve
the user's decisions, constraints, requested output, and text they require
verbatim. Carry forward relevant facts faithfully without copying the whole
conversation.
Prior assistant observations and recommendations are inputs to verify, not
approved findings or constraints. Do not turn “I would not recommend this” into
“Do not consider this” unless the user adopted that restriction.
Carry each relevant concern together with its qualifications: what may be wrong,
what already works, and what a correction must not erase. Preserve material
safeguards explicitly, including concrete ordering and failure conditions;
a generic promise of “safe” or “correct” work does not preserve their meaning.

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

These are composition decisions, not required headings. Keep structure minimal
and outcome-first. For standard document types, name the artifact and specify
only meaningful deviations from the default format. Trust baseline model
knowledge; do not teach the recipient how to perform familiar work.

Group related instructions into readable paragraphs, using lists for requirements
that need separate tracking and sections only when they clarify distinct stages
or independent groups.
When either shape works, choose the simpler one. Do not impose a persona,
answer-length limit, fixed sequence, visible planning step, or reasoning
instruction without a task-specific reason.

Match the prompt's detail to the decisions the recipient needs, not the size of
the downstream job. A whole-system review can need only a brief: the goal,
boundaries, known concerns, and expected deliverable. Let the recipient derive
the inspection steps. Do not expand each concern into a checklist or prescribe
every section of the eventual report unless the user needs that detail.

Keep prompt brevity separate from answer verbosity. Treat 220 words as the
normal upper bound for a task brief; simple requests can be much shorter.
Exceed it only when required context, exact contracts, or user-requested detail
would otherwise be lost. Do not pass this bound on to the recipient's answer.
Put output structure and any requested answer-length guidance together once.

Improve clarity without adding product scope, dependencies, metrics, or
approval gates the user did not ask for.

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
- Read [images.md](references/images.md) for image-generation or editing prompts,
  including GPT-image-2-specific guidance.

Examples illustrate judgment. Transfer the relevant distinction, not their
headings, domain facts, or entire instruction set. Keep a simple request simple.

## Check the prompt, then return it

Compare the draft with the supplied source for omissions, invented commitments,
unsupported facts, and contradictory instructions. Cut redundant sections before
compressing sentences. Distinguish the recipient's output format from this skill's
output:
if the user wants a prompt requesting JSON, return that prompt, not JSON results.

Use no outer code fence unless the user requests one. Internal examples or
schemas may use fences. Prompt-only behavior applies to this prompt-writing task
and its revisions; an explicit change away from prompt work ends it.
