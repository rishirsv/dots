# Q01: Session 019ed3b2 Explicit-Only Routing Failure

## Question

In Codex session `019ed3b2-d14e-7fc2-ae62-02d164750d56`, did Meta-Skill or Skill Writer overfocus on `use when` / `do not use when` description wording despite the target skill being explicit-only, and what concrete evidence shows the failure pattern?

## Scope

Reviewed the local session JSONL only:

- `/Users/rishi/.codex/sessions/2026/06/16/rollout-2026-06-16T23-49-32-019ed3b2-d14e-7fc2-ae62-02d164750d56.jsonl`

Used repo-local / installed skill source only to interpret expected Meta-Skill behavior:

- `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/meta-skill/SKILL.md`
- `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/SKILL.md`
- `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/references/design.md`
- `/Users/rishi/Code/dots/AGENTS.md`
- `/Users/rishi/Code/dots/configs/codex/AGENTS.md`

## Plan

Subquestions used for the pass:

1. What was the user's intended workflow and when did `Ideate` become the target skill?
2. Which Meta-Skill specialist path did the agent claim to use?
3. What invocation posture did the agent choose while creating and rewriting the skill?
4. Did the agent repeatedly optimize trigger / route wording before handling explicit-only behavior?
5. What correction did the user give, and what did the agent change afterward?
6. Does Meta-Skill / Skill Writer guidance explain why this failure is specifically an invocation-posture miss rather than only a wording miss?

## Answer

Yes, with one important caveat.

The session shows a clear failure pattern where the agent treated `Ideate` as a model-discoverable skill and repeatedly sharpened `Use when` / route / common-trigger language, while leaving `allow_implicit_invocation: true`. The concrete failure was not merely verbose wording; it was optimizing the implicit routing surface and metadata for a skill that the user later explicitly corrected to be explicit-only.

Caveat: the transcript does not show the user saying "explicit-only" at the first moment `Ideate` was created. The explicit-only target becomes unambiguous in the later diff comment: "Make this skill explicit only - therefore remove this section" at JSONL line 703. Before that, the agent had enough warning signs that explicit-only should have been considered: the workflow was broad/personal, the user wanted strong gates before implementation, nearby local skills included explicit-only patterns, and Skill Writer design guidance says explicit-only is appropriate when "the user should be the index."

So the defensible conclusion is:

- Fact: Meta-Skill/Skill Writer-created and Meta-Skill/Skill Doctor-rewritten payloads made `Ideate` implicitly invokable.
- Fact: The agent explicitly described its rewrite as broadening implicit skill routing.
- Fact: The user then identified the route section as wrong because the skill should be explicit-only.
- Inference: The failure pattern was an invocation-posture miss caused by over-weighting trigger description craft and under-checking explicit-only metadata and route semantics.
- Attribution: The initial new-skill design was under Meta-Skill / Skill Writer; the later problematic rewrite was under Meta-Skill / Skill Doctor. The pattern belongs to the broader Meta-Skill authoring/rewrite workflow, not only Skill Writer.

## Key Evidence

### User intent and skill target

The skill became a new broad ideation workflow after the user described wanting a skill that refines loose ideas, explores UX/concepts freely, branches through possibilities, and is not limited to code. JSONL line 205 records that direction.

The user then authorized creation with Meta-Skill and added hard boundaries: codebase exploration should always be done by a sub-agent, and implementation should never happen unless explicitly asked and confirmed. JSONL line 225 records this.

The user selected the name `Ideate` and then instructed the agent to build the final skill. JSONL lines 350 and 360 record those turns.

### Meta-Skill / Skill Writer path

The agent explicitly used Skill Writer for the design exercise: "I'll use Meta-Skill's skill-writer lens" at JSONL line 155.

When the user approved creating the skill, the agent said it would make a real source skill using "Meta-Skill's writer workflow" at JSONL line 230. It then read Skill Writer and design references, including `skill-writer/SKILL.md`, `design.md`, `skill-shape.md`, and `openai_yaml.md` at JSONL lines 231-244.

The later rewrite, after the skill already existed, used Skill Doctor rather than Skill Writer: the agent said "Meta-Skill -> Skill Doctor" at JSONL line 610.

### Explicit implicit-invocation decisions

The agent decided early that the first `shape` version "should be implicit-invocation capable" because users would describe the need without naming it. JSONL line 273 is the clearest statement of that design choice.

The initial `shape` metadata set:

```yaml
policy:
  allow_implicit_invocation: true
```

This appears in the apply patch at JSONL line 300 and in the readback at lines 311 and 371.

After renaming to `Ideate`, the same implicit policy persisted. The readback of `plugins/dots/skills/ideate/agents/openai.yaml` shows `allow_implicit_invocation: true` at JSONL lines 388, 427, 621, 652, and 716.

### Repeated `Use when` / route / trigger wording emphasis

The first `shape` payload was frontmatter-led by:

```yaml
description: "Use when exploring, shaping, or branching a loosely formed idea..."
```

and included route bullets plus quoted natural-language triggers such as "shape this", "explore this idea", "riff on this", and "map the branches." This appears in the patch at JSONL line 294 and readbacks at lines 310 and 337.

The renamed `Ideate` payload used the same pattern:

```yaml
description: "Use when exploring, ideating, or branching a loosely formed idea..."
```

and included quoted triggers like "ideate on this", "explore this idea", and "riff on this." This appears in readbacks at JSONL lines 387, 426, 482, 554, 587, and 620.

After the user's feedback about borrowing Matt Pocock's language, the rewrite again changed the frontmatter and route to a model-discoverable form:

```yaml
description: "Use when exploring, sharpening, or stress-testing a loosely formed idea or plan..."
```

and added a `Common trigger language:` section with examples including "ideate on this", "explore this idea", "sharpen this", "sharpen the plan", and "turn this into shared language." This appears in the apply patch at JSONL line 636 and readbacks at lines 650 and 715.

The agent's own final summary after that rewrite says: "the `description` changed, so implicit skill routing is now broader around 'sharpen,' 'shared language,' and plan stress-testing." That is JSONL line 698. This is the strongest admission that the rewrite's routing work was explicitly implicit-discovery oriented.

### User correction and resulting fix

The user then left a diff comment: "Make this skill explicit only - therefore remove this section." That is JSONL line 703, attached to `plugins/dots/skills/ideate/SKILL.md` line 34, which was the `Common trigger language:` section.

The agent acknowledged the actual failure: "the 'Common trigger language' section plus agent metadata still made this implicitly invokable." That is JSONL line 720.

The patch then changed three surfaces at once at JSONL line 721:

- frontmatter description from `Use when...` to `Use only when the user explicitly invokes Ideate or $ideate...`
- route text from `Use this skill when the user wants to:` to `Use this skill only when the user explicitly invokes Ideate or $ideate and wants to:`
- metadata from `allow_implicit_invocation: true` to `allow_implicit_invocation: false`

Readback confirmed the final explicit-only state:

- `SKILL.md` line 3 says `Use only when the user explicitly invokes Ideate or $ideate...` at JSONL line 731.
- `SKILL.md` route line 24 says `Use this skill only when the user explicitly invokes Ideate or $ideate...` at JSONL line 731.
- `openai.yaml` says `allow_implicit_invocation: false` at JSONL line 732.

The final answer confirms the same three changes at JSONL line 742.

### Source guidance that explains the miss

Skill Writer's design guidance separates model-discoverable trigger design from explicit-only invocation.

For model-discoverable skills, `design.md` says to "Lean slightly assertive" and cover implicit prompts because skills often fail by under-triggering. That guidance appears in the `Trigger Contract` section.

For explicit-only skills, the same file says to use explicit-only when "the user should be the index" and to set `policy.allow_implicit_invocation: false` when supported. That appears in `Invocation And Granularity`.

The failure pattern is that the agent followed the model-discoverable branch and kept sharpening the implicit trigger surface, even though the final user correction required the explicit-only branch.

## Facts

- The agent initially created `shape`, then renamed it to `ideate`.
- The first `shape` and subsequent `ideate` payloads used `Use when...` frontmatter descriptions and natural-language route triggers.
- `agents/openai.yaml` repeatedly set or preserved `allow_implicit_invocation: true`.
- The rewrite after the landscape comparison added an explicit `Common trigger language:` section.
- The agent told the user the rewritten `description` made implicit routing broader.
- The user then instructed the agent to make the skill explicit-only and remove the trigger-language section.
- The agent fixed description, route text, and metadata after that correction.

## Inferences

- The overfocus was not just prose style. It was a routing-design failure: description wording, route bullets, trigger examples, and metadata all pointed toward implicit discovery.
- The agent appears to have treated "good skill authoring" as "stronger discoverable description" by default, rather than pausing to classify invocation posture.
- The user wanted a named personal workflow (`Ideate`) with strong gates. That should have raised the possibility of explicit-only invocation before the diff comment.
- The issue spans Meta-Skill's authoring/rewrite lane. Skill Writer shaped the initial implicit design; Skill Doctor preserved and intensified the implicit trigger surface during the later rewrite.

## Recommendations

Add or strengthen Meta-Skill guidance so every skill creation or route-changing rewrite performs an invocation-posture check before editing description language:

- If explicit-only: use `Use only when the user explicitly invokes...`, remove `Common trigger language` / implicit route examples, and set `agents/openai.yaml` `policy.allow_implicit_invocation: false`.
- If model-discoverable: then optimize `Use when` / `do not use when` wording and common trigger language.
- In final summaries, flag any `allow_implicit_invocation` state alongside description changes, not just "description changed."

The concrete heuristic to encode: route wording and metadata are one contract. A skill is not explicit-only if the body says explicit-only but `openai.yaml` still allows implicit invocation, or if the route section lists common natural-language triggers.

## Commands / Searches Run

- `sed -n '1,240p' /Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/meta-skill/SKILL.md`
- `sed -n '1,520p' /Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/SKILL.md`
- `sed -n '1,520p' /Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/references/design.md`
- `sed -n '1,200p' ./AGENTS.md`
- `sed -n '1,200p' ./configs/codex/AGENTS.md`
- `ls -l /Users/rishi/.codex/sessions/2026/06/16/rollout-2026-06-16T23-49-32-019ed3b2-d14e-7fc2-ae62-02d164750d56.jsonl`
- `head -n 3 /Users/rishi/.codex/sessions/2026/06/16/rollout-2026-06-16T23-49-32-019ed3b2-d14e-7fc2-ae62-02d164750d56.jsonl`
- `jq` extraction of user messages with `input_line_number`
- `jq` extraction of assistant messages with `input_line_number`
- `jq` extraction of function/custom tool calls with `input_line_number`
- `jq` extraction of function outputs matching `description`, `Common trigger language`, `allow_implicit_invocation`, and explicit-only phrases
- `rg -n 'Great\\. Re-write the skill|Some of the exact language|Make this skill explicit only|Diff comments|explicit only|description\\\"|Common trigger language|allow_implicit_invocation|implicit skill routing is now broader|I also made Ideate explicit-only|Use when exploring|Use only when the user explicitly invokes' <session-jsonl>`

## Sources Consulted

- Session JSONL: `/Users/rishi/.codex/sessions/2026/06/16/rollout-2026-06-16T23-49-32-019ed3b2-d14e-7fc2-ae62-02d164750d56.jsonl`
- Meta-Skill router: `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/meta-skill/SKILL.md`
- Skill Writer: `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/SKILL.md`
- Skill Writer design reference: `/Users/rishi/.codex/plugins/cache/dots/meta-skill/0.1.0/skills/skill-writer/references/design.md`
- Repo instructions: `/Users/rishi/Code/dots/AGENTS.md`
- Nested repo instructions discovered but not applicable to output path: `/Users/rishi/Code/dots/configs/codex/AGENTS.md`

## Sources Not Consulted

- Web sources and remote GitHub pages referenced inside the session, because the research scope was local session JSONL plus local skill source only.
- Current working tree diffs or git status, because repo instructions say not to mention other agents' uncommitted changes and the research question is transcript-local.
- Generated package contents under `dist/`, because repo instructions say not to edit generated vendor packages and they were not needed to interpret the session.
- The current `plugins/dots/skills/ideate` files outside the transcript, because the session JSONL already contains the relevant readbacks and patch diffs.

## Contradictions Or Caveats

- The user did not initially say "explicit-only" when asking to create `Ideate`. The explicit-only requirement becomes explicit in the diff comment at JSONL line 703.
- Before that correction, the phrase "dynamic enough that it just works" at JSONL line 544 could be read as supporting a broadly discoverable trigger. That is a plausible reason the agent leaned implicit, but it does not excuse failing to check invocation posture when the skill was broad and personal.
- The problem is not strictly "Skill Writer only." The first creation path used Skill Writer, but the later rewrite that intensified `sharpen` / `shared language` routing used Skill Doctor. Meta-Skill as a whole needs the guardrail.
- The final state was corrected successfully. The failure pattern is about the intermediate design and rewrite behavior, not the final delivered patch after the user's diff comment.

## Confidence

High that the session contains an implicit-routing failure: multiple readbacks show `Use when...`, `Common trigger language`, and `allow_implicit_invocation: true`, followed by the user's explicit-only correction and the agent's fix.

Medium-high that the root cause was over-weighting description/trigger craft: the agent repeatedly discussed and edited routing language, and explicitly said the rewrite broadened implicit routing.

Medium that this should be attributed specifically to Skill Writer: Skill Writer governed the initial creation, but Skill Doctor governed the later rewrite where the concrete diff comment landed.

## Gaps Or Next Checks

- Check Meta-Skill source for whether `skill-doctor` has an explicit invocation-posture checklist. The transcript suggests it needs one, but this report only read Skill Writer design guidance in depth.
- Review whether the Meta-Skill validator can warn when `SKILL.md` says or implies explicit-only but `agents/openai.yaml` has `allow_implicit_invocation: true`, or when explicit-only skills include `Common trigger language`.
- Search for similar failures in other sessions where a final user diff comment asked to make a skill explicit-only after broad `Use when` wording had already been added.

## Durability Recommendation

Make this durable as Meta-Skill authoring guidance, not as an `Ideate`-specific note. The durable rule should live near invocation posture / description guidance:

> Before changing a skill description or route section, classify invocation posture. For explicit-only skills, do not add common natural-language trigger lists, start the description with explicit invocation language, and set `agents/openai.yaml` `allow_implicit_invocation: false`.

This is worth turning into a small validator or doctor checklist because the session shows the same contract spans frontmatter, route prose, and metadata.
