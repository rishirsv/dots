const SLIDE_REGISTRY_SCHEMA_VERSION = '2.0.0';

function withGeometryContract(entry) {
  const geometryContract = {
    requiredKeys: [...(entry?.geometryContract?.requiredKeys || [])],
    optionalKeys: [...(entry?.geometryContract?.optionalKeys || [])],
    optionalDefaults: { ...(entry?.geometryContract?.optionalDefaults || {}) },
  };
  return Object.freeze({
    ...entry,
    geometryContract,
    // Compatibility alias used by existing contract tests.
    requiredGeometry: geometryContract.requiredKeys,
  });
}

const REGISTRY = Object.freeze({
  cover: withGeometryContract({
    builderId: 'cover',
    masterVariant: 'cover',
    geometryContract: {
      requiredKeys: ['titleBox', 'subtitleBox', 'photoBox', 'logoBox'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  divider: withGeometryContract({
    builderId: 'divider',
    masterVariant: 'sectionDark',
    geometryContract: {
      requiredKeys: ['numberBox', 'titleBox'],
      optionalKeys: ['gradientBox'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  dividerDark: withGeometryContract({
    builderId: 'divider',
    masterVariant: 'sectionDark',
    geometryContract: {
      requiredKeys: ['numberBox', 'titleBox'],
      optionalKeys: ['gradientBox'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  dividerLight: withGeometryContract({
    builderId: 'divider',
    masterVariant: 'sectionLight',
    geometryContract: {
      requiredKeys: ['numberBox', 'titleBox'],
      optionalKeys: ['gradientBox'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
  twoColumnText: withGeometryContract({
    builderId: 'twoColumnText',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'leftBox', 'rightBox'],
    },
    paginationPolicyKey: 'text.twoColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  oneColumnText: withGeometryContract({
    builderId: 'oneColumnText',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'bodyBox', 'sourceBox'],
      optionalKeys: ['calloutBoxes'],
    },
    paginationPolicyKey: 'text.oneColumn.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  analysisNarrowTable: withGeometryContract({
    builderId: 'analysisNarrowTable',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'tableBox', 'rightTitleBox', 'rightBodyBox'],
      optionalKeys: ['noteBox'],
    },
    paginationPolicyKey: 'table.rows.v1',
    validationHooks: ['tableShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisWideChart2ColsText: withGeometryContract({
    builderId: 'analysisWideChart2ColsText',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'bodyBox', 'chartBox'],
      optionalKeys: ['calloutBoxes'],
    },
    paginationPolicyKey: 'text.analysisWide.2cols.v1',
    validationHooks: ['chartShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisWideChartTableText: withGeometryContract({
    builderId: 'analysisWideChartTableText',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'headingBox', 'bodyBox', 'chartBox', 'tableBox'],
      optionalKeys: ['calloutBoxes', 'noteBox'],
    },
    paginationPolicyKey: 'text.analysisWide.table.v1',
    validationHooks: ['chartShape', 'tableShape'],
    excludeFromLogicalPaging: false,
  }),
  analysisBridge: withGeometryContract({
    builderId: 'analysisBridge',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'chartBox', 'analysisBoxes', 'sourceBox'],
      optionalKeys: ['typography'],
    },
    paginationPolicyKey: 'bridge.analysisColumns.v1',
    validationHooks: ['bridgeSpec'],
    excludeFromLogicalPaging: false,
  }),
  businessOverview: withGeometryContract({
    builderId: 'businessOverview',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'leftHeadingBox', 'leftBox', 'rightHeadingBox', 'bodyBox', 'chartBox', 'sourceBox'],
    },
    paginationPolicyKey: 'business.overviewBody.v1',
    validationHooks: ['businessStructureSpec'],
    excludeFromLogicalPaging: false,
  }),
  titleStrapline4TextBoxes: withGeometryContract({
    builderId: 'titleStrapline4TextBoxes',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'straplineBox', 'columnBoxes'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  contents: withGeometryContract({
    builderId: 'contents',
    masterVariant: 'white',
    geometryContract: {
      requiredKeys: ['titleBox', 'topRowBox', 'bottomRowBox'],
    },
    paginationPolicyKey: 'contents.sections.v1',
    validationHooks: [],
    excludeFromLogicalPaging: false,
  }),
  backCover: withGeometryContract({
    builderId: 'backCover',
    masterVariant: 'closing',
    geometryContract: {
      requiredKeys: ['logoBox', 'headingBox', 'disclaimerBox', 'urlBox'],
    },
    paginationPolicyKey: 'none.v1',
    validationHooks: [],
    excludeFromLogicalPaging: true,
  }),
});

export function resolveRegistryTypeForSlide(slideSpec = {}) {
  if (!slideSpec || typeof slideSpec !== 'object') return null;
  const type = String(slideSpec.type || '').trim();
  return type || null;
}

export function listRegisteredSlideTypes() {
  return Object.keys(REGISTRY);
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

export function defaultMasterNameForType(type, templatePackage) {
  const entry = getSlideRegistryEntry(type);
  const variantKey = entry?.masterVariant || 'white';
  const variants = templatePackage?.layouts?.masters?.variants || {};
  const configured = variants?.[variantKey]?.masterName;

  if (typeof configured === 'string' && configured.trim()) return configured.trim();

  if (variantKey === 'cover') return 'KPMG_COVER';
  if (variantKey === 'closing') return 'KPMG_CLOSING';
  if (variantKey === 'sectionLight') return 'KPMG_SECTION_LIGHT';
  if (variantKey === 'sectionDark') return 'KPMG_SECTION_DARK';
  return 'KPMG_WHITE';
}

export function isExcludedFromLogicalPaging(type) {
  return Boolean(getSlideRegistryEntry(type)?.excludeFromLogicalPaging);
}

export { SLIDE_REGISTRY_SCHEMA_VERSION };
