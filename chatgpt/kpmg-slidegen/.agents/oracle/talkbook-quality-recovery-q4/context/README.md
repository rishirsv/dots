# kpmg-slidegen

Unified KPMG slide generation repo (formerly split across `kpmg-pptx-gen` and `kpmg-slidegen`).

Core docs:

- `ARCHITECTURE.md`
- `docs/SPEC.md`
- `docs/PROJECT-PLAN.md`

Primary folders:

- `extractor/` - template extraction and codegen
- `generator/` - deck generation runtime
- `qa/` - render/compare helpers
- `templates/` - template assets/wrappers
- `dist/` - skill distributions (including Talkbook consulting copilot)
- `tests/` - regression and guardrail tests

Common commands:

- `python3 -m unittest discover -s tests -p 'test_*.py'`
- `node tests/test_generator_smoke.js`
- `python3 cli.py extract --template templates/kpmg-diligence --pptx "templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx"`
