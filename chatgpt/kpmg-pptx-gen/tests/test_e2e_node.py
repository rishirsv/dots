import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_ROOT = ROOT / "templates" / "kpmg-diligence"
DEMO = TEMPLATE_ROOT / "samples" / "demo.json"


def _has_node_and_pptxgen() -> bool:
    if not shutil.which("node"):
        return False
    # Check pptxgenjs import works (ESM).
    p = subprocess.run(
        ["node", "-e", "import('pptxgenjs').then(()=>process.exit(0)).catch(()=>process.exit(1))"],
        cwd=str(TEMPLATE_ROOT),
        capture_output=True,
        text=True,
    )
    return p.returncode == 0


@unittest.skipUnless(_has_node_and_pptxgen(), "node+pptxgenjs not available")
class TestEndToEndNode(unittest.TestCase):
    def test_validate_and_generate_demo(self):
        p = subprocess.run(["node", "generator/validate.js", "--in", str(DEMO)], cwd=str(TEMPLATE_ROOT))
        self.assertEqual(p.returncode, 0)

        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "demo.pptx"
            p2 = subprocess.run(
                ["node", "generator/index.js", "--in", str(DEMO), "--out", str(out)],
                cwd=str(TEMPLATE_ROOT),
            )
            self.assertEqual(p2.returncode, 0)
            self.assertTrue(out.exists())
            # PPTX is a zip archive.
            sig = out.read_bytes()[:2]
            self.assertEqual(sig, b"PK")


if __name__ == "__main__":
    unittest.main()
