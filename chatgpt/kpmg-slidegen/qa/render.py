from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _which(cmd: str) -> str:
    p = shutil.which(cmd)
    if not p:
        raise RuntimeError(f"Missing required executable: {cmd}")
    return p


def render_pptx_to_pngs(pptx_path: Path, out_dir: Path) -> None:
    """
    Render PPTX to per-slide PNGs using LibreOffice (soffice).

    This is an optional QA utility; it depends on external binaries and is not
    required for core extraction/generation logic.
    """
    soffice = _which("soffice")
    out_dir.mkdir(parents=True, exist_ok=True)

    # LibreOffice exports to PNG with --convert-to png
    subprocess.check_call(
        [soffice, "--headless", "--convert-to", "png", "--outdir", str(out_dir), str(pptx_path)]
    )


def render_pptx_to_pdf(pptx_path: Path, out_dir: Path) -> Path:
    """
    Convert PPTX to PDF using LibreOffice (soffice).
    Returns the produced PDF path.
    """
    soffice = _which("soffice")
    out_dir.mkdir(parents=True, exist_ok=True)

    subprocess.check_call(
        [soffice, "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), str(pptx_path)]
    )
    pdf_path = out_dir / (pptx_path.stem + ".pdf")
    if not pdf_path.exists():
        raise RuntimeError(f"Expected PDF not found: {pdf_path}")
    return pdf_path


def render_pdf_to_pngs(
    pdf_path: Path,
    out_dir: Path,
    *,
    prefix: str = "slide",
    dpi: int | None = None,
) -> list[Path]:
    """
    Render PDF pages to PNGs using poppler's `pdftoppm`.

    This avoids formats like PPM (unsupported by many viewers) and produces one PNG per slide.
    """
    pdftoppm = _which("pdftoppm")
    out_dir.mkdir(parents=True, exist_ok=True)

    cmd = [pdftoppm, "-png"]
    if dpi:
        cmd.extend(["-r", str(dpi)])
    cmd.extend([str(pdf_path), str(out_dir / prefix)])
    subprocess.check_call(cmd)
    return sorted(out_dir.glob(f"{prefix}-*.png"))


def render_pptx_to_pngs_via_pdf(
    pptx_path: Path, out_dir: Path, *, dpi: int | None = None, prefix: str = "slide"
) -> list[Path]:
    """
    End-to-end: PPTX -> PDF -> per-slide PNGs.

    Preferred for review/diffing because it yields deterministic, viewer-friendly outputs.
    """
    pdf = render_pptx_to_pdf(pptx_path, out_dir.parent)
    return render_pdf_to_pngs(pdf, out_dir, prefix=prefix, dpi=dpi)
