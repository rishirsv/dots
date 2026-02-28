---
id: meeting-intelligence
title: "Meeting Intelligence"
doc: spec
---

# Feature: Meeting Intelligence

## TL;DR
- **Problem:** Manual note-taking from 90+ minute business calls takes 2-3 hours and misses critical details, figures, and follow-ups.
- **Solution:**
  - GPT/Custom Assistant that transforms pasted transcripts into exhaustive, source-anchored notes
  - Two meeting templates: FDD (Financial Due Diligence) and General Business
  - Analyst notes add industry context and best practices (clearly distinguished from transcript content)
  - For FDD calls: optional Draft Adjustments Memo generation

## What We're Building

A standalone GPT/Custom Assistant called **Meeting Intelligence** that produces exhaustive, source-anchored meeting notes. Users paste raw transcripts and receive comprehensive markdown notes with:

- Every speaker turn attributed (no timestamps - speaker names only)
- All figures, dates, and proper nouns captured
- Material assertions preserved as verbatim quotes
- Risks, follow-ups, and open items explicitly tagged
- Gaps and contradictions flagged (not hidden)
- **💡 Insights** - industry context, best practices, or relevant insights in clearly marked sections

The output is working notes optimized for downstream use (report drafting, action tracking, QoE analysis) - not polished client deliverables.

### Core Behaviors

The assistant follows these strict behaviors:
- Produces exhaustive, source-anchored meeting notes
- Captures facts verbatim with speaker attribution
- Never infers or editorializes on transcript content
- Adds industry context in clearly marked `**💡 Insights:**` sections

## User Stories

### User Story 1 — Process FDD Call Transcript
- As an **FDD associate**, I want to paste a management call transcript and receive structured QoE meeting notes so that I can focus on analysis instead of transcription.

### User Story 2 — Generate Adjustments Memo
- As an **FDD associate**, I want to generate a Draft Adjustments Memo from my FDD notes so that I have a starting point for identifying QoE adjustments with evidence citations.

### User Story 3 — Process General Business Meeting
- As a **professional**, I want to paste a general meeting transcript and receive organized notes with decisions, action items, and discussion points so that I have a reliable record without manual effort.

### User Story 4 — Handle Messy Transcripts
- As a **user with imperfect transcripts**, I want the assistant to extract maximum value from low-quality input and clearly flag gaps so that I still get useful notes rather than an error.

### User Story 5 — Research Enrichment
- As a **user**, I want the assistant to add relevant industry context or best practices to my notes so that I have additional perspective beyond what was discussed, clearly distinguished from the transcript content.

## Requirements

- [ ] Accept pasted transcript text (WebVTT format, plain text, or raw paste)
- [ ] Detect meeting type via decision tree or prompt user to specify
- [ ] Support transcripts from 90+ minute calls (chunking strategy for context limits)
- [ ] Infer speaker identities from transcript context (introductions, role mentions)
- [ ] Apply template-specific extraction rules
- [ ] Output markdown notes optimized for long-form detail (10+ pages for 90-min calls)
- [ ] Tag inline: `**RISK:**`, `**FOLLOW-UP:**`, `**OPEN ITEM:**`, `**Candidate QoE Adjustment:**`, `**💡 Insights:**`
- [ ] Attribution by speaker name only (no timestamps in output)
- [ ] Flag gaps, contradictions, and low-confidence extractions prominently
- [ ] Add context notes clearly marked as `**💡 Insights:**`
- [ ] For FDD template: prompt user to generate Draft Adjustments Memo after notes
- [ ] Generate Adjustments Memo using only evidence from notes (no inference)
- [ ] Include completed notes examples in system prompt for few-shot learning

## How It Works

### Input Processing

The assistant accepts raw transcript text pasted into chat. It handles multiple formats:
- **WebVTT with timestamps** (e.g., `00:00:04.806 --> 00:00:06.446 <v Finance Director>...`) - timestamps stripped from output but used as anchors for contradictions/gaps
- **Plain speaker-labeled text** - direct processing
- **Messy auto-transcription** - best-effort extraction with gap flagging

**Speaker normalization:** The model normalizes speaker labels when identity is clear from introductions (e.g., `<v Manager A>` → "Manager A (Target CFO)").

**Optional context injection:** Users can provide deal context:
```
Deal: Mid-market SaaS, $50m revenue, buy-side FDD for PE sponsor.
Meeting type: FDD.
```
The model uses context only to interpret the transcript, not to invent facts.

For calls exceeding context limits, the assistant processes in chunks while maintaining topic continuity and cross-referencing across sections.

### Template Selection (Decision Tree)

On receiving a transcript, the assistant uses the following decision tree to detect meeting type:

```
Is this transcript about...?
│
├─ Financial due diligence, M&A, QoE, management call with CFO/Controller?
│  └─ → FDD Template
│
├─ Internal meeting, project update, team sync, planning?
│  └─ → General Business Template
│
└─ Unclear from context
   └─ → Ask user: "What type of meeting is this? (1) FDD/Due Diligence (2) General Business"
```

Each template defines:
- **Topic structure** (e.g., FDD: Revenue, COGS, SG&A, Working Capital, etc.)
- **Extraction priorities** (e.g., FDD: figures, adjustments, risks)
- **Tagging rules** (which inline tags apply)
- **Output sections** (what appears in final notes)
- **Context prompts** (what industry/market context to add)

### Core Workflow (Stages A-D)

The model follows a structured internal workflow:

**Stage A – Classify Meeting Type**
- Identify deal context, main parties, and high-level agenda from early minutes
- Apply decision tree to select template

**Stage B – Extract Atomic Facts**
- Internally list all numeric statements with speaker + context
- List all explicit risks/concerns
- List all explicit follow-ups, owners, and timelines

**Stage C – Compose Notes**
- Use the selected template to organize output
- Apply BLUF, topic modules, control tables
- Tag actions, open items, contradictions

**Stage D – Flight Check**
- Before final output, silently verify:
  - Have I captured almost every important number?
  - Can each bullet be justified by a transcript statement?
  - Are there adjectives/judgements outside quotes or 💡 Insights blocks? Remove/reframe.
  - Does each follow-up have an owner or "Owner not specified"?
  - Did I capture questions that were dodged/unanswered?

### Extraction Rules

- **Zero inference on transcript content** - only capture what was explicitly stated
- **Speaker attribution required** - every bullet tied to a speaker name
- **No timestamps in output** - cleaner notes, attribution by speaker only
- **Verbatim quotes for key assertions** - preserve exact language for material claims
- **💡 Insights notes are additive** - clearly separated from transcript facts

### 💡 Insights (Research Enrichment)

After extracting transcript content, the assistant adds value through industry knowledge:

**For FDD calls:**
- Industry benchmarks or norms (e.g., "typical DSO for this industry is 30-45 days")
- Common QoE adjustment patterns
- Red flags based on stated facts

**For General Business:**
- Best practices for discussed topics
- Framework suggestions for decisions
- Risk considerations

**Formatting:** 💡 Insights notes are always marked with `**💡 Insights:**` prefix and grouped in dedicated subsections to clearly distinguish from transcript content.

**Critical guardrail:** 💡 Insights can interpret industry norms but CANNOT back-fill missing facts about this company. If transcript omits DSO, context should say "typical DSO is X" NOT "Company's DSO is X."

### Output Generation

Notes are rendered as clean markdown with hierarchical structure. Dense bullet points with attribution take priority over prose summaries. The assistant errs toward inclusion - capturing more context rather than over-summarizing. Default to **detailed** notes: 10+ pages for a 90-minute call is preferred. Avoid over-compressing; preserve nuance and quotes.

Gaps are explicitly called out with `**OPEN ITEM:**` or `[Gap: ...]` notation rather than silently omitted. The "Silence Test" captures notable non-answers as evidence of risk/uncertainty.

For FDD calls, after notes are complete, the assistant asks: "Generate Draft Adjustments Memo?" If yes, it produces a separate artifact extracting all `**Candidate QoE Adjustment:**` items with evidence blocks, calculation guidance, and quantification status.

## Templates

### Template 1: Financial Due Diligence (FDD)

**Use case:** Management calls for Quality of Earnings analysis

**Topic Structure:**
- BLUF (3-6 bullets)
- Attendees & Roles
- Deal Context
- Revenue & RCM
- COGS & Gross Margin
- Opex / SG&A
- Working Capital
- KPIs & Cohorts
- Non-GAAP / Adjustments
- Risks & Red Flags
- Follow-Ups & Open Items (table: Item | Owner | Priority)
- Contradictions & Gaps
- 💡 Insights (industry context, benchmarks, red flags)

**Special Tags:** `**FIGURE:**`, `**Candidate QoE Adjustment:**`, `**POLICY:**`, `**RISK:**`, `**FOLLOW-UP:**`, `**OPEN ITEM:**`, `**💡 Insights:**`

**Post-Processing:** Prompt for Adjustments Memo generation

### Template 2: General Business Meeting

**Use case:** Internal meetings, project discussions, planning sessions

**Topic Structure:**
- BLUF (3-6 bullets)
- Attendees
- Meeting Purpose / Context
- Agenda Items
- Key Discussion Points (by topic, attributed)
- Decisions (with rationale and owner)
- Action Items (table: Action | Owner | Due)
- Open Questions / Parking Lot
- Next Steps
- 💡 Insights (best practices, frameworks, considerations)

**Special Tags:** `**DECISION:**`, `**ACTION:**`, `**OPEN ITEM:**`, `**RISK:**`, `**💡 Insights:**`

**Post-Processing:** None

## Guardrails

### Observation vs Interpretation

Strict separation between transcript facts and added context:

- **Observation (transcript content):** Company-specific statements (numbers, policies, events). Must be traceable to transcript. Every non–Helpful-Context bullet MUST trace to an actual statement.
- **Interpretation (💡 Insights):** Only allowed in clearly labeled `**💡 Insights:**` sections. Must be general industry context, not company-specific claims. Example: "In B2B SaaS, typical churn is..." is acceptable. "Company X's churn seems high" is NOT acceptable.

### Contradiction & Gap Handling

- When two statements conflict (e.g., two different revenue numbers), do NOT pick one
- Note both statements with sources in the relevant topic section
- Add to `Contradictions & Gaps` section: "Contradiction — Revenue FY24: CFO said $X; Controller later referred to ~$Y. Evidence is inconsistent."
- For missing information, add a `Gap` bullet: "CFO declined to share Q4 forecast."
- **Silence Test:** Capture notable non-answers as evidence of risk/uncertainty

### Numeric Discipline

- Every number must include: **unit** (USD, months, headcount), **period** (FY24, Q3 2025), **direction** (if relevant—"up from", "down from")
- Use control tables for clusters of related figures
- Example: "Revenue was $12M" → "Revenue was $12M USD (FY24), up from $9M (FY23)"

### Flight Check

Before producing final output, silently verify:
1. **Numbers:** Have I captured almost every important number mentioned?
2. **Anchors:** Can each bullet be justified by some transcript statement?
3. **Inference:** Are there any adjectives or judgements outside quotes or 💡 Insights blocks? Remove or reframe.
4. **Action items:** Does each follow-up have an owner or say "Owner not specified"?
5. **Silence:** Did I capture any important questions that were dodged or left unanswered?

### Detail Bias

- Default to detailed notes. 10+ pages for 90-minute call is preferred.
- Avoid over-compressing; preserve nuance and quotes over summarizing.
- This counters the default "short summary" tendency in AI note tools.

## System Prompt Structure (~8k characters)

The system prompt is a thin, ruthless brainstem. Verbose or domain-heavy content goes into knowledge files.

| Section | Content | Target Size |
|---------|---------|-------------|
| 1. Core Behaviors & Success Criteria | Behavior definition (exhaustive, source-anchored, no inference, 💡 Insights marked), audience, success snapshot | 600-900 chars |
| 2. Non-Goals & Constraints | No invented facts, no smoothed contradictions, speaker names only, 💡 Insights for general context only | 400-600 chars |
| 3. Input & Meeting-Type Classification | Expected formats (WebVTT), compressed decision tree (FDD vs General Business), ambiguous case handling | 900-1200 chars |
| 4. Core Workflow (Stages A-D) | Classify, extract atomic facts, structure notes, flight check | 1200-1500 chars |
| 5. Template Skeletons | Compressed section lists for FDD and General Business | 1400-1800 chars |
| 6. Tagging Rules & Style | Universal and template-specific tags, speaker attribution format, markdown style | 800-1000 chars |
| 7. FDD Adjustments Memo Hook | Post-notes prompt, extraction rules, brief memo structure | 400-600 chars |
| 8. Hard Guardrails | Uncertainty handling, no external knowledge for deal facts, traceability requirement | 300-500 chars |

## Knowledge Files

4-6 focused files, each <3-4k tokens, with clear headings for retrieval.

| File | Purpose |
|------|---------|
| `fdd-template-detailed.md` | Expanded FDD guidance per section, DOs/DON'Ts, example subsection with 3-4 bullets and figures table |
| `fdd-adjustments-memo-template.md` | Memo sections (overview, summary table, detail blocks), evidence block structure, quantification rules |
| `general-business-template.md` | Sections, guidance, alignment with PM best practices |
| `fdd-glossary-and-tagging-rules.md` | QoE, DSO, WC, EBIT/EBITDA definitions; when to apply each tag (`**RISK:**` vs `**OPEN ITEM:**` vs `**FOLLOW-UP:**`) |

## Examples Strategy

### Fully Worked Examples (Knowledge Files)
- **FDD:** 6-8 page notes from Project Lebron (anonymized). Demonstrates all FDD tags, topic sections, 💡 Insights, and non-trivial Contradictions & Gaps section. Gold standard style guide.
- **General Business:** 1-2 pages emphasizing decisions, action items with owners, discussion points.

### System Prompt Examples
- Tiny excerpts only (5-10 bullets from FDD example)
- Bulk of examples live in knowledge files to preserve context space

### Bad-vs-Good Examples
Pairs of short snippets teaching style boundaries:

**BAD:**
- Chronological dump without topic organization
- Missing units on numbers ("revenue was 12")
- Adjectives not in quotes ("impressive growth")
- No tags

**GOOD:**
- Topic-first organization
- Tagged bullets (`**FIGURE:** Revenue: $12M USD (FY24)`)
- Neutral language, quotes for subjective statements
- Tables summarizing clusters of numbers

System prompt instruction: "Avoid notes that look like the 'Bad Example'; emulate the 'Good Example' style."

## Testing Strategy

### Benchmark Transcript Set (10-14 transcripts)
- 4-6 real FDD transcripts (anonymized, including Project Lebron)
- 3-4 synthetic General Business transcripts
- 2-4 edge-case synthetics:
  - Contradictory numbers
  - Messy overlapping dialogue
  - Truncated sections
  - Very short/sparse content

### Evaluation Rubric (1-5 scoring)

| Criterion | Description |
|-----------|-------------|
| 1. Completeness | Numeric capture rate, topic coverage |
| 2. Structure | Topic modules, control tables, BLUF presence |
| 3. Actionability | Owners assigned, deadlines captured, follow-ups clear |
| 4. Data integrity | Units, periods, context for all numbers |
| 5. Clarity | BLUF quality, readability, organization |

### Stress Tests

| Test | Input | Expected Behavior |
|------|-------|-------------------|
| No-data test | Very short transcript with almost no content | Repeated "not discussed", no invented facts |
| Trap test | Incomplete number ("roughly 20-30%") without context | Verbatim repetition, not firmed up falsely |
| Research-enrichment test | Transcript omits DSO | Analyst note says "typical DSO" not "Company's DSO" |
| Contradiction test | Two different revenue figures stated | Both captured, flagged in Contradictions section |

### Regression Testing
- Retest benchmark set on any system prompt, example, or knowledge file change
- Compare hallucination incidents, topic coverage, rubric scores
- Document in Prompt Change Log

## Acceptance Criteria

### Core Functionality
- Given a pasted FDD transcript, when processed, then output contains all topic sections with attributed bullets (no timestamps)
- Given a 90-minute transcript, when processed, then output is 10+ pages of detailed notes (not a summary)
- Given a transcript with unclear speakers, when processed, then speakers are inferred from context or marked as `[Unknown Speaker]`

### Template Detection
- Given a transcript mentioning "due diligence", "QoE", "CFO", "EBITDA", when processed, then FDD template is auto-selected
- Given a transcript mentioning "internal", "project update", "team sync", when processed, then General Business template is auto-selected
- Given an ambiguous transcript, when processed, then user is prompted to select meeting type

### Quality Standards
- Given a transcript with 50 numeric mentions, when processed, then at least 95% of figures appear in notes with context
- Given a transcript with contradictory statements, when processed, then both statements are captured with sources and flagged as contradiction
- Given a low-quality transcript with gaps, when processed, then gaps are explicitly flagged rather than silently omitted

### 💡 Insights
- Given any processed transcript, when notes are generated, then context notes appear in dedicated section(s) marked with `**💡 Insights:**`
- Given FDD notes with revenue discussion, when context notes are added, then industry benchmarks or common patterns are included
- Given transcript facts and 💡 Insights notes, when reading notes, then it is always clear which is which
- Given a transcript missing a KPI, when context notes are added, then they provide general industry context, NOT a company-specific value

### Adjustments Memo (FDD only)
- Given FDD notes with 5 `**Candidate QoE Adjustment:**` tags, when Adjustments Memo is requested, then memo contains 5 adjustment sections with evidence blocks
- Given an adjustment candidate without stated figures, when memo is generated, then quantification status shows "Not quantified on call" with specific data request

## Additional Guidance

### Multi-Meeting Workflows
- Include deal identifier at top of notes if user provides
- Consistent tag usage enables downstream parsing across calls (e.g., "Show me all Candidate QoE Adjustments from management calls 1-3")

### User Prompts / UX
Provide canned starter prompts per meeting type:

**FDD:**
> "I'm pasting an FDD management call transcript. Deal: [description]. Meeting type: FDD. Please produce detailed notes using the FDD template: BLUF, topic sections, risks, follow-ups, contradictions, and 💡 Insights. Then, ask me whether to generate a Draft Adjustments Memo."

**General Business:**
> "I'm pasting an internal meeting transcript. Meeting type: General Business. Please produce notes with decisions, action items, discussion points, and 💡 Insights where helpful."

### Redaction & Anonymization
- Encourage users to anonymize sensitive content before pasting
- GPT description should include: "Please ensure you have authority to paste this transcript; anonymize where necessary."

### Context Limits
- For very long transcripts, suggest chunking:
  - Part 1 → notes
  - Part 2 → "augment existing notes above using same structure"
- With modern context windows this may rarely be needed

## Context

- **Related code/files:**
  - `chatgpt/meeting-intelligence/meeting-intelligence.md` — Original instructions (v1.0)
  - `chatgpt/meeting-intelligence/fdd-template.md` — FDD template reference
  - `chatgpt/meeting-intelligence/adjustments-memo-guidance.md` — Adjustments Memo rules
  - `chatgpt/meeting-intelligence/adjustments-memo-template.md` — Memo output format
  - `chatgpt/meeting-intelligence/docs/research.md` — Quality framework research

- **Constraints:**
  - System prompt must be <8k characters; detailed guidance goes in knowledge files
  - Must handle GPT context limits (chunking for long transcripts)
  - Zero inference policy on transcript content (analyst notes are separate)
  - Speaker identification is best-effort, not guaranteed
  - Examples in system prompt consume tokens - only include tiny excerpts; bulk in knowledge files

- **Future Work (out of scope for v1):**
  - Numbers Registry table
  - File upload support (.vtt, .docx)
  - Direct Notion/Google Docs export
  - Additional meeting templates (1:1, Sprint Planning, Retrospective, Customer/Sales)
  - Integration with transcription services
  - Timestamp preservation option
  - Cross-meeting aggregation and querying
