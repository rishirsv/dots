import { FONTS, COLORS, CHART_COLORS, TYPE_SIZES, TEXT_BOX, STRAPLINE_SHIFT } from '../tokens.js';
import { addTitle } from '../helpers/title.js';
import { pickDataLabelColor } from '../helpers/chart.js';

const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.6, w: 11.1596, h: 0.6 },
    strapline: { x: 1.0919, y: 1.2, w: 11.1596, h: 0.35 },
    boxes: [
      { x: 1.0919, y: 1.7, w: 2.4, h: 1.1 },
      { x: 3.65, y: 1.7, w: 2.4, h: 1.1 },
      { x: 6.2, y: 1.7, w: 2.4, h: 1.1 },
      { x: 8.75, y: 1.7, w: 2.4, h: 1.1 },
    ],
    chart: { x: 1.0919, y: 3.1, w: 11.1596, h: 3.6 },
  },
  textStyles: {
    strapline: { fontFace: FONTS.body, fontSize: TYPE_SIZES.strapline, color: COLORS.kpmgPurple, italic: true, bold: true },
    kpiValue: { fontFace: FONTS.body, fontSize: 18, color: COLORS.white, bold: true, align: 'center', valign: 'mid' },
    kpiLabel: { fontFace: FONTS.body, fontSize: 7, color: COLORS.white, align: 'center', valign: 'mid' },
    kpiDelta: { fontFace: FONTS.body, fontSize: 6, color: COLORS.white, italic: true, align: 'center', valign: 'mid' },
  },
  colors: [COLORS.kpmgBlue, COLORS.primary, COLORS.kpmgPurple, COLORS.kpmgCyan],
};

function addKpiBox(pptx, slide, geo, kpi, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: geo.x,
    y: geo.y,
    w: geo.w,
    h: geo.h,
    fill: { color },
    rectRadius: 0.06,
  });

  slide.addText(kpi.value || '', {
    x: geo.x + 0.05,
    y: geo.y + 0.05,
    w: geo.w - 0.1,
    h: geo.h * 0.45,
    ...TOKENS.textStyles.kpiValue,
  });

  slide.addText(kpi.label || '', {
    x: geo.x + 0.05,
    y: geo.y + geo.h * 0.52,
    w: geo.w - 0.1,
    h: geo.h * 0.2,
    ...TOKENS.textStyles.kpiLabel,
  });

  if (kpi.delta) {
    slide.addText(kpi.delta, {
      x: geo.x + 0.05,
      y: geo.y + geo.h * 0.73,
      w: geo.w - 0.1,
      h: geo.h * 0.2,
      ...TOKENS.textStyles.kpiDelta,
    });
  }
}

function addChart(pptx, slide, chart, geo) {
  if (!chart || !chart.type || !chart.data) return;
  const typeMap = {
    bar: pptx.ChartType?.bar || 'bar',
    bar3d: pptx.ChartType?.bar3D || 'bar3D',
    line: pptx.ChartType?.line || 'line',
    pie: pptx.ChartType?.pie || 'pie',
    doughnut: pptx.ChartType?.doughnut || 'doughnut',
    area: pptx.ChartType?.area || 'area',
  };

  const darkBarTypes = ['bar', 'bar3d', 'area'];
  const useLightLabels = darkBarTypes.includes(chart.type);

  const opts = {
    ...geo,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 7,
    legendFontFace: FONTS.body,
    chartColors: CHART_COLORS,
    dataLabelColor: useLightLabels ? COLORS.white : COLORS.black,
    dataLabelBkgrdColors: useLightLabels ? [COLORS.kpmgBlue] : undefined,
    showValue: true,
    ...(useLightLabels && chart.type === 'bar' ? { dataLabelPosition: 'inEnd' } : {}),
    // Cleaner due-diligence chart style: no background gridlines.
    valGridLine: { style: 'none' },
    catGridLine: { style: 'none' },
    chartArea: { fill: { color: 'FFFFFF' } },
    plotArea: { fill: { color: 'FFFFFF' } },
    ...(chart.opts || {}),
  };

  if (chart.type === 'pie' || chart.type === 'doughnut') {
    opts.dataLabelColor = pickDataLabelColor(opts.chartColors);
  }

  slide.addChart(typeMap[chart.type] || chart.type, chart.data, opts);
}

export function addSummaryFinancials(pptx, { title, strapline, kpis, chart, geometry, masterName } = {}) {
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
  const kpiList = Array.isArray(kpis) ? kpis : [];
  for (let i = 0; i < Math.min(kpiList.length, 4); i++) {
    const box = (g.boxes && g.boxes[i]) || TOKENS.geometry.boxes[i];
    const geo = { ...box, y: box.y + yShift };
    addKpiBox(pptx, slide, geo, kpiList[i], TOKENS.colors[i % TOKENS.colors.length]);
  }

  const chartBase = g.chart || TOKENS.geometry.chart;
  const chartGeo = { ...chartBase, y: chartBase.y + yShift };
  addChart(pptx, slide, chart, chartGeo);

  return slide;
}
