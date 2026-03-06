## Role

You are a principal engineer reviewing system design, production readiness, and implementation quality for a portable slide-generation skill and its parent development repo.

## Context

I am uploading:

- `context.zip`: the focused parent-repo review bundle
- `portable-skill.zip`: the exact packaged `skills/kpmg-slides/` folder as it would be distributed to users

Treat both uploads as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index for `context.zip`.
- Also inspect `portable-skill.zip` directly as the shipped artifact.
- Use only what you can support from the files in the zip, except for the optional best-practices research instruction below.
- For concrete claims about the repo, cite file paths and line numbers when possible; otherwise cite the nearest function, script, or section header.
- You may optionally browse the web for best-practices guidance, but if you do, prefer official Anthropic or OpenAI documentation and clearly separate external guidance from repo-grounded findings.
- Do not ask questions. If something is missing, state assumptions and proceed.
- Do not limit detail. Be as thorough as needed to produce a production-quality review and plan.

## Task

Review this project from two angles at the same time:

1. The portable skill as distributed to end users.
2. The parent repo that develops, tests, syncs, and should eventually automate new layout onboarding for that skill.

The packaged skill is under `kpmg-utils/kpmg-slidegen/skills/kpmg-slides/` and should be evaluated as the user-distributed artifact.

The parent repo is under `kpmg-utils/kpmg-slidegen/` and should be evaluated as the source of truth for generator behavior, testing, QA, harness engineering, and future layout automation.

Please evaluate all of the following:

- Correctness
- Production readiness
- Code quality
- Architecture quality
- Maintainability
- Concision and structure
- Testing strategy and coverage
- Skill design quality and skill best practices
- JavaScript / Node quality
- Shell-script quality
- Python quality and PEP8 convention adherence where relevant
- Portability and distribution quality
- Whether the current organization is a good long-term foundation for adding many more layouts

Also look for:

- bugs
- hidden failure modes
- design inconsistencies
- risky defaults
- redundant code or over-engineering
- missing scripts or missing workflow pieces
- places where the skill and parent repo could drift
- anything that would make this hard to share with outside users or new developers

## Best-practices cross-check

If helpful, optionally do web research primarily from official Anthropic or OpenAI documentation on:

- skills / agent packaging best practices
- evals / harness design
- agent workflow design
- structured QA / grading approaches

If you use web research:
- Prefer official documentation over blogs or forum posts.
- Cite the URLs separately from repo file citations.
- Use the external guidance to critique or strengthen the repo’s current design.

## Specific deliverables I want

### 1. Comprehensive review

Review the current implementation and call out:

- correctness issues
- code-quality issues
- architecture issues
- PEP8 / Python style issues
- shell / scripting issues
- portability issues
- skill-design issues
- testing / harness gaps
- documentation gaps

When listing issues, prioritize them:
- **[P0]** blocking / likely to break users or invalidate the design
- **[P1]** urgent and should be fixed next
- **[P2]** meaningful improvement
- **[P3]** nice to have

For each issue include:
- what is wrong
- why it matters
- the smallest good fix
- the files involved

### 2. Portable skill verdict

Evaluate whether the portable skill, as currently packaged, is:

- correct
- portable
- understandable
- appropriately self-contained
- well-structured for external users

Point out anything that should change before it is widely shared.

### 3. Parent-repo workflow verdict

Evaluate whether the parent repo is currently a strong enough development environment for:

- safe skill iteration
- layout scaling
- regression protection
- future onboarding of many new layouts

### 4. Full implementation plan for slide-layout onboarding from a PowerPoint

Provide a detailed implementation plan for the following parent-repo workflow:

> “Add slide 10 from this PowerPoint file as a layout.”

The plan should assume this command is run in the parent repo, not in the portable skill.

The plan should cover an end-to-end workflow that:

- accepts a PowerPoint file and slide number
- extracts the slide structure / geometry / XML
- captures the slide image or PNG reference
- generates a candidate layout implementation
- creates or updates the appropriate template and builder wiring
- creates test fixtures
- runs QA and regression checks
- renders a generated sample slide
- compares the generated PNG against the reference PNG
- iterates until quality is acceptable
- promotes the layout into the main template and harness

I want this plan to be concrete enough that it could be implemented directly.

### 5. Exact workflow prompts and scripts

Please include:

- the exact workflow prompts you would use with an agent or assistant for the layout-onboarding flow
- the exact scripts / CLI commands you would create in the parent repo
- how those scripts should compose together
- what artifacts each step should emit
- how the QA / PNG comparison loop should work
- what should be deterministic vs what can use LLM grading

### 6. Production-readiness recommendations

Recommend any additional changes that would help make this production ready for:

- internal developers
- external users
- future maintainers
- larger layout counts
- better automation

## Output format

### Executive Verdict

Give a concise overall verdict on:
- the portable skill
- the parent repo
- the likelihood this is a good production foundation

### Prioritized Findings

List the most important findings with priorities and file citations.

### Best-Practices Assessment

Compare the repo and skill against standard best practices.
If you used external documentation, separate that subsection clearly and include links.

### Architecture Review

Explain the most important structural strengths and weaknesses.

### Portable Skill Review

Review the shipped skill specifically as a distributable artifact.

### Parent Repo and Harness Review

Review the parent repo as the long-term development environment.

### Slide Onboarding Implementation Plan

Provide a detailed phased implementation plan with:
- goals
- architecture
- scripts
- workflow prompts
- artifact contracts
- QA gates
- regression strategy
- rollout order

### Recommended Commands and Script Surface

List the exact command surface you recommend adding or changing.

### Release / Readiness Checklist

Provide a practical checklist for what should be true before sharing broadly with users and developers.

### Overall Verdict

End with exactly one of:
- **Correct**
- **Probably correct, with caveats**
- **Not correct**

Then explain that verdict in a short but concrete final paragraph.
