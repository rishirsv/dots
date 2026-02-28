from __future__ import annotations

import re
from math import ceil
from os.path import basename
from typing import Literal

from PIL import Image, ImageDraw, ImageFont, ImageOps


def _make_placeholder(w: int, h: int) -> Image.Image:
    """Create a visible placeholder tile with a light gray fill and a red X cross."""

    placeholder = Image.new("RGBA", (w, h), (220, 220, 220, 255))
    draw = ImageDraw.Draw(placeholder)
    line_color = (180, 0, 0, 255)
    draw.line([(0, 0), (placeholder.width - 1, placeholder.height - 1)], fill=line_color, width=3)
    draw.line([(placeholder.width - 1, 0), (0, placeholder.height - 1)], fill=line_color, width=3)
    return placeholder


def _natural_key(s: str) -> list[object]:
    """Key function for natural sorting (e.g., Slide2 before Slide10)."""

    parts: list[object] = []
    for part in re.split(r"(\d+)", s):
        parts.append(int(part) if part.isdigit() else part)
    return parts


def create_montage(
    input_files: list[str],
    output_file: str,
    *,
    num_col: int = 5,
    cell_w: int = 400,
    cell_h: int = 225,
    gap: int = 16,
    label_mode: Literal["number", "filename", "none"] = "number",
    fail_on_image_error: bool = False,
) -> None:
    """
    Build a montage with a fixed number of columns.

    Each cell has size `cell_w` x `cell_h`. Every input image is resized isotropically to
    fit inside the cell. `gap` controls spacing around and between cells (outer margin
    equals gap).

    Label behavior is controlled by `label_mode`:
    - "none": no labels are drawn
    - "number": draw a 1-based index beneath each image
    - "filename": draw the filename (no directory) beneath each image
    """

    if num_col <= 0:
        raise ValueError("num_col must be positive")
    if cell_w <= 0 or cell_h <= 0:
        raise ValueError("cell_w and cell_h must be positive")
    if not input_files:
        raise ValueError("input_files must not be empty")

    ordered_files = sorted(input_files, key=lambda p: _natural_key(basename(p)))
    labels = [basename(p) for p in ordered_files]

    images: list[Image.Image | None] = []
    for p in ordered_files:
        try:
            images.append(Image.open(p))
        except Exception:
            if fail_on_image_error:
                raise
            images.append(None)

    num_images = len(images)
    num_valid = sum(1 for im in images if im is not None)
    if num_valid == 0:
        raise ValueError("No valid images to render.")

    placeholder: Image.Image | None = None
    if num_valid < num_images:
        cell_size = round(min(cell_w, cell_h) * 0.6)
        placeholder = _make_placeholder(cell_size, cell_size)

    cols = num_col
    rows = ceil(num_images / cols)

    temp_canvas = Image.new("RGB", (10, 10), (255, 255, 255))
    temp_draw = ImageDraw.Draw(temp_canvas)

    try:
        font_size = max(12, min(36, int(cell_h * 0.12)))
        font = ImageFont.truetype("arial.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    draw_labels = label_mode != "none"
    label_height = 0
    if draw_labels:
        sample_text = "1" if label_mode == "number" else "Ag"
        lbbox = temp_draw.textbbox((0, 0), sample_text, font=font)
        label_height = ceil(lbbox[3] - lbbox[1]) + 6

    row_h = cell_h + label_height

    canvas_w = cols * cell_w + (cols + 1) * gap
    canvas_h = rows * row_h + (rows + 1) * gap
    canvas = Image.new("RGB", (canvas_w, canvas_h), (242, 242, 242))
    draw = ImageDraw.Draw(canvas)

    for idx, img in enumerate(images):
        col = idx % cols
        row = idx // cols

        x0 = gap + col * (cell_w + gap)
        y0 = gap + row * (row_h + gap)

        if label_mode == "number":
            label = str(idx + 1)
        elif label_mode == "filename":
            label = labels[idx]
        else:
            label = ""

        text_w = 0
        if draw_labels:
            bbox = draw.textbbox((0, 0), label, font=font)
            text_w = bbox[2] - bbox[0]

        if img is not None:
            resized = ImageOps.contain(
                img.convert("RGBA"),
                (cell_w, cell_h),
                method=Image.Resampling.LANCZOS,
            )
        else:
            if placeholder is None:
                raise RuntimeError("Unexpected image load failure without placeholder.")
            resized = placeholder

        paste_x = x0 + (cell_w - resized.width) // 2
        paste_y = y0 + (cell_h - resized.height) // 2
        canvas.paste(
            resized,
            (paste_x, paste_y),
            mask=resized.split()[3] if resized.mode == "RGBA" else None,
        )

        draw.rectangle(
            [paste_x - 1, paste_y - 1, paste_x + resized.width, paste_y + resized.height],
            outline=(160, 160, 160),
            width=1,
        )

        if draw_labels:
            tx = x0 + round((cell_w - text_w) / 2)
            ty = y0 + cell_h + 3
            draw.text((tx, ty), label, font=font, fill=(0, 0, 0))

    canvas.save(output_file)

