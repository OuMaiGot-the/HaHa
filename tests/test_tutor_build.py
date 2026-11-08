"""Build-time opt-in and navigation checks; no learner data or hosted services."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


class TutorBuildTests(unittest.TestCase):
    def test_lab_is_explicitly_opt_in_and_self_contained(self):
        root = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as temporary:
            for enabled in (False, True):
                output = Path(temporary) / str(enabled)
                command = [sys.executable, "scripts/build_catalog_release.py", str(output)]
                if enabled:
                    command.append("--include-tutor-lab")
                result = subprocess.run(command, cwd=root, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual((output / "tutor").exists(), enabled)
                hub = (output / "index.html").read_text(encoding="utf-8")
                self.assertEqual('href="tutor/"' in hub, enabled)
                if enabled:
                    index = (output / "tutor/index.html").read_text(encoding="utf-8")
                    self.assertIn('href="../index.html"', index)
                    for asset in ("tutor.mjs", "core.mjs", "microphone.mjs", "continuity.mjs", "tutor.css"):
                        self.assertTrue((output / "tutor" / asset).is_file(), asset)
