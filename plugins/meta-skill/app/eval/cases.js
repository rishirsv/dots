"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEvals = initEvals;
exports.loadCases = loadCases;
exports.writeRunCaseSnapshots = writeRunCaseSnapshots;
exports.loadRunCaseSnapshots = loadRunCaseSnapshots;
exports.readCase = readCase;
exports.caseIdentity = caseIdentity;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
async function initEvals(project) {
    const root = await (0, project_1.requirePortableSkill)(project);
    await (0, project_1.createWorkbench)(root);
    const warnings = [];
    const p = (0, project_1.projectPaths)(root);
    const cases = (await (0, project_1.exists)(p.cases)) ? (await node_fs_1.promises.readdir(p.cases, { withFileTypes: true })).filter((entry) => entry.isDirectory()) : [];
    if (!cases.length)
        warnings.push("No cases exist yet. Add .meta-skill/evals/cases/<ID-slug>/case.md.");
    return { path: p.evals, warnings };
}
async function loadCases(project, selector = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    if (!(await (0, project_1.exists)(p.cases)))
        return [];
    const dirs = (await node_fs_1.promises.readdir(p.cases, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    const records = [];
    for (const dirent of dirs) {
        records.push(await readCase(node_path_1.default.join(p.cases, dirent.name), dirent.name));
    }
    const selected = selectCases(records, selector);
    if (selector.case?.length && !selected.length)
        throw new project_1.CliError("no cases selected");
    return selected;
}
async function writeRunCaseSnapshots(runRoot, cases) {
    for (const item of cases) {
        const snapshot = node_path_1.default.join(runRoot, "snapshots", item.folder);
        await (0, project_1.ensureDir)(snapshot);
        await node_fs_1.promises.cp(item.path, snapshot, { recursive: true });
        await (0, project_1.writeJson)(node_path_1.default.join(snapshot, "snapshot.json"), {
            schema_version: 1,
            case_id: item.id,
            case_folder: item.folder,
            evidence_basis: "run_snapshot",
            source_path: item.path
        });
    }
}
async function loadRunCaseSnapshots(project, runRoot, selector = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const snapshots = node_path_1.default.join(runRoot, "snapshots");
    if (!(await (0, project_1.exists)(snapshots))) {
        const current = await loadCases(root, selector);
        return current.map((item) => ({ ...item, evidence_basis: "legacy_current_project" }));
    }
    const dirs = (await node_fs_1.promises.readdir(snapshots, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    const records = [];
    for (const dirent of dirs) {
        const casePath = node_path_1.default.join(snapshots, dirent.name);
        records.push({ ...(await readCase(casePath, dirent.name)), evidence_basis: "run_snapshot", snapshot_path: casePath });
    }
    const selected = selectCases(records, selector);
    if (selector.case?.length && !selected.length)
        throw new project_1.CliError("no cases selected");
    return selected;
}
async function readCase(casePath, folder = node_path_1.default.basename(casePath)) {
    const { id, type } = caseIdentity(folder);
    const parsed = parseCaseMarkdown(await (0, project_1.readText)(node_path_1.default.join(casePath, "case.md")), node_path_1.default.join(casePath, "case.md"));
    return { folder, id, type, path: casePath, ...parsed };
}
function caseIdentity(folder) {
    const match = /^([RFG]\d+)-[a-z0-9][a-z0-9-]*$/.exec(folder);
    if (!match)
        throw new project_1.CliError(`case folder must use <ID>-<slug> with R/F/G prefix: ${folder}`);
    const id = match[1];
    const type = id.startsWith("R") ? "regression" : id.startsWith("F") ? "failure_mode" : "gate";
    return { id, type };
}
function selectCases(records, selector) {
    const wantedCases = selector.case?.length ? new Set(selector.case) : undefined;
    const wantedTopics = selector.topic?.length ? new Set(selector.topic) : undefined;
    return records.filter((item) => {
        if (wantedCases) {
            if (!wantedCases.has(item.id) && !wantedCases.has(item.folder))
                return false;
        }
        if (selector.type) {
            const prefix = item.id.charAt(0);
            if (prefix !== selector.type)
                return false;
        }
        if (wantedTopics) {
            if (!(item.metadata.topics || []).some((topic) => wantedTopics.has(topic)))
                return false;
        }
        return true;
    });
}
function parseCaseMarkdown(text, filePath) {
    if (!text.startsWith("---\n"))
        throw new project_1.CliError(`${filePath}: case.md must start with YAML frontmatter`);
    const end = text.indexOf("\n---\n", 4);
    if (end === -1)
        throw new project_1.CliError(`${filePath}: case.md frontmatter is not closed`);
    const frontmatter = parseYamlObject(text.slice(4, end), filePath);
    const body = text.slice(end + 5);
    const title = stringField(frontmatter.title);
    const criteria = objectField(frontmatter.criteria);
    const metadata = {
        title,
        topics: arrayOfStrings(frontmatter.topics),
        capability: frontmatter.capability === undefined ? undefined : stringField(frontmatter.capability),
        fixtures: arrayOfFixtures(frontmatter.fixtures),
        metadata: objectField(frontmatter.metadata, true)
    };
    return {
        metadata,
        criteria: {
            what_it_tests: criteria.what_it_tests === undefined ? undefined : stringField(criteria.what_it_tests),
            expected_behavior: stringField(criteria.expected_behavior),
            assertions: arrayOfStrings(criteria.assertions),
            tests: arrayOfStrings(criteria.tests),
            judges: arrayOfJudges(criteria.judges),
            rubric: criteria.rubric === undefined ? undefined : stringField(criteria.rubric)
        },
        ...parseTurns(body, filePath)
    };
}
function parseTurns(body, filePath) {
    const matches = [...body.matchAll(/^##\s+(.+?)\s*$/gm)];
    const sections = matches.map((match, index) => {
        const start = (match.index || 0) + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1].index || body.length : body.length;
        return { heading: match[1].trim(), content: body.slice(start, end).trim() };
    });
    const task = sections.find((section) => section.heading === "Task");
    if (!task?.content)
        throw new project_1.CliError(`${filePath}: case.md must include ## Task with task text`);
    const turns = sections
        .filter((section) => /^Turn\s+\d+$/.test(section.heading))
        .sort((a, b) => Number(a.heading.replace(/\D+/g, "")) - Number(b.heading.replace(/\D+/g, "")))
        .map((section) => ({ content: section.content }));
    if (sections.some((section) => section.heading !== "Task" && !/^Turn\s+\d+$/.test(section.heading))) {
        throw new project_1.CliError(`${filePath}: case.md supports only ## Task and ## Turn N headings`);
    }
    return { task: task.content, turns };
}
function parseYamlObject(source, filePath) {
    const lines = source
        .split(/\r?\n/)
        .map((raw) => ({ indent: raw.match(/^ */)?.[0].length || 0, text: raw.trim() }))
        .filter((line) => line.text && !line.text.startsWith("#"));
    const [value] = parseYamlNode(lines, 0, 0, filePath);
    return objectField(value);
}
function parseYamlNode(lines, index, indent, filePath) {
    if (index >= lines.length || lines[index].indent < indent)
        return [{}, index];
    if (lines[index].indent === indent && lines[index].text.startsWith("- "))
        return parseYamlArray(lines, index, indent, filePath);
    return parseYamlMap(lines, index, indent, filePath);
}
function parseYamlMap(lines, index, indent, filePath) {
    const out = {};
    while (index < lines.length) {
        const line = lines[index];
        if (line.indent < indent || line.text.startsWith("- "))
            break;
        if (line.indent > indent)
            throw new project_1.CliError(`${filePath}: invalid frontmatter indentation near ${line.text}`);
        const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line.text);
        if (!match)
            throw new project_1.CliError(`${filePath}: invalid frontmatter line: ${line.text}`);
        const key = match[1];
        const rest = match[2] || "";
        if (rest) {
            out[key] = parseYamlScalar(rest);
            index += 1;
        }
        else {
            const nextIndent = lines[index + 1]?.indent;
            if (nextIndent === undefined || nextIndent <= indent) {
                out[key] = null;
                index += 1;
            }
            else {
                const parsed = parseYamlNode(lines, index + 1, nextIndent, filePath);
                out[key] = parsed[0];
                index = parsed[1];
            }
        }
    }
    return [out, index];
}
function parseYamlArray(lines, index, indent, filePath) {
    const out = [];
    while (index < lines.length) {
        const line = lines[index];
        if (line.indent < indent || !line.text.startsWith("- "))
            break;
        if (line.indent > indent)
            throw new project_1.CliError(`${filePath}: invalid list indentation near ${line.text}`);
        const rest = line.text.slice(2).trim();
        if (!rest) {
            const parsed = parseYamlNode(lines, index + 1, (lines[index + 1]?.indent ?? indent + 2), filePath);
            out.push(parsed[0]);
            index = parsed[1];
            continue;
        }
        const inlineMap = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(rest);
        if (inlineMap) {
            const item = { [inlineMap[1]]: inlineMap[2] ? parseYamlScalar(inlineMap[2]) : null };
            index += 1;
            while (index < lines.length && lines[index].indent > indent) {
                const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(lines[index].text);
                if (!match)
                    throw new project_1.CliError(`${filePath}: invalid frontmatter line: ${lines[index].text}`);
                if (match[2]) {
                    item[match[1]] = parseYamlScalar(match[2]);
                    index += 1;
                }
                else {
                    const parsed = parseYamlNode(lines, index + 1, lines[index + 1]?.indent ?? lines[index].indent + 2, filePath);
                    item[match[1]] = parsed[0];
                    index = parsed[1];
                }
            }
            out.push(item);
        }
        else {
            out.push(parseYamlScalar(rest));
            index += 1;
        }
    }
    return [out, index];
}
function parseYamlScalar(value) {
    const trimmed = value.trim();
    if (trimmed === "[]")
        return [];
    if (trimmed === "{}")
        return {};
    if (trimmed === "true")
        return true;
    if (trimmed === "false")
        return false;
    if (trimmed === "null")
        return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed))
        return Number(trimmed);
    return trimmed.replace(/^['"]|['"]$/g, "");
}
function objectField(value, optional = false) {
    if (value === undefined && optional)
        return {};
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function stringField(value) {
    return typeof value === "string" ? value : "";
}
function arrayOfStrings(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function arrayOfFixtures(value) {
    return Array.isArray(value)
        ? value
            .map((item) => objectField(item))
            .filter((item) => typeof item.path === "string")
            .map((item) => ({ path: String(item.path), ...(typeof item.description === "string" ? { description: item.description } : {}) }))
        : [];
}
function arrayOfJudges(value) {
    return Array.isArray(value)
        ? value
            .map((item) => objectField(item))
            .filter((item) => typeof item.id === "string")
            .map((item) => {
            const threshold = objectField(item.threshold, true);
            return {
                id: String(item.id),
                ...(Object.keys(threshold).length ? { threshold: threshold } : {})
            };
        })
        : [];
}
