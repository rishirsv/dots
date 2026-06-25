# Judge

This local reference preserves the Doctor-specific Judge workflow. The shared
house rubric now lives at
[judge-rubric.md](../../../references/judge-rubric.md), and the shared payload
hygiene standard lives at
[payload-hygiene.md](../../../references/payload-hygiene.md). Use those root
references as the authority for scoring, payload hygiene, and runtime vs
maintainer placement.

A Judge review produces `judge-review.md` in the workbench with an **Overall
Judge Review Score** plus per-phase and per-dimension scores, so "improve my
skill" gets a number, not just prose.

> **Boundary:** the doctor scores the three *static* phases below and averages
> them. Averaging across *live eval scenarios* (running the skill many times) is
> out of scope here — this is a static review.

## Doctor Review Workflow

1. Read [judge-rubric.md](../../../references/judge-rubric.md) and score only
   the phases and dimensions defined there.
2. Read [payload-hygiene.md](../../../references/payload-hygiene.md), run the
   payload hygiene sweep, and run the runtime-vs-maintainer placement audit
   before final scoring.
3. Run `<meta-skill-root>/scripts/metaskill validate <skill-dir> --json` and
   use that command output for the Validation phase.
4. Render Discovery and Implementation as short assessments followed by tables
   with `Dimension`, `Reasoning`, and `Score`. Each reasoning cell must cite the
   skill's own text, linked references, or visible payload surface.
5. Report payload hygiene, placement audit, validation, and combined findings in
   the output shape from the shared rubric.

## Doctor-Specific Focus

Use these lenses while applying the shared rubric:

- **Activation** — trigger clarity, realistic phrasing, near misses, and
  non-trigger boundary. Escalate trigger reliability evidence to
  `skill-evaluator`.
- **Runtime clarity** — default path, output contract, stop/ask points, and
  final checks.
- **Opening contract** — first runtime block states the job, default path, and
  boundary plainly before deeper mechanics.
- **Terminology consistency** — route names, output labels, examples, and linked
  references use the same plain vocabulary.
- **Resources** — linked references, scripts, assets, dependency clarity, source
  leakage, and stale files.
- **Runtime contamination** — copied prompt text, provider names, raw research,
  author/source provenance, thread IDs, local paths, source-specific artifact
  names, and source-note prohibitions living in runtime instead of reusable
  behavior.
- **Controls** — user files as data, user gates, external writes, and
  package/publish gates.

## Boundary

The completed chat review or saved `judge-review.md` is evidence, not a source
edit request. Source edits require explicit approval for a concrete change; see
[doctor.md](doctor.md#approval-gated-edits).
