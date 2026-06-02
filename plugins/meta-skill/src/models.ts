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

export type EvalSide = "candidate" | "release";

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
  evidence_basis?: "run_snapshot" | "legacy_current_project";
  snapshot_path?: string;
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
  side?: EvalSide;
  created_at: string;
  source: string;
  payload: Record<string, unknown>;
}

export interface RunReportSide {
  side: EvalSide;
  status: string;
  evidence_path: string;
  final_path?: string;
  final_preview?: string;
  token_usage?: unknown;
  failure_classification?: string | null;
  error?: string;
  raw?: Record<string, unknown>;
}

export interface RunReportScenario {
  id: string;
  folder: string;
  title?: string;
  family?: string;
  type?: string;
  topics: string[];
  capability?: string | null;
  criteria?: {
    what_it_tests?: string;
    expected_behavior?: string;
    assertions: string[];
    tests: string[];
    judges: string[];
  };
  metadata?: Record<string, unknown>;
  evidence_basis: "run_snapshot" | "legacy_current_project" | "unavailable";
  sides: RunReportSide[];
  status: string;
  unresolved: boolean;
}

export interface RunComparison {
  scenario_id: string;
  scenario_folder: string;
  kind: "release" | "none";
  classification: string;
  candidate_status?: string;
  release_status?: string;
}

export interface RunReadiness {
  status: "ready" | "needs_review" | "blocked";
  summary: string;
  blockers: string[];
  unresolved: number;
  basis: string;
}

export interface RunReport {
  schema_version: 1;
  generated_at: string;
  run: Record<string, unknown>;
  summary: {
    run_id: string;
    label?: string | null;
    status: string;
    created_at?: string;
    completed_at?: string;
    scenario_count: number;
    side_count: number;
    result_count: number;
    comparison_mode: "none" | "release";
    manual_review_required: boolean;
    failure_classifications: string[];
    assessment_status: "passed" | "needs_review" | "failed" | "unknown";
    unresolved_count: number;
    token_usage: {
      available: number;
      unavailable: number;
    };
  };
  scenarios: RunReportScenario[];
  tests: EventEnvelope[];
  judges: EventEnvelope[];
  feedback: EventEnvelope[];
  comparisons: RunComparison[];
  artifacts: Array<{ scenario_id: string; side: EvalSide; path: string; kind: string }>;
  readiness: RunReadiness;
}

export interface RunIndexRow {
  run_id: string;
  label?: string | null;
  status: string;
  created_at?: string;
  completed_at?: string;
  scenario_count: number;
  comparison_mode: "none" | "release";
  manual_review_required: boolean;
  failure_classifications: string[];
  assessment_status: string;
  unresolved_count: number;
  readiness_status: string;
}

export interface RunIndex {
  schema_version: 1;
  updated_at: string;
  runs: RunIndexRow[];
}
