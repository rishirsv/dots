from __future__ import annotations

import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


@dataclass
class MediaRef:
    rid: str
    path: str
    content_type: str = ""


@dataclass
class SlideRef:
    index: int
    xml_path: str
    layout_path: str
    layout_name: str
    media_refs: Dict[str, str] = field(default_factory=dict)  # rId -> path


@dataclass
class LayoutRef:
    xml_path: str
    name: str
    master_path: str
    media_refs: Dict[str, str] = field(default_factory=dict)


@dataclass
class PartGraph:
    presentation_path: str = "ppt/presentation.xml"
    theme_path: str = "ppt/theme/theme1.xml"
    master_path: str = "ppt/slideMasters/slideMaster1.xml"

    layouts: Dict[str, LayoutRef] = field(default_factory=dict)  # path -> LayoutRef
    slides: List[SlideRef] = field(default_factory=list)
    media: Dict[str, MediaRef] = field(default_factory=dict)  # path -> MediaRef

    _theme_xml: Optional[bytes] = None
    _master_xml: Optional[bytes] = None


def _parse_rels(zf: zipfile.ZipFile, rels_path: str) -> Dict[str, Tuple[str, str]]:
    try:
        rels_xml = zf.read(rels_path)
    except KeyError:
        return {}

    root = ET.fromstring(rels_xml)
    out: Dict[str, Tuple[str, str]] = {}
    for rel in root.findall("rel:Relationship", NS):
        rid = rel.get("Id", "")
        rel_type = (rel.get("Type", "") or "").split("/")[-1]
        target = rel.get("Target", "") or ""
        out[rid] = (rel_type, target)
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


def _get_layout_name(zf: zipfile.ZipFile, layout_path: str) -> str:
    try:
        layout_xml = zf.read(layout_path)
        root = ET.fromstring(layout_xml)
        csld = root.find(".//p:cSld", NS)
        if csld is not None and csld.get("name"):
            return csld.get("name") or ""
    except Exception:
        pass
    return layout_path.split("/")[-1].replace(".xml", "")


def build_part_graph(pptx_path: Path) -> PartGraph:
    graph = PartGraph()

    with zipfile.ZipFile(pptx_path, "r") as zf:
        pres_rels = _parse_rels(zf, "ppt/_rels/presentation.xml.rels")

        slide_rids: List[Tuple[str, str]] = []
        for rid, (rel_type, target) in pres_rels.items():
            if rel_type == "slide":
                slide_rids.append((rid, _resolve_path(graph.presentation_path, target)))
            elif rel_type == "slideMaster":
                graph.master_path = _resolve_path(graph.presentation_path, target)
            elif rel_type == "theme":
                graph.theme_path = _resolve_path(graph.presentation_path, target)

        def _rid_num(rid: str) -> int:
            try:
                return int(rid.replace("rId", ""))
            except Exception:
                return 10**9

        slide_rids.sort(key=lambda x: _rid_num(x[0]))

        master_rels = _parse_rels(zf, _rels_path_for_part(graph.master_path))
        for _, (rel_type, target) in master_rels.items():
            if rel_type == "theme":
                graph.theme_path = _resolve_path(graph.master_path, target)
            elif rel_type == "slideLayout":
                layout_path = _resolve_path(graph.master_path, target)
                graph.layouts[layout_path] = LayoutRef(
                    xml_path=layout_path,
                    name=_get_layout_name(zf, layout_path),
                    master_path=graph.master_path,
                )

        for idx, (_, slide_path) in enumerate(slide_rids, start=1):
            slide_rels = _parse_rels(zf, _rels_path_for_part(slide_path))

            layout_path = ""
            media_refs: Dict[str, str] = {}

            for rel_rid, (rel_type, target) in slide_rels.items():
                resolved = _resolve_path(slide_path, target)
                if rel_type == "slideLayout":
                    layout_path = resolved
                elif rel_type in ("image", "audio", "video"):
                    media_refs[rel_rid] = resolved
                    if resolved not in graph.media:
                        graph.media[resolved] = MediaRef(rid=rel_rid, path=resolved)

            layout_name = graph.layouts.get(layout_path, LayoutRef("", "Unknown", "")).name

            graph.slides.append(
                SlideRef(
                    index=idx,
                    xml_path=slide_path,
                    layout_path=layout_path,
                    layout_name=layout_name,
                    media_refs=media_refs,
                )
            )

        graph._theme_xml = zf.read(graph.theme_path)
        graph._master_xml = zf.read(graph.master_path)

    return graph


def get_used_layouts(graph: PartGraph) -> Dict[str, int]:
    usage: Dict[str, int] = {}
    for slide in graph.slides:
        usage[slide.layout_name] = usage.get(slide.layout_name, 0) + 1
    return dict(sorted(usage.items(), key=lambda kv: -kv[1]))

