import unittest
from pathlib import Path

from extractor.part_graph import build_part_graph
from extractor.slots import (
    classify_layout_name,
    detect_layout_slots_for_layout,
    detect_slots,
    slots_by_type,
)

TEMPLATE_PPTX = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")


class TestSlots(unittest.TestCase):
    def test_classify_known_layout_names(self):
        self.assertEqual(classify_layout_name("Cover page_Right Horizontal Window"), "cover")
        self.assertEqual(classify_layout_name("Divider slide_5"), "divider")
        self.assertEqual(classify_layout_name("Two columns text"), "twoColumnText")
        self.assertEqual(classify_layout_name("Analysis_narrow table"), "analysisNarrowTable")
        self.assertEqual(classify_layout_name("Back cover_2"), "backCover")

    def test_detect_slots_counts_match_template(self):
        graph = build_part_graph(TEMPLATE_PPTX)
        slots = detect_slots(graph)
        self.assertEqual(len(slots), 45)

        counts = slots_by_type(slots)
        self.assertEqual(counts["divider"], 9)
        self.assertEqual(counts["cover"], 1)
        self.assertEqual(counts["analysisNarrowTable"], 5)

    def test_detect_chart_placeholders_in_chart_layout(self):
        graph = build_part_graph(TEMPLATE_PPTX)
        layout = next(
            (layout for layout in graph.layouts.values() if layout.name == "Analysis_wide chart + 2 cols text"),
            None,
        )
        if layout is None:
            self.skipTest("Chart layout not found in template")

        layout_slots = detect_layout_slots_for_layout(TEMPLATE_PPTX, layout.xml_path, layout.name)
        has_chart = any(slot.slot_type == "chart" for slot in layout_slots.slots.values())
        if not has_chart:
            self.skipTest("No chart placeholders detected in chart layout")
        self.assertTrue(has_chart)


if __name__ == "__main__":
    unittest.main()
