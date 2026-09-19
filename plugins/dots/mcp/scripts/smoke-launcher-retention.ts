/**
 * Proves the retained-conversation contract against Portal's real launcher client: one Codex
 * thread keeps one ChatGPT surface across turns. Requires a local Portal install with stored
 * ChatGPT login; it never sends a ChatGPT message or consumes a model turn.
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { getConfigPath } from "../src/config";
import { startLauncherBrowserHost } from "../src/launcher-host";
import {
  readLauncherBrowserHostDescriptor, notifyLauncherTurn, connectLauncherBrowserHost,
  releaseLauncherRetainedConversation,
} from "../src/launcher-browser-host";

const config = JSON.parse(readFileSync(getConfigPath(), "utf8"));
const workDir = mkdtempSync(join(tmpdir(), "portal-launcher-smoke-"));
const descriptorPath = join(workDir, "descriptor.json");
const key = "a".repeat(64);

const host = await startLauncherBrowserHost({
  chromeExecutablePath: config.chromeExecutablePath,
  storageStatePath: config.storageStatePath,
  profileDir: join(workDir, "host-profile"),
  descriptorPath,
  helperExecutable: process.execPath,
  helperScript: new URL(import.meta.url).pathname,
  headless: true,
});
try {
  const d = readLauncherBrowserHostDescriptor(descriptorPath);
  console.log("1. descriptor validates:", d.kind, "surfaces:", Object.keys(d.surfaceTargets).length);

  const lease = await notifyLauncherTurn(descriptorPath, {
    phase: "start", traceId: "t1", helperPid: process.pid,
    conversationKey: key, connectorIdentity: "Portal",
  });
  console.log("2. start ->", JSON.stringify(lease));
  if (lease.reused !== false) throw new Error("first lease must not be reused");

  const conn = await connectLauncherBrowserHost(descriptorPath, 20_000, lease.surfaceId);
  console.log("3. connected to leased surface; url:", conn.page.url().slice(0, 40));
  await conn.browser.close();

  console.log("4. heartbeat ->", JSON.stringify(await notifyLauncherTurn(descriptorPath, {
    phase: "heartbeat", traceId: "t1", helperPid: process.pid,
  })));

  console.log("5. end(retain) ->", JSON.stringify(await notifyLauncherTurn(descriptorPath, {
    phase: "end", traceId: "t1", helperPid: process.pid, status: "completed",
    retain: true, connectorBound: true,
  })));

  const second = await notifyLauncherTurn(descriptorPath, {
    phase: "start", traceId: "t2", helperPid: process.pid,
    conversationKey: key, connectorIdentity: "Portal", requireRetainedConversation: true,
  });
  console.log("6. second start ->", JSON.stringify(second));
  if (second.reused !== true) throw new Error("second lease MUST reuse the retained conversation");
  if (second.surfaceId !== lease.surfaceId) throw new Error("reused a different surface");
  if (second.connectorBound !== true) throw new Error("connector binding not retained");

  await notifyLauncherTurn(descriptorPath, {
    phase: "end", traceId: "t2", helperPid: process.pid, status: "completed", retain: true,
  });
  console.log("7. release ->", await releaseLauncherRetainedConversation(descriptorPath, key));

  const third = await notifyLauncherTurn(descriptorPath, {
    phase: "start", traceId: "t3", helperPid: process.pid,
    conversationKey: key, requireRetainedConversation: true,
  }).then(() => "NO ERROR", e => e.constructor.name);
  console.log("8. after release, requireRetained ->", third);
  if (third !== "LauncherRetainedConversationUnavailableError") throw new Error("expected typed unavailable error");

  console.log("CONTRACT VERIFIED");
} finally {
  await host.close();
}
