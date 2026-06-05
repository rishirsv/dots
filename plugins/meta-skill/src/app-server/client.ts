import { spawn, execFile, type ChildProcessWithoutNullStreams } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface AppServerConfig {
  mode: "managed";
  auth: "inherited";
  protocol: "generated-ts";
  generatedTypes: string;
}

export async function appServerConfig(): Promise<AppServerConfig> {
  return {
    mode: "managed",
    auth: "inherited",
    protocol: "generated-ts",
    generatedTypes: "codex app-server generate-ts snapshot"
  };
}

export async function codexVersion(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("codex", ["--version"], { timeout: 5000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

export class AppServerUnavailableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type JsonRecord = Record<string, unknown>;

interface PendingRequest {
  resolve: (value: JsonRecord) => void;
  reject: (error: Error) => void;
}

export interface AppServerLine {
  direction: "client" | "server" | "stderr";
  message: unknown;
}

export interface AppServerJsonClientOptions {
  onLine?: (line: AppServerLine) => void | Promise<void>;
  spawnProcess?: () => ChildProcessWithoutNullStreams;
  requestTimeoutMs?: number;
  maxBufferedEvents?: number;
}

export class AppServerProtocolError extends AppServerUnavailableError {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

export class AppServerJsonClient {
  private child: ChildProcessWithoutNullStreams | undefined;
  private nextId = 1;
  private buffer = "";
  private pending = new Map<string, PendingRequest>();
  private notifications: Array<{ index: number; message: JsonRecord }> = [];
  private nextNotificationIndex = 0;
  private waiters: Array<{
    predicate: (message: JsonRecord) => boolean;
    resolve: (message: JsonRecord) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  private readonly onLine?: (line: AppServerLine) => void | Promise<void>;
  private readonly spawnProcess: () => ChildProcessWithoutNullStreams;
  private readonly requestTimeoutMs: number;
  private readonly maxBufferedEvents: number;
  private traceQueue: Promise<void> = Promise.resolve();

  constructor(onLineOrOptions?: ((line: AppServerLine) => void | Promise<void>) | AppServerJsonClientOptions) {
    const options: AppServerJsonClientOptions = typeof onLineOrOptions === "function" ? { onLine: onLineOrOptions } : onLineOrOptions || {};
    this.onLine = options.onLine;
    this.spawnProcess =
      options.spawnProcess ||
      (() =>
        spawn("codex", ["app-server", "--listen", "stdio://"], {
          stdio: ["pipe", "pipe", "pipe"]
        }));
    this.requestTimeoutMs = options.requestTimeoutMs || 120000;
    this.maxBufferedEvents = options.maxBufferedEvents ?? 10000;
  }

  async connect(config: AppServerConfig): Promise<void> {
    if (this.child) return;
    this.child = this.spawnProcess();
    this.child.stdout.on("data", (chunk) => this.receive(chunk.toString()));
    this.child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      this.trace({ direction: "stderr", message: text });
    });
    this.child.on("exit", () => {
      this.child = undefined;
      this.rejectActive(new AppServerUnavailableError("App Server process exited"));
    });
    await this.request("initialize", {
      clientInfo: { name: "meta-skill", version: "0.1.0" },
      capabilities: { experimentalApi: true, requestAttestation: false }
    });
    this.notify("initialized");
  }

  async request(method: string, params: unknown): Promise<JsonRecord> {
    if (!this.child) throw new AppServerUnavailableError("App Server is not connected");
    const id = String(this.nextId++);
    const request = { id, method, params };
    this.trace({ direction: "client", message: request });
    const response = new Promise<JsonRecord>((resolve, reject) => {
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

  notify(method: string, params?: unknown): void {
    if (!this.child) throw new AppServerUnavailableError("App Server is not connected");
    const notification = params === undefined ? { method } : { method, params };
    this.trace({ direction: "client", message: notification });
    this.child.stdin.write(`${JSON.stringify(notification)}\n`);
  }

  async flush(): Promise<void> {
    await this.traceQueue;
  }

  waitFor(predicate: (message: JsonRecord) => boolean, timeoutMs: number): Promise<JsonRecord> {
    const existing = this.notifications.find((item) => predicate(item.message));
    if (existing) return Promise.resolve(existing.message);
    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve,
        reject,
        timeout: setTimeout(() => {
          this.waiters = this.waiters.filter((item) => item !== waiter);
          reject(new AppServerUnavailableError("Timed out waiting for App Server notification"));
        }, timeoutMs)
      };
      this.waiters.push(waiter);
    });
  }

  eventCount(): number {
    return this.nextNotificationIndex;
  }

  eventsSince(index: number): JsonRecord[] {
    const firstRetainedIndex = this.notifications[0]?.index ?? this.nextNotificationIndex;
    const messages = this.notifications.filter((item) => item.index >= index).map((item) => item.message);
    if (index >= firstRetainedIndex) return messages;
    return [eventBufferOverflowWarning(firstRetainedIndex - index), ...messages];
  }

  close(): void {
    if (!this.child) return;
    this.child.kill("SIGTERM");
    this.child = undefined;
    this.rejectActive(new AppServerUnavailableError("App Server is not connected"));
  }

  private rejectActive(error: AppServerUnavailableError): void {
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
    for (const waiter of this.waiters) {
      clearTimeout(waiter.timeout);
      waiter.reject(error);
    }
    this.waiters = [];
  }

  private trace(line: AppServerLine): void {
    if (!this.onLine) return;
    this.traceQueue = this.traceQueue.then(async () => {
      await this.onLine?.(line);
    });
  }

  private receive(chunk: string): void {
    this.buffer += chunk;
    let index = this.buffer.indexOf("\n");
    while (index >= 0) {
      const line = this.buffer.slice(0, index);
      this.buffer = this.buffer.slice(index + 1);
      if (line.trim()) this.receiveLine(line);
      index = this.buffer.indexOf("\n");
    }
  }

  private receiveLine(line: string): void {
    let message: JsonRecord;
    try {
      message = JSON.parse(line) as JsonRecord;
    } catch {
      this.trace({ direction: "server", message: line });
      return;
    }
    this.trace({ direction: "server", message });
    const id = typeof message.id === "string" ? message.id : undefined;
    if (id && this.pending.has(id)) {
      const pending = this.pending.get(id) as PendingRequest;
      this.pending.delete(id);
      if (message.error) pending.reject(toProtocolError(message.error));
      else pending.resolve(message.result as JsonRecord);
      return;
    }
    this.retainNotification(message);
    for (const waiter of [...this.waiters]) {
      if (!waiter.predicate(message)) continue;
      clearTimeout(waiter.timeout);
      this.waiters = this.waiters.filter((item) => item !== waiter);
      waiter.resolve(message);
    }
  }

  private retainNotification(message: JsonRecord): void {
    this.notifications.push({ index: this.nextNotificationIndex, message });
    this.nextNotificationIndex += 1;
    while (this.notifications.length > this.maxBufferedEvents) {
      this.notifications.shift();
    }
  }
}

function eventBufferOverflowWarning(droppedEventCount: number): JsonRecord {
  return {
    method: "metaSkill/clientEventBuffer/overflow",
    params: {
      droppedEventCount,
      warning: "The client-side App Server event buffer overflowed; inspect rpc.jsonl for the durable raw event log."
    }
  };
}

function toProtocolError(error: unknown): AppServerProtocolError {
  let code: number | undefined;
  if (error && typeof error === "object" && "code" in error) {
    const raw = (error as { code: unknown }).code;
    code = typeof raw === "number" ? raw : undefined;
  }
  return new AppServerProtocolError(formatProtocolError(error), code);
}

function formatProtocolError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
