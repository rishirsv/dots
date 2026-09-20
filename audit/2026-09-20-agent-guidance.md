# Dots instruction and skill audit

Date: 20 September 2026
Source baseline: `8b003f6dfa4e9a2613c04da6befb8bc3b2c28609`
Status: candidate corrections prepared; repository integration and publication pending.

## Conclusion

Keep the focused skill collection. Correct conflicting scope, approval, routing, and capability rules rather than introducing another general workflow or deleting skills based on their length. The current source already contains several improvements recommended in older audits; applying those old recommendations mechanically would undo useful behavior.

Drafts is excluded. No Drafts source is changed by the candidate.

## Criteria

| Criterion | What earns a pass |
| --- | --- |
| Authority and completion | The workflow carries out the authorized scope, asks only for a material missing decision, and preserves genuine permission boundaries. |
| Selective loading | Discovery is specific; ordinary tasks do not load unrelated procedures or a whole reference library. |
| Instruction ownership | Product, platform, validation, and publishing guidance have distinguishable owners. A wrapper does not silently override its owner. |
| Tool and host fit | Commands, local paths, scheduling, model choices, and external writes depend on actual available capabilities. |
| Evidence and regression protection | Source defects, historical observations, hypotheses, and executed checks remain distinct. Verification protects meaningful behavior without duplicating unrelated work. |

These criteria grade the instruction design. They do not establish that a rewritten skill improves model performance; that requires representative execution evidence.

## Guidance used

OpenAI's [model guidance](https://developers.openai.com/api/docs/guides/latest-model), accessed 20 September 2026, emphasizes follow-through on authorized work, sensitivity to conflicting file instructions, and verification proportional to the task. Its migration advice also says to preserve effective reasoning effort rather than automatically increasing it.

The [skills article](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), dated 11 September 2026, recommends specific descriptions, selective reference loading, and reconsidering old approval and recipe constraints. These principles support resolving the concrete defects below; they do not prove that shorter text or fewer agents always performs better.

## Supported corrections

### D01 — Give Claude a repository instruction entrypoint

The visible Dots root has `AGENTS.md` but no `CLAUDE.md`, while the repo's own [plugins/dots/skills/self-improve/references/instructions.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/self-improve/references/instructions.md#L14-L14) documents the shared import convention. Add a one-line `CLAUDE.md` importing `AGENTS.md`. This avoids copying the rules and closes a source-level discovery gap. A host might already inject the rules externally; that would reduce the practical impact, not make duplicate prose preferable.

### D02 — Make local HTML opening depend on filesystem access

[configs/agents/AGENTS.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/configs/agents/AGENTS.md#L17-L17) assumes the browser can read the agent's filesystem. That is false for some cloud/local combinations. Make the path instruction conditional and require observing the opened page. Keep the in-app browser preference; do not add a new browser stack.

### D03 — Align Self-Improve's instruction-edit gate

The parent skill allows implementation already authorized by the request. Its [plugins/dots/skills/self-improve/references/instructions.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/self-improve/references/instructions.md#L4-L4) instead requires approval of each exact rule and target, and its numbered method says to wait. This is a direct source contradiction for “audit and implement.” Align the leaf with the parent. Retain explicit approval for proposal-only work and material decisions outside the authorized scope.

The same leaf unconditionally demands repeated mistakes. Replace that with the existing generalization gate: behavioral generalizations need repeated evidence, while a source-visible contradiction can justify a narrow source correction. Never fabricate transcript evidence to satisfy a template.

### D04 — Let the review owner define its mode

[plugins/dots/references/feature-development.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/references/feature-development.md#L73-L73) contradicts the expressly repair-by-default code-quality-review skill. Remove the wrapper's competing policy and refer to the owner, preserving explicit review-only requests. This does not change the review skill's declared default.

### D05 — Preserve the full authorized architecture scope

[plugins/dots/skills/architecture-review/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/architecture-review/SKILL.md#L75-L75) limits implementation to the strongest candidate even when the user requested all supported fixes. Correct that scope truncation and use the candidate loop for each authorized item. Make exploration delegation depend on independent evidence paths and coordination benefit, not repository size. Preserve candidate ranking, compatibility exceptions, and the requirement to understand retained invariants before changing code.

The scope contradiction is directly observed. Any reduction in latency from changed delegation wording remains a hypothesis until measured.

### D06 — Permit zero questions and no redundant confirmation

[plugins/dots/skills/clarify/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/clarify/SKILL.md#L8-L8) can require another confirmation after the user or repository already settled the decisions. Allow zero questions when nothing material is unresolved, retain at most three on the first pass, and continue already-authorized implementation. Clarification-only requests still end with the shared understanding.

### D07 — Repair HTML's route and contradiction handling

[plugins/dots/skills/html/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/html/SKILL.md#L46-L46) points at a name absent from the current Dots skill inventory; use `interface-design`. Its prepared-material rule must also allow surfacing contradictions that prevent faithful composition. Keep accepted decisions and reuse research; this is not permission to redesign an accepted artifact.

### D08 — Schedule only what the host supports

[plugins/dots/skills/babysit-pr/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/babysit-pr/SKILL.md#L31-L31) treats cadence and a named model as available defaults. Prefer supported native completion notifications, otherwise use the actual scheduler capability and report the cadence. An explicitly requested unsupported cadence is not silently downgraded. If neither scheduling nor a native wait exists, return the current state and blocker rather than implying a monitor is active.

### D09 — Discover PR attachment support

[plugins/dots/skills/pr/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/pr/SKILL.md#L89-L89) lacks capability discovery. Check the applicable installed help before using the flag. An unavailable attachment mechanism must not leave local paths in a published PR or be reported as completed evidence. Existing examples remain useful when supported; do not install or change authentication merely to satisfy them.

### D10 — Keep continuation status truthful

[plugins/dots/skills/recall/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/recall/SKILL.md#L44-L44) has no accurate state for blocked work, a completed non-PR task, or unavailable live verification. Add those states without changing the concise capsule. In [plugins/dots/skills/handoff/SKILL.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/skills/handoff/SKILL.md#L80-L80), make empty sections optional rather than changing the handoff method. The status gap is direct; shorter output from the template edit is an expected effect, not a benchmark result.

### D11 — Identify which history was actually reviewed

[plugins/dots/references/session-history.md](https://github.com/rishirsv/dots/blob/8b003f6dfa4e9a2613c04da6befb8bc3b2c28609/plugins/dots/references/session-history.md#L77-L77) covers coding-session stores, not proven complete coverage of consumer ChatGPT and Claude conversations. The helper's `auto` route selects one platform. Document explicit source, home, cutoff, and coverage accounting and distinguish a fresh transcript from an older report. Keep private evidence outside public plugin text.

This clarification does not add a consumer-history connector or bypass a source restriction. The helper still needs a local execution environment and access to the intended stores.

## Dots skill decisions

All 23 discovered non-Drafts `SKILL.md` entrypoints were read in this conversation. “Keep” means no supported entrypoint change was selected, not that every supporting file or live execution was certified.

| Skill | Decision | Reason |
| --- | --- | --- |
| advisor | Keep | Explicit provider request and implementation ownership are useful. Verify the selected CLI and permissions at execution; the CLI reference has not been fully audited here. |
| architect | Keep | Existing-owner candidate first and implementation authorization are already encoded. Do not remove the caller-first design method just to shorten the file. |
| architecture-review | Revise | It reduces an authorized implementation to one candidate and encourages delegation by scan size. Preserve its evidence bar and compatibility exceptions. |
| babysit-pr | Revise | Five-minute scheduling and a named monitor model are not portable capabilities. Keep head-specific results and finite stop conditions. |
| clarify | Revise | The opening can demand reconfirmation after decisions are settled; a lower bound of one question is unnecessary. |
| code-quality-review | Keep | Already uses conditional independence and bounded lanes. Repair-by-default is explicit; callers must not redefine that policy. Its exact-assertion exception deserves a future focused test, not wholesale test deletion. |
| docs-writer | Keep | Conditional recipes and source ownership are already present. No benefit established from rewriting its opening. |
| dots-tunnel | Keep | File-only scope, revision-safe patches, and truthful validation limits are correct. Missing terminal access is a real capability boundary. |
| explain | Keep | Lightweight explanation and investigation remain separate. Existing completion language is more concrete than older criticism suggests. |
| handoff | Revise narrowly | Allow irrelevant template sections to disappear while preserving next action and reusable proof. |
| how | Keep | Independent exploration is conditional; the current entrypoint already routes critique elsewhere and supports relationship visuals. |
| html | Revise | The retired `design` route remains, and prepared-material obedience is too absolute for contradictory input. |
| index | Keep | Already explicit-only and owner-oriented. Its table is not an instruction to run every skill. |
| interface-design | Keep | A task router and separate craft references preserve design judgment. Do not erase established visual voice without evidence. |
| meta-prompt | Keep | Scope preservation is explicit; the length default permits required detail. Do not turn its prompt-length preference into a downstream answer limit. |
| pr | Revise narrowly | Probe attachment support instead of assuming an example command works on every installed CLI. Preserve non-draft and no-merge rules. |
| prototype | Keep pending trial | Representative callers may be better than a fixed count, but preserve the current throwaway decision-making workflow until exercised. |
| recall | Revise narrowly | Its status vocabulary must represent blocked, non-PR completion, and unverified work. Keep bounded discovery and live-state verification. |
| scout | Keep | Frontier questions and settled-decision preservation are valuable. Question counts and presentation choices are not proven harmful by this audit. |
| self-improve | Revise supporting references | Correct conflicting edit gates and distinguish actual history sources. Preserve frozen cohorts and causal review. |
| skill-standards | Keep | Already incorporates the September guidance and separates static from behavioral proof. Missing default-validator access must remain explicit. |
| transcribe | Keep | Caption-first retrieval, diagnostic branches, and overwrite boundaries are concrete. Backend code and current service behavior were not exercised. |
| why | Keep pending trial | Focused historical grounding is useful. Test the exhaustive route before changing its breadth or removing epistemic guidance. |

## Configuration and agent review

The source review covered twelve configuration files: shared AGENTS; Codex config and keybindings; Claude settings and keybindings; VS Code settings and keybindings; Zsh; Ghostty; Starship; Tinycast; and the Wispr/Logitech snapshot. It also covered all twelve files defining the six Codex/Claude role pairs: adversary, architect, consultant, explorer, luna, and worker.

Keep the role-specific model and effort configuration. There is no fresh task-cost or quality comparison establishing that changing those choices improves outcomes. The Claude files are generated from TOML by `scripts/generate-claude-agents.mjs`; changing one representation manually would create drift. A header denying Write, Edit, and Agent is not proof of an operating-system read-only sandbox for every other available tool.

The shared Codex configuration uses Astra at medium effort. Claude settings and the VS Code model preference differ; validate the installed alias resolution before calling that a defect. Enabled-plugin entries describe source intent, not proof of installed versions. Preserve the user's permission, keyboard, font, and terminal choices.

The Wispr/Logitech document is a dated restore snapshot. Its Prompt Engineer transform expands inputs into mandatory headings and a role. That is a reasonable future simplification candidate, but rewriting a historical snapshot would misrepresent what was observed. Update the live transform only through its owning settings workflow, then record the new state. No live settings were changed here.

## Verification and remaining work

The changes were prepared in an isolated Git worktree created from a hash-verified **partial file snapshot**, not a clone or worktree of the original upstream repository. Exact source hashes and a portable patch are supplied with the audit package. This preparation does not establish whole-package validity, installed behavior, or improved model performance.

The current connection provides file operations but no local terminal. The GitHub connector used earlier in the conversation is not exposed in the continuation. A container clone attempt also failed at DNS resolution. No source checkout on the user's Mac was modified in this continuation; no commit, push, PR, cache sync, or fresh transcript audit is claimed.

Before publication, apply the patch in a real repository worktree, run the active default skill validator and applicable repository checks, verify any new path is absent, inspect the complete diff, and execute the focused behavioral cases. Bump all owning plugin manifests together only when release content is final. Follow existing sync rules after merge; do not propagate an unmerged candidate to installed caches.
