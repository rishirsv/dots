import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkGalleries } from './catalog.mjs';

const assets = new URL('../assets/', import.meta.url);
const catalog = new URL('./catalog.mjs', import.meta.url);

test('catalog list and help expose signatures, rules, and examples', () => {
  const list = execFileSync(process.execPath, [catalog.pathname, '--list'], { encoding: 'utf8' });
  const help = execFileSync(process.execPath, [catalog.pathname, '--help', 'finding'], { encoding: 'utf8' });
  assert.match(list, /^flow: flow\(/m);
  assert.match(help, /Signature: finding\.high/);
  assert.match(help, /Rules: severity must be high/);
  assert.match(help, /Example: findings\(/);
  assert.ok(help.split('\n').length <= 30);
});

function withCatalogFiles(run) {
  const dir = mkdtempSync(join(tmpdir(), 'dots-catalog-'));
  try {
    for (const name of ['atlas.html', 'diagrams.html', 'theme.css']) copyFileSync(new URL(name, assets), join(dir, name));
    run(dir);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('catalog check rejects an edited gallery example', () => withCatalogFiles((dir) => {
  const options = { assetsDir: dir, howDir: join(dir, 'absent') };
  assert.deepEqual(checkGalleries(options), []);
  const atlas = join(dir, 'atlas.html');
  writeFileSync(atlas, readFileSync(atlas, 'utf8').replace('id="stat-tiles"', 'id="hand-edited"'));
  assert.ok(checkGalleries(options).includes(atlas));
}));

test('catalog check rejects stale theme copies in HTML and How assets', () => withCatalogFiles((dir) => {
  const atlas = join(dir, 'atlas.html');
  const original = readFileSync(atlas, 'utf8');
  writeFileSync(atlas, original.replace('--background: #fbfbfa', '--background: #ffffff'));
  assert.ok(checkGalleries({ assetsDir: dir, howDir: join(dir, 'absent') }).includes(atlas));
  writeFileSync(atlas, original);
  const howDir = join(dir, 'how');
  mkdirSync(howDir);
  const howFile = join(howDir, 'reference.html');
  const howSource = readFileSync(new URL('../../how/assets/reference.html', import.meta.url), 'utf8');
  writeFileSync(howFile, howSource.replace('--background: #fbfbfa', '--background: #ffffff'));
  assert.ok(checkGalleries({ assetsDir: dir, howDir }).includes(howFile));
}));
