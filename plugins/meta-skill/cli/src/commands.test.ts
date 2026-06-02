import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatEvalRunSummary, runCommand } from "./commands";
import { CliError } from "./project";

describe("command output", () => {
  it("prints needs_review as unresolved evidence", () => {
    const output = formatEvalRunSummary(".", {
      runId: "001-basic",
      status: "needs_review",
      manualReviewRequired: true,
      failureClassifications: [],
      report: "/tmp/report.html"
    });

    assert.match(output, /status: needs_review/);
    assert.match(output, /manual review required: yes/);
    assert.match(output, /failure classifications: none/);
    assert.match(output, /needs_review is unresolved evidence, not pass proof/);
  });

  it("rejects unsupported attached App Server endpoints before creating a run", async () => {
    await assert.rejects(
      runCommand(["eval", "run", ".", "--app-server-endpoint", "http://127.0.0.1:1234"]),
      (error) => error instanceof CliError && error.exitCode === 2 && /not supported yet/.test(error.message)
    );
  });
});
