import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

export const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

function fail(message) { throw new Error(`capture-artifact.mjs: ${message}`); }

function layoutDiagnostic() {
  const viewport = document.documentElement.clientWidth;
  const findings = [];
  const visible = (element) => {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && element.getClientRects().length > 0;
  };
  const add = (rule, element, message) => {
    const section = element?.closest("section[id]");
    const component = element?.closest("[data-component]");
    const name = component?.getAttribute("data-component") ?? null;
    const peers = name ? [...document.querySelectorAll("[data-component]")].filter((item) => item.getAttribute("data-component") === name) : [];
    findings.push({ rule, section: section?.id ?? null, component: name, index: component ? peers.indexOf(component) : null, message });
  };
  const intersects = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const contains = (outer, inner) => outer.left <= inner.left + 1 && outer.right >= inner.right - 1 && outer.top <= inner.top + 1 && outer.bottom >= inner.bottom - 1;
  const channels = (value) => {
    const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
    return { rgb: parts.slice(0, 3), alpha: parts[3] ?? 1 };
  };
  const composite = (front, back) => front.rgb.map((number, index) => number * front.alpha + back[index] * (1 - front.alpha));
  const luminance = (rgb) => {
    const linear = rgb.map((number) => { const x = number / 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; });
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  const background = (element) => {
    let color = [255, 255, 255];
    const layers = [];
    for (let node = element; node; node = node.parentElement) layers.push(node);
    for (const node of layers.reverse()) color = composite(channels(getComputedStyle(node).backgroundColor), color);
    return color;
  };

  if (document.documentElement.scrollWidth > viewport + 1 || document.body.scrollWidth > viewport + 1)
    add("overflow", document.body, `page is ${Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)}px wide at ${viewport}px`);
  document.querySelectorAll(".page, [data-component], section, figure, .process-step, .evidence-item").forEach((element) => {
    if (!visible(element)) return;
    const rect = element.getBoundingClientRect();
    if (rect.left < -1 || rect.right > viewport + 1) add("overflow", element, `${element.getAttribute("data-component") || element.tagName.toLowerCase()} leaves viewport (${Math.round(rect.left)}..${Math.round(rect.right)})`);
  });
  document.querySelectorAll("svg").forEach((svg) => {
    if (!visible(svg)) return;
    const labels = [...svg.querySelectorAll("text")].filter(visible);
    const shapes = [...svg.querySelectorAll("rect, circle, ellipse, polygon")].filter(visible);
    labels.forEach((label, index) => {
      const scale = svg.viewBox?.baseVal?.width ? svg.getBoundingClientRect().width / svg.viewBox.baseVal.width : 1;
      const size = parseFloat(getComputedStyle(label).fontSize) * scale;
      if (size < 11) add("svg-min-size", label, `SVG label is ${size.toFixed(1)}px; minimum is 11px`);
      const box = label.getBoundingClientRect();
      labels.slice(index + 1).forEach((other) => {
        if (intersects(box, other.getBoundingClientRect())) add("svg-overlap", label, `SVG labels overlap: ${label.textContent.trim()} / ${other.textContent.trim()}`);
      });
      shapes.forEach((shape) => {
        const shapeBox = shape.getBoundingClientRect();
        if (intersects(box, shapeBox) && !contains(shapeBox, box) && !contains(box, shapeBox))
          add("svg-overlap", label, `SVG label touches a node shape: ${label.textContent.trim()}`);
      });
    });
  });
  document.querySelectorAll("h1,h2,h3,p,li,td,th,figcaption,.stat-value,.stat-label,svg text").forEach((element) => {
    if (!visible(element) || !element.textContent.trim()) return;
    const fg = channels(getComputedStyle(element).color);
    if (fg.rgb.length !== 3) return;
    const bg = background(element);
    const ratio = contrast(composite(fg, bg), bg);
    if (ratio < 4.5) add("contrast", element, `text contrast is ${ratio.toFixed(2)}:1; minimum is 4.5:1`);
  });
  document.querySelectorAll(".comparison-grid").forEach((grid) => {
    const cards = [...grid.children].filter((child) => child.classList.contains("option-card"));
    const tracks = getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(Boolean).length;
    if (Number(grid.dataset.columns) !== cards.length || (viewport > 680 && tracks !== cards.length) || (viewport <= 680 && tracks !== 1))
      add("comparison-grid", grid, `${cards.length} cards render in ${tracks} tracks`);
  });
  const toc = document.querySelector(".toc-compact");
  if (toc && viewport < 1264 && toc.open) add("toc", toc, "compact TOC is expanded by default");
  const gallery = [...document.querySelectorAll(".evidence-item")];
  if (gallery.length && viewport <= 680 && new Set(gallery.map((item) => Math.round(item.getBoundingClientRect().left))).size !== 1)
    add("gallery", gallery[0], "mobile gallery is not one column");
  return { viewport, findings };
}

export async function launchChrome(chrome) {
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
  const pageEvents = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result ?? {});
      return;
    }
    if (message.sessionId && pageEvents.has(message.sessionId)) {
      const events = pageEvents.get(message.sessionId);
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error")
        events.push({ rule: "console", message: message.params.args.map((arg) => arg.value ?? arg.description ?? "error").join(" ") });
      if (message.method === "Runtime.exceptionThrown")
        events.push({ rule: "console", message: message.params.exceptionDetails?.text ?? "uncaught exception" });
      if (message.method === "Network.requestWillBeSent" && /^https?:/i.test(message.params.request.url))
        events.push({ rule: "external-network", message: message.params.request.url });
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
    pinnedTheme = false,
  } = {}) {
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    const events = [];
    pageEvents.set(sessionId, events);
    const pageCall = (method, params = {}) => call(method, params, sessionId);
    await Promise.all([pageCall("Page.enable"), pageCall("Runtime.enable"), pageCall("DOM.enable"), pageCall("Network.enable")]);
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
    if (javascript && !pinnedTheme) {
      await pageCall("Runtime.evaluate", {
        expression: `document.documentElement.setAttribute("data-theme", ${JSON.stringify(theme)})`,
      });
    }
    if (javascript) await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));

    const images = await pageCall("Runtime.evaluate", {
      expression: `Promise.all(Array.from(document.images, async (image) => {
        try { await image.decode(); } catch { /* Report visible broken images below. */ }
        if (image.getClientRects().length && getComputedStyle(image).visibility !== "hidden" && (!image.naturalWidth || !image.naturalHeight)) {
          return image.currentSrc || image.src || "image without source";
        }
        return null;
      })).then((items) => items.filter(Boolean))`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (images.exceptionDetails) events.push({ rule: "image-decode", message: images.exceptionDetails.text ?? "image decode failed" });
    for (const source of images.result.value ?? []) events.push({ rule: "image-decode", message: `visible image failed to decode: ${source}` });

    return {
      async diagnose() {
        const result = await pageCall("Runtime.evaluate", {
          expression: `(${layoutDiagnostic.toString()})()`,
          returnByValue: true,
        });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "layout diagnostic failed");
        return { ...result.result.value, findings: [...result.result.value.findings, ...events.map((event) => ({ ...event, section: null, component: null, index: null }))] };
      },
      async html() {
        const { root } = await pageCall("DOM.getDocument", { depth: 0 });
        const { outerHTML } = await pageCall("DOM.getOuterHTML", { nodeId: root.nodeId });
        return outerHTML;
      },
      async screenshot(output, { fullPage = true } = {}) {
        if (fullPage) await pageCall("Runtime.evaluate", {
          expression: `document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-in"))`,
        });
        const { data } = await pageCall("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: fullPage,
          fromSurface: true,
        });
        if (output) writeFileSync(output, Buffer.from(data, "base64"));
        return data;
      },
      close: async () => { pageEvents.delete(sessionId); await call("Target.closeTarget", { targetId }); },
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
        catch { /* The OS cleans up a profile Chrome has not released yet. */ }
      }, 500);
    },
  };
}
