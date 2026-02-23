import { FONTS, COLORS as T, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { addTitle } from '../helpers/title.js';
import { toBulletRuns } from '../helpers/bullets.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';
import { clampBoxToBottom } from '../helpers/geometry.js';

// ----
// Palette (derived from central tokens)
// ----
const COLORS = {
  KPMG_DARK_BLUE: T.kpmgDarkBlue,
  KPMG_LIGHT_GREY: T.lightGrey,
  GRID_GREY: 'D9D9D9',
  GRID_GREY_LIGHT: 'E5E7EB',
  WHITE: T.white,
  BLACK: T.black,
  ACCENT_CYAN: T.kpmgCyan,
  ACCENT_PURPLE: T.kpmgPurple,
};

// Two-column table + insights layout (derived from extracted "Analysis_50-50 table+text").
const TWO_COL = {
  table: { x: 1.08854, y: 1.91555, w: 5.50787, h: 4.50787 },
  rightTitle: { x: 6.73622, y: 1.91555, w: 5.50787, h: 0.27559 },
  rightBody: { x: 6.73622, y: 2.19115, w: 5.50787, h: 4.23228 },
};

function numOrNull(s) {
  const t = String(s ?? '').trim();
  if (!t || /^n\/a$/i.test(t) || t === '—') return null;
  // Keep negative via parentheses, and strip common financial formatting.
  const isParenNeg = /^\(.*\)$/.test(t);
  const cleaned = t.replace(/[(),$%xX+]/g, '').trim();
  const n = Number.parseFloat(cleaned);
  if (Number.isFinite(n)) return isParenNeg ? -n : n;
  return null;
}

function findRow(table, labelPrefix) {
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  const pfx = String(labelPrefix).toLowerCase();
  for (const r of rows) {
    const label = String(Array.isArray(r) ? r[0] : '').toLowerCase();
    if (label.startsWith(pfx)) return r;
  }
  return null;
}

function insightsForAnalysisTable(title, table) {
  const t = String(title ?? '').toLowerCase();
  const bullets = [];

  if (t.includes('financial summary')) {
    const rev = findRow(table, 'revenue');
    const gm = findRow(table, 'gross margin');
    const ocf = findRow(table, 'operating cash flow');
    const inv = findRow(table, 'inventory');
    if (rev) bullets.push(`Revenue scale step-change (${rev[1]} → ${rev[3]}) with continued momentum into FY2026.`);
    if (gm) bullets.push(`Margins peaked in FY2025 (${gm[3]}) and moderated in 9M FY2026 (${gm[4]}), requiring mix and provision diligence.`);
    if (ocf) bullets.push(`Cash generation remains strong (operating cash flow ${ocf[3]}), supporting aggressive capital return.`);
    if (inv) bullets.push(`Inventory build (${inv[3]} → ${inv[4]}) elevates focus on reserves, backlog quality, and platform transitions.`);
  } else if (t.includes('peer comparison')) {
    const evRev = findRow(table, 'ev / revenue');
    const pe = findRow(table, 'p/e');
    const growth = findRow(table, 'revenue growth');
    if (evRev) bullets.push(`Valuation premium is clear: EV/Revenue ${evRev[1]} vs peer median ${evRev[5]}.`);
    if (pe) bullets.push(`Earnings multiple embeds durability expectations: P/E ${pe[1]} vs peer median ${pe[5]}.`);
    if (growth) bullets.push(`Premium is underwritten by forward growth assumptions (${growth[1]} vs peers ~${growth[5]}).`);
    bullets.push(`Key diligence: sustainability of gross margin, customer concentration, and supply chain constraints.`);
  } else if (t.includes('sensitivity')) {
    bullets.push(`Range of implied enterprise values is highly sensitive to both normalized EBITDA and multiple selection.`);
    bullets.push(`Focus analysis on downside cases (mix/price, margin normalization) and upside scenarios (capacity unlocks).`);
    bullets.push(`Use as a decision framework for valuation guardrails and diligence priorities.`);
  } else if (t.includes('candidate adjustments')) {
    const net = findRow(table, 'indicative adj');
    const sbc = findRow(table, 'sbc');
    if (sbc) bullets.push(`Largest recurring adjustment driver: stock-based compensation (material and growing).`);
    if (net) bullets.push(`Indicative EBITDA adjustment impact is meaningful (FY2025: ${net[2]}), concentrated in a few items.`);
    bullets.push(`Inventory-related normalization requires evidence on reserve methodology and platform obsolescence risk.`);
    bullets.push(`Prioritize high-impact items first to converge quickly on normalized earnings.`);
  } else if (t.includes('priority data requests')) {
    const rows = Array.isArray(table?.rows) ? table.rows : [];
    const highs = rows.filter((r) => String(r?.[0] ?? '').toLowerCase() === 'high').slice(0, 5);
    if (highs.length) {
      bullets.push(`Top priorities center on unit/ASP bridge, customer concentration, supply commitments, and inventory reserves.`);
    }
    bullets.push(`Goal is to translate reported revenue into operational drivers and risk-adjusted durability.`);
    bullets.push(`Sequence requests to unblock valuation model inputs early, then deepen into root-cause drivers.`);
  } else {
    bullets.push(`Key takeaways synthesized from the table inputs for quick scan and discussion.`);
    bullets.push(`Use as a working view; confirm all figures during confirmatory diligence.`);
  }

  // Ensure we always have some content (demo mode).
  while (bullets.length < 4) bullets.push(`Add diligence commentary to contextualize table outcomes and implications.`);
  return bullets.slice(0, 6);
}

// ----
// Generic analysis table (matches the prompt's data schema)
// ----
// Full content-area width — always use this for table layout regardless of
// template geometry (the extracted "narrow table" width of ~4" is the template's
// placeholder width, not the intended data table width).
const FULL_TABLE_W = 11.1596;
const TABLE_CHROME = {
  titleBarFill: T.kpmgDarkBlue,
  headerFill: '1E49E2',
  separatorColor: T.kpmgBlue,
  titleBarHeight: 0.24,
  separatorHeight: 0.02,
};

function isNumericLike(s) {
  const t = String(s ?? '').trim();
  if (!t) return false;
  // Financial-ish tokens: $ ( ) % x , . - and digits
  // Examples: "$1,400B", "17.2x", "+114% YoY", "n/a"
  if (/^n\/a$/i.test(t)) return true;
  const stripped = t.replace(/[$,%()xX+−-]/g, '').replace(/[.,\s]/g, '');
  // If what's left is digits, treat as numeric-like.
  return stripped.length > 0 && /^\d+$/.test(stripped);
}

function headerEquals(header, candidates) {
  const h = String(header ?? '').trim().toLowerCase();
  return candidates.some((c) => h === String(c).trim().toLowerCase());
}

function computeColMeta(headers, rows) {
  const cols = Array.isArray(headers) ? headers.length : 0;
  const colMeta = [];
  for (let c = 0; c < cols; c++) {
    const h = String(headers[c] ?? '');
    const sample = (Array.isArray(rows) ? rows : []).slice(0, 12).map((r) => (Array.isArray(r) ? r[c] : ''));
    const maxLen = Math.max(
      h.length,
      ...sample.map((v) => String(v ?? '').length),
    );
    const nonEmpty = sample.filter((v) => String(v ?? '').trim().length > 0);
    const numericCount = nonEmpty.filter((v) => isNumericLike(v)).length;
    const numericRatio = nonEmpty.length ? numericCount / nonEmpty.length : 0;
    const isNumericCol = numericRatio >= 0.7;
    colMeta.push({
      header: h,
      maxLen,
      isNumericCol,
      isPriorityCol: headerEquals(h, ['priority']),
      isDirectionCol: headerEquals(h, ['direction']),
      isTextCol: !isNumericCol,
    });
  }
  return colMeta;
}

function computeColW({ w, headers, rows }) {
  const cols = Array.isArray(headers) ? headers.length : 0;
  if (!cols) return [w];

  const meta = computeColMeta(headers, rows);

  // High-signal special cases for the NVIDIA deck table types.
  // 1) Priority/Data Request/Rationale => narrow priority + wide text columns.
  if (
    cols === 3 &&
    meta.some((m) => m.isPriorityCol) &&
    meta.some((m) => headerEquals(m.header, ['data request'])) &&
    meta.some((m) => headerEquals(m.header, ['rationale']))
  ) {
    const priorityW = 0.95;
    const remaining = Math.max(0.1, w - priorityW);
    // Bias more width to Data Request than Rationale.
    return [priorityW, remaining * 0.58, remaining * 0.42];
  }

  // 2) First column is a label, remaining are mostly numeric => give label more room.
  const first = meta[0];
  const restNumeric = meta.slice(1).every((m) => m.isNumericCol) && cols >= 4;
  if (restNumeric) {
    const labelW = Math.min(Math.max(2.4, w * 0.22), 3.1);
    const remaining = Math.max(0.1, w - labelW);
    const even = remaining / (cols - 1);
    return [labelW, ...Array.from({ length: cols - 1 }, () => even)];
  }

  // Generic weighted allocation by content length, with sane mins.
  const mins = meta.map((m, idx) => {
    if (m.isPriorityCol) return 0.9;
    if (m.isDirectionCol) return 1.1;
    if (idx === 0) return 1.6;
    return m.isNumericCol ? 0.95 : 1.6;
  });

  const weights = meta.map((m, idx) => {
    const base = Math.min(Math.max(m.maxLen, 4), 42);
    if (m.isPriorityCol) return 4; // keep narrow
    if (m.isDirectionCol) return 6; // narrow utility column
    if (m.isNumericCol) return Math.min(base, 12);
    // Text columns get more weight, especially non-first columns.
    return idx === 0 ? Math.min(base * 0.9, 26) : Math.min(base * 1.25, 42);
  });

  const minSum = mins.reduce((a, b) => a + b, 0);
  const extra = Math.max(0, w - minSum);
  const wSum = weights.reduce((a, b) => a + b, 0) || 1;

  const colW = weights.map((wt, i) => mins[i] + (extra * wt) / wSum);

  // Normalize to exactly w (avoid minor floating drift).
  const total = colW.reduce((a, b) => a + b, 0) || 1;
  const scale = w / total;
  return colW.map((v) => v * scale);
}

function computeColAlignments(headers, rows) {
  const cols = Array.isArray(headers) ? headers.length : 0;
  const meta = computeColMeta(headers, rows);
  const aligns = [];
  for (let i = 0; i < cols; i++) {
    const m = meta[i];
    if (m.isPriorityCol) {
      aligns.push('center');
      continue;
    }
    if (m.isDirectionCol) {
      aligns.push('center');
      continue;
    }
    // Force common narrative columns to left-align.
    if (headerEquals(m.header, ['data request', 'rationale', 'detail'])) {
      aligns.push('left');
      continue;
    }
    aligns.push(m.isNumericCol ? 'right' : 'left');
  }
  return aligns;
}

function estimateCharsPerLine(colW, fontSize = 9) {
  const width = Math.max(0.4, Number(colW || 0.4));
  const size = Math.max(7, Number(fontSize || 9));
  return Math.max(6, Math.floor(width * 7.5 * (10 / size)));
}

function estimateCellLines(text, charsPerLine) {
  const raw = String(text ?? '').replace(/\r/g, '');
  return raw
    .split('\n')
    .reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(1, charsPerLine))), 0);
}

function estimateRowHeight(row, colW, fontSize = 9) {
  const cells = Array.isArray(row) ? row : [];
  let maxLines = 1;
  for (let idx = 0; idx < cells.length; idx += 1) {
    const lines = estimateCellLines(cells[idx], estimateCharsPerLine(colW[idx], fontSize));
    if (lines > maxLines) maxLines = lines;
  }
  const lineHeight = (Math.max(7, fontSize) + 2) / 72;
  return Math.max(0.19, Math.min(0.85, maxLines * lineHeight + 0.04));
}

function estimateTableHeight({ headers, rows, colW, fontSize = 9 }) {
  const bodyRows = Array.isArray(rows) ? rows : [];
  const headerH = 0.32;
  const chromeH = TABLE_CHROME.titleBarHeight + TABLE_CHROME.separatorHeight;
  if (!bodyRows.length) return chromeH + headerH;
  const rowHeights = bodyRows.map((row) => estimateRowHeight(row, colW, fontSize));
  return chromeH + headerH + rowHeights.reduce((sum, h) => sum + h, 0);
}

function computeRowH({ boxH, rows, colW, fontSize = 9 }) {
  // Dense financial table defaults in inches.
  const bodyRows = Array.isArray(rows) ? rows : [];
  const n = Math.max(1, bodyRows.length);
  const headerH = 0.32;
  const chromeH = TABLE_CHROME.titleBarHeight + TABLE_CHROME.separatorHeight;
  const estimatedHeights = bodyRows.length
    ? bodyRows.map((row) => estimateRowHeight(row, colW, fontSize))
    : Array.from({ length: n }, () => 0.22);
  const estimatedTotal = chromeH + headerH + estimatedHeights.reduce((sum, h) => sum + h, 0);
  const available = Number(boxH || 3.5);
  if (estimatedTotal <= available) return [headerH, ...estimatedHeights];

  const minBodyH = 0.16;
  const minTotal = chromeH + headerH + n * minBodyH;
  if (minTotal >= available) return [headerH, ...Array.from({ length: n }, () => minBodyH)];

  const flexSum = estimatedHeights.reduce((sum, h) => sum + Math.max(0, h - minBodyH), 0);
  if (flexSum <= 0) return [headerH, ...Array.from({ length: n }, () => minBodyH)];
  const availableFlex = available - chromeH - headerH - n * minBodyH;
  return [
    headerH,
    ...estimatedHeights.map((h) => minBodyH + (Math.max(0, h - minBodyH) / flexSum) * availableFlex),
  ];
}

export function addAnalysisTable(slide, tableData, opts = {}) {
  const {
    x = 1.0919,
    y = 1.9156,
    h = 2.5,
  } = opts;
  const tableTitle = String(opts.tableTitle ?? '').toLowerCase();
  const tableHeading = String(
    opts.tableHeading ??
      tableData?.title ??
      tableData?.heading ??
      '',
  ).trim();
  const showTitleBar = opts.showTitleBar !== false;
  const isFinancialSummary = tableTitle.includes('financial summary') || tableTitle.includes('summary financial');

  // Default to full-width, but allow callers (e.g., 50/50 table+text layouts)
  // to explicitly set a narrower table width.
  const w = typeof opts.w === 'number' ? opts.w : FULL_TABLE_W;

  const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];
  const tableRows = Array.isArray(tableData?.rows) ? tableData.rows : [];
  const cols = headers.length;

  const isNarrow = w < (FULL_TABLE_W - 0.25);
  const baseFontSize = isNarrow ? (cols >= 6 ? 7 : 8) : (cols >= 7 ? 8 : 9);
  const headerFontSize = Math.min(10, baseFontSize + (isNarrow ? 0 : 1));
  const tableChromeH = showTitleBar ? TABLE_CHROME.titleBarHeight + TABLE_CHROME.separatorHeight : 0;
  const tableY = y + tableChromeH;
  const tableH = Math.max(0.8, h - tableChromeH);
  const colW = computeColW({ w, headers, rows: tableRows });
  const colAlign = computeColAlignments(headers, tableRows);
  const rowH = computeRowH({ boxH: tableH, rows: tableRows, colW, fontSize: baseFontSize });

  if (showTitleBar) {
    slide.addShape('rect', {
      x,
      y,
      w,
      h: TABLE_CHROME.titleBarHeight,
      fill: { color: TABLE_CHROME.titleBarFill },
      line: { color: TABLE_CHROME.titleBarFill, transparency: 100, pt: 0 },
    });
    if (tableHeading) {
      slide.addText(tableHeading, {
        x: x + 0.06,
        y: y + 0.015,
        w: Math.max(0.5, w - 0.12),
        h: TABLE_CHROME.titleBarHeight - 0.02,
        fontFace: FONTS.body,
        fontSize: 9,
        color: COLORS.WHITE,
        bold: true,
        margin: 0,
        valign: 'mid',
      });
    }
    slide.addShape('line', {
      x,
      y: y + TABLE_CHROME.titleBarHeight,
      w,
      h: 0,
      line: { color: TABLE_CHROME.separatorColor, pt: 1.2 },
    });
  }

  // Border tokens (PptxGenJS border order: [top, right, bottom, left])
  const B_NONE = { type: 'none' };
  const B_OUT = { type: 'solid', pt: 0.6, color: COLORS.GRID_GREY };
  const B_ROW = { type: 'solid', pt: 0.5, color: COLORS.GRID_GREY };
  const B_COL = { type: 'solid', pt: 0.35, color: COLORS.GRID_GREY_LIGHT };

  // Build header row.
  const headerRow = headers.map((t, idx) => {
    const headerAlign = idx === 0 ? 'left' : 'center';
    const align = headerEquals(t, ['data request', 'rationale', 'detail']) ? 'left' : headerAlign;
    const left = idx === 0 ? B_OUT : B_NONE;
    const right = idx === cols - 1 ? B_OUT : B_NONE;
    return {
      text: t,
      options: {
        fill: TABLE_CHROME.headerFill,
        color: COLORS.WHITE,
        bold: true,
        fontFace: FONTS.body,
        fontSize: headerFontSize,
        valign: 'middle',
        align,
        margin: [2, 4, 2, 4],
        border: [
          B_NONE,
          right,
          { type: 'solid', pt: 1, color: TABLE_CHROME.separatorColor },
          left,
        ],
      },
    };
  });

  // Build body rows. Dense, “financial table” look: no zebra banding; use subtle row rules.
  const bodyRows = tableRows.map((r, rIdx) => {
    const fill = COLORS.WHITE;
    const metricLabel = String((Array.isArray(r) ? r[0] : '') ?? '').trim().toLowerCase();
    const highlightRow = isFinancialSummary && (metricLabel === 'gross margin' || metricLabel === 'net income');

    return r.map((cellText, cIdx) => {
      const isMetricCol = cIdx === 0;
      const header = String(headers[cIdx] ?? '').trim().toLowerCase();
      const txt = String(cellText ?? '').trim();

      // Body styling: first column should be black and non-bold, matching the
      // current narrow-table layout review requirement.
      let color = COLORS.BLACK;
      let bold = false;
      if (highlightRow && !isMetricCol) bold = true;

      if (header === 'direction') {
        bold = true;
        if (/up/i.test(txt)) color = COLORS.ACCENT_CYAN;
        if (/down/i.test(txt)) color = COLORS.ACCENT_PURPLE;
      }

      if (header === 'priority') {
        bold = true;
        if (/high/i.test(txt)) color = COLORS.KPMG_DARK_BLUE;
        else if (/medium/i.test(txt)) color = '1E49E2';
        else if (/low/i.test(txt)) color = '666666';
      }

      return {
        text: String(cellText ?? ''),
        options: {
          fill,
          fontFace: FONTS.body,
          fontSize: baseFontSize,
          bold,
          color,
          align: colAlign[cIdx] || (isMetricCol ? 'left' : 'right'),
          valign: 'middle',
          margin: [1, 4, 1, 4],
          border: [
            B_NONE,
            cIdx === cols - 1 ? B_OUT : B_COL,
            rIdx === tableRows.length - 1 ? B_OUT : B_ROW,
            cIdx === 0 ? B_OUT : B_NONE,
          ],
        },
      };
    });
  });

  const allRows = [headerRow, ...bodyRows];

  slide.addTable(allRows, {
    x,
    y: tableY,
    w,
    h: tableH,
    colW,
    rowH,
    border: { type: 'none' },
    fontFace: FONTS.body,
    fontSize: baseFontSize,
    color: COLORS.BLACK,
    // Pagination is handled by our paginator; autoPage can create surprise
    // continuation slides (e.g., splitting a table that already fits).
    autoPage: false,
    margin: 0,
  });
}

export function addAnalysisNarrowTable(
  pptx,
  { title, strapline, table, notes, insightTitle, insights: customInsights, geometry, masterName } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};
  const strapText = strapline;
  let straplineBox = null;

  addTitle(slide, title, g.title || { x: 1.0919, y: 0.4722, w: 11.1596, h: 0.5833 });

  if (strapText) {
    straplineBox = g.strapline || { x: 1.0919, y: 1.2899, w: 11.1596, h: 0.5276 };
    slide.addText(String(strapText), {
      ...straplineBox,
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.strapline,
      color: COLORS.ACCENT_PURPLE,
      bold: true,
      italic: true,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  if (table) {
    const tableTop = (g.table || TWO_COL.table).y;
    const yShift = strapText && straplineBox
      ? Math.max(0, (straplineBox.y + straplineBox.h + 0.06) - tableTop)
      : 0;
    const cols = Array.isArray(table.headers) ? table.headers.length : 0;
    const rows = Array.isArray(table.rows) ? table.rows.length : 0;
    const insights =
      Array.isArray(customInsights) && customInsights.length
        ? customInsights
        : insightsForAnalysisTable(title, table);
    const insightsHeading = String(insightTitle || table?.keyTakeawayTitle || 'Key takeaways').trim() || 'Key takeaways';

    // Default analysis layout: two columns (table + narrative). This matches how
    // these pages are typically built in diligence decks and lets us keep slides
    // visually “finished” even when the table is intentionally small.
    //
    // Fall back to full-width only for very wide tables (rare in this deck).
    const twoColTableBox = { ...TWO_COL.table, y: TWO_COL.table.y + yShift };
    const twoColColW = computeColW({ w: twoColTableBox.w, headers: table.headers, rows: table.rows });
    const estimatedTwoColHeight = estimateTableHeight({
      headers: table.headers,
      rows: table.rows,
      colW: twoColColW,
      fontSize: cols >= 6 ? 8 : 9,
    });
    const useTwoCol = cols > 0 && cols <= 6 && rows <= 14 && estimatedTwoColHeight <= twoColTableBox.h;

    const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
    if (useTwoCol) {
      const tableBox = twoColTableBox;
      addAnalysisTable(slide, table, {
        ...tableBox,
        tableTitle: title,
        tableHeading: table?.title || table?.heading || title,
      });

      const rightTitleBase = g.rightTitle || TWO_COL.rightTitle;
      const rightBodyBase = g.rightBody || TWO_COL.rightBody;
      const rightTitleBox = footerSafeTop ? clampBoxToBottom(rightTitleBase, footerSafeTop) : rightTitleBase;
      const rightBodyBox = footerSafeTop ? clampBoxToBottom(rightBodyBase, footerSafeTop) : rightBodyBase;

      slide.addText(insightsHeading, {
        ...rightTitleBox,
        fontFace: FONTS.body,
        fontSize: TYPE_SIZES.body,
        bold: true,
        color: COLORS.KPMG_DARK_BLUE,
        wrap: TEXT_BOX.wrap,
        margin: TEXT_BOX.marginPt,
        valign: 'top',
      });
      slide.addText(toBulletRuns(insights), {
        ...rightBodyBox,
        fontFace: FONTS.body,
        fontSize: TYPE_SIZES.body,
        color: COLORS.BLACK,
        wrap: TEXT_BOX.wrap,
        margin: TEXT_BOX.marginPt,
        valign: 'top',
      });
    } else {
      // Full-width table (dense), takeaways beneath to keep slide “finished”.
      const fullTableBox = { x: 1.0919, y: 1.9156 + yShift, w: 11.1596, h: 4.5079 };
      addAnalysisTable(slide, table, {
        ...fullTableBox,
        tableTitle: title,
        tableHeading: table?.title || table?.heading || title,
      });

      const fullColW = computeColW({ w: fullTableBox.w, headers: table.headers, rows: table.rows });
      const rowH = computeRowH({ boxH: fullTableBox.h, rows: table.rows, colW: fullColW, fontSize: cols >= 7 ? 8 : 9 });
      const tableH = rowH.reduce((a, b) => a + b, 0);
      const takeY = fullTableBox.y + tableH + 0.18;
      const safeTop = footerSafeTop ?? 6.7;
      const takeH = Math.max(0.8, safeTop - takeY);

      slide.addText(insightsHeading, {
        x: fullTableBox.x,
        y: takeY,
        w: fullTableBox.w,
        h: 0.22,
        fontFace: FONTS.body,
        fontSize: TYPE_SIZES.body,
        bold: true,
        color: COLORS.KPMG_DARK_BLUE,
        valign: 'top',
      });
      slide.addText(toBulletRuns(insights), {
        x: fullTableBox.x,
        y: takeY + 0.22,
        w: fullTableBox.w,
        h: takeH - 0.22,
        fontFace: FONTS.body,
        fontSize: TYPE_SIZES.body,
        color: COLORS.BLACK,
        wrap: TEXT_BOX.wrap,
        margin: TEXT_BOX.marginPt,
        valign: 'top',
      });
    }
  }

  if (notes) {
    const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
    const notesBox = {
      x: (TWO_COL.table.x ?? 1.0919),
      y: (TWO_COL.table.y + TWO_COL.table.h + 0.15),
      w: (TWO_COL.table.w ?? 5.5),
      h: 0.9,
    };
    const safeNotes = footerSafeTop ? clampBoxToBottom(notesBox, footerSafeTop) : notesBox;
    slide.addText(String(notes), {
      ...safeNotes,
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.source,
      color: '333333',
      italic: true,
      paraSpaceAfter: 0,
      valign: 'top',
    });
  }

  return slide;
}
