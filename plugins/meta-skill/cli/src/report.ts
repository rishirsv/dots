import { promises as fs } from "node:fs";
import path from "node:path";
import { exists, writeText } from "./project";

export async function writeEvalReport(runRoot: string): Promise<string> {
  const runJson = JSON.parse(await fs.readFile(path.join(runRoot, "run.json"), "utf8"));
  const resultsPath = path.join(runRoot, "results.jsonl");
  const rows = (await exists(resultsPath))
    ? (await fs.readFile(resultsPath, "utf8"))
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    : [];
  const scenarioRows = rows.filter((row) => row.type === "scenario_result");
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
  </style>
</head>
<body>
  <h1>Meta Skill Eval ${escapeHtml(runJson.run_id)}</h1>
  <p><strong>Label:</strong> ${escapeHtml(runJson.label || "")}</p>
  <p><strong>Runner:</strong> ${escapeHtml(runJson.runner?.backend || "")} (${escapeHtml(runJson.runner?.app_server?.mode || "")})</p>
  <table>
    <thead><tr><th>Scenario</th><th>Side</th><th>Status</th><th>Token Usage</th><th>Evidence</th></tr></thead>
    <tbody>
      ${scenarioRows
        .map((row) => {
          const payload = row.payload || {};
          return `<tr><td>${escapeHtml(row.scenario_id || "")}</td><td>${escapeHtml(row.side || "")}</td><td>${escapeHtml(payload.status || "")}</td><td><code>${escapeHtml(JSON.stringify(payload.token_usage || {}))}</code></td><td>${escapeHtml(payload.evidence_path || "")}</td></tr>`;
        })
        .join("\n")}
    </tbody>
  </table>
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
