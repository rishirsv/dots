"""Tests for scripts/patch-chatgpt-extension.sh."""

from __future__ import annotations

import base64
import hashlib
import json
import struct
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "patch-chatgpt-extension.sh"

# Minimal monitor replicating the release's frame-check shape.
MONITOR = (
    'var foreignFrameMonitor=(function(){var I="x";'
    'function R(){const a=e=>{if(!e.startsWith("chrome-extension://"))return null;'
    "try{const i=new URL(e).host;"
    "return i.length>0&&i!==chrome.runtime.id?i:null}catch{return null}};"
    "return a}return R()})();\n"
)


def varint(value: int) -> bytes:
    out = bytearray()
    while True:
        bits = value & 0x7F
        value >>= 7
        if value:
            out.append(bits | 0x80)
        else:
            out.append(bits)
            return bytes(out)


def crx3(public_key: bytes, files: dict[str, bytes]) -> bytes:
    proof = b"\x0a" + varint(len(public_key)) + public_key + b"\x12\x00"
    header = b"\x0a\x00" + b"\x12" + varint(len(proof)) + proof
    import io

    payload = io.BytesIO()
    with zipfile.ZipFile(payload, "w") as archive:
        for name, content in files.items():
            archive.writestr(name, content)
    return b"Cr24" + struct.pack("<II", 3, len(header)) + header + payload.getvalue()


def extension_id(public_key: bytes) -> str:
    digest = hashlib.sha256(public_key).digest()[:16]
    return "".join(
        chr(ord("a") + ((b >> 4) & 15)) + chr(ord("a") + (b & 15)) for b in digest
    )


def fake_extension(directory: Path) -> None:
    (directory / "content-scripts").mkdir(parents=True)
    (directory / "manifest.json").write_text(
        json.dumps({"manifest_version": 3, "name": "ChatGPT", "version": "0.0.1"})
    )
    (directory / "content-scripts" / "foreign-frame-monitor.js").write_text(MONITOR)


class PatchExtensionTests(unittest.TestCase):
    def run_script(self, *args: str, out: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["sh", str(SCRIPT), "--out", str(out), *args],
            text=True,
            capture_output=True,
        )

    def test_crx_source_patches_monitor_and_pins_key(self):
        key = bytes(range(256)) + bytes(range(38))
        with tempfile.TemporaryDirectory() as directory:
            tmp = Path(directory)
            source = tmp / "source"
            fake_extension(source)
            crx = tmp / "ext.crx"
            files = {
                "manifest.json": (source / "manifest.json").read_bytes(),
                "content-scripts/foreign-frame-monitor.js": MONITOR.encode(),
            }
            crx.write_bytes(crx3(key, files))
            out = tmp / "unpacked"

            result = self.run_script(
                str(crx), "--expected-id", extension_id(key), out=out
            )
            self.assertEqual(result.returncode, 0, result.stderr)

            monitor = (out / "content-scripts" / "foreign-frame-monitor.js").read_text()
            self.assertIn("CODEX_ALLOWED_FOREIGN_EXTENSIONS", monitor)
            for allowed in (
                "aeblfdkhhhdcdjpifhhbdiojplfjncoa",
                "khgocmkkpikpnmmkgmdnfckapcdkgfaf",
                "gejiddohjgogedgjnonbofjigllpkmbf",
            ):
                self.assertIn(allowed, monitor)
            # Blanking logic for non-exempt frames is untouched.
            self.assertIn("chrome.runtime.id", monitor)

            manifest = json.loads((out / "manifest.json").read_text())
            self.assertEqual(manifest["key"], base64.b64encode(key).decode())
            self.assertEqual(
                extension_id(base64.b64decode(manifest["key"])),
                extension_id(key),
            )

            # Second run is idempotent.
            again = self.run_script(
                str(crx), "--expected-id", extension_id(key), out=tmp / "unpacked2"
            )
            self.assertEqual(again.returncode, 0, again.stderr)

    def test_changed_shape_fails_loudly(self):
        with tempfile.TemporaryDirectory() as directory:
            tmp = Path(directory)
            source = tmp / "source"
            fake_extension(source)
            (source / "content-scripts" / "foreign-frame-monitor.js").write_text(
                "// rewritten upstream: no known frame check here\n"
            )
            crx = tmp / "ext.crx"
            crx.write_bytes(
                crx3(
                    b"k" * 294,
                    {
                        "manifest.json": (source / "manifest.json").read_bytes(),
                        "content-scripts/foreign-frame-monitor.js": (
                            source / "content-scripts" / "foreign-frame-monitor.js"
                        ).read_bytes(),
                    },
                )
            )
            result = self.run_script(
                str(crx),
                "--expected-id",
                extension_id(b"k" * 294),
                out=tmp / "unpacked",
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("changed shape", result.stderr)
            self.assertFalse((tmp / "unpacked").exists())


if __name__ == "__main__":
    unittest.main()
