# Research Report: The Anatomy of Excellent Professional Notes

**Date:** November 19, 2025  
**Project:** Deal-Notes (Financial Due Diligence Automation)  
**Objective:** Define the characteristics, structures, and best practices of high-stakes professional note-taking to inform the design of an automated FDD documentation system.

---

## 1. Executive Summary: The Anatomy of Excellent Notes

Excellent professional notes are not merely records of what was said; they are **structured instruments of action and accountability**. Across high-stakes domains—from legal depositions to intelligence briefings—the "best" notes share a core set of DNA distinct from casual meeting minutes.

**Key Findings:**

1.  **Structure is Strategy:** The best notes don't just capture content; they impose a rigid mental model on it (e.g., SOAP in medicine, BLUF in intelligence). This structure forces the note-taker (or AI) to process information, not just transcribe it.
2.  **The "Verbatim vs. Synthesis" Paradox:** High-stakes fields solve the tension between accuracy and readability by **layering**. They provide a "Bottom Line Up Front" (BLUF) for decision-makers, backed by strictly anchored evidence (timecodes/page-lines) for auditors.
3.  **Zero-Inference Culture:** In legal and scientific contexts, "inference" is a failure mode. Excellent notes rigorously separate **Observation** (what was said/seen) from **Assessment** (what it means).
4.  **Data Integrity is Paramount:** For quantitative fields, numbers are treated as "evidence chains." They are never orphaned; they are always anchored to a source, a time, and a context (e.g., "Unaudited Q3 management view").

**Implication for Deal-Notes:**
To build a "wow" FDD system, we must move beyond simple transcription summaries. The system should act as a **Legal Secretary + Intelligence Officer**: capturing the raw evidentiary record with court-reporter precision, while synthesizing the strategic "so what" with McKinsey-level clarity.

---

## 2. Quality Framework: How to Evaluate Notes

To programmatically evaluate the quality of AI-generated notes, we can adapt criteria from court reporting, medical documentation, and intelligence analysis.

| Dimension          | **Gold Standard** (Excellent)                                           | **Red Flag** (Poor)                                             |
| :----------------- | :---------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Attribution**    | Every material claim is anchored to a specific timecode and speaker.    | "They discussed revenue..." (Who? When?)                        |
| **Objectivity**    | Strictly separates facts ("CFO stated revenue is up 5%") from opinions. | "Revenue is performing well." (Subjective judgment)             |
| **Completeness**   | Captures 95%+ of numeric mentions, dates, and proper nouns.             | Missing specific figures; rounding numbers without noting it.   |
| **Structure**      | Information is siloed by topic; easy to scan; consistent hierarchy.     | Chronological "stream of consciousness" that buries key points. |
| **Actionability**  | Next steps have clear Owners, Deadlines, and specific Deliverables.     | "Team to follow up on data." (Vague)                            |
| **Data Integrity** | Numbers include units, periods, and context (e.g., "FY23 GAAP").        | Orphaned numbers ("5 million") without context.                 |
| **Clarity**        | Uses "Bottom Line Up Front" (BLUF); dense but readable bullets.         | Wall of text; passive voice; buried ledes.                      |

---

## 3. Domain Deep-Dives: What Each Field Does Best

### A. Legal (Depositions & Case Briefs)

- **Superpower:** **Unimpeachable Accuracy & Anchoring.**
- **Why:** In litigation, a misquote can lose a case.
- **Technique:** "Page-Line Summaries." Every summary point cites the exact transcript location (e.g., `Page 45:12-15`).
- **Lesson for FDD:** Adopt the **"Evidence Block"** pattern. Don't just summarize; provide the citation immediately.
  - _Bad:_ The company has no litigation.
  - _Good:_ General Counsel stated there is "no active or threatened litigation" as of today **[00:45:12]**.

### B. Intelligence (SITREPs & Briefings)

- **Superpower:** **Speed to Insight (BLUF).**
- **Why:** Decision-makers (Generals/Presidents) have seconds to process threats.
- **Technique:** **Bottom Line Up Front (BLUF).** The most critical conclusion is the very first sentence.
- **Lesson for FDD:** Every topic section (e.g., Revenue) must start with a 2-sentence **Executive Snapshot** that gives the "so what" before diving into the evidence.

### C. Medicine (SOAP Notes)

- **Superpower:** **Separation of Fact and Opinion.**
- **Why:** Confusing a patient's claim ("I feel fine") with clinical observation (High BP) is dangerous.
- **Technique:** **SOAP** (Subjective, Objective, Assessment, Plan).
  - _Subjective:_ What the patient said.
  - _Objective:_ What the data/tests show.
- **Lesson for FDD:** Distinctly separate **Management Representations** (Subjective) from **Data Room Facts** (Objective) and **QoE Adjustments** (Assessment).

### D. Investment Banking & Consulting (McKinsey/BCG)

- **Superpower:** **Action-Oriented Synthesis.**
- **Why:** Clients pay for results, not transcripts.
- **Technique:** **The "So What?" Hierarchy.** Notes are organized by strategic implication, not chronology. Action items are aggressive (Owner, Deadline, Deliverable).
- **Lesson for FDD:** The "Follow-Ups" section must be a project management tool, not just a list. Use a "Traffic Light" system for Risks (High/Med/Low).

### E. Science (Lab Notebooks)

- **Superpower:** **Data Integrity (ALCOA).**
- **Why:** Reproducibility is the bedrock of science.
- **Technique:** **ALCOA** (Attributable, Legible, Contemporaneous, Original, Accurate). Never obscure an error; strike-through and initial.
- **Lesson for FDD:** The **Numbers Registry**. A dedicated section that catalogs every single number mentioned, ensuring no "orphan data" exists.

---

## 4. Template Architecture: Structural Patterns

The optimal structure for FDD notes is a **Hybrid Model**: Topical Hierarchy with Chronological Evidence.

**Recommended Hierarchy:**

1.  **Meta-Header:** High-level context (Deal, Date, Attendees).
2.  **Executive Snapshot (BLUF):** The 3-5 things that matter most (Risks, Deal-Breakers).
3.  **Topic Modules (The Core):**
    - _Module Header:_ Topic Name (e.g., "Revenue").
    - _Snapshot:_ 2-sentence summary.
    - _Evidence Log:_ Bulleted facts, anchored to timecodes.
    - _QoE Flags:_ Specific call-outs for adjustments.
4.  **Cross-Cutting Sections:**
    - _Risks & Red Flags_ (Ranked).
    - _Follow-Ups / Open Items_ (Table).
    - _Numbers Registry_ (Data Integrity).
    - _Contradictions Log_ (Conflict Resolution).

---

## 5. Attribution and Source Discipline

**The "Golden Rule" of FDD Notes:**

> _If it isn't anchored, it didn't happen._

**Best Practices:**

- **Inline Citation:** `[Timecode] Speaker: "Quote"`
  - _Example:_ `[00:14:22] CFO: "We expect Q4 to be soft due to seasonality."`
- **Verbatim Anchors:** Use direct quotes for **key assertions** (e.g., "one-time," "non-recurring," "guaranteed").
- **The "Sic" Rule:** If a speaker makes a mistake, record it as said (or note the correction), do not silently fix it. This preserves the integrity of the record regarding management's competence or confusion.

---

## 6. Quantitative Data: Capturing Numbers Right

FDD is about the numbers. Notes must treat them with scientific rigor.

**Standards:**

- **Normalization:** Convert "5 mil" to `$5.0M`. Convert "50 bips" to `0.50%` or `50 bps`.
- **Periodicity:** Always attach the period. `$5.0M` is useless; `$5.0M (FY23 Revenue)` is valuable.
- **The "Numbers Registry":** A specific table at the end of the document that scrapes all numeric values.
  - _Columns:_ Timecode | Speaker | Value | Metric | Period | Context
  - _Why:_ Allows analysts to quickly "tie out" the notes to the Excel databook.

---

## 7. Action Items & Accountability

Consulting-style "Next Steps" are superior to generic "To-Dos."

**The "Who-What-When" Matrix:**
| Action Item | Owner (Name/Role) | Due Date | Priority | Source |
| :--- | :--- | :--- | :--- | :--- |
| Provide monthly AR aging | John Doe (Controller) | 11/25/25 | High | [00:45:00] |

- **Distinguish:**
  - **Follow-Up:** A request for data/docs.
  - **Open Item:** A conceptual question that wasn't answered.
  - **To-Do:** An internal task for the deal team.

---

## 8. Recommended Template Structure for FDD Notes

Based on this research, here is the optimal structure for the `DealNotes_Template.md`.

### **Section 1: The "Face Sheet" (Context)**

- **Meeting Metadata:** Date, Deal Code, Attendees (Role/Company).
- **Disclaimer:** "Confidential - FDD Work Product."

### **Section 2: Executive Brief (Intelligence Style)**

- **BLUF:** 3-5 bullet points summarizing the net impression of the call.
- **Critical Risks:** The "Red Flags" that could kill the deal.

### **Section 3: Topic Modules (The Meat)**

- _Repeat for each topic (Revenue, COGS, etc.)_
  - **Topic Header**
  - **Executive Snapshot:** 2-3 sentences (Objective summary).
  - **Detailed Evidence:**
    - `[Time] Speaker:` Fact / Figure / Assertion.
    - `**TAG:**` (e.g., **RISK**, **ADJUSTMENT**, **POLICY**)
  - **Key Figures Table:** Quick view of numbers in this section.

### **Section 4: The "Control Room" (Tables)**

- **Follow-Up Tracker:** (Who/What/When).
- **QoE Adjustment Log:** Potential add-backs/deductions identified.
- **Contradictions:** "CFO said X at [00:10], but Controller said Y at [00:40]."

### **Section 5: The "Black Box" (Raw Data)**

- **Numbers Registry:** The complete catalog of every digit spoken.
- **Glossary:** Acronyms or system names mentioned.

---

## 9. Quality Checklist: Validating Excellence

Before finalizing notes, the AI (or human) must pass this "Flight Check":

1.  **The "Ctrl+F" Test:** Can I find every number mentioned in the transcript in the notes? (Target: 95%+)
2.  **The "Anchor" Test:** Does every single bullet point have a timecode?
3.  **The "Inference" Test:** Are there any adjectives like "good," "strong," or "worrying" that aren't in quotes? (If so, remove them).
4.  **The "Action" Test:** Do all follow-ups have an owner?
5.  **The "Silence" Test:** Did we capture what was _not_ said? (e.g., "CFO declined to answer regarding Q4 forecast").

---

## 10. Conclusion

To build the "Deal-Notes" GPT, we are essentially building a **digital court reporter with an MBA**. The system must possess the **ear** of a stenographer (verbatim accuracy) and the **brain** of a consultant (synthesis and structure). By adopting the **BLUF** from intelligence, the **Evidence Anchoring** from law, and the **Data Integrity** from science, we can create a note-taking engine that is not just "good," but **audit-ready and deal-driving**.
