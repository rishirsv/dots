"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSkill = createSkill;
exports.initProject = initProject;
exports.skillName = skillName;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("./project");
async function createSkill(options) {
    const slug = options.slug || (options.target ? node_path_1.default.basename(node_path_1.default.resolve(options.target)) : undefined);
    if (!slug)
        throw new project_1.CliError("create requires --slug when no target path is supplied", 2);
    (0, project_1.assertSlug)(slug);
    const target = node_path_1.default.resolve(options.target || node_path_1.default.join(process.cwd(), slug));
    if ((await (0, project_1.exists)(target)) && !options.force) {
        const hasSkill = await (0, project_1.exists)(node_path_1.default.join(target, "SKILL.md"));
        if (hasSkill)
            throw new project_1.CliError(`${target} already contains SKILL.md; pass --force to replace scaffold files`);
    }
    const title = options.title || titleFromSlug(slug);
    const description = options.description ||
        `Use when ${slug.replace(/-/g, " ")} is needed as a reusable workflow; not for one-off tasks or publishing.`;
    const job = options.job || `Complete the ${slug.replace(/-/g, " ")} workflow with clear boundaries and useful output.`;
    validateSingleLine("description", description);
    validateSingleLine("title", title);
    validateSingleLine("job", job);
    await (0, project_1.ensureDir)(target);
    const files = [];
    await (0, project_1.writeText)(node_path_1.default.join(target, "SKILL.md"), `---\nname: ${slug}\ndescription: ${description}\n---\n\n# ${title}\n\n${sentence(job)}\n\n## Workflow\n\n1. Confirm the request matches the trigger boundary.\n2. Gather only the context needed for the reusable workflow.\n3. Produce the smallest complete output that satisfies the user.\n\n## Boundaries\n\n- Ask for missing inputs only when they change the result.\n- Do not package, publish, install, or write to external systems without explicit approval.\n`);
    files.push("SKILL.md");
    await (0, project_1.ensureDir)(node_path_1.default.join(target, "agents"));
    await (0, project_1.writeText)(node_path_1.default.join(target, "agents", "openai.yaml"), `name: ${slug}\ndescription: ${JSON.stringify(description)}\n`);
    files.push("agents/openai.yaml");
    for (const source of options.runtimeReferences || []) {
        const copied = await copyRuntimeFile(source, target, "references");
        files.push(copied);
    }
    for (const source of options.runtimeScripts || []) {
        const copied = await copyRuntimeFile(source, target, "scripts");
        files.push(copied);
    }
    for (const source of options.runtimeAssets || []) {
        const copied = await copyRuntimeFile(source, target, "assets");
        files.push(copied);
    }
    if (options.project) {
        await (0, project_1.createWorkbench)(target, { force: options.force });
        files.push(".meta-skill/spec.md", ".meta-skill/evals/evals.json", ".meta-skill/tests/manifest.json");
    }
    return { path: target, project: Boolean(options.project), files };
}
async function initProject(skillDir, options = {}) {
    const root = await (0, project_1.requirePortableSkill)(skillDir);
    await (0, project_1.createWorkbench)(root, options);
    return { path: root };
}
async function copyRuntimeFile(sourceText, targetRoot, folder) {
    const source = node_path_1.default.resolve(sourceText);
    const stat = await node_fs_1.promises.stat(source).catch(() => undefined);
    if (!stat?.isFile()) {
        throw new project_1.CliError(`runtime ${folder.slice(0, -1)} must be an existing file: ${sourceText}`);
    }
    const name = node_path_1.default.basename(source);
    if (!/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new project_1.CliError(`runtime file name may contain only letters, numbers, dots, underscores, and hyphens: ${name}`);
    }
    const relative = node_path_1.default.join(folder, name);
    const destination = node_path_1.default.join(targetRoot, relative);
    await (0, project_1.ensureDir)(node_path_1.default.dirname(destination));
    if (folder === "assets") {
        await node_fs_1.promises.copyFile(source, destination);
    }
    else {
        await (0, project_1.writeText)(destination, await (0, project_1.readText)(source));
    }
    return relative.split(node_path_1.default.sep).join("/");
}
function titleFromSlug(slug) {
    return slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
function sentence(text) {
    const trimmed = text.trim();
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}
function validateSingleLine(label, text) {
    if (/[\r\n]|```|^---$/m.test(text)) {
        throw new project_1.CliError(`--${label} must be a single-line value without fences or YAML delimiters`);
    }
}
async function skillName(projectRoot) {
    const frontmatter = await (0, project_1.parseSkillFrontmatter)(node_path_1.default.join(projectRoot, "SKILL.md"));
    return frontmatter.name || node_path_1.default.basename(projectRoot);
}
