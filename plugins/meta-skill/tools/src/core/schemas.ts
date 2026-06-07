export type RunStatus = "running" | "completed" | "blocked" | "errored" | "closed" | "missing-result";

export interface ChildResult {
  schema_version?: number;
  run_id?: string;
  task_id?: string;
  attempt_id?: string;
  thread_id?: string;
  status?: RunStatus | string;
  summary?: string;
}

export interface TaskAttempt {
  task_id: string;
  attempt_id: string;
  thread_id: string;
  status: string;
}

export interface RunFile {
  schema_version: number;
  run_id: string;
  status: RunStatus | string;
  tasks: TaskAttempt[];
  [key: string]: unknown;
}

export interface ResultRow extends ChildResult {
  schema_version: number;
  run_id: string;
  task_id: string;
  attempt_id: string;
  thread_id: string;
  status: string;
  summary: string;
  extraction_source: string;
  extraction_degraded: boolean;
}
