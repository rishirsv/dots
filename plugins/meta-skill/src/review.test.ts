import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { exists, readJson, readText } from "./project";
import { reviewProject } from "./review";
import { createSkill } from "./skills";

describe("skill quality review", () => {
  it("writes Tessl-shaped review JSON and Markdown report", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-review-"));
    const project = path.join(root, "quality-review");
    await createSkill({
      target: project,
      slug: "quality-review",
      description: "Use when reviewing a reusable skill for quality evidence; not for eval execution.",
      project: true
    });

    const result = await reviewProject(project);

    assert.equal(await exists(path.join(result.reviewRoot, "review.json")), true);
    assert.equal(await exists(path.join(result.reviewRoot, "lint.json")), true);
    const review = await readJson<{
      quality: { score: number; discovery: number; implementation: number; validation: number };
      discovery: { vectors: Array<{ name: string; score: number; max: number; reasoning: string }> };
      implementation: { vectors: Array<{ name: string; score: number; max: number; reasoning: string }> };
      validation: { checks: Array<{ name: string; status: string; message: string }> };
      suggestions: unknown[];
      reviewer: { read_only: boolean; status: string };
    }>(path.join(result.reviewRoot, "review.json"));
    assert.equal(review.reviewer.read_only, true);
    assert.equal(review.reviewer.status, "deterministic-fallback");
    assert.equal(typeof review.quality.score, "number");
    assert.equal(review.discovery.vectors.some((vector) => vector.name === "specificity"), true);
    assert.equal(review.implementation.vectors.some((vector) => vector.name === "actionability"), true);
    assert.equal(review.validation.checks.some((check) => check.name === "frontmatter_valid"), true);

    const report = await readText(result.report);
    assert.match(report, /## Discovery:/);
    assert.match(report, /## Implementation:/);
    assert.match(report, /## Validation:/);
    assert.match(report, /## Suggestions/);
  });
});
