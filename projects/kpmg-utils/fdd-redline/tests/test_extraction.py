import os
import sys
import unittest


DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if DIST_DIR not in sys.path:
    sys.path.insert(0, DIST_DIR)

from extraction import extract_metrics_from_text, group_contiguous


class TestExtraction(unittest.TestCase):
    def test_group_contiguous(self) -> None:
        self.assertEqual(group_contiguous([1, 2, 3, 7, 8, 12]), [(1, 3), (7, 8), (12, 12)])
        self.assertEqual(group_contiguous([3, 2, 2, 1]), [(1, 3)])

    def test_extract_metrics_from_text(self) -> None:
        text = (
            "Revenue: $45.2M\n"
            "Gross margin of 15.2%\n"
            "EBITDA was $12.3 million\n"
            "Note: see page 4\n"
        )
        metrics = extract_metrics_from_text(text)
        self.assertIn(("Revenue", "$45.2M"), metrics)
        self.assertIn(("Gross margin", "15.2%"), metrics)
        self.assertIn(("EBITDA", "$12.3 million"), metrics)


if __name__ == "__main__":
    unittest.main()
