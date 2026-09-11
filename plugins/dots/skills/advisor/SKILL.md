---
name: advisor
description: "Consult a stronger reviewer who sees your full conversation transcript."
---

# Advisor

Call `advisor()` without parameters. The call automatically forwards the entire
conversation history: the task, every tool call and result, and the reasoning so
far.

Before calling `advisor()`, write one sentence stating what the task asks and
your initial read. The advisor already receives the transcript; this sentence
frames what it should respond to.

Call the advisor before substantive work: before writing, editing, committing
to an interpretation, or building on an assumption. If orientation is needed
first, such as finding files, fetching a source, or inspecting current state,
complete that orientation and then call the advisor. Orientation is not
substantive work.

Also call the advisor:

- when the task appears complete, before declaring completion;
- when errors recur, the approach stops converging, or results do not fit; and
- before changing approaches.

Before the completion call, make the deliverable durable by writing the file,
saving the result, or committing the change as appropriate. The call takes time,
so preserve the result first in case the session ends during consultation.

For work longer than a few steps, call once before committing to an approach and
once before declaring completion. Short reactive work whose next action is
dictated by tool output does not require repeated calls; the first call usually
provides the most value.

Give the advice serious weight. Adapt when an advised step fails empirically or
primary-source evidence contradicts a specific claim. A passing self-test alone
does not refute advice about a condition the test does not check.

When retrieved evidence points one way and the advisor points another, do not
switch silently. Call `advisor()` again and frame the conflict, for example: “I
found X, you suggest Y; which constraint breaks the tie?” Reconcile the evidence
before committing to either branch.
