# Guidance for composing prompts

Choose the useful instruction from the situation. Combine compatible choices;
do not assemble a prompt by concatenating every example. The examples illustrate
judgment, not rigid templates.

## A bounded deliverable needs little process

Name the result and preserve the constraints that distinguish it. Do not add
research, a plan, multiple alternatives, or self-evaluation to an ordinary
transformation unless requested.

**Input:** “Make this cancellation email kinder. Keep the date and refund
policy unchanged. Under 120 words.”

**Prompt:**

> Rewrite the supplied cancellation email in a considerate, direct tone. Keep
> the cancellation date and refund policy unchanged, and add no promises or
> explanations that are absent from the original. Return only the revised
> email, under 120 words.

The length limit belongs here because the user supplied it. It is not a
default limit for other prompts.

## Unknown causes need investigation, not a predetermined solution

Keep observations separate from the user's hypothesis. Ask the recipient to
establish the missing facts through the available evidence. Do not convert
“might be” into “is,” or imply a fix was authorized when the user asked why.

**Input:** “Customers abandon the new onboarding flow. Maybe the form is too
long. Ask an analyst what we can establish from the funnel export.”

**Prompt:**

> Investigate abandonment in the new onboarding flow using the supplied
> funnel export. Form length is a hypothesis, not an established cause.
> Identify where abandonment occurs and which comparisons the data supports.
> Separate observations from explanations, and name the smallest additional
> evidence needed to distinguish the plausible causes. Recommend what to
> investigate next without claiming causation from the funnel alone.

## Exploration should serve a decision

State what the user is deciding and which constraints are settled. Define a
selection or approval boundary only when the request includes one. Do not
make brainstorming sound like permission to implement every proposed idea.

**Input:** “Use the attached agenda and notes to compare two ways to shorten
our weekly operations meeting. We still need incident decisions and named
owners. No tool purchases.”

**Prompt:**

> Compare two practical ways to shorten our weekly operations meeting while
> preserving incident decisions and named action owners. Use the supplied
> agenda and meeting notes to explain what each option removes or changes,
> the tradeoffs, and which you recommend. Work within the existing tools;
> do not propose purchases or present a new process as already approved.

## Execution needs an endpoint and an honest boundary

When the user authorizes work, describe the completed result and the limits
on side effects. Let the recipient choose efficient steps within that scope.
Do not insert approval after every reversible step, or infer publication
from a request to prepare an artifact.

**Input:** “Clean the supplied customer import. Remove exact duplicates,
keep uncertain matches separate, and give me the cleaned file.”

**Prompt:**

> Produce a cleaned copy of the supplied customer import. Remove exact
> duplicate records; retain uncertain matches for review without merging
> them. Preserve the original file and the remaining field values. Return
> the cleaned file and a concise account of removed duplicates and unresolved
> matches. Check that no records were lost beyond the exact duplicates.

For a truly staged request, state the transition: “Present the alternatives
and stop for selection” or “Implement the accepted plan and verify it.” Do
not give both as competing instructions for the same response.

## Evidence requirements belong to the downstream work

Retain the user's time window, authoritative sources, confidentiality limits,
and intended decision. Specify what needs support and how to represent gaps.
Do not conduct the research while writing its prompt, invent sources, or force
a citation style the user did not need.

**Input:** “Help me commission a current comparison of open-source license
scanners for the attached release-process requirements. We can only share a
synthetic manifest.”

**Prompt:**

> Compare currently maintained open-source license scanners for our release
> process. Use official project documentation and release information to
> establish supported ecosystems, license detection, integration effort,
> maintenance, and limitations relevant to the supplied requirements. Link
> evidence for material claims, distinguish documented capability from
> untested assumptions, and recommend a shortlist with tradeoffs. Use only
> the supplied synthetic manifest; do not upload private repository content.

Only ask for exhaustive coverage if the user needs it. An evidence gap should
remain a gap rather than become a confident negative or a fabricated fact.

## Revision preserves the requested substance

Use the newest requested change to resolve conflicts; retain earlier material
that still applies. Remove obsolete instructions rather than appending a
second instruction that contradicts them. Return the whole revised prompt.

**Input:** “Shorten this interview-summary prompt. Keep attributed quotes,
disagreements, and unresolved questions. Remove its mandatory SWOT analysis.”

**Prompt:**

> Summarize the supplied interview notes for the project team. Preserve
> accurately attributed quotes, distinguish disagreements from shared views,
> and identify unresolved questions. Keep the summary concise and grounded in
> the notes. Return the summary without adding a SWOT analysis.

The example assumes those are the original prompt's only remaining
requirements; a real revision must retain any other requirements in its input.

## Exact output contracts must name the actual artifact

Keep supplied field names, allowed values, ordering, and empty-result behavior
exact. Preserve the difference between a prompt requesting a result and that
result itself. Do not add format details the recipient cannot know.

**Input:** “Write a prompt to extract shipment IDs and dates into CSV. Columns
shipment_id, dispatch_date; preserve source order; blank date if absent.”

**Prompt:**

> Extract each shipment ID and its dispatch date from the supplied document.
> Return only CSV with the header shipment_id,dispatch_date, preserving source
> order. Leave dispatch_date empty when the document does not provide it.
> Escape CSV values correctly. Do not add Markdown fences or surrounding prose.

For API integrations, schema enforcement is a host responsibility. Do not
pretend natural-language instructions change API settings or guarantee valid
semantic content. Preserve the user's actual destination and format.
