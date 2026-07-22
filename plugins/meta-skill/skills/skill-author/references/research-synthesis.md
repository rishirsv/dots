# Research And Synthesis

Read this when authoring or revising a skill that investigates a question,
compares sources, or turns evidence into findings, a brief, a recommendation, or
another research output. Build a conditional evidence workflow, not a fixed
research template. The skill should adapt its depth, source mix, and output to
the question while making support, uncertainty, and stopping decisions visible.

## Frame An Answerable Research Job

Before telling the skill to search, define the research job in terms that guide
selection and stopping:

- the user's decision, understanding, comparison, or action the answer must
  support;
- the primary question and the few subquestions that must be answered to answer
  it;
- the entity, population, period, geography, definitions, and comparison basis
  that bound each subquestion;
- the expected output surface and depth; and
- the evidence that would be sufficient to answer, qualify, or leave each
  subquestion open.

Require the skill to split broad prompts into a question map before gathering
evidence when one search cannot answer the request safely. For example, a
company comparison might need separate questions about product capability,
pricing, customers, recent changes, and positioning; a synthesis of user
research might need separate questions about observed behavior, stated
preference, prevalence, and segment differences.

Do not force a question map for a narrow, self-contained request. In that case,
state the answerable question and the source scope directly. Ask a focused
clarifying question only when the missing entity, period, decision, or output
would change what counts as a correct answer; otherwise proceed with a visible
assumption.

## Select Sources By What They Can Prove

Author a source-selection policy that ranks sources by fitness for the specific
claim, rather than treating every source as interchangeable. Inspect supplied
files and stated context as in-scope evidence; use each only for claims it can
support, and record when a supplied source is irrelevant, superseded, or
insufficient. A general evidence order is:

1. controlling first-party records, direct observations, primary documents, or
   authoritative systems of record;
2. trusted structured providers or exports that identify their origin and date;
3. credible secondary analysis for context, comparison, or discovery; and
4. clearly labeled assumptions or unresolved gaps when stronger support is not
   available.

Make the hierarchy conditional. A first-party statement can establish what an
organization says, but not automatically prove an outcome. A survey can report
responses, but not necessarily observed behavior. A current primary record may
supersede an older secondary summary. Use a second suitable source to
corroborate a claim only when corroboration would resolve a real ambiguity; do
not collect duplicates merely to inflate a source count.

For each source the workflow keeps, require a compact evidence record with:

- stable identifier and title or description;
- source type and why it is appropriate for the claim;
- publication, effective, as-of, and access dates when relevant;
- covered entity, population, period, version, unit, and definition;
- precise location such as page, section, table, cell range, timestamp, or
  link; and
- freshness status, limitation, and conflict notes.

Keep the record proportional to the output. A short answer may cite at the
point of use; a multi-claim analysis may need a source register or evidence
ledger. In either case, a reader should be able to locate the support for an
important claim without guessing.

## Handle Recency Explicitly

Tell the skill to choose a freshness rule for each source class before relying
on it. The rule should use the question's time horizon and the cadence at which
the underlying fact changes. Check for a newer version, a superseding event,
and an as-of date whenever a time-dependent fact affects the answer.

If freshness cannot be determined, label the input as unknown rather than
current. If older evidence remains useful for historical context, preserve it
with its period and do not present it as current. When sources span different
periods, require the skill to reconcile or disclose the mismatch before making
a comparison.

## Search Deliberately And Stop For A Reason

When searching is needed, require the skill to translate the question map—or,
for a narrow request, the stated question and source scope—into a search plan:

- map each subquestion to likely source families and search terms;
- begin with the strongest available route for the claim;
- use secondary sources to discover primary sources, competing explanations,
  or missing vocabulary rather than treating search snippets as final support;
- follow promising source trails only while they can improve coverage,
  freshness, authority, or a known conflict; and
- record the source gap when an authorized, available route cannot answer a
  required subquestion.

Give the skill a stop rule. It may stop when every priority subquestion has
either a traceable, sufficiently current answer or a clearly stated unresolved
gap; the strongest plausible alternatives have been checked for meaningful
conflicts; and additional searching is unlikely to change the answer. Continue
searching when a central claim rests only on discovery-only sources, the
evidence is stale or mismatched to the question, a competing explanation
remains untested, or source coverage is visibly incomplete.

Do not set arbitrary counts of searches or sources. The correct stopping point
depends on the decision, the availability of controlling evidence, and whether
new sources can change the conclusion.

## Capture Evidence Before Writing Findings

Instruct the skill to extract claim-sized evidence, not undifferentiated notes.
Each record should preserve the source wording or data needed to check the
claim, its location, the relevant context, and the relationship between the
evidence and the subquestion. Keep direct observations distinct from summaries
of them.

For qualitative synthesis, code observations separately before grouping them
into themes. Preserve counterexamples, outliers, and segment differences rather
than forcing every observation into the dominant theme. Distinguish what people
did from what they said; distinguish a quotation that illustrates a finding from
the inference the skill draws from it. For quantitative evidence, retain the
population, period, definitions, calculation, and comparison basis before
combining or ranking values.

When the workflow derives a value, require cited inputs and a visible formula or
brief calculation explanation. When it summarizes multiple sources, require a
clear account of whether the sources measure the same thing, period, population,
and definition before treating them as comparable.

## Classify Claims And Inferences

Author a claim-type system that prevents evidence from acquiring more certainty
than it earned. Use equivalent labels appropriate to the domain, such as:

- **direct fact or observation:** supported by a source that directly records
  the asserted item;
- **source statement:** a position, projection, or assertion made by a source,
  not established merely because it is repeated;
- **derived result:** calculated from cited inputs;
- **estimate or forecast:** a third-party or model projection with its basis and
  period identified;
- **inference or interpretation:** a conclusion drawn from evidence, with the
  reasoning made visible;
- **assumption:** an input supplied or adopted without direct support; and
- **unresolved claim:** a point the output needs but the available evidence does
  not support.

Require every important conclusion to identify its supporting facts, inference
steps, and limiting conditions. Do not let a citation attached to a paragraph
appear to support claims it does not actually cover. Replace unsupported
superlatives, causal assertions, and universal statements with evidence-backed
language, a narrower statement, or an explicit gap.

## Reconcile Conflicts And Uncertainty

Specify a concrete conflict path:

1. Identify the conflicting values or statements and their locations.
2. Test whether the apparent conflict comes from different dates, populations,
   definitions, units, scenarios, versions, or source roles.
3. Prefer the source best suited to the claim—for example, a controlling record
   over an unattributed summary, or the later final version over a superseded
   preliminary version.
4. If one source is selected, say why; if the conflict remains unresolved,
   retain it as an open finding rather than collapsing it into one value.
5. State how the conflict or evidence gap limits the conclusion and what source
   or observation would resolve it.

Keep uncertainty specific. State whether it comes from missing coverage, stale
evidence, indirect support, a small or unrepresentative sample, incompatible
definitions, an unverified calculation, or disagreement among sources. Do not
use a generic confidence label without also identifying the reason and the
claim it qualifies.

## Cite For Verification, Not Decoration

Design citations around the reader's ability to verify the claim. Put support at
the point of use for factual, numerical, comparative, causal, or
recommendation-bearing claims; use a compact source register when repeated
citations would damage readability. For each citation, preserve enough
information to find the relevant passage or data point, not just the source
title.

Adapt the format to the surface: use the environment's native citation mechanism
in chat when available; use footnotes, endnotes, a source column, or stable
source identifiers in files that cannot retain live links. Keep citations close
enough to their claims that a reader can tell what they support. Do not break
names, dates, values, or short phrases into unreadable citation fragments.

## Detect Unsupported Claims Before Delivery

Require a final claim sweep that works from the draft back to the evidence
records. It should check that:

- each important factual, numerical, comparative, causal, or recommendation
  claim has suitable support, a clear inference path, or an explicit label;
- citations point to the stated claim, period, population, units, and
  definitions;
- headline findings do not overstate the evidence beneath them;
- facts, source statements, calculations, inferences, estimates, assumptions,
  and gaps remain distinct;
- conflicts, stale inputs, and missing coverage remain visible where they
  affect the result; and
- the conclusion answers the question map without quietly filling unanswered
  subquestions.

If the sweep finds a problem, the skill should add support, narrow or relabel
the claim, surface the limitation, or remove the claim. It must not resolve the
problem by adding a citation that does not support the statement.

## Define Tool And Source Failure Behavior

Write explicit branches for operational failures:

| Condition | Required behavior |
| --- | --- |
| A required source route is unavailable, unauthorized, rate-limited, or returns no usable result | Record the coverage gap, try the next permitted source family, and ask for a file, export, access, or source pointer only if it would change the answer. |
| A tool returns partial, malformed, or ambiguous data | Preserve the usable portion only when its scope is clear; label the limit and avoid extrapolating the missing portion. |
| Search finds only summaries or snippets | Treat them as discovery leads; locate an appropriate underlying source or return the claim as unresolved. |
| The question remains too broad after one focused clarification | Deliver a bounded first pass organized by the answered subquestions and identify the next question that would narrow the work. |
| Evidence cannot support the requested conclusion | Return the supportable findings, the exact limitation, and the input or observation that would resolve it. |

Do not describe a failed tool call as proof that no evidence exists. Do not
fabricate unavailable content, access, citations, dates, or results.

## Shape The Output To The Research Job

Let the output follow the reader's need rather than a universal report outline.
A concise answer may lead with the direct answer, evidence, limitation, and next
step. A comparison may need shared criteria, source-backed differences, and
where evidence is not comparable. A synthesis may need themes, supporting
observations, segment differences, and unanswered questions. A research brief
may need the question, findings, reasoning, source notes, and implications.

In every form, lead with the answer or finding when the evidence supports one,
then show the reasoning and limits at the depth the reader needs. Keep source
metadata and search bookkeeping out of the main narrative unless the user asks
for an audit trail; make it available through concise citations or a source
section instead.

## Prepare The Evaluator Handoff

When behavioral evidence is needed, give `skill-evaluator` requests that test
research judgment rather than a preferred outline. Include these cases when
they fit the skill:

- a broad prompt that requires a question map and selective source plan;
- a narrow prompt with sufficient supplied evidence that should not trigger
  unnecessary searching;
- a comparison where sources use different periods, definitions, or populations;
- a source statement that must not be rewritten as an established fact;
- conflicting or stale sources that require a visible reconciliation path;
- an unavailable or partial source route;
- a draft containing an unsupported headline or citation mismatch; and
- a qualitative synthesis with an outlier or segment difference that should not
  disappear in the dominant theme.

For each case, assert observable outcomes: question decomposition when needed,
appropriate source selection, evidence records, claim labels, citation-to-claim
mapping, recency treatment, conflict and failure handling, output shape, and
the final unsupported-claim sweep. Reject tests that merely count citations,
sources, headings, or search calls.
