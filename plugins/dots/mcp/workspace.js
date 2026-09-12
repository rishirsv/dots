import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { lstat, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { createInterface } from "node:readline";

const OUTPUT_CAP = 64 * 1024;
const MAX_TIMEOUT = 60 * 60 * 1000;

export class Workspace {
  constructor({ repo, access = "workspace-write", codexBin = "codex", onFatal = () => {} }) {
    if (!repo) throw new Error("repo is required");
    if (!["workspace-write", "read-only"].includes(access)) throw new Error(`Unsupported access: ${access}`);
    this.repoInput = repo;
    this.access = access;
    this.codexBin = codexBin;
    this.onFatal = onFatal;
    this.pending = new Map();
    this.jobs = new Map();
    this.keys = new Map();
    this.nextRequestId = 1;
    this.closing = false;
    this.closed = false;
  }

  async start() {
    if (this.child) throw new Error("Workspace already started");
    this.repo = await realpath(resolve(this.repoInput));
    this.child = spawn(this.codexBin, ["app-server", "--stdio"], {
      cwd: this.repo,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.exitPromise = new Promise(resolveExit => this.child.once("exit", resolveExit));
    this.child.once("error", error => this.#fatal(error));
    this.child.once("exit", (code, signal) => {
      if (!this.closed) this.#fatal(new Error(`Codex app-server exited (${signal || code})`));
    });
    createInterface({ input: this.child.stdout }).on("line", line => this.#receive(line));
    // Drain diagnostics so the child cannot block on a full stderr pipe.
    this.child.stderr.resume();

    try {
      await this.#request("initialize", {
        clientInfo: { name: "dots-workspace", version: "0.1.0" },
        capabilities: { experimentalApi: true },
      });
      this.#notify("initialized", {});
      await this.#request("fs/readDirectory", { path: this.repo });
      const probe = await this.#request("command/exec", {
        command: ["/usr/bin/printf", "dots-workspace-probe"],
        cwd: this.repo,
        timeoutMs: 30000,
        outputBytesCap: OUTPUT_CAP,
        sandboxPolicy: this.#sandboxPolicy(),
      });
      if (probe.exitCode !== 0 || probe.stdout !== "dots-workspace-probe") {
        throw new Error("Codex app-server command/exec probe failed");
      }
      return this;
    } catch (error) {
      await this.close();
      throw error;
    }
  }

  async list(path = ".") {
    this.#ready();
    const absolute = await this.#existingPath(path);
    const result = await this.#request("fs/readDirectory", { path: absolute });
    return result.entries;
  }

  async read(path) {
    this.#ready();
    const absolute = await this.#existingPath(path);
    const result = await this.#request("fs/readFile", { path: absolute });
    const bytes = Buffer.from(result.dataBase64, "base64");
    return { path: relative(this.repo, absolute) || ".", text: bytes.toString("utf8"), sha256: hash(bytes) };
  }

  async write(path, text, expectedSha256) {
    this.#ready();
    if (this.access === "read-only") throw new Error("Workspace is read-only");
    if (expectedSha256 !== null && typeof expectedSha256 !== "string") {
      throw new Error("expectedSha256 must be a hash or null");
    }
    const requested = this.#lexicalPath(path);
    let absolute;
    let current = null;
    try {
      absolute = await this.#existingPath(path);
      current = await this.read(relative(this.repo, absolute));
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      absolute = await this.#newPath(requested);
    }
    if (expectedSha256 === null && current) throw new Error(`Write conflict: ${path} already exists`);
    if (expectedSha256 !== null && current?.sha256 !== expectedSha256) {
      throw new Error(`Write conflict: ${path} has changed`);
    }
    const bytes = Buffer.from(text, "utf8");
    await this.#request("fs/writeFile", { path: absolute, dataBase64: bytes.toString("base64") });
    return hash(bytes);
  }

  async exec({ key, command, cwd = ".", timeoutMs = 120000 }) {
    this.#ready();
    if (!key || typeof key !== "string") throw new Error("key is required");
    if (!Array.isArray(command) || command.length === 0 || command.some(part => typeof part !== "string")) {
      throw new Error("command must be a non-empty string array");
    }
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_TIMEOUT) {
      throw new Error("timeoutMs must be between 1 and 3600000");
    }
    const absoluteCwd = await this.#existingPath(cwd);
    const signature = JSON.stringify({ command, cwd: absoluteCwd, timeoutMs });
    const prior = this.keys.get(key);
    if (prior) {
      if (prior.signature !== signature) throw new Error(`Job key ${key} was already used with different input`);
      return this.#snapshot(this.jobs.get(prior.id));
    }

    const id = randomUUID();
    const job = {
      id, key, status: "running", stdout: Buffer.alloc(0), stderr: Buffer.alloc(0),
      exitCode: null, error: null, truncated: false, waiters: new Set(),
    };
    this.jobs.set(id, job);
    this.keys.set(key, { id, signature });
    void this.#request("command/exec", {
      command, cwd: absoluteCwd, timeoutMs, processId: id,
      streamStdin: true, streamStdoutStderr: true, outputBytesCap: OUTPUT_CAP,
      sandboxPolicy: this.#sandboxPolicy(),
    }).then(result => {
      job.exitCode = result.exitCode;
      job.status = "exited";
      this.#wake(job);
    }, error => {
      job.status = "failed";
      job.error = error.message;
      this.#wake(job);
    });
    return this.#snapshot(job);
  }

  async terminal({ id, waitMs = 1000, input, closeStdin = false, terminate = false }) {
    this.#ready();
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Unknown job: ${id}`);
    if (input !== undefined || closeStdin) {
      if (job.status !== "running") throw new Error(`Job ${id} is not running`);
      await this.#request("command/exec/write", {
        processId: id,
        ...(input === undefined ? {} : { deltaBase64: Buffer.from(input, "utf8").toString("base64") }),
        closeStdin,
      });
    }
    if (terminate && job.status === "running") {
      await this.#request("command/exec/terminate", { processId: id });
    }
    const boundedWait = Math.max(0, Math.min(10000, Number(waitMs) || 0));
    if (job.status === "running" && boundedWait) {
      await new Promise(resolveWait => {
        const timer = setTimeout(() => { job.waiters.delete(done); resolveWait(); }, boundedWait);
        const done = () => { clearTimeout(timer); resolveWait(); };
        job.waiters.add(done);
      });
    }
    return this.#snapshot(job);
  }

  get activeJobs() {
    return [...this.jobs.values()].filter(job => job.status === "running").length;
  }

  async close() {
    if (this.closed) return;
    this.closing = true;
    if (this.child) {
      const active = [...this.jobs.values()].filter(job => job.status === "running");
      await Promise.race([
        Promise.allSettled(active.map(job => this.#request("command/exec/terminate", { processId: job.id }))),
        new Promise(resolveDone => setTimeout(resolveDone, 500)),
      ]);
      if (active.length) {
        await Promise.race([
          Promise.all(active.map(job => new Promise(resolveDone => job.waiters.add(resolveDone)))),
          new Promise(resolveDone => setTimeout(resolveDone, 1000)),
        ]);
      }
      this.child.stdin.end();
      this.child.kill("SIGTERM");
      await Promise.race([this.exitPromise, new Promise(resolveDone => setTimeout(resolveDone, 1000))]);
      if (this.child.exitCode === null && this.child.signalCode === null) this.child.kill("SIGKILL");
    }
    this.closed = true;
  }

  #ready() {
    if (this.fatalError) throw this.fatalError;
    if (!this.child || this.closed || this.closing) throw new Error("Workspace is not running");
  }

  #lexicalPath(path) {
    if (typeof path !== "string") throw new Error("path must be a string");
    const absolute = resolve(this.repo, path);
    if (!inside(this.repo, absolute)) throw new Error(`Path is outside repository: ${path}`);
    return absolute;
  }

  async #existingPath(path) {
    const requested = this.#lexicalPath(path);
    const canonical = await realpath(requested);
    if (!inside(this.repo, canonical)) throw new Error(`Path resolves outside repository: ${path}`);
    return canonical;
  }

  async #newPath(requested) {
    try {
      await lstat(requested);
      throw new Error("Refusing to write an unresolved filesystem entry");
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const parent = await realpath(dirname(requested));
    if (!inside(this.repo, parent)) throw new Error("Path resolves outside repository");
    return requested;
  }

  #request(method, params) {
    if (!this.child?.stdin.writable) return Promise.reject(new Error("Codex app-server is not running"));
    const id = this.nextRequestId++;
    return new Promise((resolveRequest, rejectRequest) => {
      const timer = method === "command/exec" ? null : setTimeout(() => {
        this.pending.delete(id);
        rejectRequest(new Error(`${method} timed out`));
      }, 30000);
      this.pending.set(id, { resolve: resolveRequest, reject: rejectRequest, timer });
      this.child.stdin.write(`${JSON.stringify({ id, method, params })}\n`, error => {
        if (error) { clearTimeout(timer); this.pending.delete(id); rejectRequest(error); }
      });
    });
  }

  #notify(method, params) {
    this.child.stdin.write(`${JSON.stringify({ method, params })}\n`);
  }

  #receive(line) {
    let message;
    try { message = JSON.parse(line); } catch { return; }
    if (message.id !== undefined) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    if (message.method !== "command/exec/outputDelta") return;
    const { processId, stream, deltaBase64, capReached } = message.params;
    const job = this.jobs.get(processId);
    if (!job) return;
    const chunk = Buffer.from(deltaBase64, "base64");
    const room = OUTPUT_CAP - job[stream].length;
    if (room > 0) job[stream] = Buffer.concat([job[stream], chunk.subarray(0, room)]);
    if (chunk.length > room || capReached) job.truncated = true;
  }

  #snapshot(job) {
    return {
      id: job.id, status: job.status, stdout: job.stdout.toString("utf8"),
      stderr: job.stderr.toString("utf8"), exitCode: job.exitCode,
      error: job.error, truncated: job.truncated,
    };
  }

  #sandboxPolicy() {
    return this.access === "read-only"
      ? { type: "readOnly", networkAccess: true }
      : { type: "workspaceWrite", writableRoots: [this.repo], networkAccess: true };
  }

  #wake(job) {
    for (const waiter of job.waiters) waiter();
    job.waiters.clear();
  }

  #fatal(error) {
    if (this.fatalError) return;
    this.fatalError = error;
    for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(error); }
    this.pending.clear();
    for (const job of this.jobs.values()) {
      if (job.status === "running") { job.status = "failed"; job.error = error.message; this.#wake(job); }
    }
    if (!this.closing) {
      try { this.onFatal(error); } catch {}
    }
  }
}

function inside(root, path) {
  const rel = relative(root, path);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
