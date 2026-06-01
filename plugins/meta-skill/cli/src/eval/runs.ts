import { promises as fs } from "node:fs";
import path from "node:path";
import type { EventEnvelope } from "../models";
import { CliError, appendJsonl, eventEnvelope, exists, projectPaths, readText, requirePortableSkill } from "../project";

export async function importFeedback(project: string, runId: string, feedbackFile: string): Promise<{ rows: number }> {
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
  return { rows };
}

export async function listRuns(project: string): Promise<string[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.runs))) return [];
  const dirs = (await fs.readdir(p.runs, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  return dirs.sort();
}

export async function openRun(project: string, runId?: string): Promise<{ report: string; runId: string }> {
  const runs = await listRuns(project);
  const selected = runId || runs[runs.length - 1];
  if (!selected) throw new CliError("no eval runs found; run `meta-skill eval run <project>` first");
  const root = await requirePortableSkill(project);
  const report = path.join(projectPaths(root).runs, selected, "report.html");
  if (!(await exists(report))) throw new CliError(`report does not exist: ${report}`);
  return { report, runId: selected };
}
