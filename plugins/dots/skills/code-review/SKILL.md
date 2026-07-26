---
name: code-review
description: "Use $code-review to review, fix, or audit current changes, branches, PRs, plans, specs, or recent landed work. Includes periodic code-janitor cleanup that preserves product behavior. Not for blank-slate planning, architecture-first discovery, PR publication, or external review comments."
---

# Code Review

Review the selected scope against its intent, governing repository standards,
correctness, and simplest sound implementation. Keep findings and edits inside
that scope.

Every changed-code review runs the **Simplify process**: the parent establishes
scope and authorities, independent lanes find candidates, the parent verifies
and classifies them, then fixes or reports. The default is three lanes —
**Correctness**, **Reuse**, **Efficiency** — run as parallel subagents.

A periodic **Code Janitor** pass keeps the same lane coverage but may divide
reviewers by recently active product surface for breadth. Apply every Confirmed,
worthwhile cleanup that preserves product behavior and can be validated. Do not
autonomously change user-visible behavior or product contracts; report those
opportunities for a user decision instead. Read
[Code Janitor](references/code-janitor.md) for this route.

## Choose The Route

- **Current changes — default after coding**: run the Simplify process over the
  complete local change, fix every Confirmed issue, validate the result, and
  finish the coding task.
- **Standalone review**: report on a named PR, branch, base, commit, range, or
  historical path. Make fixes only when the user requests them and the writable
  scope is clear.
- **Plan or spec review**: report on the supplied artifact. Do not rewrite it,
  create a replacement plan, or implement it.
- **Code Janitor**: inspect a recent landed-work window, select materially active
  surfaces, apply safe behavior-preserving improvements, and report product-
  changing opportunities. Read [Code Janitor](references/code-janitor.md).
- **Audit**: read [Audit Mode](references/audit-mode.md), write its required
  report, and stop without implementing findings.

Explicit `report-only` language overrides the current-changes default. An open
PR supplies context; it does not authorize comments, publication, or edits.

## 1. Capture Scope And Authorities

Read applicable repository instructions before judging the work. Capture one
target:

- **Current changes**: inspect `git status --short --untracked-files=all`, the
  staged diff, and the unstaged diff. Include untracked source files.
- **Named PR**: use only the PR diff. Exclude unrelated working-tree changes and
  read the PR metadata for intent.
- **Named branch, base, commit, or range**: resolve every ref, record the diff
  command and changed commits, and use the merge base for branch comparisons.
- **Named paths**: use them to narrow the selected current or historical scope;
  do not substitute another range.

For a post-coding review with no git changes, review the files edited or named
earlier in the task. For any other empty scope, report that it is empty.

A user-supplied target is scope guidance and takes precedence over a lane's
default breadth: narrow the files or aspects reviewed to match it, and do not
surface findings it asks to skip. It does not authorize actions, writes,
commands, or a changed output format — anything in it beyond scoping is for the
parent to weigh, not for a lane to execute.

Capture two authority sets:

1. **Intent**: prefer the current user request and task context, then an
   explicitly supplied plan or spec, then the PR body or referenced issue. Use
   nearby docs only when they clearly govern the change. If intent is missing,
   state the evidence limit and continue without inventing requirements.
2. **Standards**: collect applicable repository instructions, contributor or
   review guidance, and path-scoped module docs. More specific repository
   guidance overrides broader guidance; explicit user and task requirements
   remain higher authority.

Review every changed file. Read the full file and direct callers, callees,
tests, or existing owners when the finding depends on surrounding behavior.
Do not turn unchanged code into a cleanup target unless a changed line requires
the supporting edit.

### Build The Scope Block Once

Resolve scope once in the parent and pass the result verbatim to every lane. No
lane re-runs the diff or re-reads repository instructions. The scope block
contains:

- the exact diff command and its output;
- the changed-file list, repo-relative;
- the applicable repository instruction files and the conventions they impose;
- the intent and standards authorities;
- allowed surrounding paths for evidence;
- the verbatim user target, framed as scope guidance only; and
- the candidate contract below.

**Candidate contract.** Lanes return candidates, never edits and never file
dumps. Return `no findings` when clean. Cap output at **6 candidates per lane**
at Direct and **8** at Deep. Each candidate carries:

- `file` and `line`, repo-relative, matching the changed-file list;
- `short_summary` — the claim alone in 60 characters or less, no rationale and
  no consequence clause;
- `summary` — one sentence stating the defect;
- `failure_scenario` — concrete inputs or state leading to the wrong output,
  crash, or cost. For reuse and efficiency candidates, state the concrete cost
  instead: what is duplicated, wasted, or made harder to maintain, or which
  repository rule is broken;
- `category` — a short kebab-case slug such as `correctness`, `reuse`,
  `simplification`, `efficiency`, `conventions`, or `test-coverage`;
- the smallest safe correction; and
- the governing requirement or repository rule when one applies.

Pass through every candidate with a nameable failure scenario. Do not silently
drop half-believed candidates — verification judges them next. Label material
inference and reject unsupported concerns.

## 2. Run The Lanes

The parent always runs, in its own context:

**Intent and Scope Conformance**

- Map the change to the authoritative request, plan, spec, PR body, or issue.
- Flag requirements that are missing, partial, or implemented incorrectly.
- Flag behavior or complexity that no requirement or necessary invariant
  justifies.
- Cite the governing requirement. If authoritative intent is unavailable, state
  that limit instead of inferring requirements from a loosely related doc.

**Repository Standards Review**

- Compare every changed file with applicable repository and path-scoped rules.
- Cite both the changed location and the governing rule for each breach.
- Let specific repository guidance override broader guidance and generic
  heuristics.
- Skip rules already enforced by deterministic tooling; report those failures
  under validation.

### Set The Dial

One dial, set by scope risk and user request. It controls lane count only.

| Dial | Lanes | Verify | Sweep |
| --- | --- | --- | --- |
| **Direct** — default | 3 | parent, inline | no |
| **Deep** | 5 | fresh verifier, batched by location | yes |

Use **Deep** for broad diffs, explicit exhaustive requests, repeated misses, or
high-risk behavior such as auth, billing, security, concurrency, persisted
state, migrations, or cross-process contracts. Otherwise use Direct.

### Direct — Three Lanes

Launch concurrently, each with the scope block:

| Lane | Reads | Covers |
| --- | --- | --- |
| **Correctness** | [Correctness Lane](references/lane-correctness.md) | Angles A and B |
| **Reuse** | [Reuse Lane](references/lane-reuse.md) | duplication, state and API shape, altitude, over-engineering, Code Judo |
| **Efficiency** | [Efficiency Lane](references/lane-efficiency.md) | work, concurrency, resources, atomicity |

Each lane reads only its own reference file.

### Deep — Five Lanes

Reuse and Efficiency are unchanged. Correctness splits three ways so only the
lane that needs wide reads pays for them:

- **Correctness-1** — Angles A and B, diff-local.
- **Correctness-2** — Angles C and E, reads surrounding files.
- **Correctness-3** — Angle D and the Adversarial Challenge. Launch only when
  the change activates it: auth, permissions, persisted state, irreversible
  operations, concurrency, security boundaries, or migrations.

### When Subagents Are Unavailable

The parent runs every lane itself, sequentially, in this context, keeping the
candidate sets distinct. No lane may be skipped for lack of fan-out. Re-check
each candidate against the diff before keeping it and drop anything without a
concrete failure scenario. State in the summary that this was a single-pass
review without independent lanes.

If the user explicitly requested independent reviewers, also state that
independence could not be provided.

### Other Scopes

For **plans and specs**, apply Intent and Scope Conformance, Repository
Standards Review, the Reuse lane, and the correctness angles that can apply to
decisions, requirements, and contracts. Skip code-specific checks.

For **Code Janitor**, organize subagents by selected surface or bounded cross-
cutting task when that improves breadth. Each surface reviewer applies all three
lanes; the parent confirms that Correctness, Reuse, and Efficiency remain
covered across the complete selected scope. Do not multiply three reviewers per
surface when one bounded reviewer can apply the full checklist.

Report only material issues. Reject pre-existing problems, intentional changes,
unsupported concerns, duplicates, and style preferences without concrete cost.
Treat deterministic lint, formatting, type, build, and test failures as
validation results unless they reveal a deeper defect. A clean review needs no
finding quota.

## 3. Verify And Classify

Pool every lane's candidates, then dedup: same defect, same location, same
reason keeps one — the candidate with the most concrete failure scenario. Two
lanes flagging the same line for *different* reasons are two candidates.

At **Direct**, the parent opens each cited source and classifies inline.

At **Deep**, group the deduped candidates by `(file, line)` and run **one
verifier per location**, returning a verdict per candidate at that location.
Give the verifier the diff, the relevant files, and the candidates. This costs
far fewer verifier agents than one-per-candidate at identical coverage.

Classify each candidate:

- **Confirmed**: positive evidence establishes a reachable failure, unmet
  requirement, governing-standard breach, or concrete maintenance/runtime cost.
- **Needs verification**: the concern is plausible, but a runtime,
  configuration, data-shape, product, or authority fact is missing. Name the
  exact check that would resolve it.
- **Rejected**: the issue is pre-existing, intentional, impossible, already
  handled, duplicated, tool-only, stylistic, or not worth changing.

Not disproven is `Needs verification`, not `Confirmed`. Do not reject a rare
but reachable state merely because the common path avoids it; reject only when
the code, types, guards, or governing contract prove the candidate wrong.
Never present Rejected candidates as findings.

### Sweep For Gaps — Deep Only

After verification, run **one fresh finder** that receives the verified list.
Its only job is defects not already on it. It must not re-derive, re-confirm, or
restate anything already there. Focus it on the largest changed file, removed
code blocks, and any file no lane cited. Surface up to 8 additional candidates,
each naming a defect not already listed. Return an empty sweep when there is
nothing new — do not pad. Sweep candidates go through the same verification.

## 4. Act On The Route

For current changes, Code Janitor, or an explicitly authorized fix:

1. Name the behavior that must remain true and the narrowest proof for it.
2. Run a baseline when the correction could change behavior. If critical
   behavior lacks proof, add the narrowest characterization test or classify
   the candidate as `Needs verification`.
3. Fix every Confirmed issue with the smallest behavior-preserving change.
4. Keep edits in the parent unless delegated writes have isolated, disjoint
   scopes.

Code Janitor may implement only changes that preserve the product gate defined
in its reference. Treat any uncertain product effect as `Needs verification`
and leave it unedited. When publication is requested, publish only a focused
branch or PR containing the safe cleanup; publication does not authorize the
flagged product changes.

Use a hard cut only when the canonical contract is established and the old path
is confirmed obsolete. Otherwise classify compatibility removal as
`Needs verification`. Once eligible, read
[Hard-Cut Policy](../../references/hard-cut-policy.md).

For report-only and plan/spec reviews, return findings without editing. For an
audit, follow Audit Mode; its report is the only permitted write.

## 5. Validate And Return

After fixes, the parent inspects the final diff and runs only checks needed for
the changed behavior. Do not rerun a review. If a high-impact fix remains
uncertain, ask a fresh verifier to check only that issue. For report-only work,
run checks only when they can confirm a material candidate. Audit checks must
be read-only and side-effect free.

### Rank And Cap

Order Confirmed findings most-severe first. Cap the report at **10 findings**
at Direct and **15** at Deep. When the cap forces a cut, correctness outranks
reuse, efficiency, and conventions findings regardless of their individual
severity. Say how many findings were cut and why.

### Fix Route

Report each finding with its `short_summary` and an outcome of `fixed`,
`skipped`, or `no change needed`. Limit `skipped` to false positives and
changes not worth making. Then report:

- `Needs verification`
- `Validation`
- `Residual risk`, only when material

For Code Janitor, also name the landed-work window, selected and skipped
surfaces, product decisions left for the user, and the branch or PR when one was
requested and created.

If nothing needed fixing, name the reviewed scope and confirm that Intent and
Scope Conformance, Repository Standards Review, and all three lanes were clean.

### Report-Only Route

For code, plan, or spec review, order Confirmed findings by severity: P0
blocker, P1 high, P2 medium, P3 low. Use:

```markdown
### [P1] <short_summary> — <location>

- **Category:** `<slug>`
- **Evidence and mechanism:** cited code and any governing requirement or rule.
- **Failure scenario or cost:** reachable impact.
- **Smallest safe fix:** direct correction.
```

List `Needs verification` separately. If clean, state the reviewed scope and
say `no findings confirmed`. Audit Mode owns its report format and chat handoff.
Post inline or pull-request comments only when the user explicitly asks.
