import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { runCommand } from "./commands";
import { runEval } from "./evals";
import { lintProject } from "./lint";
import { CliError, exists, readText, writeJson, writeText } from "./project";
import { createSkill } from "./skills";

describe("lint, command parsing, and eval evidence", () => {
  it("validates scenario manifests, tests, and judges", async () => {
    const project = await fixtureProject("scenario-check");
    await writeScenario(project, {
      folder: "R1-basic",
      id: "R1",
      family: "regression",
      tests: ["exact-output"],
      judges: ["artifact-quality"]
    });

    let report = await lintProject(project, { executeTests: false });
    assert.equal(report.ok, false);
    assert.match(report.failures.map((item) => item.message).join("\n"), /missing test id/);
    assert.match(report.failures.map((item) => item.message).join("\n"), /missing judge id/);

    await writeJson(path.join(project, ".meta-skill", "tests", "manifest.json"), {
      schema_version: 1,
      tests: [{ id: "exact-output", kind: "eval", command: "node -e \"process.exit(0)\"" }]
    });
    await writeText(
      path.join(project, ".meta-skill", "evals", "judges", "artifact-quality.md"),
      `---\nid: artifact-quality\ntype: rubric\nscale: 1-5\ninputs: [task, final]\n---\n\n# Artifact Quality\n\n## Rubric\n\n5: Excellent.\n1: Poor.\n\n## Output\n\nReturn JSON.\n\n## Calibration Example\n\nGood output scores 5.\n`
    );
    report = await lintProject(project, { executeTests: false });
    assert.equal(report.failures.length, 0);
  });

  it("rejects legacy command namespaces", async () => {
    await assert.rejects(() => runCommand(["validate", "."]), (error) => error instanceof CliError && error.exitCode === 2);
    await assert.rejects(() => runCommand(["improve", "plan", "."]), (error) => error instanceof CliError && error.exitCode === 2);
  });

  it("writes App Server-first run evidence with explicit unavailable token usage", async () => {
    const project = await fixtureProject("eval-run-check");
    await writeScenario(project, {
      folder: "F1-multiturn",
      id: "F1",
      family: "failure_mode",
      turns: [{ content: "Now tighten it." }]
    });
    const result = await runEval({ project, selector: {}, noLint: true });
    assert.equal(result.ok, false);
    assert.equal(await exists(path.join(result.runRoot, "run.json")), true);
    assert.equal(await exists(path.join(result.runRoot, "events.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "results.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "tests.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "grades.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "feedback.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "scenarios", "F1-multiturn", "candidate", "rpc.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "scenarios", "F1-multiturn", "candidate", "stage", "skill", "SKILL.md")), true);

    const results = await readText(path.join(result.runRoot, "results.jsonl"));
    assert.match(results, /"available":false/);
    assert.match(results, /App Server execution failed before token metrics/);
  });
});

async function fixtureProject(slug: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-test-"));
  const project = path.join(root, slug);
  await createSkill({
    target: project,
    slug,
    description: `Use when testing ${slug} behavior for reusable skill work; not for publishing.`,
    project: true
  });
  return project;
}

async function writeScenario(
  project: string,
  options: {
    folder: string;
    id: string;
    family: "regression" | "failure_mode" | "trigger" | "gate";
    tests?: string[];
    judges?: string[];
    turns?: Array<{ content: string }>;
  }
): Promise<void> {
  const scenario = path.join(project, ".meta-skill", "evals", "scenarios", options.folder);
  await fs.mkdir(scenario, { recursive: true });
  await writeText(path.join(scenario, "task.md"), "Do the eval task.");
  await writeJson(path.join(scenario, "scenario.json"), {
    schema_version: 1,
    id: options.id,
    family: options.family,
    type: "behavior",
    title: "Basic behavior",
    topics: ["smoke"],
    include: [],
    setup: [],
    metadata: {}
  });
  await writeJson(path.join(scenario, "criteria.json"), {
    schema_version: 1,
    what_it_tests: "Basic behavior",
    expected_behavior: "The skill should answer directly.",
    assertions: ["Answers directly."],
    tests: options.tests || [],
    judges: (options.judges || []).map((id) => ({ id }))
  });
  if (options.turns) await writeJson(path.join(scenario, "turns.json"), options.turns);
}
