---
name: advisor
description: "Consult or delegate repository work to ChatGPT web or a named CLI model. Use for grounded advice and review, and when the user asks that model to implement, build, fix, or change code through its repository tools."
---

# Advisor

Use ChatGPT **6 Pro** by default, following the on-demand
[Advisor workflow](../../mcp/AGENTS.md). For a requested CLI provider or model,
such as Fable, follow [CLI.md](../../references/CLI.md) instead.

## Choose ownership

Select and state one mode before launching:

- **Implementation:** the user asks ChatGPT or the named model to implement,
  build, fix, or change something. The advisor owns the repository edits,
  required checks, corrections, and final handoff.
- **Review:** the user asks the advisor to inspect existing work without making
  changes. The advisor returns findings and does not edit the repository.
- **Consultation:** the user asks for advice, design help, or a decision. The
  calling agent may implement after the consultation.

Explicit ownership controls. Never silently downgrade implementation to
consultation or take implementation back because local editing is convenient.
Ask only when the request does not establish an owner and the answer would
change the workflow.

Before launching, state the task, your initial read, mode, model, effort, and
access. Honor the user's choices. Use workspace-write for implementation and
read-only for review. For consultation, recommend read-only unless the requested
deliverable needs repository writes. State the actual permission boundary when
bypass flags grant broader access.

Give the advisor a saved brief with relevant conversation context, constraints,
evidence, requested mode, ownership, and completion conditions. Advisor runs do
not automatically inherit this conversation. Configure the actual repository
and let the advisor inspect it directly; never assume or tell it that it cannot
access the repo.

For implementation, include this directive near the start of the brief:

> Mode: implementation. You own the repository changes, required checks,
> corrections, and final handoff. Use the repository file and terminal tools.
> Do not return only advice or a proposed patch.

For questions needing no local access, send the brief directly to ChatGPT;
skip the service and plugin. For repository work, start the service,
then use an existing chat
configured with the requested model and Dots Advisor, or set one up through the
[ChatGPT controls](../../mcp/AGENTS.md#chatgpt-controls). Prefer available native
app tools to find, read, and continue the chat; use the in-app browser for model
selection and plugin attachment when those controls are not exposed natively.
Native reads can lag behind a successful send. If the latest exchange is
missing, verify it in the browser before retrying; do not send a duplicate.
For repository work, send the generated prompt and wait for the saved final
result. A chat response alone is not completion. In implementation mode, do not
make substantive local edits while the advisor owns the task. Inspect the
result, repository diff, and validation evidence. If the requested changes are
absent, or checks are omitted without a stated blocker, treat the run as
incomplete and send a correction through the same advisor chat. Do not take over
unless the user reassigns ownership. The service shuts down after completion or
its timeout; nothing starts at login.

In consultation mode, consult before substantive local work after any necessary
orientation, and consult again before completion when the workflow calls for a
review. Save the local deliverable first. In implementation mode, the advisor
also owns corrections after failed checks or review findings. In any mode,
return to the advisor when errors recur, progress stalls, or the approach must
change. Short reactive work does not need repeated calls.

Give the advice serious weight. A passing self-test does not refute a concern
it never checks. When evidence conflicts with advice, return to the same advisor:
“I found X, you suggest Y; which constraint breaks the tie?” Reconcile the
conflict before proceeding.
