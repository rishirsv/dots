"""
Scope Library Viewer (Markdown + HTML)

Creates a human-reviewable visualization of the FDD scope library so you can
review parent/child bullet nesting and the resulting "top-level" items without
staring at raw JSON.

Design goals:
- Safe by default: does NOT modify the library.
- Works even before we add explicit nesting metadata (uses the same heuristic
  currently used by the generator).
- Produces:
  - a markdown report (easy diff/review)
  - a self-contained HTML file (quick browsing + search)

Usage:
  python3 scripts/render-scope-library.py

  # Filter to one industry for faster review:
  python3 scripts/render-scope-library.py --industry healthcare

Outputs (default):
  docs/scope-curation/viewer/scope-library.md
  docs/scope-curation/viewer/scope-library.html
"""

from __future__ import annotations

import argparse
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


@dataclass
class ScopeNode:
    text: str
    source_index: int
    children: list["ScopeNode"] = field(default_factory=list)


def _parse_scope_bullets(bullets: list[Any]) -> list[ScopeNode]:
    """
    Heuristic nesting (matches generator):
    - Lines ending with ':' become parents; following lines attach beneath them.
    - A “new directive” line ends the current nesting.
    """
    root: list[ScopeNode] = []
    stack: list[ScopeNode] = []

    def _add(text: str, source_index: int) -> ScopeNode:
        node = ScopeNode(text=text, source_index=source_index)
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
            node = _add(text, i)
            stack.append(node)
            continue

        if stack and _looks_like_new_directive(text):
            stack.clear()
        _add(text, i)

    return root


def _parse_scope_schema_nodes(*, bullets: list[Any], nodes: list[dict[str, Any]]) -> list[ScopeNode]:
    """
    Build a scope tree from explicit schema nodes (indices into the original bullets list).

    Node shape (stored in JSON):
      { "i": <index>, "id": "scope.xxxxxxxx", "children": [ ... ] }
    """
    def build(node: dict[str, Any]) -> ScopeNode:
        i = int(node["i"])
        text = bullets[i] if 0 <= i < len(bullets) and isinstance(bullets[i], str) else ""
        n = ScopeNode(text=text, source_index=i)
        for child in (node.get("children") or []):
            if isinstance(child, dict):
                n.children.append(build(child))
        return n

    out: list[ScopeNode] = []
    for node in nodes:
        if isinstance(node, dict):
            out.append(build(node))
    return out


def _iter_sections(scope_library: dict[str, Any], industry: Optional[str]) -> list[dict[str, Any]]:
    """
    Returns a list of sections to render, with a normalized shape:
      {
        "kind": "common" | "industry",
        "industry": Optional[str],
        "section_key": str,
        "display_heading": str,
        "bullets": list[str]
      }
    """
    out: list[dict[str, Any]] = []

    for section in scope_library.get("common_skeleton", []):
        out.append(
            {
                "kind": "common",
                "industry": None,
                "section_key": section["normalized_heading"],
                "display_heading": section["heading"],
                "bullets": section.get("default_bullets", []),
            }
        )

    modules: dict[str, Any] = scope_library.get("industry_modules", {})
    industries = [industry] if industry else sorted(modules.keys())
    for ind in industries:
        for section_key, bullets in (modules.get(ind, {}) or {}).items():
            out.append(
                {
                    "kind": "industry",
                    "industry": ind,
                    "section_key": section_key,
                    "display_heading": section_key.replace("_", " ").title(),
                    "bullets": bullets,
                }
            )

    return out


def _render_markdown(sections: list[dict[str, Any]], *, prefer_schema: bool) -> str:
    lines: list[str] = []
    lines.append("# FDD Scope Library Viewer")
    lines.append("")
    lines.append("This report renders the scope library into a nested bullet structure for review.")
    lines.append("")
    lines.append("Notes:")
    lines.append("- Nesting can be inferred (colon-parents + directive boundaries) or read from `scope_schema` if present.")
    lines.append(f"- Mode: {'schema (if available)' if prefer_schema else 'inferred'}")
    lines.append("- Index labels like `[03]` refer to the bullet's position in the original JSON list (0-based).")
    lines.append("")

    def _render_nodes(nodes: list[ScopeNode], depth: int) -> None:
        pad = "  " * depth
        for node in nodes:
            lines.append(f"{pad}- [{node.source_index:02d}] {node.text}")
            if node.children:
                _render_nodes(node.children, depth + 1)

    current_group: Optional[str] = None
    for s in sections:
        group = "Common skeleton" if s["kind"] == "common" else f"Industry: {s['industry']}"
        if group != current_group:
            lines.append("")
            lines.append(f"## {group}")
            lines.append("")
            current_group = group

        lines.append(f"### {s['display_heading']} (`{s['section_key']}`)")
        bullets: list[Any] = s["bullets"]
        nodes = None
        if prefer_schema and isinstance(s.get("schema_nodes"), list):
            nodes = _parse_scope_schema_nodes(bullets=bullets, nodes=s["schema_nodes"])
        if nodes is None:
            nodes = _parse_scope_bullets(bullets)
        top_level = len(nodes)
        total = sum(1 for b in bullets if isinstance(b, str) and b.strip())
        lines.append(f"- total bullets: {total}")
        lines.append(f"- top-level items (what a user would see as checkboxes): {top_level}")
        lines.append("")
        _render_nodes(nodes, 0)
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def _escape_for_html_json(s: str) -> str:
    # Prevent closing the script tag in embedded JSON.
    return s.replace("</", "<\\/")


def _render_html(sections: list[dict[str, Any]], title: str) -> str:
    payload = _escape_for_html_json(json.dumps(sections, ensure_ascii=False))
    directive_verbs = json.dumps(sorted(_DIRECTIVE_VERBS))

    # Self-contained HTML (no external deps, works via file://).
    # Important: this is NOT an f-string because the embedded JS contains many `{}` braces.
    template = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>__TITLE__</title>
    <style>
      :root {{
        --bg: #0b0f14;
        --panel: #111826;
        --muted: #9aa4b2;
        --text: #e5e7eb;
        --accent: #60a5fa;
        --border: #243244;
      }}
      body {{
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        line-height: 1.3;
      }}
      header {{
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
        background: rgba(17, 24, 38, 0.7);
        position: sticky;
        top: 0;
        backdrop-filter: blur(8px);
        z-index: 2;
      }}
      .row {{
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }}
      h1 {{
        font-size: 14px;
        margin: 0;
        font-weight: 600;
      }}
      .muted {{ color: var(--muted); font-size: 12px; }}
      .wrap {{
        display: grid;
        grid-template-columns: 340px 1fr;
        min-height: calc(100vh - 56px);
      }}
      aside {{
        border-right: 1px solid var(--border);
        background: var(--panel);
        padding: 12px;
        overflow: auto;
      }}
      main {{
        padding: 16px;
        overflow: auto;
      }}
      input, select {{
        background: #0f1624;
        color: var(--text);
        border: 1px solid var(--border);
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 13px;
      }}
      .list {{
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }}
      .item {{
        padding: 10px 10px;
        border: 1px solid var(--border);
        border-radius: 10px;
        cursor: pointer;
      }}
      .item:hover {{ border-color: #36517a; }}
      .item.active {{ border-color: var(--accent); }}
      .badge {{
        display: inline-block;
        padding: 2px 6px;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--muted);
        font-size: 11px;
        margin-left: 6px;
      }}
      .section-title {{
        font-size: 18px;
        margin: 0 0 6px 0;
      }}
      .section-meta {{
        color: var(--muted);
        font-size: 12px;
        margin-bottom: 12px;
      }}
      ul {{
        margin: 8px 0 0 18px;
        padding: 0;
      }}
      li {{
        margin: 6px 0;
      }}
      .idx {{
        color: var(--muted);
        font-variant-numeric: tabular-nums;
        margin-right: 6px;
      }}
      .highlight {{
        outline: 1px solid rgba(96, 165, 250, 0.35);
        border-radius: 6px;
        padding: 2px 4px;
      }}
      .pill {{
        display: inline-block;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(96, 165, 250, 0.12);
        border: 1px solid rgba(96, 165, 250, 0.25);
        color: #cfe6ff;
        font-size: 12px;
      }}
    </style>
  </head>
  <body>
    <header>
      <div class="row">
        <h1>__TITLE__</h1>
        <span class="muted">nested view for reviewing top-level vs child bullets</span>
      </div>
    </header>
    <div class="wrap">
      <aside>
        <div class="row">
          <select id="group">
            <option value="common">common skeleton</option>
          </select>
          <input id="q" type="search" placeholder="search bullets…" />
        </div>
        <div class="muted" style="margin-top:8px;">
          click a section to view nesting; top-level count approximates how many checkboxes the user would see
        </div>
        <div class="list" id="sections"></div>
      </aside>
      <main>
        <div id="detail">
          <div class="muted">select a section on the left</div>
        </div>
      </main>
    </div>

    <script id="data" type="application/json">__PAYLOAD__</script>
    <script>
      const sections = JSON.parse(document.getElementById('data').textContent);

      function firstWord(text) {{
        const m = text.trim().match(/^[\\W_]*(\\w+)/);
        return (m ? m[1] : '').toLowerCase();
      }}

      const DIRECTIVE = new Set(__DIRECTIVE_VERBS__);
      function looksLikeNewDirective(text) {{
        const w = firstWord(text);
        return DIRECTIVE.has(w) && text.trim().split(/\\s+/).length >= 3;
      }}

      function parseBullets(bullets) {{
        const root = [];
        const stack = [];
        function add(text, idx) {{
          const node = {{ text, idx, children: [] }};
          if (stack.length) stack[stack.length - 1].children.push(node);
          else root.push(node);
          return node;
        }}
        bullets.forEach((b, i) => {{
          if (typeof b !== 'string') return;
          const text = b.trim();
          if (!text) return;
          if (text.endsWith(':')) {{
            if (looksLikeNewDirective(text)) stack.length = 0;
            const node = add(text, i);
            stack.push(node);
            return;
          }}
          if (stack.length && looksLikeNewDirective(text)) stack.length = 0;
          add(text, i);
        }});
        return root;
      }}

      function parseSchema(bullets, schemaNodes) {{
        function build(node) {{
          const i = Number(node.i);
          const text = (i >= 0 && i < bullets.length && typeof bullets[i] === 'string') ? bullets[i].trim() : '';
          const children = (node.children || []).map(build);
          return {{ text, idx: i, children }};
        }}
        return (schemaNodes || []).map(build);
      }}

      const groups = new Map();
      groups.set('common', sections.filter(s => s.kind === 'common'));
      const industries = Array.from(new Set(sections.filter(s => s.kind === 'industry').map(s => s.industry))).sort();
      industries.forEach(ind => groups.set(ind, sections.filter(s => s.kind === 'industry' && s.industry === ind)));

      const groupSelect = document.getElementById('group');
      industries.forEach(ind => {{
        const opt = document.createElement('option');
        opt.value = ind;
        opt.textContent = ind;
        groupSelect.appendChild(opt);
      }});

      const q = document.getElementById('q');
      const list = document.getElementById('sections');
      const detail = document.getElementById('detail');
      let activeKey = null;

      function computeCounts(section) {{
        const bullets = section.bullets || [];
        const total = bullets.filter(b => typeof b === 'string' && b.trim()).length;
        const nodes = (section.schema_nodes && section.schema_nodes.length) ? parseSchema(bullets, section.schema_nodes) : parseBullets(bullets);
        return {{ total, top: nodes.length }};
      }}

      function renderList() {{
        const g = groupSelect.value;
        const items = groups.get(g) || [];
        const query = q.value.trim().toLowerCase();
        list.innerHTML = '';
        items.forEach((s, idx) => {{
          const key = `${g}:${s.section_key}`;
          const counts = computeCounts(s);
          const label = s.display_heading;
          const matches = !query || JSON.stringify(s.bullets || []).toLowerCase().includes(query) || label.toLowerCase().includes(query);
          if (!matches) return;
          const el = document.createElement('div');
          el.className = 'item' + (activeKey === key ? ' active' : '');
          el.innerHTML = `
            <div style="font-weight:600; font-size:13px;">${label}</div>
            <div class="muted" style="margin-top:4px;">
              ${counts.top} top-level <span class="badge">${counts.total} total</span>
            </div>
          `;
          el.onclick = () => {{ activeKey = key; renderList(); renderDetail(s); }};
          list.appendChild(el);
        }});
      }}

      function renderNodes(nodes, query) {{
        const ul = document.createElement('ul');
        nodes.forEach(n => {{
          const li = document.createElement('li');
          const text = n.text;
          const hit = query && text.toLowerCase().includes(query);
          const span = document.createElement('span');
          span.innerHTML = `<span class="idx">[${String(n.idx).padStart(2,'0')}]</span>` + (hit ? `<span class="highlight">${text}</span>` : text);
          li.appendChild(span);
          if (n.children && n.children.length) li.appendChild(renderNodes(n.children, query));
          ul.appendChild(li);
        }});
        return ul;
      }}

      function renderDetail(section) {{
        const query = q.value.trim().toLowerCase();
        const bullets = section.bullets || [];
        const nodes = (section.schema_nodes && section.schema_nodes.length) ? parseSchema(bullets, section.schema_nodes) : parseBullets(bullets);
        const counts = computeCounts(section);
        detail.innerHTML = '';
        const h = document.createElement('div');
        h.innerHTML = `
          <h2 class="section-title">${section.display_heading}</h2>
          <div class="section-meta">
            <span class="pill">${section.kind === 'common' ? 'common skeleton' : 'industry: ' + section.industry}</span>
            <span class="badge">${counts.top} top-level</span>
            <span class="badge">${counts.total} total</span>
            <span class="badge">key: ${section.section_key}</span>
          </div>
        `;
        detail.appendChild(h);
        detail.appendChild(renderNodes(nodes, query));
      }}

      groupSelect.onchange = () => {{ activeKey = null; detail.innerHTML = '<div class=\"muted\">select a section on the left</div>'; renderList(); }};
      q.oninput = () => {{ renderList(); if (activeKey) {{
        const [g,key] = activeKey.split(':');
        const items = groups.get(g) || [];
        const found = items.find(s => s.section_key === key);
        if (found) renderDetail(found);
      }} }};

      renderList();
    </script>
  </body>
</html>
"""

    return (
        template.replace("__TITLE__", title)
        .replace("__PAYLOAD__", payload)
        .replace("__DIRECTIVE_VERBS__", directive_verbs)
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Render the FDD scope library for review")
    parser.add_argument("--library", default="reference/fdd_scope_library.json", help="Path to a scope library JSON file")
    parser.add_argument("--out-dir", default="docs/scope-curation/viewer", help="Output directory")
    parser.add_argument("--industry", help="Only render a single industry module (e.g., healthcare)")
    parser.add_argument("--prefer-schema", action="store_true", help="If the library includes scope_schema, render using it")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    library_path = (root / args.library).resolve()
    out_dir = (root / args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    scope_library = json.loads(library_path.read_text(encoding="utf-8"))
    sections = _iter_sections(scope_library, args.industry)

    # Attach schema nodes if present.
    scope_schema = scope_library.get("scope_schema") or {}
    nesting = (scope_schema.get("nesting") or {}) if isinstance(scope_schema, dict) else {}
    common_nesting = (nesting.get("common_skeleton") or {}) if isinstance(nesting, dict) else {}
    industry_nesting = (nesting.get("industry_modules") or {}) if isinstance(nesting, dict) else {}

    for s in sections:
        if s["kind"] == "common":
            sec = common_nesting.get(s["section_key"])
            if isinstance(sec, dict):
                nodes = sec.get("default_bullets")
                if isinstance(nodes, list):
                    s["schema_nodes"] = nodes
        else:
            ind = s["industry"]
            sec_map = industry_nesting.get(ind) if ind else None
            if isinstance(sec_map, dict):
                nodes = sec_map.get(s["section_key"])
                if isinstance(nodes, list):
                    s["schema_nodes"] = nodes

    md = _render_markdown(sections, prefer_schema=args.prefer_schema)
    (out_dir / "scope-library.md").write_text(md, encoding="utf-8")

    html = _render_html(sections, title="FDD scope library viewer")
    (out_dir / "scope-library.html").write_text(html, encoding="utf-8")

    print(f"Wrote: {out_dir / 'scope-library.md'}")
    print(f"Wrote: {out_dir / 'scope-library.html'}")
    print("Open the HTML file in your browser for quick review.")


if __name__ == "__main__":
    main()
