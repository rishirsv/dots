from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

from .part_graph import PartGraph, get_used_layouts
from .slots import LayoutSlots


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
    return s or "item"


_DIGIT_WORDS = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
}


def _numbers_to_words_slug(slug: str) -> str:
    tokens = [t for t in str(slug or "").split("-") if t]
    if not tokens:
        return ""
    return "-".join([_DIGIT_WORDS.get(t, t) for t in tokens])


def _deep_merge(base: Dict[str, Any], overrides: Dict[str, Any]) -> Dict[str, Any]:
    out: Dict[str, Any] = dict(base)
    for key, value in (overrides or {}).items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = _deep_merge(out[key], value)  # type: ignore[arg-type]
        else:
            out[key] = value
    return out


def _normalize_hex(value: Any, fallback: str) -> str:
    raw = str(value or "").strip().lstrip("#").upper()
    if len(raw) == 6 and all(ch in "0123456789ABCDEF" for ch in raw):
        return raw
    return fallback


def load_profile(profile_path: Optional[Path]) -> Dict[str, Any]:
    if profile_path is None or not profile_path.exists():
        return {}
    try:
        data = json.loads(profile_path.read_text())
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {}


def _profile_layout_value(profile_map: Dict[str, Any], type_key: str, layout_name: str) -> Any:
    if type_key in profile_map:
        return profile_map[type_key]
    if layout_name in profile_map:
        return profile_map[layout_name]
    layout_slug = _slugify(layout_name)
    if f"layout.{layout_slug}" in profile_map:
        return profile_map[f"layout.{layout_slug}"]
    return None


def _canonical_slot_name(
    *,
    kind: str,
    ph_type: str,
    ph_idx: str,
    fallback_index: int,
    used: Dict[str, int],
) -> str:
    pieces = [kind]
    if ph_type:
        pieces.append(_slugify(ph_type).replace("-", "_"))
    if ph_idx:
        pieces.append(_slugify(ph_idx).replace("-", "_"))
    if len(pieces) == 1:
        pieces.append(str(fallback_index))
    base = "_".join([p for p in pieces if p])
    count = used.get(base, 0) + 1
    used[base] = count
    return base if count == 1 else f"{base}_{count}"


def _slot_kind(slot_type: str) -> str:
    if slot_type in ("text", "image", "table", "chart"):
        return slot_type
    return "text"


def _bbox_dict(bbox: Any) -> Optional[Dict[str, float]]:
    if bbox is None:
        return None
    try:
        return {
            "x": float(bbox.x),
            "y": float(bbox.y),
            "w": float(bbox.w),
            "h": float(bbox.h),
        }
    except Exception:
        return None


def _sorted_boxes(boxes: List[Dict[str, Any]]) -> List[Dict[str, float]]:
    out: List[Dict[str, float]] = []
    for b in boxes:
        try:
            out.append(
                {
                    "x": float(b["x"]),
                    "y": float(b["y"]),
                    "w": float(b["w"]),
                    "h": float(b["h"]),
                }
            )
        except Exception:
            continue
    out.sort(key=lambda b: (b["y"], b["x"]))
    return out


def _fallback_slot_bbox(
    *,
    kind: str,
    ph_type: str,
    layout_geometry: Dict[str, Any],
    body_pool: List[Dict[str, float]],
) -> Optional[Dict[str, float]]:
    if kind == "chart":
        chart = layout_geometry.get("chart")
        if isinstance(chart, dict):
            return chart
    if kind == "table":
        table = layout_geometry.get("table")
        if isinstance(table, dict):
            return table
    if kind == "image":
        pic = layout_geometry.get("picture")
        if isinstance(pic, dict):
            return pic

    if ph_type in ("title", "ctrTitle"):
        title = layout_geometry.get("title")
        if isinstance(title, dict):
            return title
        if body_pool:
            return body_pool.pop(0)

    if ph_type == "subTitle":
        sub = layout_geometry.get("subtitle") or layout_geometry.get("strapline")
        if isinstance(sub, dict):
            return sub
        if body_pool:
            return body_pool.pop(0)

    if ph_type in ("body", "obj") and body_pool:
        return body_pool.pop(0)

    body = layout_geometry.get("body")
    if isinstance(body, dict):
        return body

    if body_pool:
        return body_pool.pop(0)
    return None


def _fallback_bbox_from_existing_slots(slot_defs: Dict[str, Any]) -> Optional[Dict[str, float]]:
    boxes: List[Dict[str, float]] = []
    for slot in slot_defs.values():
        bbox = slot.get("bbox") if isinstance(slot, dict) else None
        if not isinstance(bbox, dict):
            continue
        try:
            boxes.append(
                {
                    "x": float(bbox["x"]),
                    "y": float(bbox["y"]),
                    "w": float(bbox["w"]),
                    "h": float(bbox["h"]),
                }
            )
        except Exception:
            continue
    if not boxes:
        return None
    boxes.sort(key=lambda b: (b["y"], b["x"]))
    return boxes[0]


def _layout_family(layout_name: str) -> str:
    name = (layout_name or "").lower()
    if "quad box with icon and center text box" in name:
        return "quadWithCenter"
    if "four quad boxes" in name:
        return "fourQuad"
    if "process 4 columns" in name:
        return "process4"
    if "process 5 columns" in name:
        return "process5"
    if "2 column blue heading" in name:
        return "twoColComparison"
    if "two column" in name or "2 column" in name:
        return "twoCol"
    if "one column" in name or "1 column" in name:
        return "oneCol"
    if "title slide" in name or name.startswith("cover"):
        return "titleSlide"
    if "divider" in name:
        return "divider"
    if "back cover" in name:
        return "backCover"
    return "generic"


def _assign_family_aliases(
    *,
    family: str,
    body_slots: List[Tuple[str, Dict[str, Any]]],
    alias_out: Dict[str, str],
) -> None:
    def add(alias: str, canonical: Optional[str]) -> None:
        if not canonical:
            return
        alias_out.setdefault(alias, canonical)

    ordered_names = [name for name, _ in body_slots]
    if not ordered_names:
        return

    if family == "twoCol":
        if len(ordered_names) >= 3:
            add("strapline", ordered_names[0])
            add("leftBody", ordered_names[1])
            add("rightBody", ordered_names[2])
        elif len(ordered_names) >= 2:
            add("leftBody", ordered_names[0])
            add("rightBody", ordered_names[1])
        return

    if family == "twoColComparison":
        if len(ordered_names) >= 5:
            add("strapline", ordered_names[0])
            add("leftHeading", ordered_names[1])
            add("rightHeading", ordered_names[2])
            add("leftBody", ordered_names[3])
            add("rightBody", ordered_names[4])
        else:
            _assign_family_aliases(family="twoCol", body_slots=body_slots, alias_out=alias_out)
        return

    if family == "fourQuad":
        if len(ordered_names) >= 9:
            add("strapline", ordered_names[0])
            add("topLeftHeading", ordered_names[1])
            add("topRightHeading", ordered_names[2])
            add("topLeftBody", ordered_names[3])
            add("topRightBody", ordered_names[4])
            add("bottomLeftHeading", ordered_names[5])
            add("bottomRightHeading", ordered_names[6])
            add("bottomLeftBody", ordered_names[7])
            add("bottomRightBody", ordered_names[8])
        return

    if family == "quadWithCenter":
        if len(ordered_names) >= 6:
            add("strapline", ordered_names[0])
            add("topLeftBody", ordered_names[1])
            add("topRightBody", ordered_names[2])
            add("centerBody", ordered_names[3])
            add("bottomLeftBody", ordered_names[4])
            add("bottomRightBody", ordered_names[5])
        return

    if family == "process4":
        if len(ordered_names) >= 8:
            add("column1Heading", ordered_names[0])
            add("column2Heading", ordered_names[1])
            add("column3Heading", ordered_names[2])
            add("column4Heading", ordered_names[3])
            add("column1Body", ordered_names[4])
            add("column2Body", ordered_names[5])
            add("column3Body", ordered_names[6])
            add("column4Body", ordered_names[7])
        return

    if family == "process5":
        if len(ordered_names) >= 10:
            add("column1Heading", ordered_names[0])
            add("column2Heading", ordered_names[1])
            add("column3Heading", ordered_names[2])
            add("column4Heading", ordered_names[3])
            add("column5Heading", ordered_names[4])
            add("column1Body", ordered_names[5])
            add("column2Body", ordered_names[6])
            add("column3Body", ordered_names[7])
            add("column4Body", ordered_names[8])
            add("column5Body", ordered_names[9])
        return


def _build_slot_aliases(layout_name: str, slot_defs: Dict[str, Any]) -> Dict[str, str]:
    alias: Dict[str, str] = {}

    def add(a: str, c: Optional[str]) -> None:
        if not c:
            return
        alias.setdefault(a, c)

    text_slots: List[Tuple[str, Dict[str, Any]]] = []
    image_slots: List[str] = []
    table_slots: List[str] = []
    chart_slots: List[str] = []
    title_slot: Optional[str] = None
    subtitle_slot: Optional[str] = None

    for name, slot in slot_defs.items():
        kind = slot.get("kind")
        source = slot.get("source", {}) if isinstance(slot.get("source"), dict) else {}
        ph = str(source.get("phType", "") or "").lower()
        if kind == "image":
            image_slots.append(name)
            continue
        if kind == "table":
            table_slots.append(name)
            continue
        if kind == "chart":
            chart_slots.append(name)
            continue
        if kind == "text":
            text_slots.append((name, slot))
            if ph in ("title", "ctrtitle"):
                title_slot = name
            if ph == "subtitle":
                subtitle_slot = name

    text_slots.sort(
        key=lambda item: (
            float((item[1].get("bbox") or {}).get("y", 1e9)),
            float((item[1].get("bbox") or {}).get("x", 1e9)),
            item[0],
        )
    )

    add("title", title_slot)
    add("subtitle", subtitle_slot)

    if image_slots:
        add("image", image_slots[0])
        for i, s in enumerate(image_slots[1:], start=2):
            add(f"image{i}", s)

    if table_slots:
        add("table", table_slots[0])
        for i, s in enumerate(table_slots[1:], start=2):
            add(f"table{i}", s)

    if chart_slots:
        add("chart", chart_slots[0])
        for i, s in enumerate(chart_slots[1:], start=2):
            add(f"chart{i}", s)

    body_slots = []
    for name, slot in text_slots:
        if name == title_slot or name == subtitle_slot:
            continue
        source = slot.get("source", {}) if isinstance(slot.get("source"), dict) else {}
        ph = str(source.get("phType", "") or "").lower()
        if ph in ("body", "obj"):
            body_slots.append((name, slot))
    _assign_family_aliases(family=_layout_family(layout_name), body_slots=body_slots, alias_out=alias)

    for i, (name, _) in enumerate(body_slots, start=1):
        add(f"body{i}", name)

    return alias


def _iter_selected_layouts(
    graph: PartGraph,
    *,
    all_layout_types: bool,
    used_layouts: Dict[str, int],
) -> Iterable[Tuple[str, Any]]:
    used_set = set(used_layouts.keys())
    items = sorted(graph.layouts.items(), key=lambda item: (item[1].name.lower(), item[0]))
    for layout_path, layout_ref in items:
        if all_layout_types or layout_ref.name in used_set:
            yield layout_path, layout_ref


def _summarize_detected_layout_slots(detected_layouts: Dict[str, LayoutSlots]) -> Dict[str, Any]:
    summary: Dict[str, Any] = {}
    for layout_name, layout in detected_layouts.items():
        slot_types: Dict[str, int] = {}
        chart_names: List[str] = []
        for slot in layout.slots.values():
            slot_types[slot.slot_type] = slot_types.get(slot.slot_type, 0) + 1
            if slot.slot_type == "chart":
                chart_names.append(slot.element.name)
        summary[layout_name] = {
            "slotTypes": slot_types,
            "chartNames": chart_names,
            "staticCount": len(layout.static_elements),
        }
    return summary


def _build_master_map(graph: PartGraph) -> Tuple[Dict[str, str], Dict[str, Any]]:
    path_to_key: Dict[str, str] = {}
    masters: Dict[str, Any] = {}
    used: Dict[str, int] = {}

    for master_path, master in sorted(graph.masters.items(), key=lambda item: item[0]):
        base = _slugify(master.name or Path(master_path).stem).replace("-", "_")
        n = used.get(base, 0) + 1
        used[base] = n
        key = f"master.{base}" if n == 1 else f"master.{base}_{n}"
        path_to_key[master_path] = key
        masters[key] = {
            "key": key,
            "name": master.name,
            "xmlPath": master_path,
            "themePath": master.theme_path,
            "layoutPaths": list(master.layout_paths),
        }

    return path_to_key, masters


def _default_tokens(*, resolver: Any, graph: PartGraph) -> Dict[str, Any]:
    return {
        "dimensions": {
            "w": float(graph.slide_dimensions.get("w", 13.333)),
            "h": float(graph.slide_dimensions.get("h", 7.5)),
        },
        "colors": {
            "scheme": resolver.clr_scheme,
            "clrMap": resolver.clr_map,
            "semantic": {
                "primary": resolver.clr_scheme.get("accent1", "1E49E2"),
                "secondary": resolver.clr_scheme.get("accent2", "00338D"),
                "textDark": resolver.clr_scheme.get("dk1", "000000"),
                "textLight": resolver.clr_scheme.get("lt1", "FFFFFF"),
                "bgLight": resolver.clr_scheme.get("lt1", "FFFFFF"),
            },
        },
        "fonts": {
            "heading": resolver.fonts.get("+mj-lt", "Arial"),
            "body": resolver.fonts.get("+mn-lt", resolver.fonts.get("+mj-lt", "Arial")),
            "fallback": "Arial",
        },
        "textStyles": {
            "title": {"fontSize": 24, "bold": True},
            "body": {"fontSize": 12},
            "notes": {"fontSize": 10, "italic": True},
        },
        "styleOverrides": {
            "textScale": 1.0,
        },
    }


def _select_embedded_assets(
    *,
    assets_base64: Dict[str, str],
    gradients_data_uris: Dict[str, str],
) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for key, value in gradients_data_uris.items():
        if isinstance(value, str) and value.startswith("data:"):
            out[key] = value
    for key, value in assets_base64.items():
        k = key.lower()
        if "logo" in k or "cover" in k:
            if isinstance(value, str) and value.startswith("data:"):
                out[key] = value
    return out


def _find_best_gradient_key(layout_slug: str, layout_name: str, gradient_keys: List[str]) -> Optional[str]:
    if not gradient_keys:
        return None

    name_slug = _slugify(layout_name)
    if "cobalt-blue" in name_slug:
        cobalt = [k for k in gradient_keys if "cobalt" in k]
        return cobalt[0] if cobalt else None
    if "pacific-blue" in name_slug:
        pacific = [k for k in gradient_keys if "pacific" in k]
        if pacific:
            return pacific[0]
    if "kpmg-blue" in name_slug:
        kpmg = [k for k in gradient_keys if "kpmg" in k]
        if kpmg:
            return kpmg[0]

    for key in gradient_keys:
        if key == "back_cover":
            continue
        if key.startswith(name_slug) or key.startswith(layout_slug):
            return key

    name_tokens = set([t for t in name_slug.split("-") if t])
    best_key: Optional[str] = None
    best_score = 0
    for key in gradient_keys:
        key_tokens = set([t for t in key.replace("_", "-").split("-") if t and not t.isdigit()])
        score = len(name_tokens.intersection(key_tokens))
        if score > best_score:
            best_score = score
            best_key = key
    return best_key if best_score > 0 else None


def _infer_layout_style(
    *,
    layout_name: str,
    layout_slug: str,
    geometry: Dict[str, Any],
    gradient_keys: List[str],
    semantic_colors: Dict[str, str],
) -> Dict[str, Any]:
    name = (layout_name or "").lower()
    family = _layout_family(layout_name)
    bg_light = _normalize_hex(semantic_colors.get("bgLight"), "FFFFFF")
    bg_dark = _normalize_hex(semantic_colors.get("secondary"), "00338D")
    bg_primary = _normalize_hex(semantic_colors.get("primary"), "1E49E2")
    bg_pacific = _normalize_hex(semantic_colors.get("accent4"), bg_primary)
    text_dark = _normalize_hex(semantic_colors.get("textDark"), "000000")
    text_light = _normalize_hex(semantic_colors.get("textLight"), "FFFFFF")
    title_dark = _normalize_hex(semantic_colors.get("secondary"), "00338D")

    is_title = ("title slide" in name) or name.startswith("cover ")
    is_divider = "divider" in name
    is_back_cover = "back cover" in name
    is_dark = any(token in name for token in ("dark", "kpmg blue", "cobalt blue", "pacific blue"))

    background_color = bg_light
    if is_back_cover or is_divider:
        background_color = bg_dark
    elif is_title:
        if "pacific blue" in name:
            background_color = bg_pacific
        elif "kpmg blue" in name or "cobalt blue" in name:
            background_color = bg_dark
        else:
            background_color = bg_primary
    elif is_dark:
        background_color = bg_dark

    light_text = background_color != bg_light
    title_color = text_light if light_text else title_dark
    body_color = text_light if light_text else text_dark
    subtitle_color = text_light if light_text else text_dark
    heading_color = text_light if (light_text or family in ("twoColComparison", "fourQuad", "process4", "process5")) else title_dark

    decorations: List[Dict[str, Any]] = []
    gradient_key = None
    if is_back_cover and "back_cover" in gradient_keys:
        gradient_key = "back_cover"
        decorations.append(
            {
                "kind": "gradient",
                "assetKey": gradient_key,
                "placement": "full",
            }
        )
    else:
        gradient_key = _find_best_gradient_key(layout_slug, layout_name, gradient_keys)
        if gradient_key:
            window = geometry.get("window") if isinstance(geometry, dict) else None
            if isinstance(window, dict) and all(k in window for k in ("x", "y", "w", "h")):
                decorations.append(
                    {
                        "kind": "gradient",
                        "assetKey": gradient_key,
                        "placement": "window",
                        "bbox": {
                            "x": float(window["x"]),
                            "y": float(window["y"]),
                            "w": float(window["w"]),
                            "h": float(window["h"]),
                        },
                    }
                )
            elif is_title or is_divider:
                decorations.append(
                    {
                        "kind": "gradient",
                        "assetKey": gradient_key,
                        "placement": "full",
                    }
                )

    return {
        "layoutFamily": family,
        "variant": "dark" if light_text else "light",
        "backgroundColor": background_color,
        "titleColor": title_color,
        "subtitleColor": subtitle_color,
        "bodyColor": body_color,
        "headingColor": heading_color,
        "chartPalette": [
            _normalize_hex(semantic_colors.get("primary"), "1E49E2"),
            _normalize_hex(semantic_colors.get("secondary"), "00338D"),
            _normalize_hex(semantic_colors.get("accent3"), "0C233C"),
            _normalize_hex(semantic_colors.get("accent4"), "00B8F5"),
            _normalize_hex(semantic_colors.get("accent5"), "7213EA"),
            _normalize_hex(semantic_colors.get("accent6"), "FD349C"),
        ],
        "decorations": decorations,
    }


def _candidate_type_aliases(
    *,
    type_key: str,
    layout_name: str,
    family: str,
    variant: str,
) -> List[str]:
    canonical = type_key if type_key.startswith("layout.") else f"layout.{_slugify(layout_name)}"
    canonical_slug = canonical.split(".", 1)[1] if "." in canonical else canonical
    display_slug = _slugify(layout_name)

    out: set[str] = set()

    def add(value: Optional[str]) -> None:
        if not value:
            return
        alias = str(value).strip().lower()
        if not alias:
            return
        if not alias.startswith("layout."):
            alias = f"layout.{alias}"
        if alias == canonical:
            return
        out.add(alias)

    add(display_slug)
    add(_numbers_to_words_slug(display_slug))
    add(_numbers_to_words_slug(canonical_slug))
    add(display_slug.replace("-columns", "-column"))
    add(canonical_slug.replace("-columns", "-column"))
    add(display_slug.replace("-bg-dark-colour", "-blue"))
    add(display_slug.replace("-dark-bg-color", "-blue"))
    add(display_slug.replace("-dark-bg-colour", "-blue"))

    if family == "twoColComparison":
        add("two-column-comparison")
        add("2-column-comparison")
        if variant == "dark":
            add("two-column-comparison-dark-bg-colour")
            add("2-column-comparison-dark-bg-colour")

    if family == "fourQuad":
        add("four-quad-boxes")
        add("four-quad")
        if variant == "dark":
            add("quad-blue")
            add("four-quad-blue")
            add("four-quad-boxes-blue")

    if family == "quadWithCenter":
        add("quad-box-with-center")
        add("quad-box-with-icon-center")

    if family == "process4":
        if "top-banner" in canonical_slug:
            add("process-chart-4-column-top-banner")
        elif "cobalt" in canonical_slug:
            add("process-chart-4-column-cobalt-blue")
            add("process-4-column-cobalt-blue")
        else:
            add("process-chart-4-column")
            add("process-4-column")

    if family == "process5":
        if "top-banner" in canonical_slug:
            add("process-chart-5-column-top-banner")
        elif "cobalt" in canonical_slug:
            add("process-chart-5-column-cobalt-blue")
            add("process-5-column-cobalt-blue")
        else:
            add("process-chart-5-column")
            add("process-5-column")

    return sorted(out)


def build_native_template_artifacts(
    *,
    schema_version: str,
    generated_at: str,
    source_pptx: Path,
    graph: PartGraph,
    resolver: Any,
    detected_layouts: Dict[str, LayoutSlots],
    detected_layout_geometry: Dict[str, Any],
    assets_base64_path: Path,
    gradients_data_uris_path: Path,
    all_layout_types: bool,
    profile: Dict[str, Any],
) -> Dict[str, Any]:
    assets_base64 = json.loads(assets_base64_path.read_text()) if assets_base64_path.exists() else {}
    gradients_data_uris = json.loads(gradients_data_uris_path.read_text()) if gradients_data_uris_path.exists() else {}
    used_layouts = get_used_layouts(graph)
    gradient_keys = sorted(
        [k for k, v in gradients_data_uris.items() if isinstance(v, str) and v.startswith("data:")]
    )

    master_path_to_key, masters = _build_master_map(graph)

    layouts: Dict[str, Any] = {}
    type_alias_candidates: Dict[str, List[str]] = {}
    type_by_layout_name: Dict[str, str] = {}
    used_layout_keys: Dict[str, int] = {}

    required_slot_overrides = profile.get("requiredSlotOverrides") if isinstance(profile.get("requiredSlotOverrides"), dict) else {}
    slot_aliases_overrides = profile.get("slotAliases") if isinstance(profile.get("slotAliases"), dict) else {}
    layout_display_names = profile.get("layoutDisplayNames") if isinstance(profile.get("layoutDisplayNames"), dict) else {}
    master_mapping = profile.get("masterMapping") if isinstance(profile.get("masterMapping"), dict) else {}
    semantic_colors_for_style = {
        "primary": resolver.clr_scheme.get("accent1", "1E49E2"),
        "secondary": resolver.clr_scheme.get("accent2", "00338D"),
        "accent3": resolver.clr_scheme.get("accent3", "0C233C"),
        "accent4": resolver.clr_scheme.get("accent4", "00B8F5"),
        "accent5": resolver.clr_scheme.get("accent5", "7213EA"),
        "accent6": resolver.clr_scheme.get("accent6", "FD349C"),
        "textDark": resolver.clr_scheme.get("dk1", "000000"),
        "textLight": resolver.clr_scheme.get("lt1", "FFFFFF"),
        "bgLight": resolver.clr_scheme.get("lt1", "FFFFFF"),
    }

    for layout_path, layout_ref in _iter_selected_layouts(graph, all_layout_types=all_layout_types, used_layouts=used_layouts):
        base = _slugify(layout_ref.name)
        n = used_layout_keys.get(base, 0) + 1
        used_layout_keys[base] = n
        type_key = f"layout.{base}" if n == 1 else f"layout.{base}-{n}"
        type_by_layout_name[layout_ref.name] = type_key

        layout_slots = detected_layouts.get(layout_ref.name)
        geometry = detected_layout_geometry.get(layout_ref.name, {})
        geometry_dict = geometry if isinstance(geometry, dict) else {}
        body_pool = _sorted_boxes(geometry_dict.get("bodyBoxes", []) if isinstance(geometry_dict.get("bodyBoxes"), list) else [])
        slot_defs: Dict[str, Any] = {}
        slot_order: List[str] = []
        slot_used_names: Dict[str, int] = {}

        if layout_slots is not None:
            for i, slot in enumerate(layout_slots.slots.values(), start=1):
                kind = _slot_kind(slot.slot_type)
                ph_type = str(slot.element.meta.get("phType", "") or "")
                ph_idx = str(slot.element.meta.get("phIdx", "") or "")
                slot_name = _canonical_slot_name(
                    kind=kind,
                    ph_type=ph_type,
                    ph_idx=ph_idx,
                    fallback_index=i,
                    used=slot_used_names,
                )
                required_default = kind == "text" and ph_type in ("title", "ctrTitle")
                bbox = _bbox_dict(slot.element.bbox)
                if bbox is None:
                    bbox = _fallback_slot_bbox(
                        kind=kind,
                        ph_type=ph_type,
                        layout_geometry=geometry_dict,
                        body_pool=body_pool,
                    )
                if bbox is None:
                    bbox = _fallback_bbox_from_existing_slots(slot_defs)
                slot_defs[slot_name] = {
                    "kind": kind,
                    "required": required_default,
                    "source": {
                        "slotId": slot.slot_id,
                        "elementName": slot.element.name,
                        "phType": ph_type,
                        "phIdx": ph_idx,
                    },
                    "bbox": bbox,
                }
                slot_order.append(slot_name)

        req_override = _profile_layout_value(required_slot_overrides, type_key, layout_ref.name)
        if isinstance(req_override, dict):
            for slot_name, required in req_override.items():
                if slot_name in slot_defs:
                    slot_defs[slot_name]["required"] = bool(required)

        aliases = _profile_layout_value(slot_aliases_overrides, type_key, layout_ref.name)
        alias_map: Dict[str, str] = _build_slot_aliases(layout_ref.name, slot_defs)
        if isinstance(aliases, dict):
            alias_map = {**alias_map, **aliases}

        display_name = _profile_layout_value(layout_display_names, type_key, layout_ref.name)
        if not isinstance(display_name, str) or not display_name.strip():
            display_name = layout_ref.name

        master_key = master_path_to_key.get(layout_ref.master_path)
        master_override = _profile_layout_value(master_mapping, type_key, layout_ref.name)
        if isinstance(master_override, str) and master_override.strip():
            master_key = master_override.strip()
        style = _infer_layout_style(
            layout_name=layout_ref.name,
            layout_slug=base,
            geometry=geometry_dict,
            gradient_keys=gradient_keys,
            semantic_colors=semantic_colors_for_style,
        )
        type_alias_candidates[type_key] = _candidate_type_aliases(
            type_key=type_key,
            layout_name=layout_ref.name,
            family=str(style.get("layoutFamily", "generic")),
            variant=str(style.get("variant", "light")),
        )

        layouts[type_key] = {
            "type": type_key,
            "layoutName": layout_ref.name,
            "layoutPath": layout_path,
            "displayName": display_name,
            "master": master_key,
            "slots": slot_defs,
            "slotAliases": alias_map,
            "slotOrder": slot_order,
            "geometry": geometry_dict,
            "style": style,
            "staticCount": len(layout_slots.static_elements) if layout_slots is not None else 0,
        }

    alias_owner: Dict[str, str] = {}
    collisions: set[str] = set()
    for canonical_type, aliases in type_alias_candidates.items():
        for alias in aliases:
            owner = alias_owner.get(alias)
            if owner is None:
                alias_owner[alias] = canonical_type
            elif owner != canonical_type:
                collisions.add(alias)

    for alias in collisions:
        alias_owner.pop(alias, None)

    for canonical_type, layout in layouts.items():
        aliases = [
            alias
            for alias in type_alias_candidates.get(canonical_type, [])
            if alias_owner.get(alias) == canonical_type
        ]
        if aliases:
            layout["typeAliases"] = sorted(set(aliases))

    tokens = _default_tokens(resolver=resolver, graph=graph)
    token_overrides = profile.get("tokenOverrides") if isinstance(profile.get("tokenOverrides"), dict) else {}
    style_overrides = profile.get("styleOverrides") if isinstance(profile.get("styleOverrides"), dict) else {}
    tokens = _deep_merge(tokens, token_overrides)
    tokens["styleOverrides"] = _deep_merge(tokens.get("styleOverrides", {}), style_overrides)

    assets = _select_embedded_assets(assets_base64=assets_base64, gradients_data_uris=gradients_data_uris)

    template_json = {
        "schemaVersion": schema_version,
        "templateMode": "native",
        "generatedAt": generated_at,
        "sourcePptx": str(source_pptx),
        "slideDimensions": {
            "w": float(graph.slide_dimensions.get("w", 13.333)),
            "h": float(graph.slide_dimensions.get("h", 7.5)),
        },
        "masters": masters,
        "layouts": layouts,
        "colors": {
            "scheme": resolver.clr_scheme,
            "clrMap": resolver.clr_map,
        },
        "fonts": resolver.fonts,
        "usedLayouts": used_layouts,
        "assets": {
            "assetsBase64": str(assets_base64_path),
            "gradientDataUris": str(gradients_data_uris_path),
        },
        "detectedLayoutSlots": _summarize_detected_layout_slots(detected_layouts),
        "layoutGeometry": detected_layout_geometry,
        "paginationGrouping": profile.get("paginationGrouping", {}),
        "profile": {
            "requiredSlotOverrides": required_slot_overrides,
            "slotAliases": slot_aliases_overrides,
            "layoutDisplayNames": layout_display_names,
            "masterMapping": master_mapping,
            "tokenOverrides": token_overrides,
            "styleOverrides": style_overrides,
        },
    }

    return {
        "template_json": template_json,
        "tokens": tokens,
        "assets": assets,
    }


def build_template_js_native(
    *,
    schema_version: str,
    source_pptx_name: str,
    generated_at: str,
    tokens: Dict[str, Any],
    assets: Dict[str, str],
    masters: Dict[str, Any],
    layouts: Dict[str, Any],
    detected_layout_slots: Dict[str, Any],
    detected_layout_geometry: Dict[str, Any],
) -> str:
    tokens_js = json.dumps(tokens, indent=2, sort_keys=True)
    assets_js = json.dumps(assets, indent=2, sort_keys=True)
    masters_js = json.dumps(masters, indent=2, sort_keys=True)
    layouts_js = json.dumps(layouts, indent=2, sort_keys=True)
    detected_slots_js = json.dumps(detected_layout_slots, indent=2, sort_keys=True)
    detected_geom_js = json.dumps(detected_layout_geometry, indent=2, sort_keys=True)

    return f"""/**
 * KPMGPTX Template - Native Layout Contract
 *
 * Auto-generated from: {source_pptx_name}
 * Schema Version: {schema_version}
 * Generated: {generated_at}
 */

import PptxGenJS from 'pptxgenjs';

export const TOKENS = {tokens_js};
export const ASSETS = {assets_js};
export const MASTERS = {masters_js};
export const LAYOUTS = {layouts_js};
export const DETECTED_LAYOUT_SLOTS = {detected_slots_js};
export const DETECTED_LAYOUT_GEOMETRY = {detected_geom_js};

const TYPE_ALIAS_INDEX = (() => {{
  const out = {{}};
  for (const [canonical, layout] of Object.entries(LAYOUTS || {{}})) {{
    if (typeof canonical !== 'string') continue;
    out[canonical] = canonical;

    const canonicalLower = canonical.toLowerCase();
    out[canonicalLower] = canonical;

    const shortCanonical = canonicalLower.startsWith('layout.') ? canonicalLower.slice(7) : canonicalLower;
    out[shortCanonical] = canonical;
    out[`layout.${{shortCanonical}}`] = canonical;

    const aliases = Array.isArray(layout?.typeAliases) ? layout.typeAliases : [];
    for (const aliasRaw of aliases) {{
      if (typeof aliasRaw !== 'string') continue;
      const alias = aliasRaw.trim();
      if (!alias) continue;
      out[alias] = canonical;

      const aliasLower = alias.toLowerCase();
      out[aliasLower] = canonical;

      const shortAlias = aliasLower.startsWith('layout.') ? aliasLower.slice(7) : aliasLower;
      out[shortAlias] = canonical;
      out[`layout.${{shortAlias}}`] = canonical;
    }}
  }}
  return out;
}})();

export function resolveLayoutType(type) {{
  const raw = String(type || '').trim();
  if (!raw) return null;
  if (LAYOUTS[raw]) return raw;

  const lower = raw.toLowerCase();
  if (LAYOUTS[lower]) return lower;

  const prefixed = lower.startsWith('layout.') ? lower : `layout.${{lower}}`;
  if (LAYOUTS[prefixed]) return prefixed;

  return TYPE_ALIAS_INDEX[raw] || TYPE_ALIAS_INDEX[lower] || TYPE_ALIAS_INDEX[prefixed] || null;
}}

function isMissing(v) {{
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}}

function getSlotsPayload(slideSpec) {{
  if (slideSpec && typeof slideSpec === 'object' && slideSpec.slots && typeof slideSpec.slots === 'object') {{
    return slideSpec.slots;
  }}
  return slideSpec || {{}};
}}

function resolveSlotValue(layout, payload, slotName) {{
  if (Object.prototype.hasOwnProperty.call(payload, slotName)) return payload[slotName];
  const aliases = layout?.slotAliases || {{}};
  for (const [alias, canonical] of Object.entries(aliases)) {{
    if (canonical === slotName && Object.prototype.hasOwnProperty.call(payload, alias)) {{
      return payload[alias];
    }}
  }}
  return undefined;
}}

export function validateSlideContent(type, slideSpec) {{
  const resolvedType = resolveLayoutType(type);
  const layout = resolvedType ? LAYOUTS[resolvedType] : null;
  if (!layout) return {{ valid: false, errors: [`Unknown type: ${{type}}`], warnings: [] }};

  const errors = [];
  const warnings = [];
  const payload = getSlotsPayload(slideSpec);

  const slots = layout.slots || {{}};
  for (const [slotName, slotDef] of Object.entries(slots)) {{
    const value = resolveSlotValue(layout, payload, slotName);
    if (slotDef.required && isMissing(value)) {{
      errors.push(`Missing required slot: ${{slotName}}`);
      continue;
    }}

    if (slotDef.kind === 'table' && value && !Array.isArray(value?.rows) && !Array.isArray(value)) {{
      warnings.push(`Slot "${{slotName}}" expected table-shaped value (rows or 2D array)`);
    }}
    if (slotDef.kind === 'chart' && value && !Array.isArray(value?.series)) {{
      warnings.push(`Slot "${{slotName}}" expected chart value with series[]`);
    }}
  }}

  return {{ valid: errors.length === 0, errors, warnings }};
}}

function normalizeTextArray(value) {{
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map((v) => String(v ?? '')).filter((v) => v.trim().length > 0);
  return [String(value)];
}}

function normalizeColor(value, fallback = '000000') {{
  const c = String(value || '').trim().replace(/^#/, '').toUpperCase();
  return /^[0-9A-F]{{6}}$/.test(c) ? c : fallback;
}}

function isHeadingSlot(layout, slotName) {{
  if (String(slotName).toLowerCase().includes('heading')) return true;
  const aliases = layout?.slotAliases || {{}};
  for (const [alias, canonical] of Object.entries(aliases)) {{
    if (canonical !== slotName) continue;
    if (String(alias).toLowerCase().includes('heading')) return true;
  }}
  return false;
}}

function renderText(slide, box, value, slotName, layout, slotDef) {{
  const style = TOKENS?.textStyles || {{}};
  const layoutStyle = layout?.style || {{}};
  const titleStyle = style.title || {{}};
  const bodyStyle = style.body || {{}};
  const textScaleRaw = Number(TOKENS?.styleOverrides?.textScale ?? 1);
  const textScale = Number.isFinite(textScaleRaw) && textScaleRaw > 0 ? textScaleRaw : 1;

  const items = normalizeTextArray(value);
  if (!items.length) return;

  const isTitle = slotName.includes('title');
  const isSubtitle = slotName.includes('sub');
  const isHeading = isHeadingSlot(layout, slotName);

  const baseStyle = isTitle
    ? titleStyle
    : isSubtitle
      ? {{ ...bodyStyle, ...(style.subtitle || {{}}) }}
      : bodyStyle;

  const slotSource = slotDef?.source || {{}};
  const phType = String(slotSource.phType || '').toLowerCase();
  const isBodyPlaceholder = phType === 'body' || phType === 'obj';
  const resolvedColor = isTitle
    ? normalizeColor(layoutStyle.titleColor || baseStyle.color || TOKENS?.colors?.semantic?.secondary, '00338D')
    : isHeading
      ? normalizeColor(layoutStyle.headingColor || layoutStyle.titleColor || TOKENS?.colors?.semantic?.textLight, 'FFFFFF')
    : isSubtitle
      ? normalizeColor(layoutStyle.subtitleColor || baseStyle.color || TOKENS?.colors?.semantic?.textDark, '000000')
      : normalizeColor(layoutStyle.bodyColor || baseStyle.color || TOKENS?.colors?.semantic?.textDark, '000000');
  const baseSize = Number(baseStyle.fontSize || (isBodyPlaceholder ? 11 : 12));
  const sizeFromLayout = isTitle
    ? Number(layoutStyle.titleFontSize || baseSize)
    : Number(layoutStyle.bodyFontSize || baseSize);
  const fontSize = Math.max(6, sizeFromLayout * textScale);

  if (Array.isArray(value)) {{
    const lines = items.map((line) => `• ${{line}}`).join('\\\\n');
    slide.addText(lines, {{ ...box, fontFace: TOKENS?.fonts?.body || 'Arial', fontSize, color: resolvedColor }});
    return;
  }}

  slide.addText(items.join('\\\\n'), {{
    ...box,
    fontFace: isTitle ? (TOKENS?.fonts?.heading || TOKENS?.fonts?.body || 'Arial') : (TOKENS?.fonts?.body || 'Arial'),
    bold: Boolean(baseStyle.bold),
    italic: Boolean(baseStyle.italic),
    color: resolvedColor,
    fontSize,
  }});
}}

function renderImage(slide, box, value) {{
  if (!value) return;
  if (typeof value === 'string') {{
    if (value.startsWith('data:')) slide.addImage({{ data: value, ...box }});
    else slide.addImage({{ path: value, ...box }});
    return;
  }}
  if (typeof value === 'object') {{
    const data = value.data;
    const path = value.path;
    if (typeof data === 'string') {{
      slide.addImage({{ data, ...box }});
      return;
    }}
    if (typeof path === 'string') {{
      slide.addImage({{ path, ...box }});
      return;
    }}
  }}
}}

function renderTable(slide, box, value) {{
  if (!value) return;

  let headers = [];
  let rows = [];

  if (Array.isArray(value)) {{
    rows = value;
  }} else if (typeof value === 'object') {{
    headers = Array.isArray(value.headers) ? value.headers : [];
    rows = Array.isArray(value.rows) ? value.rows : [];
  }}

  const tableRows = [];
  if (headers.length) tableRows.push(headers.map((h) => ({{ text: String(h ?? '') }})));
  for (const row of rows) {{
    if (!Array.isArray(row)) continue;
    tableRows.push(row.map((cell) => ({{ text: String(cell ?? '') }})));
  }}

  if (!tableRows.length) return;
  slide.addTable(tableRows, {{ ...box, fontFace: TOKENS?.fonts?.body || 'Arial', fontSize: 10 }});
}}

function chartTypeFor(value, pptx) {{
  const requested = String(value?.chartType || value?.type || 'bar').toLowerCase();
  const map = {{
    bar: 'bar',
    column: 'bar',
    line: 'line',
    pie: 'pie',
    doughnut: 'doughnut',
    area: 'area',
    scatter: 'scatter',
    radar: 'radar',
    bubble: 'bubble',
  }};
  const mapped = map[requested] || 'bar';
  return pptx.ChartType?.[mapped] || mapped;
}}

function chartSeries(value) {{
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value.series) && value.series.length) return value.series;
  if (Array.isArray(value.values)) {{
    return [{{
      name: String(value.name || 'Series 1'),
      labels: Array.isArray(value.labels) ? value.labels : value.values.map((_, i) => `Item ${{i + 1}}`),
      values: value.values,
    }}];
  }}
  return [];
}}

function renderChart(slide, box, value, pptx) {{
  const series = chartSeries(value);
  if (!series.length) return;
  const palette = Array.isArray(value?.chartPalette) && value.chartPalette.length
    ? value.chartPalette
    : (Array.isArray(TOKENS?.styleOverrides?.chartPalette) ? TOKENS.styleOverrides.chartPalette : null);
  slide.addChart(chartTypeFor(value, pptx), series, {{
    ...box,
    showLegend: true,
    chartColors: Array.isArray(palette) && palette.length ? palette : undefined,
  }});
}}

function renderSlot(slide, pptx, layout, slotName, slotDef, payload) {{
  const value = resolveSlotValue(layout, payload, slotName);
  if (isMissing(value)) return;

  const box = slotDef?.bbox || {{ x: 1, y: 1, w: 10, h: 1 }};
  const kind = slotDef?.kind || 'text';

  if (kind === 'image') {{
    renderImage(slide, box, value);
    return;
  }}
  if (kind === 'table') {{
    renderTable(slide, box, value);
    return;
  }}
  if (kind === 'chart') {{
    const mergedChartValue = {{
      ...(typeof value === 'object' && value ? value : {{}}),
      chartPalette: layout?.style?.chartPalette,
    }};
    renderChart(slide, box, mergedChartValue, pptx);
    return;
  }}
  renderText(slide, box, value, slotName, layout, slotDef);
}}

function styleMasterName(layout) {{
  const color = normalizeColor(layout?.style?.backgroundColor || TOKENS?.colors?.semantic?.bgLight, 'FFFFFF');
  return `STYLE_BG_${{color}}`;
}}

function defineMasters(pptx) {{
  const bg = TOKENS?.colors?.semantic?.bgLight || 'FFFFFF';
  for (const [masterKey] of Object.entries(MASTERS || {{}})) {{
    pptx.defineSlideMaster({{
      title: masterKey,
      background: {{ color: bg }},
      objects: [],
    }});
  }}

  const styleMasterKeys = new Set();
  for (const layout of Object.values(LAYOUTS || {{}})) {{
    styleMasterKeys.add(styleMasterName(layout));
  }}
  for (const key of styleMasterKeys) {{
    const color = String(key).replace('STYLE_BG_', '') || 'FFFFFF';
    pptx.defineSlideMaster({{
      title: key,
      background: {{ color }},
      objects: [],
    }});
  }}
}}

function applyLayoutDecorations(slide, layout, dims) {{
  const decorations = Array.isArray(layout?.style?.decorations) ? layout.style.decorations : [];
  for (const decoration of decorations) {{
    if (decoration?.kind !== 'gradient') continue;
    const key = decoration?.assetKey;
    const data = ASSETS?.[key];
    if (typeof data !== 'string') continue;

    if (decoration?.placement === 'full') {{
      slide.addImage({{ data, x: 0, y: 0, w: dims.w, h: dims.h }});
      continue;
    }}

    const box = decoration?.bbox;
    if (box && typeof box.x === 'number' && typeof box.y === 'number' && typeof box.w === 'number' && typeof box.h === 'number') {{
      slide.addImage({{ data, x: box.x, y: box.y, w: box.w, h: box.h }});
    }}
  }}
}}

export function generateDeck(deckSpec) {{
  const pptx = new PptxGenJS();
  const dims = TOKENS?.dimensions || {{ w: 13.333, h: 7.5 }};
  pptx.defineLayout({{ name: 'KPMG_NATIVE', width: dims.w, height: dims.h }});
  pptx.layout = 'KPMG_NATIVE';

  if (deckSpec?.metadata) {{
    if (deckSpec.metadata.author) pptx.author = deckSpec.metadata.author;
    if (deckSpec.metadata.company) pptx.company = deckSpec.metadata.company;
    if (deckSpec.metadata.title) pptx.title = deckSpec.metadata.title;
    if (deckSpec.metadata.subject) pptx.subject = deckSpec.metadata.subject;
  }}

  pptx.theme = {{
    headFontFace: TOKENS?.fonts?.heading || TOKENS?.fonts?.body || 'Arial',
    bodyFontFace: TOKENS?.fonts?.body || TOKENS?.fonts?.heading || 'Arial',
  }};

  defineMasters(pptx);

  const slides = Array.isArray(deckSpec?.slides) ? deckSpec.slides : [];
  for (const slideSpec of slides) {{
    const requestedType = slideSpec?.type;
    const resolvedType = resolveLayoutType(requestedType);
    const layout = resolvedType ? LAYOUTS[resolvedType] : null;
    if (!layout) throw new Error(`Unknown type: ${{requestedType}}`);

    const validation = validateSlideContent(resolvedType, slideSpec);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const defaultMaster = layout.master && MASTERS[layout.master] ? layout.master : undefined;
    const preferredMaster = styleMasterName(layout);
    const masterName = preferredMaster || defaultMaster;
    const slide = masterName ? pptx.addSlide({{ masterName }}) : pptx.addSlide();
    const payload = getSlotsPayload(slideSpec);
    applyLayoutDecorations(slide, layout, dims);

    for (const slotName of (layout.slotOrder || Object.keys(layout.slots || {{}}))) {{
      const slotDef = layout.slots?.[slotName];
      if (!slotDef) continue;
      renderSlot(slide, pptx, layout, slotName, slotDef, payload);
    }}

    if (slideSpec.notes) {{
      slide.addNotes(slideSpec.notes);
    }}
  }}

  return pptx;
}}

export default {{
  generateDeck,
  validateSlideContent,
  resolveLayoutType,
  TOKENS,
  ASSETS,
  MASTERS,
  LAYOUTS,
  DETECTED_LAYOUT_SLOTS,
  DETECTED_LAYOUT_GEOMETRY,
}};
"""
