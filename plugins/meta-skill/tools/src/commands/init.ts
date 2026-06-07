import fs from "node:fs/promises";
import { getRunDirs } from "../core/paths.js";

export async function commandInit(cwd: string): Promise<{ created: string[]; existing: string[] }> {
  const wanted = getRunDirs(cwd);
  const existed = await existingDirState(wanted);
  const created: string[] = [];
  const existing: string[] = [];

  for (const dir of wanted) {
    if (existed[dir]) {
      existing.push(dir);
      continue;
    }
    await fs.mkdir(dir, { recursive: true });
    created.push(dir);
  }

  return { created, existing };
}

async function existingDirState(paths: string[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  await Promise.all(
    paths.map(async (target) => {
      result[target] = await directoryExists(target);
    }),
  );
  return result;
}

async function directoryExists(target: string): Promise<boolean> {
  try {
    const stat = await fs.stat(target);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
