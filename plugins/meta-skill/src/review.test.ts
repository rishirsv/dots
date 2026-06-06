import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { createSkill } from "./skills.ts";
import { exists, projectPaths, readText } from "./project.ts";
import { reviewSkill } from "./review.ts";
import { lintProject } from "./lint.ts";

describe("skill review", () => {
  it("writes a single review.md with a Quality-page worksheet", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-review-"));
    const target = path.join(root, "review-check");
    await createSkill({
      target,
      project: false,
      slug: "review-check",
      title: "Review Check",
      description: "Use when reviewing reusable skill quality and evidence-backed edits; not for creating new skills.",
      job: "Review a skill and report precise findings."
    });
    await fs.appendFile(
      path.join(target, "SKILL.md"),
      "\n## Workflow\n\n1. Review the skill evidence.\n2. Return findings with next steps.\n\n## Output\n\nReturn a scored report with findings and validation commands.\n"
    );

    const result = await reviewSkill(target);
    const p = projectPaths(target);
    const review = await readText(p.review);

    assert.equal(result.reviewPath, p.review);
    assert.equal(await exists(path.join(p.meta, "reviews")), false);
    assert.match(review, /^# Skill Review/m);
    assert.match(review, /## Score/);
    assert.match(review, /Quality Score: Agent review required/);
    assert.match(review, /Validation Score: \d+%/);
    assert.doesNotMatch(review, /Total Score:/);
    assert.doesNotMatch(review, /Judge Score:/);
    assert.match(review, /## Quality/);
    assert.match(review, /Overall assessments should be 2-4 substantive sentences/);
    assert.match(review, /Each dimension should cite concrete evidence/);
    assert.match(review, /use those Quality, Implementation, and Validation dimensions as additional review lenses/);
    assert.match(review, /Do not invent validation rows, run IDs, lint results, deterministic test status, or evidence files/);
    assert.match(review, /### Discovery/);
    assert.match(review, /### Implementation/);
    assert.match(review, /### Validation/);
    assert.match(review, /Agent-authored review required/);
    assert.doesNotMatch(review, /Description names \d+ concrete action/);
    assert.doesNotMatch(review, /Runtime guidance separates/);
    assert.doesNotMatch(review, /Confidence:/);
    assert.doesNotMatch(review, /Basis:/);
    assert.doesNotMatch(review, /Unavailable/);

    const lint = await lintProject(target);
    assert.equal(lint.ok, true);
  });

  it("does not execute deterministic tests during review", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-review-"));
    const target = path.join(root, "read-only-review");
    await createSkill({
      target,
      project: false,
      slug: "read-only-review",
      title: "Read Only Review",
      description: "Use when reviewing skill behavior from evidence; not for creating new skills.",
      job: "Review a skill without mutating its files."
    });
    const testsDir = path.join(target, ".meta-skill", "tests");
    const marker = path.join(target, "mutated.txt");
    await fs.mkdir(testsDir, { recursive: true });
    await fs.writeFile(path.join(testsDir, "mutate.sh"), `#!/usr/bin/env bash\necho changed > ${JSON.stringify(marker)}\n`);
    await fs.chmod(path.join(testsDir, "mutate.sh"), 0o755);

    await reviewSkill(target);
    const review = await readText(projectPaths(target).review);

    assert.equal(await exists(marker), false);
    assert.match(review, /1 deterministic tests discovered; review does not execute them/);
  });
});
