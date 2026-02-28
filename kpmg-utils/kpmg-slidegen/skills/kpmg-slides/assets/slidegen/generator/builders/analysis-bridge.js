import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { addTitle } from '../helpers/title.js';
import { toBodyRuns } from '../helpers/bullets.js';
import { footerSafeTopForMaster, normalizeBodyStyle } from '../helpers/layout.js';
import { sanitizeText } from '../helpers/text.js';
import { validateBridgeSpec, buildBridgeBars, formatBridgeValue } from '../helpers/bridge.js';
import {
  BRIDGE_DEFAULT_ANALYSIS_BOXES,
  clampBridgePhaseCount,
  resolveBridgeAnalysisBoxes,
} from '../helpers/bridge-layout.js';

const DEFAULT_GEOMETRY = Object.freeze({
  title: { x: 1.0919, y: 0.4722, w: 11.1496, h: 0.5833 },
  bridgeArea: { x: 0.9325, y: 1.7348, w: 11.3089, h: 2.9287 },
  analysisBoxes: BRIDGE_DEFAULT_ANALYSIS_BOXES,
  source: { x: 1.1008, y: 6.4648, w: 5.7035, h: 0.2020 },
});

const STYLE = Object.freeze({
  positive: COLORS.kpmgCyan,
  negative: COLORS.primary,
  total: COLORS.kpmgBlue,
  connector: 'A7A9AC',
});

const TYPOGRAPHY_DEFAULTS = Object.freeze({
  strapline: TYPE_SIZES.strapline,
  bridgeValue: 6.5,
  bridgeLabel: 6,
  phaseBadge: 8,
  analysisBadge: 7,
  analysisHeading: TYPE_SIZES.body,
  analysisBody: Math.max(8, TYPE_SIZES.body - 1),
  error: 9,
});

function toFinite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function resolveTypography(typography = {}) {
  const source = typography && typeof typography === 'object' ? typography : {};
  return {
    strapline: toFinite(source.strapline, TYPOGRAPHY_DEFAULTS.strapline),
    bridgeValue: toFinite(source.bridgeValue, TYPOGRAPHY_DEFAULTS.bridgeValue),
    bridgeLabel: toFinite(source.bridgeLabel, TYPOGRAPHY_DEFAULTS.bridgeLabel),
    phaseBadge: toFinite(source.phaseBadge, TYPOGRAPHY_DEFAULTS.phaseBadge),
    analysisBadge: toFinite(source.analysisBadge, TYPOGRAPHY_DEFAULTS.analysisBadge),
    analysisHeading: toFinite(source.analysisHeading, TYPOGRAPHY_DEFAULTS.analysisHeading),
    analysisBody: toFinite(source.analysisBody, TYPOGRAPHY_DEFAULTS.analysisBody),
    error: toFinite(source.error, TYPOGRAPHY_DEFAULTS.error),
  };
}

function resolvePhaseCount(analysisColumns, geometry) {
  const explicitColumns = Array.isArray(analysisColumns) ? analysisColumns.length : 0;
  const geometryColumns = Array.isArray(geometry?.analysisBoxes) ? geometry.analysisBoxes.length : 0;
  return clampBridgePhaseCount(explicitColumns || geometryColumns || BRIDGE_DEFAULT_ANALYSIS_BOXES.length);
}

/**
 * Resolve geometry by overlaying user/template values on top of defaults.
 *
 * @param {object} [geometry]
 * @returns {{
 *   title: {x:number,y:number,w:number,h:number},
 *   bridgeArea: {x:number,y:number,w:number,h:number},
 *   analysisBoxes: Array<{x:number,y:number,w:number,h:number}>,
 *   source: {x:number,y:number,w:number,h:number}
 * }}
 */
function resolveGeometry(geometry = {}, phaseCount = BRIDGE_DEFAULT_ANALYSIS_BOXES.length) {
  const source = geometry && typeof geometry === 'object' ? geometry : {};
  const analysisBoxes = resolveBridgeAnalysisBoxes(source.analysisBoxes, phaseCount);

  return {
    title: {
      x: toFinite(source.title?.x, DEFAULT_GEOMETRY.title.x),
      y: toFinite(source.title?.y, DEFAULT_GEOMETRY.title.y),
      w: toFinite(source.title?.w, DEFAULT_GEOMETRY.title.w),
      h: toFinite(source.title?.h, DEFAULT_GEOMETRY.title.h),
    },
    bridgeArea: {
      x: toFinite(source.bridgeArea?.x, DEFAULT_GEOMETRY.bridgeArea.x),
      y: toFinite(source.bridgeArea?.y, DEFAULT_GEOMETRY.bridgeArea.y),
      w: toFinite(source.bridgeArea?.w, DEFAULT_GEOMETRY.bridgeArea.w),
      h: toFinite(source.bridgeArea?.h, DEFAULT_GEOMETRY.bridgeArea.h),
    },
    analysisBoxes,
    source: {
      x: toFinite(source.source?.x, DEFAULT_GEOMETRY.source.x),
      y: toFinite(source.source?.y, DEFAULT_GEOMETRY.source.y),
      w: toFinite(source.source?.w, DEFAULT_GEOMETRY.source.w),
      h: toFinite(source.source?.h, DEFAULT_GEOMETRY.source.h),
    },
  };
}

/**
 * Compute chart scale domain that keeps 0 visible for waterfall interpretation.
 *
 * @param {Array<{start:number,end:number}>} bars
 * @returns {{ minValue: number, maxValue: number }}
 */
function scaleDomain(bars) {
  const values = [0];
  for (const bar of bars) {
    values.push(Number(bar.start || 0), Number(bar.end || 0));
  }
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  }
  return { minValue, maxValue };
}

/**
 * Render the waterfall bridge bars and labels.
 *
 * @param {object} slide
 * @param {Array<{type:string,label:string,start:number,end:number,delta:number}>} bars
 * @param {{ x:number, y:number, w:number, h:number }} bridgeArea
 * @param {{ decimals:number, unitPrefix:string, unitSuffix:string }} numberStyle
 * @returns {{ bars: Array<{ x:number, y:number, w:number, h:number, centerX:number, bar:any }>, plot: {x:number,y:number,w:number,h:number} }}
 */
function renderBridgeBars(slide, bars, bridgeArea, numberStyle, typography) {
  const topPad = 0.36;
  const bottomPad = 0.53;
  const sidePad = 0.06;
  const plot = {
    x: bridgeArea.x + sidePad,
    y: bridgeArea.y + topPad,
    w: Math.max(2.0, bridgeArea.w - sidePad * 2),
    h: Math.max(0.9, bridgeArea.h - topPad - bottomPad),
  };

  const { minValue, maxValue } = scaleDomain(bars);
  const span = maxValue - minValue;
  const valueToY = (value) => plot.y + ((maxValue - value) / span) * plot.h;
  const zeroY = valueToY(0);
  const slotW = plot.w / Math.max(1, bars.length);
  const barW = Math.max(0.11, Math.min(0.42, slotW * 0.58));

  // Baseline helps interpret positive/negative movement clearly.
  slide.addShape('line', {
    x: plot.x,
    y: zeroY,
    w: plot.w,
    h: 0,
    line: { color: 'C8CDD3', pt: 0.6 },
  });

  const rendered = [];
  bars.forEach((bar, idx) => {
    const centerX = plot.x + slotW * idx + slotW / 2;
    const x = centerX - barW / 2;
    const startY = valueToY(bar.start);
    const endY = valueToY(bar.end);
    const y = Math.min(startY, endY);
    const h = Math.max(0.03, Math.abs(endY - startY));

    const fillColor =
      bar.type === 'delta'
        ? bar.delta >= 0
          ? STYLE.positive
          : STYLE.negative
        : STYLE.total;

    slide.addShape('rect', {
      x,
      y,
      w: barW,
      h,
      fill: { color: fillColor },
      line: { color: fillColor, pt: 0.2 },
    });

    if (idx > 0 && bar.type === 'delta') {
      const previous = bars[idx - 1];
      const prevEndY = valueToY(previous.end);
      const currStartY = valueToY(bar.start);
      slide.addShape('line', {
        x: rendered[idx - 1].centerX,
        y: prevEndY,
        w: centerX - rendered[idx - 1].centerX,
        h: currStartY - prevEndY,
        line: { color: STYLE.connector, pt: 0.5, dash: 'dash' },
      });
    }

    const isDelta = bar.type === 'delta';
    const labelValue = isDelta ? bar.delta : bar.end;
    const valueLabel = formatBridgeValue(labelValue, {
      ...numberStyle,
      showPlus: isDelta,
      useParensForNegatives: true,
    });
    const valueY = isDelta && labelValue < 0 ? y + h + 0.02 : Math.max(plot.y - 0.02, y - 0.16);
    slide.addText(valueLabel, {
      x: x - 0.13,
      y: valueY,
      w: barW + 0.26,
      h: 0.12,
      align: 'center',
      fontFace: FONTS.body,
      fontSize: typography.bridgeValue,
      bold: true,
      color: COLORS.kpmgBlue,
      margin: 0,
      valign: 'mid',
    });

    slide.addText(String(bar.label || ''), {
      x: centerX - slotW / 2 + 0.01,
      y: plot.y + plot.h + 0.07,
      w: Math.max(0.12, slotW - 0.02),
      h: 0.36,
      fontFace: FONTS.body,
      fontSize: typography.bridgeLabel,
      color: COLORS.black,
      align: 'center',
      valign: 'top',
      margin: 0,
      breakLine: false,
      fit: 'shrink',
      wrap: true,
    });

    rendered.push({ x, y, w: barW, h, centerX, bar });
  });

  return { bars: rendered, plot };
}

/**
 * Render top phase brackets and numeric chips.
 *
 * @param {object} pptx
 * @param {object} slide
 * @param {Array<{ centerX:number }>} renderedBars
 * @param {Array<{x:number,w:number}>} analysisBoxes
 * @param {{ x:number, y:number, w:number, h:number }} bridgeArea
 */
function renderPhaseMarkers(pptx, slide, renderedBars, analysisBoxes, bridgeArea, typography) {
  const stepBars = renderedBars.slice(1, -1);
  const phaseCount = Math.max(1, analysisBoxes.length);
  if (stepBars.length === 0) return;

  const lineY = bridgeArea.y + 0.02;
  for (let i = 0; i < phaseCount; i += 1) {
    const from = Math.floor((i * stepBars.length) / phaseCount);
    const to = Math.floor(((i + 1) * stepBars.length) / phaseCount) - 1;
    const leftBar = stepBars[Math.max(0, from)];
    const rightBar = stepBars[Math.max(0, Math.min(stepBars.length - 1, to))];
    const x1 = leftBar.centerX - leftBar.w / 2;
    const x2 = rightBar.centerX + rightBar.w / 2;
    const mid = (x1 + x2) / 2;

    slide.addShape(pptx.ShapeType.line, {
      x: x1,
      y: lineY,
      w: Math.max(0.1, x2 - x1),
      h: 0,
      line: { color: COLORS.kpmgBlue, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.line, {
      x: x1,
      y: lineY,
      w: 0,
      h: 0.08,
      line: { color: COLORS.kpmgBlue, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.line, {
      x: x2,
      y: lineY,
      w: 0,
      h: 0.08,
      line: { color: COLORS.kpmgBlue, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: mid - 0.12,
      y: lineY - 0.10,
      w: 0.24,
      h: 0.22,
      fill: { color: COLORS.kpmgBlue },
      line: { color: COLORS.kpmgBlue, pt: 0.5 },
    });
    slide.addText(String(i + 1), {
      x: mid - 0.12,
      y: lineY - 0.10,
      w: 0.24,
      h: 0.22,
      fontFace: FONTS.body,
      fontSize: typography.phaseBadge,
      bold: true,
      color: COLORS.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
    });
  }
}

/**
 * Render analysis boxes below the bridge.
 *
 * @param {object} slide
 * @param {Array<{ heading?: string, title?: string, body?: string[]|string }>} analysisColumns
 * @param {Array<{x:number,y:number,w:number,h:number}>} boxes
 * @param {string} bodyStyle
 */
function renderAnalysis(slide, analysisColumns, boxes, bodyStyle, typography) {
  const safeColumns = Array.isArray(analysisColumns) ? analysisColumns : [];
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);

  boxes.forEach((box, idx) => {
    const column = safeColumns[idx] || {};
    const heading = sanitizeText(column.heading || column.title || `Phase ${idx + 1}`);
    const body = Array.isArray(column.body)
      ? column.body
      : String(column.body || '').trim()
        ? [String(column.body).trim()]
        : [];

    slide.addShape('rect', {
      ...box,
      fill: { color: COLORS.white },
      line: { color: COLORS.kpmgBlue, pt: 1 },
    });
    slide.addShape('ellipse', {
      x: box.x - 0.07,
      y: box.y - 0.08,
      w: 0.22,
      h: 0.20,
      fill: { color: COLORS.kpmgBlue },
      line: { color: COLORS.kpmgBlue, pt: 0.5 },
    });
    slide.addText(String(idx + 1), {
      x: box.x - 0.07,
      y: box.y - 0.08,
      w: 0.22,
      h: 0.20,
      fontFace: FONTS.body,
      fontSize: typography.analysisBadge,
      bold: true,
      color: COLORS.white,
      align: 'center',
      valign: 'mid',
      margin: 0,
    });

    slide.addText(heading, {
      x: box.x + 0.10,
      y: box.y + 0.06,
      w: Math.max(0.2, box.w - 0.16),
      h: 0.22,
      fontFace: FONTS.body,
      fontSize: typography.analysisHeading,
      bold: true,
      color: COLORS.black,
      wrap: true,
      margin: [0, 0, 0, 0],
      valign: 'top',
      fit: 'shrink',
    });

    slide.addText(toBodyRuns(body, effectiveBodyStyle), {
      x: box.x + 0.08,
      y: box.y + 0.29,
      w: Math.max(0.2, box.w - 0.14),
      h: Math.max(0.3, box.h - 0.34),
      fontFace: FONTS.body,
      fontSize: typography.analysisBody,
      color: COLORS.black,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
      fit: 'shrink',
    });
  });
}

/**
 * Render bridge + analysis slide.
 *
 * @param {object} pptx
 * @param {object} [slideSpec]
 * @returns {object}
 */
export function addAnalysisBridge(
  pptx,
  { title, strapline, bridge, analysisColumns, source, note, bodyStyle, geometry, typography, masterName } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const phaseCount = resolvePhaseCount(analysisColumns, geometry);
  const g = resolveGeometry(geometry, phaseCount);
  const textStyles = resolveTypography(typography || geometry?.typography);

  addTitle(slide, title, g.title);

  if (strapline) {
    slide.addShape('rect', {
      x: g.bridgeArea.x,
      y: g.bridgeArea.y - 0.23,
      w: g.bridgeArea.w,
      h: 0.18,
      fill: { color: COLORS.kpmgBlue },
      line: { color: COLORS.kpmgBlue, pt: 0.5 },
    });
    slide.addText(String(strapline), {
      x: g.bridgeArea.x + 0.06,
      y: g.bridgeArea.y - 0.22,
      w: Math.max(0.2, g.bridgeArea.w - 0.12),
      h: 0.16,
      fontFace: FONTS.body,
      fontSize: textStyles.strapline,
      bold: true,
      color: COLORS.white,
      valign: 'mid',
      margin: 0,
    });
  }

  const validated = validateBridgeSpec(bridge || {});
  if (!validated.normalized) {
    // Render explicit error text in-slide for easier QA diagnosis.
    slide.addText(`Bridge data invalid: ${validated.errors.join('; ')}`, {
      x: g.bridgeArea.x,
      y: g.bridgeArea.y + 0.2,
      w: g.bridgeArea.w,
      h: 0.5,
      fontFace: FONTS.body,
      fontSize: textStyles.error,
      color: COLORS.orange,
      bold: true,
      wrap: true,
      margin: 0,
    });
    return slide;
  }

  const bars = buildBridgeBars(validated.normalized);
  const rendered = renderBridgeBars(slide, bars, g.bridgeArea, {
    decimals: validated.normalized.decimals,
    unitPrefix: validated.normalized.unitPrefix || '$',
    unitSuffix: validated.normalized.unitSuffix || '',
  }, textStyles);
  renderPhaseMarkers(pptx, slide, rendered.bars, g.analysisBoxes, g.bridgeArea, textStyles);
  renderAnalysis(slide, analysisColumns, g.analysisBoxes, bodyStyle, textStyles);

  const footnotes = [source, note].filter((v) => String(v || '').trim().length > 0).map((v) => String(v).trim());
  if (footnotes.length > 0) {
    const footnoteText = footnotes.join('\n');
    const sourceHeight = Math.max(
      g.source.h,
      Math.min(
        0.44,
        (Math.max(1, Math.ceil(footnoteText.length / Math.max(20, Math.floor(g.source.w * 12.5 * (10 / TYPE_SIZES.source))))) *
          ((TYPE_SIZES.source * 1.15) / 72)) + 0.02,
      ),
    );
    const safeTop = footerSafeTopForMaster(masterName);
    const highestAnalysisBottom = Math.max(...g.analysisBoxes.map((box) => box.y + box.h));
    let sourceY = g.source.y;
    let sourceH = sourceHeight;
    if (safeTop) {
      const preferredY = safeTop - sourceHeight;
      const minY = highestAnalysisBottom + 0.03;
      sourceY = Math.max(minY, Math.min(g.source.y, preferredY));
      sourceH = Math.max(0.1, Math.min(sourceHeight, safeTop - sourceY));
    }
    slide.addText(footnotes.join('\n'), {
      x: g.source.x,
      y: sourceY,
      w: g.source.w,
      h: sourceH,
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.source,
      color: COLORS.kpmgBlue,
      italic: true,
      wrap: TEXT_BOX.wrap,
      margin: [0, 0, 0, 0],
      valign: 'top',
    });
  }

  return slide;
}
