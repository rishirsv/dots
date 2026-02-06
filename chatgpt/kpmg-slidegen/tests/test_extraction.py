import zipfile
import xml.etree.ElementTree as ET
import unittest
from pathlib import Path

from extractor.elements import extract_part_elements
from extractor.geometry import emu_to_inches, inches_to_emu, parse_xfrm_bbox
from extractor.part_graph import build_part_graph


TEMPLATE_PPTX = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")
NS = {
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
}


class TestExtraction(unittest.TestCase):
    def test_emu_round_trip(self):
        self.assertEqual(inches_to_emu(1.0), 914400)
        self.assertTrue(abs(emu_to_inches(914400) - 1.0) < 1e-9)

    def test_parse_xfrm_bbox(self):
        xml = b"""
        <a:xfrm xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" rot="60000">
          <a:off x="914400" y="1828800"/>
          <a:ext cx="914400" cy="457200"/>
        </a:xfrm>
        """
        el = ET.fromstring(xml)
        bbox = parse_xfrm_bbox(el)
        self.assertIsNotNone(bbox)
        assert bbox is not None
        self.assertTrue(abs(bbox.x - 1.0) < 1e-9)
        self.assertTrue(abs(bbox.y - 2.0) < 1e-9)
        self.assertTrue(abs(bbox.w - 1.0) < 1e-9)
        self.assertTrue(abs(bbox.h - 0.5) < 1e-9)
        self.assertTrue(abs(bbox.rotation - 1.0) < 1e-9)

    def test_extract_cover_slide_elements_has_image_and_text(self):
        elements = extract_part_elements(TEMPLATE_PPTX, "ppt/slides/slide1.xml")
        kinds = {e.kind for e in elements}
        self.assertIn("image", kinds)
        self.assertIn("text", kinds)

        images = [e for e in elements if e.kind == "image"]
        self.assertTrue(any((img.target or "").startswith("ppt/media/") for img in images))

    def test_extract_divider_layout_elements_has_shapes(self):
        elements = extract_part_elements(TEMPLATE_PPTX, "ppt/slideLayouts/slideLayout10.xml")
        self.assertTrue(any(e.kind in ("shape", "text") for e in elements))

    def test_extract_table_slide_has_table_frame(self):
        graph = build_part_graph(TEMPLATE_PPTX)
        slide = next(s for s in graph.slides if s.layout_name == "Analysis_narrow table")
        elements = extract_part_elements(TEMPLATE_PPTX, slide.xml_path)
        self.assertTrue(any(e.kind == "table" for e in elements))

    def test_extract_chart_frames_when_present(self):
        chart_slide = None
        with zipfile.ZipFile(TEMPLATE_PPTX, "r") as zf:
            for name in zf.namelist():
                if not (name.startswith("ppt/slides/slide") and name.endswith(".xml")):
                    continue
                root = ET.fromstring(zf.read(name))
                if root.find(".//c:chart", NS) is not None:
                    chart_slide = name
                    break

        if not chart_slide:
            self.skipTest("No embedded chart frames found in template")

        elements = extract_part_elements(TEMPLATE_PPTX, chart_slide)
        self.assertTrue(any(e.kind == "chart" for e in elements))


if __name__ == "__main__":
    unittest.main()
