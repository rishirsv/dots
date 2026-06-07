import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCli } from "../src/cli.js";
import { readJsonOrJsonlFile } from "../src/core/jsonl.js";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureBase = path.join(fixtureDir, "fixtures");

describe("msk run extract/report", () => {
  it("writes success and degraded rows from thread exports", async () => {
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
        "--variant",
        "current",
        "--thread",
        "thread-success",
      ], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-missing",
        "--variant",
        "current",
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
      assert.equal(success.decision, "accepted");
      assert.equal(success.extraction_degraded, false);
      assert.equal(success.score, "3/3");
      assert.ok(Array.isArray(success.validation));

      assert.ok(missing);
      assert.equal(missing.decision, "review-required");
      assert.equal(missing.extraction_degraded, true);
      assert.ok((missing.extraction_missing_fields as string[]).includes("codex_thread_result"));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("runs add-thread without clobbering existing tasks", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "task-update";
      await runCli(["init"], cwd);
      await runCli(["run", "new", runId], cwd);

      const runFile = path.join(cwd, ".meta-skill", "runs", runId, "run.json");
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-a",
        "--variant",
        "current",
        "--thread",
        "thread-a",
      ], cwd);
      await runCli([
        "run",
        "add-thread",
        runId,
        "--task",
        "task-a",
        "--variant",
        "current",
        "--thread",
        "thread-a2",
      ], cwd);

      const payload = JSON.parse(readFileSync(runFile, "utf8"));
      assert.equal(payload.tasks.length, 2);
      const attempts = payload.tasks.map((entry: { attempt_id: string }) => entry.attempt_id);
      assert.ok(attempts.includes("task-a.current.1"));
      assert.ok(attempts.includes("task-a.current.2"));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("writes a readable report from results", async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "msk-cli-"));
    try {
      const runId = "report-run";
      const runDir = path.join(cwd, ".meta-skill", "runs", runId);
      mkdirSync(runDir, { recursive: true });
      writeFileSync(
        path.join(runDir, "run.json"),
        JSON.stringify({
          schema_version: 1,
          run_id: runId,
          status: "completed",
          tasks: [],
        }),
      );
      writeFileSync(
        path.join(runDir, "results.jsonl"),
        [
          JSON.stringify({
            schema_version: 1,
            run_id: runId,
            task_id: "task-a",
            attempt_id: "task-a.current.1",
            variant_id: "current",
            thread_id: "thread-a",
            status: "completed",
            decision: "accepted",
            score: "3/3",
            changed_files: [],
            validation: [],
            evidence: "good",
            risks: [],
            next_action: "accept",
            extraction_source: "thread-export",
            extraction_confidence: "high",
            extraction_missing_fields: [],
            extraction_degraded: false,
          }),
          "\n",
        ].join(""),
      );
      await runCli(["run", "report", runId], cwd);
      const reportText = readFileSync(path.join(runDir, "report.md"), "utf8");
      assert.match(reportText, /Attempts/);
      assert.match(reportText, /task-a/);
      assert.match(reportText, /accepted/);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
