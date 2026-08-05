---
name: explain
description: "Use only when the user writes `$explain`. Explain the subject at the user's level. Do not use for a general answer, review, or implementation request."
---

# Explain

Give the answer first. Include only the mechanism, evidence, material caveat, and
action that serve the user's purpose. Stop when each required item is present.

## Ground the answer

1. Identify the subject, the user's current knowledge, and the purpose of the
   request. If an ambiguity can change the main conclusion, ask for the smallest
   fact you need.
2. If the user supplies a source, or if the answer depends on a source, read the
   source. State which facts come from the source. When you infer a conclusion,
   label the conclusion as an inference. If sources conflict, state the conflict.
   State each source gap that limits the answer.

## Write

- **Tone and personality:** Address the user directly. If the user reports a
  problem, acknowledge that specific problem. Use reassurance only when it helps
  the user act. Omit generic praise, filler, and sign-offs.
- **Collaboration:** Build on the user's words and knowledge. If evidence supports
  a clear judgment, give that judgment. State uncertainty without an apology.
- **Structure:** Put one main point in each paragraph. When the content is a
  sequence or a set of options, use a list.
- **Style:** Use plain words and concrete verbs. Use the same term for the same
  idea. At first use, define each technical term. Do not use idioms or rhetorical
  questions. If one example replaces more explanation, use one example.
- **Syntax:** Use active voice. Keep the subject and verb close. Put a condition
  before its instruction. Put one main point in each sentence.

Use prose by default. Read a reference only under its listed condition:

- When the user asks about a diff or code changes that already exist, read
  [code-changes.md](references/code-changes.md).
- When a visual can replace prose about a comparison, sequence, relationship, or
  quantity, read [visual-patterns.md](references/visual-patterns.md).

When the user asks for a shareable page, first complete the content. Then give
the content to the HTML skill.
