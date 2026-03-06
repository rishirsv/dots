import { addTitle } from '../helpers/title.js';
import { renderCallouts } from '../helpers/callouts.js';
import { addBodyBlock, addChartBlock, addStraplineBlock, addTableBlock } from '../helpers/slide-components.js';
import { sanitizeText } from '../helpers/text.js';
import { normalizeBodyStyle } from '../helpers/layout.js';
import {
  THEME_COMPONENT_KEYS,
  resolveBodyTextStyle,
  resolveSourceTextStyle,
  resolveStraplineTextStyle,
  resolveTextBoxOptions,
  resolveTextThemePrimitives,
  resolveTheme,
  toFiniteNumber,
} from '../helpers/theme.js';
import {
  computeAnalysisWideChart2ColsTextGeometry,
  computeAnalysisWideChartTableTextGeometry,
} from '../helpers/analysis-wide-layout.js';
import { addAnalysisTable } from './analysis-narrow-table.js';
import { requireGeometryBox } from '../runtime/geometry-contract.js';

function resolveStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const textTokens = resolveTextThemePrimitives(resolvedTheme);
  const wideTokens = resolvedTheme.components?.[THEME_COMPONENT_KEYS.analysisWideChart] || {};
  const annotation = wideTokens.annotation || {};
  const headingBand = wideTokens.headingBand || {};
  const chartTokens = wideTokens.chart || {};
  return {
    textStyles: {
      strapline: resolveStraplineTextStyle(resolvedTheme, { colorKey: 'kpmgPurple', bold: true, italic: true }),
      body: resolveBodyTextStyle(resolvedTheme, { paraSpaceAfter: textTokens.bodyParaSpaceAfter }),
      source: resolveSourceTextStyle(resolvedTheme, { paraSpaceAfter: textTokens.sourceParaSpaceAfter }),
    },
    headingBand: {
      fill: resolvedTheme.colors.kpmgBlue,
      line: resolvedTheme.colors.kpmgBlue,
      linePt: toFiniteNumber(headingBand.linePt, 1),
      textColor: resolvedTheme.colors.white,
      textFont: resolvedTheme.fonts.body,
      textSize: resolvedTheme.typeSizes.body,
    },
    chart: {
      palette: resolvedTheme.chart.palette,
      legendFontSize: toFiniteNumber(resolvedTheme.chart.fontSizes.legend, 7),
      labelFontSize: toFiniteNumber(resolvedTheme.chart.fontSizes.label, 8),
      dataLabelFontSize: toFiniteNumber(resolvedTheme.chart.fontSizes.dataLabel, 7),
      background: resolvedTheme.colors.chart.background,
      fontFace: resolvedTheme.fonts.body,
      lightLabelColor: resolvedTheme.colors.white,
      darkLabelColor: resolvedTheme.colors.black,
      seriesLabelBg: resolvedTheme.colors.kpmgBlue,
      dataBorder: resolvedTheme.colors.white,
      dataBorderPt: toFiniteNumber(chartTokens.dataBorderPt, 0.5),
    },
    annotation: {
      borderColor: resolvedTheme.colors.kpmgBlue,
      fillColor: resolvedTheme.colors.white,
      titleColor: resolvedTheme.colors.kpmgBlue,
      textColor: resolvedTheme.colors.black,
      titleSize: toFiniteNumber(annotation.titleSize, 7.5),
      textSize: toFiniteNumber(annotation.textSize, 7.5),
      borderPt: toFiniteNumber(annotation.borderPt, 0.8),
      marginPt: Array.isArray(annotation.marginPt) ? annotation.marginPt : [2, 3, 2, 3],
      titleParaSpaceAfter: toFiniteNumber(annotation.titleParaSpaceAfter, 1),
      fontFace: resolvedTheme.fonts.body,
    },
    text: {
      marginNone: textTokens.marginNone,
    },
  };
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function normalizeChartAnnotations(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (let idx = 0; idx < raw.length; idx += 1) {
    const item = raw[idx];
    if (!item || typeof item !== 'object') {
      throw new Error(`chart.annotations[${idx}] must be an object`);
    }
    const title = sanitizeText(item.title);
    const text = sanitizeText(item.text);
    if (!title && !text) {
      throw new Error(`chart.annotations[${idx}] must include title or text`);
    }
    const anchor = sanitizeText(item.anchor);
    if (!['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(anchor)) {
      throw new Error(`chart.annotations[${idx}] anchor must be one of topLeft|topRight|bottomLeft|bottomRight`);
    }
    out.push({ title, text, anchor });
    if (out.length >= 4) break;
  }
  return out;
}

function chartAnnotationBox(chartGeo, anchor, slotIndex = 0) {
  const boxW = clamp(chartGeo.w * 0.34, 1.6, 2.8);
  const boxH = clamp(chartGeo.h * 0.2, 0.45, 0.72);
  const margin = 0.07;
  const offset = slotIndex * (boxH + 0.04);

  if (anchor === 'topLeft') {
    return { x: chartGeo.x + margin, y: chartGeo.y + margin + offset, w: boxW, h: boxH };
  }
  if (anchor === 'bottomLeft') {
    return { x: chartGeo.x + margin, y: chartGeo.y + chartGeo.h - boxH - margin - offset, w: boxW, h: boxH };
  }
  if (anchor === 'bottomRight') {
    return {
      x: chartGeo.x + chartGeo.w - boxW - margin,
      y: chartGeo.y + chartGeo.h - boxH - margin - offset,
      w: boxW,
      h: boxH,
    };
  }
  return {
    x: chartGeo.x + chartGeo.w - boxW - margin,
    y: chartGeo.y + margin + offset,
    w: boxW,
    h: boxH,
  };
}

function toChartAnnotationRuns(item, annotationStyle) {
  const runs = [];
  if (item.title) {
    runs.push({
      text: item.title,
      options: {
        bold: true,
        color: annotationStyle.titleColor,
        fontSize: annotationStyle.titleSize,
        breakLine: Boolean(item.text),
        paraSpaceAfter: item.text ? annotationStyle.titleParaSpaceAfter : 0,
      },
    });
  }
  if (item.text) {
    runs.push({
      text: item.text,
      options: {
        color: annotationStyle.textColor,
        fontSize: annotationStyle.textSize,
        breakLine: false,
      },
    });
  }
  return runs;
}

function renderChartAnnotations(pptx, slide, chart, chartGeo, styles) {
  if (!pptx || !slide || !chart || !chartGeo) return;
  const annotations = normalizeChartAnnotations(chart.annotations);
  if (annotations.length === 0) return;

  const slotsUsed = new Map();
  for (const item of annotations) {
    const idx = slotsUsed.get(item.anchor) || 0;
    slotsUsed.set(item.anchor, idx + 1);
    const box = chartAnnotationBox(chartGeo, item.anchor, idx);
    const runs = toChartAnnotationRuns(item, styles.annotation);
    if (runs.length === 0) continue;
    slide.addText(runs, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      fontFace: styles.annotation.fontFace,
      fontSize: styles.annotation.textSize,
      color: styles.annotation.textColor,
      line: { color: styles.annotation.borderColor, pt: styles.annotation.borderPt },
      fill: { color: styles.annotation.fillColor },
      margin: styles.annotation.marginPt,
      wrap: true,
      fit: 'shrink',
      valign: 'top',
    });
  }
}

function addChart(pptx, slide, chart, geo, styles) {
  if (!chart || !chart.type || !chart.data) return;
  const chartType = String(chart.type).toLowerCase();

  const darkBarTypes = ['bar', 'bar3d', 'area'];
  const useLightLabels = darkBarTypes.includes(chartType);
  const palette = styles.chart.palette;

  const seriesCount = Array.isArray(chart.data) ? chart.data.length : 0;
  const chartColors = seriesCount === 1 && ['bar', 'bar3d', 'area'].includes(chartType)
    ? [palette[0]]
    : palette;
  addChartBlock(pptx, slide, chart, geo, styles, {
    legendPos: 'b',
    useLightLabels,
    lightLabelColor: styles.chart.lightLabelColor,
    darkLabelColor: styles.chart.darkLabelColor,
    seriesLabelBg: styles.chart.seriesLabelBg,
    dataBorder: { pt: styles.chart.dataBorderPt, color: styles.chart.dataBorder },
    extraOptions: {
      chartColors,
      ...(useLightLabels && chartType === 'bar' ? { dataLabelPosition: 'inEnd' } : {}),
    },
  });

  if (chart.source) {
    slide.addText(chart.source, {
      x: geo.x,
      y: geo.y + geo.h + 0.05,
      w: geo.w,
      h: 0.2,
      ...styles.textStyles.source,
    });
  }
}

function addHeadingBand(pptx, slide, heading, geo, styles, textBox) {
  if (!heading || !geo) return;
  slide.addShape(pptx.ShapeType.rect, {
    ...geo,
    line: { color: styles.headingBand.line, pt: styles.headingBand.linePt },
    fill: { color: styles.headingBand.fill },
  });
  slide.addText(String(heading), {
    x: geo.x + 0.08,
    y: geo.y + 0.02,
    w: Math.max(0.4, geo.w - 0.16),
    h: geo.h,
    fontFace: styles.headingBand.textFont,
    fontSize: styles.headingBand.textSize,
    color: styles.headingBand.textColor,
    bold: true,
    ...textBox,
    valign: 'mid',
  });
}

export function addAnalysisWideChart2ColsText(
  pptx,
  slideSpec = {},
  ctx = {},
) {
  const { title, strapline, body, callouts, bodyStyle, chart } = slideSpec;
  const { geometry, masterName, footerSafeTopByMaster, theme } = ctx;
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme);
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const {
    geometry: g,
    strapText,
    straplineBox,
    callouts: resolvedCallouts,
    calloutBoxes,
    safeTextBox,
    safeChartBox,
  } = computeAnalysisWideChart2ColsTextGeometry({
    geometry,
    masterName,
    footerSafeTopByMaster,
    theme,
    strapline,
    chart,
    callouts,
  });
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);
  const titleBox = requireGeometryBox(g.titleBox, { slideType: 'analysisWideChart2ColsText', key: 'titleBox' });

  addTitle(slide, title, titleBox, { theme });
  if (strapText && !straplineBox) {
    throw new Error('Missing required geometry "straplineBox" for slide type "analysisWideChart2ColsText"');
  }
  addStraplineBlock(slide, strapText, straplineBox, { theme, style: styles.textStyles.strapline, textBox });
  addBodyBlock(slide, body, safeTextBox, { theme, bodyStyle: effectiveBodyStyle, style: styles.textStyles.body, textBox });
  addChart(pptx, slide, chart, safeChartBox, styles);
  renderChartAnnotations(pptx, slide, chart, safeChartBox, styles);
  renderCallouts(pptx, slide, {
    callouts: resolvedCallouts,
    boxes: calloutBoxes,
    slideType: 'analysisWideChart2ColsText',
    textBox: safeTextBox,
    chartBox: safeChartBox,
    theme,
  });

  return slide;
}

export function addAnalysisWideChartTableText(
  pptx,
  slideSpec = {},
  ctx = {},
) {
  const {
    title,
    strapline,
    heading,
    body,
    callouts,
    bodyStyle,
    chart,
    table,
    noteSource,
    showSummaryChart = false,
  } = slideSpec;
  const { geometry, masterName, footerSafeTopByMaster, theme } = ctx;
  const styles = resolveStyles(theme);
  const textBox = resolveTextBoxOptions(theme);
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const {
    geometry: g,
    strapText,
    straplineBox,
    headingBase,
    callouts: resolvedCallouts,
    calloutBoxes,
    safeTextBox,
    safeChartBox,
    safeTableBox,
  } = computeAnalysisWideChartTableTextGeometry({
    geometry,
    masterName,
    footerSafeTopByMaster,
    theme,
    strapline,
    chart,
    table,
    noteSource,
    showSummaryChart,
    callouts,
  });
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);
  const titleBox = requireGeometryBox(g.titleBox, { slideType: 'analysisWideChartTableText', key: 'titleBox' });

  addTitle(slide, title, titleBox, { theme });
  if (strapText && !straplineBox) {
    throw new Error('Missing required geometry "straplineBox" for slide type "analysisWideChartTableText"');
  }
  if (heading && !headingBase) {
    throw new Error('Missing required geometry "headingBox" for slide type "analysisWideChartTableText"');
  }
  addStraplineBlock(slide, strapText, straplineBox, { theme, style: styles.textStyles.strapline, textBox });
  const hasChartData = Boolean(
    chart?.type && Array.isArray(chart?.data) && chart.data.length > 0,
  );
  const hasTableData = Boolean(
    table?.headers && Array.isArray(table?.rows) && table.rows.length > 0,
  );

  addHeadingBand(pptx, slide, heading, headingBase, styles, textBox);

  let tableMeta = null;
  if (safeTableBox && hasTableData) {
    tableMeta = addTableBlock(slide, table, safeTableBox, {
      renderTable: addAnalysisTable,
      renderOptions: {
        tableTitle: title,
        tableHeading: heading || table?.title || table?.heading || title,
        showTitleBar: false,
        theme,
      },
    });
  }

  addBodyBlock(slide, body, safeTextBox, { theme, bodyStyle: effectiveBodyStyle, style: styles.textStyles.body, textBox });
  if (safeChartBox && hasChartData) {
    addChart(pptx, slide, chart, safeChartBox, styles);
    renderChartAnnotations(pptx, slide, chart, safeChartBox, styles);
  }
  if (noteSource && g.noteBox) {
    slide.addText(String(noteSource), {
      ...g.noteBox,
      ...styles.textStyles.source,
      wrap: textBox.wrap,
      margin: styles.text.marginNone,
      valign: 'top',
      breakLine: true,
    });
  }
  renderCallouts(pptx, slide, {
    callouts: resolvedCallouts,
    boxes: calloutBoxes,
    slideType: 'analysisWideChartTableText',
    textBox: safeTextBox,
    chartBox: safeChartBox,
    tableBox: safeTableBox,
    tableMeta,
    theme,
  });

  return slide;
}
