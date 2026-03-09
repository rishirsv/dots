"""Text and paragraph formatting helpers for python-pptx shapes."""

from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Pt


def clear_bullets(paragraph):
    """Remove bullet formatting from a paragraph."""

    pPr = paragraph._p.get_or_add_pPr()
    bu_none = OxmlElement("a:buNone")
    # Remove existing bullet children then insert buNone
    for child in list(pPr):
        if child.tag.endswith("buNone") or child.tag.endswith("buFont") or child.tag.endswith("buChar"):
            pPr.remove(child)
    pPr.insert(0, bu_none)


def apply_paragraph_formatting(paragraph, config):
    """Apply paragraph-level formatting.

    Config keys (all optional unless specified):
      - bullet (bool): enable bullets. If False/absent bullets are cleared.
      - level (int): indent level, required when bullet is True.
      - alignment (str): "LEFT", "CENTER", "RIGHT", "JUSTIFY".
      - space_before (float): points
      - space_after (float): points
      - line_spacing (float): points

    Example::

        apply_paragraph_formatting(paragraph, {"bullet": False, "alignment": "LEFT"})
    """

    bullet = config.get("bullet")
    if bullet:
        paragraph.level = config.get("level", 0)
    else:
        clear_bullets(paragraph)

    alignment = config.get("alignment")
    if alignment:
        paragraph.alignment = getattr(PP_ALIGN, alignment.upper(), None)

    if "space_before" in config:
        paragraph.space_before = Pt(config["space_before"])
    if "space_after" in config:
        paragraph.space_after = Pt(config["space_after"])
    if "line_spacing" in config:
        paragraph.line_spacing = Pt(config["line_spacing"])


def apply_text_formatting(run, config):
    """Apply run-level formatting.

    Config keys (all optional):
      - font_name (str)
      - font_size (float, points)
      - bold (bool)
      - italic (bool)
      - underline (bool)
      - color (str): hex RGB (e.g., "00338D")

    Example::

        apply_text_formatting(run, {"font_name": "Arial", "font_size": 12, "bold": True, "color": "00338D"})
    """

    font = run.font

    if "font_name" in config:
        font.name = config["font_name"]
    if "font_size" in config:
        font.size = Pt(config["font_size"])
    if "bold" in config:
        font.bold = bool(config["bold"])
    if "italic" in config:
        font.italic = bool(config["italic"])
    if "underline" in config:
        font.underline = bool(config["underline"])

    color = config.get("color")
    if color:
        color = color.lstrip("#")
        rgb = RGBColor.from_string(color)
        font.color.rgb = rgb


__all__ = ["clear_bullets", "apply_paragraph_formatting", "apply_text_formatting"]
