import { describe, expect, test } from "bun:test";
import { negotiateDrain, prepareForcedRestart } from "../src/service";

describe("service drain lifecycle", () => {
  test("forced restart cancels active turns while admission is drained", async () => {
    const actions: string[] = [];
    const lease = await prepareForcedRestart(
      async () => {
        actions.push("drain");
        return { release: async () => { actions.push("resume"); } };
      },
      async () => { actions.push("cancel-active"); },
    );
    expect(actions).toEqual(["drain", "cancel-active"]);
    await lease.release();
    expect(actions).toEqual(["drain", "cancel-active", "resume"]);
  });

  test("unresponsive admin drain and cancellation do not veto a forced process replacement", async () => {
    const warnings: string[] = [];
    const actions: string[] = [];
    const lease = await prepareForcedRestart(
      async () => { actions.push("drain"); throw new Error("unresponsive"); },
      async () => { actions.push("cancel-active"); throw new Error("timed out"); },
      message => warnings.push(message),
    );
    await lease.release();
    expect(actions).toEqual(["drain", "cancel-active"]);
    expect(warnings).toHaveLength(2);
  });

  test("compensates when a drain may have reached the daemon before the client times out", async () => {
    const actions: string[] = [];
    let acceptingTurns = true;
    const control = async (action: "drain" | "resume") => {
      actions.push(action);
      acceptingTurns = action === "resume";
      if (action === "drain") throw new Error("request timed out after delivery");
      return { accepting_turns: true, active_http_turns: 0, active_browser_turns: 0 };
    };

    await expect(negotiateDrain(control)).rejects.toThrow("atomic idleness could not be proven");
    expect(actions).toEqual(["drain", "resume"]);
    expect(acceptingTurns).toBe(true);
  });


  test("can hold admission closed while active work is cancelled by the operation owner", async () => {
    const actions: string[] = [];
    const lease = await negotiateDrain(async action => {
      actions.push(action);
      return action === "drain"
        ? { accepting_turns: false, active_http_turns: 2, active_browser_turns: 1 }
        : { accepting_turns: true, active_http_turns: 0, active_browser_turns: 0 };
    }, { requireIdle: false });
    expect(actions).toEqual(["drain"]);
    await lease.release();
    expect(actions).toEqual(["drain", "resume"]);
  });

  test("releases a verified idle drain", async () => {
    const actions: string[] = [];
    const lease = await negotiateDrain(async action => {
      actions.push(action);
      return action === "drain"
        ? { accepting_turns: false, active_http_turns: 0, active_browser_turns: 0 }
        : { accepting_turns: true, active_http_turns: 0, active_browser_turns: 0 };
    });
    expect(actions).toEqual(["drain"]);
    await lease.release();
    expect(actions).toEqual(["drain", "resume"]);
  });
});
