import {
  FONTS,
  COLORS,
  CHART_COLORS,
  TYPE_SIZES,
  TEXT_BOX,
} from "../tokens.js";
import { toBodyRuns } from "../helpers/bullets.js";
import { addTitle } from "../helpers/title.js";
import { pickDataLabelColor } from "../helpers/chart.js";
import { renderCallouts } from "../helpers/callouts.js";
import { sanitizeText } from "../helpers/text.js";
import {
  normalizeBodyStyle,
} from "../helpers/layout.js";
import {
  ANALYSIS_WIDE_LAYOUT_DEFAULTS,
  computeAnalysisWideChart2ColsTextGeometry,
  computeAnalysisWideChartTableTextGeometry,
} from "../helpers/analysis-wide-layout.js";
import { addAnalysisTable } from "./analysis-narrow-table.js";

const TOKENS = {
  geometry: ANALYSIS_WIDE_LAYOUT_DEFAULTS.geometry,
  textStyles: {
    strapline: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.strapline,
      color: COLORS.kpmgPurple,
      italic: true,
      bold: true,
    },
    body: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.body,
      color: COLORS.black,
      paraSpaceAfter: 6,
    },
    source: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.source,
      color: COLORS.kpmgBlue,
      italic: true,
      paraSpaceAfter: 0,
    },
  },
};

const CHART_ANNOTATION_STYLE = Object.freeze({
  borderColor: COLORS.kpmgBlue,
  fillColor: COLORS.white,
  titleColor: COLORS.kpmgBlue,
  textColor: COLORS.black,
  titleSize: 7.5,
  textSize: 7.5,
});

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function normalizeChartAnnotations(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const title = sanitizeText(item.title || item.heading);
    const text = sanitizeText(item.text || item.body);
    if (!title && !text) continue;
    const anchor = sanitizeText(item.anchor || "topRight");
    if (!["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(anchor)) continue;
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

  if (anchor === "topLeft") {
    return { x: chartGeo.x + margin, y: chartGeo.y + margin + offset, w: boxW, h: boxH };
  }
  if (anchor === "bottomLeft") {
    return { x: chartGeo.x + margin, y: chartGeo.y + chartGeo.h - boxH - margin - offset, w: boxW, h: boxH };
  }
  if (anchor === "bottomRight") {
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

function toChartAnnotationRuns(item) {
  const runs = [];
  if (item.title) {
    runs.push({
      text: item.title,
      options: {
        bold: true,
        color: CHART_ANNOTATION_STYLE.titleColor,
        fontSize: CHART_ANNOTATION_STYLE.titleSize,
        breakLine: Boolean(item.text),
        paraSpaceAfter: item.text ? 1 : 0,
      },
    });
  }
  if (item.text) {
    runs.push({
      text: item.text,
      options: {
        color: CHART_ANNOTATION_STYLE.textColor,
        fontSize: CHART_ANNOTATION_STYLE.textSize,
        breakLine: false,
      },
    });
  }
  return runs;
}

function renderChartAnnotations(pptx, slide, chart, chartGeo) {
  if (!pptx || !slide || !chart || !chartGeo) return;
  const annotations = normalizeChartAnnotations(chart.annotations);
  if (annotations.length === 0) return;

  const slotsUsed = new Map();
  for (const item of annotations) {
    const idx = slotsUsed.get(item.anchor) || 0;
    slotsUsed.set(item.anchor, idx + 1);
    const box = chartAnnotationBox(chartGeo, item.anchor, idx);
    const runs = toChartAnnotationRuns(item);
    if (runs.length === 0) continue;
    slide.addText(runs, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      fontFace: FONTS.body,
      fontSize: CHART_ANNOTATION_STYLE.textSize,
      color: CHART_ANNOTATION_STYLE.textColor,
      line: { color: CHART_ANNOTATION_STYLE.borderColor, pt: 0.8 },
      fill: { color: CHART_ANNOTATION_STYLE.fillColor },
      margin: [2, 3, 2, 3],
      wrap: true,
      fit: "shrink",
      valign: "top",
    });
  }
}

function addChart(pptx, slide, chart, geo) {
  if (!chart || !chart.type || !chart.data) return;
  const typeMap = {
    bar: pptx.ChartType?.bar || "bar",
    bar3d: pptx.ChartType?.bar3D || "bar3D",
    line: pptx.ChartType?.line || "line",
    pie: pptx.ChartType?.pie || "pie",
    doughnut: pptx.ChartType?.doughnut || "doughnut",
    area: pptx.ChartType?.area || "area",
    scatter: pptx.ChartType?.scatter || "scatter",
    radar: pptx.ChartType?.radar || "radar",
  };

  const darkBarTypes = ["bar", "bar3d", "area"];
  const useLightLabels = darkBarTypes.includes(chart.type);

  const opts = {
    showLegend: true,
    legendPos: "b",
    legendFontSize: 7,
    legendFontFace: FONTS.body,
    catAxisLabelFontSize: 7,
    valAxisLabelFontSize: 7,
    catAxisLabelFontFace: FONTS.body,
    valAxisLabelFontFace: FONTS.body,
    dataLabelFontFace: FONTS.body,
    dataLabelFontSize: 7,
    dataLabelColor: useLightLabels ? COLORS.white : COLORS.black,
    dataLabelBkgrdColors: useLightLabels ? [COLORS.kpmgBlue] : undefined,
    showValue: true,
    ...(useLightLabels && chart.type === "bar"
      ? { dataLabelPosition: "inEnd" }
      : {}),
    // Cleaner due-diligence chart style: no background gridlines.
    valGridLine: { style: "none" },
    catGridLine: { style: "none" },
    // Match template: white background (no gray plot-area tint)
    chartArea: { fill: { color: "FFFFFF" } },
    plotArea: { fill: { color: "FFFFFF" } },
    dataBorder: { pt: 0.5, color: COLORS.white },
    chartColors: CHART_COLORS,
    ...(chart.opts || {}),
  };

  // For single-series bar/area charts, use one consistent color instead of
  // cycling through the palette (which implies different categories).
  const seriesCount = Array.isArray(chart.data) ? chart.data.length : 0;
  if (seriesCount === 1 && ["bar", "bar3d", "area"].includes(chart.type)) {
    opts.chartColors = [CHART_COLORS[0]];
  } else {
    opts.chartColors = CHART_COLORS;
  }

  if (chart.type === "pie" || chart.type === "doughnut") {
    opts.dataLabelColor = pickDataLabelColor(opts.chartColors);
  }

  slide.addChart(typeMap[chart.type] || chart.type, chart.data, {
    ...geo,
    ...opts,
  });

  if (chart.source) {
    slide.addText(chart.source, {
      x: geo.x,
      y: geo.y + geo.h + 0.05,
      w: geo.w,
      h: 0.2,
      ...TOKENS.textStyles.source,
    });
  }
}

function addHeadingBand(pptx, slide, heading, geo) {
  if (!heading || !geo) return;
  slide.addShape(pptx.ShapeType.rect, {
    ...geo,
    line: { color: COLORS.kpmgBlue, pt: 1 },
    fill: { color: COLORS.kpmgBlue },
  });
  slide.addText(String(heading), {
    x: geo.x + 0.08,
    y: geo.y + 0.02,
    w: Math.max(0.4, geo.w - 0.16),
    h: geo.h,
    fontFace: FONTS.body,
    fontSize: TYPE_SIZES.body,
    color: COLORS.white,
    bold: true,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: "mid",
  });
}

export function addAnalysisWideChart2ColsText(
  pptx,
  { title, strapline, body, callouts, bodyStyle, chart, geometry, masterName } = {},
) {
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
    strapline,
    chart,
    callouts,
  });
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapText && straplineBox) {
    slide.addText(String(strapText), {
      ...straplineBox,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: "top",
    });
  }

  slide.addText(toBodyRuns(body, effectiveBodyStyle), {
    ...safeTextBox,
    ...TOKENS.textStyles.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: "top",
  });
  addChart(pptx, slide, chart, safeChartBox);
  renderChartAnnotations(pptx, slide, chart, safeChartBox);
  renderCallouts(pptx, slide, {
    callouts: resolvedCallouts,
    boxes: calloutBoxes,
    slideType: "analysisWideChart2ColsText",
    textBox: safeTextBox,
    chartBox: safeChartBox,
  });

  return slide;
}

export function addAnalysisWideChartTableText(
  pptx,
  {
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
    geometry,
    masterName,
  } = {},
) {
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
    strapline,
    chart,
    table,
    noteSource,
    showSummaryChart,
    callouts,
  });
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapText && straplineBox) {
    slide.addText(String(strapText), {
      ...straplineBox,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: "top",
    });
  }
  const hasChartData = Boolean(
    chart?.type && Array.isArray(chart?.data) && chart.data.length > 0,
  );
  const hasTableData = Boolean(
    table?.headers && Array.isArray(table?.rows) && table.rows.length > 0,
  );

  addHeadingBand(pptx, slide, heading, headingBase);

  let tableMeta = null;
  if (safeTableBox && hasTableData) {
    tableMeta = addAnalysisTable(slide, table, {
      x: safeTableBox.x,
      y: safeTableBox.y,
      w: safeTableBox.w,
      h: safeTableBox.h,
      tableTitle: title,
      tableHeading: heading || table?.title || table?.heading || title,
      showTitleBar: false,
    });
  }

  slide.addText(toBodyRuns(body, effectiveBodyStyle), {
    ...safeTextBox,
    ...TOKENS.textStyles.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: "top",
  });
  if (safeChartBox && hasChartData) {
    addChart(pptx, slide, chart, safeChartBox);
    renderChartAnnotations(pptx, slide, chart, safeChartBox);
  }
  if (noteSource && g.note) {
    slide.addText(String(noteSource), {
      ...g.note,
      ...TOKENS.textStyles.source,
      wrap: TEXT_BOX.wrap,
      margin: 0,
      valign: "top",
      breakLine: true,
    });
  }
  renderCallouts(pptx, slide, {
    callouts: resolvedCallouts,
    boxes: calloutBoxes,
    slideType: "analysisWideChartTableText",
    textBox: safeTextBox,
    chartBox: safeChartBox,
    tableBox: safeTableBox,
    tableMeta,
  });

  return slide;
}
