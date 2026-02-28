"""
Build a schema-annotated copy of the FDD scope library (no text changes).

Why:
- We want explicit parent/child bullet structure and stable ids for scope curation.
- We do NOT want to risk inadvertently changing the existing, working scope library.

What this does:
- Reads an existing `fdd_scope_library.json`
- Produces a new file that is byte-for-byte identical in scope text (bullets),
  but adds a new `scope_schema` block that encodes nesting + ids.

Safety:
- Validates that every original bullet string is preserved exactly.
- Does not modify the input file in-place.

Usage:
  python3 scripts/build-fdd-scope-schema.py

  # Explicit in/out:
  python3 scripts/build-fdd-scope-schema.py \\
    --in reference/fdd_scope_library.json \\
    --out reference/fdd_scope_library.schema_v1_1.json
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional


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


def _first_word(text: str) -> str:
    m = re.match(r"[\W_]*(\w+)", text.strip())
    return (m.group(1) if m else "").lower()


def _looks_like_new_directive(text: str) -> bool:
    w = _first_word(text)
    return w in _DIRECTIVE_VERBS and len(text.strip().split()) >= 3


def _normalize_for_hash(text: str) -> str:
    return " ".join(text.strip().lower().split())


def _scope_id_for_text(text: str, used: set[str]) -> str:
    base = hashlib.sha1(_normalize_for_hash(text).encode("utf-8")).hexdigest()[:8]
    candidate = f"scope.{base}"
    if candidate not in used:
        used.add(candidate)
        return candidate
    n = 2
    while True:
        cand = f"{candidate}-{n}"
        if cand not in used:
            used.add(cand)
            return cand
        n += 1


@dataclass
class ScopeNode:
    i: int
    text: str
    id: Optional[str] = None
    children: list["ScopeNode"] = field(default_factory=list)


def _parse_scope_bullets(bullets: list[Any]) -> list[ScopeNode]:
    """
    Heuristic nesting:
    - Lines ending with ':' become parents; following lines attach beneath them.
    - A “new directive” line ends the current nesting.
    """
    root: list[ScopeNode] = []
    stack: list[ScopeNode] = []

    def _add(i: int, text: str) -> ScopeNode:
        node = ScopeNode(i=i, text=text)
        if stack:
            stack[-1].children.append(node)
        else:
            root.append(node)
        return node

    for i, bullet in enumerate(bullets):
        if not isinstance(bullet, str):
            continue
        text = bullet.strip()
        if not text:
            continue

        if text.endswith(":"):
            if _looks_like_new_directive(text):
                stack.clear()
            node = _add(i, text)
            stack.append(node)
            continue

        if stack and _looks_like_new_directive(text):
            stack.clear()
        _add(i, text)

    return root


def _to_schema_nodes(nodes: list[ScopeNode], used_ids: set[str]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for node in nodes:
        d: dict[str, Any] = {"i": node.i}
        d["id"] = _scope_id_for_text(node.text, used_ids)
        if node.children:
            d["children"] = _to_schema_child_nodes(node.children)
        out.append(d)
    return out


def _to_schema_child_nodes(nodes: list[ScopeNode]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for node in nodes:
        d: dict[str, Any] = {"i": node.i}
        if node.children:
            d["children"] = _to_schema_child_nodes(node.children)
        out.append(d)
    return out


def _collect_all_bullet_texts(scope_library: dict[str, Any]) -> dict[str, Any]:
    """
    Extracts bullet arrays so we can assert we didn't change any scope text.
    Returns a deep structure containing only the bullet arrays.
    """
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


def build_schema(scope_library: dict[str, Any]) -> dict[str, Any]:
    used_ids: set[str] = set()

    schema: dict[str, Any] = {
        "version": "1.1",
        "id_strategy": "sha1-8-of-parent-text",
        "nesting": {"common_skeleton": {}, "industry_modules": {}},
    }

    # Common skeleton
    for s in scope_library.get("common_skeleton", []):
        section_key = s["normalized_heading"]
        bullets = s.get("default_bullets", [])
        nodes = _parse_scope_bullets(bullets)
        schema["nesting"]["common_skeleton"][section_key] = {
            "default_bullets": _to_schema_nodes(nodes, used_ids),
        }

    # Industry modules
    for industry, sections in (scope_library.get("industry_modules", {}) or {}).items():
        schema["nesting"]["industry_modules"][industry] = {}
        for section_key, bullets in (sections or {}).items():
            nodes = _parse_scope_bullets(bullets)
            schema["nesting"]["industry_modules"][industry][section_key] = _to_schema_nodes(nodes, used_ids)

    return schema


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a schema-annotated FDD scope library copy")
    parser.add_argument("--in", dest="inp", default="reference/fdd_scope_library.json", help="Input library path")
    parser.add_argument("--out", dest="out", default="reference/fdd_scope_library.schema_v1_1.json", help="Output path")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    inp = (root / args.inp).resolve()
    out = (root / args.out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    original = json.loads(inp.read_text(encoding="utf-8"))
    original_bullets = _collect_all_bullet_texts(original)

    updated = copy.deepcopy(original)
    updated["schema_version"] = "1.1"
    updated["scope_schema"] = build_schema(original)

    # Safety: ensure bullet text is unchanged.
    updated_bullets = _collect_all_bullet_texts(updated)
    if updated_bullets != original_bullets:
        raise SystemExit("ERROR: scope bullet text changed; refusing to write output")

    out.write_text(json.dumps(updated, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote: {out}")


if __name__ == "__main__":
    main()
