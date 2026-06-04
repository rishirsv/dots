import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { describe, it } from "node:test";
import type { CaseRecord } from "../models";
import { exists, readJson, readText, writeJson, writeText } from "../project";
import { AppServerCaseRunner } from "./runner";
import { AppServerJsonClient, AppServerUnavailableError } from "./client";

const workingRunSource = { kind: "working_payload", label: "Working payload", skill_root: "../../../..", skill_activation: "forced" } as const;

describe("AppServerCaseRunner", () => {
  it("writes source-honest App Server evidence with real turn IDs and flushed trace", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, [{ content: "Second turn." }]);
    await writeText(path.join(skillRoot, "SKILL.md"), "---\nname: runner-skill\ndescription: Use when testing runner mounting; not for live evals.\n---\n\n# Skill\n");
    const runRoot = path.join(root, "run");
    const fake = new FakeCaseClient();
    const runner = new AppServerCaseRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot,
      appServer: {
        mode: "managed",
        endpoint: null,
        auth: "inherited",
        protocol: "generated-ts",
        generatedTypes: "test"
      }
    });

    assert.equal(result.execution_status, "completed");
    const caseRoot = path.join(runRoot, "cases", item.folder);
    const thread = await readJson<{ thread_id: string; turn_ids: string[]; status: string }>(path.join(caseRoot, "thread.json"));
    assert.deepEqual(thread, {
      schema_version: 1,
      thread_id: "thread-1",
      turn_ids: ["turn-1", "turn-2"],
      parent_thread_id: null,
      forked_from_id: null,
      resume_from_id: null,
      app_server: {
        mode: "managed",
        endpoint: null,
        auth: "inherited",
        protocol: "generated-ts",
        generatedTypes: "test"
      },
      status: "completed",
      error: null
    });
    assert.equal(await readText(path.join(caseRoot, "final.md")), "final turn-2\n");
    const turns = (await readText(path.join(caseRoot, "turns.jsonl"))).trim().split("\n").map((line) => JSON.parse(line));
    assert.deepEqual(
      turns.map((turn) => [turn.role, turn.index, turn.turn_id || null]),
      [
        ["user", 0, null],
        ["assistant", 0, "turn-1"],
        ["user", 1, null],
        ["assistant", 1, "turn-2"]
      ]
    );
    const traceRows = (await readText(path.join(caseRoot, "rpc.jsonl"))).trim().split("\n").map((line) => JSON.parse(line));
    assert.equal(traceRows.length >= 3, true);
    assert.equal(fake.flushed, true);

    const threadStart = fake.requests.find((request) => request.method === "thread/start");
    assert.equal((threadStart?.params as { approvalPolicy?: string }).approvalPolicy, "never");
    assert.equal((threadStart?.params as { sandbox?: string }).sandbox, "read-only");
    assert.equal((threadStart?.params as { experimentalRawEvents?: boolean }).experimentalRawEvents, true);

    const turnStarts = fake.requests.filter((request) => request.method === "turn/start");
    assert.equal(turnStarts.length, 2);
    assert.deepEqual((turnStarts[0].params as { sandboxPolicy?: unknown }).sandboxPolicy, { type: "readOnly", networkAccess: false });
    const firstInput = (turnStarts[0].params as { input: Array<{ type: string }> }).input;
    const secondInput = (turnStarts[1].params as { input: Array<{ type: string }> }).input;
    assert.equal(firstInput.some((item) => item.type === "skill"), true);
    const mountedSkill = firstInput.find((item) => item.type === "skill") as { name?: string; path?: string } | undefined;
    assert.equal(mountedSkill?.name, "runner-skill");
    assert.equal(mountedSkill?.path, skillRoot);
    assert.equal(secondInput.some((item) => item.type === "skill"), false);
    assert.equal(await exists(path.join(caseRoot, "stage")), false);
    assert.equal(result.token_usage.total_tokens, 24);
    assert.equal(result.token_usage.input_tokens, 10);
    assert.equal(result.token_usage.cached_input_tokens, 4);
    assert.equal(result.token_usage.output_tokens, 14);
    assert.equal(result.token_usage.reasoning_tokens, 0);
    const usage = await readJson<{ total_tokens: number | null; input_tokens: number | null }>(path.join(caseRoot, "usage.json"));
    assert.equal(usage.total_tokens, 24);
    assert.equal(usage.input_tokens, 10);
    assert.equal("token_usage" in (turns.find((turn) => turn.role === "assistant" && turn.index === 0) as Record<string, unknown>), false);
  });

  it("records unavailable token usage when a completed turn has no token event", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-no-usage-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const fake = new FakeCaseClient({ emitTokenUsage: false });
    const runner = new AppServerCaseRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot: path.join(root, "run"),
      appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assert.equal(result.token_usage.total_tokens, null);
    assert.equal(result.token_usage.unavailable_reason, "App Server completed without tokenUsage.total on the final turn.");
    const usage = await readJson<{ total_tokens: number | null; unavailable_reason: string | null }>(path.join(root, "run", "cases", item.folder, "usage.json"));
    assert.equal(usage.total_tokens, null);
    assert.equal(usage.unavailable_reason, "App Server completed without tokenUsage.total on the final turn.");
  });

  it("does not promote per-turn usage into case totals when final cumulative usage is missing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-last-only-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const fake = new FakeCaseClient({ emitCumulativeTokenUsage: false });
    const runner = new AppServerCaseRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });
    const runRoot = path.join(root, "run");

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assert.equal(result.token_usage.total_tokens, null);
    assert.equal(result.token_usage.unavailable_reason, "App Server completed without tokenUsage.total on the final turn.");
    const caseRoot = path.join(runRoot, "cases", item.folder);
    const usage = await readJson<{ total_tokens: number | null; unavailable_reason: string | null }>(path.join(caseRoot, "usage.json"));
    assert.equal(usage.total_tokens, null);
    assert.equal(usage.unavailable_reason, "App Server completed without tokenUsage.total on the final turn.");
  });

  it("writes each reused-client case trace to that case rpc.jsonl", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-trace-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const runRoot = path.join(root, "run");
    const fake = new FakeCaseClient();
    const runner = new AppServerCaseRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });
    const appServer = { mode: "managed" as const, endpoint: null, auth: "inherited" as const, protocol: "generated-ts" as const, generatedTypes: "test" };
    const secondCase = { ...item, folder: "R2-second", id: "R2" };

    await runner.run({ projectRoot: skillRoot, skillRoot, skill_activation: "forced", case: item, runSource: workingRunSource, runId: "001-test", runRoot, appServer });
    await runner.run({ projectRoot: skillRoot, skillRoot, skill_activation: "forced", case: secondCase, runSource: workingRunSource, runId: "001-test", runRoot, appServer });

    const firstTrace = await readText(path.join(runRoot, "cases", item.folder, "rpc.jsonl"));
    const secondTrace = await readText(path.join(runRoot, "cases", secondCase.folder, "rpc.jsonl"));
    assert.match(firstTrace, /thread\/start/);
    assert.match(secondTrace, /thread\/start/);
  });

  it("respawns the App Server client once for a case after process unavailability", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-respawn-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const runRoot = path.join(root, "run");
    const first = new UnavailableOnceClient();
    const second = new FakeCaseClient();
    const clients = [first, second];
    const runner = new AppServerCaseRunner({
      clientFactory: (onLine) => (clients.shift() || new FakeCaseClient()).attach(onLine),
      turnTimeoutMs: 25
    });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assert.equal(result.execution_status, "completed");
    assert.equal(first.closed, true);
    assert.equal(second.requests.filter((request) => request.method === "thread/start").length, 1);
  });

  it("does not repeatedly respawn unavailable App Server clients", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-respawn-limit-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const runRoot = path.join(root, "run");
    let created = 0;
    const runner = new AppServerCaseRunner({
      clientFactory: (onLine) => {
        created += 1;
        return new UnavailableOnceClient().attach(onLine);
      },
      turnTimeoutMs: 25
    });

    await assert.rejects(
      runner.run({
        projectRoot: skillRoot,
        skillRoot,
        skill_activation: "forced",
         case: item,
        runSource: workingRunSource,
        runId: "001-test",
        runRoot,
        appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
      }),
      /App Server process exited/
    );
    assert.equal(created, 2);
  });

  it("covers the runner JSONL protocol contract without a live App Server", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-contract-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const child = new ProtocolFixtureChild();
    const runner = new AppServerCaseRunner({
      clientFactory: (onLine) => new AppServerJsonClient({ onLine, spawnProcess: () => child.asChild(), requestTimeoutMs: 1000 }),
      turnTimeoutMs: 1000
    });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot: path.join(root, "run"),
      appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assert.equal(result.execution_status, "completed");
    assert.deepEqual(
      child.messages.map((message) => message.method),
      ["initialize", "initialized", "thread/start", "turn/start"]
    );
    assert.equal("jsonrpc" in child.messages[0], false);
    assert.equal((child.messages.find((message) => message.method === "thread/start")?.params as { sandbox?: string }).sandbox, "read-only");
    assert.deepEqual((child.messages.find((message) => message.method === "turn/start")?.params as { sandboxPolicy?: unknown }).sandboxPolicy, { type: "readOnly", networkAccess: false });
  });

  it("retains noisy App Server events for final extraction", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-retained-events-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const child = new ProtocolFixtureChild({ noisyDeltas: 3 });
    const runner = new AppServerCaseRunner({
      clientFactory: (onLine) => new AppServerJsonClient({ onLine, spawnProcess: () => child.asChild(), requestTimeoutMs: 1000 }),
      turnTimeoutMs: 1000
    });
    const runRoot = path.join(root, "run");

    await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
       case: item,
      runSource: workingRunSource,
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    const caseRoot = path.join(runRoot, "cases", item.folder);
    const final = await readText(path.join(caseRoot, "final.md"));
    const trace = await readText(path.join(caseRoot, "rpc.jsonl"));

    assert.match(final, /noisy 0noisy 1noisy 2contract final/);
    assert.match(trace, /noisy 0/);
  });

  it("times out when a turn never completes", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-timeout-"));
    const skillRoot = path.join(root, "skill");
    const item = await fixtureCase(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const fake = new FakeCaseClient({ completeTurns: false });
    const runner = new AppServerCaseRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 5 });

    await assert.rejects(
      runner.run({
        projectRoot: skillRoot,
        skillRoot,
        skill_activation: "forced",
         case: item,
        runSource: workingRunSource,
        runId: "001-test",
        runRoot: path.join(root, "run"),
        appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
      }),
      /Timed out waiting/
    );
  });
});

async function fixtureCase(root: string, turns: Array<{ content: string }>): Promise<CaseRecord> {
  const casePath = path.join(root, "case");
  await fs.mkdir(casePath, { recursive: true });
  await writeText(
    path.join(casePath, "case.md"),
    `---
title: Runner
topics: []
criteria:
  what_it_tests: Runner
  expected_behavior: Runs
  assertions:
    - Runs.
  tests: []
  judges: []
---

## Task

First turn.
${turns.map((turn, index) => `\n## Turn ${index + 2}\n\n${turn.content}\n`).join("")}`
  );
  return {
    folder: "R1-runner",
    id: "R1",
    type: "regression",
    path: casePath,
    metadata: { title: "Runner", topics: [] },
    criteria: { what_it_tests: "Runner", expected_behavior: "Runs", assertions: ["Runs."], tests: [], judges: [] },
    task: "First turn.",
    turns
  };
}

class FakeCaseClient {
  requests: Array<{ method: string; params: unknown }> = [];
  flushed = false;
  private events: Record<string, unknown>[] = [];
  private turnCount = 0;
  private pendingTrace: Promise<void>[] = [];
  private onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void> = async () => {};

  constructor(private options: { completeTurns?: boolean; emitTokenUsage?: boolean; emitCumulativeTokenUsage?: boolean } = { completeTurns: true, emitTokenUsage: true, emitCumulativeTokenUsage: true }) {}

  attach(onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>): this {
    this.onLine = onLine;
    return this;
  }

  async request(method: string, params: unknown): Promise<Record<string, unknown>> {
    this.requests.push({ method, params });
    this.pendingTrace.push(this.onLine({ direction: "client", message: { method, params } }));
    if (method === "thread/start") return { thread: { id: "thread-1" } };
    if (method === "turn/start") {
      this.turnCount += 1;
      const turnId = `turn-${this.turnCount}`;
      this.events.push({ method: "item/agentMessage/delta", params: { threadId: "other-thread", turnId, delta: "wrong" } });
      this.events.push({ method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId, delta: `final ${turnId}` } });
      this.events.push({ method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId, delta: "\n" } });
      if (this.options.emitTokenUsage !== false) {
        this.events.push({
          method: "thread/tokenUsage/updated",
          params: {
            threadId: "thread-1",
            turnId,
            tokenUsage: {
              last: { inputTokens: 5, cachedInputTokens: 2, outputTokens: 7, reasoningOutputTokens: 0, totalTokens: 12 },
              ...(this.options.emitCumulativeTokenUsage === false ? {} : { total: { inputTokens: 5 * this.turnCount, cachedInputTokens: 2 * this.turnCount, outputTokens: 7 * this.turnCount, reasoningOutputTokens: 0, totalTokens: 12 * this.turnCount } })
            },
            modelContextWindow: 200000
          }
        });
      }
      if (this.options.completeTurns !== false) this.events.push({ method: "turn/completed", params: { threadId: "thread-1", turn: { id: turnId } } });
      return { turn: { id: turnId } };
    }
    return {};
  }

  waitFor(predicate: (message: Record<string, unknown>) => boolean, timeoutMs: number): Promise<Record<string, unknown>> {
    const event = this.events.find(predicate);
    if (event) return Promise.resolve(event);
    return new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out waiting for App Server notification")), timeoutMs));
  }

  eventCount(): number {
    return this.events.length;
  }

  eventsSince(index: number): Record<string, unknown>[] {
    return this.events.slice(index);
  }

  async flush(): Promise<void> {
    await Promise.all(this.pendingTrace);
    this.flushed = true;
  }

  close(): void {}
}

class UnavailableOnceClient extends FakeCaseClient {
  closed = false;

  async request(method: string, params: unknown): Promise<Record<string, unknown>> {
    if (method === "thread/start") throw new AppServerUnavailableError("App Server process exited");
    return super.request(method, params);
  }

  close(): void {
    this.closed = true;
  }
}

class ProtocolFixtureChild extends EventEmitter {
  stdin = new PassThrough();
  stdout = new PassThrough();
  stderr = new PassThrough();
  messages: Array<Record<string, unknown>> = [];
  private buffer = "";

  constructor(private options: { noisyDeltas?: number } = {}) {
    super();
    this.stdin.on("data", (chunk) => {
      this.buffer += chunk.toString();
      let newline = this.buffer.indexOf("\n");
      while (newline >= 0) {
        const line = this.buffer.slice(0, newline);
        this.buffer = this.buffer.slice(newline + 1);
        if (line.trim()) this.receive(JSON.parse(line) as Record<string, unknown>);
        newline = this.buffer.indexOf("\n");
      }
    });
  }

  asChild() {
    return this as unknown as import("node:child_process").ChildProcessWithoutNullStreams;
  }

  kill(): boolean {
    this.emit("exit", 0);
    return true;
  }

  private receive(message: Record<string, unknown>): void {
    this.messages.push(message);
    if (message.method === "initialize") {
      this.respond(message.id, {});
      return;
    }
    if (message.method === "initialized") return;
    if (message.method === "thread/start") {
      this.respond(message.id, { thread: { id: "thread-contract" } });
      return;
    }
    if (message.method === "turn/start") {
      this.respond(message.id, { turn: { id: "turn-contract" } });
      for (let index = 0; index < (this.options.noisyDeltas || 0); index += 1) {
        this.writeStdout(`${JSON.stringify({ method: "item/agentMessage/delta", params: { threadId: "thread-contract", turnId: "turn-contract", delta: `noisy ${index}` } })}\n`);
      }
      this.writeStdout(`${JSON.stringify({ method: "item/agentMessage/delta", params: { threadId: "thread-contract", turnId: "turn-contract", delta: "contract final" } })}\n`);
      this.writeStdout(`${JSON.stringify({ method: "thread/tokenUsage/updated", params: { threadId: "thread-contract", turnId: "turn-contract", tokenUsage: { last: { inputTokens: 3, outputTokens: 4, totalTokens: 7 } } } })}\n`);
      this.writeStdout(`${JSON.stringify({ method: "turn/completed", params: { threadId: "thread-contract", turn: { id: "turn-contract" } } })}\n`);
    }
  }

  private respond(id: unknown, result: unknown): void {
    this.writeStdout(`${JSON.stringify({ id, result })}\n`);
  }

  private writeStdout(text: string): void {
    this.stdout.write(text);
  }
}
