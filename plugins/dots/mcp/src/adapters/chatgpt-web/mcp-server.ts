import { createHash, randomBytes, randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Ajv, { type ValidateFunction } from "ajv";
import * as z from "zod/v4";
import { CHATGPT_CONNECTOR_NAME } from "../../config";
import { namespacedToolName, type CodexTool } from "../../types";
import { VERSION } from "../../version";
import type { ChatGptTurnEnvironment } from "./environment";
import { CODEX_COMPACTION_CONTROL_WIRE_NAME } from "./native-compaction-control";
import { callTurnBroker, TurnBrokerTimeoutError, type BrokerToolResult } from "./turn-broker";
import { observeMcpToolCalls } from "./mcp-observation";
import {
  chatGptExecutionErrorCode,
  chatGptExecutionReference,
  emitChatGptExecutionEvidence,
} from "./turn-execution";

interface ClaimedTurn {
  bindingId: string;
  activityId: string;
  traceId: string;
  environment: ChatGptTurnEnvironment & { expiresAt?: number };
}

type PortalExecutionMode = "direct" | "bound";

interface DirectExecutionContext {
  mode: "direct";
}

interface BoundExecutionContext {
  mode: "bound";
  claimed: ClaimedTurn;
}

type PortalExecutionContext = DirectExecutionContext | BoundExecutionContext;

interface DirectExecutionOutcome {
  exit_code: number | null;
  stdout: string;
  stderr: string;
  started: boolean;
  code?: "portal_direct_timeout" | "client_cancelled";
  retryable?: false;
  message?: string;
}

type DirectExecutionReporter = (event: {
  stage: "dispatch" | "execution_completion" | "cancellation" | "unknown";
  outcome: "accepted" | "started" | "completed" | "failed" | "cancelled" | "unknown";
  started: boolean | "unknown";
  elapsed_ms?: number;
  error_code?: string;
  retry_guidance: "retry_safe" | "do_not_retry" | "unknown";
  execution_proven: boolean;
}) => void;

export type ChatGptMcpContract = "native" | "safe";

const BRIDGE_TOOL_NAMES = new Set([
  "codex_turn_start",
  "codex_exec",
  "codex_write_stdin",
  "codex_apply_patch",
  "codex_view_image",
  "codex_tool_inventory",
  "codex_tool_call",
  "portal_tools",
  "portal_call",
  "codex_turn_complete",
]);

const GATEWAY_AGENT_WAIT_TOOL_NAMES = new Set([
  "multi_agent_v1__wait_agent",
  "multi_agent_v2__wait_agent",
  "collaboration__wait_agent",
]);

const turnTokenSchema = z.string().min(20).max(256);
const jsonArgumentsSchema = z.record(z.string(), z.unknown()).default({});
// Match Codex's default wait interval while returning before the MCP invocation deadline.
export const CHATGPT_WEB_AGENT_WAIT_POLL_MS = 30_000;
const AGENT_WAIT_TRANSPORT_RULE = `ChatGPT Web transport rule: wait for exactly ${CHATGPT_WEB_AGENT_WAIT_POLL_MS / 1_000} seconds per call, matching the Codex default, then release the MCP channel so spawned Web agents can use their own tools. A wait timeout is not task completion; check agent progress and wait again if needed. Keep the native tool's declared arguments.`;
// The OpenAI tunnel currently owns a two-minute command-response deadline. The local MCP server
// must settle first so an abandoned native tool call is returned as an MCP error instead of
// letting the tunnel tear down and poison its long-lived stdio transport.
export const CHATGPT_WEB_MCP_INVOCATION_TIMEOUT_MS = 90_000;

const PORTAL_MANUAL_MCP_INSTRUCTIONS = [
  "For each pasted Portal request, begin with codex_turn_start using the request_id in its request block.",
  "Use that request_id with the Portal tools needed for the task.",
  "When the task is finished, send the complete answer with codex_turn_complete.",
  "If a tool returns an error, report that error instead of changing the request_id.",
].join(" ");

const DIRECT_EXEC_TOOL = {
  wire_name: "exec_command",
  name: "exec_command",
  namespace: null,
  description: "Run an unrestricted shell command on the local Mac. Supply a fresh random operation_id for each new command; reuse it only to retrieve that exact command's result after an uncertain transport retry.",
  kind: "function",
  parameters: {
    type: "object",
    properties: {
      cmd: { type: "string", minLength: 1, maxLength: 1_000_000 },
      operation_id: { type: "string", pattern: "^[0-9a-f-]{36}\\.[A-Za-z0-9_-]{16,128}$" },
      workdir: { type: "string", minLength: 1, maxLength: 4096 },
      timeout_ms: {
        type: "integer",
        minimum: 1,
        maximum: CHATGPT_WEB_MCP_INVOCATION_TIMEOUT_MS,
        default: 30_000,
      },
    },
    required: ["cmd", "operation_id"],
    additionalProperties: false,
  },
} as const;

async function runDirectCommand(
  input: Record<string, unknown>,
  signal?: AbortSignal,
  report?: DirectExecutionReporter,
): Promise<DirectExecutionOutcome> {
  assertAdvertisedArguments("exec_command", DIRECT_EXEC_TOOL.parameters, input);
  const cmd = input.cmd as string;
  const workdir = input.workdir as string | undefined;
  // Reserve termination time inside the tunnel's invocation deadline.
  const duration = Math.min(input.timeout_ms as number, CHATGPT_WEB_MCP_INVOCATION_TIMEOUT_MS - 2_000);
  const startedAt = performance.now();
  let started = false;
  let child: Bun.Subprocess | undefined;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  let escalationTimer: ReturnType<typeof setTimeout> | undefined;
  let finishTimer: ReturnType<typeof setTimeout> | undefined;
  let interruption: "timeout" | "cancelled" | undefined;
  let stdout = "";
  let stderr = "";
  const signalGroup = (name: NodeJS.Signals) => {
    if (!child?.pid) return;
    try {
      process.kill(-child.pid, name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
    }
  };
  let finishInterruption!: () => void;
  const interrupted = new Promise<DirectExecutionOutcome>(resolve => {
    finishInterruption = () => {
      const cancelled = interruption === "cancelled";
      report?.({
        stage: cancelled ? "cancellation" : "unknown",
        outcome: cancelled ? "cancelled" : "unknown",
        started,
        elapsed_ms: Math.round(performance.now() - startedAt),
        error_code: cancelled ? "client_cancelled" : "portal_direct_timeout",
        execution_proven: false,
        retry_guidance: "do_not_retry",
      });
      resolve({
        exit_code: null,
        stdout,
        stderr,
        started,
        code: cancelled ? "client_cancelled" : "portal_direct_timeout",
        retryable: false,
        message: cancelled
          ? "The direct command was cancelled. Its side effect status is not retryable."
          : `The direct command did not complete within ${duration}ms. Its side effect status is not retryable.`,
      });
    };
  });
  const interrupt = (reason: "timeout" | "cancelled") => {
    if (interruption) return;
    interruption = reason;
    signalGroup("SIGTERM");
    escalationTimer = setTimeout(() => signalGroup("SIGKILL"), 250);
    finishTimer = setTimeout(finishInterruption, 350);
  };
  const onAbort = () => interrupt("cancelled");
  try {
    // Bun's native detached spawn creates a new session on macOS. Its Node-compatible
    // execFile detached option does not; only the owned group may be signalled here.
    child = Bun.spawn({
      cmd: ["/bin/zsh", "-lc", cmd],
      ...(workdir ? { cwd: workdir } : {}),
      detached: true,
      stdout: "pipe",
      stderr: "pipe",
    });
    started = true;
    report?.({
      stage: "dispatch",
      outcome: "started",
      started: true,
      elapsed_ms: Math.round(performance.now() - startedAt),
      execution_proven: false,
      retry_guidance: "unknown",
    });
    const readOutput = async (stream: ReadableStream<Uint8Array>, assign: (text: string) => void) => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let bytes = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 2 * 1024 * 1024) throw new Error("Direct command maxBuffer exceeded");
        assign(decoder.decode(value, { stream: true }));
      }
      assign(decoder.decode());
    };
    const completion = Promise.all([
      child.exited,
      readOutput(child.stdout as ReadableStream<Uint8Array>, chunk => { stdout += chunk; }),
      readOutput(child.stderr as ReadableStream<Uint8Array>, chunk => { stderr += chunk; }),
    ]).then(([exitCode]) => ({ exitCode }));
    signal?.addEventListener("abort", onAbort, { once: true });
    if (signal?.aborted) onAbort();
    timeoutTimer = setTimeout(() => interrupt("timeout"), duration);
    const outcome = await Promise.race([completion, interrupted]);
    if (interruption) return await interrupted;
    if (!("exitCode" in outcome)) return outcome;
    report?.({
      stage: "execution_completion",
      outcome: outcome.exitCode === 0 ? "completed" : "failed",
      started,
      elapsed_ms: Math.round(performance.now() - startedAt),
      ...(outcome.exitCode === 0 ? {} : { error_code: `exit_${outcome.exitCode}` }),
      execution_proven: true,
      retry_guidance: "do_not_retry",
    });
    return { exit_code: outcome.exitCode, stdout, stderr, started };
  } catch (error) {
    if (started) signalGroup("SIGKILL");
    report?.({
      stage: "execution_completion",
      outcome: "failed",
      started,
      elapsed_ms: Math.round(performance.now() - startedAt),
      error_code: chatGptExecutionErrorCode(error),
      execution_proven: started,
      retry_guidance: started ? "do_not_retry" : "retry_safe",
    });
    throw error;
  } finally {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (escalationTimer) clearTimeout(escalationTimer);
    if (finishTimer) clearTimeout(finishTimer);
    signal?.removeEventListener("abort", onAbort);
  }
}

function assertAdvertisedArguments(
  toolName: string,
  parameters: unknown,
  args: Record<string, unknown>,
): void {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    coerceTypes: false,
    removeAdditional: false,
    useDefaults: true,
    validateFormats: true,
  });
  let validate: ValidateFunction;
  try {
    validate = ajv.compile(parameters as object | boolean);
  } catch (cause) {
    throw new Error(
      `Codex tool ${toolName} advertises an invalid argument schema: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }
  if (validate(args)) return;
  const detail = ajv.errorsText(validate.errors, { separator: "; " });
  throw new Error(`Arguments for Codex tool ${toolName} do not satisfy its advertised schema${detail ? `: ${detail}` : ""}`);
}

/**
 * Direct commands are still owned by the MCP dispatcher, not a second terminal service. The MCP
 * caller-supplied operation identity survives a transport retry without conflating distinct
 * commands when an MCP client omits or reuses its request ID.
 */
class DirectOperationLedger {
  private readonly operations = new Map<string, {
    argumentsHash: string;
    outcome: Promise<DirectExecutionOutcome>;
  }>();

  run(
    key: string,
    argumentsHash: string,
    operation: () => Promise<DirectExecutionOutcome>,
  ): Promise<DirectExecutionOutcome> {
    const existing = this.operations.get(key);
    if (existing) {
      if (existing.argumentsHash !== argumentsHash) {
        throw new Error("Direct Portal operation_id was reused with different command arguments");
      }
      return existing.outcome;
    }
    const outcome = operation();
    this.operations.set(key, { argumentsHash, outcome });
    return outcome;
  }
}

function directArgumentsHash(args: Record<string, unknown>): string {
  return createHash("sha256").update(JSON.stringify([
    args.cmd,
    args.workdir ?? null,
    args.timeout_ms ?? 30_000,
  ])).digest("hex");
}

function turnReferenceInput(contract: ChatGptMcpContract): Record<string, z.ZodType> {
  return contract === "safe"
    ? { request_id: turnTokenSchema }
    : { turn_token: turnTokenSchema.optional() };
}

function turnReference(contract: ChatGptMcpContract, input: object): string | undefined {
  const key = contract === "safe" ? "request_id" : "turn_token";
  const value = (input as Record<string, unknown>)[key];
  if (contract === "native" && value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${key} is required`);
  return value;
}

interface McpRequestExtra {
  sessionId?: string;
  requestId: string | number;
  _meta?: unknown;
  requestInfo?: unknown;
  signal?: AbortSignal;
}

function scopeHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function requestScopeSummary(extra: McpRequestExtra): string {
  const meta = extra._meta && typeof extra._meta === "object" && !Array.isArray(extra._meta)
    ? Object.entries(extra._meta as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => ({
        key,
        type: value === null ? "null" : Array.isArray(value) ? "array" : typeof value,
        ...(typeof value === "string" ? { chars: value.length, hash: scopeHash(value) } : {}),
      }))
    : [];
  const requestInfoKeys = extra.requestInfo && typeof extra.requestInfo === "object"
    ? Object.keys(extra.requestInfo as Record<string, unknown>).sort()
    : [];
  return JSON.stringify({
    requestRef: chatGptExecutionReference(`${extra.sessionId ?? "anonymous"}:${String(extra.requestId)}`),
    session: extra.sessionId ? { chars: extra.sessionId.length, hash: scopeHash(extra.sessionId) } : null,
    meta,
    requestInfoKeys,
  });
}

type McpExecutionEvidence = Parameters<typeof emitChatGptExecutionEvidence>[0];

function mcpRequestReference(extra: McpRequestExtra): string {
  return chatGptExecutionReference(`${extra.sessionId ?? "anonymous"}:${String(extra.requestId)}`);
}

function emitMcpExecutionEvidence(extra: McpRequestExtra, evidence: McpExecutionEvidence): void {
  emitChatGptExecutionEvidence({
    ...evidence,
    mcp_request_ref: mcpRequestReference(extra),
  });
}

function result(value: Record<string, unknown>, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value) }],
    structuredContent: value,
    ...(isError ? { isError: true } : {}),
  };
}

function afterSafeStart(contract: ChatGptMcpContract, description: string): string {
  return contract === "safe"
    ? `For a Portal request connected by codex_turn_start. ${description}`
    : description;
}

function wireName(tool: CodexTool): string {
  return namespacedToolName(tool.namespace, tool.name);
}

function exactTool(environment: ChatGptTurnEnvironment, name: string): CodexTool | undefined {
  return environment.tools.find(tool => !tool.namespace && tool.name === name);
}

function gatewayToolNameIsValid(name: string): boolean {
  return /^[A-Za-z0-9_$]+$/.test(name);
}

function safeVisibleTools(environment: ChatGptTurnEnvironment, contract: ChatGptMcpContract): CodexTool[] {
  if (contract === "native") return environment.tools;
  const bridgeNamespaces = new Set(environment.tools
    .filter(tool => tool.namespace && BRIDGE_TOOL_NAMES.has(tool.name))
    .map(tool => tool.namespace!));
  return environment.tools.filter(tool => (
    wireName(tool) !== CODEX_COMPACTION_CONTROL_WIRE_NAME
    && !BRIDGE_TOOL_NAMES.has(tool.name)
    // Portal manual mode does not expose model-authored JavaScript. Automatic Full mode keeps the native
    // Codex exec surface and applies its transport guard at invocation time below.
    && (tool.namespace !== undefined || tool.name !== "exec")
    && (!tool.namespace || !bridgeNamespaces.has(tool.namespace))
  ));
}

function isAgentWaitTool(tool: CodexTool): boolean {
  return isGatewayAgentWaitTool(wireName(tool));
}

function isGatewayAgentWaitTool(name: string): boolean {
  return GATEWAY_AGENT_WAIT_TOOL_NAMES.has(name);
}

function browserToolDescription(tool: CodexTool): string {
  if (isAgentWaitTool(tool)) return `${tool.description}\n\n${AGENT_WAIT_TRANSPORT_RULE}`;
  if (!tool.namespace && tool.name === "exec") {
    return `${tool.description}\n\n${AGENT_WAIT_TRANSPORT_RULE} This rule is enforced for wait_agent calls made inside exec; recursive raw exec is unavailable.`;
  }
  return tool.description;
}

function browserToolParameters(tool: CodexTool): Record<string, unknown> {
  if (!isAgentWaitTool(tool)) return tool.parameters;
  const parameters = structuredClone(tool.parameters);
  const properties = parameters.properties && typeof parameters.properties === "object" && !Array.isArray(parameters.properties)
    ? parameters.properties as Record<string, unknown>
    : {};
  const timeout = properties.timeout_ms && typeof properties.timeout_ms === "object" && !Array.isArray(properties.timeout_ms)
    ? properties.timeout_ms as Record<string, unknown>
    : {};
  // The cloned native schema must not advertise a default that contradicts our required interval.
  delete timeout.default;
  const required = Array.isArray(parameters.required)
    ? parameters.required.filter((value): value is string => typeof value === "string")
    : [];
  return {
    ...parameters,
    properties: {
      ...properties,
      timeout_ms: {
        ...timeout,
        type: "number",
        const: CHATGPT_WEB_AGENT_WAIT_POLL_MS,
        minimum: CHATGPT_WEB_AGENT_WAIT_POLL_MS,
        maximum: CHATGPT_WEB_AGENT_WAIT_POLL_MS,
        description: `Required transport-safe polling interval. Use exactly ${CHATGPT_WEB_AGENT_WAIT_POLL_MS}; a timed-out wait does not mean the agents have finished.`,
      },
    },
    required: [...new Set([...required, "timeout_ms"])],
  };
}

function assertBrowserToolArguments(tool: CodexTool, args: Record<string, unknown>): void {
  if (!isAgentWaitTool(tool)) return;
  if (args.timeout_ms !== CHATGPT_WEB_AGENT_WAIT_POLL_MS) {
    throw new Error(
      `ChatGPT Web wait_agent requires timeout_ms=${CHATGPT_WEB_AGENT_WAIT_POLL_MS}`
      + " so the shared MCP channel remains available to spawned Web agents",
    );
  }
}

function assertGatewayToolArguments(name: string, args: Record<string, unknown>): void {
  if (!isGatewayAgentWaitTool(name)) return;
  if (args.timeout_ms !== CHATGPT_WEB_AGENT_WAIT_POLL_MS) {
    throw new Error(
      `ChatGPT Web wait_agent requires timeout_ms=${CHATGPT_WEB_AGENT_WAIT_POLL_MS}`
      + " so the shared MCP channel remains available to spawned Web agents",
    );
  }
}

export function chatGptMcpInvocationTimeout(
  environment: ChatGptTurnEnvironment & { expiresAt?: number },
  now = Date.now(),
): number {
  const remaining = environment.expiresAt === undefined
    ? CHATGPT_WEB_MCP_INVOCATION_TIMEOUT_MS
    : Math.max(1, environment.expiresAt - now);
  return Math.min(CHATGPT_WEB_MCP_INVOCATION_TIMEOUT_MS, remaining);
}

function asMcpResult(value: BrokerToolResult, mode: PortalExecutionMode) {
  const structuredContent = value.structuredContent !== undefined
    && value.structuredContent !== null
    && typeof value.structuredContent === "object"
    && !Array.isArray(value.structuredContent)
    ? { ...(value.structuredContent as Record<string, unknown>), mode }
    : value.structuredContent !== undefined
      ? { mode, result: value.structuredContent }
      : { mode };
  return {
    content: value.content as never,
    structuredContent,
    ...(value.isError ? { isError: true } : {}),
    ...(value._meta !== undefined && value._meta !== null && typeof value._meta === "object"
      ? { _meta: value._meta as Record<string, unknown> }
      : {}),
  };
}

function execGateway(environment: ChatGptTurnEnvironment): CodexTool | undefined {
  const tool = exactTool(environment, "exec");
  return tool?.freeform ? tool : undefined;
}

function gatewayNestedToolName(toolName: string): string {
  return toolName.replace(/[^A-Za-z0-9_$]/g, "_");
}

interface GatewayToolDescriptor {
  name: string;
  description: string;
}

interface GatewayToolCatalogPage {
  tools: GatewayToolDescriptor[];
  total: number;
}

function gatewayToolDescription(tool: GatewayToolDescriptor): string {
  if (!isGatewayAgentWaitTool(tool.name)) return tool.description;
  return `${tool.description}\n\n${AGENT_WAIT_TRANSPORT_RULE}`;
}

function gatewayToolCatalogProgram(options: {
  query?: string;
  offset: number;
  limit: number;
  excludedNames: string[];
}): string {
  const needle = options.query?.trim().toLowerCase() ?? "";
  return [
    "if (typeof ALL_TOOLS === \"undefined\" || !Array.isArray(ALL_TOOLS)) throw new Error(\"Native nested tool registry is unavailable\");",
    `const excludedNames = new Set(${JSON.stringify(options.excludedNames)});`,
    `const needle = ${JSON.stringify(needle)};`,
    "const visibleName = name => {",
    "  return typeof name === \"string\" && /^[A-Za-z0-9_$]+$/.test(name) && !excludedNames.has(name);",
    "};",
    "const matches = ALL_TOOLS",
    "  .filter(tool => visibleName(tool?.name))",
    "  .map(tool => ({ name: tool.name, description: typeof tool.description === \"string\" ? tool.description : \"\" }))",
    "  .filter(tool => !needle || (tool.name + \"\\n\" + tool.description).toLowerCase().includes(needle));",
    `const page = matches.slice(${options.offset}, ${options.offset + options.limit});`,
    "text(JSON.stringify({ tools: page, total: matches.length }));",
  ].join("\n");
}

function gatewayToolCatalogPage(response: {
  content: unknown[];
  isError?: boolean;
}, excludedNames: ReadonlySet<string>): GatewayToolCatalogPage {
  const textBlocks = response.content
    .map(item => item && typeof item === "object" && !Array.isArray(item)
      ? item as Record<string, unknown>
      : undefined)
    .filter((item): item is Record<string, unknown> => item?.type === "text" && typeof item.text === "string")
    .map(item => item.text as string);
  if (response.isError) {
    throw new Error(`Native nested tool inventory failed: ${textBlocks.join("\n") || "unknown error"}`);
  }
  if (textBlocks.length !== 1) {
    throw new Error("Native nested tool inventory returned an invalid text response");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlocks[0]!);
  } catch {
    throw new Error("Native nested tool inventory returned invalid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Native nested tool inventory returned an invalid catalog");
  }
  const catalog = parsed as Record<string, unknown>;
  if (!Number.isSafeInteger(catalog.total) || (catalog.total as number) < 0 || !Array.isArray(catalog.tools)) {
    throw new Error("Native nested tool inventory returned invalid pagination");
  }
  const tools = catalog.tools.map((value): GatewayToolDescriptor => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Native nested tool inventory returned an invalid tool entry");
    }
    const tool = value as Record<string, unknown>;
    if (typeof tool.name !== "string"
      || typeof tool.description !== "string"
      || !gatewayToolNameIsValid(tool.name)
      || excludedNames.has(tool.name)) {
      throw new Error("Native nested tool inventory returned an invalid tool descriptor");
    }
    return { name: tool.name, description: tool.description };
  });
  return { tools, total: catalog.total as number };
}

function execGatewayResultProgram(invocation: string[]): string {
  return [
    ...invocation,
    "const emit = value => {",
    "  if (Array.isArray(value)) { for (const item of value) emit(item); return; }",
    "  if (value && typeof value === \"object\") {",
    "    if (value.type === \"image\") { image(value); return; }",
    "    if (value.type === \"audio\") { audio(value); return; }",
    "    if (value.type === \"text\" && typeof value.text === \"string\") { text(value.text); return; }",
    "    if (typeof value.image_url === \"string\" && typeof value.output_hint === \"string\") { generatedImage(value); return; }",
    "    if (typeof value.image_url === \"string\") { image(value.image_url, value.detail ?? \"auto\"); return; }",
    "    if (typeof value.audio_url === \"string\") { audio(value.audio_url); return; }",
    "    if (Array.isArray(value.content)) { for (const item of value.content) emit(item); return; }",
    "  }",
    "  text(value);",
    "};",
    "emit(result);",
  ].join("\n");
}

function execGatewayProgram(
  nestedToolName: string,
  freeform: boolean,
  payload: { arguments?: Record<string, unknown>; input?: string },
  excludedNames: string[],
): string {
  if (!gatewayToolNameIsValid(nestedToolName) || excludedNames.includes(nestedToolName)) {
    throw new Error(`Codex nested tool is not available in this turn: ${nestedToolName}`);
  }
  const gatewayName = gatewayNestedToolName(nestedToolName);
  if (gatewayName !== nestedToolName) {
    throw new Error(`Codex nested tool name is invalid: ${nestedToolName}`);
  }
  const nestedInput = freeform ? payload.input ?? "" : payload.arguments ?? {};
  return execGatewayResultProgram([
    "if (typeof ALL_TOOLS === \"undefined\" || !Array.isArray(ALL_TOOLS)) throw new Error(\"Native nested tool registry is unavailable\");",
    `const nestedToolName = ${JSON.stringify(gatewayName)};`,
    `const excludedNames = new Set(${JSON.stringify(excludedNames)});`,
    "if (excludedNames.has(nestedToolName)) throw new Error(\"Native nested tool is not callable through the structured gateway\");",
    "if (!ALL_TOOLS.some(tool => tool?.name === nestedToolName)) throw new Error(\"Native nested tool is not listed in this turn\");",
    "const nestedTool = tools[nestedToolName];",
    "if (typeof nestedTool !== \"function\") throw new Error(\"Native nested tool is listed but unavailable\");",
    `const result = await nestedTool(${JSON.stringify(nestedInput)});`,
  ]);
}

/**
 * Preserve the native freeform exec surface while applying the same wait_agent deadline contract
 * as direct calls. The model still owns its JavaScript; only the tool registry it receives is a
 * transparent proxy whose native wait functions validate their transport-bound argument before dispatch.
 */
function transportBoundRawExecProgram(input: string, blockedExecName: string): string {
  return [
    "await (async (tools) => {",
    input,
    "})((() => {",
    "  const source = tools;",
    `  const waitNames = new Set(${JSON.stringify([...GATEWAY_AGENT_WAIT_TOOL_NAMES])});`,
    `  const blockedExecName = ${JSON.stringify(blockedExecName)};`,
    `  const pollMs = ${CHATGPT_WEB_AGENT_WAIT_POLL_MS};`,
    "  const registryNames = new Set(Reflect.ownKeys(source));",
    "  if (typeof ALL_TOOLS !== \"undefined\" && Array.isArray(ALL_TOOLS)) {",
    "    for (const tool of ALL_TOOLS) if (typeof tool?.name === \"string\") registryNames.add(tool.name);",
    "  }",
    "  const wrappers = new Map();",
    "  const expose = name => {",
    "    if (wrappers.has(name)) return wrappers.get(name);",
    "    const value = Reflect.get(source, name, source);",
    "    let exposed = value;",
    "    if (typeof value === \"function\" && name === blockedExecName) {",
    "      exposed = () => { throw new Error(\"Nested raw exec is unavailable inside ChatGPT Web exec\"); };",
    "    } else if (typeof value === \"function\" && typeof name === \"string\" && waitNames.has(name)) {",
    "      exposed = args => {",
    "        if (!args || typeof args !== \"object\" || Array.isArray(args) || args.timeout_ms !== pollMs) {",
    "          throw new Error(\"ChatGPT Web wait_agent requires timeout_ms=\" + pollMs + \" so the shared MCP channel remains available to spawned Web agents\");",
    "        }",
    "        return Reflect.apply(value, source, [args]);",
    "      };",
    "    } else if (typeof value === \"function\") {",
    "      exposed = (...args) => Reflect.apply(value, source, args);",
    "    }",
    "    wrappers.set(name, exposed);",
    "    return exposed;",
    "  };",
    "  return new Proxy(Object.create(null), {",
    "    get: (_target, name) => expose(name),",
    "    has: (_target, name) => registryNames.has(name) || Reflect.has(source, name),",
    "    ownKeys: () => [...registryNames],",
    "    getOwnPropertyDescriptor: (_target, name) =>",
    "      registryNames.has(name) || Reflect.has(source, name)",
    "        ? { configurable: true, enumerable: true, writable: false, value: expose(name) }",
    "        : undefined,",
    "    set: () => false,",
    "    defineProperty: () => false,",
    "    deleteProperty: () => false,",
    "    setPrototypeOf: () => false,",
    "    getPrototypeOf: () => null,",
    "    preventExtensions: () => false,",
    "  });",
    "})());",
  ].join("\n");
}

function execCommandGatewayProgram(
  execCommandArguments: Record<string, unknown>,
  shellCommandArguments: Record<string, unknown>,
): string {
  const execCommandName = gatewayNestedToolName("exec_command");
  const shellCommandName = gatewayNestedToolName("shell_command");
  return execGatewayResultProgram([
    "if (typeof ALL_TOOLS === \"undefined\" || !Array.isArray(ALL_TOOLS)) throw new Error(\"Native command tool registry is unavailable\");",
    "const nativeCommandNames = new Set(ALL_TOOLS.map(tool => tool?.name));",
    `const nativeCommandCandidates = ${JSON.stringify([execCommandName, shellCommandName])}.filter(name => nativeCommandNames.has(name));`,
    "if (nativeCommandCandidates.length !== 1) throw new Error(\"Expected exactly one native command tool; found \" + (nativeCommandCandidates.join(\", \") || \"none\"));",
    "const nativeCommandName = nativeCommandCandidates[0];",
    "const nativeCommand = tools[nativeCommandName];",
    "if (typeof nativeCommand !== \"function\") throw new Error(\"Native command tool \" + nativeCommandName + \" is listed but unavailable\");",
    `const nativeCommandInput = nativeCommandName === ${JSON.stringify(execCommandName)} ? ${JSON.stringify(execCommandArguments)} : ${JSON.stringify(shellCommandArguments)};`,
    "const result = await nativeCommand(nativeCommandInput);",
  ]);
}

export async function runChatGptMcpServer(options: {
  brokerSocketPath: string;
  contract?: ChatGptMcpContract;
}): Promise<void> {
  const contract = options.contract ?? "native";
  const directOperations = new DirectOperationLedger();
  const directWorkerEpoch = randomUUID();
  const server = new McpServer(
    { name: CHATGPT_CONNECTOR_NAME, version: VERSION },
    contract === "safe" ? { instructions: PORTAL_MANUAL_MCP_INSTRUCTIONS } : undefined,
  );
  const boundContextField = contract === "safe" ? "request_id" : "turn_token";
  const portalToolsDescription = contract === "safe"
    ? `Discover the live Portal tool registry. In a bound Portal request, pass the supplied ${boundContextField} unchanged.`
    : `Discover the live Portal tool registry. In a bound Codex turn, pass the supplied ${boundContextField} unchanged; omit ${boundContextField} only in a direct ChatGPT conversation, which exposes exec_command.`;
  const portalCallDescription = contract === "safe"
    ? `Invoke the exact wire_name returned by portal_tools with its declared arguments, or pass input for a freeform tool. In a bound Portal request, pass the supplied ${boundContextField} unchanged.`
    : `Invoke the exact wire_name returned by portal_tools with its declared arguments, or pass input for a freeform tool. In a bound Codex turn, pass the supplied ${boundContextField} unchanged; omit ${boundContextField} only for direct exec_command.`;

  const claimTurn = async (
    toolName: string,
    turnToken: string,
    extra: McpRequestExtra,
  ): Promise<ClaimedTurn> => {
    const startedAt = performance.now();
    console.error(`[portal-mcp] ${toolName} scope=${requestScopeSummary(extra)}`);
    const activityId = `activity_${randomBytes(18).toString("base64url")}`;
    try {
      const claimed = await callTurnBroker<Omit<ClaimedTurn, "activityId">>(
        options.brokerSocketPath,
        { method: "claim", token: turnToken, activityId, contract },
        contract === "safe" ? null : 5_000,
        extra.signal,
      );
      return { ...claimed, activityId };
    } catch (error) {
      emitMcpExecutionEvidence(extra, {
        stage: "unknown",
        outcome: "failed",
        context: "bound",
        tool: toolName,
        started: false,
        elapsed_ms: Math.round(performance.now() - startedAt),
        error_code: chatGptExecutionErrorCode(error),
        execution_proven: false,
        retry_guidance: "do_not_retry",
      });
      try {
        await settleTurnActivity(turnToken, activityId);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "Portal claim failed and its broker activity could not be retired",
        );
      }
      throw error;
    }
  };

  const settleTurnActivity = async (turnToken: string, activityId: string): Promise<void> => {
    let firstError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await callTurnBroker(options.brokerSocketPath, {
          method: "activity_complete",
          token: turnToken,
          activityId,
        }, 5_000);
        return;
      } catch (error) {
        firstError ??= error;
      }
    }
    throw new AggregateError(
      [firstError],
      "Portal broker activity cleanup failed after an idempotent retry",
    );
  };

  const withExecutionContext = async <T>(
    toolName: string,
    turnToken: string | undefined,
    extra: McpRequestExtra,
    action: (context: PortalExecutionContext) => Promise<T> | T,
  ): Promise<T> => {
    // Context selection is intentionally made before any tool lookup or invocation. An omitted
    // native token is the only direct-execution case; every supplied token must cross the broker.
    if (turnToken === undefined) {
      emitMcpExecutionEvidence(extra, {
        stage: "dispatch",
        outcome: "accepted",
        context: "direct",
        tool: toolName,
        started: false,
        elapsed_ms: 0,
        execution_proven: false,
        retry_guidance: "unknown",
      });
      return await action({ mode: "direct" });
    }
    const claimed = await claimTurn(toolName, turnToken, extra);
    emitMcpExecutionEvidence(extra, {
      stage: "dispatch",
      outcome: "accepted",
      context: "bound",
      trace_id: claimed.traceId,
      tool: toolName,
      started: false,
      elapsed_ms: 0,
      execution_proven: false,
      retry_guidance: "unknown",
    });
    try {
      return await action({ mode: "bound", claimed });
    } finally {
      // The broker's terminal fence treats even a fully local inventory lookup as live MCP work.
      // Settle the lease without the request AbortSignal: cancellation must not strand activity
      // and silently prevent every later completion candidate from committing.
      await settleTurnActivity(turnToken, claimed.activityId);
    }
  };

  if (contract === "safe") {
    server.registerTool(
      "codex_turn_start",
      {
        title: "Connect a Portal request",
        description: "Connect the request_id included in the pasted Portal request so its Portal tools can be used.",
        inputSchema: {
          request_id: turnTokenSchema,
        },
        outputSchema: {
          started: z.literal(true),
          duplicate: z.boolean(),
        },
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ request_id }, extra) => {
        console.error(`[chatgpt-web-mcp] codex_turn_start scope=${requestScopeSummary(extra)}`);
        const response = await callTurnBroker<{ started: true; duplicate: boolean }>(options.brokerSocketPath, {
          method: "safe_start",
          token: request_id,
        }, 5_000, extra.signal);
        return result(response);
      },
    );
  }

  const invoke = async (
    bindingId: string,
    bound: ChatGptTurnEnvironment & { expiresAt?: number },
    tool: CodexTool,
    payload: { arguments?: Record<string, unknown>; input?: string },
    signal?: AbortSignal,
    traceId?: string,
    requestRef?: string,
  ) => {
    const timeoutMs = chatGptMcpInvocationTimeout(bound);
    const startedAt = performance.now();
    const callId = `call_${randomBytes(24).toString("base64url")}`;
    try {
      const response = await callTurnBroker<BrokerToolResult>(options.brokerSocketPath, {
        method: "invoke",
        bindingId,
        callId,
        wireName: wireName(tool),
        freeform: tool.freeform === true,
        ...(tool.freeform ? { input: payload.input ?? "" } : { arguments: payload.arguments ?? {} }),
      }, timeoutMs, signal);
      return asMcpResult(response, "bound");
    } catch (error) {
      const errorCode = error instanceof TurnBrokerTimeoutError
        ? "codex_tool_timeout"
        : chatGptExecutionErrorCode(error);
      const cancelled = errorCode === "client_cancelled";
      emitChatGptExecutionEvidence({
        stage: cancelled ? "cancellation" : error instanceof TurnBrokerTimeoutError ? "unknown" : "execution_completion",
        outcome: cancelled ? "cancelled" : error instanceof TurnBrokerTimeoutError ? "unknown" : "failed",
        context: "bound",
        ...(traceId ? { trace_id: traceId } : {}),
        ...(requestRef ? { mcp_request_ref: requestRef } : {}),
        call_ref: chatGptExecutionReference(callId),
        tool: wireName(tool),
        started: "unknown",
        elapsed_ms: Math.round(performance.now() - startedAt),
        error_code: errorCode,
        execution_proven: false,
        retry_guidance: "do_not_retry",
      });
      // A cancelled/timed-out MCP request no longer has a consumer for the native result. Revoke
      // the whole turn capability so the broker drops the pending invocation and every later call
      // from that abandoned ChatGPT response fails explicitly against its retired binding.
      try {
        await callTurnBroker(options.brokerSocketPath, {
          method: "release",
          bindingId,
        });
      } catch (releaseError) {
        throw new AggregateError(
          [error, releaseError],
          "Portal invocation failed and its abandoned broker binding could not be retired",
        );
      }
      if (error instanceof TurnBrokerTimeoutError) {
        const toolName = wireName(tool);
        console.error(
          `[portal-mcp] ${toolName} did not complete within ${timeoutMs}ms; retired its turn binding`,
        );
        return result({
          mode: "bound",
          code: "codex_tool_timeout",
          tool: toolName,
          timeout_ms: timeoutMs,
          started: "unknown",
          retryable: false,
          message: `Codex tool ${toolName} did not complete before the MCP transport deadline. The current turn binding was retired; do not retry it in this ChatGPT response.`,
        }, true);
      }
      throw error;
    }
  };

  server.registerTool(
    "portal_tools",
    {
      title: "Discover tools available to Portal",
      description: portalToolsDescription,
      inputSchema: {
        ...turnReferenceInput(contract),
        query: z.string().max(500).optional(),
        offset: z.number().int().min(0).max(100_000).default(0),
        limit: z.number().int().min(1).max(50).default(20),
        include_schema: z.boolean().default(true),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (input, extra) => {
      return await withExecutionContext(
        "portal_tools",
        turnReference(contract, input),
        extra,
        async context => {
          const { query, offset, limit, include_schema } = input;
          const needle = query?.trim().toLowerCase();
          if (context.mode === "direct") {
            const directDescription = `${DIRECT_EXEC_TOOL.description} Prefix operation_id with ${directWorkerEpoch}.; if that prefix becomes invalid after a worker restart, the earlier command outcome is unknown and must not be retried as a new operation.`;
            const matches = !needle || [
              DIRECT_EXEC_TOOL.wire_name,
              directDescription,
            ].join("\n").toLowerCase().includes(needle);
            const available = matches ? [{
              ...DIRECT_EXEC_TOOL,
              description: directDescription,
              ...(include_schema ? {} : { parameters: undefined }),
            }] : [];
            const tools = available.slice(offset, offset + limit);
            return result({
              tools,
              total: available.length,
              next_offset: offset + tools.length < available.length ? offset + tools.length : null,
              operation_prefix: directWorkerEpoch,
              mode: context.mode,
            });
          }

          const bound = context.claimed.environment;
          const directMatches = safeVisibleTools(bound, contract).filter(tool => !needle || [
            wireName(tool),
            tool.name,
            tool.namespace ?? "",
            tool.description,
          ].join("\n").toLowerCase().includes(needle));
          const directPage = directMatches.slice(offset, offset + limit).map(tool => ({
            wire_name: wireName(tool),
            name: tool.name,
            namespace: tool.namespace ?? null,
            description: browserToolDescription(tool),
            kind: tool.freeform ? "freeform" : tool.toolSearch ? "tool_search" : "function",
            ...(include_schema ? { parameters: browserToolParameters(tool) } : {}),
          }));
          let nestedTotal = 0;
          let nestedPage: Array<Record<string, unknown>> = [];
          const gateway = execGateway(bound);
          if (gateway) {
            const excludedGatewayNames = bound.tools.map(wireName);
            const nestedOffset = Math.max(0, offset - directMatches.length);
            const nestedLimit = Math.max(0, limit - directPage.length);
            const response = await invoke(context.claimed.bindingId, bound, gateway, {
              input: gatewayToolCatalogProgram({
                query,
                offset: nestedOffset,
                limit: nestedLimit,
                // A gateway-discovered entry may supplement the outer registry, but it must never
                // duplicate or reopen an outer tool that this contract deliberately hid (including
                // our own MCP namespace in the Portal manual contract).
                excludedNames: excludedGatewayNames,
              }),
            }, extra.signal, context.claimed.traceId, mcpRequestReference(extra));
            const catalog = gatewayToolCatalogPage(response, new Set(excludedGatewayNames));
            nestedTotal = catalog.total;
            nestedPage = catalog.tools.map(tool => ({
              wire_name: tool.name,
              name: tool.name,
              namespace: null,
              description: gatewayToolDescription(tool),
              kind: "gateway",
              ...(include_schema ? {
                parameters: {
                  type: "object",
                  additionalProperties: true,
                  description: "Pass the exact structured arguments declared in this tool's description. For a declared freeform tool, use portal_call.input instead.",
                },
              } : {}),
            }));
          }
          const page = [...directPage, ...nestedPage];
          const total = directMatches.length + nestedTotal;
          return result({
            tools: page,
            total,
            next_offset: offset + page.length < total ? offset + page.length : null,
            mode: context.mode,
          });
        },
      );
    },
  );

  server.registerTool(
    "portal_call",
    {
      title: "Call any tool from the current Codex harness",
      description: portalCallDescription,
      inputSchema: {
        ...turnReferenceInput(contract),
        wire_name: z.string().min(1).max(1_000),
        arguments: jsonArgumentsSchema.optional(),
        input: z.string().max(5_000_000).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    async (toolInput, extra) => {
      const { wire_name, arguments: args, input } = toolInput;
      const requestId = turnReference(contract, toolInput);
      if (contract === "native" && wire_name === CODEX_COMPACTION_CONTROL_WIRE_NAME) {
        if (requestId === undefined) {
          throw new Error("Compaction control handoff requires a bound turn_token");
        }
        if (input !== undefined) {
          throw new Error("Compaction control handoff does not accept freeform input");
        }
        const handoffId = args?.handoff_id;
        const summary = args?.summary;
        if (typeof handoffId !== "string" || handoffId.length === 0) {
          throw new Error("Compaction control handoff requires handoff_id");
        }
        if (typeof summary !== "string") {
          throw new Error("Compaction control handoff requires summary");
        }
        await callTurnBroker(options.brokerSocketPath, {
          method: "submit_compaction_handoff",
          token: requestId,
          handoffId,
          summary,
        }, 5_000, extra.signal);
        return result({ submitted: true, mode: "bound" });
      }
      return await withExecutionContext("portal_call", requestId, extra, async context => {
        if (context.mode === "direct") {
          if (wire_name !== DIRECT_EXEC_TOOL.wire_name || input !== undefined) {
            throw new Error(`Direct Portal tool is not available: ${wire_name}`);
          }
          const invocationArguments = args ?? {};
          try {
            assertAdvertisedArguments(DIRECT_EXEC_TOOL.wire_name, DIRECT_EXEC_TOOL.parameters, invocationArguments);
          } catch (error) {
            emitMcpExecutionEvidence(extra, {
              stage: "execution_completion",
              outcome: "failed",
              context: "direct",
              tool: DIRECT_EXEC_TOOL.wire_name,
              started: false,
              error_code: "invalid_arguments",
              execution_proven: false,
              retry_guidance: "retry_safe",
            });
            throw error;
          }
          if (!(invocationArguments.operation_id as string).startsWith(`${directWorkerEpoch}.`)) {
            throw new Error("Direct Portal worker changed; the prior command outcome is unknown. Do not retry it with a new operation_id.");
          }
          const outcome = await directOperations.run(
            invocationArguments.operation_id as string,
            directArgumentsHash(invocationArguments),
            () => runDirectCommand(invocationArguments, extra.signal, event => emitMcpExecutionEvidence(extra, {
              ...event,
              context: "direct",
              tool: DIRECT_EXEC_TOOL.wire_name,
            })),
          );
          return result({ ...outcome, operation_id: invocationArguments.operation_id, mode: context.mode }, outcome.code !== undefined);
        }

        const bound = context.claimed.environment;
        const tool = safeVisibleTools(bound, contract)
          .find(candidate => wireName(candidate) === wire_name);
        if (!tool) {
          const gateway = execGateway(bound);
          const hiddenOuterTool = bound.tools.some(candidate => wireName(candidate) === wire_name);
          if (!gateway || hiddenOuterTool || !gatewayToolNameIsValid(wire_name)) {
            throw new Error(`Codex tool is not available in this turn: ${wire_name}`);
          }
          if (input !== undefined && args && Object.keys(args).length > 0) {
            throw new Error(`Codex nested tool ${wire_name} accepts either arguments or freeform input, not both`);
          }
          if (isGatewayAgentWaitTool(wire_name) && input !== undefined) {
            throw new Error(`ChatGPT Web wait_agent requires structured arguments and timeout_ms=${CHATGPT_WEB_AGENT_WAIT_POLL_MS}`);
          }
          const invocationArguments = args ?? {};
          assertGatewayToolArguments(wire_name, invocationArguments);
          return invoke(context.claimed.bindingId, bound, gateway, {
            input: execGatewayProgram(wire_name, input !== undefined, {
              ...(input !== undefined ? { input } : { arguments: invocationArguments }),
            }, bound.tools.map(wireName)),
          }, extra.signal, context.claimed.traceId, mcpRequestReference(extra));
        }
        if (tool.freeform) {
          if (input === undefined) throw new Error(`Freeform Codex tool ${wire_name} requires input`);
          if (args && Object.keys(args).length > 0) throw new Error(`Freeform Codex tool ${wire_name} does not accept arguments`);
          return invoke(context.claimed.bindingId, bound, tool, {
            input: tool === execGateway(bound) ? transportBoundRawExecProgram(input, wireName(tool)) : input,
          }, extra.signal, context.claimed.traceId, mcpRequestReference(extra));
        }
        if (input !== undefined) throw new Error(`Function Codex tool ${wire_name} does not accept freeform input`);
        const invocationArguments = args ?? {};
        assertAdvertisedArguments(wire_name, tool.parameters, invocationArguments);
        assertBrowserToolArguments(tool, invocationArguments);
        return invoke(
          context.claimed.bindingId,
          bound,
          tool,
          { arguments: invocationArguments },
          extra.signal,
          context.claimed.traceId,
          mcpRequestReference(extra),
        );
        });
    },
  );

  if (contract === "safe") {
    server.registerTool(
      "codex_turn_complete",
      {
        title: "Return the result to Codex",
        description: "Send the complete answer back to the connected Codex request after its work is finished. For compaction, send the requested compacted summary.",
        inputSchema: {
          request_id: turnTokenSchema,
          final_answer: z.string().min(1).max(5_000_000),
        },
        outputSchema: {
          completed: z.literal(true),
          duplicate: z.boolean(),
        },
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ request_id, final_answer }, extra) => {
        console.error(`[chatgpt-web-mcp] codex_turn_complete scope=${requestScopeSummary(extra)}`);
        const response = await callTurnBroker<{ completed: true; duplicate: boolean }>(options.brokerSocketPath, {
          method: "safe_complete",
          token: request_id,
          finalAnswer: final_answer,
        }, null, extra.signal);
        return result(response);
      },
    );
  }

  await server.connect(observeMcpToolCalls(new StdioServerTransport(), BRIDGE_TOOL_NAMES));
}
