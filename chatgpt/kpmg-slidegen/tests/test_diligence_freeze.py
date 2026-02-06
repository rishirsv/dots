import shutil
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class TestDiligenceFreeze(unittest.TestCase):
    def test_no_unapproved_diligence_changes_in_worktree(self):
        if not shutil.which("git"):
            self.skipTest("git not available")

        p = subprocess.run(
            ["git", "status", "--porcelain", "--", "templates/kpmg-diligence"],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
        )
        if p.returncode != 0:
            self.skipTest("git status unavailable in this environment")

        changed = [line for line in p.stdout.splitlines() if line.strip()]
        self.assertEqual(
            changed,
            [],
            msg=(
                "Diligence template is frozen. Remove unapproved modifications under "
                "templates/kpmg-diligence before merging."
            ),
        )


if __name__ == "__main__":
    unittest.main()
