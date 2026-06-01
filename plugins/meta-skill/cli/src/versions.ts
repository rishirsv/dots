import { promises as fs } from "node:fs";
import path from "node:path";
import { lintProject } from "./lint";
import { CliError, copyPortablePayload, gitContext, projectPaths, requirePortableSkill, utcNow, writeJson } from "./project";

export async function releaseProject(project: string): Promise<{ releaseRoot: string; files: string[] }> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const lint = await lintProject(root);
  if (!lint.ok) {
    throw new CliError(`release validation failed:\n${lint.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
  }

  if ((await existsRelease(p.releaseSkill)) && !process.stdout.isTTY) {
    throw new CliError("release already exists; replacing it requires an interactive human confirmation");
  }
  if (await existsRelease(p.releaseSkill)) {
    const confirmed = await confirmReplace();
    if (!confirmed) throw new CliError("release replacement cancelled");
  }

  const files = await copyPortablePayload(root, p.releaseSkill);
  await writeJson(path.join(p.release, "version.json"), {
    schema_version: 1,
    name: "release",
    source: "./",
    created_at: utcNow(),
    created_from: await gitContext(root),
    note: "Accepted release snapshot."
  });
  return { releaseRoot: p.release, files };
}

async function existsRelease(releaseSkill: string): Promise<boolean> {
  try {
    await fs.access(path.join(releaseSkill, "SKILL.md"));
    return true;
  } catch {
    return false;
  }
}

async function confirmReplace(): Promise<boolean> {
  process.stderr.write("Replace existing .meta-skill/versions/release? Type 'release' to confirm: ");
  const answer = await new Promise<string>((resolve) => {
    process.stdin.once("data", (chunk) => resolve(String(chunk).trim()));
  });
  return answer === "release";
}
