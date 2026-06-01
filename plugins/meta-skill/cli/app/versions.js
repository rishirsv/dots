"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseProject = releaseProject;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const lint_1 = require("./lint");
const project_1 = require("./project");
async function releaseProject(project) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    const lint = await (0, lint_1.lintProject)(root);
    if (!lint.ok) {
        throw new project_1.CliError(`release validation failed:\n${lint.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
    }
    if ((await existsRelease(p.releaseSkill)) && !process.stdout.isTTY) {
        throw new project_1.CliError("release already exists; replacing it requires an interactive human confirmation");
    }
    if (await existsRelease(p.releaseSkill)) {
        const confirmed = await confirmReplace();
        if (!confirmed)
            throw new project_1.CliError("release replacement cancelled");
    }
    const files = await (0, project_1.copyPortablePayload)(root, p.releaseSkill);
    await (0, project_1.writeJson)(node_path_1.default.join(p.release, "version.json"), {
        schema_version: 1,
        name: "release",
        source: "./",
        created_at: (0, project_1.utcNow)(),
        created_from: await (0, project_1.gitContext)(root),
        note: "Accepted release snapshot."
    });
    return { releaseRoot: p.release, files };
}
async function existsRelease(releaseSkill) {
    try {
        await node_fs_1.promises.access(node_path_1.default.join(releaseSkill, "SKILL.md"));
        return true;
    }
    catch {
        return false;
    }
}
async function confirmReplace() {
    process.stderr.write("Replace existing .meta-skill/versions/release? Type 'release' to confirm: ");
    const answer = await new Promise((resolve) => {
        process.stdin.once("data", (chunk) => resolve(String(chunk).trim()));
    });
    return answer === "release";
}
