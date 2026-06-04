"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintProject = lintProject;
exports.formatLintReport = formatLintReport;
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = require("node:util");
const project_1 = require("./project");
const report_1 = require("./report");
const cases_1 = require("./eval/cases");
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
async function lintProject(target, options = {}) {
    const root = await (0, project_1.requirePortableSkill)(target);
    const failures = [];
    const warnings = [];
    const tests = [];
    const p = (0, project_1.projectPaths)(root);
    await validatePortablePayload(root, failures, warnings);
    if (await (0, project_1.exists)(p.meta)) {
        await validateWorkbench(root, failures, warnings);
    }
    if (options.executeTests !== false && (await (0, project_1.exists)(p.testManifest))) {
        const manifest = await (0, project_1.readJson)(p.testManifest);
        tests.push(...(await runManifestTests(root, manifest, options.runId ? "eval" : "unit", options.runId ? { runId: options.runId, runRoot: node_path_1.default.join(p.runs, options.runId), projectRoot: root } : undefined)));
    }
    let annotations = 0;
    if (options.runId) {
        const runRoot = node_path_1.default.join(p.runs, options.runId);
        if (!(await (0, project_1.exists)(runRoot))) {
            failures.push(issue("failure", `run evidence does not exist: ${options.runId}`, runRoot));
        }
        else {
            for (const test of tests.filter((row) => row.kind === "eval")) {
                await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "tests.jsonl"), (0, project_1.eventEnvelope)({
                    type: "test_result",
                    run_id: options.runId,
                    source: test.id,
                    payload: test
                }));
                annotations += 1;
            }
            await (0, project_1.appendJsonl)(node_path_1.default.join(runRoot, "tests.jsonl"), (0, project_1.eventEnvelope)({
                type: "lint_summary",
                run_id: options.runId,
                source: "meta-skill lint",
                payload: {
                    failures: failures.length,
                    warnings: warnings.length,
                    tests: tests.length
                }
            }));
            annotations += 1;
            await (0, report_1.writeEvalReport)(runRoot);
        }
    }
    return { ok: failures.length === 0 && tests.every((test) => test.status !== "failed"), failures, warnings, tests, annotations };
}
function formatLintReport(report) {
    const lines = [];
    for (const failure of report.failures)
        lines.push(`FAIL: ${formatIssue(failure)}`);
    for (const warning of report.warnings)
        lines.push(`WARN: ${formatIssue(warning)}`);
    for (const test of report.tests)
        lines.push(`TEST ${test.status.toUpperCase()}: ${test.id}`);
    if (report.annotations)
        lines.push(`ANNOTATIONS: ${report.annotations}`);
    if (!lines.length)
        lines.push("OK: no failures or warnings");
    else if (!report.failures.length && report.tests.every((test) => test.status !== "failed"))
        lines.push(`OK: no failures (${report.warnings.length} warnings)`);
    return lines.join("\n");
}
async function validatePortablePayload(root, failures, warnings) {
    const skillMd = node_path_1.default.join(root, "SKILL.md");
    const skillText = await node_fs_1.promises.readFile(skillMd, "utf8");
    const frontmatter = await (0, project_1.parseSkillFrontmatter)(skillMd);
    const expected = node_path_1.default.basename(root);
    const body = skillBody(skillText);
    if (!frontmatter.name)
        failures.push(issue("failure", "SKILL.md is missing required frontmatter field 'name'", skillMd));
    if (frontmatter.name && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name))
        failures.push(issue("failure", "skill name must use lowercase letters, numbers, and single hyphens", skillMd));
    if (frontmatter.name && frontmatter.name !== expected)
        warnings.push(issue("warning", `skill name ${frontmatter.name} does not match folder ${expected}`, skillMd));
    if (!frontmatter.description)
        failures.push(issue("failure", "SKILL.md is missing required frontmatter field 'description'", skillMd));
    if (frontmatter.description && !/\b(use when|when|asked to|for)\b/i.test(frontmatter.description)) {
        warnings.push(issue("warning", "description should include trigger context", skillMd));
    }
    if (frontmatter.description && !/\bnot for\b/i.test(frontmatter.description)) {
        warnings.push(issue("warning", "description should include a nearby 'not for' boundary", skillMd));
    }
    if (!body.trim())
        failures.push(issue("failure", "SKILL.md body is missing", skillMd));
    if (skillText.split(/\r?\n/).length > 220)
        warnings.push(issue("warning", "SKILL.md is long; move conditional detail to directly linked references", skillMd));
    await validateRuntimeResourceLinks(root, skillText, warnings);
    await validateAgentManifest(root, frontmatter, failures, warnings);
}
function skillBody(skillText) {
    if (!skillText.startsWith("---\n"))
        return skillText;
    const end = skillText.indexOf("\n---\n", 4);
    if (end === -1)
        return "";
    return skillText.slice(end + 5);
}
async function validateRuntimeResourceLinks(root, skillText, warnings) {
    for (const dir of ["references", "scripts", "assets"]) {
        const dirPath = node_path_1.default.join(root, dir);
        if (!(await (0, project_1.exists)(dirPath)))
            continue;
        const files = (await node_fs_1.promises.readdir(dirPath, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile());
        for (const file of files) {
            const relative = `${dir}/${file.name}`;
            if (!skillText.includes(`](${relative})`) && !skillText.includes(`](${relative.replace(/ /g, "%20")})`)) {
                warnings.push(issue("warning", `runtime ${dir.slice(0, -1)} should be directly linked from SKILL.md: ${relative}`, node_path_1.default.join(root, relative)));
            }
        }
    }
}
async function validateAgentManifest(root, frontmatter, failures, warnings) {
    const manifestPath = node_path_1.default.join(root, "agents", "openai.yaml");
    if (!(await (0, project_1.exists)(manifestPath)))
        return;
    const text = await node_fs_1.promises.readFile(manifestPath, "utf8");
    const topLevel = parseSimpleYaml(text);
    const hasCodexShape = Boolean(topLevel.name && topLevel.description);
    const hasInterfaceShape = /^\s*interface\s*:/m.test(text);
    if (!hasCodexShape && !hasInterfaceShape) {
        failures.push(issue("failure", "agents/openai.yaml must use top-level name/description or documented interface metadata", manifestPath));
        return;
    }
    if (topLevel.name && frontmatter.name && topLevel.name !== frontmatter.name) {
        warnings.push(issue("warning", `agents/openai.yaml name ${topLevel.name} does not match SKILL.md name ${frontmatter.name}`, manifestPath));
    }
}
function parseSimpleYaml(text) {
    const parsed = {};
    for (const line of text.split(/\r?\n/)) {
        const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (!match)
            continue;
        parsed[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
    }
    return parsed;
}
async function validateWorkbench(root, failures, warnings) {
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.spec)))
        failures.push(issue("failure", ".meta-skill/spec.md is missing", p.spec));
    if (!(await (0, project_1.exists)(p.evalManifest)))
        failures.push(issue("failure", ".meta-skill/evals/evals.json is missing", p.evalManifest));
    if (!(await (0, project_1.exists)(p.testManifest)))
        failures.push(issue("failure", ".meta-skill/tests/manifest.json is missing", p.testManifest));
    let testIds = new Set();
    if (await (0, project_1.exists)(p.testManifest)) {
        const manifest = await (0, project_1.readJson)(p.testManifest);
        if (manifest.schema_version !== 1)
            failures.push(issue("failure", "tests manifest schema_version must be 1", p.testManifest));
        if (!Array.isArray(manifest.tests))
            failures.push(issue("failure", "tests manifest must contain tests array", p.testManifest));
        testIds = new Set((manifest.tests || []).map((test) => test.id));
        if (testIds.size !== (manifest.tests || []).length)
            failures.push(issue("failure", "tests manifest contains duplicate test IDs", p.testManifest));
        for (const test of manifest.tests || []) {
            if (!test.id || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(test.id))
                failures.push(issue("failure", `invalid test id: ${test.id}`, p.testManifest));
            if (!["unit", "eval"].includes(test.kind))
                failures.push(issue("failure", `invalid test kind for ${test.id}: ${test.kind}`, p.testManifest));
            if (!test.command)
                failures.push(issue("failure", `test ${test.id} is missing command`, p.testManifest));
        }
    }
    const judgeIds = await validateJudges(p.judges, failures, warnings);
    if (await (0, project_1.exists)(p.evalManifest)) {
        const manifest = await (0, project_1.readJson)(p.evalManifest);
        if (manifest.schema_version !== 1)
            failures.push(issue("failure", "eval manifest schema_version must be 1", p.evalManifest));
        if (manifest.defaults?.runner !== "app_server") {
            failures.push(issue("failure", "eval manifest defaults.runner must be app_server", p.evalManifest));
        }
    }
    if (!(await (0, project_1.exists)(p.cases))) {
        warnings.push(issue("warning", "no eval cases folder yet", p.cases));
        return;
    }
    const caseDirs = (await node_fs_1.promises.readdir(p.cases, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    if (!caseDirs.length)
        warnings.push(issue("warning", "no eval cases yet", p.cases));
    const seenIds = new Set();
    for (const dirent of caseDirs) {
        await validateCase(node_path_1.default.join(p.cases, dirent.name), dirent.name, seenIds, testIds, judgeIds, failures, warnings);
    }
    if ((await (0, project_1.exists)(node_path_1.default.join(root, "scripts"))) && (await hasFiles(node_path_1.default.join(root, "scripts")))) {
        const manifest = (await (0, project_1.exists)(p.testManifest)) ? await (0, project_1.readJson)(p.testManifest) : { tests: [] };
        if (!manifest.tests.some((test) => test.kind === "unit")) {
            warnings.push(issue("warning", "runtime scripts are present; add or recommend unit tests in .meta-skill/tests/manifest.json", node_path_1.default.join(root, "scripts")));
        }
    }
}
async function validateCase(caseDir, folder, seenIds, testIds, judgeIds, failures, warnings) {
    try {
        (0, cases_1.caseIdentity)(folder);
    }
    catch (error) {
        failures.push(issue("failure", error instanceof Error ? error.message : String(error), caseDir));
    }
    const caseMd = node_path_1.default.join(caseDir, "case.md");
    if (!(await (0, project_1.exists)(caseMd))) {
        failures.push(issue("failure", "case is missing case.md", caseMd));
        return;
    }
    let item;
    try {
        item = await (0, cases_1.readCase)(caseDir, folder);
    }
    catch (error) {
        failures.push(issue("failure", error instanceof Error ? error.message : String(error), caseMd));
        return;
    }
    if (seenIds.has(item.id))
        failures.push(issue("failure", `duplicate case id: ${item.id}`, caseMd));
    seenIds.add(item.id);
    if (!item.metadata.title)
        warnings.push(issue("warning", "case title is empty", caseMd));
    if (!item.criteria.expected_behavior)
        failures.push(issue("failure", "case criteria.expected_behavior is required", caseMd));
    if (!Array.isArray(item.criteria.assertions) || !item.criteria.assertions.length)
        failures.push(issue("failure", "case criteria.assertions must include at least one assertion", caseMd));
    for (const testId of item.criteria.tests || []) {
        if (!testIds.has(testId))
            failures.push(issue("failure", `criteria references missing test id: ${testId}`, caseMd));
    }
    for (const judge of item.criteria.judges || []) {
        if (!judgeIds.has(judge.id))
            failures.push(issue("failure", `criteria references missing judge id: ${judge.id}`, caseMd));
        if (judge.threshold?.overall_min !== undefined && (judge.threshold.overall_min < 1 || judge.threshold.overall_min > 5)) {
            failures.push(issue("failure", `judge threshold overall_min must be 1-5 for ${judge.id}`, caseMd));
        }
    }
    if (!(item.criteria.tests || []).length)
        warnings.push(issue("warning", `${item.id} has no deterministic tests`, caseMd));
    if (!(item.criteria.judges || []).length)
        warnings.push(issue("warning", `${item.id} has no judges and is manual-review only`, caseMd));
    const declared = new Set((item.metadata.fixtures || []).map((fixture) => fixture.path));
    const fixtureFiles = await listFixtureFiles(node_path_1.default.join(caseDir, "fixtures"));
    for (const fixture of declared) {
        const resolved = node_path_1.default.resolve(caseDir, fixture);
        const relative = node_path_1.default.relative(caseDir, resolved);
        if (!fixture.startsWith("fixtures/"))
            failures.push(issue("failure", `fixture path must live under fixtures/: ${fixture}`, caseMd));
        if (relative.startsWith("..") || node_path_1.default.isAbsolute(relative))
            failures.push(issue("failure", `fixture path escapes case folder: ${fixture}`, caseMd));
        if (!(await (0, project_1.exists)(resolved)))
            failures.push(issue("failure", `declared fixture does not exist: ${fixture}`, caseMd));
    }
    for (const fixture of fixtureFiles) {
        if (!declared.has(fixture))
            failures.push(issue("failure", `fixture is present but undeclared: ${fixture}`, caseMd));
    }
}
async function listFixtureFiles(fixturesDir) {
    if (!(await (0, project_1.exists)(fixturesDir)))
        return [];
    const root = node_path_1.default.dirname(fixturesDir);
    const files = [];
    async function walk(dir) {
        for (const entry of await node_fs_1.promises.readdir(dir, { withFileTypes: true })) {
            const full = node_path_1.default.join(dir, entry.name);
            if (entry.isDirectory())
                await walk(full);
            else if (entry.isFile())
                files.push(node_path_1.default.relative(root, full).split(node_path_1.default.sep).join("/"));
        }
    }
    await walk(fixturesDir);
    return files.sort();
}
async function validateJudges(judgesDir, failures, warnings) {
    const ids = new Set();
    if (!(await (0, project_1.exists)(judgesDir)))
        return ids;
    const files = (await node_fs_1.promises.readdir(judgesDir, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".md"));
    for (const file of files) {
        const full = node_path_1.default.join(judgesDir, file.name);
        const text = await node_fs_1.promises.readFile(full, "utf8");
        const parsed = parseMarkdownFrontmatter(text);
        if (!parsed.id)
            failures.push(issue("failure", "judge frontmatter missing id", full));
        if (parsed.id)
            ids.add(parsed.id);
        if (!["rubric", "pass_fail"].includes(parsed.type || ""))
            failures.push(issue("failure", `judge ${file.name} type must be rubric or pass_fail`, full));
        if (parsed.type === "rubric" && parsed.scale !== "1-5")
            failures.push(issue("failure", `rubric judge ${file.name} must use scale 1-5`, full));
        if (!/##?\s+Output/i.test(text))
            warnings.push(issue("warning", `judge ${file.name} should define structured output guidance`, full));
        if (!/example|calibration/i.test(text))
            warnings.push(issue("warning", `judge ${file.name} has no examples yet`, full));
    }
    return ids;
}
function parseMarkdownFrontmatter(text) {
    if (!text.startsWith("---\n"))
        return {};
    const end = text.indexOf("\n---\n", 4);
    if (end === -1)
        return {};
    const result = {};
    for (const line of text.slice(4, end).split(/\r?\n/)) {
        const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (match)
            result[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
    }
    return result;
}
async function runManifestTests(root, manifest, kind, runEnv) {
    const rows = [];
    for (const test of manifest.tests || []) {
        if (test.kind !== kind)
            continue;
        try {
            const { stdout, stderr } = await execAsync(test.command, {
                cwd: root,
                timeout: 120000,
                maxBuffer: 1024 * 1024,
                env: runEnv
                    ? {
                        ...process.env,
                        META_SKILL_RUN_ID: runEnv.runId,
                        META_SKILL_RUN_ROOT: runEnv.runRoot,
                        META_SKILL_PROJECT_ROOT: runEnv.projectRoot
                    }
                    : process.env
            });
            rows.push({ id: test.id, kind: test.kind, status: "passed", command: test.command, output: `${stdout}${stderr}`.trim() });
        }
        catch (error) {
            const output = error && typeof error === "object" && "stdout" in error ? `${error.stdout || ""}${error.stderr || ""}`.trim() : String(error);
            rows.push({ id: test.id, kind: test.kind, status: "failed", command: test.command, output });
        }
    }
    return rows;
}
async function hasFiles(dir) {
    const entries = await node_fs_1.promises.readdir(dir, { withFileTypes: true });
    return entries.some((entry) => entry.isFile());
}
function issue(severity, message, filePath) {
    return { severity, message, path: filePath };
}
function formatIssue(item) {
    return item.path ? `${item.message} (${item.path})` : item.message;
}
