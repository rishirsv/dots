import path from 'node:path';

import { loadTemplatePackage } from '../../generator/runtime/template-package.js';
import {
  GENERATED_ONBOARDED_INDEX_PATH,
  LAYOUT_SRC_ROOT,
  PRIMITIVE_SRC_ROOT,
  listJsonFiles,
  makeJsonContent,
  primitiveVersionRef,
  readJson,
  writeFileIfChanged,
} from './lib.mjs';

function derivePrimitiveFromIndex(entry) {
  const primitiveMetadata = entry?.registryEntry?.primitiveMetadata || {};
  return {
    id: primitiveMetadata.id,
    version: primitiveMetadata.version,
    builderModule: entry.builderModule,
    builderExport: entry.builderExport,
    geometryKinds: entry.registryEntry?.geometryKinds || primitiveMetadata.geometryKinds || {},
    requiredGeometry: [...(entry.registryEntry?.requiredGeometry || [])],
    optionalGeometry: [...(entry.registryEntry?.optionalGeometry || [])],
    optionalDefaults: { ...(entry.registryEntry?.optionalDefaults || {}) },
    paginationPolicyKey: entry.registryEntry?.paginationPolicyKey,
    master: entry.registryEntry?.master,
    slotSchemaRef: primitiveMetadata.slotSchemaRef || primitiveMetadata.id,
    validationHooks: [...(entry.registryEntry?.validationHooks || [])],
    excludeFromLogicalPaging: Boolean(entry.registryEntry?.excludeFromLogicalPaging),
  };
}

function deriveLayoutFragment(type, layout, primitive) {
  return {
    type,
    primitive: primitiveVersionRef(primitive),
    description: layout.description || type,
    templateLayout: layout.templateLayout || type,
    geometry: layout.geometry || {},
    slots: layout.slots || {},
    densityTarget: layout.densityTarget || null,
  };
}

function main() {
  const hasExistingLayoutFragments = listJsonFiles(LAYOUT_SRC_ROOT).length > 0;
  const hasExistingPrimitiveFragments = listJsonFiles(PRIMITIVE_SRC_ROOT).length > 0;
  if (hasExistingLayoutFragments || hasExistingPrimitiveFragments) {
    console.log('Bootstrap skipped: authoring fragments already exist.');
    return;
  }

  const templatePackage = loadTemplatePackage('kpmg-diligence');
  const authoredRegistryIndex = readJson(GENERATED_ONBOARDED_INDEX_PATH);
  const layoutsByType = templatePackage.layouts?.types || {};
  const entriesByType = Object.fromEntries(
    (authoredRegistryIndex.entries || []).map((entry) => [entry.type, entry]),
  );
  const primitivesByRef = new Map();

  for (const type of Object.keys(layoutsByType).sort()) {
    const entry = entriesByType[type];
    if (!entry) {
      throw new Error(`Missing generated authored registry entry for layout type ${type}`);
    }
    const primitive = derivePrimitiveFromIndex(entry);
    const layoutFragment = deriveLayoutFragment(type, layoutsByType[type], primitive);
    primitivesByRef.set(primitiveVersionRef(primitive), primitive);
    writeFileIfChanged(
      path.join(LAYOUT_SRC_ROOT, `${type}.json`),
      makeJsonContent(layoutFragment),
    );
  }

  for (const primitive of Array.from(primitivesByRef.values()).sort((left, right) => left.id.localeCompare(right.id))) {
    writeFileIfChanged(
      path.join(PRIMITIVE_SRC_ROOT, `${primitive.id}.json`),
      makeJsonContent(primitive),
    );
  }

  console.log('Bootstrapped templates-src authoring fragments from generated runtime aggregates. After bootstrap, templates-src fragments are authoritative.');
}

main();
