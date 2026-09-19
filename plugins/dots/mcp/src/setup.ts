import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import type { AppConfig, RuntimeMode, SubagentProtocol } from "./config";
import {
  CHATGPT_CONNECTOR_NAME,
  currentRuntimeCommand,
  defaultBrokerEndpoint,
  defaultConfig,
  defaultLauncherDescriptorPath,
  getConfigPath,
  loadConfigForSetup,
  providerConfig,
  saveConfig,
} from "./config";
import {
  browserLoginStateExists,
  inspectBrowserLoginCapabilities,
  loginToChatGpt,
  storedBrowserLoginCapabilities,
} from "./browser-login";
import {
  deactivateCodexIntegration,
  installCodexIntegration,
  inspectCodexIntegration,
  preflightCodexIntegration,
  readCodexSubagentProtocol,
} from "./codex-integration";
import {
  acquireRestartDrain,
  acquireServiceDrain,
  assertServiceIdle,
  getServiceStatus,
  installService,
  removeLegacyRuntimeArtifacts,
  restartService,
  uninstallService,
} from "./service";
import { connectTunnel, createTunnelConfig, installRuntimeKey, installRuntimeKeyBytes, installTunnelClient, managedRuntimeKeyPath, stopTunnel, waitForTunnelReady } from "./tunnel";
import { getTunnelServiceStatus, installTunnelService, restartTunnelService, stopTunnelService, tunnelServiceDefinitionMatches, uninstallTunnelService } from "./tunnel-service";
import { VERSION } from "./version";
import { ChatGptWebAdapterError } from "./adapters/chatgpt-web/adapter-error";
import { ChatGptBrowserWorker } from "./adapters/chatgpt-web/browser-worker";

export interface SetupOptions {
  mode: RuntimeMode;
  subagentProtocol?: SubagentProtocol;
  port?: number;
  chromeExecutablePath?: string;
  refreshAccountCapabilities?: boolean;
  forceLogin?: boolean;
  replaceCodexRoute?: boolean;
  restartService?: boolean;
  /** managed-chrome opens a fresh Temporary Chat per turn; launcher retains one per Codex thread. */
  browserHost?: "managed-chrome" | "launcher";
  acknowledgedUnofficial?: boolean;
  tunnelId?: string;
  runtimeKeyFile?: string;
  runtimeKeyValue?: string;
}

export interface SetupResult {
  mode: RuntimeMode;
  configPath: string;
  loginCreated: boolean;
  serviceLoaded: boolean;
  tunnelReady: boolean | null;
  codexRestartRequired: boolean;
  connectorSetupRequired: boolean;
}

interface PreparedSetup {
  existing: AppConfig | undefined;
  config: AppConfig;
}

export interface ExistingFullSetupCredentials {
  tunnelId: boolean;
  runtimeKey: boolean;
}

export function existingFullSetupCredentials(
  existing: AppConfig | undefined,
): ExistingFullSetupCredentials {
  const tunnel = existing?.tunnel;
  return {
    tunnelId: Boolean(tunnel?.tunnelId),
    runtimeKey: Boolean(tunnel?.runtimeKeyFile && existsSync(tunnel.runtimeKeyFile)),
  };
}

function loadExistingConfig(): AppConfig | undefined {
  if (!existsSync(getConfigPath())) return undefined;
  return loadConfigForSetup();
}

function meaningfulRuntimeChange(before: AppConfig, after: AppConfig): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}

export function tunnelWorkerRuntimeChanged(before: AppConfig | undefined, after: AppConfig): boolean {
  if (!before || before.mode !== "full" || after.mode !== "full") return false;
  return before.releaseVersion !== after.releaseVersion
    || JSON.stringify(before.runtimeCommand) !== JSON.stringify(after.runtimeCommand)
    || before.brokerSocketPath !== after.brokerSocketPath
    || JSON.stringify(before.tunnel) !== JSON.stringify(after.tunnel);
}

export function tunnelProfileInputsChanged(before: AppConfig | undefined, after: AppConfig): boolean {
  if (!before || before.mode !== "full" || after.mode !== "full") return false;
  return JSON.stringify(before.runtimeCommand) !== JSON.stringify(after.runtimeCommand)
    || before.brokerSocketPath !== after.brokerSocketPath
    || before.tunnel?.tunnelId !== after.tunnel?.tunnelId
    || before.tunnel?.runtimeKeyFile !== after.tunnel?.runtimeKeyFile
    || before.tunnel?.profileDir !== after.tunnel?.profileDir
    || before.tunnel?.profileName !== after.tunnel?.profileName;
}

async function assertPortAvailable(host: string, port: number): Promise<void> {
  await new Promise<void>((resolveAvailable, rejectAvailable) => {
    const server = createServer();
    server.unref();
    server.once("error", error => rejectAvailable(new Error(`Cannot bind ${host}:${port}: ${error.message}`)));
    server.listen(port, host, () => server.close(error => error ? rejectAvailable(error) : resolveAvailable()));
  });
}

export function setupProxyIsReady(
  health: Record<string, unknown>,
  config: Pick<AppConfig, "mode" | "releaseVersion">,
): boolean {
  return health.service === "portal"
    && health.status === "ok"
    && health.mode === config.mode
    && health.version === config.releaseVersion
    && health.broker_ready === true
    && health.accepting_turns === true;
}

async function waitForProxy(config: AppConfig, timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not reachable";
  while (Date.now() < deadline) {
    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), 2_000);
    try {
      const response = await fetch(`http://${config.host}:${config.port}/healthz`, {
        signal: controller.signal,
      });
      if (response.ok) {
        const body = await response.json() as Record<string, unknown>;
        if (setupProxyIsReady(body, config)) return;
        lastError = `unexpected health payload: ${JSON.stringify(body)}`;
      } else {
        lastError = `HTTP ${response.status}`;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(requestTimeout);
    }
    await new Promise(resolveWait => setTimeout(resolveWait, 250));
  }
  throw new Error(`Responses proxy did not become ready: ${lastError}`);
}

function baseConfig(
  existing: AppConfig | undefined,
  options: SetupOptions,
): AppConfig {
  if (options.mode !== "full") throw new Error("Portal supports only full automatic mode");
  const config = existing ? structuredClone(existing) : defaultConfig();
  config.mode = "full";
  config.appName = CHATGPT_CONNECTOR_NAME;
  config.automaticAppName = CHATGPT_CONNECTOR_NAME;
  if (options.subagentProtocol) config.subagentProtocol = options.subagentProtocol;
  config.releaseVersion = VERSION;
  config.runtimeCommand = currentRuntimeCommand();
  if (options.port !== undefined) {
    if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65_535) throw new Error("--port must be an integer from 1 to 65535");
    config.port = options.port;
  }
  if (options.chromeExecutablePath) config.chromeExecutablePath = options.chromeExecutablePath;
  if (options.browserHost) config.browserHost = options.browserHost;
  if (config.browserHost === "launcher") {
    config.browserHostDescriptorPath ??= defaultLauncherDescriptorPath();
  } else {
    config.browserHost = "managed-chrome";
    delete config.browserHostDescriptorPath;
  }
  config.autoApproveToolCalls = true;
  if (options.acknowledgedUnofficial) config.acknowledgedUnofficialAt = new Date().toISOString();
  config.acknowledgedUnofficialAt ??= new Date().toISOString();
  return config;
}

async function configureTunnel(config: AppConfig, existing: AppConfig | undefined, options: SetupOptions): Promise<void> {
  const existingTunnel = existing?.tunnel;
  const tunnelId = options.tunnelId ?? existingTunnel?.tunnelId;
  if (!tunnelId) {
    throw new Error("Portal requires an MCP Tunnel ID");
  }
  let runtimeKeyFile = existingTunnel?.runtimeKeyFile;
  const managedKeyFile = managedRuntimeKeyPath();
  if ((!runtimeKeyFile || !existsSync(runtimeKeyFile)) && existsSync(managedKeyFile)) {
    runtimeKeyFile = managedKeyFile;
  }
  if (options.runtimeKeyFile) runtimeKeyFile = installRuntimeKey(options.runtimeKeyFile);
  if (options.runtimeKeyValue) runtimeKeyFile = installRuntimeKeyBytes(options.runtimeKeyValue);
  if (runtimeKeyFile && runtimeKeyFile !== managedKeyFile && existsSync(runtimeKeyFile)) {
    runtimeKeyFile = installRuntimeKey(runtimeKeyFile);
  }
  if (!runtimeKeyFile || !existsSync(runtimeKeyFile)) {
    throw new Error("Portal requires an MCP runtime key");
  }
  const installedBinary = await installTunnelClient();
  const productionProfileName = "portal";
  const profileName = productionProfileName;
  const configuredTunnel = createTunnelConfig({
    binaryPath: installedBinary,
    tunnelId,
    runtimeKeyFile,
    profileName,
    alias: profileName,
  });
  config.tunnel = configuredTunnel;
}

async function bootstrapTunnelProfile(config: AppConfig): Promise<void> {
  let bootstrapError: unknown;
  try {
    // `runtimes connect` writes the native profile and returns once its managed runtime is healthy.
    // Readiness follows after a successful control-plane poll, so setup proves it separately before
    // stopping the validation runtime. The CLI-managed service reconnects the committed profile.
    connectTunnel(config);
    const status = await waitForTunnelReady(config);
    if (!status.ok) throw new Error(`Tunnel runtime did not become healthy and ready: ${status.detail}`);
  } catch (error) {
    bootstrapError = error;
  }
  try {
    stopTunnel(config);
  } catch (stopError) {
    if (bootstrapError) {
      const primary = bootstrapError instanceof Error ? bootstrapError.message : String(bootstrapError);
      const cleanup = stopError instanceof Error ? stopError.message : String(stopError);
      throw new Error(`${primary}; temporary tunnel cleanup also failed: ${cleanup}`);
    }
    throw stopError;
  }
  if (bootstrapError) throw bootstrapError;
}

function prepareSetup(options: SetupOptions): PreparedSetup {
  const existing = loadExistingConfig();
  const config = baseConfig(existing, {
    ...options,
    subagentProtocol: options.subagentProtocol
      ?? readCodexSubagentProtocol(existing?.subagentProtocol ?? "compatibility-v1"),
  });
  if (process.platform !== "darwin") {
    throw new Error(
      "Portal's CLI-managed Chrome setup currently requires macOS.",
    );
  }
  return { existing, config };
}

export function preflightSetup(options: SetupOptions): void {
  const { existing, config } = prepareSetup(options);
  {
    const saved = existing?.tunnel;
    const tunnelId = options.tunnelId ?? saved?.tunnelId;
    if (!tunnelId) {
      throw new Error(
        "Portal needs an MCP Tunnel ID",
      );
    }
    const savedKey = saved?.runtimeKeyFile;
    const managedKey = managedRuntimeKeyPath();
    const hasRuntimeKey = Boolean(
      options.runtimeKeyValue
      || (options.runtimeKeyFile && existsSync(options.runtimeKeyFile))
      || (savedKey && existsSync(savedKey))
      || existsSync(managedKey),
    );
    if (!hasRuntimeKey) {
      throw new Error(
        "Portal needs an MCP runtime key",
      );
    }
  }
  preflightCodexIntegration(config, {
    replaceExistingRoute: options.replaceCodexRoute,
  });
}

export async function setup(options: SetupOptions): Promise<SetupResult> {
  const { existing, config } = prepareSetup(options);
  preflightCodexIntegration(config, {
    replaceExistingRoute: options.replaceCodexRoute,
  });
  const beforeService = getServiceStatus();
  if (beforeService.loaded && !existing) {
    throw new Error("A Portal service is loaded but its configuration is missing; refusing to replace an unverifiable process");
  }

  let loginCreated = false;
  let solAvailable: boolean | undefined = config.solAvailable;
  let extraHighAvailable: boolean | undefined = config.extraHighAvailable;
  let proAvailable: boolean | undefined = config.proAvailable;
  {
    const stored = storedBrowserLoginCapabilities(config);
    solAvailable = stored.solAvailable;
    extraHighAvailable = stored.extraHighAvailable;
    proAvailable = stored.proAvailable;
    const loginRequired = options.forceLogin || !browserLoginStateExists(config);
    const capabilityProbeRequired = !loginRequired
      && (options.refreshAccountCapabilities === true
        || solAvailable === undefined
        || extraHighAvailable === undefined
        || proAvailable === undefined);
    if (beforeService.loaded && (loginRequired || capabilityProbeRequired) && !options.restartService) {
      throw new Error(
        "Setup must verify the browser account before changing the running daemon. "
        + "Rerun from a normal terminal with --restart-service after the active task finishes.",
      );
    }
    if (beforeService.loaded && (loginRequired || capabilityProbeRequired) && existing && !options.restartService) await assertServiceIdle(existing);
    if (loginRequired) {
      const login = await loginToChatGpt(config);
      solAvailable = login.solAvailable;
      extraHighAvailable = login.extraHighAvailable;
      proAvailable = login.proAvailable;
      loginCreated = true;
    } else if (capabilityProbeRequired) {
      const inspected = await inspectBrowserLoginCapabilities(config);
      solAvailable = inspected.solAvailable;
      extraHighAvailable = inspected.extraHighAvailable;
      proAvailable = inspected.proAvailable;
    }
  }
  config.solAvailable = solAvailable === true;
  config.extraHighAvailable = config.solAvailable && extraHighAvailable === true;
  config.proAvailable = config.solAvailable && proAvailable === true;
  if (!config.solAvailable) {
    throw new Error(
      "GPT-5.6 Sol is not available in the authenticated account. Run portal login with an eligible ChatGPT account, then retry portal start.",
    );
  }
  const explicitTunnelChange = Boolean(options.tunnelId || options.runtimeKeyFile || options.runtimeKeyValue);
  const preliminaryChange = Boolean(existing && (meaningfulRuntimeChange(existing, config) || explicitTunnelChange || options.forceLogin));
  if (beforeService.loaded && preliminaryChange && !options.restartService) {
    throw new Error(
      "The daemon is currently serving a Codex task and setup would change its runtime. "
      + "Rerun from a normal terminal with --restart-service after the active task finishes.",
    );
  }
  if (beforeService.loaded && preliminaryChange && existing && !options.restartService) await assertServiceIdle(existing);
  await configureTunnel(config, existing, options);
  const refreshTunnelWorker = tunnelWorkerRuntimeChanged(existing, config);
  const refreshTunnelProfile = tunnelProfileInputsChanged(existing, config);

  const changedWhileLoaded = Boolean(existing && beforeService.loaded && meaningfulRuntimeChange(existing, config));
  if (changedWhileLoaded && !options.restartService) {
    throw new Error(
      "The daemon is currently serving a Codex task and setup would change its runtime. "
      + "Rerun from a normal terminal with --restart-service after the active task finishes.",
    );
  }
  if (changedWhileLoaded && !preliminaryChange && existing && !options.restartService) await assertServiceIdle(existing);
  if (!beforeService.loaded) await assertPortAvailable(config.host, config.port);

  saveConfig(config);
  installService(config);
  if (beforeService.loaded && options.restartService && existing) await restartService(existing);
  await waitForProxy(config);

  let tunnelReady: boolean | null = null;
  {
    const profilePath = join(config.tunnel!.profileDir, `${config.tunnel!.profileName}.yaml`);
    const tunnelService = getTunnelServiceStatus();
    const needsProfile = !existsSync(profilePath);
    const needsOwnershipMigration = !tunnelService.installed || !tunnelService.loaded || !tunnelServiceDefinitionMatches(config);
    const needsTunnelChange = needsOwnershipMigration || needsProfile || refreshTunnelProfile || refreshTunnelWorker || options.restartService;
    const tunnelDrain = needsTunnelChange
      ? options.restartService ? await acquireRestartDrain(config) : await acquireServiceDrain(config)
      : undefined;
    try {
      if (needsOwnershipMigration || needsProfile || refreshTunnelProfile) {
        if (tunnelService.loaded) await stopTunnelService();
        await bootstrapTunnelProfile(config);
        installTunnelService(config);
      } else if (refreshTunnelWorker || options.restartService) {
        await restartTunnelService();
      }
      const status = await waitForTunnelReady(config);
      if (!status.ok) throw new Error(`Tunnel runtime did not become healthy and ready: ${status.detail}`);
    } finally {
      await tunnelDrain?.release();
    }
    tunnelReady = true;
  }
  let connectorSetupRequired = false;
  const browser = ChatGptBrowserWorker.forProvider(providerConfig(config));
  try {
    await browser.verifyConnector();
  } catch (error) {
    if (error instanceof ChatGptWebAdapterError && error.code === "connector_not_found") {
      connectorSetupRequired = true;
    } else {
      throw error;
    }
  } finally {
    await browser.close();
  }

  removeLegacyRuntimeArtifacts(config);
  let codexRestartRequired = false;
  const routeDrain = beforeService.loaded
    ? options.restartService ? await acquireRestartDrain(config) : await acquireServiceDrain(config)
    : undefined;
  try {
    if (connectorSetupRequired) {
      const codex = inspectCodexIntegration();
      if (codex.active) codexRestartRequired = deactivateCodexIntegration().changed;
    } else {
      installCodexIntegration(config, {
        replaceExistingRoute: options.replaceCodexRoute,
      });
      codexRestartRequired = true;
    }
  } finally {
    await routeDrain?.release();
  }

  return {
    mode: config.mode,
    configPath: getConfigPath(),
    loginCreated,
    serviceLoaded: getServiceStatus().loaded,
    tunnelReady,
    codexRestartRequired,
    connectorSetupRequired,
  };
}
