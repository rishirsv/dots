import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { importFeedback, initEvals, judgeRun, listRuns, openRun, runEval } from "./evals";
import { decideSession, planImprovement, promotePlan } from "./improve";
import { formatLintReport, lintProject } from "./lint";
import { packageProject } from "./package";
import { CliError } from "./project";
import { reviewProject } from "./review";
import { createSkill, initProject } from "./skills";
import { releaseProject } from "./versions";

const execFileAsync = promisify(execFile);

const HELP = `meta-skill v1

Usage:
  meta-skill create [skill-dir] [--project] --slug <slug> --title <title> --description <text> --job <text>
  meta-skill project init <skill-dir>
  meta-skill lint <project-or-skill> [--run <run-id>] [--json]
  meta-skill review <project> [--json]
  meta-skill eval init <project>
  meta-skill eval run <project> [--scenario <id>] [--family <R|F|T|G>] [--topic <topic>] [--label "..."] [--compare release] [--with-judges] [--no-lint]
  meta-skill eval judge <project> --run <run-id> (--judge <id> | --all-judges) (--scenario <id> | --all-scenarios)
  meta-skill eval feedback import <project> --run <run-id> <feedback.jsonl>
  meta-skill eval open <project> [--run <run-id>] [--list]
  meta-skill plan <project> [--from-run <run-id>] [--from-review <review-id>]
  meta-skill promote <project> --plan <plan-id>
  meta-skill decide <project> --session <session-id> --accept | --reject
  meta-skill release <project>
  meta-skill package <project> [--source candidate|release] [--out <zip>] [--out-dir <dir>]
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
    case "lint":
      return commandLint(rest);
    case "review":
      return commandReview(rest);
    case "eval":
      return commandEval(rest);
    case "plan":
      return commandPlan(rest);
    case "promote":
      return commandPromote(rest);
    case "decide":
      return commandDecide(rest);
    case "release":
      return commandRelease(rest);
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
  console.log(`initialized .meta-skill workbench: ${result.path}`);
  console.log(`next step: meta-skill lint ${shellPath(result.path)}`);
  return 0;
}

async function commandLint(argv: string[]): Promise<number> {
  const args = parse(argv, ["run"], ["json"]);
  const target = args.positionals[0] || ".";
  const report = await lintProject(target, { runId: args.one("run") });
  if (args.has("json")) console.log(JSON.stringify(report, null, 2));
  else console.log(formatLintReport(report));
  return report.ok ? 0 : 1;
}

async function commandReview(argv: string[]): Promise<number> {
  const args = parse(argv, [], ["json"]);
  const project = args.positionals[0] || ".";
  const result = await reviewProject(project);
  if (args.has("json")) console.log(JSON.stringify(result.data, null, 2));
  else {
    console.log(`review: ${result.reviewId}`);
    console.log(`score: ${result.score}/100`);
    console.log(`report: ${result.report}`);
    console.log(`next step: meta-skill plan ${shellPath(project)} --from-review ${result.reviewId}`);
  }
  return 0;
}

async function commandEval(argv: string[]): Promise<number> {
  const [subcommand, ...rest] = argv;
  switch (subcommand) {
    case "init":
      return commandEvalInit(rest);
    case "run":
      return commandEvalRun(rest);
    case "judge":
      return commandEvalJudge(rest);
    case "feedback":
      return commandEvalFeedback(rest);
    case "open":
      return commandEvalOpen(rest);
    default:
      throw new CliError("eval command supports init, run, judge, feedback import, and open", 2);
  }
}

async function commandEvalInit(argv: string[]): Promise<number> {
  const args = parse(argv, [], []);
  const project = args.positionals[0] || ".";
  const result = await initEvals(project);
  console.log(`eval workbench: ${result.path}`);
  for (const warning of result.warnings) console.log(`warning: ${warning}`);
  console.log(`next step: add scenarios, then meta-skill eval run ${shellPath(project)}`);
  return 0;
}

async function commandEvalRun(argv: string[]): Promise<number> {
  const args = parse(argv, ["scenario", "family", "topic", "label", "compare", "app-server-endpoint"], ["with-judges", "no-lint"]);
  const project = args.positionals[0] || ".";
  const compare = args.one("compare");
  if (compare && compare !== "release") throw new CliError("eval run supports only --compare release", 2);
  const family = args.one("family");
  if (family && !["R", "F", "T", "G"].includes(family)) throw new CliError("--family must be one of R, F, T, G", 2);
  const result = await runEval({
    project,
    selector: { scenario: args.many("scenario"), family, topic: args.many("topic") },
    label: args.one("label"),
    compare: compare as "release" | undefined,
    withJudges: args.has("with-judges"),
    noLint: args.has("no-lint"),
    appServerEndpoint: args.one("app-server-endpoint")
  });
  console.log(`run: ${result.runId}`);
  console.log(`report: ${result.report}`);
  console.log(`next step: meta-skill eval open ${shellPath(project)} --run ${result.runId}`);
  return result.ok ? 0 : 1;
}

async function commandEvalJudge(argv: string[]): Promise<number> {
  const args = parse(argv, ["run", "judge", "scenario"], ["all-judges", "all-scenarios"]);
  const project = args.positionals[0] || ".";
  const runId = args.one("run");
  if (!runId) throw new CliError("eval judge requires --run <run-id>", 2);
  const result = await judgeRun({
    project,
    runId,
    judge: args.one("judge"),
    allJudges: args.has("all-judges"),
    scenario: args.one("scenario"),
    allScenarios: args.has("all-scenarios")
  });
  console.log(`judge annotations: ${result.annotations}`);
  console.log(`next step: inspect .meta-skill/evals/runs/${runId}/grades.jsonl`);
  return result.ok ? 0 : 1;
}

async function commandEvalFeedback(argv: string[]): Promise<number> {
  const [subcommand, ...rest] = argv;
  if (subcommand !== "import") throw new CliError("eval feedback supports only: meta-skill eval feedback import <project> --run <run-id> <feedback.jsonl>", 2);
  const args = parse(rest, ["run"], []);
  const project = args.positionals[0] || ".";
  const feedback = args.positionals[1];
  const runId = args.one("run");
  if (!runId) throw new CliError("feedback import requires --run <run-id>", 2);
  if (!feedback) throw new CliError("feedback import requires <feedback.jsonl>", 2);
  const result = await importFeedback(project, runId, feedback);
  console.log(`imported feedback rows: ${result.rows}`);
  console.log(`next step: meta-skill plan ${shellPath(project)} --from-run ${runId}`);
  return 0;
}

async function commandEvalOpen(argv: string[]): Promise<number> {
  const args = parse(argv, ["run"], ["list"]);
  const project = args.positionals[0] || ".";
  if (args.has("list")) {
    const runs = await listRuns(project);
    for (const run of runs) console.log(run);
    return 0;
  }
  const result = await openRun(project, args.one("run"));
  if (process.stdout.isTTY) {
    await execFileAsync("open", [result.report]).catch(() => undefined);
  }
  console.log(`report: ${result.report}`);
  return 0;
}

async function commandPlan(argv: string[]): Promise<number> {
  const args = parse(argv, ["from-run", "from-review"], []);
  const project = args.positionals[0] || ".";
  const result = await planImprovement({ project, fromRun: args.one("from-run"), fromReview: args.one("from-review") });
  console.log(`plan: ${result.planId}`);
  console.log(`path: ${result.planRoot}`);
  console.log(`next step: fill plan.json edits, then meta-skill promote ${shellPath(project)} --plan ${result.planId}`);
  return 0;
}

async function commandPromote(argv: string[]): Promise<number> {
  const args = parse(argv, ["plan"], []);
  const project = args.positionals[0] || ".";
  const planId = args.one("plan");
  if (!planId) throw new CliError("promote requires --plan <plan-id>", 2);
  const result = await promotePlan(project, planId);
  console.log(`promoted plan: ${planId}`);
  console.log(`session: ${result.sessionId}`);
  console.log(`files: ${result.applied.join(", ")}`);
  console.log(`next step: meta-skill decide ${shellPath(project)} --session ${result.sessionId} --accept`);
  return 0;
}

async function commandDecide(argv: string[]): Promise<number> {
  const args = parse(argv, ["session"], ["accept", "reject"]);
  const project = args.positionals[0] || ".";
  const sessionId = args.one("session");
  if (!sessionId) throw new CliError("decide requires --session <session-id>", 2);
  if (args.has("accept") === args.has("reject")) throw new CliError("decide requires exactly one of --accept or --reject", 2);
  const decision = args.has("accept") ? "accept" : "reject";
  const result = await decideSession(project, sessionId, decision);
  console.log(`decision: ${decision}`);
  console.log(`path: ${result.sessionRoot}`);
  return 0;
}

async function commandRelease(argv: string[]): Promise<number> {
  const args = parse(argv, [], []);
  const project = args.positionals[0] || ".";
  const result = await releaseProject(project);
  console.log(`release: ${result.releaseRoot}`);
  console.log(`files: ${result.files.join(", ")}`);
  console.log(`next step: meta-skill package ${shellPath(project)} --source release`);
  return 0;
}

async function commandPackage(argv: string[]): Promise<number> {
  const args = parse(argv, ["source", "out", "out-dir"], []);
  const project = args.positionals[0] || ".";
  const source = args.one("source");
  if (source && !["candidate", "release"].includes(source)) throw new CliError("--source must be candidate or release", 2);
  const result = await packageProject({
    project,
    source: source as "candidate" | "release" | undefined,
    out: args.one("out"),
    outDir: args.one("out-dir")
  });
  console.log(`package: ${result.artifact}`);
  console.log(`metadata: ${result.metadata}`);
  console.log(`files: ${result.files.join(", ")}`);
  return 0;
}

class ParsedArgs {
  constructor(
    public positionals: string[],
    private values: Map<string, string[]>,
    private booleans: Set<string>
  ) {}

  one(name: string): string | undefined {
    return this.values.get(name)?.at(-1);
  }

  many(name: string): string[] {
    return this.values.get(name) || [];
  }

  has(name: string): boolean {
    return this.booleans.has(name);
  }
}

function parse(argv: string[], valueFlags: string[], booleanFlags: string[]): ParsedArgs {
  const valueSet = new Set(valueFlags);
  const booleanSet = new Set(booleanFlags);
  const values = new Map<string, string[]>();
  const booleans = new Set<string>();
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }
    const name = token.slice(2);
    if (booleanSet.has(name)) {
      booleans.add(name);
      continue;
    }
    if (!valueSet.has(name)) throw new CliError(`unknown flag: --${name}`, 2);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) throw new CliError(`--${name} requires a value`, 2);
    if (!values.has(name)) values.set(name, []);
    values.get(name)?.push(value);
    index += 1;
  }
  return new ParsedArgs(positionals, values, booleans);
}

function shellPath(target: string): string {
  return target.includes(" ") ? JSON.stringify(target) : target;
}
