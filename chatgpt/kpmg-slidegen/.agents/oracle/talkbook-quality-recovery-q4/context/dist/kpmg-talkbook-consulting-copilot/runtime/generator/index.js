#!/usr/bin/env node
/*
 * Lightweight Talkbook-native runtime for the consulting copilot skill.
 * It renders `layout.<slug>` slide specs into a PPTX and emits a shape manifest
 * consumed by strict safety checks.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadPptxGenJS() {
  try {
    return require('pptxgenjs');
  } catch (_err) {
    const fallback = path.resolve(__dirname, '../../../../templates/kpmg-talkbook/node_modules/pptxgenjs');
    return require(fallback);
  }
}

const PptxGenJS = loadPptxGenJS();

function svgToDataUri(svgString) {
  const encoded = Buffer.from(svgString, 'utf8').toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

function loadBrandLogos() {
  const logoPath = path.resolve(__dirname, '../../assets/kpmg-logo.svg');
  const logoWhitePath = path.resolve(__dirname, '../../assets/kpmg-logo-white.svg');

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Missing required brand asset: ${logoPath}`);
  }
  if (!fs.existsSync(logoWhitePath)) {
    throw new Error(`Missing required brand asset: ${logoWhitePath}`);
  }

  return {
    blue: svgToDataUri(fs.readFileSync(logoPath, 'utf8')),
    white: svgToDataUri(fs.readFileSync(logoWhitePath, 'utf8')),
  };
}

const BRAND_LOGOS = loadBrandLogos();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      out[key] = next;
      i += 1;
    } else {
      out[key] = true;
    }
  }
  return out;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function toLines(value) {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === 'string') return value.split('\n').map((v) => v.trim()).filter(Boolean);
  return [];
}

function slideBackground(slug) {
  if (slug.includes('blue') || slug.includes('divider') || slug.includes('cover')) return '1E49E2';
  return 'FFFFFF';
}

function textColorFor(slug) {
  if (slideBackground(slug) === '1E49E2') return 'FFFFFF';
  return '0F172A';
}

function addShapeRecord(manifestSlide, shape) {
  const area = (shape.w || 0) * (shape.h || 0);
  const textLen = typeof shape.text === 'string' ? shape.text.length : Array.isArray(shape.text) ? shape.text.join(' ').length : 0;
  const budget = Math.max(45, Math.round(area * 85));

  manifestSlide.shapes.push({
    id: shape.id,
    slot: shape.slot,
    kind: shape.kind,
    x: shape.x,
    y: shape.y,
    w: shape.w,
    h: shape.h,
    textLength: textLen,
    budget,
  });

  if (textLen > budget) {
    manifestSlide.warnings.push({
      kind: 'overflow-risk',
      id: shape.id,
      slot: shape.slot,
      textLength: textLen,
      budget,
      message: `Text may overflow for slot ${shape.slot || shape.id} (${textLen} > ${budget}).`,
    });
  }
}

function addBrandLogo(slide, manifestSlide, slug) {
  const isBlueBackground = slideBackground(slug) === '1E49E2';
  const logo = isBlueBackground ? BRAND_LOGOS.white : BRAND_LOGOS.blue;
  const box = { id: 'kpmg-logo', slot: 'brand_logo', kind: 'image', x: 12.42, y: 6.86, w: 0.86, h: 0.31 };
  slide.addImage({ data: logo, x: box.x, y: box.y, w: box.w, h: box.h });
  addShapeRecord(manifestSlide, box);
}

function addTitle(slide, manifestSlide, slug, text) {
  const value = String(text || 'Untitled slide');
  const color = textColorFor(slug);
  const box = { id: 'title', slot: 'text_title', kind: 'text', x: 0.6, y: 0.35, w: 12.1, h: 0.7, text: value };
  slide.addText(value, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontFace: 'Arial',
    fontSize: 24,
    bold: true,
    color,
  });
  addShapeRecord(manifestSlide, box);
}

function addStrapline(slide, manifestSlide, slug, text) {
  const value = String(text || '').trim();
  if (!value) return;
  const color = textColorFor(slug);
  const box = { id: 'strapline', slot: 'text_strapline', kind: 'text', x: 0.6, y: 1.05, w: 12.1, h: 0.45, text: value };
  slide.addText(value, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontFace: 'Arial',
    fontSize: 13,
    color,
  });
  addShapeRecord(manifestSlide, box);
}

function addBulletBox(slide, manifestSlide, slug, slot, lines, x, y, w, h) {
  const textColor = textColorFor(slug);
  const arr = asArray(lines).map((item) => ({ text: String(item), options: { bullet: { indent: 14 } } }));
  const box = { id: `box-${slot}`, slot, kind: 'text', x, y, w, h, text: arr.map((i) => i.text).join('\n') };
  slide.addText(arr.length ? arr : ' ', {
    x,
    y,
    w,
    h,
    fontFace: 'Arial',
    fontSize: 12,
    color: textColor,
    breakLine: true,
    margin: 0.06,
    valign: 'top',
  });
  addShapeRecord(manifestSlide, box);
}

function addColumnHeaders(slide, manifestSlide, slug, leftHeader, rightHeader) {
  const left = String(leftHeader || '').trim();
  const right = String(rightHeader || '').trim();
  if (!left && !right) return;

  if (left) {
    addParagraphBox(slide, manifestSlide, slug, 'text_left_header', left, 0.75, 1.45, 5.6, 0.28, {
      fontSize: 12,
      bold: true,
    });
  }
  if (right) {
    addParagraphBox(slide, manifestSlide, slug, 'text_right_header', right, 6.55, 1.45, 5.6, 0.28, {
      fontSize: 12,
      bold: true,
    });
  }
}

function addParagraphBox(slide, manifestSlide, slug, slot, text, x, y, w, h, opts = {}) {
  const value = Array.isArray(text) ? text.join('\n') : String(text || '');
  const color = textColorFor(slug);
  const box = { id: `box-${slot}`, slot, kind: 'text', x, y, w, h, text: value };
  slide.addText(value || ' ', {
    x,
    y,
    w,
    h,
    fontFace: 'Arial',
    fontSize: opts.fontSize || 12,
    color,
    breakLine: true,
    margin: 0.06,
    valign: opts.valign || 'top',
    align: opts.align,
    bold: Boolean(opts.bold),
  });
  addShapeRecord(manifestSlide, box);
}

function normalizeTableRows(tablePayload) {
  if (Array.isArray(tablePayload)) {
    return tablePayload
      .filter((row) => Array.isArray(row))
      .map((row) => row.map((cell) => String(cell || '').trim()));
  }

  if (tablePayload && typeof tablePayload === 'object') {
    const rows = Array.isArray(tablePayload.rows) ? tablePayload.rows : [];
    const headers = Array.isArray(tablePayload.headers) ? tablePayload.headers : [];
    const normalizedRows = rows
      .filter((row) => Array.isArray(row))
      .map((row) => row.map((cell) => String(cell || '').trim()));
    if (headers.length && normalizedRows.length) {
      return [headers.map((cell) => String(cell || '').trim()), ...normalizedRows];
    }
    if (normalizedRows.length) {
      return normalizedRows;
    }
  }
  return [];
}

function addTable(slide, manifestSlide, slot, tableRows, x, y, w, h) {
  const normalized = normalizeTableRows(tableRows);
  const rows = normalized.length ? normalized : [['Category', 'Value'], ['Placeholder', 'TBD']];
  const values = rows.map((row) => asArray(row).map((cell) => ({ text: String(cell || '') })));

  slide.addTable(values, {
    x,
    y,
    w,
    h,
    fontFace: 'Arial',
    fontSize: 10,
    border: { pt: 0.5, color: 'CBD5E1' },
    color: '0F172A',
    fill: 'FFFFFF',
    valign: 'middle',
  });

  addShapeRecord(manifestSlide, {
    id: `table-${slot}`,
    slot,
    kind: 'table',
    x,
    y,
    w,
    h,
    text: rows.map((r) => r.join(' | ')).join('\n'),
  });
}

function normalizeChartPoints(chartPayload) {
  if (Array.isArray(chartPayload)) {
    return chartPayload
      .map((point) => ({ label: String(point.label || 'Item'), value: Number(point.value || 0) }));
  }

  if (chartPayload && typeof chartPayload === 'object') {
    const directPoints = Array.isArray(chartPayload.points) ? chartPayload.points : [];
    if (directPoints.length) {
      return directPoints
        .map((point) => ({ label: String(point.label || point.name || 'Item'), value: Number(point.value || 0) }));
    }

    const series = Array.isArray(chartPayload.series) ? chartPayload.series : [];
    if (series.length) {
      const first = series[0] || {};
      if (Array.isArray(first.points) && first.points.length) {
        return first.points
          .map((point) => ({ label: String(point.label || point.name || 'Item'), value: Number(point.value || 0) }));
      }
      if (Array.isArray(first.labels) && Array.isArray(first.values)) {
        const points = [];
        const count = Math.min(first.labels.length, first.values.length);
        for (let i = 0; i < count; i += 1) {
          points.push({
            label: String(first.labels[i] || `Item ${i + 1}`),
            value: Number(first.values[i] || 0),
          });
        }
        return points;
      }
    }
  }
  return [];
}

function addChart(pptx, slide, manifestSlide, slot, points, x, y, w, h) {
  const normalized = normalizeChartPoints(points);
  const series = normalized.length
    ? normalized
    : [
        { label: 'Current', value: 40 },
        { label: 'Target', value: 65 },
        { label: 'Upside', value: 82 },
      ];

  slide.addChart(pptx.ChartType.bar, [
    {
      name: 'Series 1',
      labels: series.map((point) => point.label),
      values: series.map((point) => point.value),
    },
  ], {
    x,
    y,
    w,
    h,
    barDir: 'col',
    catAxisLabelRotate: 0,
    showLegend: false,
    chartColors: ['1E49E2', '0073E6', '00A3E0'],
  });

  addShapeRecord(manifestSlide, {
    id: `chart-${slot}`,
    slot,
    kind: 'chart',
    x,
    y,
    w,
    h,
    text: series.map((point) => `${point.label}:${point.value}`).join(', '),
  });
}

function addTimeline(pptx, slide, manifestSlide, slug, lines) {
  const steps = asArray(lines).map((item) => String(item).trim()).filter(Boolean).slice(0, 6);
  const useSteps = steps.length ? steps : ['Phase 1: Mobilize', 'Phase 2: Execute', 'Phase 3: Scale'];
  const count = useSteps.length;
  const width = 11.8 / count;

  for (let i = 0; i < count; i += 1) {
    const x = 0.75 + i * width;
    const raw = useSteps[i];
    const parts = raw.includes(':') ? raw.split(':', 2) : [raw, ''];
    const phase = String(parts[0] || '').trim();
    const detail = String(parts[1] || '').trim();

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.2,
      w: width - 0.2,
      h: 2.9,
      radius: 0.06,
      line: { color: '93C5FD', pt: 1 },
      fill: { color: slideBackground(slug) === '1E49E2' ? '1E3A8A' : 'EFF6FF' },
    });

    addParagraphBox(
      slide,
      manifestSlide,
      slug,
      `timeline_phase_${i + 1}`,
      phase,
      x + 0.12,
      2.38,
      width - 0.45,
      0.45,
      { fontSize: 12, bold: true }
    );

    addParagraphBox(
      slide,
      manifestSlide,
      slug,
      `timeline_detail_${i + 1}`,
      detail || phase,
      x + 0.12,
      2.9,
      width - 0.45,
      2.0,
      { fontSize: 11 }
    );
  }
}

function addQuad(pptx, slide, manifestSlide, slug, slots) {
  const labels = [
    slots.text_q1 || slots.text_1 || 'Quadrant 1',
    slots.text_q2 || slots.text_2 || 'Quadrant 2',
    slots.text_q3 || slots.text_3 || 'Quadrant 3',
    slots.text_q4 || slots.text_4 || 'Quadrant 4',
  ];

  const boxes = [
    { x: 0.75, y: 1.75 },
    { x: 6.85, y: 1.75 },
    { x: 0.75, y: 4.55 },
    { x: 6.85, y: 4.55 },
  ];

  boxes.forEach((box, idx) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: box.x,
      y: box.y,
      w: 5.7,
      h: 2.05,
      radius: 0.08,
      line: { color: 'BFDBFE', pt: 1 },
      fill: { color: slideBackground(slug) === '1E49E2' ? '1E3A8A' : 'EFF6FF' },
    });
    addParagraphBox(
      slide,
      manifestSlide,
      slug,
      `quad_${idx + 1}`,
      labels[idx],
      box.x + 0.2,
      box.y + 0.2,
      5.3,
      1.65,
      { fontSize: 13, bold: true }
    );
  });

  if (slots.text_center_body || slots.center_text) {
    addParagraphBox(
      slide,
      manifestSlide,
      slug,
      'text_center_body',
      slots.text_center_body || slots.center_text,
      4.95,
      3.95,
      3.45,
      0.45,
      { align: 'center', valign: 'mid', bold: true }
    );
  }
}

function renderSlide(pptx, spec, index, dimensions) {
  const type = String(spec.type || 'layout.one-column-summary');
  const slug = type.startsWith('layout.') ? type.slice(7) : type;
  const slots = spec.slots || {};

  const slide = pptx.addSlide();
  const background = slideBackground(slug);
  slide.background = { color: background };

  const manifestSlide = {
    index,
    type,
    slug,
    dimensions,
    warnings: [],
    shapes: [],
  };

  addTitle(slide, manifestSlide, slug, slots.text_title || slots.title || spec.sectionTitle || '');
  addStrapline(slide, manifestSlide, slug, slots.text_strapline || slots.strapline || '');

  const hasQuadContent = Boolean(slots.text_q1 || slots.text_1 || slots.text_q2 || slots.text_2 || slots.text_q3 || slots.text_3 || slots.text_q4 || slots.text_4);
  const tablePayload = slots.table_main || slots.table;
  const chartPayload = slots.chart_main || slots.chart;
  const hasTableContent = normalizeTableRows(tablePayload).length > 0;
  const hasChartContent = normalizeChartPoints(chartPayload).length > 0;
  const hasTwoColumns = Boolean(
    (asArray(slots.text_left_body || slots.left_body).length > 0)
    && (asArray(slots.text_right_body || slots.right_body).length > 0)
  );

  if (slug.includes('quad') || hasQuadContent) {
    addQuad(pptx, slide, manifestSlide, slug, slots);
  } else if (slug.includes('timeline')) {
    addTimeline(pptx, slide, manifestSlide, slug, slots.text_body || slots.text_main || slots.steps || []);
  } else if (slug.includes('table') || hasTableContent) {
    addParagraphBox(slide, manifestSlide, slug, 'text_body', slots.text_body || slots.text_main || [], 0.75, 1.65, 5.5, 5.2);
    addTable(slide, manifestSlide, 'table_main', tablePayload || [], 6.55, 1.65, 6.0, 4.7);
  } else if (slug.includes('chart') || hasChartContent) {
    const leftLines = slots.text_left_body || slots.text_body || slots.text_main || [];
    addBulletBox(slide, manifestSlide, slug, 'text_left_body', leftLines, 0.75, 1.65, 5.6, 5.2);
    addChart(pptx, slide, manifestSlide, 'chart_main', chartPayload || [], 6.55, 1.95, 6.0, 4.7);
  } else if (slug.includes('comparison') || slug.includes('2-column') || slug.includes('two-column') || slug.includes('risks') || hasTwoColumns) {
    const hasHeaders = Boolean((slots.text_left_header && String(slots.text_left_header).trim()) || (slots.text_right_header && String(slots.text_right_header).trim()));
    const bodyY = hasHeaders ? 1.85 : 1.65;
    const bodyH = hasHeaders ? 5.0 : 5.2;
    addColumnHeaders(slide, manifestSlide, slug, slots.text_left_header, slots.text_right_header);
    addBulletBox(slide, manifestSlide, slug, 'text_left_body', slots.text_left_body || slots.left_body || [], 0.75, bodyY, 5.6, bodyH);
    addBulletBox(slide, manifestSlide, slug, 'text_right_body', slots.text_right_body || slots.right_body || [], 6.55, bodyY, 5.6, bodyH);
  } else if (slug.includes('process')) {
    const steps = asArray(slots.text_body || slots.steps || slots.text_main || []);
    const stepCount = Math.max(1, Math.min(5, steps.length || 3));
    const width = 11.8 / stepCount;
    for (let i = 0; i < stepCount; i += 1) {
      const x = 0.75 + i * width;
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y: 2.4,
        w: width - 0.2,
        h: 2.3,
        radius: 0.06,
        line: { color: '93C5FD', pt: 1 },
        fill: { color: 'EFF6FF' },
      });
      addParagraphBox(
        slide,
        manifestSlide,
        slug,
        `step_${i + 1}`,
        steps[i] || `Step ${i + 1}`,
        x + 0.12,
        2.55,
        width - 0.45,
        1.95,
        { fontSize: 12 }
      );
    }
  } else {
    addBulletBox(slide, manifestSlide, slug, 'text_body', slots.text_body || slots.text_main || slots.left_body || [], 0.75, 1.7, 11.4, 5.15);
  }

  if (asArray(slots.text_footer_source).length) {
    addParagraphBox(
      slide,
      manifestSlide,
      slug,
      'text_footer_source',
      asArray(slots.text_footer_source).join(' | '),
      0.75,
      6.95,
      11.6,
      0.28,
      { fontSize: 8 }
    );
  }

  if (spec.notes) {
    slide.addNotes(String(spec.notes));
  }

  // Brand consistency: always render the KPMG SVG logo from hard-wired assets.
  addBrandLogo(slide, manifestSlide, slug);

  return manifestSlide;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inPath = args.in;
  const outPath = args.out;
  const manifestPath = args.manifest || `${outPath}.manifest.json`;

  if (!inPath || !outPath) {
    console.error('Usage: node runtime/generator/index.js --in <deck.json> --out <deck.pptx> [--manifest manifest.json]');
    process.exit(2);
  }

  const deck = readJson(inPath);
  const slides = Array.isArray(deck.slides) ? deck.slides : [];

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'KPMG_WIDE', width: 13.333, height: 7.5 });
  pptx.layout = 'KPMG_WIDE';
  pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial' };

  if (deck.metadata && typeof deck.metadata === 'object') {
    if (deck.metadata.title) pptx.title = deck.metadata.title;
    if (deck.metadata.author) pptx.author = deck.metadata.author;
    if (deck.metadata.company) pptx.company = deck.metadata.company;
    if (deck.metadata.subject) pptx.subject = deck.metadata.subject;
  }

  const dimensions = { w: 13.333, h: 7.5 };
  const manifest = {
    generatedAt: new Date().toISOString(),
    inPath,
    outPath,
    dimensions,
    slideCount: slides.length,
    slides: [],
  };

  slides.forEach((slideSpec, idx) => {
    manifest.slides.push(renderSlide(pptx, slideSpec, idx, dimensions));
  });

  ensureDir(path.dirname(outPath));
  ensureDir(path.dirname(manifestPath));

  await pptx.writeFile({ fileName: outPath, compression: true });
  writeJson(manifestPath, manifest);
  console.log(`Generated: ${outPath}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
