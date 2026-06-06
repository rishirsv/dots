import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { AppServerEvalRunner } from "./runner.ts";
import type { EvalRecord } from "../models.ts";
import { exists, readText, writeText } from "../project.ts";

describe("AppServerEvalRunner", () => {
  it("writes rpc, transcript, and final per eval and returns usage", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-"));
    const runRoot = path.join(root, "run");
    const skillRoot = path.join(root, "skill");
    await fs.mkdir(skillRoot, { recursive: true });
    await writeText(path.join(skillRoot, "SKILL.md"), "---\nname: demo\n---\n# Demo\n");
    const fake = new FakeClient();
    const runner = new AppServerEvalRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    const result = await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
      eval: evalRecord(root),
      runSource: { kind: "working_payload", label: "Working payload", skill_root: "payload", skill_activation: "forced" },
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    const evalRoot = path.join(runRoot, "cases", "basic");
    assert.equal(await exists(path.join(evalRoot, "rpc.jsonl")), true);
    assert.equal(await exists(path.join(evalRoot, "transcript.json")), true);
    assert.equal(await exists(path.join(evalRoot, "response.md")), true);
    assert.equal(result.transcript_path, path.join(evalRoot, "transcript.json"));
    assert.equal(result.token_usage.total_tokens, 24);
    assert.match(await readText(path.join(evalRoot, "response.md")), /final answer/);
    const transcript = JSON.parse(await readText(path.join(evalRoot, "transcript.json")));
    assert.equal(transcript.turns[0].finalText, "final answer");
    assertSolverInstructionsAreNatural(fake.startParams);
    assert.match(JSON.stringify(fake.startParams), /SKILL\.md/);
    assert.match(JSON.stringify(fake.startParams), /global cache paths/);
  });

  it("keeps no-skill control instructions free of test harness language", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-natural-"));
    const runRoot = path.join(root, "run");
    const projectRoot = path.join(root, "project");
    await fs.mkdir(projectRoot, { recursive: true });
    const fake = new FakeClient();
    const runner = new AppServerEvalRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    await runner.run({
      projectRoot,
      skill_activation: "none",
      eval: evalRecord(root),
      runSource: { kind: "no_skill", label: "No skill", skill_root: null, skill_activation: "none" },
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assertSolverInstructionsAreNatural(fake.startParams);
  });

  it("writes an unavailable final warning instead of reusing an earlier turn final after trace overflow", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-overflow-"));
    const runRoot = path.join(root, "run");
    const skillRoot = path.join(root, "skill");
    await fs.mkdir(skillRoot, { recursive: true });
    await writeText(path.join(skillRoot, "SKILL.md"), "---\nname: demo\n---\n# Demo\n");
    const fake = new OverflowFakeClient();
    const runner = new AppServerEvalRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25, maxTraceEvents: 4 });

    await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
      eval: { ...evalRecord(root), turns: [{ content: "Follow up." }] },
      runSource: { kind: "working_payload", label: "Working payload", skill_root: "payload", skill_activation: "forced" },
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    const evalRoot = path.join(runRoot, "cases", "basic");
    const final = await readText(path.join(evalRoot, "response.md"));
    assert.doesNotMatch(final, /first turn final/);
    assert.match(final, /Final assistant message unavailable for turn turn-2/);
    assert.match(final, /rpc\.jsonl/);
    const transcript = JSON.parse(await readText(path.join(evalRoot, "transcript.json")));
    assert.equal(transcript.turns[0].finalText, "first turn final");
    assert.match(transcript.turns[1].finalText, /Final assistant message unavailable/);
    assert.equal(transcript.turns[1].items.some((item: { type?: string; method?: string }) => item.type === "warning" && item.method === "metaSkill/traceBuffer/overflow"), true);
  });

  it("exposes eval fixtures under fixtures/ in the runtime workspace", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-runner-fixtures-"));
    const runRoot = path.join(root, "run");
    const skillRoot = path.join(root, "skill");
    const evalPath = path.join(root, "eval");
    await fs.mkdir(path.join(evalPath, "fixtures"), { recursive: true });
    await fs.mkdir(skillRoot, { recursive: true });
    await writeText(path.join(skillRoot, "SKILL.md"), "---\nname: demo\n---\n# Demo\n");
    await writeText(path.join(evalPath, "fixtures", "source.md"), "Fixture source");
    const fake = new FixtureFakeClient();
    const runner = new AppServerEvalRunner({ clientFactory: (onLine) => fake.attach(onLine), turnTimeoutMs: 25 });

    await runner.run({
      projectRoot: skillRoot,
      skillRoot,
      skill_activation: "forced",
      eval: { ...evalRecord(evalPath), path: evalPath },
      runSource: { kind: "working_payload", label: "Working payload", skill_root: "payload", skill_activation: "forced" },
      runId: "001-test",
      runRoot,
      appServer: { mode: "managed", auth: "inherited", protocol: "generated-ts", generatedTypes: "test" }
    });

    assert.equal(fake.sawFixturePath, true);
  });
});

class FakeClient {
  private onLine?: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>;
  private events: Record<string, unknown>[] = [];
  startParams: unknown = undefined;

  attach(onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>) {
    this.onLine = onLine;
    return {
      request: async (method: string, params?: unknown) => {
        await this.onLine?.({ direction: "client", message: { method } });
        if (method === "thread/start") {
          this.startParams = params;
          return { thread: { id: "thread-1" } };
        }
        this.events.push({ method: "thread/tokenUsage/updated", params: { threadId: "thread-1", turnId: "turn-1", tokenUsage: { total: { inputTokens: 10, outputTokens: 14, totalTokens: 24, cachedInputTokens: 4, reasoningOutputTokens: 0 } } } });
        return { turn: { id: "turn-1" } };
      },
      waitFor: async () => ({ msg: { type: "turn/completed" } }),
      eventCount: () => 0,
      eventsSince: () => [
        { method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId: "turn-1", delta: "final answer" } },
        ...this.events
      ],
      close: () => {},
      flush: async () => {}
    };
  }
}

function assertSolverInstructionsAreNatural(params: unknown): void {
  assert.ok(params && typeof params === "object");
  const start = params as { baseInstructions?: string; developerInstructions?: string };
  const visibleInstructions = `${start.baseInstructions || ""}\n${start.developerInstructions || ""}`;
  assert.doesNotMatch(visibleInstructions, /\beval\b/i);
  assert.doesNotMatch(visibleInstructions, /self[- ]?eval(?:uation)?/i);
  assert.doesNotMatch(visibleInstructions, /\btest\b/i);
  assert.doesNotMatch(visibleInstructions, /\bbenchmark\b/i);
  assert.doesNotMatch(visibleInstructions, /no skill is mounted/i);
}

class OverflowFakeClient {
  private onLine?: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>;
  private turnNumber = 0;
  private activeTurnId = "";

  attach(onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>) {
    this.onLine = onLine;
    return {
      request: async (method: string) => {
        await this.onLine?.({ direction: "client", message: { method } });
        if (method === "thread/start") return { thread: { id: "thread-1" } };
        this.turnNumber += 1;
        this.activeTurnId = `turn-${this.turnNumber}`;
        return { turn: { id: this.activeTurnId } };
      },
      waitFor: async () => {
        if (this.activeTurnId === "turn-1") {
          await this.onLine?.({ direction: "server", message: { method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId: "turn-1", delta: "first turn final" } } });
          await this.onLine?.({ direction: "server", message: { method: "turn/completed", params: { threadId: "thread-1", turn: { id: "turn-1", status: "completed" } } } });
        } else {
          for (let index = 0; index < 5; index += 1) {
            await this.onLine?.({ direction: "server", message: { method: "item/reasoning/delta", params: { threadId: "thread-1", turnId: "turn-2", delta: `step ${index}` } } });
          }
          await this.onLine?.({ direction: "server", message: { method: "turn/completed", params: { threadId: "thread-1", turn: { id: "turn-2", status: "completed" } } } });
        }
        return { msg: { type: "turn/completed" } };
      },
      eventCount: () => 0,
      eventsSince: () => [],
      close: () => {},
      flush: async () => {}
    };
  }
}

class FixtureFakeClient {
  private onLine?: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>;
  sawFixturePath = false;

  attach(onLine: (line: { direction: "client" | "server" | "stderr"; message: unknown }) => Promise<void>) {
    this.onLine = onLine;
    return {
      request: async (method: string, params?: unknown) => {
        await this.onLine?.({ direction: "client", message: { method } });
        if (method === "thread/start") {
          const cwd = typeof params === "object" && params && "cwd" in params ? String((params as { cwd: unknown }).cwd) : "";
          this.sawFixturePath = await exists(path.join(cwd, "fixtures", "source.md"));
          return { thread: { id: "thread-1" } };
        }
        return { turn: { id: "turn-1" } };
      },
      waitFor: async () => ({ msg: { type: "turn/completed" } }),
      eventCount: () => 0,
      eventsSince: () => [
        { method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId: "turn-1", delta: "final answer" } }
      ],
      close: () => {},
      flush: async () => {}
    };
  }
}

function evalRecord(root: string): EvalRecord {
  return {
    folder: "basic",
    id: "basic",
    path: root,
    metadata: { title: "Basic" },
    criteria: {
      criteria: [
        { criterion: "Specific", phase: "Quality", dimension: "Specificity", question: "Is it specific?", evidence: "response" },
        { criterion: "Runs", phase: "Implementation", dimension: "Actionability", question: "Does it answer?", evidence: "response" },
        { criterion: "Valid", phase: "Validation", dimension: "Structural correctness", question: "Is it valid?", evidence: "response" }
      ],
      tests: []
    },
    problemDescription: "Answer directly.",
    outputSpecification: "A direct answer.",
    task: "Answer.",
    turns: []
  };
}
