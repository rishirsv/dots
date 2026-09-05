# Coding prompts

Add the code-specific distinctions the task needs. General composition and
authorization decisions live in the entry point and [guidance.md](guidance.md).
Do not turn this reference into a checklist pasted into every coding prompt.

## Ground the change without designing an imaginary codebase

Use the user's observed behavior, relevant files, accepted plan, and repository
instructions as context. Ask the recipient to inspect the current code when
ownership or implementation is unknown; do not invent class names, services,
storage, or framework choices. Preserve supplied identifiers exactly.

Prefer the simplest complete change that meets the current requirement. A
small diff is not automatically a simple design, and necessary failure handling
is not automatically overengineering. New machinery needs a present reason,
not a hypothetical future caller.

**Input:** “Make the avatar upload recover from a failed request. Keep the
selected image for retry and show failure instead of an endless uploading
state. Keep the existing endpoint and UI. Implement it.”

**Prompt:**

> Make avatar uploads recover cleanly from a failed request using the existing
> endpoint and interface. Inspect the current upload path and use its existing
> state owner. Preserve the selected image so the user can retry, and show the
> actual failure instead of leaving the UI in an uploading state. Implement the
> change without a new upload framework or unrelated redesign. Verify failure
> followed by retry through the affected path, and report what was checked and
> any remaining limitation.

## Preserve meaning when improving presentation

An approved composition does not by itself authorize new persistence, changed
navigation semantics, or another feature. Retain the user's accepted reference
and current capabilities, including meaningful units, relationships, and failure
states. Do not add states or screens merely because a mock could display them.

**Input:** “Implement the approved compact invoice header. Same data and
actions. Ask before making backend changes.”

**Prompt:**

> Implement the approved compact invoice header through the existing production
> path. Preserve the invoice identity, currency and amount meaning, status,
> available actions, and their behavior. Follow the supplied visual reference
> without adding nearby features. If it requires a backend change, explain the
> specific missing capability and stop before that change. Check the rendered
> header with representative long content and the relevant status states;
> distinguish rendered proof from static inspection.

For exploratory visual work, preserve the exploration's scope and stop point
instead of silently upgrading it to production implementation.

## Match architectural detail to the actual risk

For coupled or stateful changes, define the observable guarantee, authoritative
owner, and necessary order when known. Do not prescribe new queues, protocols,
or coordinators as a substitute for understanding that guarantee. For ordinary
local edits, omit architecture ceremony.

**Input:** “Draft a plan for making order submission safe against repeated
taps. No code yet. We already have a server idempotency key.”

**Prompt:**

> Propose a plan to prevent repeated taps from creating duplicate orders.
> Inspect the current submission path and existing server idempotency-key
> behavior before recommending a change. Explain how the plan handles an
> in-flight request, an uncertain result, and retry without creating a second
> order or concealing a failure. Reuse the existing owners where they can
> provide the guarantee. Identify the affected code and decisive checks, then
> stop before implementation.

This example needs ordering and retry detail because duplicate orders matter.
A label correction does not need the same treatment.

## Ask for proof that covers the delivered change

For implementation prompts, include a concise completion condition matched to
the affected behavior. Use the repository's relevant checks rather than
inventing commands. Distinguish static review, executed tests, builds, rendered
interaction, and device verification when that difference matters. A check on
an earlier revision or a temporary workaround does not establish the delivered
change's behavior. Refresh affected evidence after material repairs.

Ask for tests that check meaningful behavior, not tests that merely mirror a
reversible, low-impact edit. Preserve required repository checks.
Broader or repeated verification needs a new change, failure, unresolved risk,
or explicit requirement. Do not mandate an independent agent, a full suite, or
a new test file for every task. Mention delegation only when the user requests
it or the intended environment and task justify independent work.

## Keep review and repair distinct

For review, request concrete findings with enough location and behavioral
evidence to act on. Preserve the user's severity, scope, and output contract.
Do not turn a request to investigate or assess into permission to fix, commit,
or publish. A reported absence of findings is valid when supported by the work.

**Input:** “Review the proposed cache invalidation plan. Focus on correctness
and unnecessary complexity. Don't rewrite it.”

**Prompt:**

> Review the proposed cache invalidation plan against the current read and
> write paths. Identify concrete correctness gaps and machinery without a
> current requirement. Support each finding with the relevant plan passage
> and source behavior, and recommend the smallest correction. Distinguish
> confirmed issues from assumptions that need checking. Do not rewrite the
> plan or change code. If no actionable issues are supported, say so.

Keep the examples' domain details out of unrelated prompts.
