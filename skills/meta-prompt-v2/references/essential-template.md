# Essential Template

Use for one compact deliverable: a short rewrite, extraction, JSON transform, CSV output, one email, a focused Codex request, one image prompt, or one surgical image edit.

Target prompt length: 60-150 words.

## Guidance

- Start with one sentence naming the task and desired outcome.
- Include only 3-5 rules that change behavior.
- Add a hidden-reasoning line only for genuinely tricky transformations.
- Centralize output rules: format, fields, ordering, missing values, fences, and length.
- For exact machine-readable output, specify schema and use Structured Outputs when available.
- Do not add visible plans, checklists, citations, or heavy sections unless the user asked.

## Pattern

```text
Your task is to [action + artifact] for [audience/use case if relevant].

Follow these rules:
- [behavior-changing rule]
- [constraint or preservation rule]
- [missing-data, ranking, or validation rule]

Output:
- [exact format, order, fence/no-fence rule, and length]
```

## Examples

```text
Your task is to rewrite the provided email so it is professional, clear, and concise.

Follow these rules:
- Preserve the original meaning, names, dates, commitments, and level of urgency.
- Remove redundant phrasing without adding new claims.
- Use neutral business English rather than slang or legalese.

Output:
- Return only the rewritten email text, with no explanation.
- Keep it to at most two short paragraphs.
```

```text
Your task is to convert the provided records into a valid JSON array.

Follow these rules:
- Create one object per record with fields `name`, `date`, `amount`, and `status`.
- Use `null` for missing values and do not infer facts not present in the input.
- Preserve input order.

Output:
- Return only JSON, with no markdown fence or extra prose.
- Use Structured Outputs if available.
```
