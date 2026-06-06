import path from "node:path";
import { listDeterministicTests } from "./eval/discovery.ts";
import { formatLintReport, lintProject } from "./lint.ts";
import type { Issue } from "./models.ts";
import { ensureDir, projectPaths, requirePortableSkill, utcNow, writeText } from "./project.ts";
import { parseSkillFrontmatterFull } from "./metadata.ts";

type ValidationResult = "Pass" | "Warning" | "Failure";

interface ValidationRow {
  criteria: string;
  description: string;
  result: ValidationResult;
}

interface Finding {
  severity: "High" | "Medium";
  source: "Quality";
  phase: "Validation";
  title: string;
  evidence: string;
  impact: string;
  fix: string;
  nextStep: string;
}

export interface ReviewResult {
  reviewPath: string;
  validationScore: number;
}

export async function reviewSkill(project: string): Promise<ReviewResult> {
  const root = await requirePortableSkill(project);
  const p = projectPaths(root);
  const lint = await lintProject(root, { executeTests: false });
  const deterministicTests = await listDeterministicTests(root, p.tests);
  const frontmatter = await parseSkillFrontmatterFull(path.join(root, "SKILL.md"));
  const skillName = frontmatter.name || path.basename(root);
  const validationCriteria = validationRows(lint.failures, lint.warnings, deterministicTests.length);
  const validationScore = percent(validationCriteria.filter((row) => row.result === "Pass").length, validationCriteria.length);
  const findings = qualityFindings(validationCriteria);

  await ensureDir(p.meta);
  await writeText(
    p.review,
    renderReviewWorksheet({
      skillName,
      root,
      generatedAt: utcNow(),
      validationScore,
      validationCriteria,
      findings,
      lintText: formatLintReport(lint)
    })
  );

  return { reviewPath: p.review, validationScore };
}

function validationRows(failures: Issue[], warnings: Issue[], deterministicTestCount: number): ValidationRow[] {
  const all = [...failures, ...warnings];
  const status = (pattern: RegExp): ValidationResult => {
    if (failures.some((issue) => pattern.test(issue.message))) return "Failure";
    if (warnings.some((issue) => pattern.test(issue.message))) return "Warning";
    return "Pass";
  };
  const rows: ValidationRow[] = [
    { criteria: "frontmatter_valid", description: "YAML frontmatter parses successfully", result: status(/frontmatter is not closed|invalid frontmatter/i) },
    { criteria: "name_field", description: "`name` field is present and valid", result: status(/name/i) },
    { criteria: "description_field", description: "`description` field is present, routed, and bounded", result: status(/description|not for|trigger/i) },
    { criteria: "body_present", description: "SKILL.md body is present", result: status(/body is missing/i) },
    { criteria: "resource_links", description: "Runtime references, scripts, and assets are directly linked", result: status(/runtime .* should be directly linked/i) },
    { criteria: "link_integrity", description: "Markdown links resolve inside the packaged payload", result: status(/broken link|links outside|links into a \.meta-skill|sibling plugin file/i) },
    { criteria: "agent_manifest", description: "agents/openai.yaml metadata is valid when present", result: status(/agents\/openai\.yaml|manifest/i) },
    { criteria: "workbench_shape", description: ".meta-skill workbench shape is valid when present", result: status(/\.meta-skill|spec\.md|eval-scenarios/i) },
    { criteria: "eval_definitions", description: "Eval task and criteria files are complete when present", result: status(/eval|criteria\.json|task\.md/i) },
    { criteria: "deterministic_tests", description: deterministicTestCount ? `${deterministicTestCount} deterministic tests discovered; review does not execute them` : "No deterministic tests discovered", result: deterministicTestCount ? "Pass" : "Warning" },
    { criteria: "lint_total", description: `${failures.length} failures and ${warnings.length} warnings recorded`, result: failures.length ? "Failure" : warnings.length ? "Warning" : "Pass" }
  ];
  return rows.filter((row) => row.criteria !== "lint_total" || all.length > 0);
}

function renderReviewWorksheet(input: {
  skillName: string;
  root: string;
  generatedAt: string;
  validationScore: number;
  validationCriteria: ValidationRow[];
  findings: Finding[];
  lintText: string;
}): string {
  return `# Skill Review

Skill: ${input.skillName}
Target: ${input.root}
Generated: ${input.generatedAt}

## Score

Quality Score: Agent review required
Validation Score: ${input.validationScore}%

## Quality

Complete Discovery and Implementation as an agent-authored Quality review. Overall assessments should be 2-4 substantive sentences. Each dimension should cite concrete evidence and explain why the score is not higher or lower.

### Discovery

Agent-authored review required. Replace this section by reviewing the target skill's description against \`references/review-criteria.md\`.

Based on the skill's description, can an agent find and select it at the right time? Clear, specific descriptions lead to better discovery.

Overall Assessment: Agent review required. Write 2-4 sentences about trigger clarity, natural user language, exclusions, and overlap risk.

| Dimension | Reasoning | Score |
|---|---|---:|
| Specificity | Agent review required. Cite the description text and explain why the job is concrete or broad. | Agent review required |
| Completeness | Agent review required. Explain what/when/not-for coverage and any missing boundary. | Agent review required |
| Trigger Term Quality | Agent review required. Name natural user terms and any overly internal terms. | Agent review required |
| Distinctiveness Conflict Risk | Agent review required. Compare against nearby or generic skills and name overlap risk. | Agent review required |
| Total | Agent review required. | Agent review required |

### Implementation

Agent-authored review required. Replace this section by reviewing the target skill's instructions and linked resources against \`references/review-criteria.md\`.

Reviews the quality of instructions and guidance provided to agents. Good implementation is clear, handles edge cases, and produces reliable results.

Overall Assessment: Agent review required. Write 2-4 sentences about runtime path, output contract, reference strategy, stop/ask behavior, and behavior lift.

| Dimension | Reasoning | Score |
|---|---|---:|
| Conciseness | Agent review required. Cite line count, repeated sections, oversized references, or lean structure. | Agent review required |
| Actionability | Agent review required. Name concrete commands, outputs, examples, checks, or missing operational steps. | Agent review required |
| Workflow Clarity | Agent review required. Explain default path, branch points, validation checkpoints, and any ambiguity. | Agent review required |
| Progressive Disclosure | Agent review required. Evaluate direct links, local references, just-in-time loading, and hidden or bloated detail. | Agent review required |
| Total | Agent review required. | Agent review required |

### Validation

${input.validationScore}%

Warnings & errors only

Checks the skill against the spec for correct structure and formatting. All validation checks must pass before discovery and implementation can be finalized.

Validation -- ${validationPassed(input.validationCriteria)} / ${input.validationCriteria.length} Passed

| Criteria | Description | Result |
|---|---|---|
${input.validationCriteria.map((row) => `| ${row.criteria} | ${row.description} | ${row.result} |`).join("\n")}

## Findings

Merge the deterministic validation findings below with agent-authored Discovery and Implementation findings, ordered by severity. Replace this instruction with the final combined list before reporting the review to the user.

${renderFindings(input.findings)}

## Deterministic Output

\`\`\`text
${input.lintText}
\`\`\`
`;
}

function qualityFindings(rows: ValidationRow[]): Finding[] {
  return rows.filter((row) => row.result !== "Pass").map((row) => validationFinding(row));
}

function validationFinding(row: ValidationRow): Finding {
  return {
    severity: row.result === "Failure" ? "High" : "Medium",
    source: "Quality",
    phase: "Validation",
    title: row.description,
    evidence: row.criteria,
    impact: row.result === "Failure" ? "The skill may fail validation or package incorrectly." : "The skill has a deterministic quality warning.",
    fix: row.criteria === "deterministic_tests" ? "Add one focused `.meta-skill/tests/<id>` deterministic check, or explicitly accept this as a coverage warning for a tiny skill." : "Address the deterministic validation result.",
    nextStep: row.criteria === "deterministic_tests" ? "Add or intentionally defer a focused test, then rerun `meta-skill review .`." : "Patch the referenced skill file or workbench artifact, then rerun `meta-skill review .`."
  };
}

function renderFindings(findings: Finding[]): string {
  if (!findings.length) return "No deterministic quality findings.";
  return findings
    .map(
      (finding) => `### [${finding.severity}] ${finding.title}

Source: ${finding.source}
Phase: ${finding.phase}
Evidence: ${finding.evidence}
Impact: ${finding.impact}
Fix: ${finding.fix}
Next Step: ${finding.nextStep}`
    )
    .join("\n\n");
}

function validationPassed(rows: Array<{ result: string }>): number {
  return rows.filter((row) => row.result === "Pass").length;
}

function percent(score: number, max: number): number {
  return max ? Math.round((score / max) * 100) : 0;
}
