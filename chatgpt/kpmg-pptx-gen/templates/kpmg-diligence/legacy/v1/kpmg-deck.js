/**
 * kpmg-deck.js — KPMG PptxGenJS Template Layer
 *
 * Single-file library encoding the KPMG generic_template.pptx design into
 * PptxGenJS code. Designed for use in ChatGPT Code Interpreter.
 *
 * @version 2.0.0
 */

'use strict';

const PptxGenJS = require('pptxgenjs');

// ============================================================================
// A. TOKENS
// ============================================================================

const TOKENS = {
  colors: {
    dk1: '000000', dk2: '00338D', lt2: 'E5E5E5',
    accent1: '1E49E2', accent2: '00338D', accent3: '0C233C',
    accent4: '00B8F5', accent5: '7213EA', accent6: 'FD349C',
    hlink: '00B8F5', folHlink: '098E7E',
  },
  brand: {
    kpmgBlue: '00338D', mediumBlue: '005EB8', lightBlue: '0091DA',
    violet: '483698', purple: '470A68', lightPurple: '6D2077',
    green: '00A3A1', darkGreen: '009A44', lightGreen: '43B02A',
    yellow: 'EAAA00', orange: 'F68D2E', red: 'BC204B',
    pink: 'C6007E',
  },
  white: 'FFFFFF',
  black: '000000',
  font: 'Arial',
  size: {
    title: 14,
    body: 9,
    small: 8,
    notes: 6,
    source: 6,
    sectionNumber: 40,
    coverTitle: 36,
    coverSubtitle: 13,
    strapline: 9,
    tableHeader: 8,
    tableBody: 8,
  },
  paraSpaceAfter: 4,
};

// ============================================================================
// B. ASSETS
// ============================================================================

let ASSETS = null;

function _loadAssets() {
  if (ASSETS) return ASSETS;
  try {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(__dirname, 'output', 'assets.json');
    if (fs.existsSync(jsonPath)) {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      ASSETS = {};
      for (const k of Object.keys(raw)) {
        ASSETS[k] = 'data:image/png;base64,' + raw[k];
      }
      return ASSETS;
    }
  } catch (_) { /* fall through */ }
  ASSETS = { COVER_GRADIENT: null, SECTION_GRADIENT: null, CLOSING_GRADIENT: null, LOGO_WHITE: null, LOGO_BLUE: null };
  return ASSETS;
}

// ============================================================================
// C. LAYOUTS (inches)
// ============================================================================

const LAYOUTS = {
  slide: { w: 10, h: 7.5 },

  cover: {
    gradientRect: { x: 0.819, y: 1.325, w: 6.921, h: 4.865 },
    logo:         { x: 0.819, y: 0.472, w: 0.860, h: 0.346 },
    title:        { x: 1.089, y: 1.656, w: 6.378, h: 3.150 },
    subtitle:     { x: 1.089, y: 5.034, w: 6.378, h: 0.886 },
  },

  section: {
    gradientRect: { x: 0.816, y: 1.325, w: 6.455, h: 4.866 },
    number:       { x: 1.075, y: 1.699, w: 0.981, h: 0.790 },
    title:        { x: 1.075, y: 2.739, w: 5.023, h: 1.776 },
    subtitle:     { x: 1.075, y: 4.884, w: 5.023, h: 0.886 },
  },

  oneCol: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    body:  { x: 0.823, y: 1.100, w: 8.354, h: 5.450 },
  },

  twoCol: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    left:  { x: 0.823, y: 1.100, w: 4.075, h: 5.450 },
    right: { x: 5.102, y: 1.100, w: 4.075, h: 5.450 },
  },

  textChart: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    text:  { x: 0.823, y: 1.100, w: 4.075, h: 5.450 },
    chart: { x: 5.102, y: 1.100, w: 4.075, h: 5.200 },
  },

  colChart: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    body:  { x: 0.823, y: 1.100, w: 8.354, h: 2.200 },
    chart: { x: 0.823, y: 3.500, w: 8.354, h: 2.900 },
  },

  threeColChart: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    texts: [
      { x: 0.823, y: 1.100, w: 2.614, h: 2.200 },
      { x: 3.693, y: 1.100, w: 2.614, h: 2.200 },
      { x: 6.563, y: 1.100, w: 2.614, h: 2.200 },
    ],
    charts: [
      { x: 0.823, y: 3.500, w: 2.614, h: 2.700 },
      { x: 3.693, y: 3.500, w: 2.614, h: 2.700 },
      { x: 6.563, y: 3.500, w: 2.614, h: 2.700 },
    ],
  },

  process: {
    bannerRect: { x: 0, y: 0, w: 10, h: 2.902 },
    title:      { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    subtitle:   { x: 0.823, y: 1.325, w: 8.363, h: 0.400 },
    columns: [
      { x: 0.823, y: 2.101, w: 1.965, h: 4.246 },
      { x: 2.955, y: 2.101, w: 1.965, h: 4.246 },
      { x: 5.088, y: 2.101, w: 1.965, h: 4.246 },
      { x: 7.221, y: 2.101, w: 1.965, h: 4.246 },
    ],
  },

  closing: {
    logo:       { x: 0.819, y: 0.472, w: 0.860, h: 0.346 },
    url:        { x: 0.820, y: 6.181, w: 3.026, h: 0.168 },
    disclaimer: { x: 0.819, y: 3.996, w: 6.841, h: 2.016 },
  },

  table: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    table: { x: 0.823, y: 1.100, w: 8.354, h: 5.200 },
  },

  kpi: {
    title: { x: 0.823, y: 0.472, w: 8.354, h: 0.400 },
    boxes: [
      { x: 0.823, y: 1.250, w: 2.020, h: 1.050 },
      { x: 2.928, y: 1.250, w: 2.020, h: 1.050 },
      { x: 5.033, y: 1.250, w: 2.020, h: 1.050 },
      { x: 7.138, y: 1.250, w: 2.020, h: 1.050 },
    ],
    chart: { x: 0.823, y: 2.550, w: 8.354, h: 3.650 },
  },

  footer: {
    logo:         { x: 0.791, y: 6.913, w: 0.430, h: 0.173 },
    pageNum:      { x: 8.912, y: 6.921, w: 0.300, h: 0.200 },
    confidential: { x: 1.586, y: 6.921, w: 2.000, h: 0.173 },
  },
};

// Strapline geometry offset
const STRAPLINE_H = 0.25;
const STRAPLINE_GAP = 0.05;

// ============================================================================
// D. KPMGDeck CLASS
// ============================================================================

class KPMGDeck {
  constructor(opts = {}) {
    this._pptx = new PptxGenJS();
    this._pptx.defineLayout({ name: 'KPMG_4x3', width: 10, height: 7.5 });
    this._pptx.layout = 'KPMG_4x3';
    this._pptx.author = opts.author || 'KPMG';
    this._pptx.company = opts.company || 'KPMG LLP';
    this._pptx.subject = opts.subject || '';
    this._pptx.title = opts.title || '';
    this._slideCount = 0;
    this._defineMasters();
  }

  _defineMasters() {
    const assets = _loadAssets();

    this._pptx.defineSlideMaster({
      title: 'KPMG_COVER',
      background: { color: TOKENS.brand.kpmgBlue },
    });

    this._pptx.defineSlideMaster({
      title: 'KPMG_SECTION',
      background: { color: TOKENS.brand.kpmgBlue },
    });

    const whiteObjs = [];
    if (assets.LOGO_BLUE) {
      whiteObjs.push({
        image: {
          data: assets.LOGO_BLUE,
          x: LAYOUTS.footer.logo.x, y: LAYOUTS.footer.logo.y,
          w: LAYOUTS.footer.logo.w, h: LAYOUTS.footer.logo.h,
        },
      });
    }
    this._pptx.defineSlideMaster({
      title: 'KPMG_WHITE',
      background: { color: TOKENS.white },
      objects: whiteObjs,
    });

    this._pptx.defineSlideMaster({
      title: 'KPMG_BANNER',
      background: { color: TOKENS.white },
      objects: [{
        rect: {
          x: LAYOUTS.process.bannerRect.x, y: LAYOUTS.process.bannerRect.y,
          w: LAYOUTS.process.bannerRect.w, h: LAYOUTS.process.bannerRect.h,
          fill: { color: TOKENS.colors.accent1 },
        },
      }],
    });

    const closingObjs = [];
    if (assets.LOGO_WHITE) {
      closingObjs.push({
        image: {
          data: assets.LOGO_WHITE,
          x: LAYOUTS.closing.logo.x, y: LAYOUTS.closing.logo.y,
          w: LAYOUTS.closing.logo.w, h: LAYOUTS.closing.logo.h,
        },
      });
    }
    this._pptx.defineSlideMaster({
      title: 'KPMG_CLOSING',
      background: assets.CLOSING_GRADIENT
        ? { data: assets.CLOSING_GRADIENT }
        : { color: TOKENS.colors.accent5 },
      objects: closingObjs,
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------

  addCover({ title, subtitle, date } = {}) {
    const slide = this._addSlide('KPMG_COVER');
    const assets = _loadAssets();
    const L = LAYOUTS.cover;

    if (assets.COVER_GRADIENT) {
      slide.addImage({ data: assets.COVER_GRADIENT, x: L.gradientRect.x, y: L.gradientRect.y, w: L.gradientRect.w, h: L.gradientRect.h });
    } else {
      slide.addShape(this._pptx.ShapeType.rect, { x: L.gradientRect.x, y: L.gradientRect.y, w: L.gradientRect.w, h: L.gradientRect.h, fill: { color: TOKENS.colors.accent1 } });
    }

    if (assets.LOGO_WHITE) {
      slide.addImage({ data: assets.LOGO_WHITE, x: L.logo.x, y: L.logo.y, w: L.logo.w, h: L.logo.h });
    }

    slide.addText(title || '', {
      x: L.title.x, y: L.title.y, w: L.title.w, h: L.title.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.coverTitle,
      color: TOKENS.white, bold: true, valign: 'middle', wrap: true,
    });

    const subParts = [];
    if (subtitle) subParts.push(subtitle);
    if (date) { if (subParts.length) subParts.push(' \u2014 '); subParts.push(date); }
    if (subParts.length) {
      slide.addText(subParts.join(''), {
        x: L.subtitle.x, y: L.subtitle.y, w: L.subtitle.w, h: L.subtitle.h,
        fontFace: TOKENS.font, fontSize: TOKENS.size.coverSubtitle,
        color: TOKENS.white, valign: 'top', wrap: true,
      });
    }

    return slide;
  }

  addSection({ number, title, subtitle } = {}) {
    const slide = this._addSlide('KPMG_SECTION');
    const assets = _loadAssets();
    const L = LAYOUTS.section;

    if (assets.SECTION_GRADIENT) {
      slide.addImage({ data: assets.SECTION_GRADIENT, x: L.gradientRect.x, y: L.gradientRect.y, w: L.gradientRect.w, h: L.gradientRect.h });
    } else {
      slide.addShape(this._pptx.ShapeType.rect, { x: L.gradientRect.x, y: L.gradientRect.y, w: L.gradientRect.w, h: L.gradientRect.h, fill: { color: TOKENS.colors.accent1 } });
    }

    slide.addText(String(number || '').padStart(2, '0'), {
      x: L.number.x, y: L.number.y, w: L.number.w, h: L.number.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.sectionNumber,
      color: TOKENS.white, bold: true, valign: 'top',
    });

    slide.addText(title || '', {
      x: L.title.x, y: L.title.y, w: L.title.w, h: L.title.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.coverTitle,
      color: TOKENS.white, bold: true, valign: 'top', wrap: true,
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: L.subtitle.x, y: L.subtitle.y, w: L.subtitle.w, h: L.subtitle.h,
        fontFace: TOKENS.font, fontSize: TOKENS.size.coverSubtitle,
        color: TOKENS.white, valign: 'top', wrap: true,
      });
    }

    return slide;
  }

  addOneColumn({ title, strapline, body } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.oneCol;
    this._addTitle(slide, title, L.title);
    const bodyGeo = this._addStrapline(slide, strapline, L);
    this._addBody(slide, body, bodyGeo);
    this._addFooter(slide);
    return slide;
  }

  addTwoColumn({ title, strapline, left, right } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.twoCol;
    this._addTitle(slide, title, L.title);
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.03;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      const shift = STRAPLINE_H + STRAPLINE_GAP;
      this._addBody(slide, left, { ...L.left, y: L.left.y + shift, h: L.left.h - shift });
      this._addBody(slide, right, { ...L.right, y: L.right.y + shift, h: L.right.h - shift });
    } else {
      this._addBody(slide, left, L.left);
      this._addBody(slide, right, L.right);
    }
    this._addFooter(slide);
    return slide;
  }

  addTextWithChart({ title, strapline, body, chart } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.textChart;
    this._addTitle(slide, title, L.title);
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.03;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      const shift = STRAPLINE_H + STRAPLINE_GAP;
      this._addBody(slide, body, { ...L.text, y: L.text.y + shift, h: L.text.h - shift });
      if (chart) this._addChart(slide, chart, { ...L.chart, y: L.chart.y + shift, h: L.chart.h - shift });
    } else {
      this._addBody(slide, body, L.text);
      if (chart) this._addChart(slide, chart, L.chart);
    }
    this._addFooter(slide);
    return slide;
  }

  addOneColumnChart({ title, strapline, body, chart } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.colChart;
    this._addTitle(slide, title, L.title);
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.03;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      const shift = STRAPLINE_H + STRAPLINE_GAP;
      this._addBody(slide, body, { ...L.body, y: L.body.y + shift, h: L.body.h - shift });
      if (chart) this._addChart(slide, chart, { ...L.chart, y: L.chart.y + shift, h: L.chart.h - shift });
    } else {
      this._addBody(slide, body, L.body);
      if (chart) this._addChart(slide, chart, L.chart);
    }
    this._addFooter(slide);
    return slide;
  }

  addThreeColumnChart({ title, strapline, columns } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.threeColChart;
    this._addTitle(slide, title, L.title);
    let shift = 0;
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.03;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      shift = STRAPLINE_H + STRAPLINE_GAP;
    }
    const cols = columns || [];
    for (let i = 0; i < 3; i++) {
      const col = cols[i] || {};
      const tGeo = shift ? { ...L.texts[i], y: L.texts[i].y + shift, h: L.texts[i].h - shift } : L.texts[i];
      const cGeo = shift ? { ...L.charts[i], y: L.charts[i].y + shift, h: L.charts[i].h - shift } : L.charts[i];
      if (col.text) this._addBody(slide, col.text, tGeo);
      if (col.chart) this._addChart(slide, col.chart, cGeo);
    }
    this._addFooter(slide);
    return slide;
  }

  addProcess({ title, subtitle, columns } = {}) {
    const slide = this._addSlide('KPMG_BANNER');
    const L = LAYOUTS.process;

    slide.addText(title || '', {
      x: L.title.x, y: L.title.y, w: L.title.w, h: L.title.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.title, color: TOKENS.white, bold: true, valign: 'middle',
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: L.subtitle.x, y: L.subtitle.y, w: L.subtitle.w, h: L.subtitle.h,
        fontFace: TOKENS.font, fontSize: TOKENS.size.body, color: TOKENS.white, valign: 'middle',
      });
    }

    const cols = columns || [];
    for (let i = 0; i < 4; i++) {
      const col = cols[i];
      const geo = L.columns[i];
      if (!col) continue;
      const parts = [];
      if (col.heading) {
        parts.push({ text: col.heading, options: { fontFace: TOKENS.font, fontSize: TOKENS.size.body, color: TOKENS.brand.kpmgBlue, bold: true, paraSpaceAfter: TOKENS.paraSpaceAfter, breakType: 'none' } });
      }
      if (col.body) parts.push(...this._normalizeContent(col.body));
      if (parts.length) {
        slide.addText(parts, { x: geo.x, y: geo.y, w: geo.w, h: geo.h, fontFace: TOKENS.font, fontSize: TOKENS.size.body, color: TOKENS.black, valign: 'top', wrap: true, paraSpaceAfter: TOKENS.paraSpaceAfter });
      }
    }

    return slide;
  }

  /**
   * Table slide with optional strapline and source
   * @param {Object} opts
   * @param {string} opts.title
   * @param {string} [opts.strapline]
   * @param {Array<Array>} opts.rows - Array of rows; each row is array of cell values (string or {text,opts})
   * @param {Array<number>} [opts.colW] - Column widths in inches
   * @param {string} [opts.source] - Source attribution
   * @param {boolean} [opts.headerRow=true] - Style first row as header
   */
  addTableSlide({ title, strapline, rows, colW, source, headerRow = true } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.table;
    this._addTitle(slide, title, L.title);

    let tableY = L.table.y;
    let tableH = L.table.h;
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.03;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      const shift = STRAPLINE_H + STRAPLINE_GAP;
      tableY += shift;
      tableH -= shift;
    }

    if (source) tableH -= 0.22;

    // Build PptxGenJS table rows
    const tableRows = (rows || []).map((row, ri) => {
      return row.map(cell => {
        const isHeader = headerRow && ri === 0;
        const cellText = typeof cell === 'object' && cell !== null && cell.text !== undefined ? cell.text : String(cell ?? '');
        const cellOpts = typeof cell === 'object' && cell !== null && cell.opts ? cell.opts : {};
        return {
          text: cellText,
          options: {
            fontFace: TOKENS.font,
            fontSize: isHeader ? TOKENS.size.tableHeader : TOKENS.size.tableBody,
            color: isHeader ? TOKENS.white : TOKENS.black,
            bold: isHeader ? true : (cellOpts.bold || false),
            italic: cellOpts.italic || false,
            fill: { color: isHeader ? TOKENS.brand.kpmgBlue : (ri % 2 === 0 ? 'F2F2F2' : TOKENS.white) },
            border: { pt: 0.5, color: 'CCCCCC' },
            valign: 'middle',
            align: cellOpts.align || (ri === 0 ? 'center' : undefined),
            margin: [2, 4, 2, 4],
            ...cellOpts,
          },
        };
      });
    });

    const tableOpts = {
      x: L.table.x, y: tableY,
      w: L.table.w,
      colW: colW || undefined,
      autoPage: false,
      rowH: 0.28,
    };

    slide.addTable(tableRows, tableOpts);

    if (source) {
      slide.addText(source, {
        x: L.table.x, y: tableY + tableH + 0.02, w: L.table.w, h: 0.18,
        fontFace: TOKENS.font, fontSize: TOKENS.size.source,
        color: TOKENS.brand.kpmgBlue, italic: true, valign: 'top',
      });
    }

    this._addFooter(slide);
    return slide;
  }

  addKPIDashboard({ title, strapline, kpis, chart } = {}) {
    const slide = this._addSlide('KPMG_WHITE');
    const L = LAYOUTS.kpi;
    this._addTitle(slide, title, L.title);

    let boxY = L.boxes[0].y;
    if (strapline) {
      const sy = L.title.y + L.title.h + 0.06;
      this._renderStrapline(slide, strapline, { x: L.title.x, y: sy, w: L.title.w });
      boxY += STRAPLINE_H + STRAPLINE_GAP;
    }

    const defaultColors = [
      TOKENS.brand.kpmgBlue,
      TOKENS.colors.accent1,
      TOKENS.colors.accent5,
      TOKENS.brand.green,
    ];

    const kpiList = kpis || [];
    for (let i = 0; i < Math.min(kpiList.length, 4); i++) {
      const kpi = kpiList[i];
      const geo = { ...L.boxes[i], y: boxY };
      this._addKPIBox(slide, geo, {
        value: kpi.value,
        label: kpi.label,
        delta: kpi.delta,
        color: kpi.color || defaultColors[i % defaultColors.length],
      });
    }

    const chartY = boxY + L.boxes[0].h + 0.20;
    const chartH = 6.5 - chartY;
    if (chart) {
      this._addChart(slide, chart, { ...L.chart, y: chartY, h: chartH });
    }

    this._addFooter(slide);
    return slide;
  }

  addClosing({ disclaimer, url } = {}) {
    const slide = this._addSlide('KPMG_CLOSING');
    const L = LAYOUTS.closing;

    const defaultDisclaimer =
      'The information contained herein is of a general nature and is not intended to address ' +
      'the circumstances of any particular individual or entity. Although we endeavour to provide ' +
      'accurate and timely information, there can be no guarantee that such information is accurate ' +
      'as of the date it is received or that it will continue to be accurate in the future. No one ' +
      'should act on such information without appropriate professional advice after a thorough ' +
      'examination of the particular situation.\n\n' +
      '\u00A9 2025 KPMG LLP, an Ontario limited liability partnership and a member firm of the KPMG ' +
      'global organization of independent member firms affiliated with KPMG International Limited, ' +
      'a private English company limited by guarantee. All rights reserved. The KPMG name and logo ' +
      'are trademarks used under license by the independent member firms of the KPMG global organization.';

    slide.addText(disclaimer || defaultDisclaimer, {
      x: L.disclaimer.x, y: L.disclaimer.y, w: L.disclaimer.w, h: L.disclaimer.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.small,
      color: TOKENS.white, valign: 'top', wrap: true, paraSpaceAfter: TOKENS.paraSpaceAfter,
    });

    slide.addText(url || 'kpmg.com/ca', {
      x: L.url.x, y: L.url.y, w: L.url.w, h: L.url.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.small,
      color: TOKENS.white, bold: true, valign: 'middle',
    });

    return slide;
  }

  async write(filePath) { return this._pptx.writeFile({ fileName: filePath }); }
  async toBuffer() { return this._pptx.write({ outputType: 'nodebuffer' }); }
  get pptx() { return this._pptx; }

  // --------------------------------------------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------------------------------------------

  _addSlide(masterName) {
    this._slideCount++;
    return this._pptx.addSlide({ masterName });
  }

  _addTitle(slide, text, geo) {
    slide.addText(text || '', {
      x: geo.x, y: geo.y, w: geo.w, h: geo.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.title,
      color: TOKENS.brand.kpmgBlue, bold: true, valign: 'middle',
    });
    // Accent line below title
    slide.addShape(this._pptx.ShapeType.rect, {
      x: geo.x, y: geo.y + geo.h,
      w: 1.2, h: 0.020,
      fill: { color: TOKENS.colors.accent1 },
    });
  }

  _renderStrapline(slide, text, geo) {
    slide.addText(text, {
      x: geo.x, y: geo.y, w: geo.w, h: STRAPLINE_H,
      fontFace: TOKENS.font, fontSize: TOKENS.size.strapline,
      color: TOKENS.brand.kpmgBlue, italic: true, bold: true,
      valign: 'top', wrap: true,
    });
  }

  _addKPIBox(slide, geo, { value, label, delta, color }) {
    slide.addShape(this._pptx.ShapeType.roundRect, {
      x: geo.x, y: geo.y, w: geo.w, h: geo.h,
      fill: { color: color || TOKENS.brand.kpmgBlue },
      rectRadius: 0.06,
      shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.15 },
    });

    slide.addText(value || '', {
      x: geo.x + 0.08, y: geo.y + 0.08,
      w: geo.w - 0.16, h: geo.h * 0.45,
      fontFace: TOKENS.font, fontSize: 22,
      color: TOKENS.white, bold: true,
      align: 'center', valign: 'bottom',
    });

    slide.addText(label || '', {
      x: geo.x + 0.08, y: geo.y + geo.h * 0.50,
      w: geo.w - 0.16, h: geo.h * 0.25,
      fontFace: TOKENS.font, fontSize: 7,
      color: TOKENS.white,
      align: 'center', valign: 'top',
    });

    if (delta) {
      slide.addText(delta, {
        x: geo.x + 0.08, y: geo.y + geo.h * 0.73,
        w: geo.w - 0.16, h: geo.h * 0.22,
        fontFace: TOKENS.font, fontSize: 6,
        color: TOKENS.white, italic: true,
        align: 'center', valign: 'top',
      });
    }
  }

  /** If strapline provided, renders it and returns adjusted body geo; otherwise returns original body geo */
  _addStrapline(slide, strapline, layout) {
    if (!strapline) return layout.body;
    const sy = layout.title.y + layout.title.h + 0.03;
    this._renderStrapline(slide, strapline, { x: layout.body.x, y: sy, w: layout.body.w });
    const shift = STRAPLINE_H + STRAPLINE_GAP;
    return { ...layout.body, y: layout.body.y + shift, h: layout.body.h - shift };
  }

  _addBody(slide, content, geo) {
    if (!content) return;
    const items = this._normalizeContent(content);
    slide.addText(items, {
      x: geo.x, y: geo.y, w: geo.w, h: geo.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.body,
      color: TOKENS.black, valign: 'top', wrap: true,
      paraSpaceAfter: TOKENS.paraSpaceAfter,
    });
  }

  _normalizeContent(content) {
    if (typeof content === 'string') return [{ text: content, options: {} }];
    if (!Array.isArray(content)) return [this._richTextObj(content)];

    const result = [];
    for (const item of content) {
      if (typeof item === 'string') {
        result.push({ text: item, options: { bullet: { code: '2022' }, indentLevel: 0, paraSpaceAfter: TOKENS.paraSpaceAfter } });
      } else if (Array.isArray(item)) {
        for (const sub of item) {
          const obj = typeof sub === 'string' ? { text: sub } : this._richTextObj(sub);
          obj.options = obj.options || {};
          obj.options.bullet = { code: '2013' };
          obj.options.indentLevel = 1;
          obj.options.paraSpaceAfter = TOKENS.paraSpaceAfter;
          result.push(obj);
        }
      } else if (typeof item === 'object' && item !== null) {
        const obj = this._richTextObj(item);
        // Force new paragraph via invisible bullet (NBSP)
        obj.options.bullet = { code: '00A0' };
        obj.options.indentLevel = 0;
        if (obj.options.bold) obj.options.paraSpaceBefore = 6;
        result.push(obj);
      }
    }
    return result;
  }

  _richTextObj(obj) {
    const options = {};
    if (obj.bold) options.bold = true;
    if (obj.italic) options.italic = true;
    if (obj.color) options.color = obj.color;
    if (obj.fontSize) options.fontSize = obj.fontSize;
    if (obj.bullet) options.bullet = obj.bullet;
    if (obj.indentLevel !== undefined) options.indentLevel = obj.indentLevel;
    if (obj.breakType) options.breakType = obj.breakType;
    options.paraSpaceAfter = TOKENS.paraSpaceAfter;
    return { text: obj.text || '', options };
  }

  _addChart(slide, chart, geo) {
    if (!chart || !chart.type || !chart.data) return;

    const chartTypeMap = {
      bar: this._pptx.ChartType.bar, bar3d: this._pptx.ChartType.bar3D,
      line: this._pptx.ChartType.line, pie: this._pptx.ChartType.pie,
      doughnut: this._pptx.ChartType.doughnut, area: this._pptx.ChartType.area,
      scatter: this._pptx.ChartType.scatter, radar: this._pptx.ChartType.radar,
    };

    let chartGeo = { ...geo };
    if (chart.source) chartGeo.h -= 0.22;

    const chartOpts = {
      x: chartGeo.x, y: chartGeo.y, w: chartGeo.w, h: chartGeo.h,
      showTitle: false, showLegend: true, legendPos: 'b',
      legendFontSize: 7, legendFontFace: TOKENS.font,
      catAxisLabelFontSize: 7, valAxisLabelFontSize: 7,
      catAxisLabelFontFace: TOKENS.font, valAxisLabelFontFace: TOKENS.font,
      dataLabelFontFace: TOKENS.font, dataLabelFontSize: 7,
      plotArea: { fill: { color: 'F8F9FA' }, border: { color: 'E5E7EB', pt: 0.5 } },
      dataBorder: { pt: 0.5, color: 'FFFFFF' },
      chartColors: [
        TOKENS.brand.kpmgBlue, TOKENS.colors.accent1, TOKENS.colors.accent4,
        TOKENS.colors.accent5, TOKENS.colors.accent6, TOKENS.brand.green,
        TOKENS.brand.mediumBlue, TOKENS.brand.orange, TOKENS.brand.violet,
      ],
      ...(chart.opts || {}),
    };

    slide.addChart(chartTypeMap[chart.type] || chart.type, chart.data, chartOpts);

    if (chart.source) {
      slide.addText(chart.source, {
        x: geo.x, y: chartGeo.y + chartGeo.h + 0.02, w: geo.w, h: 0.18,
        fontFace: TOKENS.font, fontSize: TOKENS.size.source,
        color: TOKENS.brand.kpmgBlue, italic: true, valign: 'top',
      });
    }
  }

  _addFooter(slide) {
    slide.addText(String(this._slideCount), {
      x: LAYOUTS.footer.pageNum.x, y: LAYOUTS.footer.pageNum.y,
      w: LAYOUTS.footer.pageNum.w, h: LAYOUTS.footer.pageNum.h,
      fontFace: TOKENS.font, fontSize: TOKENS.size.notes,
      color: TOKENS.brand.kpmgBlue, align: 'right', valign: 'middle',
    });
  }
}

// ============================================================================
// E. EXPORTS
// ============================================================================

KPMGDeck.TOKENS = TOKENS;
KPMGDeck.LAYOUTS = LAYOUTS;
KPMGDeck.loadAssets = _loadAssets;

module.exports = KPMGDeck;
