import unittest
from pathlib import Path

from extractor.part_graph import build_part_graph, get_used_layouts

PPTX_PATH = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")


class TestPartGraph(unittest.TestCase):
    def test_part_graph_construction(self):
        graph = build_part_graph(PPTX_PATH)
        self.assertEqual(graph.theme_path, "ppt/theme/theme1.xml")
        self.assertEqual(graph.master_path, "ppt/slideMasters/slideMaster1.xml")
        self.assertGreaterEqual(len(graph.masters), 1)
        self.assertEqual(len(graph.slides), 45)
        self.assertEqual(len(graph.layouts), 53)
        self.assertAlmostEqual(graph.slide_dimensions["w"], 13.333333333333334, places=3)
        self.assertAlmostEqual(graph.slide_dimensions["h"], 7.5, places=3)
        for layout in graph.layouts.values():
            self.assertIn(layout.master_path, graph.masters)

    def test_used_layouts_counts(self):
        graph = build_part_graph(PPTX_PATH)
        used = get_used_layouts(graph)
        self.assertIn("Divider slide_5", used)
        self.assertEqual(used["Divider slide_5"], 9)
        self.assertEqual(len(used), 19)


if __name__ == "__main__":
    unittest.main()
