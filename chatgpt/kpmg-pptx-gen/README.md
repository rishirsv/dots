# kpmg-pptx-gen

Core docs live in `docs/`:
- `docs/SPEC.md`
- `docs/PROJECT-PLAN.md`

Project assets and artifacts:
- `templates/` — per-template projects (each contains its own generator runtime)
- `extractor/` — Python extraction utilities (foundation deliverables)
- `dist/` — downstream “releases” (portable bundles; no repo-level QA)

Dependencies:
- `requirements/requirements.txt` is intentionally minimal (stdlib-only extractor foundations).

Run tests:
- `python3 -m unittest discover -s tests -p 'test_*.py'`

Generate a demo deck:
- `cd templates/kpmg-diligence`
- `npm install`
- `node generator/validate.js --in samples/demo.json`
- `node generator/index.js --in samples/demo.json --out outputs/runs/manual/demo/deck.pptx`

Regenerate `templates/kpmg-diligence/template.js` + `template.json`:
- `python3 cli.py extract --template templates/kpmg-diligence --pptx "templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx"`

Strict inspection outputs:
- `docs/SPEC.md`
- `docs/PROJECT-PLAN.md`
- `templates/kpmg-diligence/AGENTS.md`
