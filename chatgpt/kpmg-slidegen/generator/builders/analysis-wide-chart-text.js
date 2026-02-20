import { FONTS, COLORS, CHART_COLORS, TYPE_SIZES, TEXT_BOX, STRAPLINE_SHIFT } from '../tokens.js';
import { toBulletRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { pickDataLabelColor } from '../helpers/chart.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';
import { clampBoxToBottom } from '../helpers/geometry.js';
import { addAnalysisTable } from './analysis-narrow-table.js';

const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.6, w: 11.1596, h: 0.6 },
    strapline: { x: 1.0919, y: 1.2, w: 11.1596, h: 0.35 },
    leftText: { x: 1.0919, y: 1.6, w: 5.6, h: 5.4 },
    rightChart: { x: 7.0, y: 1.6, w: 5.25, h: 5.0 },
    topText: { x: 1.0919, y: 1.6, w: 11.1596, h: 2.2 },
    bottomChart: { x: 1.0919, y: 3.9, w: 11.1596, h: 3.0 },
  },
  textStyles: {
    strapline: { fontFace: FONTS.body, fontSize: TYPE_SIZES.strapline, color: COLORS.kpmgPurple, italic: true, bold: true },
    body: { fontFace: FONTS.body, fontSize: TYPE_SIZES.body, color: COLORS.black, paraSpaceAfter: 6 },
    source: { fontFace: FONTS.body, fontSize: TYPE_SIZES.source, color: COLORS.kpmgBlue, italic: true, paraSpaceAfter: 0 },
  },
};

function addChart(pptx, slide, chart, geo) {
  if (!chart || !chart.type || !chart.data) return;
  const typeMap = {
    bar: pptx.ChartType?.bar || 'bar',
    bar3d: pptx.ChartType?.bar3D || 'bar3D',
    line: pptx.ChartType?.line || 'line',
    pie: pptx.ChartType?.pie || 'pie',
    doughnut: pptx.ChartType?.doughnut || 'doughnut',
    area: pptx.ChartType?.area || 'area',
    scatter: pptx.ChartType?.scatter || 'scatter',
    radar: pptx.ChartType?.radar || 'radar',
  };

  const darkBarTypes = ['bar', 'bar3d', 'area'];
  const useLightLabels = darkBarTypes.includes(chart.type);

  const opts = {
    showLegend: true,
    legendPos: 'b',
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
    ...(useLightLabels && chart.type === 'bar' ? { dataLabelPosition: 'inEnd' } : {}),
    // Cleaner due-diligence chart style: no background gridlines.
    valGridLine: { style: 'none' },
    catGridLine: { style: 'none' },
    // Match template: white background (no gray plot-area tint)
    chartArea: { fill: { color: 'FFFFFF' } },
    plotArea: { fill: { color: 'FFFFFF' } },
    dataBorder: { pt: 0.5, color: COLORS.white },
    chartColors: CHART_COLORS,
    ...(chart.opts || {}),
  };

  // For single-series bar/area charts, use one consistent color instead of
  // cycling through the palette (which implies different categories).
  const seriesCount = Array.isArray(chart.data) ? chart.data.length : 0;
  if (seriesCount === 1 && ['bar', 'bar3d', 'area'].includes(chart.type)) {
    opts.chartColors = [CHART_COLORS[0]];
  } else {
    opts.chartColors = CHART_COLORS;
  }

  if (chart.type === 'pie' || chart.type === 'doughnut') {
    opts.dataLabelColor = pickDataLabelColor(opts.chartColors);
  }

  slide.addChart(typeMap[chart.type] || chart.type, chart.data, { ...geo, ...opts });

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
    valign: 'mid',
  });
}

export function addAnalysisWideChart2ColsText(pptx, { title, strapline, body, chart, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || TOKENS.geometry;

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapline && (g.strapline || TOKENS.geometry.strapline)) {
    slide.addText(String(strapline), {
      ...(g.strapline || TOKENS.geometry.strapline),
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const hasMeasuredStrapline = Boolean(g.strapline);
  const yShift = strapline && !hasMeasuredStrapline ? STRAPLINE_SHIFT : 0;
  const leftBase = g.leftText || TOKENS.geometry.leftText;
  const rightBase = g.rightChart || TOKENS.geometry.rightChart;
  const textBox = yShift ? { ...leftBase, y: leftBase.y + yShift, h: leftBase.h - yShift } : leftBase;
  const chartBox = yShift ? { ...rightBase, y: rightBase.y + yShift, h: rightBase.h - yShift } : rightBase;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const safeTextBox = footerSafeTop ? clampBoxToBottom(textBox, footerSafeTop) : textBox;
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = footerSafeTop ? clampBoxToBottom(chartBox, footerSafeTop - sourcePad) : chartBox;

  slide.addText(toBulletRuns(body), { ...safeTextBox, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });
  addChart(pptx, slide, chart, safeChartBox);

  return slide;
}

export function addAnalysisWideChartTableText(
  pptx,
  { title, strapline, heading, body, chart, table, noteSource, showSummaryChart = false, showChart = false, geometry, masterName } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || TOKENS.geometry;

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  const straplineBox = g.strapline || g.bodyBoxes?.[0] || TOKENS.geometry.strapline;
  if (strapline && straplineBox) {
    slide.addText(String(strapline), {
      ...straplineBox,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const hasMeasuredStrapline = Boolean(g.strapline || g.bodyBoxes?.[0]);
  const yShift = strapline && !hasMeasuredStrapline ? STRAPLINE_SHIFT : 0;
  const topBase = g.body || g.rightBody || g.bodyBoxes?.[2] || g.topText || TOKENS.geometry.topText;
  const shouldRenderChart = Boolean(showChart || showSummaryChart);
  const chartBase = shouldRenderChart ? (g.chart || g.bottomChart || g.summaryChart || null) : null;
  const tableBase = g.table || null;
  const headingBase = g.heading || g.bodyBoxes?.[1] || null;
  const textBox = yShift ? { ...topBase, y: topBase.y + yShift, h: topBase.h - yShift } : topBase;
  const chartBox = chartBase
    ? (yShift ? { ...chartBase, y: chartBase.y + yShift, h: chartBase.h - yShift } : chartBase)
    : null;
  const tableBox = tableBase
    ? yShift
      ? { ...tableBase, y: tableBase.y + yShift, h: tableBase.h - yShift }
      : tableBase
    : null;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const safeTextBox = footerSafeTop ? clampBoxToBottom(textBox, footerSafeTop) : textBox;
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = chartBox
    ? (footerSafeTop ? clampBoxToBottom(chartBox, footerSafeTop - sourcePad) : chartBox)
    : null;
  const safeTableBox = tableBox && footerSafeTop ? clampBoxToBottom(tableBox, footerSafeTop) : tableBox;

  addHeadingBand(pptx, slide, heading, headingBase);

  if (safeTableBox && table?.headers && Array.isArray(table?.rows)) {
    addAnalysisTable(slide, table, {
      x: safeTableBox.x,
      y: safeTableBox.y,
      w: safeTableBox.w,
      h: safeTableBox.h,
      tableTitle: title,
      tableHeading: heading || table?.title || table?.heading || title,
      showTitleBar: false,
    });
  }

  slide.addText(toBulletRuns(body), { ...safeTextBox, ...TOKENS.textStyles.body, wrap: TEXT_BOX.wrap, margin: TEXT_BOX.marginPt, valign: 'top' });
  if (safeChartBox && chart?.type && Array.isArray(chart?.data) && chart.data.length > 0) {
    addChart(pptx, slide, chart, safeChartBox);
  }
  if (noteSource && g.note) {
    slide.addText(String(noteSource), {
      ...g.note,
      ...TOKENS.textStyles.source,
      wrap: TEXT_BOX.wrap,
      margin: 0,
      valign: 'top',
      breakLine: true,
    });
  }

  return slide;
}
