from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

EMU_PER_INCH = 914400
EMU_PER_PT = 12700


def emu_to_inches(emu: int) -> float:
    return float(emu) / EMU_PER_INCH


def inches_to_emu(inches: float) -> int:
    return int(round(float(inches) * EMU_PER_INCH))


def emu_to_points(emu: int) -> float:
    return float(emu) / EMU_PER_PT


@dataclass(frozen=True)
class BBox:
    x: float
    y: float
    w: float
    h: float
    rotation: float = 0.0

    @property
    def right(self) -> float:
        return self.x + self.w

    @property
    def bottom(self) -> float:
        return self.y + self.h

    def intersects(self, other: "BBox") -> bool:
        return not (self.right <= other.x or other.right <= self.x or self.bottom <= other.y or other.bottom <= self.y)

    def contains(self, other: "BBox") -> bool:
        return self.x <= other.x and self.y <= other.y and self.right >= other.right and self.bottom >= other.bottom


@dataclass(frozen=True)
class Transform:
    """
    Minimal 2D transform used for PPTX shape positioning.

    PowerPoint group transforms can include child offsets/extents (chOff/chExt),
    which are handled via `compose_group_transform`.
    """

    off_x: float = 0.0
    off_y: float = 0.0
    scale_x: float = 1.0
    scale_y: float = 1.0
    rotation_deg: float = 0.0

    def apply_point(self, x: float, y: float) -> Tuple[float, float]:
        return (self.off_x + x * self.scale_x, self.off_y + y * self.scale_y)

    def apply_bbox(self, bbox: BBox) -> BBox:
        x, y = self.apply_point(bbox.x, bbox.y)
        return BBox(x=x, y=y, w=bbox.w * self.scale_x, h=bbox.h * self.scale_y, rotation=bbox.rotation + self.rotation_deg)


def parse_xfrm_bbox(
    xfrm_el,
    *,
    rotation_unit: str = "drawingml",
) -> Optional[BBox]:
    """
    Parse an <a:xfrm> element into a BBox in inches.

    rotation_unit:
      - drawingml: 'rot' is in 1/60000ths of a degree.
    """
    if xfrm_el is None:
        return None

    off = xfrm_el.find("./{http://schemas.openxmlformats.org/drawingml/2006/main}off")
    ext = xfrm_el.find("./{http://schemas.openxmlformats.org/drawingml/2006/main}ext")
    if off is None or ext is None:
        return None

    try:
        x_emu = int(off.get("x"))
        y_emu = int(off.get("y"))
        cx_emu = int(ext.get("cx"))
        cy_emu = int(ext.get("cy"))
    except (TypeError, ValueError):
        return None

    rot = xfrm_el.get("rot")
    rot_deg = 0.0
    if rot:
        try:
            if rotation_unit == "drawingml":
                rot_deg = (int(rot) / 60000.0) % 360.0
            else:
                rot_deg = float(rot)
        except ValueError:
            rot_deg = 0.0

    return BBox(
        x=emu_to_inches(x_emu),
        y=emu_to_inches(y_emu),
        w=emu_to_inches(cx_emu),
        h=emu_to_inches(cy_emu),
        rotation=rot_deg,
    )


def compose_group_transform(group_xfrm_el) -> Transform:
    """
    Compute a Transform for child shapes within a group (<p:grpSp>).

    Uses the standard mapping:
      child_abs = group_off + (child - chOff) * (group_ext / chExt)
    """
    if group_xfrm_el is None:
        return Transform()

    ns = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
    off = group_xfrm_el.find(f"./{ns}off")
    ext = group_xfrm_el.find(f"./{ns}ext")
    ch_off = group_xfrm_el.find(f"./{ns}chOff")
    ch_ext = group_xfrm_el.find(f"./{ns}chExt")

    def _int_attr(el, key) -> Optional[int]:
        if el is None:
            return None
        v = el.get(key)
        if v is None:
            return None
        try:
            return int(v)
        except ValueError:
            return None

    off_x = _int_attr(off, "x") or 0
    off_y = _int_attr(off, "y") or 0
    ext_x = _int_attr(ext, "cx") or 0
    ext_y = _int_attr(ext, "cy") or 0

    ch_off_x = _int_attr(ch_off, "x") or 0
    ch_off_y = _int_attr(ch_off, "y") or 0
    ch_ext_x = _int_attr(ch_ext, "cx") or ext_x
    ch_ext_y = _int_attr(ch_ext, "cy") or ext_y

    sx = (ext_x / ch_ext_x) if ch_ext_x else 1.0
    sy = (ext_y / ch_ext_y) if ch_ext_y else 1.0

    # Convert to inches for the affine transform.
    off_x_in = emu_to_inches(off_x)
    off_y_in = emu_to_inches(off_y)
    ch_off_x_in = emu_to_inches(ch_off_x)
    ch_off_y_in = emu_to_inches(ch_off_y)

    return Transform(
        off_x=off_x_in - ch_off_x_in * sx,
        off_y=off_y_in - ch_off_y_in * sy,
        scale_x=sx,
        scale_y=sy,
        rotation_deg=0.0,
    )

