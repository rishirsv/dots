import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
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
  ];
  try {
    for (const [rule, body] of cases) {
      const file = join(dir, `${rule}.html`);
      writeFileSync(file, shell(body));
      const page = await browser.openPage(file, 400);
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
