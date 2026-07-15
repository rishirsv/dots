---
name: skill-reviewer2
description: "Use only when explicitly invoking $skill-reviewer2 to diagnose an agent skill or plugin without changing source or running new trials. Produces evidence-backed defects, smallest corrections, and precise handoffs; not for requested edits or behavioral evaluation."
---

# Skill Reviewer 2

Diagnose an agent skill or plugin from the evidence that already exists. Keep
the work read-only: do not edit source, create workbench state, save diagnostic
artifacts, or run fresh trials. Identify supported defects, explain their
likely effects, and propose the smallest correction that addresses each cause.

Use `skill-author` when the user asks to change source. Use `skill-evaluator`
when the answer requires new task runs, candidate comparisons, grading, or run
history. Do not claim that static inspection proves how a skill behaves in use.

## Set The Scope

Start with the exact question the available evidence can answer. Keep the
scope narrow for a named trigger, wording, link, resource, or reported defect.
Use a full diagnostic for a new skill, broad redesign, shared-reference change,
packaging claim, or defect spanning several runtime surfaces.

Read repository instructions before judging local conventions, commands,
paths, or ownership.

A full diagnostic must cover discovery and purpose, the effective payload and
cross-surface contradictions, common and important failure paths, tool and file
handling, validation and test evidence, output and completion behavior, and
payload or package hygiene. Within those areas, select only checks that apply
to the skill. Load the relevant domain module when the skill creates or
analyzes one of its named artifacts.

For a full diagnostic, run the repository's documented read-only structural
validator when one is available. Report the result as mechanical evidence,
not proof of task success.

Record the intended behavior, files and artifacts inspected, evidence
available, and evidence gaps. Do not turn a narrow question into a general
quality audit unless the surrounding system is necessary to explain it.

## Diagnose

1. **State the claim.** Phrase the question so evidence could support or
   disprove it. Do not broaden the conclusion beyond the inspected evidence.
2. **Map the effective payload.** Inspect the applicable frontmatter, body,
   linked references, scripts, schemas, templates, assets, agent metadata,
   manifests, package contents, installed copy, tests, and existing evaluation
   reports. Distinguish source from generated or installed copies.
3. **Reconstruct the needed behavior.** Capture required inputs, the common
   path, condition-changing branches, expected output, completion state, and
   failure or stop behavior. An omitted item is a defect only when this skill
   needs it.
4. **Trace representative paths.** Walk the common case, then only the edge
   cases likely to change the diagnosis. At each step identify the activating
   condition, action, observable result, failure response, and completion
   evidence.
5. **Run focused defect sweeps.** Read
   [diagnostic-method.md](references/diagnostic-method.md) for a deep,
   cross-surface, or plugin-wide diagnosis, or when no-op, contradiction,
   ambiguity, overengineering, test, tool, or package defects may explain the
   problem.
6. **Load domain guidance only when applicable.** Read
   [domain-diagnostics.md](references/domain-diagnostics.md) when the skill
   creates or analyzes templates, financial models, spreadsheets, reports,
   presentations, or research.
7. **Rank supported findings.** Prefer deletion, consolidation, or precise
   replacement over another layer of process.

For a reported failure, distinguish whether the cause is the skill, evaluator,
harness, task, environment, or an unsupported assumption before recommending a
source correction.

For discovery or frontmatter questions, apply
[description-standard.md](../../references/description-standard.md). For a
broad or packaging diagnosis, apply
[payload-hygiene.md](../../references/payload-hygiene.md). Do not load either
reference when it cannot affect the answer.

## Use Evidence Carefully

Separate direct observations from inferred consequences. Cite exact files,
sections, commands, or existing results. Structural validation can prove
mechanical properties; it cannot prove task success. Existing evaluation runs
may support behavioral claims when their cases, outputs, and grading evidence
are available.

Treat a validation step as useful only when it can reject a plausible bad
result, its result is consumed, and failure changes the workflow or final
status. File existence, generic self-checks, ignored tool output, and
text-presence assertions are not evidence of substantive correctness.

When reported behavior may come from an older payload, compare authoritative
source with the effective installed or packaged payload read-only. Never patch
an installed cache.

## Write Findings That Can Be Acted On

Follow any severity scale, verdict vocabulary, and output contract supplied by
the user or repository. Otherwise, each finding should include:

- severity and concise defect name;
- exact location and observed evidence;
- likely consequence, labeled as inference when it is not directly observed;
- smallest source correction;
- a test or inspection that could verify the correction; and
- a falsifier when the consequence remains uncertain.

Do not report vague defects such as “too long,” “unclear,” or “needs cleanup”
without tying them to a specific rule, collision, missing branch, unused
result, or behavior. Do not silently rewrite the skill, invent domain rules,
or turn optional structure into a mandatory template.

## Return The Diagnostic

When no result contract is supplied, lead with one judgment: **Accept**,
**Accept with conditions**, **Revise**, or **Insufficient evidence**. Then give
the scope and evidence limits, followed by findings in descending consequence.
Include applicable areas where no defect was supported so the result is not
failure-only.

Finish with the smallest coherent change set. Add an evaluator handoff only
for claims that require fresh behavior evidence, or an authoring handoff when
the user wants the corrections implemented. Omit empty sections and do not
force a numeric score unless the user supplied a scoring system.
