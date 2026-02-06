import unittest
from pathlib import Path

from extractor.layout_geometry import extract_all_layout_geometry


TEMPLATE_PPTX = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")


class TestLayoutGeometry(unittest.TestCase):
    def test_cover_layout_has_title_and_picture_slot(self):
        geom = extract_all_layout_geometry(TEMPLATE_PPTX)
        cover = geom.get("Cover page_Right Horizontal Window")
        self.assertIsNotNone(cover)
        assert cover is not None
        self.assertIsNotNone(cover.get("title"))
        # Picture placeholder should be detectable as a "picture" slot
        self.assertIsNotNone(cover.get("picture"))

    def test_chart_layout_has_chart_slot(self):
        geom = extract_all_layout_geometry(TEMPLATE_PPTX)
        chart = geom.get("Analysis_wide chart + 2 cols text")
        self.assertIsNotNone(chart)
        assert chart is not None
        self.assertIsNotNone(chart.get("chart"))


if __name__ == "__main__":
    unittest.main()

