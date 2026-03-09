"""Pagination utilities for glossary and slide content.

This module provides height-based estimation for packing glossary items
into slides with adaptive row heights. Each column has a pixel height
budget, and items are packed until the budget is exhausted.

Python 3.9+ compatible.
"""

from typing import Any, Dict, List, Tuple, Union

# Calibration values for KPMG glossary template (measured from template)
GLOSSARY_PAGINATION_DEFAULTS = {
    # Column dimensions
    'col_width_pt': 276,            # Definition column width in points
    'font_size_pt': 10,             # Font size in points (matches glossary formatting)

    # Table dimensions
    'left_table_height_pt': 416.9,  # Left table total height
    'right_table_height_pt': 438.5, # Right table total height
    'header_height_pt': 21.3,       # Header row height
    'left_max_rows': 17,            # Max data rows in left table
    'right_max_rows': 18,           # Max data rows in right table

    # Text metrics
    'char_width_multiplier': 0.55,  # char_width = font_size * this
    'line_height_multiplier': 1.2,  # line_height = font_size * this
    'row_padding_pt': 4,            # Extra padding per row
    'min_row_height_pt': 15,        # Minimum row height
}


def _estimate_item_height_pt(
    definition: str,
    col_width_pt: float = GLOSSARY_PAGINATION_DEFAULTS['col_width_pt'],
    font_size_pt: float = GLOSSARY_PAGINATION_DEFAULTS['font_size_pt'],
) -> float:
    """Estimate row height in points needed to display a definition.

    Args:
        definition: The definition text.
        col_width_pt: Column width in points.
        font_size_pt: Font size in points.

    Returns:
        Estimated height in points needed to display the text.
    """
    if not definition:
        return GLOSSARY_PAGINATION_DEFAULTS['min_row_height_pt']

    char_width = font_size_pt * GLOSSARY_PAGINATION_DEFAULTS['char_width_multiplier']
    chars_per_line = int(col_width_pt / char_width)
    lines = max(1, -(-len(definition) // chars_per_line))  # Ceiling division

    line_height = font_size_pt * GLOSSARY_PAGINATION_DEFAULTS['line_height_multiplier']
    height = lines * line_height + GLOSSARY_PAGINATION_DEFAULTS['row_padding_pt']

    return max(height, GLOSSARY_PAGINATION_DEFAULTS['min_row_height_pt'])


def _extract_term_def(item) -> Tuple[str, str]:
    """Extract term and definition from item, supporting dict or tuple format."""
    if isinstance(item, dict):
        return item.get('term', ''), item.get('definition', '')
    elif isinstance(item, (list, tuple)) and len(item) >= 2:
        return str(item[0]), str(item[1])
    return '', ''


def _pack_column(
    items: List[Any],
    available_height_pt: float,
    max_rows: int = None,
) -> Tuple[List[Tuple[Any, float]], float]:
    """Pack items into a column until height budget or row limit is exhausted.

    Args:
        items: List of items to pack (will not be modified).
        available_height_pt: Height budget in points.
        max_rows: Maximum number of rows (items) allowed in this column.

    Returns:
        Tuple of (list of (item, height) pairs, total height used).
    """
    packed = []
    used_height = 0.0

    for item in items:
        # Check row limit
        if max_rows is not None and len(packed) >= max_rows:
            break

        _, definition = _extract_term_def(item)
        height = _estimate_item_height_pt(definition)

        if used_height + height <= available_height_pt:
            packed.append((item, height))
            used_height += height
        else:
            break

    return packed, used_height


def paginate_glossary_items(
    items: List[Dict[str, Any]],
    left_table_height_pt: float = None,
    right_table_height_pt: float = None,
) -> List[Dict[str, List[Tuple[Any, float]]]]:
    """Split glossary items across pages using height-based column packing.

    Uses pixel height budgets per column to pack items. Each item's row
    height is estimated based on definition length, allowing adaptive
    row heights that ensure all text is visible.

    Args:
        items: List of {'term': str, 'definition': str} dicts or (term, def) tuples.
        left_table_height_pt: Height budget for left column (default from template).
        right_table_height_pt: Height budget for right column (default from template).

    Returns:
        List of pages, where each page is a dict with 'left' and 'right' keys,
        each containing a list of (item, height_pt) tuples.

    Example:
        >>> items = [{'term': 'API', 'definition': 'Application Programming Interface'}]
        >>> pages = paginate_glossary_items(items)
        >>> len(pages)
        1
        >>> len(pages[0]['left']) + len(pages[0]['right'])
        1
    """
    if not items:
        return []

    # Use defaults if not specified
    if left_table_height_pt is None:
        left_table_height_pt = (
            GLOSSARY_PAGINATION_DEFAULTS['left_table_height_pt']
            - GLOSSARY_PAGINATION_DEFAULTS['header_height_pt']
        )
    if right_table_height_pt is None:
        right_table_height_pt = (
            GLOSSARY_PAGINATION_DEFAULTS['right_table_height_pt']
            - GLOSSARY_PAGINATION_DEFAULTS['header_height_pt']
        )

    left_max_rows = GLOSSARY_PAGINATION_DEFAULTS['left_max_rows']
    right_max_rows = GLOSSARY_PAGINATION_DEFAULTS['right_max_rows']

    pages: List[Dict[str, List[Tuple[Any, float]]]] = []
    remaining = list(items)

    while remaining:
        # Pack left column (respecting both height and row limits)
        left_packed, _ = _pack_column(remaining, left_table_height_pt, left_max_rows)
        remaining = remaining[len(left_packed):]

        # Pack right column (respecting both height and row limits)
        right_packed, _ = _pack_column(remaining, right_table_height_pt, right_max_rows)
        remaining = remaining[len(right_packed):]

        # Handle edge case: item too tall for column (force it)
        if not left_packed and not right_packed and remaining:
            item = remaining.pop(0)
            _, definition = _extract_term_def(item)
            height = _estimate_item_height_pt(definition)
            left_packed = [(item, height)]

        if left_packed or right_packed:
            pages.append({
                'left': left_packed,
                'right': right_packed,
            })

    return pages


# Legacy function for backwards compatibility with tests
def _estimate_item_rows(
    term: str,
    definition: str,
    chars_per_line: int = 55,
    term_chars_per_line: int = 20,
) -> int:
    """Legacy: Estimate rows needed (for backwards compatibility).

    Note: This function is deprecated. Use _estimate_item_height_pt instead.
    """
    term_lines = max(1, -(-len(term) // term_chars_per_line))
    definition_lines = max(1, -(-len(definition) // chars_per_line))
    return max(term_lines, definition_lines)
