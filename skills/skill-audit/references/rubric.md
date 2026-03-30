# Audit Rubric - Detailed Scoring Criteria

Use this rubric when reviewing a skill. Each dimension has explicit `PASS` / `MARGINAL` / `FAIL` thresholds. The rubric is the sole scoring authority — do not apply criteria from outside this file.

## Contents

- [D1 - Frontmatter and Triggering](#d1---frontmatter-and-triggering)
- [D2 - Content Quality](#d2---content-quality)
- [D3 - Structure and Context Efficiency](#d3---structure-and-context-efficiency)
- [D4 - Scope and Category Fit](#d4---scope-and-category-fit)
- [D5 - Resource Design](#d5---resource-design)
- [D6 - Degrees of Freedom](#d6---degrees-of-freedom)
- [D7 - Gotchas and Anti-Patterns](#d7---gotchas-and-anti-patterns)
- [D8 - Usability and Completeness](#d8---usability-and-completeness)
- [D9 - Platform Feature Usage](#d9---platform-feature-usage)
- [Severity Classification](#severity-classification)

## D1 - Frontmatter and Triggering

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| `name` field | Present, lowercase-hyphenated (`^[a-z0-9-]+$`), action-oriented, specific, max 64 chars, no leading/trailing/double hyphens | Present but generic, noun-oriented, or minor format issue (e.g., slightly long) | Missing, contains spaces/uppercase, or unparseable |
| Frontmatter validity | YAML frontmatter parses cleanly as a dict. Only recognized keys present (e.g., `name`, `description`, `license`, `allowed-tools`, `metadata`). | Parses correctly but contains 1-2 unrecognized keys that don't cause harm. | Frontmatter missing, unparseable, or contains keys that conflict with runtime behavior. |
| `description` field | Reads as a model-facing routing instruction: what the skill does + when to trigger + when NOT to trigger. 20-1024 chars. Trigger-first and concrete. No angle brackets. | Covers what + when, but missing exclusions or reads like a summary. | Missing, vague, under 20 chars, over 1024 chars, reads like a feature summary ("This skill helps you..."), or could describe two different skills. |
| Description voice | Written in third person ("Processes Excel files..."). Front-loads the key use case. Includes terms users would naturally say. | Third person but buries the key use case or lacks natural trigger terms. | First/second person ("I can help you...", "You can use this to...") or doesn't include any terms a user would naturally say. |
| Trigger precision | Would trigger on relevant requests and not on adjacent-but-wrong requests. | Triggers correctly but also on some false-positive cases. | Would miss common invocations or fire on unrelated requests. |
| Invocation control | Side-effect or destructive skills disable auto-invocation. Background knowledge skills disable user invocation. Skills with no side effects allow both. | Invocation settings present but arguably miscalibrated for the skill's risk profile. | Side-effect skill allows auto-invocation with no safeguard, or background knowledge is user-invocable as a command that does nothing useful. |
| Platform-specific fields | Runtime-specific fields are correct for the target platform, or marked `N/A` when the platform is unknown. | Field choice is plausible but uncertain. | Fields are treated as universal when they are actually platform-specific, or are clearly wrong for the target runtime. |
| Arguments | Clear argument expectations when the skill takes inputs. | Skill takes inputs but format is vague. | Skill takes inputs but gives no usable argument shape. |
| Extra frontmatter | No unnecessary or conflicting fields. | Unused fields that do not harm execution. | Fields conflict, confuse, or imply the wrong runtime behavior. |

**Overall D1 verdict:**
- FAIL if frontmatter unparseable OR `description` is missing/vague OR trigger precision is FAIL OR platform/runtime fields are clearly wrong
- MARGINAL if any criterion is MARGINAL and none is FAIL
- PASS if all criteria are PASS

## D2 - Content Quality

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| Directive ratio | >90% of body lines are directives or concrete examples | 70-90% directive lines | <70% directive lines |
| General knowledge | Zero lines explaining what things are that the agent already knows | 1-3 lines of general knowledge | >3 lines or an entire section of general knowledge |
| Motivation/wisdom | Zero lines of "why this matters" or persuasive framing | 1-2 instances of motivation | Dedicated "Background" / "Why" / "Motivation" sections |
| Concreteness | Every instruction has a concrete example or specific criteria | Most are concrete, a few vague | Multiple instructions like "write clear X" or "ensure good Y" |
| Citations | None | 1 instance | Multiple "according to" or paper/course references |
| Voice | All instructions in active imperative ("Do X", "Use Y") | 1-2 passive constructions | Pervasive passive voice ("should be ensured that...") |
| Over-prompting | Instructions use normal language. Emphasis is structural (section placement, ordering) not typographic. | 1-2 instances of "CRITICAL:", "IMPORTANT:", or "YOU MUST" where the emphasis is genuinely warranted. | Pervasive emphasis markers ("CRITICAL:", "YOU MUST", "IMPORTANT:", all-caps directives) used as a substitute for clear instruction placement. |
| Terminology consistency | Same concept uses the same term throughout the skill and its references. | 1-2 inconsistencies in non-critical terms. | Key concepts referred to by different names in different sections (e.g., endpoint/URL/route/path interchangeably), creating ambiguity. |

**Counting method:** Read every line in the body (excluding frontmatter, code blocks, blank lines). Classify as:
- **Directive**: imperative verb ("Do X", "Use Y", "Flag Z"), concrete example, template, formula, threshold, anti-pattern one-liner
- **Non-directive**: explanation, motivation, definition, general knowledge, citation, rhetorical question, passive instruction

Report: `{directive_count}/{total_lines} lines are directives ({percentage}%)`

**Overall D2 verdict:**
- FAIL if directive ratio <70% OR >3 general knowledge lines OR dedicated motivation sections OR pervasive emphasis markers
- MARGINAL if directive ratio 70-90% OR 1-3 general knowledge lines OR 1-2 motivation instances OR terminology inconsistencies
- PASS if directive ratio >90% AND zero general knowledge AND zero motivation AND active imperative voice AND consistent terminology AND normal-language emphasis

## D3 - Structure and Context Efficiency

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| SKILL.md length | ≤400 lines | 401-500 lines | >500 lines |
| Progressive disclosure | Three clear levels: frontmatter → body → references | Two levels but detail crammed into body | Everything in SKILL.md, no splitting |
| Reference depth | All references one level from SKILL.md | One instance of nesting with a clear practical justification | Nested references as a pattern (SKILL.md → ref.md → detail.md) |
| Reference TOC | Files >100 lines have TOC at top | TOC present but incomplete or out of date | No TOC for files >100 lines |
| Reference read guidance | SKILL.md describes when to read each reference with clear triggers | References exist but read guidance is incomplete or vague | References are not mentioned in SKILL.md |
| Reference loading quality | SKILL.md states which references to read and when, with clear triggers. Critical references loaded at task start; optional depth deferred until relevant. | Reference strategy is workable but inefficient — e.g., universally needed references loaded on-demand, or optional references loaded eagerly. | Critical references are buried, loaded too late, or impossible to discover |
| Section justification | Every section distinct, no redundancy | Minor overlap between sections | Redundant sections or copy-pasted content |
| Token budget | No section could be cut without losing capability | 1-2 "nice to have" sections | Entire sections add no capability |
| Content duplication | No content from SKILL.md body repeated in reference files | Minor overlap (1-2 points restated) | Significant SKILL.md content copy-pasted into references |
| Bundled file references | Uses stable bundled-file paths appropriate to the runtime | Relative paths work but are brittle | Hard-coded absolute paths |

**Overall D3 verdict:**
- FAIL if >500 lines OR nested references OR major redundancy OR significant duplication
- MARGINAL if 401-500 lines OR missing TOC OR minor overlap OR no read guidance
- PASS if ≤400 lines AND proper disclosure AND no redundancy AND clear read guidance

## D4 - Scope and Category Fit

Valid categories (a skill must fit exactly one):
1. Library / API Reference
2. Product Verification
3. Data Fetching / Analysis
4. Business Process / Automation
5. Code Scaffolding / Templates
6. Code Quality / Review
7. CI-CD / Deployment
8. Runbook
9. Infrastructure Operations

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| Category fit | Fits cleanly into one category | Primary clear but bleeds into a second | Straddles 3+ or uncategorizable |
| Task scoping | Every sentence helps the agent do the task | 1-3 sentences of process/org advice | Sections of org guidance or project management |
| Audience | Written for the agent | Mostly agent-facing, occasional human asides | Reads like human documentation |
| Singular focus | Skill does one job well | One primary job with minor secondary concern | Multiple unrelated jobs |

**Overall D4 verdict:**
- FAIL if uncategorizable OR sections of org/process advice OR human-audience framing OR multiple unrelated jobs
- MARGINAL if bleeds into second category OR 1-3 off-scope sentences OR occasional human asides
- PASS if single-category, task-scoped, agent-facing, singular focus

## D5 - Resource Design

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| File placement | Every file in correct directory | 1 misplaced file | Multiple misplaced or files outside the standard directories |
| Necessity | Every file used, couldn't be generated on the fly | 1 arguably unnecessary file | Multiple unnecessary files |
| Extraneous files | No README, CHANGELOG, INSTALLATION_GUIDE, etc. | 1 extraneous file | Multiple extraneous files |
| Script quality | Scripts tested, clear I/O, handle errors | Untested or unclear I/O | Buggy or copy-pasted boilerplate |
| Reference organization | Domain-organized with clear internal structure | Exist but organization is flat or chronological rather than by domain | Dumped without organization |
| Large references | Files >10k words: grep patterns in SKILL.md | Files >10k words: structured with TOC | Files >10k words: no navigation aids |
| Cross-file duplication | No duplicated information across reference files, scripts, or assets | Minor repetition across 2 bundled files | Same content in multiple bundled files |
| Script vs. reference distinction | SKILL.md clearly distinguishes executable scripts ("Run `analyze.py`" — output enters context) from reference files ("See `reference.md`" — content enters context). Each file's role is unambiguous. | Distinction exists but 1-2 files have ambiguous roles. | No distinction made. Reader cannot tell which files are executed vs. read into context. |

**Overall D5 verdict:**
- FAIL if multiple misplaced OR multiple extraneous OR buggy scripts OR major duplication
- MARGINAL if 1 misplaced/unnecessary/extraneous OR unclear guidance OR ambiguous script/reference roles
- PASS if all correctly placed, necessary, well-organized, non-duplicative, with clear script/reference distinction

## D6 - Degrees of Freedom

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| Freedom calibration | Specificity matches fragility: loose for judgment, tight for error-prone | 1-2 mismatches | Systematically over- or under-specified |
| Default escalation | Simplest approach first, escalates with prerequisites | Defaults present, escalation unclear | Jumps to advanced without a simpler default |
| Defaults and thresholds | Skill picks a default for every key decision, states deviation conditions, and defines thresholds where they matter (e.g., severity cutoffs, scope tiers, format switches). Strict-vs-flexible boundaries are explicit. | Some defaults exist but thresholds are vague or missing. Agent must guess when to deviate. | Key choices left open ("choose an appropriate format") with no default, threshold, or criteria for choosing. |
| Hard-coded values | None that should be parameters | 1-2 limiting reuse | Multiple that break in other contexts |
| Approach diversity | Flexible where multiple approaches valid | Mildly prescriptive in 1-2 areas | Dictates single approach for variable tasks |
| Unknown handling | Skill declares explicit behavior for missing inputs, ambiguous requests, and failure cases ("If X is not provided, ask the user", "If X fails, return Y"). | Some unknowns handled, but 1-2 common cases left implicit. | No handling for missing inputs or failure cases. Agent must guess behavior for unknowns. |

**Overall D6 verdict:**
- FAIL if systematic railroading OR systematic under-specification OR multiple hard-coded values OR no unknown handling
- MARGINAL if 1-2 mismatches OR unclear escalation OR mildly prescriptive OR implicit unknown handling
- PASS if well-calibrated with clear defaults, appropriate flexibility, and explicit unknown handling

## D7 - Gotchas and Anti-Patterns

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| Gotchas presence | Dedicated section or tightly grouped failure module with concrete domain-specific failure points | No section but some gotchas woven into body | No gotchas despite domain having known pitfalls |
| Anti-pattern format | Concise one-liners OR concise failure modules with recognition test + corrective action | Mostly concise, but 1-2 are bloated | Paragraphs of wisdom with no operational signal |
| Recognition + correction | Each anti-pattern includes how to recognize the failure and what to do instead | Some have corrections but recognition is implicit | Anti-patterns are just labels ("don't do X") with no recognition test or corrective action |
| Warning conversion | All body warnings stated as directives ("Do X, not Y"), not "Be careful of X" or "Watch out for Y" | 1-2 remain as "Be careful of X" | Multiple "watch out" / "be aware" warnings |
| Coverage | Failure modes specific to domain, agent wouldn't predict them | Covers obvious but misses domain-specific | Only generic failures ("don't write bugs") |
| Provenance | Gotchas grounded in observed failures (specific, non-obvious) | Mix of observed and hypothetical | All brainstormed (generic, predictable) |
| Time-sensitive content | All instructions are timeless. No version-pinned workarounds, date-dependent logic, or "before X, use old API" buried in the body. | 1 instance of time-sensitive content that is clearly dated and isolated. | Multiple time-sensitive instructions embedded in the body without dates, will silently go stale. |
| Magic numbers in scripts | Every non-obvious constant in bundled scripts has an inline comment justifying its value. | 1-2 undocumented constants that are arguably self-evident. | Multiple undocumented magic numbers (e.g., `TIMEOUT = 47`) with no justification. |

**Overall D7 verdict:**
- FAIL if no gotchas despite pitfalls OR paragraphs of wisdom OR only generic failures OR multiple stale time-sensitive instructions
- MARGINAL if woven in but no section OR unconverted warnings OR all hypothetical OR implicit recognition
- PASS if dedicated section, one-line with recognition + correction, domain-specific, converted warnings, observed failures, timeless content, documented constants

## D8 - Usability and Completeness

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| Immediate usability | No unstated prerequisites | 1 implicit prerequisite | Multiple unstated prerequisites |
| Setup handling | Config collection described (config.json, AskUserQuestion) | Mentioned but unclear | Requires setup but doesn't address it |
| Edge cases | Common cases handled with specific instructions | Mentioned without resolution | No handling despite obvious cases |
| Verifiability | Verification method is actionable and observable | Mentioned but not actionable | No verification for testable output |
| Verification depth | Includes observable checks, a retry/fix loop with a cycle limit, an escalation trigger when the loop exhausts, and a delivery caveat for unresolved issues. | Verification exists but depth is partial — e.g., checks without retry, or retry without escalation. | Verification is token or purely aspirational |
| Output contract | Defines the artifact type, its sections or structure, and what "done" looks like. Agent can verify completion against the contract without asking the user. | Output shape exists but is loose — agent can finish but may not match expectations. | No clear output shape for a task that should define one |
| Feedback loops | Multi-step operations include explicit validate-fix-repeat loops with re-entry points. Quality-critical tasks have cycle limits and escalation. | Validation exists but is linear (check once, no re-entry if issues found). | Multi-step operation with no validation loop despite quality-critical output. |
| Plan-before-execute | Destructive or batch operations write a plan to an intermediate artifact, validate it, then execute. User sees the plan before irreversible changes. | Destructive operations have a confirmation step but no inspectable intermediate plan. | Destructive or batch operations execute directly with no plan or confirmation gate. |
| Completeness | Agent completes task with only this skill + resources | Needs 1-2 external pieces | Significantly blocked without external guidance |

**Overall D8 verdict:**
- FAIL if multiple unstated prerequisites OR no verification for testable output OR significantly blocked OR destructive ops with no confirmation
- MARGINAL if 1 implicit prerequisite OR unclear setup OR non-actionable verification OR linear validation only
- PASS if immediately usable with clear setup, edge cases, verification loops, output contract, and plan-before-execute where needed

## D9 - Platform Feature Usage

Evaluate only criteria that apply to the target runtime. Mark `N/A` for irrelevant criteria. If all are `N/A`, verdict is `AUTO-PASS`.

If the target platform is not stated in SKILL.md or evident from bundled files (e.g., no `agents/` directory, no platform-specific syntax), AUTO-PASS D9 and note: "Target platform not specified — no platform criteria evaluated."

### General platform criteria

| Criterion | Applies when | PASS | MARGINAL | FAIL |
|---|---|---|---|---|
| Hooks or runtime hooks | Skill automates pre/post-action behavior | Scoped correctly and only when the skill runs | Present but awkwardly scoped | Clearly needed but absent |
| Data storage | Skill produces persistent state | Uses the runtime's stable data location | Uses a workable but non-standard location | Writes mutable state into the skill directory or another unsafe location |
| Config setup | Skill needs user-specific values | Checks config and prompts for missing fields | Mentions config but no collection pattern | Hard-codes user-varying values without config |
| Composability | Skill depends on another skill | Names dependencies explicitly by skill name | References vaguely ("use the appropriate skill") | Dependency implied but unnamed |
| String substitutions | Skill takes arguments or references bundled files | Uses the runtime's substitution features appropriately | Uses some but misses opportunities | Hard-codes values that should use substitutions |

### OpenAI / Codex platform criteria

Apply these when `agents/openai.yaml` exists or the skill is explicitly targeting OpenAI/Codex. If neither condition is met, skip this section.

`agents/openai.yaml` is a platform deployment artifact consumed by the downstream runtime. SKILL.md should NOT reference the YAML file, its fields, or icon PNGs. The audit evaluates the YAML's contents independently.

| Criterion | PASS | MARGINAL | FAIL |
|---|---|---|---|
| `openai.yaml` presence | Present in `agents/` with required fields: `display_name`, `short_description`, `default_prompt`. Values are clear and accurate. | Present but missing optional fields or values are generic. | Missing entirely for an OpenAI-targeted skill, or required fields absent/empty. |
| `display_name` | Human-facing, title-cased, semantically consistent with SKILL.md `name`. | Present but generic or inconsistent with skill purpose. | Missing or misleading. |
| `short_description` | Clear one-line human-facing summary for browsing/discovery UI. 25-64 chars. | Present but vague or outside length range. | Missing or inaccurate. |
| `default_prompt` | Actionable invocation instruction using `$skill-name` that matches SKILL.md `name` exactly. | Present but vague invocation or minor `$skill-name` mismatch. | Missing, no `$skill-name` reference, or completely wrong name. |
| `allow_implicit_invocation` | Correctly set: `true` (or absent, defaults true) for safe broad-trigger skills. `false` for skills with side effects or destructive actions. | Absent but skill has mild side effects (arguable). | `true` for a skill with destructive side effects. |
| Icon assets | If `icon_small` or `icon_large` declared, files exist at declared paths in `assets/`. | Paths declared but files missing or wrong format. | Icons referenced from non-existent paths. |
| Instructions portability | SKILL.md body works as a standalone system prompt. No platform-specific syntax (`${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`) that would fail silently on the target runtime. | 1-2 platform-specific references that need minor adaptation. | Heavy reliance on non-target-platform syntax throughout SKILL.md body. |
| YAML isolation | SKILL.md does not reference `openai.yaml`, its fields, or icon assets. The YAML is a platform artifact, not skill content. | 1 minor reference to YAML metadata that doesn't affect execution. | SKILL.md documents or depends on YAML fields, creating coupling between skill content and platform config. |

**Overall D9 verdict:**
- AUTO-PASS if no criteria apply, target platform is unknown, and no `agents/` directory exists
- FAIL if any applicable criterion FAILs (general or platform-specific)
- MARGINAL if any applicable is MARGINAL, none FAIL
- PASS if all applicable criteria PASS

## Severity Classification

Use this table to assign severity to specific findings. When the rubric threshold and this table disagree, the rubric threshold wins.

### Frontmatter flags

| Finding | Severity |
|---|---|
| `description` missing or under 20 words | CRITICAL |
| `description` reads like a summary, not a trigger | CRITICAL |
| `description` in first/second person instead of third person | MAJOR |
| `description` could match two different skills | MAJOR |
| `description` missing "when NOT to use" clause | MAJOR |
| `description` buries key use case after less important details | MAJOR |
| `name` is generic noun instead of action-oriented | MAJOR |
| Side-effect skill allows auto-invocation with no safeguard | MAJOR |
| Unused frontmatter fields that don't harm execution | MINOR |

### Content flags

| Finding | Severity |
|---|---|
| Dedicated "Background" / "Context" / "Why This Matters" section with no directives | CRITICAL |
| Pervasive emphasis markers as substitute for clear structure | MAJOR |
| "X is important because Y" — wisdom/motivation | MAJOR |
| "consider" / "think about" instead of imperative | MAJOR |
| "According to..." or paper/course citation | MAJOR |
| Key concept called by different names in different sections | MAJOR |
| Placeholder example ("e.g., your function", "something like X") | MINOR |
| Passive voice instruction ("should be ensured that...") | MINOR |
| Framework list without a default choice | MINOR |
| 1-2 emphasis markers where genuinely warranted | MINOR |

### Structure flags

| Finding | Severity |
|---|---|
| SKILL.md body >500 lines | CRITICAL |
| Reference nesting (SKILL.md → ref.md → detail.md) | CRITICAL |
| Reference file >100 lines with no TOC | MAJOR |
| File outside standard directories and not SKILL.md | MAJOR |
| SKILL.md body 401-500 lines | MAJOR |
| Content duplicated between SKILL.md and references | MAJOR |
| Reference exists but SKILL.md never says when to read it | MAJOR |

### Scope flags

| Finding | Severity |
|---|---|
| Skill straddles 3+ categories | CRITICAL |
| Skill addresses human reader instead of agent | MAJOR |
| Skill fits two categories | MAJOR |
| Sentence advises on process, team structure, or scheduling | MAJOR |

### Resource flags

| Finding | Severity |
|---|---|
| Script or reference never referenced from SKILL.md | MAJOR |
| Script vs. reference role ambiguous — cannot tell if file is executed or read | MAJOR |
| Asset file referenced in body but not used in output | MINOR |
| Script that generates boilerplate the agent writes anyway | MINOR |
| 1-2 undocumented constants in scripts that are arguably self-evident | MINOR |

### Freedom flags (D6)

| Finding | Severity |
|---|---|
| Systematically over- or under-specified instructions | CRITICAL |
| Key choices left open with no default or criteria for choosing | MAJOR |
| No handling for missing inputs or failure cases | MAJOR |
| Multiple hard-coded values that break in other contexts | MAJOR |
| Jumps to advanced approach without a simpler default | MAJOR |
| Dictates single approach for variable tasks | MAJOR |
| Some unknowns handled but 1-2 common cases left implicit | MINOR |
| 1-2 hard-coded values limiting reuse | MINOR |

### Gotcha flags (D7)

| Finding | Severity |
|---|---|
| No gotchas section despite domain having known pitfalls | CRITICAL |
| Paragraphs of wisdom with no operational signal | CRITICAL |
| Only generic failures ("don't write bugs", "test your code") | MAJOR |
| Anti-patterns are labels only — no recognition test or corrective action | MAJOR |
| Multiple "watch out" / "be aware" warnings not converted to directives | MAJOR |
| Multiple time-sensitive instructions without dates | MAJOR |
| Multiple magic numbers with no justification | MAJOR |
| All gotchas look hypothetical rather than grounded in observed failures | MAJOR |
| 1-2 unconverted warnings | MINOR |
| 1 instance of time-sensitive content, clearly dated | MINOR |
| 1-2 undocumented constants that are arguably self-evident | MINOR |

### Usability flags (D8)

| Finding | Severity |
|---|---|
| Multiple unstated prerequisites | CRITICAL |
| No verification method for testable output | CRITICAL |
| Significantly blocked without external guidance | CRITICAL |
| Destructive operation executes directly with no plan or confirmation | MAJOR |
| Multi-step operation with no validation loop for quality-critical output | MAJOR |
| No clear output shape for a task that should define one | MAJOR |
| Requires setup but doesn't address how to collect config | MAJOR |
| No handling for obvious edge cases | MAJOR |
| Verification exists but is not actionable | MINOR |
| Validation exists but is linear (no re-entry) | MINOR |

### Platform flags (general)

| Finding | Severity |
|---|---|
| Hard-coded user-varying values without config | MAJOR |
| Dependency on another skill implied but unnamed | MAJOR |
| Platform syntax that would fail silently on a different runtime | MAJOR |

### Platform flags (OpenAI / Codex)

| Finding | Severity |
|---|---|
| `agents/openai.yaml` missing entirely for an OpenAI-targeted skill | CRITICAL |
| `allow_implicit_invocation: true` for a skill with destructive side effects | CRITICAL |
| `openai.yaml` missing `display_name`, `short_description`, or `default_prompt` | MAJOR |
| `$skill-name` in `default_prompt` does not match SKILL.md `name` | MAJOR |
| Icon paths declared but files do not exist in `assets/` | MAJOR |
| SKILL.md body contains platform-specific syntax that fails on the target runtime | MAJOR |
| SKILL.md references `openai.yaml` fields or icon assets (coupling to platform artifact) | MAJOR |
| Frontmatter YAML unparseable or contains conflicting keys | MAJOR |
| `name` field violates format (`^[a-z0-9-]+$`, max 64 chars) | MAJOR |
| `description` over 1024 chars or contains angle brackets | MINOR |
| `short_description` outside 25-64 char range | MINOR |
