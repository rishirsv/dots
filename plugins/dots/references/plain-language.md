# Clear language

Apply these rules to Dots skill instructions and to prose written under either
Dots writing guide. These rules borrow from ASD-STE100 Simplified Technical
English (STE). They do not require or claim full compliance with that standard.

Use this reference with the guidance the task needs:

- [Technical writing](technical-writing-guidance.md) covers procedures,
  technical claims, commands, evidence, and expected results.
- [Prose writing](writing-style.md) covers explanation, narrative structure,
  rhythm, and voice.
- Use both for a technical explanation or proposal that needs both precise
  instructions and a developed argument. Use either one on its own when the
  other adds nothing to the task. Both use the clarity rules here.

Exact technical meaning, user requirements, and required formats take priority
over stylistic preferences. Preserve quoted text, code, commands, identifiers,
and required terminology. Edit the explanation around them when needed.

## State the action

Name who acts, what they do, and what they act on. In an instruction to the
agent, the imperative names the action directly: "Read the report."
Name the actor when responsibility could be unclear: "The reviewer checks each
finding against the code."

Replace abstract labels with the work they represent. "Reconcile the
exploration" does not tell the reader which findings to compare or what to
return. Write "Combine the findings into one explanation. Resolve conflicting
findings before writing the answer."

A quality claim needs a method or an observable result. Replace "Ensure robust
assessment" with the checks that establish whether the result meets the
requirements. Keep useful context; do not turn every explanation into a command.

## Make conditions and sequence explicit

Put a condition before the action it controls. Keep the condition and action
together when separating them could change the meaning.

Give separately executable actions separate sentences or steps when that makes
the order clearer. Use numbers only when order matters. Preserve simultaneous
or dependent actions as a group when the relationship matters more than the
sentence split.

Keep exceptions next to the rule they qualify. Say what to do when a condition
is false, evidence is missing, or an action fails if that changes the workflow.
Do not invent new exceptions or failure paths while editing prose.

For example:

> Before: Repairs the complete retained in-scope set sequentially after synthesis.
>
> After: Combine the review findings. Fix every supported issue within the
> original task scope. Make the repairs one at a time.

The rewrite is longer because it restores the actions and their order.

## Use stable, concrete terms

Use one term for one concept within the document. Do not alternate synonyms
for variety. Prefer ordinary verbs such as "read," "write," "compare," "run,"
"check," and "stop."

Keep technical terms when they name a precise concept the reader needs.
Define an unfamiliar term before relying on it. A term such as "invariant" can
be useful; "owning invariant" is unclear if the instruction never names the
component responsible for maintaining it.

Replace metaphors and compressed noun groups when they hide the action or
relationship. Explain which module calls another, which agent decides, or
which file changes. Keep a metaphor in an explanation only when it teaches the
relationship more clearly than a literal description.

> Before: Restate the problem space, constraints, dependency category, and current seam.
>
> After: Describe the problem and its constraints. Name the affected modules
> and explain how they depend on each other.

If a particular dependency classification is required, define that
classification. Do not silently substitute an invented meaning.

## Remove competing readings

Make every pronoun point to one clear noun. Repeat the noun when "it," "this,"
or "which" could refer to several things. Keep articles and verbs when their
omission makes the reader decode the sentence.

Put "only" and "not" next to the words they qualify. Make the grouping of
"and" and "or" explicit. Distinguish requirements from recommendations:
"Run the check" requires an action; "consider running the check" permits a
choice. Preserve that distinction when rewriting.

> Before: No new boundary is a valid design.
>
> After: A valid design can use only existing modules.

The original sentence can mean that every new boundary is invalid. The rewrite
states the intended alternative without that ambiguity.

## Keep sentences readable without removing meaning

Give each sentence one main idea. Split a sentence when the reader must
backtrack to recover its action or condition. Long sentences deserve review;
word count alone does not determine whether a sentence is clear.

Prefer active voice. Passive voice is useful when the actor is unknown or
irrelevant. Preserve the actor whenever the reader needs to know who must act.

Use familiar words and complete sentences. Keep the reasons, examples,
constraints, and technical details that affect a decision. A shorter sentence
is worse if it removes information the reader needs to act correctly.

## Review meaning before style

For each instruction, check whether the reader can identify the action,
responsible actor, object, condition, and expected result where each matters.
For an explanation, check whether the reader can follow the claim and its
support without guessing a missing connection.

If wording is ambiguous, quote it, describe the plausible misreading, and write
a concrete replacement. "Too much jargon" is not a sufficient finding. If the
intended meaning cannot be recovered from the source, report the uncertainty
instead of deciding a new policy through an edit.

Compare the original and revised instructions. Preserve triggers, permissions,
required steps, exceptions, examples, output fields, and completion conditions.
Do not treat a clean schema check or a lower word count as proof that the agent
will behave correctly.

## Relationship to full STE

Full ASD-STE100 compliance also controls approved vocabulary, word meanings,
parts of speech, grammar, technical terms, and sentence length. Dots uses the
clarity principles above without enforcing that dictionary or fixed word
limits. For example, Dots permits the ordinary verb "check."

If the user requests full compliance, use the current official standard and
review the applicable rules and dictionary entries. Do not label a plain-English
rewrite compliant merely because its sentences are short.

Sources: [ASD's overview](https://www.asd-ste100.org/about_STE.html) and
[official standard access](https://www.asd-ste100.org/STE_downloads.html).
