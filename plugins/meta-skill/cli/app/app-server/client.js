"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServerJsonClient = exports.AppServerProtocolError = exports.AppServerUnavailableError = void 0;
exports.appServerConfig = appServerConfig;
exports.codexVersion = codexVersion;
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
async function appServerConfig(endpoint) {
    return {
        mode: endpoint ? "attached" : "managed",
        endpoint: endpoint || null,
        auth: "inherited",
        protocol: "generated-ts",
        generatedTypes: "codex app-server generate-ts snapshot"
    };
}
async function codexVersion() {
    try {
        const { stdout } = await execFileAsync("codex", ["--version"], { timeout: 5000 });
        return stdout.trim() || null;
    }
    catch {
        return null;
    }
}
class AppServerUnavailableError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.AppServerUnavailableError = AppServerUnavailableError;
class AppServerProtocolError extends AppServerUnavailableError {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.AppServerProtocolError = AppServerProtocolError;
class AppServerJsonClient {
    child;
    nextId = 1;
    buffer = "";
    pending = new Map();
    notifications = [];
    waiters = [];
    onLine;
    spawnProcess;
    requestTimeoutMs;
    retryPolicy;
    sleep;
    random;
    traceQueue = Promise.resolve();
    constructor(onLineOrOptions) {
        const options = typeof onLineOrOptions === "function" ? { onLine: onLineOrOptions } : onLineOrOptions || {};
        this.onLine = options.onLine;
        this.spawnProcess =
            options.spawnProcess ||
                (() => (0, node_child_process_1.spawn)("codex", ["app-server", "--listen", "stdio://"], {
                    stdio: ["pipe", "pipe", "pipe"]
                }));
        this.requestTimeoutMs = options.requestTimeoutMs || 120000;
        this.retryPolicy = options.retryPolicy || { maxRetries: 3, baseDelayMs: 250, jitterMs: 250 };
        this.sleep = options.sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
        this.random = options.random || Math.random;
    }
    async connect(config) {
        if (config.mode !== "managed") {
            throw new AppServerUnavailableError("attached App Server endpoints are not supported by this CLI yet; omit --app-server-endpoint to use a managed stdio app-server");
        }
        if (this.child)
            return;
        this.child = this.spawnProcess();
        this.child.stdout.on("data", (chunk) => this.receive(chunk.toString()));
        this.child.stderr.on("data", (chunk) => {
            const text = chunk.toString();
            this.trace({ direction: "stderr", message: text });
        });
        this.child.on("exit", () => {
            const error = new AppServerUnavailableError("App Server process exited");
            for (const pending of this.pending.values())
                pending.reject(error);
            this.pending.clear();
        });
        await this.request("initialize", {
            clientInfo: { name: "meta-skill", version: "0.1.0" },
            capabilities: { experimentalApi: true, requestAttestation: false }
        });
        this.notify("initialized");
    }
    async request(method, params) {
        let attempt = 0;
        while (true) {
            try {
                return await this.requestOnce(method, params);
            }
            catch (error) {
                if (!(error instanceof AppServerProtocolError) || error.code !== -32001 || attempt >= this.retryPolicy.maxRetries) {
                    throw error;
                }
                const delay = this.retryPolicy.baseDelayMs * 2 ** attempt + Math.floor(this.random() * this.retryPolicy.jitterMs);
                attempt += 1;
                await this.sleep(delay);
            }
        }
    }
    notify(method, params) {
        if (!this.child)
            throw new AppServerUnavailableError("App Server is not connected");
        const notification = params === undefined ? { method } : { method, params };
        this.trace({ direction: "client", message: notification });
        this.child.stdin.write(`${JSON.stringify(notification)}\n`);
    }
    async flush() {
        await this.traceQueue;
    }
    async requestOnce(method, params) {
        if (!this.child)
            throw new AppServerUnavailableError("App Server is not connected");
        const id = String(this.nextId++);
        const request = { id, method, params };
        this.trace({ direction: "client", message: request });
        const response = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pending.delete(id);
                reject(new AppServerUnavailableError(`App Server request timed out: ${method}`));
            }, this.requestTimeoutMs);
            this.pending.set(id, {
                resolve: (value) => {
                    clearTimeout(timeout);
                    resolve(value);
                },
                reject: (error) => {
                    clearTimeout(timeout);
                    reject(error);
                }
            });
        });
        this.child.stdin.write(`${JSON.stringify(request)}\n`);
        return response;
    }
    waitFor(predicate, timeoutMs) {
        const existing = this.notifications.find(predicate);
        if (existing)
            return Promise.resolve(existing);
        return new Promise((resolve, reject) => {
            const waiter = {
                predicate,
                resolve,
                timeout: setTimeout(() => {
                    this.waiters = this.waiters.filter((item) => item !== waiter);
                    reject(new AppServerUnavailableError("Timed out waiting for App Server notification"));
                }, timeoutMs)
            };
            this.waiters.push(waiter);
        });
    }
    eventCount() {
        return this.notifications.length;
    }
    eventsSince(index) {
        return this.notifications.slice(index);
    }
    close() {
        if (!this.child)
            return;
        this.child.kill("SIGTERM");
        this.child = undefined;
    }
    trace(line) {
        if (!this.onLine)
            return;
        this.traceQueue = this.traceQueue.then(async () => {
            await this.onLine?.(line);
        });
    }
    receive(chunk) {
        this.buffer += chunk;
        let index = this.buffer.indexOf("\n");
        while (index >= 0) {
            const line = this.buffer.slice(0, index);
            this.buffer = this.buffer.slice(index + 1);
            if (line.trim())
                this.receiveLine(line);
            index = this.buffer.indexOf("\n");
        }
    }
    receiveLine(line) {
        let message;
        try {
            message = JSON.parse(line);
        }
        catch {
            this.trace({ direction: "server", message: line });
            return;
        }
        this.trace({ direction: "server", message });
        const id = typeof message.id === "string" ? message.id : undefined;
        if (id && this.pending.has(id)) {
            const pending = this.pending.get(id);
            this.pending.delete(id);
            if (message.error)
                pending.reject(toProtocolError(message.error));
            else
                pending.resolve(message.result);
            return;
        }
        this.notifications.push(message);
        for (const waiter of [...this.waiters]) {
            if (!waiter.predicate(message))
                continue;
            clearTimeout(waiter.timeout);
            this.waiters = this.waiters.filter((item) => item !== waiter);
            waiter.resolve(message);
        }
    }
}
exports.AppServerJsonClient = AppServerJsonClient;
function toProtocolError(error) {
    let code;
    if (error && typeof error === "object" && "code" in error) {
        const raw = error.code;
        code = typeof raw === "number" ? raw : undefined;
    }
    return new AppServerProtocolError(formatProtocolError(error), code);
}
function formatProtocolError(error) {
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    return String(error);
}
