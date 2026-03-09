import {
  clampToMasterFooter,
  computeStrapShift,
  footerSafeTopForMaster,
  resolveLayoutMetrics,
  shiftBox,
} from './layout.js';
import { resolveCalloutLayout } from './callouts.js';
import { requireGeometryBox } from '../runtime/geometry-contract.js';

export function computeAnalysisWideChart2ColsTextGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  chart = null,
  callouts = [],
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const strapText = strapline;
  const straplineBox = requireGeometryBox(g.straplineBox, {
    slideType: 'analysisWideChart2ColsText',
    key: 'straplineBox',
  });

  const bodyBase = requireGeometryBox(g.bodyBox, { slideType: 'analysisWideChart2ColsText', key: 'bodyBox' });
  const chartBase = requireGeometryBox(g.chartBox, { slideType: 'analysisWideChart2ColsText', key: 'chartBox' });
  const yShift = computeStrapShift(strapText ? straplineBox : null, Math.min(bodyBase.y, chartBase.y), layoutMetrics.strapGap);
  const textBox = shiftBox(bodyBase, yShift);
  const shiftedChartBox = shiftBox(chartBase, yShift);
  const safeTextBoxBase = clampToMasterFooter(textBox, masterName, 0, footerSafeTopByMaster);
  const calloutLayout = resolveCalloutLayout({
    slideType: 'analysisWideChart2ColsText',
    callouts,
    textBox: safeTextBoxBase,
    preferredBoxes: g.calloutBoxes,
  });
  const safeTextBox = calloutLayout.adjustedTextBox || safeTextBoxBase;
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = clampToMasterFooter(shiftedChartBox, masterName, sourcePad, footerSafeTopByMaster);

  return {
    geometry: g,
    strapText,
    straplineBox: strapText ? straplineBox : null,
    callouts: calloutLayout.callouts,
    calloutBoxes: calloutLayout.calloutBoxes,
    safeTextBox,
    safeChartBox,
  };
}

export function computeAnalysisWideChartTableTextGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  chart,
  table,
  noteSource,
  showSummaryChart = false,
  callouts = [],
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const strapText = strapline;
  const straplineBoxBase = requireGeometryBox(g.straplineBox, {
    slideType: 'analysisWideChartTableText',
    key: 'straplineBox',
  });

  const topBase = requireGeometryBox(g.bodyBox, { slideType: 'analysisWideChartTableText', key: 'bodyBox' });
  const headingBase = requireGeometryBox(g.headingBox, { slideType: 'analysisWideChartTableText', key: 'headingBox' });
  const yShift = computeStrapShift(strapText ? straplineBoxBase : null, topBase.y, layoutMetrics.strapGap);
  const hasChartData = Boolean(chart?.type && Array.isArray(chart?.data) && chart.data.length > 0);
  const hasTableData = Boolean(table?.headers && Array.isArray(table?.rows) && table.rows.length > 0);
  const shouldRenderChart = hasChartData;
  const chartBase = shouldRenderChart
    ? requireGeometryBox(g.chartBox, { slideType: 'analysisWideChartTableText', key: 'chartBox' })
    : null;
  const tableBase = hasTableData
    ? requireGeometryBox(g.tableBox, { slideType: 'analysisWideChartTableText', key: 'tableBox' })
    : null;
  const footerSafeTop = footerSafeTopForMaster(masterName, footerSafeTopByMaster);

  let textBox = shiftBox(topBase, yShift);
  let chartBox = chartBase ? shiftBox(chartBase, yShift) : null;
  let tableBox = tableBase ? shiftBox(tableBase, yShift) : null;

  const headingBottom = headingBase.y + headingBase.h;
  const shouldNormalizeStackedGeometry = Boolean(
    hasChartData &&
      hasTableData &&
      chartBox &&
      textBox &&
      tableBox &&
      chartBox.y + chartBox.h <= headingBottom + 0.05 &&
      textBox.y >= headingBottom + 1.3,
  );
  if (shouldNormalizeStackedGeometry) {
    if (!Number.isFinite(footerSafeTop)) {
      throw new Error(`Missing required footer safe-top for master "${masterName}"`);
    }
    const contentTop = headingBottom + 0.06 + yShift;
    const contentBottom = footerSafeTop - (noteSource && g.noteBox ? 0.22 : 0);
    const available = Math.max(2.8, contentBottom - contentTop);
    const upperH = Math.max(1.35, Math.min(2.0, available * 0.48));
    const lowerY = contentTop + upperH + 0.1;
    const lowerH = Math.max(1.2, available - upperH - 0.1);
    const leftX = tableBox?.x;
    const leftW = tableBox?.w;
    const rightX = textBox?.x;
    const rightW = textBox?.w;
    if (![leftX, leftW, rightX, rightW].every(Number.isFinite)) {
      throw new Error('Missing geometry for analysis-wide chart/table layout normalization');
    }

    chartBox = { x: leftX, y: contentTop, w: leftW, h: upperH };
    textBox = { x: rightX, y: contentTop, w: rightW, h: upperH };
    tableBox = { x: leftX, y: lowerY, w: leftW, h: lowerH };
  } else if (hasChartData && hasTableData && !Number.isFinite(footerSafeTop)) {
    throw new Error(`Missing required footer safe-top for master "${masterName}"`);
  }

  const safeTextBoxBase = clampToMasterFooter(textBox, masterName, 0, footerSafeTopByMaster);
  const sourcePad = chart?.source ? 0.3 : 0;
  const safeChartBox = chartBox ? clampToMasterFooter(chartBox, masterName, sourcePad, footerSafeTopByMaster) : null;
  const safeTableBox = tableBox ? clampToMasterFooter(tableBox, masterName, 0, footerSafeTopByMaster) : null;
  const calloutLayout = resolveCalloutLayout({
    slideType: 'analysisWideChartTableText',
    callouts,
    textBox: safeTextBoxBase,
    preferredBoxes: g.calloutBoxes,
    headingBox: headingBase,
  });
  const safeTextBox = calloutLayout.adjustedTextBox || safeTextBoxBase;

  return {
    geometry: g,
    strapText,
    straplineBox: strapText ? straplineBoxBase : null,
    headingBase,
    callouts: calloutLayout.callouts,
    calloutBoxes: calloutLayout.calloutBoxes,
    safeTextBox,
    safeChartBox,
    safeTableBox,
  };
}
