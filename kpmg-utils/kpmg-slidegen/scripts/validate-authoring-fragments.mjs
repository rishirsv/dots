import path from 'node:path';

import Ajv2020 from 'ajv/dist/2020.js';

import {
  normalizeExtractedGeometry,
  SUPPORTED_GEOMETRY_KINDS,
  validateCanonicalGeometry,
} from '../generator/runtime/geometry-contract.js';
import { buildFooterSafeTopByMaster } from '../generator/runtime/template-contracts.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';
import { REPO_ROOT } from './support.mjs';
import {
  LAYOUT_SRC_ROOT,
  PRIMITIVE_SRC_ROOT,
  listJsonFiles,
  primitiveVersionRef,
  readJson,
} from './codegen/lib.mjs';

const PRIMITIVE_SCHEMA_PATH = path.join(PRIMITIVE_SRC_ROOT, 'primitive.schema.json');
const LAYOUT_SCHEMA_PATH = path.join(LAYOUT_SRC_ROOT, 'layout-instance.schema.json');

/**
 * Parse CLI arguments for authoring validation.
 *
 * @param {string[]} argv
 * @returns {{ primitiveDir: string, layoutDir: string }}
 */
function parseArgs(argv) {
  const out = {
    primitiveDir: PRIMITIVE_SRC_ROOT,
    layoutDir: LAYOUT_SRC_ROOT,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--primitive-dir') {
      out.primitiveDir = path.resolve(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (arg === '--layout-dir') {
      out.layoutDir = path.resolve(argv[index + 1] || '');
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return out;
}

/**
 * Convert an absolute path to a repo-relative display path when possible.
 *
 * @param {string} filePath
 * @returns {string}
 */
function displayPath(filePath) {
  if (!filePath) return '(unknown path)';
  const relative = path.relative(REPO_ROOT, filePath);
  return relative && !relative.startsWith('..') ? relative : filePath;
}

/**
 * Format Ajv validation errors into a readable single string.
 *
 * @param {import('ajv').ErrorObject[] | null | undefined} errors
 * @returns {string}
 */
function formatAjvErrors(errors = []) {
  return (errors || []).map((error) => {
    const where = error.instancePath || '/';
    if (error.keyword === 'additionalProperties') {
      return `${where}: unexpected property "${error.params.additionalProperty}"`;
    }
    if (error.keyword === 'required') {
      return `${where}: missing required property "${error.params.missingProperty}"`;
    }
    return `${where}: ${error.message || 'schema validation failed'}`;
  }).join('; ');
}

/**
 * Create compiled validators for authoring schemas.
 *
 * @returns {{ validatePrimitive: import('ajv').ValidateFunction, validateLayout: import('ajv').ValidateFunction }}
 */
function createValidators() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });
  const primitiveSchema = readJson(PRIMITIVE_SCHEMA_PATH);
  const layoutSchema = readJson(LAYOUT_SCHEMA_PATH);
  return {
    validatePrimitive: ajv.compile(primitiveSchema),
    validateLayout: ajv.compile(layoutSchema),
  };
}

/**
 * Validate cross-field primitive geometry metadata.
 *
 * @param {object} primitive
 * @param {string} filePath
 * @returns {void}
 */
function validatePrimitiveSemantics(primitive, filePath) {
  const geometryKinds = primitive?.geometryKinds || {};
  const requiredGeometry = Array.isArray(primitive?.requiredGeometry) ? primitive.requiredGeometry : [];
  const optionalGeometry = Array.isArray(primitive?.optionalGeometry) ? primitive.optionalGeometry : [];
  const optionalDefaults = primitive?.optionalDefaults || {};
  const declaredKeys = new Set(Object.keys(geometryKinds));
  const requiredSet = new Set(requiredGeometry);

  for (const [key, kind] of Object.entries(geometryKinds)) {
    if (!SUPPORTED_GEOMETRY_KINDS.includes(kind)) {
      throw new Error(`${displayPath(filePath)}: geometryKinds.${key} uses unsupported kind "${kind}"`);
    }
  }

  for (const key of requiredGeometry) {
    if (!declaredKeys.has(key)) {
      throw new Error(`${displayPath(filePath)}: requiredGeometry references "${key}" but geometryKinds does not declare it`);
    }
  }

  for (const key of optionalGeometry) {
    if (!declaredKeys.has(key)) {
      throw new Error(`${displayPath(filePath)}: optionalGeometry references "${key}" but geometryKinds does not declare it`);
    }
    if (requiredSet.has(key)) {
      throw new Error(`${displayPath(filePath)}: geometry key "${key}" cannot be both required and optional`);
    }
  }

  for (const key of Object.keys(optionalDefaults)) {
    if (!declaredKeys.has(key)) {
      throw new Error(`${displayPath(filePath)}: optionalDefaults references "${key}" but geometryKinds does not declare it`);
    }
  }
}

/**
 * Validate one JSON file against a compiled Ajv validator.
 *
 * @param {string} filePath
 * @param {import('ajv').ValidateFunction} validator
 * @returns {any}
 */
function validateJsonFile(filePath, validator) {
  const value = readJson(filePath);
  const valid = validator(value);
  if (!valid) {
    throw new Error(`${displayPath(filePath)}: ${formatAjvErrors(validator.errors)}`);
  }
  return value;
}

/**
 * Validate layout geometry and primitive linkage with runtime-aligned checks.
 *
 * @param {object} layout
 * @param {string} filePath
 * @param {Map<string, object>} primitivesByRef
 * @param {{ slideW: number, slideH: number, footerSafeTopByMaster: Record<string, number | null> }} runtimeContext
 * @returns {void}
 */
function validateLayoutSemantics(layout, filePath, primitivesByRef, runtimeContext) {
  const primitive = primitivesByRef.get(layout.primitive);
  if (!primitive) {
    throw new Error(`${displayPath(filePath)}: references unknown primitive "${layout.primitive}"`);
  }

  const masterName = String(layout.masterOverride || primitive.master || '').trim();
  if (!masterName) {
    throw new Error(`${displayPath(filePath)}: cannot resolve master for primitive "${layout.primitive}"`);
  }

  const footerSafeTop = Object.prototype.hasOwnProperty.call(runtimeContext.footerSafeTopByMaster, masterName)
    ? runtimeContext.footerSafeTopByMaster[masterName]
    : null;

  const canonical = normalizeExtractedGeometry(layout.geometry || {}, {
    type: layout.type,
    geometryKinds: primitive.geometryKinds || {},
  });

  validateCanonicalGeometry(canonical, {
    slideW: runtimeContext.slideW,
    slideH: runtimeContext.slideH,
    requiredKeys: primitive.requiredGeometry || [],
    optionalDefaults: primitive.optionalDefaults || {},
    geometryKinds: primitive.geometryKinds || {},
    type: layout.type,
    masterName,
    footerSafeTop,
  });
}

/**
 * Validate primitive and layout authoring fragments against schemas plus runtime-linked semantics.
 *
 * @param {{ primitiveDir?: string, layoutDir?: string }} options
 * @returns {{ primitiveCount: number, layoutCount: number }}
 */
export function validateAuthoringFragments({
  primitiveDir = PRIMITIVE_SRC_ROOT,
  layoutDir = LAYOUT_SRC_ROOT,
} = {}) {
  const { validatePrimitive, validateLayout } = createValidators();
  const templatePackage = loadTemplatePackage('kpmg-diligence');
  const dims = templatePackage?.tokens?.dimensions || {};
  const slideW = Number(dims.w);
  const slideH = Number(dims.h);
  if (!Number.isFinite(slideW) || !Number.isFinite(slideH)) {
    throw new Error('templates/kpmg-diligence/package/tokens.json is missing valid slide dimensions');
  }

  const runtimeContext = {
    slideW,
    slideH,
    footerSafeTopByMaster: buildFooterSafeTopByMaster(templatePackage),
  };

  const primitiveFiles = listJsonFiles(primitiveDir);
  const layoutFiles = listJsonFiles(layoutDir);
  const primitivesByRef = new Map();

  for (const filePath of primitiveFiles) {
    const primitive = validateJsonFile(filePath, validatePrimitive);
    validatePrimitiveSemantics(primitive, filePath);
    const ref = primitiveVersionRef(primitive);
    if (primitivesByRef.has(ref)) {
      throw new Error(`${displayPath(filePath)}: duplicate primitive reference "${ref}"`);
    }
    primitivesByRef.set(ref, primitive);
  }

  for (const filePath of layoutFiles) {
    const layout = validateJsonFile(filePath, validateLayout);
    validateLayoutSemantics(layout, filePath, primitivesByRef, runtimeContext);
  }

  return {
    primitiveCount: primitiveFiles.length,
    layoutCount: layoutFiles.length,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = validateAuthoringFragments(args);
    console.log(`Authoring schema validation passed (${result.primitiveCount} primitives, ${result.layoutCount} layouts).`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
