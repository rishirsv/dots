from __future__ import annotations

import base64
import json
import mimetypes
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from .assets import export_media
from .geometry import parse_xfrm_bbox
from .gradient_renderer import inches_to_pixels, render_linear_gradient
from .gradients import extract_gradient
from .part_graph import build_part_graph
from .resolvers import build_resolver

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
}


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


def _mime_for_path(path: Path) -> str:
    guessed, _ = mimetypes.guess_type(path.name)
    if guessed:
        return guessed
    ext = path.suffix.lower()
    if ext == ".svg":
        return "image/svg+xml"
    if ext == ".png":
        return "image/png"
    if ext in (".jpg", ".jpeg"):
        return "image/jpeg"
    return "application/octet-stream"


def _to_data_uri(data: bytes, mime: str) -> str:
    encoded = base64.b64encode(data).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def _dedupe_key(base: str, used: Dict[str, int]) -> str:
    if base not in used:
        used[base] = 1
        return base
    n = used[base] + 1
    used[base] = n
    return f"{base}_{n}"


def _choose_first(m: Dict[str, str], patterns: Iterable[str], exts: Iterable[str]) -> Optional[str]:
    exts_norm = {e.lower() for e in exts}
    pats = [p.lower() for p in patterns]
    for key in sorted(m.keys()):
        key_lower = key.lower()
        if not any(p in key_lower for p in pats):
            continue
        if any(key_lower.endswith(ext) for ext in exts_norm):
            return key
    for key in sorted(m.keys()):
        key_lower = key.lower()
        if any(key_lower.endswith(ext) for ext in exts_norm):
            return key
    return None


def _build_assets_base64_manifest(template_dir: Path, pptx_path: Path, *, refresh: bool, mode: str) -> Dict[str, str]:
    assets_dir = template_dir / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = assets_dir / "assets-base64.json"

    if not refresh and manifest_path.exists():
        return json.loads(manifest_path.read_text())

    graph = build_part_graph(pptx_path)
    media_paths = sorted(graph.media.keys())
    exported = export_media(pptx_path, assets_dir / "_exported_media", media_paths=media_paths)

    used: Dict[str, int] = {}
    by_filename: Dict[str, str] = {}
    out: Dict[str, str] = {}

    for _, exported_asset in sorted(exported.items(), key=lambda item: item[1].out_path.name.lower()):
        p = exported_asset.out_path
        key_base = _slugify(p.stem)
        key = _dedupe_key(key_base, used)
        data_uri = _to_data_uri(p.read_bytes(), _mime_for_path(p))
        out[key] = data_uri
        by_filename[p.name.lower()] = data_uri

    # Legacy compatibility aliases expected by the existing Diligence JS contract.
    if mode == "legacy":
        png_logo_key = _choose_first(by_filename, patterns=("logo", "kpmg"), exts=(".png",))
        svg_logo_key = _choose_first(by_filename, patterns=("logo", "kpmg"), exts=(".svg",))
        cover_photo_key = _choose_first(by_filename, patterns=("cover", "photo"), exts=(".jpg", ".jpeg", ".png"))

        if png_logo_key and "logoWhitePng" not in out:
            out["logoWhitePng"] = by_filename[png_logo_key]
        if svg_logo_key and "logoWhiteSvg" not in out:
            out["logoWhiteSvg"] = by_filename[svg_logo_key]
        if cover_photo_key and "coverPhoto" not in out:
            out["coverPhoto"] = by_filename[cover_photo_key]

    manifest_path.write_text(json.dumps(out, indent=2, sort_keys=True) + "\n")
    return out


def _extract_gradients_from_layout(
    *,
    zf: zipfile.ZipFile,
    layout_path: str,
    layout_name: str,
    resolver,
    slide_w_in: float,
    slide_h_in: float,
) -> List[Tuple[str, bytes, str]]:
    """
    Return a list of (gradient_key, png_bytes, layout_name) for gradFill shapes.
    """
    try:
        root = ET.fromstring(zf.read(layout_path))
    except Exception:
        return []

    out: List[Tuple[str, bytes, str]] = []
    idx = 0
    for sp in root.findall(".//p:sp", NS):
        sppr = sp.find("./p:spPr", NS)
        if sppr is None:
            continue
        grad = sppr.find("a:gradFill", NS)
        if grad is None:
            continue
        idx += 1
        try:
            parsed = extract_gradient(grad, resolver)
        except Exception:
            continue

        xfrm = sppr.find("a:xfrm", NS)
        bbox = parse_xfrm_bbox(xfrm)

        width_in = max(0.5, min(slide_w_in, bbox.w if bbox else slide_w_in))
        height_in = max(0.5, min(slide_h_in, bbox.h if bbox else slide_h_in))

        width_px = max(32, inches_to_pixels(width_in, dpi=300))
        height_px = max(32, inches_to_pixels(height_in, dpi=300))

        stops = [(float(s["pos"]), str(s["color"])) for s in parsed["stops"]]
        angle = float(parsed.get("angle", 0.0))

        try:
            png = render_linear_gradient(width_px, height_px, stops=stops, angle_deg=angle)
        except Exception:
            continue

        grad_key = f"{_slugify(layout_name)}_{idx}"
        out.append((grad_key, png, layout_name))

    return out


def _build_gradient_manifest(template_dir: Path, pptx_path: Path, *, refresh: bool) -> Dict[str, str]:
    assets_dir = template_dir / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = assets_dir / "gradient_data_uris.json"

    if not refresh and manifest_path.exists():
        return json.loads(manifest_path.read_text())

    graph = build_part_graph(pptx_path)
    resolver = build_resolver(pptx_path)

    gradient_uris: Dict[str, str] = {}
    fallback_keys: List[str] = []

    with zipfile.ZipFile(pptx_path, "r") as zf:
        for layout_path, layout_ref in sorted(graph.layouts.items(), key=lambda item: (item[1].name.lower(), item[0])):
            items = _extract_gradients_from_layout(
                zf=zf,
                layout_path=layout_path,
                layout_name=layout_ref.name,
                resolver=resolver,
                slide_w_in=float(graph.slide_dimensions.get("w", 13.333)),
                slide_h_in=float(graph.slide_dimensions.get("h", 7.5)),
            )
            for grad_key, png, layout_name in items:
                png_path = assets_dir / f"gradient_{grad_key}_300dpi.png"
                png_path.write_bytes(png)
                uri = _to_data_uri(png, "image/png")
                gradient_uris[grad_key] = uri
                fallback_keys.append(grad_key)

                layout_name_norm = (layout_name or "").lower()
                if "divider" in layout_name_norm and "divider_window" not in gradient_uris:
                    gradient_uris["divider_window"] = uri
                if "back cover" in layout_name_norm and "back_cover" not in gradient_uris:
                    gradient_uris["back_cover"] = uri
                if "accent" in layout_name_norm and "accent_chip" not in gradient_uris:
                    gradient_uris["accent_chip"] = uri

    if fallback_keys:
        first_uri = gradient_uris[fallback_keys[0]]
        gradient_uris.setdefault("accent_chip", first_uri)
        gradient_uris.setdefault("divider_window", first_uri)
        gradient_uris.setdefault("back_cover", first_uri)

    manifest_path.write_text(json.dumps(gradient_uris, indent=2, sort_keys=True) + "\n")
    return gradient_uris


def ensure_asset_manifests(template_dir: Path, pptx_path: Path, *, refresh: bool, mode: str) -> Dict[str, Path]:
    """
    Ensure template-local asset manifests exist.

    Returns paths for:
      - assets_base64
      - gradients_data_uris
    """
    _build_assets_base64_manifest(template_dir, pptx_path, refresh=refresh, mode=mode)
    _build_gradient_manifest(template_dir, pptx_path, refresh=refresh)

    return {
        "assets_base64": template_dir / "assets" / "assets-base64.json",
        "gradients_data_uris": template_dir / "assets" / "gradient_data_uris.json",
    }
