# KPMG PPTX Generator - Specification

Last updated: 2026-02-05

## Product Goal

Enable fast onboarding of multiple KPMG PowerPoint templates so ChatGPT can generate slides against different template-native slide masters and layouts with minimal setup.

## Core Principles

1. Keep Diligence stable.
2. Make new template onboarding fast (`init-template` + `extract` + `tune-template`).
3. Keep extraction deterministic and testable.
4. Keep tuning changes template-local.

## Supported Modes

## `legacy` mode

- Default mode.
- Maintains existing Diligence output contract.
- Uses fixed legacy slide type set.

## `native` mode

- Produces template-native layout contract.
- Exposes all layout types as `layout.<slug>` when requested.
- Uses slot payloads under `slides[].slots`.
- Adds deterministic per-layout `typeAliases` so canonical + ergonomic variant names can be used safely.

## Public CLI Interface

## `init-template`

```bash
python3 cli.py init-template --template templates/<name> --pptx /path/to/template.potx
```

Creates:
- template folder scaffold
- copied source template file
- runtime skeleton
- `template.profile.json`
- `tuning.loop.json`

## `extract`

```bash
python3 cli.py extract --template templates/<name> --pptx templates/<name>/<file>.potx --mode native --all-layout-types --refresh-assets --profile templates/<name>/template.profile.json
```

Arguments:
- `--mode`: `legacy` or `native`
- `--all-layout-types`: include all detected layouts (native)
- `--refresh-assets`: regenerate asset manifests
- `--profile`: optional profile override path

Outputs:
- `template.json`
- `template.js`
- auto-generated asset manifests when needed
- synchronized `samples/benchmark-normal.json` and `samples/benchmark-stress.json` coverage for all extracted native layouts

## `tune-template`

```bash
python3 cli.py tune-template --template templates/<name> [--sample ...] [--max-rounds N] [--human-approve]
```

Runs iterative visual parity loop and writes round artifacts.

## Template JSON Contract

## Native schema v4 additions

- `templateMode`
- `masters`
- `layouts`
- dynamic `slideDimensions`
- per-layout `style` (colors/decoration)
- per-layout `typeAliases` (optional)

## Backward-compatible fields retained

- `colors`
- `fonts`
- `detectedLayoutSlots`
- `layoutGeometry`
- `usedLayouts`
- `assets`

## Native Slide Spec

```json
{
  "metadata": {},
  "slides": [
    {
      "type": "layout.<slug>",
      "slots": {},
      "notes": "optional"
    }
  ]
}
```

Supported slot kinds:
- `text`
- `image`
- `table`
- `chart`

## Profile Layer (`template.profile.json`)

Supported keys:
- `requiredSlotOverrides`
- `slotAliases`
- `layoutDisplayNames`
- `masterMapping`
- `paginationGrouping`
- `tokenOverrides`
- `styleOverrides`

Merge order:
1. extracted defaults
2. profile overrides

## Tuning Loop Requirements

Required run artifacts per round:
- `reference_png`
- `candidate_png`
- `diff_png`
- `metrics.json`
- `applied_fixes.json`
- `round_summary.md`

Threshold defaults:
- `chromeSsim >= 0.985`
- `contentSsim >= 0.960`
- `meanSlotDriftIn <= 0.04`
- `maxSlotDriftIn <= 0.10`
- `severeOverlaps == 0`
- `outOfBounds == 0`

Stop rule:
- pass thresholds OR max rounds reached
- optional mandatory human approval gate

## Diligence Freeze Rules

1. No direct edits under `templates/kpmg-diligence/**` without explicit approval.
2. Diligence remains legacy mode.
3. Shared changes must pass Diligence regressions.

## Validation

Run core regression suite:

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
```

Template runtime smoke test:

```bash
cd templates/<name>
node generator/validate.js --in samples/benchmark-normal.json
node generator/index.js --in samples/benchmark-normal.json --out outputs/runs/manual/benchmark/deck.pptx --no-strict
```
