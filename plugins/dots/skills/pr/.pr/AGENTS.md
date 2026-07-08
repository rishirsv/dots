# Workbench Guidance

This hidden folder is the private workbench for `pr`. It stores durable
skill-development knowledge and authored evaluation inputs; it is not the
runtime skill payload.

## Source Boundary

- Runtime behavior belongs in `SKILL.md` and shipped references, scripts,
  assets, examples, or templates.
- Workbench material supports skill improvement, evaluation, and packaging, but
  should not be copied into runtime files unless it is reusable, trigger-relevant,
  and safe to ship.
- Keep raw transcripts, client facts, hidden grader answers, rejected drafts, and
  source-specific notes out of runtime files.

## Folder Conventions

- Put durable specs, roadmap files, decisions, review context, and research in
  `docs/`; use `docs/research/` only when the research volume needs nesting.
- Put authored eval suites in `evals.json` and materialized task content in
  `cases/`.
- Put recurring eval presets in `presets/` only when creating a real
  preset.
- Do not create empty folders. Create a folder only when writing its first real
  file.

## Generated State

- `runs/`, `workspaces/`, `worktrees/`, `dist/`, and `calibrations/` are generated
  output. Treat them as replaceable evidence or build artifacts.
- `task.md` is visible agent input. Keep hidden expectations, validators, judge
  guidance, and answer keys outside the visible task.

## Skill-Specific Updates

- Add user-approved invariants and update guidance here when they apply only to
  this skill or workbench.
- Prefer precise "do this / do not do this" guidance over broad process notes.
- If guidance becomes generally reusable across skills, promote it to the
  Meta-Skill source docs instead of duplicating it here.
