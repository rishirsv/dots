# Metaprompt 2 Portable Skill Update Plan

## Purpose

This plan covers only the downstream portable `meta-prompt` skill payload: `SKILL.md`, `agents/openai.yaml`, and `references/`. It intentionally excludes repo wrapper structure, `dist/`, GPT export materials, eval folders, source snapshot folders, and other local development artifacts.

The goal is to define a Metaprompt 2 candidate that can be compared against the current portable skill before any promotion.

## Current Portable Skill Structure

Current portable root:

```text
skill/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── essential-template.md
    ├── image-prompting.md
    ├── research-template.md
    └── standard-template.md
```

Current runtime behavior:

- Converts task descriptions into optimized standalone prompts.
- Stays in prompt-writing mode and never executes the underlying task.
- Produces one complete prompt with no surrounding explanation.
- Routes prompts into Essential, Standard, or Research shapes.
- Uses a generic image-prompting reference for image generation and image editing.
- Uses simple numeric citations for ordinary research prompts.
- Keeps prompt structure concise, outcome-first, and centered on one output specification.

Current portable skill limitations:

- The main routing model is broad and mostly model-neutral.
- There is no dedicated route for Codex or coding-agent prompts.
- GPT Image 2 prompting is folded into a generic image reference.
- Advanced citation systems are not covered.
- Operational prompts can lack enough guidance on tool use, completion criteria, verification, and source-grounding when the downstream assistant is expected to act.

## Proposed Portable Skill Structure

Proposed Metaprompt 2 portable root:

```text
skill/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── advanced-citation-formatting.md
    ├── codex-coding-prompting.md
    ├── essential-template.md
    ├── image-prompting-gpt-image-2.md
    ├── image-prompting.md
    ├── research-template.md
    └── standard-template.md
```

Proposed runtime behavior:

- Preserve the current prompt-writing contract: output the optimized prompt only.
- Keep Essential, Standard, and Research as the main visible prompt-shape families.
- Add targeted reference routing before final template selection.
- Keep ordinary prompts concise; add extra structure only when the downstream task needs it.
- Keep simple numeric citations as the default for normal research.
- Use advanced citation formatting only when the prompt must support parser-ready or source-ID-based citation systems.

## Research-Backed Changes

### GPT-5.5 And GPT-5.4 Prompting

Portable skill impact:

- Keep prompts outcome-first: define the desired result, constraints, evidence available, and output shape.
- Avoid adding heavy legacy process scaffolding to every prompt.
- Add success criteria, completion criteria, or verification only when the downstream task is operational, high-risk, or multi-step.
- For GPT-5.4-style workflows, use clearer output contracts, tool-use expectations, grounding rules, and done criteria.
- For smaller or more literal downstream models, allow slightly more explicit step order and ambiguity handling.

Proposed `SKILL.md` change:

- Add a lightweight model-aware analysis step that considers `{Target_model}` when present.
- Keep the default behavior compact when no target model is specified.

### Codex / Coding-Agent Prompting

Portable skill impact:

- Add a dedicated reference: `references/codex-coding-prompting.md`.
- Route coding-agent prompts before Essential / Standard / Research selection.
- Default Codex-style prompts to Standard unless the user requests a tiny code transform or strict one-block output.

Route here when the downstream prompt asks an assistant to:

- inspect or edit a repository
- implement, debug, refactor, or review code
- run tests, builds, shell commands, or browser checks
- work with a dirty worktree
- respect repo-local instructions
- produce a final engineering summary with verification

Guidance to include:

- Bias toward working code, not advice.
- Gather enough context before editing.
- Follow existing project patterns.
- Avoid destructive git operations unless requested.
- Respect unrelated existing changes.
- Use available edit/search/tooling patterns deliberately.
- Verify the result when feasible.
- Avoid forcing upfront plans or preambles by default.

### GPT Image 2 Prompting

Portable skill impact:

- Add a dedicated reference: `references/image-prompting-gpt-image-2.md`.
- Route GPT Image and GPT Image 2 prompts before the generic image reference.
- Keep the generic `image-prompting.md` reference for non-GPT-image or unspecified image surfaces.

Guidance to include:

- Default new GPT Image workflows to GPT Image 2.
- Define artifact type, intended use, scene, subject, composition, style, text, and constraints.
- For edits, separate what changes from what must remain unchanged.
- Quote exact text that should appear in the image.
- Specify typography, placement, hierarchy, and no-extra-text rules when text accuracy matters.
- For GPT Image 1.5 fallback, keep the prompt largely stable first and validate before retuning.

### Advanced Citation Formatting

Portable skill impact:

- Add a dedicated reference: `references/advanced-citation-formatting.md`.
- Keep `research-template.md` focused on simple readable citations.
- Route to advanced citations only when requested or clearly required.

Route here when the downstream prompt needs:

- citable units
- source IDs
- line ranges or locators
- parser-ready citation markers
- citations over retrieved tool output
- citations over injected context blocks
- citation parsing or post-processing

Guidance to include:

- Define the citable unit first: document, block/chunk, or line range.
- Prefer block-level citations for most advanced systems.
- Keep source IDs stable and distinct from locators.
- Use marker shapes such as `{CITATION_START}cite{CITATION_DELIMITER}<source_id>{CITATION_STOP}` with optional locator.
- Never invent source IDs, block IDs, line ranges, or locators.
- Do not use advanced markers for ordinary memos or research briefs.

## Proposed Routing Order

1. Identify the downstream surface and task type.
2. If the task is for Codex or a coding agent, load `codex-coding-prompting.md`.
3. If the task is for GPT Image generation or editing, load `image-prompting-gpt-image-2.md`.
4. If the task is for non-GPT image prompting, load `image-prompting.md`.
5. If the task needs advanced citation handling, load `advanced-citation-formatting.md`.
6. Select Essential, Standard, or Research.
7. Draft one standalone optimized prompt with centralized output requirements.

## Proposed `SKILL.md` Updates

- Add Codex/coding-agent as a first-class downstream prompt type.
- Add GPT Image 2 as a first-class image-prompt target.
- Add advanced citation routing.
- Preserve the instruction that the skill must not execute the underlying task.
- Preserve the full-prompt-only final output rule.
- Clarify that simple research uses numeric citations unless an advanced citation system is needed.
- Clarify that additional references are loaded only when their route applies.

## Proposed Reference File Updates

- `essential-template.md`: keep mostly unchanged; ensure strict-output prompts remain compact and exact.
- `standard-template.md`: keep as the main structured prompt shape; allow Codex/coding-agent prompts to use this pattern.
- `research-template.md`: keep simple numeric citations as the default; add a pointer to advanced citation guidance for source-ID or parser-ready workflows.
- `image-prompting.md`: keep as generic or fallback image guidance.
- `codex-coding-prompting.md`: new reference for coding-agent prompts.
- `image-prompting-gpt-image-2.md`: new reference for GPT Image 2 prompts and GPT Image 1.5 fallback posture.
- `advanced-citation-formatting.md`: new reference for advanced citation systems.

## Implementation Checklist

- [x] 1.0 Draft candidate portable structure
  - [x] 1.1 Copy current portable skill into a Metaprompt 2 candidate
  - [x] 1.2 Add new reference files in the candidate only
  - [x] 1.3 Keep the current master portable skill unchanged

- [x] 2.0 Add candidate routing
  - [x] 2.1 Route Codex/coding-agent prompts to `codex-coding-prompting.md`
  - [x] 2.2 Route GPT Image prompts to `image-prompting-gpt-image-2.md`
  - [x] 2.3 Route advanced citation prompts to `advanced-citation-formatting.md`
  - [x] 2.4 Preserve simple numeric citations as the default research pattern

- [ ] 3.0 Tighten portable instructions
  - [ ] 3.1 Review `SKILL.md` for duplicated routing language
  - [ ] 3.2 Keep `SKILL.md` concise and push specialized detail into references
  - [ ] 3.3 Confirm each reference has a clear trigger and does not overlap too heavily
  - [ ] 3.4 Confirm no non-portable notes or source material are required at runtime

- [ ] 4.0 Compare candidate behavior before promotion
  - [ ] 4.1 Test ordinary Essential, Standard, and Research prompt requests
  - [ ] 4.2 Test Codex/coding-agent prompt requests
  - [ ] 4.3 Test GPT Image generation and edit prompt requests
  - [ ] 4.4 Test advanced citation prompts
  - [ ] 4.5 Check for unwanted verbosity or over-routing

- [ ] 5.0 Promote only after acceptance
  - [ ] 5.1 Copy accepted candidate `SKILL.md` and `references/` into the master portable root
  - [ ] 5.2 Align `agents/openai.yaml` if trigger scope changes materially
  - [ ] 5.3 Validate the portable root contains only runtime payload files

## Acceptance Criteria

Metaprompt 2 is ready to become the master portable skill only if:

- It preserves current behavior for ordinary prompt-writing requests.
- It improves Codex/coding-agent prompt quality without making all prompts longer.
- It improves GPT Image 2 prompts for text, edits, compositing, layout, and production visuals.
- It supports advanced citation systems without contaminating normal research prompts.
- It keeps the portable runtime clean and progressively disclosed.
- It remains easy for the model to choose the right reference file without reading every reference every time.

## Out Of Scope For This Portable Plan

- Repo wrapper layout.
- `dist/` packaging.
- GPT export folders.
- Eval storage folders.
- Downloaded research source folders.
- Global skill installation.
- Commit, push, or PR workflow.
