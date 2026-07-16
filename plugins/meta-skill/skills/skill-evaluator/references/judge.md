# Write an LLM-as-Judge Prompt

Read this after [Choose The Grader](evaluation-methodologies.md#choose-the-grader)
selects an LLM judge. Design a binary Pass/Fail evaluator for one specific
failure mode. Each judge checks exactly one thing.

Save the finished prompt as `evals/cases/<case-id>/judge.md` and set the model
grader's `path` to `judge.md` in `evals.json`.

## Prerequisites

- [Error analysis](error-analysis.md) is complete. The user has confirmed the
  failure mode and its Pass/Fail boundary.
- You have human-labeled traces for this failure mode: at least 20 Pass and 20
  Fail examples.
- A code-based evaluator cannot check this failure mode.

Exhaust code-based options before reaching for a judge. Many failure modes that
seem subjective reduce to keyword checks, regex, or API calls when you
understand the domain. For example, detecting whether an AI interviewing coach
suggests general questions—asking about typical behavior instead of a specific
past event—may reduce to checking for words such as “usually,” “typical,” and
“normally.”

## The Four Components

Every judge prompt requires exactly four components.

### 1. Task and Evaluation Criterion

State what the judge evaluates. Use one failure mode per judge.

```text
You are an evaluator assessing whether a real estate assistant's email
uses the appropriate tone for the client's persona.
```

Do not use a broad instruction such as “Evaluate whether the email is good” or
“Rate the email quality from 1–5.”

### 2. Pass/Fail Definitions

Outcomes are strictly binary: Pass or Fail. Do not use Likert scales, letter
grades, or partial credit. Define exactly what constitutes Pass and Fail. These
definitions come from the failure-mode descriptions produced by error analysis.

```markdown
## Definitions

PASS: The email matches the expected communication style for the client persona:
- Luxury Buyers: formal language, emphasis on exclusive features, premium
  market positioning, no casual slang
- First-Time Homebuyers: warm and encouraging tone, educational explanations,
  avoids jargon, patient and supportive
- Investors: data-driven language, ROI-focused, market analytics, concise
  and professional

FAIL: The email uses a tone mismatched to the client persona. Examples:
- Using casual slang ("hey, check out this pad!") for a luxury buyer
- Using heavy financial jargon for a first-time homebuyer
- Using overly emotional language for an investor
```

### 3. Few-Shot Examples

Include labeled Pass and Fail examples from human-labeled data.

```markdown
## Examples

### Example 1: PASS
Client Persona: Luxury Buyer
Email: "Dear Mr. Harrington, I am pleased to present an exclusive listing
at 1200 Pacific Heights Drive. This distinguished property features..."
Critique: The email opens with a formal salutation and uses language
consistent with luxury positioning—"exclusive listing," "distinguished
property." No casual slang or informal phrasing. The tone matches the
luxury buyer persona throughout.
Result: Pass

### Example 2: FAIL
Client Persona: Luxury Buyer
Email: "Hey! Just found this awesome place you might like. It's got a
pool and stuff, super cool neighborhood..."
Critique: The greeting "Hey!" is informal. Phrases like "awesome place,"
"got a pool and stuff," and "super cool" are casual slang inappropriate
for a luxury buyer. The email reads like a text message, not a
professional communication for a high-end client.
Result: Fail

### Example 3: PASS (borderline)
Client Persona: First-Time Homebuyer
Email: "Hi Sarah, I found a property that might be a great fit for your
first home. The neighborhood has good schools nearby, and the monthly
payment would be similar to what you're currently paying in rent..."
Critique: The greeting is warm but not overly casual. The email explains
the property in relatable terms—comparing mortgage to rent, mentioning
schools—which is educational without being condescending. It avoids jargon
like "amortization" or "LTV ratio." While not deeply technical, this matches
the supportive tone expected for a first-time buyer.
Result: Pass
```

Rules for selecting examples:

- Include at least one clear Pass, one clear Fail, and one borderline case.
  Borderline examples are the most valuable because they teach nuance.
- Draw examples from the training split: 10–20% of the labeled data set aside
  for this purpose.
- Exclude every prompt example from development and test sets. Reusing them is
  data leakage.
- Use two to four examples in most prompts. Performance typically plateaus
  after four to eight.

### 4. Structured Output Format

MetaSkill enforces the judge output schema. The judge must write a detailed
critique in `rationale` before committing to the binary verdict in `label`.
Use one check because each judge evaluates one failure mode:

```json
{
  "label": "pass",
  "score": 1,
  "rationale": "Detailed assessment against the criterion, citing concrete evidence from the output.",
  "checks": [
    {
      "name": "the failure mode being judged",
      "label": "pass",
      "level": null,
      "evidence": "Concrete evidence from the response or artifact.",
      "note": null
    }
  ],
  "eval_feedback": []
}
```

Use `label: "fail"` and `score: 0` for a failing result.

Critiques must be detailed, not terse. A good critique explains what
specifically was correct or incorrect and references concrete evidence from the
output. The critiques in the few-shot examples set the expected level of
detail.

## Choosing What to Pass to the Judge

Feed only what the judge needs for an accurate decision.

| Failure mode | What the judge needs |
|---|---|
| Tone mismatch | Client persona and generated email |
| Answer faithfulness | Retrieved context and generated answer |
| SQL correctness | User query, generated SQL, and schema |
| Instruction following | Relevant prompt rules and generated response |
| Tool-call justification | Conversation history, tool call, and tool result |

For long documents, feed only the relevant snippet, not the entire document.
Set `uses_transcript: true` only when the process itself is part of the
criterion.

## Model Selection

Start with the most capable model available. The same model used for the main
task can serve as judge because the judge performs a different, narrower task.
Optimize for cost only after alignment with human labels is confirmed.

## Anti-Patterns

- **Vague criteria such as “is this helpful?”** Target a specific, observable
  failure mode from error analysis.
- **One holistic judge for the entire trace.** A judge covering multiple
  dimensions produces unactionable verdicts.
- **No few-shot examples.** Without examples, the model does not know what
  counts as a failure in this application.
- **Development or test examples used as few-shot examples.** This is data
  leakage. Use only the training split.
- **Likert scales or letter grades.** Binary Pass/Fail forces a clear decision
  boundary and makes disagreement measurable. To capture severity, use
  separate binary judges, such as “factually wrong” and “dangerously wrong.”
- **Skipping validation.** Measure alignment against held-out human labels
  before trusting the judge. Follow [validate-judge.md](validate-judge.md).
- **Judging a specification failure before fixing the prompt.** If the prompt
  never requested the behavior, add the instruction before building the
  evaluator. A judge may still serve as a regression guard for a critical
  requirement.
