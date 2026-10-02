---
name: why
description: "Use for 'why does X work this way', design rationale, regressions, postmortems, or evidence-backed thresholds. Searches the smallest useful historical record and separates direct evidence, inference, and unknowns. Use how for runtime behavior."
---

# Why

Investigate the motivation and intent behind code. Why was it built this way?
What edge cases were considered? What product, business, or operational
constraints shaped the design? What alternatives were rejected, and why?

Why is the companion to `how`. How explains what the code does and how it works.
Why investigates the constraints and decisions that led to the code.

## How this skill works

Historical context is fragmented. It may live in source control, a ticket,
long-form documentation, team chat, observability, error tracking, or product
analytics. Use the code to locate relevant records. Code alone rarely proves intent.

Start with the evidence closest to the change. Widen the search when the direct
record cannot answer the question. Return the strongest answer the available record supports. Search another
system only when its records could improve that answer.

## Evidence Rules

- **Collect evidence first.** Decide which explanation the collected evidence
  supports before writing it.
- **Precision over polish.** Prefer a claim the reader can trace to its source
  over a smoother unsupported explanation.
- **Consider what you have not seen.** Ask what evidence would exist if a
  competing explanation were true and whether you looked for it.
- **Name the gaps.** Say when a source is unavailable, linked records provide no further evidence, or
  the record does not answer the question.
- **Match language to confidence.** Use confident language for direct evidence and cautious
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

## 2. Locate The Code And Its History

Find the relevant files, line ranges, symbols, and recent commits that change
the target's structure, ownership, interfaces, or behavior.
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
reviews, and linked issues for those commits. Keep the file paths, symbols,
commits, PRs, and ticket IDs together as the starting evidence for later searches.

## 3. Choose the investigation depth

Use the smallest depth likely to answer the question:

- **Focused is the default.** Search source control and the records directly
  linked from the target code and its history.
- **Expanded** adds one to three evidence sources that are likely to hold the
  missing answer. Use it when the direct record is incomplete or contradictory.
- **Exhaustive** searches every available evidence category in parallel. Use it
  for an explicit comprehensive request, a postmortem, a contested or
  high-stakes decision, or when focused searches still support different
  explanations that would change the conclusion.

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
parallel when that substantially improves coverage or reduces time. For a large run, use
[investigator-prompt.md](references/investigator-prompt.md) rather than
recreating its brief.

A search with no results is useful only when its terms and scope could
have found relevant evidence. Record an unavailable source as a gap when it could plausibly change
the conclusion, not as a routine disclaimer.

## 4. Test The Explanation

Look for earlier implementations, reversions, contradictions, and evidence that
supports a competing explanation. Do not assume the latest commit tells the
whole story or use a present-day justification as evidence for an undocumented
past decision.

Keep direct evidence, inference, and hypotheses separate while you work. When
several explanations still fit, preserve them instead of choosing one without sufficient evidence.

## 5. Combine The Findings

Use a separate synthesizer only when the reports are large, conflicting, or
independently complex. When needed, give it the target code and its history, findings, searches with no
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
Risk constraints derived from the recorded history.

The investigation is complete when every claim about intent has the right
confidence, material contradictions and gaps are visible, and further searching
is unlikely to change the decision.
