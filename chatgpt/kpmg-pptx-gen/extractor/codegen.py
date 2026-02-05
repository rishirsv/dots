from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from .part_graph import build_part_graph, get_used_layouts
from .resolvers import build_resolver
from .slots import detect_all_layout_slots
from .layout_geometry import extract_all_layout_geometry


@dataclass(frozen=True)
class TemplateConfig:
    template_dir: Path
    pptx_path: Path
    schema_version: str = "3.0"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _summarize_detected_layout_slots(detected_layouts: Dict[str, Any]) -> Dict[str, Any]:
    summary: Dict[str, Any] = {}
    for layout_name, layout in detected_layouts.items():
        slot_types: Dict[str, int] = {}
        chart_names: List[str] = []
        for slot in layout.slots.values():
            slot_types[slot.slot_type] = slot_types.get(slot.slot_type, 0) + 1
            if slot.slot_type == "chart":
                chart_names.append(slot.element.name)
        summary[layout_name] = {
            "slotTypes": slot_types,
            "chartNames": chart_names,
            "staticCount": len(layout.static_elements),
        }
    return summary


def build_template_json(cfg: TemplateConfig) -> Dict[str, Any]:
    graph = build_part_graph(cfg.pptx_path)
    resolver = build_resolver(cfg.pptx_path)
    detected_layouts = detect_all_layout_slots(cfg.pptx_path)
    detected_geometry = extract_all_layout_geometry(cfg.pptx_path)

    assets_dir = cfg.template_dir / "assets"
    assets_base64_path = assets_dir / "assets-base64.json"
    gradients_data_uris_path = assets_dir / "gradient_data_uris.json"

    return {
        "schemaVersion": cfg.schema_version,
        "generatedAt": _utc_now_iso(),
        "sourcePptx": str(cfg.pptx_path),
        "slideDimensions": {"w": 13.333, "h": 7.5},
        "colors": {
            "scheme": resolver.clr_scheme,
            "clrMap": resolver.clr_map,
        },
        "fonts": resolver.fonts,
        "usedLayouts": get_used_layouts(graph),
        "assets": {
            "assetsBase64": str(assets_base64_path),
            "gradientDataUris": str(gradients_data_uris_path),
        },
        "detectedLayoutSlots": _summarize_detected_layout_slots(detected_layouts),
        "layoutGeometry": detected_geometry,
    }


def build_template_js(
    *,
    schema_version: str,
    source_pptx_name: str,
    tokens: Dict[str, Any],
    assets: Dict[str, str],
    generated_at: str,
    detected_layout_slots: Dict[str, Any],
    detected_layout_geometry: Dict[str, Any],
) -> str:
    # Use JSON to serialize objects safely into JS source.
    tokens_js = json.dumps(tokens, indent=2, sort_keys=True)
    assets_js = json.dumps(assets, indent=2, sort_keys=True)

    def _geom_for(layout_name: str) -> Dict[str, Any]:
        g = detected_layout_geometry.get(layout_name) or {}
        return g if isinstance(g, dict) else {}

    # Minimal layout geometry for the core v1 slide types.
    layouts = {
        "cover": {
            "description": "Cover with blue background, left title, right image window",
            "templateLayout": "Cover page_Right Horizontal Window",
            "slots": {
                "title": {"kind": "text", "required": True, "maxLength": 100},
                "subtitle": {"kind": "text", "required": True, "maxLength": 200},
            },
            "geometry": {
                # Extracted geometry (template-derived)
                **(_geom_for("Cover page_Right Horizontal Window") or {}),
                # Builder compatibility aliases
                "photo": (_geom_for("Cover page_Right Horizontal Window") or {}).get("picture"),
            },
        },
        "divider": {
            "description": "Section divider with gradient window",
            "templateLayout": "Divider slide_5",
            "slots": {
                "sectionNumber": {"kind": "text", "required": True, "pattern": "^\\d{2}$"},
                "sectionTitle": {"kind": "text", "required": True, "maxLength": 80},
            },
            "geometry": {
                "gradient": (_geom_for("Divider slide_5") or {}).get("window"),
                "number": ((_geom_for("Divider slide_5") or {}).get("bodyBoxes") or [None])[0],
                "title": (_geom_for("Divider slide_5") or {}).get("title"),
            },
        },
        "twoColumnText": {
            "description": "Two-column body text layout",
            "templateLayout": "Two columns text",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "leftBody": {"kind": "textArray", "required": True},
                "rightBody": {"kind": "textArray", "required": True},
            },
            "geometry": {
                "title": (_geom_for("Two columns text") or {}).get("title"),
                "strapline": (_geom_for("Two columns text") or {}).get("strapline"),
                "left": (_geom_for("Two columns text") or {}).get("leftBody"),
                "right": (_geom_for("Two columns text") or {}).get("rightBody"),
            },
        },
        "analysis2ColumnsText": {
            "description": "Two-column text (analysis)",
            "templateLayout": "Analysis_2 columns text",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "leftBody": {"kind": "textArray", "required": True},
                "rightBody": {"kind": "textArray", "required": True},
            },
            "geometry": {
                "title": (_geom_for("Analysis_2 columns text") or {}).get("title"),
                "strapline": (_geom_for("Analysis_2 columns text") or {}).get("strapline"),
                "left": (_geom_for("Analysis_2 columns text") or {}).get("leftBody"),
                "right": (_geom_for("Analysis_2 columns text") or {}).get("rightBody"),
            },
        },
        "oneColumnText": {
            "description": "Single-column body text layout",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "body": {"kind": "textArray", "required": True},
            },
            "geometry": {
                # Best-effort: map to the simplest title layouts when present
                "title": (_geom_for("Title only") or {}).get("title"),
                "strapline": (_geom_for("Title and strapline only") or {}).get("strapline"),
                "body": (_geom_for("Title only") or {}).get("body") or ((_geom_for("Title only") or {}).get("bodyBoxes") or [None])[0],
            },
        },
        "analysisNarrowTable": {
            "description": "Analysis with narrow table",
            "templateLayout": "Analysis_narrow table",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "table": {"kind": "table", "required": True},
                "notes": {"kind": "text", "required": False},
            },
            "geometry": {
                "title": (_geom_for("Analysis_narrow table") or {}).get("title"),
                "strapline": (_geom_for("Analysis_narrow table") or {}).get("strapline"),
                "table": (_geom_for("Analysis_narrow table") or {}).get("table"),
            },
        },
        "analysisWideChart2ColsText": {
            "description": "Analysis with chart (right) and commentary (left)",
            "templateLayout": "Analysis_wide chart + 2 cols text",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "body": {"kind": "textArray", "required": True},
                "chart": {"kind": "chart", "required": True},
            },
            "geometry": {
                # NOTE: The template's measured geometry for this layout does not map cleanly
                # to our current builder (V2 slide types vs. layout naming mismatch).
                # We only pass the header geometry; the builder will use its internal
                # default boxes for text + chart until we implement a fully template-driven
                # builder for this layout.
                "title": (_geom_for("Analysis_wide chart + 2 cols text") or {}).get("title"),
                "strapline": (_geom_for("Analysis_wide chart + 2 cols text") or {}).get("strapline"),
            },
        },
        "analysisWideChartTableText": {
            "description": "Analysis with chart (bottom) and commentary (top)",
            "templateLayout": "Analysis_wide chart+table+text",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "body": {"kind": "textArray", "required": True},
                "chart": {"kind": "chart", "required": True},
            },
            "geometry": {
                # Same as above: until the builder matches the measured layout, only pass
                # header geometry and rely on builder defaults for the main regions.
                "title": (_geom_for("Analysis_wide chart+table+text") or {}).get("title"),
                "strapline": (_geom_for("Analysis_wide chart+table+text") or {}).get("strapline"),
            },
        },
        "summaryFinancials": {
            "description": "Summary financials with KPI boxes and chart",
            "templateLayout": "Summary financials_3",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "kpis": {"kind": "kpiArray", "required": True},
                "chart": {"kind": "chart", "required": False},
            },
            "geometry": {
                "title": (_geom_for("Summary financials_3") or {}).get("title"),
                "strapline": (_geom_for("Summary financials_3") or {}).get("strapline"),
                "chart": (_geom_for("Summary financials_3") or {}).get("chart"),
            },
        },
        "titleStrapline4TextBoxes": {
            "description": "Title + strapline + 4 text boxes",
            "templateLayout": "Title+strapline+4 text boxes",
            "slots": {
                "title": {"kind": "text", "required": True},
                "strapline": {"kind": "text", "required": False},
                "columns": {"kind": "columns", "required": True},
            },
            "geometry": {
                "title": (_geom_for("Title+strapline+4 text boxes") or {}).get("title"),
                "strapline": (_geom_for("Title+strapline+4 text boxes") or {}).get("strapline"),
                "columns": (_geom_for("Title+strapline+4 text boxes") or {}).get("columns")
                or ((_geom_for("Title+strapline+4 text boxes") or {}).get("bodyBoxes") or []),
            },
        },
        "backCover": {
            "description": "Back cover with disclaimer",
            "templateLayout": "Back cover_2",
            "slots": {
                "disclaimer": {"kind": "text", "required": False},
                "url": {"kind": "text", "required": False},
            },
        },
    }
    layouts_js = json.dumps(layouts, indent=2, sort_keys=True)
    detected_slots_js = json.dumps(detected_layout_slots, indent=2, sort_keys=True)
    detected_geom_js = json.dumps(detected_layout_geometry, indent=2, sort_keys=True)

    return f"""/**
 * KPMGPTX Template - Diligence+ Reporting
 *
 * Auto-generated from: {source_pptx_name}
 * Schema Version: {schema_version}
 * Generated: {generated_at}
 */

import fs from 'node:fs';
import path from 'node:path';
import {{ fileURLToPath }} from 'node:url';
import PptxGenJS from 'pptxgenjs';

import {{ addCover }} from './generator/builders/cover.js';
import {{ addDivider }} from './generator/builders/divider.js';
import {{ addTwoColumnTextWithStrapline }} from './generator/builders/two-column.js';
import {{ addAnalysisNarrowTable }} from './generator/builders/table.js';
import {{ addAnalysisWideChart2ColsText, addAnalysisWideChartTableText }} from './generator/builders/text-chart.js';
import {{ addSummaryFinancials }} from './generator/builders/summary.js';
import {{ addTitleStrapline4TextBoxes }} from './generator/builders/process.js';
import {{ addBackCover }} from './generator/builders/back-cover.js';
import {{ addOneColumnText }} from './generator/builders/one-column.js';
import {{ paginateDeckSpec }} from './generator/runtime/paginate.js';
import {{ svgToDataUri }} from './generator/helpers/svg.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FOOTER_LOGO_PATH = path.join(__dirname, 'assets', 'kpmg-logo.svg');
const FOOTER_LOGO_DATA = fs.existsSync(FOOTER_LOGO_PATH)
  ? svgToDataUri(fs.readFileSync(FOOTER_LOGO_PATH, 'utf8'))
  : null;
const FOOTER_GEOMETRY = {{
  logo: {{ x: 1.097, y: 6.854, w: 0.53, h: 0.213 }},
  slideNumber: {{ x: 11.971, y: 6.854, w: 0.265, h: 0.163 }},
}};

export const TOKENS = {tokens_js};
export const ASSETS = {assets_js};
export const LAYOUTS = {layouts_js};
export const DETECTED_LAYOUT_SLOTS = {detected_slots_js};
export const DETECTED_LAYOUT_GEOMETRY = {detected_geom_js};

export function validateSlideContent(type, content) {{
  const layout = LAYOUTS[type];
  if (!layout) return {{ valid: false, errors: [`Unknown type: ${{type}}`], warnings: [] }};

  const errors = [];
  const warnings = [];

  const slots = layout.slots || {{}};
  for (const [name, def] of Object.entries(slots)) {{
    const value = content?.[name];
    if (def.required && (value === undefined || value === null || value === '')) {{
      errors.push(`Missing required: ${{name}}`);
      continue;
    }}
    if (def.maxLength && typeof value === 'string' && value.length > def.maxLength) {{
      warnings.push(`${{name}} exceeds maxLength (${{def.maxLength}}), may shrink to fit`);
    }}
    if (def.pattern && typeof value === 'string' && !(new RegExp(def.pattern).test(value))) {{
      errors.push(`${{name}} doesn't match pattern: ${{def.pattern}}`);
    }}
  }}

  if (layout.templateLayout) {{
    const detected = DETECTED_LAYOUT_SLOTS[layout.templateLayout];
    if (detected && detected.slotTypes) {{
      for (const [name, def] of Object.entries(slots)) {{
        if (def.kind === 'chart' && !detected.slotTypes.chart) {{
          warnings.push(`Template layout "${{layout.templateLayout}}" has no chart placeholder; slot "${{name}}" may not render as intended`);
        }}
      }}
    }}
  }}

  return {{ valid: errors.length === 0, errors, warnings }};
}}

export function addCoverSlide(pptx, slideSpec) {{
  return addCover(pptx, {{ title: slideSpec.title, subtitle: slideSpec.subtitle, assets: ASSETS, masterName: 'KPMG_COVER', geometry: LAYOUTS.cover?.geometry }});
}}

export function addDividerSlide(pptx, slideSpec) {{
  return addDivider(pptx, {{ sectionNumber: slideSpec.sectionNumber, sectionTitle: slideSpec.sectionTitle, assets: {{ gradientDivider: ASSETS.gradientDivider }}, masterName: 'KPMG_SECTION', geometry: LAYOUTS.divider?.geometry }});
}}

export function addTwoColumnTextSlide(pptx, slideSpec) {{
  return addTwoColumnTextWithStrapline(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.twoColumnText?.geometry }});
}}

export function addAnalysis2ColumnsTextSlide(pptx, slideSpec) {{
  return addTwoColumnTextWithStrapline(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.analysis2ColumnsText?.geometry }});
}}

export function addOneColumnTextSlide(pptx, slideSpec) {{
  return addOneColumnText(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.oneColumnText?.geometry }});
}}

export function addAnalysisNarrowTableSlide(pptx, slideSpec) {{
  return addAnalysisNarrowTable(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.analysisNarrowTable?.geometry }});
}}

export function addAnalysisWideChart2ColsTextSlide(pptx, slideSpec) {{
  return addAnalysisWideChart2ColsText(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.analysisWideChart2ColsText?.geometry }});
}}

export function addAnalysisWideChartTableTextSlide(pptx, slideSpec) {{
  return addAnalysisWideChartTableText(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.analysisWideChartTableText?.geometry }});
}}

export function addSummaryFinancialsSlide(pptx, slideSpec) {{
  return addSummaryFinancials(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.summaryFinancials?.geometry }});
}}

export function addTitleStrapline4TextBoxesSlide(pptx, slideSpec) {{
  return addTitleStrapline4TextBoxes(pptx, {{ ...slideSpec, masterName: 'KPMG_WHITE', geometry: LAYOUTS.titleStrapline4TextBoxes?.geometry }});
}}

export function addBackCoverSlide(pptx, slideSpec) {{
  return addBackCover(pptx, {{ ...slideSpec, assets: {{ gradientBackCover: ASSETS.gradientBackCover }}, masterName: 'KPMG_CLOSING', geometry: LAYOUTS.backCover?.geometry }});
}}

function defineMasters(pptx) {{
  const dims = TOKENS?.dimensions || {{ w: 13.333, h: 7.5 }};
  const primary = TOKENS?.colors?.semantic?.primary || '1E49E2';
  const white = TOKENS?.colors?.semantic?.bgLight || 'FFFFFF';

  // Default white master (base for most content slides).
  const footerObjects = FOOTER_LOGO_DATA
    ? [{{ image: {{ data: FOOTER_LOGO_DATA, ...FOOTER_GEOMETRY.logo }} }}]
    : [];
  pptx.defineSlideMaster({{
    title: 'KPMG_WHITE',
    background: {{ color: white }},
    slideNumber: {{ ...FOOTER_GEOMETRY.slideNumber, fontFace: 'Arial', fontSize: 8, color: '666666' }},
    objects: footerObjects,
  }});

  // Cover master: solid KPMG blue.
  pptx.defineSlideMaster({{
    title: 'KPMG_COVER',
    background: {{ color: primary }},
  }});

  // Divider master: solid blue + the gradient window (placed once).
  const divGeo = LAYOUTS?.divider?.geometry?.gradient;
  const sectionObjects = divGeo && ASSETS?.gradientDivider ? [{{ image: {{ data: ASSETS.gradientDivider, ...divGeo }} }}] : [];
  pptx.defineSlideMaster({{
    title: 'KPMG_SECTION',
    background: {{ color: primary }},
    objects: sectionObjects,
  }});

  // Closing master: full-bleed gradient.
  const closingObjects = ASSETS?.gradientBackCover
    ? [{{ image: {{ data: ASSETS.gradientBackCover, x: 0, y: 0, w: dims.w, h: dims.h }} }}]
    : [];
  pptx.defineSlideMaster({{
    title: 'KPMG_CLOSING',
    background: {{ color: primary }},
    objects: closingObjects,
  }});
}}

const BUILDERS = {{
  cover: addCoverSlide,
  divider: addDividerSlide,
  twoColumnText: addTwoColumnTextSlide,
  analysis2ColumnsText: addAnalysis2ColumnsTextSlide,
  oneColumnText: addOneColumnTextSlide,
  analysisNarrowTable: addAnalysisNarrowTableSlide,
  analysisWideChart2ColsText: addAnalysisWideChart2ColsTextSlide,
  analysisWideChartTableText: addAnalysisWideChartTableTextSlide,
  summaryFinancials: addSummaryFinancialsSlide,
  titleStrapline4TextBoxes: addTitleStrapline4TextBoxesSlide,
  backCover: addBackCoverSlide,
}};

export function generateDeck(deckSpec) {{
  const pptx = new PptxGenJS();
  pptx.defineLayout({{ name: 'KPMG_WIDE', width: 13.333, height: 7.5 }});
  pptx.layout = 'KPMG_WIDE';

  // Presentation metadata
  if (deckSpec.metadata) {{
    if (deckSpec.metadata.author) pptx.author = deckSpec.metadata.author;
    if (deckSpec.metadata.company) pptx.company = deckSpec.metadata.company;
    if (deckSpec.metadata.title) pptx.title = deckSpec.metadata.title;
    if (deckSpec.metadata.subject) pptx.subject = deckSpec.metadata.subject;
  }}

  // Theme fonts
  pptx.theme = {{ headFontFace: 'Arial', bodyFontFace: 'Arial' }};

  defineMasters(pptx);

  const paginated = paginateDeckSpec(deckSpec, LAYOUTS);
  for (const slideSpec of (paginated?.slides || [])) {{
    const builder = BUILDERS[slideSpec.type];
    if (!builder) throw new Error(`Unknown type: ${{slideSpec.type}}`);
    const validation = validateSlideContent(slideSpec.type, slideSpec);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    // Sections for slide sorter
    if (slideSpec.type === 'divider' && slideSpec.sectionTitle) {{
      pptx.addSection({{ title: slideSpec.sectionTitle }});
    }}

    const slide = builder(pptx, slideSpec);

    // Speaker notes
    if (slideSpec.notes && slide) {{
      slide.addNotes(slideSpec.notes);
    }}
  }}

  return pptx;
}}

export default {{ generateDeck, validateSlideContent, TOKENS, LAYOUTS, ASSETS, DETECTED_LAYOUT_SLOTS, DETECTED_LAYOUT_GEOMETRY }};
"""


def write_template_files(cfg: TemplateConfig) -> Dict[str, Path]:
    cfg.template_dir.mkdir(parents=True, exist_ok=True)
    (cfg.template_dir / "assets").mkdir(parents=True, exist_ok=True)

    template_json = build_template_json(cfg)

    # Load base64 assets for embedding into JS.
    assets_dir = cfg.template_dir / "assets"
    assets_base64 = json.loads((assets_dir / "assets-base64.json").read_text())
    gradients_data_uris = json.loads((assets_dir / "gradient_data_uris.json").read_text())

    resolver = build_resolver(cfg.pptx_path)
    tokens = {
        "dimensions": {"w": 13.333, "h": 7.5},
        "colors": {
            "scheme": resolver.clr_scheme,
            "clrMap": resolver.clr_map,
            "semantic": {
                "kpmgBlue": "00338D",
                "kpmgPurple": "7213EA",
                "kpmgCyan": "00B8F5",
                "primary": "1E49E2",
                "textDark": "000000",
                "textLight": "FFFFFF",
                "bgLight": "FFFFFF",
                "bgAlt": "E5E5E5",
            },
        },
        "fonts": {
            "heading": "Arial",
            "body": resolver.fonts.get("+mn-lt", "Arial"),
            "fallback": "Arial",
        },
        "textStyles": {
            "coverTitle": {"fontFace": "Arial", "fontSize": 66, "color": "FFFFFF", "bold": True},
            "coverSubtitle": {"fontFace": "Arial", "fontSize": 14, "color": "FFFFFF"},
            "sectionNumber": {"fontFace": "Arial", "fontSize": 48, "color": "FFFFFF", "bold": True},
            "slideTitle": {"fontFace": "Arial", "fontSize": 24, "color": "00338D", "bold": True},
            "bodyText": {"fontFace": "Arial", "fontSize": 12, "color": "000000"},
            "tableHeader": {"fontFace": "Arial", "fontSize": 10, "color": "FFFFFF", "bold": True},
            "tableBody": {"fontFace": "Arial", "fontSize": 10, "color": "000000"},
        },
    }

    assets = {
        "logoWhite": assets_base64.get("logoWhitePng"),
        "logoWhiteSvg": assets_base64.get("logoWhiteSvg"),
        "coverPhoto": assets_base64.get("coverPhoto"),
        "gradientDivider": gradients_data_uris.get("divider_window"),
        "gradientBackCover": gradients_data_uris.get("back_cover"),
    }

    missing = [k for k, v in assets.items() if not isinstance(v, str) or not v.startswith("data:")]
    if missing:
        raise ValueError(f"Missing/invalid embedded asset data URIs for: {missing}")

    js_src = build_template_js(
        schema_version=cfg.schema_version,
        source_pptx_name=cfg.pptx_path.name,
        tokens=tokens,
        assets=assets,  # type: ignore[arg-type]
        generated_at=template_json["generatedAt"],
        detected_layout_slots=template_json.get("detectedLayoutSlots", {}),
        detected_layout_geometry=template_json.get("layoutGeometry", {}),
    )

    template_json_path = cfg.template_dir / "template.json"
    template_js_path = cfg.template_dir / "template.js"

    template_json_path.write_text(json.dumps(template_json, indent=2, sort_keys=True) + "\n")
    template_js_path.write_text(js_src)

    return {"template_json": template_json_path, "template_js": template_js_path}
