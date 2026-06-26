# Writing Rules

Use this reference when writing rules affect a Drafts output.

## Where Rules Come From

Drafts v1 does not maintain a separate Drafts rule database. Writing rules come
from:

- Applicable `AGENTS.md` files.
- The user's explicit instructions in the current session.
- Draft, section, channel, and style constraints when they are part of the
  current artifact or selected style.

Rule sources are always considered. Apply non-conflicting rules, resolve
conflicts explicitly, and do not put rule sources in artifact frontmatter.

## How Rules Stack

Apply rules in this order:

```text
AGENTS.md guidance
-> user instructions
-> style guidance
-> channel recipe
-> plan constraints
-> session or draft-specific instructions
```

Later layers can specialize earlier layers, but conflicts must be surfaced.

## How Certain A Check Can Be

Classify each rule:

- `generative`: The model should try to follow the rule.
- `deterministic`: A validator can check the rule after generation.
- `hybrid`: The model should try, then a validator should verify.

Do not promise deterministic enforcement for a generative-only rule.

## Humanize Rules

Treat `humanize` as a rewrite mode that restores author intent and texture. It
is not a request to make the writing casual, emotional, or less professional by
default.

When humanizing, preserve:

- factual claims
- genre and channel
- level of formality unless the user asks to change it
- the user's apparent intent
- important structure that serves the reader

Clean up common AI tells:

- generic setup phrases
- symmetrical paragraph scaffolding
- over-explaining why the point matters
- empty intensifiers and hype language
- corporate transitions
- unsupported claims or vague examples
- repetitive sentence starts or transitions

Add specificity only when supported by provided text, durable source context,
selected style evidence, or the current session. If the user asks to "sound
like me" without a usable style guide or samples, run a non-personalized
humanize pass or ask for style evidence.

For the default anti-AI-tell pass in new drafts and rewrites, use the Tell Lint
in [quality.md](quality.md), which also defines how `compose` and
`writing-review` apply it. Treat the lint as a deterministic cleanup pass, not a
detector and not a license to add fake imperfections.

## Conflict Handling

When rules conflict:

1. Name the conflict.
2. Prefer the user's latest explicit instruction when it does not violate a
   higher-priority policy or approval gate.
3. Preserve AGENTS.md guidance unless the user asks to change reusable writing
   guidance.
4. Record the assumption or ask when the choice changes the artifact.

## Reusable Rule Updates

Use the reusable-rule update flow when the user provides writing guidance that
should apply beyond the current draft or session.

When the user gives reusable writing guidance:

1. Decide whether the guidance is reusable or only applies to the current
   artifact.
2. If reusable, propose a concise AGENTS.md addition or edit.
3. Explain where it should go and why.
4. Edit AGENTS.md only after explicit user approval.
5. Briefly say what changed and how it will affect future Drafts work.

Do not silently update AGENTS.md. Do not create a parallel Drafts rules surface.

## Checking Rules

For deterministic or hybrid rules:

- Check banned phrases, required labels, formatting constraints, length caps,
  and required sections when feasible.
- Mention any rule that could not be checked when the user needs to trust the
  result.
- Fix in-scope failures before handing off.

For generative cleanup:

- Say the rule was applied as a writing pass, not as a guarantee, only
  when that distinction matters.
- Use a follow-up validator when the user needs certainty.
