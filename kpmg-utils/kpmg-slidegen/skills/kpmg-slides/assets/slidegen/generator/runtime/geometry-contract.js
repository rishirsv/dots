const BOX_KEYS = Object.freeze([
  'titleBox',
  'straplineBox',
  'bodyBox',
  'leftBox',
  'rightBox',
  'chartBox',
  'tableBox',
  'sourceBox',
  'headingBox',
  'noteBox',
  'logoBox',
  'subtitleBox',
  'photoBox',
  'numberBox',
  'topRowBox',
  'bottomRowBox',
  'rightTitleBox',
  'rightBodyBox',
  'leftHeadingBox',
  'rightHeadingBox',
  'gradientBox',
  'disclaimerBox',
  'urlBox',
]);

const ARRAY_BOX_KEYS = Object.freeze([
  'calloutBoxes',
  'analysisBoxes',
  'bodyBoxes',
  'columnBoxes',
]);

const OBJECT_KEYS = Object.freeze([
  'typography',
  'footerChrome',
]);

const GEOMETRY_KIND_HANDLERS = Object.freeze({
  box: 'box',
  boxArray: 'boxArray',
  boxTree: 'boxTree',
  number: 'number',
  string: 'string',
  object: 'object',
});

const LEGACY_GEOMETRY_KINDS = Object.freeze({
  ...Object.fromEntries(BOX_KEYS.map((key) => [key, 'box'])),
  ...Object.fromEntries(ARRAY_BOX_KEYS.map((key) => [key, 'boxArray'])),
  ...Object.fromEntries(OBJECT_KEYS.map((key) => [key, 'object'])),
});

const SUPPORTED_GEOMETRY_KINDS = Object.freeze(Object.keys(GEOMETRY_KIND_HANDLERS));

function isFiniteNum(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map((item) => cloneValue(item));
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    out[key] = cloneValue(child);
  }
  return out;
}

export function isBoxLike(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      isFiniteNum(value.x) &&
      isFiniteNum(value.y) &&
      isFiniteNum(value.w) &&
      isFiniteNum(value.h),
  );
}

export function requireGeometryBox(box, { slideType = 'unknown', key = 'box' } = {}) {
  if (isBoxLike(box)) return box;
  throw new Error(`Missing required geometry "${key}" for slide type "${slideType}"`);
}

function hasAnyBoxLike(value) {
  if (isBoxLike(value)) return true;
  if (Array.isArray(value)) return value.some((entry) => hasAnyBoxLike(entry));
  if (!isPlainObject(value)) return false;
  return Object.values(value).some((entry) => hasAnyBoxLike(entry));
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object') return value;
  if (Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return value;
}

function normalizeGeometryKinds(geometryKinds = null) {
  const source = geometryKinds && typeof geometryKinds === 'object' ? geometryKinds : LEGACY_GEOMETRY_KINDS;
  const out = {};
  for (const [key, kind] of Object.entries(source)) {
    if (typeof key !== 'string' || !key) continue;
    if (typeof kind !== 'string' || !SUPPORTED_GEOMETRY_KINDS.includes(kind)) {
      throw new Error(`Unsupported geometry kind "${kind}" for key "${key}"`);
    }
    out[key] = kind;
  }
  return out;
}

function hasRequiredGeometryValue(canonical, key, geometryKinds) {
  const value = canonical?.[key];
  const kind = geometryKinds[key];
  if (!kind) return value !== undefined && value !== null;
  if (kind === 'box') return isBoxLike(value);
  if (kind === 'boxArray') {
    return Array.isArray(value) && value.length > 0 && value.every((entry) => isBoxLike(entry));
  }
  if (kind === 'boxTree') {
    return (Array.isArray(value) || isPlainObject(value) || isBoxLike(value)) && hasAnyBoxLike(value);
  }
  if (kind === 'number') return isFiniteNum(value);
  if (kind === 'string') return typeof value === 'string';
  if (kind === 'object') return isPlainObject(value);
  return value !== undefined && value !== null;
}

function validateNestedBoxTree(value, context, args) {
  if (Array.isArray(value)) {
    value.forEach((entry, idx) => validateNestedBoxTree(entry, `${context}[${idx}]`, args));
    return;
  }
  if (!isPlainObject(value)) {
    throw new Error(`${context}: expected box tree`);
  }
  if (isBoxLike(value)) {
    validateBox(value, {
      ...args,
      context,
    });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    validateNestedBoxTree(child, `${context}.${key}`, args);
  }
}

function validateLooseObjectGeometry(value, context, args) {
  if (Array.isArray(value)) {
    value.forEach((entry, idx) => validateLooseObjectGeometry(entry, `${context}[${idx}]`, args));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (isBoxLike(value)) {
    validateBox(value, {
      ...args,
      context,
    });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    validateLooseObjectGeometry(child, `${context}.${key}`, args);
  }
}

function validateGeometryValue(value, kind, { context, slideW, slideH, footerSafeTop }) {
  if (kind === 'box') {
    validateBox(value, { slideW, slideH, footerSafeTop, context });
    return;
  }

  if (kind === 'boxArray') {
    if (!Array.isArray(value)) throw new Error(`${context}: expected array of boxes`);
    value.forEach((entry, idx) => {
      validateBox(entry, { slideW, slideH, footerSafeTop, context: `${context}[${idx}]` });
    });
    return;
  }

  if (kind === 'boxTree') {
    validateNestedBoxTree(value, context, { slideW, slideH, footerSafeTop });
    return;
  }

  if (kind === 'number') {
    if (!isFiniteNum(value)) throw new Error(`${context}: expected number`);
    return;
  }

  if (kind === 'string') {
    if (typeof value !== 'string') throw new Error(`${context}: expected string`);
    return;
  }

  if (kind === 'object') {
    if (!isPlainObject(value)) throw new Error(`${context}: expected object`);
    validateLooseObjectGeometry(value, context, { slideW, slideH, footerSafeTop });
    return;
  }

  throw new Error(`${context}: unsupported geometry kind "${kind}"`);
}

/**
 * Validate a single geometry box.
 */
export function validateBox(box, { slideW, slideH, footerSafeTop = null, context = '' } = {}) {
  if (!box || typeof box !== 'object') throw new Error(`${context}: missing box`);
  const { x, y, w, h } = box;
  if (![x, y, w, h].every(isFiniteNum)) throw new Error(`${context}: non-numeric box`);
  if (w <= 0 || h <= 0) throw new Error(`${context}: non-positive box w/h`);
  if (x < 0 || y < 0) throw new Error(`${context}: negative x/y`);
  if (Number.isFinite(slideW) && x + w > slideW + 1e-6) {
    throw new Error(`${context}: box exceeds slide width`);
  }
  if (Number.isFinite(slideH) && y + h > slideH + 1e-6) {
    throw new Error(`${context}: box exceeds slide height`);
  }
  if (Number.isFinite(footerSafeTop) && y + h > footerSafeTop + 1e-6) {
    throw new Error(`${context}: box overlaps footer-safe zone (safeTop=${footerSafeTop})`);
  }
}

/**
 * Keep only strict canonical geometry keys. Unknown keys are fatal.
 */
export function normalizeExtractedGeometry(rawGeometry = {}, { type = '', geometryKinds = null } = {}) {
  if (!rawGeometry || typeof rawGeometry !== 'object' || Array.isArray(rawGeometry)) {
    throw new Error(`geometry.${type}: invalid geometry object`);
  }

  const resolvedGeometryKinds = normalizeGeometryKinds(geometryKinds);
  const out = {};
  const unknownKeys = [];

  for (const [key, value] of Object.entries(rawGeometry)) {
    if (value === undefined || value === null) continue;
    if (!Object.prototype.hasOwnProperty.call(resolvedGeometryKinds, key)) {
      unknownKeys.push(key);
      continue;
    }
    out[key] = cloneValue(value);
  }

  if (unknownKeys.length > 0) {
    throw new Error(`geometry.${type}: unknown key(s): ${unknownKeys.join(', ')}`);
  }

  return out;
}

/**
 * Validate canonical geometry and required key contract.
 */
export function validateCanonicalGeometry(
  canonical,
  {
    slideW,
    slideH,
    requiredKeys = [],
    optionalDefaults = {},
    geometryKinds = null,
    type = '',
    masterName = '',
    footerSafeTop = null,
  } = {},
) {
  const resolvedGeometryKinds = normalizeGeometryKinds(geometryKinds);
  const out = { ...(canonical || {}) };

  for (const [key, value] of Object.entries(optionalDefaults || {})) {
    if (out[key] === undefined) out[key] = cloneValue(value);
  }

  for (const key of requiredKeys) {
    if (!hasRequiredGeometryValue(out, key, resolvedGeometryKinds)) {
      throw new Error(`geometry.${type}: missing required key "${key}" (master=${masterName || 'unknown'})`);
    }
  }

  for (const [key, value] of Object.entries(out)) {
    const context = `geometry.${type}.${key}`;
    const kind = resolvedGeometryKinds[key];
    if (!kind) throw new Error(`geometry.${type}: unsupported key "${key}"`);
    validateGeometryValue(value, kind, { context, slideW, slideH, footerSafeTop });
  }

  return deepFreeze(out);
}

export const canonicalGeometryShape = Object.freeze({
  boxKeys: BOX_KEYS,
  arrayBoxKeys: ARRAY_BOX_KEYS,
  objectKeys: OBJECT_KEYS,
  legacyGeometryKinds: LEGACY_GEOMETRY_KINDS,
  supportedKinds: SUPPORTED_GEOMETRY_KINDS,
});

export function deriveLegacyGeometryKinds(keys = []) {
  const out = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(LEGACY_GEOMETRY_KINDS, key)) {
      out[key] = LEGACY_GEOMETRY_KINDS[key];
    }
  }
  return out;
}

export { LEGACY_GEOMETRY_KINDS, SUPPORTED_GEOMETRY_KINDS };
