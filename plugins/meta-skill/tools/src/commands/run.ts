import { writeJsonl } from "../core/jsonl.ts";
import { getRunResultsPath } from "../core/paths.ts";
import { loadThreadExport } from "../core/transcript-export.ts";
import type { ThreadExport } from "../core/transcript-export.ts";
import { extractResultFromExport, missingKeysFromResult } from "../core/result-block.ts";
import type { ExtractedResult } from "../core/result-block.ts";
import type { ResultRow, TaskAttempt, RunFile } from "../core/schemas.ts";
import { createRun, nextAttemptId, readRun, upsertAttempt, writeRun } from "../core/run-store.ts";
import { readJsonOrJsonlFile } from "../core/jsonl.ts";
import { assertSafeAttemptId, assertSafeRunId, assertSafeTaskId } from "../core/ids.ts";

export interface RunCheckSummary {
  expected_attempts: number;
  extracted_rows: number;
  degraded_rows: number;
  missing_rows: number;
}

export async function runNew(cwd: string, runId: string): Promise<RunFile> {
  const run = await createRun(cwd, assertSafeRunId(runId));
  return run;
}

export async function runAddThread(
  cwd: string,
  options: {
    runId: string;
    taskId: string;
    threadId: string;
    attemptId?: string;
  },
): Promise<string> {
  const runId = assertSafeRunId(options.runId);
  const taskId = assertSafeTaskId(options.taskId);
  const attemptIdOption = options.attemptId ? assertSafeAttemptId(options.attemptId) : undefined;
  const run = await readRun(cwd, runId);
  const attemptId =
    attemptIdOption && attemptIdOption.trim().length > 0
      ? attemptIdOption
      : nextAttemptId(run.tasks, taskId);

  const attempt: TaskAttempt = {
    task_id: taskId,
    attempt_id: attemptId,
    thread_id: options.threadId,
    status: "running",
  };
  upsertAttempt(run, attempt);
  await writeRun(cwd, run);
  return attempt.attempt_id;
}

export async function runExtract(
  cwd: string,
  runId: string,
  threadExports: string[],
  mode: "append" | "rebuild",
): Promise<number> {
  assertSafeRunId(runId);
  const run = await readRun(cwd, runId);
  const exportsData = threadExports.map((file) => loadThreadExport(file));
  const rows = buildRowsFromExports(run, exportsData);

  await writeJsonl(getRunResultsPath(cwd, runId), rows, mode === "append" ? "append" : "overwrite");
  return rows.length;
}

export async function runCheck(cwd: string, runId: string): Promise<RunCheckSummary> {
  assertSafeRunId(runId);
  const run = await readRun(cwd, runId);
  const rows = (await readJsonOrJsonlFile(getRunResultsPath(cwd, runId)).catch(() => [])) as ResultRow[];
  const rowByAttempt = new Map(rows.map((row) => [`${row.task_id}:${row.attempt_id}`, row]));
  let missingRows = 0;

  for (const task of run.tasks || []) {
    const row = rowByAttempt.get(`${task.task_id}:${task.attempt_id}`);
    if (!row || row.status === "missing-result") {
      missingRows += 1;
    }
  }

  return {
    expected_attempts: (run.tasks || []).length,
    extracted_rows: rows.length,
    degraded_rows: rows.filter((row) => row.extraction_degraded).length,
    missing_rows: missingRows,
  };
}

function buildRowsFromExports(run: RunFile, exportsData: ThreadExport[]): ResultRow[] {
  const rows: ResultRow[] = [];
  const matched = new Map<string, ThreadExport[]>();
  const unmatched: ThreadExport[] = [];

  for (const exportItem of exportsData) {
    if (exportItem.thread_id) {
      const byThread = matched.get(exportItem.thread_id) || [];
      byThread.push(exportItem);
      matched.set(exportItem.thread_id, byThread);
    } else {
      unmatched.push(exportItem);
    }
  }

  for (const task of run.tasks || []) {
    const exportData = task.thread_id ? matched.get(task.thread_id)?.shift() : undefined;
    if (exportData) {
      rows.push(normalizeRow(run.run_id, task, exportData));
    } else if (unmatched.length > 0) {
      rows.push(normalizeRow(run.run_id, task, unmatched.shift() as ThreadExport));
    } else {
      rows.push(missingRow(run.run_id, task));
    }
  }

  return rows;
}

function normalizeRow(runId: string, task: TaskAttempt, exportItem: ThreadExport): ResultRow {
  const extracted: ExtractedResult = extractResultFromExport(exportItem, runId, task.task_id);
  const result = extracted.result;
  const missing = extracted.missingFields;
  if (result) {
    const requiredMissing = missingKeysFromResult(result, result.run_id || runId, result.task_id || task.task_id);
    for (const key of requiredMissing) {
      missing.add(key);
    }
    if (result.run_id && result.run_id !== runId) {
      missing.add("run_id");
    }
    if (result.task_id && result.task_id !== task.task_id) {
      missing.add("task_id");
    }
    if (result.attempt_id && result.attempt_id !== task.attempt_id) {
      missing.add("attempt_id");
    }
    if (result.thread_id && result.thread_id !== task.thread_id) {
      missing.add("thread_id");
    }
  }
  if (!result || missing.size > 0) {
    return missingRow(runId, task);
  }

  return {
    schema_version: 1,
    run_id: runId,
    task_id: task.task_id,
    attempt_id: task.attempt_id,
    thread_id: task.thread_id,
    status: result.status || "completed",
    summary: result.summary || "",
    extraction_source: "thread-export",
    extraction_degraded: false,
  };
}

function missingRow(runId: string, task: TaskAttempt): ResultRow {
  return {
    schema_version: 1,
    run_id: runId,
    task_id: task.task_id,
    attempt_id: task.attempt_id,
    thread_id: task.thread_id,
    status: "missing-result",
    summary: "",
    extraction_source: "missing-export",
    extraction_degraded: true,
  };
}
