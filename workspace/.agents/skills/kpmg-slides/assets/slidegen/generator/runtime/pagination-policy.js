const PAGINATION_POLICY_SCHEMA_VERSION = '1.0.0';
const POLICY_KEY_PATTERN = /^[A-Za-z0-9]+(?:\.[A-Za-z0-9_-]+)*\.v\d+$/;
const ALLOWED_STRATEGIES = new Set([
  'none',
  'twoColumnBullets',
  'oneColumnBullets',
  'tableRows',
  'contentsSections',
  'bridgeAnalysisColumns',
  'businessOverview',
]);
const ONE_COLUMN_LAYOUT_VARIANTS = new Set([
  'oneColumn',
  'analysisWideChart2ColsText',
  'analysisWideChartTableText',
]);

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0);
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

function normalizePolicy(key, rawPolicy = {}) {
  if (!POLICY_KEY_PATTERN.test(key)) {
    throw new Error(
      `Invalid pagination policy key "${key}". Expected a versioned key like "text.oneColumn.v1"`,
    );
  }

  const strategy = String(rawPolicy?.strategy || '').trim();
  if (!strategy) throw new Error(`Pagination policy "${key}" must define a non-empty strategy`);
  if (!ALLOWED_STRATEGIES.has(strategy)) {
    throw new Error(
      `Pagination policy "${key}" has unsupported strategy "${strategy}"`,
    );
  }

  const mode = String(rawPolicy?.mode || '').trim();
  if (!mode) throw new Error(`Pagination policy "${key}" must define a non-empty mode`);
  const options = rawPolicy?.options && typeof rawPolicy.options === 'object' ? { ...rawPolicy.options } : {};
  if (strategy === 'oneColumnBullets') {
    const variant = String(options.layoutVariant || '').trim();
    if (!variant) {
      throw new Error(
        `Pagination policy "${key}" strategy "${strategy}" requires options.layoutVariant`,
      );
    }
    if (!ONE_COLUMN_LAYOUT_VARIANTS.has(variant)) {
      throw new Error(
        `Pagination policy "${key}" has unsupported one-column layoutVariant "${variant}"`,
      );
    }
  }
  const dropFields = normalizeList(rawPolicy?.dropFields);
  const recomputeFields = normalizeList(rawPolicy?.recomputeFields);

  return Object.freeze({
    key,
    strategy,
    mode,
    dropFields,
    recomputeFields,
    options,
  });
}

export function buildPaginationPolicy(templatePackage = {}) {
  const source = templatePackage?.paginationPolicy;
  if (!source || typeof source !== 'object') {
    throw new Error('Missing required template pagination policy payload');
  }

  const schemaVersion = String(source.schemaVersion || '').trim();
  if (!schemaVersion) {
    throw new Error('Template pagination policy must include schemaVersion');
  }
  if (schemaVersion !== PAGINATION_POLICY_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported pagination policy schemaVersion "${schemaVersion}"; expected "${PAGINATION_POLICY_SCHEMA_VERSION}"`,
    );
  }

  const policiesSource = source?.policies;
  if (!policiesSource || typeof policiesSource !== 'object') {
    throw new Error('Template pagination policy must define a "policies" object');
  }

  const byKey = {};
  for (const [key, rawPolicy] of Object.entries(policiesSource)) {
    const normalized = normalizePolicy(key, rawPolicy);
    assertPolicyShape(normalized);
    byKey[key] = normalized;
  }

  if (!Object.prototype.hasOwnProperty.call(byKey, 'none.v1')) {
    throw new Error('Template pagination policy must include required key "none.v1"');
  }

  return {
    schemaVersion,
    byKey,
    get(key) {
      if (typeof key !== 'string' || !key.trim()) return null;
      return byKey[key] || null;
    },
    keys() {
      return Object.keys(byKey);
    },
  };
}

export function assertPolicyCoverage(slideRegistry, paginationPolicy) {
  const missingPolicyKeys = [];
  const registryByType = slideRegistry?.byType || {};

  for (const [slideType, entry] of Object.entries(registryByType)) {
    const policyKey = String(entry?.paginationPolicyKey || '').trim();
    if (!policyKey) {
      missingPolicyKeys.push(`${slideType}: <empty>`);
      continue;
    }
    if (!paginationPolicy?.get?.(policyKey)) {
      missingPolicyKeys.push(`${slideType}: ${policyKey}`);
    }
  }

  if (missingPolicyKeys.length > 0) {
    throw new Error(
      `Slide registry references missing pagination policies: ${missingPolicyKeys.join(', ')}`,
    );
  }
}

export function assertPolicyShape(policy) {
  if (!policy || typeof policy !== 'object') {
    throw new Error('Pagination policy entry must be an object');
  }
  if (typeof policy.strategy !== 'string' || !policy.strategy.trim()) {
    throw new Error('Pagination policy entry is missing strategy');
  }
  if (!isStringArray(policy.dropFields)) {
    throw new Error(`Pagination policy "${policy.key || 'unknown'}" dropFields must be a string array`);
  }
  if (!isStringArray(policy.recomputeFields)) {
    throw new Error(`Pagination policy "${policy.key || 'unknown'}" recomputeFields must be a string array`);
  }
  return true;
}

export { PAGINATION_POLICY_SCHEMA_VERSION };
