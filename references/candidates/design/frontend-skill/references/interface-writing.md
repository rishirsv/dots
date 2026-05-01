# Interface Writing

Use this reference when a frontend or design task also needs end-user text inside the interface: headlines, labels, buttons, helper text, empty states, onboarding copy, alerts, errors, settings descriptions, notifications, or accessibility labels.

Do not use this reference for brand campaigns, blog posts, app store listings, API docs, or general marketing copy unless the user explicitly asks.

## Workflow

### 1. Establish voice first

Before writing or rewriting copy, look for a durable voice definition in:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/DESIGN.md`
- the design system or style guide
- existing product copy that already feels intentional and consistent

If voice guidance exists, use it. If it does not, infer a working voice from the product and keep it to 3-4 traits. Voice should stay stable across the interface. Tone can shift by situation.

### 2. Identify the job

Decide whether the request is:

- new copy for a screen, flow, or component
- a review of existing copy
- a rewrite of specific strings
- terminology cleanup across a flow

Then identify the pattern involved: hero, CTA, empty state, onboarding, alert, error, settings, inline help, notification, or accessibility label.

### 3. Apply this order of operations

Use this precedence chain:

1. clarity
2. voice
3. craft rules

If voice gets in the way of understanding, strip it back. If a craft edit weakens the product voice, do not take it.

### 4. Review the critical strings

For most frontend tasks, the highest-leverage copy pass is:

- main headline
- primary CTA
- section headings
- empty states
- errors and alerts
- onboarding text
- settings descriptions
- accessibility labels for important actions and visuals

## Voice And Tone

- Voice is the consistent personality of the product.
- Tone is how that voice adapts to the moment.
- Warm welcome screens can carry more personality.
- Errors, destructive actions, and blocking moments should dial personality down and clarity up.

Think in dials, not different voices. A calm, direct product can become warmer in onboarding and more matter-of-fact in errors without sounding like a different company.

## Core Principles

### Purpose

Write only what the person needs in this moment.

- Headlines and buttons should carry the main message.
- Body copy should add information, not restate the headline.
- If the screen is trying to do too much, cut until one job is left.

### Anticipation

The interface should answer the next obvious question.

- After a problem, tell them what to do next.
- After a request, make the action obvious.
- After success, confirm what changed and what happens next.
- Lead with the why when asking for effort, access, or trust.

### Context

Write for the actual usage situation.

- Mid-task copy should be brief and scannable.
- Setup flows can carry slightly more explanation.
- Put instructions where the person needs them, not earlier.
- Match device language to the platform: `tap` on touch surfaces, not `click`.

### Empathy

Respect different levels of stress, fluency, and ability.

- Use plain language over jargon.
- Avoid idioms and culturally narrow phrases.
- Use inclusive, neutral wording.
- Assume strings may need localization and expansion.
- Treat accessibility text as part of the product, not an afterthought.

## Craft Rules

- Remove filler words that do not improve meaning or voice.
- Avoid repetition between headline, body, and action labels.
- Be specific about the thing, the action, and the next step.
- Prefer direct verbs on buttons: `Create Account`, `Save Changes`, `Download Report`.
- Avoid generic actions like `OK`, `Yes`, `No`, or `Submit` when a clearer label is possible.
- Avoid blaming language such as `invalid input`; instruct instead.
- Avoid reflexive `sorry`, `please`, `oops`, and `uh oh` in system messages.
- Keep a word list for product terms and button labels. If the product uses `workspace`, do not alternate with `project` unless the distinction is real.

## Pattern Guidance

### Headlines And CTAs

- Let the headline carry the meaning.
- Keep support text to one short sentence when possible.
- Make the primary action explicit and outcome-oriented.
- If the person reads only the heading and CTA, they should still understand the screen.

### Alerts And Dialogs

- Interrupt only when the person genuinely needs the interruption.
- Title should explain what happened in one short sentence or fragment.
- Body is optional and should add new information.
- Actions should be specific verbs, not generic confirmation labels.

### Errors

- Say what happened in plain language.
- Explain why only if it helps.
- Always point to the next step or recovery path.
- Put the error close to the problem when possible.

### Destructive Actions

- Name the specific thing being deleted, removed, or changed.
- Make the consequence explicit if it is not obvious.
- Use action labels like `Delete File` and `Keep File`.
- Always provide a safe exit.

### Empty States

- Say what belongs here.
- Explain how to make it appear.
- Include a clear action when possible.
- Use personality only after usefulness is handled.

### Onboarding And Setup

- Lead with why the product or permission matters.
- Keep one idea per screen.
- Use consistent button labels through the flow.
- Be honest about what data is used and why.

### Notifications

- Lead with the important information, not the prompt to open the app.
- Keep one idea per notification.
- Send only when the update is timely or useful.

### Settings And Preferences

- Use labels that name the setting plainly.
- Support text should explain the effect or scope in one short sentence.
- Avoid vague helper copy that repeats the label.
- Make toggles and destructive settings especially unambiguous.

### Instructional And Inline Copy

- Put instructions next to the field or action they affect.
- Keep them short enough to scan while doing the task.
- Replace passive explanation with an actionable next step whenever possible.

### Accessibility Labels

- Label meaningful controls and visuals.
- Describe intent and outcome, not UI chrome.
- Do not include the control type if assistive tech already announces it.
- Update labels when state changes.

## Fast Review Checklist

- Can someone understand the screen from headings, labels, and primary actions alone?
- Does every sentence earn its space?
- Is the copy specific about the thing and the action?
- Does the wording match the product's voice?
- Does the text help the person move forward?
- Are important actions and visuals accessible by text alone?

## Sources

This reference is informed by:

- Apple Human Interface Guidelines: Writing
- Apple Human Interface Guidelines: Alerts
- Apple Human Interface Guidelines: Accessibility
- WWDC22: Writing for Interfaces
- WWDC24: Adding Personality to Your App Through UX Writing
- WWDC25: Make a Big Impact with Small Writing Changes
- WWDC19: Writing Great Accessibility Labels
- Apple Style Guide
