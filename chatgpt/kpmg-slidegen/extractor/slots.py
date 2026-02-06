from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from .elements import ElementRef, extract_part_elements
from .part_graph import PartGraph


@dataclass(frozen=True)
class SlideSlot:
    slide_index: int
    layout_name: str
    slot_type: str


@dataclass(frozen=True)
class SlotClassification:
    slot_id: str
    slot_type: str
    element: ElementRef


@dataclass(frozen=True)
class LayoutSlots:
    layout_name: str
    slots: Dict[str, SlotClassification]
    static_elements: List[ElementRef]


LAYOUT_NAME_TO_SLOT: Dict[str, str] = {
    "Cover page_Right Horizontal Window": "cover",
    "Divider slide_5": "divider",
    "Two columns text": "twoColumnText",
    "Transmittal letter": "transmittalLetter",
    "Summary financials_3": "summaryFinancials",
    "Key findings_2 per page_text only": "keyFindingsTextOnly",
    "Analysis_narrow table": "analysisNarrowTable",
    "Analysis_narrow table+chart": "analysisNarrowTableChart",
    "Analysis_narrow table+2 col text+chart": "analysisNarrowTable2ColTextChart",
    "Analysis_50-50 table+text": "analysis50_50TableText",
    "Analysis_50-50 table+text+chart": "analysis50_50TableTextChart",
    "Analysis_2 columns text": "analysis2ColumnsText",
    "Analysis_wide chart + 2 cols text": "analysisWideChart2ColsText",
    "Analysis_wide chart+table+text": "analysisWideChartTableText",
    "Title only": "titleOnly",
    "Title and strapline only": "titleStraplineOnly",
    "Title+strapline+4 text boxes": "titleStrapline4TextBoxes",
    "Basis of preparation": "basisOfPreparation",
    "Back cover_2": "backCover",
}


def classify_element(element: ElementRef) -> Optional[str]:
    if element.kind == "chart":
        return "chart"
    if element.kind == "table":
        return "table"
    if element.kind == "image":
        return "image"
    if element.kind == "text":
        return "text"
    return None


def classify_layout_name(layout_name: str) -> str:
    if layout_name in LAYOUT_NAME_TO_SLOT:
        return LAYOUT_NAME_TO_SLOT[layout_name]

    # Conservative heuristics.
    name = (layout_name or "").lower()
    if "cover" in name:
        return "cover"
    if "divider" in name:
        return "divider"
    if "two columns" in name:
        return "twoColumnText"
    if name.startswith("analysis_"):
        return "analysis"
    if "back cover" in name:
        return "backCover"
    return "unknown"


def detect_slots(graph: PartGraph) -> List[SlideSlot]:
    slots: List[SlideSlot] = []
    for s in graph.slides:
        slots.append(SlideSlot(slide_index=s.index, layout_name=s.layout_name, slot_type=classify_layout_name(s.layout_name)))
    return slots


def slots_by_type(slots: List[SlideSlot]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for s in slots:
        counts[s.slot_type] = counts.get(s.slot_type, 0) + 1
    return counts


def _element_sort_key(element: ElementRef) -> Tuple[float, float, str]:
    if element.bbox:
        return (element.bbox.y, element.bbox.x, element.name)
    return (1e9, 1e9, element.name)


def detect_layout_slots(elements: Iterable[ElementRef], layout_name: str) -> LayoutSlots:
    slots: Dict[str, SlotClassification] = {}
    static_elements: List[ElementRef] = []
    type_counts: Dict[str, int] = {}

    for element in sorted(elements, key=_element_sort_key):
        slot_type = classify_element(element)
        if slot_type is None:
            static_elements.append(element)
            continue

        type_counts[slot_type] = type_counts.get(slot_type, 0) + 1
        count = type_counts[slot_type]
        slot_id = slot_type if count == 1 else f"{slot_type}_{count}"
        slots[slot_id] = SlotClassification(slot_id=slot_id, slot_type=slot_type, element=element)

    return LayoutSlots(layout_name=layout_name, slots=slots, static_elements=static_elements)


def detect_layout_slots_for_layout(pptx_path: Path, layout_path: str, layout_name: str) -> LayoutSlots:
    elements = extract_part_elements(pptx_path, layout_path)
    return detect_layout_slots(elements, layout_name)


def detect_all_layout_slots(pptx_path: Path) -> Dict[str, LayoutSlots]:
    # Build graph lazily to avoid circular import at module load.
    from .part_graph import build_part_graph

    graph = build_part_graph(pptx_path)
    layouts: Dict[str, LayoutSlots] = {}
    for layout_path, layout_ref in graph.layouts.items():
        layouts[layout_ref.name] = detect_layout_slots_for_layout(pptx_path, layout_path, layout_ref.name)
    return layouts
