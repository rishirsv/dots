import path from "node:path";

const META_SKILL_DIR = ".meta-skill";
const DEFAULT_RUN_DIR = "runs";

export function getMetaSkillDir(cwd: string): string {
  return path.join(cwd, META_SKILL_DIR);
}

export function getRunPath(cwd: string, runId: string): string {
  return path.join(getMetaSkillDir(cwd), DEFAULT_RUN_DIR, runId);
}

export function getRunJsonPath(cwd: string, runId: string): string {
  return path.join(getRunPath(cwd, runId), "run.json");
}

export function getRunResultsPath(cwd: string, runId: string): string {
  return path.join(getRunPath(cwd, runId), "results.jsonl");
}

export function getReportPath(cwd: string, runId: string): string {
  return path.join(getRunPath(cwd, runId), "report.md");
}

export function getRunDirs(cwd: string): string[] {
  const root = getMetaSkillDir(cwd);
  return [
    root,
    path.join(root, "evals"),
    path.join(root, DEFAULT_RUN_DIR),
    path.join(root, "tests"),
  ];
}
