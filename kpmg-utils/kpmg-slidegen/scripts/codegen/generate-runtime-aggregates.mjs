import path from 'node:path';

import {
  BUILTIN_TYPE_SET,
  GENERATED_FILE_HEADER,
  GENERATED_LAYOUTS_PATH,
  GENERATED_ONBOARDED_INDEX_PATH,
  GENERATED_ONBOARDED_MODULE_PATH,
  makeGeneratedJsHeader,
  makeJsonContent,
  primitiveVersionRef,
  readJson,
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

function mapBy(items, keyFn) {
  return Object.fromEntries(items.map((item) => [keyFn(item), item]));
}

function validateSources(layouts, primitivesByRef) {
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

function buildLayoutsAggregate(layouts) {
  const currentLayouts = readJson(GENERATED_LAYOUTS_PATH);
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
    ...Object.fromEntries(
      Object.entries(currentLayouts || {}).filter(([key]) => key !== 'types' && key !== 'generatedAt'),
    ),
    generatedFileHeader: GENERATED_FILE_HEADER,
    types,
  };
}

function buildRegistryEntries(layouts, primitivesByRef) {
  const entries = [];
  for (const layout of layouts.slice().sort((left, right) => left.type.localeCompare(right.type))) {
    if (BUILTIN_TYPE_SET.has(layout.type)) continue;
    const primitive = primitivesByRef[layout.primitive];
    const builderFile = path.basename(primitive.builderModule).replace(/\.(mjs|js)$/, '');
    const exportName = primitive.builderExport || `build${toPascalCase(layout.type)}`;
    entries.push({
      type: layout.type,
      builderFile,
      exportName,
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

function buildOnboardedIndex(entries) {
  return {
    generatedFileHeader: GENERATED_FILE_HEADER,
    schemaVersion: 2,
    entries,
  };
}

function buildOnboardedModule(entries) {
  if (entries.length === 0) {
    return `${makeGeneratedJsHeader()}export const ONBOARDED_REGISTRY_ENTRIES = Object.freeze({});\n`;
  }
  const importLines = entries.map((entry) => {
    const modulePath = `../builders/onboarded/${entry.builderFile}.js`;
    return `import { ${entry.exportName} } from '${modulePath}';`;
  });
  const bodyLines = entries.map((entry) => {
    const literal = JSON.stringify(entry.registryEntry, null, 2)
      .replace(/"__BUILDER_REF__"/g, entry.exportName)
      .split('\n')
      .join('\n  ');
    return `  ${entry.type}: Object.freeze(${literal}),`;
  });
  return `${makeGeneratedJsHeader()}${importLines.join('\n')}\n\nexport const ONBOARDED_REGISTRY_ENTRIES = Object.freeze({\n${bodyLines.join('\n')}\n});\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const layouts = readSourceLayouts();
  const primitives = readSourcePrimitives();
  const primitivesByRef = mapBy(primitives, primitiveVersionRef);
  validateSources(layouts, primitivesByRef);

  const layoutsAggregate = buildLayoutsAggregate(layouts);
  const registryEntries = buildRegistryEntries(layouts, primitivesByRef);
  const onboardedIndex = buildOnboardedIndex(registryEntries);
  const onboardedModule = buildOnboardedModule(registryEntries);

  writeFileIfChanged(GENERATED_LAYOUTS_PATH, makeJsonContent(layoutsAggregate), args);
  writeFileIfChanged(GENERATED_ONBOARDED_INDEX_PATH, makeJsonContent(onboardedIndex), args);
  writeFileIfChanged(GENERATED_ONBOARDED_MODULE_PATH, onboardedModule, args);

  console.log(args.check ? 'Generated outputs are up to date.' : 'Regenerated runtime aggregates.');
}

main();
