"""
Build a v2 nested scope library (no text changes).

Reads a flat `fdd_scope_library.json` and produces a v2 file that:
- Preserves all bullet text verbatim
- Adds explicit parent/child nesting
- Assigns sequential ids to top-level bullets (scope.001, scope.002, ...)

Usage:
  python3 scripts/build-fdd-scope-v2.py \
    --in reference/fdd_scope_library.json \
    --out dist/scope-library.json
"""

from __future__ import annotations

import argparse
import copy
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Optional


_DIRECTIVE_VERBS = {
    "obtain",
    "read",
    "review",
    "understand",
    "analyze",
    "perform",
    "consider",
    "identify",
    "determine",
    "develop",
    "discuss",
    "evaluate",
    "compare",
    "summarize",
    "comment",
    "meet",
    "inquire",
    "assess",
    "bridge",
    "reconcile",
    "gain",
    "propose",
    "segment",
    "calculate",
    "collect",
    "confirm",
    "test",
    "prepare",
    "provide",
}


@dataclass
class ScopeNode:
    """Represents a nested scope bullet."""

    text: str
    children: list["ScopeNode"] = field(default_factory=list)


def _first_word(text: str) -> str:
    """Return the first alphanumeric word in text, lowercased."""
    m = re.match(r"[\W_]*(\w+)", text.strip())
    return (m.group(1) if m else "").lower()


def _looks_like_new_directive(text: str) -> bool:
    """Return True if text appears to start a new directive list."""
    w = _first_word(text)
    return w in _DIRECTIVE_VERBS and len(text.strip().split()) >= 3


def _parse_scope_bullets(bullets: list[Any]) -> list[ScopeNode]:
    """
    Convert a flat list of bullet strings into a parent/child tree.

    Heuristic:
    - Lines ending with ':' become parents; following lines attach beneath them.
    - A new directive line ends the current nesting.
    """
    root: list[ScopeNode] = []
    stack: list[ScopeNode] = []

    def _add(text: str) -> ScopeNode:
        node = ScopeNode(text=text)
        if stack:
            stack[-1].children.append(node)
        else:
            root.append(node)
        return node

    for bullet in bullets:
        if not isinstance(bullet, str):
            continue
        text = bullet.strip()
        if not text:
            continue

        if text.endswith(":"):
            if _looks_like_new_directive(text):
                stack.clear()
            node = _add(text)
            stack.append(node)
            continue

        if stack and _looks_like_new_directive(text):
            stack.clear()
        _add(text)

    return root


def _assign_ids(nodes: list[ScopeNode], next_id: int) -> tuple[list[dict[str, Any]], int]:
    """Return v2 bullet objects with sequential ids for top-level nodes."""
    out: list[dict[str, Any]] = []
    for node in nodes:
        item: dict[str, Any] = {
            "id": f"scope.{next_id:03d}",
            "text": node.text,
        }
        next_id += 1
        if node.children:
            item["children"] = _to_children(node.children)
        out.append(item)
    return out, next_id


def _to_children(nodes: list[ScopeNode]) -> list[dict[str, Any]]:
    """Convert child nodes to v2 bullet objects without ids."""
    out: list[dict[str, Any]] = []
    for node in nodes:
        item: dict[str, Any] = {"text": node.text}
        if node.children:
            item["children"] = _to_children(node.children)
        out.append(item)
    return out


def _flatten_v2_bullets(bullets: Iterable[dict[str, Any]]) -> list[str]:
    """Flatten v2 bullet objects into a preorder list of text strings."""
    out: list[str] = []

    def walk(items: Iterable[dict[str, Any]]) -> None:
        for item in items:
            text = item.get("text")
            if isinstance(text, str):
                out.append(text)
            children = item.get("children")
            if isinstance(children, list):
                walk(children)

    walk(bullets)
    return out


def _convert_section_bullets(bullets: list[Any], next_id: int) -> tuple[list[dict[str, Any]], int]:
    """Convert a flat bullet list into v2 objects and assign sequential ids."""
    nodes = _parse_scope_bullets(bullets)
    return _assign_ids(nodes, next_id)


def _collect_flat_bullets(scope_library: dict[str, Any]) -> dict[str, Any]:
    """Collect all bullet lists for validation."""
    common = []
    for s in scope_library.get("common_skeleton", []):
        common.append(
            {
                "normalized_heading": s.get("normalized_heading"),
                "default_bullets": copy.deepcopy(s.get("default_bullets", [])),
            }
        )

    modules: dict[str, Any] = {}
    for industry, sections in (scope_library.get("industry_modules", {}) or {}).items():
        modules[industry] = {k: copy.deepcopy(v) for k, v in (sections or {}).items()}

    return {"common_skeleton": common, "industry_modules": modules}


def _validate_no_text_changes(original: dict[str, Any], updated: dict[str, Any]) -> None:
    """Raise if any bullet text differs from the original file."""
    original_flat = _collect_flat_bullets(original)

    # Check common skeleton
    for idx, section in enumerate(original_flat.get("common_skeleton", [])):
        bullets = section.get("default_bullets", [])
        new_section = updated.get("common_skeleton", [])[idx]
        v2_bullets = new_section.get("default_bullets", [])
        if _flatten_v2_bullets(v2_bullets) != bullets:
            raise ValueError(
                f"Text mismatch in common_skeleton[{idx}] {section.get('normalized_heading')}"
            )

    # Check industry modules
    updated_modules = updated.get("industry_modules", {})
    for industry, sections in original_flat.get("industry_modules", {}).items():
        updated_sections = updated_modules.get(industry, {})
        for key, bullets in sections.items():
            v2_bullets = updated_sections.get(key, [])
            if _flatten_v2_bullets(v2_bullets) != bullets:
                raise ValueError(
                    f"Text mismatch in industry_modules.{industry}.{key}"
                )


def build_v2(scope_library: dict[str, Any]) -> dict[str, Any]:
    """Build a v2 nested scope library with sequential top-level ids."""
    out = copy.deepcopy(scope_library)
    next_id = 1

    # Common skeleton
    common_out = []
    for section in scope_library.get("common_skeleton", []):
        new_section = copy.deepcopy(section)
        bullets = section.get("default_bullets", [])
        v2_bullets, next_id = _convert_section_bullets(bullets, next_id)
        new_section["default_bullets"] = v2_bullets
        common_out.append(new_section)
    out["common_skeleton"] = common_out

    # Industry modules (preserve insertion order)
    modules_out: dict[str, Any] = {}
    for industry, sections in (scope_library.get("industry_modules", {}) or {}).items():
        new_sections: dict[str, Any] = {}
        for section_key, bullets in (sections or {}).items():
            v2_bullets, next_id = _convert_section_bullets(bullets, next_id)
            new_sections[section_key] = v2_bullets
        modules_out[industry] = new_sections
    out["industry_modules"] = modules_out

    _validate_no_text_changes(scope_library, out)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Build v2 nested scope library")
    parser.add_argument("--in", dest="input_path", required=True, help="Path to input scope library JSON")
    parser.add_argument("--out", dest="output_path", required=True, help="Path to output v2 scope library JSON")
    args = parser.parse_args()

    input_path = Path(args.input_path)
    output_path = Path(args.output_path)

    scope_library = json.loads(input_path.read_text(encoding="utf-8"))
    v2 = build_v2(scope_library)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(v2, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote: {output_path}")


if __name__ == "__main__":
    main()
