"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseProject = releaseProject;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const lint_1 = require("./lint");
const project_1 = require("./project");
const report_1 = require("./report");
async function releaseProject(project, options = {}) {
    const root = await (0, project_1.requirePortableSkill)(project);
    await (0, project_1.createWorkbench)(root);
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
    const fileDigests = await payloadFileDigests(root);
    const payloadDigest = digestPayload(fileDigests);
    const runEvidence = options.fromRun ? await releaseRunEvidence(p.runs, options.fromRun) : null;
    await (0, project_1.writeJson)(node_path_1.default.join(p.release, "version.json"), {
        schema_version: 1,
        name: "release",
        source: "./",
        created_at: (0, project_1.utcNow)(),
        created_from: await (0, project_1.gitContext)(root),
        created_from_evidence: options.fromRun ? "eval_run" : "manual",
        source_run_id: options.fromRun || null,
        source_review_id: null,
        source_session_id: null,
        readiness_summary: runEvidence?.readiness || null,
        payload_digest: payloadDigest,
        file_digests: fileDigests,
        note: options.fromRun ? `Accepted release snapshot from eval run ${options.fromRun}.` : "Accepted release snapshot."
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
async function payloadFileDigests(root) {
    const result = {};
    for (const relative of await (0, project_1.listPortablePayloadFiles)(root)) {
        result[relative] = await (0, project_1.sha256File)(node_path_1.default.join(root, relative));
    }
    return result;
}
function digestPayload(fileDigests) {
    const hash = (0, node_crypto_1.createHash)("sha256");
    for (const [relative, digest] of Object.entries(fileDigests).sort(([a], [b]) => a.localeCompare(b))) {
        hash.update(`${relative}\0${digest}\n`);
    }
    return `sha256:${hash.digest("hex")}`;
}
async function releaseRunEvidence(runsRoot, runId) {
    const runRoot = node_path_1.default.join(runsRoot, runId);
    if (!(await (0, project_1.exists)(runRoot)))
        throw new project_1.CliError(`release source run does not exist: ${runId}`);
    await (0, report_1.writeEvalReport)(runRoot);
    const report = await (0, project_1.readJson)(node_path_1.default.join(runRoot, "report.json"));
    return { readiness: report.readiness };
}
