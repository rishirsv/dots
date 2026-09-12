import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { Workspace } from "./workspace.js";

async function fixture(context, access = "workspace-write") {
  const repo = await mkdtemp(join(tmpdir(), "dots-workspace-"));
  const workspace = new Workspace({ repo, access });
  context.after(async () => { await workspace.close(); await rm(repo, { recursive: true, force: true }); });
  await workspace.start();
  return { repo, workspace };
}

test("reads, writes, and rejects stale writes", async context => {
  const { repo, workspace } = await fixture(context);
  await writeFile(join(repo, "note.txt"), "one");
  const first = await workspace.read("note.txt");
  assert.equal(first.text, "one");
  assert.match(first.sha256, /^[a-f0-9]{64}$/);
  const nextHash = await workspace.write("note.txt", "two", first.sha256);
  assert.equal((await workspace.read("note.txt")).sha256, nextHash);
  await assert.rejects(workspace.write("note.txt", "three", first.sha256), /conflict/i);
  await workspace.write("new.txt", "new", null);
  await assert.rejects(workspace.write("new.txt", "again", null), /already exists/i);
  assert.ok((await workspace.list()).some(entry => entry.fileName === "new.txt"));
});

test("read-only access denies direct and command writes", async context => {
  const { repo, workspace } = await fixture(context, "read-only");
  await assert.rejects(workspace.write("no.txt", "no", null), /read-only/i);
  const started = await workspace.exec({
    key: "readonly-command",
    command: [process.execPath, "-e", "require('fs').writeFileSync('no.txt','no')"],
  });
  const done = await workspace.terminal({ id: started.id, waitMs: 10000 });
  assert.equal(done.status, "exited");
  assert.notEqual(done.exitCode, 0);
  await assert.rejects(readFile(join(repo, "no.txt")), /ENOENT/);
});

test("terminal streams stdin and job keys do not replay", async context => {
  const { repo, workspace } = await fixture(context);
  const interactive = await workspace.exec({
    key: "stdin",
    command: [process.execPath, "-e", "process.stdin.once('data',d=>process.stdout.write('got:'+d))"],
  });
  assert.equal(interactive.status, "running");
  const replied = await workspace.terminal({ id: interactive.id, input: "hello", closeStdin: true, waitMs: 10000 });
  assert.equal(replied.status, "exited");
  assert.equal(replied.stdout, "got:hello");
  assert.equal(workspace.activeJobs, 0);

  const append = [process.execPath, "-e", "require('fs').appendFileSync('runs.txt','x')"];
  const once = await workspace.exec({ key: "once", command: append });
  const done = await workspace.terminal({ id: once.id, waitMs: 10000 });
  assert.equal(done.exitCode, 0);
  assert.deepEqual(await workspace.exec({ key: "once", command: append }), done);
  assert.equal(await readFile(join(repo, "runs.txt"), "utf8"), "x");
  await assert.rejects(workspace.exec({ key: "once", command: [process.execPath, "--version"] }), /different input/i);
});

test("reports ordinary command exit", async context => {
  const { workspace } = await fixture(context);
  const started = await workspace.exec({
    key: "exit",
    command: [process.execPath, "-e", "process.stdout.write('out');process.stderr.write('err');process.exit(7)"],
  });
  const done = await workspace.terminal({ id: started.id, waitMs: 10000 });
  assert.deepEqual({ status: done.status, stdout: done.stdout, stderr: done.stderr, exitCode: done.exitCode }, {
    status: "exited", stdout: "out", stderr: "err", exitCode: 7,
  });
});
