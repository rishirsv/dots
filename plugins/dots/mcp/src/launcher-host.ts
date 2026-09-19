import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { chromium, type BrowserContext, type Page } from "playwright-core";
import { dirname, join } from "node:path";
import {
  atomicWriteFile,
  defaultLauncherDescriptorPath,
  expandUserPath,
  getConfigDir,
  type AppConfig,
} from "./config";
import {
  LAUNCHER_BROWSER_HOST_KIND,
  LAUNCHER_BROWSER_IDLE_URL,
  type LauncherBrowserHostDescriptor,
} from "./launcher-browser-host";

/**
 * The launcher browser host owns Chrome and every ChatGPT surface inside it, so a Codex thread can
 * keep one visible conversation across turns. Portal's worker is only a client: it leases a surface
 * per turn over the control channel below and resolves it through the descriptor's CDP target map.
 *
 * Retention state lives here and nowhere else — which surface holds which conversation, whether a
 * lease reused one, and whether the user closed the tab out from under an active turn.
 */

/** The client validates this partition label exactly; it names the owned profile, not an Electron partition. */
const LAUNCHER_PARTITION = "persist:portal-chatgpt";
/** Surfaces and tokens are matched against fixed client-side patterns. */
const SURFACE_ID_BYTES = 24;
const CONTROL_TOKEN_BYTES = 32;
/** A turn whose helper stops heartbeating has lost its process; its surface must not leak. */
const TURN_HEARTBEAT_GRACE_MS = 60_000;

export interface LauncherHostOptions {
  chromeExecutablePath: string;
  storageStatePath: string;
  profileDir: string;
  descriptorPath: string;
  helperExecutable: string;
  helperScript: string;
  headless?: boolean;
  /** Retained surfaces are cheap but not free; beyond this the least recently used one is closed. */
  maxRetainedSurfaces?: number;
}

export interface LauncherHostHandle {
  descriptorPath: string;
  cdpEndpoint: string;
  controlEndpoint: string;
  close(): Promise<void>;
}

interface Surface {
  id: string;
  page: Page;
  targetId: string;
  /** Set only once a completed turn asked to retain this conversation. */
  conversationKey?: string;
  connectorIdentity?: string;
  connectorBound: boolean;
  lastUsedAt: number;
  closedByUser: boolean;
}

interface ActiveTurn {
  traceId: string;
  helperPid: number;
  surfaceId: string;
  lastHeartbeatAt: number;
  /** A tab the user closed mid-turn is terminal: the client maps this to a browser-tab-closed error. */
  cancelled: boolean;
}

function surfaceId(): string {
  return randomBytes(SURFACE_ID_BYTES).toString("base64url");
}

async function freePort(): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close(() => reject(new Error("Could not reserve a loopback port")));
        return;
      }
      const { port } = address;
      probe.close(() => resolve(port));
    });
  });
}

async function targetIdFor(context: BrowserContext, page: Page): Promise<string> {
  const session = await context.newCDPSession(page);
  try {
    const { targetInfo } = await session.send("Target.getTargetInfo");
    return targetInfo.targetId;
  } finally {
    await session.detach().catch(() => {});
  }
}

/**
 * Portal's canonical login artifact is a Playwright storage state, but a CDP-attachable browser
 * needs a persistent profile. Seed the profile once; Chrome owns the session cookies afterwards.
 */
async function seedAuthentication(context: BrowserContext, storageStatePath: string): Promise<void> {
  const cookies = await context.cookies("https://chatgpt.com");
  if (cookies.length > 0) return;
  if (!existsSync(storageStatePath)) {
    throw new Error(`Launcher host cannot authenticate: ChatGPT login state is missing at ${storageStatePath}`);
  }
  const state = JSON.parse(readFileSync(storageStatePath, "utf8")) as {
    cookies?: Parameters<BrowserContext["addCookies"]>[0];
  };
  if (!Array.isArray(state.cookies) || state.cookies.length === 0) {
    throw new Error("Launcher host cannot authenticate: stored ChatGPT login state has no cookies");
  }
  await context.addCookies(state.cookies);
}

/**
 * Resolve the host's runtime paths from Portal's configuration. The helper subprocess that drives
 * every launcher turn is advertised here, so it must be the runtime actually executing this code.
 */
export function launcherHostOptions(config: AppConfig): LauncherHostOptions {
  const entrypoint = process.argv[1];
  const bundledHelper = typeof entrypoint === "string"
    ? join(dirname(entrypoint), "browser-helper.cjs")
    : undefined;
  return {
    chromeExecutablePath: config.chromeExecutablePath,
    storageStatePath: config.storageStatePath,
    profileDir: join(getConfigDir(), "browser", "launcher-profile"),
    descriptorPath: config.browserHostDescriptorPath ?? defaultLauncherDescriptorPath(),
    helperExecutable: process.execPath,
    helperScript: bundledHelper && existsSync(bundledHelper)
      ? bundledHelper
      : new URL("./adapters/chatgpt-web/browser-helper-main.ts", import.meta.url).pathname,
    headless: config.headed !== true,
  };
}

export async function startLauncherBrowserHost(
  options: LauncherHostOptions,
): Promise<LauncherHostHandle> {
  const descriptorPath = expandUserPath(options.descriptorPath);
  const profileDir = expandUserPath(options.profileDir);
  const maxRetainedSurfaces = options.maxRetainedSurfaces ?? 8;
  for (const path of [options.helperExecutable, options.helperScript]) {
    if (!existsSync(path)) {
      throw new Error(`Launcher host requires an existing helper path: ${path}`);
    }
  }
  mkdirSync(profileDir, { recursive: true, mode: 0o700 });

  const cdpPort = await freePort();
  const context = await chromium.launchPersistentContext(profileDir, {
    executablePath: options.chromeExecutablePath,
    headless: options.headless === true,
    args: [
      `--remote-debugging-port=${cdpPort}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-mode",
    ],
  });

  const surfaces = new Map<string, Surface>();
  const turns = new Map<string, ActiveTurn>();
  const controlToken = randomBytes(CONTROL_TOKEN_BYTES).toString("base64url");
  let closed = false;

  const registerSurface = async (page: Page): Promise<Surface> => {
    const surface: Surface = {
      id: surfaceId(),
      page,
      targetId: await targetIdFor(context, page),
      connectorBound: false,
      lastUsedAt: Date.now(),
      closedByUser: false,
    };
    // A surface the user closes is gone for good; mark it so an active turn fails terminally
    // instead of waiting on a page that will never answer.
    page.once("close", () => {
      surface.closedByUser = true;
      surfaces.delete(surface.id);
      for (const turn of turns.values()) {
        if (turn.surfaceId === surface.id) turn.cancelled = true;
      }
      writeDescriptor();
    });
    surfaces.set(surface.id, surface);
    return surface;
  };

  await seedAuthentication(context, expandUserPath(options.storageStatePath));
  const idlePage = context.pages()[0] ?? await context.newPage();
  await idlePage.goto(LAUNCHER_BROWSER_IDLE_URL, { waitUntil: "domcontentloaded" }).catch(() => {});
  const idleSurface = await registerSurface(idlePage);

  const createdAt = new Date().toISOString();

  function descriptor(controlPort: number): LauncherBrowserHostDescriptor {
    return {
      version: 3,
      kind: LAUNCHER_BROWSER_HOST_KIND,
      profile: "production",
      pid: process.pid,
      endpoint: `http://127.0.0.1:${cdpPort}`,
      control: { endpoint: `http://127.0.0.1:${controlPort}`, token: controlToken },
      helper: { executable: options.helperExecutable, script: options.helperScript },
      partition: LAUNCHER_PARTITION,
      idleUrl: LAUNCHER_BROWSER_IDLE_URL,
      surfaceId: idleSurface.id,
      surfaceTargets: Object.fromEntries([...surfaces.values()].map(entry => [entry.id, entry.targetId])),
      createdAt,
    };
  }

  let writeDescriptor = (): void => {};

  const authorized = (request: Request): boolean =>
    request.headers.get("authorization") === `Bearer ${controlToken}`;
  const json = (body: unknown, status = 200): Response => Response.json(body, { status });

  /** Reclaim surfaces whose helper died mid-turn, and keep retention bounded. */
  const reapStaleSurfaces = async (): Promise<void> => {
    const now = Date.now();
    for (const turn of [...turns.values()]) {
      if (now - turn.lastHeartbeatAt <= TURN_HEARTBEAT_GRACE_MS) continue;
      turns.delete(turn.traceId);
      const surface = surfaces.get(turn.surfaceId);
      if (surface && !surface.conversationKey) await closeSurface(surface);
    }
    const retained = [...surfaces.values()]
      .filter(entry => entry.conversationKey && entry.id !== idleSurface.id)
      .sort((a, b) => a.lastUsedAt - b.lastUsedAt);
    const leased = new Set([...turns.values()].map(turn => turn.surfaceId));
    for (const surface of retained.slice(0, Math.max(0, retained.length - maxRetainedSurfaces))) {
      if (!leased.has(surface.id)) await closeSurface(surface);
    }
  };

  const closeSurface = async (surface: Surface): Promise<void> => {
    if (surface.id === idleSurface.id) return;
    surfaces.delete(surface.id);
    await surface.page.close().catch(() => {});
    writeDescriptor();
  };

  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      if (request.method !== "POST") return new Response("Not found", { status: 404 });
      if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
      const body = await request.json().catch(() => ({})) as Record<string, unknown>;

      if (url.pathname === "/v1/turn/start") {
        await reapStaleSurfaces();
        const traceId = String(body.traceId ?? "");
        const helperPid = Number(body.helperPid);
        if (!traceId || !Number.isInteger(helperPid)) {
          return json({ error: "traceId and helperPid are required" }, 400);
        }
        const conversationKey = typeof body.conversationKey === "string" ? body.conversationKey : undefined;
        const retainedRequired = body.requireRetainedConversation === true;
        const retained = conversationKey
          ? [...surfaces.values()].find(entry => entry.conversationKey === conversationKey && !entry.closedByUser)
          : undefined;
        if (retainedRequired && !retained) {
          return json({
            code: "retained_conversation_unavailable",
            error: "The retained ChatGPT conversation is no longer available",
          }, 409);
        }
        let surface = retained;
        if (!surface) {
          surface = await registerSurface(await context.newPage());
          if (conversationKey) surface.conversationKey = conversationKey;
        }
        const connectorIdentity = typeof body.connectorIdentity === "string" ? body.connectorIdentity : undefined;
        // A retained lease proves only that the tab survived. A connector bound under a different
        // identity must be re-selected by the worker rather than assumed.
        const connectorBound = surface.connectorBound
          && (connectorIdentity === undefined || surface.connectorIdentity === connectorIdentity);
        surface.lastUsedAt = Date.now();
        if (connectorIdentity !== undefined) surface.connectorIdentity = connectorIdentity;
        turns.set(traceId, {
          traceId,
          helperPid,
          surfaceId: surface.id,
          lastHeartbeatAt: Date.now(),
          cancelled: false,
        });
        writeDescriptor();
        return json({ surfaceId: surface.id, reused: retained !== undefined, connectorBound });
      }

      if (url.pathname === "/v1/turn/heartbeat") {
        const turn = turns.get(String(body.traceId ?? ""));
        if (!turn) return json({ error: "unknown turn" }, 404);
        if (turn.cancelled) {
          return json({ code: "turn_cancelled", error: `Browser turn ${turn.traceId} was cancelled by the user` }, 409);
        }
        turn.lastHeartbeatAt = Date.now();
        const surface = surfaces.get(turn.surfaceId);
        if (surface) surface.lastUsedAt = Date.now();
        return json({ ok: true });
      }

      if (url.pathname === "/v1/turn/end") {
        const traceId = String(body.traceId ?? "");
        const turn = turns.get(traceId);
        if (!turn) return json({ cancelledByUser: false });
        turns.delete(traceId);
        const surface = surfaces.get(turn.surfaceId);
        const cancelledByUser = turn.cancelled;
        if (surface) {
          const retain = body.status === "completed" && body.retain === true && !cancelledByUser;
          if (retain) {
            surface.lastUsedAt = Date.now();
            if (body.connectorBound === true) surface.connectorBound = true;
          } else {
            await closeSurface(surface);
          }
        }
        await reapStaleSurfaces();
        writeDescriptor();
        return json({ cancelledByUser });
      }

      if (url.pathname === "/v1/turn/release") {
        const conversationKey = String(body.conversationKey ?? "");
        if (!/^[a-f0-9]{64}$/.test(conversationKey)) return json({ error: "invalid conversationKey" }, 400);
        const leased = new Set([...turns.values()].map(turn => turn.surfaceId));
        const matches = [...surfaces.values()]
          .filter(entry => entry.conversationKey === conversationKey && !leased.has(entry.id));
        for (const surface of matches) await closeSurface(surface);
        return json({ released: matches.length });
      }

      return new Response("Not found", { status: 404 });
    },
  });

  const controlPort = server.port;
  if (typeof controlPort !== "number") throw new Error("Launcher control server did not bind a loopback port");
  writeDescriptor = () => {
    if (closed) return;
    atomicWriteFile(descriptorPath, `${JSON.stringify(descriptor(controlPort), null, 2)}\n`, { mode: 0o600 });
  };
  writeDescriptor();

  return {
    descriptorPath,
    cdpEndpoint: `http://127.0.0.1:${cdpPort}`,
    controlEndpoint: `http://127.0.0.1:${controlPort}`,
    async close() {
      closed = true;
      await server.stop(true);
      await context.close().catch(() => {});
      rmSync(descriptorPath, { force: true });
    },
  };
}
