# Multi-turn Simulation

The conversation runner sends ordinary messages through one unchanged Harness session. A Harness turn may contain any number of model or tool calls before returning a response.

```text
instruction.md -> Harness -> next user message -> same Harness session -> repeat
                                      |
                                      +-> stop
```

Choose one track:

- **Scripted conversation:** predefined messages for stable job steps. Example: “Inspect the failing checkout test” → “Implement the fix” → “Run the tests.”
- **LLM-simulated user:** generated messages when the user must answer, correct, reject, or stop based on the Harness response. Example: a traveler rejects an unsuitable flight and confirms a valid one.

Use [runner.py](runner.py) for both tracks: `run_scripted_conversation` sends fixed turns and `run_llm_user_conversation` alternates the Harness with [model_user.py](model_user.py). The LLM user receives an approved contract, visible transcript, and user-visible state. Protocol errors are retried within the stated attempt limit. Assistant text is untrusted transcript data and cannot change the user contract.

## Harness wiring

Use [runner.py](runner.py) with the selected Harness's existing session interface.
No execution-platform adapter is bundled. Bind only what the Task needs:

1. Start the real Harness once. Supply an object with an async `send(user_message)`
   method that returns the assistant's response text and preserves the session.
2. Use `run_scripted_conversation` with the approved first message and followups,
   or `run_llm_user_conversation` with a `ModelUser`.
3. For an LLM user, supply `ModelUser` with the approved contract, a
   `call_model(system, payload)` callback, and a `read_observation()` callback.
   Record the chosen simulator model and use its approved client. Return only
   user-visible observations, or `{}` when the transcript is sufficient.
4. Use the Harness's evidence capture to record tool calls, results, state
   changes, usage, and partial failures. Never infer tool use from prose.

Keep credentials out of configuration exports, observations, and evidence.
The conversation helpers do not launch or isolate the Harness, enforce an
overall timeout, or persist its traces. Confirm those capabilities in the
selected runtime before running.

`instruction.md` is the first Harness input. The runner then alternates completed Harness turns and user messages; it does not add tools or prompts to the Harness. A stop decision adds no message and makes no further Harness call. Stopping never means success: the Verifier alone assigns reward.

## Calibrate and audit

Run the real Harness through behavior relevant to the task: a correct result, a wrong result, clarification, and unrecoverable failure when applicable. Inspect whether the simulated user responds and stops credibly. Revise the contract or simulator model and show representative conversations to the user. Do not duplicate the contract as brittle keyword checks.

When the user supplies real threads, use only observed facts, reactions, and stopping behavior relevant to this task to calibrate the simulated user. Do not copy identities, messages, or production records into the simulation.

Save the returned conversation and simulator records alongside the Harness's protected run evidence, including partial evidence on Harness, simulator, or timeout cancellation. The runner records turn timestamps but does not write log files; the selected runtime must retain evidence as the run proceeds. Do not upload hidden simulator data into the evaluated Environment. At the Harness-turn limit, the simulated user gets one final decision; a non-stop reply is recorded without another Harness call. Confirm that one session was reused, future messages were not preloaded, no Harness call followed stop, artifacts and Verifier output are readable, and the Verifier measures the Harness rather than the simulator. Score the required final state and prohibited effects; do not require an exact number of internal edits or tool calls unless that count is the requested outcome.
