import { CliError } from "../project.ts";

export type ChildStatus = "completed" | "errored" | "blocked";
export type ChildDecisionRecommendation = "accepted" | "rejected" | "partial" | "review-required" | "follow-up";
export type ValidationOutcome = "passed" | "failed" | "skipped";

export interface ChildValidation {
  command: string;
  outcome: ValidationOutcome;
  notes: string;
}

export interface ChildResult {
  run_id: string;
  attempt_id: string;
  status: ChildStatus;
  decision_recommendation: ChildDecisionRecommendation;
  changed_files: string[];
  validation: ChildValidation[];
  evidence_paths: string[];
  risks: string[];
  recommended_next_action: string;
}

export interface ParsedChildResult {
  result: ChildResult;
  rawBlock: string;
}

const STATUS_VALUES = ["completed", "errored", "blocked"] as const;
const DECISION_VALUES = ["accepted", "rejected", "partial", "review-required", "follow-up"] as const;
const OUTCOME_VALUES = ["passed", "failed", "skipped"] as const;

export function parseChildResultBlock(text: string): ParsedChildResult | null {
  const objectText = findChildResultJsonObject(text);
  if (!objectText) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(objectText);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new CliError(`invalid meta_skill_child_result JSON (${detail})`);
  }

  const container = objectValue(parsed);
  const result = normalizeChildResult(container.meta_skill_child_result);
  return { result, rawBlock: objectText };
}

export function renderChildResultSummary(result: ChildResult): string {
  const validation = result.validation.length
    ? result.validation.map((item) => `- ${item.outcome}: \`${item.command}\` - ${item.notes}`).join("\n")
    : "- none recorded";
  const changedFiles = result.changed_files.length ? result.changed_files.map((file) => `- ${file}`).join("\n") : "- none";
  const evidencePaths = result.evidence_paths.length ? result.evidence_paths.map((item) => `- ${item}`).join("\n") : "- none recorded";
  const risks = result.risks.length ? result.risks.map((risk) => `- ${risk}`).join("\n") : "- none recorded";

  return `# Child Result

- Run: ${result.run_id}
- Attempt: ${result.attempt_id}
- Status: ${result.status}
- Decision recommendation: ${result.decision_recommendation}
- Recommended next action: ${result.recommended_next_action}

## Changed Files

${changedFiles}

## Validation

${validation}

## Evidence Paths

${evidencePaths}

## Risks

${risks}
`;
}

function normalizeChildResult(value: unknown): ChildResult {
  const source = objectValue(value);
  if (!Object.keys(source).length) throw new CliError("meta_skill_child_result block is missing");
  return {
    run_id: requiredString(source.run_id, "run_id"),
    attempt_id: requiredString(source.attempt_id, "attempt_id"),
    status: enumValue(source.status, STATUS_VALUES, "status"),
    decision_recommendation: enumValue(source.decision_recommendation, DECISION_VALUES, "decision_recommendation"),
    changed_files: stringArray(source.changed_files, "changed_files"),
    validation: validationArray(source.validation),
    evidence_paths: stringArray(source.evidence_paths, "evidence_paths"),
    risks: stringArray(source.risks, "risks"),
    recommended_next_action: requiredString(source.recommended_next_action, "recommended_next_action")
  };
}

function validationArray(value: unknown): ChildValidation[] {
  if (!Array.isArray(value)) throw new CliError("meta_skill_child_result.validation must be an array");
  return value.map((item, index) => {
    const source = objectValue(item);
    return {
      command: requiredString(source.command, `validation[${index}].command`),
      outcome: enumValue(source.outcome, OUTCOME_VALUES, `validation[${index}].outcome`),
      notes: requiredString(source.notes, `validation[${index}].notes`)
    };
  });
}

function findChildResultJsonObject(text: string): string | null {
  const marker = '"meta_skill_child_result"';
  let markerIndex = text.indexOf(marker);
  if (markerIndex === -1) markerIndex = text.indexOf("'meta_skill_child_result'");
  if (markerIndex === -1) return null;

  const start = text.lastIndexOf("{", markerIndex);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]!;
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }
  return null;
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new CliError(`meta_skill_child_result.${label} must be an array`);
  return value.map((item, index) => requiredString(item, `${label}[${index}]`));
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new CliError(`meta_skill_child_result.${label} must be a non-empty string`);
  return value;
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) return value as T;
  throw new CliError(`meta_skill_child_result.${label} must be one of: ${allowed.join(", ")}`);
}
