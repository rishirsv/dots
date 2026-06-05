import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { packageProject } from "./package.ts";
import { createSkill } from "./skills.ts";
import { exists, readJson } from "./project.ts";

describe("project packaging", () => {
  it("packages only the current portable payload", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-package-"));
    const target = path.join(root, "pkg-check");
    await createSkill({
      target,
      project: true,
      slug: "pkg-check",
      title: "Package Check",
      description: "Use when checking package behavior; not for unrelated tasks.",
      job: "Package."
    });
    await fs.mkdir(path.join(target, ".meta-skill", "private"), { recursive: true });
    await fs.writeFile(path.join(target, ".meta-skill", "private", "secret.txt"), "secret\n");

    const outDir = path.join(root, "artifact");
    const result = await packageProject({ project: target, outDir });

    assert.equal(await exists(path.join(result.artifact, "SKILL.md")), true);
    assert.equal(await exists(path.join(result.artifact, ".meta-skill")), false);
    const metadata = await readJson<{ source: string }>(result.metadata);
    assert.equal(metadata.source, "current");
  });

  it("writes a valid default zip with arbitrary payload folders and metadata hash", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-package-zip-"));
    const target = path.join(root, "zip-check");
    await createSkill({
      target,
      project: true,
      slug: "zip-check",
      title: "Zip Check",
      description: "Use when checking zip package behavior; not for unrelated tasks.",
      job: "Package."
    });
    await fs.mkdir(path.join(target, ".meta-skill", "private"), { recursive: true });
    await fs.writeFile(path.join(target, ".meta-skill", "private", "secret.txt"), "secret\n");
    await fs.mkdir(path.join(target, "custom-root"), { recursive: true });
    await fs.writeFile(path.join(target, "custom-root", "data.txt"), "custom data\n");

    const result = await packageProject({ project: target });
    const entries = await readZipEntries(result.artifact);

    assert.deepEqual(
      entries.map((entry) => entry.name),
      result.files
    );
    assert.equal(entries.find((entry) => entry.name === "custom-root/data.txt")?.content, "custom data\n");
    assert.equal(entries.some((entry) => entry.name.startsWith(".meta-skill/")), false);

    const metadata = await readJson<{ artifact_sha256: string; files: string[] }>(result.metadata);
    assert.equal(metadata.artifact_sha256, await sha256File(result.artifact));
    assert.deepEqual(metadata.files, result.files);
  });
});

async function readZipEntries(target: string): Promise<Array<{ name: string; content: string }>> {
  const bytes = await fs.readFile(target);
  const eocdOffset = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.notEqual(eocdOffset, -1);
  const entryCount = bytes.readUInt16LE(eocdOffset + 10);
  let centralOffset = bytes.readUInt32LE(eocdOffset + 16);
  const entries: Array<{ name: string; content: string }> = [];

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(bytes.readUInt32LE(centralOffset), 0x02014b50);
    const nameLength = bytes.readUInt16LE(centralOffset + 28);
    const extraLength = bytes.readUInt16LE(centralOffset + 30);
    const commentLength = bytes.readUInt16LE(centralOffset + 32);
    const localOffset = bytes.readUInt32LE(centralOffset + 42);
    const name = bytes.subarray(centralOffset + 46, centralOffset + 46 + nameLength).toString("utf8");
    entries.push({ name, content: readZipLocalFile(bytes, localOffset).toString("utf8") });
    centralOffset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function readZipLocalFile(bytes: Buffer, offset: number): Buffer {
  assert.equal(bytes.readUInt32LE(offset), 0x04034b50);
  const compressedSize = bytes.readUInt32LE(offset + 18);
  const nameLength = bytes.readUInt16LE(offset + 26);
  const extraLength = bytes.readUInt16LE(offset + 28);
  const start = offset + 30 + nameLength + extraLength;
  return bytes.subarray(start, start + compressedSize);
}

async function sha256File(target: string): Promise<string> {
  return `sha256:${createHash("sha256").update(await fs.readFile(target)).digest("hex")}`;
}
