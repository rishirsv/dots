import fs from "node:fs/promises";
import { getRunJsonPath, getRunPath } from "./paths.js";
import { TaskAttempt, RunFile } from "./schemas.js";

const RUN_FILE_SCHEMA = 1;

export async function createRun(cwd: string, runId: string): Promise<RunFile> {
  const runPath = getRunPath(cwd, runId);
  await fs.mkdir(runPath, { recursive: true });

  const runFile = {
    schema_version: RUN_FILE_SCHEMA,
    run_id: runId,
    status: "running" as const,
    tasks: [],
  } satisfies RunFile;

  const runJsonPath = getRunJsonPath(cwd, runId);
  await fs.writeFile(runJsonPath, JSON.stringify(runFile, null, 2), "utf8");
  return runFile;
}

export async function readRun(cwd: string, runId: string): Promise<RunFile> {
  const runJson = await fs.readFile(getRunJsonPath(cwd, runId), "utf8");
  const payload = JSON.parse(runJson);
  if (!payload || typeof payload !== "object") {
    throw new Error(`invalid run file for ${runId}`);
  }
  const run = payload as RunFile;
  if (!Array.isArray(run.tasks)) {
    run.tasks = [];
  }
  return run;
}

export async function writeRun(cwd: string, runData: RunFile): Promise<void> {
  const runJsonPath = getRunJsonPath(cwd, runData.run_id);
  await fs.writeFile(runJsonPath, JSON.stringify(runData, null, 2), "utf8");
}

export function nextAttemptId(
  tasks: TaskAttempt[],
  taskId: string,
  variantId: string,
): string {
  let maxN = 0;
  const pattern = new RegExp(`^${escapeRegExp(taskId)}\\.${escapeRegExp(variantId)}\\.(\\d+)$`);
  for (const task of tasks) {
    if (task.task_id !== taskId || task.variant_id !== variantId) {
      continue;
    }
    const match = pattern.exec(task.attempt_id);
    if (match && match[1]) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) {
        maxN = Math.max(maxN, value);
      }
    }
  }
  return `${taskId}.${variantId}.${maxN + 1}`;
}

export function upsertAttempt(run: RunFile, attempt: TaskAttempt): void {
  const existingIndex = run.tasks.findIndex((task) => task.attempt_id === attempt.attempt_id && task.task_id === attempt.task_id);
  if (existingIndex >= 0) {
    run.tasks[existingIndex] = {
      ...run.tasks[existingIndex],
      ...attempt,
    };
  } else {
    run.tasks.push(attempt);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
