export type ExtractionConfidence = "high" | "medium" | "low";

export type ResultDecision = "accepted" | "rejected" | "partial" | "review-required" | "follow-up";

export type RunStatus = "running" | "completed" | "blocked" | "errored" | "closed";

export interface ValidationRecord {
  name: string;
  outcome: "passed" | "failed" | "skipped";
  notes: string;
}

export interface ChildResult {
  schema_version?: number;
  run_id?: string;
  task_id?: string;
  attempt_id?: string;
  variant_id?: string;
  status?: RunStatus | string;
  decision?: ResultDecision | string;
  score?: string | number | null;
  changed_files?: unknown[];
  validation?: ValidationRecord[];
  evidence?: string;
  risks?: unknown[];
  next_action?: string;
  thread_id?: string;
}

export interface TaskAttempt {
  task_id: string;
  attempt_id: string;
  variant_id: string;
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
  extraction_source: string;
  extraction_confidence: ExtractionConfidence;
  extraction_missing_fields: string[];
  extraction_degraded: boolean;
}
