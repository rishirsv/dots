"""Extract design tokens from Project North workbook XML.

This script converts the North `.xlsb` workbook into `.xlsx` (if needed), then
parses raw XML parts to produce a deep design-token catalog for layout/styling.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET


NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"
NS_THEME = "http://schemas.openxmlformats.org/drawingml/2006/main"


def qn(ns: str, tag: str) -> str:
    """Return qualified XML name."""

    return f"{{{ns}}}{tag}"


def parse_bool(value: str | None) -> bool | None:
    """Parse Excel XML boolean values."""

    if value is None:
        return None
    return value in {"1", "true", "TRUE"}


def col_to_index(col: str) -> int:
    """Convert Excel column label to 1-based index."""

    result = 0
    for ch in col:
        result = result * 26 + (ord(ch.upper()) - 64)
    return result


def split_cell_ref(ref: str) -> tuple[str, int]:
    """Split cell reference into column label and row number."""

    match = re.match(r"([A-Z]+)(\d+)$", ref)
    if not match:
        return "", 0
    return match.group(1), int(match.group(2))


def parse_color(elem: ET.Element | None) -> dict[str, Any] | None:
    """Parse color element attributes."""

    if elem is None:
        return None
    keys = ["rgb", "theme", "indexed", "tint", "auto"]
    out: dict[str, Any] = {}
    for key in keys:
        value = elem.get(key)
        if value is not None:
            out[key] = value
    return out or None


def parse_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    """Read shared strings table."""

    try:
        xml = zf.read("xl/sharedStrings.xml")
    except KeyError:
        return []

    root = ET.fromstring(xml)
    strings: list[str] = []
    for si in root.findall(qn(NS_MAIN, "si")):
        chunks: list[str] = []
        # Plain text node
        t = si.find(qn(NS_MAIN, "t"))
        if t is not None and t.text is not None:
            chunks.append(t.text)
        # Rich text runs
        for run in si.findall(qn(NS_MAIN, "r")):
            rt = run.find(qn(NS_MAIN, "t"))
            if rt is not None and rt.text is not None:
                chunks.append(rt.text)
        strings.append("".join(chunks))
    return strings


def parse_theme(zf: zipfile.ZipFile) -> dict[str, Any]:
    """Extract theme colors and font schemes."""

    try:
        xml = zf.read("xl/theme/theme1.xml")
    except KeyError:
        return {}

    root = ET.fromstring(xml)
    out: dict[str, Any] = {
        "color_scheme": {},
        "font_scheme": {},
    }

    clr_scheme = root.find(f".//{qn(NS_THEME, 'clrScheme')}")
    if clr_scheme is not None:
        for child in list(clr_scheme):
            tag_name = child.tag.split("}")[-1]
            color_child = list(child)[0] if list(child) else None
            out["color_scheme"][tag_name] = {
                "kind": color_child.tag.split("}")[-1] if color_child is not None else None,
                "attrs": color_child.attrib if color_child is not None else {},
            }

    font_scheme = root.find(f".//{qn(NS_THEME, 'fontScheme')}")
    if font_scheme is not None:
        for family in ["majorFont", "minorFont"]:
            fam_node = font_scheme.find(qn(NS_THEME, family))
            if fam_node is None:
                continue
            latin = fam_node.find(qn(NS_THEME, "latin"))
            ea = fam_node.find(qn(NS_THEME, "ea"))
            cs = fam_node.find(qn(NS_THEME, "cs"))
            out["font_scheme"][family] = {
                "latin": latin.attrib if latin is not None else {},
                "ea": ea.attrib if ea is not None else {},
                "cs": cs.attrib if cs is not None else {},
            }

    return out


def parse_styles(zf: zipfile.ZipFile) -> dict[str, Any]:
    """Parse styles.xml token sets."""

    xml = zf.read("xl/styles.xml")
    root = ET.fromstring(xml)

    styles: dict[str, Any] = {
        "num_fmts": [],
        "fonts": [],
        "fills": [],
        "borders": [],
        "cell_style_xfs": [],
        "cell_xfs": [],
        "cell_styles": [],
        "dxfs": [],
    }

    numfmts = root.find(qn(NS_MAIN, "numFmts"))
    if numfmts is not None:
        for node in numfmts.findall(qn(NS_MAIN, "numFmt")):
            styles["num_fmts"].append({
                "numFmtId": node.get("numFmtId"),
                "formatCode": node.get("formatCode"),
            })

    fonts = root.find(qn(NS_MAIN, "fonts"))
    if fonts is not None:
        for font in fonts.findall(qn(NS_MAIN, "font")):
            styles["fonts"].append({
                "name": (font.find(qn(NS_MAIN, "name")).get("val") if font.find(qn(NS_MAIN, "name")) is not None else None),
                "size": (font.find(qn(NS_MAIN, "sz")).get("val") if font.find(qn(NS_MAIN, "sz")) is not None else None),
                "bold": font.find(qn(NS_MAIN, "b")) is not None,
                "italic": font.find(qn(NS_MAIN, "i")) is not None,
                "underline": font.find(qn(NS_MAIN, "u")) is not None,
                "color": parse_color(font.find(qn(NS_MAIN, "color"))),
                "family": (font.find(qn(NS_MAIN, "family")).get("val") if font.find(qn(NS_MAIN, "family")) is not None else None),
                "scheme": (font.find(qn(NS_MAIN, "scheme")).get("val") if font.find(qn(NS_MAIN, "scheme")) is not None else None),
            })

    fills = root.find(qn(NS_MAIN, "fills"))
    if fills is not None:
        for fill in fills.findall(qn(NS_MAIN, "fill")):
            pat = fill.find(qn(NS_MAIN, "patternFill"))
            styles["fills"].append({
                "patternType": pat.get("patternType") if pat is not None else None,
                "fgColor": parse_color(pat.find(qn(NS_MAIN, "fgColor")) if pat is not None else None),
                "bgColor": parse_color(pat.find(qn(NS_MAIN, "bgColor")) if pat is not None else None),
            })

    borders = root.find(qn(NS_MAIN, "borders"))
    if borders is not None:
        for border in borders.findall(qn(NS_MAIN, "border")):
            border_info: dict[str, Any] = {}
            for side_name in ["left", "right", "top", "bottom", "diagonal"]:
                side = border.find(qn(NS_MAIN, side_name))
                if side is None:
                    continue
                border_info[side_name] = {
                    "style": side.get("style"),
                    "color": parse_color(side.find(qn(NS_MAIN, "color"))),
                }
            styles["borders"].append(border_info)

    def parse_xf(node: ET.Element) -> dict[str, Any]:
        align = node.find(qn(NS_MAIN, "alignment"))
        protection = node.find(qn(NS_MAIN, "protection"))
        return {
            "numFmtId": node.get("numFmtId"),
            "fontId": node.get("fontId"),
            "fillId": node.get("fillId"),
            "borderId": node.get("borderId"),
            "xfId": node.get("xfId"),
            "applyNumberFormat": parse_bool(node.get("applyNumberFormat")),
            "applyFont": parse_bool(node.get("applyFont")),
            "applyFill": parse_bool(node.get("applyFill")),
            "applyBorder": parse_bool(node.get("applyBorder")),
            "applyAlignment": parse_bool(node.get("applyAlignment")),
            "applyProtection": parse_bool(node.get("applyProtection")),
            "alignment": align.attrib if align is not None else None,
            "protection": protection.attrib if protection is not None else None,
        }

    csxfs = root.find(qn(NS_MAIN, "cellStyleXfs"))
    if csxfs is not None:
        for xf in csxfs.findall(qn(NS_MAIN, "xf")):
            styles["cell_style_xfs"].append(parse_xf(xf))

    cxs = root.find(qn(NS_MAIN, "cellXfs"))
    if cxs is not None:
        for xf in cxs.findall(qn(NS_MAIN, "xf")):
            styles["cell_xfs"].append(parse_xf(xf))

    cell_styles = root.find(qn(NS_MAIN, "cellStyles"))
    if cell_styles is not None:
        for st in cell_styles.findall(qn(NS_MAIN, "cellStyle")):
            styles["cell_styles"].append(st.attrib)

    dxfs = root.find(qn(NS_MAIN, "dxfs"))
    if dxfs is not None:
        for dxf in dxfs.findall(qn(NS_MAIN, "dxf")):
            dxf_info: dict[str, Any] = {}
            font = dxf.find(qn(NS_MAIN, "font"))
            fill = dxf.find(qn(NS_MAIN, "fill"))
            border = dxf.find(qn(NS_MAIN, "border"))
            if font is not None:
                dxf_info["font"] = {
                    "bold": font.find(qn(NS_MAIN, "b")) is not None,
                    "italic": font.find(qn(NS_MAIN, "i")) is not None,
                    "color": parse_color(font.find(qn(NS_MAIN, "color"))),
                }
            if fill is not None:
                pat = fill.find(qn(NS_MAIN, "patternFill"))
                dxf_info["fill"] = {
                    "patternType": pat.get("patternType") if pat is not None else None,
                    "fgColor": parse_color(pat.find(qn(NS_MAIN, "fgColor")) if pat is not None else None),
                    "bgColor": parse_color(pat.find(qn(NS_MAIN, "bgColor")) if pat is not None else None),
                }
            if border is not None:
                dxf_info["border"] = border.attrib
            styles["dxfs"].append(dxf_info)

    return styles


@dataclass
class SheetPath:
    """Map workbook sheet metadata to XML part path."""

    name: str
    rid: str
    path: str


def parse_workbook_sheet_paths(zf: zipfile.ZipFile) -> list[SheetPath]:
    """Resolve sheet names to worksheet XML files."""

    workbook_xml = ET.fromstring(zf.read("xl/workbook.xml"))
    rels_xml = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))

    rel_map: dict[str, str] = {}
    for rel in rels_xml.findall(qn(NS_PKG_REL, "Relationship")):
        rid = rel.get("Id")
        target = rel.get("Target")
        if rid and target:
            if target.startswith("/"):
                rel_map[rid] = target.lstrip("/")
            else:
                rel_map[rid] = f"xl/{target}"

    sheets_node = workbook_xml.find(qn(NS_MAIN, "sheets"))
    sheet_paths: list[SheetPath] = []
    if sheets_node is None:
        return sheet_paths

    for sheet in sheets_node.findall(qn(NS_MAIN, "sheet")):
        name = sheet.get("name", "")
        rid = sheet.get(qn(NS_REL, "id"), "")
        path = rel_map.get(rid, "")
        if name and rid and path:
            sheet_paths.append(SheetPath(name=name, rid=rid, path=path))
    return sheet_paths


def cell_value(cell: ET.Element, shared_strings: list[str]) -> str | None:
    """Decode cell textual value for token inspection."""

    cell_type = cell.get("t")
    v = cell.find(qn(NS_MAIN, "v"))
    is_node = cell.find(qn(NS_MAIN, "is"))

    if cell_type == "s" and v is not None and v.text is not None:
        try:
            idx = int(v.text)
            return shared_strings[idx] if 0 <= idx < len(shared_strings) else v.text
        except ValueError:
            return v.text

    if cell_type == "inlineStr" and is_node is not None:
        t = is_node.find(qn(NS_MAIN, "t"))
        return t.text if t is not None else None

    if v is not None:
        return v.text

    f = cell.find(qn(NS_MAIN, "f"))
    if f is not None and f.text is not None:
        return f"={f.text}"

    return None


def parse_sheet_tokens(
    zf: zipfile.ZipFile,
    sheet: SheetPath,
    shared_strings: list[str],
) -> dict[str, Any]:
    """Extract sheet-level layout/design tokens."""

    root = ET.fromstring(zf.read(sheet.path))

    sheet_views = root.find(qn(NS_MAIN, "sheetViews"))
    view_info: dict[str, Any] = {}
    pane_info: dict[str, Any] = {}
    if sheet_views is not None:
        sheet_view = sheet_views.find(qn(NS_MAIN, "sheetView"))
        if sheet_view is not None:
            view_info = dict(sheet_view.attrib)
            pane = sheet_view.find(qn(NS_MAIN, "pane"))
            if pane is not None:
                pane_info = dict(pane.attrib)

    sheet_format = root.find(qn(NS_MAIN, "sheetFormatPr"))
    sheet_format_info = dict(sheet_format.attrib) if sheet_format is not None else {}

    cols_info: list[dict[str, Any]] = []
    cols_node = root.find(qn(NS_MAIN, "cols"))
    if cols_node is not None:
        for col in cols_node.findall(qn(NS_MAIN, "col")):
            cols_info.append(dict(col.attrib))

    merges: list[str] = []
    merges_node = root.find(qn(NS_MAIN, "mergeCells"))
    if merges_node is not None:
        for mc in merges_node.findall(qn(NS_MAIN, "mergeCell")):
            ref = mc.get("ref")
            if ref:
                merges.append(ref)

    style_usage: Counter[int] = Counter()
    row_height_usage: Counter[str] = Counter()
    hidden_rows = 0
    hidden_cols = 0
    top_region_cells: list[dict[str, Any]] = []
    key_label_hits: list[dict[str, Any]] = []

    for cdef in cols_info:
        if cdef.get("hidden") in {"1", "true", "TRUE"}:
            try:
                mn = int(float(cdef.get("min", "0")))
                mx = int(float(cdef.get("max", "0")))
                hidden_cols += max(0, mx - mn + 1)
            except ValueError:
                hidden_cols += 1

    sheet_data = root.find(qn(NS_MAIN, "sheetData"))
    if sheet_data is not None:
        for row in sheet_data.findall(qn(NS_MAIN, "row")):
            if row.get("hidden") in {"1", "true", "TRUE"}:
                hidden_rows += 1
            if row.get("ht"):
                row_height_usage[row.get("ht", "")] += 1

            r_idx = int(row.get("r", "0")) if row.get("r") else 0
            for cell in row.findall(qn(NS_MAIN, "c")):
                s = cell.get("s")
                style_id = int(s) if s and s.isdigit() else 0
                style_usage[style_id] += 1

                ref = cell.get("r", "")
                col_label, row_num = split_cell_ref(ref)
                col_num = col_to_index(col_label) if col_label else 0
                text_val = cell_value(cell, shared_strings)

                if row_num <= 20 and col_num <= 90:
                    top_region_cells.append(
                        {
                            "cell": ref,
                            "style_id": style_id,
                            "value": text_val,
                            "formula": (cell.find(qn(NS_MAIN, "f")).text if cell.find(qn(NS_MAIN, "f")) is not None else None),
                        }
                    )

                if isinstance(text_val, str):
                    lowered = text_val.lower()
                    if any(k in lowered for k in ["working draft", "source:", "comments", "check", "questions/comments", "management comments"]):
                        key_label_hits.append(
                            {
                                "cell": ref,
                                "style_id": style_id,
                                "value": text_val,
                            }
                        )

    # Keep top tokens concise by frequency.
    top_styles = style_usage.most_common(20)
    top_row_heights = row_height_usage.most_common(10)

    return {
        "sheet_name": sheet.name,
        "sheet_xml_path": sheet.path,
        "sheet_view": view_info,
        "freeze_pane": pane_info,
        "sheet_format": sheet_format_info,
        "column_definitions": cols_info,
        "hidden_rows": hidden_rows,
        "hidden_cols": hidden_cols,
        "row_height_usage_top": top_row_heights,
        "merged_ranges_count": len(merges),
        "merged_ranges_sample": merges[:60],
        "style_usage_top": top_styles,
        "top_region_cells": top_region_cells,
        "key_label_hits": key_label_hits,
    }


def build_semantic_token_summary(
    styles: dict[str, Any],
    sheets: list[dict[str, Any]],
) -> dict[str, Any]:
    """Derive higher-level design-token summary."""

    color_counter: Counter[str] = Counter()
    font_counter: Counter[str] = Counter()
    fill_counter: Counter[str] = Counter()
    border_counter: Counter[str] = Counter()
    alignment_counter: Counter[str] = Counter()

    for idx, font in enumerate(styles.get("fonts", [])):
        name = font.get("name") or f"font_{idx}"
        font_counter[name] += 1
        if isinstance(font.get("color"), dict) and font["color"].get("rgb"):
            color_counter[font["color"]["rgb"]] += 1

    for idx, fill in enumerate(styles.get("fills", [])):
        fg = (fill.get("fgColor") or {}).get("rgb") if isinstance(fill.get("fgColor"), dict) else None
        key = f"fill_{idx}:{fill.get('patternType')}:{fg}"
        fill_counter[key] += 1
        if fg:
            color_counter[fg] += 1

    for idx, border in enumerate(styles.get("borders", [])):
        sides = []
        for side_name in ["left", "right", "top", "bottom"]:
            side = border.get(side_name, {})
            sides.append(f"{side_name}:{side.get('style')}")
            color = (side.get("color") or {}).get("rgb") if isinstance(side.get("color"), dict) else None
            if color:
                color_counter[color] += 1
        border_counter[f"border_{idx}|" + "|".join(sides)] += 1

    # Pull alignment signatures from xfs.
    for xf in styles.get("cell_xfs", []):
        align = xf.get("alignment") or {}
        if align:
            signature = ",".join(f"{k}={v}" for k, v in sorted(align.items()))
            alignment_counter[signature] += 1

    # Anchor sampling from North conventions.
    anchor_cells = ["B1", "B2", "B3", "B4", "C7", "C8", "C9", "C10"]
    anchor_style_freq: dict[str, Counter[int]] = {cell: Counter() for cell in anchor_cells}
    anchor_values: dict[str, Counter[str]] = {cell: Counter() for cell in anchor_cells}

    for sheet in sheets:
        top_map = {entry["cell"]: entry for entry in sheet.get("top_region_cells", [])}
        for anchor in anchor_cells:
            if anchor in top_map:
                anchor_style_freq[anchor][top_map[anchor]["style_id"]] += 1
                val = top_map[anchor].get("value")
                if isinstance(val, str) and val:
                    anchor_values[anchor][val] += 1

    return {
        "font_families": font_counter.most_common(40),
        "fills": fill_counter.most_common(40),
        "borders": border_counter.most_common(40),
        "colors": color_counter.most_common(80),
        "alignments": alignment_counter.most_common(40),
        "anchor_style_frequency": {
            cell: counter.most_common(10) for cell, counter in anchor_style_freq.items()
        },
        "anchor_value_samples": {
            cell: counter.most_common(15) for cell, counter in anchor_values.items()
        },
    }


def convert_xlsb_to_xlsx(xlsb_path: Path, out_dir: Path) -> Path:
    """Convert xlsb workbook to xlsx using soffice."""

    out_dir.mkdir(parents=True, exist_ok=True)
    xlsx_path = out_dir / (xlsb_path.stem + ".xlsx")
    if xlsx_path.exists():
        return xlsx_path

    subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "xlsx",
            "--outdir",
            str(out_dir),
            str(xlsb_path),
        ],
        check=True,
    )
    if not xlsx_path.exists():
        raise FileNotFoundError(f"Conversion did not produce expected file: {xlsx_path}")
    return xlsx_path


def write_summary_markdown(data: dict[str, Any], out_path: Path) -> None:
    """Create a human-readable summary markdown report."""

    styles = data["styles"]
    semantic = data["semantic_summary"]

    lines: list[str] = []
    lines.append("# Project North XML Design Token Extraction")
    lines.append("")
    lines.append(f"- Source xlsb: `{data['source_xlsb']}`")
    lines.append(f"- Converted xlsx: `{data['source_xlsx']}`")
    lines.append(f"- Sheets: **{len(data['sheets'])}**")
    lines.append(f"- Fonts: **{len(styles['fonts'])}**")
    lines.append(f"- Fills: **{len(styles['fills'])}**")
    lines.append(f"- Borders: **{len(styles['borders'])}**")
    lines.append(f"- Cell XFs: **{len(styles['cell_xfs'])}**")
    lines.append("")

    lines.append("## Theme Tokens")
    for name, token in data.get("theme", {}).get("color_scheme", {}).items():
        attrs = token.get("attrs", {})
        lines.append(f"- `{name}`: `{token.get('kind')}` {attrs}")
    lines.append("")

    lines.append("## Top Font Families")
    for name, count in semantic.get("font_families", [])[:20]:
        lines.append(f"- `{name}`: {count}")
    lines.append("")

    lines.append("## Top Color Tokens")
    for color, count in semantic.get("colors", [])[:30]:
        lines.append(f"- `{color}`: {count}")
    lines.append("")

    lines.append("## Anchor Style IDs (North Patterns)")
    for anchor, pairs in semantic.get("anchor_style_frequency", {}).items():
        lines.append(f"- `{anchor}`: {pairs}")
    lines.append("")

    lines.append("## Key Label Tokens (Sample)")
    for sheet in data["sheets"][:30]:
        hits = sheet.get("key_label_hits", [])
        if not hits:
            continue
        lines.append(f"- `{sheet['sheet_name']}`")
        for hit in hits[:5]:
            lines.append(f"  - `{hit['cell']}` style `{hit['style_id']}` value `{hit['value']}`")
    lines.append("")

    lines.append("## Highest-Usage Style IDs by Sheet (Sample)")
    for sheet in data["sheets"][:30]:
        top = sheet.get("style_usage_top", [])
        lines.append(f"- `{sheet['sheet_name']}`: {top[:8]}")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    """Program entrypoint."""

    parser = argparse.ArgumentParser()
    parser.add_argument("--xlsb", required=True, help="Path to Project North xlsb")
    parser.add_argument("--out-dir", required=True, help="Output directory for extracted token files")
    parser.add_argument(
        "--converted-xlsx-dir",
        default="/tmp/databook-analysis",
        help="Directory used for xlsb->xlsx conversion",
    )
    args = parser.parse_args()

    xlsb_path = Path(args.xlsb).resolve()
    out_dir = Path(args.out_dir).resolve()
    converted_dir = Path(args.converted_xlsx_dir).resolve()

    out_dir.mkdir(parents=True, exist_ok=True)

    xlsx_path = convert_xlsb_to_xlsx(xlsb_path, converted_dir)

    with zipfile.ZipFile(xlsx_path, "r") as zf:
        shared_strings = parse_shared_strings(zf)
        theme = parse_theme(zf)
        styles = parse_styles(zf)
        sheet_paths = parse_workbook_sheet_paths(zf)
        sheets = [parse_sheet_tokens(zf, sheet, shared_strings) for sheet in sheet_paths]

    semantic = build_semantic_token_summary(styles, sheets)

    payload = {
        "source_xlsb": str(xlsb_path),
        "source_xlsx": str(xlsx_path),
        "theme": theme,
        "styles": styles,
        "semantic_summary": semantic,
        "sheets": sheets,
    }

    json_path = out_dir / "north-design-tokens.json"
    md_path = out_dir / "north-design-tokens-summary.md"
    payload_path = out_dir / "north-token-pack.json"

    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    payload_path.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    write_summary_markdown(payload, md_path)

    print(f"Wrote: {json_path}")
    print(f"Wrote: {md_path}")
    print(f"Wrote: {payload_path}")


if __name__ == "__main__":
    main()
