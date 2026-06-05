import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { lintProject } from "./lint.ts";
import type { Issue } from "./models.ts";

async function tempSkill(name: string, frontmatter: string, body = "# Body\n\nContent.\n"): Promise<string> {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-lint-"));
  const root = path.join(base, name);
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(path.join(root, "SKILL.md"), `---\n${frontmatter}\n---\n\n${body}`);
  return root;
}

function messages(issues: Issue[]): string[] {
  return issues.map((item) => item.message);
}

describe("lint frontmatter spec validation", () => {
  it("passes a valid minimal skill", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when demoing lint; not for production.`);
    const report = await lintProject(root, { executeTests: false });
    assert.equal(report.failures.length, 0, messages(report.failures).join("; "));
    assert.equal(report.ok, true);
  });

  it("accepts all spec optional fields without unknown-key warnings", async () => {
    const root = await tempSkill(
      "demo-skill",
      `name: demo-skill
description: Use when testing optional fields; not for production.
license: Apache-2.0
compatibility: Requires git and the internet
allowed-tools: Read Bash
metadata:
  author: acme
  version: "1.0"`
    );
    const report = await lintProject(root, { executeTests: false });
    assert.equal(report.failures.length, 0, messages(report.failures).join("; "));
    assert.ok(!messages(report.warnings).some((m) => m.includes("unknown frontmatter")));
  });

  it("fails when name exceeds 64 characters", async () => {
    const longName = "a".repeat(65);
    const root = await tempSkill(longName, `name: ${longName}\ndescription: Use when testing; not for production.`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("64 characters")));
  });

  it("fails when description exceeds 1024 characters", async () => {
    const description = `Use when ${"x".repeat(1100)} not for prod`;
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: "${description}"`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("1024 characters")));
  });

  it("warns when description is over 500 but within 1024", async () => {
    const description = `Use when ${"x".repeat(520)} not for prod`;
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: "${description}"`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.warnings).some((m) => m.includes("aim for under 500")));
    assert.equal(report.ok, true);
  });

  it("fails when compatibility exceeds 500 characters", async () => {
    const compatibility = "x".repeat(501);
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.\ncompatibility: "${compatibility}"`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("compatibility") && m.includes("500")));
  });

  it("warns on unknown frontmatter keys", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.\nfoo: bar`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.warnings).some((m) => m.includes("unknown frontmatter key") && m.includes("foo")));
    assert.equal(report.ok, true);
  });

  it("warns when metadata holds non-string values", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.\nmetadata:\n  version: 1.0`);
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.warnings).some((m) => m.includes("metadata values should be strings")));
  });

  it("warns when the description reads like a workflow", async () => {
    const root = await tempSkill(
      "demo-skill",
      `name: demo-skill\ndescription: "Use when writing skills: first interview the user, then draft SKILL.md, then package it."`
    );
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.warnings).some((m) => m.includes("workflow sequence")));
  });
});

describe("lint link integrity", () => {
  it("resolves real links and ignores example links inside code fences", async () => {
    const body = [
      "# Body",
      "",
      "See [the design notes](references/design.md) for details.",
      "",
      "```md",
      "Use [scripts/check_links.py](scripts/check_links.py) for the scan.",
      "```",
      "",
      "Inline `[example](does-not-exist.md)` stays an example.",
      ""
    ].join("\n");
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, body);
    await fs.mkdir(path.join(root, "references"), { recursive: true });
    await fs.writeFile(path.join(root, "references", "design.md"), "# Design\n");
    const report = await lintProject(root, { executeTests: false });
    assert.equal(report.failures.length, 0, messages(report.failures).join("; "));
  });

  it("fails on a broken link", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, "# Body\n\nSee [missing](references/nope.md).\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("broken link") && m.includes("references/nope.md")));
  });

  it("fails on a payload-escaping link", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, "# Body\n\nSee [external](../../../../skills/clarify/SKILL.md).\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("outside the packaged payload")));
  });

  it("allows sibling-skill links within the same plugin", async () => {
    const plugin = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-plugin-"));
    await fs.mkdir(path.join(plugin, ".codex-plugin"), { recursive: true });
    await fs.writeFile(path.join(plugin, ".codex-plugin", "plugin.json"), "{}\n");
    const sibling = path.join(plugin, "skills", "sibling", "references");
    await fs.mkdir(sibling, { recursive: true });
    await fs.writeFile(path.join(sibling, "shared.md"), "# Shared\n");
    const root = path.join(plugin, "skills", "demo-skill");
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(
      path.join(root, "SKILL.md"),
      "---\nname: demo-skill\ndescription: Use when testing; not for production.\n---\n\n# Body\n\nSee [shared](../sibling/references/shared.md).\n"
    );
    const report = await lintProject(root, { executeTests: false });
    assert.equal(report.failures.length, 0, messages(report.failures).join("; "));
  });

  it("fails when a link escapes the plugin", async () => {
    const plugin = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-plugin-"));
    await fs.mkdir(path.join(plugin, ".codex-plugin"), { recursive: true });
    await fs.writeFile(path.join(plugin, ".codex-plugin", "plugin.json"), "{}\n");
    const root = path.join(plugin, "skills", "demo-skill");
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(
      path.join(root, "SKILL.md"),
      "---\nname: demo-skill\ndescription: Use when testing; not for production.\n---\n\n# Body\n\nSee [out](../../../escapes.md).\n"
    );
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("outside the packaged payload")));
  });

  it("fails on a link into the .meta-skill workbench", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, "# Body\n\nSee [the spec](.meta-skill/spec.md).\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes(".meta-skill workbench")));
  });

  it("checks links inside reference files too", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, "# Body\n\nSee [ref](references/a.md).\n");
    await fs.mkdir(path.join(root, "references"), { recursive: true });
    await fs.writeFile(path.join(root, "references", "a.md"), "# A\n\nSee [b](b.md).\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.failures).some((m) => m.includes("references/a.md") && m.includes("broken link")));
  });

  it("ignores anchors and external URLs", async () => {
    const body = "# Body\n\n[top](#body) and [site](https://example.com) and [mail](mailto:a@b.co).\n";
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`, body);
    const report = await lintProject(root, { executeTests: false });
    assert.equal(report.failures.length, 0, messages(report.failures).join("; "));
  });
});

describe("lint workbench placeholder scan", () => {
  it("warns when spec.md still has template placeholders", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`);
    await fs.mkdir(path.join(root, ".meta-skill"), { recursive: true });
    await fs.writeFile(path.join(root, ".meta-skill", "spec.md"), "# Demo Spec\n\n## Purpose\n\n<The recurring job this skill exists for>\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(messages(report.warnings).some((m) => m.includes("template placeholders")));
  });

  it("does not flag a filled spec.md", async () => {
    const root = await tempSkill("demo-skill", `name: demo-skill\ndescription: Use when testing; not for production.`);
    await fs.mkdir(path.join(root, ".meta-skill"), { recursive: true });
    await fs.writeFile(path.join(root, ".meta-skill", "spec.md"), "# Demo Spec\n\n## Purpose\n\nDrafts release notes from merged PRs.\n");
    const report = await lintProject(root, { executeTests: false });
    assert.ok(!messages(report.warnings).some((m) => m.includes("template placeholders")));
  });
});
