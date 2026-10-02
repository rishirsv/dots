# Technical writing guidance

Use this for technical artifacts that readers need to review, follow, or act
on. Apply [Clear language](plain-language.md) when drafting and reviewing the
text. Use [Prose writing](writing-style.md) as well when the artifact needs a
developed explanation, argument, or narrative. The guides can be used together;
exact technical meaning and required formats take priority over stylistic
preferences.

Write for a tired engineer who needs to understand the text on the first read.
Make the reader's next action or understanding obvious. Follow repository and
user instructions when they specify a different format or convention.

## Lead with the job

State the purpose in the first screen. Put the conclusion or task before its
background. Use headings that identify the reader's task or the finding.
Give each paragraph one topic. Use lists and tables when they make repeated
information easier to scan.

## Write procedures that can be followed

State prerequisites and hidden dependencies before the affected action. Put a
condition before the instruction it changes. Give each step one action unless
several actions must happen together. Use numbered steps when order matters.

Include expected output when it proves success or helps diagnose failure. State
what the reader should do if the observed result changes the next step. Do not
invent recovery instructions or permissions that the source does not provide.

## Preserve examples and commands

Use the smallest realistic example that proves the point. Define placeholders
near the example. Keep identifiers, flags, paths, and command syntax exact.
Use fenced code blocks with language tags and inline code for literals.

Verify commands when possible. If a command was not run, do not imply that it
was tested. Follow artifact-specific validation requirements before claiming a
result works.

## Keep technical claims precise

Use the codebase's real names for symbols, files, commands, and domain concepts.
Define necessary unfamiliar terms before relying on them. Use present tense
for current behavior. Avoid relative dates or words such as "now" when the
statement must remain useful later.

Use US English unless the repository or product specifies another variant.
Prefer literal language that a non-native reader can follow. Remove unsupported
claims that a result is easy, obvious, seamless, or high quality; state the
behavior or evidence instead.

## Evidence in claims

Attach evidence to each claim, or state in the same sentence
whether the claim is an inference or a guess. A prediction or an unseen cause
is a guess. Use measurements for measured claims, source locations for code
claims, and citations for external facts.

If an available check could settle the claim, run that check within the task's
authorized scope. Do not ask the reader to do a check you can complete. State
limitations that affect how the reader should use the result.

## Editing example

Before:

> Configuration of the plugin marketplace cache sync command is performed by
> `sync-plugins.sh`. It should only be run after merging. This updates it.

After:

> After merging a plugin change, run `scripts/sync-plugins.sh --all`. The
> script updates every installed plugin cache from the marketplace source.

The rewrite names the command's effect, places its condition first, and replaces
an ambiguous pronoun with the object it describes.

## Review before delivery

1. Identify claims, caveats, examples, commands, and links that must stay accurate.
2. Organize the material around the reader's task or question.
3. Apply the meaning and sentence review in [Clear language](plain-language.md).
4. Check that every procedure retains its prerequisites, sequence, expected
   result, and relevant failure behavior.
5. Check that evidence supports the claims and that no required technical
   detail was removed.

Keep a longer sentence when it clearly connects a condition with its action or
consequence. Do not make every sentence the same length merely to sound concise.
