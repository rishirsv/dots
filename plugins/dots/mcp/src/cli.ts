#!/usr/bin/env bun
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { existsSync, rmSync } from "node:fs";
import { stdin, stdout } from "node:process";
import { checkBrowserEngine, loginToChatGpt } from "./browser-login";
import { getConfigDir, getConfigPath, loadConfig, loadConfigForSetup } from "./config";
import {
  activateCodexIntegration,
  deactivateCodexIntegration,
  inspectCodexIntegration,
  readCodexSubagentProtocol,
  setCodexSubagentProtocol,
  uninstallCodexIntegration,
} from "./codex-integration";
import { formatDoctorReport, runDoctor } from "./doctor";
import { runChatGptMcpMain } from "./adapters/chatgpt-web/mcp-main";
import { runCommand } from "./process";
import { startServer } from "./server";
import { acquireServiceDrain, assertServiceIdle, cancelActiveTurns, getServiceStatus, installService, interruptActiveTurn, restartService, startService, stopService, uninstallService } from "./service";
import { existingFullSetupCredentials, preflightSetup, setup, type SetupOptions } from "./setup";
import { installRuntimeKeyBytes, managedRuntimeKeyPath, stopTunnel, tunnelStatus, waitForTunnelReady } from "./tunnel";
import { getTunnelServiceStatus, restartTunnelService, startTunnelService, stopTunnelService, uninstallTunnelService } from "./tunnel-service";
import { VERSION } from "./version";

const HELP = `Portal ${VERSION}

Run ChatGPT Web Pro as a Codex model with every tool from the current task.

Usage:
  portal start [options]
  portal login
  portal status [--json]
  portal stop
  portal uninstall [--yes] [--purge-data]

Start options:
  --port NUMBER                Loopback Responses port (default: 17841)
  --chrome PATH                Google Chrome/Chromium executable used for account login
  --refresh-account-capabilities
                               Re-read the authenticated account's available Web models
  --tunnel-id ID               Existing OpenAI tunnel id (full mode)
  --runtime-key-file PATH      File containing a Tunnels Read+Use runtime key
  --replace-codex-route        Reversibly replace existing Responses or Voice route settings
  --restart-service            Explicitly restart this project's daemon after an update
  --login                      Refresh the stored ChatGPT login even if one exists

Global:
  --home PATH                  Override ~/.portal
  -h, --help
  -v, --version
`;

function takeOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  args.splice(index, 2);
  return value;
}

function takeFlag(args: string[], name: string): boolean {
  const index = args.indexOf(name);
  if (index < 0) return false;
  args.splice(index, 1);
  return true;
}

async function confirm(question: string): Promise<boolean> {
  if (!stdin.isTTY || !stdout.isTTY) return false;
  const reader = createInterface({ input: stdin, output: stdout });
  try {
    const answer = (await reader.question(`${question} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    reader.close();
  }
}

async function prompt(question: string): Promise<string> {
  if (!stdin.isTTY || !stdout.isTTY) return "";
  const reader = createInterface({ input: stdin, output: stdout });
  try { return (await reader.question(question)).trim(); }
  finally { reader.close(); }
}

async function secretPrompt(question: string): Promise<string> {
  if (!stdin.isTTY || !stdout.isTTY) return "";
  stdout.write(question);
  const muted = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
  const reader = createInterface({ input: stdin, output: muted, terminal: true });
  try { return (await reader.question("")).trim(); }
  finally {
    reader.close();
    stdout.write("\n");
  }
}

function assertNoArgs(args: string[]): void {
  if (args.length > 0) throw new Error(`Unknown arguments: ${args.join(" ")}`);
}

async function loginCommand(args: string[]): Promise<void> {
  assertNoArgs(args);
  const result = await loginToChatGpt(loadConfig());
  stdout.write(`ChatGPT login stored at ${result.storageStatePath}\n`);
}

async function setupCommand(args: string[]): Promise<void> {
  const preflightOnly = takeFlag(args, "--preflight-only");
  const portRaw = takeOption(args, "--port");
  const options: SetupOptions = {
    mode: "full",
    subagentProtocol: "compatibility-v1",
    acknowledgedUnofficial: true,
    ...(portRaw ? { port: Number(portRaw) } : {}),
  };
  const tunnelId = takeOption(args, "--tunnel-id");
  const runtimeKeyFile = takeOption(args, "--runtime-key-file");
  const chrome = takeOption(args, "--chrome");
  if (chrome) options.chromeExecutablePath = chrome;
  options.refreshAccountCapabilities = takeFlag(args, "--refresh-account-capabilities");
  if (tunnelId) options.tunnelId = tunnelId;
  if (runtimeKeyFile) options.runtimeKeyFile = runtimeKeyFile;
  options.forceLogin = takeFlag(args, "--login");
  options.replaceCodexRoute = takeFlag(args, "--replace-codex-route");
  options.restartService = takeFlag(args, "--restart-service");
  assertNoArgs(args);

  if (preflightOnly) {
    preflightSetup(options);
    stdout.write("Setup preflight complete.\n");
    return;
  }

  const existing = existsSync(getConfigPath()) ? loadConfigForSetup() : undefined;
  const reusableCredentials = existingFullSetupCredentials(existing);
  const needsTunnelId = !options.tunnelId && !reusableCredentials.tunnelId;
  const needsRuntimeKey = !options.runtimeKeyFile
    && !reusableCredentials.runtimeKey
    && !existsSync(managedRuntimeKeyPath());

  if ((needsTunnelId || needsRuntimeKey) && stdin.isTTY) {
    stdout.write("Portal needs an OpenAI tunnel and a runtime key with Tunnels Read + Use.\n");
    stdout.write("Tunnels: https://platform.openai.com/settings/organization/tunnels\n");
    stdout.write("Runtime keys: https://platform.openai.com/settings/organization/api-keys\n");
    if (needsTunnelId) options.tunnelId = await prompt("Tunnel id: ");
    if (needsRuntimeKey) {
      options.runtimeKeyValue = await secretPrompt("Runtime key (hidden): ");
    }
  }

  const result = await setup(options);
  stdout.write(result.connectorSetupRequired ? "Portal local runtime is running; connector setup is still required.\n" : "Portal is running and its Codex route is ready.\n");
  stdout.write(`Config: ${result.configPath}\n`);
  if (result.connectorSetupRequired) {
    stdout.write(`One account-level step remains: attach the tunnel to the ChatGPT connector named "Portal" and choose Allow all actions.\n`);
    stdout.write("Open: https://chatgpt.com/#settings/Plugins\n");
    stdout.write("Then run `portal start` again so Portal can verify the connector before installing the Codex route.\n");
  }
  if (result.codexRestartRequired) {
    stdout.write("Restart the Codex app once so its native model catalog refreshes through the installed route.\n");
  }
}

async function doctorCommand(args: string[]): Promise<void> {
  const json = takeFlag(args, "--json");
  assertNoArgs(args);
  const report = await runDoctor();
  stdout.write(json ? `${JSON.stringify(report, null, 2)}\n` : formatDoctorReport(report));
  if (!report.ok) process.exitCode = 1;
}

async function routeCommand(args: string[]): Promise<void> {
  const action = args.shift() ?? "status";
  assertNoArgs(args);
  const result = action === "status"
    ? (() => {
        const status = inspectCodexIntegration();
        return {
          installed: status.installed,
          active: status.active,
          ...(status.routeUrl ? { routeUrl: status.routeUrl } : {}),
          errors: status.errors,
        };
      })()
    : action === "connect"
      ? activateCodexIntegration()
      : action === "disconnect"
        ? deactivateCodexIntegration()
        : undefined;
  if (!result) throw new Error(`Unknown route action: ${action}`);
  stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

async function subagentsCommand(args: string[]): Promise<void> {
  const action = args.shift() ?? "status";
  assertNoArgs(args);
  const config = loadConfig();
  if (action === "status") {
    const integration = inspectCodexIntegration();
    stdout.write(`${JSON.stringify({
      protocol: readCodexSubagentProtocol(config.subagentProtocol),
      installed: integration.installed,
      active: integration.active,
    }, null, 2)}\n`);
    return;
  }
  if (action !== "compatibility-v1" && action !== "native") {
    throw new Error("Subagent protocol must be one of: status, compatibility-v1, native");
  }
  const journal = setCodexSubagentProtocol(config, action);
  stdout.write(`${JSON.stringify({
    protocol: journal.installed.subagent_protocol,
    codexRestartRequired: true,
    daemonRestartRequired: true,
  }, null, 2)}\n`);
}

async function serviceCommand(args: string[]): Promise<void> {
  const action = args.shift() ?? "status";
  assertNoArgs(args);
  const config = action === "status" ? undefined : loadConfig();
  if (action === "cancel-turns") {
    stdout.write(`${JSON.stringify(await cancelActiveTurns(config!), null, 2)}\n`);
    return;
  }
  const status = action === "status" ? getServiceStatus()
    : action === "install" ? installService(config!)
      : action === "start" ? startService()
        : action === "restart" ? await restartService(config!)
          : action === "stop" ? await stopService(config!)
            : undefined;
  if (!status) throw new Error(`Unknown service action: ${action}`);
  stdout.write(`${JSON.stringify(status, null, 2)}\n`);
}

async function interruptHookCommand(args: string[]): Promise<void> {
  assertNoArgs(args);
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of stdin) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.byteLength;
    if (bytes > 32 * 1024) throw new Error("Codex Interrupt hook payload is too large");
    chunks.push(buffer);
  }
  let payload: { hook_event_name?: unknown; session_id?: unknown; turn_id?: unknown };
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Codex Interrupt hook payload is not valid JSON");
  }
  const threadId = typeof payload.session_id === "string" ? payload.session_id.trim() : "";
  const turnId = typeof payload.turn_id === "string" ? payload.turn_id.trim() : "";
  if (payload.hook_event_name !== "Interrupt"
    || !/^[A-Za-z0-9_-]{6,128}$/.test(threadId)
    || !/^[A-Za-z0-9_-]{6,128}$/.test(turnId)) {
    throw new Error("Codex Interrupt hook payload has no valid session_id or turn_id");
  }
  await interruptActiveTurn(loadConfig(), { threadId, turnId });
}

async function tunnelCommand(args: string[]): Promise<void> {
  const action = args.shift() ?? "status";
  assertNoArgs(args);
  if (action === "key-import") {
    const key = await secretPrompt("Runtime key (hidden): ");
    if (!key) throw new Error("A non-empty runtime key is required");
    installRuntimeKeyBytes(key);
    stdout.write(`Runtime key stored privately at ${managedRuntimeKeyPath()}\n`);
    return;
  }
  const config = loadConfig();
  if (action === "start") startTunnelService();
  else if (action === "restart") {
    const drain = await acquireServiceDrain(config);
    try {
      await restartTunnelService();
    } finally {
      await drain.release();
    }
  }
  else if (action === "stop") {
    const drain = await acquireServiceDrain(config);
    try {
      await stopTunnelService();
      stopTunnel(config);
    } finally {
      await drain.release();
    }
  }
  else if (action !== "status") throw new Error(`Unknown tunnel action: ${action}`);
  const status = action === "start" || action === "restart"
    ? await waitForTunnelReady(config)
    : tunnelStatus(config);
  const service = getTunnelServiceStatus();
  stdout.write(`${JSON.stringify({ service, runtime: status }, null, 2)}\n`);
  if (action !== "stop" && (!service.running || !status.ok)) process.exitCode = 1;
}

async function openCommand(args: string[]): Promise<void> {
  const target = args.shift();
  assertNoArgs(args);
  const urls: Record<string, string> = {
    tunnels: "https://platform.openai.com/settings/organization/tunnels",
    "runtime-keys": "https://platform.openai.com/settings/organization/api-keys",
    connectors: "https://chatgpt.com/#settings/Plugins",
  };
  const url = target ? urls[target] : undefined;
  if (!url) throw new Error("Choose one of: tunnels, runtime-keys, connectors");
  if (process.platform === "darwin") {
    const result = runCommand("open", [url]);
    if (result.status !== 0) throw new Error(result.stderr.trim() || `Could not open ${url}`);
  } else {
    stdout.write(`${url}\n`);
  }
}

async function uninstallCommand(args: string[]): Promise<void> {
  const yes = takeFlag(args, "--yes");
  const purgeData = takeFlag(args, "--purge-data");
  assertNoArgs(args);
  if (!yes && !await confirm("Restore Codex config, stop services, and remove this installation?")) {
    throw new Error("Uninstall cancelled");
  }
  const config = existsSync(getConfigPath()) ? loadConfig() : undefined;
  if (!config && process.platform === "darwin" && getServiceStatus().installed) {
    throw new Error("Service exists but configuration is missing; refusing an unverifiable uninstall");
  }
  let drain: Awaited<ReturnType<typeof acquireServiceDrain>> | undefined;
  try {
    if (config && process.platform === "darwin" && getServiceStatus().loaded) {
      drain = await acquireServiceDrain(config, { requireIdle: false });
      await cancelActiveTurns(config);
    }
    // Route restoration is independent of daemon reachability and should happen before removing
    // the local services so Codex is never intentionally left pointed at a disappearing endpoint.
    uninstallCodexIntegration();
    if (config?.mode === "full") {
      if (process.platform === "darwin") await uninstallTunnelService();
      stopTunnel(config);
    }
    if (config && process.platform === "darwin") await uninstallService(config);
  } catch (error) {
    if (drain && getServiceStatus().loaded) {
      try { await drain.release(); } catch (resumeError) {
        throw new AggregateError([error, resumeError], "Portal uninstall failed and the daemon could not resume");
      }
    }
    throw error;
  }
  if (purgeData) rmSync(getConfigDir(), { recursive: true, force: true });
  stdout.write(purgeData
    ? "Uninstalled and removed private application data.\n"
    : "Uninstalled; private application data was preserved. Use --purge-data to remove it.\n");
}

async function stopCommand(args: string[]): Promise<void> {
  assertNoArgs(args);
  const config = loadConfig();
  let drain: Awaited<ReturnType<typeof acquireServiceDrain>> | undefined;
  try {
    if (process.platform === "darwin" && getServiceStatus().loaded) {
      drain = await acquireServiceDrain(config, { requireIdle: false });
      await cancelActiveTurns(config);
    } else {
      // A manually run daemon has no launchd owner. Best-effort cancellation is useful when it is
      // reachable, but route restoration below must not depend on that process still being alive.
      try { await cancelActiveTurns(config); } catch {}
    }
    deactivateCodexIntegration();
    if (process.platform === "darwin") {
      const tunnelService = getTunnelServiceStatus();
      if (tunnelService.loaded) await stopTunnelService();
      const service = getServiceStatus();
      if (service.loaded) await stopService(config);
    }
    stopTunnel(config);
  } catch (error) {
    if (drain && getServiceStatus().loaded) {
      try { await drain.release(); } catch (resumeError) {
        throw new AggregateError([error, resumeError], "Portal stop failed and the daemon could not resume");
      }
    }
    throw error;
  }
  stdout.write("Portal stopped and the previous Codex route was restored.\n");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const home = takeOption(args, "--home");
  if (home) process.env.PORTAL_HOME = home;
  if (takeFlag(args, "--help") || takeFlag(args, "-h")) {
    stdout.write(HELP);
    return;
  }
  if (takeFlag(args, "--version") || takeFlag(args, "-v")) {
    stdout.write(`${VERSION}\n`);
    return;
  }
  const command = args.shift() ?? "help";
  if (command === "help") stdout.write(HELP);
  else if (command === "start" || command === "setup") await setupCommand(args);
  else if (command === "login") await loginCommand(args);
  else if (command === "status") await doctorCommand(args);
  else if (command === "stop") await stopCommand(args);
  else if (command === "browser") {
    const action = args.shift();
    assertNoArgs(args);
    if (action !== "check") throw new Error("Browser command must be: browser check");
    const config = loadConfig();
    await checkBrowserEngine(config);
    stdout.write("Playwright can launch the configured Chrome executable.\n");
  } else if (command === "serve") {
    assertNoArgs(args);
    const config = loadConfig();
    const server = startServer(config);
    stdout.write(`Portal ${VERSION} listening on http://${config.host}:${server.port}/v1\n`);
    await new Promise<void>(() => {});
  } else if (command === "mcp") await runChatGptMcpMain(args);
  else if (command === "service") await serviceCommand(args);
  else if (command === "hook") {
    const action = args.shift();
    if (action !== "interrupt") throw new Error("Hook command must be: hook interrupt");
    await interruptHookCommand(args);
  }
  else if (command === "tunnel") await tunnelCommand(args);
  else if (command === "uninstall") await uninstallCommand(args);
  else throw new Error(`Unknown command: ${command}\n\n${HELP}`);
}

main().catch(error => {
  process.stderr.write(`portal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
