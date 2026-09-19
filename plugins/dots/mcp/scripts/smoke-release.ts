import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CHATGPT_CONNECTOR_NAME, defaultBrokerEndpoint } from "../src/config";
import { VERSION } from "../src/version";

const sourceBundle = resolve(process.argv[2] ?? "dist/runtime");
const sourceRoot = resolve(import.meta.dir, "..");
const root = join(homedir(), `.portal-release-smoke-${process.pid}-${Date.now()}`);
const firstLocation = join(root, "first-location");
const runtimeRoot = join(root, "relocated-runtime");
cpSync(sourceBundle, firstLocation, { recursive: true, verbatimSymlinks: true });
renameSync(firstLocation, runtimeRoot);
const manifest = JSON.parse(readFileSync(join(runtimeRoot, "manifest.json"), "utf8")) as Record<string, unknown>;
if (manifest.schemaVersion !== 2
  || manifest.appVersion !== VERSION
  || manifest.playwright !== "1.62.0"
  || !Array.isArray(manifest.files)
  || manifest.files.length === 0
  || !/^[a-f0-9]{64}$/.test(String(manifest.bundleId ?? ""))) {
  throw new Error(`Unexpected runtime manifest: ${JSON.stringify(manifest)}`);
}
if (typeof manifest.launcher !== "string" || typeof manifest.entrypoint !== "string") {
  throw new Error(`Runtime manifest has no launcher or entrypoint: ${JSON.stringify(manifest)}`);
}
const launcher = join(runtimeRoot, manifest.launcher);
const runtimeExecutable = join(runtimeRoot, "runtime", process.platform === "win32" ? "bun.exe" : "bun");
const entrypoint = join(runtimeRoot, manifest.entrypoint);
const runtimeCommand = [runtimeExecutable, entrypoint];
const cliBundle = readFileSync(join(runtimeRoot, "app", "cli.js"), "utf8");
const launcherText = readFileSync(launcher, "utf8");
for (const forbidden of [sourceRoot, dirname(sourceBundle), "/private/tmp/portal-verify", "/tmp/portal-verify"]) {
  if (cliBundle.includes(forbidden) || launcherText.includes(forbidden)) {
    throw new Error(`Runtime artifact embeds an ephemeral build path: ${forbidden}`);
  }
}

const version = Bun.spawnSync([...runtimeCommand, "--version"], { stdout: "pipe", stderr: "pipe" });
if (version.exitCode !== 0 || version.stdout.toString().trim() !== VERSION) {
  throw new Error(`Relocated launcher failed: ${version.stderr.toString()}`);
}

const appHome = join(root, "app-state");
const codexHome = join(root, "codex");
mkdirSync(join(appHome, "browser"), { recursive: true });
mkdirSync(codexHome, { recursive: true });
const portServer = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } });
const port = portServer.port;
portServer.stop();
const configKeyPath = join(appHome, "tunnel-runtime.key");
const config = {
  version: 3,
  releaseVersion: VERSION,
  mode: "full",
  host: "127.0.0.1",
  port,
  contextWindow: 256_000,
  appName: CHATGPT_CONNECTOR_NAME,
  automaticAppName: CHATGPT_CONNECTOR_NAME,
  browserHost: "managed-chrome",
  chromeExecutablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  storageStatePath: join(appHome, "browser", "storage-state.json"),
  brokerSocketPath: defaultBrokerEndpoint(appHome),
  headed: true,
  proAvailable: true,
  autoApproveToolCalls: true,
  controlToken: "release-smoke-control-token-0123456789abcdef",
  runtimeCommand,
  acknowledgedUnofficialAt: new Date().toISOString(),
  tunnel: {
    binaryPath: runtimeExecutable,
    tunnelId: "tunnel_00000000000000000000000000000000",
    runtimeKeyFile: configKeyPath,
    profileDir: join(appHome, "tunnel", "profiles"),
    profileName: "portal-smoke",
    alias: "portal-smoke",
  },
};
writeFileSync(configKeyPath, "release-smoke-key\n", { mode: 0o600 });
writeFileSync(join(appHome, "config.json"), `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
writeFileSync(config.storageStatePath, "{}\n", { mode: 0o600 });

const env = { ...process.env, PORTAL_HOME: appHome, CODEX_HOME: codexHome };
async function runDirectMcpSmoke(): Promise<void> {
  const marker = join(root, "direct-access-marker");
  const refusedMarker = join(root, "bound-access-marker");
  const brokerSocket = join(root, "unused-broker.sock");
  const transport = new StdioClientTransport({
    command: runtimeExecutable,
    args: [entrypoint, "mcp", "--broker-socket", brokerSocket],
    cwd: root,
    env: Object.fromEntries(
      Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    ),
    stderr: "pipe",
  });
  const client = new Client({ name: "portal-release-direct-smoke", version: VERSION });
  try {
    await client.connect(transport);
    const listed = await client.listTools();
    if (listed.tools.map(tool => tool.name).sort().join(",") !== "portal_call,portal_tools") {
      throw new Error(`relocated MCP direct smoke exposed an unexpected tool contract: ${JSON.stringify(listed.tools.map(tool => tool.name))}`);
    }
    const inventory = await client.callTool({ name: "portal_tools", arguments: {} });
    const inventoryValue = inventory.structuredContent as { mode?: unknown; operation_prefix?: unknown; tools?: Array<{ wire_name?: unknown }> } | undefined;
    if (inventory.isError || inventoryValue?.mode !== "direct" || inventoryValue.tools?.[0]?.wire_name !== "exec_command"
      || typeof inventoryValue.operation_prefix !== "string") {
      throw new Error(`relocated MCP direct smoke did not select direct execution: ${JSON.stringify(inventory.structuredContent)}`);
    }
    const executed = await client.callTool({
      name: "portal_call",
      arguments: {
        wire_name: "exec_command",
        arguments: {
          cmd: `printf DIRECT_ACCESS_SMOKE > ${JSON.stringify(marker)}`,
          operation_id: `${inventoryValue.operation_prefix}.${randomUUID()}`,
        },
      },
    });
    if (executed.isError || (executed.structuredContent as { mode?: unknown } | undefined)?.mode !== "direct"
      || !readFileSync(marker, "utf8").includes("DIRECT_ACCESS_SMOKE")) {
      throw new Error(`relocated MCP direct smoke did not complete its isolated command: ${JSON.stringify(executed.structuredContent)}`);
    }
    const bound = await client.callTool({
      name: "portal_call",
      arguments: {
        turn_token: "invalid-release-smoke-turn-token",
        wire_name: "exec_command",
        arguments: { cmd: `printf BOUND_ACCESS_SMOKE > ${JSON.stringify(refusedMarker)}` },
      },
    });
    if (!bound.isError) throw new Error("relocated MCP smoke accepted an invalid bound token");
    if (existsSync(refusedMarker)) throw new Error("relocated MCP smoke broadened an invalid bound token into direct execution");
    process.stdout.write("PORTAL_DIRECT_ACCESS_SMOKE_OK\n");
    process.stdout.write("PORTAL_AUTHENTICATED_BROWSER_ROUNDTRIP_NOT_RUN\n");
  } finally {
    await client.close().catch(() => {});
  }
}

try {
  await runDirectMcpSmoke();
} catch (error) {
  rmSync(root, { recursive: true, force: true });
  throw error;
}
const child = Bun.spawn([...runtimeCommand, "serve"], { env, stdout: "pipe", stderr: "pipe" });
let stoppedGracefully = false;
try {
  const deadline = Date.now() + 10_000;
  let health: Response | undefined;
  while (Date.now() < deadline) {
    try {
      health = await fetch(`http://127.0.0.1:${port}/healthz`);
      if (health.ok) break;
    } catch {}
    await Bun.sleep(50);
  }
  if (!health?.ok) throw new Error("relocated daemon did not become healthy");
  const payload = await health.json() as Record<string, unknown>;
  if (payload.service !== "portal" || payload.mode !== "full") {
    throw new Error(`unexpected health payload: ${JSON.stringify(payload)}`);
  }

  const unauthenticatedModels = await fetch(`http://127.0.0.1:${port}/v1/models`);
  const unauthenticatedModelsBody = await unauthenticatedModels.json() as { error?: { message?: string } };
  if (unauthenticatedModels.status !== 502
    || !unauthenticatedModelsBody.error?.message?.includes("incoming Bearer authorization")) {
    throw new Error(`native model passthrough did not fail closed without Codex auth: ${JSON.stringify(unauthenticatedModelsBody)}`);
  }
  const websocketNegotiation = await fetch(`http://127.0.0.1:${port}/v1/responses`);
  if (websocketNegotiation.status !== 426) {
    throw new Error(`Responses WebSocket negotiation did not select Codex HTTP/SSE fallback: HTTP ${websocketNegotiation.status}`);
  }
  const invalid = await fetch(`http://127.0.0.1:${port}/v1/responses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "chatgpt-web/not-enabled", input: "test", stream: false }),
  });
  if (invalid.status !== 400) throw new Error(`unsupported model did not fail closed: HTTP ${invalid.status}`);

  const unauthorizedDrain = await fetch(`http://127.0.0.1:${port}/admin/drain`, {
    method: "POST",
    headers: { authorization: "Bearer wrong-release-smoke-token" },
  });
  if (unauthorizedDrain.status !== 401) throw new Error(`lifecycle control accepted an invalid token: HTTP ${unauthorizedDrain.status}`);

  const drain = await fetch(`http://127.0.0.1:${port}/admin/drain`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.controlToken}` },
  });
  const drainPayload = await drain.json() as Record<string, unknown>;
  if (!drain.ok || drainPayload.accepting_turns !== false
    || drainPayload.active_http_turns !== 0 || drainPayload.active_browser_turns !== 0) {
    throw new Error(`daemon did not acknowledge an idle authenticated drain: ${JSON.stringify(drainPayload)}`);
  }
  const rejectedWhileDraining = await fetch(`http://127.0.0.1:${port}/v1/responses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "chatgpt-web/high", reasoning: { effort: "high" }, input: "test", stream: false }),
  });
  if (rejectedWhileDraining.status !== 503) {
    throw new Error(`daemon accepted a new turn while draining: HTTP ${rejectedWhileDraining.status}`);
  }
  const resume = await fetch(`http://127.0.0.1:${port}/admin/resume`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.controlToken}` },
  });
  const resumePayload = await resume.json() as Record<string, unknown>;
  if (!resume.ok || resumePayload.accepting_turns !== true) {
    throw new Error(`daemon did not resume after the drain smoke: ${JSON.stringify(resumePayload)}`);
  }

  if (process.platform === "darwin") {
    const browser = Bun.spawnSync([...runtimeCommand, "browser", "check"], { env, stdout: "pipe", stderr: "pipe" });
    if (browser.exitCode !== 0) throw new Error(`relocated Playwright smoke failed: ${browser.stderr.toString()}`);
  }
  const finalDrain = await fetch(`http://127.0.0.1:${port}/admin/drain`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.controlToken}` },
  });
  if (!finalDrain.ok) throw new Error(`relocated daemon refused final drain: HTTP ${finalDrain.status}`);
  const shutdown = await fetch(`http://127.0.0.1:${port}/admin/shutdown`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.controlToken}` },
  });
  if (!shutdown.ok) throw new Error(`relocated daemon refused graceful shutdown: HTTP ${shutdown.status}`);
  await Promise.race([
    child.exited,
    Bun.sleep(10_000).then(() => { throw new Error("relocated daemon did not exit after graceful shutdown"); }),
  ]);
  stoppedGracefully = true;
  process.stdout.write("RELOCATABLE_RUNTIME_SMOKE_OK\n");
} finally {
  if (!stoppedGracefully) {
    child.kill("SIGTERM");
    await child.exited;
  }
  rmSync(root, { recursive: true, force: true });
}
