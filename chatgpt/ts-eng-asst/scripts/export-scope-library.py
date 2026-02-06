"""
Export per-industry views from the bundled v2 scope library.

Why:
- Easier human review per industry (JSON + Markdown)
- Ensures exports are deterministic and match the dist bundle

Usage:
  python3 scripts/export-scope-library.py
  python3 scripts/export-scope-library.py --industry retail
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Iterable


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BUNDLE = PROJECT_ROOT / "dist" / "scope-library.json"
DEFAULT_OUT_DIR = PROJECT_ROOT / "docs" / "scope-library" / "industries"


def _iter_v2_nodes(nodes: Iterable[dict[str, Any]], depth: int = 0) -> Iterable[tuple[int, dict[str, Any]]]:
    for node in nodes:
        if not isinstance(node, dict):
            continue
        yield depth, node
        children = node.get("children")
        if isinstance(children, list):
            yield from _iter_v2_nodes(children, depth + 1)


def _render_md_bullets(nodes: list[dict[str, Any]]) -> list[str]:
    lines: list[str] = []
    for depth, node in _iter_v2_nodes(nodes):
        text = node.get("text")
        if not isinstance(text, str) or not text.strip():
            continue
        node_id = node.get("id")
        label = f"({node_id}) {text}" if isinstance(node_id, str) else text
        lines.append(f"{'  ' * depth}- {label}")
    return lines


def _slice_bundle(bundle: dict[str, Any], industry: str) -> dict[str, Any]:
    modules = bundle.get("industry_modules", {}) or {}
    industry_module = modules.get(industry)
    out: dict[str, Any] = {
        "common_skeleton": bundle.get("common_skeleton", []),
        "industry_modules": {industry: industry_module} if isinstance(industry_module, dict) else {},
        "metadata": bundle.get("metadata", {}),
    }
    return out


def _render_industry_markdown(*, bundle: dict[str, Any], industry: str) -> str:
    lines: list[str] = []
    lines.append(f"# FDD Scope — `{industry}`")
    lines.append("")
    lines.append("Generated from `dist/scope-library.json`.")
    lines.append("")

    common = bundle.get("common_skeleton", []) or []
    lines.append("## Common skeleton")
    lines.append("")
    for section in common:
        if not isinstance(section, dict):
            continue
        heading = section.get("heading") or ""
        key = section.get("normalized_heading") or ""
        bullets = section.get("default_bullets") or []
        if not isinstance(bullets, list):
            bullets = []
        lines.append(f"### {heading} (`{key}`)")
        lines.extend(_render_md_bullets(bullets))
        lines.append("")

    modules = bundle.get("industry_modules", {}) or {}
    industry_module = modules.get(industry)
    if isinstance(industry_module, dict) and industry_module:
        lines.append(f"## Industry module — `{industry}`")
        lines.append("")
        for section_key, bullets in industry_module.items():
            if not isinstance(bullets, list):
                continue
            lines.append(f"### {section_key.replace('_', ' ').title()} (`{section_key}`)")
            lines.extend(_render_md_bullets(bullets))
            lines.append("")
    else:
        lines.append("## Industry module")
        lines.append("")
        lines.append("_None (common skeleton only)._")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Export per-industry scope library views (v2 bundle)")
    parser.add_argument("--bundle", default=str(DEFAULT_BUNDLE), help="Path to dist bundle JSON (v2)")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR), help="Output directory for exports")
    parser.add_argument("--industry", default="all", help="Industry key to export (or 'all')")
    args = parser.parse_args()

    bundle_path = Path(args.bundle)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    bundle = json.loads(bundle_path.read_text(encoding="utf-8"))
    available = sorted((bundle.get("industry_modules") or {}).keys())

    industries: list[str]
    if args.industry == "all":
        industries = available + ["generic"]
    else:
        industries = [args.industry]

    for industry in industries:
        slice_obj = _slice_bundle(bundle, industry)
        (out_dir / f"{industry}.json").write_text(
            json.dumps(slice_obj, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (out_dir / f"{industry}.md").write_text(
            _render_industry_markdown(bundle=bundle, industry=industry),
            encoding="utf-8",
        )

    print(f"Wrote exports to: {out_dir}")


if __name__ == "__main__":
    main()

