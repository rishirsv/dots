import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

import { serve } from "./server.js";

test("advisor tools enforce the run and finalization lifecycle", async (context) => {
  const fixture = await createFixture();
  await writeFile(join(fixture.repo, "existing.txt"), "before\n");

  const service = await serve({ runDir: fixture.runDir, port: 0, graceMs: 10_000 });
  const client = await connect(service.address);
  context.after(async () => {
    await client.close();
    await service.close("test cleanup");
    await rm(fixture.root, { recursive: true, force: true });
  });

  const stale = await call(client, "read_file", { runId: "older-run", path: "existing.txt" });
  assert.equal(stale.isError, true);
  assert.match(text(stale), /runId/);

  const existing = JSON.parse(text(await call(client, "read_file", {
    runId: fixture.run.id, path: "existing.txt",
  })));
  assert.equal(existing.text, "before\n");
  assert.match(existing.sha256, /^[a-f0-9]{64}$/);

  const writtenHash = text(await call(client, "write_file", {
    runId: fixture.run.id, path: "new.txt", text: "advisor edit\n", expectedSha256: null,
  }));
  assert.match(writtenHash, /^[a-f0-9]{64}$/);
  const written = JSON.parse(text(await call(client, "read_file", {
    runId: fixture.run.id, path: "new.txt",
  })));
  assert.equal(written.text, "advisor edit\n");

  const job = JSON.parse(text(await call(client, "exec", {
    runId: fixture.run.id,
    key: "live-job",
    command: [process.execPath, "-e", "setTimeout(() => {}, 30000)"],
  })));
  assert.equal(job.status, "running");

  const premature = await call(client, "finish", {
    runId: fixture.run.id, advice: "Use the smaller boundary.",
  });
  assert.equal(premature.isError, true);
  assert.match(text(premature), /jobs are active/);

  await call(client, "terminal", {
    runId: fixture.run.id, id: job.id, terminate: true, waitMs: 5_000,
  });
  const advice = "Use the smaller boundary.";
  const first = await call(client, "finish", { runId: fixture.run.id, advice });
  const retry = await call(client, "finish", { runId: fixture.run.id, advice });
  assert.equal(first.isError, undefined);
  assert.equal(retry.isError, undefined);

  const changed = await call(client, "finish", {
    runId: fixture.run.id, advice: "Use a different boundary.",
  });
  assert.equal(changed.isError, true);
  const final = JSON.parse(await readFile(join(fixture.runDir, "final.json"), "utf8"));
  assert.equal(final.advice, advice);
  assert.match(final.sha256, /^[a-f0-9]{64}$/);

  const afterFinish = await call(client, "read_file", {
    runId: fixture.run.id, path: "new.txt",
  });
  assert.equal(afterFinish.isError, true);
  const consultation = await call(client, "consultation", { runId: fixture.run.id });
  assert.match(text(consultation), /Review the repository boundary/);
});

test("idle timeout closes an inactive service and records interruption", async (context) => {
  const fixture = await createFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  const service = await serve({ runDir: fixture.runDir, port: 0, idleMs: 50 });

  const closed = await Promise.race([
    service.closed,
    new Promise((_, reject) => setTimeout(() => reject(new Error("idle close timed out")), 3_000)),
  ]);
  assert.equal(closed.status, "interrupted");
  const runtime = JSON.parse(await readFile(join(fixture.runDir, "runtime.json"), "utf8"));
  assert.equal(runtime.status, "interrupted");
  assert.match(runtime.reason, /idle timeout/);
});

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), "dots-advisor-service-"));
  const repo = join(root, "repo");
  const runDir = join(root, "run");
  await Promise.all([mkdir(repo), mkdir(runDir)]);
  const run = {
    id: "run-123",
    repo,
    access: "workspace-write",
    brief: "Review the repository boundary.",
    createdAt: new Date().toISOString(),
    controlToken: "test-control-token",
  };
  await writeFile(join(runDir, "run.json"), `${JSON.stringify(run)}\n`);
  return { root, repo, runDir, run };
}

async function connect(address) {
  const transport = new StreamableHTTPClientTransport(new URL(address));
  const client = new Client({ name: "dots-advisor-service-test", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

function call(client, name, args) {
  return client.callTool({ name, arguments: args });
}

function text(result) {
  return result.content[0]?.text || "";
}
