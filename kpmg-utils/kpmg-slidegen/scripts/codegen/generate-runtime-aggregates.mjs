import path from 'node:path';

import { REPO_ROOT } from '../support.mjs';
import {
  GENERATED_FILE_HEADER,
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  makeGeneratedJsHeader,
  makeJsonContent,
  primitiveVersionRef,
  readSourceLayoutPackageMeta,
  readSourceLayouts,
  readSourcePrimitives,
  toPascalCase,
  writeFileIfChanged,
} from './lib.mjs';

function parseArgs(argv) {
  return {
    check: argv.includes('--check'),
  };
}

const JS_RESERVED_WORDS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

/**
 * Index items by a derived key.
 *
 * @param {any[]} items
 * @param {(item: any) => string} keyFn
 * @returns {Record<string, any>}
 */
export function mapBy(items, keyFn) {
  return Object.fromEntries(items.map((item) => [keyFn(item), item]));
}

/**
 * Validate that layout fragments only reference known primitives.
 *
 * @param {object[]} layouts
 * @param {Record<string, object>} primitivesByRef
 * @returns {void}
 */
export function validateSources(layouts, primitivesByRef) {
  for (const layout of layouts) {
    if (!layout.type) {
      throw new Error('Layout fragment missing "type"');
    }
    const primitive = primitivesByRef[layout.primitive];
    if (!primitive) {
      throw new Error(`Layout ${layout.type} references unknown primitive ${layout.primitive}`);
    }
  }
}

/**
 * Validate that the generated authored registry covers every authored layout type.
 *
 * @param {object[]} layouts
 * @param {object[]} entries
 * @returns {void}
 */
export function validateRegistryEntries(layouts, entries) {
  const layoutTypes = layouts.map((layout) => layout.type).sort();
  const entryTypes = entries.map((entry) => entry.type).sort();
  const missingTypes = layoutTypes.filter((type) => !entryTypes.includes(type));
  const extraTypes = entryTypes.filter((type) => !layoutTypes.includes(type));
  if (missingTypes.length > 0 || extraTypes.length > 0) {
    const parts = [];
    if (missingTypes.length > 0) parts.push(`missing generated entries: ${missingTypes.join(', ')}`);
    if (extraTypes.length > 0) parts.push(`unexpected generated entries: ${extraTypes.join(', ')}`);
    throw new Error(`Authored runtime registry coverage mismatch. ${parts.join(' | ')}`);
  }
}

/**
 * Build the runtime layout aggregate from source fragments.
 *
 * @param {object[]} layouts
 * @param {object} packageMeta
 * @returns {object}
 */
export function buildLayoutsAggregate(layouts, packageMeta = {}) {
  const types = {};
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    types[layout.type] = {
      description: layout.description,
      geometry: layout.geometry || {},
      slots: layout.slots || {},
      templateLayout: layout.templateLayout,
      ...(layout.densityTarget ? { densityTarget: layout.densityTarget } : {}),
    };
  }
  return {
    ...packageMeta,
    generatedFileHeader: GENERATED_FILE_HEADER,
    types,
  };
}

function buildImportKey({ builderModule, builderExport }) {
  return `${builderModule}::${builderExport}`;
}

function normalizeImportPath(specifier) {
  const posixSpecifier = specifier.split(path.sep).join('/');
  if (posixSpecifier.startsWith('.')) return posixSpecifier;
  return `./${posixSpecifier}`;
}

function toSafeIdentifier(value, fallback = 'builder') {
  const collapsed = String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9_$]+/g, '_')
    .replace(/^([^A-Za-z_$])/, '_$1');
  const safe = collapsed.length > 0 ? collapsed : fallback;
  if (JS_RESERVED_WORDS.has(safe)) {
    return `${fallback}_${safe}`;
  }
  return safe;
}

/**
 * Resolve a repo-relative builder module to an import specifier that is correct
 * from the generated runtime registry module.
 *
 * @param {string} builderModule
 * @param {string} runtimeModulePath
 * @returns {string}
 */
export function resolveRuntimeImportPath(
  builderModule,
  runtimeModulePath = GENERATED_ONBOARDED_MODULE_PATH,
) {
  const runtimeDir = path.dirname(runtimeModulePath);
  const absoluteBuilderPath = path.isAbsolute(builderModule)
    ? builderModule
    : path.join(REPO_ROOT, builderModule);
  return normalizeImportPath(path.relative(runtimeDir, absoluteBuilderPath));
}

function assignImportBindings(entries) {
  const uniqueImports = [];
  const importByKey = new Map();
  for (const entry of entries) {
    const key = buildImportKey(entry);
    if (!importByKey.has(key)) {
      const importRecord = {
        builderModule: entry.builderModule,
        builderExport: entry.builderExport,
      };
      importByKey.set(key, importRecord);
      uniqueImports.push(importRecord);
    }
  }

  uniqueImports.sort(
    (left, right) =>
      left.builderModule.localeCompare(right.builderModule) ||
      left.builderExport.localeCompare(right.builderExport),
  );

  const usedBindings = new Set();
  for (const importRecord of uniqueImports) {
    const baseName = toSafeIdentifier(importRecord.builderExport, 'builder');
    const moduleStem = toSafeIdentifier(
      path.basename(importRecord.builderModule, path.extname(importRecord.builderModule)),
      'module',
    );
    let localBinding = baseName;
    if (usedBindings.has(localBinding)) {
      localBinding = `${baseName}__${moduleStem}`;
    }
    let counter = 2;
    while (usedBindings.has(localBinding)) {
      localBinding = `${baseName}__${counter}`;
      counter += 1;
    }
    usedBindings.add(localBinding);
    importRecord.localBinding = localBinding;
    importRecord.modulePath = resolveRuntimeImportPath(importRecord.builderModule);
  }

  return { importByKey, uniqueImports };
}

function formatImportLine(importRecord) {
  if (importRecord.builderExport === 'default') {
    return `import ${importRecord.localBinding} from '${importRecord.modulePath}';`;
  }
  if (importRecord.localBinding === importRecord.builderExport) {
    return `import { ${importRecord.builderExport} } from '${importRecord.modulePath}';`;
  }
  return `import { ${importRecord.builderExport} as ${importRecord.localBinding} } from '${importRecord.modulePath}';`;
}

/**
 * Build onboarded runtime registry entries from layout and primitive fragments.
 *
 * @param {object[]} layouts
 * @param {Record<string, object>} primitivesByRef
 * @returns {object[]}
 */
export function buildRegistryEntries(layouts, primitivesByRef) {
  const entries = [];
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    const primitive = primitivesByRef[layout.primitive];
    const builderModule = primitive.builderModule;
    const builderExport = primitive.builderExport || `build${toPascalCase(layout.type)}`;
    entries.push({
      type: layout.type,
      builderModule,
      builderExport,
      registryEntry: {
        builderId: layout.type,
        builder: '__BUILDER_REF__',
        master: layout.masterOverride || primitive.master,
        requiredGeometry: [...(primitive.requiredGeometry || [])],
        optionalGeometry: [...(primitive.optionalGeometry || [])],
        optionalDefaults: { ...(primitive.optionalDefaults || {}) },
        geometryKinds: { ...(primitive.geometryKinds || {}) },
        primitiveMetadata: {
          id: primitive.id,
          version: primitive.version,
          slotSchemaRef: primitive.slotSchemaRef || primitive.id,
          geometryKinds: { ...(primitive.geometryKinds || {}) },
        },
        paginationPolicyKey: primitive.paginationPolicyKey,
        validationHooks: [...(primitive.validationHooks || [])],
        excludeFromLogicalPaging: Boolean(primitive.excludeFromLogicalPaging),
      },
    });
  }
  return entries;
}

/**
 * Build the verification-friendly index for the generated onboarded registry.
 *
 * @param {object[]} entries
 * @returns {object}
 */
export function buildOnboardedIndex(entries) {
  return {
    generatedFileHeader: GENERATED_FILE_HEADER,
    schemaVersion: 4,
    entries,
  };
}

/**
 * Build the generated onboarded runtime registry module.
 *
 * @param {object[]} entries
 * @returns {string}
 */
export function buildOnboardedModule(entries) {
  if (entries.length === 0) {
    return `${makeGeneratedJsHeader()}export const AUTHORED_REGISTRY_ENTRIES = Object.freeze({});\n`;
  }
  const { importByKey, uniqueImports } = assignImportBindings(entries);
  const importLines = uniqueImports.map((importRecord) => formatImportLine(importRecord));
  const bodyLines = entries.map((entry) => {
    const importRecord = importByKey.get(buildImportKey(entry));
    const literal = JSON.stringify(entry.registryEntry, null, 2)
      .replace(/"__BUILDER_REF__"/g, importRecord.localBinding)
      .split('\n')
      .join('\n  ');
    return `  ${entry.type}: Object.freeze(${literal}),`;
  });
  return `${makeGeneratedJsHeader()}${importLines.join('\n')}\n\nexport const AUTHORED_REGISTRY_ENTRIES = Object.freeze({\n${bodyLines.join('\n')}\n});\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const layouts = readSourceLayouts();
  const primitives = readSourcePrimitives();
  const layoutPackageMeta = readSourceLayoutPackageMeta();
  const primitivesByRef = mapBy(primitives, primitiveVersionRef);
  validateSources(layouts, primitivesByRef);

  const layoutsAggregate = buildLayoutsAggregate(layouts, layoutPackageMeta);
  const registryEntries = buildRegistryEntries(layouts, primitivesByRef);
  validateRegistryEntries(layouts, registryEntries);
  const onboardedIndex = buildOnboardedIndex(registryEntries);
  const onboardedModule = buildOnboardedModule(registryEntries);

  writeFileIfChanged(GENERATED_LAYOUTS_PATH, makeJsonContent(layoutsAggregate), args);
  writeFileIfChanged(GENERATED_ONBOARDED_INDEX_PATH, makeJsonContent(onboardedIndex), args);
  writeFileIfChanged(GENERATED_ONBOARDED_MODULE_PATH, onboardedModule, args);

  console.log(args.check ? 'Generated outputs are up to date.' : 'Regenerated runtime aggregates.');
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
