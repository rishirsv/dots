export type CaseTypeCode = "R" | "F" | "G";

export type CaseType =
  | "regression"
  | "failure_mode"
  | "gate";

export type EvalRunSourceKind = "working_payload" | "no_skill";
export type SkillActivation = "forced" | "none" | "discoverable";

export interface EvalRunSource {
  kind: EvalRunSourceKind;
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
    kind: "deterministic";
    status: "passed" | "failed" | "skipped";
    command?: string;
    output?: string;
  }>;
}
