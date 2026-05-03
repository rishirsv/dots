# Meta Prompt v3.1 – Summary & Evals

This folder contains the evaluation harness and artifacts for the **Meta Prompt v3.1** configuration in `../meta-prompt.md`.

## Current Meta Prompt (v3.1)

Key behaviors encoded in the meta‑prompt:

- **Instruction‑only role** – never executes the user’s task; always produces a ready‑to‑run downstream prompt.
- **Template routing** – chooses between:
  - **Essential**: single compact artifact (one list, code block, table, CSV, or short answer).
  - **Standard**: multi‑section / multi‑artifact documents and templates.
  - **Research**: tasks where recency and citations are central, with numeric inline citations + References.
- **Strict output contracts** – explicit rules for:
  - Single‑token outputs (e.g., Y/N, Low/Medium/High).
  - Code‑block‑only vs raw CSV/text (no outer fences, no extra prose).
- **Planning line gating** – “Think step by step; do not show your plan” is allowed only for complex, multi‑step Standard/Research tasks; simple Essential tasks do **not** add it.
- **Length targets** (approximate):
  - Essential: 80–150 words (40–100 for ultra‑atomic tasks).
  - Standard: 120–220 words (220 is a firm upper bound in normal cases).
  - Research: 180–350 words.

## Eval Files

- `Meta Prompt v3 Final (1).csv` – full 50‑case eval run for v3, including Apps grader columns for `prompt_1_*`.
- `Meta Prompt v2 Final Eval.csv` – matched v2 run for comparison.
- `meta_prompt_eval_report.md` – narrative summary of the original v3 eval.
- `v2_vs_v3_eval_report.md` – detailed comparison of v2 vs v3 prompts and scores.
- `meta_prompt_eval_appendix_full.md` – per‑case appendix with user prompts and best‑candidate optimized prompts.
- `grader_report.json` – JSON export from the heuristic `grader_tool.py` run.

## Delta Test Harness

- `test_cases.csv` – main 50‑row test case definition file (id, domain, user_prompt, checks, expected_template, etc.).
- `delta_test_cases.csv` – **14‑case focused regression set** covering:
  - Atomic Essential tasks with strict outputs (Y/N, CSV‑only, bullets‑only, fixed‑length lists).
  - Complex Standard prompts (templates, programs, schemas) where length and structure are most stressed.
  - Research prompts (law/tax/market/travel) to validate routing and citation behavior.

Use `delta_test_cases.csv` for quick sanity checks whenever `meta-prompt.md` changes; use `test_cases.csv` for full runs.

## Grading

Two grading paths are available:

- **Apps grader (recommended)** – the “Scoring grader” in OpenAI Evals, configured with a rubric that examines template choice, brevity, constraint alignment, output specification, and tone. Its labels and scores are stored in the `*_Scoring grader_*` columns of the CSVs.
- **Local heuristic grader (legacy)** – `grader_tool.py` consumes a CSV and emits per‑candidate scores and rankings based on simple heuristics. See `README.md` in this folder for usage.

