---
name: skill-audit
description: >
  Audit an agent skill for release readiness, instruction quality, scope, and
  resource design. Use when the user asks to audit, review, critique, or
  pressure-test a skill directory or `SKILL.md`, or asks whether a skill is
  ready to ship. Not for general code review, evaluator review, or prompt-only
  critique.
---

# Skill Audit

Audit a skill with evidence-first rigor. Default stance: fail unclear instructions, vague triggering, weak verification, and bloated structure until the skill earns a pass.

## Reference Files

Read before scoring:

| File | When to use |
|---|---|
| [references/rubric.md](references/rubric.md) | Always. Authoritative scoring criteria, verdict thresholds, and severity classification for D1-D9. |
| [references/report-template.md](references/report-template.md) | When assembling `skill-audit.md`. Follow its structure exactly. |

## Input

Accept a path to the skill directory. If the user gives a file path, audit `SKILL.md` only unless they ask for the full directory.

Default scope: full skill-directory audit.

Supported scopes:
- `full-skill` - `SKILL.md` plus bundled files
- `skill-md-only` - body/frontmatter review only
- `release-readiness` - same audit, but prioritize blocking issues and ship/no-ship guidance

If scope is not stated, use `full-skill`.

## Workflow

### Phase 1 - Scope and inventory

1. Confirm the skill path and scope.
2. Read `SKILL.md` in full. If `{skill_directory}/skill-audit.md` already exists, read it — the final report will note which prior findings are resolved, which persist, and which are new.
3. Inventory all files and subdirectories.
4. Record:
   - `SKILL.md` body line count excluding frontmatter, code blocks, and blank lines
   - frontmatter fields present
   - file counts in `scripts/`, `references/`, and `assets/`
   - files outside those directories besides `SKILL.md`
   - platform indicators: presence of `agents/` directory and `agents/openai.yaml`, platform-specific syntax in SKILL.md body, deployment config files, hooks configuration, string substitution usage, persistent state locations
   - if `agents/openai.yaml` exists: whether `$skill-name` in `default_prompt` matches SKILL.md `name`, whether declared icon assets exist in `assets/`

### Phase 2 - Load scoring context

1. Read [references/rubric.md](references/rubric.md) in full, including the severity classification table.

### Phase 3 - Run the dimension reviews

Review the 9 dimensions defined in [references/rubric.md](references/rubric.md). The rubric is the sole authority for what each dimension covers, its criteria, verdict thresholds, and severity classification. Do not apply criteria from outside the rubric.

If parallel sub-agents are available, launch one per dimension. Each sub-agent receives:
1. The full text of SKILL.md under audit
2. The file inventory from Phase 1
3. Its dimension's section from references/rubric.md (criteria table + verdict rules)
4. The severity classification table from references/rubric.md
5. Contents of bundled files relevant to its dimension

If sub-agents are not available, audit sequentially using the same inputs per dimension.

Every dimension review must return this format:

```markdown
## [Dimension Name]

**Verdict: PASS | MARGINAL | FAIL | N/A**

### Issues Found
- [CRITICAL] Issue description
  Evidence: "quoted text" (line X)
- [MAJOR] Issue description
  Evidence: "quoted text" (line X)
- [MINOR] Issue description
  Evidence: "quoted text" (line X)

### Suggested Fixes
1. Fix with before -> after example
2. Fix with before -> after example

### Metrics
[Dimension-specific measurements]
```

Rules:
- Quote specific evidence for every finding.
- Use file paths and line numbers for bundled resources.
- If a criterion does not apply, mark it `N/A` and say why.
- D9 may use `AUTO-PASS` when all its criteria are N/A — this is the only dimension where AUTO-PASS applies. For all other dimensions, use N/A only when the entire dimension does not apply.
- Do not duplicate the same issue across dimensions unless the dimensions genuinely differ.
- If a skill fails structurally but contains a strong local pattern, record the failure and still cite the local pattern in `Suggested Fixes`.
- Evidence must come from the skill under audit and the rubric criteria. Do not penalize a skill for solving a problem differently than expected — evaluate whether it satisfies the rubric's criteria for that dimension.
- If the skill under audit is itself a meta-skill (e.g., it audits, creates, or manages other skills), do not penalize structural patterns that serve the meta-skill's function. A skill-audit skill referencing a rubric is not "unnecessary reference loading."

### Phase 4 - Synthesize and score

Use [references/report-template.md](references/report-template.md) to assemble the report.

Verdict rules:
- Per-dimension verdicts: use the "Overall D# verdict" rules in the rubric for each dimension. The rubric's per-dimension rules are criterion-specific — they are the authority.
- Overall `PASS`: all dimensions `PASS` or `AUTO-PASS`
- Overall `MARGINAL`: no `FAIL`, at least one `MARGINAL`
- Overall `FAIL`: any dimension `FAIL`

### Phase 5 - Validate before writing

Before writing `skill-audit.md`, verify:
- every finding has evidence with file and line attribution
- every dimension has a verdict or `N/A`
- severity counts match the detailed findings
- summary counts match the scorecard
- the issues diagram contains only real findings
- the fix plan groups related work instead of repeating the same rewrite three times
- the output path is correct

### Phase 6 - Write the report

Write the completed audit to `{skill_directory}/skill-audit.md`, overwriting any prior file.

If a prior `skill-audit.md` was read in Phase 1, include a section noting resolved, persisting, and new findings.

## Anti-Patterns

- Auditing against personal taste instead of the rubric
- Calling a skill "good overall" without line-level evidence
- Treating all platform-specific fields as mandatory when the target platform is unclear
- Penalizing a skill for using references when the references are discoverable and well-routed
- Missing explicit defaults, thresholds, or escalation gates
- Rewarding a gotchas section that only says "be careful"
- Repeating the same fix in three different dimensions
