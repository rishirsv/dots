import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { createSkill } from "../skills.ts";
import { exists, projectPaths, readText } from "../project.ts";
import { generateEvalsFromScenarios } from "./generate.ts";

describe("eval generation", () => {
  it("creates draft evals from the high-level scenario plan", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-generate-evals-"));
    const target = path.join(root, "scenario-check");
    await createSkill({
      target,
      project: true,
      slug: "scenario-check",
      title: "Scenario Check",
      description: "Use when checking generated evals; not for unrelated tasks.",
      job: "Check eval generation."
    });
    const p = projectPaths(target);
    await fs.writeFile(
      p.evalScenarios,
      `# Eval Scenarios

## Scenario Plan

| Scenario | Phase focus | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|
| Capture a decision record | Implementation | Turn meeting notes into a durable decision record | Misses rejected options | Captures decision, options, and follow-ups | Actionability; Required Content Capture | SKILL.md |
| Stop on missing approval | Validation | User asks to publish externally without approval | Proceeds without approval | Stops and asks for approval | Prohibited Behavior Avoidance | SKILL.md |
`
    );

    const result = await generateEvalsFromScenarios(target);

    assert.deepEqual(result.created, ["capture-a-decision-record", "stop-on-missing-approval"]);
    assert.equal(await exists(path.join(p.evals, "capture-a-decision-record", "task.md")), true);
    assert.equal(await exists(path.join(p.evals, "capture-a-decision-record", "criteria.json")), true);
    const generated = JSON.parse(await readText(path.join(p.evals, "capture-a-decision-record", "criteria.json")));
    assert.equal(generated.metadata.generated_from, ".meta-skill/eval-scenarios.md");
    assert.ok(!("capability" in generated.metadata));
    assert.ok(!("topics" in generated.metadata));
    assert.ok(generated.criteria.some((criterion: { criterion?: string; phase?: string; dimension?: string }) => criterion.criterion === "Exercises Required Content Capture" && criterion.phase === "Implementation" && criterion.dimension === "Required Content Capture"));
    assert.ok(generated.criteria.every((criterion: { question?: string }) => criterion.question?.startsWith("Does ")));
    assert.ok(generated.criteria.some((criterion: { question?: string }) => criterion.question?.includes("expected skill lift")));
    assert.ok(generated.criteria.every((criterion: { max_score?: number }) => typeof criterion.max_score === "number" && criterion.max_score > 0));
    const task = await readText(path.join(p.evals, "capture-a-decision-record", "task.md"));
    assert.match(task, /Captures decision, options, and follow-ups/);
    assert.doesNotMatch(task, /^Capability:/m);
    assert.doesNotMatch(task, /^Topics:/m);
  });
});
