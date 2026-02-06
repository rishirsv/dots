import tempfile
import unittest
from pathlib import Path

from extractor.template_scaffold import init_template_scaffold


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PPTX = ROOT / "templates" / "kpmg-diligence" / "Diligence+ Reporting Template_Widescreen v2.1.pptx"
GEN_SRC = ROOT / "templates" / "kpmg-diligence" / "generator"


class TestTemplateScaffold(unittest.TestCase):
    def test_init_template_scaffold_creates_structure_and_patches_generator(self):
        with tempfile.TemporaryDirectory() as td:
            template_dir = Path(td) / "kpmg-test-template"
            out = init_template_scaffold(
                template_dir=template_dir,
                source_pptx=SOURCE_PPTX,
                copy_generator_from=GEN_SRC,
            )

            self.assertTrue((template_dir / SOURCE_PPTX.name).exists())
            self.assertTrue((template_dir / "assets").exists())
            self.assertTrue((template_dir / "samples").exists())
            self.assertTrue((template_dir / "template.profile.json").exists())
            self.assertTrue((template_dir / "tuning.loop.json").exists())

            idx = (template_dir / "generator" / "index.js").read_text()
            self.assertIn("const payload = slideSpec?.slots", idx)

            self.assertEqual(out["template_dir"], template_dir)


if __name__ == "__main__":
    unittest.main()
