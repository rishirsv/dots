---
name: advisor
description: "Consult ChatGPT web or a named CLI model for advice grounded in the current repository."
---

# Advisor

Use ChatGPT **6 Pro** by default, following the on-demand
[Advisor workflow](../../mcp/README.md). For a requested CLI provider or model,
such as Fable, follow [CLI.md](../../references/CLI.md) instead.

Before launching, state the task, your initial read, model, effort, and access.
Honor the user's choices. Otherwise recommend workspace write and medium
effort; use read-only access for an explicitly read-only review. If access is
ambiguous, choose workspace write. State the actual permission boundary when
bypass flags grant broader access.

Give the advisor a saved brief with relevant conversation context, constraints,
evidence, and the question to resolve. Consultations do not automatically inherit
this conversation. Configure the actual repository and let the advisor inspect
it directly; never assume or tell it that it cannot access the repo.

For questions needing no local access, send the brief directly to ChatGPT;
skip the service and plugin. For repository consultations, start the service,
then use an existing chat
configured with the requested model and Dots Advisor, or set one up through the
[ChatGPT controls](../../mcp/README.md#chatgpt-controls). Prefer available native
app tools to find, read, and continue the chat; use the in-app browser for model
selection and plugin attachment when those controls are not exposed natively.
Native reads can lag behind a successful send. If the latest exchange is
missing, verify it in the browser before retrying; do not send a duplicate.
For repository work, send the generated prompt, wait for the saved final advice,
and inspect changes before continuing. A chat response alone is not completion.
The service shuts down after completion or its timeout; nothing starts at login.

Consult before substantive work, after any necessary orientation, and before
declaring completion. Save the deliverable before the completion consultation.
Consult again when errors recur, progress stalls, or before changing approaches.
Short reactive work does not need repeated calls.

Give the advice serious weight. A passing self-test does not refute a concern
it never checks. When evidence conflicts with advice, return to the same advisor:
“I found X, you suggest Y; which constraint breaks the tie?” Reconcile the
conflict before proceeding.
