import { commandInit } from "./commands/init.js";
import { commandSkillNew } from "./commands/skill.js";
import { runAddThread, runExtract, runNew, runReport } from "./commands/run.js";
import { printHelp } from "./help.js";

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
    if (sub !== "new") {
      throw new Error("Usage: msk skill new <slug> [--description <text>]");
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
    const runId = argv[2];
    if (!runId) {
      throw new Error("msk run <command> requires <run-id>");
    }
    switch (sub) {
      case "new": {
        await runNew(cwd, runId);
        console.log(`Created ${runId} at .meta-skill/runs/${runId}/run.json`);
        return;
      }
      case "add-thread": {
        const taskId = parseNamedArg(argv, "task");
        const variantId = parseNamedArg(argv, "variant");
        const threadId = parseNamedArg(argv, "thread");
        if (!taskId || !variantId || !threadId) {
          throw new Error("msk run add-thread requires --task, --variant, and --thread");
        }
        const attempt = await runAddThread(cwd, {
          runId,
          taskId,
          variantId,
          threadId,
          attemptId: parseNamedArg(argv, "attempt"),
        });
        console.log(`Added/updated attempt: ${attempt}`);
        return;
      }
      case "extract": {
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
      case "report": {
        const report = await runReport(cwd, runId);
        console.log(`Wrote report: ${report}`);
        return;
      }
      default:
        throw new Error("Usage: msk run [new|add-thread|extract|report] <run-id>");
    }
  }

  throw new Error(`unknown command: ${command}`);
}

export function printUsage(): void {
  printHelp();
}
