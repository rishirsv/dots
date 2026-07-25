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

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { checkArtifact } from "./check-artifact.mjs";

const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

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

function layoutDiagnostic() {
  const viewport = document.documentElement.clientWidth;
  const failures = [];

  function visible(element) {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function checkBounds(element) {
    if (!visible(element)) return;
    const rect = element.getBoundingClientRect();
    if (rect.left < -1 || rect.right > viewport + 1) {
      const label = element.getAttribute("data-component")
        || element.id
        || element.className
        || element.tagName.toLowerCase();
      failures.push(`${label} leaves viewport (${Math.round(rect.left)}..${Math.round(rect.right)} / ${viewport})`);
    }
  }

  if (document.documentElement.scrollWidth > viewport + 1) {
    failures.push(`document scroll width is ${document.documentElement.scrollWidth}px at ${viewport}px`);
  }
  if (document.body.scrollWidth > viewport + 1) {
    failures.push(`body scroll width is ${document.body.scrollWidth}px at ${viewport}px`);
  }

  document.querySelectorAll(".page, [data-component], section, figure, .process-step, .evidence-item")
    .forEach(checkBounds);

  const title = document.querySelector("h1");
  const status = document.querySelector(".status");
  if (title && status) {
    const titleRect = title.getBoundingClientRect();
    const statusRect = status.getBoundingClientRect();
    const overlaps = titleRect.left < statusRect.right
      && titleRect.right > statusRect.left
      && titleRect.top < statusRect.bottom
      && titleRect.bottom > statusRect.top;
    if (overlaps) failures.push("title and status overlap");
  }

  document.querySelectorAll("svg text").forEach((label) => {
    const svg = label.closest("svg");
    if (!svg?.viewBox?.baseVal?.width) return;
    const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    const effectiveSize = parseFloat(getComputedStyle(label).fontSize) * scale;
    if (effectiveSize < 11) {
      failures.push(`scaled SVG label falls below 11px (${effectiveSize.toFixed(1)}px)`);
    }
  });

  return { viewport, failures };
}

async function launchChrome(chrome) {
  const profile = mkdtempSync(join(tmpdir(), "dots-html-capture-"));
  const child = spawn(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-sync",
    "--metrics-recording-only",
    "--mute-audio",
    `--user-data-dir=${profile}`,
    "--remote-debugging-port=0",
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const websocketUrl = await new Promise((resolveUrl, reject) => {
    let stderr = "";
    const timer = setTimeout(
      () => reject(new Error(`Chrome DevTools did not start: ${stderr.trim()}`)),
      15000,
    );
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolveUrl(match[1]);
    });
    child.on("error", reject);
    child.on("exit", (code) => reject(new Error(`Chrome exited before DevTools connected (${code})`)));
  });

  if (typeof WebSocket === "undefined") fail("this capture requires a Node.js runtime with WebSocket support");
  const socket = new WebSocket(websocketUrl);
  await new Promise((resolveSocket, reject) => {
    socket.addEventListener("open", resolveSocket, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const eventWaiters = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result ?? {});
      return;
    }
    for (let index = eventWaiters.length - 1; index >= 0; index -= 1) {
      const waiter = eventWaiters[index];
      if (waiter.method !== message.method || waiter.sessionId !== message.sessionId) continue;
      eventWaiters.splice(index, 1);
      clearTimeout(waiter.timer);
      waiter.resolve(message.params ?? {});
    }
  });

  function call(method, params = {}, sessionId) {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolveCall, reject) => pending.set(id, { resolve: resolveCall, reject }));
  }

  function waitFor(method, sessionId) {
    return new Promise((resolveEvent, reject) => {
      const waiter = { method, sessionId, resolve: resolveEvent, reject };
      waiter.timer = setTimeout(() => {
        const index = eventWaiters.indexOf(waiter);
        if (index !== -1) eventWaiters.splice(index, 1);
        reject(new Error(`timed out waiting for ${method}`));
      }, 15000);
      eventWaiters.push(waiter);
    });
  }

  async function openPage(file, width, {
    theme = "light",
    reducedMotion = false,
    javascript = true,
  } = {}) {
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    const pageCall = (method, params = {}) => call(method, params, sessionId);
    await Promise.all([pageCall("Page.enable"), pageCall("Runtime.enable"), pageCall("DOM.enable")]);
    await pageCall("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: 1000,
    });
    await pageCall("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: theme },
        { name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" },
      ],
    });
    if (!javascript) await pageCall("Emulation.setScriptExecutionDisabled", { value: true });

    const loaded = waitFor("Page.loadEventFired", sessionId);
    await pageCall("Page.navigate", { url: pathToFileURL(file).href });
    await loaded;
    if (javascript) {
      await pageCall("Runtime.evaluate", {
        expression: `document.documentElement.setAttribute("data-theme", ${JSON.stringify(theme)})`,
      });
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
    }

    return {
      async diagnose() {
        const result = await pageCall("Runtime.evaluate", {
          expression: `(${layoutDiagnostic.toString()})()`,
          returnByValue: true,
        });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "layout diagnostic failed");
        return result.result.value;
      },
      async html() {
        const { root } = await pageCall("DOM.getDocument", { depth: 0 });
        const { outerHTML } = await pageCall("DOM.getOuterHTML", { nodeId: root.nodeId });
        return outerHTML;
      },
      async screenshot(output, { fullPage = true } = {}) {
        const { data } = await pageCall("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: fullPage,
          fromSurface: true,
        });
        writeFileSync(output, Buffer.from(data, "base64"));
      },
      close: () => call("Target.closeTarget", { targetId }),
    };
  }

  return {
    openPage,
    async close() {
      try { await call("Browser.close"); } catch { child.kill("SIGTERM"); }
      socket.close();
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 250).unref();
      setTimeout(() => {
        try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); }
        catch { /* The OS temp sweep owns a profile Chrome has not released yet. */ }
      }, 500);
    },
  };
}

try {
  const input = arg("--in");
  const outputDir = arg("--out-dir");
  if (!input || !outputDir) fail("--in and --out-dir are required");

  const artifact = resolve(input);
  if (!existsSync(artifact)) fail(`cannot read "${input}"`);
  const structuralFailures = checkArtifact(readFileSync(artifact, "utf8"));
  if (structuralFailures.length) {
    fail(`structural gate failed: ${structuralFailures.map((failure) => failure.code).join(", ")}`);
  }

  const chrome = chromeCandidates.find(existsSync);
  if (!chrome) fail("Chrome was not found; set CHROME_BIN to a Chromium-based browser");
  mkdirSync(outputDir, { recursive: true });

  const browser = await launchChrome(chrome);
  const states = [];
  let lightText = "";
  try {
    for (const width of [1280, 768, 360, 320]) {
      for (const theme of ["light", "dark"]) {
        const page = await browser.openPage(artifact, width, { theme });
        const result = await page.diagnose();
        if (result.viewport !== width) fail(`${theme} requested ${width}px but Chrome rendered ${result.viewport}px`);
        if (result.failures.length) fail(`${theme} ${width}px: ${result.failures.join("; ")}`);
        if (width === 360 && theme === "light") lightText = normalizedVisibleText(await page.html());
        await page.screenshot(join(outputDir, `${width}-${theme}.png`));
        if (width === 1280 && theme === "light") {
          await page.screenshot(join(outputDir, "1280-light-first-frame.png"), { fullPage: false });
          states.push("1280-light-first-frame");
        }
        await page.close();
        states.push(`${width}-${theme}`);
      }
    }

    const reduced = await browser.openPage(artifact, 360, { reducedMotion: true });
    const reducedResult = await reduced.diagnose();
    if (reducedResult.failures.length) fail(`reduced motion: ${reducedResult.failures.join("; ")}`);
    await reduced.screenshot(join(outputDir, "360-reduced-motion.png"));
    await reduced.close();
    states.push("360-reduced-motion");

    const noJs = await browser.openPage(artifact, 360, { javascript: false });
    const noJsText = normalizedVisibleText(await noJs.html());
    if (noJsText !== lightText) fail("JS-off page does not preserve the visible document text");
    await noJs.screenshot(join(outputDir, "360-js-off.png"));
    await noJs.close();
    states.push("360-js-off");
  } finally {
    await browser.close();
  }

  process.stdout.write([
    `capture-artifact.mjs: ${basename(artifact)} passed`,
    `screenshots: ${resolve(outputDir)}`,
    `states: ${states.join(", ")}`,
    "",
  ].join("\n"));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
