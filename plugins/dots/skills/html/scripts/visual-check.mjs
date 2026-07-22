#!/usr/bin/env node
/**
 * Render representative responsive components in headless Chrome, emit stable
 * screenshots, and fail on observable clipping or responsive-contract defects.
 *
 * Usage: node scripts/visual-check.mjs --out-dir /path/to/screenshots
 * Set CHROME_BIN when Chrome is not in a standard macOS location.
 */

import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { assemble } from "./assemble.mjs";
import { checkArtifact } from "./check-artifact.mjs";

const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function cleanupProfile(profile) {
  setTimeout(() => {
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); }
    catch { /* Chrome may still be releasing profile files; the OS temp sweep owns the remainder. */ }
  }, 500);
}

function fail(message) {
  throw new Error(`visual-check.mjs: ${message}`);
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function diagnosticScript() {
  return `<script>
  (function () {
    var failures = [];
    var viewport = document.documentElement.clientWidth;
    function visible(el) {
      var style = getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    }
    function withinViewport(el, label) {
      if (!visible(el)) return;
      var rect = el.getBoundingClientRect();
      if (rect.left < -1 || rect.right > viewport + 1) failures.push(label + " leaves viewport (" + Math.round(rect.left) + ".." + Math.round(rect.right) + " / " + viewport + ")");
    }
    function channels(value) {
      var numbers = value.match(/[\\d.]+/g).map(Number);
      return { rgb: numbers.slice(0, 3), alpha: numbers.length > 3 ? numbers[3] : 1 };
    }
    function luminance(rgb) {
      var linear = rgb.map(function (channel) {
        var value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    }
    function contrast(foreground, background) {
      var fg = channels(foreground);
      var bg = channels(background).rgb;
      var composite = fg.rgb.map(function (channel, index) { return channel * fg.alpha + bg[index] * (1 - fg.alpha); });
      var a = luminance(composite);
      var b = luminance(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }
    document.querySelectorAll(".page, [data-component], .process-step, .evidence-item")
      .forEach(function (el) { withinViewport(el, el.getAttribute("data-component") || el.className || el.tagName); });

    var mutedProbe = document.createElement("span");
    mutedProbe.style.color = "var(--text-muted)";
    document.body.appendChild(mutedProbe);
    var mutedContrast = contrast(getComputedStyle(mutedProbe).color, getComputedStyle(document.body).backgroundColor);
    mutedProbe.remove();
    if (mutedContrast < 4.5) failures.push("muted text contrast falls below 4.5:1 (" + mutedContrast.toFixed(2) + ")");

    var status = document.querySelector(".status");
    var title = document.querySelector("h1");
    var header = document.querySelector(".page > header");
    var sectionGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--section"));
    if (!status || status.getBoundingClientRect().width < 30) failures.push("status is not readable");
    if (Math.abs(parseFloat(getComputedStyle(header).marginBottom) - sectionGap) > 1) failures.push("page header does not own the section gap");
    if (viewport <= 680 && status.getBoundingClientRect().top < title.getBoundingClientRect().bottom - 1) {
      failures.push("status does not stack below title");
    }
    if (viewport <= 320 && parseFloat(getComputedStyle(title).fontSize) > 32) {
      failures.push("mobile title scale exceeds 32px");
    }

    var steps = document.querySelector(".process-steps");
    if (steps.scrollWidth > steps.clientWidth + 1) failures.push("process steps scroll horizontally");
    document.querySelectorAll(".table-stack td").forEach(function (cell) {
      if (!cell.dataset.label) failures.push("stacked table cell lacks data-label");
    });
    document.querySelectorAll(".comparison-grid").forEach(function (grid) {
      var cards = Array.from(grid.children).filter(function (child) { return child.classList.contains("option-card"); });
      var declared = Number(grid.dataset.columns);
      var tracks = getComputedStyle(grid).gridTemplateColumns.split(/\\s+/).filter(Boolean).length;
      if (declared !== cards.length) failures.push("comparison grid column declaration does not match its cards");
      if (viewport > 680 && tracks !== cards.length) failures.push("comparison grid leaves an empty desktop track (" + tracks + " tracks / " + cards.length + " cards)");
      if (viewport <= 680 && tracks !== 1) failures.push("comparison grid does not collapse to one column");
      if (viewport > 680 && cards.length && Math.abs(cards[cards.length - 1].getBoundingClientRect().right - grid.getBoundingClientRect().right) > 2) {
        failures.push("comparison grid leaves an uncovered right edge");
      }
    });

    var details = document.querySelector(".toc-compact");
    var links = document.querySelector(".toc-wide .toc-links");
    if (viewport < 1264 && details.open) failures.push("mobile TOC is expanded by default");
    if (viewport >= 1264 && links.getBoundingClientRect().height < 40) failures.push("desktop TOC links are hidden");

    var galleryItems = Array.from(document.querySelectorAll(".evidence-item"));
    if (viewport <= 680 && new Set(galleryItems.map(function (item) { return Math.round(item.getBoundingClientRect().left); })).size !== 1) {
      failures.push("mobile evidence gallery is not one column");
    }
    document.querySelectorAll(".wide-figure svg text, .evidence-gallery svg text").forEach(function (label) {
      var svg = label.closest("svg");
      if (!svg || !svg.viewBox || !svg.viewBox.baseVal.width) return;
      var scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      var effectiveSize = parseFloat(getComputedStyle(label).fontSize) * scale;
      if (effectiveSize < 11) failures.push("scaled SVG label falls below 11px (" + effectiveSize.toFixed(1) + "px)");
    });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.classList.contains("js-motion")) {
      failures.push("reduced motion still enables motion");
    }

    var result = { viewport: viewport, failures: failures };
    document.documentElement.setAttribute("data-responsive-check", btoa(JSON.stringify(result)));
  })();
  </script>`;
}

function bodyFixture() {
  return `<nav data-component="toc-rail" class="toc-rail" aria-label="On this page">
    <div class="toc-wide"><p class="toc-label">On this page</p><div class="toc-links">
      <a href="#decision">Decision</a><a href="#process">Process</a><a href="#risks">Risks</a>
      <a href="#evidence">Evidence</a><a href="#implementation">Implementation</a><a href="#next">Next step</a>
    </div></div>
    <details class="toc-compact"><summary>On this page</summary><div class="toc-links">
      <a href="#decision">Decision</a><a href="#process">Process</a><a href="#risks">Risks</a>
      <a href="#evidence">Evidence</a><a href="#implementation">Implementation</a><a href="#next">Next step</a>
    </div></details>
  </nav>
  <section id="decision"><h2>The rollout can proceed after one contained check</h2>
    <div data-component="callout" class="callout"><p><strong>Decision.</strong> Keep the migration scoped and verify the final mobile state before release.</p></div>
  </section>
  <section id="process"><h2>Verification path</h2>
    <ol data-component="process-steps" class="process-steps">
      <li class="process-step"><span class="process-marker">1</span><div class="process-title">Inspect</div><p class="process-detail">Read the source.</p></li>
      <li class="process-step"><span class="process-marker">2</span><div class="process-title">Change</div><p class="process-detail">Apply the correction.</p></li>
      <li class="process-step is-current"><span class="process-marker">3</span><div class="process-title">Render</div><p class="process-detail">Check each width.</p></li>
      <li class="process-step"><span class="process-marker">4</span><div class="process-title">Ship</div><p class="process-detail">Attach the evidence.</p></li>
    </ol>
  </section>
  <section id="comparison"><h2>Comparison cardinality</h2>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="2">
      <div class="option-card"><h3>Before</h3><p>Broad request.</p></div>
      <div class="option-card"><h3>After</h3><p>Scoped request.</p></div>
    </div>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="3">
      <div class="option-card"><h3>One</h3><p>First option.</p></div>
      <div class="option-card"><h3>Two</h3><p>Second option.</p></div>
      <div class="option-card"><h3>Three</h3><p>Third option.</p></div>
    </div>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="4">
      <div class="option-card"><h3>One</h3><p>First option.</p></div>
      <div class="option-card"><h3>Two</h3><p>Second option.</p></div>
      <div class="option-card"><h3>Three</h3><p>Third option.</p></div>
      <div class="option-card"><h3>Four</h3><p>Fourth option.</p></div>
    </div>
  </section>
  <section id="risks"><h2>Release risks</h2>
    <div data-component="data-table" class="table-scroll table-stack"><table><thead><tr><th>Risk</th><th>Owner</th><th>State</th><th>Mitigation</th></tr></thead><tbody>
      <tr><td class="cell-label" data-label="Risk">Small-screen title collision</td><td data-label="Owner">Web</td><td data-label="State">Resolved</td><td data-label="Mitigation">Stack the status below the title.</td></tr>
      <tr><td class="cell-label" data-label="Risk">Evidence too dense to read</td><td data-label="Owner">Research</td><td data-label="State">Resolved</td><td data-label="Mitigation">Use one focal figure and two supporting views.</td></tr>
    </tbody></table></div>
  </section>
  <section id="evidence"><h2>Rendered evidence</h2>
    <figure data-component="wide-figure" class="wide-figure"><svg viewBox="0 0 1040 360" role="img" aria-label="Wide release overview"><rect width="1040" height="360" fill="var(--a4)"/><rect x="80" y="64" width="880" height="232" rx="6" fill="var(--background)" stroke="var(--a20)"/><rect x="132" y="112" width="440" height="28" rx="4" fill="var(--foreground)" opacity=".8"/><rect x="132" y="176" width="776" height="72" rx="6" fill="var(--a8)"/></svg><figcaption>The focal view keeps the release decision readable at desktop and mobile widths.</figcaption></figure>
    <div data-component="evidence-gallery" class="evidence-gallery">
      <figure class="evidence-item is-featured"><svg viewBox="0 0 960 540" role="img" aria-label="Desktop state"><rect width="960" height="540" fill="var(--a4)"/><rect x="120" y="60" width="720" height="420" rx="6" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Desktop.</strong> The complete decision is visible without crowding.</figcaption></figure>
      <figure class="evidence-item"><svg viewBox="0 0 640 360" role="img" aria-label="Mobile state"><rect width="640" height="360" fill="var(--a4)"/><rect x="216" y="24" width="208" height="312" rx="16" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Mobile.</strong> Components stack into one readable column.</figcaption></figure>
      <figure class="evidence-item"><svg viewBox="0 0 640 360" role="img" aria-label="Dark state"><rect width="640" height="360" fill="var(--code-surface)"/><rect x="72" y="44" width="496" height="272" rx="6" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Dark.</strong> The same hierarchy survives the theme change.</figcaption></figure>
    </div>
  </section>
  <section id="implementation"><h2>Implementation boundary</h2><p>The assembler packages chosen components but never chooses the story.</p></section>
  <section id="next"><h2>Next step</h2><p>Review the screenshots, then publish through the normal plugin workflow.</p></section>`;
}

async function launchChrome(chrome) {
  const profile = mkdtempSync(join(tmpdir(), "dots-html-chrome-"));
  const child = spawn(chrome, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--disable-background-networking", "--disable-component-update", "--disable-default-apps",
    "--disable-extensions", "--disable-sync", "--metrics-recording-only", "--mute-audio",
    `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const websocketUrl = await new Promise((resolve, reject) => {
    let stderr = "";
    const timer = setTimeout(() => reject(new Error(`Chrome DevTools did not start: ${stderr.trim()}`)), 15000);
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    child.on("error", reject);
    child.on("exit", (code) => reject(new Error(`Chrome exited before DevTools connected (${code}): ${stderr.trim()}`)));
  });

  if (typeof WebSocket === "undefined") fail("this render check requires a Node.js runtime with WebSocket support");
  const socket = new WebSocket(websocketUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
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
    for (let i = eventWaiters.length - 1; i >= 0; i -= 1) {
      const waiter = eventWaiters[i];
      if (waiter.method === message.method && waiter.sessionId === message.sessionId) {
        eventWaiters.splice(i, 1);
        clearTimeout(waiter.timer);
        waiter.resolve(message.params ?? {});
      }
    }
  });

  function call(method, params = {}, sessionId) {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }

  function waitFor(method, sessionId) {
    return new Promise((resolve, reject) => {
      const waiter = { method, sessionId, resolve, reject };
      waiter.timer = setTimeout(() => {
        const index = eventWaiters.indexOf(waiter);
        if (index !== -1) eventWaiters.splice(index, 1);
        reject(new Error(`timed out waiting for ${method}`));
      }, 15000);
      eventWaiters.push(waiter);
    });
  }

  async function openPage(file, width, { reducedMotion = false, javascript = true } = {}) {
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    const pageCall = (method, params = {}) => call(method, params, sessionId);
    await Promise.all([pageCall("Page.enable"), pageCall("Runtime.enable"), pageCall("DOM.enable")]);
    await pageCall("Emulation.setDeviceMetricsOverride", {
      width, height: 2200, deviceScaleFactor: 1, mobile: false,
      screenWidth: width, screenHeight: 2200,
    });
    await pageCall("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" }],
    });
    if (!javascript) await pageCall("Emulation.setScriptExecutionDisabled", { value: true });
    const loaded = waitFor("Page.loadEventFired", sessionId);
    await pageCall("Page.navigate", { url: pathToFileURL(file).href });
    await loaded;
    if (javascript) await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      async evaluate(expression) {
        const result = await pageCall("Runtime.evaluate", { expression, returnByValue: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "page evaluation failed");
        return result.result.value;
      },
      async html() {
        const { root } = await pageCall("DOM.getDocument", { depth: 0 });
        const { outerHTML } = await pageCall("DOM.getOuterHTML", { nodeId: root.nodeId });
        return outerHTML;
      },
      async screenshot(output) {
        const { data } = await pageCall("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true });
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
      setTimeout(() => child.kill("SIGKILL"), 250).unref();
      cleanupProfile(profile);
    },
  };
}

function parseResult(encoded) {
  if (!encoded) fail("rendered page did not return responsive diagnostics");
  return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
}

try {
  const chrome = chromeCandidates.find(existsSync);
  if (!chrome) fail("Chrome was not found; set CHROME_BIN to a Chromium-based browser");
  const outputDir = arg("--out-dir");
  if (!outputDir) fail("--out-dir is required");
  mkdirSync(outputDir, { recursive: true });

  const temp = mkdtempSync(join(tmpdir(), "dots-html-visual-"));
  const base = assemble({
    title: "A deliberately long release-readiness title that exercises responsive status placement",
    context: "component validation / responsive proof",
    dek: "Representative components rendered together to catch clipping, hidden content, and weak mobile transformations.",
    status: "verified",
    footer: "Validation fixture: representative catalog components.",
    body: bodyFixture(),
    components: ["toc-rail", "callout", "process-steps", "comparison-grid", "data-table", "wide-figure", "evidence-gallery", "page-behavior"],
  });
  const structuralFailures = checkArtifact(base);
  if (structuralFailures.length) fail(`fixture structural checks: ${structuralFailures.map((failure) => failure.code).join(", ")}`);
  const lightPath = join(temp, "light.html");
  const darkPath = join(temp, "dark.html");
  const withDiagnostics = base.replace("</body>", `${diagnosticScript()}\n</body>`);
  writeFileSync(lightPath, withDiagnostics);
  writeFileSync(darkPath, withDiagnostics.replace('<html lang="en">', '<html lang="en" data-theme="dark">'));

  const browser = await launchChrome(chrome);
  const checks = [];
  try {
    for (const width of [1280, 768, 360, 320]) {
      for (const [theme, file] of [["light", lightPath], ["dark", darkPath]]) {
        const page = await browser.openPage(file, width);
        const result = parseResult(await page.evaluate('document.documentElement.getAttribute("data-responsive-check")'));
        if (result.viewport !== width) fail(`${theme} requested ${width}px but Chrome rendered ${result.viewport}px`);
        if (result.failures.length) fail(`${theme} ${width}px: ${result.failures.join("; ")}`);
        await page.screenshot(join(outputDir, `${width}-${theme}.png`));
        await page.close();
        checks.push({ width, theme, failures: 0 });
      }
    }
    const reducedPage = await browser.openPage(lightPath, 360, { reducedMotion: true });
    const reduced = parseResult(await reducedPage.evaluate('document.documentElement.getAttribute("data-responsive-check")'));
    if (reduced.failures.length) fail(`reduced motion: ${reduced.failures.join("; ")}`);
    await reducedPage.close();

    const noJsPage = await browser.openPage(lightPath, 360, { javascript: false });
    const noJs = await noJsPage.html();
    await noJsPage.close();
    for (const text of ["Verification path", "Stack the status below the title.", "Review the screenshots"]) {
      if (!noJs.includes(text)) fail(`JS-off output is missing "${text}"`);
    }
  } finally {
    await browser.close();
  }

  rmSync(temp, { recursive: true, force: true });
  process.stdout.write(JSON.stringify({ ok: true, chrome, outputDir, checks, reducedMotion: "pass", jsOff: "pass" }, null, 2) + "\n");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
