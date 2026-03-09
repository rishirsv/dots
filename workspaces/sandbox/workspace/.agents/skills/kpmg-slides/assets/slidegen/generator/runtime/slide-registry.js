import { addAnalysisBridge } from '../builders/analysis-bridge.js';
import { addAnalysisNarrowTable } from '../builders/analysis-narrow-table.js';
import {
  addAnalysisWideChart2ColsText,
  addAnalysisWideChartTableText,
} from '../builders/analysis-wide-chart-text.js';
import { addBackCover } from '../builders/back-cover-slide.js';
import { addBusinessOverview } from '../builders/business-overview.js';
import { addContentsSlide } from '../builders/contents-slide.js';
import { addCover } from '../builders/cover-slide.js';
import { addDivider } from '../builders/divider-slide.js';
import { addOneColumnText } from '../builders/one-column-text.js';
import { addTitleStrapline4TextBoxes } from '../builders/title-strapline-4-boxes.js';
import { addTwoColumnTextWithStrapline } from '../builders/two-column-text.js';

const SLIDE_REGISTRY_SCHEMA_VERSION = '2.0.0';

function withGeometryContract(entry) {
  const requiredGeometry = Object.freeze([...(entry?.requiredGeometry || [])]);
  const optionalGeometry = Object.freeze([...(entry?.optionalGeometry || [])]);
  const optionalDefaults = Object.freeze({ ...(entry?.optionalDefaults || {}) });
  const geometryContract = Object.freeze({
    requiredKeys: requiredGeometry,
    optionalKeys: optionalGeometry,
    optionalDefaults,
  });
  return Object.freeze({
    ...entry,
    requiredGeometry,
    optionalGeometry,
    optionalDefaults,
    geometryContract,
  });
}

const REGISTRY = Object.freeze({
  cover: withGeometryContract({
    builderId: 'cover',
    builder: addCover,
    master: 'KPMG_COVER',
    requiredGeometry: ['titleBox', 'subtitleBox', 'photoBox', 'logoBox'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  divider: withGeometryContract({
    builderId: 'divider',
    builder: addDivider,
    master: 'KPMG_SECTION_DARK',
    requiredGeometry: ['numberBox', 'titleBox'],
    optionalGeometry: ['gradientBox'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  dividerDark: withGeometryContract({
    builderId: 'divider',
    builder: addDivider,
    master: 'KPMG_SECTION_DARK',
    requiredGeometry: ['numberBox', 'titleBox'],
    optionalGeometry: ['gradientBox'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  dividerLight: withGeometryContract({
    builderId: 'divider',
    builder: addDivider,
    master: 'KPMG_SECTION_LIGHT',
    requiredGeometry: ['numberBox', 'titleBox'],
    optionalGeometry: ['gradientBox'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  twoColumnText: withGeometryContract({
    builderId: 'twoColumnText',
    builder: addTwoColumnTextWithStrapline,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'leftBox', 'rightBox'],
    paginationPolicyKey: 'text.twoColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  oneColumnText: withGeometryContract({
    builderId: 'oneColumnText',
    builder: addOneColumnText,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'bodyBox', 'sourceBox'],
    optionalGeometry: ['calloutBoxes'],
    paginationPolicyKey: 'text.oneColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  analysisNarrowTable: withGeometryContract({
    builderId: 'analysisNarrowTable',
    builder: addAnalysisNarrowTable,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'tableBox', 'rightTitleBox', 'rightBodyBox'],
    optionalGeometry: ['noteBox'],
    paginationPolicyKey: 'table.rows.v1',
    validationHooks: ['tableShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisWideChart2ColsText: withGeometryContract({
    builderId: 'analysisWideChart2ColsText',
    builder: addAnalysisWideChart2ColsText,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'bodyBox', 'chartBox'],
    optionalGeometry: ['calloutBoxes'],
    paginationPolicyKey: 'text.analysisWide.2cols.v1',
    validationHooks: ['chartShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisWideChartTableText: withGeometryContract({
    builderId: 'analysisWideChartTableText',
    builder: addAnalysisWideChartTableText,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'headingBox', 'bodyBox', 'chartBox', 'tableBox'],
    optionalGeometry: ['calloutBoxes', 'noteBox'],
    paginationPolicyKey: 'text.analysisWide.table.v1',
    validationHooks: ['chartShape', 'tableShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisBridge: withGeometryContract({
    builderId: 'analysisBridge',
    builder: addAnalysisBridge,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'chartBox', 'analysisBoxes', 'sourceBox'],
    optionalGeometry: ['typography'],
    paginationPolicyKey: 'bridge.analysisColumns.v1',
    validationHooks: ['bridgeSpec'],
    excludeFromLogicalPaging: false,
  }),
  businessOverview: withGeometryContract({
    builderId: 'businessOverview',
    builder: addBusinessOverview,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'leftHeadingBox', 'leftBox', 'rightHeadingBox', 'bodyBox', 'chartBox', 'sourceBox'],
    paginationPolicyKey: 'business.overviewBody.v1',
    validationHooks: ['businessStructureSpec'],
    excludeFromLogicalPaging: false,
  }),
  titleStrapline4TextBoxes: withGeometryContract({
    builderId: 'titleStrapline4TextBoxes',
    builder: addTitleStrapline4TextBoxes,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'straplineBox', 'columnBoxes'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  contents: withGeometryContract({
    builderId: 'contents',
    builder: addContentsSlide,
    master: 'KPMG_WHITE',
    requiredGeometry: ['titleBox', 'topRowBox', 'bottomRowBox'],
    paginationPolicyKey: 'contents.sections.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  backCover: withGeometryContract({
    builderId: 'backCover',
    builder: addBackCover,
    master: 'KPMG_CLOSING',
    requiredGeometry: ['logoBox', 'headingBox', 'disclaimerBox', 'urlBox'],
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
});

export function validateRegistry() {
  for (const [type, entry] of Object.entries(REGISTRY)) {
    if (typeof entry.builder !== 'function') {
      throw new Error(`registry.${type}: missing builder`);
    }
    if (typeof entry.master !== 'string' || entry.master.trim().length === 0) {
      throw new Error(`registry.${type}: missing master`);
    }
    if (!Array.isArray(entry.requiredGeometry)) {
      throw new Error(`registry.${type}: requiredGeometry must be array`);
    }
    if (typeof entry.paginationPolicyKey !== 'string' || entry.paginationPolicyKey.trim().length === 0) {
      throw new Error(`registry.${type}: missing paginationPolicyKey`);
    }
  }
}

export function resolveRegistryTypeForSlide(slideSpec = {}) {
  if (!slideSpec || typeof slideSpec !== 'object') return null;
  const type = String(slideSpec.type || '').trim();
  return type || null;
}

export function listRegisteredSlideTypes() {
  return Object.keys(REGISTRY);
}

export function getSlideEntry(type) {
  const entry = REGISTRY[type];
  if (!entry) throw new Error(`Unknown slide type '${type}' (registry)`);
  return entry;
}

export function getSlideRegistryEntry(type) {
  if (!type || typeof type !== 'string') return null;
  return REGISTRY[type] || null;
}

export function getGeometryContractForType(type) {
  const entry = getSlideRegistryEntry(type);
  return entry?.geometryContract || null;
}

export function getSlideRegistry() {
  return {
    schemaVersion: SLIDE_REGISTRY_SCHEMA_VERSION,
    byType: REGISTRY,
    get(type) {
      return getSlideRegistryEntry(type);
    },
    list() {
      return listRegisteredSlideTypes();
    },
  };
}

export function registryTypeSet() {
  return new Set(listRegisteredSlideTypes());
}

export function assertRegistryCoversTemplateTypes(templateLayouts = {}) {
  const templateTypes = Object.keys(templateLayouts || {});
  const registryTypes = registryTypeSet();
  const missing = templateTypes.filter((type) => !registryTypes.has(type));
  const extra = [...registryTypes].filter((type) => !Object.prototype.hasOwnProperty.call(templateLayouts || {}, type));

  if (missing.length || extra.length) {
    const parts = [];
    if (missing.length) parts.push(`missing in registry: ${missing.join(', ')}`);
    if (extra.length) parts.push(`extra in registry: ${extra.join(', ')}`);
    throw new Error(`Slide registry mismatch with template layouts: ${parts.join(' | ')}`);
  }
}

export function defaultMasterNameForType(type) {
  const entry = getSlideRegistryEntry(type);
  const master = entry?.master;
  if (!master) {
    throw new Error(`Missing master in slide registry for type "${type}"`);
  }
  return master;
}

export function isExcludedFromLogicalPaging(type) {
  return Boolean(getSlideRegistryEntry(type)?.excludeFromLogicalPaging);
}

validateRegistry();

export { SLIDE_REGISTRY_SCHEMA_VERSION };
