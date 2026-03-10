import { deriveLegacyGeometryKinds } from './geometry-contract.js';
import { AUTHORED_REGISTRY_ENTRIES } from './onboarded-registry.generated.js';

const SLIDE_REGISTRY_SCHEMA_VERSION = '2.0.0';
const LEGACY_BUILTIN_TYPES = new Set([
  'analysisBridge',
  'analysisNarrowTable',
  'analysisWideChart2ColsText',
  'analysisWideChartTableText',
  'backCover',
  'businessOverview',
  'contents',
  'cover',
  'divider',
  'dividerDark',
  'dividerLight',
  'oneColumnText',
  'titleStrapline4TextBoxes',
  'twoColumnText',
]);

function withGeometryContract(entry) {
  const requiredGeometry = Object.freeze([...(entry?.requiredGeometry || [])]);
  const optionalGeometry = Object.freeze([...(entry?.optionalGeometry || [])]);
  const optionalDefaults = Object.freeze({ ...(entry?.optionalDefaults || {}) });
  const declaredGeometryKeys = [
    ...requiredGeometry,
    ...optionalGeometry,
    ...Object.keys(optionalDefaults),
  ];
  const primitiveGeometryKinds =
    (entry?.primitive && typeof entry.primitive === 'object' && entry.primitive.geometryKinds) ||
    (entry?.primitiveMetadata &&
      typeof entry.primitiveMetadata === 'object' &&
      entry.primitiveMetadata.geometryKinds) ||
    null;
  const geometryKinds = Object.freeze({
    ...deriveLegacyGeometryKinds(declaredGeometryKeys),
    ...((primitiveGeometryKinds && typeof primitiveGeometryKinds === 'object') ? primitiveGeometryKinds : {}),
    ...((entry?.geometryKinds && typeof entry.geometryKinds === 'object') ? entry.geometryKinds : {}),
  });
  const geometryContract = Object.freeze({
    requiredKeys: requiredGeometry,
    optionalKeys: optionalGeometry,
    optionalDefaults,
    geometryKinds,
  });
  return Object.freeze({
    ...entry,
    requiredGeometry,
    optionalGeometry,
    optionalDefaults,
    geometryKinds,
    geometryContract,
  });
}

const AUTHORED_REGISTRY = Object.freeze(
  Object.fromEntries(
    Object.entries(AUTHORED_REGISTRY_ENTRIES || {}).map(([type, entry]) => [
      type,
      withGeometryContract(entry),
    ]),
  ),
);

export function validateRegistry(registry = AUTHORED_REGISTRY) {
  for (const [type, entry] of Object.entries(registry || {})) {
    if (typeof entry.builder !== 'function') {
      throw new Error(`registry.${type}: missing builder`);
    }
    if (typeof entry.master !== 'string' || entry.master.trim().length === 0) {
      throw new Error(`registry.${type}: missing master`);
    }
    if (!Array.isArray(entry.requiredGeometry)) {
      throw new Error(`registry.${type}: requiredGeometry must be array`);
    }
    if (!entry.geometryKinds || typeof entry.geometryKinds !== 'object') {
      throw new Error(`registry.${type}: missing geometryKinds`);
    }
    for (const key of [
      ...(entry.requiredGeometry || []),
      ...((Array.isArray(entry.optionalGeometry) ? entry.optionalGeometry : [])),
      ...Object.keys(entry.optionalDefaults || {}),
    ]) {
      if (!entry.geometryKinds[key]) {
        throw new Error(`registry.${type}: missing geometry kind for "${key}"`);
      }
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

function buildSlideRegistry(overrides = null) {
  const normalizedOverrides = Object.fromEntries(
    Object.entries(overrides || {}).map(([type, entry]) => [type, withGeometryContract(entry)]),
  );
  const merged = Object.freeze({
    ...AUTHORED_REGISTRY,
    ...normalizedOverrides,
  });

  validateRegistry(merged);

  return {
    schemaVersion: SLIDE_REGISTRY_SCHEMA_VERSION,
    byType: merged,
    get(type) {
      if (!type || typeof type !== 'string') return null;
      return merged[type] || null;
    },
    list() {
      return Object.keys(merged);
    },
  };
}

const DEFAULT_SLIDE_REGISTRY = buildSlideRegistry();

export function listRegisteredSlideTypes() {
  return DEFAULT_SLIDE_REGISTRY.list();
}

export function getSlideEntry(type) {
  const entry = DEFAULT_SLIDE_REGISTRY.get(type);
  if (!entry) throw new Error(`Unknown slide type '${type}' (registry)`);
  return entry;
}

export function getSlideRegistryEntry(type) {
  if (!type || typeof type !== 'string') return null;
  return DEFAULT_SLIDE_REGISTRY.get(type);
}

export function getGeometryContractForType(type) {
  const entry = DEFAULT_SLIDE_REGISTRY.get(type);
  return entry?.geometryContract || null;
}

export function getSlideRegistry() {
  return DEFAULT_SLIDE_REGISTRY;
}

export function getBuiltinSlideRegistryEntries() {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(AUTHORED_REGISTRY).filter(([type]) => LEGACY_BUILTIN_TYPES.has(type)),
    ),
  );
}

export function createSlideRegistry({ overrides = null } = {}) {
  if (!overrides || Object.keys(overrides).length === 0) {
    return DEFAULT_SLIDE_REGISTRY;
  }
  return buildSlideRegistry(overrides);
}

export function registryTypeSet() {
  return new Set(DEFAULT_SLIDE_REGISTRY.list());
}

export function assertRegistryCoversTemplateTypes(templateLayouts = {}, slideRegistry = null) {
  const templateTypes = Object.keys(templateLayouts || {});
  const registryTypes = new Set(
    Array.isArray(slideRegistry?.list?.()) ? slideRegistry.list() : DEFAULT_SLIDE_REGISTRY.list(),
  );
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
  const entry = DEFAULT_SLIDE_REGISTRY.get(type);
  const master = entry?.master;
  if (!master) {
    throw new Error(`Missing master in slide registry for type "${type}"`);
  }
  return master;
}

export function isExcludedFromLogicalPaging(type) {
  return Boolean(DEFAULT_SLIDE_REGISTRY.get(type)?.excludeFromLogicalPaging);
}

validateRegistry(AUTHORED_REGISTRY);

export { SLIDE_REGISTRY_SCHEMA_VERSION };
