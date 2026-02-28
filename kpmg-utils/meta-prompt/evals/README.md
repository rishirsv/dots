# MetaPrompt Eval Helpers

This folder contains both the **eval datasets** for the Meta Prompt and a small **local grading helper**.

For a high‑level overview of the current meta‑prompt and eval artifacts, see `summary.md`.

## Local heuristic grader (`grader_tool.py`)

`grader_tool.py` is a lightweight helper that scores Meta Prompt CSV exports using simple heuristics. It is useful for quick local experiments; the primary grading for v3.1 is done via the OpenAI Apps “Scoring grader”.

### Quick start

```bash
python grader_tool.py
```

Key options:

- `--csv PATH` – choose a specific CSV instead of the newest file in this folder.  
- `--output PATH` – write the JSON results to a file instead of stdout.

The script:

- Parses candidate outputs (e.g., `prompt_1_output`) per row.  
- Detects an approximate template (Essential/Standard/Research).  
- Applies simple checks for wordiness, constraint handling (fences, external access), and output specification.  
- Produces per‑candidate scores and a ranking plus meta‑prompt optimization hints.
