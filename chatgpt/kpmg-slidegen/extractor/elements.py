from __future__ import annotations

import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from .geometry import BBox, Transform, compose_group_transform, parse_xfrm_bbox

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


@dataclass(frozen=True)
class ElementRef:
    kind: str  # "shape" | "text" | "image" | "table" | "chart" | ...
    name: str
    bbox: Optional[BBox]
    rid: Optional[str] = None
    target: Optional[str] = None
    text: Optional[str] = None
    meta: Dict[str, str] = field(default_factory=dict)


def _parse_rels(zf: zipfile.ZipFile, rels_path: str) -> Dict[str, str]:
    try:
        rels_xml = zf.read(rels_path)
    except KeyError:
        return {}

    root = ET.fromstring(rels_xml)
    out: Dict[str, str] = {}
    for rel in root.findall("rel:Relationship", NS):
        rid = rel.get("Id", "") or ""
        target = rel.get("Target", "") or ""
        if rid:
            out[rid] = target
    return out


def _resolve_path(base_path: str, target: str) -> str:
    if target.startswith("/"):
        return target[1:]

    base_dir = "/".join(base_path.split("/")[:-1])
    parts = (base_dir + "/" + target).split("/")
    resolved: List[str] = []
    for part in parts:
        if part == "..":
            if resolved:
                resolved.pop()
            continue
        if part in ("", "."):
            continue
        resolved.append(part)
    return "/".join(resolved)


def _rels_path_for_part(part_path: str) -> str:
    folder = "/".join(part_path.split("/")[:-1])
    filename = part_path.split("/")[-1]
    return f"{folder}/_rels/{filename}.rels"


def _text_from_tx_body(tx_body_el: ET.Element) -> str:
    # Collect paragraph text, preserving line breaks.
    paras: List[str] = []
    for p_el in tx_body_el.findall(".//a:p", NS):
        # Preserve run ordering by iterating the paragraph tree and collecting a:t nodes.
        parts: List[str] = []
        for t_el in p_el.iterfind(".//a:t", NS):
            if t_el.text:
                parts.append(t_el.text)
        paras.append("".join(parts).strip())
    return "\n".join([p for p in paras if p])


def _shape_name(sp_el: ET.Element) -> str:
    c_nv = sp_el.find(".//p:nvSpPr/p:cNvPr", NS)
    if c_nv is not None and c_nv.get("name"):
        return c_nv.get("name") or "shape"
    return "shape"


def _pic_name(pic_el: ET.Element) -> str:
    c_nv = pic_el.find(".//p:nvPicPr/p:cNvPr", NS)
    if c_nv is not None and c_nv.get("name"):
        return c_nv.get("name") or "image"
    return "image"


def _graphic_frame_name(gf_el: ET.Element) -> str:
    c_nv = gf_el.find(".//p:nvGraphicFramePr/p:cNvPr", NS)
    if c_nv is not None and c_nv.get("name"):
        return c_nv.get("name") or "graphicFrame"
    return "graphicFrame"


def _name_is_chart(name: Optional[str]) -> bool:
    if not name:
        return False
    return "chart" in name.lower()


def _xfrm_bbox_for_element(el: ET.Element) -> Optional[BBox]:
    # Most shapes/pictures use a:xfrm; graphicFrames use p:xfrm.
    xfrm = el.find(".//a:xfrm", NS) or el.find(".//p:xfrm", NS)
    return parse_xfrm_bbox(xfrm)


def _placeholder_info(el: ET.Element, *, kind: str) -> Dict[str, str]:
    """
    Best-effort extraction of placeholder metadata from non-visual properties.

    `kind` is one of: 'sp' | 'pic' | 'graphicFrame'
    """
    if kind == "sp":
        ph = el.find(".//p:nvSpPr/p:nvPr/p:ph", NS)
    elif kind == "pic":
        ph = el.find(".//p:nvPicPr/p:nvPr/p:ph", NS)
    else:
        ph = el.find(".//p:nvGraphicFramePr/p:nvPr/p:ph", NS)

    if ph is None:
        return {}

    meta: Dict[str, str] = {"source": "placeholder"}
    ph_type = (ph.get("type") or "").strip()
    ph_idx = (ph.get("idx") or "").strip()
    if ph_type:
        meta["phType"] = ph_type
    if ph_idx:
        meta["phIdx"] = ph_idx
    return meta


def _extract_sp(sp_el: ET.Element, transform: Transform) -> ElementRef:
    bbox = _xfrm_bbox_for_element(sp_el)
    bbox = transform.apply_bbox(bbox) if bbox else None

    name = _shape_name(sp_el)
    meta = _placeholder_info(sp_el, kind="sp")
    ph_type = meta.get("phType")

    # Some templates represent placeholder regions as shapes with text; use phType
    # to classify the region for downstream geometry mapping.
    if ph_type == "chart" or _name_is_chart(name):
        return ElementRef(kind="chart", name=name, bbox=bbox, meta=meta)
    if ph_type == "pic":
        return ElementRef(kind="image", name=name, bbox=bbox, meta=meta)
    if ph_type == "tbl":
        return ElementRef(kind="table", name=name, bbox=bbox, meta=meta)

    tx_body = sp_el.find(".//p:txBody", NS)
    if tx_body is not None:
        text = _text_from_tx_body(tx_body)
        if text:
            return ElementRef(kind="text", name=name, bbox=bbox, text=text, meta=meta)

    return ElementRef(kind="shape", name=name, bbox=bbox, meta=meta)


def _extract_pic(pic_el: ET.Element, transform: Transform, rels: Dict[str, str], base_path: str) -> ElementRef:
    bbox = _xfrm_bbox_for_element(pic_el)
    bbox = transform.apply_bbox(bbox) if bbox else None

    c_nv = pic_el.find(".//p:nvPicPr/p:cNvPr", NS)
    name = _pic_name(pic_el)
    descr = c_nv.get("descr") if c_nv is not None else None
    meta = _placeholder_info(pic_el, kind="pic")

    blip = pic_el.find(".//a:blip", NS)
    rid = blip.get(f"{{{NS['r']}}}embed") if blip is not None else None
    target = None
    if rid and rid in rels:
        target = _resolve_path(base_path, rels[rid])

    if _name_is_chart(name) or _name_is_chart(descr):
        return ElementRef(
            kind="chart",
            name=name,
            bbox=bbox,
            rid=rid,
            target=target,
            meta={**meta, "source": "image"},
        )

    return ElementRef(kind="image", name=name, bbox=bbox, rid=rid, target=target, meta=meta)


def _extract_graphic_frame(gf_el: ET.Element, transform: Transform, rels: Dict[str, str], base_path: str) -> ElementRef:
    bbox = _xfrm_bbox_for_element(gf_el)
    bbox = transform.apply_bbox(bbox) if bbox else None
    meta = _placeholder_info(gf_el, kind="graphicFrame")

    has_table = gf_el.find(".//a:tbl", NS) is not None
    if has_table:
        return ElementRef(kind="table", name=_graphic_frame_name(gf_el), bbox=bbox, meta=meta)

    chart_el = gf_el.find(".//c:chart", NS)
    if chart_el is not None:
        rid = chart_el.get(f"{{{NS['r']}}}id")
        target = _resolve_path(base_path, rels[rid]) if rid and rid in rels else None
        return ElementRef(
            kind="chart",
            name=_graphic_frame_name(gf_el),
            bbox=bbox,
            rid=rid,
            target=target,
            meta={**meta, "source": "chart"},
        )

    name = _graphic_frame_name(gf_el)
    if _name_is_chart(name):
        return ElementRef(
            kind="chart",
            name=name,
            bbox=bbox,
            meta={**meta, "source": "placeholder"},
        )

    # Charts live in a separate namespace; treat as generic graphic frame.
    return ElementRef(kind="graphicFrame", name=name, bbox=bbox, meta=meta)


def _compose(parent: Transform, child: Transform) -> Transform:
    # parent(child(x)) => off_total = parent.off + child.off * parent.scale
    return Transform(
        off_x=parent.off_x + child.off_x * parent.scale_x,
        off_y=parent.off_y + child.off_y * parent.scale_y,
        scale_x=parent.scale_x * child.scale_x,
        scale_y=parent.scale_y * child.scale_y,
        rotation_deg=parent.rotation_deg + child.rotation_deg,
    )


def _iter_shape_tree(container_el: ET.Element, parent_t: Transform) -> Iterable[Tuple[ET.Element, Transform]]:
    """
    Yield (element, transform) for shapes under a container (<p:spTree> or <p:grpSp>).
    """
    for child in list(container_el):
        tag = child.tag.split("}")[-1]
        if tag == "grpSp":
            grp_xfrm = child.find("./p:grpSpPr/a:xfrm", NS) or child.find(".//p:grpSpPr/a:xfrm", NS)
            grp_t = compose_group_transform(grp_xfrm)
            composed = _compose(parent_t, grp_t)
            yield from _iter_shape_tree(child, composed)
            continue

        if tag in ("sp", "pic", "graphicFrame"):
            yield child, parent_t


def extract_part_elements(pptx_path: Path, part_path: str) -> List[ElementRef]:
    """
    Extract elements from a slide or slideLayout XML part.

    For slides, resolves image relationships to ppt/media paths.
    """
    out: List[ElementRef] = []
    with zipfile.ZipFile(pptx_path, "r") as zf:
        xml = zf.read(part_path)
        root = ET.fromstring(xml)

        rels = _parse_rels(zf, _rels_path_for_part(part_path))

        sp_tree = root.find(".//p:cSld/p:spTree", NS)
        if sp_tree is None:
            return []

        for el, t in _iter_shape_tree(sp_tree, Transform()):
            tag = el.tag.split("}")[-1]
            if tag == "sp":
                out.append(_extract_sp(el, t))
            elif tag == "pic":
                out.append(_extract_pic(el, t, rels, part_path))
            elif tag == "graphicFrame":
                out.append(_extract_graphic_frame(el, t, rels, part_path))

    return out
