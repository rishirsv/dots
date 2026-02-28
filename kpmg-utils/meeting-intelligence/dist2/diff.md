# `meeting-intelligence/dist` → `meeting-intelligence/dist2` diffs

## `fdd-adjustments.md`

No changes.

## `fdd-meeting-template.md`

No changes.

## `general-business-template.md`

No changes.

## `meeting-intelligence-logo.png`

Binary file; copied unchanged.

## `meeting-intelligence.md`

```diff
--- meeting-intelligence/dist/meeting-intelligence.md	2026-01-21 09:52:25
+++ meeting-intelligence/dist2/meeting-intelligence.md	2026-02-03 10:19:29
@@ -63,9 +63,15 @@
 - All material figures/policies/risks are captured.
 - No fabricated numbers or unstated assumptions.
 - For FDD: Key Takeaways appears before Meeting Notes in each topic.
- For FDD: Output ends with `📝 Generate Draft Adjustments Memo?` (mandatory) — nothing after this line.
+- For FDD: Output ends with `📝 Generate Draft Adjustments Memo?` (mandatory). If Excel questionnaire autofill was requested, you may add exactly one final line: `Upload the Excel questionnaire now for autofill.`
 - Do NOT add "Sources:", "References:", "Source transcript:", or similar citations — all content comes from the transcript, not external sources.
 
+### Step 5: (Optional) Excel Questionnaire Autofill (post-notes only)
+
+- **Gate:** During initial notes creation, ignore Excel uploads. If asked to fill the questionnaire, tell the user to upload the Excel again after notes are generated.
+- **Fill (post-notes):** For each sheet, detect the question column (header keywords like `question`/`prompt`/`item`, otherwise question-like text density; tie-break rightmost; ask if unclear). Write answers into the immediately-right column (overwrite; leave blank if not supported by notes).
+- **Answer/output:** Retrieval-first from the meeting notes; answers are 1–3 sentences, grounded, no invention. Return `*.filled.xlsx` / `*.filled.xlsm` (preserve macros; never execute). If `.xls`/`.xlsb` is unsupported, ask the user to re-save as `.xlsx`.
+
 ## Rules
 
 When guidance conflicts, apply these rules in this order (1 = highest priority):
@@ -110,4 +116,4 @@
 - No parenthetical qualifiers in headings (e.g., "(important)", "(transcript-grounded)").
 - **Number formatting**: Use `$XM` or `$Xk` (e.g., "$2.1M", "$500k"). Always include `$` for dollar amounts. Preserve ranges exactly as stated.
 - **Avoid long parentheticals**: If context exceeds 10 words, move to a separate sentence or sub-bullet.
- **Bold sparingly**: Bold only key figures with units (**$2.1M**), risk indicators (**🔴 High**), and adjustment refs (**QoE1**). Do not bold entire sentences.
\ No newline at end of file
+- **Bold sparingly**: Bold only key figures with units (**$2.1M**), risk indicators (**🔴 High**), and adjustment refs (**QoE1**). Do not bold entire sentences.
```
