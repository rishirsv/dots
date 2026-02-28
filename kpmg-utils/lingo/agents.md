# Repository Guidelines

## Project Structure & Module Organization
- `core/` — glossary generation + slide utilities:
  - `glossary_generator.py` — glossary JSON → PPTX
  - `pagination.py` — adaptive glossary pagination heuristics
  - `rearrange.py` — slide duplication/deletion utilities (relationship-safe)
  - `formatting.py` — paragraph/run formatting helpers
- `tools/` — one-off developer utilities like `analyze_template.py` for inspecting PPTX templates.
- `templates/` — PPTX templates (currently glossary template only).
- `tests/` — unit/integration tests for glossary + core helpers.
- `docs/` — reference docs:
  - `docs/LEARNINGS.md` — consolidated learnings + bug summaries
  - `docs/SLIDE_GENERATOR_DESIGN.md` — how to (re)build deck generation
  - `docs/branding_kpmg.md` — brand reference
- `output/` — local PPTX artifacts; ignored in VCS.

## Python Version & Environment
- Target **Python 3.9** for all code that may run inside the ChatGPT / Code Interpreter environment. Avoid syntax and stdlib features that require 3.10+ (e.g., `Path | str` unions, structural pattern matching).
- Prefer `typing.Union` and other 3.9‑compatible typing constructs instead of PEP 604 unions.
- Assume only standard library + explicitly documented dependencies (`python-pptx`, `Pillow`) are available in the GPT runtime; do not introduce new runtime dependencies without updating tooling and docs.

## Build, Test, Development Commands
- `python3 -m venv .venv && source .venv/bin/activate` — create/use a virtualenv.
- `pip install python-pptx pillow` — dependencies (pillow used by some tests).
- `python3 core/glossary_generator.py --template templates/glossary_template.pptx --input sample.json --output output/my.pptx` — run generator.
- `python3 run_all_tests.py` or `python3 -m unittest discover tests -v` — run tests.

## Workflow
- Spec → Plan → Execute. Keep feature docs co-located under `docs/` using provided templates.
- Use `@spec.md` to draft requirements; `@plan.md` to derive tasks; `@best-practices-researcher.md` for supporting research; `@execute-plan.md` to drive execution and update checkboxes.

## Bug-Prevention Patterns (from bug reports)

### 1) Custom GPT / Lingo environment (BUG-001: GPT isolation layout errors)
- Never write “raw” `python-pptx` slide code in GPT tools (e.g., `Presentation().slides.add_slide(...)`) for KPMG decks. Always call the bundled engine entry points instead.
- Do not guess placeholder indices (e.g., `placeholders[13]`, `slide.shapes.title` without checks). For glossary generation, always use the glossary bundle and template.
- Treat the single-file bundle as the public API for GPTs and Lingo. Do not replicate internal helpers (like `duplicate_slide`) inside GPT code; wire GPTs to call the bundle instead.
- When adding new GPT tools or Lingo flows, confirm they only import from the bundle and templates, not individual `core/*.py` files.

#### Lingo bundle status & usage
- Lingo uses `lingo/lingo_bundle.py` as its only slide engine. This file is **auto‑generated**; do not edit it directly. To rebuild after changes to `core/formatting.py`, `core/rearrange.py`, or `core/glossary_generator.py`, run: `python3 tools/build_lingo_bundle.py`.
- The bundled engine includes hardened relationship‑cloning that iterates over the underlying `_rels` dict and rewrites all `r:*` attributes, preventing multi‑slide glossary failures in `_clone_relationships`. See `docs/LEARNINGS.md` for details.
- In GPT / Code Interpreter environments, **do not** `import lingo_bundle` as a normal package. Always load the mounted script via `importlib.util.spec_from_file_location` pointing at `/mnt/data/lingo_bundle.py`, as documented in `lingo/slidegen_glossary.md`.

#### Lingo glossary scope defaults
- Default scope for glossaries (as enforced in the Lingo system prompt): **include** abbreviations/acronyms and capitalized defined terms; **exclude by default** brand/branch names, one‑off company or product names, people names, and generic proper nouns, unless they are explicitly defined in the document or the user asks to include them.
- Lingo should treat `lingo/lingo_glossary_guidance.md` – especially the **Excluded Terms** table – as the reference for what to skip by default (brands/SKUs, short generic abbreviations, generic jargon, minor proper nouns).
- The GPT must **never** ask users to choose a glossary “scope” before generating the initial glossary. Always apply the default scope, present the table, and let users request broader/narrower coverage in follow‑up messages instead of offering scope menus up front.

### 2) Multi-slide glossary duplication (bug-report: relationship remapping)
- Do not re‑implement slide duplication logic. Always use `core.rearrange.duplicate_slide` (or the bundle’s equivalent) when cloning slides.
- When extending duplication logic, never assume relationship IDs (`rId`s) are contiguous or simple integers. Always build explicit old→new `rId` mappings and rewrite every `r:*` attribute that points at a relationship.
- Avoid mixing relationship objects and string IDs as dictionary keys. Use string IDs (`rel.rId`) consistently for both building and looking up mappings.
- Any new feature that duplicates slides (e.g., overflow pagination, new multi-slide layouts) must have tests that cover: (a) templates with images/logos, and (b) multi-slide cases where more than one duplicate is created.

### Bug Fix
Role: Bug fix assistant for kpmg-pptx. Only change code related to the identified bug.
Allowed git: same as Feature. Additionally: `git cherry-pick` if needed.
Steps:
1) Reproduce locally; add a failing test if easy.
2) Branch `fix/<issue#>-<slug>`.
3) Minimal fix; commit `fix(scope): one-line summary`.
4) Prove fix (test or reproducible steps); open PR.
Confirm before: any deletion >20 lines or dependency changes.

### Refactor
Goal: Improve readability/structure without changing outputs.
Guardrails: No API signatures or public types changed. Commit as `refactor(scope): ...`. Run tests before/after; attach diffstat and test logs.

### Code Review
Review git history for recent code changes.
- Current git status: !`git status`
- Recent changes: !`git diff HEAD~1`
- Recent commits: !`git log --oneline -5`
- Current branch: !`git branch --show-current`
Focus: code quality, security, performance, testing, documentation. Provide actionable feedback.

### Conflict Resolution
Task: Resolve merge/rebase conflicts on branch <name>.
Rules: never edit generated assets; fix sources. For ambiguous conflicts, propose both options in comments. After resolution: run tests; then `git add -A && git rebase --continue` (or commit merge). If conflicts explode: `git rebase --abort` and ask for help.

### Merge Preparation
Task: Prepare PR for merge.
Steps: `git fetch` then `git rebase origin/main`; ensure tests/lint pass; summarize changes, risk, rollback in PR. Do NOT merge.

## Coding Style & Naming
- Prefer kebab-case for folders/files; follow language norms for identifiers (Python: snake_case; classes: PascalCase).
- Indent with 4 spaces; keep functions small and single-purpose.
- Use `rg` for searches (never `grep` for project-wide). `rg "pattern"`, `rg --files | rg name`, `rg -t python "def"`.
- Prefer `fd`/`fdfind` for file discovery; `jq` for JSON.

## Testing Guidelines
- Tests live in `tests/`; name files `test_*.py`; use `pytest` or stdlib `unittest`.
- Aim for coverage of core helpers: duplication, formatting, generators.

## Commit & PR Guidelines
- Follow existing history: `feat|fix|refactor|chore(scope): summary`.
- PRs should include description, linked issue, screenshots (if relevant), and test results.

## Install Guidance
- macOS: `brew install ripgrep fd jq`
- Debian/Ubuntu: `sudo apt update && sudo apt install -y ripgrep fd-find jq` (alias `fd=fdfind`).
