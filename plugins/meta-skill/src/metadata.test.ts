import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { parseAgentManifestMetadata, parseCaseFrontmatter, parseSkillFrontmatter } from "./metadata.ts";

describe("metadata parsing", () => {
  it("decodes skill frontmatter with the shared YAML subset", async () => {
    const skillMd = await tempFile(
      "SKILL.md",
      `---
name: "demo-skill"
description: 'Use when testing shared metadata; not for production.'
---

# Demo
`
    );

    assert.deepEqual(await parseSkillFrontmatter(skillMd), {
      name: "demo-skill",
      description: "Use when testing shared metadata; not for production."
    });
  });

  it("decodes case metadata, criteria, fixture maps, and body from one parser", () => {
    const parsed = parseCaseFrontmatter(
      `---
title: Basic
topics:
  - routing
capability: eval
fixtures:
  - path: fixtures/input.txt
    description: Input file
metadata:
  budget:
    max_turns: 2
criteria:
  what_it_tests: Metadata parsing
  expected_behavior: Answer directly.
  assertions:
    - Uses the fixture.
  tests: []
---

## Task

Answer directly.
`,
      "case.md"
    );

    assert.deepEqual(parsed.metadata, {
      title: "Basic",
      topics: ["routing"],
      capability: "eval",
      fixtures: [{ path: "fixtures/input.txt", description: "Input file" }],
      metadata: { budget: { max_turns: 2 } }
    });
    assert.deepEqual(parsed.criteria, {
      what_it_tests: "Metadata parsing",
      expected_behavior: "Answer directly.",
      assertions: ["Uses the fixture."],
      tests: []
    });
    assert.match(parsed.body, /## Task/);
  });

  it("rejects malformed typed fields instead of coercing them", () => {
    assert.throws(
      () =>
        parseCaseFrontmatter(
          `---
title: 12
criteria:
  expected_behavior: Answer.
  assertions: []
---

## Task

Answer.
`,
          "case.md"
        ),
      /case.md: frontmatter field 'title' must be a string/
    );
  });

  it("decodes agent manifests through the shared parser", async () => {
    const manifest = await tempFile(
      "openai.yaml",
      `name: demo-skill
description: Use when testing manifest metadata; not for unrelated work.
policy:
  allow_implicit_invocation: false
`
    );

    assert.deepEqual(await parseAgentManifestMetadata(manifest), {
      name: "demo-skill",
      description: "Use when testing manifest metadata; not for unrelated work.",
      hasInterface: false
    });
  });

  it("keeps documented interface manifests detectable", async () => {
    const manifest = await tempFile(
      "openai.yaml",
      `interface:
  default_prompt: Use $demo-skill.
`
    );

    assert.deepEqual(await parseAgentManifestMetadata(manifest), {
      name: undefined,
      description: undefined,
      hasInterface: true
    });
  });
});

async function tempFile(name: string, text: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-metadata-"));
  const target = path.join(root, name);
  await fs.writeFile(target, text, "utf8");
  return target;
}
