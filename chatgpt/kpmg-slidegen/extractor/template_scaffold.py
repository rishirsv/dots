from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Dict, List


def _slugify(value: str) -> str:
    out: List[str] = []
    prev_dash = False
    for ch in (value or "").strip().lower():
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
            continue
        if not prev_dash:
            out.append("-")
            prev_dash = True
    s = "".join(out).strip("-")
    return s or "template"


def _write_json_if_missing(path: Path, data: Dict) -> None:
    if path.exists():
        return
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def _write_text_if_missing(path: Path, text: str) -> None:
    if path.exists():
        return
    path.write_text(text)


def _patch_generator_index_for_native_slots(generator_dir: Path) -> None:
    index_js = generator_dir / "index.js"
    if not index_js.exists():
        return

    src = index_js.read_text()
    old = """  slides.forEach((slideSpec, idx) => {
    const layout = template.LAYOUTS?.[slideSpec.type];
    const slots = layout?.slots || {};
    for (const [slotName, slotDef] of Object.entries(slots)) {
      if (!slotDef?.required) continue;
      if (isMissingSlotValue(slideSpec[slotName])) {
        missing.push({ slideIndex: idx, slideType: slideSpec.type, slot: slotName });
      }
    }
  });
"""
    new = """  slides.forEach((slideSpec, idx) => {
    const resolvedType = template.resolveLayoutType?.(slideSpec.type) || slideSpec.type;
    const layout = template.LAYOUTS?.[resolvedType];
    const slots = layout?.slots || {};
    const aliases = layout?.slotAliases || {};
    const payload = slideSpec?.slots && typeof slideSpec.slots === 'object' ? slideSpec.slots : slideSpec;
    for (const [slotName, slotDef] of Object.entries(slots)) {
      if (!slotDef?.required) continue;
      let value = payload?.[slotName];
      if (isMissingSlotValue(value)) {
        for (const [alias, canonical] of Object.entries(aliases)) {
          if (canonical !== slotName) continue;
          if (!isMissingSlotValue(payload?.[alias])) {
            value = payload?.[alias];
            break;
          }
        }
      }
      if (isMissingSlotValue(value)) {
        missing.push({ slideIndex: idx, slideType: resolvedType, slot: slotName });
      }
    }
  });
"""
    if old in src:
        index_js.write_text(src.replace(old, new))
        return

    # Patch already-updated generator skeletons that include alias-aware required slot checks,
    # but still look up layouts using raw slideSpec.type.
    line_old = "    const layout = template.LAYOUTS?.[slideSpec.type];\n"
    line_new = (
        "    const resolvedType = template.resolveLayoutType?.(slideSpec.type) || slideSpec.type;\n"
        "    const layout = template.LAYOUTS?.[resolvedType];\n"
    )
    patched = src.replace(line_old, line_new)
    patched = patched.replace(
        "        missing.push({ slideIndex: idx, slideType: slideSpec.type, slot: slotName });\n",
        "        missing.push({ slideIndex: idx, slideType: resolvedType, slot: slotName });\n",
    )
    if patched != src:
        index_js.write_text(patched)


def init_template_scaffold(
    *,
    template_dir: Path,
    source_pptx: Path,
    copy_generator_from: Path,
) -> Dict[str, Path]:
    """
    Initialize a template project scaffold and copy the source .pptx/.potx file.
    """
    template_dir.mkdir(parents=True, exist_ok=True)

    for rel in ("assets", "generator", "samples", "references", "outputs", "tools"):
        (template_dir / rel).mkdir(parents=True, exist_ok=True)

    copied_source = template_dir / source_pptx.name
    if source_pptx.resolve() != copied_source.resolve():
        shutil.copy2(source_pptx, copied_source)

    # Reuse the hardened runtime skeleton from Diligence for strict checks/reporting.
    if copy_generator_from.exists():
        shutil.copytree(copy_generator_from, template_dir / "generator", dirs_exist_ok=True)
        _patch_generator_index_for_native_slots(template_dir / "generator")

    template_name = template_dir.name
    display_name = template_name.replace("-", " ")

    _write_text_if_missing(
        template_dir / "README.md",
        f"""# {template_name} (Template Project)

This folder is a self-contained generator project for the **{display_name}** PowerPoint template.

## What’s here

- `{source_pptx.name}`: source template file (visual source of truth)
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
cd {template_dir}
npm install
python3 ../../cli.py extract --template . --pptx "{source_pptx.name}" --mode native --all-layout-types
```
""",
    )

    _write_json_if_missing(
        template_dir / "package.json",
        {
            "name": f"{_slugify(template_name)}-pptx-gen",
            "private": True,
            "type": "module",
            "dependencies": {
                "pptxgenjs": "4.0.1",
            },
            "scripts": {
                "template:init": f"python3 ../../cli.py init-template --template . --pptx \"{source_pptx.name}\"",
                "template:extract:native": f"python3 ../../cli.py extract --template . --pptx \"{source_pptx.name}\" --mode native --all-layout-types",
                "template:tune": "python3 ../../cli.py tune-template --template .",
                "validate:demo": "node generator/validate.js --in samples/benchmark-normal.json",
                "gen:demo": "RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/demo; mkdir -p \"$OUT_DIR\"; node generator/index.js --in samples/benchmark-normal.json --out \"$OUT_DIR/deck.pptx\"",
            },
        },
    )

    _write_json_if_missing(
        template_dir / "template.profile.json",
        {
            "templateMode": "native",
            "requiredSlotOverrides": {},
            "slotAliases": {},
            "layoutDisplayNames": {},
            "masterMapping": {},
            "paginationGrouping": {},
            "tokenOverrides": {},
            "styleOverrides": {
                "textScale": 1.0,
            },
        },
    )

    _write_json_if_missing(
        template_dir / "tuning.loop.json",
        {
            "enabled": True,
            "maxRounds": 8,
            "thresholds": {
                "chromeSsim": 0.985,
                "contentSsim": 0.960,
                "meanSlotDriftIn": 0.04,
                "maxSlotDriftIn": 0.10,
                "severeOverlaps": 0,
                "outOfBounds": 0,
            },
            "render": {
                "dpi": 300,
                "pdfConverter": "soffice",
                "pngConverter": "pdftoppm",
            },
            "autoFixPriority": [
                "profile.styleOverrides.textScale",
                "profile.requiredSlotOverrides",
                "profile.masterMapping",
            ],
            "requireHumanApproval": True,
        },
    )

    _write_json_if_missing(
        template_dir / "samples" / "benchmark-normal.json",
        {
            "metadata": {
                "title": f"{display_name} benchmark (normal)",
                "author": "kpmg-slidegen",
            },
            "slides": [],
        },
    )

    _write_json_if_missing(
        template_dir / "samples" / "benchmark-stress.json",
        {
            "metadata": {
                "title": f"{display_name} benchmark (stress)",
                "author": "kpmg-slidegen",
            },
            "slides": [],
        },
    )

    return {
        "template_dir": template_dir,
        "copied_source": copied_source,
        "profile": template_dir / "template.profile.json",
        "loop": template_dir / "tuning.loop.json",
    }
