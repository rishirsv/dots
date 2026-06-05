import { initEvals, runEval } from "./evals.ts";
import { lintProject } from "./lint.ts";
import { packageProject } from "./package.ts";
import { CliError } from "./project.ts";
import { formatLintReport } from "./lint.ts";
import { createSkill, initProject } from "./skills.ts";

const HELP = `meta-skill

Usage:
  meta-skill create [skill-dir] [--project] --slug <slug> --title <title> --description <text> --job <text>
  meta-skill project init <skill-dir>
  meta-skill lint <project-or-skill> [--json]
  meta-skill run <project> [--case <id>] [--type <R|F|G>] [--topic <topic>] [--label "..."] [--no-skill] [--no-lint]
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
    case "lint":
      return commandLint(rest);
    case "run":
      return commandRun(rest);
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
  console.log(`next step: add cases, then meta-skill run ${shellPath(result.path)}`);
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

async function commandRun(argv: string[]): Promise<number> {
  const args = parse(argv, ["case", "type", "topic", "label", "app-server-endpoint"], ["no-skill", "no-lint"]);
  const project = args.positionals[0] || ".";
  if (args.one("app-server-endpoint")) throw new CliError("--app-server-endpoint is not supported yet; omit it to use the managed stdio App Server", 2);
  const type = args.one("type");
  if (type && !["R", "F", "G"].includes(type)) throw new CliError("--type must be one of R, F, G", 2);
  const result = await runEval({
    project,
    selector: { case: args.many("case"), type, topic: args.many("topic") },
    label: args.one("label"),
    runSource: args.has("no-skill") ? "no_skill" : "working_payload",
    noLint: args.has("no-lint"),
    appServerEndpoint: undefined
  });
  console.log(`run: ${result.runId}`);
  console.log(`path: ${result.runRoot}`);
  console.log(`cases: ${result.cases.join(", ")}`);
  if (result.errors.length) {
    console.log("errors:");
    for (const error of result.errors) console.log(`- ${error}`);
  }
  return result.ok ? 0 : 1;
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

class ParsedArgs {
  positionals: string[];
  private values: Map<string, string[]>;
  private booleans: Set<string>;

  constructor(positionals: string[], values: Map<string, string[]>, booleans: Set<string>) {
    this.positionals = positionals;
    this.values = values;
    this.booleans = booleans;
  }

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
