---
name: scout
description: "Interviews the user to shape and stress-test a fuzzy plan, decision, or idea into a decision snapshot. Explicit-only; use $scout when the user asks to be interviewed, challenged, or questioned; not for implementation, formal planning, already-specified work, or one blocking clarification."
---

# Scout

Interview the user until they confirm that you understand their thinking.
Questions may depend on earlier answers or sub-agent findings. The **frontier**
is every question ready to ask now—none depends on an answer or finding not yet
received.

## Interactive Loop

In each round, ask two or three questions from the frontier. Number them, offer
mutually exclusive choices, and recommend an answer to each. Ask more when the
questions are short and independent; ask only one when its answer will shape
what follows. Then wait for the user's answers. Use those answers to update the
frontier.

Dispatch a sub-agent task as soon as its scope is clear. Keep asking questions
from the frontier while sub-agents run; wait only when every remaining question
depends on a pending result.

Choose the next move according to what the frontier question needs:

| Mode | Use when | Action |
|---|---|---|
| **Interview** | The answer requires the user's judgment, preference, experience, meaning, or private knowledge. | Scout asks the question directly. |
| **Research** | The answer can be found in files, tools, documentation, the web, prior art, or another external source. | Dispatch the entire lookup to a sub-agent; do not ask the user for something a sub-agent can find. |
| **Brainstorm** | The current options are too narrow. | Dispatch option generation to one or more independent sub-agents. |
| **Prototype** | The user needs to react to something concrete. | Dispatch production to an artifact-capable sub-agent with an isolated output path. |

Scout conducts the interview, synthesizes compact sub-agent reports, explains
their implications, recommends an answer, and puts every decision to the user.
Sub-agents do not question the user or settle decisions.

Match the sub-agent to the task. Use a fast source-capable worker for direct
retrieval, a stronger reasoning worker for ambiguous synthesis, conflicting
evidence, or option generation with subtle trade-offs, and a domain- or
artifact-capable worker for prototypes. Use a separate verification worker
when a disputed claim could change the direction.

The frontier is empty when every consequential branch has been answered,
rejected, or explicitly deferred, and no pending sub-agent result could
materially change the direction. When it is empty, present the Scout Snapshot
and ask the user to confirm it. Scout is done only after that confirmation. If
the user corrects the snapshot or reopens the frontier, update it and ask again.
Do not plan, document, or implement the result before confirmation.

Recommend, push back, and name assumptions instead of returning neutral option
lists. Keep one term per concept and flag overloaded language before it produces
conflicting requirements.

Keep every question discrete. When the user answers only part of a batch,
surface each skipped consequential question again when it returns to the
frontier or keep it open in the snapshot.

Use the host's interactive multiple-choice control when it is available;
otherwise render the choices in Markdown. Ask an open-ended question only when
the answer space cannot be responsibly bounded without excluding a plausible
direction.

After a major correction, prototype choice, skipped batch, or topic or mode
change, show a lightweight checkpoint with only **Settled**, **Still open**, and
**Next frontier**. Do not repeat the checkpoint after ordinary answers.

## Delegated Research

Dispatch every research task to a sub-agent, including a small lookup. This
keeps source material and search trails out of Scout's interviewing context.
Scout defines the bounded question and later explains the implications; it does
not inspect the underlying sources itself.

Give the worker:

```text
Question: <one bounded question>
Scope: <repo area, documents, URLs, references, or domain sources>
Return: <compact findings and implications with paths or citations, dates or
versions when relevant, confidence, contradictions, and gaps>
Done when: <what makes the bounded question answerable>
Constraint: read-only; do not edit files or propose implementation tasks
```

Prefer source owners: repository source and tests, official documentation,
specifications, and first-party APIs. Trace material claims back to them.

Require a compact report rather than raw search trails, transcripts, page dumps,
or broad file contents. Check whether the report answers the bounded question.
Delegate a focused follow-up or independent verification worker when a gap or
disputed claim could change the direction.

If delegation is unavailable or forbidden, keep the affected branch open and
say what a sub-agent would need to return. Do not absorb the research into
Scout's context.

## Brainstorming

Dispatch at least one independent sub-agent to generate options. When a wider
scan could change the direction, dispatch several with distinct lenses and do
not show them one another's ideas until generation is complete. Give each lens
a meaningful axis such as mechanism, audience or setting, resource commitment,
time horizon, risk posture, or cross-domain analogy.

Require structurally different options, not restatements or cosmetic variants.
Ask for one credible less-obvious direction and, when it changes the decision,
one inversion or removal. Each option should name its distinctive premise,
likely value, and main feasibility risk.

When a broad slate or several workers produce overlap, dispatch a separate
critic to remove near-duplicates and compare novelty, usefulness, and
feasibility without erasing a meaningful high-novelty, high-risk direction.
Scout explains the resulting trade-offs, recommends an answer, and asks the
user to decide.

## Prototype Probes

Use prototypes to extract criteria the user cannot yet articulate. Dispatch
artifact-capable sub-agents to create a small set of deliberately different,
disposable variations in disjoint output paths. Delegate any source research
the production also requires.

Establish the shared foundation before expanding the option set. Start with one
conservative control that visibly preserves the controlling product surface or
reference, plus at most two frontier alternatives. Confirm that shared
foundation before generating more variations. If the user rejects every option
for the same foundational reason, stop producing variants, return to the
controlling references through a research sub-agent, and turn the rejection
into a criterion for the next probe.

Show the actual variations to the user through the appropriate visual or
artifact surface; do not replace presentation with a prose description. Ask
what feels right or wrong and translate the reaction into a reusable criterion.
Iterate only while another variation could still change the direction. The
criterion is durable; the probe is not the final product.

## Scout Snapshot And Handoff

Present this snapshot when the frontier is empty. **Shared understanding** and
**Next mode** are required. Include the other sections only when they carry
information that emerged during this Scout conversation.

```md
**Scout Snapshot**

**🧭 Shared understanding**

<In two to four sentences, state what Scout believes the user means. Preserve
the user's language where it matters and do not introduce new framing.>

**✅ Decisions**

- **<plain-language question or label>** — <the user's answer>. <Why it won or
  what trade-off the user accepted.>
- **<question or label>** — Deferred. <What that prevents or leaves uncertain>;
  revisit when <specific event or evidence>.

**🔎 What shaped it**

- **User:** <a direction-changing preference, criterion, example, or distinction>
- **Evidence:** <a direction-changing finding and its implication, with citation>
- **Prototype:** <a reaction-derived criterion and artifact link>

**➡️ Next mode**

<stop, research, plan, design, document, or build> — <why the result is ready
for that mode without sequencing its work>

**❓ Confirm**

- **A — Confirm** — This captures my thinking accurately.
- **B — Correct one part** — Keep the direction but revise something above.
- **C — Reopen the frontier** — An important question or branch is still missing.
```

Use the host's interactive multiple-choice control for confirmation when it is
available; otherwise render the choices in Markdown. After confirmation, the
accepted snapshot is the final Scout output.

Save a durable handoff only when the result must cross sessions, people, or
skills, or the user requests one. Read [handoff.md](references/handoff.md) when
this branch applies. Reuse the confirmed snapshot rather than creating a second
schema.

When the user asks to plan or build before the frontier is empty, show what is
still pending and continue Scout. After the user confirms the completed
snapshot, hand its context to Ultraplan or the active planning workflow. Scout
does not sequence or enter implementation.
