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

const BOX_KEY_SET = new Set(BOX_KEYS);
const ARRAY_BOX_KEY_SET = new Set(ARRAY_BOX_KEYS);
const OBJECT_KEY_SET = new Set(OBJECT_KEYS);
const ALLOWED_KEY_SET = new Set([...BOX_KEYS, ...ARRAY_BOX_KEYS, ...OBJECT_KEYS]);

function isFiniteNum(value) {
  return typeof value === 'number' && Number.isFinite(value);
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

function deepFreeze(value) {
  if (!value || typeof value !== 'object') return value;
  if (Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return value;
}

function hasRequiredGeometryValue(canonical, key) {
  const value = canonical?.[key];
  if (BOX_KEY_SET.has(key)) return isBoxLike(value);
  if (ARRAY_BOX_KEY_SET.has(key)) {
    return Array.isArray(value) && value.length > 0 && value.every((entry) => isBoxLike(entry));
  }
  return value !== undefined && value !== null;
}

function validateNestedBoxTree(value, context, args) {
  if (Array.isArray(value)) {
    value.forEach((entry, idx) => validateNestedBoxTree(entry, `${context}[${idx}]`, args));
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
    validateNestedBoxTree(child, `${context}.${key}`, args);
  }
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
export function normalizeExtractedGeometry(rawGeometry = {}, { type = '' } = {}) {
  if (!rawGeometry || typeof rawGeometry !== 'object' || Array.isArray(rawGeometry)) {
    throw new Error(`geometry.${type}: invalid geometry object`);
  }

  const out = {};
  const unknownKeys = [];

  for (const [key, value] of Object.entries(rawGeometry)) {
    if (value === undefined || value === null) continue;
    if (!ALLOWED_KEY_SET.has(key)) {
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
    type = '',
    masterName = '',
    footerSafeTop = null,
  } = {},
) {
  const out = { ...(canonical || {}) };

  for (const [key, value] of Object.entries(optionalDefaults || {})) {
    if (out[key] === undefined) out[key] = cloneValue(value);
  }

  for (const key of requiredKeys) {
    if (!hasRequiredGeometryValue(out, key)) {
      throw new Error(`geometry.${type}: missing required key "${key}" (master=${masterName || 'unknown'})`);
    }
  }

  for (const [key, value] of Object.entries(out)) {
    const context = `geometry.${type}.${key}`;

    if (BOX_KEY_SET.has(key)) {
      validateBox(value, { slideW, slideH, footerSafeTop, context });
      continue;
    }

    if (ARRAY_BOX_KEY_SET.has(key)) {
      if (!Array.isArray(value)) throw new Error(`${context}: expected array of boxes`);
      value.forEach((entry, idx) => {
        validateBox(entry, { slideW, slideH, footerSafeTop, context: `${context}[${idx}]` });
      });
      continue;
    }

    if (OBJECT_KEY_SET.has(key)) {
      validateNestedBoxTree(value, context, { slideW, slideH, footerSafeTop });
      continue;
    }

    throw new Error(`geometry.${type}: unsupported key "${key}"`);
  }

  return deepFreeze(out);
}

export const canonicalGeometryShape = Object.freeze({
  boxKeys: BOX_KEYS,
  arrayBoxKeys: ARRAY_BOX_KEYS,
  objectKeys: OBJECT_KEYS,
});
