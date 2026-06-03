import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { formatEvalRunSummary, runCommand } from "./commands";
import { CliError } from "./project";
import { createSkill } from "./skills";

describe("command output", () => {
  it("prints completed eval run report paths", () => {
    const output = formatEvalRunSummary(".", {
      runId: "001-basic",
      status: "completed",
      failureClassifications: [],
      report: "/tmp/evals/runs/001-basic/report.html"
    });

    assert.equal(
      output,
      [
        "run: 001-basic",
        "status: completed",
        "failure classifications: none",
        "report.html: /tmp/evals/runs/001-basic/report.html",
        "report.json: /tmp/evals/runs/001-basic/report.json",
        "note: execution completed; behavioral verdicts appear only when deterministic tests, judges, or human feedback record one."
      ].join("\n")
    );
  });

  it("prints failed eval run classifications and report paths", () => {
    const output = formatEvalRunSummary(".", {
      runId: "003-failed",
      status: "failed",
      failureClassifications: ["scenario_failed", "deterministic_test_failed"],
      report: "/tmp/evals/runs/003-failed/report.html"
    });

    assert.equal(
      output,
      [
        "run: 003-failed",
        "status: failed",
        "failure classifications: scenario_failed, deterministic_test_failed",
        "report.html: /tmp/evals/runs/003-failed/report.html",
        "report.json: /tmp/evals/runs/003-failed/report.json"
      ].join("\n")
    );
    assert.doesNotMatch(output, /meta-skill report/);
  });

  it("rejects unsupported attached App Server endpoints before creating a run", async () => {
    await assert.rejects(
      runCommand(["eval", "run", ".", "--app-server-endpoint", "http://127.0.0.1:1234"]),
      (error) => error instanceof CliError && error.exitCode === 2 && /not supported yet/.test(error.message)
    );
  });

  it("does not expose unsupported eval scenario generation", async () => {
    const lines: string[] = [];
    const original = console.log;
    console.log = (value?: unknown) => {
      lines.push(String(value ?? ""));
    };
    try {
      await runCommand(["--help"]);
    } finally {
      console.log = original;
    }

    assert.doesNotMatch(lines.join("\n"), /eval generate/);
    await assert.rejects(
      runCommand(["eval", "generate", "."]),
      (error) => error instanceof CliError && error.exitCode === 2 && /supports init, run, judge/.test(error.message)
    );
  });

  it("prints the central report status view", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "meta-skill-command-report-"));
    const project = path.join(root, "command-report");
    await createSkill({
      target: project,
      slug: "command-report",
      description: "Use when testing command report output; not for publishing.",
      project: true
    });
    const lines: string[] = [];
    const original = console.log;
    console.log = (value?: unknown) => {
      lines.push(String(value ?? ""));
    };
    try {
      await runCommand(["report", project]);
    } finally {
      console.log = original;
    }

    assert.match(lines.join("\n"), /Meta Skill Report: command-report/);
    assert.match(lines.join("\n"), /Recommended Next Step/);
  });
});
