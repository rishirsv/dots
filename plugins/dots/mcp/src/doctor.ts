import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { AppConfig } from "./config";
import { getConfigDir, getConfigPath, loadConfig } from "./config";
import { inspectCodexIntegration } from "./codex-integration";
import { browserLoginStateExists, loginVerificationMarkerPath } from "./browser-login";
import { getServiceStatus } from "./service";
import { tunnelStatus } from "./tunnel";
import { getTunnelServiceStatus } from "./tunnel-service";
import { readLauncherBrowserHostDescriptor } from "./launcher-browser-host";

export type CheckStatus = "ok" | "warning" | "error";

export interface DoctorCheck {
  id: string;
  status: CheckStatus;
  message: string;
  detail?: string;
}

export interface DoctorReport {
  ok: boolean;
  mode?: AppConfig["mode"];
  checks: DoctorCheck[];
}

function secureFile(path: string): boolean {
  if (process.platform === "win32") return true;
  return (statSync(path).mode & 0o077) === 0;
}

function configuredBuildId(config: AppConfig): string | null {
  const command = config.runtimeCommand;
  const entry = command.find(part => /[/\\]app[/\\]cli\.js$/.test(part));
  const launcher = command.find(part => /[/\\]bin[/\\]portal(?:\.cmd)?$/.test(part));
  const root = entry ? dirname(dirname(resolve(entry))) : launcher ? dirname(dirname(resolve(launcher))) : null;
  if (!root) return null;
  try {
    const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8")) as { bundleId?: unknown };
    return typeof manifest.bundleId === "string" && /^[a-f0-9]{64}$/.test(manifest.bundleId) ? manifest.bundleId : null;
  } catch { return null; }
}

export function browserExecutionCheck(value: unknown): DoctorCheck {
  const state = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const lastFailure = state.lastFailure && typeof state.lastFailure === "object"
    ? state.lastFailure as Record<string, unknown> : {};
  const failure = typeof lastFailure.code === "string" ? lastFailure.code.slice(0, 100) : undefined;
  const at = typeof lastFailure.at === "string" ? lastFailure.at.slice(0, 40) : undefined;
  const phase = state.phase === "active" ? "active" : "idle";
  if (state.browser === "degraded") return {
    id: "browser-execution", status: "error",
    message: `Browser execution is degraded (${phase}); restart Portal before a new turn`,
    ...(failure ? { detail: `Last failure: ${failure}${at ? ` at ${at}` : ""}.` } : {}),
  };
  if (state.browser === "connected") return {
    id: "browser-execution", status: "ok", message: `Managed browser is connected (${phase}); no inference was sent by status`,
  };
  return {
    id: "browser-execution", status: "warning",
    message: `Browser execution is unverified (${phase}); run an authenticated canary before treating it as ready`,
    ...(failure ? { detail: `Last failure: ${failure}${at ? ` at ${at}` : ""}.` } : {}),
  };
}

async function proxyCheck(config: AppConfig): Promise<DoctorCheck[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);
  try {
    const response = await fetch(`http://${config.host}:${config.port}/healthz`, { signal: controller.signal });
    if (!response.ok) return [{ id: "proxy", status: "error", message: `Responses proxy returned HTTP ${response.status}` }];
    const body = await response.json() as Record<string, unknown>;
    if (body.service !== "portal") {
      return [{ id: "proxy", status: "error", message: "The configured port belongs to another service" }];
    }
    if (body.broker_ready !== true) {
      return [{
        id: "proxy",
        status: "error",
        message: "Responses proxy is running but its bound-turn broker is unavailable",
        ...(typeof body.broker_error === "string" ? { detail: body.broker_error } : {}),
      }];
    }
    if (body.status !== "ok") {
      return [{ id: "proxy", status: "error", message: "Responses proxy is not healthy" }];
    }
    if (body.mode !== config.mode) {
      return [{ id: "proxy", status: "error", message: `Daemon is running in ${String(body.mode)} mode; config requires ${config.mode}` }];
    }
    if (body.version !== config.releaseVersion) {
      return [{ id: "proxy", status: "error", message: `Daemon version is ${String(body.version)}; config requires ${config.releaseVersion}` }];
    }
    if (body.accepting_turns !== true) {
      return [{
        id: "proxy",
        status: "error",
        message: "Responses proxy is drained and is not accepting Codex turns",
      }];
    }
    const configured = configuredBuildId(config);
    const loaded = typeof body.loaded_build_id === "string" ? body.loaded_build_id : null;
    const builds: DoctorCheck = configured && loaded && configured !== loaded
      ? { id: "build", status: "error", message: "Running daemon differs from the configured Portal build; restart Portal completely", detail: `daemon=${loaded.slice(0, 12)} configured=${configured.slice(0, 12)}` }
      : { id: "build", status: "warning", message: `Daemon build: ${loaded?.slice(0, 12) ?? "unknown"}; MCP worker loaded build: unknown${configured ? `; configured build: ${configured.slice(0, 12)}` : ""}`, detail: "Restart both Portal daemon and tunnel/MCP worker after installation; worker identity cannot yet be observed from status." };
    return [
      { id: "proxy", status: "ok", message: `Responses transport is healthy on 127.0.0.1:${config.port}` },
      browserExecutionCheck(body.browser_execution),
      builds,
    ];
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return [{ id: "proxy", status: "error", message: "Responses proxy is not reachable", detail }];
  } finally {
    clearTimeout(timeout);
  }
}

export async function runDoctor(): Promise<DoctorReport> {
  const checks: DoctorCheck[] = [];
  let config: AppConfig;
  try {
    config = loadConfig();
    checks.push({ id: "config", status: "ok", message: `Configuration is valid (${getConfigPath()})` });
  } catch (error) {
    checks.push({ id: "config", status: "error", message: "Configuration is invalid", detail: error instanceof Error ? error.message : String(error) });
    return { ok: false, checks };
  }

  if (!existsSync(config.chromeExecutablePath)) {
    checks.push({ id: "chrome", status: "error", message: `Chrome executable is missing: ${config.chromeExecutablePath}` });
  } else {
    checks.push({ id: "chrome", status: "ok", message: `Chrome executable found: ${config.chromeExecutablePath}` });
  }
  if (config.browserHost === "launcher") {
    // Retention lives entirely in the host. A stale or missing descriptor means every turn either
    // fails to lease a surface or silently falls back to a fresh conversation.
    try {
      const descriptor = readLauncherBrowserHostDescriptor(config.browserHostDescriptorPath!);
      checks.push({
        id: "launcher-host",
        status: "ok",
        message: `Launcher browser host is running (pid ${descriptor.pid}) with `
          + `${Object.keys(descriptor.surfaceTargets).length} live surface(s)`,
      });
    } catch (error) {
      checks.push({
        id: "launcher-host",
        status: "error",
        message: "Launcher browser host is not available; retained conversations cannot be leased",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }
  if (!browserLoginStateExists(config)) {
    checks.push({ id: "login", status: "error", message: "ChatGPT login state is missing or unverified; run `portal login`" });
  } else if (!secureFile(config.storageStatePath)) {
    checks.push({ id: "login", status: "error", message: `ChatGPT login state is readable by other users: ${config.storageStatePath}` });
  } else if (!secureFile(loginVerificationMarkerPath(config.storageStatePath))) {
    checks.push({ id: "login", status: "error", message: "ChatGPT login verification marker is readable by other users" });
  } else {
    let verifiedAt: string | undefined;
    try {
      const marker = JSON.parse(readFileSync(loginVerificationMarkerPath(config.storageStatePath), "utf8")) as { verifiedAt?: unknown };
      if (typeof marker.verifiedAt === "string" && Number.isFinite(Date.parse(marker.verifiedAt))) verifiedAt = marker.verifiedAt;
    } catch { /* browserLoginStateExists already checked validity; keep age unknown */ }
    const ageDays = verifiedAt ? Math.max(0, Math.floor((Date.now() - Date.parse(verifiedAt)) / 86_400_000)) : undefined;
    checks.push({ id: "login", status: "warning", message: `ChatGPT login was last verified ${ageDays === undefined ? "at an unknown time" : `${ageDays} day(s) ago`}; status does not recheck the account`, ...(verifiedAt ? { detail: `Last verification: ${verifiedAt}` } : {}) });
  }

  const codex = inspectCodexIntegration();
  if (!codex.installed) {
    checks.push({ id: "codex", status: "error", message: "Codex model route is not installed" });
  } else if (codex.errors.length > 0) {
    checks.push({ id: "codex", status: "error", message: "Codex integration is inconsistent", detail: codex.errors.join("; ") });
  } else if (!codex.active) {
    checks.push({ id: "codex", status: "error", message: "Portal's Codex route is installed but inactive; run `portal start`" });
  } else {
    checks.push({ id: "codex", status: "ok", message: "Portal's Codex route is installed and active" });
  }

  const service = getServiceStatus();
  if (!service.supported) {
    checks.push({ id: "service", status: "warning", message: "Managed service is unavailable on this OS; keep `serve` running manually" });
  } else if (!service.installed || !service.loaded) {
    checks.push({ id: "service", status: "error", message: "macOS background service is not installed and loaded" });
  } else {
    checks.push({ id: "service", status: "ok", message: "macOS background service is loaded" });
  }
  checks.push(...await proxyCheck(config));

  {
    const settings = config.tunnel!;
    if (!existsSync(settings.binaryPath)) {
      checks.push({ id: "tunnel-binary", status: "error", message: `tunnel-client is missing: ${settings.binaryPath}` });
    } else {
      checks.push({ id: "tunnel-binary", status: "ok", message: "Pinned openai/tunnel-client binary is installed" });
    }
    if (!existsSync(settings.runtimeKeyFile)) {
      checks.push({ id: "tunnel-key", status: "error", message: "Tunnel runtime key file is missing" });
    } else if (!secureFile(settings.runtimeKeyFile)) {
      checks.push({ id: "tunnel-key", status: "error", message: "Tunnel runtime key file has unsafe permissions" });
    } else {
      checks.push({ id: "tunnel-key", status: "ok", message: "Tunnel runtime key is stored privately" });
    }
    const tunnelService = getTunnelServiceStatus();
    checks.push(tunnelService.installed && tunnelService.loaded && tunnelService.running
      ? { id: "tunnel-service", status: "ok", message: "macOS tunnel service is installed, loaded, and running" }
      : { id: "tunnel-service", status: "error", message: "macOS tunnel service is not fully running", detail: JSON.stringify(tunnelService) });
    const runtime = tunnelStatus(config);
    checks.push(runtime.ok
      ? { id: "tunnel-runtime", status: "ok", message: "Tunnel runtime reports healthy and ready" }
      : { id: "tunnel-runtime", status: "error", message: "Tunnel runtime is not ready", detail: runtime.detail });
    checks.push({
      id: "connector",
      status: "warning",
      message: `Local checks cannot prove that ChatGPT connector ${JSON.stringify(config.appName)} is attached to this tunnel`,
      detail: "Verify it once at https://chatgpt.com/#settings/Plugins while the tunnel is ready.",
    });
  }

  return {
    ok: !checks.some(check => check.status === "error"),
    mode: config.mode,
    checks,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const icon: Record<CheckStatus, string> = { ok: "✓", warning: "!", error: "✗" };
  const lines = report.checks.flatMap(check => [
    `${icon[check.status]} ${check.message}`,
    ...(check.detail ? [`  ${check.detail}`] : []),
  ]);
  lines.push(report.ok ? "Doctor result: transport ready; authenticated browser execution is not verified by status" : "Doctor result: not ready");
  return `${lines.join("\n")}\n`;
}
