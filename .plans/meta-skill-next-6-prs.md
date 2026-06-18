# Meta-Skill Next 6 PRs

Seed plan extracted from the interactive roadmap in
`.agents/artifacts/meta-skill-evaluation-report.html`. Treat this file as the
pre-Ultraplan baseline; the upgraded plan is
`.plans/meta-skill-next-6-prs.ultra.md`.

1. Architecture hygiene: refresh stale generated-package language in
   architecture docs.
2. Case metadata: add fields for type, source, risk, tags, owner, and split to
   manifests and reports.
3. Case curation: add an eval curate workflow for bugs, transcripts, manual
   checks, and pasted examples.
4. Trigger balance: add helper/lint support for paired should-trigger and
   should-not-trigger prompts.
5. Reference solution: allow cases to carry reference solutions and prove
   graders can pass them.
6. Splits: implement train, validation, heldout, and regression split semantics
   in lint/run/report.
