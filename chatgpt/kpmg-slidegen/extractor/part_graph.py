from __future__ import annotations

import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from .geometry import emu_to_inches

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
class MasterRef:
    xml_path: str
    name: str
    theme_path: str
    layout_paths: List[str] = field(default_factory=list)
    media_refs: Dict[str, str] = field(default_factory=dict)


@dataclass
class PartGraph:
    presentation_path: str = "ppt/presentation.xml"
    theme_path: str = "ppt/theme/theme1.xml"
    master_path: str = "ppt/slideMasters/slideMaster1.xml"

    # Dynamic slide size discovered from ppt/presentation.xml (inches + raw EMU).
    slide_dimensions: Dict[str, float] = field(default_factory=lambda: {"w": 13.333, "h": 7.5})
    slide_size_emu: Dict[str, int] = field(default_factory=lambda: {"cx": 12192000, "cy": 6858000})

    masters: Dict[str, MasterRef] = field(default_factory=dict)  # path -> MasterRef
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


def _get_master_name(zf: zipfile.ZipFile, master_path: str) -> str:
    try:
        master_xml = zf.read(master_path)
        root = ET.fromstring(master_xml)
        csld = root.find(".//p:cSld", NS)
        if csld is not None and csld.get("name"):
            return csld.get("name") or ""
    except Exception:
        pass
    return master_path.split("/")[-1].replace(".xml", "")


def _parse_slide_dimensions(zf: zipfile.ZipFile, presentation_path: str) -> Tuple[Dict[str, float], Dict[str, int]]:
    defaults_in = {"w": 13.333, "h": 7.5}
    defaults_emu = {"cx": 12192000, "cy": 6858000}
    try:
        root = ET.fromstring(zf.read(presentation_path))
    except Exception:
        return defaults_in, defaults_emu

    sld_sz = root.find(".//p:sldSz", NS)
    if sld_sz is None:
        return defaults_in, defaults_emu

    try:
        cx = int(sld_sz.get("cx", str(defaults_emu["cx"])))
        cy = int(sld_sz.get("cy", str(defaults_emu["cy"])))
        return {"w": emu_to_inches(cx), "h": emu_to_inches(cy)}, {"cx": cx, "cy": cy}
    except Exception:
        return defaults_in, defaults_emu


def _rid_num(rid: str) -> int:
    try:
        return int(rid.replace("rId", ""))
    except Exception:
        return 10**9


def _sorted_rel_items(rels: Dict[str, Tuple[str, str]]) -> List[Tuple[str, Tuple[str, str]]]:
    return sorted(rels.items(), key=lambda item: _rid_num(item[0]))


def build_part_graph(pptx_path: Path) -> PartGraph:
    graph = PartGraph()

    with zipfile.ZipFile(pptx_path, "r") as zf:
        graph.slide_dimensions, graph.slide_size_emu = _parse_slide_dimensions(zf, graph.presentation_path)

        pres_rels = _parse_rels(zf, "ppt/_rels/presentation.xml.rels")

        slide_rids: List[Tuple[str, str]] = []
        master_rids: List[Tuple[str, str]] = []

        for rid, (rel_type, target) in _sorted_rel_items(pres_rels):
            resolved = _resolve_path(graph.presentation_path, target)
            if rel_type == "slide":
                slide_rids.append((rid, resolved))
            elif rel_type == "slideMaster":
                master_rids.append((rid, resolved))
            elif rel_type == "theme":
                graph.theme_path = resolved

        if master_rids:
            graph.master_path = master_rids[0][1]

        for _, master_path in master_rids:
            master_rels = _parse_rels(zf, _rels_path_for_part(master_path))
            theme_path = graph.theme_path
            layout_paths: List[str] = []
            master_media_refs: Dict[str, str] = {}

            for rel_rid, (rel_type, target) in _sorted_rel_items(master_rels):
                resolved = _resolve_path(master_path, target)
                if rel_type == "theme":
                    theme_path = resolved
                elif rel_type == "slideLayout":
                    layout_paths.append(resolved)
                elif rel_type in ("image", "audio", "video"):
                    master_media_refs[rel_rid] = resolved
                    if resolved not in graph.media:
                        graph.media[resolved] = MediaRef(rid=rel_rid, path=resolved)

            graph.masters[master_path] = MasterRef(
                xml_path=master_path,
                name=_get_master_name(zf, master_path),
                theme_path=theme_path,
                layout_paths=layout_paths,
                media_refs=master_media_refs,
            )

            if master_path == graph.master_path:
                graph.theme_path = theme_path

            for layout_path in layout_paths:
                layout_media_refs: Dict[str, str] = {}
                layout_rels = _parse_rels(zf, _rels_path_for_part(layout_path))
                for rel_rid, (rel_type, target) in _sorted_rel_items(layout_rels):
                    if rel_type not in ("image", "audio", "video"):
                        continue
                    resolved = _resolve_path(layout_path, target)
                    layout_media_refs[rel_rid] = resolved
                    if resolved not in graph.media:
                        graph.media[resolved] = MediaRef(rid=rel_rid, path=resolved)

                graph.layouts[layout_path] = LayoutRef(
                    xml_path=layout_path,
                    name=_get_layout_name(zf, layout_path),
                    master_path=master_path,
                    media_refs=layout_media_refs,
                )

        # Legacy fallback if the package omits explicit master rels.
        if not graph.masters:
            graph.masters[graph.master_path] = MasterRef(
                xml_path=graph.master_path,
                name=_get_master_name(zf, graph.master_path),
                theme_path=graph.theme_path,
                layout_paths=[],
            )

        for idx, (_, slide_path) in enumerate(sorted(slide_rids, key=lambda item: _rid_num(item[0])), start=1):
            slide_rels = _parse_rels(zf, _rels_path_for_part(slide_path))

            layout_path = ""
            media_refs: Dict[str, str] = {}

            for rel_rid, (rel_type, target) in _sorted_rel_items(slide_rels):
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

        try:
            graph._theme_xml = zf.read(graph.theme_path)
        except KeyError:
            graph._theme_xml = None

        try:
            graph._master_xml = zf.read(graph.master_path)
        except KeyError:
            graph._master_xml = None

    return graph


def get_used_layouts(graph: PartGraph) -> Dict[str, int]:
    usage: Dict[str, int] = {}
    for slide in graph.slides:
        usage[slide.layout_name] = usage.get(slide.layout_name, 0) + 1
    return dict(sorted(usage.items(), key=lambda kv: -kv[1]))
