import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseChildResultBlock, renderChildResultSummary } from "./child-result.ts";
import { CliError } from "../project.ts";

describe("Codex child result contract", () => {
  it("extracts a structured child result from a final response", () => {
    const parsed = parseChildResultBlock(`Here is the structured result:

{
  "meta_skill_child_result": {
    "run_id": "001-codex-parent-demo",
    "attempt_id": "attempt-a",
    "status": "completed",
    "decision_recommendation": "partial",
    "changed_files": ["plugins/meta-skill/src/codex-session/child-result.ts"],
    "validation": [{"command": "npm test", "outcome": "passed", "notes": "focused tests passed"}],
    "evidence_paths": [".meta-skill/runs/001-codex-parent-demo/attempts/attempt-a"],
    "risks": ["fixture session only"],
    "recommended_next_action": "harvest the child thread and inspect the diff"
  }
}

Human summary follows.`);

    assert.ok(parsed);
    assert.equal(parsed.result.run_id, "001-codex-parent-demo");
    assert.equal(parsed.result.status, "completed");
    assert.deepEqual(parsed.result.changed_files, ["plugins/meta-skill/src/codex-session/child-result.ts"]);
    assert.match(renderChildResultSummary(parsed.result), /Decision recommendation: partial/);
  });

  it("rejects malformed contract values", () => {
    assert.throws(
      () => parseChildResultBlock(`{"meta_skill_child_result":{"run_id":"r","attempt_id":"a","status":"done"}}`),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /status must be one of/);
        return true;
      }
    );
  });
});
