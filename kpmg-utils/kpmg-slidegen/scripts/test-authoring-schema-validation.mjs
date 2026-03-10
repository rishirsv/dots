import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { validateAuthoringFragments } from './validate-authoring-fragments.mjs';

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function makePrimitive(overrides = {}) {
  return {
    id: 'testPrimitive',
    version: 1,
    builderModule: 'generator/builders/one-column-text.js',
    builderExport: 'addOneColumnText',
    geometryKinds: {
      titleBox: 'box',
    },
    requiredGeometry: ['titleBox'],
    optionalGeometry: [],
    optionalDefaults: {},
    paginationPolicyKey: 'none.v1',
    master: 'KPMG_WHITE',
    slotSchemaRef: 'testPrimitive',
    validationHooks: [],
    excludeFromLogicalPaging: false,
    ...overrides,
  };
}

function makeLayout(overrides = {}) {
  return {
    type: 'testLayout',
    primitive: 'testPrimitive@1',
    description: 'Test layout',
    templateLayout: 'testLayout',
    geometry: {
      titleBox: { x: 1, y: 1, w: 4, h: 1 },
    },
    slots: {},
    ...overrides,
  };
}

function withTempAuthoringData({ primitives, layouts }, callback) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-slidegen-authoring-'));
  const primitiveDir = path.join(tempRoot, 'primitives');
  const layoutDir = path.join(tempRoot, 'layouts');
  try {
    for (const [name, value] of Object.entries(primitives)) {
      writeJson(path.join(primitiveDir, `${name}.json`), value);
    }
    for (const [name, value] of Object.entries(layouts)) {
      writeJson(path.join(layoutDir, `${name}.json`), value);
    }
    callback({ primitiveDir, layoutDir });
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

withTempAuthoringData(
  {
    primitives: {
      semanticPrimitive: makePrimitive({
        id: 'semanticPrimitive',
        geometryKinds: {
          titleBox: 'box',
          typography: 'object',
          scaleValue: 'number',
          labelText: 'string',
        },
        requiredGeometry: ['titleBox', 'typography', 'scaleValue', 'labelText'],
        slotSchemaRef: 'semanticPrimitive',
      }),
    },
    layouts: {
      semanticLayout: makeLayout({
        type: 'semanticLayout',
        primitive: 'semanticPrimitive@1',
        geometry: {
          titleBox: { x: 1, y: 1, w: 4, h: 1 },
          typography: {
            heading: 18,
            caption: 'Body caption',
            badgeBox: { x: 2, y: 2, w: 1.5, h: 0.5 },
            nested: {
              chartMarker: { x: 2.5, y: 2.7, w: 0.4, h: 0.4 },
              values: [1, 'two', false, null],
            },
          },
          scaleValue: 1.25,
          labelText: 'Semantic label',
        },
      }),
    },
  },
  ({ primitiveDir, layoutDir }) => {
    assert.doesNotThrow(() => validateAuthoringFragments({ primitiveDir, layoutDir }));
  },
);

withTempAuthoringData(
  {
    primitives: {
      invalidKind: makePrimitive({
        id: 'invalidKind',
        geometryKinds: {
          titleBox: 'point',
        },
        slotSchemaRef: 'invalidKind',
      }),
    },
    layouts: {
      invalidKindLayout: makeLayout({
        type: 'invalidKindLayout',
        primitive: 'invalidKind@1',
      }),
    },
  },
  ({ primitiveDir, layoutDir }) => {
    assert.throws(
      () => validateAuthoringFragments({ primitiveDir, layoutDir }),
      /unsupported kind|must be equal to one of the allowed values/,
      'Unsupported runtime geometry kinds should fail authoring validation.',
    );
  },
);

withTempAuthoringData(
  {
    primitives: {
      missingRequired: makePrimitive({
        id: 'missingRequired',
        geometryKinds: {
          titleBox: 'box',
          calloutLabel: 'string',
        },
        requiredGeometry: ['titleBox', 'calloutLabel'],
        slotSchemaRef: 'missingRequired',
      }),
    },
    layouts: {
      missingRequiredLayout: makeLayout({
        type: 'missingRequiredLayout',
        primitive: 'missingRequired@1',
        geometry: {
          titleBox: { x: 1, y: 1, w: 4, h: 1 },
        },
      }),
    },
  },
  ({ primitiveDir, layoutDir }) => {
    assert.throws(
      () => validateAuthoringFragments({ primitiveDir, layoutDir }),
      /missing required key "calloutLabel"/,
      'Missing required geometry values should fail validation.',
    );
  },
);

console.log('Authoring schema validation tests passed.');
