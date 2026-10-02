# Product Copy

## Read the existing voice

Before writing or reviewing, read the copy nearby. Note the product's
terminology, its localization conventions and any voice or content style guide.

A deliberate brand voice is not a defect. Raise a departure from plain language
only when it creates inconsistency, ambiguity, translation risk, or a tone the
stakes don't support.

## One voice, flexible tone

Use the voice established by the product's existing copy. Preserve that voice
when making a local edit. Keep terms consistent: if it's "Archive" in the menu,
it isn't "Move to storage" in the toast. Adjust tone to the consequences:

| Context | Tone |
| --- | --- |
| Success, onboarding, empty states | Warm, can be light |
| Routine actions, settings | Neutral, minimal |
| Errors, destructive confirmations | Calm, plain, zero playfulness |
| Data loss, security | Serious, explicit |

## Verb-first buttons

For an action button, start with a verb naming the action: "Send", "Save draft",
"Delete project". On a consequential action, avoid "OK!", "Let's go!", or a bare
"Yes" and "No".

A confirmation button repeats the consequence, so the user can understand the
choice without reading the dialog body. "Delete this project?" offers `Delete project` and `Cancel`.

## Consistent flow vocabulary

A multi-step flow uses one vocabulary throughout: "Get started" to enter,
"Continue" or "Next" (pick one) to advance, "Done" to finish. Alternating
synonyms makes users wonder whether the buttons do different things.

## Links describe their destination

Link text has to make sense out of context, because screen-reader users navigate
by a list of the page's links. Write "Read the billing docs". "Click here" hides
the destination and assumes a pointer.

A bare "Learn more" breaks down as soon as two appear on one page. Add its
subject: "Learn more about exports".

## Settings describe the ON state

Label a toggle for what happens when it is on. "Send read receipts" lets users
infer the off state; the negative ("Don't send read receipts") turns the toggle
into a double negative.

Link straight to a referenced setting rather than describing the path to it: a
"Notification settings" link, not "Go to Settings > Notifications > Email".

## Empty states point forward

In an empty state, explain what belongs in the region and how to add it. Offer
one clear next action:

```html
<!-- Bad: a shrug -->
<p>No results.</p>

<!-- Good: orientation plus a next step -->
<p class="font-medium">No projects yet</p>
<p class="text-sm text-zinc-500">Projects keep your tasks and files together.</p>
<button class="mt-4">Create a project</button>
```

A search or filter empty state names the query and offers an exit: "No results
for 'quarterly'. Clear filters". Keep persistent information outside empty
states because an empty state disappears when content exists.

## Localize complete messages

Never assemble a sentence from fragments around a variable (`"You have " + n + " new messages"`), because word order changes per language. Use a full templated
string with proper pluralization.

## Check the copy in its flow

Check every label against the action it invokes, every error for a stated
recovery, and terminology against the copy around it. Include the wording of
errors in this pass; field association and announcements belong to
[interaction](interaction.md). Check wrapping in the rendered interface when the
replacement changes fit.

For feature-name exploration, read [naming](naming.md); for text styling or
wrapping, read [typography](typography.md). Report material wording changes with
before/after text and the action or ambiguity they resolve, using the active
audit or QA format when one applies.
