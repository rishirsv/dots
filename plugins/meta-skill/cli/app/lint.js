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
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
const FAMILY_BY_PREFIX = {
    R: "regression",
    F: "failure_mode",
    T: "trigger",
    G: "gate"
};
const VALID_TYPES = new Set(["behavior", "trigger", "artifact", "gate"]);
const VALID_FAMILIES = new Set(Object.values(FAMILY_BY_PREFIX));
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
        tests.push(...(await runManifestTests(root, manifest, options.runId ? "eval" : "unit")));
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
    const entries = await node_fs_1.promises.readdir(root, { withFileTypes: true });
    const skillMd = node_path_1.default.join(root, "SKILL.md");
    const frontmatter = await (0, project_1.parseSkillFrontmatter)(skillMd);
    const expected = node_path_1.default.basename(root);
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
    for (const entry of entries) {
        if (entry.name === ".meta-skill")
            continue;
        if (entry.isDirectory() && !project_1.PORTABLE_DIRS.has(entry.name) && entry.name !== ".meta-skill") {
            warnings.push(issue("warning", `top-level directory is outside the portable payload contract and will not package: ${entry.name}`, node_path_1.default.join(root, entry.name)));
        }
        if (entry.isFile() && !project_1.PORTABLE_FILES.has(entry.name)) {
            warnings.push(issue("warning", `top-level file is outside the portable payload contract and will not package: ${entry.name}`, node_path_1.default.join(root, entry.name)));
        }
    }
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
    if (!(await (0, project_1.exists)(p.scenarios))) {
        warnings.push(issue("warning", "no eval scenarios folder yet", p.scenarios));
        return;
    }
    const scenarioDirs = (await node_fs_1.promises.readdir(p.scenarios, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    if (!scenarioDirs.length)
        warnings.push(issue("warning", "no eval scenarios yet", p.scenarios));
    const seenIds = new Set();
    for (const dirent of scenarioDirs) {
        await validateScenario(node_path_1.default.join(p.scenarios, dirent.name), dirent.name, seenIds, testIds, judgeIds, failures, warnings);
    }
    if ((await (0, project_1.exists)(node_path_1.default.join(root, "scripts"))) && (await hasFiles(node_path_1.default.join(root, "scripts")))) {
        const manifest = (await (0, project_1.exists)(p.testManifest)) ? await (0, project_1.readJson)(p.testManifest) : { tests: [] };
        if (!manifest.tests.some((test) => test.kind === "unit")) {
            warnings.push(issue("warning", "runtime scripts are present; add or recommend unit tests in .meta-skill/tests/manifest.json", node_path_1.default.join(root, "scripts")));
        }
    }
}
async function validateScenario(scenarioDir, folder, seenIds, testIds, judgeIds, failures, warnings) {
    const match = /^([RFTG]\d+)-[a-z0-9][a-z0-9-]*$/.exec(folder);
    if (!match)
        failures.push(issue("failure", `scenario folder must use <ID>-<slug> with R/F/T/G prefix: ${folder}`, scenarioDir));
    const folderId = match?.[1] || folder.split("-")[0];
    for (const name of ["task.md", "criteria.json", "scenario.json"]) {
        if (!(await (0, project_1.exists)(node_path_1.default.join(scenarioDir, name))))
            failures.push(issue("failure", `scenario is missing ${name}`, node_path_1.default.join(scenarioDir, name)));
    }
    if (!(await (0, project_1.exists)(node_path_1.default.join(scenarioDir, "scenario.json"))) || !(await (0, project_1.exists)(node_path_1.default.join(scenarioDir, "criteria.json"))))
        return;
    const metadata = await (0, project_1.readJson)(node_path_1.default.join(scenarioDir, "scenario.json"));
    const criteria = await (0, project_1.readJson)(node_path_1.default.join(scenarioDir, "criteria.json"));
    if (metadata.schema_version !== 1)
        failures.push(issue("failure", "scenario.json schema_version must be 1", node_path_1.default.join(scenarioDir, "scenario.json")));
    if (metadata.id !== folderId)
        failures.push(issue("failure", `scenario id ${metadata.id} must match folder id ${folderId}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    if (seenIds.has(metadata.id))
        failures.push(issue("failure", `duplicate scenario id: ${metadata.id}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    seenIds.add(metadata.id);
    const prefix = metadata.id.charAt(0);
    if (metadata.family !== FAMILY_BY_PREFIX[prefix])
        failures.push(issue("failure", `${metadata.id} must use family ${FAMILY_BY_PREFIX[prefix]}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    if (!VALID_FAMILIES.has(metadata.family))
        failures.push(issue("failure", `invalid scenario family: ${metadata.family}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    if (!VALID_TYPES.has(metadata.type))
        failures.push(issue("failure", `invalid scenario type: ${metadata.type}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    if (!metadata.title)
        warnings.push(issue("warning", "scenario title is empty", node_path_1.default.join(scenarioDir, "scenario.json")));
    if (criteria.schema_version !== 1)
        failures.push(issue("failure", "criteria.json schema_version must be 1", node_path_1.default.join(scenarioDir, "criteria.json")));
    if (!criteria.expected_behavior)
        failures.push(issue("failure", "criteria.json expected_behavior is required", node_path_1.default.join(scenarioDir, "criteria.json")));
    if (!Array.isArray(criteria.assertions) || !criteria.assertions.length)
        failures.push(issue("failure", "criteria.json must include at least one assertion", node_path_1.default.join(scenarioDir, "criteria.json")));
    for (const testId of criteria.tests || []) {
        if (!testIds.has(testId))
            failures.push(issue("failure", `criteria references missing test id: ${testId}`, node_path_1.default.join(scenarioDir, "criteria.json")));
    }
    for (const judge of criteria.judges || []) {
        if (!judgeIds.has(judge.id))
            failures.push(issue("failure", `criteria references missing judge id: ${judge.id}`, node_path_1.default.join(scenarioDir, "criteria.json")));
        if (judge.threshold?.overall_min !== undefined && (judge.threshold.overall_min < 1 || judge.threshold.overall_min > 5)) {
            failures.push(issue("failure", `judge threshold overall_min must be 1-5 for ${judge.id}`, node_path_1.default.join(scenarioDir, "criteria.json")));
        }
    }
    if (!(criteria.tests || []).length)
        warnings.push(issue("warning", `${metadata.id} has no deterministic tests`, node_path_1.default.join(scenarioDir, "criteria.json")));
    if (!(criteria.judges || []).length)
        warnings.push(issue("warning", `${metadata.id} has no judges and is manual-review only`, node_path_1.default.join(scenarioDir, "criteria.json")));
    if (await (0, project_1.exists)(node_path_1.default.join(scenarioDir, "turns.json"))) {
        const turns = await (0, project_1.readJson)(node_path_1.default.join(scenarioDir, "turns.json"));
        if (!Array.isArray(turns) || !turns.every((turn) => typeof turn === "object" && turn !== null && typeof turn.content === "string")) {
            failures.push(issue("failure", "turns.json must be an array of objects with content strings", node_path_1.default.join(scenarioDir, "turns.json")));
        }
    }
    for (const include of metadata.include || []) {
        const resolved = node_path_1.default.resolve(scenarioDir, include);
        if (!resolved.startsWith(node_path_1.default.resolve(scenarioDir)))
            failures.push(issue("failure", `scenario include escapes scenario folder: ${include}`, node_path_1.default.join(scenarioDir, "scenario.json")));
        if (!(await (0, project_1.exists)(resolved)))
            failures.push(issue("failure", `scenario include does not exist: ${include}`, node_path_1.default.join(scenarioDir, "scenario.json")));
    }
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
async function runManifestTests(root, manifest, kind) {
    const rows = [];
    for (const test of manifest.tests || []) {
        if (test.kind !== kind)
            continue;
        try {
            const { stdout, stderr } = await execAsync(test.command, { cwd: root, timeout: 120000, maxBuffer: 1024 * 1024 });
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
