#!/usr/bin/env node
/**
 * Render the delivered HTML artifact itself across the supported viewport,
 * theme, motion, and JavaScript states. Save full-page screenshots and fail
 * when the page or a named component leaves the viewport.
 *
 * Usage:
 *   node scripts/capture-artifact.mjs --in /path/to/page.html \
 *     --out-dir /path/to/screenshots
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { chromeCandidates, launchChrome } from "./lib/chrome.mjs";

function fail(message) {
  throw new Error(`capture-artifact.mjs: ${message}`);
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function normalizedVisibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}


try {
  const input = arg("--in");
  const outputDir = arg("--out-dir");
  if (!input || !outputDir) fail("--in and --out-dir are required");

  const artifact = resolve(input);
  if (!existsSync(artifact)) fail(`cannot read "${input}"`);
  const source = readFileSync(artifact, "utf8");
  const pinnedTheme = source.match(/<html\b[^>]*\bdata-theme\s*=\s*(["'])(light|dark)\1/i)?.[2]?.toLowerCase();
  const themes = pinnedTheme ? [pinnedTheme] : ["light", "dark"];

  const chrome = chromeCandidates.find(existsSync);
  if (!chrome) fail("Chrome was not found; set CHROME_BIN to a Chromium-based browser");
  mkdirSync(outputDir, { recursive: true });

  const browser = await launchChrome(chrome);
  const states = [];
  const findings = [];
  const sheetItems = [];
  let baselineText = "";
  async function capture(name, width, options, firstFrame = false) {
    const page = await browser.openPage(artifact, width, options);
    try {
      const result = await page.diagnose();
      if (result.viewport !== width) fail(`${name}: Chrome rendered ${result.viewport}px instead of ${width}px`);
      findings.push(...result.findings.map((finding) => ({ state: name, ...finding })));
      if (name === `360-${themes[0]}`) baselineText = normalizedVisibleText(await page.html());
      if (name === "360-js-off" && normalizedVisibleText(await page.html()) !== baselineText)
        findings.push({ state: name, rule: "js-off-text", section: null, component: null, index: null, message: "JS-off page changes document text" });
      if (firstFrame) {
        const first = `${name}-first-frame`;
        sheetItems.push({ name: first, data: await page.screenshot(join(outputDir, `${first}.png`), { fullPage: false }) });
        states.push(first);
      }
      sheetItems.push({ name, data: await page.screenshot(null, { fullPage: false }) });
      await page.screenshot(join(outputDir, `${name}.png`));
      states.push(name);
    } finally { await page.close(); }
  }
  try {
    for (const width of [1280, 768, 360, 320]) for (const theme of themes)
      await capture(`${width}-${theme}`, width, { theme, pinnedTheme: Boolean(pinnedTheme) }, width === 1280 && theme === themes[0]);
    await capture("360-reduced-motion", 360, { theme: themes[0], reducedMotion: true, pinnedTheme: Boolean(pinnedTheme) });
    await capture("360-js-off", 360, { theme: themes[0], javascript: false, pinnedTheme: Boolean(pinnedTheme) });

    const sheetSource = join(outputDir, ".capture-sheet.html");
    const cells = sheetItems.map(({ name, data }) => `<figure><img src="data:image/png;base64,${data}" alt="${name}"><figcaption>${name}</figcaption></figure>`).join("");
    writeFileSync(sheetSource, `<!doctype html><html><meta charset="utf-8"><style>body{margin:12px;background:#eee;font:13px sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}figure{margin:0;background:white;padding:8px;overflow:hidden}img{display:block;width:100%;height:210px;object-fit:cover;object-position:top}figcaption{padding-top:6px}</style>${cells}</html>`);
    try {
      const sheet = await browser.openPage(sheetSource, 1400, { pinnedTheme: true });
      try { await sheet.screenshot(join(outputDir, "sheet.png")); }
      finally { await sheet.close(); }
    } finally { rmSync(sheetSource, { force: true }); }
  } finally { await browser.close(); }

  writeFileSync(join(outputDir, "report.json"), JSON.stringify({ artifact: basename(artifact), pinnedTheme: pinnedTheme ?? null, states, findings }, null, 2) + "\n");
  process.stdout.write(`capture-artifact.mjs: ${basename(artifact)} ${findings.length ? `failed (${findings.length} findings)` : "passed"}\nscreenshots: ${resolve(outputDir)}\nstates: ${states.join(", ")}\n`);
  if (findings.length) {
    for (const item of findings) console.error(`${item.state} ${item.rule}: ${item.message}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
