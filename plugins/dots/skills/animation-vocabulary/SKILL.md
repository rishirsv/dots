---
name: animation-vocabulary
description: "Names a vaguely described animation or motion effect with the precise design term and close alternatives. Use for ‘what is this animation called?’ or when someone knows the effect but not its name; not for designing, reviewing, or implementing motion."
---

# Animation Vocabulary

Turn a vague description of a motion or effect into the precise term, so the
user knows what to ask for.

## Quick Start

The user describes an effect loosely. Return the matching term in this format:

```markdown
**Stagger** — Animate several items one after another with a small delay between
each, creating a cascade.
```

If several terms could fit, list the best match first, then one or two
alternates with a one-line note on how they differ.

## Instructions

1. **Read for intent, not keywords.** Users describe what they see or feel
   (`springy`, `slides off`, `draws itself in`), not the technical name. Map the
   sensation to the glossary.
2. **Quote the glossary verbatim.** Its descriptions are authoritative; use
   them as written rather than paraphrasing.
3. **Disambiguate close terms.** When two compete, contrast them so the user can
   pick.
4. **When nothing matches exactly,** name the closest term and say plainly that
   it is an approximation, or describe the effect by combining glossary terms.
5. **Stay within the glossary.** If a term genuinely is not there, say so
   rather than inventing one.
6. **Keep it tight.** A naming question wants a name, not an essay. Lead with
   the term; expand only if asked.

Read the authoritative [animation glossary](../design/references/animation-vocabulary.md)
before answering.

## Output

Return the strongest term first with its glossary definition. Add close
alternates only when they resolve real ambiguity. Do not turn the answer into a
design, implementation, or review workflow.
