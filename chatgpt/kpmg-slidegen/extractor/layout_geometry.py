from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .elements import ElementRef, extract_part_elements
from .part_graph import build_part_graph


@dataclass(frozen=True)
class LayoutGeometry:
    """
    Best-effort, template-derived geometry for a slide layout.

    This is intended as an input to code generation for a "code-encoded template".
    """

    layout_name: str
    # Raw extracted elements for debugging / inspection
    elements: List[ElementRef]
    # Normalized slot geometry (inches)
    slots: Dict[str, Any]


def _bbox_dict(el: ElementRef) -> Optional[Dict[str, float]]:
    if not el.bbox:
        return None
    return {"x": el.bbox.x, "y": el.bbox.y, "w": el.bbox.w, "h": el.bbox.h}


def _sort_xy(el: ElementRef) -> Tuple[float, float, str]:
    if el.bbox:
        return (el.bbox.y, el.bbox.x, el.name)
    return (1e9, 1e9, el.name)


def _find_title(elements: List[ElementRef]) -> Optional[ElementRef]:
    titled = [e for e in elements if (e.meta.get("phType") in ("title", "ctrTitle")) and e.bbox]
    if titled:
        return sorted(titled, key=_sort_xy)[0]
    # Fallback: first text element with "title" in name near top.
    candidates = [
        e
        for e in elements
        if e.kind == "text"
        and e.bbox
        and ("title" in e.name.lower())
        and (e.bbox.y <= 2.0)
    ]
    return sorted(candidates, key=_sort_xy)[0] if candidates else None


def _find_subtitle(elements: List[ElementRef]) -> Optional[ElementRef]:
    subs = [e for e in elements if (e.meta.get("phType") == "subTitle") and e.bbox]
    return sorted(subs, key=_sort_xy)[0] if subs else None


def _find_strapline(elements: List[ElementRef], title: Optional[ElementRef]) -> Optional[ElementRef]:
    # Straplines are typically a single short line directly below title.
    if not title or not title.bbox:
        return None
    y0 = title.bbox.y + max(title.bbox.h, 0)
    candidates = [
        e
        for e in elements
        if e.kind == "text"
        and e.bbox
        and (e.bbox.y >= y0 - 0.1)
        and (e.bbox.y <= y0 + 1.0)
        and (e.bbox.h <= 0.8)
        and (e.meta.get("phType") not in ("title", "ctrTitle"))
    ]
    return sorted(candidates, key=_sort_xy)[0] if candidates else None


def _find_body_boxes(elements: List[ElementRef]) -> List[ElementRef]:
    bodies = [e for e in elements if (e.meta.get("phType") in ("body", "obj")) and e.bbox]
    if bodies:
        return sorted(bodies, key=_sort_xy)
    # Fallback to common placeholder naming
    bodies = [
        e
        for e in elements
        if e.kind == "text" and e.bbox and ("text placeholder" in e.name.lower())
    ]
    return sorted(bodies, key=_sort_xy)


def _find_chart_box(elements: List[ElementRef]) -> Optional[ElementRef]:
    charts = [
        e
        for e in elements
        if e.bbox and (e.kind == "chart" or e.meta.get("phType") == "chart")
    ]
    return sorted(charts, key=_sort_xy)[0] if charts else None


def _find_table_box(elements: List[ElementRef]) -> Optional[ElementRef]:
    tables = [
        e
        for e in elements
        if e.bbox and (e.kind == "table" or e.meta.get("phType") == "tbl")
    ]
    return sorted(tables, key=_sort_xy)[0] if tables else None


def _find_picture_box(elements: List[ElementRef]) -> Optional[ElementRef]:
    pics = [
        e
        for e in elements
        if e.bbox
        and (
            e.meta.get("phType") == "pic"
            or ("picture placeholder" in e.name.lower())
        )
    ]
    return sorted(pics, key=_sort_xy)[0] if pics else None


def _find_logo(elements: List[ElementRef]) -> Optional[ElementRef]:
    # Small logo-sized image near the top-left is a common pattern on covers.
    candidates = [
        e
        for e in elements
        if e.kind == "image"
        and e.bbox
        and e.bbox.y <= 1.2
        and e.bbox.x <= 2.0
        and e.bbox.w <= 3.0
        and e.bbox.h <= 1.5
    ]
    return sorted(candidates, key=_sort_xy)[0] if candidates else None


def _find_window_rect(elements: List[ElementRef]) -> Optional[ElementRef]:
    # Large rectangle used as a “window” region (common on divider slides).
    candidates = [
        e
        for e in elements
        if e.kind == "shape"
        and e.bbox
        and e.bbox.w >= 5.0
        and e.bbox.h >= 3.0
        and e.bbox.x <= 2.0
        and (0.5 <= e.bbox.y <= 2.0)
    ]
    return sorted(candidates, key=_sort_xy)[0] if candidates else None


def infer_layout_geometry(layout_name: str, elements: List[ElementRef]) -> LayoutGeometry:
    """
    Infer common slot geometry from a layout's extracted elements.

    This is intentionally heuristic and should be backed by a golden-deck
    visual regression loop.
    """
    title = _find_title(elements)
    subtitle = _find_subtitle(elements)
    strapline = _find_strapline(elements, title)
    body_boxes = _find_body_boxes(elements)
    chart_box = _find_chart_box(elements)
    table_box = _find_table_box(elements)
    pic_box = _find_picture_box(elements)
    logo = _find_logo(elements)
    window = _find_window_rect(elements)

    slots: Dict[str, Any] = {
        "logo": _bbox_dict(logo) if logo else None,
        "window": _bbox_dict(window) if window else None,
        "title": _bbox_dict(title) if title else None,
        "subtitle": _bbox_dict(subtitle) if subtitle else None,
        "strapline": _bbox_dict(strapline) if strapline else None,
        "bodyBoxes": [_bbox_dict(e) for e in body_boxes if _bbox_dict(e)],
        "chart": _bbox_dict(chart_box) if chart_box else None,
        "table": _bbox_dict(table_box) if table_box else None,
        "picture": _bbox_dict(pic_box) if pic_box else None,
    }

    # Convenience derivations for common layouts
    if len(body_boxes) == 2:
        boxes = sorted(body_boxes, key=lambda e: (e.bbox.x if e.bbox else 1e9))
        slots["leftBody"] = _bbox_dict(boxes[0])
        slots["rightBody"] = _bbox_dict(boxes[1])
    elif len(body_boxes) == 1:
        slots["body"] = _bbox_dict(body_boxes[0])

    # 4-column processes / text boxes
    if len(body_boxes) >= 4 and ("4 text boxes" in layout_name.lower() or "process" in layout_name.lower()):
        boxes = sorted(body_boxes, key=lambda e: (e.bbox.x if e.bbox else 1e9))
        slots["columns"] = [_bbox_dict(e) for e in boxes[:4] if _bbox_dict(e)]

    return LayoutGeometry(layout_name=layout_name, elements=sorted(elements, key=_sort_xy), slots=slots)


def extract_all_layout_geometry(pptx_path: Path) -> Dict[str, Dict[str, Any]]:
    """
    Extract inferred layout geometry for all slide layouts in a template PPTX.

    Returns: layout_name -> slots dict
    """
    graph = build_part_graph(pptx_path)
    out: Dict[str, Dict[str, Any]] = {}
    for layout_path, layout_ref in graph.layouts.items():
        elements = extract_part_elements(pptx_path, layout_path)
        out[layout_ref.name] = infer_layout_geometry(layout_ref.name, elements).slots
    return out
