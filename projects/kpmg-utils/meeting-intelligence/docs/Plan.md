# Implementation Plan: Meeting Intelligence

**Spec:** `chatgpt/meeting-intelligence/docs/spec-meeting-intelligence.md`
**Branch:** `feat/meeting-intelligence`

## Description

Build a standalone GPT/Custom Assistant called **Meeting Intelligence** that transforms pasted meeting transcripts into exhaustive, source-anchored notes. Users paste a transcript, the system detects meeting type (FDD or General Business), extracts all details with speaker attribution, adds analyst research notes, and outputs comprehensive markdown notes. For FDD calls, optionally generates a Draft Adjustments Memo.

---

## Tasks

### Phase 0: Input & Assumptions

Establish foundational assumptions about input format, context injection, and non-goals before building the system prompt.

- [ ] 0.0 **Define input format assumptions**
  - [ ] 0.1 Document expected transcript format (WebVTT-style with `<v Speaker>` tags and timestamps like Project Lebron)
  - [ ] 0.2 Add system prompt instruction: ignore timestamps semantically, but use as anchors for contradictions/gaps
  - [ ] 0.3 Add speaker normalization rule (e.g., `<v Manager A>` → "Manager A (Target CFO)" when identity is clear from introductions)
  - [ ] 0.4 Validate: Test with WebVTT, plain text, and messy auto-transcription formats

- [ ] 1.0 **Define meeting-context injection**
  - [ ] 1.1 Add optional user context prompt: `Deal: [description]. Meeting type: [type].`
  - [ ] 1.2 Add instruction: "Use context only to interpret transcript, not to invent facts"
  - [ ] 1.3 Validate: Context enhances output without introducing hallucinations

- [ ] 2.0 **Codify non-goals and zero-inference culture**
  - [ ] 2.1 Add explicit non-goals list to system prompt (no editorializing, no guesses on numbers, no invented history)
  - [ ] 2.2 Add strict rule: "Every non-Analyst-Note bullet MUST trace to an actual statement"
  - [ ] 2.3 Add rule: "If unsure whether something was said, err on exclusion or flag as `[Gap: unclear]`"
  - [ ] 2.4 Validate: Review against research doc principles

### Phase 1: Core System Prompt

Build the foundational system prompt with behavior definition, workflow stages, decision tree, and extraction rules.

- [ ] 3.0 **Create base system prompt file**
  - [ ] 3.1 Create `chatgpt/meeting-intelligence/system-prompt.md` with behavior-first definition (no persona metaphor)
- [ ] 3.2 Core behaviors: "You produce exhaustive, source-anchored meeting notes. You capture facts verbatim with speaker attribution. You never infer or editorialize. You add industry context in clearly marked 💡 Insights sections."
  - [ ] 3.3 Add audience definition: FDD associates/managers; working notes, not client deliverables
  - [ ] 3.4 Add success criteria snapshot (10+ pages for 90-min call, ~all numbers captured, no invented facts, contradictions surfaced)
  - [ ] 3.5 Validate: Behaviors anchor output quality appropriately

- [ ] 4.0 **Add workflow stages (A-D)**
  - [ ] 4.1 Stage A: Classify meeting type (decision tree)
  - [ ] 4.2 Stage B: Extract atomic facts internally (numbers, entities, risks, actions per topic)
  - [ ] 4.3 Stage C: Compose notes using selected template
  - [ ] 4.4 Stage D: Run Flight Check before final output
  - [ ] 4.5 Validate: Output shows evidence of following stages (presence of BLUF, Gap/Contradiction sections, etc.)

- [ ] 5.0 **Add decision tree for template selection**
  - [ ] 5.1 FDD triggers: due diligence, QoE, CFO/Controller, buy-side/sell-side, EBITDA
  - [ ] 5.2 General Business triggers: internal sync, planning, project update, team meeting
  - [ ] 5.3 Ambiguous case: Ask user to pick 1-2
  - [ ] 5.4 Validate: Decision tree correctly routes sample phrases

- [ ] 6.0 **Add core extraction rules**
  - [ ] 6.1 Zero inference on transcript content
  - [ ] 6.2 Speaker attribution required (every bullet tied to speaker name)
  - [ ] 6.3 No timestamps in output
  - [ ] 6.4 Verbatim quotes for material assertions
  - [ ] 6.5 Validate: Rules are unambiguous and enforceable

### Phase 2: Template Definitions

Define both meeting templates with topic structures, tags, and output formats. Keep skeletons in system prompt, detailed guidance in knowledge files.

- [ ] 7.0 **Define FDD Template**
- [ ] 7.1 Add FDD skeleton to system prompt (BLUF, Attendees, Deal Context, Revenue, COGS, SG&A, Working Capital, KPIs, Non-GAAP/Adjustments, Risks, Follow-Ups, Contradictions & Gaps, 💡 Insights)
- [ ] 7.2 Define FDD-specific tags (`**FIGURE:**`, `**Candidate QoE Adjustment:**`, `**POLICY:**`, `**RISK:**`, `**FOLLOW-UP:**`, `**OPEN ITEM:**`, `**💡 Insights:**`)
  - [ ] 7.3 Add FDD post-processing instruction (prompt for Adjustments Memo)
  - [ ] 7.4 Create `knowledge/fdd-template-detailed.md` with expanded guidance per section
  - [ ] 7.5 Validate: Template structure aligns with `fdd-template.md` reference

- [ ] 8.0 **Define General Business Template**
- [ ] 8.1 Add General Business skeleton to system prompt (BLUF, Attendees, Purpose, Agenda, Key Discussion Points, Decisions, Action Items, Open Questions, Next Steps, 💡 Insights)
- [ ] 8.2 Define General Business tags (`**DECISION:**`, `**ACTION:**`, `**OPEN ITEM:**`, `**RISK:**`, `**💡 Insights:**`)
  - [ ] 8.3 Create `knowledge/general-business-template.md` with detailed guidance
  - [ ] 8.4 Validate: Template covers standard meeting output needs (mirrors Otter/PM best practices)

### Phase 3: Research Enrichment

Add guidance for adding analyst notes with industry context and insights, with strict guardrails.

- [ ] 9.0 **Add research enrichment instructions**
  - [ ] 9.1 Define when to add analyst notes (after transcript extraction, per-template)
  - [ ] 9.2 Add FDD enrichment prompts (industry benchmarks, QoE patterns, red flags based on stated facts)
  - [ ] 9.3 Add General Business enrichment prompts (best practices, frameworks, risk considerations)
- [ ] 9.4 Add formatting rule: always prefix with `**💡 Insights:**` and group in dedicated sections
  - [ ] 9.5 Validate: Analyst notes are clearly distinguishable from transcript content

- [ ] 10.0 **Add enrichment guardrails**
  - [ ] 10.1 Explicit rule: "Do NOT back-fill missing facts about this company"
  - [ ] 10.2 Enrichment can interpret industry norms, NOT fill missing numbers or statements
  - [ ] 10.3 Add test case: Transcript omits DSO → analyst note should say "typical DSO is X" not "Company's DSO is X"
  - [ ] 10.4 Validate: Run trap test with intentionally omitted KPI

### Phase 4: Few-Shot Examples

Create completed notes examples to embed in system prompt and knowledge files. Include both good examples and bad-vs-good contrasts.

- [ ] 11.0 **Create FDD example (fully worked)**
  - [ ] 11.1 Create `chatgpt/meeting-intelligence/examples/fdd-example.md` using anonymized Project Lebron transcript excerpt
  - [ ] 11.2 Target 6-8 pages demonstrating all FDD tags, topic sections, and analyst notes
  - [ ] 11.3 Include non-trivial Contradictions & Gaps section
  - [ ] 11.4 Add tiny excerpt (5-10 bullets) to system prompt; full version in knowledge file
  - [ ] 11.5 Validate: Example serves as gold standard style guide

- [ ] 12.0 **Create General Business example**
  - [ ] 12.1 Create `chatgpt/meeting-intelligence/examples/general-business-example.md` with synthetic meeting notes
  - [ ] 12.2 Target 1-2 pages demonstrating decisions, action items with owners, discussion points, analyst notes
  - [ ] 12.3 Add small slice to system prompt; bulk in knowledge file
  - [ ] 12.4 Validate: Example emphasizes actionability

- [ ] 13.0 **Create bad-vs-good examples**
  - [ ] 13.1 Create `chatgpt/meeting-intelligence/examples/bad-vs-good-snippets.md`
  - [ ] 13.2 Include "BAD" examples: chronological dump, missing units, adjectives not in quotes, no tags
  - [ ] 13.3 Include "GOOD" corrections: topic-based, tagged, neutral language, quotes for subjective bits
  - [ ] 13.4 Add instruction to system prompt: "Avoid notes like 'Bad Example'; emulate 'Good Example'"
  - [ ] 13.5 Validate: Contrasting examples guide style strongly

### Phase 5: Adjustments Memo

Add FDD-specific Adjustments Memo generation workflow.

- [ ] 14.0 **Integrate Adjustments Memo generation**
  - [ ] 14.1 Create `knowledge/fdd-adjustments-memo-template.md` with full memo structure
  - [ ] 14.2 Add workflow to system prompt: after FDD notes, prompt "Generate Draft Adjustments Memo?"
  - [ ] 14.3 Add extraction logic: pull all `**Candidate QoE Adjustment:**` items into memo format
  - [ ] 14.4 Add evidence block structure (verbatim quote, speaker, reason, calculation steps, inputs, quantification status)
  - [ ] 14.5 Add rule: "If magnitude not mentioned, say 'Not quantified on call.'"
  - [ ] 14.6 Validate: Memo only uses evidence from notes, never infers

### Phase 6: Guardrails & Flight Check

Implement explicit guardrails for detail, alignment, hallucination control, and conflict resolution.

- [ ] 15.0 **Add observation vs interpretation separation**
  - [ ] 15.1 Define "Observation" (company-specific, traceable to transcript)
  - [ ] 15.2 Define "Interpretation" (only in 💡 Insights sections, must be general)
  - [ ] 15.3 Add rule: 💡 Insights can be "In B2B SaaS, typical churn is..." NOT "Company X's churn seems high"
  - [ ] 15.4 Validate: Clear boundary enforced in output

- [ ] 16.0 **Add contradiction and gap handling**
  - [ ] 16.1 Rule: When statements conflict, do NOT pick one; note both with sources
  - [ ] 16.2 Add `Contradictions & Gaps` section requirement
  - [ ] 16.3 Add "Silence Test": capture notable non-answers as evidence of risk/uncertainty
  - [ ] 16.4 Validate: Contradictory transcript produces flagged output

- [ ] 17.0 **Add numeric discipline**
  - [ ] 17.1 Rule: Every number must include unit, period, and direction (if relevant)
  - [ ] 17.2 Encourage control tables for key figures
  - [ ] 17.3 Validate: Numbers in output have full context

- [ ] 18.0 **Add Flight Check**
  - [ ] 18.1 Add "Before final answer, silently run Flight Check" instruction
  - [ ] 18.2 Check: Have I captured almost every important number?
  - [ ] 18.3 Check: Can each bullet be justified by a transcript statement?
  - [ ] 18.4 Check: Are there adjectives/judgements outside quotes or 💡 Insights? Remove/reframe.
  - [ ] 18.5 Check: Does each follow-up have an owner or "Owner not specified"?
  - [ ] 18.6 Check: Did I capture questions that were dodged/unanswered?
  - [ ] 18.7 Validate: Flight Check improves output quality measurably

- [ ] 19.0 **Add detail bias**
  - [ ] 19.1 Rule: "Default to detailed notes. 10+ pages for 90-min call is preferred."
  - [ ] 19.2 Rule: "Avoid over-compressing; preserve nuance and quotes over summarizing"
  - [ ] 19.3 Validate: Output counters default "short summary" tendency

### Phase 7: Knowledge Files

Create focused knowledge files to support the system prompt without bloating it.

- [ ] 20.0 **Create knowledge file structure**
  - [ ] 20.1 Create `knowledge/fdd-template-detailed.md` (expanded FDD guidance per section)
  - [ ] 20.2 Create `knowledge/fdd-adjustments-memo-template.md` (memo sections and rules)
  - [ ] 20.3 Create `knowledge/general-business-template.md` (sections, DOs/DON'Ts)
  - [ ] 20.4 Create `knowledge/fdd-glossary-and-tagging-rules.md` (QoE, DSO, tag usage rules)
  - [ ] 20.5 Validate: Each file is <3-4k tokens, focused, with clear headings

### Phase 8: GPT Configuration

Create the GPT in OpenAI's GPT builder with final system prompt and knowledge files.

- [ ] 21.0 **Configure GPT**
  - [ ] 21.1 Create new GPT in OpenAI GPT builder
  - [ ] 21.2 Set name: "Meeting Intelligence"
  - [ ] 21.3 Set description: "Transform meeting transcripts into exhaustive, source-anchored notes with analyst insights"
  - [ ] 21.4 Paste compiled system prompt from `system-prompt.md` (target <8k characters)
  - [ ] 21.5 Upload all knowledge files
  - [ ] 21.6 Configure conversation starters with canned prompts per meeting type
  - [ ] 21.7 Test with sample FDD transcript (`Project Lebron - FDD.anonymized.txt`)
  - [ ] 21.8 Test with synthetic General Business transcripts
  - [ ] 21.9 Iterate on prompt based on output quality

### Phase 9: Validation & Evaluation

Build proper evaluation matrix and benchmark set for systematic testing.

- [ ] 22.0 **Build benchmark transcript set**
  - [ ] 22.1 Collect 4-6 anonymized FDD transcripts (including Project Lebron)
  - [ ] 22.2 Create 3-4 synthetic General Business transcripts
  - [ ] 22.3 Create edge-case synthetics: contradictory numbers, messy overlapping dialogue, truncated sections
  - [ ] 22.4 Validate: 10-14 transcripts total covering both templates and edge cases

- [ ] 23.0 **Create evaluation rubric**
  - [ ] 23.1 Create `docs/evaluation-rubric.md` with 1-5 scoring criteria
  - [ ] 23.2 Criterion 1: Completeness (esp. numeric capture)
  - [ ] 23.3 Criterion 2: Structure (topic modules, control tables, BLUF)
  - [ ] 23.4 Criterion 3: Actionability (owners, deadlines, follow-ups)
  - [ ] 23.5 Criterion 4: Data integrity (units, periods, context)
  - [ ] 23.6 Criterion 5: Clarity (BLUF quality, readability)
  - [ ] 23.7 Validate: Rubric aligns with research doc quality framework

- [ ] 24.0 **Run end-to-end validation**
  - [ ] 24.1 Test FDD: full Project Lebron transcript, verify 10+ page output with all sections
  - [ ] 24.2 Test FDD: verify Adjustments Memo generation extracts correct items
  - [ ] 24.3 Test General Business: paste synthetic transcript, verify template selection and output
  - [ ] 24.4 Test messy transcript: verify gaps are flagged, not silently omitted
  - [ ] 24.5 Test ambiguous transcript: verify user is prompted for meeting type
  - [ ] 24.6 Score each output using evaluation rubric, record in spreadsheet

- [ ] 25.0 **Stress test hallucination behavior**
  - [ ] 25.1 No-data test: very short transcript with almost no content → expect repeated "not discussed"
  - [ ] 25.2 Trap test: incomplete number ("roughly 20-30%") without context → expect verbatim repetition, not firmed up
  - [ ] 25.3 Research-enrichment test: omit DSO → analyst note says "typical DSO" not "Company's DSO"
  - [ ] 25.4 Document any prompt refinements needed

### Phase 10: Maintenance & Versioning

Establish ongoing maintenance process for prompt iteration and regression testing.

- [ ] 26.0 **Create prompt changelog**
  - [ ] 26.1 Create `docs/prompt-changelog.md` with date, change, observed effect columns
  - [ ] 26.2 Capture baseline prompt version
  - [ ] 26.3 Document each refinement with impact on Lebron + 2-3 other transcripts
  - [ ] 26.4 Validate: Changelog enables rollback if needed

- [ ] 27.0 **Establish regression testing schedule**
  - [ ] 27.1 Define trigger: retest on fixed benchmark set when system prompt, examples, or knowledge files change
  - [ ] 27.2 Compare hallucination incidents, topic coverage, rubric scores
  - [ ] 27.3 Update changelog with regression results
  - [ ] 27.4 Validate: Process prevents quality regressions

### Phase 11: Evaluations Framework

Create comprehensive evaluation infrastructure for manual testing and automated OpenAI Evals.

- [ ] 28.0 **Create evaluations folder structure**
  - [ ] 28.1 Create `chatgpt/meeting-intelligence/evaluations/` folder
  - [ ] 28.2 Create `evaluations/transcripts/` subfolder for test transcripts
  - [ ] 28.3 Create `evaluations/manual-tests/` subfolder for manual test cases
  - [ ] 28.4 Create `evaluations/automated/` subfolder for OpenAI Evals configs

- [ ] 29.0 **Create Evals-readme.md** *(VERIFICATION CHECKPOINT)*
  - [ ] 29.1 Draft `evaluations/Evals-readme.md` with full evaluation strategy
  - [ ] 29.2 Include sections: Purpose, Manual Tests, Automated Evals, Grader Design, Transcript Generation
  - [ ] 29.3 Document FDD meeting subtypes to test (management calls, accounting policy, legal/contracts, client presentations)
  - [ ] 29.4 **USER VERIFICATION**: Get user approval on README before proceeding to implementation
  - [ ] 29.5 Validate: README provides complete roadmap for evaluation work

- [ ] 30.0 **Create simulated transcripts**
  - [ ] 30.1 Analyze Project Lebron transcript to identify structural patterns (speaker cadence, topic flow, interruptions)
  - [ ] 30.2 Create `transcripts/fdd-management-call.vtt` — General FDD management call (revenue, COGS, WC discussion)
  - [ ] 30.3 Create `transcripts/fdd-accounting-policy.vtt` — Accounting policy deep-dive (rev rec, accruals, estimates)
  - [ ] 30.4 Create `transcripts/fdd-legal-contracts.vtt` — Legal/contracts review (customer agreements, litigation, contingencies)
  - [ ] 30.5 Create `transcripts/fdd-client-presentation.vtt` — Client presentation meeting (findings walkthrough, Q&A)
  - [ ] 30.6 Create `transcripts/general-business-planning.vtt` — General business planning meeting
  - [ ] 30.7 Create edge-case transcripts: sparse content, contradictions, messy audio
  - [ ] 30.8 Validate: Simulated transcripts match real transcript patterns from Project Lebron

- [ ] 31.0 **Create manual test cases (5 core tests)**
  - [ ] 31.1 Create `manual-tests/test-cases.md` documenting 5 manual test scenarios
  - [ ] 31.2 Test 1: FDD Management Call — Full template, 10+ pages, all tags, Adjustments Memo
  - [ ] 31.3 Test 2: FDD Accounting Policy — Heavy numeric content, policy tags, contradictions
  - [ ] 31.4 Test 3: FDD Legal/Contracts — Risk tags, follow-ups, gap handling
  - [ ] 31.5 Test 4: General Business — Decisions, actions, owners, next steps
  - [ ] 31.6 Test 5: Edge Case — Sparse transcript, no hallucinations, proper "not discussed" handling
  - [ ] 31.7 Document expected outputs and pass/fail criteria for each test
  - [ ] 31.8 Validate: Tests are executable immediately after GPT creation

- [ ] 32.0 **Design grader prompt**
  - [ ] 32.1 Create `evaluations/grader-prompt.md` with LLM-as-judge grading instructions
  - [ ] 32.2 Define grading dimensions (matching evaluation rubric): Completeness, Structure, Actionability, Data Integrity, Clarity
  - [ ] 32.3 Add specific checks: numeric capture rate, speaker attribution, tag usage, no hallucinations
- [ ] 32.4 Add 💡 Insights guardrail check: general context only, no company-specific claims
  - [ ] 32.5 Define scoring scale (1-5 per dimension) and pass thresholds
  - [ ] 32.6 Create template variables: `{{item.transcript}}`, `{{item.expected_tags}}`, `{{sample.output_text}}`
  - [ ] 32.7 Validate: Grader prompt produces consistent scores across similar outputs

- [ ] 33.0 **Create OpenAI Evals configuration**
  - [ ] 33.1 Create `automated/eval-config.py` with eval creation code
  - [ ] 33.2 Define `data_source_config` with JSON schema for transcript items
  - [ ] 33.3 Create `label_model` grader for pass/fail classification
  - [ ] 33.4 Create `score_model` grader for 1-5 scoring on each dimension
  - [ ] 33.5 Create `string_check` graders for required tag presence (`**FIGURE:**`, `**RISK:**`, etc.)
  - [ ] 33.6 Create `automated/run-data.jsonl` with test cases in OpenAI format
  - [ ] 33.7 Document how to run evals: `pip install openai>=1.20.0`, API calls, dashboard access
  - [ ] 33.8 Validate: Evals run successfully on OpenAI platform

- [ ] 34.0 **Create evaluation baseline**
  - [ ] 34.1 Run all manual tests on deployed GPT, record baseline scores
  - [ ] 34.2 Run automated evals, record baseline metrics
  - [ ] 34.3 Document baseline in `evaluations/baseline-results.md`
  - [ ] 34.4 Validate: Baseline provides comparison point for future changes

---

## System Prompt Structure (~8k characters)

The system prompt is a thin, ruthless brainstem. Verbose or domain-heavy content goes into knowledge files.

### Section 1: Core Behaviors & Success Criteria (~600-900 chars)
- Behavior definition: "You produce exhaustive, source-anchored meeting notes. You capture facts verbatim with speaker attribution. You never infer or editorialize. You add industry context in clearly marked 💡 Insights sections."
- Audience: FDD associates/managers; working notes, not client deliverables
- Success snapshot: 10+ pages for 90-min call, ~all numbers captured, no invented facts, contradictions surfaced

### Section 2: Non-Goals & Constraints (~400-600 chars)
- Do NOT invent facts, numbers, or events not in transcript
- Never smooth over contradictions; create Contradictions & Gaps section
- Speaker names only (no timestamps)
- 💡 Insights for general context only, not new deal facts
- If transcript is unclear: "Not clear from transcript"

### Section 3: Input & Meeting-Type Classification (~900-1200 chars)
- Expected input format (WebVTT with `<v Speaker>` tags)
- Compressed decision tree for meeting type (FDD vs General Business)
- Ambiguous case: ask user to pick 1-2

### Section 4: Core Workflow Stages A-D (~1200-1500 chars)
- A: Understand & classify (deal context, parties, agenda)
- B: Extract atomic facts (internal lists: numbers, risks, follow-ups)
- C: Structure notes (use selected template)
- D: Flight Check (numbers captured? anchors valid? no stray adjectives? owners assigned?)

### Section 5: Template Skeletons (~1400-1800 chars)
- FDD: BLUF, Attendees, Deal Context, Revenue, COGS, Opex, WC, KPIs, Non-GAAP, Risks, Follow-Ups, Contradictions, 💡 Insights
- General Business: BLUF, Attendees, Purpose, Decisions, Discussion, Actions, Open Questions, Next Steps, 💡 Insights

### Section 6: Tagging Rules & Style (~800-1000 chars)
- Universal tags: `**RISK:**`, `**FOLLOW-UP:**`, `**OPEN ITEM:**`, `**DECISION:**`, `**ACTION:**`
- FDD tags: `**FIGURE:**`, `**Candidate QoE Adjustment:**`
- Speaker attribution: `Speaker — short label: detail`
- Style: Markdown headings, nested bullets, BLUF up top, neutral tone

### Section 7: FDD Adjustments Memo Hook (~400-600 chars)
- End of FDD notes: ask "Generate Draft Adjustments Memo now?"
- If yes, use ONLY bullets tagged `**Candidate QoE Adjustment:**`
- Brief memo structure (full version in knowledge file)

### Section 8: Hard Guardrails (~300-500 chars)
- If unsure: do not guess; mark as `[Gap: ...]`
- No web/external knowledge for specific deal data
- All company-specific content traces to transcript

---

## Knowledge Files

4-6 focused files, each <3-4k tokens, with clear headings for retrieval.

| File | Purpose |
|------|---------|
| `knowledge/fdd-template-detailed.md` | Expanded FDD section guidance, DOs/DON'Ts, example subsection |
| `knowledge/fdd-adjustments-memo-template.md` | Memo sections, evidence block structure, quantification rules |
| `knowledge/general-business-template.md` | Sections, guidance, alignment with PM best practices |
| `knowledge/fdd-glossary-and-tagging-rules.md` | QoE, DSO, WC definitions; tag usage clarification |
| `examples/fdd-good-notes-long.md` | Full 6-8 page FDD example (gold standard) |
| `examples/fdd-bad-vs-good-snippets.md` | Contrasting examples for style guidance |
| `examples/general-notes-snippet.md` | 1-2 page general business example |

---

## Testing Strategy

### Benchmark Set (10-14 transcripts)
- 4-6 real FDD (anonymized, including Project Lebron)
- 3-4 synthetic General Business
- 2-4 edge-case synthetics (contradictions, messy dialogue, truncated)

### FDD Meeting Subtypes
Different FDD calls have different characteristics. Test coverage should include:

| Subtype | Key Characteristics | Primary Tags |
|---------|---------------------|--------------|
| Management Call | Broad coverage, revenue/COGS/WC, high-level | `**FIGURE:**`, `**Candidate QoE Adjustment:**` |
| Accounting Policy | Rev rec, accruals, estimates, technical | `**POLICY:**`, `**FIGURE:**` |
| Legal/Contracts | Agreements, litigation, contingencies | `**RISK:**`, `**FOLLOW-UP:**`, `**OPEN ITEM:**` |
| Client Presentation | Findings walkthrough, Q&A, less raw data | All tags, emphasis on structure |

### Evaluation Rubric (1-5 scoring)
1. **Completeness** (esp. numeric capture)
2. **Structure** (topic modules, control tables)
3. **Actionability** (owners, deadlines)
4. **Data integrity** (units, periods, context)
5. **Clarity / BLUF**

### Stress Tests
- No-data test: expect "not discussed" throughout
- Trap test: incomplete numbers not firmed up
- Research-enrichment test: general context not applied to company

### Regression Testing
- Retest benchmark set on any prompt/knowledge file change
- Compare hallucination incidents, coverage, rubric scores
- Document in Prompt Change Log

---

## Evaluations Framework

Comprehensive evaluation infrastructure using both manual testing and OpenAI's Evals API.

### Manual Tests (5 Core Scenarios)

| Test | Transcript | Key Validations |
|------|------------|-----------------|
| 1. FDD Management Call | `fdd-management-call.vtt` | Full template, 10+ pages, all tags, Adjustments Memo generation |
| 2. FDD Accounting Policy | `fdd-accounting-policy.vtt` | Heavy numeric content, `**POLICY:**` tags, contradiction handling |
| 3. FDD Legal/Contracts | `fdd-legal-contracts.vtt` | `**RISK:**` tags, follow-ups with owners, gap flagging |
| 4. General Business | `general-business-planning.vtt` | Decisions, actions, owners, next steps structure |
| 5. Edge Case | `sparse-transcript.vtt` | No hallucinations, proper "not discussed" handling |

### OpenAI Evals Configuration

**Data Source Config:**
```python
data_source_config = {
    "type": "custom",
    "item_schema": {
        "type": "object",
        "properties": {
            "transcript": {"type": "string"},
            "meeting_type": {"type": "string"},
            "expected_tags": {"type": "array", "items": {"type": "string"}},
            "expected_sections": {"type": "array", "items": {"type": "string"}},
            "numeric_count": {"type": "integer"}
        }
    },
    "include_sample_schema": True
}
```

**Grader Types:**

| Grader | Type | Purpose |
|--------|------|---------|
| `completeness_grader` | `score_model` | Score 1-5 on numeric capture and topic coverage |
| `structure_grader` | `score_model` | Score 1-5 on template adherence and organization |
| `hallucination_check` | `label_model` | Pass/fail on invented facts |
| `tag_presence` | `string_check` | Verify required tags appear in output |
| `analyst_note_guardrail` | `label_model` | Pass/fail on company-specific claims in 💡 Insights notes |

**Grader Prompt Design:**
The LLM-as-judge grader evaluates outputs against transcript source material:
- Checks every non–Helpful-Context bullet traces to transcript
- Verifies numeric values match source (unit, period, direction)
- Flags any company-specific claims in 💡 Insights sections
- Scores structure against expected template sections

### Transcript Generation Guidelines

Simulated transcripts should match real transcript patterns:
- WebVTT format with `<v Speaker>` tags
- Realistic speaker cadence and interruptions
- Topic transitions that mirror actual FDD calls
- Planted contradictions and gaps for testing
- Mix of clear statements and ambiguous phrasing

---

## Additional Guidance

### Multi-Meeting Workflows
- Include deal identifier at top of notes if user provides
- Consistent tag usage enables downstream parsing across calls

### User Prompts / UX
- Provide canned starter prompts per meeting type:
  - FDD: "I'm pasting an FDD management call transcript. Deal: [description]. Meeting type: FDD. Please produce detailed notes using the FDD template, then ask about Adjustments Memo."
  - General: "I'm pasting an internal meeting transcript. Meeting type: General Business. Please produce notes with decisions, action items, and discussion points."

### Redaction & Anonymization
- Encourage users to anonymize sensitive content before pasting
- Add gentle instruction in GPT description: "Please ensure you have authority to paste this transcript; anonymize where necessary."

### Context Limits
- For very long transcripts, suggest chunking:
  - Part 1 → notes
  - Part 2 → "augment existing notes above using same structure"

---

## Files to Create

### Core GPT Files

| Path | Description |
|------|-------------|
| `chatgpt/meeting-intelligence/system-prompt.md` | Complete GPT system prompt (<8k chars) |
| `chatgpt/meeting-intelligence/knowledge/fdd-template-detailed.md` | Expanded FDD guidance |
| `chatgpt/meeting-intelligence/knowledge/fdd-adjustments-memo-template.md` | Memo structure and rules |
| `chatgpt/meeting-intelligence/knowledge/general-business-template.md` | General Business guidance |
| `chatgpt/meeting-intelligence/knowledge/fdd-glossary-and-tagging-rules.md` | Definitions and tag rules |
| `chatgpt/meeting-intelligence/examples/fdd-example.md` | Full FDD notes example (6-8 pages) |
| `chatgpt/meeting-intelligence/examples/general-business-example.md` | General Business notes example |
| `chatgpt/meeting-intelligence/examples/bad-vs-good-snippets.md` | Contrasting style examples |
| `chatgpt/meeting-intelligence/docs/evaluation-rubric.md` | Scoring rubric for validation |
| `chatgpt/meeting-intelligence/docs/prompt-changelog.md` | Version tracking for prompt iterations |

### Evaluations Files

| Path | Description |
|------|-------------|
| `chatgpt/meeting-intelligence/evaluations/Evals-readme.md` | Evaluation strategy and documentation *(USER VERIFICATION CHECKPOINT)* |
| `chatgpt/meeting-intelligence/evaluations/grader-prompt.md` | LLM-as-judge grading instructions |
| `chatgpt/meeting-intelligence/evaluations/baseline-results.md` | Baseline evaluation scores |
| `chatgpt/meeting-intelligence/evaluations/manual-tests/test-cases.md` | 5 manual test scenarios with pass/fail criteria |
| `chatgpt/meeting-intelligence/evaluations/automated/eval-config.py` | OpenAI Evals API configuration |
| `chatgpt/meeting-intelligence/evaluations/automated/run-data.jsonl` | Test cases in OpenAI JSONL format |
| `chatgpt/meeting-intelligence/evaluations/transcripts/fdd-management-call.vtt` | Simulated FDD management call |
| `chatgpt/meeting-intelligence/evaluations/transcripts/fdd-accounting-policy.vtt` | Simulated accounting policy meeting |
| `chatgpt/meeting-intelligence/evaluations/transcripts/fdd-legal-contracts.vtt` | Simulated legal/contracts review |
| `chatgpt/meeting-intelligence/evaluations/transcripts/fdd-client-presentation.vtt` | Simulated client presentation |
| `chatgpt/meeting-intelligence/evaluations/transcripts/general-business-planning.vtt` | Simulated general business meeting |
| `chatgpt/meeting-intelligence/evaluations/transcripts/sparse-transcript.vtt` | Edge case: minimal content |

## Files to Modify

| Path | Changes |
|------|---------|
| `chatgpt/meeting-intelligence/docs/spec-meeting-intelligence.md` | Remove Customer/Sales template, update tags to 💡 Insights |

---

## Design Decisions

| Aspect | Decision |
|--------|----------|
| Platform | OpenAI Custom GPT (standalone, no tools, prompt + knowledge) |
| Input | Pasted transcript text (WebVTT, plain text, or messy auto-transcription) |
| Output | Markdown in chat (copy/paste) |
| System prompt | <8k characters; thin brainstem with skeletons only |
| Knowledge files | 4-6 focused files, <3-4k tokens each |
| Timestamps | Stripped from output (speaker attribution only) |
| Research enrichment | Always added, marked with `**💡 Insights:**`, strictly general context |
| Examples | Fully worked (FDD) + higher-level (General Business) + bad-vs-good contrasts |
| Adjustments Memo | FDD-only, prompted after notes complete |
| Templates | Two templates: FDD and General Business |
| Manual testing | 5 core test scenarios covering FDD subtypes and edge cases |
| Automated evals | OpenAI Evals API with `score_model`, `label_model`, and `string_check` graders |
| Grader approach | LLM-as-judge comparing output to transcript source material |
| Eval workflow | Evals-readme.md verified by user before implementation proceeds |
| Transcript sources | Real transcripts (Project Lebron) + simulated transcripts for coverage |
| FDD subtypes | Management calls, accounting policy, legal/contracts, client presentations |
