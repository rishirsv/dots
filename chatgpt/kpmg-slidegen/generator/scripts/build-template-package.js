import fs from 'node:fs';
import path from 'node:path';

import {
  resolveTemplateAssetsDir,
  resolveTemplateDir,
  resolveTemplateModuleUrl,
} from '../runtime/template-roots.js';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function mergeLayoutGeometry(layout, detected) {
  const out = JSON.parse(JSON.stringify(layout || {}));
  out.geometry = out.geometry || {};
  if (!detected) return out;
  for (const [key, value] of Object.entries(detected)) {
    if (out.geometry[key] == null && value != null) {
      out.geometry[key] = value;
    }
  }
  return out;
}

function buildAssetsManifest(templateDir, templateName) {
  const assetsDir = resolveTemplateAssetsDir(templateName);
  const files = fs.readdirSync(assetsDir).filter((name) => !name.startsWith('.'));
  const fileSet = new Set(files);
  const pick = (name) => (fileSet.has(name) ? `assets/${name}` : null);

  const assets = {
    logoSvg: { path: pick('kpmg-logo.svg') },
    logoWhiteSvg: { path: pick('kpmg-logo-white.svg') },
    logoWhitePng: { path: pick('kpmg-logo-white.png') },
    closingLogoWhite: { path: pick('closing-logo-white.png') },
    closingSocialTwitter: { path: pick('closing-social-twitter.png') },
    closingSocialLinkedin: { path: pick('closing-social-linkedin.png') },
    closingSocialFacebook: { path: pick('closing-social-facebook.png') },
    closingSocialInstagram: { path: pick('closing-social-instagram.png') },
    closingSocialYoutube: { path: pick('closing-social-youtube.png') },
    coverPhoto: { path: pick('cover-photo.jpeg') },
    gradientDividerWindow: { path: pick('gradient_divider_window_300dpi.png') },
    gradientBackCover: { path: pick('gradient_back_cover_300dpi.png') },
    gradientAccentChip: { path: pick('gradient_accent_chip_300dpi.png') },
  };

  for (const [key, entry] of Object.entries(assets)) {
    if (!entry.path) delete assets[key];
  }

  const extra = files
    .filter((f) => !f.toLowerCase().includes('assets-base64'))
    .map((f) => `assets/${f}`)
    .sort();

  return {
    templateName,
    generatedAt: new Date().toISOString(),
    templateDir: path.relative(templateDir, templateDir) || '.',
    assets,
    files: extra,
  };
}

const SLOT_KIND_DEFAULTS = {
  text: {
    minChars: 12,
    maxChars: 700,
    renderingHints: { mode: 'paragraph', keepTogether: true, priority: 'medium' },
  },
  textArray: {
    minItems: 2,
    minChars: 120,
    renderingHints: { mode: 'bullet', keepTogether: false, priority: 'high' },
  },
  kpiArray: {
    minItems: 3,
    renderingHints: { mode: 'kpi', keepTogether: true, priority: 'high' },
  },
  columns: {
    minItems: 4,
    renderingHints: { mode: 'columns', keepTogether: true, priority: 'high' },
  },
  table: {
    minItems: 3,
    renderingHints: { mode: 'table', keepTogether: true, priority: 'high' },
  },
  chart: {
    minItems: 1,
    renderingHints: { mode: 'chart', keepTogether: true, priority: 'medium' },
  },
  stringArray: {
    minItems: 2,
    renderingHints: { mode: 'list', keepTogether: true, priority: 'medium' },
  },
  contentsSections: {
    minItems: 5,
    renderingHints: { mode: 'contents', keepTogether: true, priority: 'high' },
  },
};

const SLOT_PATH_OVERRIDES = {
  'cover.title': { minChars: 8, maxChars: 100, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'cover.subtitle': { minChars: 12, maxChars: 200, allowEmpty: false, renderingHints: { mode: 'paragraph', priority: 'high' } },
  'contents.title': { minChars: 6, maxChars: 40, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'contents.sections': { minItems: 8, allowEmpty: false, renderingHints: { priority: 'high', keepTogether: true } },
  'divider.sectionNumber': { minChars: 2, maxChars: 2, allowEmpty: false, renderingHints: { mode: 'label', priority: 'high' } },
  'divider.sectionTitle': { minChars: 6, maxChars: 80, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'dividerDark.sectionNumber': { minChars: 2, maxChars: 2, allowEmpty: false, renderingHints: { mode: 'label', priority: 'high' } },
  'dividerDark.sectionTitle': { minChars: 6, maxChars: 80, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'dividerLight.sectionNumber': { minChars: 2, maxChars: 2, allowEmpty: false, renderingHints: { mode: 'label', priority: 'high' } },
  'dividerLight.sectionTitle': { minChars: 6, maxChars: 80, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'analysisNarrowTable.table': { minItems: 3, allowEmpty: false, renderingHints: { priority: 'high' } },
  'analysisNarrowTable.insightTitle': { minChars: 6, maxChars: 80, allowEmpty: true, renderingHints: { mode: 'heading', priority: 'high' } },
  'analysisWideChart2ColsText.body': { minItems: 4, minChars: 180, allowEmpty: false, renderingHints: { priority: 'high' } },
  'analysisWideChartTableText.body': { minItems: 4, minChars: 180, allowEmpty: false, renderingHints: { priority: 'high' } },
  'analysisWideChartTableText.heading': {
    minChars: 6,
    maxChars: 120,
    allowEmpty: true,
    renderingHints: { mode: 'heading', priority: 'high', keepTogether: true },
  },
  'analysisWideChartTableText.table': { minItems: 3, allowEmpty: false, renderingHints: { priority: 'high' } },
  'twoColumnText.leftBody': { minItems: 2, minChars: 80, allowEmpty: false, renderingHints: { priority: 'high' } },
  'twoColumnText.rightBody': { minItems: 2, minChars: 80, allowEmpty: false, renderingHints: { priority: 'high' } },
  'analysis2ColumnsText.leftBody': { minItems: 2, minChars: 80, allowEmpty: false, renderingHints: { priority: 'high' } },
  'analysis2ColumnsText.rightBody': { minItems: 2, minChars: 80, allowEmpty: false, renderingHints: { priority: 'high' } },
  'oneColumnText.body': { minItems: 3, minChars: 180, allowEmpty: false, renderingHints: { priority: 'high' } },
  'qualityOfEarnings.body': { minItems: 1, minChars: 50, allowEmpty: true, renderingHints: { priority: 'high' } },
  'titleStrapline4TextBoxes.columns': { minItems: 4, allowEmpty: false, renderingHints: { priority: 'high' } },
  'summaryFinancials.sectionsTop': { minItems: 2, allowEmpty: false, renderingHints: { priority: 'high' } },
  'summaryFinancials.sectionsBottom': { minItems: 2, allowEmpty: false, renderingHints: { priority: 'high' } },
  'summaryFinancials.source': { minChars: 12, maxChars: 700, allowEmpty: false, renderingHints: { priority: 'medium' } },
  'summaryFinancials.title': { minChars: 8, maxChars: 90, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'summaryFinancialsScaffold.title': { minChars: 8, maxChars: 90, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'analysisWideChartTableTextScaffold.title': { minChars: 8, maxChars: 90, allowEmpty: false, renderingHints: { mode: 'heading', priority: 'high' } },
  'analysisWideChartTableTextScaffold.body': { minItems: 1, minChars: 40, allowEmpty: true, renderingHints: { priority: 'medium' } },
  'analysisWideChartTableTextScaffold.heading': {
    minChars: 6,
    maxChars: 120,
    allowEmpty: true,
    renderingHints: { mode: 'heading', priority: 'high', keepTogether: true },
  },
  'analysisWideChartTableTextScaffold.table': { minItems: 3, allowEmpty: true, renderingHints: { priority: 'medium' } },
  'analysisWideChartTableTextScaffold.chart': { minItems: 1, allowEmpty: true, renderingHints: { priority: 'medium' } },
  'backCover.disclaimer': { minChars: 80, allowEmpty: true, renderingHints: { priority: 'low' } },
  'backCover.url': { minChars: 5, maxChars: 60, allowEmpty: true, renderingHints: { mode: 'label', priority: 'low' } },
};

const DENSITY_TARGETS = {
  cover: 0.65,
  contents: 0.8,
  divider: 0.75,
  dividerDark: 0.75,
  dividerLight: 0.75,
  summaryFinancials: 0.5,
  summaryFinancialsScaffold: 0.5,
  analysisWideChart2ColsText: 0.75,
  analysisWideChartTableText: 0.75,
  analysisWideChartTableTextScaffold: 0.55,
  analysisNarrowTable: 0.72,
  twoColumnText: 0.72,
  analysis2ColumnsText: 0.72,
  oneColumnText: 0.72,
  qualityOfEarnings: 0.55,
  titleStrapline4TextBoxes: 0.75,
  backCover: 0,
};

function applySlotSchemaContracts(layouts) {
  for (const [type, layout] of Object.entries(layouts)) {
    const slots = layout?.slots || {};
    const outSlots = {};
    for (const [slotName, slot] of Object.entries(slots)) {
      const kind = slot?.kind || 'text';
      const defaults = SLOT_KIND_DEFAULTS[kind] || {};
      const pathKey = `${type}.${slotName}`;
      const overrides = SLOT_PATH_OVERRIDES[pathKey] || {};
      const required = Boolean(slot?.required);
      const allowEmpty =
        slot?.allowEmpty ?? overrides.allowEmpty ?? false;
      const renderingHints = {
        ...(defaults.renderingHints || {}),
        ...(slot?.renderingHints || {}),
        ...(overrides.renderingHints || {}),
      };
      const maxChars =
        slot?.maxChars ?? overrides.maxChars ?? slot?.maxLength ?? defaults.maxChars;
      const minChars = slot?.minChars ?? overrides.minChars ?? defaults.minChars;
      const minItems = slot?.minItems ?? overrides.minItems ?? defaults.minItems;

      outSlots[slotName] = {
        ...slot,
        ...(minItems != null ? { minItems } : {}),
        ...(minChars != null ? { minChars } : {}),
        ...(maxChars != null ? { maxChars } : {}),
        allowEmpty,
        renderingHints,
      };
    }
    layouts[type].slots = outSlots;
    layouts[type].densityTarget = {
      mode: 'balanced',
      minScore: DENSITY_TARGETS[type] ?? 0.65,
    };
  }
}

function enrichLayouts(template) {
  const layouts = {};
  for (const [type, layout] of Object.entries(template.LAYOUTS || {})) {
    const detected = layout?.templateLayout
      ? template.DETECTED_LAYOUT_GEOMETRY?.[layout.templateLayout]
      : null;
    layouts[type] = mergeLayoutGeometry(layout, detected);
  }

  const dividerBase = layouts.divider || {};
  layouts.dividerDark = {
    ...dividerBase,
    description: 'Section divider (dark variant)',
    templateLayout: 'Divider slide_5',
    variant: 'dark',
  };

  const dividerLightDetected = template.DETECTED_LAYOUT_GEOMETRY?.['Divider slide_2'] || {};
  layouts.dividerLight = mergeLayoutGeometry(
    {
      ...dividerBase,
      description: 'Section divider (light variant)',
      templateLayout: 'Divider slide_2',
      variant: 'light',
    },
    dividerLightDetected,
  );

  const oneColumnDetected = template.DETECTED_LAYOUT_GEOMETRY?.['One column text'] || {};
  layouts.qualityOfEarnings = {
    description: 'Quality of earnings narrative layout',
    templateLayout: 'One column text',
    geometry: {
      title: layouts.oneColumnText?.geometry?.title || null,
      strapline: layouts.oneColumnText?.geometry?.strapline || null,
      body: oneColumnDetected.body || null,
    },
    slots: {
      title: { kind: 'text', required: true },
      strapline: { kind: 'text', required: false },
      body: { kind: 'textArray', required: false },
      source: { kind: 'text', required: false },
    },
  };

  const wideChartTableDetected =
    template.DETECTED_LAYOUT_GEOMETRY?.['Analysis_wide chart+table+text'] || {};
  layouts.analysisWideChartTableText = {
    ...layouts.analysisWideChartTableText,
    description: 'Analysis with chart, table, and commentary',
    templateLayout: 'Analysis_wide chart+table+text',
    geometry: {
      title: layouts.analysisWideChartTableText?.geometry?.title || null,
      strapline: wideChartTableDetected.bodyBoxes?.[0] || null,
      heading: wideChartTableDetected.bodyBoxes?.[1] || null,
      body: wideChartTableDetected.bodyBoxes?.[2] || null,
      chart: wideChartTableDetected.chart || null,
      table: wideChartTableDetected.table || null,
      bodyBoxes: wideChartTableDetected.bodyBoxes || null,
    },
    slots: {
      title: { kind: 'text', required: true },
      strapline: { kind: 'text', required: false },
      heading: { kind: 'text', required: false },
      body: { kind: 'textArray', required: true },
      chart: { kind: 'chart', required: true },
      table: { kind: 'table', required: false },
      noteSource: { kind: 'text', required: false },
    },
  };

  const narrowTableSlots = layouts.analysisNarrowTable?.slots || {};
  layouts.analysisNarrowTable = {
    ...layouts.analysisNarrowTable,
    slots: {
      ...narrowTableSlots,
      insightTitle: { kind: 'text', required: false },
    },
  };

  layouts.contents = {
    description: 'Table of contents slide with two rows of section blocks',
    templateLayout: 'Contents',
    geometry: {
      title: { x: 1.089, y: 0.472, w: 3.0, h: 0.62 },
      topRow: { x: 1.089, y: 1.38, w: 11.153, h: 2.35 },
      bottomRow: { x: 1.089, y: 4.04, w: 11.153, h: 2.35 },
    },
    slots: {
      title: { kind: 'text', required: true },
      sections: { kind: 'contentsSections', required: true },
    },
  };

  layouts.analysisWideChartTableTextScaffold = {
    description: 'P&L overview scaffold with strapline, summary chart, table, and long blue heading bar',
    templateLayout: 'Analysis_wide chart+table+text',
    geometry: {
      title: { x: 1.092, y: 0.472, w: 11.15, h: 0.583 },
      strapline: { x: 1.089, y: 1.29, w: 8.298, h: 0.528 },
      summaryChart: { x: 9.534, y: 1.077, w: 2.707, h: 0.742 },
      heading: { x: 5.268, y: 1.916, w: 6.976, h: 0.276 },
      table: { x: 1.089, y: 1.916, w: 4.036, h: 4.508 },
      body: { x: 5.268, y: 2.191, w: 6.975, h: 4.232 },
      note: { x: 1.088, y: 6.46, w: 3.937, h: 0.23 },
    },
    slots: {
      title: { kind: 'text', required: true },
      strapline: { kind: 'text', required: false },
      heading: { kind: 'text', required: false },
      body: { kind: 'textArray', required: false },
      chart: { kind: 'chart', required: false },
      table: { kind: 'table', required: false },
      noteSource: { kind: 'text', required: false },
    },
  };

  layouts.summaryFinancialsScaffold = {
    description: 'Summary financials scaffold with quality of earnings panels',
    templateLayout: 'Summary financials_3',
    geometry: {
      title: { x: 1.092, y: 0.472, w: 11.15, h: 0.583 },
      bodyBoxes:
        layouts.summaryFinancials?.geometry?.bodyBoxes ||
        template.DETECTED_LAYOUT_GEOMETRY?.['Summary financials_3']?.bodyBoxes ||
        null,
      panelHeight: 2.512,
    },
    slots: {
      title: { kind: 'text', required: true },
      sectionsTop: { kind: 'stringArray', required: false },
      sectionsBottom: { kind: 'stringArray', required: false },
      source: { kind: 'text', required: false },
    },
  };

  // Keep `summaryFinancials` as a legacy alias, but make it canonical scaffold
  // so we do not render the old custom KPI-card composition anymore.
  layouts.summaryFinancials = {
    description: 'Summary financials scaffold with quality of earnings panels',
    templateLayout: 'Summary financials_3',
    geometry: {
      title: { x: 1.092, y: 0.472, w: 11.15, h: 0.583 },
      bodyBoxes:
        layouts.summaryFinancialsScaffold?.geometry?.bodyBoxes ||
        template.DETECTED_LAYOUT_GEOMETRY?.['Summary financials_3']?.bodyBoxes ||
        null,
      panelHeight: 2.512,
    },
    slots: {
      title: { kind: 'text', required: true },
      sectionsTop: { kind: 'stringArray', required: false },
      sectionsBottom: { kind: 'stringArray', required: false },
      source: { kind: 'text', required: false },
    },
  };

  applySlotSchemaContracts(layouts);
  return layouts;
}

function buildLayoutPackage(template) {
  const types = enrichLayouts(template);

  return {
    generatedAt: new Date().toISOString(),
    types,
    detectedLayoutSlots: template.DETECTED_LAYOUT_SLOTS || {},
    detectedLayoutGeometry: template.DETECTED_LAYOUT_GEOMETRY || {},
    densityRules: {
      summaryFinancials: {},
      twoColumnText: { minLeftBodyItems: 2 },
      analysis2ColumnsText: { minLeftBodyItems: 2 },
      oneColumnText: { minBodyItems: 3 },
      qualityOfEarnings: { minBodyItems: 1 },
      contents: {},
      analysisWideChartTableTextScaffold: {},
      analysisWideChart2ColsText: { minBodyItems: 4 },
      analysisWideChartTableText: { minBodyItems: 4 },
      analysisNarrowTable: { minTableRows: 3 },
    },
    masters: {
      footerChrome: {
        logo: { x: 1.097, y: 6.854, w: 0.529, h: 0.215 },
        legalText: {
          x: 2.062,
          y: 6.854,
          w: 6.937,
          h: 0.202,
          fontFace: 'Arial',
          fontSize: 6,
          color: '666666',
          text:
            '© [year] [legal member firm name], a [jurisdiction] [legal structure] and a member firm of the KPMG global organization of independent member firms affiliated with KPMG International Limited, a private English company limited by guarantee. All rights reserved.',
        },
        officeContactText: {
          x: 8.95,
          y: 6.854,
          w: 0.82,
          h: 0.202,
          fontFace: 'Arial',
          fontSize: 6,
          color: '666666',
          text: '',
          align: 'left',
        },
        classificationText: {
          x: 9.807,
          y: 6.854,
          w: 2.041,
          h: 0.101,
          fontFace: 'Arial',
          fontSize: 6,
          color: '666666',
          text: 'Document Classification: KPMG Confidential',
          align: 'right',
        },
        separatorLine: {
          x: 11.892,
          y: 6.854,
          w: 0,
          h: 0.163,
          line: { color: '1E49E2', pt: 0.5 },
        },
        slideNumber: {
          x: 11.971,
          y: 6.854,
          w: 0.265,
          h: 0.163,
          fontFace: 'Arial',
          fontSize: 8,
          color: '00338D',
          align: 'right',
        },
      },
      variants: {
        white: { masterName: 'KPMG_WHITE', backgroundColor: 'FFFFFF', includeFooter: true },
        summary: {
          masterName: 'KPMG_SUMMARY',
          backgroundColor: 'FFFFFF',
          includeFooter: true,
          overlays: [{ assetKey: 'gradientAccentChip', x: 12.614, y: 0.113, w: 0.243, h: 0.243 }],
        },
        cover: { masterName: 'KPMG_COVER', backgroundColor: '1E49E2', includeFooter: false },
        sectionDark: {
          masterName: 'KPMG_SECTION_DARK',
          backgroundColor: '1E49E2',
          includeFooter: false,
          overlays: [{ assetKey: 'gradientDividerWindow', x: 1.092, y: 1.067, w: 7.723, h: 5.365 }],
        },
        section: {
          masterName: 'KPMG_SECTION',
          backgroundColor: '1E49E2',
          includeFooter: false,
          overlays: [{ assetKey: 'gradientDividerWindow', x: 1.092, y: 1.067, w: 7.723, h: 5.365 }],
        },
        sectionLight: { masterName: 'KPMG_SECTION_LIGHT', backgroundColor: 'FFFFFF', includeFooter: false },
        closing: {
          masterName: 'KPMG_CLOSING',
          backgroundColor: '1E49E2',
          includeFooter: false,
          overlays: [{ assetKey: 'gradientBackCover', x: 0, y: 0, w: 13.333, h: 7.5 }],
        },
      },
    },
  };
}

export async function buildTemplatePackage(templateName = 'kpmg-diligence') {
  const templateDir = resolveTemplateDir(templateName);
  const moduleUrl = resolveTemplateModuleUrl(templateName);
  const template = await import(moduleUrl);
  const templateJsonPath = path.join(templateDir, 'template.json');
  const templateJson = readJson(templateJsonPath);

  const packageDir = path.join(templateDir, 'package');
  const assetsManifestPath = path.join(packageDir, 'assets', 'manifest.json');
  const tokensPath = path.join(packageDir, 'tokens.json');
  const layoutsPath = path.join(packageDir, 'layouts.json');

  const tokens = {
    ...(template.TOKENS || {}),
    extracted: {
      slideDimensions: templateJson.slideDimensions || null,
      colors: templateJson.colors || null,
      fonts: templateJson.fonts || null,
    },
  };

  const layouts = buildLayoutPackage(template);
  const assetsManifest = buildAssetsManifest(templateDir, templateName);

  writeJson(tokensPath, tokens);
  writeJson(layoutsPath, layouts);
  writeJson(assetsManifestPath, assetsManifest);

  return { templateDir, packageDir, tokensPath, layoutsPath, assetsManifestPath };
}

export async function main(argv = process.argv.slice(2)) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i++;
    } else {
      args.set(key, true);
    }
  }

  const templateName = args.get('template') || 'kpmg-diligence';
  const result = await buildTemplatePackage(templateName);
  console.log(`Template package built: ${result.packageDir}`);
  console.log(`- ${result.tokensPath}`);
  console.log(`- ${result.layoutsPath}`);
  console.log(`- ${result.assetsManifestPath}`);
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
