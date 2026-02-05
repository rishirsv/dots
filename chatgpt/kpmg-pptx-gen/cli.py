from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict

from extractor.codegen import TemplateConfig, write_template_files


def _read_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text())


def _which(cmd: str) -> str:
    p = shutil.which(cmd)
    if not p:
        raise RuntimeError(f"Missing required executable: {cmd}")
    return p


def cmd_extract(args: argparse.Namespace) -> int:
    template_dir = Path(args.template)
    pptx_path = Path(args.pptx)
    cfg = TemplateConfig(template_dir=template_dir, pptx_path=pptx_path, schema_version=args.schema_version)
    out = write_template_files(cfg)
    print(str(out["template_json"]))
    print(str(out["template_js"]))
    return 0


def cmd_validate(args: argparse.Namespace) -> int:
    node = _which("node")
    deck = Path(args.infile)
    template_dir = Path(args.template).resolve()
    p = subprocess.run(
        [node, "generator/validate.js", "--in", str(deck.resolve())],
        cwd=str(template_dir),
        capture_output=True,
        text=True,
    )
    sys.stdout.write(p.stdout)
    sys.stderr.write(p.stderr)
    return p.returncode


def cmd_generate(args: argparse.Namespace) -> int:
    node = _which("node")
    deck = Path(args.infile)
    out = Path(args.outfile)
    out.parent.mkdir(parents=True, exist_ok=True)

    p = subprocess.run(
        [node, "generator/index.js", "--in", str(deck.resolve()), "--out", str(out.resolve())],
        cwd=str(Path(args.template).resolve()),
        capture_output=True,
        text=True,
    )
    sys.stdout.write(p.stdout)
    sys.stderr.write(p.stderr)
    return p.returncode


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="KPMGPTX Gen CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_extract = sub.add_parser("extract", help="Generate template.js + template.json")
    p_extract.add_argument("--template", required=True, help="Template directory (e.g. templates/kpmg-diligence)")
    p_extract.add_argument("--pptx", required=True, help="Source template pptx path")
    p_extract.add_argument("--schema-version", default="3.0")
    p_extract.set_defaults(fn=cmd_extract)

    p_validate = sub.add_parser("validate", help="Validate a content JSON deck spec")
    p_validate.add_argument(
        "--template",
        default="templates/kpmg-diligence",
        help="Template project directory (contains generator/ and template.js).",
    )
    p_validate.add_argument("--in", dest="infile", required=True)
    p_validate.set_defaults(fn=cmd_validate)

    p_generate = sub.add_parser("generate", help="Generate a pptx from a content JSON deck spec")
    p_generate.add_argument(
        "--template",
        default="templates/kpmg-diligence",
        help="Template project directory (contains generator/ and template.js).",
    )
    p_generate.add_argument("--in", dest="infile", required=True)
    p_generate.add_argument("--out", dest="outfile", required=True)
    p_generate.set_defaults(fn=cmd_generate)

    return p


def main(argv: list[str]) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.fn(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
