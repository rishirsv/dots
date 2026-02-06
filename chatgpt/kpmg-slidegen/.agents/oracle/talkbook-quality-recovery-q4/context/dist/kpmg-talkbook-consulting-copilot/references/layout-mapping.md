# Talkbook Layout Mapping (Canonical Guidance)

This file is the single source of truth for layout selection and “taste” guidance.
Do not use a separate rubric. Keep all policy in this mapping.

## Deterministic Selection Order

1. Intent priority: match section `intent` to `business_intent`.
2. Data shape match: `best_for_content_shape`.
3. Density fit: check `density_limits`.
4. Variant match: enforce blue/white preference if set.
5. Fallback chain: use first listed `fallback_layouts` item.

## Integrated Writing and Styling Guidance

- Use declarative headline titles, preferably with quantification.
- Reserve source lines for `text_footer_source` slots and appendix sources.
- Prefer charts over dense bullets when 3+ numeric points exist.
- Prefer comparison layouts when trade-offs or option-vs-option framing exists.
- Use blue variants for transition, emphasis, or recommendation anchor slides.
- Use white variants for evidence-heavy analytical pages.

## Core Use-Case Mapping Examples

- TAM/SAM/SOM market sizing: `3-column-chart-text` -> fallback `2-column-chart`.
- Competitive landscape (4 players): `quad-box-icon-center-text` -> fallback `two-column-comparison`.
- Survey summary: `1-column-chart-text` -> fallback `2-column-chart`.
- Process flow conversion: `process-flow-horizontal` -> fallback `process-flow-vertical`.
- Bar/pie visualization: `2-column-chart` or `1-column-chart-text`.
- Recommendations-first structure: `recommendations-blue` for opener, then `2-column-blue-heading` for details.

```json
{
  "schema_version": "1.0",
  "exposed_layout_types": [
    "agenda-blue",
    "section-divider-blue",
    "2-column-blue-heading",
    "2-column-white-heading",
    "2-column-chart",
    "1-column-chart-text",
    "3-column-chart-text",
    "two-column-comparison",
    "quad-box-icon-center-text",
    "quad-blue",
    "process-flow-horizontal",
    "process-flow-vertical",
    "table-insights-two-column",
    "table-appendix",
    "recommendations-blue",
    "recommendations-white",
    "key-metrics-kpi-strip",
    "timeline-milestones",
    "risks-mitigations",
    "quote-callout-blue",
    "cover-hero-blue",
    "back-cover-blue",
    "appendix-sources",
    "transition-quote"
  ],
  "layout_types": [
    {
      "layout_slug": "cover-hero-blue",
      "priority": 20,
      "business_intent": ["cover", "opening"],
      "best_for_content_shape": ["narrative"],
      "required_slots": ["text_title", "text_strapline"],
      "optional_slots": ["image_main", "text_footer_source"],
      "density_limits": {"max_bullets_total": 2, "max_chars_per_bullet": 120},
      "background_variants": ["blue"],
      "background_variant_rules": "Always blue for deck entry.",
      "do_use_when": ["Starting the deck with strong headline and setup."],
      "do_not_use_when": ["Analytical detail is required."],
      "fallback_layouts": ["agenda-blue"],
      "sample_payload": {"text_title": "Market Entry Strategy", "text_strapline": "Value creation path for the next 24 months."}
    },
    {
      "layout_slug": "agenda-blue",
      "priority": 15,
      "business_intent": ["agenda", "structure"],
      "best_for_content_shape": ["bullets", "narrative"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 90},
      "background_variants": ["blue"],
      "background_variant_rules": "Blue when used as opening structure page.",
      "do_use_when": ["Creating a high-level roadmap."],
      "do_not_use_when": ["Evidence or charts are primary."],
      "fallback_layouts": ["2-column-blue-heading"],
      "sample_payload": {"text_title": "Agenda", "text_body": ["Context", "Findings", "Recommendations", "Implementation"]}
    },
    {
      "layout_slug": "section-divider-blue",
      "priority": 15,
      "business_intent": ["divider", "transition"],
      "best_for_content_shape": ["narrative"],
      "required_slots": ["text_title"],
      "optional_slots": ["text_strapline"],
      "density_limits": {"max_bullets_total": 1, "max_chars_per_bullet": 80},
      "background_variants": ["blue"],
      "background_variant_rules": "Use blue for all major section transitions.",
      "do_use_when": ["Switching major chapter context."],
      "do_not_use_when": ["Need detailed proof points."],
      "fallback_layouts": ["transition-quote"],
      "sample_payload": {"text_title": "Market Dynamics"}
    },
    {
      "layout_slug": "2-column-blue-heading",
      "priority": 14,
      "business_intent": ["summary", "recommendation-detail", "comparison"],
      "best_for_content_shape": ["bullets", "comparison"],
      "required_slots": ["text_title", "text_left_body", "text_right_body"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 10, "max_chars_per_bullet": 130},
      "background_variants": ["blue", "white"],
      "background_variant_rules": "Prefer blue when emphasis or executive callout is needed.",
      "do_use_when": ["Need side-by-side narrative with emphasis."],
      "do_not_use_when": ["Heavy data table is required."],
      "fallback_layouts": ["2-column-white-heading", "two-column-comparison"],
      "sample_payload": {"text_title": "What We Recommend", "text_left_body": ["Option A"], "text_right_body": ["Option B"]}
    },
    {
      "layout_slug": "2-column-white-heading",
      "priority": 12,
      "business_intent": ["summary", "analysis", "comparison"],
      "best_for_content_shape": ["bullets", "narrative"],
      "required_slots": ["text_title", "text_left_body", "text_right_body"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 12, "max_chars_per_bullet": 140},
      "background_variants": ["white"],
      "background_variant_rules": "Use white for evidence-heavy analytical reads.",
      "do_use_when": ["Balanced two-column argumentation."],
      "do_not_use_when": ["Need chart as dominant visual."],
      "fallback_layouts": ["2-column-blue-heading", "one-column-summary"],
      "sample_payload": {"text_title": "Implications", "text_left_body": ["Demand trend"], "text_right_body": ["Supply response"]}
    },
    {
      "layout_slug": "two-column-comparison",
      "priority": 13,
      "business_intent": ["comparison", "options", "tradeoff"],
      "best_for_content_shape": ["comparison"],
      "required_slots": ["text_title", "text_left_body", "text_right_body"],
      "optional_slots": ["text_left_header", "text_right_header", "text_footer_source"],
      "density_limits": {"max_bullets_total": 10, "max_chars_per_bullet": 120},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "Blue only for recommendation-level option choices.",
      "do_use_when": ["Comparing 2 options or 2 scenarios."],
      "do_not_use_when": ["4+ entities are compared."],
      "fallback_layouts": ["2-column-blue-heading", "quad-box-icon-center-text"],
      "sample_payload": {"text_title": "Build vs Buy", "text_left_body": ["Build advantages"], "text_right_body": ["Buy advantages"]}
    },
    {
      "layout_slug": "2-column-chart",
      "priority": 14,
      "business_intent": ["analysis", "data-visualization", "survey-summary"],
      "best_for_content_shape": ["chart", "bullets"],
      "required_slots": ["text_title", "text_left_body", "chart_main"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 120},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "White for evidence, blue for executive emphasis.",
      "do_use_when": ["Need narrative with one dominant chart."],
      "do_not_use_when": ["Table values are mandatory."],
      "fallback_layouts": ["1-column-chart-text", "3-column-chart-text"],
      "sample_payload": {"text_title": "Revenue Growth", "text_left_body": ["Growth accelerates post Q2"], "chart_main": [{"label": "Q1", "value": 20}]}
    },
    {
      "layout_slug": "1-column-chart-text",
      "priority": 11,
      "business_intent": ["survey-summary", "single-story-data", "analysis"],
      "best_for_content_shape": ["chart", "narrative"],
      "required_slots": ["text_title", "text_body", "chart_main"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 7, "max_chars_per_bullet": 110},
      "background_variants": ["white"],
      "background_variant_rules": "White preferred for chart readability.",
      "do_use_when": ["Single metric story with chart support."],
      "do_not_use_when": ["Need two parallel narratives."],
      "fallback_layouts": ["2-column-chart"],
      "sample_payload": {"text_title": "Customer Satisfaction", "text_body": ["NPS improved 8 points"], "chart_main": [{"label": "FY24", "value": 61}]}
    },
    {
      "layout_slug": "3-column-chart-text",
      "priority": 12,
      "business_intent": ["market-sizing", "multi-driver-analysis"],
      "best_for_content_shape": ["chart", "bullets"],
      "required_slots": ["text_title", "text_left_body", "text_center_body", "chart_main"],
      "optional_slots": ["text_right_body", "text_footer_source"],
      "density_limits": {"max_bullets_total": 9, "max_chars_per_bullet": 100},
      "background_variants": ["white"],
      "background_variant_rules": "Use white for high-information layouts.",
      "do_use_when": ["Three-part market logic with quantified output."],
      "do_not_use_when": ["No quantitative points available."],
      "fallback_layouts": ["2-column-chart", "2-column-white-heading"],
      "sample_payload": {"text_title": "TAM/SAM/SOM", "text_left_body": ["TAM"], "text_center_body": "SAM narrows via channel access", "chart_main": [{"label": "TAM", "value": 100}]}
    },
    {
      "layout_slug": "quad-box-icon-center-text",
      "priority": 13,
      "business_intent": ["competitive-landscape", "framework", "four-part-breakdown"],
      "best_for_content_shape": ["dense-bullets", "comparison"],
      "required_slots": ["text_title", "text_q1", "text_q2", "text_q3", "text_q4"],
      "optional_slots": ["text_center_body", "icon_1", "icon_2", "icon_3", "icon_4", "text_footer_source"],
      "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 90},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "White for analytical matrix, blue for executive story frame.",
      "do_use_when": ["Comparing 4 players or 4 strategic options."],
      "do_not_use_when": ["Only two options are present."],
      "fallback_layouts": ["quad-blue", "two-column-comparison"],
      "sample_payload": {"text_title": "Competitive Landscape", "text_q1": "Incumbent", "text_q2": "Challenger", "text_q3": "Niche", "text_q4": "Disruptor", "text_center_body": "Positioning"}
    },
    {
      "layout_slug": "quad-blue",
      "priority": 12,
      "business_intent": ["recommendations", "priority-matrix", "executive-summary"],
      "best_for_content_shape": ["dense-bullets", "comparison"],
      "required_slots": ["text_title", "text_q1", "text_q2", "text_q3", "text_q4"],
      "optional_slots": ["text_center_body", "text_footer_source"],
      "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 85},
      "background_variants": ["blue"],
      "background_variant_rules": "Use blue for prioritized recommendations or decision framing.",
      "do_use_when": ["Need high-impact four-pillar recommendation page."],
      "do_not_use_when": ["Need detailed evidence narration."],
      "fallback_layouts": ["quad-box-icon-center-text", "recommendations-blue"],
      "sample_payload": {"text_title": "Four Imperatives", "text_q1": "Accelerate", "text_q2": "Differentiate", "text_q3": "Digitize", "text_q4": "Scale"}
    },
    {
      "layout_slug": "process-flow-horizontal",
      "priority": 13,
      "business_intent": ["process", "transformation-roadmap"],
      "best_for_content_shape": ["process", "bullets"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 6, "max_chars_per_bullet": 70},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "White for detailed process, blue for top-level process summary.",
      "do_use_when": ["Converting bullets to clear process flow."],
      "do_not_use_when": ["No sequential logic exists."],
      "fallback_layouts": ["process-flow-vertical", "2-column-white-heading"],
      "sample_payload": {"text_title": "Execution Flow", "text_body": ["Diagnose", "Design", "Deploy", "Scale"]}
    },
    {
      "layout_slug": "process-flow-vertical",
      "priority": 11,
      "business_intent": ["process", "playbook"],
      "best_for_content_shape": ["process"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 7, "max_chars_per_bullet": 85},
      "background_variants": ["white"],
      "background_variant_rules": "Use when vertical reading sequence is clearer.",
      "do_use_when": ["Process has long step descriptions."],
      "do_not_use_when": ["Need strong horizontal timeline flow."],
      "fallback_layouts": ["process-flow-horizontal"],
      "sample_payload": {"text_title": "Operating Model Steps", "text_body": ["Assess", "Align", "Execute", "Monitor"]}
    },
    {
      "layout_slug": "table-insights-two-column",
      "priority": 12,
      "business_intent": ["table-analysis", "benchmarking"],
      "best_for_content_shape": ["table", "bullets"],
      "required_slots": ["text_title", "table_main", "text_right_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 6, "max_chars_per_bullet": 90},
      "background_variants": ["white"],
      "background_variant_rules": "Use white to maximize table legibility.",
      "do_use_when": ["Need table plus key takeaways."],
      "do_not_use_when": ["Chart tells story better than raw table."],
      "fallback_layouts": ["table-appendix", "2-column-chart"],
      "sample_payload": {"text_title": "Benchmark Results", "table_main": [["Metric", "Value"], ["EBITDA", "14%"]], "text_right_body": ["Variance driven by mix"]}
    },
    {
      "layout_slug": "table-appendix",
      "priority": 9,
      "business_intent": ["appendix", "data-dump"],
      "best_for_content_shape": ["table"],
      "required_slots": ["text_title", "table_main"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 2, "max_chars_per_bullet": 70},
      "background_variants": ["white"],
      "background_variant_rules": "Appendix pages should stay white.",
      "do_use_when": ["Detailed data appendix is needed."],
      "do_not_use_when": ["Main storyline slide."],
      "fallback_layouts": ["table-insights-two-column"],
      "sample_payload": {"text_title": "Appendix: Data Table", "table_main": [["Item", "Value"], ["A", "12"]]}
    },
    {
      "layout_slug": "key-metrics-kpi-strip",
      "priority": 11,
      "business_intent": ["kpi-summary", "executive-summary"],
      "best_for_content_shape": ["bullets", "chart"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["chart_main", "text_footer_source"],
      "density_limits": {"max_bullets_total": 6, "max_chars_per_bullet": 80},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "Blue for exec readouts; white for analytic reviews.",
      "do_use_when": ["Need top-line KPI strip and brief commentary."],
      "do_not_use_when": ["Long-form recommendation detail."],
      "fallback_layouts": ["recommendations-blue", "1-column-chart-text"],
      "sample_payload": {"text_title": "Key Metrics", "text_body": ["Revenue +12%", "Margin +2.3pp"]}
    },
    {
      "layout_slug": "timeline-milestones",
      "priority": 11,
      "business_intent": ["roadmap", "implementation"],
      "best_for_content_shape": ["process", "bullets"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 75},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "Use blue for executive milestones, white for detailed plans.",
      "do_use_when": ["Sequencing milestones by phase."],
      "do_not_use_when": ["No temporal sequence in content."],
      "fallback_layouts": ["process-flow-horizontal"],
      "sample_payload": {"text_title": "12-Month Roadmap", "text_body": ["Month 1-3: Mobilize", "Month 4-6: Pilot", "Month 7-12: Scale"]}
    },
    {
      "layout_slug": "risks-mitigations",
      "priority": 10,
      "business_intent": ["risk", "governance"],
      "best_for_content_shape": ["comparison", "bullets"],
      "required_slots": ["text_title", "text_left_body", "text_right_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 10, "max_chars_per_bullet": 95},
      "background_variants": ["white"],
      "background_variant_rules": "White for readability of risk detail.",
      "do_use_when": ["Presenting risks and corresponding mitigations."],
      "do_not_use_when": ["No paired risk/mitigation structure."],
      "fallback_layouts": ["two-column-comparison"],
      "sample_payload": {"text_title": "Top Risks", "text_left_body": ["Risk 1"], "text_right_body": ["Mitigation 1"]}
    },
    {
      "layout_slug": "recommendations-blue",
      "priority": 16,
      "business_intent": ["recommendations", "executive-summary"],
      "best_for_content_shape": ["bullets", "dense-bullets"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_strapline", "text_footer_source"],
      "density_limits": {"max_bullets_total": 7, "max_chars_per_bullet": 95},
      "background_variants": ["blue"],
      "background_variant_rules": "Always blue for recommendation lead slide.",
      "do_use_when": ["Leading with recommendations first."],
      "do_not_use_when": ["Detailed appendix detail."],
      "fallback_layouts": ["2-column-blue-heading", "recommendations-white"],
      "sample_payload": {"text_title": "Our Recommendations", "text_body": ["Prioritize pricing reset", "Accelerate channel shift"]}
    },
    {
      "layout_slug": "recommendations-white",
      "priority": 12,
      "business_intent": ["recommendations", "action-plan"],
      "best_for_content_shape": ["bullets"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 9, "max_chars_per_bullet": 105},
      "background_variants": ["white"],
      "background_variant_rules": "Use after blue summary for detailed recommendation support.",
      "do_use_when": ["Detailing recommendation rationale."],
      "do_not_use_when": ["Need high-emphasis executive opener."],
      "fallback_layouts": ["recommendations-blue", "2-column-white-heading"],
      "sample_payload": {"text_title": "Recommendation Detail", "text_body": ["Why now", "How to execute", "Expected impact"]}
    },
    {
      "layout_slug": "quote-callout-blue",
      "priority": 10,
      "business_intent": ["transition", "voice-of-customer"],
      "best_for_content_shape": ["narrative"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 3, "max_chars_per_bullet": 140},
      "background_variants": ["blue"],
      "background_variant_rules": "Blue callout for pivotal quote statements.",
      "do_use_when": ["Introducing a chapter with one key quote."],
      "do_not_use_when": ["Need detailed multi-point analysis."],
      "fallback_layouts": ["transition-quote"],
      "sample_payload": {"text_title": "Client Voice", "text_body": ["We need speed and certainty."]}
    },
    {
      "layout_slug": "transition-quote",
      "priority": 9,
      "business_intent": ["transition", "narrative"],
      "best_for_content_shape": ["narrative"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_strapline"],
      "density_limits": {"max_bullets_total": 3, "max_chars_per_bullet": 120},
      "background_variants": ["white", "blue"],
      "background_variant_rules": "Auto-select blue if transitioning into recommendations.",
      "do_use_when": ["Bridge between major sections."],
      "do_not_use_when": ["Need data tables/charts."],
      "fallback_layouts": ["section-divider-blue"],
      "sample_payload": {"text_title": "What This Means", "text_body": ["Implications for the next phase"]}
    },
    {
      "layout_slug": "appendix-sources",
      "priority": 8,
      "business_intent": ["appendix", "citations"],
      "best_for_content_shape": ["bullets", "narrative"],
      "required_slots": ["text_title", "text_body"],
      "optional_slots": ["text_footer_source"],
      "density_limits": {"max_bullets_total": 16, "max_chars_per_bullet": 160},
      "background_variants": ["white"],
      "background_variant_rules": "Always white for source readability.",
      "do_use_when": ["Appending sources in notes+appendix mode."],
      "do_not_use_when": ["Main storyline pages."],
      "fallback_layouts": ["table-appendix"],
      "sample_payload": {"text_title": "Sources", "text_body": ["Source 1", "Source 2"]}
    },
    {
      "layout_slug": "back-cover-blue",
      "priority": 7,
      "business_intent": ["closing", "back-cover"],
      "best_for_content_shape": ["narrative"],
      "required_slots": ["text_title"],
      "optional_slots": ["text_body", "text_footer_source"],
      "density_limits": {"max_bullets_total": 2, "max_chars_per_bullet": 100},
      "background_variants": ["blue"],
      "background_variant_rules": "Always blue closing treatment.",
      "do_use_when": ["Closing slide."],
      "do_not_use_when": ["Any analytical section."],
      "fallback_layouts": ["quote-callout-blue"],
      "sample_payload": {"text_title": "Thank You"}
    }
  ]
}
```
