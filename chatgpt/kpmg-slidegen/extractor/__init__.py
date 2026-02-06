"""
Extraction utilities for KPMGPTX Gen.

This package focuses on reading a PPTX template and extracting the minimal,
stable information needed to generate new decks via PptxGenJS.
"""

from .resolvers import ThemeResolver, build_resolver
from .gradients import extract_gradient
from .part_graph import PartGraph, build_part_graph, get_used_layouts
from .gradient_renderer import render_linear_gradient, inches_to_pixels
from .geometry import BBox, Transform, emu_to_inches, inches_to_emu
from .elements import ElementRef, extract_part_elements
from .assets import ExportedAsset, export_media
from .slots import (
    LayoutSlots,
    SlideSlot,
    SlotClassification,
    classify_element,
    classify_layout_name,
    detect_all_layout_slots,
    detect_layout_slots,
    detect_layout_slots_for_layout,
    detect_slots,
    slots_by_type,
)
from .layout_geometry import LayoutGeometry, extract_all_layout_geometry, infer_layout_geometry
from .codegen import TemplateConfig, write_template_files

__all__ = [
    "ThemeResolver",
    "build_resolver",
    "extract_gradient",
    "render_linear_gradient",
    "inches_to_pixels",
    "PartGraph",
    "build_part_graph",
    "get_used_layouts",
    "BBox",
    "Transform",
    "emu_to_inches",
    "inches_to_emu",
    "ElementRef",
    "extract_part_elements",
    "ExportedAsset",
    "export_media",
    "SlideSlot",
    "SlotClassification",
    "LayoutSlots",
    "classify_element",
    "classify_layout_name",
    "detect_slots",
    "detect_layout_slots",
    "detect_layout_slots_for_layout",
    "detect_all_layout_slots",
    "slots_by_type",
    "LayoutGeometry",
    "infer_layout_geometry",
    "extract_all_layout_geometry",
    "TemplateConfig",
    "write_template_files",
]
