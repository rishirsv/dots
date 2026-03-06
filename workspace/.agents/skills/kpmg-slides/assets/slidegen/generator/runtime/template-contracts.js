import {
  normalizeExtractedGeometry,
  validateCanonicalGeometry,
} from './geometry-contract.js';
import {
  defaultMasterNameForType,
  getGeometryContractForType,
} from './slide-registry.js';

export const CANONICAL_GEOMETRY_SCHEMA_VERSION = '2.0.0';

/**
 * Build per-master footer safe top map from template metadata.
 */
export function buildFooterSafeTopByMaster(templatePackage = {}) {
  const masters = templatePackage?.layouts?.masters || {};
  const variants = masters?.variants || {};
  const footerChrome = masters?.footerChrome || {};
  const logoY = Number(footerChrome?.logo?.y);
  if (!Number.isFinite(logoY)) return {};

  const safeTop = logoY - 0.1;
  const out = {};
  for (const variant of Object.values(variants)) {
    if (!variant?.masterName) continue;
    out[variant.masterName] = variant.includeFooter ? safeTop : null;
  }
  return out;
}

/**
 * Build strict canonical geometry contracts once per template load.
 */
export function buildTemplateContracts(templatePackage = {}, { slideRegistry } = {}) {
  if (!slideRegistry?.get) {
    throw new Error('template-contracts: missing slide registry');
  }

  const dims = templatePackage?.tokens?.dimensions || null;
  const slideW = Number(dims?.w);
  const slideH = Number(dims?.h);
  if (!Number.isFinite(slideW) || !Number.isFinite(slideH)) {
    throw new Error('template.tokens.dimensions missing');
  }

  const layoutsByType = templatePackage?.layouts?.types || {};
  const footerSafeTopByMaster = buildFooterSafeTopByMaster(templatePackage);
  const byType = {};

  for (const [type, layout] of Object.entries(layoutsByType)) {
    const entry = slideRegistry.get(type);
    if (!entry) {
      throw new Error(`template-contracts: missing slide registry entry for type "${type}"`);
    }

    const geometryContract = getGeometryContractForType(type) || {};
    const requiredKeys = Array.isArray(geometryContract.requiredKeys)
      ? geometryContract.requiredKeys
      : [];
    const optionalDefaults = geometryContract.optionalDefaults || {};

    const masterName = defaultMasterNameForType(type, templatePackage);
    const footerSafeTop = Object.prototype.hasOwnProperty.call(footerSafeTopByMaster, masterName)
      ? footerSafeTopByMaster[masterName]
      : null;

    const canonical = normalizeExtractedGeometry(layout?.geometry || {}, { type });
    const validated = validateCanonicalGeometry(canonical, {
      slideW,
      slideH,
      requiredKeys,
      optionalDefaults,
      type,
      masterName,
      footerSafeTop,
    });

    byType[type] = Object.freeze({
      schemaVersion: CANONICAL_GEOMETRY_SCHEMA_VERSION,
      boxes: validated,
      templateLayout: layout?.templateLayout || null,
      slots: layout?.slots || {},
      masterName,
      footerSafeTop,
    });
  }

  const frozenByType = Object.freeze(byType);

  return {
    schemaVersion: CANONICAL_GEOMETRY_SCHEMA_VERSION,
    dims: { w: slideW, h: slideH },
    footerSafeTopByMaster,
    byType: frozenByType,
    get(type) {
      return frozenByType[type] || null;
    },
    resolveGeometry(type) {
      const contract = frozenByType[type];
      if (!contract) throw new Error(`Unknown layout type "${type}" in template layouts.json`);
      return contract.boxes;
    },
    resolveForSlide(slideSpec = {}, registryType = null) {
      const type = registryType || slideSpec?.type;
      if (!type || typeof type !== 'string') {
        throw new Error('Unable to resolve slide type for template contracts');
      }
      const contract = frozenByType[type];
      if (!contract) {
        throw new Error(`Unknown layout type "${type}" in template layouts.json`);
      }
      return {
        geometry: contract.boxes,
        masterName: contract.masterName,
      };
    },
  };
}

/**
 * Resolve geometry for a slide type from startup-built template contracts.
 */
export function resolveSlideGeometry(templateContracts, slideType) {
  if (typeof templateContracts?.resolveGeometry !== 'function') {
    throw new Error('Missing template contracts resolver');
  }
  return templateContracts.resolveGeometry(slideType);
}
