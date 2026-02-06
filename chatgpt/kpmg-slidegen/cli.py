from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from extractor.codegen import TemplateConfig, write_template_files
from extractor.template_scaffold import init_template_scaffold
from extractor.tuning import run_tuning_loop


TRANSPARENT_PNG_DATA_URI = (
    "data:image/png;base64,"
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/xcAAgMBgR0J7nQAAAAASUVORK5CYII="
)


def _read_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text())


def _which(cmd: str) -> str:
    p = shutil.which(cmd)
    if not p:
        raise RuntimeError(f"Missing required executable: {cmd}")
    return p


def _maybe_profile_path(template_dir: Path, explicit_profile: Optional[str]) -> Optional[Path]:
    if explicit_profile:
        return Path(explicit_profile)
    default = template_dir / "template.profile.json"
    return default if default.exists() else None


def _sample_value(slot_name: str, kind: str, *, stress: bool) -> Any:
    k = kind.lower()
    if k == "text":
        lowered = slot_name.lower()
        if "title" in lowered:
            return "Benchmark slide title"
        if "sub" in lowered:
            return "Benchmark subtitle"
        if stress:
            return [
                "This is a stress-test paragraph designed to trigger wrapping and pagination behavior.",
                "The native renderer should still place content within placeholder bounds.",
                "Additional sentence to increase text density and validate overflow handling.",
            ]
        return "Benchmark body content"

    if k == "image":
        return TRANSPARENT_PNG_DATA_URI

    if k == "table":
        headers = ["Column A", "Column B", "Column C"]
        rows = [[f"Row {i}", f"{i * 10}", f"{i * 10 + 5}"] for i in range(1, (16 if stress else 6))]
        return {"headers": headers, "rows": rows}

    if k == "chart":
        count = 12 if stress else 5
        labels = [f"P{i}" for i in range(1, count + 1)]
        values = [i * 8 for i in range(1, count + 1)]
        return {
            "chartType": "bar",
            "series": [
                {
                    "name": "Series 1",
                    "labels": labels,
                    "values": values,
                }
            ],
        }

    return "Sample"


def _slot_bbox(slot_def: Dict[str, Any]) -> Optional[Tuple[float, float, float, float]]:
    bbox = slot_def.get("bbox")
    if not isinstance(bbox, dict):
        return None
    try:
        x = float(bbox.get("x"))
        y = float(bbox.get("y"))
        w = float(bbox.get("w"))
        h = float(bbox.get("h"))
        if w <= 0 or h <= 0:
            return None
        return x, y, w, h
    except Exception:
        return None


def _overlap_ratio(a: Tuple[float, float, float, float], b: Tuple[float, float, float, float]) -> float:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    left = max(ax, bx)
    top = max(ay, by)
    right = min(ax + aw, bx + bw)
    bottom = min(ay + ah, by + bh)
    iw = right - left
    ih = bottom - top
    if iw <= 0 or ih <= 0:
        return 0.0
    inter = iw * ih
    denom = min(aw * ah, bw * bh)
    if denom <= 0:
        return 0.0
    return inter / denom


def _slot_sort_key(slot_name: str, slot_def: Dict[str, Any]) -> Tuple[float, float, str]:
    bbox = _slot_bbox(slot_def)
    if bbox is None:
        return 1e9, 1e9, slot_name
    x, y, _, _ = bbox
    return y, x, slot_name


def _pick_benchmark_slots(layout: Dict[str, Any]) -> List[str]:
    slots = layout.get("slots") if isinstance(layout, dict) else {}
    if not isinstance(slots, dict):
        return []

    alias_map = layout.get("slotAliases")
    if not isinstance(alias_map, dict):
        alias_map = {}
    layout_style = layout.get("style")
    family = ""
    if isinstance(layout_style, dict):
        family = str(layout_style.get("layoutFamily", "") or "")

    slot_order_raw = layout.get("slotOrder")
    slot_order = [s for s in slot_order_raw if isinstance(s, str) and s in slots] if isinstance(slot_order_raw, list) else []
    for slot_name in sorted(slots.keys()):
        if slot_name not in slot_order:
            slot_order.append(slot_name)

    selected: List[str] = []
    selected_set: set[str] = set()

    def add_slot(slot_name: str) -> bool:
        if slot_name in selected_set or slot_name not in slots:
            return False

        slot_def = slots.get(slot_name)
        if not isinstance(slot_def, dict):
            return False

        kind = str(slot_def.get("kind", "text")).lower()
        if kind == "text":
            slot_bbox = _slot_bbox(slot_def)
            if slot_bbox is not None:
                for existing in list(selected):
                    existing_def = slots.get(existing)
                    if not isinstance(existing_def, dict):
                        continue
                    if str(existing_def.get("kind", "text")).lower() != "text":
                        continue
                    existing_bbox = _slot_bbox(existing_def)
                    if existing_bbox is None:
                        continue
                    if _overlap_ratio(slot_bbox, existing_bbox) < 0.02:
                        continue

                    existing_required = bool(existing_def.get("required"))
                    slot_required = bool(slot_def.get("required"))
                    if slot_required and not existing_required:
                        selected.remove(existing)
                        selected_set.remove(existing)
                        continue
                    if slot_required and existing_required:
                        continue
                    return False

        selected.append(slot_name)
        selected_set.add(slot_name)
        return True

    required_slots = [s for s in slot_order if isinstance(slots.get(s), dict) and bool(slots[s].get("required"))]
    required_slots.sort(key=lambda s: _slot_sort_key(s, slots[s]))  # type: ignore[index]
    for slot_name in required_slots:
        add_slot(slot_name)

    alias_priority = [
        "title",
        "subtitle",
        "strapline",
        "leftHeading",
        "rightHeading",
        "topLeftHeading",
        "topRightHeading",
        "bottomLeftHeading",
        "bottomRightHeading",
        "column1Heading",
        "column2Heading",
        "column3Heading",
        "column4Heading",
        "column5Heading",
        "leftBody",
        "rightBody",
        "centerBody",
        "topLeftBody",
        "topRightBody",
        "bottomLeftBody",
        "bottomRightBody",
        "column1Body",
        "column2Body",
        "column3Body",
        "column4Body",
        "column5Body",
        "chart",
        "chart2",
        "table",
        "image",
        "image2",
    ]
    skip_aliases: set[str] = set()
    if family == "twoColComparison":
        skip_aliases.update({"leftHeading", "rightHeading"})
    if family == "fourQuad":
        skip_aliases.update({"topLeftHeading", "topRightHeading", "bottomLeftHeading", "bottomRightHeading"})

    for alias in alias_priority:
        if alias in skip_aliases:
            continue
        canonical = alias_map.get(alias)
        if isinstance(canonical, str):
            add_slot(canonical)

    for kind, target in (("text", 1), ("chart", 1), ("table", 1), ("image", 1)):
        existing = sum(1 for s in selected if str((slots.get(s) or {}).get("kind", "")).lower() == kind)
        if existing >= target:
            continue
        for slot_name in slot_order:
            slot_def = slots.get(slot_name)
            if not isinstance(slot_def, dict):
                continue
            if str(slot_def.get("kind", "text")).lower() != kind:
                continue
            if add_slot(slot_name):
                existing += 1
            if existing >= target:
                break

    return selected


def _build_benchmark_deck(template_json: Dict[str, Any], *, stress: bool) -> Dict[str, Any]:
    layouts = template_json.get("layouts")
    if not isinstance(layouts, dict):
        return {
            "metadata": {"title": "Benchmark deck", "author": "kpmg-slidegen"},
            "slides": [],
        }

    slides: List[Dict[str, Any]] = []
    for layout_type, layout in sorted(layouts.items()):
        slots = layout.get("slots") if isinstance(layout, dict) else {}
        if not isinstance(slots, dict):
            slots = {}

        payload: Dict[str, Any] = {}
        for slot_name in _pick_benchmark_slots(layout):
            slot_def = slots.get(slot_name)
            if not isinstance(slot_def, dict):
                continue
            kind = str(slot_def.get("kind", "text"))
            payload[slot_name] = _sample_value(slot_name, kind, stress=stress)

        slides.append(
            {
                "type": layout_type,
                "slots": payload,
                "notes": "Auto-generated benchmark slide",
            }
        )

    title_suffix = "stress" if stress else "normal"
    return {
        "metadata": {
            "title": f"Native benchmark ({title_suffix})",
            "author": "kpmg-slidegen",
        },
        "slides": slides,
    }


def _ensure_native_samples(template_dir: Path, template_json_path: Path, *, force: bool = False) -> None:
    try:
        template_json = _read_json(template_json_path)
    except Exception:
        return

    layouts = template_json.get("layouts")
    if not isinstance(layouts, dict):
        return
    expected_layout_types = sorted([k for k in layouts.keys() if isinstance(k, str)])
    expected_layout_set = set(expected_layout_types)
    expected_layout_count = len(expected_layout_types)

    samples_dir = template_dir / "samples"
    samples_dir.mkdir(parents=True, exist_ok=True)

    normal_path = samples_dir / "benchmark-normal.json"
    stress_path = samples_dir / "benchmark-stress.json"

    def should_write(path: Path) -> bool:
        if force:
            return True
        if not path.exists():
            return True
        try:
            data = _read_json(path)
            slides = data.get("slides")
            if not isinstance(slides, list):
                return True
            found_types = [
                slide.get("type")
                for slide in slides
                if isinstance(slide, dict) and isinstance(slide.get("type"), str)
            ]
            if len(found_types) != expected_layout_count:
                return True
            return set(found_types) != expected_layout_set
        except Exception:
            return True

    if should_write(normal_path):
        normal_path.write_text(json.dumps(_build_benchmark_deck(template_json, stress=False), indent=2) + "\n")

    if should_write(stress_path):
        stress_path.write_text(json.dumps(_build_benchmark_deck(template_json, stress=True), indent=2) + "\n")


def cmd_init_template(args: argparse.Namespace) -> int:
    template_dir = Path(args.template).resolve()
    pptx_path = Path(args.pptx).resolve()

    if not pptx_path.exists():
        raise RuntimeError(f"Source template file not found: {pptx_path}")

    generator_source = Path(args.generator_source).resolve()
    out = init_template_scaffold(
        template_dir=template_dir,
        source_pptx=pptx_path,
        copy_generator_from=generator_source,
    )

    print(str(out["template_dir"]))
    print(str(out["copied_source"]))
    print(str(out["profile"]))
    print(str(out["loop"]))
    return 0


def cmd_extract(args: argparse.Namespace) -> int:
    template_dir = Path(args.template).resolve()
    pptx_path = Path(args.pptx).resolve()

    mode = str(args.mode or "legacy").strip().lower()
    if mode not in ("legacy", "native"):
        raise RuntimeError(f"Unsupported --mode value: {mode}. Expected 'legacy' or 'native'.")

    schema_version = args.schema_version
    if not schema_version:
        schema_version = "4.0" if mode == "native" else "3.0"

    cfg = TemplateConfig(
        template_dir=template_dir,
        pptx_path=pptx_path,
        schema_version=schema_version,
        mode=mode,
        all_layout_types=bool(args.all_layout_types),
        refresh_assets=bool(args.refresh_assets),
        profile_path=_maybe_profile_path(template_dir, args.profile),
    )

    out = write_template_files(cfg)

    if mode == "native":
        _ensure_native_samples(template_dir, out["template_json"], force=False)

    print(str(out["template_json"]))
    print(str(out["template_js"]))
    return 0


def cmd_tune_template(args: argparse.Namespace) -> int:
    template_dir = Path(args.template).resolve()
    sample = Path(args.sample).resolve() if args.sample else None
    source = Path(args.source).resolve() if args.source else None

    if sample is None:
        template_json_path = template_dir / "template.json"
        if template_json_path.exists():
            try:
                template_json = _read_json(template_json_path)
            except Exception:
                template_json = {}
            mode = str(template_json.get("templateMode", "") or "").strip().lower()
            if mode == "native":
                _ensure_native_samples(template_dir, template_json_path, force=True)

    result = run_tuning_loop(
        template_dir=template_dir,
        sample_json=sample,
        source_pptx=source,
        max_rounds=args.max_rounds,
        human_approve=bool(args.human_approve),
    )

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if bool(result.get("accepted")) else 1


def cmd_validate(args: argparse.Namespace) -> int:
    node = _which("node")
    deck = Path(args.infile)
    template_dir = Path(args.template).resolve()
    p = subprocess.run(
        [node, "generator/validate.js", "--in", str(deck.resolve())],
        cwd=str(template_dir),
        capture_output=True,
        text=True,
    )
    sys.stdout.write(p.stdout)
    sys.stderr.write(p.stderr)
    return p.returncode


def cmd_generate(args: argparse.Namespace) -> int:
    node = _which("node")
    deck = Path(args.infile)
    out = Path(args.outfile)
    out.parent.mkdir(parents=True, exist_ok=True)

    p = subprocess.run(
        [node, "generator/index.js", "--in", str(deck.resolve()), "--out", str(out.resolve())],
        cwd=str(Path(args.template).resolve()),
        capture_output=True,
        text=True,
    )
    sys.stdout.write(p.stdout)
    sys.stderr.write(p.stderr)
    return p.returncode


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="KPMGPTX Gen CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init-template", help="Initialize a template project scaffold")
    p_init.add_argument("--template", required=True, help="Template directory to create (e.g. templates/kpmg-talkbook)")
    p_init.add_argument("--pptx", required=True, help="Source template .pptx/.potx file path")
    p_init.add_argument(
        "--generator-source",
        default="templates/kpmg-diligence/generator",
        help="Generator runtime skeleton source directory",
    )
    p_init.set_defaults(fn=cmd_init_template)

    p_extract = sub.add_parser("extract", help="Generate template.js + template.json")
    p_extract.add_argument("--template", required=True, help="Template directory (e.g. templates/kpmg-diligence)")
    p_extract.add_argument("--pptx", required=True, help="Source template pptx/potx path")
    p_extract.add_argument("--schema-version", default=None, help="Output schema version (default: 3.0 legacy / 4.0 native)")
    p_extract.add_argument("--mode", choices=["legacy", "native"], default="legacy", help="Codegen mode")
    p_extract.add_argument(
        "--all-layout-types",
        action="store_true",
        help="Native mode: expose all detected layouts (otherwise only used layouts)",
    )
    p_extract.add_argument(
        "--refresh-assets",
        action="store_true",
        help="Refresh template-local asset manifests before code generation",
    )
    p_extract.add_argument(
        "--profile",
        default=None,
        help="Optional template profile JSON path (default: <template>/template.profile.json if present)",
    )
    p_extract.set_defaults(fn=cmd_extract)

    p_tune = sub.add_parser("tune-template", help="Run iterative visual parity tuning loop")
    p_tune.add_argument("--template", required=True, help="Template directory")
    p_tune.add_argument("--sample", default=None, help="Sample deck JSON path (default picks benchmark/demo)")
    p_tune.add_argument("--source", default=None, help="Source .pptx/.potx path (default: first in template dir)")
    p_tune.add_argument("--max-rounds", type=int, default=None, help="Override max tuning rounds")
    p_tune.add_argument(
        "--human-approve",
        action="store_true",
        help="Mark final human visual approval (required for acceptance when enabled)",
    )
    p_tune.set_defaults(fn=cmd_tune_template)

    p_validate = sub.add_parser("validate", help="Validate a content JSON deck spec")
    p_validate.add_argument(
        "--template",
        default="templates/kpmg-diligence",
        help="Template project directory (contains generator/ and template.js).",
    )
    p_validate.add_argument("--in", dest="infile", required=True)
    p_validate.set_defaults(fn=cmd_validate)

    p_generate = sub.add_parser("generate", help="Generate a pptx from a content JSON deck spec")
    p_generate.add_argument(
        "--template",
        default="templates/kpmg-diligence",
        help="Template project directory (contains generator/ and template.js).",
    )
    p_generate.add_argument("--in", dest="infile", required=True)
    p_generate.add_argument("--out", dest="outfile", required=True)
    p_generate.set_defaults(fn=cmd_generate)

    return p


def main(argv: list[str]) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return int(args.fn(args))
    except RuntimeError as err:
        sys.stderr.write(str(err) + "\n")
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
