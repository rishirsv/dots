import type { AppServerEvalRunner, EvalRunInput, EvalRunResult } from "../app-server/runner.ts";
import type { EvalRunSourceKind } from "../models.ts";

export interface EvalSelector {
  eval?: string[];
}

export interface EvalRunOptions {
  project: string;
  selector: EvalSelector;
  label?: string;
  runSource?: EvalRunSourceKind;
  noLint?: boolean;
  concurrency?: number;
  turnTimeoutMs?: number;
  traceBufferEvents?: number;
  evalRunner?: EvalRunner;
  evalRunnerFactory?: () => EvalRunner;
}

export type EvalRunner = Pick<AppServerEvalRunner, "close"> & {
  run(input: EvalRunInput): Promise<EvalRunResult>;
};

export type RunFailureClassification =
  | "app_server_unavailable"
  | "runner_unavailable"
  | "eval_error";
