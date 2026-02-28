# Context Manifest: SPA Assistant Playbook Completion

## Task
Rewrite playbooks 03-08 to match the architecture of the completed playbooks (01, 02).

## Key Constraint
Each playbook must follow the two-pass structure, include self-analysis checklists, reference shared infrastructure, and follow the edit protocol.

## Files Included

### Infrastructure (Reference These)
| File | Purpose |
|------|---------|
| `dist/system-prompt.md` | Operating instructions - use as style guide |
| `dist/output-contract.md` | Deliverable format - all playbooks must produce this |
| `dist/global-tests.md` | Validation tests - reference relevant tests in each playbook |
| `dist/term-map.yml` | Canonical vocabulary - use for detection keywords |
| `dist/benchmarks.md` | Market data - reference for market comparisons |

### Completed Playbooks (Use as Templates)
| File | Purpose |
|------|---------|
| `dist/01-definitions.md` | **PRIMARY TEMPLATE** - follow this structure exactly |
| `dist/02-purchase-price.md` | Secondary template - similar structure |

### Playbooks to Rewrite
| File | Topic |
|------|-------|
| `dist/03-wc-net-debt.md` | Closing statement & true-up process |
| `dist/04-earnouts.md` | Earnout / contingent consideration |
| `dist/05-reps-warranties.md` | Representations & warranties |
| `dist/06-commercial-terms.md` | Commercial terms summary |
| `dist/07-redline.md` | Redline comparison |
| `dist/08-roleplay.md` | Negotiation roleplay |

### Reference Materials (For Domain Knowledge)
| File | Purpose |
|------|---------|
| `reference/consolidated/definition-comparison-matrix.md` | Cross-deal patterns |
| `reference/consolidated/benchmark-data.md` | Real deal numbers |
| `reference/consolidated/counsel-question-bank.md` | Questions by topic |
| `reference/consolidated/red-flag-library.md` | Issues from real deals |
| `reference/consolidated/suggested-revisions-library.md` | Drafting examples |
| `reference/consolidated/playbook-validation-report.md` | Gaps to address |

## Reading Order

1. `01-definitions.md` — **Study this structure carefully** - all rewrites should match
2. `output-contract.md` — Understand required output format
3. `global-tests.md` — Know which tests each playbook should reference
4. Review existing playbooks 03-08 to understand current content
5. Use reference materials for domain-specific details

## Required Structure for Each Playbook

```markdown
# Playbook XX: [Title]

## Purpose
[One paragraph explaining what this playbook does]

## When to Use
[Bullet list of triggers/keywords]

---

## Process Overview
**Pass 1: Extract**
1. [Steps...]

**Pass 2: Interpret**
4. [Steps...]

---

## Step 1: [First Step]
[Detailed instructions]

## Step 2: [Second Step]
[Detailed instructions]

...

## Self-Analysis Checklist
[Yes/no questions with citation requirements]

---

## Observation Writing Guide
[Poor vs good examples]

---

## Edit Protocol
[Standard no-edit-by-default protocol]

---

## Follow-on Prompts
1. [Prompt 1]
2. [Prompt 2]
3. [Prompt 3]
4. [Prompt 4]
5. [Prompt 5]
```

## Quality Criteria

Each rewritten playbook must:
1. Follow the exact structure above
2. Include two-pass process (Extract → Interpret)
3. Reference shared infrastructure files
4. Have rigorous self-analysis checklists (yes/no + citations)
5. Include observation writing examples
6. Follow edit protocol (no edits by default)
7. End with 5 follow-on prompts
