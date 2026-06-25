# Drafts Writing First Plan

## Purpose

Rewrite Drafts so the agent experiences it as a natural writing guide, not as a
route/state/provenance machine.

The intended user-facing contract is simpler than the earlier plan:

```text
Default: return the writing.

When something material affects trust, add one short natural-language note after
the writing.
```

No named trace ladder. No compact provenance block as a normal mode. No full
route report as a designed response shape. If the user explicitly asks how it
worked, answer that question plainly in prose or short bullets.

This plan describes the current behavior and the patch I would make after
approval. It does not change Drafts source yet.

## Meta-Skill Guidance Applied

This is an existing-skill improvement, so Meta-Skill routes it through
`skill-doctor`.

The working rules are:

- Read and propose before changing source.
- Edit source-owned skill files only, not installed plugin caches or generated
  packages.
- Keep the patch narrow enough to review, but broad enough to fix the
  end-to-end writing experience.
- Treat this as runtime instruction cleanup, not a plugin architecture rewrite.
- After an approved edit, review the changed skill text directly and run the
  relevant Meta-Skill validation commands.

## Current Behavior

Drafts has the right product structure:

- `drafts/SKILL.md` gives users two plain lanes: Draft for new or continuing
  writing, Rewrite for existing text.
- The visible recurring writing pad is simple: `Ideas bank`, `Outline`, and
  `Draft`.
- The Rewrite lane is meant to be fast and return one strong version by default.
- `state-model.md` correctly says chat-only work should not pretend to save
  Drafts state.
- `provenance.md` already says provenance should stay light while the user is
  drafting or rewriting.
- The recent style-guide work moved toward the right shape: a useful voice
  manual written in natural prose, with tiny frontmatter and no model-control
  grids.

The problem is that the plugin still reads too mechanically in the places the
agent consults while writing.

Specific leaks:

- `drafts/SKILL.md` asks the agent to return state read, state written,
  assumptions, provenance, and next action.
- `writer/SKILL.md` asks every draft or revision to include lane, writing
  moment, brief or contract changes, version boundary, style provenance,
  AGENTS.md guidance, source usage, persistence assumptions, and next action.
- `router.md` says every route should return fields such as `state_read`,
  `state_written`, `style_provenance`, `rules_provenance`, and
  `source_provenance`.
- `provenance.md` has the right restraint in one section, but still frames
  reporting around traceability objects rather than the writer's experience.
- `writing-style/SKILL.md` and `writing-review/SKILL.md` are closer, but their
  output sections still lean toward reporting categories instead of useful
  writing outcomes.

The result is that an agent can technically follow the instructions and still
produce a response that feels like an audit packet.

## Product Diagnosis

Drafts should keep its internal discipline, but the runtime text should make the
agent think like an editor.

The source should sound more like the new style guide:

- Prose-first.
- Concrete.
- Grounded in writing moves.
- Generous where guidance improves output.
- Sparse where fields only describe machinery.
- Clear about guardrails without turning every answer into a report.

The plugin can still track style, sources, versions, and state internally. It
just should not make those objects the visible shape of ordinary writing help.

## Simplest User-Facing Forms

### 1. Writing Only

This is the default.

Use it for ordinary chat-only writing, quick rewrites, humanize passes, short
drafts, email edits, channel variants, and most revision requests.

Example shape:

```text
<the draft or rewrite>
```

### 2. Writing Plus One Short Note

Use one short note only when the user needs it to understand trust, persistence,
or a material assumption.

Good notes:

```text
I treated this as a humanize pass, not a personal voice match.
```

```text
I used `email-rishi` and assumed this is for an internal peer.
```

```text
I did not save this as Drafts state.
```

```text
I revised this from `client-memo` v001 and would save it as a new version before
overwriting anything.
```

Avoid:

```text
Trace: route=drafts -> writer; lane=rewrite_lane; state_read=null;
style_provenance=default; source_provenance=session-only.
```

If the user asks how Drafts routed or saved something, answer that directly.
That should be a requested explanation, not a standing response form.

## Journey-Level Behavior After Patch

### Quick New Draft

Return the draft. If a key assumption materially shaped it, add one sentence
after the draft.

### Messy New Piece

Help the user turn raw material into `Ideas bank`, `Outline`, and `Draft`, or
ask one useful question. Do not narrate the route.

### Substantial Durable Work

Keep the working surface simple. If durable state would be created or updated,
say that plainly in one short note. Avoid a provenance block unless the user
asks for a state summary.

### Recurring Writing Project

Show the standing pad and the next useful writing move. Mention persistence only
when files actually changed or when the user asks what is saved.

### Rewrite Existing Text

Return one best version. If the rewrite is a humanize pass or a personalized
pass, say so only when that distinction matters.

### Humanize vs Personalize

Keep this distinction visible in natural language:

- Humanize removes stiffness while preserving meaning.
- Personalize uses a concrete style guide or usable samples.
- If no style guide is available, do not claim a personal voice match.

### Create Or Update Style

Style work can explain evidence and limits because trust matters there. The
result should still lead with the usable guide or what changed, then mention
sample limits or registry changes plainly.

### Review Then Fix

For review, lead with the findings that would change the next revision. For
fixes, return the revised writing first. Mention version lineage only when it
matters or when state changed.

## Rewrite Direction For The Plugin

The patch should do more than replace an Output section. It should rewrite the
Drafts instructions so the agent reads them like an editorial manual.

Use the same feel as the recent style-guide work:

- Explain how the writing should behave.
- Name the durable pattern in prose.
- Use examples when they teach the move.
- Put guardrails in plain language.
- Keep machine fields out of the main reading path.
- Keep backticked state object names only where precision genuinely matters.

Bad plugin tone:

```text
Return route, lane, state_read, state_written, style_provenance,
rules_provenance, source_provenance, and recommended_next_action.
```

Better plugin tone:

```text
Return the writing first. If the result depends on a style choice, source limit,
unsaved state, or a material assumption, add one short sentence after the
writing. Keep routing and state details as private working notes unless the user
asks for them.
```

## Proposed Patch Scope

### 1. `plugins/drafts/skills/drafts/SKILL.md`

Rewrite this as the front-door editorial contract.

Planned changes:

- Replace the mechanical Workflow step that asks for state/provenance reporting.
- Replace the Output section with the two simple user-facing forms.
- Make Draft and Rewrite read as writing experiences, not route classifications.
- Keep the routing boundaries, but move route mechanics out of the visible
  response guidance.
- State clearly that users should not have to see Drafts machinery unless they
  ask or unless trust/persistence would otherwise be unclear.

Expected effect:

- The front door tells the agent what the user experience should feel like.
- Ordinary writing replies stop turning into status reports.

### 2. `plugins/drafts/skills/writer/SKILL.md`

Rewrite this as the main writing manual.

Planned changes:

- Keep the Draft lane, Rewrite lane, substantial writing, revision, humanize,
  personalize, style, rules, and source guidance.
- Remove the sense that every answer must enumerate a writing moment, lane,
  style provenance, rule provenance, source provenance, and version boundary.
- Make the Output section say: produce the artifact first; add one short note
  only when it changes trust, persistence, or the next action.
- Rephrase mechanical lists into prose that helps the agent write better.

Expected effect:

- `writer` still behaves safely, but the live answer sounds like writing help.

### 3. `plugins/drafts/references/router.md`

Shrink this into private classification guidance.

Planned changes:

- Rename `Router Response` to private working notes or remove the response
  framing entirely.
- Say route fields are for the agent's internal decision, not user-visible
  output.
- Preserve the lane table if useful, but reduce any language that suggests the
  user should receive route fields.

Expected effect:

- The router helps the agent choose the right path without leaking the path into
  the answer.

### 4. `plugins/drafts/references/provenance.md`

Rewrite this around trust moments, not provenance blocks.

Planned changes:

- Remove the earlier idea of a normal compact provenance block.
- Keep the safety rules: do not invent saved versions, sources, style matches,
  or review lineage.
- Explain when to add one short note after the writing.
- Explain that fuller explanation happens only when the user asks how something
  worked, or when a durable review/version handoff genuinely needs a state
  summary.

Expected effect:

- Provenance stays accurate, but it stops becoming the shape of the response.

### 5. `plugins/drafts/skills/writing-style/SKILL.md`

Align this with the natural voice-manual direction.

Planned changes:

- Keep the current stronger style-guide model.
- Rework output language so style work leads with the useful guide or change.
- Keep evidence and caveats visible when they affect trust, but avoid category
  dumps.
- Make handoff to `writer` sound like guidance for writing, not fields for a
  router.

Expected effect:

- Style setup remains inspectable while still supporting better prose.

### 6. `plugins/drafts/skills/writing-review/SKILL.md`

Make review output feel editorial rather than procedural.

Planned changes:

- Keep durable review/version safety.
- Lead with findings and revision moves.
- Mention non-durable advice, reviewed version, or new version only when that
  distinction matters.
- Avoid turning every review into a state report.

Expected effect:

- Review-to-fix remains traceable, but the user sees the critique and revision
  path first.

### 7. Selected References

Lightly revise adjacent references only where they reinforce the mechanical
output habit.

Likely targets:

- `plugins/drafts/references/state-model.md`
- `plugins/drafts/references/channel-recipes.md`
- `plugins/drafts/references/review-versioning.md`
- `plugins/drafts/references/writing-rules.md`

Expected effect:

- The plugin reads consistently. The agent does not get one natural instruction
  from `drafts/SKILL.md` and a conflicting mechanical instruction from a
  reference file.

## Non-Goals

- Do not change state storage paths.
- Do not change style library schema.
- Do not change routing behavior unless wording cleanup reveals a direct
  contradiction.
- Do not edit generated packages under `dist/`.
- Do not sync style files into local Codex state.
- Do not add evaluation suites for this patch.
- Do not add new named response modes.

## Validation Plan

After an approved patch:

1. Review the changed skill and reference files directly.
2. Run targeted Meta-Skill validation:

   ```sh
   plugins/meta-skill/scripts/metaskill validate plugins/drafts/skills/drafts --json
   plugins/meta-skill/scripts/metaskill validate plugins/drafts/skills/writer --json
   plugins/meta-skill/scripts/metaskill validate plugins/drafts/skills/writing-style --json
   plugins/meta-skill/scripts/metaskill validate plugins/drafts/skills/writing-review --json
   ```

3. Run whitespace validation:

   ```sh
   git diff --check -- plugins/drafts
   ```

4. Do a quick source readback for the two most important risks:

   - No ordinary Draft or Rewrite path asks for route/state/provenance fields in
     the visible response.
   - The source still preserves safety around style trust, source trust,
     unsaved state, durable versions, and review lineage.

5. Run `scripts/verify.sh` if the approved patch broadens beyond Drafts
   instruction text or before committing.

## Approval Boundary

This plan is not approval to edit Drafts source. The source patch should happen
only after explicit approval for this scope or a narrowed version of it.

