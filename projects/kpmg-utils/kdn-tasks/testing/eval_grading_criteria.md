# KDN Task Writer - Evaluation Grading Criteria

## Purpose

This document defines the grading criteria for automated evaluation of KDN Task Writer outputs using the OpenAI Evals platform. The criteria enable model-graded evaluation where GPT-4 (or similar) acts as the grader.

---

## Grading Prompt for Model-Based Evaluation

Use this prompt as the grading instruction for OpenAI Evals:

```
You are evaluating the output of a KDN Task Writer assistant. This assistant transforms rough notes from KPMG associates into structured email instructions for an offshore team.

Evaluate the response against the following criteria and provide scores for each dimension. The total score should be on a scale of 1-7.

## Scoring Dimensions

### 1. STRUCTURE (Weight: 25%)
Evaluate the structural elements of the email:

CORE REQUIREMENTS (must have):
- Subject line contains project name (bonus if bold, but not required)
- Greeting is professional (Hi X, / Team, / KDN Team, - minor capitalization variations OK)
- Tasks use numbered format (1, 2, 3) with lettered sub-steps (a, b, c)
- Save location appears at the end

PREFERRED (nice to have):
- Subject line is bold and contains ONLY project name
- Substeps are one sentence each
- Assumptions block uses 📋 emoji and **Draft email** header

Score 7: All core requirements met, all preferred elements present
Score 6: All core requirements met, most preferred elements
Score 5: All core requirements met, some preferred elements missing
Score 4: Core requirements met with issues (e.g., verbose substeps)
Score 3: Missing some core requirements
Score 1: Completely wrong structure (no tasks, no greeting, etc.)

### 2. FILE_REFERENCES (Weight: 25%)
Evaluate how files, tabs, and cells are referenced:

REQUIRED FORMATS:
- File names: italics format *filename.xlsx*
- Tab names: single quotes only 'Tab Name' (no backticks, no angle brackets)
- Cell references: backticks `Combined BS!C28`
- Specific ranges mentioned where applicable (not vague)

FAILURE CONDITIONS:
- Generic references like "the databook" without file name
- Missing tab specifications when relevant
- No cell references when discussing tie-outs

Score 7: All references specific and correctly formatted
Score 5: Most references correct, minor formatting issues
Score 3: Vague references or inconsistent formatting
Score 1: No specific file/tab references

### 3. COMPLETENESS (Weight: 25%)
Evaluate whether instructions are complete and actionable:

CORE REQUIREMENTS:
- Each task is actionable (KDN can execute without guessing)
- Missing info uses {placeholder} format (not invented)
- No separate "Acceptance checks" section (inline is OK)

GOOD PRACTICES:
- Tie-outs included ONLY when user requested them
- Assumptions documented with *Note... prefix
- Tasks grouped logically (similar tasks combined, not split into many)

WHAT TO AVOID:
- Invented specifics not in original prompt (file names, thresholds)
- Adding verification steps user didn't request
- Splitting one simple task into multiple numbered tasks

Score 7: Complete, actionable, appropriate level of detail
Score 6: Complete with minor verbosity
Score 5: Complete but over-specified or under-specified in places
Score 4: Mostly complete, some invented content or missing key info
Score 3: Incomplete or significantly invented content
Score 1: Cannot be executed, major gaps or fabrications

### 4. TONE_AND_STYLE (Weight: 25%)
Evaluate professional tone and brevity:

CORE REQUIREMENTS:
- Direct, actionable language (not hedging or passive)
- No excessive boilerplate ("let us know if questions", "happy to help")
- No internal reasoning visible ("Based on my analysis...")
- No offers for additional work

PREFERRED:
- Brief substeps (one sentence)
- No bold on action verbs
- Context line under 15 words
- Correct acronym usage

Score 7: Direct, brief, professional - reads like a real associate email
Score 6: Good tone with minor verbosity
Score 5: Acceptable tone, some over-explaining
Score 4: Verbose but usable
Score 3: Contains boilerplate or significant over-explaining
Score 1: Wrong tone entirely (hedging, offers extras, internal reasoning)

## Final Scoring

Calculate weighted average:
FINAL_SCORE = (STRUCTURE * 0.25) + (FILE_REFERENCES * 0.25) + (COMPLETENESS * 0.25) + (TONE_AND_STYLE * 0.25)

Round to nearest 0.5.

PASS THRESHOLD: 5.0

IMPORTANT GRADING PRINCIPLES:
- Focus on whether KDN can execute the task, not formatting perfection
- Minor style variations (capitalization, emoji presence) should not fail an otherwise good email
- A verbose but correct email scores 4-5, not 0
- Only score 1-2 for emails that are fundamentally broken or unusable

## Output Format

Provide your evaluation in this exact JSON format:
{
  "structure_score": <1-7>,
  "structure_notes": "<specific observations>",
  "file_references_score": <1-7>,
  "file_references_notes": "<specific observations>",
  "completeness_score": <1-7>,
  "completeness_notes": "<specific observations>",
  "tone_style_score": <1-7>,
  "tone_style_notes": "<specific observations>",
  "final_score": <1.0-7.0>,
  "pass": <true/false>,
  "summary": "<1-2 sentence overall assessment - would this email work for KDN?>"
}
```

---

## Anti-Pattern Detection Checklist

The grader should flag these specific anti-patterns:

| Anti-Pattern | Detection Rule | Severity |
|--------------|----------------|----------|
| Vague file reference | Contains "the databook" or "the file" without specific name | High |
| Separate checks section | Contains "Acceptance checks:" or "Verification:" as header | High |
| Boilerplate closing | Contains "let us know if" or "please confirm" or "happy to" | Medium |
| Bold action verbs | Contains **Add**, **Update**, **Create** in step text | Low |
| Repeated save location | "Save to:" appears more than once | Medium |
| Time estimates | Contains "hours", "minutes", "should take" | Medium |
| Invented specifics | File names or thresholds not in input prompt | High |
| Over-explaining | Paragraphs of explanation before tasks | Medium |
| Verbose substeps | Multi-sentence substeps or (i.e., ...) (e.g., ...) explanations | Medium |
| Offering extras | "I can also" or "would you like me to" | Low |
| Internal reasoning | "Based on" or "I noticed" or "my analysis" | High |
| Wrong subject format | Subject contains descriptions, dates, or missing bold format | Medium |
| Angle bracket tabs | Tab names use <Tab> instead of 'Tab' | Low |
| Backtick tabs | Tab names use \`'Tab'\` instead of 'Tab' | Low |

---

## JSONL Format for OpenAI Evals

Each test case in the JSONL file should follow this structure:

```json
{
  "input": [
    {
      "role": "system",
      "content": "<system prompt from kdn_system_prompt.md>"
    },
    {
      "role": "user",
      "content": "<test prompt with document context>"
    }
  ],
  "ideal": "<description of expected output characteristics>",
  "metadata": {
    "test_id": "test_001",
    "category": "voice_dictation|bullet_notes|initiation|technical|edge_case",
    "difficulty": "low|medium|high",
    "expected_tasks": 4,
    "required_elements": ["file_reference", "tie_out", "topside_calc"],
    "anti_patterns_to_check": ["vague_reference", "separate_checks"]
  }
}
```

---

## Evaluation Categories

### Category Definitions

| Category | Description | Key Evaluation Focus |
|----------|-------------|---------------------|
| `voice_dictation` | Rambling, unstructured input | Parsing ability, organization |
| `bullet_notes` | Terse abbreviated input | Expansion, inference of standard practices |
| `initiation` | New deal setup | Format selection, Deal Preferences, placeholders |
| `nightly_standard` | Typical nightly tasks | Structure, specificity, completeness |
| `technical_single` | Detailed single-workstream | Field specifications, accuracy |
| `multi_workstream` | Multiple task families | Organization, no cross-contamination |
| `edge_case` | Ambiguous or incomplete | Error handling, clarification behavior |
| `continuation` | References prior work | Context handling, appropriate assumptions |

### Pass Criteria by Category

| Category | Pass Threshold | Critical Elements |
|----------|---------------|-------------------|
| `voice_dictation` | 5.0 | Must parse into discrete tasks |
| `bullet_notes` | 5.5 | Must expand with standard practices |
| `initiation` | 5.5 | Must use initiation format |
| `nightly_standard` | 6.0 | High bar for standard cases |
| `technical_single` | 5.5 | Must capture all specifications |
| `multi_workstream` | 5.5 | Must separate workstreams clearly |
| `edge_case` | 5.0 | Must ask questions OR use placeholders |
| `continuation` | 5.5 | Must acknowledge prior context |

---

## Rubric Scoring Examples

### Example 1: Score 7 (Excellent)

**Input:** "Roll forward IS through June for Academy"

**Output:**
```
**Subject: Project Academy**

Hi Divya,

Hope you are well. Please see the following tasks for Academy today:

📁 2025-06-28

1. Jun-25 IS roll-forward:
   a. Add Jun-25 column to 'IS|Combined', 'IS|Combining', and all 13 location IS tabs
   b. Map TB accounts from *Jun-25 Trial Balances.xlsx* using existing mappings
   c. Calculate TTM-Jun 25 column
   d. Update 'IS|Topside'

Save to: Project Academy/KDN Outputs/2025-06-28

Thanks,
Vivien
```

**Why Score 7:**
- Bold subject line with project name only
- Correct greeting and structure
- Numbered task with lettered sub-steps
- Brief substeps (one sentence each)
- File in italics, tabs in single quotes, cell in backticks
- Single save location at end
- No boilerplate, no over-explaining

---

### Example 2: Score 4 (Needs Work)

**Output:**
```
Hi Team,

Please update the income statement with the new June data.

**Tasks:**
- **Add** June column to all IS tabs
- **Map** the trial balance accounts
- **Verify** everything ties

**Acceptance Checks:**
- Combined IS ties to source
- All formulas correct

Please let me know if you have any questions.

Save to: KDN Outputs folder

Thanks,
Vivien
Senior Associate
```

**Why Score 4:**
- Bold action verbs (violation)
- Separate "Acceptance Checks" section (violation)
- Boilerplate closing (violation)
- Job title in signature (violation)
- Vague file references ("the trial balance")
- Vague save location
- Uses dashes instead of numbered/lettered format

---

### Example 3: Score 1 (Failure)

**Output:**
```
Based on my analysis of your request, I can help you update the databook.

I would suggest the following approach:
1. First, we should review the current state of the databook
2. Then, we can add the new data
3. Finally, we'll verify everything

This should take approximately 2-3 hours to complete.

Would you like me to also create a summary document? I'm happy to help with any additional tasks.

Let me know if you have questions!
```

**Why Score 1:**
- Internal reasoning visible ("Based on my analysis")
- Over-explaining the approach
- Time estimate included
- Offers additional work
- Multiple boilerplate phrases
- No specific file/tab references
- No actual actionable instructions
- Wrong tone entirely

---

## Integration with OpenAI Evals Platform

### YAML Configuration Template

```yaml
kdn-task-writer-eval:
  id: kdn-task-writer-eval
  description: Evaluates KDN Task Writer output quality against gold standard criteria

  metrics:
    - accuracy
    - model_graded_score

  args:
    samples_jsonl: kdn_task_writer/test_cases.jsonl

  eval_type: model_graded

  model_graded_spec:
    grader_model: gpt-4
    prompt_template: |
      {grading_prompt_from_above}

    score_type: numeric
    range: [1, 7]
    pass_threshold: 5.5

    output_schema:
      type: object
      properties:
        structure_score:
          type: number
        file_references_score:
          type: number
        verification_score:
          type: number
        tone_style_score:
          type: number
        final_score:
          type: number
        pass:
          type: boolean
        anti_patterns_found:
          type: array
        summary:
          type: string
```

---

## Sources

- [OpenAI Evals Documentation](https://platform.openai.com/docs/guides/evals)
- [OpenAI Cookbook - Getting Started with Evals](https://cookbook.openai.com/examples/evaluation/getting_started_with_openai_evals)
- [OpenAI Evals GitHub - Build Eval Guide](https://github.com/openai/evals/blob/main/docs/build-eval.md)
- [OpenAI Cookbook - Structured Outputs Evaluation](https://cookbook.openai.com/examples/evaluation/use-cases/structured-outputs-evaluation)
