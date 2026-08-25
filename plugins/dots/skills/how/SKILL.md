---
name: how
description: "Use for \"how does X work\", code or change walkthroughs, and placement, ownership, or layering questions. Explains subsystem architecture, runtime flow, diffs, commits, branches, and pull requests. Can critique architecture. Use why for motivation and explain for quick ELI5 answers."
---

# How

Explore the codebase to answer "how does X work?" questions. Produce clear architectural explanations at the level of a senior engineer onboarding onto a subsystem. Enough to build a working mental model, not annotated source code.

Two modes:

1. **Explain** (default). Explore the codebase and produce a clear explanation
2. **Critique.** Explain first, then critically review the architecture through the `architecture-review` skill

## Explain Mode

### Step 1. Understand the Question and Assess Complexity

Parse what the user is asking about:

- "How does the rate limiter work?", a subsystem
- "How do we handle billing for on-demand usage?", a feature flow
- "How is the auth service structured?", an architectural overview
- "Walk me through what happens when a user submits a form", a runtime trace
- "Walk me through this pull request", a completed change

Identify the scope. If ambiguous, state your best-guess interpretation before exploring. Don't ask. Let the user redirect if you're off.

Read `references/tracing.md` before briefing explorers. For a diff, commit,
branch, pull request, or completed body of work, also read
`references/changes.md` and use its change mode. A file list or diff summary is
not an explanation.

**Assess complexity to decide the approach:**

- **Simple** (a single module, a small utility, a narrow question like "how does function X work"): skip explorer agents; the explainer explores and explains in a single pass. Go to Step 2b.
- **Complex** (a subsystem spanning multiple files/services, a cross-cutting feature, a full architectural overview): spawn parallel explorer agents first, then hand off to the explainer. Go to Step 2a.

When in doubt, lean simple. You can always spawn explorers if the explainer hits a wall.

### Step 2a. Explore (complex questions only)

Decompose the question into 2-4 parallel exploration angles, each a distinct slice of the subsystem so explorers don't duplicate work. Example split for "how does the rate limiter work?":

- Explorer 1: data model and state management
- Explorer 2: request path and enforcement
- Explorer 3: configuration and metrics infrastructure

The right decomposition depends on the question. Use your judgment. Narrow questions: 2 explorers is fine. Broad subsystems: up to 4.

Spawn all explorers together as fresh read-only explorer subagents. Use the
best available explorer configuration; do not hard-code a provider or model.

Each explorer gets the same base prompt from `references/explorer-prompt.md` plus a specific exploration angle naming its slice. Each explorer should:
- Start broad: use `rg --files` for relevant files and `rg` for key types, interfaces, and class names
- Follow the thread: from an entry point, trace the call chain (callers, callees, data flow, type definitions)
- Read the actual code, don't guess from file names
- Stop when it can describe the full path from input to output (or trigger to effect) without hand-waving any step
- Note things that are surprising, non-obvious, or that a newcomer would get wrong

Each explorer returns structured findings: components found, flow traced, files read, anything non-obvious. Overlap between explorers is fine; the explainer reconciles.

Then proceed to Step 3.

### Step 2b. Direct Explain (simple questions)

Spawn a single read-only subagent that explores and explains in one pass. Use
the best available general-purpose configuration; do not hard-code a provider
or model.

The agent does its own repository search and source reading and writes the explanation directly. Read `references/explainer-prompt.md` for the communication style and output format. Same structure, just no explorer findings as input.

Proceed to Step 4.

### Step 3. Synthesize (complex questions only)

Once all explorers return, spawn a single read-only subagent to synthesize
their findings into one coherent explanation. Use a separate synthesizer only
when the reports are large, conflicting, or independently complex; otherwise
the lead may synthesize them directly.

The explainer gets all explorers' findings and writes the human-facing explanation (output format below). Read `references/explainer-prompt.md` for the full prompt template. The explainer reconciles overlapping findings, resolves contradictions, and weaves the slices into a unified picture. For change mode, it also gets `references/changes.md` and derives the teaching story from the change instead of forcing subsystem headings onto it.

### Step 4. Present

Present the explainer's output to the user. You may lightly edit for clarity or add context from the conversation, but don't substantially rewrite. The explainer's communication is the product.

### Output Format

Follow this structure, adapted to the question. Not every section is needed for every question.

**Overview.** 1-2 paragraphs. What it is, what it does, why it exists. Enough to decide whether to keep reading.

**Key Concepts.** The important types, services, or abstractions. Brief definition of each. Not exhaustive, just the ones needed to understand the rest.

**How It Works.** The core of the explanation. Walk through the flow: what triggers it, what happens step by step, where data goes, the decision points. Prose, not pseudocode. Reference specific files and functions so the reader can go look, but don't dump code blocks unless a snippet is genuinely necessary.

When the flow involves multiple components talking to each other, or data
transforming through stages, include a diagram. Use Mermaid for structured
flows or ASCII art for simpler relationships where Mermaid would be overkill.
A diagram should clarify, not decorate. If prose covers the flow, skip it.

**Where Things Live.** A brief map of the relevant files/directories. Not every file, just the ones needed to start working in this area.

**Gotchas.** Non-obvious or surprising things that would trip someone up. Historical context that explains why something looks weird. Known sharp edges.

For change mode, derive the teaching story from
`references/changes.md` instead of forcing subsystem headings onto a change.

## Critique Mode

Triggered when the user asks for architectural issues, problems, or improvements, not just understanding.

Run the full explain flow above (Steps 1-4). You must understand the architecture before critiquing it.

Then do a critical review of the explained subsystem. Read and use
`../architecture-review/SKILL.md` for its architecture review lenses,
candidate bar, and evidence standard. Keep the review read-only and
architecture-level. Report only supported structural problems, cite the code
that demonstrates each problem, explain its practical impact, and distinguish
action-worthy problems from intentional tradeoffs or style preferences.

Present the explanation first, then the ranked critique. The explanation should stand on its own; someone who just wants to understand the system shouldn't wade through critique.

## Delivery And Completion

Return chat unless the user asks for HTML or a durable, visual, or shareable
artifact. For HTML, pass `artifact-template.json` and the finished content and
structure to the `html` skill. It handles the page itself.

The explanation is complete when it answers the user's question or covers the
meaningful change, traces consequential claims to actual source, makes material
gaps visible, and can be understood without opening the repository. Before
delivery, verify that each causal claim points to source, each inference shows
its reasoning, and each unknown names the missing handoff.
