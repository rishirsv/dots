import fs from "node:fs/promises";

export function parseJsonOrJsonl(text: string): unknown[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [parsed];
  } catch {
    const items: unknown[] = [];
    for (const line of trimmed.split("\n")) {
      const lineText = line.trim();
      if (!lineText) {
        continue;
      }
      try {
        items.push(JSON.parse(lineText));
      } catch (error) {
        throw new Error(`invalid JSON line: ${String(error)}`);
      }
    }
    return items;
  }
}

export async function readJsonOrJsonlFile(filePath: string): Promise<unknown[]> {
  const raw = await fs.readFile(filePath, "utf8");
  return parseJsonOrJsonl(raw);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonl(filePath: string, rows: unknown[], mode: "overwrite" | "append"): Promise<void> {
  const payload = rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
  const writeMode = mode === "append" ? "a" : "w";
  await fs.writeFile(filePath, payload, { encoding: "utf8", flag: writeMode });
}
