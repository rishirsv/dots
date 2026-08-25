---
name: why
description: "Use for 'why does X work this way', design rationale, regressions, postmortems, or evidence-backed thresholds. Searches the smallest useful historical record and separates direct evidence, inference, and unknowns. Use how for runtime behavior."
---

# Why

Investigate the motivation and intent behind code. Why was it built this way?
What edge cases were considered? What product, business, or operational
constraints shaped the design? What alternatives were rejected, and why?

Why is the companion to `how`. How explains what the code does and how it works.
Why investigates the forces that gave it that shape.

## How this skill works

Historical context is fragmented. It may live in source control, a ticket,
long-form documentation, team chat, observability, error tracking, or product
analytics. Code anchors the investigation, but code alone rarely proves intent.

Start with the evidence closest to the change. Widen the search when the direct
record cannot answer the question. The goal is the strongest honest answer the
available record supports, not a ceremonial search of every system.

## Operating posture

- **Evidence before narrative.** Collect the pieces before choosing the story
  they support.
- **Precision over polish.** Prefer a claim the reader can trace to its source
  over a smoother unsupported explanation.
- **Consider what you have not seen.** Ask what evidence would exist if a
  competing explanation were true and whether you looked for it.
- **Name the gaps.** Say when a source is unavailable, a thread goes cold, or
  the record does not answer the question.
- **Hedge on purpose.** Use confident language for direct evidence and cautious
  language for inference.
- **Do not use code as proof of its own intent.** “It handles null because it
  checks for null” describes mechanics, not motivation.

Read [epistemics.md](references/epistemics.md) for the confidence framework and
phrasing guide. Preserve that confidence language in the final answer.

## 1. Understand the target

Identify what the user is asking about and what kind of answer would help:

- design rationale: “Why was this designed this way?”
- tradeoff: “Why do we do X instead of Y?”
- defensive reasoning: “What edge case motivated this?”
- external constraint: “What product or operational need led to this?”
- archaeology: “Why does this code still exist?” or “What is the history?”

If the target is vague, use the conversation, current selection, open files, or
recent work to make the best interpretation. State it briefly and proceed so
the user can redirect you.

## 2. Establish the code anchor

Find the relevant files, line ranges, symbols, and recent substantive commits.
Use blame and file history to locate merge commits, pull requests, tickets,
comments, tests, and incidents tied to the target.

Typical starting commands include:

```bash
git blame -L <start>,<end> <file>
git log --follow -p -- <file>
git log --oneline -20 -- <file>
git log -1 --format=%B <commit>
```

When `gh` is installed and authenticated, inspect the PR body, discussion,
reviews, and linked issues for substantive commits. Keep the file paths,
symbols, commits, PRs, and ticket IDs together as the seed context for later
searches.

## 3. Choose the investigation depth

Use the smallest depth likely to answer the question:

- **Focused is the default.** Search source control and the records directly
  linked from the code anchor.
- **Expanded** adds one to three evidence sources that are likely to hold the
  missing answer. Use it when the direct record is incomplete or contradictory.
- **Exhaustive** searches every available evidence category in parallel. Use it
  for an explicit comprehensive request, a postmortem, a contested or
  high-stakes decision, or when focused searches leave materially different
  explanations alive.

Use the available source playbooks under `references/sources/` when their source
is relevant:

- **Source control** captures implementation-time rationale in commits, PRs,
  comments, and tests.
- **Tickets** often capture the customer, product, compliance, or scheduling
  pressure behind the work.
- **Long-form documents** hold RFCs, ADRs, PRDs, design alternatives, and
  postmortems.
- **Team chat** can hold real-time decisions that never reached a durable doc.
- **Observability** connects thresholds and defensive code to runtime behavior
  and incidents.
- **Error tracking** connects corrective code to specific exceptions and
  releases.
- **Product analytics** can explain limits, experiments, migrations, and usage
  assumptions.

Investigate directly when the search is small. Delegate independent sources in
parallel when that materially improves breadth or latency. For a large run, use
[investigator-prompt.md](references/investigator-prompt.md) rather than
recreating its brief.

A null result matters only when the search was focused enough to mean
something. Record an unavailable source as a gap when it could plausibly change
the conclusion, not as a routine disclaimer.

## 4. Test the story

Look for earlier implementations, reversions, contradictions, and evidence that
supports a competing explanation. Do not assume the latest commit tells the
whole story or retrofit a sensible present-day rationale onto an undocumented
past decision.

Keep direct evidence, inference, and hypotheses separate while you work. When
several explanations still fit, preserve them instead of forcing a winner.

## 5. Synthesize the answer

Use a separate synthesizer only when the reports are large, conflicting, or
independently complex. When needed, give it the code anchor, findings, null
results, original question, `epistemics.md`, and
[synthesizer-prompt.md](references/synthesizer-prompt.md).

## Output contract

Adapt the headings to the question, but keep the confidence separation:

- **The question.** Restate the decision or history being investigated.
- **The code in question.** Give the relevant files, lines, and symbols in one
  or two lines.
- **What we found.** State direct evidence with a commit, PR, ticket, document,
  chat permalink, incident, metric, or code-comment citation.
- **What we can reasonably infer.** Explain the evidence chain and use language
  such as “appears to,” “likely,” or “suggests.”
- **Competing hypotheses.** Include this only when more than one explanation
  still fits. Give evidence for and against each.
- **What we do not know.** Name material unanswered questions and searches that
  returned no relevant result.
- **Sources consulted.** Say what was searched, what it contributed, and which
  meaningful sources were unavailable or empty.

If the question precedes a code change, finish with Preserve / Change / Avoid /
Risk constraints derived from the lineage.

The investigation is complete when every claim about intent has the right
confidence, material contradictions and gaps are visible, and further searching
is unlikely to change the decision.
