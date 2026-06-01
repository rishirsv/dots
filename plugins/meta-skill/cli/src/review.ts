import { promises as fs } from "node:fs";
import path from "node:path";
import { lintProject } from "./lint";
import { nextSequencedId, projectPaths, readText, requirePortableSkill, writeJson } from "./project";
import { writeReviewReport } from "./report";

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

export async function reviewProject(project: string): Promise<{ reviewId: string; reviewRoot: string; score: number; report: string; data: Record<string, unknown> }> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const reviewId = await nextSequencedId(p.reviews, "best-practice-review");
  const reviewRoot = path.join(p.reviews, reviewId);
  await fs.mkdir(reviewRoot, { recursive: true });

  const skillText = await readText(path.join(root, "SKILL.md"));
  const lint = await lintProject(root, { executeTests: false });
  const dimensions: Record<string, { score: number; critique: string }> = {};
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
  await writeJson(path.join(reviewRoot, "review.json"), data);
  const report = await writeReviewReport(reviewRoot, data);
  return { reviewId, reviewRoot, score: normalized, report, data };
}

function scoreDimension(name: string, skillText: string, lintWarnings: string[]): { score: number; critique: string } {
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

function pass(critique: string): { score: number; critique: string } {
  return { score: 4, critique };
}

function concern(critique: string): { score: number; critique: string } {
  return { score: 3, critique };
}
