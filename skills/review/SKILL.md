---
name: review
description: "Reviews code or review of documents."
---

# Review

Review a proposed code change or plan made by another user.
If you are reviewing the implementation of a feature. Optionally on request, generate a implementation walkthrough document.

**Do not modify code.** Only analyze and write review and documentation.

Use this skill when:

- Manual activation only. Do not auto-activate when the user says “review” in natural language.

## Process

1. Read the user's request or the proposed code change or plan. Read all documents or links referenced or related to the request. It is important to understand the purpose and context of the change.
2. Perform a review of the proposed code change or plan.
3. Provide comments to the user. If the proposed code change or plan is a feature implementation, generate a implementation walkthrough document. If you have a large number of issues, write them to a markdown file in the folder related to the request.

## Guidelines

Here are some default guidelines for determining whether something is a bug or is sub-optimal and should be flagged.

- It meaningfully impacts the accuracy, performance, security, or maintainability of the code.
- The bug is discrete and actionable (i.e. not a general issue with the codebase or a combination of multiple issues).
- Fixing the bug does not demand a level of rigor that is not present in the rest of the codebase (e.g. one doesn't need very detailed comments and input validation in a repository of one-off scripts in personal projects)
- The author of the original PR would likely fix the issue if they were made aware of it.
- The bug does not rely on unstated assumptions about the codebase or author's intent.
- It is not enough to speculate that a change may disrupt another part of the codebase, to be considered a bug, one must identify the other parts of the code that are provably affected.
- The bug is clearly not just an intentional change by the original author.
- Ignore trivial style unless it obscures meaning or violates documented standards.

## Guidelines for Using git Effectively

- Review files that have changed directly. In folders, list files with `!rg --files <path>`, then focus on the most relevant subset (entry points, changed files, docs requested).
- Understand the context of the changes using git diff and git log related to the target files.

## Guidelines for Standard Review (Quality, Correctness, Alignment)

Evaluate across:

1. **Spec & Plan Alignment**

- Implements what the spec describes?
- Any plan tasks skipped or only partially done?
- Deviations or scope creep?

2. **Code Quality**

- Readability, structure, naming, consistency with patterns
- Separation of concerns
- Avoids duplication when appropriate

3. **Correctness & Safety**

- Validation, error handling, edge cases
- Data integrity, concurrency, failure modes
- Security concerns where relevant (auth, injection, secrets)

4. **Performance & Scalability**

- Hotspots, N+1 queries, expensive operations
- Cache misuse or unnecessary work

5. **Testing & Documentation**

- Tests for core behaviors + tricky edge cases
- Deterministic, clear tests
- Docs match behavior (README/spec$plan)

**Prioritization**

- Focus first on correctness/security/data loss.
- Limit low-severity nits; group them.
- If diff is large: explicitly prioritize top 3-5 issues.

---

## 4) Simplicity Review (YAGNI, Clarity, Over-Engineering)

Run this unless user explicitly selects `--standard` only.

1. **Core Purpose**

- State in 1-3 sentences what this code actually needs to do.

2. **Unnecessary Complexity**

- Abstractions/branches/data structures more general than needed
- "Just in case" extension points

3. **Redundancy & Duplication**

- Repeated patterns that could be simplified/merged

4. **Simpler Alternatives**

- For each hotspot: propose a more straightforward design

5. **YAGNI Enforcement**

- Call out features/parameters not required by spec$plan
- Suggest delete/inline/defer

Keep grounded:

- Propose simplifications that materially improve clarity/robustness
- Avoid style-only churn unless repo conventions require it

## Guidelines for Implementation Walkthrough

Mandatory sections: How It Works, Files Touched and Responsibilities, How to Run and Verify, Known Limitations and Next Steps.  
Optional add-ons: Plan Alignment and Task Status, frontmatter metadata (include only when helpful).

Use: `templates/implementation-notes.md`

## Output Format

RULES:

- When tagging bugs with priority levels, consider: [P1] Un-padding slices along wrong tensor dimensions". [P0] – Drop everything to fix. Blocking release, operations, or major usage. Only use for universal issues that do not depend on any assumptions about the inputs. · [P1] – Urgent. Should be addressed in the next cycle · [P2] – Normal. To be fixed eventually · [P3] – Low. Nice to have.
- At the end of your findings, output an "overall correctness" verdict of whether or not the patch should be considered "correct". Correct implies that existing code and tests will not break, and the patch is free of bugs and other blocking issues. Ignore non-blocking issues such as style, formatting, typos, documentation, and other nits.
- Write in non-technical concise prose. The user is intelligent but new to the codebase and the changes and needs to understand (a) context for the change, (b) issue identified, (c) suggestion for improvement, and (d) overall correctness verdict.
- Verbosity=high
- Do not modify code.
- Prioritize correctness/security issues over style.
- Group low-severity nits.
  The comment should be clear about why the issue is a bug.
  The comment should appropriately communicate the severity of the issue. It should not claim that an issue is more severe than it actually is.
  The comment should be brief. The body should be at most 1 paragraph. It should not introduce line breaks within the natural language flow unless it is necessary for the code fragment.
  The comment should not include any chunks of code longer than 3 lines. Any code chunks should be wrapped in markdown inline code tags or a code block.
  The comment should clearly and explicitly communicate the scenarios, environments, or inputs that are necessary for the bug to arise. The comment should immediately indicate that the issue's severity depends on these factors.
  The comment's tone should be matter-of-fact and not accusatory or overly positive. It should read as a helpful AI assistant suggestion without sounding too much like a human reviewer.
  The comment should be written such that the original author can immediately grasp the idea without close reading.
  The comment should avoid excessive flattery and comments that are not helpful to the original author. The comment should avoid phrasing like "Great job ...", "Thanks for ...".
  Below are some more detailed guidelines that you should apply to this specific review.

Use one comment per distinct issue (or a multi-line range if necessary).
Use `suggestion blocks ONLY for concrete replacement code (minimal lines; no commentary inside the block).
In every `suggestion block, preserve the exact leading whitespace of the replaced lines (spaces vs tabs, number of spaces).
Do NOT introduce or remove outer indentation levels unless that is the actual fix.

Use the following output format:

Use: `templates/review-output.md`

When only one review type is requested:

- Omit the unused review section.
- Include the Implementation Walkthrough section only when a walkthrough was created.

### Saving the Review Output

If the project uses a `docs/` convention and `<feature-slug>` is known:

- Save/update: `<project-root>/docs/reviews/review-<feature-slug>.md`

If `<feature-slug>` is unknown:

- Ask for a preferred path, or fallback to:
  - `<project-root>/docs/reviews/review-<branch-name>.md`

When you also generate implementation notes:

- Do not save implementation notes as a separate file.
- Append the full rendered implementation notes content as the final section at the bottom of the review file, after `## 📌 Next Steps`.
- Keep that appended section heading consistent (e.g. "## 🧾 Implementation Notes").
- If implementation notes are not generated, do not add a placeholder section.

On request, save the review output to a markdown file in the folder related to the request.
