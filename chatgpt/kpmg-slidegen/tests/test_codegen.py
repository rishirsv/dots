import tempfile
import unittest
from pathlib import Path

from extractor.codegen import TemplateConfig, write_template_files


PPTX = Path("templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx")
ASSETS_DIR = Path("templates/kpmg-diligence/assets")


class TestCodegen(unittest.TestCase):
    def test_write_template_files_to_temp_dir(self):
        with tempfile.TemporaryDirectory() as td:
            template_dir = Path(td) / "kpmg-diligence"
            (template_dir / "assets").mkdir(parents=True, exist_ok=True)

            # Copy the minimal required inputs for embedding.
            (template_dir / "assets" / "assets-base64.json").write_text((ASSETS_DIR / "assets-base64.json").read_text())
            (template_dir / "assets" / "gradient_data_uris.json").write_text(
                (ASSETS_DIR / "gradient_data_uris.json").read_text()
            )

            out = write_template_files(TemplateConfig(template_dir=template_dir, pptx_path=PPTX, schema_version="3.0"))
            self.assertTrue(out["template_json"].exists())
            self.assertTrue(out["template_js"].exists())

            js = out["template_js"].read_text()
            self.assertIn("export const TOKENS", js)
            self.assertIn("export const ASSETS", js)
            self.assertIn("export function generateDeck", js)


if __name__ == "__main__":
    unittest.main()

