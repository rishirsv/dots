from __future__ import annotations

import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Optional

from .part_graph import PartGraph, build_part_graph


@dataclass(frozen=True)
class ExportedAsset:
    pptx_path: str  # internal path like ppt/media/image1.png
    out_path: Path  # filesystem path written


def export_media(
    pptx_file: Path,
    out_dir: Path,
    *,
    media_paths: Optional[Iterable[str]] = None,
) -> Dict[str, ExportedAsset]:
    """
    Export media blobs from a PPTX zip to `out_dir`.

    If media_paths is None, exports all media referenced in the part graph.
    Returns a mapping from internal PPTX path -> ExportedAsset.
    """
    out_dir.mkdir(parents=True, exist_ok=True)

    if media_paths is None:
        graph: PartGraph = build_part_graph(pptx_file)
        media_paths = sorted(graph.media.keys())

    exported: Dict[str, ExportedAsset] = {}
    with zipfile.ZipFile(pptx_file, "r") as zf:
        for internal in media_paths:
            filename = Path(internal).name
            out_path = out_dir / filename
            with zf.open(internal) as src, out_path.open("wb") as dst:
                shutil.copyfileobj(src, dst)
            exported[internal] = ExportedAsset(pptx_path=internal, out_path=out_path)

    return exported

