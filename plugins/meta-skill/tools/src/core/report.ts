import fs from "node:fs/promises";
import { getReportPath, getRunResultsPath } from "./paths.js";
import { ResultRow, RunFile } from "./schemas.js";
import { readJsonOrJsonlFile } from "./jsonl.js";

interface Counts {
  status: Record<string, number>;
  decision: Record<string, number>;
  variant: Record<string, number>;
}

export async function writeRunReport(cwd: string, run: RunFile): Promise<string> {
  const resultsPath = getRunResultsPath(cwd, run.run_id);
  const rows = (await readJsonOrJsonlFile(resultsPath).catch(() => [])) as ResultRow[];
  const counts = aggregateCounts(rows);

  const reportPath = getReportPath(cwd, run.run_id);
  const lines: string[] = [];
  lines.push(`# Meta Skill Run Report`);
  lines.push(``);
  lines.push(`- Run ID: \`${run.run_id}\``);
  lines.push(`- Run status: \`${run.status}\``);
  lines.push(`- Task attempts: ${rows.length}`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push("### Counts by status");
  lines.push(renderCounts(counts.status));
  lines.push("");
  lines.push("### Counts by decision");
  lines.push(renderCounts(counts.decision));
  lines.push("");
  lines.push("### Counts by variant");
  lines.push(renderCounts(counts.variant));
  lines.push(`- Degraded extraction rows: ${rows.filter((row) => row.extraction_degraded).length}`);
  lines.push("");
  lines.push("## Attempts");
  lines.push("| task_id | attempt_id | variant_id | thread_id | status | decision | score | degraded |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    const score = row.score === null || row.score === undefined ? "" : String(row.score);
    const status = row.status ?? "completed";
    const decision = row.decision ?? "review-required";
    lines.push(
      `| ${row.task_id} | ${row.attempt_id} | ${row.variant_id || "current"} | ${row.thread_id || ""} | ${status} | ${decision} | ${score} | ${row.extraction_degraded ? "yes" : "no"} |`,
    );
  }

  lines.push("");
  lines.push("## Next actions");
  const nextActions = rows
    .map((row) => row.next_action)
    .filter((value): value is string => Boolean(value && value.trim()));
  if (nextActions.length === 0) {
    lines.push("_No actions yet._");
  } else {
    nextActions.forEach((action, index) => lines.push(`- ${index + 1}. ${action}`));
  }

  lines.push("");
  lines.push("## Risks");
  const risks = rows.flatMap((row) => (Array.isArray(row.risks) ? row.risks.map(String) : []));
  if (risks.length === 0) {
    lines.push("_No reported risks._");
  } else {
    risks.forEach((risk, index) => lines.push(`- ${index + 1}. ${risk}`));
  }

  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
  return reportPath;
}

function aggregateCounts(rows: ResultRow[]): Counts {
  const counts: Counts = { status: {}, decision: {}, variant: {} };
  for (const row of rows) {
    const status = row.status ?? "completed";
    const decision = row.decision ?? "review-required";
    const variant = row.variant_id || "current";

    counts.status[status] = (counts.status[status] || 0) + 1;
    counts.decision[decision] = (counts.decision[decision] || 0) + 1;
    counts.variant[variant] = (counts.variant[variant] || 0) + 1;
  }
  return counts;
}

function renderCounts(input: Record<string, number>): string {
  const keys = Object.keys(input).sort();
  if (keys.length === 0) {
    return "_No rows yet._";
  }
  return keys.map((key) => `- ${key}: ${input[key]}`).join("\n");
}
