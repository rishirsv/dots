# Layout Policy

Use this tree as the single source of truth for layout selection.

## Slide Type Selection Decision Tree

```text
Is the slide a transaction-perimeter structure + company overview page?
  ├─ Yes → businessOverview
  └─ No  → Does the slide require a visual (numeric pattern) to make the point?
           ├─ Yes → Do you need a reconciled start-to-end driver walk?
           │        ├─ Yes → Use analysisBridge (waterfall + 1-4 analysis phases)
           │        └─ No  → Is it primarily a chart?
           │                 ├─ Yes → Use analysisWideChart2ColsText (chart + interpretation)
           │                 │        If you also need a small table for exact values → analysisWideChartTableText
           │                 └─ No  → Is it primarily a table of exact values?
           │                          ├─ Yes → analysisNarrowTable (table + insights)
           │                          └─ No  → Use oneColumnText and keep it narrative
           └─ No → Is it compare/contrast with two parallel streams?
                    ├─ Yes → twoColumnText
                    └─ No  → oneColumnText
```

## Intent-To-Layout Mapping

| Slide intent | Recommended type | Why this works | Don't do this |
|---|---|---|---|
| Open the deck with context | `cover` | Establish scope, audience, and date in a branded way. | Don't put key findings on the cover. |
| Agenda for multi-section decks | `contents` | Provides navigation; contract enforces >= 3 sections. | Don't use when you only have 1-2 sections. |
| Section break | `dividerDark` / `dividerLight` | Clears cognitive reset between sections. | Don't overuse; it bloats slide count. |
| Single-thread argument | `oneColumnText` | Best for claim -> bullets -> implication. | Don't attach charts/tables here. |
| Compare two options/states | `twoColumnText` | Parallel structure, easy scanning. | Don't use if one side is 3x longer. |
| Start-to-end metric bridge with driver attribution | `analysisBridge` | Reconciles start/end values and shows quantified drivers with phase commentary. | Don't use when no true bridge reconciliation exists. |
| Transaction perimeter + company profile | `businessOverview` | Presents legal/group structure and right-side overview narrative in one page. | Don't use for timeline/event-heavy storytelling. |
| Trend/pattern + interpretation | `analysisWideChart2ColsText` | Chart is the evidence; body explains "so what." | Don't dump chart + 8 bullets; split. |
| KPI table + takeaways | `analysisNarrowTable` | Exact numbers + insights. | Don't use essay-length table cells. |
| Chart + (optional) table + synthesis | `analysisWideChartTableText` | Handles evidence-heavy slides cleanly. | Don't use if table is huge; make appendix. |
| 4-pillar summary | `titleStrapline4TextBoxes` | Great exec summary structure. | Don't try to cram 6 pillars. |
| Close/disclaimer | `backCover` | Standard finishing behavior. | Don't hide next steps here. |
