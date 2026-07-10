# Payload Hygiene

Use this shared standard whenever a skill payload is created, cleaned, reviewed,
fixed, evaluated, packaged, or release-gated.

The core rule is simple: source evidence shapes runtime behavior, but source
evidence is not runtime behavior. Raw research, session text, rejected options,
prompt-role language, thread ids, local paths, and design-history notes belong
in `.agents/`, review output, or durable project docs unless they are
direct runtime dependencies.

## When To Use This

Read this before:

- finalizing a new or substantially revised skill
- cleaning an existing skill for portability
- diagnosing leaked source, prompt, system, or maintainer language
- writing or grading a skill-quality eval task
- packaging or release-gating a skill payload

For a scored static review, use this file with
[judge-rubric.md](judge-rubric.md).

## Placement Rule

| Material | Portable runtime payload | Evaluation or development state |
|---|---|---|
| Reusable operating rule | Yes | Optional rationale |
| Runtime reference, schema, script, asset, or template | Yes, linked directly from `SKILL.md` | Optional design notes |
| Source-specific research, article, company, person, URL, email, or transcript | Only when the runtime task requires that source | Yes |
| User prompt text, system/developer text, thread id, rollout id, local path, command transcript | Only when the skill's real job is to inspect that exact class of material | Yes |
| Rejected names, design alternatives, migration notes, roadmap, maintainer plans | No | Yes |
| Eval seeds, judge guidance, expected outputs, validation fixtures | No, unless explicitly approved as runtime examples | Yes, under `<skill>/evals/` |

## Payload Hygiene Sweep

Inspect the full shipped skill payload:

- `SKILL.md`
- linked runtime references
- `agents/` prompts or metadata
- scripts, examples, templates, assets, and fixtures
- visible text inside HTML, Markdown examples, screenshots-as-code, copy/export
  payloads, fixture labels, first-viewport text, alt text, button text, and any
  other string a future reader could see or copy

Build a task-local contamination query from the evidence under review, then run
it with `rg -n --hidden -S` across the target skill directory and every linked
runtime reference outside that directory, including shared plugin-level
references. Resolve local links before scanning so a root reference cannot hide
leakage from a skill-scoped search. Derive scan terms from the current review
packet; do not bake incident names, provider names, author names, source URLs,
or one-off project terms into reusable guidance.

Scan for these classes:

- provider, model, company, article, author, or source names that are not direct
  runtime dependencies
- raw research URLs, commands, source-provenance notes, or citation trails
- copied user prompt text, system/developer prompt text, tool transcript
  language, or prompt-policy wording
- one-off report paths, workbench paths, thread ids, rollout ids, task ids, or
  local file paths
- rejected options, migration history, "we decided" language, stale draft labels,
  or design-discussion residue
- skill-authoring or maintainer terms leaking into ordinary user artifacts,
  such as "runtime", "template machinery", validator names, internal data
  attributes, fixture names, or local reference paths
- planning scaffolding labels such as "goals", "non-goals", "roadmap",
  "migration plan", or "big bet" when inherited from a source prompt instead of
  being the artifact's natural reader contract

Record the sweep in review, clean, verify, or release output:

- `Payload hygiene: pass` or `Payload hygiene: fail`
- classes or terms scanned
- allowed hits, with why each is a real runtime dependency or harmless example
- findings, with file paths and the smallest cleanup
- visible/copyable surfaces checked

## Runtime Vs Maintainer Placement Audit

Audit every heading in `SKILL.md` and every linked runtime reference. For each
section, ask: "Would a future agent need this while using the skill on a user's
task?"

Flag sections whose primary audience is the skill maintainer, package author,
validator author, future skill editor, or release owner. Examples include
adding new primitives or recipes, package hygiene, release or dist rules,
validator internals, hidden workbench management, roadmap planning, developer
maintenance, migration notes, and external-system implementation boundaries.

Those sections belong in repository `.agents/` docs, validators, package docs,
maintainer notes, or another non-runtime surface. They belong in the portable
payload only when the target skill's actual runtime job is skill maintenance.

Record:

- `Placement audit: pass` or `Placement audit: fail`
- headings and linked references checked
- allowed maintainer-facing hits, with why the target skill needs them at
  runtime
- findings, with file paths, section headings, and whether to move, remove, or
  rewrite the material

## Clean Output

For a payload clean pass, return:

```text
Target:
Scope checked:
Payload hygiene: pass | fail
Placement audit: pass | fail
Findings:
Smallest cleanup:
Validation to run:
Residual risk:
```

When the current lane owns mutation and the user directly requests edits, make
the smallest source-owned cleanup. A read-only review reports the cleanup and
hands implementation to `skill-author`. Never patch generated packages,
installed caches, or local synced copies directly.
