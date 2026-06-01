import type { AppServerScenarioRunner } from "../app-server/runner";

export interface EvalSelector {
  scenario?: string[];
  family?: string;
  topic?: string[];
}

export interface EvalRunOptions {
  project: string;
  selector: EvalSelector;
  label?: string;
  compare?: "release";
  withJudges?: boolean;
  noLint?: boolean;
  appServerEndpoint?: string;
  scenarioRunner?: Pick<AppServerScenarioRunner, "run" | "close">;
  judgeRunner?: (options: JudgeOptions) => Promise<JudgeRunResult>;
}

export interface JudgeOptions {
  project: string;
  runId: string;
  judge?: string;
  allJudges?: boolean;
  scenario?: string;
  allScenarios?: boolean;
}

export type RunFailureClassification =
  | "app_server_unavailable"
  | "harness_unavailable"
  | "judge_failure"
  | "lint_test_failure"
  | "scenario_failed";

export interface JudgeRunResult {
  annotations: number;
  ok: boolean;
  failureClassifications?: RunFailureClassification[];
}
