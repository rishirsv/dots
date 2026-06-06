import path from "node:path";
import type { EvalCriteria, EvalMetadata, EvalRecord } from "../models.ts";
import { parseEvalFrontmatter } from "../metadata.ts";
import { CliError, createWorkbench, exists, projectPaths, readText, requirePortableSkill } from "../project.ts";
import { evalIdentity, listEvalFolders } from "./discovery.ts";
import type { EvalSelector } from "./types.ts";

export { evalIdentity } from "./discovery.ts";

export async function initEvals(project: string): Promise<{ path: string; warnings: string[] }> {
  const root = await requirePortableSkill(project);
  await createWorkbench(root);
  const warnings: string[] = [];
  const p = projectPaths(root);
  const evals = await listEvalFolders(p.evals);
  if (!evals.length) warnings.push("No evals exist yet. Add .meta-skill/evals/<ID-slug>/eval.md.");
  return { path: p.evals, warnings };
}

export async function loadEvals(project: string, selector: EvalSelector = {}): Promise<EvalRecord[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.evals))) return [];
  const records: EvalRecord[] = [];
  for (const folder of await listEvalFolders(p.evals)) {
    records.push(await readEval(path.join(p.evals, folder), folder));
  }

  const selected = selectEvals(records, selector);
  if (selector.eval?.length && !selected.length) throw new CliError("no evals selected");
  return selected;
}

export async function readEval(evalPath: string, folder = path.basename(evalPath)): Promise<EvalRecord> {
  const { id, type } = evalIdentity(folder);
  const parsed = parseEvalMarkdown(await readText(path.join(evalPath, "eval.md")), path.join(evalPath, "eval.md"));
  return { folder, id, type, path: evalPath, ...parsed };
}

function selectEvals(records: EvalRecord[], selector: EvalSelector): EvalRecord[] {
  const wantedEvals = selector.eval?.length ? new Set(selector.eval) : undefined;
  const wantedTopics = selector.topic?.length ? new Set(selector.topic) : undefined;
  return records.filter((item) => {
    if (wantedEvals) {
      if (!wantedEvals.has(item.id) && !wantedEvals.has(item.folder)) return false;
    }
    if (selector.type) {
      const prefix = item.id.charAt(0);
      if (prefix !== selector.type) return false;
    }
    if (wantedTopics) {
      if (!(item.metadata.topics || []).some((topic) => wantedTopics.has(topic))) return false;
    }
    return true;
  });
}

function parseEvalMarkdown(text: string, filePath: string): { metadata: EvalMetadata; criteria: EvalCriteria; task: string; turns: Array<{ content: string }> } {
  const { metadata, criteria, body } = parseEvalFrontmatter(text, filePath);
  return {
    metadata,
    criteria,
    ...parseTurns(body, filePath)
  };
}

function parseTurns(body: string, filePath: string): { task: string; turns: Array<{ content: string }> } {
  const matches = [...body.matchAll(/^##\s+(.+?)\s*$/gm)];
  const sections = matches.map((match, index) => {
    const start = (match.index || 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index || body.length : body.length;
    return { heading: match[1].trim(), content: body.slice(start, end).trim() };
  });
  const task = sections.find((section) => section.heading === "Task");
  if (!task?.content) throw new CliError(`${filePath}: eval.md must include ## Task with task text`);
  const turns = sections
    .filter((section) => /^Turn\s+\d+$/.test(section.heading))
    .sort((a, b) => Number(a.heading.replace(/\D+/g, "")) - Number(b.heading.replace(/\D+/g, "")))
    .map((section) => ({ content: section.content }));
  if (sections.some((section) => section.heading !== "Task" && !/^Turn\s+\d+$/.test(section.heading))) {
    throw new CliError(`${filePath}: eval.md supports only ## Task and ## Turn N headings`);
  }
  return { task: task.content, turns };
}
