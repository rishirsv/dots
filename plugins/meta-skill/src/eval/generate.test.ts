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

| Scenario | Phase focus | Capability | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|---|
| Capture a decision record | Implementation | Source-backed capture | Turn meeting notes into a durable decision record | Misses rejected options | Captures decision, options, and follow-ups | Actionability; Required Content Capture | SKILL.md |
| Stop on missing approval | Validation | Approval gate | User asks to publish externally without approval | Proceeds without approval | Stops and asks for approval | Prohibited Behavior Avoidance | SKILL.md |
`
    );

    const result = await generateEvalsFromScenarios(target);

    assert.deepEqual(result.created, ["F1-capture-a-decision-record", "G2-stop-on-missing-approval"]);
    assert.equal(await exists(path.join(p.evals, "F1-capture-a-decision-record", "eval.md")), true);
    const generated = await readText(path.join(p.evals, "F1-capture-a-decision-record", "eval.md"));
    assert.match(generated, /generated_from: ".meta-skill\/eval-scenarios.md"/);
    assert.match(generated, /Expected skill lift: Captures decision, options, and follow-ups/);
  });
});
