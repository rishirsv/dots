import argparse
import json
import posixpath
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET

EMU_PER_INCH = 914400
CHART_NS = "http://schemas.openxmlformats.org/drawingml/2006/chart"
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "c": CHART_NS,
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


def clean_text(value):
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def preview_text(value, limit=160):
    text = clean_text(value)
    if not text:
        return None
    return text[:limit]


def round_num(value):
    return round(float(value), 6)


def find_slide_target_and_size(zf, slide_number):
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

    size = presentation.find("./p:sldSz", NS)
    slide_size = {
        "widthEmu": int(size.attrib.get("cx", 0)) if size is not None else 0,
        "heightEmu": int(size.attrib.get("cy", 0)) if size is not None else 0,
    }
    slide_size["widthIn"] = emu_to_inches(slide_size["widthEmu"])
    slide_size["heightIn"] = emu_to_inches(slide_size["heightEmu"])

    return ordered[index], slide_size


def load_relationships(zf, slide_target):
    rel_name = posixpath.basename(slide_target)
    rel_path = f"ppt/slides/_rels/{rel_name}.rels"
    if rel_path not in zf.namelist():
        return {}
    rels = ET.fromstring(zf.read(rel_path))
    return {
        rel.attrib.get("Id"): {
            "id": rel.attrib.get("Id"),
            "target": rel.attrib.get("Target"),
            "type": rel.attrib.get("Type"),
        }
        for rel in rels
    }


def extract_transform(node):
    xfrm = node.find("./p:spPr/a:xfrm", NS)
    if xfrm is None:
        xfrm = node.find("./p:xfrm", NS)
    if xfrm is None:
        xfrm = node.find(".//a:xfrm", NS)
    if xfrm is None:
        return None
    off = xfrm.find("a:off", NS)
    ext = xfrm.find("a:ext", NS)
    if off is None or ext is None:
        return None
    x = int(off.attrib.get("x", 0))
    y = int(off.attrib.get("y", 0))
    w = int(ext.attrib.get("cx", 0))
    h = int(ext.attrib.get("cy", 0))
    return {
        "xEmu": x,
        "yEmu": y,
        "wEmu": w,
        "hEmu": h,
        "x": emu_to_inches(x),
        "y": emu_to_inches(y),
        "w": emu_to_inches(w),
        "h": emu_to_inches(h),
    }


def get_nv_props(node):
    for candidate in (
        "./p:nvSpPr/p:cNvPr",
        "./p:nvPicPr/p:cNvPr",
        "./p:nvGraphicFramePr/p:cNvPr",
        "./p:nvCxnSpPr/p:cNvPr",
        "./p:nvGrpSpPr/p:cNvPr",
    ):
        found = node.find(candidate, NS)
        if found is not None:
            return found
    return None


def collect_text(node):
    texts = [
        item.text.strip()
        for item in node.findall(".//a:t", NS)
        if item.text and item.text.strip()
    ]
    return " ".join(texts).strip()


def parse_text_style_hints(node):
    paragraphs = node.findall(".//a:p", NS)
    font_sizes = set()
    alignments = set()
    fonts = set()
    bullet_levels = set()
    bold = False
    italic = False

    for para in paragraphs:
        para_props = para.find("./a:pPr", NS)
        if para_props is not None:
            alignment = clean_text(para_props.attrib.get("algn"))
            if alignment:
                alignments.add(alignment)
            level = para_props.attrib.get("lvl")
            if level is not None:
                bullet_levels.add(int(level))
        run_props = para.findall("./a:r/a:rPr", NS)
        end_props = para.findall("./a:endParaRPr", NS)
        field_props = para.findall("./a:fld/a:rPr", NS)
        for props in [*run_props, *end_props, *field_props]:
            size = props.attrib.get("sz")
            if size is not None:
                font_sizes.add(round_num(int(size) / 100))
            if props.attrib.get("b") == "1":
                bold = True
            if props.attrib.get("i") == "1":
                italic = True
            latin = props.find("./a:latin", NS)
            if latin is not None and clean_text(latin.attrib.get("typeface")):
                fonts.add(clean_text(latin.attrib.get("typeface")))

    return {
        "paragraphCount": len(paragraphs),
        "fontSizes": sorted(font_sizes),
        "fonts": sorted(fonts),
        "bold": bold,
        "italic": italic,
        "alignments": sorted(alignments),
        "bulletLevels": sorted(bullet_levels),
    }


def extract_color_hint(node):
    if node is None:
        return None
    srgb = node.find("./a:srgbClr", NS)
    if srgb is not None:
        return {
            "mode": "srgb",
            "value": srgb.attrib.get("val"),
        }
    scheme = node.find("./a:schemeClr", NS)
    if scheme is not None:
        return {
            "mode": "scheme",
            "value": scheme.attrib.get("val"),
        }
    preset = node.find("./a:prstClr", NS)
    if preset is not None:
        return {
            "mode": "preset",
            "value": preset.attrib.get("val"),
        }
    return None


def parse_fill_hints(node):
    sp_pr = node.find("./p:spPr", NS)
    if sp_pr is None:
        return None
    if sp_pr.find("./a:noFill", NS) is not None:
        return {"type": "none"}
    solid = sp_pr.find("./a:solidFill", NS)
    if solid is not None:
        return {
            "type": "solid",
            "color": extract_color_hint(solid),
        }
    grad = sp_pr.find("./a:gradFill", NS)
    if grad is not None:
        return {"type": "gradient"}
    patt = sp_pr.find("./a:pattFill", NS)
    if patt is not None:
        return {"type": "pattern"}
    return None


def parse_line_hints(node):
    sp_pr = node.find("./p:spPr", NS)
    if sp_pr is None:
        return None
    line = sp_pr.find("./a:ln", NS)
    if line is None:
        return None
    if line.find("./a:noFill", NS) is not None:
        return {"type": "none"}
    dash = line.find("./a:prstDash", NS)
    solid = line.find("./a:solidFill", NS)
    return {
        "type": "line",
        "widthPt": round_num(int(line.attrib.get("w", 0)) / 12700) if line.attrib.get("w") else None,
        "color": extract_color_hint(solid) if solid is not None else None,
        "dash": clean_text(dash.attrib.get("val")) if dash is not None else None,
    }


def shape_subtype(node, tag):
    prst_geom = node.find(".//a:prstGeom", NS)
    if prst_geom is not None and clean_text(prst_geom.attrib.get("prst")):
        return clean_text(prst_geom.attrib.get("prst"))
    if tag == "graphicFrame":
        graphic_data = node.find(".//a:graphicData", NS)
        if graphic_data is not None:
            return clean_text(graphic_data.attrib.get("uri"))
    return None


def classify_graphic_frame(node, relationships):
    graphic_data = node.find(".//a:graphicData", NS)
    if graphic_data is None:
        return "graphicFrame", None
    uri = graphic_data.attrib.get("uri", "")
    if "chart" in uri:
        chart = node.find(".//c:chart", NS)
        rel_id = chart.attrib.get(qname("r:id")) if chart is not None else None
        return "chart", relationships.get(rel_id)
    if "table" in uri:
        return "table", None
    return "graphicFrame", None


def classify_element(node, tag, relationships):
    if tag == "pic":
        blip = node.find(".//a:blip", NS)
        rel_id = blip.attrib.get(qname("r:embed")) if blip is not None else None
        return "image", relationships.get(rel_id)
    if tag == "graphicFrame":
        return classify_graphic_frame(node, relationships)
    if tag == "cxnSp":
        return "connector", None
    if tag == "sp":
        text = collect_text(node)
        return ("text" if text else "shape"), None
    return tag, None


def parse_relationship_stub(node, relationships, kind, relationship):
    image_stub = None
    chart_stub = None
    if kind == "image":
        image_stub = {
            "target": relationship.get("target") if relationship else None,
            "relationshipType": relationship.get("type") if relationship else None,
        }
    if kind == "chart":
        chart_stub = {
            "target": relationship.get("target") if relationship else None,
            "relationshipType": relationship.get("type") if relationship else None,
            "embeddedWorkbookTarget": None,
        }
    return {
        "image": image_stub,
        "chart": chart_stub,
    }


def build_element_record(node, tag, relationships, z_order, group_path):
    box = extract_transform(node)
    if box is None:
        return None

    nv = get_nv_props(node)
    element_id = clean_text(nv.attrib.get("id")) if nv is not None else None
    name = clean_text(nv.attrib.get("name")) if nv is not None else None
    kind, relationship = classify_element(node, tag, relationships)
    text = collect_text(node)

    return {
        "id": element_id,
        "name": name,
        "xmlTag": tag,
        "kind": kind,
        "shapeSubtype": shape_subtype(node, tag),
        "bbox": box,
        "zOrder": z_order,
        "groupPath": group_path,
        "groupMembership": {
            "ids": [entry["id"] for entry in group_path if entry.get("id")],
            "names": [entry["name"] for entry in group_path if entry.get("name")],
        },
        "textPreview": preview_text(text),
        "textStyleHints": parse_text_style_hints(node),
        "fillHints": parse_fill_hints(node),
        "lineHints": parse_line_hints(node),
        "relationship": relationship,
        "relationshipStubs": parse_relationship_stub(node, relationships, kind, relationship),
    }


def walk_elements(parent, relationships, group_path, z_state, out):
    for child in list(parent):
        tag = child.tag.split("}", 1)[-1]
        if tag in ("nvGrpSpPr", "grpSpPr", "extLst"):
            continue
        if tag == "grpSp":
            group_nv = get_nv_props(child)
            next_group_path = [
                *group_path,
                {
                    "id": clean_text(group_nv.attrib.get("id")) if group_nv is not None else None,
                    "name": clean_text(group_nv.attrib.get("name")) if group_nv is not None else None,
                },
            ]
            walk_elements(child, relationships, next_group_path, z_state, out)
            continue

        z_state["value"] += 1
        element = build_element_record(child, tag, relationships, z_state["value"], group_path)
        if element is not None:
            out.append(element)


def normalize_element(element):
    return {
        "id": element.get("id"),
        "name": element.get("name"),
        "kind": element.get("kind"),
        "shapeSubtype": element.get("shapeSubtype"),
        "bbox": {
            "x": element["bbox"]["x"],
            "y": element["bbox"]["y"],
            "w": element["bbox"]["w"],
            "h": element["bbox"]["h"],
        },
        "zOrder": element.get("zOrder"),
        "groupPath": element.get("groupPath"),
        "groupMembership": element.get("groupMembership"),
        "textPreview": element.get("textPreview"),
        "textStyleHints": element.get("textStyleHints"),
        "fillHints": element.get("fillHints"),
        "lineHints": element.get("lineHints"),
        "relationshipStubs": element.get("relationshipStubs"),
    }


def summarize(elements):
    kinds = Counter(element["kind"] for element in elements)
    grouped = sum(1 for element in elements if element.get("groupPath"))
    return {
        "elementCount": len(elements),
        "text": kinds.get("text", 0),
        "shape": kinds.get("shape", 0),
        "image": kinds.get("image", 0),
        "chart": kinds.get("chart", 0),
        "table": kinds.get("table", 0),
        "connector": kinds.get("connector", 0),
        "graphicFrame": kinds.get("graphicFrame", 0),
        "other": sum(
            count for kind, count in kinds.items() if kind not in {
                "text",
                "shape",
                "image",
                "chart",
                "table",
                "connector",
                "graphicFrame",
            }
        ),
        "groupedElementCount": grouped,
    }


def detect_repeated_cards(elements):
    buckets = Counter()
    for element in elements:
        bbox = element.get("bbox", {})
        if element.get("kind") not in ("text", "shape", "image"):
            continue
        if bbox.get("w", 0) < 0.6 or bbox.get("h", 0) < 0.4:
            continue
        key = (round(bbox.get("w", 0), 1), round(bbox.get("h", 0), 1))
        buckets[key] += 1
    counts = [count for count in buckets.values() if count >= 2]
    return max(counts) if counts else 0


def build_fingerprint(slide_size, elements):
    title_band = any(
        element.get("kind") == "text"
        and element["bbox"]["y"] <= 1.2
        and element["bbox"]["w"] >= slide_size["widthIn"] * 0.45
        for element in elements
    )
    strapline = any(
        element.get("kind") == "text"
        and 0.7 <= element["bbox"]["y"] <= 2.0
        and element["bbox"]["h"] <= 0.7
        and element["bbox"]["w"] >= slide_size["widthIn"] * 0.25
        for element in elements
    )
    text_regions = sum(1 for element in elements if element.get("textPreview"))
    icon_count = sum(
        1
        for element in elements
        if element.get("kind") == "image"
        and element["bbox"]["w"] <= 1.1
        and element["bbox"]["h"] <= 1.1
    )
    connector_count = sum(1 for element in elements if element.get("kind") == "connector")
    repeated_card_count = detect_repeated_cards(elements)

    likely = []
    if repeated_card_count >= 4 and connector_count == 0:
        likely.append("bulletRows")
        likely.append("cards")
    if connector_count >= 2 and repeated_card_count >= 3:
        likely.append("processRail")
        likely.append("principleChain")
    if connector_count >= 1 and repeated_card_count >= 2:
        likely.append("framework")
    if title_band and text_regions >= 3 and repeated_card_count >= 3:
        likely.append("stages")

    return {
        "schemaVersion": 1,
        "hasTitleBand": title_band,
        "hasStrapline": strapline,
        "majorTextRegions": text_regions,
        "repeatedCardCount": repeated_card_count,
        "iconCount": icon_count,
        "connectorCount": connector_count,
        "likelyPrimitiveCandidates": likely,
    }


def extract_slide_evidence(zf, slide_target):
    slide_path = f"ppt/{slide_target}"
    slide_xml = ET.fromstring(zf.read(slide_path))
    relationships = load_relationships(zf, slide_target)
    sp_tree = slide_xml.find(".//p:spTree", NS)
    if sp_tree is None:
        return []
    elements = []
    walk_elements(sp_tree, relationships, [], {"value": 0}, elements)
    return elements


def write_json(path_value, payload):
    if not path_value:
        return
    out_path = Path(path_value)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Extract onboarding slide evidence from a PPTX")
    parser.add_argument("--pptx", required=True)
    parser.add_argument("--slide", required=True, type=int)
    parser.add_argument("--out")
    parser.add_argument("--raw-out")
    parser.add_argument("--normalized-out")
    parser.add_argument("--fingerprint-out")
    args = parser.parse_args()

    pptx_path = Path(args.pptx)
    if not pptx_path.exists():
        raise SystemExit(f"Missing PPTX: {pptx_path}")

    with zipfile.ZipFile(pptx_path, "r") as zf:
        slide_target, slide_size = find_slide_target_and_size(zf, args.slide)
        elements = extract_slide_evidence(zf, slide_target)

    raw_output = {
        "schemaVersion": 2,
        "sourcePptxPath": str(pptx_path),
        "slideNumber": args.slide,
        "slideTarget": slide_target,
        "slideSize": slide_size,
        "summary": summarize(elements),
        "elements": elements,
    }
    normalized_elements = [normalize_element(element) for element in elements]
    normalized_output = {
        "schemaVersion": 2,
        "sourcePptxPath": str(pptx_path),
        "slideNumber": args.slide,
        "slideTarget": slide_target,
        "slideSize": {
            "width": slide_size["widthIn"],
            "height": slide_size["heightIn"],
            "unit": "in",
        },
        "summary": summarize(normalized_elements),
        "elements": normalized_elements,
    }
    fingerprint = build_fingerprint(
        {
            "widthIn": slide_size["widthIn"],
            "heightIn": slide_size["heightIn"],
        },
        normalized_elements,
    )

    write_json(args.raw_out, raw_output)
    write_json(args.normalized_out, normalized_output)
    write_json(args.fingerprint_out, fingerprint)
    if args.out:
        write_json(args.out, normalized_output)


if __name__ == "__main__":
    main()
