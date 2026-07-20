import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const committed = resolve(root, "../src/meta_skill/workbench_server/static");
const temporary = await mkdtemp(join(tmpdir(), "metaskill-workbench-build-"));

async function inventory(folder) {
  const rows = [];
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await visit(path);
      else rows.push({
        path: relative(folder, path),
        digest: createHash("sha256").update(await readFile(path)).digest("hex"),
      });
    }
  }
  await visit(folder);
  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

try {
  const result = spawnSync(
    resolve(root, "node_modules/.bin/vite"),
    ["build", "--outDir", temporary, "--emptyOutDir"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    process.exit(result.status || 1);
  }
  const expected = await inventory(committed);
  const actual = await inventory(temporary);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error("Committed workbench bundle is stale. Run `npm run build` in plugins/meta-skill/workbench-ui.");
    console.error("Committed:", expected);
    console.error("Built:", actual);
    process.exit(1);
  }
  console.log(`Workbench bundle is current (${actual.length} files).`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
