import { describe, expect, test } from "bun:test";

function portal(...args: string[]) {
  return Bun.spawnSync({ cmd: [process.execPath, "src/cli.ts", ...args], cwd: process.cwd() });
}

describe("Portal CLI", () => {
  test("documents the five public lifecycle commands and no removed modes", () => {
    const result = portal("--help");
    const output = result.stdout.toString();
    expect(result.exitCode).toBe(0);
    for (const command of ["start", "login", "status", "stop", "uninstall"]) {
      expect(output).toContain(`portal ${command}`);
    }
    expect(output).not.toContain("browser-only");
    expect(output).not.toContain("zero-risk");
    expect(output).not.toContain("bigger-context");
    expect(output).not.toContain("skill-attachments");
    expect(output).not.toContain("dev ");
    expect(output).not.toContain("browser-host-descriptor");
    // The launcher browser host is a supported transport: it retains one ChatGPT conversation per
    // Codex thread. The manual and zero-risk flows that share that host stay unavailable.
    expect(output).toContain("--browser-host MODE");
    expect(output).not.toContain("manual");
    expect(output).toContain("portal uninstall [--yes] [--purge-data]");
    expect(output).not.toContain("--keep-data");
  });

  test("uses Portal branding and keeps internal commands out of public help", () => {
    const output = portal("--help").stdout.toString();
    expect(output).toStartWith("Portal ");
    expect(output).not.toContain("portal serve");
    expect(output).not.toContain("portal mcp");
    expect(output).not.toContain("portal hook");
  });

  test("reports missing configuration with the start recovery command", () => {
    const result = Bun.spawnSync({
      cmd: [process.execPath, "src/cli.ts", "status", "--json"],
      cwd: process.cwd(),
      env: { ...process.env, PORTAL_HOME: `/tmp/portal-cli-${process.pid}-${crypto.randomUUID()}` },
    });
    expect(result.exitCode).toBe(1);
    expect(result.stdout.toString()).toContain("Run portal start first");
  });
});
