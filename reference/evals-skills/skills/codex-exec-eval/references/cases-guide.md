# Cases Guide

`cases.json` is the canonical source of truth for evaluation cases.

## Supported Structure

Use either:

```json
{
  "cases": []
}
```

or a plain top-level array.

## Recommended Case Fields

Each case should usually contain:

- `id`
  - stable identifier for reporting
- `prompt`
  - per-case instruction or request
- `input_text`
  - optional source text pasted directly into the prompt
- `source_files`
  - optional list of file paths relative to the eval project or working directory
- `tags`
  - optional labels for grouping cases
- `notes`
  - optional operator notes
- `expected`
  - optional deterministic checks

## Recommended `expected` Fields

Supported deterministic checks:

- `exit_code`
- `text_contains`
- `text_not_contains`
- `files_exist`
- `json_keys`

Example:

```json
{
  "id": "rewrite-001",
  "prompt": "Rewrite the attached draft in a tighter executive tone.",
  "input_text": "Original draft text here.",
  "source_files": [],
  "tags": ["rewrite", "tone"],
  "notes": "Simple prompt-only example.",
  "expected": {
    "exit_code": 0,
    "text_contains": ["executive"],
    "text_not_contains": ["lorem ipsum"],
    "files_exist": [],
    "json_keys": []
  }
}
```

## Case Design Tips

- Keep one case focused on one concrete scenario.
- Use small starter cases first.
- Prefer real examples when available.
- Use CSV only when spreadsheet editing is important for the user.
- If cases come from CSV, convert them into JSON before treating them as canonical.
