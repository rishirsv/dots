import json
import tempfile
import unittest
from pathlib import Path

from extractor.codegen import TemplateConfig, write_template_files
from extractor.part_graph import build_part_graph


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

    def test_native_codegen_generates_assets_and_layout_contract(self):
        with tempfile.TemporaryDirectory() as td:
            template_dir = Path(td) / "kpmg-native"
            out = write_template_files(
                TemplateConfig(
                    template_dir=template_dir,
                    pptx_path=PPTX,
                    schema_version="4.0",
                    mode="native",
                    all_layout_types=True,
                    refresh_assets=True,
                )
            )

            self.assertTrue((template_dir / "assets" / "assets-base64.json").exists())
            self.assertTrue((template_dir / "assets" / "gradient_data_uris.json").exists())
            self.assertTrue(out["template_json"].exists())
            self.assertTrue(out["template_js"].exists())

            data = out["template_json"].read_text()
            self.assertIn('"templateMode": "native"', data)
            self.assertIn('"layouts"', data)
            self.assertIn('"masters"', data)

            template_json = json.loads(data)
            self.assertIn("export function resolveLayoutType", out["template_js"].read_text())
            graph = build_part_graph(PPTX)
            self.assertEqual(len(template_json["layouts"]), len(graph.layouts))
            self.assertTrue(all(key.startswith("layout.") for key in template_json["layouts"].keys()))
            alias_to_type = {}
            for type_key, layout in template_json["layouts"].items():
                aliases = layout.get("typeAliases", [])
                if aliases is None:
                    aliases = []
                self.assertIsInstance(aliases, list)
                for alias in aliases:
                    self.assertTrue(alias.startswith("layout."))
                    self.assertNotIn(alias, alias_to_type)
                    alias_to_type[alias] = type_key

    def test_native_layout_keys_are_stable_across_runs(self):
        with tempfile.TemporaryDirectory() as td:
            template_dir = Path(td) / "kpmg-native"
            out1 = write_template_files(
                TemplateConfig(
                    template_dir=template_dir,
                    pptx_path=PPTX,
                    schema_version="4.0",
                    mode="native",
                    all_layout_types=True,
                    refresh_assets=True,
                )
            )
            out2 = write_template_files(
                TemplateConfig(
                    template_dir=template_dir,
                    pptx_path=PPTX,
                    schema_version="4.0",
                    mode="native",
                    all_layout_types=True,
                    refresh_assets=False,
                )
            )

            j1 = json.loads(out1["template_json"].read_text())
            j2 = json.loads(out2["template_json"].read_text())
            self.assertEqual(list(j1["layouts"].keys()), list(j2["layouts"].keys()))


if __name__ == "__main__":
    unittest.main()
