export interface SkillSummary {
  id: string;
  name: string;
  description: string;
  path: string;
  suite_ready: boolean;
  suite_error?: string | null;
  eval_count: number;
  run_count: number;
}

export interface RunSummary {
  run_id: string;
  created_at?: string;
  objective?: string;
  candidates?: Array<string | { candidate: string; display?: string }>;
  needs_review?: boolean;
  pending_human_review?: number;
  lifecycle?: Record<string, unknown>;
  plan?: Record<string, number>;
  totals?: Record<string, number>;
  runtime_status_totals?: Record<string, number>;
  delta_totals?: Record<string, number>;
  review?: { reviewed?: number; total?: number };
}

export interface Artifact {
  path: string;
  mime: string;
  bytes: number;
  preview_kind?: "image" | "text" | null;
  preview?: string;
  accessible_text?: string;
  render_error?: string;
  rendered_previews?: Array<{
    url: string;
    generated_by: "harness";
    index?: number;
    label?: string;
    width?: number;
    height?: number;
    environment?: Record<string, string>;
  }>;
}

export interface Grade {
  grade_status: string;
  metric?: string;
  rationale?: string;
  grader?: { id?: string; kind?: string };
  checks?: Array<{ name?: string; label?: string; evidence?: string; note?: string }>;
}

export interface Annotation {
  annotation_id?: string;
  artifact: string;
  artifact_path?: string;
  tag: string;
  judge_use?: string;
  note: string;
}

export interface Trial {
  trial_id: string;
  eval_id: string;
  candidate: string;
  repetition: number;
  status: string;
  verdict: string;
  duration_ms?: number | null;
  usage?: { total_tokens?: number | null } | null;
  error?: string | null;
  stop_reason?: string | null;
  failed_checks?: Array<{ name?: string; label?: string; evidence?: string; note?: string }>;
}

export interface TrialPacket {
  run_id: string;
  trial: Trial;
  candidate_display?: string;
  task?: string | null;
  response?: string | null;
  artifacts: Artifact[];
  transcript?: {
    total: number;
    shown: number;
    items: Array<{ method: string; text: string }>;
  };
  expectations: string[];
  grades: Grade[];
  human_grader?: { id: string; metric: string } | null;
  human_grade?: Grade | null;
  human_recorded: boolean;
  review_blind_pending?: boolean;
  annotations: Annotation[];
  review?: { decision?: string; reviewed_at?: string };
}

export interface CasePacket {
  run_id: string;
  eval_id: string;
  task?: string | null;
  expectations: string[];
  trials: TrialPacket[];
}

export interface RunReport extends RunSummary {
  lifecycle?: Record<string, unknown>;
  cases?: Array<{
    eval_id: string;
    versions: Array<{
      candidate: string;
      verdict: string;
      trials: Array<Trial & { annotations?: Annotation[] }>;
    }>;
  }>;
  trials?: Array<Trial & { human_review_pending?: boolean }>;
  comparisons?: Array<{ eval_id: string; delta?: string }>;
  repetitions?: Record<string, number>;
  task_executor?: Record<string, unknown> | null;
  judge_executor?: Record<string, unknown> | null;
  baseline_candidate?: string | null;
  token_usage?: { total_tokens?: number | null };
  duration_ms?: number | null;
  suite_digest?: string;
  planning_error?: string;
}
