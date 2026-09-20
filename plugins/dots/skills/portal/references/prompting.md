# Prompting Portal, including Pro

Use this when preparing a substantial task, making effective use of explicitly
selected Pro reasoning, or correcting a weak response. The prompt should make
the job decidable, not prescribe every step of reasoning.

## Write the brief around a decision or artifact

Carry the useful context forward: the user's desired outcome, settled choices,
observed behavior, relevant source locations, and the evidence needed at the
end. Separate “this failed” from “this may be why.” Preserve qualifications
alongside concerns so a repair does not erase behavior that already works.

State whether ChatGPT should investigate, propose, implement, or publish. For
implementation, include verification in the requested result. For a decision,
name the alternatives or constraints that actually matter and what would change
the recommendation. Use a compact brief unless an exact contract needs detail.

Give paths or attachments the active tools can read. Do not claim that a path
was attached, a source was inspected, or a tool ran merely because the prompt
mentions it. Portal already carries the Codex context; repeating a transcript
adds latency and can introduce conflicting copies of old decisions.

## Use Pro for the hard part of the job

An account subscription, a Web reasoning mode, and an underlying model identity
are different facts. Confirm the user's chosen Portal row. Pro needs an explicit
selection and account availability; it is not the default for routine work or
for the live tests in this skill.

When the user selects Pro, give it a coherent difficult problem: a coupled
design decision, conflicting evidence, an elusive failure, or a substantive
review. Include the decision criteria and actual observations. Use tool reads
to close evidence gaps; extra reasoning is not a substitute for missing data.

For latency, collect independent facts together, avoid repeatedly asking Pro to
acknowledge tiny steps, and keep follow-ups in the same task. Do not force
multiple drafts, adversarial debates, exhaustive tests, or a visible chain of
thought for every request. Ask for the conclusion, supporting evidence, material
tradeoffs, and checks the user needs. Do not silently change an explicit Pro
selection to save time; discuss a different effort when it would help.

### A decision brief for explicitly selected Pro

> Compare the two retry designs in the attached proposal against the current
> order-submission code. The server already supplies an idempotency key; keep
> that contract. Determine which design avoids duplicate orders after an
> uncertain response with the least new state. Inspect the relevant callers
> and existing tests. Return a recommendation, the decisive failure sequence,
> and any unresolved assumption that could reverse your choice. Do not edit yet.

### An implementation brief

> Implement the accepted retry design in this checkout. Preserve the endpoint,
> idempotency key, and successful flow. Work through the relevant failure and
> retry checks, fix failures caused by this change, and report the final result.
> Delegate an independent caller review if that would shorten the work; keep
> implementation and integration in the main task. Do not commit or deploy.

These are examples of different authorized outcomes, not mandatory templates.
For a small change, the result and its meaningful constraint may be enough.

## Follow up with a delta

Use the existing Codex task for a correction or additional question. Tell it
what changed, what remains accepted, and what it should do next:

> Keep the retry design. New evidence: cancellation can arrive after the server
> accepts the order but before the response reaches the client. Check that case
> and revise only what it requires. Explain the observable behavior after retry.

If it stopped too early, name the unfinished work and the completion condition.
If it chose a cause prematurely, supply the contrary evidence and ask it to
distinguish the remaining hypotheses. If it over-explains, specify the audience
and useful answer shape. Remove obsolete instructions instead of appending a
contradictory second brief.

## OpenAI guidance and its Portal adaptation

Reviewed 2026-09-19. Read these original sources for model-specific rationale:

- [GPT-6 Astra prompting best practices](https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices): define when authorized work is finished, make delegation conditional on benefit, specify the desired communication style, and match verification to the change. For Portal this means explicit completion evidence and bounded tool/agent work, not API parameter changes.
- [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), Eric Provencher, September 11, 2026: keep discovery precise, load references only when relevant, and remove instructions that no longer improve decisions. Portal keeps setup and detailed tool mechanics out of ordinary prompt composition for that reason.

These are paraphrased adaptations, not a bundled copy of either article or a
claim about which model ChatGPT currently selects. Portal's Web route may use
another model. API features such as `configuration_update`, `async: true`, and
`reasoning.effort` are not chat instructions and should not be presented as
controls supported by this bridge.

The brief-composition examples also apply Dots' `meta-prompt` method: preserve
user decisions and uncertainty, name the actual deliverable, and avoid adding
scope or ceremony. Use that skill when the requested deliverable is a standalone
prompt. Here the brief supports execution of the user's Portal task; prompt-only
output is not the completion condition.
