import { FONTS, COLORS, TEXT_BOX } from '../tokens.js';
import { addTitle } from '../helpers/title.js';
import { toBodyRuns } from '../helpers/bullets.js';

const DEFAULT_TABS = [
  'Executive summary',
  'Historical trading',
  'Balance sheet',
  'Reporting environment',
  'Gross margin by LOB',
  'Appendices',
];

const DEFAULT_CHART_COLORS = ['00338D', '1E49E2', '00B8F5', '005EB8', '0C233C'];

const DEFAULT_LEGAL_CHART = {
  top: [
    { label: 'Apple Inc. (Parent)', share: '34%' },
    { label: 'Apple Operations\nInternational', share: '33%' },
    { label: 'Apple Sales\nInternational', share: '33%' },
  ],
  middle: [
    { label: 'Apple Products Group', share: '75%' },
    { label: 'Apple Services Group', share: '25%' },
  ],
  bottom: { label: 'Apple consolidated operations\nFY2023-FY2025' },
  notes: [
    'Note 1: Share percentages are illustrative to mirror legal-chart formatting in this template style.',
    'Note 2: Financial values are sourced from the FY2023-FY2025 formatted files in tests/financial-overview/formatted.',
  ],
  source: 'Source: tests/financial-overview/formatted (income statement, balance sheet, cash flow)',
};

const DEFAULT_COMPANY_OVERVIEW = {
  intro:
    'Apple Inc. ("Apple" or the "Company") designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and digital services globally.',
  bullets: [
    'Product platform strength: iPhone, Mac, iPad, and Wearables continue to anchor the ecosystem, with integrated hardware-software design supporting premium pricing and customer stickiness.',
    'Services durability: High-margin recurring offerings across digital content, cloud, payments, advertising, and subscriptions provide a stabilizing counterweight to hardware cycle volatility.',
    'Scale profile: FY2025 revenue of $383.3B remains above FY2023 levels while normalizing versus FY2024, indicating resilience despite a tougher compare period.',
    'Earnings quality: FY2025 gross profit of $169.1B and operating income of $114.3B reflect strong conversion from topline to operating earnings.',
    'Liquidity and cash generation: Operating cash flow of $110.5B in FY2025 continues to support reinvestment and shareholder return capacity.',
  ],
  source: 'Source: tests/financial-overview/formatted/*-aapl-fy3.csv',
};

const DEFAULT_METRIC_CHART = {
  title: "Reported financial metrics by LOB ($B)",
  type: 'bar',
  data: [
    {
      name: 'FY23',
      labels: [
        'Revenue',
        'Cost of Revenue',
        'Gross Profit',
        'Op. Income',
        'Net Income',
        'Op. Cash Flow',
        'Current Assets',
        'Current Liabilities',
      ],
      values: [365.8, 213.0, 152.8, 108.9, 94.7, 104.0, 135.4, 154.0],
    },
    {
      name: 'FY24',
      labels: [
        'Revenue',
        'Cost of Revenue',
        'Gross Profit',
        'Op. Income',
        'Net Income',
        'Op. Cash Flow',
        'Current Assets',
        'Current Liabilities',
      ],
      values: [394.3, 223.5, 170.8, 119.4, 99.8, 122.2, 143.6, 145.3],
    },
    {
      name: 'FY25',
      labels: [
        'Revenue',
        'Cost of Revenue',
        'Gross Profit',
        'Op. Income',
        'Net Income',
        'Op. Cash Flow',
        'Current Assets',
        'Current Liabilities',
      ],
      values: [383.3, 214.1, 169.1, 114.3, 97.0, 110.5, 153.0, 176.4],
    },
  ],
  source: 'Source: tests/financial-overview/formatted/*-aapl-fy3.csv',
};

function drawTabs(pptx, slide, tabs = [], activeTabIndex = 0) {
  const list = Array.isArray(tabs) && tabs.length ? tabs : DEFAULT_TABS;
  const widths = [1.22, 1.12, 1.05, 1.52, 1.48, 0.9];
  let x = 1.03;
  const y = 0.13;
  const h = 0.21;

  list.forEach((label, idx) => {
    const w = widths[idx] || 1.15;
    const active = idx === activeTabIndex;
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w,
      h,
      fill: { color: active ? 'FFFFFF' : 'F2F2F2' },
      line: { color: active ? 'C9D4F8' : 'DADADA', pt: 0.6 },
    });
    slide.addText(String(label), {
      x: x + 0.04,
      y: y + 0.015,
      w: w - 0.08,
      h: h - 0.03,
      fontFace: FONTS.body,
      fontSize: 7.5,
      color: active ? COLORS.kpmgBlue : '7F7F7F',
      bold: active,
      align: 'center',
      valign: 'mid',
      margin: 0,
      wrap: false,
      fit: 'shrink',
    });
    x += w + 0.02;
  });
}

function drawNavIcons(pptx, slide) {
  const icons = ['<', 'H', '>'];
  const baseX = 12.06;
  const y = 0.12;
  const size = 0.24;
  const gap = 0.05;
  icons.forEach((glyph, idx) => {
    const x = baseX + idx * (size + gap);
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y,
      w: size,
      h: size,
      fill: { color: 'FFFFFF' },
      line: { color: COLORS.kpmgBlue, pt: 1 },
    });
    slide.addText(glyph, {
      x,
      y: y + 0.005,
      w: size,
      h: size,
      fontFace: FONTS.body,
      fontSize: 9,
      color: COLORS.kpmgBlue,
      bold: true,
      align: 'center',
      valign: 'mid',
      margin: 0,
    });
  });
}

function drawSectionHeading(slide, text, x, y, w) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.32,
    fontFace: FONTS.heading,
    fontSize: 22,
    color: COLORS.kpmgBlue,
    bold: true,
    margin: 0,
    valign: 'top',
  });
}

function drawSubHeading(slide, text, x, y, w) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.28,
    fontFace: FONTS.heading,
    fontSize: 11,
    color: COLORS.kpmgBlue,
    bold: true,
    underline: { color: COLORS.kpmgBlue, pt: 0.75 },
    margin: 0,
  });
}

function drawNode(pptx, slide, node, geo, { fill = '00338D', textColor = 'FFFFFF' } = {}) {
  slide.addShape(pptx.ShapeType.rect, {
    ...geo,
    fill: { color: fill },
    line: { color: fill, pt: 0.8 },
  });
  slide.addText(String(node?.label || ''), {
    x: geo.x + 0.05,
    y: geo.y + 0.05,
    w: geo.w - 0.1,
    h: geo.h - 0.1,
    fontFace: FONTS.body,
    fontSize: 9,
    color: textColor,
    bold: true,
    align: 'center',
    valign: 'mid',
    margin: 0,
    wrap: true,
    fit: 'shrink',
  });
  if (node?.share) {
    slide.addText(String(node.share), {
      x: geo.x,
      y: geo.y + geo.h + 0.03,
      w: geo.w,
      h: 0.15,
      fontFace: FONTS.body,
      fontSize: 7,
      color: COLORS.black,
      align: 'center',
      margin: 0,
    });
  }
}

function drawLine(pptx, slide, x, y, w, h, { color = COLORS.kpmgBlue, pt = 0.75 } = {}) {
  slide.addShape(pptx.ShapeType.line, {
    x,
    y,
    w,
    h,
    line: { color, pt },
  });
}

function drawLegalChart(pptx, slide, legalChart = {}) {
  const data = {
    ...DEFAULT_LEGAL_CHART,
    ...legalChart,
    top: legalChart?.top || DEFAULT_LEGAL_CHART.top,
    middle: legalChart?.middle || DEFAULT_LEGAL_CHART.middle,
  };

  const topY = 1.85;
  const topW = 1.66;
  const topH = 0.56;
  const topXs = [1.06, 2.86, 4.66];
  const midY = 3.0;
  const midW = 2.22;
  const midH = 0.56;
  const midXs = [1.72, 4.04];
  const botY = 4.03;
  const botW = 2.62;
  const botH = 0.64;
  const botX = 2.68;

  topXs.forEach((x, idx) => {
    drawNode(pptx, slide, data.top[idx] || {}, { x, y: topY, w: topW, h: topH });
  });
  midXs.forEach((x, idx) => {
    drawNode(pptx, slide, data.middle[idx] || {}, { x, y: midY, w: midW, h: midH }, { fill: '1E49E2' });
  });
  drawNode(pptx, slide, data.bottom || {}, { x: botX, y: botY, w: botW, h: botH }, { fill: '00B8F5' });

  const topCenters = topXs.map((x) => x + topW / 2);
  const midCenters = midXs.map((x) => x + midW / 2);
  const botCenter = botX + botW / 2;
  const busY = 2.77;

  drawLine(pptx, slide, topCenters[0], busY, topCenters[2] - topCenters[0], 0);
  topCenters.forEach((cx) => {
    drawLine(pptx, slide, cx, topY + topH, 0, busY - (topY + topH));
  });
  drawLine(pptx, slide, midCenters[0], busY, 0, midY - busY);
  drawLine(pptx, slide, midCenters[1], busY, 0, midY - busY);
  drawLine(pptx, slide, midCenters[0], midY + midH, botCenter - midCenters[0], 0);
  drawLine(pptx, slide, botCenter, midY + midH, 0, botY - (midY + midH));

  const noteLines = Array.isArray(data.notes) ? data.notes : [];
  if (noteLines.length) {
    slide.addText(noteLines.join('\n'), {
      x: 1.06,
      y: 4.77,
      w: 5.48,
      h: 0.38,
      fontFace: FONTS.body,
      fontSize: 5.5,
      color: COLORS.kpmgBlue,
      italic: true,
      margin: 0,
      valign: 'top',
      wrap: true,
    });
  }
  if (data.source) {
    slide.addText(String(data.source), {
      x: 1.06,
      y: 5.15,
      w: 5.48,
      h: 0.14,
      fontFace: FONTS.body,
      fontSize: 5.5,
      color: COLORS.kpmgBlue,
      margin: 0,
      valign: 'top',
    });
  }
}

function drawCompanyOverview(slide, companyOverview = {}) {
  const data = { ...DEFAULT_COMPANY_OVERVIEW, ...companyOverview };
  slide.addText(String(data.intro || ''), {
    x: 6.64,
    y: 1.45,
    w: 5.47,
    h: 0.66,
    fontFace: FONTS.body,
    fontSize: 8,
    color: COLORS.black,
    margin: 0,
    wrap: true,
    valign: 'top',
  });

  slide.addText(toBodyRuns(data.bullets || [], 'bullets'), {
    x: 6.64,
    y: 2.12,
    w: 5.47,
    h: 2.42,
    fontFace: FONTS.body,
    fontSize: 8,
    color: COLORS.black,
    paraSpaceAfter: 2,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  if (data.source) {
    slide.addText(String(data.source), {
      x: 6.64,
      y: 4.54,
      w: 5.47,
      h: 0.14,
      fontFace: FONTS.body,
      fontSize: 5.5,
      color: COLORS.kpmgBlue,
      margin: 0,
      valign: 'top',
    });
  }
}

function drawMetricChart(pptx, slide, metricChart = {}) {
  const chart = { ...DEFAULT_METRIC_CHART, ...metricChart };
  const chartTypeMap = {
    bar: pptx.ChartType?.bar || 'bar',
    line: pptx.ChartType?.line || 'line',
    area: pptx.ChartType?.area || 'area',
  };

  slide.addText(String(chart.title || DEFAULT_METRIC_CHART.title), {
    x: 6.9,
    y: 4.88,
    w: 5.2,
    h: 0.18,
    fontFace: FONTS.body,
    fontSize: 7.5,
    color: COLORS.kpmgBlue,
    bold: true,
    align: 'center',
    margin: 0,
  });

  slide.addChart(chartTypeMap[chart.type] || chartTypeMap.bar, chart.data || DEFAULT_METRIC_CHART.data, {
    x: 6.9,
    y: 5.04,
    w: 5.2,
    h: 1.19,
    showLegend: true,
    legendPos: 't',
    legendFontFace: FONTS.body,
    legendFontSize: 6,
    chartColors: chart.chartColors || DEFAULT_CHART_COLORS,
    showValue: false,
    catAxisLabelFontFace: FONTS.body,
    valAxisLabelFontFace: FONTS.body,
    catAxisLabelFontSize: 6,
    valAxisLabelFontSize: 6,
    valAxisTitle: chart.valAxisTitle || '$B',
    valGridLine: { style: 'none' },
    catGridLine: { style: 'none' },
    chartArea: { fill: { color: 'FFFFFF' } },
    plotArea: { fill: { color: 'FFFFFF' } },
    dataBorder: { pt: 0.2, color: 'FFFFFF' },
    barGrouping: 'clustered',
    ...(chart.opts || {}),
  });

  if (chart.source) {
    slide.addText(String(chart.source), {
      x: 6.9,
      y: 6.24,
      w: 5.2,
      h: 0.14,
      fontFace: FONTS.body,
      fontSize: 5.5,
      color: COLORS.kpmgBlue,
      margin: 0,
      valign: 'top',
    });
  }
}

export function addBusinessOverviewApple(
  pptx,
  {
    title = 'Business overview',
    tabs,
    activeTabIndex = 0,
    leftHeading = 'Legal chart',
    rightHeading = 'Company overview',
    legalChart,
    companyOverview,
    metricChart,
    masterName,
  } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();

  drawTabs(pptx, slide, tabs, Number(activeTabIndex) || 0);
  drawNavIcons(pptx, slide);
  drawSectionHeading(slide, title, 1.03, 0.43, 5.2);
  drawSubHeading(slide, leftHeading, 1.04, 1.08, 5.4);
  drawSubHeading(slide, rightHeading, 6.64, 1.08, 5.47);

  drawLegalChart(pptx, slide, legalChart);
  drawCompanyOverview(slide, companyOverview);
  drawMetricChart(pptx, slide, metricChart);

  slide.addText('DRAFT', {
    x: 12.12,
    y: 7.15,
    w: 0.9,
    h: 0.2,
    fontFace: FONTS.body,
    fontSize: 14,
    color: COLORS.pink,
    bold: true,
    align: 'left',
    valign: 'mid',
    margin: 0,
  });

  return slide;
}
