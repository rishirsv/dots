Context map for the assist package:

- AGENTS.md (constraint): repo rules, source map, validation commands, and
  generated-output boundaries.
- plugins/meta-skill/skills/skill-evaluator/SKILL.md (target): primary skill
  contract and workflow under review.
- plugins/meta-skill/skills/skill-evaluator/agents/openai.yaml (source/risk):
  invocation metadata; affects product discovery and routing.
- plugins/meta-skill/skills/skill-evaluator/references/*.md (target/source):
  evaluator reference set covering methodology, eval types, evaluation
  manifests, examples, judge alignment, calibration, human grading, trigger
  tuning, validations, and generalist targets.
- plugins/meta-skill/skills/meta-skill/SKILL.md (constraint/source): router that
  decides when `skill-evaluator` is selected and how it relates to other
  Meta-Skill specialists.
- plugins/meta-skill/skills/skill-doctor/SKILL.md and references (constraint):
  adjacent repair/review workflow; important for boundary recommendations.
- plugins/meta-skill/skills/skill-writer/SKILL.md and references (constraint):
  adjacent authoring workflow and house skill-writing standards.
- plugins/meta-skill/references/cli.md (source/validation): documented CLI
  surface for materialize, lint, run, progress, grade, human, calibrate,
  compare, list, report, validate, and doctor.
- plugins/meta-skill/references/skill-trial-runs.md (source/risk): shared
  one-off trial workflow and boundaries with evaluator/doctor work.
- plugins/meta-skill/src/meta_skill/**/*.py (source): implementation of the
  Meta-Skill CLI, runner, grading, calibration, reporting, linting, staging,
  workbench, and App Server adapter that constrain what the skill can promise.
- plugins/meta-skill/tests/*.py (validation): deterministic tests for assist
  packaging, evaluator labels/calibration, and workbench paths.
- .agents/assist-skill-evaluator-review/current-skill-evaluator.diff (risk):
  current uncommitted patch for the evaluator skill; included so the review
  sees the live working change set.

Excluded:

- dist/** generated plugin packages; rebuilt from source and not authoritative.
- Unrelated plugin/config changes in the working tree.
- Downloads research PDFs/notes; useful background exists, but this review
  should ground itself in the current local product and implementation.
