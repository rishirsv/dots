import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const home = mkdtempSync(join(tmpdir(), "portal-launcher-config-"));
process.env.PORTAL_HOME = home;

const {
  defaultConfig, saveConfig, loadConfig, loadConfigForSetup, defaultLauncherDescriptorPath, getConfigPath,
} = await import("../src/config");

function writeRaw(mutate: (raw: Record<string, unknown>) => void): void {
  const raw = JSON.parse(readFileSync(getConfigPath(), "utf8")) as Record<string, unknown>;
  mutate(raw);
  writeFileSync(getConfigPath(), `${JSON.stringify(raw, null, 2)}\n`);
}

function seedValidConfig(): void {
  const config = defaultConfig();
  config.releaseVersion = "0.0.0";
  config.tunnel = {
    binaryPath: join(home, "bin", "tunnel-client"),
    tunnelId: "tunnel_0123456789abcdef0123456789abcdef",
    runtimeKeyFile: join(home, "secrets", "tunnel-runtime.key"),
    profileDir: join(home, "tunnel", "profiles"),
    profileName: "portal",
    alias: "portal",
  };
  saveConfig(config);
}

describe("launcher browser host configuration", () => {
  test("keeps a stored launcher host and its descriptor through setup reload", () => {
    seedValidConfig();
    const descriptorPath = defaultLauncherDescriptorPath(home);
    writeRaw(raw => {
      raw.browserHost = "launcher";
      raw.browserHostDescriptorPath = descriptorPath;
    });

    const reloaded = loadConfigForSetup();
    expect(reloaded.browserHost).toBe("launcher");
    expect(reloaded.browserHostDescriptorPath).toBe(descriptorPath);
  });

  test("still pins any other host to managed-chrome and drops a stray descriptor", () => {
    seedValidConfig();
    writeRaw(raw => { raw.browserHostDescriptorPath = "/tmp/should-be-dropped.json"; });

    const reloaded = loadConfigForSetup();
    expect(reloaded.browserHost).toBe("managed-chrome");
    expect(reloaded.browserHostDescriptorPath).toBeUndefined();
  });

  test("rejects a launcher host with no descriptor path", () => {
    seedValidConfig();
    writeRaw(raw => { raw.browserHost = "launcher"; });

    expect(() => loadConfig()).toThrow("requires browserHostDescriptorPath");
  });

  test("rejects a descriptor path on the managed-chrome host", () => {
    seedValidConfig();
    writeRaw(raw => { raw.browserHostDescriptorPath = "/tmp/stray.json"; });

    expect(() => loadConfig()).toThrow("only valid for the launcher browser host");
  });
});
