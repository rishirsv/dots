import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { packageProject } from "./package";
import { exists, listPortablePayloadFiles, nextSequencedId, readText } from "./project";
import { createSkill } from "./skills";
import { releaseProject } from "./versions";

describe("project layout and packaging", () => {
  it("creates a project-mode portable skill with a hidden workbench", async () => {
    const root = await tempDir();
    const target = path.join(root, "source-pack-triage");
    const result = await createSkill({
      target,
      slug: "source-pack-triage",
      title: "Source Pack Triage",
      description: "Use when triaging a source pack into reusable guidance; not for publishing skills.",
      job: "Turn source material into a concise reusable workflow.",
      project: true
    });

    assert.equal(result.path, target);
    assert.equal(await exists(path.join(target, "SKILL.md")), true);
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
