import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { lintProject } from "./lint";
import type { RunReport } from "./models";
import { CliError, copyPortablePayload, createWorkbench, exists, gitContext, listPortablePayloadFiles, projectPaths, readJson, requirePortableSkill, sha256File, utcNow, writeJson } from "./project";
import { writeEvalReport } from "./report";

export async function releaseProject(project: string, options: { fromRun?: string } = {}): Promise<{ releaseRoot: string; files: string[] }> {
  const root = await requirePortableSkill(project);
  await createWorkbench(root);
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
  const fileDigests = await payloadFileDigests(root);
  const payloadDigest = digestPayload(fileDigests);
  const runEvidence = options.fromRun ? await releaseRunEvidence(p.runs, options.fromRun) : null;
  await writeJson(path.join(p.release, "version.json"), {
    schema_version: 1,
    name: "release",
    source: "./",
    created_at: utcNow(),
    created_from: await gitContext(root),
    created_from_evidence: options.fromRun ? "eval_run" : "manual",
    source_run_id: options.fromRun || null,
    source_review_id: null,
    source_session_id: null,
    readiness_summary: runEvidence?.readiness || null,
    payload_digest: payloadDigest,
    file_digests: fileDigests,
    note: options.fromRun ? `Accepted release snapshot from eval run ${options.fromRun}.` : "Accepted release snapshot."
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

async function payloadFileDigests(root: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const relative of await listPortablePayloadFiles(root)) {
    result[relative] = await sha256File(path.join(root, relative));
  }
  return result;
}

function digestPayload(fileDigests: Record<string, string>): string {
  const hash = createHash("sha256");
  for (const [relative, digest] of Object.entries(fileDigests).sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(`${relative}\0${digest}\n`);
  }
  return `sha256:${hash.digest("hex")}`;
}

async function releaseRunEvidence(runsRoot: string, runId: string): Promise<{ readiness: RunReport["readiness"] }> {
  const runRoot = path.join(runsRoot, runId);
  if (!(await exists(runRoot))) throw new CliError(`release source run does not exist: ${runId}`);
  await writeEvalReport(runRoot);
  const report = await readJson<RunReport>(path.join(runRoot, "report.json"));
  return { readiness: report.readiness };
}
