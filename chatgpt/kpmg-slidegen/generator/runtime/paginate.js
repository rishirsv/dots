// generator/runtime/paginate.js
//
// Pragmatic, stdlib-only pagination to prevent text overlap.
// We do not have font metrics in a typical headless environment, so we use
// conservative heuristics driven by template geometry.
//
// Goal: never overlap; prefer continuation slides vs. tiny fonts.

import { FOOTER_SAFE_TOP } from '../helpers/footer.js';

function clone(obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

function isTextObject(value) {
  return Boolean(value && typeof value === 'object' && value.text !== undefined);
}

function safeStr(s) {
  if (isTextObject(s)) return String(s.text ?? '');
  return String(s ?? '');
}

function isLikelyHeading(s) {
  const t = safeStr(s).trim();
  if (!t) return false;
  // Short, no sentence punctuation is often a heading line in the migrated V1 content.
  if (t.length > 48) return false;
  if (/[.!?]$/.test(t)) return false;
  if (t.includes('—') || t.includes(':')) return false;
  // Avoid numeric-heavy strings being treated as headings.
  const digits = (t.match(/\d/g) || []).length;
  if (digits >= 4) return false;
  return true;
}

function normalizeBulletPairs(items) {
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    if (isTextObject(current)) {
      out.push(current);
      continue;
    }
    const a = safeStr(current).trim();
    if (!a) continue;
    const next = items[i + 1];
    const b = !isTextObject(next) ? safeStr(next).trim() : '';
    if (b && isLikelyHeading(a) && b.length >= 60) {
      out.push(`${a}: ${b}`);
      i += 1;
      continue;
    }
    out.push(a);
  }
  return out;
}

function countWrappedLines(text, charsPerLine) {
  const s = safeStr(text).replace(/\r/g, '');
  const parts = s.split('\n');
  let lines = 0;
  for (const p of parts) {
    const n = Math.max(1, Math.ceil(p.length / Math.max(1, charsPerLine)));
    lines += n;
  }
  return lines;
}

function estimateCharsPerLine(boxWInches, fontSizePt) {
  // Roughly: at 12pt Arial, ~12 chars/inch is a safe-ish conservative value.
  // Scale inversely with font size, then pad down a bit to avoid underestimating wraps.
  const base = 12;
  const scaled = (boxWInches || 0) * base * (12 / Math.max(6, fontSizePt || 12));
  return Math.max(12, Math.floor(scaled * 0.9));
}

function estimateMaxLines(boxHInches, fontSizePt) {
  // Convert to points (72 pt/in). Use a slightly generous line-height to avoid overlap.
  const hPt = (boxHInches || 0) * 72;
  // Our decks use 9pt body with PowerPoint-like spacing; approximate ~12pt line height.
  const lineHeight = Math.max(10, (fontSizePt || 9) + 3);
  // Keep a small top/bottom safety buffer.
  return Math.max(1, Math.floor(hPt / lineHeight) - 1);
}

function chunkBullets(lines, { maxLines, charsPerLine }) {
  const items = normalizeBulletPairs(Array.isArray(lines) ? lines : (lines ? [lines] : []));
  const chunks = [];
  let cur = [];
  let used = 0;

  for (const item of items) {
    const t = safeStr(item).trim();
    if (!t) continue;
    const isHeader = isTextObject(item) && item.header;
    const prefix = isHeader ? '' : '• ';
    const need = countWrappedLines(`${prefix}${t}`, charsPerLine);
    if (cur.length && used + need > maxLines) {
      chunks.push(cur);
      cur = [];
      used = 0;
    }
    // If a single bullet is too large, still include it on its own slide.
    cur.push(item);
    used += need;
  }
  if (cur.length) chunks.push(cur);
  return chunks.length ? chunks : [[]];
}

function contTitle(title, pageIdx) {
  const t = safeStr(title).trim();
  if (!t) return t;
  return pageIdx === 0 ? t : `${t} (cont.)`;
}

function applyFooterSafe(box, useFooter) {
  if (!useFooter || !box) return box;
  const y = typeof box.y === 'number' ? box.y : null;
  const h = typeof box.h === 'number' ? box.h : null;
  if (y === null || h === null) {
    return { ...box, h: Math.max(0.1, (h || 0) - 0.25) };
  }
  const safeH = Math.max(0.1, Math.min(h, FOOTER_SAFE_TOP - y));
  return { ...box, h: safeH };
}

function paginateTwoColumn(slideSpec, geometry, { footerSafe = false, fallbackLeft, fallbackRight } = {}) {
  const g = geometry || {};
  const leftBox = g.left || g.leftBody || g.leftText || fallbackLeft || { w: 5.5, h: 5.0, y: 1.5 };
  const rightBox = g.right || g.rightBody || g.rightText || fallbackRight || { w: 5.5, h: 5.0, y: 1.5 };
  const safeLeft = applyFooterSafe(leftBox, footerSafe);
  const safeRight = applyFooterSafe(rightBox, footerSafe);

  const fontSize = 9;
  const leftChunks = chunkBullets(slideSpec.leftBody, {
    maxLines: estimateMaxLines(safeLeft.h, fontSize),
    charsPerLine: estimateCharsPerLine(safeLeft.w, fontSize),
  });
  const rightChunks = chunkBullets(slideSpec.rightBody, {
    maxLines: estimateMaxLines(safeRight.h, fontSize),
    charsPerLine: estimateCharsPerLine(safeRight.w, fontSize),
  });

  const pages = Math.max(leftChunks.length, rightChunks.length);
  const out = [];
  for (let p = 0; p < pages; p++) {
    const s = clone(slideSpec);
    s.title = contTitle(slideSpec.title, p);
    s.leftBody = leftChunks[p] ?? [];
    s.rightBody = rightChunks[p] ?? [];
    out.push(s);
  }
  return out;
}

function paginateOneColumnBullets(slideSpec, geometry, fieldName, { footerSafe = false, fallbackBox } = {}) {
  const g = geometry || {};
  const box = g.body || g.topText || g.leftText || fallbackBox || { w: 11.0, h: 5.0, y: 1.6 };
  const safeBox = applyFooterSafe(box, footerSafe);
  const fontSize = 9;
  const chunks = chunkBullets(slideSpec[fieldName], {
    maxLines: estimateMaxLines(safeBox.h, fontSize),
    charsPerLine: estimateCharsPerLine(safeBox.w, fontSize),
  });

  const out = [];
  for (let p = 0; p < chunks.length; p++) {
    const s = clone(slideSpec);
    s.title = contTitle(slideSpec.title, p);
    s[fieldName] = chunks[p];
    out.push(s);
  }
  return out;
}

function paginateTableRows(slideSpec, geometry, { footerSafe = false, fallbackBox } = {}) {
  const table = slideSpec.table;
  if (!table || !Array.isArray(table.rows) || table.rows.length <= 0) return [slideSpec];

  const g = geometry || {};
  const box = g.table || fallbackBox || { w: 11.0, h: 3.0, y: 1.9 };
  const safeBox = applyFooterSafe(box, footerSafe);

  // Use a generous height estimate — the table.js builder always uses full-width
  // layout now, and autoPage handles overflow within PptxGenJS. Our job here is to
  // split content into reasonable chunks so each slide has enough content.
  // Use ~0.30in per row for compact 8-10pt tables.
  const rowH = 0.30;
  let maxRows = Math.max(4, Math.floor((safeBox.h || 4.5) / rowH) - 1);
  if (table.rows.length <= maxRows) return [slideSpec];

  // Avoid near-empty last page: if the remainder would have fewer than 3 rows,
  // redistribute by increasing maxRows slightly so the last page gets more content.
  const remainder = table.rows.length % maxRows;
  if (remainder > 0 && remainder < 3 && maxRows > 4) {
    // Reduce maxRows so rows distribute more evenly across pages
    const pages = Math.ceil(table.rows.length / maxRows);
    maxRows = Math.ceil(table.rows.length / pages);
  }

  const out = [];
  const headers = table.headers;
  for (let i = 0; i < table.rows.length; i += maxRows) {
    const s = clone(slideSpec);
    s.title = contTitle(slideSpec.title, out.length);
    s.table = {
      headers,
      rows: table.rows.slice(i, i + maxRows),
    };
    // Keep notes only on the last page to reduce clutter.
    if (i + maxRows < table.rows.length) delete s.notes;
    out.push(s);
  }
  return out;
}

export function paginateDeckSpec(deckSpec, layouts) {
  const spec = deckSpec && typeof deckSpec === 'object' ? deckSpec : { slides: [] };
  const slides = Array.isArray(spec.slides) ? spec.slides : [];
  const out = { ...spec, slides: [] };

  for (const slideSpec of slides) {
    const type = slideSpec?.type;
    const layout = (layouts && type && layouts[type]) || null;
    const geom = layout?.geometry || null;

    if (!type || !layout) {
      out.slides.push(slideSpec);
      continue;
    }

    if (type === 'twoColumnText' || type === 'analysis2ColumnsText') {
      out.slides.push(
        ...paginateTwoColumn(slideSpec, geom, {
          footerSafe: true,
          fallbackLeft: { w: 5.7, h: 5.7, y: 1.5 },
          fallbackRight: { w: 5.2, h: 5.7, y: 1.5 },
        }),
      );
      continue;
    }

    if (type === 'oneColumnText') {
      out.slides.push(
        ...paginateOneColumnBullets(slideSpec, geom, 'body', {
          footerSafe: true,
          fallbackBox: { w: 11.1596, h: 5.6, y: 1.6 },
        }),
      );
      continue;
    }

    if (type === 'analysisWideChart2ColsText' || type === 'analysisWideChartTableText') {
      // Body continues; chart repeats automatically because we keep `chart` unchanged.
      const fallbackBox =
        type === 'analysisWideChartTableText'
          ? { w: 11.1596, h: 2.2, y: 1.6 }
          : { w: 5.6, h: 5.4, y: 1.6 };
      out.slides.push(
        ...paginateOneColumnBullets(slideSpec, geom, 'body', {
          footerSafe: true,
          fallbackBox,
        }),
      );
      continue;
    }

    if (type === 'analysisNarrowTable') {
      out.slides.push(
        ...paginateTableRows(slideSpec, geom, {
          footerSafe: true,
          fallbackBox: { w: 11.1596, h: 4.5, y: 1.9 },
        }),
      );
      continue;
    }

    out.slides.push(slideSpec);
  }

  return out;
}
