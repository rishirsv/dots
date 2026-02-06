# Template Onboarding Runbook

This runbook describes how to onboard a new PPT template into `kpmg-slidegen` using the native workflow.

## 1) Initialize Template Project

```bash
python3 cli.py init-template \
  --template templates/<template-name> \
  --pptx /absolute/path/to/source-template.potx
```

What this does:
- creates template folder scaffold
- copies source `.potx/.pptx`
- seeds profile + tuning config
- copies strict runtime skeleton

## 2) Run Native Extraction

```bash
python3 cli.py extract \
  --template templates/<template-name> \
  --pptx templates/<template-name>/<source-file>.potx \
  --mode native \
  --all-layout-types \
  --refresh-assets \
  --profile templates/<template-name>/template.profile.json
```

Outputs:
- `template.json` (schema v4)
- `template.js` (native layout renderer)
- `assets/assets-base64.json`
- `assets/gradient_data_uris.json`
- benchmark samples under `samples/` auto-synced to the full extracted layout set (`benchmark-normal.json`, `benchmark-stress.json`)

## 3) Smoke Test Runtime

```bash
cd templates/<template-name>
npm install
node generator/validate.js --in samples/benchmark-normal.json
node generator/index.js --in samples/benchmark-normal.json --out outputs/runs/manual/benchmark/deck.pptx --no-strict
```

## 4) Run Visual Tuning Loop

Requires local tooling:
- `soffice`
- `pdftoppm`
- Python libs: `pillow`, `numpy`

Example:

```bash
python3 cli.py tune-template \
  --template templates/<template-name> \
  --sample templates/<template-name>/samples/benchmark-normal.json \
  --max-rounds 8
```

After visual review, if thresholds pass and human approval is required:

```bash
python3 cli.py tune-template \
  --template templates/<template-name> \
  --sample templates/<template-name>/samples/benchmark-normal.json \
  --max-rounds 8 \
  --human-approve
```

Artifacts are written to:
- `templates/<template-name>/outputs/tuning/<run_id>/`

## 5) Profile Tuning Edits

Adjust only template-local files:
- `template.profile.json`
- `tuning.loop.json`

Do not edit Diligence files for new template tuning.

## 6) Diligence Guardrail

Do not modify:
- `templates/kpmg-diligence/**`

unless explicitly approved.

## 7) Regression Checklist

- `python3 -m unittest discover -s tests -p 'test_*.py'`
- Confirm native extraction generates all intended layouts.
- Confirm no unapproved Diligence drift.
- Confirm tuning artifacts exist for each round.
