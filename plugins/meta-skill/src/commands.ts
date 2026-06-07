import { parseArgs as parseNodeArgs } from "node:util";
import { parseChildResultBlock, renderChildResultSummary } from "./codex-session/child-result.ts";
import { findCodexSessionPath, harvestCodexSession, parseCodexSession, type IsolationBackend, type ParentDecision } from "./codex-session/harvest.ts";
import { renderCodexRunView } from "./codex-session/view.ts";
import { generateEvalsFromScenarios, initEvals, runEval } from "./evals.ts";
import { lintProject } from "./lint.ts";
import { packageProject } from "./package.ts";
import { CliError } from "./project.ts";
import { formatLintReport } from "./lint.ts";
import { reviewSkill } from "./review.ts";
import { createSkill, initProject } from "./skills.ts";

const HELP = `meta-skill

Usage:
  meta-skill create [skill-dir] [--project] --slug <slug> --title <title> --description <text> --job <text>
  meta-skill project init <skill-dir>
  meta-skill evals create <project>
  meta-skill lint <project-or-skill> [--json]
  meta-skill review <project-or-skill>
  meta-skill run <project> [--eval <id>] [--label "..."] [--concurrency <n>] [--turn-timeout-ms <ms>] [--trace-buffer-events <count>] [--no-skill] [--no-lint]
  meta-skill harvest <project> (--session <jsonl>|--thread <thread-id>) --run <run-id> --attempt <attempt-id> [--eval <id>]
  meta-skill child-result parse (--session <jsonl>|--thread <thread-id>) [--json]
  meta-skill view <project> --run <run-id>
  meta-skill package <project> [--out <zip>] [--out-dir <dir>]
`;

export async function runCommand(argv: string[]): Promise<number> {
  if (!argv.length || argv[0] === "--help" || argv[0] === "-h") {
    console.log(HELP);
    return 0;
  }

  const [command, ...rest] = argv;
  switch (command) {
    case "create":
      return commandCreate(rest);
    case "project":
      return commandProject(rest);
    case "evals":
      return commandEvals(rest);
    case "lint":
      return commandLint(rest);
    case "review":
      return commandReview(rest);
    case "run":
      return commandRun(rest);
    case "harvest":
      return commandHarvest(rest);
    case "child-result":
      return commandChildResult(rest);
    case "view":
      return commandView(rest);
    case "package":
      return commandPackage(rest);
    default:
      throw new CliError(`unknown command: ${command}\n\n${HELP}`, 2);
  }
}

async function commandCreate(argv: string[]): Promise<number> {
  const args = parse(argv, ["slug", "title", "description", "job", "runtime-reference", "runtime-script", "runtime-asset"], ["project", "force"]);
  const result = await createSkill({
    target: args.positionals[0],
    slug: args.one("slug"),
    title: args.one("title"),
    description: args.one("description"),
    job: args.one("job"),
    project: args.has("project"),
    force: args.has("force"),
    runtimeReferences: args.many("runtime-reference"),
    runtimeScripts: args.many("runtime-script"),
    runtimeAssets: args.many("runtime-asset")
  });
  console.log(`created ${result.project ? "skill project" : "portable skill"}: ${result.path}`);
  console.log(`files: ${result.files.join(", ")}`);
  console.log(`next step: meta-skill lint ${shellPath(result.path)}`);
  return 0;
}

async function commandProject(argv: string[]): Promise<number> {
  const [subcommand, ...rest] = argv;
  if (subcommand !== "init") throw new CliError("project command supports only: meta-skill project init <skill-dir>", 2);
  const args = parse(rest, [], ["force"]);
  const target = args.positionals[0];
  if (!target) throw new CliError("project init requires <skill-dir>", 2);
  const result = await initProject(target, { force: args.has("force") });
  await initEvals(result.path);
  console.log(`initialized .meta-skill workbench: ${result.path}`);
  console.log(`next step: add evals, then meta-skill run ${shellPath(result.path)}`);
  return 0;
}

async function commandEvals(argv: string[]): Promise<number> {
  const [subcommand, ...rest] = argv;
  if (subcommand !== "create") throw new CliError("evals command supports only: meta-skill evals create <project>", 2);
  const args = parse(rest, [], []);
  const project = args.positionals[0] || ".";
  const result = await generateEvalsFromScenarios(project);
  console.log(`scenarios: ${result.scenariosPath}`);
  console.log(`created evals: ${result.created.length ? result.created.join(", ") : "(none)"}`);
  if (result.skipped.length) console.log(`skipped existing scenarios: ${result.skipped.join(", ")}`);
  return 0;
}

async function commandLint(argv: string[]): Promise<number> {
  const args = parse(argv, [], ["json"]);
  const target = args.positionals[0] || ".";
  const report = await lintProject(target);
  if (args.has("json")) console.log(JSON.stringify(report, null, 2));
  else console.log(formatLintReport(report));
  return report.ok ? 0 : 1;
}

async function commandReview(argv: string[]): Promise<number> {
  const args = parse(argv, [], []);
  const target = args.positionals[0] || ".";
  const result = await reviewSkill(target);
  console.log(`review: ${result.reviewPath}`);
  console.log("quality score: agent review required");
  console.log(`validation score: ${result.validationScore}%`);
  return 0;
}

async function commandRun(argv: string[]): Promise<number> {
  const args = parse(argv, ["eval", "label", "concurrency", "turn-timeout-ms", "trace-buffer-events"], ["no-skill", "no-lint"]);
  const project = args.positionals[0] || ".";
  const result = await runEval({
    project,
    selector: { eval: args.many("eval") },
    label: args.one("label"),
    runSource: args.has("no-skill") ? "no_skill" : "working_payload",
    noLint: args.has("no-lint"),
    concurrency: positiveInteger(args.one("concurrency"), "--concurrency"),
    turnTimeoutMs: positiveInteger(args.one("turn-timeout-ms"), "--turn-timeout-ms"),
    traceBufferEvents: positiveInteger(args.one("trace-buffer-events"), "--trace-buffer-events")
  });
  console.log(`run: ${result.runId}`);
  console.log(`path: ${result.runRoot}`);
  if (result.payload) console.log(`skill: ${result.payload.skill_md}`);
  console.log(`evals: ${result.evals.join(", ")}`);
  for (const item of result.results) {
    const score = item.score === null ? `review required/${item.max_score}` : `${item.score}/${item.max_score}`;
    console.log(`score: ${item.folder} ${score}`);
    console.log(`rubric: ${item.folder} ${item.criteria_sha256}`);
  }
  if (result.errors.length) {
    console.log("errors:");
    for (const error of result.errors) console.log(`- ${error}`);
  }
  return result.ok ? 0 : 1;
}

async function commandHarvest(argv: string[]): Promise<number> {
  const args = parse(argv, ["session", "thread", "session-root", "run", "attempt", "eval", "parent-thread", "isolation", "decision", "parent-review"], []);
  const project = args.positionals[0] || ".";
  const result = await harvestCodexSession({
    project,
    sessionPath: args.one("session"),
    threadId: args.one("thread"),
    sessionRoot: args.one("session-root"),
    runId: required(args.one("run"), "--run"),
    attemptId: required(args.one("attempt"), "--attempt"),
    evalId: args.one("eval"),
    parentThreadId: args.one("parent-thread"),
    isolationBackend: enumValue(args.one("isolation"), ["git-worktree", "scratch-copy", "local-thread", "unknown"], "--isolation"),
    decision: enumValue(args.one("decision"), ["accepted", "rejected", "partial", "review-required", "follow-up", "errored"], "--decision"),
    parentReview: args.one("parent-review")
  });
  console.log(`harvest: ${result.attemptRoot}`);
  console.log(`turns: ${result.turnCount}`);
  console.log(`items: ${result.itemCount}`);
  console.log(`final: ${result.finalPath}`);
  console.log(`manifest: ${result.manifestPath}`);
  console.log(`child result: ${result.childResultPath || "(not found)"}`);
  console.log(`parent summary: ${result.parentSummaryPath}`);
  return 0;
}

async function commandChildResult(argv: string[]): Promise<number> {
  const [subcommand, ...rest] = argv;
  if (subcommand !== "parse") throw new CliError("child-result command supports only: meta-skill child-result parse (--session <jsonl>|--thread <thread-id>)", 2);
  const args = parse(rest, ["session", "thread", "session-root"], ["json"]);
  const sessionPath = args.one("session") || await findCodexSessionPath(required(args.one("thread"), "--thread or --session"), args.one("session-root"));
  const session = await parseCodexSession(sessionPath);
  const parsed = parseChildResultBlock(session.finalText);
  if (!parsed) throw new CliError("no meta_skill_child_result block found in child final response", 1);
  if (args.has("json")) console.log(JSON.stringify(parsed.result, null, 2));
  else console.log(renderChildResultSummary(parsed.result));
  return 0;
}

async function commandView(argv: string[]): Promise<number> {
  const args = parse(argv, ["run"], []);
  const project = args.positionals[0] || ".";
  const runId = required(args.one("run"), "--run");
  console.log(await renderCodexRunView(project, runId));
  return 0;
}

async function commandPackage(argv: string[]): Promise<number> {
  const args = parse(argv, ["out", "out-dir"], []);
  const project = args.positionals[0] || ".";
  const result = await packageProject({ project, out: args.one("out"), outDir: args.one("out-dir") });
  console.log(`package: ${result.artifact}`);
  console.log(`metadata: ${result.metadata}`);
  console.log(`files: ${result.files.join(", ")}`);
  return 0;
}

function parse(argv: string[], valueFlags: string[], booleanFlags: string[]) {
  try {
    const parsed = parseNodeArgs({
      args: argv,
      allowPositionals: true,
      options: Object.fromEntries([
        ...valueFlags.map((name) => [name, { type: "string", multiple: true }] as const),
        ...booleanFlags.map((name) => [name, { type: "boolean" }] as const)
      ])
    });
    const values = parsed.values as Record<string, unknown>;
    return {
      positionals: parsed.positionals,
      one: (name: string) => stringValues(values[name]).at(-1),
      many: (name: string) => stringValues(values[name]),
      has: (name: string) => values[name] === true
    };
  } catch (error) {
    if (isParseArgsError(error)) throw new CliError(error.message, 2);
    throw error;
  }
}

function stringValues(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}

function positiveInteger(value: string | undefined, label: string): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new CliError(`${label} must be a positive integer`, 2);
  return parsed;
}

function required(value: string | undefined, label: string): string {
  if (!value) throw new CliError(`requires ${label}`, 2);
  return value;
}

function enumValue<T extends string>(value: string | undefined, allowed: readonly T[], label: string): T | undefined {
  if (value === undefined) return undefined;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new CliError(`${label} must be one of: ${allowed.join(", ")}`, 2);
}

function isParseArgsError(error: unknown): error is Error {
  return error instanceof TypeError && /^ERR_PARSE_ARGS_/.test(String((error as { code?: unknown }).code));
}

function shellPath(target: string): string {
  return target.includes(" ") ? JSON.stringify(target) : target;
}
