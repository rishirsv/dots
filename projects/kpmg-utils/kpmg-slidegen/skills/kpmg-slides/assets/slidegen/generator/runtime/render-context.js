import { buildTemplateContracts } from './template-contracts.js';
import { buildTheme } from './theme.js';
import {
  createSlideRegistry,
  assertRegistryCoversTemplateTypes,
  validateRegistry,
} from './slide-registry.js';
import { assertPolicyCoverage, buildPaginationPolicy } from './pagination-policy.js';
import { buildDiagnosticsRecorder } from './diagnostics.js';

const EMPTY_ASSETS = Object.freeze({});
const DIVIDER_TYPES = new Set(['divider', 'dividerDark', 'dividerLight']);
const RESERVED_SLIDE_KEYS = Object.freeze([
  'masterName',
  'geometry',
  'assets',
]);

function requireAssetPath(assetPath, assetKey, slideType) {
  if (assetPath) return assetPath;
  throw new Error(`Missing required template asset "${assetKey}" for slide type "${slideType}"`);
}

function resolveAssetsForType(templatePackage = {}, registryType, registryEntry = null, masterName = null) {
  const resolveAssetPath = templatePackage?.resolveAssetPath;
  if (typeof resolveAssetPath !== 'function') return EMPTY_ASSETS;

  const effectiveMaster = String(masterName || registryEntry?.master || '').trim();

  if (registryType === 'cover' || effectiveMaster === 'KPMG_COVER') {
    return Object.freeze({
      logoWhite: requireAssetPath(
        resolveAssetPath('logoWhitePng') || resolveAssetPath('logoWhiteSvg'),
        'logoWhitePng/logoWhiteSvg',
        registryType,
      ),
      coverPhoto: requireAssetPath(resolveAssetPath('coverPhoto'), 'coverPhoto', registryType),
    });
  }

  if (
    DIVIDER_TYPES.has(registryType) ||
    effectiveMaster === 'KPMG_SECTION_DARK' ||
    effectiveMaster === 'KPMG_SECTION_LIGHT'
  ) {
    return Object.freeze({
      gradientDivider: resolveAssetPath('gradientDividerWindow') || null,
    });
  }

  if (registryType === 'backCover' || effectiveMaster === 'KPMG_CLOSING') {
    return Object.freeze({
      gradientBackCover: requireAssetPath(
        resolveAssetPath('gradientBackCover'),
        'gradientBackCover',
        registryType,
      ),
      closingLogoWhite: requireAssetPath(
        resolveAssetPath('closingLogoWhite'),
        'closingLogoWhite',
        registryType,
      ),
      closingSocialTwitter: requireAssetPath(
        resolveAssetPath('closingSocialTwitter'),
        'closingSocialTwitter',
        registryType,
      ),
      closingSocialLinkedin: requireAssetPath(
        resolveAssetPath('closingSocialLinkedin'),
        'closingSocialLinkedin',
        registryType,
      ),
      closingSocialFacebook: requireAssetPath(
        resolveAssetPath('closingSocialFacebook'),
        'closingSocialFacebook',
        registryType,
      ),
      closingSocialInstagram: requireAssetPath(
        resolveAssetPath('closingSocialInstagram'),
        'closingSocialInstagram',
        registryType,
      ),
      closingSocialYoutube: requireAssetPath(
        resolveAssetPath('closingSocialYoutube'),
        'closingSocialYoutube',
        registryType,
      ),
    });
  }

  return EMPTY_ASSETS;
}

export function buildRenderContext({ templatePackage = {}, deckSpec = null, options = {} } = {}) {
  const theme = buildTheme(templatePackage, { deckSpec, options });
  const slideRegistry =
    options.slideRegistry ||
    createSlideRegistry({ overrides: options.slideRegistryOverrides || null });
  validateRegistry(slideRegistry.byType);
  assertRegistryCoversTemplateTypes(templatePackage?.layouts?.types || {}, slideRegistry);
  const paginationPolicy = buildPaginationPolicy(templatePackage);
  assertPolicyCoverage(slideRegistry, paginationPolicy);
  const templateContracts = buildTemplateContracts(templatePackage, {
    slideRegistry,
  });
  const footerSafeTopByMaster = templateContracts.footerSafeTopByMaster;
  const diagnostics = buildDiagnosticsRecorder();
  const sharedOptions = Object.freeze({
    allowSparse: Boolean(options.allowSparse || deckSpec?.metadata?.allowSparse),
    strict: Boolean(options.strict),
  });
  const resolvedByType = new Map();
  const builderCtxCacheByOptions = new WeakMap();

  const contracts = Object.freeze({
    reservedSlideKeys: RESERVED_SLIDE_KEYS,
    resolveForSlide(slideSpec = {}, registryType) {
      const resolvedType = registryType || slideSpec?.type;
      if (!resolvedType || typeof resolvedType !== 'string') {
        throw new Error('Unable to resolve slide type for builder contract');
      }
      if (resolvedByType.has(resolvedType)) return resolvedByType.get(resolvedType);
      const registryEntry = slideRegistry.get(resolvedType);
      const { geometry, masterName } = templateContracts.resolveForSlide(slideSpec, resolvedType);
      const resolved = Object.freeze({
        geometry,
        masterName,
        assets: resolveAssetsForType(templatePackage, resolvedType, registryEntry, masterName),
      });
      resolvedByType.set(resolvedType, resolved);
      return resolved;
    },
  });

  function buildBuilderCtx({
    slideSpec = {},
    registryType = null,
    options: optionsOverride = sharedOptions,
  } = {}) {
    const resolvedType = registryType || slideSpec?.type;
    if (!resolvedType || typeof resolvedType !== 'string') {
      throw new Error('Unable to build builder context without slide type');
    }
    const resolved = contracts.resolveForSlide(slideSpec, resolvedType);
    const effectiveOptions = optionsOverride || sharedOptions;
    let perOptionsCache = builderCtxCacheByOptions.get(effectiveOptions);
    if (!perOptionsCache) {
      perOptionsCache = new Map();
      builderCtxCacheByOptions.set(effectiveOptions, perOptionsCache);
    }
    if (perOptionsCache.has(resolvedType)) return perOptionsCache.get(resolvedType);
    const ctx = {
      template: templatePackage,
      theme,
      geometry: resolved.geometry,
      assets: resolved.assets,
      masterName: resolved.masterName,
      footerSafeTopByMaster,
      options: effectiveOptions,
      diagnostics,
    };
    perOptionsCache.set(resolvedType, ctx);
    return ctx;
  }

  return {
    template: templatePackage,
    theme,
    templateContracts,
    slideRegistry,
    paginationPolicy,
    footerSafeTopByMaster,
    options: sharedOptions,
    diagnostics,
    contracts,
    buildBuilderCtx,
  };
}
