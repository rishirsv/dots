import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCommand } from "./commands.ts";

describe("commands", () => {
  it("prints the flat command surface", async () => {
    const logs: string[] = [];
    const original = console.log;
    console.log = (message?: unknown) => {
      logs.push(String(message ?? ""));
    };
    try {
      assert.equal(await runCommand(["--help"]), 0);
    } finally {
      console.log = original;
    }

    const help = logs.join("\n");
    assert.match(help, /meta-skill run <project>/);
    assert.doesNotMatch(help, /meta-skill report/);
    assert.doesNotMatch(help, /meta-skill review/);
    assert.doesNotMatch(help, /meta-skill decide/);
    assert.doesNotMatch(help, /meta-skill feedback/);
    assert.doesNotMatch(help, /meta-skill judge/);
    assert.match(help, /meta-skill package <project>/);
    assert.doesNotMatch(help, /meta-skill plan/);
    assert.doesNotMatch(help, /meta-skill promote/);
  });
});
