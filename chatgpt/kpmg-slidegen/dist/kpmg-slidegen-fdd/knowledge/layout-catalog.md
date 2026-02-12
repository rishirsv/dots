# Layout Catalog

Use these layout slugs as the allowed options.

## Core Layouts
- `layout.fdd_cover`
- `layout.fdd_agenda`
- `layout.fdd_key_takeaways`
- `layout.fdd_two_column_bullets`
- `layout.fdd_chart_left_content_right`
- `layout.fdd_table_left_content_right`
- `layout.fdd_one_column_narrative`

## Intent to Layout Guidance
- `cover` -> `layout.fdd_cover`
- `table_of_contents` -> `layout.fdd_agenda`
- `business_overview` -> `layout.fdd_two_column_bullets` or `layout.fdd_one_column_narrative`
- `qoe_adjustment_highlights` -> `layout.fdd_chart_left_content_right` or `layout.fdd_table_left_content_right`
- `working_capital_review` -> `layout.fdd_chart_left_content_right` or `layout.fdd_table_left_content_right`
- `customer_concentration` -> `layout.fdd_chart_left_content_right` or `layout.fdd_two_column_bullets`
- `revenue_bridge` -> `layout.fdd_chart_left_content_right`
- `payroll_appendix` -> `layout.fdd_table_left_content_right`
- `key_diligence_risks` -> `layout.fdd_two_column_bullets` or `layout.fdd_key_takeaways`
- `reporting_environment` -> `layout.fdd_two_column_bullets` or `layout.fdd_one_column_narrative`
- `appendix_support` -> `layout.fdd_table_left_content_right` or `layout.fdd_one_column_narrative`

## Slot Expectations
### `layout.fdd_chart_left_content_right`
- Left: primary visual (chart or chart placeholder).
- Right: interpretation, drivers, implications, and open diligence asks.

### `layout.fdd_table_left_content_right`
- Left: table/exhibit (or exact placeholder token).
- Right: analytical commentary explaining what matters in the table and what needs follow-up.

### `layout.fdd_two_column_bullets`
- Left: scope, definitions, baseline facts, and setup context.
- Right: findings, implications, risks, and required next steps.

### `layout.fdd_one_column_narrative`
- Body: ordered analysis from observation to implication to action.

## Selection Rule
Choose layout by analytical objective first, then by evidence shape (chart-like, table-like, or narrative-heavy), not by cosmetic preference.

## Pre-Draft Checks
Before writing slide copy:
1. Confirm the chosen layout can accommodate all required facts and placeholders.
2. Confirm title can be read quickly and does not require awkward wrapping.
3. Confirm there is a clear place for implications and follow-up asks.
