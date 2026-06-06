# Tessl Eval Dogfood Findings

## Scratch Setup

- Scratch project: `/tmp/tessl-e2e-dogfood-INp8ic`
- Skill package: `acme-change-brief`
- Scenario: `evals/acme-rollback-note`
- Solver agent: `codex:gpt-5.5`
- Scorer: Tessl generic scorer

The hand-authored scenario uses the Tessl rubric shape:

```json
{
  "context": "...",
  "type": "weighted_checklist",
  "checklist": [
    {
      "name": "...",
      "description": "...",
      "max_score": 25
    }
  ]
}
```

## Tessl Shape Observed

Tessl keeps the source tree flat:

```text
acme-change-brief/
  .tessl-plugin/plugin.json
  SKILL.md
  evals/acme-rollback-note/
    task.md
    criteria.json
```

When both `tile.json` and `.tessl-plugin/plugin.json` exist, Tessl treats `plugin.json` as authoritative and warns that `tile.json` is ignored. Packaging may synthesize tile metadata internally, but the local authoring surface is the plugin plus `evals/`.

`tessl eval run <plugin-dir>` creates one eval run with scenario solutions for:

- `baseline`
- `usage-spec`

These are result variants inside the run response, not local variant folders.

## Rubric And Prompt Lessons

The first attempt used an invalid rubric shape:

```json
{ "criteria": [{ "name": "...", "weight": 1 }] }
```

Tessl rejected this as `INVALID_RUBRIC`. The accepted shape is `weighted_checklist` with max-score entries.

The first valid scenario asked the agent to answer in chat. The run completed, but both variants scored `0` because Tessl's scorer looked for solution artifacts and found no meaningful output. This is a key product lesson: Tessl skill evals are strongest when the task asks for an observable artifact or diff.

The second scenario asked the agent to create `brief.md`. That produced meaningful results:

- Run: `019e9e00-3460-73ae-bcb4-3428f0f2d241`
- Baseline: `62 / 100`
- Usage-spec: `100 / 100`

The rubric made the skill lift obvious: baseline captured much of the content but missed the exact Acme headings, while usage-spec followed the skill structure completely.

## Pipeline Details To Borrow

Tessl exposes pipeline stages in run metadata:

- `validate-inputs`
- `stage-scenario`
- `install-fixtures`
- `render-prompt`
- `run-setup`
- `sanitize`
- `solve`
- `capture-activation`
- `stage-inputs`
- `compute-diff`
- `score`

This makes run diagnosis easier. Meta Skill should expose an equivalent compact run summary instead of forcing users to infer status from raw traces.

Tessl also records per-variant:

- solution id
- variant name
- solution artifact key
- assessment results per rubric item
- activation capture
- solve/scorer token usage
- solve/scorer duration

## Product Implications For Meta Skill

Do not add local variant folders. Keep the local run shape flat and compare by metadata.

Keep the existing run-local `payload/`, but add first-class run metadata that points directly at the mounted skill:

```json
{
  "skill_root": "payload",
  "skill_md": "payload/SKILL.md"
}
```

Evaluation creation should author scoring rubrics up front. Our current evals have criteria, but the results are not first-class scores. The next Meta Skill increment should add a scored review layer over existing `criteria.json`, with per-criterion scores and reasoning saved in the run output.

Run summaries should group evidence by scenario and run source, for example:

```text
scenario: acme-rollback-note
source: no-skill      score: 62
source: working-skill score: 100
```

The source can be `no_skill`, `working_payload`, an installed skill, or a future candidate payload. It does not require a variant directory.

## Gaps Found

1. Meta Skill does not create first-class scored rubrics during eval creation.
2. Meta Skill does not save a compact run summary with per-scenario/per-source scores.
3. Meta Skill does not expose a baseline-vs-skill comparison as a first-class command or report.
4. Meta Skill should explicitly record `payload/SKILL.md` in run metadata and solver instructions.
5. Chat-only skill evals need a response-scoring path; artifact/diff scoring alone is not enough for research and knowledge-work skills.
6. Activation capture should be explicit evidence, especially for research-like failures where the skill is unavailable or not used.
7. Tessl's `eval compare` is documented in current docs but not present in the installed `tessl 0.82.0` CLI, so command availability must be verified at runtime.

