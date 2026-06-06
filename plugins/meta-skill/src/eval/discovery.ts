import { promises as fs } from "node:fs";
import path from "node:path";
import type { CaseType } from "../models.ts";
import { CliError, exists } from "../project.ts";

export interface DiscoveredTest {
  id: string;
  kind: "deterministic";
  path: string;
  command: string;
}

const CASE_FOLDER_RE = /^([RFG]\d+)-[a-z0-9][a-z0-9-]*$/;
const TEST_ID_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

export function caseIdentity(folder: string): { id: string; type: CaseType } {
  const match = CASE_FOLDER_RE.exec(folder);
  if (!match) throw new CliError(`case folder must use <ID>-<slug> with R/F/G prefix: ${folder}`);
  const id = match[1];
  const type = id.startsWith("R") ? "regression" : id.startsWith("F") ? "failure_mode" : "gate";
  return { id, type };
}

export function isValidTestId(id: string): boolean {
  return TEST_ID_RE.test(id);
}

export async function listCaseFolders(casesDir: string): Promise<string[]> {
  if (!(await exists(casesDir))) return [];
  return (await fs.readdir(casesDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

export async function listDeterministicTests(root: string, dir: string): Promise<DiscoveredTest[]> {
  if (!(await exists(dir))) return [];
  const files: DiscoveredTest[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    const id = path.basename(entry.name, path.extname(entry.name));
    files.push({ id, kind: "deterministic", path: full, command: path.relative(root, full).split(path.sep).join("/") });
  }
  return files.sort((a, b) => a.id.localeCompare(b.id));
}
