import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { packageProject } from "./package";
import { exists, listPortablePayloadFiles, nextSequencedId, readJson, readText, writeJson } from "./project";
import { createSkill } from "./skills";
import { releaseProject } from "./versions";

describe("project layout and packaging", () => {
  it("creates a project-mode portable skill with a hidden workbench", async () => {
    const root = await tempDir();
    const target = path.join(root, "source-pack-triage");
    const description = "Use when triaging source packs: examples, notes, and traces; not for publishing skills.";
    const result = await createSkill({
      target,
      slug: "source-pack-triage",
      title: "Source Pack Triage",
      description,
      job: "Turn source material into a concise reusable workflow.",
      project: true
    });

    assert.equal(result.path, target);
    assert.equal(await exists(path.join(target, "SKILL.md")), true);
    assert.match(await readText(path.join(target, "SKILL.md")), new RegExp(`description: ${escapeRegExp(JSON.stringify(description))}`));
    assert.equal(await exists(path.join(target, ".meta-skill", "evals", "evals.json")), true);
    assert.equal(await exists(path.join(target, ".meta-skill", "tests", "manifest.json")), true);
    const portableFiles = await listPortablePayloadFiles(target);
    assert.deepEqual(portableFiles.sort(), ["SKILL.md", "agents/openai.yaml"].sort());
  });

  it("packages only the portable candidate payload", async () => {
    const root = await tempDir();
    const target = path.join(root, "artifact-review");
    await createSkill({
      target,
      slug: "artifact-review",
      description: "Use when reviewing a generated artifact for reusable quality gates; not for publishing.",
      project: true
    });
    await fs.writeFile(path.join(target, ".meta-skill", "private.txt"), "secret\n");
    const outDir = path.join(root, "pkg");
    const result = await packageProject({ project: target, source: "candidate", outDir });
    assert.equal(await exists(path.join(outDir, "SKILL.md")), true);
    assert.equal(await exists(path.join(outDir, "agents", "openai.yaml")), true);
    assert.equal(await exists(path.join(outDir, ".meta-skill")), false);
    assert.equal(await exists(result.metadata), true);
  });

  it("creates an immutable release snapshot from the portable payload", async () => {
    const root = await tempDir();
    const target = path.join(root, "release-check");
    await createSkill({
      target,
      slug: "release-check",
      description: "Use when checking a release-ready skill snapshot; not for packaging without approval.",
      project: true
    });
    const release = await releaseProject(target);
    assert.equal(await exists(path.join(release.releaseRoot, "version.json")), true);
    assert.equal(await exists(path.join(release.releaseRoot, "skill", "SKILL.md")), true);
    assert.equal(await exists(path.join(release.releaseRoot, "skill", ".meta-skill")), false);

    const releasedSkill = await readText(path.join(release.releaseRoot, "skill", "SKILL.md"));
    await fs.appendFile(path.join(target, "SKILL.md"), "\n## Candidate Only\n\nNot released yet.\n");
    assert.equal(await readText(path.join(release.releaseRoot, "skill", "SKILL.md")), releasedSkill);
  });

  it("can release a portable-only skill by creating the workbench", async () => {
    const root = await tempDir();
    const target = path.join(root, "portable-release");
    await createSkill({
      target,
      slug: "portable-release",
      description: "Use when checking portable release behavior; not for publishing."
    });

    const release = await releaseProject(target);

    assert.equal(await exists(path.join(target, ".meta-skill", "evals", "evals.json")), true);
    assert.equal(await exists(path.join(release.releaseRoot, "skill", "SKILL.md")), true);
    assert.equal(await exists(path.join(release.releaseRoot, "version.json")), true);
  });

  it("records source run readiness and payload digests in release metadata", async () => {
    const root = await tempDir();
    const target = path.join(root, "release-from-run");
    await createSkill({
      target,
      slug: "release-from-run",
      description: "Use when checking run-backed release evidence; not for publishing.",
      project: true
    });
    const runRoot = path.join(target, ".meta-skill", "evals", "runs", "001-ready");
    await fs.mkdir(runRoot, { recursive: true });
    await writeJson(path.join(runRoot, "run.json"), {
      schema_version: 1,
      run_id: "001-ready",
      created_at: "2026-06-02T00:00:00.000Z",
      completed_at: "2026-06-02T00:01:00.000Z",
      status: "completed",
      ok: true,
      failure_classifications: [],
      runner: { backend: "test" }
    });
    await fs.writeFile(
      path.join(runRoot, "tests.jsonl"),
      `${JSON.stringify({
        schema_version: 1,
        type: "test_result",
        run_id: "001-ready",
        created_at: "2026-06-02T00:01:00.000Z",
        source: "fixture",
        payload: { id: "release-ready", status: "passed" }
      })}\n`,
      "utf8"
    );

    const release = await releaseProject(target, { fromRun: "001-ready" });
    const version = await readJson<{
      source_run_id: string;
      readiness_summary: { status: string };
      payload_digest: string;
      file_digests: Record<string, string>;
      created_from_evidence: string;
    }>(path.join(release.releaseRoot, "version.json"));

    assert.equal(version.source_run_id, "001-ready");
    assert.equal(version.created_from_evidence, "eval_run");
    assert.equal(version.readiness_summary.status, "ready");
    assert.match(version.payload_digest, /^sha256:/);
    assert.match(version.file_digests["SKILL.md"], /^sha256:/);
  });

  it("generates sorted, human-readable run IDs", async () => {
    const root = await tempDir();
    await fs.mkdir(path.join(root, "001-initial-candidate"), { recursive: true });
    await fs.mkdir(path.join(root, "002-trigger-boundaries"), { recursive: true });
    assert.equal(await nextSequencedId(root, "After Source Grounding Edit!"), "003-after-source-grounding-edit");
  });
});

async function tempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-test-"));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
