#!/usr/bin/env node
/*
  Map V1 deck JSON (captured from legacy demo.js) into V2 Diligence template types.
*/

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const IN_JSON = path.join(ROOT, 'samples', 'v1', 'v1-nvidia.json');
const OUT_JSON = path.join(ROOT, 'samples', 'v1-nvidia-v2.json');

function splitIntoHalves(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [[], []];
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function ensureArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split('\n');
  return [String(v)];
}

function normalizeChart(chart) {
  if (!chart || typeof chart !== 'object') return null;
  return {
    type: chart.type,
    data: chart.data,
    opts: chart.opts || {},
    source: chart.source || '',
  };
}

function mapSlide(slide, out) {
  switch (slide.type) {
    case 'cover':
      out.push({ type: 'cover', title: slide.title, subtitle: slide.subtitle });
      return;
    case 'divider':
      out.push({ type: 'divider', sectionNumber: slide.sectionNumber, sectionTitle: slide.sectionTitle });
      return;
    case 'kpiDashboard':
      out.push({
        type: 'summaryFinancials',
        title: slide.title,
        strapline: slide.strapline,
        kpis: slide.kpis || [],
        chart: normalizeChart(slide.chart),
      });
      return;
    case 'textWithChart':
      out.push({
        type: 'analysisWideChart2ColsText',
        title: slide.title,
        strapline: slide.strapline,
        body: ensureArray(slide.body),
        chart: normalizeChart(slide.chart),
      });
      return;
    case 'oneColumnChart':
      out.push({
        type: 'analysisWideChartTableText',
        title: slide.title,
        strapline: slide.strapline,
        body: ensureArray(slide.body),
        chart: normalizeChart(slide.chart),
      });
      return;
    case 'threeColumnChart': {
      // Split into 3 sequential slides to preserve all charts (no multi-chart layout).
      const columns = Array.isArray(slide.columns) ? slide.columns : [];
      const total = columns.length || 3;
      columns.forEach((col, idx) => {
        out.push({
          type: 'analysisWideChart2ColsText',
          title: `${slide.title} (${idx + 1}/${total})`,
          strapline: slide.strapline,
          body: ensureArray(col?.text),
          chart: normalizeChart(col?.chart),
        });
      });
      return;
    }
    case 'tableSlide':
      out.push({
        type: 'analysisNarrowTable',
        title: slide.title,
        strapline: slide.strapline,
        table: slide.table,
        notes: slide.notes || '',
      });
      return;
    case 'oneColumnText':
      out.push({
        type: 'oneColumnText',
        title: slide.title,
        strapline: slide.strapline,
        body: ensureArray(slide.body),
      });
      return;
    case 'process': {
      out.push({
        type: 'titleStrapline4TextBoxes',
        title: slide.title,
        strapline: slide.subtitle,
        columns: (slide.columns || []).map((c) => ({
          heading: c.heading || '',
          body: ensureArray(c.body),
        })),
      });
      return;
    }
    case 'closing':
      out.push({
        type: 'backCover',
        disclaimer: slide.disclaimer || '',
        url: slide.url || '',
      });
      return;
    default:
      // Fallback: push as two-column text to avoid losing content.
      if (slide.title || slide.body) {
        const [left, right] = splitIntoHalves(ensureArray(slide.body));
        out.push({
          type: 'analysis2ColumnsText',
          title: slide.title || 'Slide',
          strapline: slide.strapline || '',
          leftBody: left,
          rightBody: right,
        });
      }
  }
}

function addExtraCharts(out) {
  // Lightweight synthetic slides to “add more charts” without heavy data work.
  out.push({
    type: 'analysisWideChart2ColsText',
    title: 'Appendix — Illustrative Chart (A)',
    strapline: 'Synthetic data for demo only',
    body: [
      'This chart is illustrative and does not reflect actual results.',
      'Included to expand chart coverage in the migrated deck.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Scenario A', labels: ['FY2024', 'FY2025', 'FY2026'], values: [40, 70, 95] },
      ],
      opts: { showValue: true, valueFontSize: 7 },
      source: 'Demo data',
    },
  });

  out.push({
    type: 'analysisWideChartTableText',
    title: 'Appendix — Illustrative Chart (B)',
    strapline: 'Synthetic data for demo only',
    body: [
      'Line chart example using the V2 chart renderer.',
    ],
    chart: {
      type: 'line',
      data: [
        { name: 'Trend', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [12, 18, 16, 22] },
      ],
      opts: { showValue: true, valueFontSize: 7 },
      source: 'Demo data',
    },
  });
}

function main() {
  const deck = JSON.parse(fs.readFileSync(IN_JSON, 'utf8'));
  const outSlides = [];
  for (const slide of deck.slides || []) {
    mapSlide(slide, outSlides);
  }

  addExtraCharts(outSlides);

  const out = {
    metadata: deck.metadata || {},
    slides: outSlides,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote: ${OUT_JSON}`);
}

main();
