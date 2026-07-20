#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const WIDTH = 1440;
const HEIGHT = 900;
const SCALE = 1;
const SOURCE_BYTE_LIMIT = 1024 * 1024;
const OUTPUT_BYTE_LIMIT = 10 * 1024 * 1024;
const FRAME_LIMIT = 100;
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function deadline(promise, milliseconds, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label)), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}

async function main() {
  const input = resolve(process.argv[2] || "");
  const output = resolve(process.argv[3] || "");
  if (!existsSync(input) || readFileSync(input).byteLength > SOURCE_BYTE_LIMIT) throw new Error("HTML source is missing or too large");
  const chrome = chromeCandidates.find(existsSync);
  if (!chrome) throw new Error("Chrome was not found");
  if (typeof WebSocket === "undefined") throw new Error("Node.js WebSocket support is required");

  const profile = mkdtempSync(join(tmpdir(), "metaskill-html-preview-"));
  const child = spawn(chrome, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--disable-background-networking", "--disable-component-update", "--disable-default-apps",
    "--disable-extensions", "--disable-sync", "--metrics-recording-only", "--mute-audio",
    `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  try {
    const websocketUrl = await deadline(new Promise((resolveUrl, reject) => {
      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
        const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) resolveUrl(match[1]);
      });
      child.on("error", reject);
      child.on("exit", (code) => reject(new Error(`Chrome exited before DevTools connected (${code}): ${stderr.trim()}`)));
    }), 10000, "Chrome DevTools startup timed out");

    const socket = new WebSocket(websocketUrl);
    await deadline(new Promise((resolveOpen, reject) => {
      socket.addEventListener("open", resolveOpen, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }), 5000, "Chrome DevTools connection timed out");
    let nextId = 1;
    const pending = new Map();
    const events = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const waiter = pending.get(message.id);
        if (!waiter) return;
        pending.delete(message.id);
        message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result || {});
      } else {
        events.splice(0).filter((waiter) => {
          if (waiter.method !== message.method || waiter.sessionId !== message.sessionId) return true;
          waiter.resolve(message.params || {});
          return false;
        }).forEach((waiter) => events.push(waiter));
      }
    });
    const call = (method, params = {}, sessionId) => new Promise((resolveCall, reject) => {
      const id = nextId++;
      pending.set(id, { resolve: resolveCall, reject });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const waitFor = (method, sessionId) => new Promise((resolveEvent) => events.push({ method, sessionId, resolve: resolveEvent }));

    const browser = await call("Browser.getVersion");
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    const pageCall = (method, params = {}) => call(method, params, sessionId);
    await Promise.all([pageCall("Page.enable"), pageCall("Network.enable"), pageCall("Runtime.enable")]);
    await pageCall("Network.setBlockedURLs", { urls: ["http://*", "https://*", "ws://*", "wss://*"] });
    await pageCall("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE, mobile: false, screenWidth: WIDTH, screenHeight: HEIGHT });
    await pageCall("Emulation.setScriptExecutionDisabled", { value: true });
    const loaded = waitFor("Page.loadEventFired", sessionId);
    await pageCall("Page.navigate", { url: pathToFileURL(input).href });
    await deadline(loaded, 5000, "HTML load timed out");
    // Page scripts remain disabled during load. Re-enable execution only after load so
    // this harness can expose one static artifact page at a time without running the
    // artifact's own scripts.
    await pageCall("Emulation.setScriptExecutionDisabled", { value: false });
    const { result: pageCountResult } = await pageCall("Runtime.evaluate", {
      expression: "Math.max(1, document.querySelectorAll('[data-artifact-page], [data-stage]').length || 1)",
      returnByValue: true,
    });
    const frameCount = Number(pageCountResult.value) || 1;
    if (frameCount > FRAME_LIMIT) throw new Error(`HTML artifact has more than ${FRAME_LIMIT} preview frames`);
    const extension = extname(output) || ".png";
    const stem = basename(output, extension);
    const frames = [];
    for (let index = 0; index < frameCount; index += 1) {
      const { result } = await pageCall("Runtime.evaluate", {
        expression: `(() => {
          const pages = [...document.querySelectorAll('[data-artifact-page], [data-stage]')];
          const page = pages[${index}] || document.documentElement;
          if (pages.length) pages.forEach((candidate, position) => {
            if (position === ${index}) {
              if (candidate.hasAttribute('data-stage')) candidate.style.setProperty('display', 'block', 'important');
              else candidate.style.removeProperty('display');
            } else candidate.style.setProperty('display', 'none', 'important');
            candidate.toggleAttribute('hidden', position !== ${index});
            candidate.setAttribute('aria-hidden', String(position !== ${index}));
          });
          document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          page.scrollIntoView({ block: 'start', inline: 'start' });
          const heading = page.querySelector('h1, h2, [aria-label]');
          return {
            label: ((heading && (heading.innerText || heading.textContent || heading.getAttribute('aria-label'))) || page.getAttribute('aria-label') || 'Page ${index + 1}').trim().replace(/\\s+/g, ' ').slice(0, 100),
          };
        })()`,
        returnByValue: true,
      });
      await pageCall("Runtime.evaluate", {
        expression: "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
        awaitPromise: true,
      });
      const { data } = await pageCall("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
      const png = Buffer.from(data, "base64");
      if (png.byteLength > OUTPUT_BYTE_LIMIT) throw new Error("PNG preview is too large");
      const frameName = `${stem}-${String(index + 1).padStart(3, "0")}${extension}`;
      writeFileSync(join(dirname(output), frameName), png);
      frames.push({ file: frameName, index: index + 1, label: result.value?.label || `Page ${index + 1}`, width: WIDTH, height: HEIGHT });
    }
    process.stdout.write(JSON.stringify({
      generated_by: "harness",
      frames,
      environment: { node: process.version, browser: browser.product || "unknown" },
    }));
    try { await call("Browser.close"); } catch { child.kill("SIGTERM"); }
    socket.close();
  } finally {
    child.kill("SIGKILL");
    rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
