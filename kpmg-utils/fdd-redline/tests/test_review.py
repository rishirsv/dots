import os
import sys
import unittest
from decimal import Decimal


DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if DIST_DIR not in sys.path:
    sys.path.insert(0, DIST_DIR)

from models import DocumentModel, Finding, PageModel
from review import (
    check_metric_consistency,
    compress_placeholder_findings,
    normalize_metric_value,
    run_review,
    select_pages_for_visual_review,
    validate_findings,
)


class TestReview(unittest.TestCase):
    def test_normalize_metric_value(self) -> None:
        pm = normalize_metric_value("$45.2M")
        self.assertEqual(pm.kind, "money")
        self.assertEqual(pm.normalized, Decimal("45200000"))

        pm = normalize_metric_value("15.2%")
        self.assertEqual(pm.kind, "percent")
        self.assertEqual(pm.normalized, Decimal("0.152"))

        pm = normalize_metric_value("($1,234)")
        self.assertEqual(pm.kind, "money")
        self.assertEqual(pm.normalized, Decimal("-1234"))

        pm = normalize_metric_value("CAD 1.2 million")
        self.assertEqual(pm.kind, "money")
        self.assertEqual(pm.normalized, Decimal("1200000"))

    def test_check_metric_consistency_requires_multiple_pages(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="", has_table=False, has_chart=False, metrics=[("Revenue", "$10"), ("Revenue", "$12")]),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=1,
        )
        self.assertEqual(check_metric_consistency(doc), [])

        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="", has_table=False, has_chart=False, metrics=[("Revenue", "$10")]),
                PageModel(page_num=2, raw_text="", has_table=False, has_chart=False, metrics=[("Revenue", "$12")]),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=2,
        )
        findings = check_metric_consistency(doc)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].category, "Calculations")

    def test_check_metric_consistency_ignores_generic_labels(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="", has_table=False, has_chart=False, metrics=[("Consists", "$10")]),
                PageModel(page_num=2, raw_text="", has_table=False, has_chart=False, metrics=[("Consists", "$12")]),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=2,
        )
        self.assertEqual(check_metric_consistency(doc), [])

    def test_select_pages_budget_cap(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=i, raw_text="", has_table=(i % 2 == 0), has_chart=False)
                for i in range(1, 11)
            ],
            source_path="x",
            source_type="pptx",
            total_pages=10,
        )
        findings = [
            Finding(id="", page=1, category="Placeholders", priority="H", comment="x"),
            Finding(id="", page=3, category="Grammar", priority="M", comment="y"),
            Finding(id="", page=5, category="Calculations", priority="H", comment="z"),
        ]
        selected = select_pages_for_visual_review(doc, findings)
        self.assertLessEqual(len(selected), 5)  # 50% of 10

    def test_validate_findings_dedupe_and_renumber(self) -> None:
        doc = DocumentModel(
            pages=[PageModel(page_num=1, raw_text="", has_table=False, has_chart=False)],
            source_path="x",
            source_type="pptx",
            total_pages=1,
        )
        findings = [
            Finding(id="", page=1, category="Grammar", priority="L", comment="A"),
            Finding(id="", page=1, category="Grammar", priority="L", comment="A"),
            Finding(id="", page=99, category="Grammar", priority="L", comment="B"),
        ]
        out = validate_findings(findings, doc)
        self.assertEqual(out[0].id, "001")
        self.assertEqual(out[0].comment, "A")
        self.assertFalse(out[-1].is_valid)

    def test_compress_placeholder_findings(self) -> None:
        findings = [
            Finding(id="", page=(i % 3) + 1, category="Placeholders", priority="H", comment=f'Placeholder "[TOKEN{i}]" found.')
            for i in range(30)
        ]
        out = compress_placeholder_findings(findings, max_distinct_tokens=25, top_n=5, other_token_list_limit=10)
        placeholder_out = [f for f in out if f.category == "Placeholders"]
        self.assertEqual(len(placeholder_out), 6)  # 5 top + 1 "additional"
        self.assertTrue(any("Additional placeholder tokens detected" in f.comment for f in placeholder_out))

    def test_integration_samples_smoke(self) -> None:
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs"))
        north = os.path.join(base, "Project North_(Jun-24) RF Draft report_21-Aug-24 vS.pptx")
        coffee = os.path.join(base, "Project Coffee_buy side_FDD .pptx")

        # Text-only run to avoid external tools in CI environments.
        res_north = run_review(north, render_visuals=False)
        self.assertIsInstance(res_north["findings"], list)
        self.assertTrue(
            any(
                f.category == "Placeholders" and "Call-out box." in f.comment
                for f in res_north["findings"]
            )
        )

        res_coffee = run_review(coffee, render_visuals=False)
        self.assertIsInstance(res_coffee["findings"], list)
        self.assertGreater(len(res_coffee["findings"]), 0)
        self.assertTrue(
            any(
                f.category == "Placeholders" and "[CUSTOMER N]" in f.comment
                for f in res_coffee["findings"]
            )
        )


if __name__ == "__main__":
    unittest.main()
