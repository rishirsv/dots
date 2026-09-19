import { expect, test } from "bun:test";
import { browserExecutionCheck, formatDoctorReport } from "../src/doctor";

test("doctor does not confuse transport health with a dead or unverified browser", () => {
  expect(browserExecutionCheck({ browser: "degraded", phase: "idle", lastFailure: { code: "browser_disconnected", at: "2026-09-19T00:00:00Z" } })).toMatchObject({
    id: "browser-execution", status: "error", detail: expect.stringContaining("browser_disconnected"),
  });
  expect(browserExecutionCheck({ browser: "unknown", phase: "active" })).toMatchObject({
    status: "warning", message: expect.stringContaining("unverified"),
  });
  const report = formatDoctorReport({ ok: true, checks: [{ id: "proxy", status: "ok", message: "Responses transport is healthy" }] });
  expect(report).toContain("transport ready; authenticated browser execution is not verified by status");
  expect(report).not.toContain("Doctor result: ready");
});

test("readiness never invents a quota or account diagnosis from an unknown browser failure", () => {
  const unknown = browserExecutionCheck({ browser: "degraded", phase: "idle", lastFailure: { code: "browser_disconnected" } });
  expect(unknown.message).toContain("restart Portal");
  expect(JSON.stringify(unknown)).not.toMatch(/quota|login|rate limit/i);
});
