import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { addTitle } from '../helpers/title.js';
import { toBulletRuns } from '../helpers/bullets.js';
import { addAnalysisTable } from './analysis-narrow-table.js';

const TOKENS = {
  geometry: {
    title: { x: 1.092, y: 0.472, w: 11.15, h: 0.583 },
    strapline: { x: 1.089, y: 1.29, w: 8.298, h: 0.528 },
    summaryChart: { x: 9.534, y: 1.077, w: 2.707, h: 0.742 },
    heading: { x: 5.268, y: 1.916, w: 6.976, h: 0.276 },
    table: { x: 1.089, y: 1.916, w: 4.036, h: 4.508 },
    body: { x: 5.268, y: 2.191, w: 6.975, h: 4.232 },
    note: { x: 1.088, y: 6.46, w: 3.937, h: 0.23 },
  },
  text: {
    strapline: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.strapline,
      color: COLORS.primary,
      bold: true,
      margin: 0,
      valign: 'top',
    },
    heading: {
      fontFace: FONTS.body,
      fontSize: 12,
      color: COLORS.white,
      bold: true,
      margin: 0,
      valign: 'mid',
    },
    body: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.body,
      color: COLORS.black,
      paraSpaceAfter: 6,
      margin: 0,
      valign: 'top',
    },
    note: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.source,
      color: COLORS.kpmgBlue,
      bold: true,
      margin: 0,
      valign: 'top',
    },
  },
};

function addDashedBox(pptx, slide, box, label) {
  slide.addShape(pptx.ShapeType.rect, {
    ...box,
    line: { color: '9E9E9E', pt: 1, dash: 'dash' },
    fill: { color: 'FFFFFF', transparency: 100 },
  });
  if (label) {
    slide.addText(label, {
      x: box.x + 0.08,
      y: box.y + 0.05,
      w: box.w - 0.16,
      h: 0.18,
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.body,
      color: COLORS.kpmgBlue,
      bold: true,
      margin: 0,
      valign: 'top',
    });
  }
}

function addChartOrPlaceholder(pptx, slide, chart, box) {
  if (chart?.type && Array.isArray(chart?.data) && chart.data.length > 0) {
    slide.addChart(chart.type, chart.data, {
      ...box,
      showLegend: false,
      chartColors: [COLORS.kpmgBlue],
      valGridLine: { style: 'none' },
      catGridLine: { style: 'none' },
    });
    return;
  }
  addDashedBox(pptx, slide, box, 'Add summary chart here');
}

function addTableOrPlaceholder(pptx, slide, table, box) {
  if (table?.headers && Array.isArray(table?.rows) && table.rows.length > 0) {
    addAnalysisTable(slide, table, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      tableHeading: table?.title || table?.heading || '',
      showTitleBar: false,
    });
    return;
  }
  addDashedBox(pptx, slide, box, 'Add table here');
}

export function addProfitLossOverview(
  pptx,
  { title, strapline, heading, body, chart, table, noteSource, showSummaryChart = false, geometry, masterName } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || TOKENS.geometry;

  addTitle(slide, title || 'Profit & loss overview', g.title || TOKENS.geometry.title);

  const strapBase = g.strapline || TOKENS.geometry.strapline;
  const strapBox = showSummaryChart
    ? strapBase
    : { ...strapBase, w: (g.title || TOKENS.geometry.title).w };
  addDashedBox(pptx, slide, strapBox, null);
  slide.addText(
    strapline || 'Use this strapline to summarize the key message - Keep it concise and clear, preferably 1-2 sentences only.',
    {
      ...strapBox,
      ...TOKENS.text.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
    },
  );

  if (showSummaryChart) {
    addChartOrPlaceholder(pptx, slide, chart, g.summaryChart || TOKENS.geometry.summaryChart);
  }
  addTableOrPlaceholder(pptx, slide, table, g.table || TOKENS.geometry.table);

  const headingBox = g.heading || TOKENS.geometry.heading;
  slide.addShape(pptx.ShapeType.rect, {
    ...headingBox,
    line: { color: COLORS.kpmgBlue, pt: 1 },
    fill: { color: COLORS.kpmgBlue },
  });
  slide.addText(heading || 'Click to add the heading', {
    ...headingBox,
    ...TOKENS.text.heading,
    x: headingBox.x + 0.08,
    w: headingBox.w - 0.16,
  });

  const bodyBox = g.body || TOKENS.geometry.body;
  addDashedBox(pptx, slide, bodyBox, null);
  slide.addText(toBulletRuns(body || ['Add text here']), {
    ...bodyBox,
    ...TOKENS.text.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
  });

  slide.addText(noteSource || 'Note: [...]\\nSource: [...]', {
    ...(g.note || TOKENS.geometry.note),
    ...TOKENS.text.note,
    breakLine: true,
  });

  return slide;
}
