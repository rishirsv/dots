# Test-Run-4 Evaluation (Jan 7, 2026) — Meeting Notes Quality Regression

## Executive Assessment

**Formatting improvements are working well:** Tables for Key Findings and Key Takeaways are clean and scannable. The Adjustments Memo structure is much improved.

**Critical regression in Meeting Notes quality:** Despite patches for dialogue narration (Pattern 22), the Meeting Notes sections show significant quality problems:
1. Sentence fragments and useless transitional bullets
2. Persistent Q&A reconstruction ("ask when... response was...")
3. Excessive quotations without synthesis
4. Empty columns with "Not specified" throughout

**Root cause analysis:** The model is **following template structure over instructions**. When examples show columns, the model fills them even if instructions say to omit. The "omit non-substantive" rule is too narrow.

---

## Critical Failures Identified

### Failure Pattern 31: Useless Transition Bullets

**What it looks like:**
Meeting Notes sections contain subsections labeled "Transition" with only a sentence fragment quoting the speaker moving between topics. These provide zero analytical value and are dangerous without context.

**Evidence (ChatGPT-Meeting Notes FDD Review.md):**
```markdown
**Transition**
*   "That's it for Jameson… on to Four Seasons."

**Transition**
*   "On to Briggs Freeman."

**Transition**
*   "Got it on to Pacific time."
```

**Why this is problematic:**
- 6-word bullets violate the principle of "complete unit of information"
- Transition markers are metadata about the conversation flow, not substantive content
- Including them clutters the notes and adds no value

**Prompt driver:**
The "Omit non-substantive content" rule (Rule 6) covers "meeting logistics" and "small talk" but does NOT explicitly cover transitional markers between topics.

**Required patch (dist/meeting-intelligence.md, Rule 6):**

BEFORE:
```markdown
6. **Omit non-substantive content**
   - Meeting logistics (joining issues, audio problems, calendar confusion) should be omitted entirely.
   - Small talk, greetings, and off-topic asides should be omitted.
   - "Material" means relevant to business, financial, or diligence substance.
```

AFTER:
```markdown
6. **Omit non-substantive content**
   - Meeting logistics (joining issues, audio problems, calendar confusion) should be omitted entirely.
   - Small talk, greetings, and off-topic asides should be omitted.
   - **Transitional statements** ("moving on to...", "that's it for...", "let's go to...") should be omitted.
   - **Minimum bullet quality**: Every Meeting Notes bullet must be a complete, informative sentence. Sentence fragments, single phrases, or stubs like "On to Briggs Freeman" are not acceptable.
   - "Material" means relevant to business, financial, or diligence substance.
```

---

### Failure Pattern 32: Persistent Q&A Dialogue Reconstruction

**What it looks like:**
Despite the Pattern 22 patch ("Never use dialogue narration like 'CFO noted...'"), Meeting Notes still reconstruct Q&A flow instead of stating outcomes.

**Evidence (from user-provided examples):**

| BAD (current output) | GOOD (outcome-first) |
|----------------------|----------------------|
| "Health insurance, ask when a switch occurred, response was not sure, and suggested looking into the monthly detail to find the change point." | "Health insurance switch timing is unclear. To identify the change point, review monthly detail." |
| "E&O discussion, E&O, 'decline in E&O was discussed, the amount is not accrued'." | "E&O expense declined; the amount is not accrued." |
| "Bonuses… what drives them? Response: selling the units." | "Bonuses are driven by unit sales volume." |
| "A question was raised about the cash impact and whether the expenses were all paid in December 24. The response was not received during the meeting." | "Cash impact and December payment timing remain unconfirmed (open item)." |

**Why this is problematic:**
- Reader must mentally parse Q&A flow to extract the takeaway
- Wastes space with process ("ask...", "response was...", "discussed")
- Missing the actual conclusion or next step

**Prompt driver:**
Current rule (line 103): `**Never use dialogue narration** like "CFO noted...". State the fact directly.`

This rule prohibits speaker attribution but doesn't explicitly prohibit **process narration** ("asked about...", "response was...", "discussed...").

**Required patch (dist/meeting-intelligence.md, Rule 4):**

BEFORE:
```markdown
4. **Structure and topic organization**

   - Write conclusion‑first bullets (no dialogue reconstruction): lead with the answer/fact, then add brief context.
   - **Never use dialogue narration** like "CFO noted...". State the fact directly. Exception: verbatim quotes in Adjustments Memo evidence.
   - Use headings and bullets with at most **two** bullet levels; if you need more depth, create a new sub‑heading instead of deeper nesting.
   - Order sections and topics to follow their order of appearance in the transcript, unless the selected template clearly calls for a different grouping.
```

AFTER:
```markdown
4. **Structure and topic organization**

   - Write conclusion‑first bullets: lead with the outcome or fact, then add brief context.
   - **Never reconstruct dialogue flow.** Prohibited patterns:
     - ❌ "When asked about X, the response was Y" → ✓ "Y."
     - ❌ "X was discussed; they said Y" → ✓ "Y."
     - ❌ "Question raised about X; no answer received" → ✓ "X remains unconfirmed (open item)."
   - **No speaker attribution in Meeting Notes** ("CFO noted...", "Bram said..."). State facts directly.
   - Exception: verbatim quotes are allowed in Adjustments Memo evidence sections (indented).
   - Use headings and bullets with at most **two** bullet levels; if you need more depth, create a new sub‑heading instead of deeper nesting.
   - Order sections and topics to follow their order of appearance in the transcript, unless the selected template clearly calls for a different grouping.
```

---

### Failure Pattern 33: Empty Columns with "Not specified" (FDD-Specific)

**What it looks like:**
Tables contain columns filled entirely with "Not specified", "Not stated", or "Owner not specified" — adding visual noise without value.

**Evidence (ChatGPT-Meeting Notes FDD Review.md, Attendees):**
```markdown
| Name | Role | Affiliation |
| --- | --- | --- |
| Bram Maxwell | Not specified | Not specified |
| Corey Persiko, CPA, CA | Not specified | Not specified |
| Ethan Ing | Not specified | Not specified |
```

**Evidence (ChatGPT-Meeting Notes Summary (6).md, Open Items):**
```markdown
| Priority | Item | Owner |
| --- | --- | --- |
| **[H]** | Provide Pacific support... | Owner not specified |
| **[H]** | Send the lease termination... | Owner not specified |
```

**Why this is problematic:**
- Visual clutter with no information value
- Model follows visible template structure over written instructions
- FDD transcripts rarely specify owners for open items (diligence context)

**Design decision:**
For **FDD templates specifically**, omit columns that are unlikely to be populated from the transcript:
- **Open Items**: Omit Owner column entirely (FDD calls rarely assign specific owners)
- **Attendees**: If roles/affiliations are unknown for ALL, use a bullet list instead of table

For **General Business templates**, keep Owner column (action items in operational meetings more often have assigned owners).

**Required patch (dist/fdd-meeting-template.md):**

**Attendees section — BEFORE:**
```markdown
## Attendees & Roles

| Name | Role | Affiliation |
|------|------|-------------|
| <Name> | <Title> | Target / Sponsor / Advisor |
```

**Attendees section — AFTER:**
```markdown
## Attendees & Roles

If roles/affiliations are known, use a table:
| Name | Role | Affiliation |
|------|------|-------------|
| <Name> | <Title> | Target / Sponsor / Advisor |

If roles/affiliations are unknown for all attendees, use a simple list:
- <Name>
- <Name>
```

**Open Items section — BEFORE:**
```markdown
## Open Items & Follow‑Ups

| Priority | Item | Owner |
|----------|------|-------|
| **[H]** | <Description> | <Name> |
```

**Open Items section — AFTER:**
```markdown
## Open Items & Follow‑Ups

| Priority | Item |
|----------|------|
| **[H]** | <Description> |
| **[M]** | <Description> |
| **[L]** | <Description> |
```

(Owner column removed for FDD template; retained in general-business-template.md)

---

### Failure Pattern 34: "Not specified" for Inferable Fields

**What it looks like:**
Fields like "Industry" show "Not specified" or "Not explicitly stated" when the industry IS clearly identifiable from the transcript content.

**Evidence (ChatGPT-Meeting Notes FDD Review.md):**
```markdown
* Industry: Not explicitly stated
```

But the transcript clearly discusses real estate brokerage, commission splits, title JVs, mortgage attach rates — the industry is obviously **Real Estate Brokerage**.

**Why this is problematic:**
- Overly literal interpretation of "zero inference"
- Industry identification from business context is not "inference" — it's reading comprehension
- Creates an obviously incomplete output

**Required patch:**
```markdown
## Non-negotiables
- No invented numbers, claims, or unstated assumptions.
- **Industry, meeting purpose, and participant affiliations may be reasonably identified from context** (e.g., if the transcript discusses commission splits and title policies, the industry is real estate). This is comprehension, not inference.
```

---

### Failure Pattern 35: Excessive Quotations Without Synthesis

**What it looks like:**
Meeting Notes contain many direct quotations strung together without synthesis or takeaway. The reader gets transcript fragments, not analyzed notes.

**Evidence (ChatGPT-Meeting Notes Summary (6).md, Pacific section):**
```markdown
*   "there's noise in Pacific." — Corey Persiko
*   "there was the Villa team that was brought on and it was a payment." — Corey Persiko
*   "Over a three-year period and we amortized… the 41K a month I think…" — Corey Persiko
*   "December 2024, we would have recorded the full 12 months expense…" — Corey Persiko
```

**Why this is problematic:**
- Quotes without context are just transcript reconstruction
- Reader must synthesize the meaning themselves
- Violates "conclusion-first" principle

**Required patch:**
```markdown
## Writing Style
- **Quotes in Meeting Notes should be rare and purposeful.** Use quotes only when:
  - The exact wording matters (policy statement, commitment, uncertainty marker)
  - Paraphrasing would lose critical nuance
- **Never string multiple quotes together.** Synthesize into a conclusion, then add one supporting quote if needed.
```

---

## Quality Comparison: Test-Run-4 Results

| File | Tables/Structure | Key Takeaways | Meeting Notes | Open Items | Overall |
|------|------------------|---------------|---------------|------------|---------|
| Summary (5) | ✓ Good | ✓ Good | ⚠️ Some Q&A patterns | ⚠️ Owner column | 3.5/5 |
| Summary (6) | ✓ Good | ✓ Good | ❌ Transitions, Q&A | ⚠️ Owner column | 3.0/5 |
| Summary (7) | ✓ Good | ✓ Good | ⚠️ Some Q&A | ✓ Clean | 4.0/5 |
| FDD Review | ✓ Good | ✓ Good | ❌ Transitions, Q&A | ⚠️ Owner column | 2.5/5 |
| FDD Lebron (2) | ✓ Good | ✓ Good | ⚠️ Moderate | ✓ Clean | 4.0/5 |

**Pattern:** Formatting/structure improvements are working. Meeting Notes quality is the critical regression.

---

## Root Cause Analysis: Why Did This Regression Happen?

### Cause 1: Example-Following Behavior

The model follows **visible template structure** over **written instructions**. When the template shows a table with Owner column, the model fills it even if instructions say "omit if all unknown."

**Fix:** Remove example structures that show unwanted patterns. Use conditional examples:
```markdown
# If owners are known:
| Priority | Item | Owner |

# If all owners unknown (more common):
| Priority | Item |
```

### Cause 2: "Omit Non-Substantive" Too Narrow

Rule 6 covers "logistics" and "small talk" but doesn't cover:
- Transitional statements
- Process narration ("asked about...", "discussed...")
- Sentence fragments

**Fix:** Expand Rule 6 with explicit prohibited patterns and minimum quality standards.

### Cause 3: "Zero Inference" Misinterpreted

The "zero inference" rule is being applied to **industry identification**, which is reading comprehension, not inference.

**Fix:** Clarify that identifying industry from business context is expected.

### Cause 4: Quotes Overused

The instruction to "preserve exact quotes for critical statements" is being applied too broadly. Quotes are appearing in Meeting Notes when paraphrased synthesis would be better.

**Fix:** Restrict quotes in Meeting Notes; encourage synthesis.

---

## Summary of Required Patches

| Pattern | File | Change | Priority |
|---------|------|--------|----------|
| 31 | dist/meeting-intelligence.md | Rule 6: Add transitional statements to "omit" list; add minimum bullet quality standard | **P0** |
| 32 | dist/meeting-intelligence.md | Rule 4: Expand to prohibit Q&A reconstruction with explicit bad→good examples | **P0** |
| 33 | dist/fdd-meeting-template.md | Remove Owner column from Open Items; conditional Attendees format | **P1** |
| 33 | dist/fdd-adjustments.md | Remove Owner column from Open Items | **P1** |
| 34 | dist/meeting-intelligence.md | Clarify that industry identification from context is expected | **P2** |
| 35 | dist/meeting-intelligence.md | Restrict quote usage in Meeting Notes | **P2** |

---

## Recommended Next Steps

1. **Review patches** in this document (Patterns 31, 32, 33)
2. **Apply P0 patches** (Patterns 31, 32) to dist/meeting-intelligence.md
3. **Apply P1 patches** (Pattern 33) to dist/fdd-meeting-template.md and dist/fdd-adjustments.md
4. **Re-run test cases** after patches to verify regression is fixed
5. **Consider P2 patches** (Patterns 34, 35) if issues persist

---

# Polishing Review (Jan 7, 2026)

## Character Count

**meeting-intelligence.md**: 8,519 characters (8,600 bytes)
**Target**: <8,000 characters
**Reduction needed**: ~520 characters

---

## Proposed Edits to Reduce Character Count (DO NOT APPLY YET)

The following edits would bring meeting-intelligence.md under 8,000 characters:

### Edit 1: Consolidate Step 4 template skeleton instruction (~350 char savings)

**Current (lines 60-63):**
```
- Read the entire template you chose before composing the notes. ALWAYS read the entire template before composing the notes. Before writing notes, create but do not output a 'Template Skeleton' with headings copied verbatim from the template file (no content yet). Then populate each section with the appropriate content. Do not write meeting notes until you have (1) identified meeting type, (2) extracted the template skeleton, and (3) created a topic outline in order."
```

**Proposed:**
```
- Read the full template first. Create a 'Template Skeleton' (headings only, no content), then populate each section.
```

### Edit 2: Consolidate FDD framework in Step 3 (~180 char savings)

**Current (lines 49-54):**
```
- If meeting type is **FDD**, interpret the content using an **FDD due‑diligence framework**:
    - **(a) Sustainability**: Recurring vs one‑time; whether EBITDA and WC levels appear representative of ongoing earning power.
    - **(b) Adjustment type**: If adjustment‑worthy, classify using the FDD template definitions (Normalize, Reclassify, Pro forma, Error).
    - **(c) Adjustment category**: Map items to QoE (EBITDA), Working Capital (NWC peg), or Net Debt.
    - **(d) Accounting treatment**: Note any unusual policies, estimates, or non‑GAAP presentation.
    - **(e) Controls & process risk**: Highlight weak systems, manual processes, key‑person dependencies, or audit findings.
```

**Proposed:**
```
- If **FDD**: apply due-diligence lens — sustainability (recurring vs one-time), adjustment classification (Normalize/Reclass/PF/Error → QoE/NWC/ND), unusual accounting, and controls risk.
```

### Edit 3: Remove redundancy in Rule 2 (~80 char savings)

**Current (lines 94-95):**
```
   - Only stop after full notes (using the selected template) **and** the validation checklist are satisfied.
   - Do not stop after reading only part of the transcript or after completing only some sections.
```

**Proposed:**
```
   - Only stop after completing full notes **and** validation checklist.
```

### Edit 4: Shorten Rule 5 (~50 char savings)

**Current (lines 107-109):**
```
5. **Enrich with 💡 Insights**

   Add 1-2 `**💡 Insights:**` per major topic: industry benchmarks, common patterns, framework explanations, or red flags. Never invent company-specific facts. Omit if no insight adds value.
```

**Proposed:**
```
5. **💡 Insights**: Add 1-2 per major topic (benchmarks, patterns, red flags). Never invent company facts. Omit if none add value.
```

### Edit 5: Remove trailing whitespace (line 125)

**Total estimated savings**: ~660 characters → brings file to ~7,859 characters

---

## Inconsistencies Between Files

### I1: "EBITDA Adjustments" vs "Quality of Earnings Adjustments"

| File | Section Header |
|------|----------------|
| fdd-adjustments.md (Template) | `## EBITDA Adjustments (Diligence)` |
| fdd-adjustments.md (Example) | `## Quality of Earnings Adjustments (Diligence)` |

**Issue**: Template and example use different terminology.
**Fix**: Align both to "Quality of Earnings Adjustments" (matches QoE ref numbering).

### I2: Insights bullet count mismatch

| File | Instruction |
|------|-------------|
| meeting-intelligence.md | "Add 1-2 💡 Insights per major topic" |
| fdd-meeting-template.md | "Add 2-4 bullets of enrichment" |

**Issue**: 1-2 vs 2-4 bullets.
**Fix**: Align to "1-3 bullets" in both files.

### I3: Pro forma ref numbering inconsistency

| File | Pro Forma Ref |
|------|---------------|
| fdd-meeting-template.md (Potential Adjustments table) | `PF1` |
| fdd-adjustments.md (Ref Numbering section) | All EBITDA use `QoE1, QoE2...` (diligence or pro forma) |
| fdd-adjustments.md (Example) | Pro forma uses `QoE5` |

**Issue**: Should pro forma adjustments use `PF1` or `QoE5`?
**Fix**: Decide on one convention. Recommend: Use `QoE` for all EBITDA (simpler), update template table to show `QoE` not `PF`.

### I4: Open Items table not specified in main instructions

| File | Open Items Format |
|------|-------------------|
| meeting-intelligence.md | No specific format mentioned |
| fdd-meeting-template.md | Table with Priority/Item/Owner |
| fdd-adjustments.md | Table with Priority/Item/Owner |

**Issue**: Main instructions don't specify table format.
**Fix**: Add brief mention in meeting-intelligence.md or rely on template (current approach).

---

## Formatting Improvements

### F1: Consistent horizontal rule usage

- fdd-meeting-template.md uses `---` between major sections
- fdd-adjustments.md uses `---` between each adjustment
- Consistent ✓

### F2: Placeholder syntax

- All templates now use `<X>` syntax ✓
- No remaining `[X]` placeholders found ✓

### F3: Table alignment

- All tables use proper markdown alignment
- Headers are consistent ✓

### F4: Trailing whitespace

- meeting-intelligence.md line 125 has trailing whitespace/blank line
- Should be removed

### F5: Code fence inconsistency in fdd-adjustments.md

- Template section is wrapped in ` ```markdown ` code fence
- Example Output section says "NOT in a code block" but Guidance section examples ARE in code fences
- This is intentional (template = reference, example = rendered output) ✓

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Character reduction edits | 5 | P0 (blocking) |
| Terminology inconsistencies | 3 | P1 |
| Format inconsistencies | 1 | P2 |
| Trailing whitespace | 1 | P2 |

**Next steps:**
1. Apply character reduction edits to meeting-intelligence.md
2. Align "Quality of Earnings" terminology in fdd-adjustments.md template
3. Align Insights bullet count (1-3) across files
4. Decide PF vs QoE for pro forma refs

---

# Failure Pattern Analysis (5-Sample Evaluation — Jan 2026)

This section documents specific failure patterns observed from evaluating 5 meeting samples from the current production distribution against the evaluation rubric.

---

# Test-Run-3 Evaluation Findings (Jan 7, 2026) — Large Transcript Regressions

The following patterns were identified from evaluating 8 test runs using difficult test cases (>100k tokens each). Several regressions were observed related to long transcript handling and output completeness.

---

## Failure Pattern 17: Adjustments Memo Truncation / "Thinking Aloud"

**What it looks like:**
After the meeting notes are completed and the `📝 Generate Draft Adjustments Memo?` prompt appears, the model begins to generate the memo but outputs internal reasoning/thinking text instead of completing the memo. The output ends with fragments like "Reading full template for draft", "Answer now", or "I need to go through the entire template to make sure I have all the sections needed for".

**Evidence:**
- ChatGPT-Meeting Notes Summary (4).md (Project Iconic 2.0 — Management Adjustments), lines 322-328:
  ```markdown
  📝 Generate Draft Adjustments Memo?

  ## Response:
  Reading full template for draft

  Answer now

  I need to go through the entire template to make sure I have all the sections needed for
  ```
- Thinking time was 10m 16s — model struggled significantly with the long transcript
- NO Adjustments Memo was actually generated despite the prompt appearing

**Prompt driver:**
This appears to be a **platform/context limitation** rather than a prompt issue. When the transcript is extremely long (>100k tokens), the model may run out of context or processing capacity when attempting to generate the second major output (the memo) after an already lengthy notes output.

**Causal mechanism:**
The model successfully generates meeting notes but exhausts its capacity when attempting to also generate the Adjustments Memo. Instead of gracefully stopping, it outputs internal reasoning/planning text that should remain hidden.

**Mitigation (not a prompt fix — platform limitation):**
1. **User guidance:** For very long transcripts (>90 minutes / >20k words), advise users to:
   - Generate meeting notes first, then ask for the memo in a follow-up message
   - Consider splitting extremely long meetings into separate transcript files
2. **Prompt modification (dist/meeting-intelligence.md, add to Step 5 Validate):**
   ```markdown
   - If context or output limits are approached, complete the meeting notes fully and end with the Adjustments Memo prompt. Do NOT attempt to generate both in one response if struggling with length.
   ```

**Regression tests:**
- RT-20: Long transcript (>15k words). Pass: Either (a) complete notes + complete memo, OR (b) complete notes with memo prompt and no internal reasoning text exposed. Fail: Memo generation starts but outputs thinking/planning text.

---

## Failure Pattern 18: Incomplete Notes Due to Transcript Parsing Failure

**What it looks like:**
Meeting notes explicitly acknowledge that content from later portions of the transcript could not be captured. The model outputs statements like "I was not able to extract the detailed discussion content for these sections in this environment (tooling failure while parsing the full transcript)" and leaves sections incomplete.

**Evidence:**
- ChatGPT-Meeting Notes Creation (1).md (Project Iconic 2.0 — IS Trending), lines 101-111:
  ```markdown
  ### Key Takeaways

  *   The transcript appears to include additional entity-by-entity IS trending review for:
      *   **Jameson / Two Four Seasons**
      *   **Briggs**
      *   **Premiere**
  *   I was not able to extract the detailed discussion content for these sections in this environment (tooling failure while parsing the full transcript), so the notes below are limited to what is explicitly captured above.

  ### Meeting Notes

  *   The meeting proceeded beyond Madison into other operating entities with similar trending/variance Q&A, but detailed line items, figures, and explanations could not be reliably pulled from the remainder of the transcript here.
  ```
- This violates the "Completeness over brevity" rule — notes should never omit material transcript content

**Prompt driver (dist/meeting-intelligence.md, Rule 2):**
```markdown
2. **Completeness over brevity**
   - Capture all **material** figures, drivers, policies, risks, and follow‑ups, even if they feel repetitive.
   - Do not stop after reading only part of the transcript or after completing only some sections.
```

**Causal mechanism:**
This is a **platform limitation** where ChatGPT's file reading capability fails partway through very large files. The model correctly acknowledges the limitation rather than inventing content, but the result is incomplete notes.

**Mitigation (user guidance, not prompt fix):**
Add to user documentation:
```markdown
## Large Transcripts (>90 minutes / >25k words)

If you receive notes that acknowledge incomplete coverage ("tooling failure," "unable to extract"), try:
1. Upload the transcript as a `.txt` file instead of copy-pasting
2. Split the transcript into two parts and generate notes separately
3. Ask "Please continue from where you left off" if output appears truncated
```

**Regression tests:**
- RT-21: Long transcript (>100k tokens). Pass: Notes cover all major topics from the transcript. Fail: Notes explicitly state inability to read/capture portions of the transcript.

---

## Failure Pattern 19: Spurious "Source transcript:" Line After Output

**What it looks like:**
After the meeting notes and/or Adjustments Memo are complete (including the `📝 Generate Draft Adjustments Memo?` prompt), an additional line appears citing the source transcript filename. This is unnecessary metadata that should not be in the output.

**Evidence:**
- ChatGPT-Meeting Notes Creation.md (Project Lebron — Finance Call), lines 458-459:
  ```markdown
  📝 Generate Draft Adjustments Memo?

  **Source transcript:** Project Lebron - Finance call.vtt
  ```
- ChatGPT-Meeting Notes Summary (3).md, lines 253-254:
  ```markdown
  📝 Generate Draft Adjustments Memo?

  Source transcript:
  ```

**Prompt driver:**
This is NOT driven by the prompt. It appears to be a ChatGPT behavior where the model attempts to add source attribution after completing a task, similar to the "Sources:" issue documented in Pattern 13.

**Causal mechanism:**
The model may be attempting to provide transparency about input sources, but this adds noise to the output and is redundant (the user already knows what transcript they uploaded).

**Minimal prompt patch (dist/meeting-intelligence.md, add to Step 5 Validate):**

Existing rule (Pattern 13):
```markdown
- Do NOT add "Sources:", "References:", or citation sections — all content comes from the transcript, not external sources.
```

Expand to:
```markdown
- Do NOT add "Sources:", "References:", "Source transcript:", or citation sections — all content comes from the transcript, not external sources. Do not cite the transcript filename in the output.
```

**Regression tests:**
- RT-22: Any FDD transcript. Pass: Output ends with `📝 Generate Draft Adjustments Memo?` and nothing after. Fail: Any "Source transcript:", "Sources:", or similar attribution appears after the memo prompt.

---

## Failure Pattern 20: Unnecessary Preamble Text Before Notes

**What it looks like:**
Before the meeting notes begin, the model outputs a preamble sentence explaining what it's about to do, such as "Here are FDD-style meeting notes grounded in the uploaded transcript: [filename]". This adds noise and delays the reader from reaching the actual content.

**Evidence:**
- ChatGPT-Meeting Notes Creation (2).md (Project Iconic 2.0 — Management Adjustments), lines 24-26:
  ```markdown
  Here are FDD-style meeting notes grounded in the uploaded transcript: Project Iconic 2.0 - Management adjustments.vtt

  FDD Meeting Notes — Project Iconic 2.0
  ======================================
  ```

**Prompt driver (dist/meeting-intelligence.md, Non-negotiables):**
```markdown
## Non-negotiables
- Read transcript completely; begin immediately without clarifying questions.
```

**Causal mechanism:**
The instruction says "begin immediately" but doesn't explicitly prohibit preamble commentary. The model may be adding this to signal to the user that it understood the request, but it violates the spirit of "begin immediately."

**Minimal prompt patch (dist/meeting-intelligence.md, add to Non-negotiables):**

Before:
```markdown
- Read transcript completely; begin immediately without clarifying questions.
```

After:
```markdown
- Read transcript completely; begin immediately without clarifying questions.
- Start output directly with the meeting title header — no preamble text like "Here are the notes" or "Based on the transcript."
```

**Regression tests:**
- RT-23: Any FDD transcript. Pass: Output begins directly with `# FDD Meeting Notes — [Project Name]` or `FDD Meeting Notes — [Project Name]` header. Fail: Any preamble sentence appears before the meeting title.

---

## Failure Pattern 21: Inconsistent Open Items Format (Notes vs Memo)

**What it looks like:**
The Open Items section format was inconsistent between main notes and Adjustments Memo, with overly verbose inline Ask prompts creating walls of text that are hard to scan.

**Evidence:**
- ChatGPT-Meeting Notes Creation (1).md, main notes Open Items (lines 144-152):
  ```markdown
  | Item | Owner |
  | --- | --- |
  | Confirm what specifically drives **transaction fee income** changes... | Owner not specified |
  | Clarify the FY24 **payroll compliance auditor** cost... | Owner not specified |
  ```

- Long bullet format with inline Ask prompts was difficult to scan

**Resolution:**
Per user feedback, the Ask column has been **removed** from both templates. Open Items now use a clean table format:

```markdown
| Priority | Item | Owner | Due |
|----------|------|-------|-----|
| **[H]** | [Description] | [Name] | [Date] |
| **[M]** | [Description] | [Name] | TBD |
```

Owner column is omitted entirely if all owners are unknown.

**Regression tests:**
- RT-24: Any FDD transcript with 3+ open items. Pass: Open Items uses clean table format without Ask column. Fail: Output includes inline Ask prompts or long prose bullet format.

---

## Quality Assessment: Test-Run-3 Results

| Eval File | Project | Notes Quality | Memo Quality | Issues |
|-----------|---------|---------------|--------------|--------|
| FDD Lebron (1) | Project Lebron | 4.5/5 | 4.5/5 | None significant — good output |
| FDD Call | Retail apparel | 4.5/5 | 4.3/5 | None significant — good output |
| Creation | Project Lebron | 4.3/5 | 4.3/5 | Pattern 19: Spurious "Source transcript:" line |
| Creation (1) | Iconic 2.0 IS | 3.0/5 | 4.0/5 | Pattern 18: Incomplete notes (parsing failure); Pattern 21: Inconsistent Open Items |
| Creation (2) | Iconic 2.0 Mgmt | 4.0/5 | 4.3/5 | Pattern 20: Preamble text; Pattern 21: Inconsistent Open Items |
| Summary (2) | Iconic 2.0 IS | 4.3/5 | 4.0/5 | Minor issues — Open Items format inconsistency |
| Summary (3) | Iconic 2.0 IS | 4.3/5 | 4.3/5 | Pattern 19: Spurious "Source transcript:" |
| Summary (4) | Iconic 2.0 Mgmt | 4.3/5 | 1.0/5 | **Pattern 17: Memo truncation (critical)** |

### Summary: Test-Run-3 Priorities

| Priority | Pattern | Root Cause | Fix Type |
|----------|---------|------------|----------|
| **P0** | Memo truncation / thinking aloud | Platform/context limits | User guidance + prompt mitigation |
| **P0** | Incomplete notes (parsing failure) | Platform file reading limits | User guidance |
| **P1** | Spurious "Source transcript:" line | Model behavior | Prompt patch |
| **P1** | Unnecessary preamble text | Unclear instruction | Prompt patch |
| **P2** | Inconsistent Open Items format | Template ambiguity | Template clarification |

### Key Finding: Long Transcript Handling

The most critical regressions in test-run-3 are related to **very long transcripts (>100k tokens)**:
1. The model can successfully generate meeting notes but may fail when attempting to also generate the Adjustments Memo in the same response
2. ChatGPT's file reading may fail partway through extremely large files
3. These are **platform limitations** that cannot be fully addressed via prompt changes

**Recommended user guidance:**
```markdown
## Long Meeting Transcripts (>90 minutes)

For best results with long transcripts:
1. Upload as a `.txt` file rather than pasting into chat
2. If the Adjustments Memo doesn't generate or appears incomplete, say "Please generate the Adjustments Memo now"
3. Consider splitting very long meetings (>2 hours) into two transcript files
4. If notes acknowledge incomplete coverage, ask "Please continue from where you left off"
```

---

## Additional Observations (Jan 7, 2026) — Format & Readability Issues

The following patterns were identified through manual review and are addressed via prompt/template patches.

---

### Pattern 22: Dialogue Reconstruction in Meeting Notes

**What it looks like:**
When processing .vtt files, the model reconstructs dialogue with narration like "Bram noted...", "Vivien said...", "When asked, CFO explained...". This creates a Q&A narrative style instead of conclusion-first bullets.

**Evidence:**
- Multiple outputs from .vtt files contain phrases like:
  - "Corey indicated he wouldn't be overly fussed..."
  - "Ethan raised questions on transaction fee income..."
  - "Bram referenced a recurring amount..."

**Prompt driver (dist/meeting-intelligence.md, Rule 4):**
```markdown
- Write conclusion‑first bullets (no dialogue reconstruction): lead with the answer/fact, then add brief context.
```

**Causal mechanism:**
The instruction mentions "no dialogue reconstruction" but doesn't explicitly prohibit speaker attribution patterns. The model may interpret verbatim .vtt files as dialogue to reconstruct.

**Patch applied (dist/meeting-intelligence.md, Rule 4):**
```markdown
- **Never use dialogue narration** like "Bram noted...", "Vivien said...", "When asked, CFO explained...". State the fact directly. Exception: verbatim quotes in Key Findings or Adjustments Memo evidence.
```

**Regression tests:**
- RT-25: Any .vtt transcript. Pass: Meeting Notes bullets state facts directly without speaker attribution (except in quoted evidence). Fail: Bullets use narration patterns like "[Name] said/noted/explained/indicated..."

---

### Pattern 23: Unnecessary Owner Column When All Unknown

**What it looks like:**
Open Items tables include an "Owner" column filled entirely with "Not specified" or "Owner not specified", adding visual noise without value.

**Evidence:**
```markdown
| Item | Owner |
| --- | --- |
| Confirm what drives transaction fee income changes... | Owner not specified |
| Clarify FY24 payroll compliance auditor cost... | Owner not specified |
```

**Patch applied (dist/fdd-meeting-template.md, Open Items section):**
Template now instructs: "Include Owner column only if at least one owner is specified — omit if all are unknown."

**Regression tests:**
- RT-26: Transcript with no explicit owner assignments. Pass: Open Items table has only Priority and Item columns. Fail: Owner column appears with all "Not specified" entries.

---

### Pattern 24: Adjustments Memo Evidence Not Indented

**What it looks like:**
Evidence quotes in the Adjustments Memo appear at the same bullet level as the rationale, making it hard to distinguish supporting evidence from the main point.

**Evidence (before fix):**
```markdown
**QoE1: Severance costs** — Opex (Payroll / Restructuring)
- Severance payments were discussed...
- "so had to pay a larger severance as a result." — Corey Persiko
- "it just seems a bit odd given the severance was March 25…" — Ethan Ing
```

**Patch applied (dist/fdd-adjustments.md):**
Template now shows evidence quotes indented as sub-bullets:
```markdown
**QoE1: Severance costs**

Severance payments were discussed...

  - "so had to pay a larger severance as a result." — Corey Persiko
  - "it just seems a bit odd given the severance was March 25…" — Ethan Ing
```

**Regression tests:**
- RT-27: Any FDD memo with 3+ adjustments. Pass: Evidence quotes are indented under the rationale paragraph. Fail: Evidence quotes at same level as rationale.

---

### Pattern 25: Adjustments Memo Uses "[Ref]" Placeholder

**What it looks like:**
Some adjustment entries use `[Ref]` or `[ref]` as a placeholder instead of the proper QoE1/ND1/WC1 numbering.

**Evidence:**
```markdown
**[Ref]: Marketing consultant elimination**
```

**Patch applied (dist/fdd-adjustments.md, new section "Ref Numbering (Critical)"):**
```markdown
**Always use explicit refs.** Never write `[Ref]` or `[ref]` as a placeholder.
- **QoE1, QoE2, QoE3...** — EBITDA / Quality of Earnings adjustments
- **ND1, ND2, ND3...** — Net Debt adjustments
- **WC1, WC2, WC3...** — Working Capital adjustments
```

**Regression tests:**
- RT-28: Any FDD memo. Pass: All adjustments use explicit refs (QoE1, ND1, WC1, etc.). Fail: Any `[Ref]` or `[ref]` placeholder appears.

---

### Pattern 26: Account/Line in Adjustment Header (Hard to Read)

**What it looks like:**
The adjustment header includes the account/line item, creating a long, hard-to-parse title:
```markdown
**QoE1: Severance costs** — Opex (Payroll / Restructuring)
```

**Patch applied (dist/fdd-adjustments.md):**
P&L line and direction now go in the **first Setup bullet**, not the header:
```markdown
**QoE1: Severance costs**

Severance payments were discussed...

**Setup:**
- Opex (Payroll) — Add-back (+) to EBITDA
- Pull severance payments...
```

**Regression tests:**
- RT-29: Any FDD memo. Pass: Headers contain only ref and short name. Fail: Headers contain account/line info after em-dash.

---

### Pattern 27: Key Findings Section Hard to Read

**What it looks like:**
Key Findings uses long bullet lists for Figures and Potential Adjustments, making it difficult to scan quickly.

**Evidence (before fix):**
```markdown
**Figures:**
- $100 million teams recruited in Irvine, CA; $40 million producer recruited from Compass...
- Prior president left in December; severance for "first couple months" described as one-time.
- "Spreading comp" between Martha and Kellen stated as 150 grand.
- Outsourced IT provider targeted reduction: 300 grand/year down to ~100–130 grand/year.
...
```

**Patch applied (dist/fdd-meeting-template.md, Key Findings):**
Converted to table format for quick scanning:

```markdown
### Figures
| Category | Item | Value | Period/Context |
|----------|------|-------|----------------|
| Revenue | Teams recruited | $100M | Irvine, CA |
| Opex | Outsourced IT reduction | $300k → $100-130k/yr | Target |

### Potential Adjustments
| Ref | Item | Category | Type | Brief Rationale |
|-----|------|----------|------|-----------------|
| QoE1 | Prior president severance | EBITDA | Normalize | One-time |
```

**Regression tests:**
- RT-30: Any FDD notes with 5+ figures. Pass: Figures section uses table format. Fail: Figures section uses long bullet list.

---

### Pattern 28: Open Items Section Hard to Read

**What it looks like:**
Open Items uses long prose bullets with inline Ask prompts, creating a wall of text that's hard to scan.

**Evidence (before fix):**
```markdown
- **[H]** Resolve July/Aug 2025 trending anomalies (sign flips) via GL trace and confirm correct mapping/reversals — Owner: Not specified — Due: TBD
  - *Ask:* "Can you provide the GL detail and mapping/tie-out that explains the July/Aug 2025 sign reversals (what was booked and why)?"
```

**Patch applied (dist/fdd-meeting-template.md & dist/fdd-adjustments.md):**
Converted to clean table format without Ask column:

```markdown
| Priority | Item | Owner | Due |
|----------|------|-------|-----|
| **[H]** | Resolve July/Aug trending anomalies via GL trace | Controller | TBD |
| **[M]** | Provide driver analysis for commission revenue increase | CFO | Next call |
```

**Regression tests:**
- RT-31: Any FDD notes/memo with 5+ open items. Pass: Open Items uses table format. Fail: Open Items uses long bullet format with inline Ask.

---

## Patches Applied (Jan 7, 2026)

| Pattern | File | Change |
|---------|------|--------|
| 19 | dist/meeting-intelligence.md | Added "Source transcript:" to prohibited citations in Step 5 |
| 20 | dist/meeting-intelligence.md | Added "no preamble" rule to Non-negotiables |
| 22 | dist/meeting-intelligence.md | Added explicit prohibition on dialogue narration in Rule 4 |
| 23 | dist/fdd-meeting-template.md | Open Items: omit Owner column if all unknown |
| 24-26 | dist/fdd-adjustments.md | Restructured adjustment format: indented evidence, explicit refs, P&L line in Setup |
| 27 | dist/fdd-meeting-template.md | Key Findings converted to table format |
| 28 | dist/fdd-meeting-template.md & dist/fdd-adjustments.md | Open Items converted to table format, removed Ask column |
| 29 | All templates | Switched placeholder syntax from `[X]` to `<X>` |
| 30 | dist/fdd-meeting-template.md | Removed Due column from Open Items table |
| R1 | dist/meeting-intelligence.md | Number formatting: `$XM` / `$Xk` standard |
| R2 | dist/meeting-intelligence.md | Avoid long parentheticals (>10 words → separate bullet) |
| R3 | dist/meeting-intelligence.md | Bold sparingly: figures, refs, risk indicators only |
| R6 | dist/meeting-intelligence.md | Consistent terminology: QoE, ND, NWC |

---

## Pattern 29: Placeholder Syntax Ambiguity

**What it looks like:**
Template placeholders use `[X]` syntax which can be confused with markdown checkboxes `[ ]` or link syntax `[text](url)`.

**Resolution:**
Switched all templates to use `<X>` syntax for placeholders:
- `[Project Name]` → `<Project Name>`
- `[Description]` → `<Description>`
- `[Speaker]` → `<Speaker>`

`< >` is cleaner, unambiguous, and visually distinct as "fill this in."

---

## Pattern 30: Unnecessary Due Column

**What it looks like:**
Open Items table included a Due column that was never requested and typically filled with "TBD" — adding no value.

**Resolution:**
Removed Due column from Open Items tables. Format is now:
- With owners: `| Priority | Item | Owner |`
- Without owners: `| Priority | Item |`

---

## Additional Readability Improvements (Applied)

The following readability improvements have been applied to `dist/meeting-intelligence.md` Writing Style section:

### R1: Consistent Number Formatting ✓

**Patch applied:** Use `$XM` or `$Xk` (e.g., "$2.1M", "$500k"). Always include `$` for dollar amounts. Preserve ranges exactly as stated.

### R2: Shorter Inline Parentheticals ✓

**Patch applied:** If context exceeds 10 words, move to a separate sentence or sub-bullet.

### R3: Consistent Bold Usage ✓

**Patch applied:** Bold only key figures with units (**$2.1M**), risk indicators (**🔴 High**), and adjustment refs (**QoE1**). Do not bold entire sentences.

### R4: Whitespace Between Major Sections

**Status:** Already implemented in templates via `---` horizontal rules.

### R5: Avoid "Wall of Table" Effect

**Status:** Addressed via table format for Key Findings (Pattern 27). Tables are grouped by category.

### R6: Consistent Terminology ✓

**Patch applied:** Use QoE (not "EBITDA adjustment"), ND (Net Debt), NWC (Working Capital) consistently.

---

# Latest Evaluation Findings (Jan 7, 2026)

The following patterns were identified from manual evaluation of the latest test runs.

---

## Failure Pattern 9: Adjustments Memo Renders in Code Block

**What it looks like:**
The Draft Adjustments Memo is output wrapped in triple backticks (` ```markdown ... ``` `) instead of as rendered markdown. The user receives a code block they must copy/paste rather than formatted output.

**Evidence:**
- Inventiva memo: Output starts with ` ```markdown ` fence and ends with ` ``` `
- Multiple test runs show the same pattern

**Prompt driver (dist/fdd-adjustments.md, line 14 and lines 118-181):**
```markdown
Output the memo as **rendered markdown** (NOT inside code fences). Use this structure:
```
But the example at line 118 is wrapped in:
```
```markdown
# Draft Adjustments Memo — Project Lebron
...
```
```

**Causal mechanism:**
The instruction says "NOT inside code fences" but the example IS inside code fences. The model follows the example pattern over the text instruction.

**Minimal prompt patch (dist/fdd-adjustments.md):**

1. Remove the code fence wrapping from the example (lines 118 and 181)
2. Add emphasis: "CRITICAL: Output as rendered markdown, NOT in a code block. The example below shows format only — when generating, omit the code fences."

**Regression test:**
- RT-13: Generate any Adjustments Memo. Pass: Output starts with `# Draft Adjustments Memo` (no ` ``` ` prefix). Fail: Output wrapped in code fences.

---

## Failure Pattern 10: Adjustments Memo Lacks Databook Setup Guidance

**What it looks like:**
The memo provides rationale, evidence, and data requests — but doesn't tell the associate HOW to set up the adjustment row in Excel. When the data arrives, they still need to figure out: which schedule, which direction (+/-), which periods, what formula logic.

**Evidence:**
- Ex 1 (user-provided): Shows adjustments with Rationale + Evidence + Request, but no guidance on Excel setup
- Ex 2 (user-provided): Same pattern — describes WHAT but not HOW to model

**What's missing for each adjustment:**
1. **Direction:** Is this an add-back (+) or deduction (−) to EBITDA/NWC/ND?
2. **Schedule:** Which databook tab does this go on? (QoE bridge, NWC peg, Net Debt schedule)
3. **Periods:** Which fiscal periods are affected? (FY23 only? FY23-LTM? Go-forward only?)
4. **Calculation hint:** When data arrives, what's the formula? (e.g., "Sum of severance payments above $50k baseline")

**Prompt driver (dist/fdd-adjustments.md, lines 20-24):**
The template shows:
```markdown
**[Ref]: [Short adjustment name]** — [Line: Rev/COGS/Opex]
- [1-2 sentence rationale]
- "[Brief evidence quote]" — [Speaker]
- **Request:** [Data needed to quantify]
```
But no `**Databook setup:**` field.

**Causal mechanism:**
The template doesn't include databook setup guidance, so the model doesn't produce it. Associates receive conceptual adjustments without implementation instructions.

**Minimal prompt patch (dist/fdd-adjustments.md, add to template structure):**

Add after **Request:** line:
```markdown
- **Databook setup:** Direction: [+ or −] | Schedule: [QoE/NWC/ND] | Periods: [FYxx–FYyy or "Go-forward"] | Calc: [Brief formula hint when data arrives]
```

Example:
```markdown
**Q2: Excess severance** — Opex
- FY24-25 elevated due to leadership turnover; normalized ~$40-50k/yr
- "Closer to the 40 to 50 thousand that was paid in FY23" — Phil M.
- **Request:** Severance payments by employee, FY23-LTM
- **Databook setup:** Direction: + | Schedule: QoE | Periods: FY24-LTM | Calc: Actual severance − $45k baseline
```

**Regression test:**
- RT-14: Generate Adjustments Memo with 3+ adjustments. Pass: Each adjustment includes `**Databook setup:**` with Direction, Schedule, Periods. Fail: Missing or incomplete setup guidance.

---

## Failure Pattern 11: Large Transcripts Cause Truncation (Platform Limitation)

**What it looks like:**
When a transcript exceeds ~90k tokens, ChatGPT's tool returns truncated or incomplete results. The reasoning trace shows "Troubleshooting missing output... the message was skipped, likely due to size." Meeting notes are incomplete or cut off.

**Evidence:**
- User reported: "90k input tokens caused the tool used by ChatGPT to return truncated or incomplete results"
- Reasoning trace: "I'll try again with a shorter version to see if the output can be processed properly"

**Root cause:**
This is a **platform limitation**, not a prompt issue. ChatGPT's code interpreter and tool outputs have size limits. Very long transcripts exceed these limits.

**Workaround (not a prompt fix):**
When users upload very long transcripts via ChatGPT's file upload, the content may exceed processing limits. Uploading as `.txt` file appears to work better than pasting directly.

**Mitigation options:**

1. **User guidance (add to README or instructions):**
```markdown
## Long Transcripts (>60 minutes / >15k words)

For best results with long transcripts:
- Upload as a `.txt` file rather than pasting into chat
- If output appears truncated, ask "Please continue from where you left off"
- Consider splitting very long meetings (>90 minutes) into two files
```

2. **No system prompt change possible** — this is a platform constraint, not controllable via instructions.

**Status:** Platform limitation — document for users, no prompt patch available.

---

## Success Case: .txt Upload with Patches Applied

**What it looks like:**
When a transcript is uploaded as `.txt` and the prompt patches (Patterns 6-8, Patches A-C) are applied, output quality is high.

**Evidence (Project Lebron .txt upload):**
- ✅ Executive Summary: 5 bullets, appropriately dense but scannable
- ✅ Key Takeaways: Synthesis present ("systems infrastructure is standard... no red flags")
- ✅ Topic consolidation: 16 topics (borderline but reasonable for a long call)
- ✅ Open Items: [H]/[M]/[L] priority tags present with "Ask:" prompts
- ✅ Risks: 🟡 severity indicators present with "Why it matters"
- ✅ Contradictions/Gaps: Section present and populated
- ✅ Ends with: `📝 Generate Draft Adjustments Memo?`

**Assessment:**
This output demonstrates that **Patches A-C are working** when input is properly handled. The remaining issues (Patterns 9-10) are in the Adjustments Memo generation, not the meeting notes.

**Quality score for this output:** ~4.3/5
- Structure: 4.5/5
- Synthesis: 4/5 (Key Takeaways provide implications)
- Actionability: 4.5/5 (priorities, asks, severity)
- Minor deductions: Some topics could be further consolidated; occasional fact-compression in Key Takeaways

---

## Summary: Latest Evaluation Priorities

| Priority | Pattern | File | Change |
|----------|---------|------|--------|
| P0 | Memo in code block | `fdd-adjustments.md` | Remove code fences from example; emphasize "NOT in code block" |
| P0 | No databook setup | `fdd-adjustments.md` | Add `**Databook setup:**` field to template |
| P2 | Large transcript truncation | README/user docs | Add guidance on .txt upload for long transcripts |

---

# Evaluation Findings — Jan 7, 2026 (Post-Patch)

The following patterns were identified from manual evaluation of two test runs after applying Patterns 9-11 fixes. The overall quality has improved significantly (Adjustments Memo now renders properly, Setup guidance is present), but several additional issues were identified.

---

## Failure Pattern 12: Topic Headings Use Non-Standard "Topic X" Prefix

**What it looks like:**
Topic sections use "Topic [descriptive text]" format (e.g., "Topic QoR reconciliation items and cash collections vs revenue") instead of clean descriptive headings (e.g., "## QoR Reconciliation & Cash Collections").

**Evidence:**
- Eval 2 (FDD Meeting Summary): Lines 49, 77, 114, 148, etc. all use "Topic [name]" format:
  ```markdown
  Topic QoR reconciliation items and cash collections vs revenue
  Topic Collection adjustment and gross-to-net / charge-to-net trends
  Topic Bad debt policy implementation, allowance methodology, and reclass into revenue
  ```

**Prompt driver (dist/fdd-meeting-template.md, line 30):**
```markdown
## Topic [Topic Name]
```

**Causal mechanism:**
The template placeholder uses "Topic [Topic Name]" as a literal example. The model interprets "Topic" as part of the heading format rather than a placeholder label to be replaced.

**Minimal prompt patch (dist/fdd-meeting-template.md, replace line 30):**

Before:
```markdown
## Topic [Topic Name]
```

After:
```markdown
## [Topic Name]

(Use a clear, concise descriptive name — e.g., "Revenue Recognition & AR", "Working Capital", "Net Debt & Leases". Do NOT prefix with "Topic".)
```

**Regression tests:**
- RT-15: Any FDD transcript. Pass: Section headings are "## Revenue Recognition" style, not "Topic Revenue Recognition". Fail: "Topic" prefix appears in any section heading.

---

## Failure Pattern 13: Spurious "Sources:" Line After Adjustments Memo

**What it looks like:**
After the Adjustments Memo ends, a "Sources:" line appears with nothing after it. This is likely a ChatGPT artifact (web search citation formatting) bleeding into the output.

**Evidence:**
- Eval 2 (FDD Meeting Summary), line 417-418:
  ```markdown
  📝 Generate Draft Adjustments Memo?

  Sources:
  ```

**Prompt driver:**
This is NOT driven by the prompt. It appears to be a ChatGPT platform behavior where the model attempts to add web search source citations even when no web search was performed.

**Causal mechanism:**
ChatGPT's default behavior may inject "Sources:" at the end of responses when certain conditions are met (possibly related to response length or content type). The model doesn't have explicit instruction to NOT add sources.

**Minimal prompt patch (dist/meeting-intelligence.md, add to Step 5 Validate):**

Add to validation checklist:
```markdown
- Do NOT add "Sources:", "References:", or citation sections — all content comes from the transcript, not external sources.
```

**Regression tests:**
- RT-16: Any FDD transcript. Pass: Output ends with `📝 Generate Draft Adjustments Memo?` with no "Sources:" line after. Fail: "Sources:" or "References:" appears anywhere in output.

---

## Failure Pattern 14: Adjustments Memo Open Items Table Lacks Specificity

**What it looks like:**
The Open Items table in the Adjustments Memo uses generic descriptions without the specific "Ask:" prompt that tells the associate exactly what question to send. The main meeting notes have this format, but it doesn't carry through to the memo.

**Evidence:**
- Eval 1 (Project Lebron) Memo, lines 447-461:
  ```markdown
  ## Open Items

  | Item | Owner |
  | --- | --- |
  | GL support and posting detail for the 500,000 bad debt recovery (account/month/location) | Target Finance |
  | Support for DSP training stipend/bonus event (270K) and how it was recorded (incl. any reimbursement offset) | Target Finance |
  ```

  Missing: The specific "Ask:" prompt for each item that would tell the associate exactly what to email.

- Compare to the main meeting notes (lines 264-279) which DO have the Ask format:
  ```markdown
  - **[H]** Provide audited FY23 financial statements / audit report — Owner: Not specified — Due: TBD
    - _Ask:_ "Please send the audited FY23 report/set."
  ```

**Prompt driver (dist/fdd-adjustments.md, lines 60-64):**
```markdown
## Open Items

Non-adjustment questions and clarifications:

| Item | Owner |
|------|-------|
| [Description] | [Owner or "Not specified"] |
```

**Causal mechanism:**
The Adjustments Memo template shows a simple two-column table format without the "Ask:" subfield. The main meeting notes template has the Ask format, but the memo template doesn't inherit it.

**Minimal prompt patch (dist/fdd-adjustments.md, replace lines 60-64):**

Before:
```markdown
## Open Items

Non-adjustment questions and clarifications:

| Item | Owner |
|------|-------|
| [Description] | [Owner or "Not specified"] |
```

After:
```markdown
## Open Items

Non-adjustment questions and clarifications. For each item, include a specific "Ask" that can be copy-pasted into an email:

| Item | Owner | Ask |
|------|-------|-----|
| [Description] | [Owner or "Not specified"] | [Specific question to send] |

Example:
| Item | Owner | Ask |
|------|-------|-----|
| Retention bonus roll-forward (400K vs 150K discrepancy) | Target Finance | "Please provide the retention bonus schedule showing amounts authorized, accrued, and paid by employee, with GL account mapping." |
```

**Regression tests:**
- RT-17: Generate Adjustments Memo with 3+ Open Items. Pass: Each row has an "Ask" column with specific question text. Fail: Table has only Item and Owner columns.

---

## Failure Pattern 15: No Explicit Meeting Type Declaration

**What it looks like:**
The meeting notes don't start with an explicit "## Meeting Type: FDD" declaration. The notes jump straight to the header "FDD Meeting Notes — [Project Name]". While "FDD" is in the title, there's no separate classification line as required by the evaluation framework.

**Evidence:**
- Eval 1 (Project Lebron), line 12:
  ```markdown
  FDD Meeting Notes — Project Lebron
  ==================================
  ```
  No separate "## Meeting Type: FDD" line.

- Eval 2 (FDD Meeting Summary), line 12:
  ```markdown
  FDD Meeting Notes — QoR Follow-Up Call (KPMG / FTI / Management)
  ================================================================
  ```
  Same pattern — FDD is in the title but not a separate declaration.

**Prompt driver (dist/meeting-intelligence.md, Step 1):**
```markdown
### Step 1: Decide meeting type

- Identify the meeting type based on the transcript and any documents.
- Classify the meeting as:
    - **Financial Due Diligence (FDD)** when the focus is on financial statements...
    - **General Business** for all other meetings...
```

But the FDD template (dist/fdd-meeting-template.md) doesn't include a Meeting Type line in the skeleton.

**Causal mechanism:**
Step 1 says to "identify" and "classify" the meeting type, but there's no instruction to output this classification explicitly in the notes. The template header includes "FDD" in the title, so the model assumes that's sufficient declaration.

**Minimal prompt patch (dist/fdd-meeting-template.md, add after line 1):**

Before:
```markdown
# FDD Meeting Notes — [Deal Name / Project Code]

- Date: [Date]
```

After:
```markdown
# FDD Meeting Notes — [Deal Name / Project Code]

**Meeting Type:** Financial Due Diligence (FDD)

- Date: [Date]
```

**Regression tests:**
- RT-18: Any FDD transcript. Pass: Output contains "**Meeting Type:** Financial Due Diligence (FDD)" near the top. Fail: No explicit meeting type declaration.

---

## Failure Pattern 16: Excessive Nesting in Meeting Notes Sub-bullets

**What it looks like:**
Meeting Notes sections use 3-4 levels of bullet nesting (bullets within bullets within bullets), making content hard to scan. The template limits nesting to two levels, but the model exceeds this.

**Evidence:**
- Eval 1 (Project Lebron), lines 95-101:
  ```markdown
  *   Labor expense reconciliation (operating model vs trial balance):
      *   FDD team reviewed a labor expense reconciliation...
      *   Discussion points:
          *   There are trial balance accounts not included in the clinical labor tab.
          *   Management stated they have gotten "better" at recording items...
          *   FDD perspective: operating model viewed as best...
      *   Action: FDD team planned to update the labor reconciliation...
  ```
  This is 3 levels deep: top bullet → sub-bullet → discussion points bullets.

- Eval 2 (FDD Meeting Summary) has similar patterns in multiple sections.

**Prompt driver (dist/meeting-intelligence.md, Rule 4):**
```markdown
4. **Structure and topic organization**
   - Use headings and bullets with at most **two** bullet levels; if you need more depth, create a new sub‑heading instead of deeper nesting.
```

**Causal mechanism:**
The rule exists but is buried in a list of rules. The model follows it inconsistently, especially when the transcript discussion has natural hierarchical structure (e.g., "discussion points" as a sub-category). The model defaults to preserving the transcript's implicit hierarchy rather than flattening to 2 levels.

**Minimal prompt patch (dist/meeting-intelligence.md, strengthen Rule 4):**

Before:
```markdown
4. **Structure and topic organization**

   - Write conclusion‑first bullets (no dialogue reconstruction): lead with the answer/fact, then add brief context.
   - Use headings and bullets with at most **two** bullet levels; if you need more depth, create a new sub‑heading instead of deeper nesting.
```

After:
```markdown
4. **Structure and topic organization**

   - Write conclusion‑first bullets (no dialogue reconstruction): lead with the answer/fact, then add brief context.
   - **Maximum two bullet levels.** If you find yourself creating a third level of nesting:
     - Convert the parent bullet to a **Sub-topic** sub-heading instead
     - Example: Instead of `- Item: - Sub-item: - Sub-sub-item`, use:
       ```
       **Sub-topic Name**
       - Sub-item
       - Sub-sub-item
       ```
   - Order sections and topics to follow their order of appearance in the transcript, unless the selected template clearly calls for a different grouping.
```

**Regression tests:**
- RT-19: Any FDD transcript. Pass: No section has more than 2 bullet levels (bullet → sub-bullet only). Fail: Third-level bullets appear (sub-sub-bullets).

---

## Summary: Post-Patch Evaluation Priorities (Jan 7, 2026)

| Priority | Pattern | File | Change |
|----------|---------|------|--------|
| P1 | "Topic X" heading format | `fdd-meeting-template.md` | Remove "Topic" placeholder; add guidance |
| P1 | Spurious "Sources:" line | `meeting-intelligence.md` | Add validation rule against citations |
| P1 | Memo Open Items lacks "Ask" | `fdd-adjustments.md` | Add Ask column to table format |
| P2 | No Meeting Type declaration | `fdd-meeting-template.md` | Add explicit Meeting Type line |
| P2 | Excessive bullet nesting | `meeting-intelligence.md` | Strengthen 2-level rule with examples |

---

## Quality Assessment: Post-Patch Results

### Eval 1 (Project Lebron)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure compliance | 4.3/5 | Missing Meeting Type line; "Topic" prefix issue |
| Executive Summary | 4.5/5 | 5 bullets, appropriately scoped |
| Key Takeaways | 4/5 | Provides synthesis, not just facts |
| Numeric capture | 4.5/5 | All material figures with units/periods |
| Open Items | 4.5/5 | [H]/[M]/[L] tags, Ask prompts present |
| Risks | 4.5/5 | Severity indicators (🟡/🟢) present |
| Adjustments Memo | 4/5 | Setup guidance present; Open Items lacks Ask column |
| **Overall** | **4.3/5** | Significant improvement from previous 3.6 |

### Eval 2 (FDD Meeting Summary)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure compliance | 4/5 | "Topic" prefix issue; spurious "Sources:" |
| Executive Summary | 4.5/5 | Clean 5-bullet summary |
| Key Takeaways | 4.5/5 | Good synthesis with implications |
| Numeric capture | 4.5/5 | Figures preserved with context |
| Open Items | 4/5 | Priority tags present |
| Risks | 4.5/5 | Severity indicators present |
| Adjustments Memo | 4/5 | Setup guidance present; Open Items table incomplete |
| **Overall** | **4.3/5** | Strong performance with minor formatting issues |

### Net Assessment
- **Pre-patch baseline**: 3.6/5
- **Post-patch (current)**: 4.3/5
- **After Pattern 12-16 fixes (projected)**: 4.5/5

The major improvements (Patterns 9-11) are working. The remaining issues (Patterns 12-16) are formatting polish that will push quality to 4.5.

---

---

## Failure Pattern 1: Missing Contradictions & Gaps Section

**What it looks like:**
All 5 samples omit the dedicated Contradictions & Gaps section entirely. Conflicting figures and deflected questions are captured inline within topic notes but never aggregated for easy scanning.

**Evidence:**
- Sample 1: No Contradictions & Gaps section despite 60k chars of output
- Sample 3: Noted "230 to 45 days" as likely transcription error inline, but no dedicated section
- Sample 4: Data integrity issues flagged inline but not aggregated

**Prompt driver:**
The FDD template (`fdd-meeting-template.md`) does not include a Contradictions & Gaps section in the template skeleton. The system prompt mentions contradiction handling in rules but doesn't mandate a section.

**Quoted lines (dist/meeting-intelligence.md):**
```
- Never fabricate numbers or facts; if something is unclear, conflicting, or missing, say so and capture it in Open Items / Follow-Ups
```

**Causal mechanism:**
The instruction says to "capture it in Open Items / Follow-Ups" which conflates three distinct things: (1) unanswered questions, (2) conflicting statements, and (3) data requests. Without a dedicated section in the template, the model defaults to inline handling and loses the aggregated view.

**Minimal prompt patch (dist/fdd-meeting-template.md, add before Open Items section):**
```markdown
## Contradictions & Gaps

Aggregate all unresolved conflicts, deflections, and notable silences here (end of document, not per-topic).

**Contradictions:**
- [Metric] — [Value A] (Speaker A) vs [Value B] (Speaker B) — [Context if given]

**Gaps / Deflections:**
- Q: [Question asked] (by [Asker])
  - Response: [Deflection or non-answer] (by [Responder])
  - Follow-up needed: [What to request]

If none, write: "No material contradictions or gaps identified."
```

**Regression tests:**
- RT-01: Input transcript with planted contradiction (two different DSO figures). Pass: Both figures appear in Contradictions section with speaker attribution.
- RT-02: Input transcript with deflected question. Pass: Question and deflection appear in Gaps section.

---

## Failure Pattern 2: Inconsistent Notable Items Structure

**What it looks like:**
Sample 1 and Sample 4 use the formal Notable Items block structure (FIGURES, RISKS, POTENTIAL ADJUSTMENTS, POLICIES, OPEN ITEMS, Insights). Samples 2, 3, and 5 use an informal structure with inline "Notable items" prose or skip the blocks entirely.

**Evidence:**
- Sample 2: Uses "**Notable items**" as a prose header with bullet lists, not the formal block structure
- Sample 3: Has "### Notable items" but with inconsistent categories (FIGURES, RISKS/DATA QUALITY, OPEN ITEMS only)
- Sample 5: Uses "**Notable items**" with mixed formatting, no POTENTIAL ADJUSTMENTS or POLICIES blocks

**Prompt driver:**
The template shows the structure but doesn't enforce it. The system prompt says "Match the template" but doesn't specify consequences for deviation.

**Quoted lines (dist/meeting-intelligence.md):**
```
- Tagging rules: Match the template. For FDD, do not tag inline; capture FIGURES/RISKS/POTENTIAL ADJUSTMENTS/POLICIES/OPEN ITEMS in each topic's **Notable items** block.
```

**Causal mechanism:**
The instruction says "Match the template" but the model interprets this loosely when the transcript is messy or data-walkthrough focused. The phrase "do not tag inline" is clear, but there's no explicit "always use the full block structure" enforcement.

**Minimal prompt patch (dist/meeting-intelligence.md, replace line 59):**
```markdown
- Tagging rules: For FDD, use the **Notable items** block structure for every topic:
  - Include only categories that have content (omit empty categories entirely)
  - Required format: `**CATEGORY:**` followed by bullets
  - Never use inline tagging or informal prose summaries
  - This applies to all FDD meeting styles (management calls, data walkthroughs, reconciliation reviews)
```

**Regression tests:**
- RT-03: Input data-walkthrough style FDD transcript. Pass: Every topic section has Notable items block with standard categories. Fail: Informal prose or inline tagging.

---

## Failure Pattern 3: Non-Substantive Content Captured

**What it looks like:**
Sample 4 includes a full section on "Meeting logistics / access issues" documenting Teams invite confusion, Yahoo email calendar problems, and link-sharing difficulties. This adds ~500 words of noise.

**Evidence:**
- Sample 4, Topic 1: "Teams invite / link confusion" with 8 bullets about joining issues
- Sample 4 Notable Items includes: "Risk of delays/missed attendance due to invite/link management issues (not financial; operational only)"

**Prompt driver:**
The system prompt says to capture "all material" content but doesn't define materiality or explicitly exclude logistics.

**Quoted lines (dist/meeting-intelligence.md):**
```
- Capture all **material** figures, drivers, policies, risks, and follow‑ups, even if they feel repetitive.
```

**Causal mechanism:**
The word "material" is undefined, so the model defaults to comprehensive capture. The instruction "even if they feel repetitive" may reinforce over-inclusion. Nothing explicitly excludes meeting logistics, small talk, or technical difficulties.

**Minimal prompt patch (dist/meeting-intelligence.md, add as Rule 6):**
```markdown
6. **Omit non-substantive content**
   - Meeting logistics (joining issues, audio problems, calendar confusion) should be omitted entirely.
   - Small talk, greetings, and off-topic asides should be omitted.
   - "Material" means relevant to business, financial, or diligence substance.
```

**Regression tests:**
- RT-04: Input transcript with 5-minute preamble about Teams/Zoom issues before substantive discussion. Pass: No section or bullets about meeting logistics. Fail: Any Notable items block for logistics.

---

## Failure Pattern 4: Missing Adjustments Memo Prompt

**What it looks like:**
Only Sample 4 includes the required `Generate Draft Adjustments Memo? 📝` prompt at the end. Samples 1, 2, 3, and 5 omit it despite being FDD meetings.

**Evidence:**
- Sample 1: 60k chars, ends abruptly at Open Items section
- Sample 2: Ends with "---" and no prompt
- Sample 3: Ends with Open Items, no prompt
- Sample 5: Ends with follow-up items, no prompt

**Prompt driver:**
The instruction exists but uses soft language ("If the meeting is FDD, end your output with...").

**Quoted lines (dist/meeting-intelligence.md):**
```
- If the meeting is **FDD**, end your output with: `Generate Draft Adjustments Memo? 📝` If the user says yes, generate it using `fdd-adjustments.md`.
```

**Causal mechanism:**
The conditional "If the meeting is FDD" may be interpreted as optional. Long outputs may cause the model to lose track of end-of-output requirements. The instruction is buried in Step 4 rather than being a standalone validation step.

**Minimal prompt patch (dist/meeting-intelligence.md, add to Step 5 Validate):**
```markdown
- For FDD meetings: Confirm the output ends with `Generate Draft Adjustments Memo? 📝` (mandatory, not optional).
```

**Regression tests:**
- RT-05: Any FDD transcript. Pass: Output ends with exactly `Generate Draft Adjustments Memo? 📝`. Fail: Missing prompt or variant wording.

---

## Failure Pattern 5: Empty Notable Items Categories Included

**What it looks like:**
Some samples include Notable Items categories with "None" or no content, creating visual noise. Per user feedback, empty categories should be omitted entirely.

**Evidence:**
- Sample 4, Topic 1: `**FIGURES (0–5):** - None.` and `**POTENTIAL ADJUSTMENTS (0–5):** - None discussed.`
- Sample 1: Some topics have `**POTENTIAL ADJUSTMENTS (0–5):** - None identified in this section.`

**Prompt driver:**
The template shows all categories with "(0-5)" ranges, implying they should always appear. No instruction says to omit empty categories.

**Quoted lines (dist/fdd-meeting-template.md):**
```
**FIGURES (0–5):**
- [Most important numeric takeaways with units and periods]

**RISKS (1–3):**
- [Most important risks / uncertainties / control issues]
```

**Causal mechanism:**
The "(0-5)" notation suggests zero is valid, but the model interprets "valid" as "should still appear." The template structure implies all categories are required even when empty.

**Minimal prompt patch (dist/fdd-meeting-template.md, add after Notable items header):**
```markdown
### Notable items — [Topic Name]

**Include only categories with substantive content.** Omit categories entirely if nothing was discussed (do not write "None" or "None discussed").
```

**Regression tests:**
- RT-06: Input transcript where a topic has figures and risks but no potential adjustments or policy notes. Pass: Notable items block shows only FIGURES and RISKS categories. Fail: Empty categories appear.

---

## Summary: Priority Edits from 5-Sample Evaluation

| Priority | Pattern | File | Change |
|----------|---------|------|--------|
| P0 | Missing Contradictions & Gaps | `fdd-meeting-template.md` | Add section template at end |
| P0 | Inconsistent Notable Items | `meeting-intelligence.md` | Strengthen enforcement, apply to all FDD styles |
| P0 | Non-substantive content | `meeting-intelligence.md` | Add Rule 6 defining "material" |
| P1 | Missing Adjustments Memo | `meeting-intelligence.md` | Add to Step 5 Validate as mandatory check |
| P1 | Empty Notable Items | `fdd-meeting-template.md` | Add "omit empty categories" instruction |

---

---

# Failure Patterns from 50-Sample Manual Review (Jan 2026)

The following patterns were identified from manual review of test-run-2 outputs (50 samples).

---

## Failure Pattern 6: Executive Summary Bullets Too Dense

**What it looks like:**
Executive Summary bullets pack 3-4 separate facts into a single bullet, making them hard to scan. A reader cannot understand the meeting in 30 seconds because each bullet requires parsing multiple clauses.

**Evidence:**
- Sample 1, Executive Summary bullet 1:
```markdown
- **Reporting framework and audit posture appear stable:** Consolidated financials
  are prepared under **ASPE (Canada)** with **clean audit opinions for the past
  five years**; the only major recent policy change noted was adoption of the
  **new ASPE lease accounting standard** when mandatory.
```
This single bullet contains 4 distinct facts: (1) ASPE framework, (2) clean opinions, (3) five-year history, (4) lease standard adoption.

- Sample 7, Executive Summary bullet 4:
```markdown
- **Multiple "one-time / add-back" style items were discussed, including a 2024
  payroll overpayment of ~**$2.1M**, severance (~**$404K** Aug'23–Jul'24), and
  significant legal fees (incl. Pulcinelli: accrual initially **$50K** but should
  have been **$146K**, plus settlement referenced as "**2:25**").**
```
This bullet contains 5+ facts spanning payroll, severance, and legal items.

**Prompt driver (dist/fdd-meeting-template.md, lines 16-18):**
```markdown
## Executive Summary

Write 3-5 bullets that synthesize the most critical takeaways from the entire
meeting. Focus on what matters for the deal: key figures, major adjustment themes,
critical risks, and important open items.
```

**Causal mechanism:**
The instruction says "3-5 bullets" covering "key figures, major adjustment themes, critical risks, and important open items." The model interprets this as needing to cover all four categories, so it packs multiple facts per bullet to stay within the 3-5 bullet constraint. There's no guidance on bullet density.

**Minimal prompt patch (dist/fdd-meeting-template.md, replace lines 16-18):**

Before:
```markdown
## Executive Summary

Write 3-5 bullets that synthesize the most critical takeaways from the entire meeting. Focus on what matters for the deal: key figures, major adjustment themes, critical risks, and important open items. This should allow a reader to understand the meeting in 30 seconds.
```

After:
```markdown
## Executive Summary

Write 3-5 bullets — one issue per bullet. Each bullet should be scannable in under 5 seconds.

Rules:
- One bullet = one issue (not multiple facts joined by semicolons)
- Lead with the conclusion or "so what", not context
- Include the key figure if quantified; omit if not yet known
- Max 2 sentences per bullet

Focus on: the single biggest takeaway, critical risks, material adjustments, and blocking open items.
```

**Regression tests:**
- RT-07: Any FDD transcript. Pass: No Executive Summary bullet contains more than 2 independent facts. Fail: Bullets contain 3+ facts joined by semicolons or commas.

---

## Failure Pattern 7: Key Takeaways Duplicate Meeting Notes (No Synthesis)

**What it looks like:**
Key Takeaways bullets repeat the same facts as the first few Meeting Notes bullets, just compressed. They don't provide synthesis ("so what does this mean for the deal?") — they provide fact compression.

**Evidence:**
- Sample 1, Topic 2 "Accounting Systems & Close Process":

Key Takeaways:
```markdown
- **NetSuite** is the core ERP/GL across Toronto, Ottawa, and Sudbury; POS feeds
  daily sales and NetSuite includes the inventory module.
- **ADP payroll is uploaded via journal entry** (not fully integrated).
- Close cadence: **WD1 start**, **WD+5 month-end**, **WD+7 quarter-end**, and
  **3–4 weeks** for year-end final numbers to auditors.
```

Meeting Notes (first bullets):
```markdown
- **ERP / GL:** Company uses **NetSuite** as core GL/ERP across all locations.
- **Integration with operational systems:**
  - POS system **feeds daily sales data**.
  - **Inventory module is within NetSuite**.
  - **Payroll data from ADP is uploaded via journal entry**.
```

The Key Takeaways are identical facts as Meeting Notes, just reformatted. No synthesis of implications.

- Sample 10, Topic 1: Key Takeaways repeat that "CFO populated a previously blank table" — same as Meeting Notes line 1.

**Prompt driver (dist/fdd-meeting-template.md, lines 24-26):**
```markdown
### Key Takeaways

2-4 bullets capturing the most important facts, figures, risks, or open questions
from this topic. Write what matters most. Include figures with units/periods and
flag adjustment-worthy items.
```

**Causal mechanism:**
The instruction says "capturing the most important facts, figures, risks" — which the model interprets as "extract and compress the top facts." There's no instruction to synthesize or interpret. "What matters most" is ambiguous — the model defaults to "what was said most prominently" rather than "what matters for the deal."

**Minimal prompt patch (dist/fdd-meeting-template.md, replace lines 24-26):**

Before:
```markdown
### Key Takeaways

2-4 bullets capturing the most important facts, figures, risks, or open questions from this topic. Write what matters most. Include figures with units/periods and flag adjustment-worthy items.
```

After:
```markdown
### Key Takeaways

2-4 bullets answering: **"What does this mean for the deal?"**

Rules:
- Synthesize, don't summarize — explain the implication, not just the fact
- If a figure matters, say why (e.g., "DSO of 45 days is in line with industry" or "margin of 99% is anomalous and requires investigation")
- Flag risks and adjustment candidates with brief rationale
- Do NOT repeat facts that appear in Meeting Notes below — if there's nothing to synthesize, omit Key Takeaways for this topic

Good example:
```
- Systems infrastructure is standard (NetSuite + ADP) with no red flags;
  close timing (WD+5) is reasonable for a company this size.
- One integration gap: payroll is manual JE upload — creates key-person
  risk if Controller unavailable at close.
```

Bad example (fact compression, no synthesis):
```
- NetSuite is the core ERP; ADP payroll uploaded via JE.
- Close cadence: WD+5 month-end, WD+7 quarter-end.
```
```

**Regression tests:**
- RT-08: Any FDD transcript. Pass: Key Takeaways bullets contain "so what" language (e.g., "suggests", "implies", "risk is", "in line with", "anomalous"). Fail: Key Takeaways are verbatim or near-verbatim extracts from Meeting Notes.

---

## Failure Pattern 8: Over-Fragmented Topics

**What it looks like:**
Outputs contain 20+ topic sections when 6-10 would suffice. Related discussions are split into micro-topics, making it hard to see the narrative arc. The reader must jump between many small sections to understand a single theme.

**Evidence:**
- Sample 1: 26 topic sections for a single 65-minute accounting/finance overview call:
```
1) Financial Reporting Framework & General
2) Accounting Systems & Close Process
3) Accounting & Finance Function
4) Revenue Recognition & Contracts
5) Inventory & COGS
6) Payroll & Benefits
7) Capitalized Costs & Fixed Assets
8) Leases
9) Intercompany Transactions
10) Taxes
11) FX & International
12) Prepaid & Accrued Expenses
13) Accounts Receivable
14) Accounts Payable
15) Working Capital – Overview
16) Working Capital – AR
17) Working Capital – AP
18) Working Capital – Inventory
19) Working Capital – Trends
20) P&L Trending – Revenue
21) P&L Trending – Gross Margin
22) P&L Trending – Opex
23) P&L Trending – Sudbury
24) Data Integrity Issues
25) Open Items
26) Wrap-up / Closing
```

Topics 1-3 could be one section: "Finance Function & Close Process"
Topics 15-19 could be one section: "Working Capital"
Topics 20-23 could be one section: "P&L Trending"

- Compare to Sample 10: Same type of call, 6 topics — much more scannable.

**Prompt driver (dist/meeting-intelligence.md, lines 30-31):**
```markdown
- Read the entire transcript from start to end.
- Keep a running outline of topics/subtopics in order discussed.
```

And (dist/meeting-intelligence.md, line 57):
```markdown
- When composing the notes, always follow the order of topics in the outline.
```

**Causal mechanism:**
The model is told to "keep a running outline of topics/subtopics" and "follow the order of topics." It interprets each shift in conversation as a new topic, creating one section per 2-3 minute segment. There's no guidance to consolidate related topics or target a topic count.

**Minimal prompt patch (dist/meeting-intelligence.md, add after line 31):**

Before:
```markdown
- Read the entire transcript from start to end.
- Keep a running outline of topics/subtopics in order discussed.
```

After:
```markdown
- Read the entire transcript from start to end.
- Keep a running outline of topics/subtopics in order discussed.
- After outlining, consolidate related topics into 6-10 major sections for a typical 60-90 minute call. Group related items (e.g., all working capital discussions under one "Working Capital" section; all P&L trending under one "P&L Trending" section). Use sub-headings within sections for granularity rather than creating many top-level sections.
```

**Regression tests:**
- RT-09: 60-90 minute FDD transcript. Pass: Output contains 6-12 top-level topic sections. Fail: Output contains 20+ topic sections.

---

## Summary: Priority Edits from 50-Sample Manual Review

| Priority | Pattern | File | Change |
|----------|---------|------|--------|
| P0 | Exec Summary too dense | `fdd-meeting-template.md` | Add "one issue per bullet" rule with examples |
| P0 | Key Takeaways = fact compression | `fdd-meeting-template.md` | Rewrite to require synthesis; add good/bad examples |
| P1 | Over-fragmented topics | `meeting-intelligence.md` | Add topic consolidation guidance (target 6-10 sections) |

---

## Regression Test Suite (Updated)

| Test ID | Pattern | Input | Pass Criteria |
|---------|---------|-------|---------------|
| RT-01 | Contradictions | Transcript with two different DSO figures | Both in Contradictions section with attribution |
| RT-02 | Contradictions | Transcript with deflected question | Question + deflection in Gaps section |
| RT-03 | Notable Items | Data-walkthrough FDD call | Formal Notable Items blocks on every topic |
| RT-04 | Non-substantive | 5-min Teams issues before content | No logistics section or bullets |
| RT-05 | Adjustments Memo | Any FDD transcript | Ends with `📝 Generate Draft Adjustments Memo?` |
| RT-06 | Empty Categories | Topic with figures only | Only FIGURES category appears |
| RT-07 | Exec Summary density | Any FDD transcript | No bullet contains 3+ independent facts |
| RT-08 | Key Takeaways synthesis | Any FDD transcript | Key Takeaways contain "so what" language, not fact compression |
| RT-09 | Topic fragmentation | 60-90 min FDD transcript | 6-12 top-level sections, not 20+ |

---

## Estimated Quality Impact

### Before Fixes (Current State)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure compliance | 4.5/5 | Template followed, memo prompt present |
| Numeric capture | 4.5/5 | Figures captured with units/periods |
| Hallucination prevention | 5/5 | Zero invented facts |
| Scannability | 2.5/5 | Exec Summary too dense; too many sections |
| Synthesis quality | 2/5 | Key Takeaways = fact compression, no "so what" |
| Actionability | 4/5 | Open items have owners; could be more specific |
| **Overall** | **3.6/5** | Comprehensive but hard to scan; lacks synthesis |

### After Fixes (Projected)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure compliance | 4.5/5 | Unchanged |
| Numeric capture | 4.5/5 | Unchanged |
| Hallucination prevention | 5/5 | Unchanged |
| Scannability | 4/5 | One issue per bullet; 6-10 sections |
| Synthesis quality | 4/5 | Key Takeaways explain implications |
| Actionability | 4/5 | Unchanged |
| **Overall** | **4.3/5** | Comprehensive AND scannable; provides synthesis |

### Net Improvement: +0.7 points (3.6 → 4.3)

The biggest gains come from:
1. **Scannability** (+1.5): Exec Summary bullets readable in 5 seconds each; consolidated topic structure
2. **Synthesis quality** (+2.0): Key Takeaways now answer "so what?" instead of repeating facts

Time-to-value for an associate receiving these notes drops from ~30 minutes of editing to ~10 minutes of review.

---

# Path to 4.5: Additional Prompt Patches

The following patches push quality from 4.3 to 4.5 by improving actionability and proactive value-add.

---

## Patch A: Open Item Prioritization

**Problem:** Open Items are listed flat without priority indicators. An associate can't quickly identify which items are blocking vs. nice-to-have.

**Minimal prompt patch (dist/fdd-meeting-template.md, Open Items section):**

Before:
```markdown
## Open Items / Follow-Ups

- [Item] — Owner: [Name] — Due: [Date]
```

After:
```markdown
## Open Items / Follow-Ups

Prioritize items by deal impact:
- **[H]** = Blocking (cannot close without this)
- **[M]** = Material (affects QoE conclusion or model)
- **[L]** = Housekeeping (nice to have, not critical)

Format:
- **[H]** [Item] — Owner: [Name] — Due: [Date or TBD]
  - *Ask:* [Specific question to ask if owner doesn't provide]

Example:
- **[H]** Provide bank reconciliation as of Dec 31 — Owner: Controller — Due: Friday
  - *Ask:* "Can you send the Dec 31 bank rec with outstanding check detail?"
- **[M]** Clarify revenue recognition policy for multi-year contracts — Owner: CFO — Due: Next call
- **[L]** Send org chart with reporting lines — Owner: HR — Due: TBD
```

**Regression test:**
- RT-10: Any FDD transcript with 5+ open items. Pass: Items tagged [H]/[M]/[L] with at least one "Ask:" for blocking items.

---

## Patch B: Proactive Insights

**Problem:** 💡 Insights are inconsistent—some topics have them, some don't. When present, they're valuable (industry context, benchmarks, typical patterns).

**Minimal prompt patch (dist/meeting-intelligence.md, add to Insights rules):**

Before:
```markdown
- 💡 Insights blocks should add industry context or frameworks, not invent company-specific facts.
```

After:
```markdown
- 💡 Insights blocks should add industry context or frameworks, not invent company-specific facts.
- Add 1-2 💡 Insights per major topic section where you can provide:
  - Industry benchmarks (e.g., "Typical DSO for SaaS is 30-45 days")
  - Common patterns (e.g., "Revenue recognition timing is a frequent QoE adjustment area")
  - Framework explanations (e.g., "Under ASC 606, variable consideration requires...")
  - Red flags worth investigating (e.g., "Margin of 99% warrants investigation—check for misclassified COGS")
- If no insight adds value for a topic, omit the 💡 block entirely.
```

**Regression test:**
- RT-11: Any FDD transcript. Pass: At least 50% of major topic sections have a 💡 Insights block with industry context. Fail: Insights appear on <25% of topics or contain company-specific speculation.

---

## Patch C: Risk Severity Indicators

**Problem:** Risks in Key Findings are listed without severity. A minor data quality issue reads the same as a deal-breaker.

**Minimal prompt patch (dist/fdd-meeting-template.md, Key Findings > Risks subsection):**

Before:
```markdown
### Risks
- [Risk description]
```

After:
```markdown
### Risks

Tag each risk by potential impact:
- 🔴 **High**: Could affect deal terms, valuation, or close timeline
- 🟡 **Medium**: Requires investigation but unlikely to be material
- 🟢 **Low**: Worth noting, but not diligence-critical

Format:
- 🔴 [Risk description] — *Why it matters:* [One-line explanation]
- 🟡 [Risk description]
- 🟢 [Risk description]

Example:
- 🔴 Revenue recognition policy not documented — *Why it matters:* Auditors may require restatement if policy doesn't hold under scrutiny
- 🟡 Payroll uploaded via manual JE — key-person risk if Controller unavailable
- 🟢 Lease accounting standard recently adopted — transition complete, no lingering issues
```

**Regression test:**
- RT-12: Any FDD transcript with 3+ risks. Pass: Each risk tagged 🔴/🟡/🟢 with "Why it matters" for High risks.

---

## Updated Quality Projections

| Version | Score | Key Changes |
|---------|-------|-------------|
| Current (pre-fix) | 3.6/5 | Dense exec summary, no synthesis, flat open items |
| After Patterns 1-8 | 4.3/5 | Scannable structure, synthesis in Key Takeaways |
| After Patches A-C | 4.5/5 | Prioritized open items, proactive insights, risk severity |

---

# Quality Ceiling Analysis

## What's Achievable with Prompt Changes Alone (→ 4.5)

1. **Better structure** ✓ (done via Patterns 1-8)
2. **Synthesis in Key Takeaways** ✓ (done via Pattern 7)
3. **Prioritized open items** (Patch A)
4. **Proactive insights** (Patch B)
5. **Risk severity** (Patch C)

These are all achievable without additional context—the model can apply templates, benchmark patterns, and formatting rules from instructions alone.

## What Requires Context as Input (→ 4.7-4.8)

These improvements require information the model doesn't have:

1. **Deal context**: Is this a platform acquisition or a tuck-in? Does the sponsor care more about growth or EBITDA? What's the target close date? This changes what "material" means.

2. **Cross-call memory**: This is call 3 of 5—what was promised on call 1 that hasn't been delivered? What themes are emerging across calls?

3. **Materiality thresholds**: Is $50K material or noise? Depends on deal size. A $50K adjustment on a $500M deal is rounding error; on a $5M deal it's 1% of purchase price.

4. **QoE tracker integration**: What's already been flagged vs. what's new? What's the running total of adjustments?

**Implementation path**: Add optional context fields to the prompt:
```markdown
## Deal Context (Optional)
- Deal size: [e.g., $50M]
- Materiality threshold: [e.g., $100K]
- Key focus areas: [e.g., Revenue recognition, working capital]
- Prior calls in this deal: [Summary or link]
```

## What Requires Human Judgment (→ 5.0)

These cannot be automated regardless of context:

1. **Credibility assessment**: Did the CFO seem evasive? Was the answer responsive or deflecting? This requires reading body language, tone, pauses—which even the best transcript can't capture.

2. **Strategic prioritization**: Which of 10 open items should the associate chase first? Depends on team bandwidth, client relationship, what other workstreams are doing.

3. **Partner preferences**: Some partners want exhaustive notes; others want 1-page summaries. This is learned over time.

4. **"Smell test" judgment**: Something feels off even if it's factually accurate. Experienced diligence professionals develop intuition that can't be codified.

**The 4.5 ceiling is real**: Automated first-pass notes cannot replace human synthesis and judgment. They should save 60-70% of the grunt work, not 100%.

---

## Summary: Path to 5.0

| Score | What's Required | Achievable By |
|-------|-----------------|---------------|
| 3.6 → 4.3 | Patterns 1-8 (structure, synthesis) | Prompt changes |
| 4.3 → 4.5 | Patches A-C (prioritization, insights, severity) | Prompt changes |
| 4.5 → 4.7-4.8 | Deal context, cross-call memory, materiality | Context as input |
| 4.7-4.8 → 5.0 | Credibility assessment, strategic judgment, partner preferences | Human review |

**Recommendation**: Implement Patterns 1-8 and Patches A-C to reach 4.5. Build optional deal context fields for teams that want to push toward 4.7-4.8. Accept that 5.0 requires human involvement—and that's appropriate for client-facing deliverables.

---

# Structural Change — Jan 7, 2026

## Removed Step 3 (Analyze the documents)

**Rationale:** Step 3 (document analysis workflow) was untested functionality consuming ~1,100 characters. Removing it allows focus on core transcript-to-notes quality and frees character budget for more impactful improvements.

**Change made:**
- Removed Step 3 "Analyze the documents" from `dist/meeting-intelligence.md`
- Renumbered Step 4 → Step 3, Step 5 → Step 4
- Added lightweight extraction guidance to Step 2: "While reading, note: key figures (with context), risks raised, systems/policies, and unanswered questions."

**Character impact:** 7,987 → 6,718 characters (freed ~1,269 chars)

---

## Failure Pattern 34: Model Gets Stuck on Preprocessing Instead of Producing Output

**What it looks like:**
Model spends excessive time on transcript format parsing (VTT timestamps, speaker labels) or data extraction mechanics, never actually producing meeting notes. Reasoning traces show retry loops, tool resets, and focus on technical mechanics rather than the deliverable.

**Evidence from reasoning traces:**
- Model parsing VTT format repeatedly instead of reading content
- Excessive focus on extracting individual numbers vs. synthesizing
- Multiple tool/kernel resets causing state loss
- Model never started producing actual output
- Lost track of the core task during technical struggles

**Root cause:**
Instructions emphasized extraction and completeness without emphasizing output-first production. Model interpreted "read completely" and "capture all figures" as prerequisites before writing, leading to infinite preprocessing.

**Prompt patch applied (dist/meeting-intelligence.md):**

Added new "## Approach" section after Verbosity:
```markdown
## Approach

- **Output-first**: Start composing notes while reading. Don't wait for perfect extraction.
- **Accept any format**: Work with transcripts as-is (text, VTT, SRT). No format conversion needed.
- **Synthesize, don't extract**: Focus on themes and takeaways, not data point collection.
- **Move forward**: If something is unclear, note it as an open item and continue producing output.
```

**Regression test:**
- RT-34: Upload VTT or SRT format transcript. Pass: Notes produced without extensive format parsing discussion. Fail: Model spends >3 reasoning steps on format conversion or parsing mechanics.

**Character impact:** Added ~400 chars (still at 7,224 total, under 8,000 limit)

---

# Evaluation Findings — Test-Run-5 (Jan 7, 2026)

Evaluated 6 outputs after applying Pattern 34 fixes (Approach section, removed Step 3).

## Overall Assessment

**Significant improvement observed.** The "Output-first" approach is working — model is producing comprehensive notes rather than getting stuck on preprocessing. FDD template structure is mostly correct across outputs.

**Quality scores:**
- Meeting Notes Summary (10).md: 4.3/5 — Good structure, detailed adjustments memo
- Meeting Notes Summary (9).md: 4.4/5 — Strong FDD structure, good synthesis
- Adjustments Memo Request.md: 4.3/5 — Comprehensive, good setup sections
- Meeting Notes Summary (8).md: 4.1/5 — Format inconsistencies in tables
- Meeting Notes P&L Walkthrough.md: 4.2/5 — Post-memo content issue

**Average: 4.3/5** (up from previous ~3.6)

*Note: KPMG Due Diligence Walkthrough excluded — output issues were caused by transcript length requiring file upload, not template problems.*

---

## What's Working Well

1. **Output-first approach working** — Model produces notes without getting stuck on parsing
2. **FDD template structure mostly correct** — Executive Summary, Key Takeaways, Key Findings present
3. **Setup sections improved** — Detailed, actionable guidance in adjustments memo
4. **Adjustments Memo rendered as markdown** — Not in code blocks (Pattern 9 fix holding)
5. **📝 prompt present** — At end of FDD notes consistently
6. **No speaker attribution** — Facts stated directly in Meeting Notes
7. **💡 Insights present** — Industry context added appropriately

---

## Failure Pattern 35: Template Remnants in Output

**What it looks like:**
Template instructions appear in the output instead of just the content. For example, "If roles/affiliations are unknown for all attendees, use a simple list:" appearing verbatim before the attendee list.

**Evidence:**
```markdown
Attendees & Roles
-----------------

If roles/affiliations are unknown for all attendees, use a simple list:

*   Corey Persiko
*   Ethan Ing
```

**Root cause:**
Template contains conditional instructions that model includes literally instead of applying.

**Proposed fix:**
Update `fdd-meeting-template.md` Attendees section to remove conditional instruction text and make it cleaner.

**Regression test:**
- RT-35: Any FDD transcript. Pass: Attendees section contains only names/roles, no template instructions. Fail: Instructions like "If roles/affiliations are unknown..." appear in output.

---

## Failure Pattern 36: Post-Memo Content

**What it looks like:**
After the Adjustments Memo, model offers additional output options instead of stopping.

**Evidence:**
```markdown
If you want, I can next:

*   Convert this into a **formal QoE adjustment table** (impact, direction, EBITDA effect), or
*   Tighten language further to match a **Big 4 house style** for an IC memo or lender report.
```

**Root cause:**
No explicit instruction to stop after the memo. Rule says output ends with `📝 Generate Draft Adjustments Memo?` for the meeting notes, but doesn't specify memo termination.

**Proposed fix:**
Add to `fdd-adjustments.md`: "End the memo after the Open Items table. Do not offer follow-up options or additional formatting."

**Regression test:**
- RT-36: Generate Adjustments Memo. Pass: Memo ends at Open Items table. Fail: Any content after the table offering options.

---

## Failure Pattern 37: Inconsistent Open Items Format

**What it looks like:**
Open Items section uses bullet points instead of the priority table format in some outputs.

**Evidence (Meeting Notes Summary 8):**
```markdown
Open Items & Follow-Ups
-----------------------

*   Provide GL / tie-out support for month-to-month reversing items...
*   Confirm and document the offset account/explanation...
```

Should be:
```markdown
| Priority | Item |
|----------|------|
| **[H]** | Provide GL / tie-out support... |
```

**Root cause:**
Template shows table format but model inconsistently applies it.

**Proposed fix:**
Strengthen template instruction: "Open Items MUST use the priority table format. Never use bullet lists for Open Items."

**Regression test:**
- RT-37: Any FDD output with open items. Pass: Table format with [H]/[M]/[L] priorities. Fail: Bullet list format.

---

## Failure Pattern 38: Empty Sections Not Omitted

**What it looks like:**
Sections with no content appear with "Not discussed" or "No adjustments were discussed" text instead of being omitted.

**Evidence:**
```markdown
Working Capital & Cash Conversion
---------------------------------

### Meeting Notes

*   Not discussed in detail (no material discussion of AR, bad debt, AP timing, DSO/DPO, or working capital normalization).
```

**Root cause:**
Template guidance says "omit empty categories" but model interprets this narrowly.

**Proposed fix:**
Add explicit rule: "If a section has no substantive content from the transcript, omit the entire section. Do not include sections with 'Not discussed' or 'No adjustments were discussed' text."

**Regression test:**
- RT-38: FDD transcript that doesn't cover all topic areas. Pass: Missing topics are omitted entirely. Fail: Sections appear with "not discussed" placeholder text.

---

## Failure Pattern 39: Potential Adjustments Format Inconsistency

**What it looks like:**
Potential Adjustments section uses bullet list instead of the required table format.

**Evidence:**
```markdown
### Potential Adjustments

*   **National Advertising Fund**: add back the **$40k** accrual miss...
*   **Agent retention cost timing**: remove/normalize December 2024 catch-up...
```

Should be table with Ref, Item, Category, Type, Brief Rationale columns.

**Root cause:**
Similar to Pattern 39 — template shows format but not enforced.

**Proposed fix:**
Strengthen Key Findings template: "Potential Adjustments MUST use the table format with columns: Ref | Item | Category | Type | Brief Rationale"

**Regression test:**
- RT-39: FDD output with adjustment candidates. Pass: Table format with all columns. Fail: Bullet list format.

---

## User Feedback: Structural Simplifications

Based on user review of test-run-5 outputs:

### Remove Executive Summary from FDD Notes

**Feedback:** Executive Summary was not found useful.

**Rationale:** The Key Takeaways per topic already provide synthesis. An additional Executive Summary at the top may be redundant and adds length without proportional value.

**Proposed change:** Remove Executive Summary requirement from `fdd-meeting-template.md` and update `meeting-intelligence.md` Step 3 and Step 4 validation to remove Executive Summary references.

---

### Remove Open Items from Adjustments Memo

**Feedback:** Open Items in the Adjustments Memo felt redundant with Open Items in the main meeting notes.

**Rationale:** The meeting notes already capture all open items with priorities. Repeating them in the memo creates duplication and potential inconsistency.

**Proposed change:** Remove Open Items section from `fdd-adjustments.md` template. Adjustments Memo should end after the last adjustment category (Working Capital Adjustments or whichever is the last populated section).

---

## Summary: Test-Run-5 Priorities

| Priority | Pattern | Fix Location | Change |
|----------|---------|--------------|--------|
| P0 | Remove Executive Summary | `fdd-meeting-template.md`, `meeting-intelligence.md` | Remove section and validation references |
| P0 | Remove Memo Open Items | `fdd-adjustments.md` | Remove Open Items section from template |
| P1 | Pattern 35 (Template remnants) | `fdd-meeting-template.md` | Clean up conditional instructions |
| P1 | Pattern 36 (Post-memo content) | `fdd-adjustments.md` | Add termination instruction |
| P2 | Pattern 37 (Open Items format) | `fdd-meeting-template.md` | Enforce table format |
| P2 | Pattern 38 (Empty sections) | `meeting-intelligence.md` | Add omission rule |
| P2 | Pattern 39 (Potential Adjustments format) | `fdd-meeting-template.md` | Enforce table format |

---

# Comprehensive Dist Evaluation — Polish Items

Full review of all files in `/dist/` for consistency, clarity, and polish.

## File: meeting-intelligence.md (7,224 chars)

### Issue MI-1: Executive Summary References (User Feedback)
**Location:** Lines 52, 66
**Problem:** Still references Executive Summary which user wants removed.

Line 52:
```
- Start with **Executive Summary**: 3-5 bullets synthesizing the most critical takeaways
```

Line 66:
```
- For FDD: Executive Summary is present at top; Key Takeaways appears before Meeting Notes
```

**Fix:** Remove both references.

---

### Issue MI-2: Template Skeleton Instruction
**Location:** Line 50
**Problem:** "Create a 'Template Skeleton' (headings only, no content)" may cause model to output template structure/instructions.

**Fix:** Reword to: "Follow the template structure exactly."

---

### Issue MI-3: Insights Rule Placement
**Location:** Line 98-99
**Problem:** Rule 5 about 💡 Insights is sandwiched between structural rules and omission rules. Could be clearer.

**Recommendation:** Minor — keep as-is for now.

---

### Issue MI-4: Character Budget
**Current:** 7,224 characters
**Limit:** 8,000 characters
**Available:** 776 characters

After removing Executive Summary references (~150 chars), will have ~926 chars available for any new guidance.

---

## File: fdd-meeting-template.md

### Issue FT-1: Attendees Conditional Instructions (Pattern 35)
**Location:** Lines 12-20
**Problem:** Conditional instructions appear literally in output.

Current:
```markdown
If roles/affiliations are known, use a table:

| Name | Role | Affiliation |
|------|------|-------------|

If roles/affiliations are unknown for all attendees, use a simple list:
- <Name>
```

**Fix:** Remove conditional text. Simplify to just show format options without "If... use..." instructions.

Proposed:
```markdown
## Attendees & Roles

| Name | Role | Affiliation |
|------|------|-------------|
| <Name> | <Title> | Target / Sponsor / Advisor |

(Use simple bullet list if roles/affiliations are unknown.)
```

---

### Issue FT-2: Executive Summary Section (User Feedback)
**Location:** Lines 22-33
**Problem:** User found Executive Summary not useful — Key Takeaways per topic already provides synthesis.

**Fix:** Remove entire Executive Summary section from template.

---

### Issue FT-3: Key Findings Table Formats Not Enforced (Patterns 37, 39)
**Location:** Lines 126-132, 152-156
**Problem:** Open Items and Potential Adjustments tables shown but not enforced.

**Fix:** Add explicit instruction: "MUST use table format exactly as shown."

Proposed addition after line 150:
```markdown
**Format requirements:**
- Open Items MUST use the priority table format with [H]/[M]/[L] — never bullet lists.
- Potential Adjustments MUST use the table format with all columns shown.
```

---

### Issue FT-4: 💡 Insights Under Open Items
**Location:** Lines 163-167
**Problem:** There's a 💡 Insights subsection under Open Items. This feels out of place — Insights belong under topic sections, not Open Items.

**Fix:** Remove the 💡 Insights subsection from Open Items. Keep only the priority table.

---

### Issue FT-5: Empty Section Handling (Pattern 38)
**Location:** Line 144
**Problem:** Says "Omit any section with no items" but model still includes "Not discussed" placeholders.

**Fix:** Make explicit: "If a topic was not discussed, omit the entire section. Never include placeholder text like 'Not discussed' or 'No material discussion.'"

---

## File: fdd-adjustments.md

### Issue FA-1: Open Items Section (User Feedback)
**Location:** Lines 84-92 (template), Lines 319-326 (example)
**Problem:** User found Open Items in memo redundant with main notes.

**Fix:** Remove Open Items from both template and example.

---

### Issue FA-2: No Termination Instruction (Pattern 36)
**Location:** End of template section
**Problem:** No explicit instruction to stop after the memo, leading to "If you want, I can next..." follow-ups.

**Fix:** Add after the Working Capital section in template:
```markdown
(End memo here. Do not offer additional formatting or follow-up options.)
```

---

### Issue FA-3: Open Items Guidance Section
**Location:** Lines 176-181
**Problem:** Guidance about Open Items should be removed if we're removing the section.

**Fix:** Remove the "### Open Items" guidance subsection.

---

### Issue FA-4: Example Has Open Items
**Location:** Lines 319-327
**Problem:** Example output includes Open Items table which should be removed per user feedback.

**Fix:** Remove Open Items from example, ending at the Working Capital section.

---

## File: general-business-template.md

### Issue GB-1: Notion-Specific Tags
**Location:** Multiple lines (e.g., 40, 142, 241, etc.)
**Problem:** Uses `<mention-page url="...">` tags which are Notion-specific. May cause formatting issues in other contexts.

**Recommendation:** Low priority — this is for General Business meetings which haven't been tested. Keep for now, but note for future if issues arise.

---

### Issue GB-2: Not Tested
**Problem:** General Business template hasn't been evaluated with test transcripts.

**Recommendation:** Flag for future testing. Current focus is FDD quality.

---

## Summary: All Polish Items

| Priority | ID | File | Issue | Fix |
|----------|-----|------|-------|-----|
| **P0** | FT-2 | fdd-meeting-template.md | Remove Executive Summary | Delete section |
| **P0** | MI-1 | meeting-intelligence.md | Remove Exec Summary refs | Delete lines 52, 66 refs |
| **P0** | FA-1 | fdd-adjustments.md | Remove Memo Open Items | Delete from template + example |
| **P0** | FA-3 | fdd-adjustments.md | Remove Open Items guidance | Delete guidance section |
| **P1** | FT-1 | fdd-meeting-template.md | Attendees conditional text | Simplify template |
| **P1** | FA-2 | fdd-adjustments.md | Add termination instruction | Add "(End memo here...)" |
| **P1** | FT-3 | fdd-meeting-template.md | Enforce table formats | Add format requirements |
| **P1** | FT-5 | fdd-meeting-template.md | Empty section handling | Add explicit omission rule |
| **P2** | MI-2 | meeting-intelligence.md | Template skeleton wording | Simplify instruction |
| **P2** | FT-4 | fdd-meeting-template.md | Insights under Open Items | Remove subsection |
| **P3** | GB-1 | general-business-template.md | Notion-specific tags | Monitor |
| **P3** | GB-2 | general-business-template.md | Not tested | Future work |

---

## Recommended Patch Order

Apply in this order to maintain consistency:

1. **fdd-meeting-template.md**: Remove Executive Summary, fix Attendees, add format requirements, fix empty section rule, remove Insights from Open Items
2. **fdd-adjustments.md**: Remove Open Items (template + example + guidance), add termination instruction
3. **meeting-intelligence.md**: Remove Executive Summary references, simplify template skeleton instruction

**Estimated character impact on meeting-intelligence.md:** Net reduction of ~100-150 chars (removing Exec Summary refs), leaving ~900+ chars available.

---

# Evaluation Findings — Test-Run-6 (Jan 8, 2026)

Comprehensive evaluation of 18 outputs after applying all P0/P1/P2 fixes including:
- Removed Executive Summary
- Removed Adjustments Memo Open Items
- Added format enforcement for tables
- Added empty section omission rule
- Simplified Attendees section
- Added termination instruction to Adjustments Memo
- Removed Notion tags from General Business template

## Overall Assessment

**Excellent results.** This is the highest-quality test run to date. Nearly all identified patterns have been successfully addressed.

**Quality scores (18 outputs):**

| Output | Score | Notes |
|--------|-------|-------|
| Meeting Notes Summary (11) | 4.6/5 | Strong FDD structure, detailed adjustments memo |
| Meeting Notes Summary (12) | 4.5/5 | Good synthesis, comprehensive figures table |
| Meeting Notes Summary (13) | 4.6/5 | Excellent Key Takeaways, clean structure |
| Meeting Notes Summary (14) | 4.5/5 | Good Key Findings, proper priorities |
| Meeting Notes Summary (15) | 4.4/5 | Solid structure, minor formatting |
| Meeting Notes Summary (16) | 4.5/5 | Clean output, good adjustments identification |
| Meeting Notes Summary (17) | 4.6/5 | Comprehensive coverage, good Insights |
| Meeting Notes Summary (18) | 4.5/5 | Strong FDD template adherence |
| Meeting Notes Summary (19) | 4.7/5 | Excellent depth and synthesis |
| Meeting Notes Summary (20) | 4.5/5 | Minor metadata leakage ("Transcript:") |
| Meeting Notes Summary (21) | 4.4/5 | Minor template instruction remnant |
| Meeting Notes FDD Project | 4.6/5 | Comprehensive, good Setup sections |
| Meeting Notes Creation (3) | 4.7/5 | Excellent healthcare billing coverage |
| Meeting Notes Creation (4) | 4.5/5 | Correctly used Decision template (General Business) |
| Meeting Notes FDD Lebron (3) | 4.6/5 | Strong adjustments identification |
| Meeting Notes FDD Project (1) | 4.7/5 | Excellent QoE synthesis |
| Meeting Notes FDD Project (2) | 4.6/5 | Minor "Source transcript:" at end |
| Meeting Notes FDD Revenue | 4.5/5 | Good technical depth on reconciliation |

**Average: 4.55/5** (up from 4.3 in test-run-5, 3.6 in earlier runs)

---

## Patterns Successfully Fixed

| Pattern | Status | Evidence |
|---------|--------|----------|
| Pattern 34 (Output-first) | ✅ Fixed | All outputs produce comprehensive notes without preprocessing loops |
| Pattern 35 (Template remnants) | ✅ Mostly fixed | Only 1/18 outputs had minor remnant |
| Pattern 36 (Post-memo content) | ✅ Fixed | No outputs include "If you want, I can next..." |
| Pattern 37 (Open Items format) | ✅ Fixed | All use [H]/[M]/[L] priority table format |
| Pattern 38 (Empty sections) | ✅ Fixed | No "Not discussed" placeholder sections |
| Pattern 39 (Potential Adjustments format) | ✅ Fixed | All use table format with proper columns |
| Executive Summary removal | ✅ Fixed | No Executive Summary in any FDD output |
| Adjustments Memo Open Items | ✅ Fixed | No Open Items section in any Adjustments Memo |
| Adjustments Memo termination | ✅ Fixed | Memos end appropriately |

---

## What's Working Excellently

1. **FDD Template Structure** — All 17 FDD outputs correctly follow the template
2. **Key Takeaways before Meeting Notes** — Consistently applied in every topic
3. **💡 Insights** — Industry/market context added appropriately to most topics
4. **Key Findings section** — Figures tables, Potential Adjustments, Risks, Contradictions/Gaps all present
5. **Open Items table format** — Using [H]/[M]/[L] priorities consistently
6. **📝 Generate Draft Adjustments Memo?** — Present at end of all FDD notes
7. **Adjustments Memo quality** — Setup sections are detailed, actionable, and follow the template
8. **No preamble text** — Notes start directly with title header
9. **No speaker attribution** — Facts stated directly in Meeting Notes
10. **General Business template selection** — Correctly identified Decision meeting type (Creation 4)
11. **Comprehensive figures tables** — All material numbers captured with context
12. **Adjustment ref numbering** — QoE/ND/WC numbering consistently applied

---

## Remaining Minor Issues

### Issue TR6-1: Occasional Template Instruction Remnant (Very Minor)

**Frequency:** 1/18 outputs
**Example (Summary 21):**
```
(Use simple bullet list — roles/affiliations not fully stated in transcript.)
```

**Assessment:** This is the simplified Attendees instruction appearing as a parenthetical. Very minor — only 1 occurrence across 18 outputs.

**Fix needed:** None — acceptable edge case. Could consider removing the parenthetical entirely from template if it persists.

---

### Issue TR6-2: Metadata Leakage at End of Deal Context

**Frequency:** 2/18 outputs
**Example (Summary 20):**
```
*   Transcript:
```

**Assessment:** Empty "Transcript:" label appearing in Deal Context section, likely from model trying to cite source.

**Fix needed:** Low priority — cosmetic issue. Could add explicit instruction to not include source citations in Deal Context.

---

### Issue TR6-3: Source Transcript Citation After 📝 Prompt

**Frequency:** 1/18 outputs
**Example (FDD Project 2):**
```
📝 Generate Draft Adjustments Memo?

Source transcript: Project Academy - Financial due diligence.vtt
```

**Assessment:** Text appearing after the 📝 prompt, which should be the final line.

**Fix needed:** Low priority — could strengthen the "nothing after this line" instruction, but very rare occurrence.

---

## Summary: Test-Run-6 Status

| Category | Status |
|----------|--------|
| Core FDD template structure | ✅ Excellent |
| Key Takeaways / Meeting Notes ordering | ✅ Fixed |
| Key Findings sections | ✅ Working well |
| Open Items format | ✅ Fixed |
| Adjustments Memo structure | ✅ Fixed |
| Executive Summary removal | ✅ Applied |
| Memo Open Items removal | ✅ Applied |
| Template instruction leakage | ⚠️ Very minor (1/18) |
| Metadata leakage | ⚠️ Very minor (2/18) |

**Conclusion:** The system is performing at a high level (4.55/5 average). The remaining issues are cosmetic and occur in <15% of outputs. No P0 or P1 fixes needed.

---

## Recommended Next Steps

1. **Monitor in production** — Current prompt quality is ready for broader use
2. **Optional P3 polish** — If metadata leakage persists, add explicit instruction to not include source/transcript citations
3. **Collect user feedback** — Track any new patterns that emerge from real-world usage
4. **General Business testing** — Only 1/18 outputs used General Business template; more testing needed for that path

---

