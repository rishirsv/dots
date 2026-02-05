import fs from 'node:fs';
import path from 'node:path';

function inferElementType(obj) {
  if (!obj) return 'unknown';
  const data = obj.data || obj.options || {};
  if (obj.type === 'line') return 'line';
  if (obj.type && typeof obj.type === 'string') return obj.type;
  if (obj.text || typeof data.text === 'string') return 'text';
  if (data.path || obj.image) return 'image';
  if (data.chartType) return 'chart';
  if (data.shape || data.line) return 'shape';
  if (data.mediaType) return 'media';
  if (data.table || Array.isArray(data.rows)) return 'table';
  if (data.smartArt) return 'smartart';
  return 'unknown';
}

function getElementBounds(obj) {
  const source = obj?.data || obj?.options || {};
  let x = typeof source.x === 'number' ? source.x : 0;
  let y = typeof source.y === 'number' ? source.y : 0;
  let w = typeof source.w === 'number' ? source.w : 0;
  let h = typeof source.h === 'number' ? source.h : 0;
  let hDerived = false;
  // pptxgenjs tables store x/y/w in EMUs and omit `h`; row heights are in inches.
  if (!h && Array.isArray(source.rowH)) {
    h = source.rowH.reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
    hDerived = true;
  }

  // If an image is placed with crop sizing, pptxgenjs stores a larger virtual image w/h
  // and a viewport in source.sizing.{w,h}. For visual bounds purposes, use the viewport.
  if (source.sizing && source.sizing.type === 'crop') {
    if (typeof source.sizing.w === 'number') w = source.sizing.w;
    if (typeof source.sizing.h === 'number') h = source.sizing.h;
  }

  const EMU_PER_IN = 914400;
  const looksEmu = (n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) > 1000;
  const emuLike = looksEmu(x) || looksEmu(y) || looksEmu(w) || (!hDerived && looksEmu(h));
  if (emuLike) {
    x /= EMU_PER_IN;
    y /= EMU_PER_IN;
    w /= EMU_PER_IN;
    if (!hDerived) h /= EMU_PER_IN;
  }

  return { x, y, w, h, x2: x + w, y2: y + h };
}

function analyzeSlideBounds(slide, pptx, dims) {
  if (!slide || !Array.isArray(slide._slideObjects)) {
    return { slide: '(Unknown slide)', violations: [], outOfBoundsCount: 0 };
  }

  const slideIndex = Array.isArray(pptx?._slides) ? pptx._slides.indexOf(slide) : -1;
  const slideLabel = slideIndex >= 0 ? `Slide ${slideIndex + 1}` : '(Unknown slide index)';

  const w = typeof dims?.w === 'number' ? dims.w : 13.333;
  const h = typeof dims?.h === 'number' ? dims.h : 7.5;
  const EPS = 1e-3;

  const violations = [];
  for (let i = 0; i < slide._slideObjects.length; i++) {
    const obj = slide._slideObjects[i];
    const type = inferElementType(obj);
    const b = getElementBounds(obj);

    const v = [];
    if (b.x < -EPS) v.push(`left=${b.x.toFixed(3)} < 0`);
    if (b.y < -EPS) v.push(`top=${b.y.toFixed(3)} < 0`);
    if (b.x2 > w + EPS) v.push(`right=${b.x2.toFixed(3)} > width=${w.toFixed(3)}`);
    if (b.y2 > h + EPS) v.push(`bottom=${b.y2.toFixed(3)} > height=${h.toFixed(3)}`);

    if (v.length) {
      violations.push({
        elementIndex: i,
        type,
        bounds: b,
        violations: v,
      });
    }
  }

  return { slide: slideLabel, violations, outOfBoundsCount: violations.length };
}

export function checkDeckBounds(pptx, dims) {
  const slides = Array.isArray(pptx?._slides) ? pptx._slides : [];
  const report = {
    summary: {
      slideCount: slides.length,
      outOfBoundsCount: 0,
      dimensions: { w: dims?.w ?? 13.333, h: dims?.h ?? 7.5 },
    },
    slides: [],
  };

  for (const slide of slides) {
    const s = analyzeSlideBounds(slide, pptx, dims);
    report.summary.outOfBoundsCount += s.outOfBoundsCount;
    report.slides.push(s);
  }

  return report;
}

export function writeBoundsReport(report, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
}
