export type ScenarioFamilyCode = "R" | "F" | "T" | "G";

export type ScenarioFamily =
  | "regression"
  | "failure_mode"
  | "trigger"
  | "gate";

export type ScenarioType = "behavior" | "trigger" | "artifact" | "gate";

export type TokenMetric =
  | { available: true; value: number }
  | { available: false; reason: string };

export interface TokenUsage {
  input_tokens: TokenMetric;
  output_tokens: TokenMetric;
  total_tokens: TokenMetric;
}

export interface EvalManifest {
  schema_version: 1;
  skill_name: string;
  suite: {
    name: string;
    description?: string;
  };
  scenarios: {
    path: string;
  };
  defaults: {
    runner: "app_server";
    compare: "none" | "release";
    timeout_ms: number;
  };
}

export interface ScenarioMetadata {
  schema_version: 1;
  id: string;
  family: ScenarioFamily;
  type: ScenarioType;
  title: string;
  topics?: string[];
  include?: string[];
  setup?: string[];
  metadata?: Record<string, unknown>;
}

export interface ScenarioCriteria {
  schema_version: 1;
  what_it_tests?: string;
  expected_behavior: string;
  assertions: string[];
  tests?: string[];
  judges?: Array<{
    id: string;
    threshold?: {
      overall_min?: number;
      dimensions?: Record<string, number>;
    };
  }>;
  rubric?: string;
}

export interface ScenarioRecord {
  folder: string;
  id: string;
  path: string;
  metadata: ScenarioMetadata;
  criteria: ScenarioCriteria;
  task: string;
  turns: Array<{ content: string }>;
}

export interface TestManifest {
  schema_version: 1;
  tests: Array<{
    id: string;
    kind: "unit" | "eval";
    command: string;
    grader?: string;
    description?: string;
  }>;
}

export interface Issue {
  severity: "failure" | "warning";
  message: string;
  path?: string;
}

export interface LintReport {
  ok: boolean;
  failures: Issue[];
  warnings: Issue[];
  tests: Array<{
    id: string;
    kind: "unit" | "eval";
    status: "passed" | "failed" | "skipped";
    command?: string;
    output?: string;
  }>;
  annotations?: number;
}

export interface EventEnvelope {
  schema_version: 1;
  type: string;
  run_id?: string;
  scenario_id?: string;
  side?: "candidate" | "release";
  created_at: string;
  source: string;
  payload: Record<string, unknown>;
}
