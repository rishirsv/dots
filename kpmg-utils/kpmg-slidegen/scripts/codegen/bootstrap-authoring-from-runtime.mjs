import path from 'node:path';

import { getSlideRegistry } from '../../generator/runtime/slide-registry.js';
import { loadTemplatePackage } from '../../generator/runtime/template-package.js';
import {
  BUILTIN_BUILDER_MAP,
  LAYOUT_SRC_ROOT,
  PRIMITIVE_SRC_ROOT,
  listJsonFiles,
  makeJsonContent,
  primitiveVersionRef,
  writeFileIfChanged,
} from './lib.mjs';

function derivePrimitiveFromRegistry(type, entry) {
  const builderMeta = BUILTIN_BUILDER_MAP[type];
  if (!builderMeta) {
    throw new Error(`Missing builtin builder metadata for ${type}`);
  }
  return {
    id: type,
    version: 1,
    builderModule: builderMeta.builderModule,
    builderExport: builderMeta.builderExport,
    geometryKinds: entry.geometryKinds || {},
    requiredGeometry: [...(entry.requiredGeometry || [])],
    optionalGeometry: [...(entry.optionalGeometry || [])],
    optionalDefaults: { ...(entry.optionalDefaults || {}) },
    paginationPolicyKey: entry.paginationPolicyKey,
    master: entry.master,
    slotSchemaRef: type,
    validationHooks: [...(entry.validationHooks || [])],
    excludeFromLogicalPaging: Boolean(entry.excludeFromLogicalPaging),
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
  const registry = getSlideRegistry();
  const layoutsByType = templatePackage.layouts?.types || {};

  for (const type of Object.keys(layoutsByType).sort()) {
    const entry = registry.get(type);
    if (!entry) {
      throw new Error(`Missing registry entry for layout type ${type}`);
    }
    const primitive = derivePrimitiveFromRegistry(type, entry);
    const layoutFragment = deriveLayoutFragment(type, layoutsByType[type], primitive);
    writeFileIfChanged(
      path.join(PRIMITIVE_SRC_ROOT, `${primitive.id}.json`),
      makeJsonContent(primitive),
    );
    writeFileIfChanged(
      path.join(LAYOUT_SRC_ROOT, `${type}.json`),
      makeJsonContent(layoutFragment),
    );
  }

  console.log('Bootstrapped templates-src authoring fragments from current runtime aggregates.');
}

main();
