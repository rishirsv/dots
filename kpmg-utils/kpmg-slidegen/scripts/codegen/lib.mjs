import fs from 'node:fs';
import path from 'node:path';

import { REPO_ROOT } from '../support.mjs';

export const TEMPLATE_SRC_ROOT = path.join(REPO_ROOT, 'templates-src', 'kpmg-diligence');
export const LAYOUT_SRC_ROOT = path.join(TEMPLATE_SRC_ROOT, 'layouts');
export const PRIMITIVE_SRC_ROOT = path.join(TEMPLATE_SRC_ROOT, 'primitives');
export const GENERATED_LAYOUTS_PATH = path.join(
  REPO_ROOT,
  'templates',
  'kpmg-diligence',
  'package',
  'layouts.json',
);
export const GENERATED_ONBOARDED_INDEX_PATH = path.join(
  REPO_ROOT,
  'generator',
  'runtime',
  'onboarded-registry.index.json',
);
export const GENERATED_ONBOARDED_MODULE_PATH = path.join(
  REPO_ROOT,
  'generator',
  'runtime',
  'onboarded-registry.generated.js',
);

export const GENERATED_FILE_HEADER = 'GENERATED FILE - DO NOT EDIT DIRECTLY. Source: templates-src/kpmg-diligence/*';

export const BUILTIN_BUILDER_MAP = Object.freeze({
  analysisNarrowTable: {
    builderModule: 'generator/builders/analysis-narrow-table.js',
    builderExport: 'addAnalysisNarrowTable',
  },
  analysisWideChart2ColsText: {
    builderModule: 'generator/builders/analysis-wide-chart-text.js',
    builderExport: 'addAnalysisWideChart2ColsText',
  },
  analysisWideChartTableText: {
    builderModule: 'generator/builders/analysis-wide-chart-text.js',
    builderExport: 'addAnalysisWideChartTableText',
  },
  analysisBridge: {
    builderModule: 'generator/builders/analysis-bridge.js',
    builderExport: 'addAnalysisBridge',
  },
  businessOverview: {
    builderModule: 'generator/builders/business-overview.js',
    builderExport: 'addBusinessOverview',
  },
  backCover: {
    builderModule: 'generator/builders/back-cover-slide.js',
    builderExport: 'addBackCover',
  },
  cover: {
    builderModule: 'generator/builders/cover-slide.js',
    builderExport: 'addCover',
  },
  divider: {
    builderModule: 'generator/builders/divider-slide.js',
    builderExport: 'addDivider',
  },
  dividerDark: {
    builderModule: 'generator/builders/divider-slide.js',
    builderExport: 'addDivider',
  },
  dividerLight: {
    builderModule: 'generator/builders/divider-slide.js',
    builderExport: 'addDivider',
  },
  oneColumnText: {
    builderModule: 'generator/builders/one-column-text.js',
    builderExport: 'addOneColumnText',
  },
  titleStrapline4TextBoxes: {
    builderModule: 'generator/builders/title-strapline-4-boxes.js',
    builderExport: 'addTitleStrapline4TextBoxes',
  },
  twoColumnText: {
    builderModule: 'generator/builders/two-column-text.js',
    builderExport: 'addTwoColumnTextWithStrapline',
  },
  contents: {
    builderModule: 'generator/builders/contents-slide.js',
    builderExport: 'addContentsSlide',
  },
});

export const BUILTIN_TYPE_SET = new Set(Object.keys(BUILTIN_BUILDER_MAP));

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeFileIfChanged(filePath, content, { check = false } = {}) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (current === content) return false;
  if (check) {
    throw new Error(`Generated output is stale: ${path.relative(REPO_ROOT, filePath)}`);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return true;
}

export function listJsonFiles(rootDir, { includeSchemas = false } = {}) {
  if (!fs.existsSync(rootDir)) return [];
  return fs.readdirSync(rootDir)
    .filter((name) => name.endsWith('.json'))
    .filter((name) => (includeSchemas ? true : !name.endsWith('.schema.json')))
    .sort()
    .map((name) => path.join(rootDir, name));
}

export function readSourceLayouts() {
  return listJsonFiles(LAYOUT_SRC_ROOT).map((filePath) => readJson(filePath));
}

export function readSourcePrimitives() {
  return listJsonFiles(PRIMITIVE_SRC_ROOT).map((filePath) => readJson(filePath));
}

export function makeJsonContent(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function makeGeneratedJsHeader() {
  return `// ${GENERATED_FILE_HEADER}\n`;
}

export function sortObjectByKeys(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

export function primitiveVersionRef(primitive) {
  return `${primitive.id}@${primitive.version}`;
}

export function toPascalCase(value) {
  return String(value || '')
    .replace(/(^|[^A-Za-z0-9]+)([A-Za-z0-9])/g, (_, __, chr) => chr.toUpperCase());
}
