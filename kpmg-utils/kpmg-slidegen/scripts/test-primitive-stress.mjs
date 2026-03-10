import assert from 'node:assert/strict';

import { readSourceLayouts, readSourcePrimitives, primitiveVersionRef, BUILTIN_BUILDER_MAP } from './codegen/lib.mjs';

const layouts = readSourceLayouts();
const primitives = readSourcePrimitives();
const layoutRefs = new Map();

for (const layout of layouts) {
  const ref = layout.primitive;
  if (!layoutRefs.has(ref)) layoutRefs.set(ref, []);
  layoutRefs.get(ref).push(layout.type);
}

assert.ok(primitives.length > 0, 'Primitive source set must not be empty.');

for (const primitive of primitives) {
  const ref = primitiveVersionRef(primitive);
  const attachedLayouts = layoutRefs.get(ref) || [];
  assert.ok(attachedLayouts.length > 0, `Primitive must be referenced by at least one layout: ${ref}`);
  assert.equal(typeof primitive.builderModule, 'string', `Primitive builderModule missing for ${ref}`);
  assert.equal(typeof primitive.builderExport, 'string', `Primitive builderExport missing for ${ref}`);
  assert.ok(Object.keys(primitive.geometryKinds || {}).length > 0, `Primitive geometryKinds missing for ${ref}`);
  for (const key of primitive.requiredGeometry || []) {
    assert.ok(primitive.geometryKinds[key], `Primitive required geometry key "${key}" missing kind for ${ref}`);
  }
  for (const layoutType of attachedLayouts) {
    const layout = layouts.find((entry) => entry.type === layoutType);
    assert.equal(layout.primitive, ref, `Layout primitive mismatch for ${layoutType}`);
    for (const geometryKey of primitive.requiredGeometry || []) {
      assert.notEqual(layout.geometry?.[geometryKey], undefined, `Layout ${layoutType} is missing required geometry "${geometryKey}"`);
    }
  }
  if (BUILTIN_BUILDER_MAP[primitive.id]) {
    assert.equal(
      primitive.builderModule,
      BUILTIN_BUILDER_MAP[primitive.id].builderModule,
      `Built-in primitive builderModule drift for ${ref}`,
    );
  }
}

console.log('Primitive stress lane passed.');
