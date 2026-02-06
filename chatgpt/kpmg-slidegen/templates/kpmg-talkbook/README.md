# kpmg-talkbook (Template Project)

This folder is a self-contained generator project for the **kpmg talkbook** PowerPoint template.

## What’s here

- `PPT_Generic_talkbook_standard_EN.potx`: source template file (visual source of truth)
- `template.js` / `template.json`: generated wrapper + metadata (do not hand-edit)
- `template.profile.json`: per-template overrides for native extraction and tuning
- `tuning.loop.json`: visual parity thresholds and loop controls
- `assets/`: template-owned images + generated asset manifests
- `generator/`: template-local Node runtime (builders, strict checks, report writers)
- `samples/`: benchmark input deck JSON specs
- `references/`: reference renders and baselines
- `outputs/`: generated artifacts (including tuning runs)

## Quick start

```bash
cd /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/kpmg-talkbook
npm install
python3 ../../cli.py extract --template . --pptx "PPT_Generic_talkbook_standard_EN.potx" --mode native --all-layout-types
```
