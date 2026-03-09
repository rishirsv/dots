# Global writing conventions

This file defines writing rules that apply to every FDD section contract. Section references should inherit these rules by default and restate them only when a section requires an explicit override.

## Objective

All section drafts should read like client-ready Big 4 diligence writing: precise, decision-useful, time-anchored, explicit about basis and uncertainty, and free of renderer-era or extraction-era artifacts.

## Core conventions

1. **Lead with what matters:** Start with the conclusion, position, or fact pattern that explains why the section matters before expanding into support.
2. **Define basis before interpretation:** State the period, unit, perimeter, metric basis, or reporting basis before drawing conclusions from the numbers.
3. **Keep facts and interpretation separable:** Facts, management representations, estimates, and analytical conclusions should be distinguishable on first read.
4. **Anchor claims in time and quantity:** Numeric statements should be tied to a date, period, or clearly defined range.
5. **Use uncertainty precisely, not defensively:** Label what is management-provided, estimated, unaudited, pending, or unverified without collapsing into generic disclaimer language.
6. **Prefer block-level sourcing over sentence-level sourcing:** Use one compact source note for a block or exhibit when needed rather than cluttering every sentence.
7. **Write for analytical usefulness, not layout symmetry:** Structure should follow the logic of the section, not a slide skeleton or fixed visual template.

## Drafting rules

### Guidance design pattern

When writing section-level guidance, do not rely on a flat list of style bullets alone. GPT-5.4 performs better when the instruction contract is modular and explicit.

Preferred guidance layers:

- `objective`
  - what the section is trying to achieve
- `output contract`
  - which blocks are required, in what order, and what should not appear
- `writing controls`
  - tone, channel, formatting, and length constraints for the artifact being drafted
- `grounding rules`
  - what evidence the draft may rely on and how uncertainty should be expressed
- `follow-through rule`
  - when to proceed directly versus when to narrow, defer, or use placeholders

Section contracts do not need to use these exact labels every time, but they should encode these jobs clearly and separately.

### Tone and posture

- Write in an executive, factual, decision-useful tone.
- Use active voice by default.
- Keep wording skeptical, neutral, and precise.
- Strip out promotional language, marketing phrasing, and management-presentation tone.
- Avoid casual intensifiers, emotional language, and rhetorical filler.

### Time, units, and metric discipline

- Anchor figures to explicit dates or periods such as `FY2024`, `TTM December 2024`, or `as of March 31, 2025`.
- Keep units consistent within a block or exhibit such as `$m`, `$k`, `%`, `days`, or `sites`.
- Define non-obvious starting metrics before using them, especially when a section could start from EBITDA, EBIT, EBT, net income, reported NWC, or net debt.
- If periods or units change within a section, make the transition explicit.

### Claim structure

Default sentence logic should be:

- fact -> basis/evidence -> implication

Use this more compactly in bullets when needed:

- subject + verb + metric/time anchor

Dense sections may use:

- headline conclusion
- basis or support
- implication or treatment

### Output-contract discipline

Follow the GPT-5.4 pattern of making the output contract explicit.

Preferred contract style:

- return exactly the blocks requested, in the requested order
- do not invent extra sections because they feel stylistically balanced
- apply length limits to the intended block, not to the whole response by accident
- if the section requires prose, say so explicitly and ban bullets or markdown only when that is truly desired

Example contract pattern:

```text
<output_contract>
- Return exactly the required section blocks, in the required order.
- Do not add extra headings such as Open items, Appendix, or Recommendations unless the section contract explicitly calls for them.
- If a block is conditional and the trigger is not met, omit it rather than inserting filler.
</output_contract>
```

### Attribution and uncertainty

Use one attribution frame consistently within a sentence or bullet.

Preferred attribution hierarchy:

- `Management represented ...` for management-provided claims
- `We estimated ...` for modelled or analyst-built estimates
- `We have not independently verified ...` when support is limited
- no attribution when the statement is directly supported and not in dispute

Do not mix attribution styles casually such as `Management represented` and `we understand` in the same point unless they truly refer to different evidence levels.

### Writing-controls pattern

GPT-5.4 guidance is stronger when personality and per-response writing controls are separated. For `fdd-reports`, persistent personality is already handled by the overall skill and repo style, so section contracts should focus on per-response writing controls.

High-leverage writing controls:

- channel or artifact type
- emotional or professional register
- formatting requirements
- hard length limits when useful

Example writing-controls pattern:

```text
<writing_controls>
- Channel: professional diligence memo
- Register: direct, calm, precise; not dramatic or promotional
- Formatting: use bullets unless the section contract explicitly calls for prose
- Length: keep each bullet to one analytical job; split overloaded bullets
</writing_controls>
```

### Memo-mode pattern

For executive-facing or analytical writing, general style guidance is often not enough. Add memo-like controls that push specificity, synthesis, and calibrated certainty.

Preferred memo-mode pattern:

```text
<memo_mode>
- Write in a polished, professional memo style.
- Use exact names, dates, entities, and authorities when supported by the record.
- Follow the domain-specific structure requested by the section contract.
- Prefer precise conclusions over generic hedging.
- When uncertainty is real, tie it to the exact missing fact or conflicting source.
- Synthesize across sources rather than summarizing each one independently.
</memo_mode>
```

### Evidence and source-note policy

- Do not add a source line to every sentence.
- Use a compact `Source note:` only when the claim is non-obvious, numerically dense, sensitive, or assumption-driven.
- Prefer one source note per block, table, or grouped set of bullets.
- When support is incomplete, state the limitation in the narrative rather than pretending the support exists.

Preferred pattern:

- `Source note: Management adjustment schedule, trial balances, payroll support, and vendor invoices.`

### Grounding and citation rules

When a section requires source discipline, make the evidence boundary explicit instead of relying on implied caution.

Preferred grounding pattern:

```text
<grounding_rules>
- Base claims only on provided context, approved source material, or retrieved evidence from the current workflow.
- If sources conflict, state the conflict explicitly and attribute each side.
- If the context is insufficient, narrow the conclusion or state that the claim cannot be supported.
- If a statement is an inference rather than a directly supported fact, label it as an inference.
</grounding_rules>
```

If citations are required by the host artifact, lock both the source boundary and the format requirement explicitly.

### Placeholder policy

When source data is missing, use inline placeholders in square brackets.

Do:

- use placeholders inline
- keep the sentence or exhibit structurally complete
- preserve confidentiality and drafting flow

Do not:

- create `Open items`, `Data requests`, or tracking sections inside the section draft
- replace a needed conclusion with a vague statement simply because one figure is missing

Allowed placeholder patterns:

- `$[x]`
- `[x]%`
- `[Date]`
- `[FY20XX]`
- `[Period]`
- `[Customer name]`
- `[basis]`
- `[support]`

Examples:

- `Revenue increased by $[x] in [FY20XX], primarily due to [driver].`
- `As of [Date], the Company operated [x] sites across [regions].`
- `The adjustment decreases EBITDA by $[x], based on [support].`

## Language controls

### Avoid

- assurance terms such as `ensure`, `accurate`, `fair`, `reasonable`, `appropriate`
- vague magnitude terms such as `significant`, `substantial`, `material` without a number or threshold
- process language such as `we analyzed`, `we reviewed`, `we performed` unless the process itself matters
- opinion language such as `we believe`, `appears to`, `seems to`
- unsupported implication words such as `therefore`, `as a result`, `consequently`
- generic promotional or strategic phrasing

### Prefer

- concrete subject + verb + time/metric anchor
- `represents`, `reflects`, `removes`, `adds back`, `reclassifies`, `normalizes`, `includes`, `excludes`
- explicit recurrence language when relevant
- one concise limitation statement instead of repeated disclaimer language

## Structure and verbosity

### Default length bands

- `concise`: 160-260 words
- `standard`: 260-420 words
- `deep`: 420-700 words

Sections may override these ranges when the analytical job requires it.

### Density rules

- Prefer 4-8 bullets per block unless the section-specific contract says otherwise.
- Keep one core analytical job per bullet.
- Sentence length will usually fall in the 12-28 word range, but longer sentences are acceptable when dense evidence needs one coherent explanation.
- Split paragraphs that exceed 4 sentences.
- Split bullets that exceed roughly 55 words or try to do more than one analytical job.

GPT-5.4-style verbosity controls that map well here:

- prefer concise, information-dense writing
- avoid repeating the user’s request
- keep intermediary or progress-style lines brief
- do not shorten so aggressively that evidence, limitations, or completion checks disappear

### Exhibit and narrative relationship

- Put the math in exhibits or tables when the section is numerically anchored.
- Use the narrative to explain treatment, logic, basis, and implications.
- Do not hide bridge logic or adjustment math inside long prose when an exhibit is the cleaner analytical anchor.

## Corpus cleanup rules

Do not allow these artifacts to survive into a section contract or example:

- `Not present in source report`
- `following pages`
- `adjacent table`
- repeated standalone headings such as `Overview` or `Other considerations`
- malformed placeholder tokens
- extraction-corrupted text
- renderer, slot, or `deckSpec` language

If a corpus phrase is useful but layout-dependent, convert it into clean markdown-native wording such as:

- `discussed below`
- `shown in the bridge below`
- `captured in the exhibit`

## Limitation and missing-information handling

- Put material limitations in the most relevant block, usually near the affected analysis.
- Use one concise basis or limitation note rather than scattering defensive language throughout the section.
- If a missing input prevents quantification, use a placeholder or explicitly keep the item outside the relevant conclusion.
- If a section has a required closing status block, use it to state residual uncertainty rather than creating a separate tracker.

### Default follow-through rule

Section contracts should usually encode the same default follow-through posture that GPT-5.4 guidance recommends:

- if the drafting intent is clear and the next step is low-risk, proceed
- ask only when a missing choice would materially change the outcome
- when proceeding with placeholders or narrowed scope, say so cleanly inside the draft rather than creating a separate tracker block

## Global verification checklist

Before finalizing any section:

1. Required blocks exist and are in the correct order.
2. Periods, dates, and units are internally consistent.
3. Numeric statements are anchored to a period or date.
4. Attribution is clear where evidence level matters.
5. Missing data is handled with inline placeholders or explicit limitation language, not open-item sections.
6. Source notes appear only where needed and at the right level of density.
7. No renderer-era, extraction-era, or corpus-artifact language remains.
8. Bullets and paragraphs are scannable and not overloaded.
9. Tone and language controls pass.

## Delivery status

Use one of these status labels when a workflow requires an explicit drafting status:

- `pass`
- `pass_with_placeholders`
- `blocked`
