# Writing style

Use this guide when writing or reviewing Dots skill instructions, technical
documents, explanations, and narrative prose. Apply the rules that fit the
content. The clarity rules borrow from ASD-STE100 Simplified Technical English
(STE); they do not require or claim full compliance with that standard.

Exact technical meaning, user requirements, required formats, and repository
conventions take priority over stylistic preferences. Preserve quoted text,
code, commands, identifiers, and required terminology. Respect the writer's
established voice. Edit the explanation around protected material when needed.
Style changes must not hide uncertainty or weaken a requirement.

## Write for the reader

Identify the reader, the intended effect, and the facts or source material that
control the piece. Write so a tired reader can understand the text on the first
read. Make the reader's next action or understanding obvious.

State the purpose in the first screen. Put the conclusion or task before its
background. Organize the material around the reader's task, question, or a
clear argument. Use headings that identify the task or finding. Give each
paragraph one topic and purpose: explain a mechanism, present support,
interpret a result, or introduce the next idea. Use lists and tables when they
make repeated information easier to scan.

Follow an abstract claim with a concrete fact, action, image, or example when
that helps the reader understand it. Reuse important nouns so the reader can
follow the same subject across paragraphs. Vary the sentences around those
nouns instead of renaming the subject for variety.

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

## Write procedures that can be followed

State prerequisites and hidden dependencies before the affected action.

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

## Preserve a natural voice

State an opinion when the task calls for one, and explain the facts behind it.
Do not force neutrality when the evidence supports a judgment. Do not invent
reactions to make the text sound personal.

Vary sentence length when the meaning benefits. Use a short sentence to make
an important point. Do not make every sentence the same length merely to sound
concise.

Acknowledge complexity in concrete terms. Explain what is promising,
uncertain, or concerning. First person is appropriate when the writer's own
judgment or experience matters. Specific observations are more useful than
generic emotional language.

Put facts before reactions. Disclose uncertainty, surprise, or a changed view
when it helps the reader interpret the account. Preserve useful humor and
individual phrasing when they serve the audience and do not obscure meaning.

## Remove artificial patterns

Review patterns in context. A familiar word or punctuation mark is not a defect
by itself. Replace wording when it adds no meaning, hides the claim, or makes
the piece sound formulaic.

### Content

- Remove inflated significance claims such as "pivotal moment" or "testament
  to." State what happened and why it matters.
- Remove name-dropping. Name a source when its evidence supports the point.
- Replace trailing phrases such as "highlighting" or "showcasing" with the
  supported claim, or remove them if they add nothing.
- Remove promotional descriptions such as "groundbreaking" unless the source
  and task justify them.
- Replace vague attributions such as "experts believe" with the actual source,
  or remove the unsupported claim.
- Replace formulaic passages about challenges and continued success with the
  specific facts.

### Language and structure

- Prefer "is" or "has" to elaborate substitutes such as "serves as" or "boasts"
  when the simpler verb carries the same meaning.
- State the point directly instead of adding a "not just X, but Y" construction.
- Use the number of examples or arguments the material requires. Do not force
  ideas into groups of three.
- Avoid artificial ranges such as "from X to Y" when the items do not define a
  meaningful range. Name the items directly.
- Cut filler such as "in order to" and "it is important to note that."
- Replace stacked hedges with the level of uncertainty the evidence supports.
  "May" is clearer than "could potentially possibly."
- End when the piece has answered the question. Remove generic conclusions
  that merely announce optimism or repeat the preceding text.
- Use a stronger verb or a measurement when an adverb adds no information.
  Preserve qualifiers that change the claim's accuracy.

### Formatting

Prefer periods or commas when a long aside makes the sentence difficult to
follow. Parentheses, dashes, and other punctuation remain available when they
clarify the relationship. Use colons to introduce a list or example; avoid them
as a substitute for writing the connection between two ideas.

Use emphasis to help the reader find important information. Do not bold every
name or add a bold label that merely repeats the following sentence. A short
label is useful when it identifies the subject and the text adds new information.

Use sentence case for headings. Remove decorative emojis. Prefer straight
quotes in newly authored Dots instructions; preserve quoted sources and any
format the user requires.

### Voice and specificity

Remove stock chatbot openings, praise, and sign-offs when they do not help the
reader. State the answer directly. Replace generic disclaimers with the
specific limitation and its effect on the answer.

Explain what a system does rather than how it feels. For example,
"`.toSQL()` returns the exact string sent to the database" explains more than
"SQL you can read."

If a sentence could fit unchanged in several unrelated pieces, check whether it
adds necessary context here. Make it specific or remove it when it adds nothing.
Do not delete useful background merely because other readers also need it.

## Review before delivery

1. Check the structure against the reader's task or question and the source
   material. Identify claims, caveats, examples, commands, and links that must
   stay accurate.
2. Check meaning before style. For each instruction, identify the action,
   responsible actor, object, condition, and expected result where each matters.
   For an explanation, check whether the reader can follow the claim and its
   support without guessing a missing connection.
3. Remove unsupported claims, repetition, filler, and artificial patterns.
   Check that every procedure retains its prerequisites, sequence, expected
   result, and relevant failure behavior. Keep evidence beside the claims it
   supports.
4. Read the prose aloud. Revise any passage that forces the reader to backtrack
   or guess the connection between ideas.
5. Compare the revision with the source. Preserve its meaning, evidence,
   uncertainty, and intended voice. For instructions, preserve triggers,
   permissions, required steps, exceptions, examples, output fields, and
   completion conditions. Keep every technical detail needed for the task.

If wording is ambiguous, quote it, describe the plausible misreading, and write
a concrete replacement. "Too much jargon" is not a sufficient finding. If the
intended meaning cannot be recovered from the source, report the uncertainty
instead of deciding a new policy through an edit. Do not treat a clean schema
check or a lower word count as proof that the agent will behave correctly.

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
