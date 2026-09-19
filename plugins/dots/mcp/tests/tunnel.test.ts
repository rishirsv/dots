import { describe, expect, test } from "bun:test";
import { TUNNEL_VERSION, parseServiceTunnelStatus, parseTunnelStatus, tunnelClientInstallAction, tunnelCommandOutput, tunnelConnectLaunchError } from "../src/tunnel";

test("pins the fixed tunnel-client and migrates only the current release predecessor", () => {
  expect(TUNNEL_VERSION).toBe("0.0.14");
  expect(tunnelClientInstallAction("0.0.14")).toBe("reuse");
  expect(tunnelClientInstallAction("0.0.12")).toBe("upgrade");
  expect(() => tunnelClientInstallAction("0.0.10")).toThrow("not a trusted upgrade source");
  expect(() => tunnelClientInstallAction("0.0.11")).toThrow("not a trusted upgrade source");
  expect(() => tunnelClientInstallAction("9.9.9")).toThrow("not a trusted upgrade source");
});

describe("tunnel status boundary", () => {
  test("requires the exact alias to have a locally verified ready runtime", () => {
    expect(parseTunnelStatus(JSON.stringify({
      entries: [{ alias: "ours", runtime_state: "ready" }],
    }), "ours")).toEqual({
      ok: true,
      processRunning: true,
      healthy: true,
      ready: true,
      state: "ready",
      detail: "process_running=true healthy=true ready=true",
    });
    for (const state of ["stopped", "starting", "healthy"]) {
      expect(parseTunnelStatus(JSON.stringify({ entries: [
        { alias: "other", runtime_state: "ready" }, { alias: "ours", runtime_state: state },
      ] }), "ours")).toMatchObject({
        ok: false, processRunning: state !== "stopped", healthy: state === "healthy", ready: false,
      });
    }
  });

  test("redacts tunnel ids and keys from safe diagnostics", () => {
    const result = parseTunnelStatus(
      "failed tunnel_0123456789abcdef0123456789abcdef with sk-secretsecretsecret",
      "ours",
      1,
    );
    expect(result.detail).toBe("failed [tunnel-id] with [redacted-key]");
    expect(result.detail).not.toContain("0123456789abcdef");
  });

  test("surfaces and redacts an immediate managed-runtime launch failure", () => {
    const detail = tunnelConnectLaunchError(JSON.stringify({
      running: false,
      healthy: false,
      ready: false,
      exit_code: 1,
      launch_diagnostics: {
        log_tail: "403 for tunnel_0123456789abcdef0123456789abcdef using sk-secretsecretsecret",
      },
    }));

    expect(detail).toBe(
      "running=false; healthy=false; ready=false; exit_code=1; runtime_log=403 for [tunnel-id] using [redacted-key]",
    );
  });

  test("accepts a healthy managed launch while setup waits for control-plane readiness", () => {
    expect(tunnelConnectLaunchError(JSON.stringify({
      running: true,
      healthy: true,
      ready: true,
    }))).toBeUndefined();

    expect(tunnelConnectLaunchError(JSON.stringify({
      running: true,
      healthy: true,
      ready: false,
    }))).toBeUndefined();

    expect(tunnelConnectLaunchError(JSON.stringify({
      running: true,
      healthy: false,
      ready: false,
    }))).toContain("running=true; healthy=false; ready=false");

    expect(tunnelConnectLaunchError("not json")).toBe("tunnel-client returned non-JSON connect output");
  });

  test("a competing local alias for the same tunnel never satisfies Portal readiness", () => {
    const tunnelId = "tunnel_0123456789abcdef0123456789abcdef";
    const result = parseTunnelStatus(JSON.stringify({ entries: [
      { alias: "portal", tunnel_id: tunnelId, runtime_state: "stopped" },
      { alias: "legacy-portal", tunnel_id: tunnelId, runtime_state: "ready" },
    ] }), "portal", 0, tunnelId);
    expect(result).toMatchObject({
      ok: false, processRunning: false, healthy: false, ready: false, state: "stopped",
    });
    expect(result.detail).toContain("same_tunnel_ready_under_other_alias=legacy-portal");
    expect(result.detail).toContain("Portal requires alias=portal");
    expect(result.detail).not.toContain(tunnelId);
  });

  test("a ready Portal alias for a different tunnel never satisfies readiness", () => {
    const result = parseTunnelStatus(JSON.stringify({ entries: [
      { alias: "portal", tunnel_id: "tunnel_wrong", runtime_state: "ready" },
    ] }), "portal", 0, "tunnel_expected");
    expect(result).toMatchObject({
      ok: false, processRunning: true, healthy: true, ready: true, state: "ready",
    });
    expect(result.detail).toContain("selected_alias_tunnel_id_mismatch=true");
    expect(result.detail).not.toContain("tunnel_wrong");
    expect(result.detail).not.toContain("tunnel_expected");
  });

  test("accepts direct health evidence for a launchd-managed runtime absent from the registry", () => {
    const tunnelId = "tunnel_0123456789abcdef0123456789abcdef";
    const result = parseServiceTunnelStatus(JSON.stringify({
      alias: "portal",
      tunnel_id: tunnelId,
      process_running: false,
      healthy: true,
      ready: true,
      local: {
        effective_health: {
          healthz: { ok: true, status: 200 },
          readyz: { ok: true, status: 200 },
        },
      },
    }), "portal", true, 0, tunnelId);
    expect(result).toEqual({
      ok: true,
      processRunning: true,
      healthy: true,
      ready: true,
      detail: "process_running=true healthy=true ready=true",
    });
  });

  test("does not accept direct health from another alias or tunnel", () => {
    const result = parseServiceTunnelStatus(JSON.stringify({
      alias: "legacy-portal",
      tunnel_id: "tunnel_wrong",
      process_running: false,
      healthy: true,
      ready: true,
      local: {
        effective_health: {
          healthz: { ok: true },
          readyz: { ok: true },
        },
      },
    }), "portal", true, 0, "tunnel_expected");
    expect(result).toMatchObject({ ok: false, ready: false });
    expect(result.detail).toContain("invalid runtime status");
  });

  test("does not accept a stale health URL without both live probes", () => {
    const result = parseServiceTunnelStatus(JSON.stringify({
      alias: "portal",
      tunnel_id: "tunnel_0123456789abcdef0123456789abcdef",
      process_running: false,
      healthy: true,
      ready: true,
      local: {
        effective_health: {
          healthz: { ok: true },
          readyz: { ok: false },
        },
      },
    }), "portal", true, 0, "tunnel_0123456789abcdef0123456789abcdef");
    expect(result).toMatchObject({ ok: false, processRunning: true, healthy: true, ready: false });
    expect(result.detail).toContain("direct_health_probes_incomplete=true");
  });

  test("requires independent service proof and both direct probes", () => {
    const status = JSON.stringify({
      alias: "portal",
      tunnel_id: "tunnel_0123456789abcdef0123456789abcdef",
      process_running: true,
      healthy: true,
      ready: true,
    });
    expect(parseServiceTunnelStatus(
      status,
      "portal",
      true,
      0,
      "tunnel_0123456789abcdef0123456789abcdef",
    )).toMatchObject({ ok: false, processRunning: true, healthy: false, ready: false });
    expect(parseServiceTunnelStatus(
      status,
      "portal",
      false,
      0,
      "tunnel_0123456789abcdef0123456789abcdef",
    )).toMatchObject({ ok: false, processRunning: false, healthy: false, ready: false });
  });

  test("preserves independent process proof when runtime status fails", () => {
    expect(parseServiceTunnelStatus("status failed", "portal", true, 1)).toEqual({
      ok: false,
      processRunning: true,
      healthy: false,
      ready: false,
      detail: "status failed",
    });
    expect(parseServiceTunnelStatus("invalid JSON", "portal", true)).toMatchObject({
      ok: false,
      processRunning: true,
      healthy: false,
      ready: false,
    });
  });

  test("missing, ambiguous, or malformed local inventory cannot report ready", () => {
    const ready = { alias: "ours", runtime_state: "ready" };
    for (const output of ["invalid JSON", "{}", JSON.stringify({ entries: [ready, ready] }),
      JSON.stringify({ entries: [{ ...ready, runtime_state: "unknown" }] })]) {
      expect(parseTunnelStatus(output, "ours")).toMatchObject({ ok: false, ready: false });
      expect(parseTunnelStatus(output, "ours").detail).toContain("invalid local inventory");
    }
    expect(parseTunnelStatus(JSON.stringify({ entries: [{ ...ready, alias: "other" }] }), "ours"))
      .toMatchObject({ ok: false, processRunning: false, healthy: false, ready: false, state: "stopped" });
  });

  test("status diagnostics do not discard stderr when a failed command also wrote stdout", () => {
    expect(tunnelCommandOutput({
      status: 1,
      stdout: '{"partial":true}',
      stderr: "runtime process exited with status 1",
    })).toBe('runtime process exited with status 1\n{"partial":true}');
    expect(tunnelCommandOutput({
      status: 0,
      stdout: '{"ready":true}',
      stderr: "non-fatal warning",
    })).toBe('{"ready":true}');
  });
});
