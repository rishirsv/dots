export type CaseTypeCode = "R" | "F" | "G";

export type CaseType =
  | "regression"
  | "failure_mode"
  | "gate";

export type LegacyEvalSide = "candidate" | "release";
export type EvalRunSourceKind = "working_payload" | "snapshot_payload" | "no_skill";
export type SkillActivation = "forced" | "none" | "discoverable";

export interface EvalRunSource {
  kind: EvalRunSourceKind | string;
  label: string;
  skill_root?: string | null;
  skill_activation: SkillActivation;
}

export interface TokenUsage {
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  cached_input_tokens?: number | null;
  reasoning_tokens?: number | null;
  model_context_window?: number | null;
  unavailable_reason: string | null;
}

export type TokenUsageEvidence = TokenUsage;

export interface RunTokenUsageSummary {
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  case_count: number;
  unavailable_case_count: number;
}

export interface EvalManifest {
  schema_version: 1;
  skill_name: string;
  suite: {
    name: string;
    description?: string;
  };
  cases: {
    path: "cases";
  };
  defaults: {
    runner: "app_server";
    run_source: EvalRunSourceKind;
    timeout_ms: number;
  };
}

export interface CaseFixture {
  path: string;
  description?: string;
}

export interface CaseMetadata {
  title: string;
  topics?: string[];
  capability?: string;
  fixtures?: CaseFixture[];
  metadata?: Record<string, unknown>;
}

export interface CaseCriteria {
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

export interface CaseRecord {
  folder: string;
  id: string;
  path: string;
  type: CaseType;
  metadata: CaseMetadata;
  criteria: CaseCriteria;
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
  case_id?: string;
  /** Read-only compatibility for old run evidence written before eval subjects replaced sides. */
  side?: LegacyEvalSide;
  created_at: string;
  source: string;
  payload: Record<string, unknown>;
}

export interface RunReportAttempt {
  run_source: EvalRunSource;
  execution_status: string;
  verdict?: "passed" | "failed";
  evidence_path: string;
  final_path?: string;
  final_preview?: string;
  token_usage?: TokenUsage;
  failure_classification?: string | null;
  error?: string;
  raw?: Record<string, unknown>;
  /** Read-only compatibility marker for old case/<side>/ evidence. */
  legacy_side?: LegacyEvalSide;
}

export interface RunReportCase {
  id: string;
  folder: string;
  title?: string;
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
  attempts: RunReportAttempt[];
  status: string;
  execution_status: string;
  verdict?: "passed" | "failed";
  no_verdict_recorded: boolean;
}

export interface RunReadiness {
  status: "ready" | "blocked" | "unknown";
  summary: string;
  blockers: string[];
  no_verdict_count: number;
  basis: string;
}

export interface RunReport {
  schema_version: 2;
  generated_at: string;
  run: Record<string, unknown>;
  summary: {
    run_id: string;
    label?: string | null;
    status: string;
    created_at?: string;
    completed_at?: string;
    case_count: number;
    attempt_count: number;
    result_count: number;
    run_source: EvalRunSource;
    failure_classifications: string[];
    execution_status: "completed" | "failed" | "running" | "unknown";
    assessment_status?: "passed" | "failed";
    no_verdict_count: number;
    evidence_counts: {
      tests: number;
      judges: number;
      feedback: number;
    };
    token_usage: RunTokenUsageSummary;
  };
  cases: RunReportCase[];
  tests: EventEnvelope[];
  judges: EventEnvelope[];
  feedback: EventEnvelope[];
  readiness: RunReadiness;
}

export interface RunIndexRow {
  run_id: string;
  label?: string | null;
  status: string;
  created_at?: string;
  completed_at?: string;
  case_count: number;
  run_source: EvalRunSource;
  failure_classifications: string[];
  execution_status: string;
  assessment_status?: string;
  no_verdict_count: number;
  readiness_status: string;
}

export interface RunIndex {
  schema_version: 1;
  updated_at: string;
  runs: RunIndexRow[];
}
