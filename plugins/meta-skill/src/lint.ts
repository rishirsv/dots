import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { parseAgentManifestMetadata } from "./metadata.ts";
import type { AgentManifestMetadata, SkillFrontmatter } from "./metadata.ts";
import type { Issue, LintReport } from "./models.ts";
import {
  exists,
  parseSkillFrontmatter,
  projectPaths,
  requirePortableSkill
} from "./project.ts";
import { caseIdentity, readCase } from "./eval/cases.ts";
import { isValidTestId, listCaseFolders, listUnitTests } from "./eval/discovery.ts";

const execAsync = promisify(exec);

export interface LintOptions {
  json?: boolean;
  executeTests?: boolean;
}

export async function lintProject(target: string, options: LintOptions = {}): Promise<LintReport> {
  const root = await requirePortableSkill(target);
  const failures: Issue[] = [];
  const warnings: Issue[] = [];
  const tests: LintReport["tests"] = [];
  const p = projectPaths(root);

  await validatePortablePayload(root, failures, warnings);

  if (await exists(p.meta)) {
    await validateWorkbench(root, failures, warnings);
  }

  if (options.executeTests !== false) {
    tests.push(...(await runDiscoveredTests(root, "unit")));
  }

  return { ok: failures.length === 0 && tests.every((test) => test.status !== "failed"), failures, warnings, tests };
}

export function formatLintReport(report: LintReport): string {
  const lines: string[] = [];
  for (const failure of report.failures) lines.push(`FAIL: ${formatIssue(failure)}`);
  for (const warning of report.warnings) lines.push(`WARN: ${formatIssue(warning)}`);
  for (const test of report.tests) lines.push(`TEST ${test.status.toUpperCase()}: ${test.id}`);
  if (!lines.length) lines.push("OK: no failures or warnings");
  else if (!report.failures.length && report.tests.every((test) => test.status !== "failed")) lines.push(`OK: no failures (${report.warnings.length} warnings)`);
  return lines.join("\n");
}

async function validatePortablePayload(root: string, failures: Issue[], warnings: Issue[]): Promise<void> {
  const skillMd = path.join(root, "SKILL.md");
  const skillText = await fs.readFile(skillMd, "utf8");
  let frontmatter: SkillFrontmatter;
  try {
    frontmatter = await parseSkillFrontmatter(skillMd);
  } catch (error) {
    failures.push(issue("failure", error instanceof Error ? error.message : String(error), skillMd));
    return;
  }
  const expected = path.basename(root);
  const body = skillBody(skillText);

  if (!frontmatter.name) failures.push(issue("failure", "SKILL.md is missing required frontmatter field 'name'", skillMd));
  if (frontmatter.name && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) failures.push(issue("failure", "skill name must use lowercase letters, numbers, and single hyphens", skillMd));
  if (frontmatter.name && frontmatter.name !== expected) warnings.push(issue("warning", `skill name ${frontmatter.name} does not match folder ${expected}`, skillMd));
  if (!frontmatter.description) failures.push(issue("failure", "SKILL.md is missing required frontmatter field 'description'", skillMd));
  if (frontmatter.description && !/\b(use when|when|asked to|for)\b/i.test(frontmatter.description)) {
    warnings.push(issue("warning", "description should include trigger context", skillMd));
  }
  if (frontmatter.description && !/\bnot for\b/i.test(frontmatter.description)) {
    warnings.push(issue("warning", "description should include a nearby 'not for' boundary", skillMd));
  }
  if (!body.trim()) failures.push(issue("failure", "SKILL.md body is missing", skillMd));
  if (skillText.split(/\r?\n/).length > 220) warnings.push(issue("warning", "SKILL.md is long; move conditional detail to directly linked references", skillMd));
  await validateRuntimeResourceLinks(root, skillText, warnings);
  await validateAgentManifest(root, frontmatter, failures, warnings);
}

function skillBody(skillText: string): string {
  if (!skillText.startsWith("---\n")) return skillText;
  const end = skillText.indexOf("\n---\n", 4);
  if (end === -1) return "";
  return skillText.slice(end + 5);
}

async function validateRuntimeResourceLinks(root: string, skillText: string, warnings: Issue[]): Promise<void> {
  for (const dir of ["references", "scripts", "assets"]) {
    const dirPath = path.join(root, dir);
    if (!(await exists(dirPath))) continue;
    const files = (await fs.readdir(dirPath, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile());
    for (const file of files) {
      const relative = `${dir}/${file.name}`;
      if (!skillText.includes(`](${relative})`) && !skillText.includes(`](${relative.replace(/ /g, "%20")})`)) {
        warnings.push(issue("warning", `runtime ${dir.slice(0, -1)} should be directly linked from SKILL.md: ${relative}`, path.join(root, relative)));
      }
    }
  }
}

async function validateAgentManifest(root: string, frontmatter: { name?: string; description?: string }, failures: Issue[], warnings: Issue[]): Promise<void> {
  const manifestPath = path.join(root, "agents", "openai.yaml");
  if (!(await exists(manifestPath))) return;
  let metadata: AgentManifestMetadata;
  try {
    metadata = await parseAgentManifestMetadata(manifestPath);
  } catch (error) {
    failures.push(issue("failure", error instanceof Error ? error.message : String(error), manifestPath));
    return;
  }
  if (!(metadata.name && metadata.description) && !metadata.hasInterface) {
    failures.push(issue("failure", "agents/openai.yaml must use top-level name/description or documented interface metadata", manifestPath));
    return;
  }
  if (metadata.name && frontmatter.name && metadata.name !== frontmatter.name) {
    warnings.push(issue("warning", `agents/openai.yaml name ${metadata.name} does not match SKILL.md name ${frontmatter.name}`, manifestPath));
  }
}

async function validateWorkbench(root: string, failures: Issue[], warnings: Issue[]): Promise<void> {
  const p = projectPaths(root);
  if (!(await exists(p.spec))) failures.push(issue("failure", ".meta-skill/spec.md is missing", p.spec));

  const testIds = await validateTests(root, p.tests, failures);

  if (!(await exists(p.cases))) {
    warnings.push(issue("warning", "no eval cases folder yet", p.cases));
    return;
  }
  const caseFolders = await listCaseFolders(p.cases);
  if (!caseFolders.length) warnings.push(issue("warning", "no eval cases yet", p.cases));
  const seenIds = new Set<string>();
  for (const folder of caseFolders) {
    await validateCase(path.join(p.cases, folder), folder, seenIds, testIds, failures, warnings);
  }

  if ((await exists(path.join(root, "scripts"))) && (await hasFiles(path.join(root, "scripts")))) {
    const tests = await listUnitTests(root, p.unitTests);
    if (!tests.length) {
      warnings.push(issue("warning", "runtime scripts are present; add or recommend unit tests in .meta-skill/tests/unit/", path.join(root, "scripts")));
    }
  }
}

async function validateCase(
  caseDir: string,
  folder: string,
  seenIds: Set<string>,
  testIds: Set<string>,
  failures: Issue[],
  warnings: Issue[]
): Promise<void> {
  try {
    caseIdentity(folder);
  } catch (error) {
    failures.push(issue("failure", error instanceof Error ? error.message : String(error), caseDir));
  }
  const caseMd = path.join(caseDir, "case.md");
  if (!(await exists(caseMd))) {
    failures.push(issue("failure", "case is missing case.md", caseMd));
    return;
  }

  let item;
  try {
    item = await readCase(caseDir, folder);
  } catch (error) {
    failures.push(issue("failure", error instanceof Error ? error.message : String(error), caseMd));
    return;
  }
  if (seenIds.has(item.id)) failures.push(issue("failure", `duplicate case id: ${item.id}`, caseMd));
  seenIds.add(item.id);
  if (!item.metadata.title) warnings.push(issue("warning", "case title is empty", caseMd));

  if (!item.criteria.expected_behavior) failures.push(issue("failure", "case criteria.expected_behavior is required", caseMd));
  if (!Array.isArray(item.criteria.assertions) || !item.criteria.assertions.length) failures.push(issue("failure", "case criteria.assertions must include at least one assertion", caseMd));
  for (const testId of item.criteria.tests || []) {
    if (!testIds.has(testId)) failures.push(issue("failure", `criteria references missing test id: ${testId}`, caseMd));
  }
  if (!(item.criteria.tests || []).length) warnings.push(issue("warning", `${item.id} has no deterministic tests`, caseMd));

  const declared = new Set((item.metadata.fixtures || []).map((fixture) => fixture.path));
  const fixtureFiles = await listFixtureFiles(path.join(caseDir, "fixtures"));
  for (const fixture of declared) {
    const resolved = path.resolve(caseDir, fixture);
    const relative = path.relative(caseDir, resolved);
    if (!fixture.startsWith("fixtures/")) failures.push(issue("failure", `fixture path must live under fixtures/: ${fixture}`, caseMd));
    if (relative.startsWith("..") || path.isAbsolute(relative)) failures.push(issue("failure", `fixture path escapes case folder: ${fixture}`, caseMd));
    if (!(await exists(resolved))) failures.push(issue("failure", `declared fixture does not exist: ${fixture}`, caseMd));
  }
  for (const fixture of fixtureFiles) {
    if (!declared.has(fixture)) failures.push(issue("failure", `fixture is present but undeclared: ${fixture}`, caseMd));
  }
}

async function listFixtureFiles(fixturesDir: string): Promise<string[]> {
  if (!(await exists(fixturesDir))) return [];
  const root = path.dirname(fixturesDir);
  const files: string[] = [];
  async function walk(dir: string): Promise<void> {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) files.push(path.relative(root, full).split(path.sep).join("/"));
    }
  }
  await walk(fixturesDir);
  return files.sort();
}

async function validateTests(root: string, testsDir: string, failures: Issue[]): Promise<Set<string>> {
  const tests = await listUnitTests(root, path.join(testsDir, "unit"));
  const ids = new Set<string>();
  for (const test of tests) {
    if (ids.has(test.id)) failures.push(issue("failure", `duplicate test id: ${test.id}`, test.path));
    ids.add(test.id);
    if (!isValidTestId(test.id)) failures.push(issue("failure", `invalid test id: ${test.id}`, test.path));
  }
  return ids;
}

async function runDiscoveredTests(
  root: string,
  kind: "unit"
): Promise<LintReport["tests"]> {
  const rows: LintReport["tests"] = [];
  for (const test of await listUnitTests(root, path.join(root, ".meta-skill", "tests", kind))) {
    try {
      const { stdout, stderr } = await execAsync(test.command, {
        cwd: root,
        timeout: 120000,
        maxBuffer: 1024 * 1024,
        env: process.env
      });
      rows.push({ id: test.id, kind: test.kind, status: "passed", command: test.command, output: `${stdout}${stderr}`.trim() });
    } catch (error) {
      const output = error && typeof error === "object" && "stdout" in error ? `${(error as { stdout?: string }).stdout || ""}${(error as { stderr?: string }).stderr || ""}`.trim() : String(error);
      rows.push({ id: test.id, kind: test.kind, status: "failed", command: test.command, output });
    }
  }
  return rows;
}

async function hasFiles(dir: string): Promise<boolean> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.some((entry) => entry.isFile());
}

function issue(severity: "failure" | "warning", message: string, filePath?: string): Issue {
  return { severity, message, path: filePath };
}

function formatIssue(item: Issue): string {
  return item.path ? `${item.message} (${item.path})` : item.message;
}
