#!/usr/bin/env python3
"""
Generate reviewable scope files grouped for fast deletion decisions.

Outputs:
  docs/Scope Review/
    00-README.md
    01-core-financial.md
    02-balance-sheet-and-working-capital.md
    03-operational-and-analytics.md
    04-transaction-and-documentation.md
    05-niche-delete-candidates.md
    06-financial-services-specialty.md
    07-unmapped.md
    99-summary.md
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCOPE_LIBRARY = PROJECT_ROOT / "dist" / "scope-library.json"
SCOPE_BUCKETS = PROJECT_ROOT / "dist" / "scope-review-buckets.json"
OUT_DIR = PROJECT_ROOT / "docs" / "Scope Review"


GROUP_FILES = {
    "core_financial": "01-core-financial.md",
    "balance_sheet_wc": "02-balance-sheet-and-working-capital.md",
    "operational_analytics": "03-operational-and-analytics.md",
    "transaction_docs": "04-transaction-and-documentation.md",
    "niche_delete_candidates": "05-niche-delete-candidates.md",
    "financial_services": "06-financial-services-specialty.md",
    "unmapped": "07-unmapped.md",
}


DELETE_RECOMMEND_SECTION_REASONS = {
    "locked_box": "Niche deal mechanic; rarely part of reusable default scope.",
    "optional_fdd_procedures": "Explicitly optional procedures should not remain in baseline library.",
    "phase_2_post_bid_support": "Post-bid/phase-2 support is engagement-specific.",
    "purchase_and_sale_agreement": "Transaction legal-document support is deal-specific.",
    "assistance_with_transaction_documentation": "Transaction documentation support is deal-specific.",
    "vdd_report_review": "Sell-side/VDD support is deal-type specific.",
    "aspe_to_ifrs_us_gaap_assessment": "Accounting-framework conversion work is specialized and uncommon.",
    "phase_1_gaap_considerations": "Jurisdiction/framework-specific GAAP analysis is not reusable baseline.",
    "arr_drivers": "ARR-specific analytics apply only to some business models.",
    "waterfall_revenue_analysis": "Specialized claims-level analysis; not default for most deals.",
    "store_portfolio_analysis": "Specialized footprint analysis; only relevant to select targets.",
    "operational_cost_margin_assessment": "Deep operational benchmarking is usually optional scope.",
    "quality_of_revenue_and_receivables_and_cash_proof": "Specialized procedure family (cash-proof) for limited contexts.",
    "data_and_analytics": "Tool-heavy/specialized analytics package, typically optional.",
    "revenue_and_profitability_analysis_da": "Advanced analytics package, usually optional.",
    "customer_base_health_da": "Advanced analytics package, usually optional.",
    "marketing_and_advertising_performance_da": "Advanced analytics package, usually optional.",
    "operations_performance_da": "Advanced analytics package, usually optional.",
}


DELETE_RECOMMEND_TEXT_PATTERNS = {
    "sell-side due diligence advisor": "Sell-side specific framing reduces template neutrality.",
    "sell-side due diligence advisors": "Sell-side specific framing reduces template neutrality.",
    "potential buyers": "Buyer-facing packaging language, not baseline reusable scope.",
    "powerbi": "Tool-specific deliverable language should be removed or neutralized.",
    "power bi": "Tool-specific deliverable language should be removed or neutralized.",
    "powerpoint": "Tool-specific deliverable language should be removed or neutralized.",
    "data cube": "Tool/output packaging language should be removed or neutralized.",
    "r&w insurers": "Deal-process specific support is not reusable baseline scope.",
}


def _escape(text: str) -> str:
    return " ".join(text.replace("|", "\\|").split())


def _render_children(children: list[dict], depth: int = 0) -> list[str]:
    lines: list[str] = []
    indent = "  " * depth
    for child in children:
        if not isinstance(child, dict):
            continue
        text = str(child.get("text", "")).strip()
        if not text:
            continue
        lines.append(f"{indent}- {text}")
        nested = child.get("children")
        if isinstance(nested, list) and nested:
            lines.extend(_render_children(nested, depth + 1))
    return lines


def _recommendation(section_key: str, text: str) -> tuple[str, str]:
    reasons: list[str] = []
    if section_key in DELETE_RECOMMEND_SECTION_REASONS:
        reasons.append(DELETE_RECOMMEND_SECTION_REASONS[section_key])

    lowered = text.lower()
    for pattern, reason in DELETE_RECOMMEND_TEXT_PATTERNS.items():
        if pattern in lowered:
            reasons.append(reason)

    if reasons:
        return "REC_DELETE", "; ".join(dict.fromkeys(reasons))
    return "REC_KEEP", ""


def _group_for(section_key: str, section_to_bucket: dict[str, str]) -> str:
    if section_key in DELETE_RECOMMEND_SECTION_REASONS:
        return "niche_delete_candidates"

    bucket = section_to_bucket.get(section_key)
    if bucket == "core_financial_performance":
        return "core_financial"
    if bucket == "balance_sheet_analysis":
        return "balance_sheet_wc"
    if bucket == "operational_and_commercial_analysis":
        return "operational_analytics"
    if bucket == "transaction_support_and_reporting":
        return "transaction_docs"
    if bucket == "financial_services_specialty_analysis":
        return "financial_services"
    return "unmapped"


def main() -> None:
    scope_library = json.loads(SCOPE_LIBRARY.read_text(encoding="utf-8"))
    scope_buckets = json.loads(SCOPE_BUCKETS.read_text(encoding="utf-8"))
    section_to_bucket: dict[str, str] = scope_buckets.get("section_to_bucket", {})

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    rows_by_group: dict[str, list[dict[str, str]]] = defaultdict(list)
    row_index = 0

    for section in scope_library.get("common_skeleton", []):
        section_key = section.get("normalized_heading", "")
        section_label = section.get("heading", section_key)
        group = _group_for(section_key, section_to_bucket)
        for bullet in section.get("default_bullets", []):
            if not isinstance(bullet, dict):
                continue
            bullet_id = bullet.get("id", "")
            text = bullet.get("text", "")
            rec, reason = _recommendation(section_key, text)
            row_index += 1
            rows_by_group[group].append(
                {
                    "row": str(row_index),
                    "action": "ACTION_KEEP",
                    "recommendation": rec,
                    "industry": "common",
                    "section": section_key,
                    "section_label": section_label,
                    "bullet_id": bullet_id,
                    "text": text,
                    "reason": reason,
                    "path": f"common.{section_key}.{bullet_id}",
                    "children": bullet.get("children", []),
                }
            )

    for industry, module in scope_library.get("industry_modules", {}).items():
        for section_key, bullets in module.items():
            group = _group_for(section_key, section_to_bucket)
            for bullet in bullets:
                if not isinstance(bullet, dict):
                    continue
                bullet_id = bullet.get("id", "")
                text = bullet.get("text", "")
                rec, reason = _recommendation(section_key, text)
                row_index += 1
                rows_by_group[group].append(
                    {
                        "row": str(row_index),
                        "action": "ACTION_KEEP",
                        "recommendation": rec,
                        "industry": industry,
                        "section": section_key,
                        "section_label": section_key.replace("_", " ").title(),
                        "bullet_id": bullet_id,
                        "text": text,
                    "reason": reason,
                    "path": f"{industry}.{section_key}.{bullet_id}",
                    "children": bullet.get("children", []),
                }
            )

    # Write README with marker instructions.
    readme_lines = [
        "# Scope Review Workflow",
        "",
        "This folder is generated from `dist/scope-library.json`.",
        "",
        "## How To Review",
        "",
        "1. Review files group by group.",
        "2. Keep `ACTION_KEEP` for anything to retain.",
        "3. Change `ACTION_KEEP` to `ACTION_DELETE` for anything you want removed.",
        "4. Ignore `REC_*` if you disagree; it is only an assistant recommendation.",
        "",
        "## Marker Definitions",
        "",
        "- `ACTION_KEEP`: reviewer keeps item (default)",
        "- `ACTION_DELETE`: reviewer approves deletion",
        "- `REC_KEEP`: assistant recommends keeping",
        "- `REC_DELETE`: assistant recommends deletion",
        "",
        "## Scan Command (for next step)",
        "",
        "```bash",
        "rg -n \"ACTION_DELETE\" \"docs/Scope Review\"",
        "```",
        "",
        "The deletion pass should only remove rows marked `ACTION_DELETE`.",
    ]
    (OUT_DIR / "00-README.md").write_text("\n".join(readme_lines) + "\n", encoding="utf-8")

    # Write grouped files (organized by industry -> section -> scope id).
    group_counts: Counter[str] = Counter()
    rec_delete_count = 0
    for group, filename in GROUP_FILES.items():
        rows = rows_by_group.get(group, [])
        group_counts[group] = len(rows)
        rec_delete_count += sum(1 for r in rows if r["recommendation"] == "REC_DELETE")

        lines = [
            f"# {filename.replace('.md', '').split('-', 1)[1].replace('-', ' ').title()}",
            "",
            f"Rows in this file: **{len(rows)}**",
            "",
            "Review format: grouped by `industry -> section -> scope item` so each item shows full sub-bullet context.",
            "Change `ACTION_KEEP` to `ACTION_DELETE` on any item you want removed.",
            "",
        ]

        grouped: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
        for r in rows:
            grouped[(r["industry"], r["section"])].append(r)

        def _group_sort_key(key: tuple[str, str]) -> tuple[int, str, int]:
            industry, _section = key
            min_row = min(int(item["row"]) for item in grouped[key])
            if industry == "common":
                return (0, "", min_row)
            return (1, industry, min_row)

        ordered_keys = sorted(grouped.keys(), key=_group_sort_key)
        common_keys = [k for k in ordered_keys if k[0] == "common"]
        industry_keys = [k for k in ordered_keys if k[0] != "common"]

        if common_keys:
            lines.append("## Common (Review First)")
            lines.append("")
        for (industry, section) in common_keys:
            section_rows = grouped[(industry, section)]
            lines.append(f"## `{industry}` / `{section}`")
            lines.append("")
            lines.append(f"Top-level items in section: **{len(section_rows)}**")
            lines.append("")

            for r in section_rows:
                lines.append(f"### Row {r['row']} — `{r['bullet_id']}`")
                lines.append(f"- Action: `{r['action']}`")
                lines.append(f"- Recommendation: `{r['recommendation']}`")
                lines.append(f"- Path: `{r['path']}`")
                if r["reason"]:
                    lines.append(f"- Reason: {r['reason']}")
                lines.append(f"- Top-level text: {r['text']}")
                children = r.get("children")
                if isinstance(children, list) and children:
                    lines.append("- Sub-bullets:")
                    lines.extend(_render_children(children, 1))
                else:
                    lines.append("- Sub-bullets: _(none)_")
                lines.append("")

        if industry_keys:
            lines.append("## Industry-Specific Sections")
            lines.append("")
        for (industry, section) in industry_keys:
            section_rows = grouped[(industry, section)]
            lines.append(f"## `{industry}` / `{section}`")
            lines.append("")
            lines.append(f"Top-level items in section: **{len(section_rows)}**")
            lines.append("")

            for r in section_rows:
                lines.append(f"### Row {r['row']} — `{r['bullet_id']}`")
                lines.append(f"- Action: `{r['action']}`")
                lines.append(f"- Recommendation: `{r['recommendation']}`")
                lines.append(f"- Path: `{r['path']}`")
                if r["reason"]:
                    lines.append(f"- Reason: {r['reason']}")
                lines.append(f"- Top-level text: {r['text']}")
                children = r.get("children")
                if isinstance(children, list) and children:
                    lines.append("- Sub-bullets:")
                    lines.extend(_render_children(children, 1))
                else:
                    lines.append("- Sub-bullets: _(none)_")
                lines.append("")

        (OUT_DIR / filename).write_text("\n".join(lines) + "\n", encoding="utf-8")

    # Verify counts against source top-level bullets.
    common_top_level = sum(len(s.get("default_bullets", [])) for s in scope_library.get("common_skeleton", []))
    industry_top_level = sum(
        len(bullets)
        for module in scope_library.get("industry_modules", {}).values()
        for bullets in module.values()
    )
    total_top_level = common_top_level + industry_top_level
    written_rows = sum(group_counts.values())
    parity = "PASS" if total_top_level == written_rows else "FAIL"

    summary_lines = [
        "# Scope Review Summary",
        "",
        "## Count Verification",
        "",
        f"- Top-level bullets in `dist/scope-library.json`: **{total_top_level}**",
        f"- Rows written across review group files: **{written_rows}**",
        f"- Verification status: **{parity}**",
        "",
        "## Source Breakdown",
        "",
        f"- `common` top-level bullets: **{common_top_level}**",
        f"- `industry_modules` top-level bullets: **{industry_top_level}**",
        "",
        "## Group Breakdown",
        "",
        "| Group | File | Row count |",
        "|---|---|---:|",
    ]
    for group, filename in GROUP_FILES.items():
        summary_lines.append(f"| `{group}` | `{filename}` | {group_counts[group]} |")
    summary_lines.extend(
        [
            "",
            "## Recommendation Snapshot",
            "",
            f"- Rows marked `REC_DELETE`: **{rec_delete_count}**",
            f"- Rows marked `REC_KEEP`: **{written_rows - rec_delete_count}**",
            "",
            "If parity is FAIL, do not review/delete until regenerated successfully.",
        ]
    )
    (OUT_DIR / "99-summary.md").write_text("\n".join(summary_lines) + "\n", encoding="utf-8")

    print(f"Wrote review pack to: {OUT_DIR}")
    print(f"Verification: {parity} ({written_rows}/{total_top_level})")


if __name__ == "__main__":
    main()
