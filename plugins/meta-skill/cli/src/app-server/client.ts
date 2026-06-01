import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface AppServerConfig {
  mode: "managed" | "attached";
  endpoint: string | null;
  auth: "inherited";
  protocol: "generated-ts";
  generatedTypes: string;
}

export async function appServerConfig(endpoint?: string): Promise<AppServerConfig> {
  return {
    mode: endpoint ? "attached" : "managed",
    endpoint: endpoint || null,
    auth: "inherited",
    protocol: "generated-ts",
    generatedTypes: "codex app-server generate-ts snapshot"
  };
}

export async function codexVersion(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("codex", ["--version"], { timeout: 5000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

export class AppServerUnavailableError extends Error {
  constructor(message: string) {
    super(message);
  }
}
