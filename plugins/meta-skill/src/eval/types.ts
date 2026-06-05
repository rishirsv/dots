import type { AppServerCaseRunner } from "../app-server/runner.ts";
import type { EvalRunSourceKind } from "../models.ts";

export interface EvalSelector {
  case?: string[];
  type?: string;
  topic?: string[];
}

export interface EvalRunOptions {
  project: string;
  selector: EvalSelector;
  label?: string;
  runSource?: EvalRunSourceKind;
  noLint?: boolean;
  turnTimeoutMs?: number;
  traceBufferEvents?: number;
  caseRunner?: Pick<AppServerCaseRunner, "run" | "close">;
}

export type RunFailureClassification =
  | "app_server_unavailable"
  | "runner_unavailable"
  | "case_error";
