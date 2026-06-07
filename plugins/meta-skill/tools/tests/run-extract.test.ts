import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCli } from "../src/cli.ts";
import { readJsonOrJsonlFile } from "../src/core/jsonl.ts";
import { loadThreadExport } from "../src/core/transcript-export.ts";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureBase = path.join(fixtureDir, "fixtures");

async function assertRejectsMessage(action: () => Promise<void>, pattern: RegExp): Promise<void> {
  await assert.rejects(action, (error: unknown) => {
    assert.match((error as Error).message, pattern);
    return true;
  });
}

async function captureConsole(action: () => Promise<void>): Promise<string[]> {
  const lines: string[] = [];
  const original = console.log;
  console.log = (message?: unknown) => {
    lines.push(String(message ?? ""));
  };
  try {
    await action();
  } finally {
    console.log = original;
  }
  return lines;
}

describe("msk minimal extraction", () => {
  it("rejects unsafe run ids before filesystem writes", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      await runCli(["init"], cwd);
      await runCli(["run", "new", "safe-id_1.2"], cwd);
      await assertRejectsMessage(
        () => runCli(["run", "new", ""], cwd),
        /msk run new requires <run-id>/,
      );
      await assertRejectsMessage(
        () => runCli(["run", "new", "bad/id"], cwd),
        /invalid run id/,
      );
      await assertRejectsMessage(
        () => runCli(["run", "new", "."], cwd),
        /invalid run id/,
      );
      await assertRejectsMessage(
        () => runCli(["run", "new", "../escape"], cwd),
        /invalid run id/,
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("does not overwrite an existing run", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "repeat-run";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      const runJson = path.join(cwd, ".meta-skill", "runs", runId, "run.json");
      writeFileSync(runJson, '{"sentinel":true}\n');
      await assertRejectsMessage(
        () => runCli(["run", "new", runId], cwd),
        /Run already exists/,
      );
      assert.equal(readFileSync(runJson, "utf8"), '{"sentinel":true}\n');
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects unsafe skill slugs before scaffold writes", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      await assertRejectsMessage(
        () => runCli(["skill", "new", "../escape-skill"], cwd),
        /invalid skill slug/,
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("writes minimal success and degraded rows from thread exports", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "extractor-next-slice";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-success",
        "--thread",
        "thread-success",
      ], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-missing",
        "--thread",
        "thread-missing",
      ], cwd);
      await runCli(
        [
          "run",
          "extract",
          runId,
          "--thread-export",
          path.join(fixtureBase, "thread-success.json"),
          "--thread-export",
          path.join(fixtureBase, "thread-missing.jsonl"),
          "--rebuild",
        ],
        cwd,
      );
      const rowsPath = path.join(cwd, ".meta-skill", "runs", runId, "results.jsonl");
      const rows = (await readJsonOrJsonlFile(rowsPath)) as Record<string, unknown>[];
      assert.equal(rows.length, 2);

      const success = rows.find((row) => row.task_id === "task-success") as Record<string, unknown>;
      const missing = rows.find((row) => row.task_id === "task-missing") as Record<string, unknown>;
      assert.ok(success);
      assert.equal(success.attempt_id, "task-success.1");
      assert.equal(success.thread_id, "thread-success");
      assert.equal(success.status, "completed");
      assert.equal(success.summary, "Implementation complete");
      assert.equal(success.extraction_degraded, false);
      assert.equal(success.score, undefined);
      assert.equal(success.decision, undefined);
      assert.equal(success.variant_id, undefined);

      assert.ok(missing);
      assert.equal(missing.attempt_id, "task-missing.1");
      assert.equal(missing.thread_id, "thread-missing");
      assert.equal(missing.status, "missing-result");
      assert.equal(missing.summary, "");
      assert.equal(missing.extraction_degraded, true);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("ingests the app-native read_thread export shape without manual reshaping", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "app-native-export";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-app-native",
        "--thread",
        "thread-app-native",
      ], cwd);

      const exportPath = path.join(fixtureBase, "thread-app-native-export.json");
      const parsed = loadThreadExport(exportPath);
      assert.equal(parsed.thread_id, "thread-app-native");
      assert.ok(parsed.messages.some((message) => message.type === "agentMessage"));

      await runCli(
        [
          "run",
          "extract",
          runId,
          "--thread-export",
          exportPath,
          "--rebuild",
        ],
        cwd,
      );

      const rowsPath = path.join(cwd, ".meta-skill", "runs", runId, "results.jsonl");
      const rows = (await readJsonOrJsonlFile(rowsPath)) as Record<string, unknown>[];
      assert.equal(rows.length, 1);
      assert.deepEqual(rows[0], {
        schema_version: 1,
        run_id: runId,
        task_id: "task-app-native",
        attempt_id: "task-app-native.1",
        thread_id: "thread-app-native",
        status: "completed",
        summary: "App-native export parsed without reshaping",
        extraction_source: "thread-export",
        extraction_degraded: false,
      });
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects unsupported transcript message shapes", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "unsupported-export";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      await runCli(["run", "add-thread", runId, "--task", "task-a", "--thread", "thread-unsupported"], cwd);
      await assertRejectsMessage(
        () =>
          runCli(
            [
              "run",
              "extract",
              runId,
              "--thread-export",
              path.join(fixtureBase, "thread-unsupported-shape.json"),
              "--rebuild",
            ],
            cwd,
          ),
        /no supported text-bearing messages/,
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("prints compact check counts", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "check-run";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      await runCli(["run", "add-thread", runId, "--task", "task-a", "--thread", "thread-a"], cwd);
      await runCli(["run", "add-thread", runId, "--task", "task-b", "--thread", "thread-b"], cwd);
      await runCli(
        [
          "run",
          "extract",
          runId,
          "--thread-export",
          path.join(fixtureBase, "thread-success.json"),
          "--rebuild",
        ],
        cwd,
      );

      const lines = await captureConsole(() => runCli(["run", "check", runId], cwd));
      assert.deepEqual(lines, [
        "expected_attempts: 2",
        "extracted_rows: 2",
        "degraded_rows: 2",
        "missing_rows: 2",
      ]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("prints quality counts for valid and degraded app-native exports", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "app-native-export";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-app-native",
        "--thread",
        "thread-app-native",
      ], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-invalid",
        "--thread",
        "thread-invalid-result",
      ], cwd);
      await runCli(["run", "add-thread", runId, "--task", "task-missing", "--thread", "thread-missing"], cwd);

      await runCli(
        [
          "run",
          "extract",
          runId,
          "--thread-export",
          path.join(fixtureBase, "thread-app-native-export.json"),
          "--thread-export",
          path.join(fixtureBase, "thread-invalid-result.json"),
          "--thread-export",
          path.join(fixtureBase, "thread-missing.jsonl"),
          "--rebuild",
        ],
        cwd,
      );

      const rowsPath = path.join(cwd, ".meta-skill", "runs", runId, "results.jsonl");
      const rows = (await readJsonOrJsonlFile(rowsPath)) as Record<string, unknown>[];
      assert.equal(rows.length, 3);
      assert.equal(rows.find((row) => row.task_id === "task-app-native")?.extraction_degraded, false);
      assert.equal(rows.find((row) => row.task_id === "task-invalid")?.extraction_degraded, true);
      assert.equal(rows.find((row) => row.task_id === "task-missing")?.extraction_degraded, true);

      const lines = await captureConsole(() => runCli(["run", "check", runId], cwd));
      assert.deepEqual(lines, [
        "expected_attempts: 3",
        "extracted_rows: 3",
        "degraded_rows: 2",
        "missing_rows: 2",
      ]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
