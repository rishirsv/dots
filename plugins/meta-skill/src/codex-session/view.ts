import path from "node:path";
import { exists, readJson, readText } from "../project.ts";
import type { ChildResult } from "./child-result.ts";

interface RunFile {
  run_id?: string;
  parent_thread_id?: string | null;
  isolation_backend?: string | null;
  attempts?: unknown[];
}

interface RunAttempt {
  attempt_id?: string;
  eval_id?: string | null;
  thread_id?: string | null;
  evidence_path?: string;
  parent_decision?: string;
  child_status?: string | null;
  child_decision_recommendation?: string | null;
}

export async function renderCodexRunView(project: string, runId: string): Promise<string> {
  const projectRoot = path.resolve(project);
  const runRoot = path.join(projectRoot, ".meta-skill", "runs", runId);
  const run = await readJson<RunFile>(path.join(runRoot, "run.json"));
  const attempts = Array.isArray(run.attempts) ? run.attempts.map((attempt) => objectValue(attempt) as RunAttempt) : [];
  const sections = [];

  sections.push(`# Meta Skill Codex Run: ${run.run_id || runId}`);
  sections.push(`- Parent thread: ${run.parent_thread_id || "(not recorded)"}`);
  sections.push(`- Isolation: ${run.isolation_backend || "(mixed or unknown)"}`);
  sections.push(`- Attempts: ${attempts.length}`);

  for (const attempt of attempts) {
    const evidencePath = attempt.evidence_path || `attempts/${attempt.attempt_id || "unknown"}`;
    const attemptRoot = path.join(runRoot, evidencePath);
    const childResult = await readChildResult(attemptRoot);
    const changedFiles = childResult?.changed_files || await readChangedFiles(attemptRoot);
    const validation = childResult?.validation || [];
    const risks = childResult?.risks || [];
    const nextAction = childResult?.recommended_next_action || "(not recorded)";
    sections.push(`## Attempt: ${attempt.attempt_id || "(unknown)"}`);
    sections.push(`- Eval: ${attempt.eval_id || "(not recorded)"}`);
    sections.push(`- Child thread: ${attempt.thread_id || "(not recorded)"}`);
    sections.push(`- Status: ${childResult?.status || attempt.child_status || "(not recorded)"}`);
    sections.push(`- Decision recommendation: ${childResult?.decision_recommendation || attempt.child_decision_recommendation || attempt.parent_decision || "review-required"}`);
    sections.push(`- Evidence path: ${path.join(runRoot, evidencePath)}`);
    sections.push(`- Recommended next action: ${nextAction}`);
    sections.push("### Changed Files");
    sections.push(changedFiles.length ? changedFiles.map((file) => `- ${file}`).join("\n") : "- none recorded");
    sections.push("### Validation");
    sections.push(validation.length ? validation.map((item) => `- ${item.outcome}: \`${item.command}\` - ${item.notes}`).join("\n") : "- none recorded");
    sections.push("### Risks");
    sections.push(risks.length ? risks.map((risk) => `- ${risk}`).join("\n") : "- none recorded");
  }

  return `${sections.join("\n\n")}\n`;
}

async function readChildResult(attemptRoot: string): Promise<ChildResult | null> {
  const target = path.join(attemptRoot, "child-result.json");
  return (await exists(target)) ? readJson<ChildResult>(target) : null;
}

async function readChangedFiles(attemptRoot: string): Promise<string[]> {
  const target = path.join(attemptRoot, "worktree.json");
  if (!(await exists(target))) return [];
  const worktree = objectValue(await readJson(target));
  const changedPaths = worktree.changed_paths;
  if (Array.isArray(changedPaths)) return changedPaths.filter((item): item is string => typeof item === "string");
  const statusPath = path.join(attemptRoot, "git-status.txt");
  if (!(await exists(statusPath))) return [];
  return (await readText(statusPath)).split(/\n/).map((line) => line.slice(3).trim()).filter(Boolean);
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
