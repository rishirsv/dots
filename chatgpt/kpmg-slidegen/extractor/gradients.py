from __future__ import annotations

import xml.etree.ElementTree as ET
from typing import Any, Dict, List, Optional

from .resolvers import ThemeResolver

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


def _angle_deg_from_ang_attr(ang: Optional[str]) -> float:
    """
    Convert DrawingML angle to degrees.

    OOXML stores angles in 1/60000ths of a degree.
    """
    if not ang:
        return 0.0
    try:
        return (int(ang) / 60000.0) % 360.0
    except ValueError:
        return 0.0


def _resolve_stop_color(gs_el: ET.Element, resolver: ThemeResolver) -> str:
    srgb = gs_el.find(".//a:srgbClr", NS)
    if srgb is not None and srgb.get("val"):
        return resolver.resolve_srgbClr_element(srgb)

    scheme = gs_el.find(".//a:schemeClr", NS)
    if scheme is not None and scheme.get("val"):
        return resolver.resolve_schemeClr_element(scheme)

    raise ValueError("Gradient stop missing a:srgbClr or a:schemeClr")


def extract_gradient(grad_fill_element: ET.Element, resolver: ThemeResolver) -> Dict[str, Any]:
    """
    Extract a linear gradient from an <a:gradFill> element.

    Returns:
      {
        "type": "linear",
        "angle": <float degrees>,
        "stops": [{"pos": <0-100 float>, "color": "<RRGGBB>"}, ...]
      }
    """
    if grad_fill_element is None:
        raise ValueError("grad_fill_element is None")

    lin = grad_fill_element.find("a:lin", NS)
    angle = _angle_deg_from_ang_attr(lin.get("ang") if lin is not None else None)

    gs_list = grad_fill_element.findall(".//a:gsLst/a:gs", NS)
    if not gs_list:
        gs_list = grad_fill_element.findall(".//a:gs", NS)
    if len(gs_list) < 2:
        raise ValueError("Expected at least 2 gradient stops")

    stops: List[Dict[str, Any]] = []
    for gs in gs_list:
        pos_raw = gs.get("pos")
        if pos_raw is None:
            raise ValueError("Gradient stop missing @pos")
        try:
            # OOXML uses 0..100000. Convert to 0..100.
            pos = int(pos_raw) / 1000.0
        except ValueError as e:
            raise ValueError(f"Invalid gradient stop pos: {pos_raw!r}") from e

        stops.append({"pos": pos, "color": _resolve_stop_color(gs, resolver)})

    stops.sort(key=lambda s: float(s["pos"]))

    return {"type": "linear", "angle": angle, "stops": stops}

