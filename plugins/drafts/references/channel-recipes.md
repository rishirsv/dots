# Channel Recipes

Use this reference when a draft, revision, transformation, or variant targets a
specific destination, format, or platform.

## Contract

A `channel_recipe` is destination and format guidance. It sets structure,
length, audience posture, CTA pattern, platform conventions, and validation
checks. It is not a style guide and it is not factual source context.

Keep these layers separate:

- `channel_recipe`: what shape the artifact must take.
- `style_guide`: how the user's voice should sound inside that shape.
- `writing_rules`: durable policy and avoidances.
- draft context and `knowledge`: factual support.

When a style guide and channel recipe conflict, preserve the channel format and
adapt the selected style inside that format. A long-form style can be used for
an email, LinkedIn post, or X post, but the result must still obey that channel
recipe.

## Choosing A Recipe

Choose the channel recipe from the most specific available signal:

1. Explicit user request, slash command, or frontmatter channel.
2. Existing draft channel or requested `channel_variant`.
3. Workspace-local `.drafts/channel-recipes/<id>.md` override.
4. Built-in recipe with the same ID or alias.
5. No recipe, with the channel treated as an assumption.

Mention the chosen recipe only when it materially affects structure, length,
CTA, audience posture, or a future edit. Otherwise let the channel shape show in
the writing.

## Recipe Template

Use this shape for durable recipes:

```markdown
---
schema: drafts/v1
kind: channel_recipe
id: <recipe-id>
title: <Recipe Name>
output_channel: <channel-id>
aliases: <comma-separated-aliases>
---

# <Recipe Name>

## Use When

- ...

## Inputs

- Required:
- Useful:
- Missing-context behavior:

## Instructions

- ...

## Structure

- Opening:
- Body:
- Ending:

## Length

- Target:
- Hard limits:

## Style Interaction

- Keep from selected style:
- Override from selected style:

## Evidence Rules

- Source-backed claims:
- Creative wording:
- Placeholders:

## Format Rules

- ...

## CTA

- ...

## Avoid

- ...

## Checks

- ...
```

## Built-In Recipes

Use these built-in recipes when no workspace-local recipe overrides the target
channel. The recipe instructions are runtime writing guidance. Apply them
alongside the selected style guide, writing rules, and source constraints.

### `announcement`

- Output channel: `announcement`
- Aliases: `/announcement`
- Instructions: Write an announcement. Enthusiastic and conversational, but sound human - not like a marketer. Use first-person or collective 'we' perspective. Address the audience directly with 'you.' No jargon - avoid words like 'game-changing,' 'revolutionize,' 'excited to announce.' Open with what's new, explain why it matters, then share details. Include a teaser for what's coming next.
- Checks: Opens with the news, explains why it matters, includes details, avoids launch cliches, and does not sound like generic marketing copy.

### `blog-post`

- Output channel: `blog`
- Aliases: `/blog-post`, `blog post`, `article`
- Instructions: Write a blog post. Start with a compelling hook - not a summary. Use subheadings to create scannable structure. Conversational yet authoritative voice - like a knowledgeable friend sharing insights. Mix short and longer paragraphs. Include specific examples, anecdotes, or data points. Use 'you' and 'I' to create connection. End with a forward-looking thought or clear takeaway, not a generic conclusion.
- Checks: Starts with a hook, uses headings, includes concrete support, mixes paragraph lengths, and ends with a real takeaway.

### `cold-email`

- Output channel: `email`
- Aliases: `/cold-email`, `cold email`, `outreach email`
- Instructions: Write a cold email. Use reliable public facts only when provided, already retrieved, or explicitly approved for lookup. Structure: (1) who you are in one line, (2) a specific reference showing you've done your homework - not hollow flattery, (3) why you're reaching out and why they should care, (4) one clear, specific ask they can act on immediately. Cap at ~200 words - brevity signals respect for their time. Write like a real person having a conversation - read it aloud to verify it sounds human. Replace vague claims with concrete examples and measurable results. Strip out jargon, buzzwords, and corporate-speak entirely. Never exaggerate or fabricate familiarity. Subject line: specific and under 50 characters. One CTA only - a direct question outperforms an open-ended request.
- Evidence rules: Use provided or retrieved public facts for personalization. If no reliable fact is available, ask for one or write a less-personal version without pretending familiarity.
- Checks: Subject is under 50 characters, body is about 200 words or less, one CTA is present, personalization is specific and true, and no familiarity is fabricated.

### `email`

- Output channel: `email`
- Aliases: `/email`
- Instructions: Write an email. Subject line: specific and curiosity-driven, under 50 characters. No 'I hope this finds you well' - get to the point in the first sentence. One clear ask or call to action. Keep paragraphs short (1-3 lines). Professional but conversational - use contractions, write like a real person. End with a clear next step.
- Checks: Subject is specific and under 50 characters, first sentence gets to the point, paragraphs are short, and there is one clear next step.

### `essay`

- Output channel: `essay`
- Aliases: `/essay`
- Instructions: Write an essay. Authoritative but approachable tone - combine deep expertise with conversational elements. Move between first-person anecdotes, direct reader address, and third-person analysis. Use clear section headings. Integrate data, research, and specific examples. Balance narrative storytelling with analytical depth. Progress from basic to complex ideas. End with a forward-looking statement, not a summary.
- Checks: Uses headings, balances narrative and analysis, includes support, progresses from simple to complex, and closes forward rather than recapping.

### `headline`

- Output channel: `headline`
- Aliases: `/headline`, `headlines`
- Instructions: Generate 5 headline options. Each should be 5-12 words - a single, complete thought. Use concrete nouns and active verbs ('City Council Cuts School Budget by $2M' not 'Changes Made to Education Funding'). Be specific - include a number, name, or concrete detail when possible. Memorable and catchy but never misleading - the headline is a contract with the reader, so only promise what the content delivers. Authoritative and objective - avoid editorializing adjectives like 'shocking' or 'incredible' and let the facts carry the weight. No two-part headlines with colons. No clickbait curiosity gaps ('You won't believe...'). Each headline should stand alone without additional context.
- Checks: Returns five options, each 5-12 words, no colons, no clickbait, no unsupported promise, and concrete nouns or active verbs where possible.

### `instagram`

- Output channel: `instagram`
- Aliases: `/instagram`, `instagram caption`
- Instructions: Write an Instagram caption. Use the selected style guide when one is available; otherwise use a casual, conversational default without inferring personal voice from the current chat. The first ~125 characters are critical - they show before the 'more' fold, so lead with a hook that gives a reason to keep reading (bold claim, question, or counterintuitive statement). Longer captions (300+ characters) tend to drive more engagement, especially for carousel posts. Use line breaks for readability. End with a specific, low-friction CTA ('Which would you pick - A or B?' beats 'Comment below!'). Add 3-5 targeted hashtags on a separate line at the end - they function as topic labels for search, not distribution amplifiers. If generating multiple drafts, try a short punchy version and a longer detailed one.
- Checks: First line hooks before the fold, line breaks improve readability, CTA is low-friction, and hashtags are targeted rather than spammy.

### `linkedin`

- Output channel: `linkedin`
- Aliases: `/linkedin`, `LinkedIn post`
- Instructions: Write a LinkedIn post. Open with an attention-grabbing statement or question - not a summary. Use first-person perspective and address the reader directly with 'you.' Keep sentences concise and punchy. Break content into easily digestible short paragraphs. Include a personal experience or observation to illustrate the point. End with a takeaway and a thought-provoking question or call to action. Professional yet conversational tone.
- Checks: Opening is not a summary, paragraphs are short, point of view is personal and reader-aware, and the ending includes a takeaway or discussion prompt.

### `listicle`

- Output channel: `article`
- Aliases: `/listicle`, `listicle`
- Instructions: Write a listicle article. Professional yet accessible tone. Use second-person address to engage readers. Organize with clear numbered sections and descriptive headings. Include bullet points for key details within each section. Mix explanatory text with practical tips and specific examples. Progress logically and end with actionable next steps.
- Checks: Uses numbered sections, headings are descriptive, each item has useful detail, and the ending gives actionable next steps.

### `newsletter`

- Output channel: `newsletter`
- Aliases: `/newsletter`
- Instructions: Write a newsletter. Open with a personal, conversational intro that sets up why this topic matters right now. Use first-person perspective freely. Break complex ideas into digestible sections with clear subheadings. Include one surprising insight the reader wouldn't get elsewhere. Balance being informative with being engaging. End with a clear next step, question, or call to action.
- Checks: Opens personally, explains why now, includes sections, contains at least one non-obvious insight, and closes with a next step or question.

### `podcast-notes`

- Output channel: `show_notes`
- Aliases: `/podcast-notes`, `podcast notes`, `show notes`
- Instructions: Write podcast show notes. Start with a 2-3 sentence summary that sells the episode - enthusiastic, conversational tone like a friend recommending it. List key topics discussed with timestamps if provided. Include guest bio and relevant links. Pull out 2-3 notable quotes. End with a call to action. Keep between 100-300 words. Use present tense for immediacy.
- Checks: Summary is 2-3 sentences, total length is 100-300 words unless asked otherwise, timestamps appear when provided, and guest/link/quote sections are included when available.

### `tiktok`

- Output channel: `tiktok`
- Aliases: `/tiktok`, `TikTok caption`
- Instructions: Write a TikTok caption. Maximum 1-2 sentences - brief and direct. Social media-native voice - casual, enthusiastic, conversational. Front-load the main point. Add a cluster of relevant hashtags at the end. Think 'what would make someone stop scrolling.'
- Checks: Caption is one or two sentences, main point comes first, and hashtags are relevant.

### `title`

- Output channel: `title`
- Aliases: `/title`, `titles`
- Instructions: Generate 5 title suggestions. Each should be 5-15 words, a single smooth sentence or question - no colons, no two-part titles. Use active voice and present tense. At least one should pose a question, one should make a bold claim, and one should use a number. Highlight surprising or controversial elements. Avoid clickbait that the content can't deliver on.
- Checks: Returns five options, each 5-15 words, no colons, at least one question, one bold claim, and one number.

### `tweet`

- Output channel: `x`
- Aliases: `/tweet`, `tweet`, `x post`
- Instructions: Write a short tweet. Direct and assertive. Opinionated, possibly contrarian. Use short sentences - sometimes just a single sentence for emphasis, sometimes 2, never more than 3. No hashtags unless specifically relevant. Lead with the most surprising or counterintuitive take.
- Checks: No more than three sentences, surprising take comes first, hashtags are omitted unless relevant, and the post is direct.

### `tweet-thread`

- Output channel: `x_thread`
- Aliases: `/tweet-thread`, `tweet thread`, `x thread`
- Instructions: Write a tweet thread. Start with an attention-grabbing hook. Each tweet should focus on a single point. Use progressive reveal - build suspense and share information gradually. Mix narrative with factual content. Include rhetorical questions to maintain engagement. End with a summary of key points and a clear call to action. Use line breaks to separate tweets.
- Checks: Starts with a hook, each post has one point, thread builds progressively, and the end includes a recap or CTA.

### `youtube-desc`

- Output channel: `youtube`
- Aliases: `/youtube-desc`, `youtube description`, `video description`
- Instructions: Write a YouTube video description. The first 2 lines are critical - they show in search results and above 'Show more,' so lead with what the viewer will learn or experience, not a generic greeting. Include your primary keyword naturally in the first sentence. If a transcript is available, add timestamps for key sections (format: 0:00 Title) with descriptive chapter titles that include relevant keywords. Mention specific resources, tools, or references from the video with links where applicable. Write for humans first - natural language works better than keyword lists. Friendly, direct tone. Do not include subscriber CTAs or social media links - YouTube's UI already handles those and they waste prime description space.
- Checks: First two lines state viewer value, primary keyword appears naturally, timestamps are included when transcript or chapter data exists, and boilerplate subscriber/social CTAs are omitted.

## Adapting A Draft For Another Channel

When transforming an existing draft into a channel variant:

1. Resolve the source draft and version.
2. Resolve the target recipe and selected concrete style.
3. Preserve source-backed facts, constraints, and claims from draft context.
4. Change structure, length, opening, CTA, and formatting to match the recipe.
5. Keep voice patterns from the style guide only where they fit the target
   format.
6. Save or describe the variant as a separate draft linked to the source version.

## Checks

Before returning a channel-specific draft, check:

- The selected recipe is named or the assumed recipe is disclosed.
- The output channel and visible format match.
- Source-backed claims are not invented to make the copy stronger.
- Channel conventions did not get mistaken for durable user voice.
- Style did not override platform limits, audience posture, or CTA rules.
