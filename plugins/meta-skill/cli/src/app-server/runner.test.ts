import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { ScenarioRecord } from "../models";
import { readJson, readText, writeJson, writeText } from "../project";
import { AppServerScenarioRunner } from "./runner";

describe("AppServerScenarioRunner", () => {
  it("writes source-honest App Server evidence with real turn IDs and flushed trace", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-"));
    const skillRoot = path.join(root, "skill");
    const scenario = await fixtureScenario(root, [{ content: "Second turn." }]);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const runRoot = path.join(root, "run");
    const fake = new FakeScenarioClient();
    const runner = new AppServerScenarioRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      scenario,
      side: "candidate",
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

    assert.equal(result.status, "needs_review");
    const sideRoot = path.join(runRoot, "scenarios", scenario.folder, "candidate");
    const thread = await readJson<{ thread_id: string; turn_ids: string[]; status: string }>(path.join(sideRoot, "thread.json"));
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
    assert.equal(await readText(path.join(sideRoot, "final.md")), "final turn-2\n");
    const turns = (await readText(path.join(sideRoot, "turns.jsonl"))).trim().split("\n").map((line) => JSON.parse(line));
    assert.deepEqual(
      turns.map((turn) => [turn.role, turn.index, turn.turn_id || null]),
      [
        ["user", 0, null],
        ["assistant", 0, "turn-1"],
        ["user", 1, null],
        ["assistant", 1, "turn-2"]
      ]
    );
    const traceRows = (await readText(path.join(sideRoot, "rpc.jsonl"))).trim().split("\n").map((line) => JSON.parse(line));
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
    assert.equal(secondInput.some((item) => item.type === "skill"), false);
    assert.deepEqual(result.token_usage, {
      input_tokens: { available: true, value: 5 },
      output_tokens: { available: true, value: 7 },
      total_tokens: { available: true, value: 12 }
    });
  });

  it("times out when a turn never completes", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-timeout-"));
    const skillRoot = path.join(root, "skill");
    const scenario = await fixtureScenario(root, []);
    await writeText(path.join(skillRoot, "SKILL.md"), "# Skill\n");
    const fake = new FakeScenarioClient({ completeTurns: false });
    const runner = new AppServerScenarioRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 5 });

    await assert.rejects(
      runner.run({
        projectRoot: skillRoot,
        skillRoot,
        scenario,
        side: "candidate",
        runId: "001-test",
        runRoot: path.join(root, "run"),
        appServer: { mode: "managed", endpoint: null, auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
      }),
      /Timed out waiting/
    );
  });
});

async function fixtureScenario(root: string, turns: Array<{ content: string }>): Promise<ScenarioRecord> {
  const scenarioPath = path.join(root, "scenario");
  await fs.mkdir(scenarioPath, { recursive: true });
  await writeText(path.join(scenarioPath, "task.md"), "First turn.");
  await writeJson(path.join(scenarioPath, "scenario.json"), {
    schema_version: 1,
    id: "R1",
    family: "regression",
    type: "behavior",
    title: "Runner",
    topics: [],
    include: [],
    setup: [],
    metadata: {}
  });
  await writeJson(path.join(scenarioPath, "criteria.json"), {
    schema_version: 1,
    what_it_tests: "Runner",
    expected_behavior: "Runs",
    assertions: [],
    tests: [],
    judges: []
  });
  if (turns.length) await writeJson(path.join(scenarioPath, "turns.json"), turns);
  return {
    folder: "R1-runner",
    id: "R1",
    path: scenarioPath,
    metadata: await readJson(path.join(scenarioPath, "scenario.json")),
    criteria: await readJson(path.join(scenarioPath, "criteria.json")),
    task: "First turn.",
    turns
  };
}

class FakeScenarioClient {
  requests: Array<{ method: string; params: unknown }> = [];
  flushed = false;
  private events: Record<string, unknown>[] = [];
  private turnCount = 0;
  private pendingTrace: Promise<void>[] = [];
  private onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void> = async () => {};

  constructor(private options: { completeTurns?: boolean } = { completeTurns: true }) {}

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
      this.events.push({ method: "thread/tokenUsage/updated", params: { threadId: "thread-1", turnId, tokenUsage: { last: { inputTokens: 5, outputTokens: 7, totalTokens: 12 } } } });
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
