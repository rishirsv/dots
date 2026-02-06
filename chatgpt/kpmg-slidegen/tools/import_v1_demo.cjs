#!/usr/bin/env node
/*
  Import the legacy V1 proof-of-concept deck definition (CommonJS) into the V2
  JSON schema used by this repo.

  Output: samples/v1/v1-nvidia.json
*/

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.join(ROOT, 'legacy', 'v1');
const DEMO_JS = path.join(LEGACY_DIR, 'demo.js');
const LEGACY_DECK_MODULE = path.join(LEGACY_DIR, 'kpmg-deck.js');
const OUT_JSON = path.join(ROOT, 'samples', 'v1', 'v1-nvidia.json');

function normalizeSectionNumber(n) {
  if (n === undefined || n === null) return '';
  const s = String(n);
  if (/^\d{2}$/.test(s)) return s;
  if (/^\d+$/.test(s)) return String(parseInt(s, 10)).padStart(2, '0');
  return s.slice(0, 2);
}

function toBulletLines(content) {
  if (!content) return [];
  if (typeof content === 'string') return [content];
  if (!Array.isArray(content)) return [String(content.text ?? '')];

  const lines = [];
  for (const item of content) {
    if (typeof item === 'string') {
      lines.push(item);
      continue;
    }
    if (Array.isArray(item)) {
      for (const sub of item) lines.push(String(sub?.text ?? sub ?? ''));
      continue;
    }
    if (typeof item === 'object' && item) {
      lines.push(String(item.text ?? ''));
      continue;
    }
    lines.push(String(item ?? ''));
  }
  return lines.filter(Boolean);
}

function toPlainText(content) {
  return toBulletLines(content).join('\n');
}

function tableFromLegacyRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return { headers: [], rows: [] };
  const header = rows[0].map((c) => (typeof c === 'object' && c ? String(c.text ?? '') : String(c ?? '')));
  const body = rows.slice(1).map((r) =>
    r.map((c) => (typeof c === 'object' && c ? String(c.text ?? '') : String(c ?? '')))
  );
  return { headers: header, rows: body };
}

class CapturingDeck {
  constructor(opts = {}) {
    this._slideCount = 0;
    this.metadata = {
      title: opts.title || '',
      author: opts.author || '',
      company: opts.company || 'KPMG LLP',
      subject: opts.subject || '',
    };
    this.slides = [];
  }

  _push(slideSpec) {
    this._slideCount += 1;
    slideSpec.__legacy = { index: this._slideCount };
    this.slides.push(slideSpec);
    return slideSpec;
  }

  addCover({ title, subtitle, date } = {}) {
    const sub = [subtitle, date].filter(Boolean).join('\n');
    return this._push({ type: 'cover', title: title || '', subtitle: sub || '' });
  }

  addSection({ number, title, subtitle } = {}) {
    const sectionTitle = title || '';
    const sectionNumber = normalizeSectionNumber(number);
    const sectionSubtitle = subtitle ? String(subtitle) : '';
    // V2 divider has no subtitle slot; append subtitle into title to preserve content.
    const mergedTitle = sectionSubtitle ? `${sectionTitle}\n${sectionSubtitle}` : sectionTitle;
    return this._push({ type: 'divider', sectionNumber, sectionTitle: mergedTitle });
  }

  addTwoColumn({ title, strapline, left, right } = {}) {
    return this._push({
      type: 'twoColumnText',
      title: title || '',
      strapline: strapline || '',
      leftBody: toBulletLines(left),
      rightBody: toBulletLines(right),
    });
  }

  addOneColumn({ title, strapline, body } = {}) {
    return this._push({
      type: 'oneColumnText',
      title: title || '',
      strapline: strapline || '',
      body: toBulletLines(body),
    });
  }

  addTextWithChart({ title, strapline, body, chart } = {}) {
    return this._push({
      type: 'textWithChart',
      title: title || '',
      strapline: strapline || '',
      body: toBulletLines(body),
      chart: chart || null,
    });
  }

  addOneColumnChart({ title, strapline, body, chart } = {}) {
    return this._push({
      type: 'oneColumnChart',
      title: title || '',
      strapline: strapline || '',
      body: toBulletLines(body),
      chart: chart || null,
    });
  }

  addThreeColumnChart({ title, strapline, columns } = {}) {
    const cols = Array.isArray(columns) ? columns : [];
    return this._push({
      type: 'threeColumnChart',
      title: title || '',
      strapline: strapline || '',
      columns: cols.map((c) => ({
        text: toBulletLines(c?.text),
        chart: c?.chart || null,
      })),
    });
  }

  addProcess({ title, subtitle, columns } = {}) {
    const cols = Array.isArray(columns) ? columns : [];
    return this._push({
      type: 'process',
      title: title || '',
      subtitle: subtitle || '',
      columns: cols.map((c) => ({
        heading: c?.heading || '',
        body: toBulletLines(c?.body),
      })),
    });
  }

  addKPIDashboard({ title, strapline, kpis, chart } = {}) {
    const items = Array.isArray(kpis) ? kpis : [];
    return this._push({
      type: 'kpiDashboard',
      title: title || '',
      strapline: strapline || '',
      kpis: items.map((k) => ({ value: k.value || '', label: k.label || '', delta: k.delta || '' })),
      chart: chart || null,
    });
  }

  addTableSlide({ title, strapline, rows, colW, source } = {}) {
    const slideSpec = this._push({
      type: 'tableSlide',
      title: title || '',
      strapline: strapline || '',
      table: tableFromLegacyRows(rows || []),
      colW: Array.isArray(colW) ? colW : null,
      source: source || '',
      notes: '',
    });

    // demo.js sometimes adds commentary directly to the returned slide instance.
    return {
      addText: (text) => {
        slideSpec.notes = [slideSpec.notes, String(text || '')].filter(Boolean).join('\n\n');
      },
    };
  }

  addClosing({ disclaimer, url } = {}) {
    return this._push({
      type: 'closing',
      disclaimer: disclaimer || '',
      url: url || '',
    });
  }

  async write(_filePath) {
    // Instead of producing a PPTX here, emit the captured deck spec.
    const deck = {
      metadata: {
        title: this.metadata.title,
        author: this.metadata.author,
        company: this.metadata.company,
        subject: this.metadata.subject,
      },
      slides: this.slides,
    };

    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(deck, null, 2) + '\n', 'utf8');
    return OUT_JSON;
  }
}

function run() {
  // Intercept `require('./kpmg-deck')` inside legacy/v1/demo.js
  require.cache[LEGACY_DECK_MODULE] = {
    id: LEGACY_DECK_MODULE,
    filename: LEGACY_DECK_MODULE,
    loaded: true,
    exports: CapturingDeck,
  };

  // Run the legacy demo (it will call deck.write(), which writes OUT_JSON).
  require(DEMO_JS);

  console.log(`Wrote: ${OUT_JSON}`);
}

run();
