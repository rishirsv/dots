# Create an HTML-template skill

Read this alongside `skill-author` when creating or revising a named
HTML-template skill. This file covers the HTML-specific package and handoff;
`skill-author` covers the rest of the skill and its validation.

Create a template skill when a recurring artifact needs its own content rules,
reference page, and preview. A generic HTML form factor does not need another
skill.

## Package

Use this package structure:

```text
<skill-name>/
├── SKILL.md
├── agents/openai.yaml
├── artifact-template.json
├── assets/
│   ├── reference.html
│   └── preview.png
└── references/                 # only for conditional domain guidance
```

Use this manifest exactly, replacing only the asset paths when the package
genuinely uses different relative locations:

```json
{
  "schemaVersion": 1,
  "kind": "html",
  "reference": "assets/reference.html",
  "preview": "assets/preview.png"
}
```

`kind: "html"` is a Dots-specific marker. Do not assume another template picker
recognizes it.

Resolve manifest paths relative to the template skill directory. Keep the
retained reference and preview unchanged while the finished skill produces user
artifacts. During an authorized template revision, change only assets in scope
and rebuild the preview when the reference changes. Do not package task-local
renders, prompts, source maps, or run history with the skill.

## Write the skill

Make the template skill explicit-only. Its description begins with the named
artifact job and says to use it when the user selects or names that template.
Set `policy.allow_implicit_invocation: false` in `agents/openai.yaml`.

Keep `SKILL.md` focused on what makes this artifact distinct:

- the target, audience, and source material to resolve;
- the domain investigation or preparation required before composition;
- required claims, sections, evidence, boundaries, and completion criteria;
- whether structure is fixed or must adapt to the source; and
- when to call `$html`, including whether chat or another output is allowed.

Leave page or fragment choice, theme, components, assembly, artifact
accessibility, browser delivery, and visual checks to HTML. Do not repeat that
guidance in every template skill.

Use this workflow shape:

1. Prepare the content from the user's request and inspected sources. Do not
   invent facts to fill a visual or structural slot.
2. Pass `artifact-template.json` and the finished content and structure to
   `$html`; HTML opens and inspects the reference and preview from the template
   skill. If `$html` is unavailable, say so and stop rather than recreating it.
3. Return only the requested finished artifact.

Follow the user's requested content and explicit deviations. Otherwise, use the
template skill for required coverage and structure, and the retained reference
for visual treatment.

For an adaptive template, the reference demonstrates composition, density,
component language, and recurring treatment. It is not a form to fill. Do not
copy its headings, sample claims, or section order unless the source
independently calls for them. For a fixed template, name the stable regions and
fidelity rules explicitly in the template skill.

## Build the reference and preview

Build `assets/reference.html` through the normal HTML workflow. Use realistic,
clearly fictional sample content that demonstrates the intended treatment
without becoming runtime evidence. Keep it self-contained and free of private
paths or external requests.

Create `assets/preview.png` from the retained reference. It identifies the
template; it does not prove that future outputs are correct. Inspect the preview
and reject it when it is blank, clipped, corrupted, or misleading. Prefer a
representative first viewport that shows the artifact's hierarchy and visual
identity.

## Check the package

Before delivery:

- validate the skill with Meta-Skill;
- run `node --test scripts/template-contract.test.mjs` from the HTML skill
  directory after adding or moving a template package or gallery entry; it
  checks the manifest, in-package assets, preview signature, and gallery links;
- inspect the reference source manually for self-containment and external
  requests, then confirm the preview represents it;
- confirm the skill invokes `$html` without duplicating its format workflow;
- confirm adaptive versus fixed structural authority is unambiguous; and
- review every changed source file directly.

When behavior evidence is requested or material uncertainty remains, hand the
  required content, manifest handling, adaptive or fixed behavior, missing
  assets, and HTML handoff cases to `skill-evaluator`.
