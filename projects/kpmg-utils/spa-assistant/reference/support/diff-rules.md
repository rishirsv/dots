# Two-Document Diff Rules (Strict Text Diff)

## Principle

- Perform a **strict textual comparison** of Version A vs Version B.
- **No semantic normalization**: do not “interpret” intent; report what changed and classify by change type.

## Change-type taxonomy (required)

1. **Scope expanded / narrowed**

- What it is: definition becomes broader or narrower via added/removed catch-all phrases or category lists.
- Patterns: “including” list expanded; “excluding” list expanded; “in any event” catch-alls; “any and all”.

2. **Inclusion/exclusion add/remove**

- What it is: a specific inclusion or exclusion is inserted or deleted.
- Patterns: “shall include …”; “shall not include …”; “excluding …”; “to the extent …”.

3. **Anti-dup add/remove**

- What it is: “without duplication” / overlap-routing language added or removed.
- Patterns: “without duplication”; “without double counting”; “to the extent included”.

4. **Accounting hierarchy change**

- What it is: priority order between GAAP/IFRS, past practice, templates, and agreement changes.
- Patterns: “order of priority”; “in the event of conflict”; “consistent with past practice”; “GAAP”.

5. **Timing / cut-off change**

- What it is: measurement time changes or becomes inconsistent.
- Patterns: “Reference Time”, “Calculation Time”, “Closing Time”, “as of”, “11:59 p.m.”.

6. **Process window change**

- What it is: delivery/objection/dispute deadlines change; expert mandate changes.
- Patterns: “within [__] days”; “Dispute Notice”; “Independent Accountant”; “final and binding”.

7. **Recourse / escrow change**

- What it is: escrow amount, purpose, release mechanics, retention, or sole recourse language changes.
- Patterns: “Escrow Amount”; “Adjustment Escrow”; “Retention Escrow”; “sole recourse”; release instructions.

## Detection patterns (keywords)

Use keyword scans to locate diff hotspots:

- **Definitions drift**: “include”, “excluding”, “for greater certainty”, “in any event”, “any and all”
- **Overlap controls**: “without duplication”, “to the extent included”, “double counting”
- **Accounting**: “GAAP”, “IFRS”, “past practice”, “priority”, “conflict”
- **Timing**: “as of”, “Reference Time”, “Closing Time”, “Effective Time”, timestamps
- **Process**: “within”, “Business Days”, “Dispute Notice”, “Independent Accountant”, “final and binding”
- **Recourse**: “Escrow”, “holdback”, “reserve”, “retention”, “set-off/offset”

## Plain-English impact rationale templates (use these)

- Scope expanded: “This captures more items, so the adjustment is more likely to move against the paying party.”
- Scope narrowed: “This captures fewer items, so the adjustment is less likely to move against the paying party.”
- Inclusion added: “This item is now counted; economics may shift by the value of this item.”
- Exclusion added: “This item is now carved out; economics may shift by removing it from the calculation.”
- Anti-dup removed: “Overlap is now less controlled; double counting risk increases.”
- Timing changed: “The measurement point moved; timing items (cash movements, accruals) may shift the result.”
- Process window shortened: “Less time to review; higher risk of missed objections and forced acceptance.”
- Escrow/recourse changed: “Security or recovery path changed; leverage and collectability shift.”

## Output formats

### Delta Summary (ranked)

- 5–12 bullets, ranked by likely economic materiality.
- Each bullet: **Category → Change type → one-line description → likely impact**.

### Delta Register (grouped)

Group by **(1) Category** then **(2) Change type**.

Recommended Delta Register columns:
| DELTA-ID | Category | Change type | vA clause ref | vB clause ref | Before (10–25w) | After (10–25w) | Plain-English impact | Counsel question | Rebuttal/fallback |

Notes:

- Use **short, verbatim excerpts** (10–25 words) for Before/After.
- Do not infer beyond what changed; keep to text + direct impact implication.
