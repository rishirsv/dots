import base64
import json
import math
import unittest
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

from extractor.gradients import extract_gradient
from extractor.resolvers import build_resolver


TEMPLATE_PPTX = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")
TEMPLATE_ASSETS = Path("templates/kpmg-diligence/assets")

NS = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main"}


def _png_size(png_bytes: bytes) -> tuple[int, int]:
    # PNG signature + IHDR chunk
    if len(png_bytes) < 33:
        raise ValueError("PNG too small")
    if png_bytes[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Invalid PNG signature")
    if png_bytes[12:16] != b"IHDR":
        raise ValueError("Missing IHDR chunk")
    w = int.from_bytes(png_bytes[16:20], "big")
    h = int.from_bytes(png_bytes[20:24], "big")
    return w, h


def _data_uri_to_bytes(data_uri: str) -> bytes:
    prefix = "base64,"
    i = data_uri.find(prefix)
    if i == -1:
        raise ValueError("Data URI missing base64 prefix")
    return base64.b64decode(data_uri[i + len(prefix) :], validate=True)

class TestFoundation(unittest.TestCase):
    def test_color_resolution(self):
        r = build_resolver(TEMPLATE_PPTX)
        self.assertEqual(r.resolve_color("tx2"), "00338D")
        self.assertEqual(r.resolve_color("accent1"), "1E49E2")
        self.assertEqual(r.resolve_font("+mj-lt"), "Arial")
        self.assertEqual(r.resolve_font("+mn-lt"), "Arial")

    def test_divider_window_gradient_extraction(self):
        r = build_resolver(TEMPLATE_PPTX)
        with zipfile.ZipFile(TEMPLATE_PPTX, "r") as zf:
            layout_xml = zf.read("ppt/slideLayouts/slideLayout10.xml")

        root = ET.fromstring(layout_xml)
        grad = root.find(".//a:gradFill", NS)
        self.assertIsNotNone(grad)

        out = extract_gradient(grad, r)  # type: ignore[arg-type]
        self.assertEqual(out["type"], "linear")
        self.assertTrue(math.isclose(out["angle"], 0.0, abs_tol=1e-9))

        stops = [(s["pos"], s["color"]) for s in out["stops"]]
        self.assertEqual(stops, [(0.0, "00338D"), (100.0, "1E49E2")])

    def test_gradient_data_uris_match_png_dimensions(self):
        data = json.loads((TEMPLATE_ASSETS / "gradient_data_uris.json").read_text())
        self.assertEqual(set(data.keys()), {"accent_chip", "divider_window", "back_cover"})

        mapping = {
            "accent_chip": TEMPLATE_ASSETS / "gradient_accent_chip_300dpi.png",
            "divider_window": TEMPLATE_ASSETS / "gradient_divider_window_300dpi.png",
            "back_cover": TEMPLATE_ASSETS / "gradient_back_cover_300dpi.png",
        }

        for key, png_path in mapping.items():
            file_w, file_h = _png_size(png_path.read_bytes())
            uri_w, uri_h = _png_size(_data_uri_to_bytes(data[key]))
            self.assertEqual((uri_w, uri_h), (file_w, file_h))

    def test_gradient_renderer_png_signature_and_size(self):
        from extractor.gradient_renderer import render_linear_gradient

        r = build_resolver(TEMPLATE_PPTX)
        with zipfile.ZipFile(TEMPLATE_PPTX, "r") as zf:
            layout_xml = zf.read("ppt/slideLayouts/slideLayout10.xml")

        root = ET.fromstring(layout_xml)
        grad = root.find(".//a:gradFill", NS)
        self.assertIsNotNone(grad)

        g = extract_gradient(grad, r)  # type: ignore[arg-type]
        stops = [(s["pos"], s["color"]) for s in g["stops"]]
        png = render_linear_gradient(128, 32, stops=stops, angle_deg=g["angle"])
        self.assertEqual(_png_size(png), (128, 32))


if __name__ == "__main__":
    unittest.main()
