import argparse
import json
import posixpath
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

EMU_PER_INCH = 914400
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def emu_to_inches(value):
    return round(int(value) / EMU_PER_INCH, 6)


def qname(tag):
    if ":" not in tag:
        return tag
    prefix, name = tag.split(":", 1)
    return f"{{{NS[prefix]}}}{name}"


def find_slide_target(zf, slide_number):
    presentation = ET.fromstring(zf.read("ppt/presentation.xml"))
    rels = ET.fromstring(zf.read("ppt/_rels/presentation.xml.rels"))
    rel_by_id = {
        rel.attrib.get("Id"): rel.attrib.get("Target")
        for rel in rels
        if rel.attrib.get("Target", "").startswith("slides/")
    }
    ordered = []
    for slide_id in presentation.findall(".//p:sldIdLst/p:sldId", NS):
        rel_id = slide_id.attrib.get(qname("r:id"))
        target = rel_by_id.get(rel_id)
        if target:
            ordered.append(target)
    index = slide_number - 1
    if index < 0 or index >= len(ordered):
        raise ValueError(f"Slide {slide_number} is out of range for this PPTX")
    return ordered[index]


def load_relationships(zf, slide_target):
    rel_name = posixpath.basename(slide_target)
    rel_path = f"ppt/slides/_rels/{rel_name}.rels"
    if rel_path not in zf.namelist():
        return {}
    rels = ET.fromstring(zf.read(rel_path))
    return {
        rel.attrib.get("Id"): {
            "target": rel.attrib.get("Target"),
            "type": rel.attrib.get("Type"),
        }
        for rel in rels
    }


def extract_transform(node):
    xfrm = node.find(".//a:xfrm", NS)
    if xfrm is None:
        return None
    off = xfrm.find("a:off", NS)
    ext = xfrm.find("a:ext", NS)
    if off is None or ext is None:
        return None
    return {
        "x": emu_to_inches(off.attrib.get("x", 0)),
        "y": emu_to_inches(off.attrib.get("y", 0)),
        "w": emu_to_inches(ext.attrib.get("cx", 0)),
        "h": emu_to_inches(ext.attrib.get("cy", 0)),
    }


def collect_text(node):
    texts = [item.text.strip() for item in node.findall(".//a:t", NS) if item.text and item.text.strip()]
    return " ".join(texts).strip()


def classify_graphic_frame(node, relationships):
    graphic_data = node.find(".//a:graphicData", NS)
    if graphic_data is None:
      return "graphicFrame", None
    uri = graphic_data.attrib.get("uri", "")
    if "chart" in uri:
        chart = node.find(".//c:chart", {
            **NS,
            "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
        })
        rel_id = chart.attrib.get(qname("r:id")) if chart is not None else None
        return "chart", relationships.get(rel_id)
    if "table" in uri:
        return "table", None
    return "graphicFrame", None


def extract_elements(zf, slide_target):
    slide_path = f"ppt/{slide_target}"
    slide_xml = ET.fromstring(zf.read(slide_path))
    relationships = load_relationships(zf, slide_target)
    elements = []

    sp_tree = slide_xml.find(".//p:spTree", NS)
    if sp_tree is None:
        return elements

    for child in list(sp_tree):
        tag = child.tag.split("}", 1)[-1]
        box = extract_transform(child)
        if box is None:
            continue

        element = {
            "kind": "shape",
            "box": box,
            "name": None,
            "id": None,
            "textPreview": None,
            "relationship": None,
        }

        nv = child.find("./p:nvSpPr/p:cNvPr", NS) or child.find("./p:nvPicPr/p:cNvPr", NS) or child.find("./p:nvGraphicFramePr/p:cNvPr", NS)
        if nv is not None:
            element["name"] = nv.attrib.get("name")
            element["id"] = nv.attrib.get("id")

        if tag == "sp":
            text = collect_text(child)
            element["kind"] = "text" if text else "shape"
            element["textPreview"] = text[:160] if text else None
        elif tag == "pic":
            element["kind"] = "image"
            blip = child.find(".//a:blip", NS)
            rel_id = blip.attrib.get(qname("r:embed")) if blip is not None else None
            element["relationship"] = relationships.get(rel_id)
        elif tag == "graphicFrame":
            kind, rel = classify_graphic_frame(child, relationships)
            element["kind"] = kind
            element["relationship"] = rel
            element["textPreview"] = collect_text(child)[:160] or None
        else:
            element["kind"] = tag

        elements.append(element)

    return elements


def summarize(elements):
    out = {
        "shapeCount": len(elements),
        "text": 0,
        "image": 0,
        "chart": 0,
        "table": 0,
        "graphicFrame": 0,
        "other": 0,
    }
    for element in elements:
        kind = element["kind"]
        if kind in out:
            out[kind] += 1
        elif kind in ("shape",):
            out["other"] += 1
        else:
            out["other"] += 1
    return out


def main():
    parser = argparse.ArgumentParser(description="Extract a minimal PPTX slide geometry seed")
    parser.add_argument("--pptx", required=True)
    parser.add_argument("--slide", required=True, type=int)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    pptx_path = Path(args.pptx)
    if not pptx_path.exists():
        raise SystemExit(f"Missing PPTX: {pptx_path}")

    with zipfile.ZipFile(pptx_path, "r") as zf:
        slide_target = find_slide_target(zf, args.slide)
        elements = extract_elements(zf, slide_target)

    output = {
        "schemaVersion": 1,
        "sourcePptxPath": str(pptx_path),
        "slideNumber": args.slide,
        "slideTarget": slide_target,
        "summary": summarize(elements),
        "elements": elements,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
