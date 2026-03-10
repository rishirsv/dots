import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  GENERATED_FILE_HEADER,
  GENERATED_LAYOUTS_PATH,
  makeJsonContent,
  readSourceLayoutPackageMeta,
  readSourceLayouts,
} from './codegen/lib.mjs';
import { buildLayoutsAggregate } from './codegen/generate-runtime-aggregates.mjs';
import { REPO_ROOT } from './support.mjs';

const originalLayoutsContent = fs.readFileSync(GENERATED_LAYOUTS_PATH, 'utf8');
const expectedLayoutsContent = makeJsonContent(
  buildLayoutsAggregate(readSourceLayouts(), readSourceLayoutPackageMeta()),
);

try {
  fs.writeFileSync(
    GENERATED_LAYOUTS_PATH,
    '{\n  "corrupted": true,\n  "note": "source reproducibility smoke"\n',
  );

  const regen = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs')], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  assert.equal(
    regen.status,
    0,
    `Runtime aggregate regeneration should succeed from source fragments alone.\n${regen.stdout || ''}\n${regen.stderr || ''}`.trim(),
  );

  const regeneratedLayoutsContent = fs.readFileSync(GENERATED_LAYOUTS_PATH, 'utf8');
  assert.equal(
    regeneratedLayoutsContent,
    expectedLayoutsContent,
    'Regenerated layouts.json should be reproducible from source layouts plus authored package metadata only.',
  );
  assert.match(
    regeneratedLayoutsContent,
    new RegExp(`"generatedFileHeader": "${GENERATED_FILE_HEADER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
    'The regenerated layout package should restore the generated file header.',
  );

  const verify = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs'), '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  assert.equal(
    verify.status,
    0,
    `Generated output verification should pass after regeneration from source-only inputs.\n${verify.stdout || ''}\n${verify.stderr || ''}`.trim(),
  );
} finally {
  fs.writeFileSync(GENERATED_LAYOUTS_PATH, originalLayoutsContent);
}

console.log('Source-only codegen reproducibility passed.');
