from __future__ import annotations

import binascii
import math
import struct
import zlib
from typing import List, Tuple


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB tuple.

    Accepts '#RRGGBB' or 'RRGGBB' (case-insensitive).
    """
    h = hex_color.strip().lstrip('#')
    if len(h) != 6:
        raise ValueError(f"hex_to_rgb expects 6 hex digits, got: {hex_color!r}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _hex_to_rgba(hex_color: str) -> Tuple[int, int, int, int]:
    """Convert hex to (R, G, B, A). Supports RRGGBB or RRGGBBAA."""
    h = hex_color.strip().lstrip('#')
    if len(h) == 6:
        r, g, b = hex_to_rgb(h)
        return (r, g, b, 255)
    if len(h) == 8:
        r = int(h[0:2], 16)
        g = int(h[2:4], 16)
        b = int(h[4:6], 16)
        a = int(h[6:8], 16)
        return (r, g, b, a)
    raise ValueError(f"Unsupported hex format (expected RRGGBB or RRGGBBAA): {hex_color!r}")


def inches_to_pixels(inches: float, dpi: int = 300) -> int:
    """Convert inches to pixels at given DPI."""
    return int(round(inches * dpi))


def _png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    crc = binascii.crc32(chunk_type)
    crc = binascii.crc32(data, crc) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)


def _encode_png(width_px: int, height_px: int, raw_scanlines: bytes, *, has_alpha: bool) -> bytes:
    # Color type: 2=RGB, 6=RGBA
    color_type = 6 if has_alpha else 2
    ihdr = struct.pack(">IIBBBBB", width_px, height_px, 8, color_type, 0, 0, 0)
    idat = zlib.compress(raw_scanlines, level=9)
    return (
        b"\x89PNG\r\n\x1a\n"
        + _png_chunk(b"IHDR", ihdr)
        + _png_chunk(b"IDAT", idat)
        + _png_chunk(b"IEND", b"")
    )


def _clamp01(x: float) -> float:
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    return x


def _lerp_u8(a: int, b: int, t: float) -> int:
    return int(round(a + (b - a) * t))


def _build_stop_table(stops: List[Tuple[float, str]]) -> Tuple[List[float], List[Tuple[int, int, int, int]], bool]:
    if len(stops) < 2:
        raise ValueError("stops must contain at least 2 entries")

    stops_sorted = sorted(stops, key=lambda s: float(s[0]))
    pos01: List[float] = []
    rgba: List[Tuple[int, int, int, int]] = []
    has_alpha = False

    for p, c in stops_sorted:
        p01 = float(p) / 100.0
        if p01 < 0.0 or p01 > 1.0:
            raise ValueError(f"Stop positions must be within 0-100, got: {stops_sorted!r}")
        r, g, b, a = _hex_to_rgba(c)
        pos01.append(p01)
        rgba.append((r, g, b, a))
        has_alpha = has_alpha or (a != 255)

    return pos01, rgba, has_alpha


def _color_at(t: float, pos01: List[float], rgba: List[Tuple[int, int, int, int]]) -> Tuple[int, int, int, int]:
    t = _clamp01(t)

    if len(pos01) == 2:
        p0, p1 = pos01[0], pos01[1]
        if p1 == p0:
            local = 0.0
        else:
            local = _clamp01((t - p0) / (p1 - p0))
        r0, g0, b0, a0 = rgba[0]
        r1, g1, b1, a1 = rgba[1]
        return (
            _lerp_u8(r0, r1, local),
            _lerp_u8(g0, g1, local),
            _lerp_u8(b0, b1, local),
            _lerp_u8(a0, a1, local),
        )

    # Piecewise interpolation for N stops.
    if t <= pos01[0]:
        return rgba[0]
    if t >= pos01[-1]:
        return rgba[-1]

    for i in range(len(pos01) - 1):
        p0 = pos01[i]
        p1 = pos01[i + 1]
        if p0 <= t <= p1:
            local = 0.0 if p1 == p0 else _clamp01((t - p0) / (p1 - p0))
            r0, g0, b0, a0 = rgba[i]
            r1, g1, b1, a1 = rgba[i + 1]
            return (
                _lerp_u8(r0, r1, local),
                _lerp_u8(g0, g1, local),
                _lerp_u8(b0, b1, local),
                _lerp_u8(a0, a1, local),
            )

    # Fallback (should be unreachable due to clamps).
    return rgba[-1]


def render_linear_gradient(
    width_px: int,
    height_px: int,
    stops: List[Tuple[float, str]],  # [(position 0-100, hex_color), ...]
    angle_deg: float = 0
) -> bytes:
    """Render a linear gradient to PNG bytes.

    Coordinate system:
      - (0,0) is top-left.
      - +X is right, +Y is down.
      - angle_deg increases clockwise (0 = left->right, 90 = top->bottom).

    Supports 2+ stops. Stops can be out-of-order; they will be sorted by position.

    Colors accept:
      - '#RRGGBB' / 'RRGGBB'
      - '#RRGGBBAA' / 'RRGGBBAA' (optional alpha)

    Returns:
      PNG bytes.
    """
    if width_px <= 0 or height_px <= 0:
        raise ValueError(f"Invalid size: {width_px}x{height_px}")

    # Prefer numpy+Pillow if available for large renders (significantly faster),
    # but keep a stdlib-only fallback for minimal environments (e.g. ChatGPT).
    try:
        import numpy as np  # type: ignore
        from PIL import Image  # type: ignore

        stops_sorted = sorted(stops, key=lambda s: s[0])
        pos = np.array([float(p) / 100.0 for p, _ in stops_sorted], dtype=np.float32)
        if np.any(pos < 0.0) or np.any(pos > 1.0):
            raise ValueError(f"Stop positions must be within 0-100, got: {stops_sorted!r}")

        rgba = np.array([_hex_to_rgba(c) for _, c in stops_sorted], dtype=np.float32)  # (n,4)

        theta = math.radians(angle_deg % 360.0)
        dx = math.cos(theta)
        dy = math.sin(theta)

        w1 = float(width_px - 1)
        h1 = float(height_px - 1)
        corner_proj = np.array([0.0, w1 * dx, h1 * dy, w1 * dx + h1 * dy], dtype=np.float32)
        p_min = float(corner_proj.min())
        p_max = float(corner_proj.max())
        denom = (p_max - p_min) if (p_max - p_min) != 0 else 1.0

        xs = np.arange(width_px, dtype=np.float32)
        ys = np.arange(height_px, dtype=np.float32)
        proj = ys[:, None] * np.float32(dy) + xs[None, :] * np.float32(dx)
        t = (proj - np.float32(p_min)) / np.float32(denom)
        t = np.clip(t, 0.0, 1.0)

        t_flat = t.ravel()

        if len(stops_sorted) == 2:
            p0, p1 = float(pos[0]), float(pos[1])
            c0, c1 = rgba[0], rgba[1]
            if p1 == p0:
                local = np.zeros_like(t_flat, dtype=np.float32)
            else:
                local = (t_flat - p0) / (p1 - p0)
            local = np.clip(local, 0.0, 1.0).astype(np.float32)

            out = (c0[None, :] + (c1 - c0)[None, :] * local[:, None]).astype(np.float32)
            out = np.clip(out, 0.0, 255.0)
            out_u8 = np.round(out).astype(np.uint8).reshape((height_px, width_px, 4))
        else:
            channels = []
            for ch in range(4):
                ch_vals = rgba[:, ch]
                channels.append(np.interp(t_flat, pos, ch_vals).astype(np.float32))
            out = np.stack(channels, axis=1)
            out = np.clip(out, 0.0, 255.0)
            out_u8 = np.round(out).astype(np.uint8).reshape((height_px, width_px, 4))

        if np.all(out_u8[..., 3] == 255):
            img = Image.fromarray(out_u8[..., :3], mode="RGB")
        else:
            img = Image.fromarray(out_u8, mode="RGBA")

        import io

        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return buf.getvalue()
    except ModuleNotFoundError:
        pass

    # ---- stdlib-only fallback ----
    pos01, rgba, has_alpha = _build_stop_table(stops)

    theta = math.radians(angle_deg % 360.0)
    dx = math.cos(theta)
    dy = math.sin(theta)

    w1 = float(width_px - 1)
    h1 = float(height_px - 1)
    corner_proj = (0.0, w1 * dx, h1 * dy, w1 * dx + h1 * dy)
    p_min = min(corner_proj)
    p_max = max(corner_proj)
    denom = (p_max - p_min) if (p_max - p_min) != 0.0 else 1.0

    # Common fast paths: 0/180 (depends only on x), 90/270 (depends only on y).
    eps = 1e-12
    if abs(dy) < eps:
        # horizontal
        x_bytes = bytearray()
        for x in range(width_px):
            t = ((x * dx) - p_min) / denom
            r, g, b, a = _color_at(t, pos01, rgba)
            x_bytes.extend((r, g, b, a) if has_alpha else (r, g, b))
        row = bytes([0]) + bytes(x_bytes)
        raw = row * height_px
        return _encode_png(width_px, height_px, raw, has_alpha=has_alpha)

    if abs(dx) < eps:
        # vertical
        raw = bytearray()
        for y in range(height_px):
            t = ((y * dy) - p_min) / denom
            r, g, b, a = _color_at(t, pos01, rgba)
            raw.append(0)
            if has_alpha:
                raw.extend((r, g, b, a) * width_px)
            else:
                raw.extend((r, g, b) * width_px)
        return _encode_png(width_px, height_px, bytes(raw), has_alpha=has_alpha)

    # General case (arbitrary angle).
    x_proj = [x * dx for x in range(width_px)]
    channels = 4 if has_alpha else 3
    raw = bytearray()
    for y in range(height_px):
        base = y * dy
        raw.append(0)
        for x in range(width_px):
            t = (base + x_proj[x] - p_min) / denom
            r, g, b, a = _color_at(t, pos01, rgba)
            if has_alpha:
                raw.extend((r, g, b, a))
            else:
                raw.extend((r, g, b))
    return _encode_png(width_px, height_px, bytes(raw), has_alpha=has_alpha)
