import path from "node:path";
import type { CaseCriteria, CaseMetadata, CaseRecord } from "../models.ts";
import { parseCaseFrontmatter } from "../metadata.ts";
import { CliError, createWorkbench, exists, projectPaths, readText, requirePortableSkill } from "../project.ts";
import { caseIdentity, listCaseFolders } from "./discovery.ts";
import type { EvalSelector } from "./types.ts";

export { caseIdentity } from "./discovery.ts";

export async function initEvals(project: string): Promise<{ path: string; warnings: string[] }> {
  const root = await requirePortableSkill(project);
  await createWorkbench(root);
  const warnings: string[] = [];
  const p = projectPaths(root);
  const cases = await listCaseFolders(p.cases);
  if (!cases.length) warnings.push("No cases exist yet. Add .meta-skill/cases/<ID-slug>/case.md.");
  return { path: p.cases, warnings };
}

export async function loadCases(project: string, selector: EvalSelector = {}): Promise<CaseRecord[]> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  if (!(await exists(p.cases))) return [];
  const records: CaseRecord[] = [];
  for (const folder of await listCaseFolders(p.cases)) {
    records.push(await readCase(path.join(p.cases, folder), folder));
  }

  const selected = selectCases(records, selector);
  if (selector.case?.length && !selected.length) throw new CliError("no cases selected");
  return selected;
}

export async function readCase(casePath: string, folder = path.basename(casePath)): Promise<CaseRecord> {
  const { id, type } = caseIdentity(folder);
  const parsed = parseCaseMarkdown(await readText(path.join(casePath, "case.md")), path.join(casePath, "case.md"));
  return { folder, id, type, path: casePath, ...parsed };
}

function selectCases(records: CaseRecord[], selector: EvalSelector): CaseRecord[] {
  const wantedCases = selector.case?.length ? new Set(selector.case) : undefined;
  const wantedTopics = selector.topic?.length ? new Set(selector.topic) : undefined;
  return records.filter((item) => {
    if (wantedCases) {
      if (!wantedCases.has(item.id) && !wantedCases.has(item.folder)) return false;
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

function parseCaseMarkdown(text: string, filePath: string): { metadata: CaseMetadata; criteria: CaseCriteria; task: string; turns: Array<{ content: string }> } {
  const { metadata, criteria, body } = parseCaseFrontmatter(text, filePath);
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
  if (!task?.content) throw new CliError(`${filePath}: case.md must include ## Task with task text`);
  const turns = sections
    .filter((section) => /^Turn\s+\d+$/.test(section.heading))
    .sort((a, b) => Number(a.heading.replace(/\D+/g, "")) - Number(b.heading.replace(/\D+/g, "")))
    .map((section) => ({ content: section.content }));
  if (sections.some((section) => section.heading !== "Task" && !/^Turn\s+\d+$/.test(section.heading))) {
    throw new CliError(`${filePath}: case.md supports only ## Task and ## Turn N headings`);
  }
  return { task: task.content, turns };
}
