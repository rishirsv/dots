import { commandInit } from "./commands/init.ts";
import { commandSkillNew } from "./commands/skill.ts";
import { runAddThread, runCheck, runExtract, runNew } from "./commands/run.ts";
import { printHelp, printRunHelp, printSkillHelp } from "./help.ts";

function parseNamedArg(argv: string[], name: string): string | undefined {
  const withEquals = argv.find((value) => value.startsWith(`--${name}=`));
  if (withEquals) {
    return withEquals.slice(withEquals.indexOf("=") + 1);
  }
  const index = argv.findIndex((value) => value === `--${name}`);
  if (index >= 0 && argv[index + 1]) {
    return argv[index + 1];
  }
  return undefined;
}

function hasArg(argv: string[], name: string): boolean {
  return argv.includes(`--${name}`);
}

export async function runCli(argv: string[], cwd = process.cwd()): Promise<void> {
  const command = argv[0];
  if (!command || ["-h", "--help"].includes(command)) {
    printHelp();
    return;
  }

  if (command === "init") {
    const result = await commandInit(cwd);
    const created = result.created.filter((path) => path);
    if (created.length > 0) {
      console.log("Created:");
      for (const path of created) {
        console.log(`  ${path}`);
      }
    } else {
      console.log("No files created.");
    }
    return;
  }

  if (command === "skill") {
    const sub = argv[1];
    if (!sub || ["-h", "--help"].includes(sub)) {
      printSkillHelp();
      return;
    }
    if (sub !== "new") {
      throw new Error(`unknown msk skill command: ${sub}`);
    }
    const slug = argv[2];
    if (!slug) {
      throw new Error("msk skill new requires <slug>");
    }
    const description = parseNamedArg(argv, "description");
    await commandSkillNew(cwd, slug, { description });
    console.log(`Created skill scaffold at ./${slug}/SKILL.md`);
    return;
  }

  if (command === "run") {
    const sub = argv[1];
    if (!sub || ["-h", "--help"].includes(sub)) {
      printRunHelp();
      return;
    }
    switch (sub) {
      case "new": {
        const runId = argv[2];
        if (!runId) {
          throw new Error("msk run new requires <run-id>");
        }
        await runNew(cwd, runId);
        console.log(`Created ${runId} at .meta-skill/runs/${runId}/run.json`);
        return;
      }
      case "add-thread": {
        const runId = argv[2];
        if (!runId) {
          throw new Error("msk run add-thread requires <run-id>");
        }
        const taskId = parseNamedArg(argv, "task");
        const threadId = parseNamedArg(argv, "thread");
        if (!taskId || !threadId) {
          throw new Error("msk run add-thread requires --task and --thread");
        }
        const attempt = await runAddThread(cwd, {
          runId,
          taskId,
          threadId,
          attemptId: parseNamedArg(argv, "attempt"),
        });
        console.log(`Added/updated attempt: ${attempt}`);
        return;
      }
      case "extract": {
        const runId = argv[2];
        if (!runId) {
          throw new Error("msk run extract requires <run-id>");
        }
        const exports = [];
        for (let i = 0; i < argv.length; i += 1) {
          if (argv[i] === "--thread-export" && argv[i + 1]) {
            exports.push(argv[i + 1]);
            i += 1;
          }
        }
        if (exports.length === 0) {
          throw new Error("msk run extract requires at least one --thread-export");
        }
        const append = hasArg(argv, "append");
        const rebuild = hasArg(argv, "rebuild");
        const mode: "rebuild" | "append" = append ? "append" : "rebuild";
        if (rebuild && append) {
          throw new Error("choose one of --rebuild or --append");
        }
        const wrote = await runExtract(cwd, runId, exports, mode);
        console.log(`Wrote ${wrote} rows to .meta-skill/runs/${runId}/results.jsonl`);
        return;
      }
      case "check": {
        const runId = argv[2];
        if (!runId) {
          throw new Error("msk run check requires <run-id>");
        }
        const summary = await runCheck(cwd, runId);
        console.log(`expected_attempts: ${summary.expected_attempts}`);
        console.log(`extracted_rows: ${summary.extracted_rows}`);
        console.log(`degraded_rows: ${summary.degraded_rows}`);
        console.log(`missing_rows: ${summary.missing_rows}`);
        return;
      }
      default:
        throw new Error(`unknown msk run command: ${sub}`);
    }
  }

  throw new Error(`unknown command: ${command}`);
}

export function printUsage(): void {
  printHelp();
}
