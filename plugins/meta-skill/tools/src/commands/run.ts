import { writeJsonl } from "../core/jsonl.js";
import { getRunPath, getRunResultsPath } from "../core/paths.js";
import { ThreadExport, loadThreadExport } from "../core/transcript-export.js";
import { extractResultFromExport, ExtractedResult, missingKeysFromResult } from "../core/result-block.js";
import { ResultRow, TaskAttempt, RunFile } from "../core/schemas.js";
import { createRun, nextAttemptId, readRun, upsertAttempt, writeRun } from "../core/run-store.js";
import { readJsonOrJsonlFile } from "../core/jsonl.js";
import fs from "node:fs/promises";
import { getReportPath } from "../core/paths.js";

export async function runNew(cwd: string, runId: string): Promise<RunFile> {
  const run = await createRun(cwd, runId);
  return run;
}

export async function runAddThread(
  cwd: string,
  options: {
    runId: string;
    taskId: string;
    variantId: string;
    threadId: string;
    attemptId?: string;
  },
): Promise<string> {
  const run = await readRun(cwd, options.runId);
  const attemptId =
    options.attemptId && options.attemptId.trim().length > 0
      ? options.attemptId
      : nextAttemptId(run.tasks, options.taskId, options.variantId);

  const attempt: TaskAttempt = {
    task_id: options.taskId,
    attempt_id: attemptId,
    variant_id: options.variantId,
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
  const run = await readRun(cwd, runId);
  const exportsData = threadExports.map((file) => loadThreadExport(file));
  const rows = buildRowsFromExports(run, exportsData);

  await writeJsonl(getRunResultsPath(cwd, runId), rows, mode === "append" ? "append" : "overwrite");
  return rows.length;
}

export async function runReport(cwd: string, runId: string): Promise<string> {
  const run = await readRun(cwd, runId);
  const rows = (await readJsonOrJsonlFile(getRunResultsPath(cwd, runId)).catch(() => [])) as ResultRow[];

  const statusCounts: Record<string, number> = {};
  const decisionCounts: Record<string, number> = {};
  const variantCounts: Record<string, number> = {};
  for (const row of rows) {
    const status = row.status ?? "completed";
    const decision = row.decision || "review-required";
    const variant = row.variant_id || "current";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    decisionCounts[decision] = (decisionCounts[decision] || 0) + 1;
    variantCounts[variant] = (variantCounts[variant] || 0) + 1;
  }

  const lines: string[] = [];
  lines.push(`# Run report for ${run.run_id}`);
  lines.push("");
  lines.push(`- Status: \`${run.status}\``);
  lines.push(`- Task attempts: \`${rows.length}\``);
  lines.push("");
  lines.push("## Attempts");
  lines.push("| task_id | attempt_id | variant_id | thread_id | status | decision | score | degraded |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    const score = row.score === null || row.score === undefined ? "" : String(row.score);
    lines.push(
      `| ${row.task_id} | ${row.attempt_id} | ${row.variant_id || "current"} | ${row.thread_id || ""} | ${row.status} | ${row.decision} | ${score} | ${row.extraction_degraded ? "yes" : "no"} |`,
    );
  }
  lines.push("");
  lines.push("## Counts by status");
  lines.push(renderMap(statusCounts));
  lines.push("");
  lines.push("## Counts by decision");
  lines.push(renderMap(decisionCounts));
  lines.push("");
  lines.push("## Counts by variant");
  lines.push(renderMap(variantCounts));
  lines.push("");

  lines.push(`- Degraded extraction rows: \`${rows.filter((row) => row.extraction_degraded).length}\``);
  await fs.mkdir(getRunPath(cwd, runId), { recursive: true });
  const reportPath = getReportPath(cwd, runId);
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
  return reportPath;
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

  for (const extra of unmatched) {
    const taskFallback = {
      task_id: (typeof extra.metadata.task_id === "string" ? extra.metadata.task_id : "unknown-task") as string,
      attempt_id: (typeof extra.metadata.attempt_id === "string" ? extra.metadata.attempt_id : `${Date.now()}.unknown`) as string,
      variant_id: "current" as string,
      thread_id: extra.thread_id || "",
      status: "completed" as string,
    };
    rows.push(normalizeRow(run.run_id, taskFallback, extra));
  }

  return rows;
}

function normalizeRow(runId: string, task: TaskAttempt, exportItem: ThreadExport): ResultRow {
  const extracted: ExtractedResult = extractResultFromExport(exportItem, runId, task.task_id);
  const result = extracted.result;
  const threadId = result?.thread_id || task.thread_id || exportItem.thread_id || "";
  const finalTaskId = result?.task_id || task.task_id || "unknown-task";
  const finalAttemptId = result?.attempt_id || task.attempt_id || "unknown-attempt";
  const finalVariantId = result?.variant_id || task.variant_id || "current";
  const status = result?.status || task.status || "completed";
  const decision = result?.decision || "review-required";
  const score = result?.score ?? null;
  const changedFiles = Array.isArray(result?.changed_files) ? result.changed_files : [];
  const validation = Array.isArray(result?.validation) ? result.validation : [];
  const evidence = typeof result?.evidence === "string" ? result.evidence : "codex_thread_result block not found";
  const risks = Array.isArray(result?.risks) ? result.risks : [];
  const nextAction = typeof result?.next_action === "string" ? result.next_action : "manual follow-up";
  const missing = extracted.missingFields;
  if (result) {
    const requiredMissing = missingKeysFromResult(result, result.run_id || runId, finalTaskId);
    for (const key of requiredMissing) {
      missing.add(key);
    }
  }
  const sortedMissing = [...missing].sort();

  return {
    schema_version: 1,
    run_id: result?.run_id || runId,
    task_id: finalTaskId,
    attempt_id: finalAttemptId,
    variant_id: finalVariantId,
    thread_id: threadId,
    status,
    decision,
    score,
    changed_files: changedFiles,
    validation,
    evidence,
    risks,
    next_action: nextAction,
    extraction_source: "thread-export",
    extraction_confidence: extracted.confidence,
    extraction_missing_fields: sortedMissing,
    extraction_degraded: missing.size > 0,
  };
}

function missingRow(runId: string, task: TaskAttempt): ResultRow {
  return {
    schema_version: 1,
    run_id: runId,
    task_id: task.task_id,
    attempt_id: task.attempt_id,
    variant_id: task.variant_id,
    thread_id: task.thread_id,
    status: task.status || "completed",
    decision: "review-required",
    score: null,
    changed_files: [],
    validation: [],
    evidence: "codex_thread_result block not found",
    risks: [],
    next_action: "manual follow-up",
    extraction_source: "missing-export",
    extraction_confidence: "low",
    extraction_missing_fields: ["codex_thread_result"],
    extraction_degraded: true,
  };
}

function renderMap(data: Record<string, number>): string {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return "- (empty)";
  }
  return keys
    .sort()
    .map((key) => `- ${key}: ${data[key]}`)
    .join("\n");
}
