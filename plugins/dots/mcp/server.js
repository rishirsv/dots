import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";

import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { Workspace } from "./workspace.js";

const HOST = "127.0.0.1";
const MAX_TIMER_MS = 2 ** 31 - 1;

export async function serve({
  runDir,
  port = 8765,
  idleMs = 3_600_000,
  maxMs = 82_800_000,
  graceMs = 60_000,
  onReady = () => {},
  onClose = () => {},
}) {
  validateOptions({ runDir, port, idleMs, maxMs, graceMs });
  const run = JSON.parse(await readFile(join(runDir, "run.json"), "utf8"));
  validateRun(run);

  let status = "starting";
  let unhealthy;
  let listening = false;
  let closing;
  let closedResolve;
  let actualPort = port;
  let idleTimer;
  let graceTimer;
  let lastActivity = Date.now();
  let activeRequests = 0;
  let finalAdvice = await readExistingFinal(runDir);
  let stateGate = Promise.resolve();
  const closed = new Promise((resolve) => { closedResolve = resolve; });

  const workspace = new Workspace({
    repo: run.repo,
    access: run.access,
    onFatal: (error) => {
      unhealthy = error instanceof Error ? error : new Error(String(error));
      void shutdown("interrupted", `workspace failure: ${unhealthy.message}`);
    },
  });

  const mcp = createMcpHandler(makeMcpServer, { onerror: () => {} });
  const handleMcp = toNodeHandler(mcp);
  const httpServer = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      if (url.pathname === "/health" && request.method === "GET") {
        return sendJson(response, 200, {
          runId: run.id, status, repo: run.repo, access: run.access, pid: process.pid,
        });
      }
      if (url.pathname === "/stop" && request.method === "POST") {
        if (request.headers.authorization !== `Bearer ${run.controlToken}`) {
          return sendJson(response, 401, { error: "unauthorized" });
        }
        sendJson(response, 202, { stopping: true });
        void shutdown("stopped", "stop requested");
        return;
      }
      if (url.pathname === "/mcp") return await handleMcp(request, response);
      sendJson(response, 404, { error: "not found" });
    } catch (error) {
      if (!response.headersSent) sendJson(response, 500, { error: errorMessage(error) });
      else response.end();
    }
  });

  const maxTimer = setTimeout(
    () => void shutdown("interrupted", "maximum lifetime exceeded", true),
    maxMs,
  );

  function makeMcpServer() {
    const server = new McpServer({ name: "dots-advisor", version: "1.0.0" });

    tool(server, "consultation", {
      description: "Read the advisor brief and repository access details.",
      inputSchema: z.object({ runId: z.string() }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    }, { allowComplete: true }, () => [
      `Advisor run: ${run.id}`,
      `Repository root: ${run.repo}`,
      `Access: ${run.access}`,
      "",
      run.brief,
      "",
      "When your analysis is complete, call finish with this runId and your final advice.",
    ].join("\n"));

    tool(server, "list_directory", {
      description: "List a directory within the repository.",
      inputSchema: z.object({ runId: z.string(), path: z.string().default(".") }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    }, {}, ({ path }) => workspace.list(path));

    tool(server, "read_file", {
      description: "Read a UTF-8 file within the repository.",
      inputSchema: z.object({ runId: z.string(), path: z.string() }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    }, {}, ({ path }) => workspace.read(path));

    tool(server, "write_file", {
      description: "Write a UTF-8 file using its current SHA-256, or null only for a new file.",
      inputSchema: z.object({
        runId: z.string(), path: z.string(), text: z.string(),
        expectedSha256: z.string().nullable().default(null),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
    }, { serialized: true }, ({ path, text, expectedSha256 }) =>
      workspace.write(path, text, expectedSha256));

    tool(server, "exec", {
      description: "Start a command in the repository and return its job state.",
      inputSchema: z.object({
        runId: z.string(), key: z.string(), command: z.array(z.string()).min(1),
        cwd: z.string().default("."), timeoutMs: z.number().int().positive().default(120_000),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
    }, { serialized: true }, ({ key, command, cwd, timeoutMs }) =>
      workspace.exec({ key, command, cwd, timeoutMs }));

    tool(server, "terminal", {
      description: "Poll or interact with a command job.",
      inputSchema: z.object({
        runId: z.string(), id: z.string(), waitMs: z.number().int().min(0).max(10_000).default(0),
        input: z.string().optional(), closeStdin: z.boolean().optional(), terminate: z.boolean().optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
    }, {}, (args) => terminal(args));

    tool(server, "finish", {
      description: "Save the final advisor response and complete the run.",
      inputSchema: z.object({ runId: z.string(), advice: z.string().min(1) }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    }, { serialized: true, allowComplete: true }, ({ advice }) => finish(advice));
    return server;
  }

  function tool(server, name, config, policy, action) {
    server.registerTool(name, config, async (args) => {
      if (args.runId !== run.id) return toolError("stale or incorrect runId");
      if (unhealthy) return toolError(`service unhealthy: ${unhealthy.message}`);
      activeRequests += 1;
      touchActivity();
      try {
        const invoke = async () => {
          if (status !== "active" && !(status === "complete" && policy.allowComplete)) {
            if (status !== "complete") throw new Error(`advisor service is ${status}`);
            throw new Error("advisor run is already complete");
          }
          return action(args);
        };
        const value = policy.serialized ? await serialize(invoke) : await invoke();
        return toolSuccess(value);
      } catch (error) {
        return toolError(errorMessage(error));
      } finally {
        activeRequests -= 1;
        scheduleIdle();
      }
    });
  }

  async function terminal(args) {
    const mutation = args.input !== undefined || args.closeStdin || args.terminate;
    if (!mutation) return workspace.terminal(args);
    const initial = await serialize(() => workspace.terminal({ ...args, waitMs: 0 }));
    if (!args.waitMs) return initial;
    return workspace.terminal({ id: args.id, waitMs: args.waitMs });
  }

  async function finish(advice) {
    if (finalAdvice !== undefined) {
      if (advice !== finalAdvice) throw new Error("final advice has already been saved");
      return { saved: true, sha256: sha256(advice), finished: true };
    }
    if (workspace.activeJobs > 0) {
      throw new Error("cannot finish while command jobs are active");
    }
    const finishedAt = new Date().toISOString();
    const result = { advice, sha256: sha256(advice), finishedAt };
    await atomicJson(join(runDir, "final.json"), result);
    finalAdvice = advice;
    status = "complete";
    clearTimeout(idleTimer);
    graceTimer = setTimeout(() => void shutdown("complete", "grace period elapsed"), graceMs);
    return { saved: true, sha256: result.sha256, finishedAt };
  }

  function serialize(action) {
    const result = stateGate.then(action, action);
    stateGate = result.catch(() => {});
    return result;
  }

  function touchActivity() {
    lastActivity = Date.now();
    if (status === "active") scheduleIdle();
  }

  function scheduleIdle() {
    clearTimeout(idleTimer);
    if (status !== "active") return;
    const elapsed = Date.now() - lastActivity;
    const busy = activeRequests > 0 || workspace.activeJobs > 0;
    const delay = busy ? Math.min(Math.max(idleMs, 1), 1_000) : Math.max(idleMs - elapsed, 0);
    idleTimer = setTimeout(() => {
      if (activeRequests > 0 || workspace.activeJobs > 0) scheduleIdle();
      else if (Date.now() - lastActivity >= idleMs) void shutdown("interrupted", "idle timeout");
      else scheduleIdle();
    }, delay);
  }

  async function shutdown(finalStatus, reason, force = false) {
    if (closing) return closing;
    if (finalAdvice !== undefined) finalStatus = "complete";
    status = finalStatus;
    closing = (async () => {
      clearTimeout(maxTimer);
      clearTimeout(idleTimer);
      clearTimeout(graceTimer);
      try { await workspace.close(); } catch {}
      try { await mcp.close(); } catch {}
      if (listening) {
        await new Promise((resolve) => {
          let timer;
          httpServer.close(() => { clearTimeout(timer); resolve(); });
          if (force) httpServer.closeAllConnections?.();
          else timer = setTimeout(() => httpServer.closeAllConnections?.(), 250);
        });
      }
      try {
        await atomicJson(join(runDir, "runtime.json"), {
          status: finalStatus, reason, port: actualPort, pid: process.pid,
        });
      } finally {
        try { await onClose({ runId: run.id, status: finalStatus, reason }); } catch {}
        closedResolve({ status: finalStatus, reason });
      }
    })();
    return closing;
  }

  try {
    await workspace.start();
    await listen(httpServer, port);
    listening = true;
    const bound = httpServer.address();
    actualPort = typeof bound === "object" && bound ? bound.port : port;
    await atomicJson(join(runDir, "runtime.json"), {
      status: "starting", reason: null, port: actualPort, pid: process.pid,
    });
    await Promise.race([
      onReady({ runId: run.id, port: actualPort, pid: process.pid }),
      closed.then(({ reason }) => { throw new Error(reason); }),
    ]);
    if (closing) throw new Error("service closed during startup");
    status = finalAdvice === undefined ? "active" : "complete";
    await atomicJson(join(runDir, "runtime.json"), {
      status, reason: null, port: actualPort, pid: process.pid,
    });
    if (status === "active") scheduleIdle();
    else graceTimer = setTimeout(() => void shutdown("complete", "grace period elapsed"), graceMs);
  } catch (error) {
    await shutdown("interrupted", `startup failed: ${errorMessage(error)}`, true);
    throw error;
  }

  return {
    address: `http://${HOST}:${actualPort}/mcp`,
    close: (reason = "closed by owner") => shutdown("interrupted", reason),
    closed,
  };
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => reject(error);
    server.once("error", onError);
    server.listen(port, HOST, () => {
      server.off("error", onError);
      resolve();
    });
  });
}

function toolSuccess(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return { content: [{ type: "text", text }] };
}

function toolError(message) {
  return { isError: true, content: [{ type: "text", text: message }] };
}

function sendJson(response, code, body) {
  response.writeHead(code, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

async function atomicJson(path, value) {
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  await rename(temporary, path);
}

async function readExistingFinal(runDir) {
  try {
    const value = JSON.parse(await readFile(join(runDir, "final.json"), "utf8"));
    return typeof value.advice === "string" ? value.advice : undefined;
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function validateOptions({ runDir, port, idleMs, maxMs, graceMs }) {
  if (typeof runDir !== "string" || !runDir) throw new Error("runDir is required");
  if (!Number.isInteger(port) || port < 0 || port > 65_535) throw new Error("invalid port");
  for (const [name, value] of Object.entries({ idleMs, maxMs, graceMs })) {
    if (!Number.isFinite(value) || value < 0 || value > MAX_TIMER_MS) throw new Error(`invalid ${name}`);
  }
}

function validateRun(run) {
  for (const key of ["id", "repo", "access", "brief", "createdAt", "controlToken"]) {
    if (typeof run?.[key] !== "string" || !run[key]) throw new Error(`run.json requires ${key}`);
  }
}
