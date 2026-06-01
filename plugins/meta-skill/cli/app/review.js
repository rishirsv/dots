"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewProject = reviewProject;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const lint_1 = require("./lint");
const project_1 = require("./project");
const report_1 = require("./report");
const DIMENSIONS = [
    "activation_quality",
    "boundary_clarity",
    "actionability",
    "workflow_clarity",
    "progressive_disclosure",
    "concision",
    "resource_and_script_hygiene",
    "eval_and_lint_readiness"
];
async function reviewProject(project) {
    const root = await (0, project_1.requirePortableSkill)(project);
    const p = (0, project_1.projectPaths)(root);
    const reviewId = await (0, project_1.nextSequencedId)(p.reviews, "best-practice-review");
    const reviewRoot = node_path_1.default.join(p.reviews, reviewId);
    await node_fs_1.promises.mkdir(reviewRoot, { recursive: true });
    const skillText = await (0, project_1.readText)(node_path_1.default.join(root, "SKILL.md"));
    const lint = await (0, lint_1.lintProject)(root, { executeTests: false });
    const dimensions = {};
    for (const dimension of DIMENSIONS) {
        dimensions[dimension] = scoreDimension(dimension, skillText, lint.warnings.map((warning) => warning.message));
    }
    const rawAverage = Object.values(dimensions).reduce((sum, row) => sum + row.score, 0) / DIMENSIONS.length;
    const normalized = Math.round((rawAverage / 5) * 100);
    const suggested = Object.entries(dimensions)
        .filter(([, row]) => row.score < 4)
        .map(([name, row]) => `${name}: ${row.critique}`);
    const data = {
        schema_version: 1,
        rubric_version: "meta-skill-best-practice-v1",
        inputs: {
            skill_md: "SKILL.md",
            lint_failures: lint.failures.length,
            lint_warnings: lint.warnings.length
        },
        dimensions,
        normalized_score: normalized,
        suggested_changes: suggested
    };
    await (0, project_1.writeJson)(node_path_1.default.join(reviewRoot, "review.json"), data);
    const report = await (0, report_1.writeReviewReport)(reviewRoot, data);
    return { reviewId, reviewRoot, score: normalized, report, data };
}
function scoreDimension(name, skillText, lintWarnings) {
    const text = skillText.toLowerCase();
    switch (name) {
        case "activation_quality":
            return text.startsWith("---") && /\buse when\b/.test(text) ? pass("Trigger context is visible in frontmatter.") : concern("Frontmatter should front-load trigger context with 'Use when'.");
        case "boundary_clarity":
            return /\bnot for\b/.test(text) || /\bboundar/.test(text) ? pass("The skill names non-trigger or stop boundaries.") : concern("Add a clear 'not for' boundary near the routing description.");
        case "actionability":
            return /\b1\./.test(skillText) || /\bworkflow\b/.test(text) ? pass("The runtime gives executable steps.") : concern("The runtime guidance is too abstract; add concrete steps.");
        case "workflow_clarity":
            return /(workflow|process|steps|loop)/.test(text) ? pass("The workflow is easy to follow.") : concern("Name the workflow stages so a future agent can move through them.");
        case "progressive_disclosure":
            return /\]\(references\/|\]\(scripts\/|\]\(assets\//.test(skillText) || !/(references\/|scripts\/|assets\/)/.test(skillText)
                ? pass("Linked resources are either absent or directly linked.")
                : concern("Runtime resources should be directly linked from SKILL.md.");
        case "concision":
            return skillText.length < 9000 ? pass("The skill is compact enough for runtime use.") : concern("SKILL.md is long; move conditional detail to references.");
        case "resource_and_script_hygiene":
            return lintWarnings.some((warning) => /runtime scripts/.test(warning)) ? concern("Runtime scripts exist without unit-test coverage.") : pass("No obvious script/resource hygiene issue in lint warnings.");
        case "eval_and_lint_readiness":
            return /\.meta-skill/.test(text) ? pass("The skill mentions Meta Skill workbench evidence.") : concern("Use .meta-skill lint/eval evidence before release-facing changes.");
        default:
            return pass("No concern.");
    }
}
function pass(critique) {
    return { score: 4, critique };
}
function concern(critique) {
    return { score: 3, critique };
}
