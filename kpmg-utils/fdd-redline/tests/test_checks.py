import os
import sys
import unittest


DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if DIST_DIR not in sys.path:
    sys.path.insert(0, DIST_DIR)

from checks_crossref import run_crossref_checks
from checks_grammar import find_double_spaces, find_misspellings, find_repeated_words
from checks_placeholders import find_placeholders
from checks_terminology import find_term_variants
from models import DocumentModel, PageModel


class TestChecks(unittest.TestCase):
    def test_placeholders_literal_and_regex(self) -> None:
        page = PageModel(
            page_num=1,
            raw_text="Please confirm [TBD] for [Customer 12].",
            has_table=False,
            has_chart=False,
        )
        patterns = [
            {"pattern": "[TBD]", "type": "literal"},
            {"pattern": r"\[Customer \d+\]", "type": "regex"},
        ]
        findings = find_placeholders(page, patterns)
        self.assertTrue(any("TBD" in f.comment for f in findings))
        self.assertTrue(any("Customer" in f.comment for f in findings))

    def test_grammar_repeated_words(self) -> None:
        page = PageModel(page_num=2, raw_text="This is the the issue.", has_table=False, has_chart=False)
        findings = find_repeated_words(page)
        self.assertEqual(len(findings), 1)
        self.assertIn("the the", findings[0].comment.lower())

        page_acronym = PageModel(page_num=3, raw_text="TTM TTM FY FY", has_table=False, has_chart=False)
        self.assertEqual(find_repeated_words(page_acronym), [])

    def test_grammar_double_spaces_word_to_word_only(self) -> None:
        page_ok = PageModel(page_num=3, raw_text="FY21   FY22", has_table=False, has_chart=False)
        self.assertEqual(find_double_spaces(page_ok), [])

        page_bad = PageModel(page_num=4, raw_text="Revenue  grew", has_table=False, has_chart=False)
        self.assertNotEqual(find_double_spaces(page_bad), [])

    def test_grammar_misspellings_whole_word(self) -> None:
        page = PageModel(page_num=5, raw_text="We can accomodate this request.", has_table=False, has_chart=False)
        misspellings = {"accomodate": "accommodate"}
        findings = find_misspellings(page, misspellings)
        self.assertEqual(len(findings), 1)
        self.assertIn("accommodate", findings[0].comment.lower())

    def test_crossref_invalid_page(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="See page 99 for details.", has_table=False, has_chart=False),
                PageModel(page_num=2, raw_text="All good.", has_table=False, has_chart=False),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=2,
        )
        findings = run_crossref_checks(doc)
        self.assertEqual(len(findings), 1)
        self.assertIn("Invalid page reference", findings[0].comment)

    def test_crossref_missing_appendix(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="See Appendix B.", has_table=False, has_chart=False),
                PageModel(page_num=2, raw_text="Appendix A\\nDetails...", has_table=False, has_chart=False),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=2,
        )
        findings = run_crossref_checks(doc)
        self.assertEqual(len(findings), 1)
        self.assertIn("Appendix reference", findings[0].comment)

    def test_terminology_variants(self) -> None:
        doc = DocumentModel(
            pages=[
                PageModel(page_num=1, raw_text="QoE is discussed here. QoE again.", has_table=False, has_chart=False),
                PageModel(page_num=2, raw_text="QofE appears once.", has_table=False, has_chart=False),
            ],
            source_path="x",
            source_type="pptx",
            total_pages=2,
        )
        term_groups = {
            "qoe": {"full_form": "Quality of Earnings", "abbreviations": ["QoE", "QofE"]}
        }
        findings = find_term_variants(doc, term_groups)
        self.assertEqual(len(findings), 1)
        self.assertIn("Recommend", findings[0].comment)


if __name__ == "__main__":
    unittest.main()
