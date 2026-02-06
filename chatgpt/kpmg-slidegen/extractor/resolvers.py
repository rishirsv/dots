# resolvers.py
import re
import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional, Tuple

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

NS_REL = {
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}

HEX_RE = re.compile(r"^[0-9A-Fa-f]{6}$")


def _upper_hex(s: str) -> str:
    return s.upper()


def _is_hex6(s: str) -> bool:
    return bool(HEX_RE.match(s or ""))


def _read_xml(root_bytes: bytes) -> ET.Element:
    return ET.fromstring(root_bytes)


def _parse_package_rels(xml_bytes: bytes) -> Dict[str, Tuple[str, str]]:
    """
    Parse a package-level .rels file (e.g., ppt/_rels/presentation.xml.rels).

    Returns {rId: (Type, Target)}.
    """
    root = ET.fromstring(xml_bytes)
    out: Dict[str, Tuple[str, str]] = {}
    for rel in root.findall("rel:Relationship", NS_REL):
        rid = rel.get("Id", "") or ""
        rtype = rel.get("Type", "") or ""
        target = rel.get("Target", "") or ""
        if rid:
            out[rid] = (rtype, target)
    return out


def _resolve_path(base_path: str, target: str) -> str:
    if target.startswith("/"):
        return target[1:]

    base_dir = "/".join(base_path.split("/")[:-1])
    parts = (base_dir + "/" + target).split("/")
    resolved = []
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


def _read_first(zf: zipfile.ZipFile, paths: Tuple[str, ...]) -> Tuple[str, bytes]:
    last_err: Optional[Exception] = None
    for p in paths:
        try:
            return p, zf.read(p)
        except KeyError as e:
            last_err = e
    raise KeyError(f"None of these paths exist in PPTX: {paths!r}") from last_err


def _extract_color_from_scheme_child(el: ET.Element) -> Optional[str]:
    """
    Given a clrScheme child (e.g., <a:dk1>), return the best 6-hex we can.
    Prefers <a:srgbClr val="...">, falls back to <a:sysClr lastClr="...">.
    """
    srgb = el.find("a:srgbClr", NS)
    if srgb is not None and srgb.get("val"):
        return _upper_hex(srgb.get("val"))
    sysc = el.find("a:sysClr", NS)
    if sysc is not None:
        if sysc.get("lastClr"):
            return _upper_hex(sysc.get("lastClr"))
        if sysc.get("val") and _is_hex6(sysc.get("val")):
            return _upper_hex(sysc.get("val"))
    return None


def parse_clr_scheme(theme_xml: bytes) -> Dict[str, str]:
    """Extract color scheme from theme*.xml: dk1/lt1/.../accent6/hlink/folHlink -> hex."""
    root = _read_xml(theme_xml)
    clr_scheme_el = root.find(".//a:themeElements/a:clrScheme", NS)
    if clr_scheme_el is None:
        raise ValueError("theme xml missing a:clrScheme")
    out: Dict[str, str] = {}
    for child in list(clr_scheme_el):
        key = child.tag.split("}")[-1]
        val = _extract_color_from_scheme_child(child)
        if val:
            out[key] = val
    return out


def parse_clr_map(master_xml: bytes) -> Dict[str, str]:
    """Extract clrMap from slideMaster*.xml: bg1/tx2/etc -> dk2/lt1/etc."""
    root = _read_xml(master_xml)
    clr_map_el = root.find(".//p:clrMap", NS)
    if clr_map_el is None:
        raise ValueError("master xml missing p:clrMap")
    # Attributes are already the mapping
    return dict(clr_map_el.attrib)


def parse_font_scheme(theme_xml: bytes) -> Dict[str, str]:
    """
    Extract font scheme mapping from theme*.xml.

    Returns keys typically used by PPT:
      +mj-lt, +mj-ea, +mj-cs, +mn-lt, +mn-ea, +mn-cs
    """
    root = _read_xml(theme_xml)
    fs = root.find(".//a:themeElements/a:fontScheme", NS)
    if fs is None:
        return {}

    major = fs.find("a:majorFont", NS)
    minor = fs.find("a:minorFont", NS)

    def _typeface(font_el: Optional[ET.Element], child_tag: str) -> Optional[str]:
        if font_el is None:
            return None
        node = font_el.find(f"a:{child_tag}", NS)
        if node is None:
            return None
        tf = node.get("typeface")
        tf = (tf or "").strip()
        return tf or None

    out = {
        "+mj-lt": _typeface(major, "latin"),
        "+mj-ea": _typeface(major, "ea"),
        "+mj-cs": _typeface(major, "cs"),
        "+mn-lt": _typeface(minor, "latin"),
        "+mn-ea": _typeface(minor, "ea"),
        "+mn-cs": _typeface(minor, "cs"),
    }
    # Drop empties
    return {k: v for k, v in out.items() if v}


# ---- Optional color modifier support (very useful for real decks) ----
# Many PPTX shapes use <a:schemeClr val="accent1"><a:shade val="50000"/></...>
# We support the common modifiers used in this template:
#   shade, tint, lumMod, lumOff, satMod, alpha (alpha is ignored for hex output)
#
# Note: OOXML defines a full color transform pipeline; this is a pragmatic subset.


def _hex_to_rgb01(hex6: str) -> Tuple[float, float, float]:
    hex6 = hex6.strip().lstrip("#")
    r = int(hex6[0:2], 16) / 255.0
    g = int(hex6[2:4], 16) / 255.0
    b = int(hex6[4:6], 16) / 255.0
    return r, g, b


def _rgb01_to_hex(rgb: Tuple[float, float, float]) -> str:
    r, g, b = rgb
    r8 = max(0, min(255, int(round(r * 255))))
    g8 = max(0, min(255, int(round(g * 255))))
    b8 = max(0, min(255, int(round(b * 255))))
    return f"{r8:02X}{g8:02X}{b8:02X}"


def _apply_shade_tint(rgb: Tuple[float, float, float], kind: str, val: int) -> Tuple[float, float, float]:
    """
    shade: scale towards black
      new = old * (val/100000)
    tint: scale towards white
      new = old + (1-old) * (val/100000)
    """
    f = max(0.0, min(1.0, val / 100000.0))
    r, g, b = rgb
    if kind == "shade":
        return (r * f, g * f, b * f)
    if kind == "tint":
        return (r + (1.0 - r) * f, g + (1.0 - g) * f, b + (1.0 - b) * f)
    return rgb


def _apply_hls_mods(rgb: Tuple[float, float, float], lumMod: Optional[int], lumOff: Optional[int], satMod: Optional[int]) -> Tuple[float, float, float]:
    import colorsys

    r, g, b = rgb
    h, l, s = colorsys.rgb_to_hls(r, g, b)

    if lumMod is not None:
        l *= max(0.0, lumMod / 100000.0)
    if lumOff is not None:
        l += max(0.0, lumOff / 100000.0)
    if satMod is not None:
        s *= max(0.0, satMod / 100000.0)

    l = max(0.0, min(1.0, l))
    s = max(0.0, min(1.0, s))
    r2, g2, b2 = colorsys.hls_to_rgb(h, l, s)
    return (r2, g2, b2)


def apply_color_modifiers(hex6: str, modifier_el: ET.Element) -> str:
    """
    Apply a subset of DrawingML color modifiers found as children under
    <a:schemeClr> or <a:srgbClr>.

    Supports: shade, tint, lumMod, lumOff, satMod, alpha.
    """
    rgb = _hex_to_rgb01(hex6)

    # First pass: apply shade/tint in document order
    lumMod = None
    lumOff = None
    satMod = None

    for child in list(modifier_el):
        tag = child.tag.split("}")[-1]
        v_raw = child.get("val")
        if v_raw is None:
            continue
        try:
            v = int(v_raw)
        except ValueError:
            continue

        if tag in ("shade", "tint"):
            rgb = _apply_shade_tint(rgb, tag, v)
        elif tag == "lumMod":
            lumMod = v
        elif tag == "lumOff":
            lumOff = v
        elif tag == "satMod":
            satMod = v
        elif tag == "alpha":
            # Hex-only output can't represent alpha; keep ignoring here.
            pass

    # Second pass: apply HLS-based mods together (order-independent for our subset)
    if lumMod is not None or lumOff is not None or satMod is not None:
        rgb = _apply_hls_mods(rgb, lumMod=lumMod, lumOff=lumOff, satMod=satMod)

    return _rgb01_to_hex(rgb)


FONT_MAP = {'KPMG Bold': 'Arial'}


@dataclass
class ThemeResolver:
    clr_scheme: Dict[str, str]  # accent1 → hex
    clr_map: Dict[str, str]     # tx2 → dk2
    fonts: Dict[str, str]       # +mj-lt → font name

    def resolve_color(self, val: str) -> str:
        """
        Resolve a scheme/semantic color token to a 6-hex RGB string.

        Rules:
          1) If val is already hex, return it (uppercased).
          2) Apply master clrMap (semantic → scheme).
          3) Look up in theme clrScheme (scheme → hex).
        """
        if val is None:
            raise ValueError("color value is None")
        val = val.strip()
        if _is_hex6(val):
            return _upper_hex(val)

        mapped = self.clr_map.get(val, val)  # tx2 → dk2; accent1 → accent1; etc.
        if mapped == "phClr":
            raise KeyError("phClr is a placeholder color and cannot be resolved without shape context")
        if _is_hex6(mapped):
            return _upper_hex(mapped)

        if mapped in self.clr_scheme:
            return _upper_hex(self.clr_scheme[mapped])

        raise KeyError(f"Unknown scheme color: {val} (mapped to {mapped})")

    def resolve_schemeClr_element(self, scheme_clr_el: ET.Element) -> str:
        """
        Resolve an <a:schemeClr> element to hex, including common modifiers.
        """
        if scheme_clr_el is None:
            raise ValueError("scheme_clr_el is None")
        val = scheme_clr_el.get("val")
        if not val:
            raise ValueError("a:schemeClr missing @val")

        base = self.resolve_color(val)
        # Apply modifiers if present
        if list(scheme_clr_el):
            return apply_color_modifiers(base, scheme_clr_el)
        return base

    def resolve_srgbClr_element(self, srgb_clr_el: ET.Element) -> str:
        """
        Resolve an <a:srgbClr> element to hex, including common modifiers.
        """
        if srgb_clr_el is None:
            raise ValueError("srgb_clr_el is None")
        val = srgb_clr_el.get("val")
        if not val:
            raise ValueError("a:srgbClr missing @val")
        base = self.resolve_color(val)  # handles hex normalization
        if list(srgb_clr_el):
            return apply_color_modifiers(base, srgb_clr_el)
        return base

    def resolve_font(self, val: str) -> str:
        """Resolve theme font reference (e.g., '+mj-lt') to concrete font name."""
        if val is None:
            raise ValueError("font value is None")
        val = val.strip()
        if val.startswith("+"):
            resolved = self.fonts.get(val, val)
            return FONT_MAP.get(resolved, resolved)
        return FONT_MAP.get(val, val)


def build_resolver(pptx_path: Path) -> ThemeResolver:
    """
    Build complete resolver from PPTX.

    Prefers discovering the active slide master + theme from relationships,
    but falls back to the common default paths when needed.
    """
    with zipfile.ZipFile(pptx_path, "r") as zf:
        theme_path = "ppt/theme/theme1.xml"
        master_path = "ppt/slideMasters/slideMaster1.xml"

        try:
            pres_rels = _parse_package_rels(zf.read("ppt/_rels/presentation.xml.rels"))
            for _, (rtype, target) in pres_rels.items():
                if rtype.endswith("/slideMaster"):
                    master_path = _resolve_path("ppt/presentation.xml", target)
                elif rtype.endswith("/theme"):
                    theme_path = _resolve_path("ppt/presentation.xml", target)

            # Slide master often points to the theme actually in use.
            try:
                master_rels = _parse_package_rels(zf.read(_rels_path_for_part(master_path)))
                for _, (rtype, target) in master_rels.items():
                    if rtype.endswith("/theme"):
                        theme_path = _resolve_path(master_path, target)
                        break
            except KeyError:
                pass
        except KeyError:
            pass

        _, theme_xml = _read_first(zf, (theme_path, "ppt/theme/theme1.xml"))
        _, master_xml = _read_first(zf, (master_path, "ppt/slideMasters/slideMaster1.xml"))

        clr_scheme = parse_clr_scheme(theme_xml)
        clr_map = parse_clr_map(master_xml)
        fonts = parse_font_scheme(theme_xml)

        return ThemeResolver(clr_scheme=clr_scheme, clr_map=clr_map, fonts=fonts)
