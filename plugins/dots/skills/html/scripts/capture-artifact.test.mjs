import test from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromeCandidates, launchChrome } from './lib/chrome.mjs';
import { assemble } from './assemble.mjs';
import { bodyFixture } from './capture-fixture.mjs';

const chrome = chromeCandidates.find(existsSync);
const shell = (body) => `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:white;color:black">${body}</body></html>`;

test('capture diagnoses seeded defects and accepts a clean page', { skip: !chrome && 'Chrome is unavailable' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'dots-capture-test-'));
  const browser = await launchChrome(chrome);
  const cases = [
    ['svg-overlap', '<svg width="200" height="80" viewBox="0 0 200 80"><text x="10" y="20" font-size="14">alpha</text><text x="14" y="22" font-size="14">beta</text></svg>'],
    ['svg-min-size', '<svg width="200" height="80" viewBox="0 0 200 80"><text x="10" y="20" font-size="8">small</text></svg>'],
    ['image-decode', '<img src="missing.png" alt="broken">'],
    ['overflow', '<div data-component="callout" style="width:900px">wide</div>'],
    ['external-network', '<script>fetch("https://example.com/diagnostic").catch(() => {})</script>'],
    ['console', '<script>console.error("seeded error")</script>'],
    ['contrast', '<p style="color:#aaa">faint text</p>'],
    ['contrast', '<div data-component="stat-tiles"><strong class="kpi-value" style="color:#aaa">42</strong></div>'],
    ['contrast', '<svg width="200" height="80" viewBox="0 0 200 80"><text x="10" y="40" font-size="20" fill="#aaa">faint SVG</text></svg>'],
    ['contrast', '<svg width="200" height="80" viewBox="0 0 200 80"><rect x="0" y="0" width="200" height="80" fill="#111"/><text x="10" y="40" font-size="20" fill="#111">hidden</text></svg>'],
    ['contrast', '<svg width="200" height="80" viewBox="0 0 200 80"><circle cx="100" cy="40" r="38" fill="#111"/><text x="70" y="45" font-size="18" fill="#111">hidden</text></svg>'],
    ['contrast-unassessed', '<svg width="200" height="80" viewBox="0 0 200 80"><polygon points="10,10 190,10 190,70 10,70" fill="#111"/><text x="70" y="45" font-size="18">label</text></svg>'],
    ['figure-desktop-scroll', '<div class="flow-diagram-wrap" style="width:600px;overflow-x:auto"><svg width="900" height="100"></svg></div>'],
    ['data-mark-size', '<div class="bar-row"><div class="bar-track" style="width:4px;height:20px"><div class="bar-fill" style="width:100%;height:20px"></div></div></div>'],
    ['svg-empty-area', '<div class="flow-diagram-wrap"><svg width="600" height="300" viewBox="0 0 600 300"><rect x="10" y="10" width="50" height="30" fill="black"/></svg></div>'],
    ['svg-empty-area', '<figure><svg width="600" height="300" viewBox="0 0 600 300"><rect x="10" y="10" width="50" height="30" fill="black"/></svg></figure>'],
  ];
  try {
    for (const [rule, body] of cases) {
      const file = join(dir, `${rule}.html`);
      writeFileSync(file, shell(body));
      const page = await browser.openPage(file, rule === 'figure-desktop-scroll' ? 1280 : 400);
      try {
        const result = await page.diagnose();
        assert.ok(result.findings.some((finding) => finding.rule === rule), `${rule}: ${JSON.stringify(result.findings)}`);
      } finally { await page.close(); }
    }
    const file = join(dir, 'clean.html');
    writeFileSync(file, shell('<section id="clean"><h2>Clean page</h2><p>Readable content.</p></section>'));
    const page = await browser.openPage(file, 400);
    try { assert.deepEqual((await page.diagnose()).findings, []); }
    finally { await page.close(); }
  } finally {
    await browser.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('representative TOC, comparison grids, and gallery pass at desktop and mobile widths', { skip: !chrome && 'Chrome is unavailable' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'dots-capture-components-'));
  const file = join(dir, 'fixture.html');
  writeFileSync(file, assemble({ title: 'A long responsive release title', body: bodyFixture() }));
  const browser = await launchChrome(chrome);
  try {
    for (const width of [1280, 360]) {
      const page = await browser.openPage(file, width);
      try { assert.deepEqual((await page.diagnose()).findings, []); }
      finally { await page.close(); }
    }
  } finally {
    await browser.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Chrome exiting mid-capture writes a failure report and returns promptly', { skip: !chrome && 'Chrome is unavailable' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'dots-capture-exit-'));
  try {
    const wrapper = join(dir, 'chrome-wrapper.sh');
    writeFileSync(wrapper, `#!/bin/sh\n"${chrome}" "$@" &\nchild=$!\n(sleep 2; kill -9 "$child" 2>/dev/null) &\nwait "$child"\n`);
    chmodSync(wrapper, 0o755);
    const input = join(dir, 'page.html'), out = join(dir, 'shots');
    writeFileSync(input, shell('<section id="test"><h2>Test</h2><p>Chrome will exit.</p></section>'));
    const result = spawnSync(process.execPath, [new URL('./capture-artifact.mjs', import.meta.url).pathname, '--in', input, '--out-dir', out],
      { env: { ...process.env, CHROME_BIN: wrapper }, encoding: 'utf8', timeout: 20000 });
    assert.equal(result.error, undefined, result.error?.message);
    assert.notEqual(result.status, 0);
    const report = JSON.parse(readFileSync(join(out, 'report.json'), 'utf8'));
    assert.ok(report.findings.some((finding) => finding.rule === 'capture-error'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
