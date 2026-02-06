# kpmg-slidegen

Core docs:
- `ARCHITECTURE.md`
- `docs/SPEC.md`
- `docs/TEMPLATE-ONBOARDING.md`

Project areas:
- `templates/` - per-template projects
- `extractor/` - Python extraction, codegen, and tuning pipeline
- `tests/` - regression suite

## Quick Commands

Run tests:

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
```

Initialize a new template:

```bash
python3 cli.py init-template --template templates/<name> --pptx /path/to/source.potx
```

Extract template contract (native mode):

```bash
python3 cli.py extract --template templates/<name> --pptx templates/<name>/<source>.potx --mode native --all-layout-types --refresh-assets
```

Run visual tuning loop:

```bash
python3 cli.py tune-template --template templates/<name>
```

Generate a deck (template runtime):

```bash
cd templates/<name>
node generator/index.js --in samples/benchmark-normal.json --out outputs/runs/manual/demo/deck.pptx --no-strict
```

## Diligence Freeze

`templates/kpmg-diligence/` is the legacy production contract and remains frozen unless explicitly approved.
