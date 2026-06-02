import { promises as fs } from "node:fs";
import path from "node:path";
import { exists, readText, writeText } from "./project";

export async function writeEvalReport(runRoot: string): Promise<string> {
  const runJson = JSON.parse(await fs.readFile(path.join(runRoot, "run.json"), "utf8"));
  const scenarioRows = (await readJsonl(path.join(runRoot, "results.jsonl"))).filter((row) => row.type === "scenario_result");
  const testRows = (await readJsonl(path.join(runRoot, "tests.jsonl"))).filter((row) => row.type === "test_result" || row.type === "lint_summary" || row.type === "lint_skipped");
  const gradeRows = (await readJsonl(path.join(runRoot, "grades.jsonl"))).filter((row) => row.type === "judge_result");
  const feedbackRows = await readJsonl(path.join(runRoot, "feedback.jsonl"));
  const statusCounts = countBy(scenarioRows, (row) => String(row.payload?.status || "unknown"));
  const failureClassifications = Array.isArray(runJson.failure_classifications) ? runJson.failure_classifications : [];
  const scenarioHtmlRows = await Promise.all(
    scenarioRows.map(async (row) => {
      const payload = row.payload || {};
      const evidencePath = String(payload.evidence_path || "");
      const finalPath = evidencePath ? path.join(runRoot, evidencePath, "final.md") : "";
      const preview = finalPath ? await readFinalPreview(finalPath) : "";
      return `<tr><td>${escapeHtml(row.scenario_id || "")}</td><td>${escapeHtml(row.side || "")}</td><td>${escapeHtml(payload.status || "")}</td><td>${link(`${evidencePath}/final.md`, preview || "final.md")}</td><td><code>${escapeHtml(JSON.stringify(payload.token_usage || {}))}</code></td><td>${link(evidencePath, evidencePath)} ${link(`${evidencePath}/rpc.jsonl`, "rpc")} ${link(`${evidencePath}/turns.jsonl`, "turns")}</td><td>${escapeHtml(payload.failure_classification || payload.error || "")}</td></tr>`;
    })
  );
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Meta Skill Eval ${escapeHtml(runJson.run_id)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; color: #1f2937; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 16px 0; }
    .box { border: 1px solid #d1d5db; padding: 12px; border-radius: 6px; }
    .muted { color: #6b7280; }
    pre { white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px; border-radius: 4px; max-height: 180px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Meta Skill Eval ${escapeHtml(runJson.run_id)}</h1>
  <p><strong>Label:</strong> ${escapeHtml(runJson.label || "")}</p>
  <p><strong>Status:</strong> ${escapeHtml(runJson.status || "")} ${runJson.status === "needs_review" ? "<span class=\"muted\">(unresolved; not pass proof)</span>" : ""}</p>
  <p><strong>Manual review required:</strong> ${runJson.manual_review_required ? "yes" : "no"}</p>
  <p><strong>Failure classifications:</strong> ${escapeHtml(failureClassifications.length ? failureClassifications.join(", ") : "none")}</p>
  <p><strong>Runner:</strong> ${escapeHtml(runJson.runner?.backend || "")} (${escapeHtml(runJson.runner?.app_server?.mode || "")})</p>
  <div class="grid">
    <div class="box"><strong>Scenario Status</strong><br>${formatCounts(statusCounts)}</div>
    <div class="box"><strong>Tests</strong><br>${formatTestSummary(testRows)}</div>
    <div class="box"><strong>Judges</strong><br>${formatJudgeSummary(gradeRows)}</div>
    <div class="box"><strong>Feedback</strong><br>${formatFeedbackSummary(feedbackRows)}</div>
  </div>
  <h2>Scenario Results</h2>
  <table>
    <thead><tr><th>Scenario</th><th>Side</th><th>Status</th><th>Final Answer</th><th>Token Usage</th><th>Evidence</th><th>Failure</th></tr></thead>
    <tbody>
      ${scenarioHtmlRows.join("\n")}
    </tbody>
  </table>
  <h2>Test Details</h2>
  ${renderEventTable(testRows, ["type", "source", "status", "id", "failure_classification"])}
  <h2>Judge Details</h2>
  ${renderEventTable(gradeRows, ["scenario_id", "side", "source", "status", "failure_classification"])}
  <h2>Feedback Details</h2>
  ${renderEventTable(feedbackRows, ["scenario_id", "side", "source", "label"])}
</body>
</html>`;
  const report = path.join(runRoot, "report.html");
  await writeText(report, html);
  return report;
}

export async function writeReviewReport(reviewRoot: string, review: Record<string, unknown>): Promise<string> {
  const dimensions = (review.dimensions || {}) as Record<string, { score: number; critique: string }>;
  const rows = Object.entries(dimensions)
    .map(([name, value]) => `| ${name} | ${value.score} | ${value.critique.replace(/\|/g, "\\|")} |`)
    .join("\n");
  const md = `# Best-Practice Skill Review\n\nScore: ${review.normalized_score}/100\n\n| Dimension | Score | Critique |\n|---|---:|---|\n${rows}\n\n## Suggested Changes\n\n${((review.suggested_changes as string[]) || []).map((item) => `- ${item}`).join("\n") || "- None."}\n`;
  const report = path.join(reviewRoot, "report.md");
  await writeText(report, md);
  return report;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readJsonl(target: string): Promise<Array<Record<string, any>>> {
  if (!(await exists(target))) return [];
  return (await fs.readFile(target, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function countBy(rows: Array<Record<string, any>>, keyFor: (row: Record<string, any>) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = keyFor(row);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts).sort();
  if (!entries.length) return "none";
  return entries.map(([key, value]) => `${escapeHtml(key)}: ${value}`).join("<br>");
}

function formatTestSummary(rows: Array<Record<string, any>>): string {
  const results = rows.filter((row) => row.type === "test_result");
  const skipped = rows.filter((row) => row.type === "lint_skipped").length;
  const counts = countBy(results, (row) => String(row.payload?.status || "unknown"));
  const summary = formatCounts(counts);
  return `${summary}${skipped ? `<br>lint skipped: ${skipped}` : ""}`;
}

function formatJudgeSummary(rows: Array<Record<string, any>>): string {
  return formatCounts(countBy(rows, (row) => String(row.payload?.status || "unknown")));
}

function formatFeedbackSummary(rows: Array<Record<string, any>>): string {
  return formatCounts(countBy(rows, (row) => String(row.payload?.label || row.payload?.status || "unlabeled")));
}

async function readFinalPreview(finalPath: string): Promise<string> {
  if (!(await exists(finalPath))) return "";
  const text = (await readText(finalPath)).trim().replace(/\s+/g, " ");
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function link(relative: string, label: string): string {
  if (!relative) return "";
  return `<a href="${escapeHtml(relative.split(path.sep).join("/"))}">${escapeHtml(label)}</a>`;
}

function renderEventTable(rows: Array<Record<string, any>>, columns: string[]): string {
  if (!rows.length) return '<p class="muted">No rows recorded.</p>';
  return `<table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}<th>Summary</th></tr></thead><tbody>${rows
    .map((row) => {
      const payload = row.payload || {};
      return `<tr>${columns
        .map((column) => `<td>${escapeHtml(row[column] ?? payload[column] ?? "")}</td>`)
        .join("")}<td><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre></td></tr>`;
    })
    .join("\n")}</tbody></table>`;
}
