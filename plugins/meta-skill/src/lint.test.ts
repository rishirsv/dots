import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { runEval } from "./evals";
import { lintProject } from "./lint";
import type { TokenUsage } from "./models";
import { CliError, exists, readJson, readText, writeJson, writeText } from "./project";
import { createSkill } from "./skills";

describe("lint, command parsing, and eval evidence", () => {
  it("validates case manifests, tests, and judges", async () => {
    const project = await fixtureProject("case-check");
    await writeCase(project, {
      folder: "R1-basic",
      id: "R1",
      type: "regression",
      tests: ["exact-output"],
      judges: ["final-answer-quality"]
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
      path.join(project, ".meta-skill", "evals", "judges", "final-answer-quality.md"),
      `---\nid: final-answer-quality\ntype: rubric\nscale: 1-5\ninputs: [task, final]\n---\n\n# Final Answer Quality\n\n## Rubric\n\n5: Excellent.\n1: Poor.\n\n## Output\n\nReturn JSON.\n\n## Calibration Example\n\nGood output scores 5.\n`
    );
    report = await lintProject(project, { executeTests: false });
    assert.equal(report.failures.length, 0);
  });

  it("requires declared fixtures to match files on disk", async () => {
    const project = await fixtureProject("case-fixtures");
    await writeCase(project, {
      folder: "R1-fixtures",
      id: "R1",
      type: "regression",
      fixtures: [{ path: "fixtures/source-pack.md" }]
    });
    const caseDir = path.join(project, ".meta-skill", "evals", "cases", "R1-fixtures");

    let report = await lintProject(project, { executeTests: false });
    assert.match(report.failures.map((item) => item.message).join("\n"), /declared fixture does not exist/);

    await fs.mkdir(path.join(caseDir, "fixtures"), { recursive: true });
    await writeText(path.join(caseDir, "fixtures", "source-pack.md"), "source");
    report = await lintProject(project, { executeTests: false });
    assert.equal(report.failures.length, 0);

    await writeText(path.join(caseDir, "fixtures", "extra.md"), "extra");
    report = await lintProject(project, { executeTests: false });
    assert.match(report.failures.map((item) => item.message).join("\n"), /fixture is present but undeclared/);
  });

  it("writes App Server run evidence and fails when eval tests fail", async () => {
    const project = await fixtureProject("eval-run-check");
    await writeCase(project, {
      folder: "F1-multiturn",
      id: "F1",
      type: "failure_mode",
      turns: [{ content: "Now tighten it." }]
    });
    await writeJson(path.join(project, ".meta-skill", "tests", "manifest.json"), {
      schema_version: 1,
      tests: [{ id: "failing-eval", kind: "eval", command: "node -e \"process.exit(1)\"" }]
    });
    const result = await runEval({
      project,
      selector: {},
      caseRunner: {
        async run(input) {
          const caseRoot = path.join(input.runRoot, "cases", input.case.folder);
          await fs.mkdir(caseRoot, { recursive: true });
          await writeText(path.join(caseRoot, "final.md"), "Fixture final.");
          await writeText(path.join(caseRoot, "turns.jsonl"), "");
          await writeJson(path.join(caseRoot, "thread.json"), { schema_version: 1, thread_id: "fixture", turn_ids: ["turn"], status: "completed" });
          await writeText(path.join(caseRoot, "rpc.jsonl"), "");
          await writeJson(path.join(caseRoot, "usage.json"), tokenUsageEvidence(1, 1, 2));
          return {
            execution_status: "completed",
            token_usage: tokenSummary(1, 1, 2),
            final_path: path.join(caseRoot, "final.md"),
            evidence_path: path.join("cases", input.case.folder)
          };
        },
        close() {}
      }
    });
    assert.equal(result.ok, false);
    assert.equal(await exists(path.join(result.runRoot, "run.json")), true);
    assert.equal(await exists(path.join(result.runRoot, "events.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "results.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "tests.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "grades.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "feedback.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "F1-multiturn", "rpc.jsonl")), true);
    assert.equal(await exists(path.join(result.runRoot, "cases", "F1-multiturn", "stage")), false);

    const tests = await readText(path.join(result.runRoot, "tests.jsonl"));
    assert.match(tests, /"status":"failed"/);
    const before = await readJson<{ tests: unknown[] }>(path.join(result.runRoot, "report.json"));
    const lint = await lintProject(project, { runId: result.runId });
    assert.equal(lint.annotations, 2);
    const after = await readJson<{ tests: unknown[]; summary: { failure_classifications: string[] } }>(path.join(result.runRoot, "report.json"));
    assert.equal(after.tests.length > before.tests.length, true);
    assert.deepEqual(after.summary.failure_classifications, ["lint_test_failure"]);
    const index = await readJson<{ runs: Array<{ run_id: string; readiness_status: string }> }>(path.join(path.dirname(result.runRoot), "index.json"));
    assert.equal(index.runs.some((row) => row.run_id === result.runId && row.readiness_status === "blocked"), true);
  });
});

function tokenSummary(input: number, output: number, total: number): TokenUsage {
  return {
    input_tokens: input,
    output_tokens: output,
    total_tokens: total,
    cached_input_tokens: null,
    reasoning_tokens: null,
    model_context_window: null,
    unavailable_reason: null
  };
}

function tokenUsageEvidence(input: number, output: number, total: number) {
  return tokenSummary(input, output, total);
}

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

async function writeCase(
  project: string,
  options: {
    folder: string;
    id: string;
    type: "regression" | "failure_mode" | "gate";
    tests?: string[];
    judges?: string[];
    turns?: Array<{ content: string }>;
    fixtures?: Array<{ path: string; description?: string }>;
  }
): Promise<void> {
  const item = path.join(project, ".meta-skill", "evals", "cases", options.folder);
  await fs.mkdir(item, { recursive: true });
  await writeText(
    path.join(item, "case.md"),
    `---
title: Basic behavior
topics:
  - smoke
${(options.fixtures || []).length ? `fixtures:\n${(options.fixtures || []).map((fixture) => `  - path: ${fixture.path}${fixture.description ? `\n    description: ${fixture.description}` : ""}`).join("\n")}` : "fixtures: []"}
criteria:
  what_it_tests: Basic behavior
  expected_behavior: The skill should answer directly.
  assertions:
    - Answers directly.
  tests:${(options.tests || []).length ? `\n${(options.tests || []).map((id) => `    - ${id}`).join("\n")}` : " []"}
  judges:${(options.judges || []).length ? `\n${(options.judges || []).map((id) => `    - id: ${id}`).join("\n")}` : " []"}
---

## Task

Do the eval task.
${(options.turns || []).map((turn, index) => `\n## Turn ${index + 2}\n\n${turn.content}\n`).join("")}`
  );
}
