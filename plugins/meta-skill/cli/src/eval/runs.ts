import { promises as fs } from "node:fs";
import path from "node:path";
import type { EventEnvelope, RunIndex, RunIndexRow, RunReport } from "../models";
import { CliError, appendJsonl, eventEnvelope, exists, projectPaths, readJson, readText, requirePortableSkill } from "../project";
import { updateRunsIndex, writeEvalReport } from "../report";

export async function importFeedback(project: string, runId: string, feedbackFile: string): Promise<{ rows: number; report: string }> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const runRoot = path.join(p.runs, runId);
  if (!(await exists(runRoot))) throw new CliError(`run does not exist: ${runId}`);
  const input = await readText(path.resolve(feedbackFile));
  let rows = 0;
  for (const line of input.split(/\r?\n/).filter(Boolean)) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(line) as Record<string, unknown>;
    } catch {
      throw new CliError(`invalid feedback JSONL row: ${line.slice(0, 120)}`);
    }
    const envelope: EventEnvelope =
      parsed.schema_version === 1 && typeof parsed.type === "string"
        ? (parsed as unknown as EventEnvelope)
        : eventEnvelope({ type: "human_feedback", run_id: runId, source: String(parsed.source || "feedback-import"), payload: parsed });
    await appendJsonl(path.join(runRoot, "feedback.jsonl"), envelope);
    rows += 1;
  }
  const refreshed = await refreshRunEvidence(root, runId);
  return { rows, report: refreshed.report };
}

export async function listRuns(project: string): Promise<string[]> {
  const rows = await listRunSummaries(project);
  return rows.map((row) => row.run_id);
}

export async function listRunSummaries(project: string, options: { limit?: number; status?: string } = {}): Promise<RunIndexRow[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.runs))) return [];
  const index = await ensureRunsIndex(p.runs);
  let rows = [...index.runs].sort((a, b) => String(a.run_id).localeCompare(String(b.run_id)));
  if (options.status) rows = rows.filter((row) => row.status === options.status || row.assessment_status === options.status || row.readiness_status === options.status);
  if (options.limit !== undefined) rows = rows.slice(Math.max(0, rows.length - options.limit));
  return rows;
}

export async function openRun(project: string, runId?: string): Promise<{ report: string; reportJson: string; runId: string; data: RunReport }> {
  const runs = await listRunSummaries(project);
  const selected = runId || runs[runs.length - 1]?.run_id;
  if (!selected) throw new CliError("no eval runs found; run `meta-skill eval run <project>` first");
  const root = await requirePortableSkill(project);
  return refreshRunEvidence(root, selected);
}

export async function refreshRunEvidence(project: string, runId: string): Promise<{ report: string; reportJson: string; runId: string; data: RunReport }> {
  const root = await requirePortableSkill(project);
  const runRoot = path.join(projectPaths(root).runs, runId);
  if (!(await exists(runRoot))) throw new CliError(`run does not exist: ${runId}`);
  if (!(await exists(path.join(runRoot, "run.json")))) throw new CliError(`run is missing run.json: ${runId}`);
  const report = await writeEvalReport(runRoot);
  const reportJson = path.join(runRoot, "report.json");
  const data = await readJson<RunReport>(reportJson);
  return { report, reportJson, runId, data };
}

async function ensureRunsIndex(runsRoot: string): Promise<RunIndex> {
  const indexPath = path.join(runsRoot, "index.json");
  if (await exists(indexPath)) return readJson<RunIndex>(indexPath);
  if (!(await exists(runsRoot))) return { schema_version: 1, updated_at: new Date(0).toISOString(), runs: [] };
  const dirs = (await fs.readdir(runsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  for (const dir of dirs) {
    const runRoot = path.join(runsRoot, dir.name);
    if ((await exists(path.join(runRoot, "run.json"))) && !(await exists(path.join(runRoot, "report.json")))) {
      await writeEvalReport(runRoot);
    }
  }
  return updateRunsIndex(runsRoot);
}
