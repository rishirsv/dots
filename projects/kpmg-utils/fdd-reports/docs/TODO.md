# Reference Review To-Do

Use this checklist when reviewing each section reference manually. These items are written to be reference-agnostic so they can be applied across the full reference set.

## Structure and terminology

- Replace abstract labels such as `narrative components` or `analytical units` with `Typical content areas` where that better reflects how the reference is organized.
- Standardize surrounding terminology so the file consistently refers to `content areas` rather than mixing in `blocks`, `components`, `units`, or similar labels.
- Rename overly abstract content-area headings into plain-English labels that explain the content directly.
- Remove backticks from structural labels and assembly-pattern names unless they are true literal identifiers.
- Where a reference can support multiple user-facing section names, make the output title flex to the requested topic instead of forcing the file name as the section heading.
- Where a reference can be used in both a default mode and a topic-specific mode, make the default mode explicit and describe how the structure changes when the user asks for a narrower topic.

## Corpus alignment

- Re-check the actual section corpus before finalizing top-level guidance, especially the section objective and section-architecture summary sentence.
- Make sure the reference describes the section the way it actually appears in the corpus, not the way we might want it to appear in a cleaner template.
- Avoid implying that internal subheadings are mandatory if the corpus usually uses standard bullets or short lead-in lines instead.
- Update examples so they reflect the corpus drafting pattern, including when grouped bullets use a short lead-in line rather than a formal subheading.
- Once the guidance is finalized, remove references to the corpus itself from the distributed skill reference so the file remains standalone.

## Section architecture

- Keep `Section architecture` focused on the overall draft shape, expected density, required content, optional content, and ordering.
- Use a single verbosity rule rather than multiple overlapping density schemes.
- Express verbosity as a sentence such as `Stop adding detail when...`, followed by a practical target for bullets, word count, or density.
- Keep required content areas concise and practical.
- Keep optional content areas concise at the architecture level, and leave detailed trigger logic to the `Typical content areas` section.
- Use bold inline subsection labels inside `Section architecture` to match the formatting style used in `slide-templates.md`.
- If optional items are really interpretation lenses or writing considerations, frame them that way instead of implying they are standalone sections.

## Typical content areas

- Use the `Typical content areas` section as the main home for detailed drafting guidance.
- Keep the section focused on reusable content areas rather than overly technical writing primitives.
- Prefer short writer-facing labels such as `Opening line`, `Basis of presentation`, `Adjustment narratives`, or `Supporting notes` when those better teach the actual drafting pattern.
- For straightforward content areas, keep only the essential guidance.
- If the lower half of the file starts to read like a schema, trim it back until it reads like practical writing guidance rather than field definitions.
- For conditional or easily overused content areas, keep explicit usage guardrails.
- Standardize conditional guidance to a single pattern such as `Use when` and `Skip when`.
- Do not keep `Purpose`, `Use when`, `Skip when`, `Target length`, and similar labels on every content area by default; use them selectively where they add real drafting value.
- Keep examples short, concrete, and aligned to the section’s real source patterns.
- Make sure one dominant drafting pattern is taught clearly enough that a downstream model can follow it without inferring a second competing structure.
- Where the section is caption- or bullet-driven, make the examples and content-area definitions mirror the actual sentence pattern used in strong source examples.
- Where a section has a broad population of adjustment or finding types, include a small example bank covering the main types and tell the model to choose the closest example pattern and adapt it.
- When using an example bank, keep the wrapper light and natural so the bank feels like a set of writing templates rather than a mini taxonomy.
- Group secondary items such as drivers, seasonality, days analysis, sell-side notes, or other considerations under a lighter heading such as `Supporting notes` when that better reflects how they are used in the final draft.

## Data and drafting inputs

- Add `Data / information typically needed` where it would help the model understand the minimum required inputs for drafting.
- Structure input guidance in the same style as `slide-templates.md`, using subsections such as:
  - `Typical content areas`
  - `Data / information typically needed`
  - `Data mapping considerations`
  - `Formatting principle`
  - `Verification questions`
- In `Data mapping considerations`, make clear which inputs are core and which are conditional.
- Add guidance for thin-source cases: if relevant detail is missing, use inline square-bracket placeholders instead of generic filler or open questions.
- Where relevant, make the preferred source input explicit. For example, if the strongest draft comes from a full schedule plus underlying account detail, say that directly.
- Where relevant, make the workflow identify the largest captions or subtotals first, then map underlying account composition into logical buckets.
- Where relevant, make it clear that commentary should be built from the source support the user provides, and that the skill does not need to recreate an exhibit the user is already supplying.
- Where relevant, tell the model to quantify significant balances within a caption rather than describing the caption only at a high level.
- Where relevant, tell the model to include the operating, accounting, commercial, or financing mechanics that help interpret the caption, such as days metrics, credit terms, allowance policy, revenue-recognition mechanics, or facility terms.
- Where the section is a synthesis section, make the workflow start by reviewing all provided report contents before drafting from any one subsection.
- Where the section pulls findings from multiple workstreams, tell the model how to prioritize and rank those findings by significance, risk, or deal impact.
- Where a section can be requested on a specific topic, make that capability explicit and instruct the model to scan all provided materials for that theme.
- Where a section has a broad default use case, tell the model what to do when the user does not narrow the request, rather than leaving scope selection implicit.
- Where the section sits beside an exhibit, make the commentary follow the same order the reader sees in the exhibit.
- Where supporting analyses exist, tell the model when to use them to explain the main exhibit rather than treating them as standalone narratives.
- For purchase-price mechanics sections, distinguish clearly between the reported or definitional position and the additional reclasses, adjustments, or other considerations that sit beyond the reported definition.
- For policy-writing sections, tell the model to explain how the policy works in practice, who owns it, how often it operates, what systems support it, and why it matters.
- For policy-writing sections, default to the financial reporting and accounting policy environment when the user’s request is broad, and flex into payroll, benefits, IT, or other policy areas only when requested or clearly supported by the source material.
- Where shared-service or support functions materially affect execution of the section topic, tell the model to include team composition and ownership context rather than policy description alone.

## Flow and redundancy

- Remove duplicate guidance between `Core principles`, `Analytical workflow`, `Section architecture`, and `Typical content areas`.
- Keep `Core principles` focused on decision rules.
- Keep `Analytical workflow` focused on the sequence for building the section.
- Keep `Section architecture` focused on draft shape and density.
- Keep `Typical content areas` focused on detailed content guidance.
- Rewrite awkward or overly technical phrasing into more natural language wherever possible.
- If a concept is really a writing consideration or interpretation lens, do not turn it into a separate pseudo-section or drafting primitive.
- Make one drafting pattern dominant throughout the file so the model does not learn two competing structures.
- Prefer positive, direct drafting guidance over speculative anti-pattern warnings.
- Keep `Section-specific writing guidance` only if it adds a small number of unique style rules not already covered elsewhere.
- If the section is organized around findings, tell the model the default finding groups and when those groups should flex based on significance.
- If the section is adjustment-driven, tell the model how to group findings into categories and how many of the most significant items to pull within each category.
- If the section is caption-driven, tell the model whether the goal is a selective material-caption discussion or a more comprehensive walkthrough of the relevant captions.
- If the section is policy-driven, tell the model to summarize policy content in company-specific report language rather than paraphrasing policy manuals or accounting standards line by line.
- If the section is purchase-price or classification driven, tell the model to explain the balance, what it relates to, and the closing relevance, rather than repeatedly using formulaic labels such as “this is debt-like because...”.

## Verification and examples

- Simplify long verification checklists into a short set of high-signal verification questions.
- Match the verification style used in `slide-templates.md` rather than maintaining long compliance-style lists.
- Add a short note above examples clarifying that they show content flow, not required headings or exact bullet counts.
- Make sure examples demonstrate the intended drafting behavior clearly enough that the user can infer the pattern without cross-referencing the full section.
- If the skill usually writes commentary around a user-supplied exhibit, make the examples start where the drafted commentary actually starts instead of reproducing the exhibit.
- Use examples to show the real output scope of the skill. If the model is not expected to build a table or chart by default, do not teach that as part of the example output.
- Keep examples in the actual report-writing voice, not an explanatory or training voice.
- If seeing the incoming data shape is important, include a representative exhibit with an explicit note that it is an example of the input the skill may receive, followed by the commentary the skill would draft from it.
- Make sure example commentary aligns tightly to the exhibit values, captions, and labels.
- Treat examples as gold-standard wording: they should model the sentence structure, density, quantification, and detail level the downstream model is expected to reproduce.
- Rewrite examples if the surrounding guidance changes materially, so the examples teach the same pattern as the instruction sections below `Typical content areas`.
- Where the section explains balances tied to financing or purchase price, use examples that include the practical detail a reader would actually want, such as facility type, lease type, acquisition obligation, or settlement mechanics, while still staying concise.
- Where the section has a highly specific sentence pattern, make the examples mirror that pattern exactly so the model can reproduce it reliably.
- Use anonymized example facts rather than reusing confidential source facts.
- For flexible references, include examples for both the default use case and at least one alternate topic-specific use case so the model learns how the section should flex.

## Language and formatting

- Standardize date, fiscal-year, and monetary formatting rules wherever the section benefits from them.
- Make those formatting rules explicit in the reference if the corpus shows a consistent convention.
- Use examples that reinforce the required formatting style, not examples that quietly violate it.
- Prefer plain-English labels and natural report-writing sentences over process-language or instructional phrasing inside examples.

## Manual review prompt

When reviewing the next reference file, check:

- Does the structure reflect the real corpus pattern?
- Are the section labels plain-English and easy to follow?
- Is detailed guidance kept in one place instead of repeated across sections?
- Does the density guidance help the drafting model match the examples?
- Are missing-data cases handled with placeholders rather than vague filler?
- Are examples and verification guidance short, practical, and easy to scan?
- Does the file remain standalone once shipped, without relying on the corpus or surrounding process context?
- If the section is caption-driven, does the guidance clearly teach how to quantify the caption and add the terms or mechanics needed to interpret it?
