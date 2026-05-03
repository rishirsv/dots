# Essential_Template.md

Use this template when the task:

- Produces **one** clear deliverable (JSON, CSV, short answer, single email, simple list).  
- Does **not** require a multi‑section narrative or heavy citation logic.  
- Primarily needs precise parsing/formatting rules or a small number of behavioral constraints.

The optimized prompt should be short, direct, and self‑contained—no headings or template labels in the final prompt.

Target length: **80–150 words** (hard cap: **≤150**).

---

## Template Guidance

- Treat the assistant as capable but unfamiliar with the specific input format.  
- Express the task in **one sentence**.  
- For genuinely complex transforms, add one internal planning line immediately after the main task sentence, e.g.: “Before you start, think step by step about your approach; do not show your plan.”  
- Add **3–5 rules** only when they change behavior meaningfully (e.g., field types, ordering, null handling).  
- Use a **single unified output specification**:
  - Fields and types.  
  - Ordering.  
  - Null/empty handling.  
  - Any tie‑break rules or scarcity behavior for lists.  
  - Example output if helpful.  
- Do **not** ask for a visible checklist or plan unless the user explicitly wants one.  
- For prose (emails, short answers), optionally add a brief verbosity hint (e.g., “keep it to 2 short paragraphs”).

---

## Essential Template (Skeleton)

Use this basic pattern:

```
Your task is to {TASK_STATEMENT}{OPTIONAL_CONTEXT_OR_AUDIENCE}.

Follow these rules:
- {RULE_1}
- {RULE_2}
- {RULE_3}
{OPTIONAL_MORE_RULES}

Output:
- {OUTPUT_SPECIFICATION}
- {OPTIONAL_VERBOSITY_HINT}
```

Where:

{TASK_STATEMENT} – concrete action, e.g., “convert the provided log lines into a valid JSON array of objects”, “extract all valid IATA airport codes from the text”, “rewrite the email to sound professional and concise”.

{OPTIONAL_CONTEXT_OR_AUDIENCE} – short clause if needed (e.g., “using only information present in the text”).

{RULES} – only the rules that clarify ambiguity (field types, handling missing data, ranking).

{OUTPUT_SPECIFICATION} – concise description of the desired output structure, often with an example.

## Example 1 — Logs → JSON

**Unoptimized user prompt**

```text
Convert these raw webserver logs into a JSON array.
```

**Optimized prompt (Essential)**

```text
Your task is to convert the provided webserver log lines into a valid JSON array of objects.

Follow these rules:

- For each line, create one object with fields `timestamp`, `status`, `code`, `path`, and `message` when those values can be reliably parsed.
- Treat `code` as a number; omit `code` if none is present on a line.
- Use the full date‑time string as `timestamp` if present; omit `timestamp` otherwise.
- Do not guess missing values; omit any field you cannot parse with confidence.

Output:
- Return only a JSON array (no markdown fences, no extra text), with objects in the same order as the input lines.
```

## Example 2 — Extract IATA Airport Codes

**Unoptimized user prompt**

```text
Find all airport codes in this text.
```

**Optimized prompt (Essential)**

```text
Your task is to extract valid IATA airport codes from the text in the order they first appear.

Follow these rules:

- Only include three‑letter uppercase IATA airport codes (e.g., SEA, LHR, AMS).
- If a code appears multiple times, include it only once, at its first occurrence.
- Ignore any three‑letter sequences that are clearly not used as airport codes.
- If no valid codes are found, return an empty array `[]`.

Output:
- Return a JSON array of codes inside a single fenced code block, for example:

```json
["SEA", "AMS"]
```

Do not include any other text outside the JSON code block.
```

## Example 3 — Professional Email Rewrite

**Unoptimized user prompt**

```text
Rewrite this email to sound more professional.
```

**Optimized prompt (Essential)**

```text
Your task is to rewrite the provided email to sound professional, clear, and concise.

Follow these rules:

- Preserve the original meaning, commitments, dates, and names.
- Use neutral business English; avoid slang and overly formal legalese.
- Remove redundant phrases where possible without losing important nuance.

Output:
- Return only the rewritten email text (no explanations or comments).

Output Verbosity: keep the email to at most 2 short paragraphs.
```
