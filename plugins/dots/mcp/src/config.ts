import { createHash, randomBytes } from "node:crypto";
import { chmodSync, mkdirSync, openSync, closeSync, renameSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { basename, delimiter, dirname, isAbsolute, join, resolve, sep, win32 } from "node:path";
import { tmpdir } from "node:os";
import type { CodexProviderConfig } from "./types";
import { VERSION } from "./version";

export type RuntimeMode = "full";
export type BrowserHostMode = "managed-chrome";
export type SubagentProtocol = "compatibility-v1" | "native";

/** ChatGPT connector identity owned by the Portal configuration contract. */
export const CHATGPT_CONNECTOR_NAME = "Portal";

export interface TunnelConfig {
  binaryPath: string;
  tunnelId: string;
  runtimeKeyFile: string;
  profileDir: string;
  profileName: string;
  alias: string;
}

export interface AppConfig {
  version: 3;
  releaseVersion: string;
  mode: RuntimeMode;
  subagentProtocol: SubagentProtocol;
  host: "127.0.0.1";
  port: number;
  contextWindow: number;
  appName: string;
  automaticAppName: string;
  browserHost: BrowserHostMode;
  browserHostDescriptorPath?: string;
  chromeExecutablePath: string;
  storageStatePath: string;
  brokerSocketPath: string;
  headed: boolean;
  solAvailable: boolean;
  extraHighAvailable?: boolean;
  proAvailable: boolean;
  /** Optional adapter-silence budget for the Responses watchdog. */
  stallTimeoutSec?: number;
  autoApproveToolCalls: boolean;
  controlToken: string;
  runtimeCommand: string[];
  acknowledgedUnofficialAt?: string;
  tunnel?: TunnelConfig;
}

export function expandUserPath(value: string): string {
  if (value === "~") return homedir();
  if (value.startsWith("~/") || value.startsWith("~\\")) return join(homedir(), value.slice(2));
  return value;
}

export function getConfigDir(): string {
  const configured = process.env.PORTAL_HOME?.trim() || process.env.CODEX_CHATGPT_WEB_HOME?.trim();
  return resolve(expandUserPath(configured || join(homedir(), ".portal")));
}

export function getConfigPath(): string {
  return join(getConfigDir(), "config.json");
}

export function isWindowsPipeEndpoint(value: string): boolean {
  return /^\\\\\.\\pipe\\[A-Za-z0-9._-]+$/.test(value);
}

export function defaultBrokerEndpoint(home = getConfigDir(), platform = process.platform): string {
  if (platform !== "win32") return join(home, "runtime", "turn-broker.sock");
  const identity = createHash("sha256").update(resolve(home).toLowerCase()).digest("hex").slice(0, 20);
  return `\\\\.\\pipe\\portal-${identity}`;
}

export function resolveBrokerEndpoint(value: string): string {
  const expanded = expandUserPath(value);
  return isWindowsPipeEndpoint(expanded) ? expanded : resolve(expanded);
}

const atomicWaitCell = new Int32Array(new SharedArrayBuffer(4));
const WINDOWS_RENAME_RETRY_DELAYS_MS = [25, 50, 100, 150, 250, 350, 500] as const;

function renameAtomicFile(source: string, destination: string): void {
  for (let attempt = 0; ; attempt += 1) {
    try {
      renameSync(source, destination);
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      const transientWindowsError = process.platform === "win32"
        && (code === "EBUSY" || code === "EPERM" || code === "EACCES");
      const delay = WINDOWS_RENAME_RETRY_DELAYS_MS[attempt];
      if (!transientWindowsError || delay === undefined) throw error;
      Atomics.wait(atomicWaitCell, 0, 0, delay);
    }
  }
}

export function atomicWriteFile(
  path: string,
  data: string | Uint8Array,
  { mode = 0o600, protectDirectory = true }: { mode?: number; protectDirectory?: boolean } = {},
): void {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (protectDirectory) {
    try { chmodSync(directory, 0o700); } catch { /* Windows ACLs are managed by the installer. */ }
  }
  const temp = `${path}.tmp-${process.pid}-${crypto.randomUUID()}`;
  const fd = openSync(temp, "wx", mode);
  try {
    writeFileSync(fd, data);
    closeSync(fd);
    renameAtomicFile(temp, path);
  } catch (error) {
    try { closeSync(fd); } catch {}
    rmSync(temp, { force: true });
    throw error;
  }
  try { chmodSync(path, mode); } catch { /* Windows ACLs are managed by the installer. */ }
}

export function stripUtf8Bom(text: string): string {
  return text.startsWith("\uFEFF") ? text.slice(1) : text;
}

export function preserveUtf8Bom(text: string, original: string): string {
  return original.startsWith("\uFEFF") ? `\uFEFF${stripUtf8Bom(text)}` : stripUtf8Bom(text);
}

export function defaultConfig(): AppConfig {
  const home = getConfigDir();
  return {
    version: 3,
    releaseVersion: VERSION,
    mode: "full",
    subagentProtocol: "compatibility-v1",
    host: "127.0.0.1",
    port: 17841,
    contextWindow: 256_000,
    appName: CHATGPT_CONNECTOR_NAME,
    automaticAppName: CHATGPT_CONNECTOR_NAME,
    browserHost: "managed-chrome",
    chromeExecutablePath: defaultChromeExecutable(),
    storageStatePath: join(home, "browser", "storage-state.json"),
    brokerSocketPath: defaultBrokerEndpoint(home),
    headed: true,
    solAvailable: true,
    extraHighAvailable: false,
    proAvailable: false,
    autoApproveToolCalls: true,
    controlToken: randomBytes(32).toString("base64url"),
    runtimeCommand: currentRuntimeCommand(),
  };
}

export function currentRuntimeCommand(): string[] {
  const executableName = basename(process.execPath).toLowerCase();
  const bunExecutable = executableName === "bun" || executableName === "bun.exe"
    ? installedBunExecutable()
    : undefined;
  return runtimeCommandForProcess({
    launcher: process.env.PORTAL_LAUNCHER || process.env.CODEX_CHATGPT_WEB_LAUNCHER,
    executable: process.execPath,
    entry: typeof Bun !== "undefined" ? Bun.main : process.argv[1],
    bunExecutable,
  });
}

export function installedBunExecutable({
  platform = process.platform,
  pathValue = process.env.PATH || process.env.Path || "",
  candidates = [],
}: {
  platform?: NodeJS.Platform;
  pathValue?: string;
  candidates?: Array<string | null | undefined>;
} = {}): string {
  const executableName = platform === "win32" ? "bun.exe" : "bun";
  const pathDelimiter = platform === "win32" ? ";" : delimiter;
  const pathCandidates = pathValue
    .split(pathDelimiter)
    .map(part => part.trim().replace(/^"(.*)"$/, "$1"))
    .filter(Boolean)
    .map(part => join(part, executableName));
  const discovered = [
    process.env.PORTAL_BUN,
    process.env.CODEX_CHATGPT_WEB_BUN,
    process.env.CODEX_WEB_GPT_BUN,
    ...candidates,
    ...pathCandidates,
    typeof Bun !== "undefined" ? Bun.which("bun") : undefined,
    process.execPath,
  ];
  for (const candidate of discovered) {
    if (!candidate?.trim()) continue;
    const executable = resolve(candidate.trim());
    try {
      assertDurableRuntimeCommand([executable]);
      return executable;
    } catch {
      // Candidate discovery is exhaustive; the final error remains explicit.
    }
  }
  throw new Error("A durable installed Bun executable was not found outside temporary directories");
}

export function runtimeCommandForProcess({
  launcher,
  executable,
  entry,
  bunExecutable,
}: {
  launcher?: string;
  executable: string;
  entry?: string;
  bunExecutable?: string | null;
}): string[] {
  launcher = launcher?.trim();
  if (launcher) {
    const command = [resolve(launcher)];
    assertDurableRuntimeCommand(command);
    return command;
  }
  executable = resolve(executable);
  const executableName = basename(executable).toLowerCase();
  if (executableName === "bun" || executableName === "bun.exe") {
    if (!entry || entry.endsWith("/[eval]") || entry === "[eval]") {
      throw new Error("Cannot install a service from an evaluated Bun script");
    }
    const command = [resolve(bunExecutable?.trim() || executable), resolve(entry)];
    assertDurableRuntimeCommand(command);
    return command;
  }
  const command = [executable];
  assertDurableRuntimeCommand(command);
  return command;
}

function inside(path: string, root: string): boolean {
  const normalize = (value: string) => process.platform === "win32" ? resolve(value).toLowerCase() : resolve(value);
  const normalizedPath = normalize(path);
  const normalizedRoot = normalize(root);
  return normalizedPath === normalizedRoot || normalizedPath.startsWith(`${normalizedRoot}${sep}`);
}

export function assertDurableRuntimeCommand(command: string[]): void {
  if (command.length === 0) throw new Error("Runtime command is empty");
  const executable = command[0]!;
  if (!isAbsolute(executable)) throw new Error(`Runtime executable must be absolute: ${executable}`);
  const ephemeralRoots = [tmpdir(), "/tmp", "/private/tmp", "/var/tmp", "/private/var/tmp"];
  for (const part of command) {
    if (!isAbsolute(part)) continue;
    if (ephemeralRoots.some(root => inside(part, root))) {
      throw new Error(`Runtime command must not reference an ephemeral path: ${part}`);
    }
  }
  if (!existsSync(executable)) throw new Error(`Runtime executable does not exist: ${executable}`);
}

export function defaultChromeExecutable(
  platform = process.platform,
  programFiles = process.env.PROGRAMFILES,
): string {
  if (platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  if (platform === "win32") {
    return win32.join(programFiles || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe");
  }
  return "/usr/bin/google-chrome";
}

export function loadConfig(): AppConfig {
  const path = getConfigPath();
  if (!existsSync(path)) throw new Error(`Configuration is missing: ${path}. Run portal start first.`);
  return parseConfig(JSON.parse(stripUtf8Bom(readFileSync(path, "utf8"))), path);
}

export function loadConfigForSetup(): AppConfig {
  const path = getConfigPath();
  if (!existsSync(path)) throw new Error(`Configuration is missing: ${path}. Run portal start first.`);
  const raw = JSON.parse(stripUtf8Bom(readFileSync(path, "utf8"))) as Record<string, unknown>;
  if (raw.version === 1 && raw.mode === "pro-only") {
    raw.version = 2;
    raw.mode = "browser-only";
  }
  if (raw.version === 2) {
    raw.version = 3;
    raw.browserHost = "managed-chrome";
  }
  raw.mode = "full";
  raw.appName = CHATGPT_CONNECTOR_NAME;
  raw.automaticAppName = CHATGPT_CONNECTOR_NAME;
  raw.browserHost = "managed-chrome";
  delete raw.browserHostDescriptorPath;
  raw.autoApproveToolCalls = true;
  delete raw.browserInteractionMode;
  delete raw.manualAppName;
  delete raw.experimentalBiggerContext;
  delete raw.experimentalSkillAttachments;
  delete raw.zeroRiskProEnabled;
  delete raw.automaticTunnel;
  delete raw.manualTunnel;
  return parseConfig(raw, path);
}

function parseConfig(value: unknown, path: string): AppConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid configuration object in ${path}`);
  const parsed = value as Partial<AppConfig>;
  if (parsed.version !== 3) throw new Error(`Unsupported configuration version in ${path}; rerun setup to migrate it`);
  if (typeof parsed.releaseVersion !== "string" || !parsed.releaseVersion.trim()) throw new Error(`Missing releaseVersion in ${path}`);
  if (parsed.mode !== "full") {
    throw new Error(`Portal supports only full automatic mode in ${path}; run portal start to reconfigure it`);
  }
  const subagentProtocol = parsed.subagentProtocol ?? "compatibility-v1";
  if (subagentProtocol !== "compatibility-v1" && subagentProtocol !== "native") {
    throw new Error(`Invalid subagentProtocol in ${path}`);
  }
  if (parsed.host !== "127.0.0.1") throw new Error("The Responses proxy must bind to 127.0.0.1");
  if (parsed.browserHost !== "managed-chrome") {
    throw new Error(`Invalid browserHost in ${path}`);
  }
  if (!Number.isInteger(parsed.port) || parsed.port! < 1 || parsed.port! > 65_535) throw new Error(`Invalid port in ${path}`);
  if (!Number.isSafeInteger(parsed.contextWindow) || parsed.contextWindow! <= 0) {
    throw new Error(`Invalid contextWindow in ${path}`);
  }
  if (typeof parsed.headed !== "boolean") throw new Error(`Invalid headed in ${path}`);
  if (parsed.autoApproveToolCalls !== true) throw new Error(`Portal requires automatic tool approval in ${path}`);
  const requiredStrings: Array<keyof AppConfig> = [
    "appName", "chromeExecutablePath", "storageStatePath", "brokerSocketPath", "controlToken",
  ];
  for (const key of requiredStrings) {
    if (typeof parsed[key] !== "string" || !(parsed[key] as string).trim()) throw new Error(`Missing ${key} in ${path}`);
  }
  if (parsed.appName!.length > 80) throw new Error(`appName is too long in ${path}`);
  const automaticAppName = CHATGPT_CONNECTOR_NAME;
  if (typeof automaticAppName !== "string" || !automaticAppName.trim() || automaticAppName.length > 80) {
    throw new Error(`Invalid automaticAppName in ${path}`);
  }
  const expectedAppName = CHATGPT_CONNECTOR_NAME;
  if (parsed.appName !== expectedAppName) {
    throw new Error(`Portal requires connector ${JSON.stringify(CHATGPT_CONNECTOR_NAME)} in ${path}; rerun setup`);
  }
  const brokerEndpoint = expandUserPath(parsed.brokerSocketPath!);
  if (process.platform === "win32") {
    if (!isWindowsPipeEndpoint(brokerEndpoint)) {
      throw new Error(`Windows brokerSocketPath must be a named pipe in ${path}`);
    }
  } else if (!isAbsolute(brokerEndpoint) || isWindowsPipeEndpoint(brokerEndpoint)) {
    throw new Error(`brokerSocketPath must be an absolute Unix socket path in ${path}`);
  }
  if (!/^[A-Za-z0-9_-]{40,}$/.test(parsed.controlToken!)) throw new Error(`Invalid controlToken in ${path}`);
  const validateTunnel = (tunnel: TunnelConfig | undefined, label: string): void => {
    if (!tunnel || typeof tunnel !== "object") throw new Error(`${label} is missing in ${path}`);
    for (const key of ["binaryPath", "tunnelId", "runtimeKeyFile", "profileDir", "profileName", "alias"] as const) {
      if (typeof tunnel[key] !== "string" || !tunnel[key].trim()) {
        throw new Error(`Missing ${label}.${key} in ${path}`);
      }
    }
    if (!/^tunnel_[a-f0-9]{32}$/.test(tunnel.tunnelId)) {
      throw new Error(`Invalid ${label}.tunnelId in ${path}`);
    }
    for (const key of ["profileName", "alias"] as const) {
      if (!/^[A-Za-z0-9._-]+$/.test(tunnel[key])) {
        throw new Error(`Invalid ${label}.${key} in ${path}`);
      }
    }
    for (const key of ["binaryPath", "runtimeKeyFile", "profileDir"] as const) {
      if (!isAbsolute(expandUserPath(tunnel[key]))) {
        throw new Error(`${label}.${key} must be absolute in ${path}`);
      }
    }
  };
  if (parsed.mode === "full") {
    validateTunnel(parsed.tunnel, "tunnel");
  }
  if (!Array.isArray(parsed.runtimeCommand) || parsed.runtimeCommand.length === 0
    || parsed.runtimeCommand.some(part => typeof part !== "string" || !part.trim())) {
    throw new Error(`Invalid runtimeCommand in ${path}`);
  }
  assertDurableRuntimeCommand(parsed.runtimeCommand as string[]);
  if (parsed.extraHighAvailable !== undefined && typeof parsed.extraHighAvailable !== "boolean") {
    throw new Error(`Invalid extraHighAvailable in ${path}`);
  }
  if (parsed.proAvailable !== undefined && typeof parsed.proAvailable !== "boolean") {
    throw new Error(`Invalid proAvailable in ${path}`);
  }
  if (parsed.solAvailable !== undefined && typeof parsed.solAvailable !== "boolean") {
    throw new Error(`Invalid solAvailable in ${path}`);
  }
  if (parsed.stallTimeoutSec !== undefined
    && (!Number.isFinite(parsed.stallTimeoutSec) || parsed.stallTimeoutSec <= 0)) {
    throw new Error(`Invalid stallTimeoutSec in ${path}`);
  }
  const solAvailable = parsed.solAvailable !== false;
  const proAvailable = parsed.proAvailable === true;
  if (parsed.extraHighAvailable === true && !solAvailable) {
    throw new Error(`Invalid ChatGPT account capabilities in ${path}: Extra High requires Sol`);
  }
  if (proAvailable && !solAvailable) {
    throw new Error(`Invalid ChatGPT account capabilities in ${path}: Pro requires Sol`);
  }
  const legacy = parsed as Partial<AppConfig> & Record<string, unknown>;
  const {
    browserInteractionMode: _browserInteractionMode,
    manualAppName: _manualAppName,
    experimentalBiggerContext: _experimentalBiggerContext,
    experimentalSkillAttachments: _experimentalSkillAttachments,
    zeroRiskProEnabled: _zeroRiskProEnabled,
    automaticTunnel: _automaticTunnel,
    manualTunnel: _manualTunnel,
    ...clean
  } = legacy;
  return {
    ...clean,
    appName: expectedAppName,
    automaticAppName,
    subagentProtocol,
    solAvailable,
    proAvailable,
  } as AppConfig;
}

export function saveConfig(config: AppConfig): void {
  const path = getConfigPath();
  const original = existsSync(path) ? readFileSync(path, "utf8") : "";
  atomicWriteFile(path, preserveUtf8Bom(`${JSON.stringify(config, null, 2)}\n`, original));
}

export function providerConfig(config: AppConfig): CodexProviderConfig {
  const model = "gpt-5.6-sol";
  const models = [model];
  const efforts = ["max"];
  return {
    adapter: "chatgpt-web",
    baseUrl: "https://chatgpt.com",
    models,
    liveModels: false,
    defaultModel: model,
    contextWindow: config.contextWindow,
    modelInputModalities: Object.fromEntries(models.map(model => [model, ["text", "image"]])),
    modelReasoningEfforts: Object.fromEntries(models.map(modelId => [modelId, efforts])),
    modelDefaultReasoningEfforts: Object.fromEntries(
      models.map(modelId => [modelId, "max"]),
    ),
    noReasoningModels: [],
    chatgptWeb: {
      appName: CHATGPT_CONNECTOR_NAME,
      browserHost: config.browserHost,
      browserHostDescriptorPath: config.browserHostDescriptorPath,
      storageStatePath: config.storageStatePath,
      chromeExecutablePath: config.chromeExecutablePath,
      brokerSocketPath: config.brokerSocketPath,
      threadEnvironmentStatePath: join(getConfigDir(), "runtime", "thread-environments.json"),
      lunaCheckpointStatePath: join(getConfigDir(), "runtime", "luna-checkpoints.json"),
      headed: config.headed,
      localToolsEnabled: true,
      solAvailable: true,
      extraHighAvailable: false,
      proAvailable: config.proAvailable,
      ...(config.stallTimeoutSec !== undefined ? { stallTimeoutSec: config.stallTimeoutSec } : {}),
      autoApproveToolCalls: true,
    },
  };
}
