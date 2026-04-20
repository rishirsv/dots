# Brainstorm Examples

Load this file for conversation shape reference. These examples show the rhythm and formatting of good brainstorms — not templates to copy literally.

---

## Example 1: Quick Sounding Board

Sizing: Quick. The user has a formed opinion and needs a fast reaction.

> **User:** I'm thinking about adding a changelog to the CLI. Worth it?
>
> **Assistant:** What's driving this — users asking for it, or a gut feeling that it's missing? And who reads the CLI output — developers, or also ops people who might not check GitHub?
>
> **User:** Developers mostly. Nobody's asked, I just think it'd be nice.
>
> **Assistant:** Honest take: if nobody's asking for it and your users are developers, they'll check the GitHub releases page or git log. A changelog command adds maintenance burden for something your audience already knows how to find.
>
> Where it *would* pay off: if you ship breaking changes and want the CLI itself to surface "hey, v3 changed the config format." That's more of a migration warning than a changelog though.
>
> My recommendation: skip the changelog, but add a `--version` flag that prints the version and a link to the releases page. Low effort, solves the real need. Sound right?
>
> **User:** Yeah that's the move. Thanks.

What this demonstrates: sized as quick, gave an honest recommendation fast, didn't manufacture phases or ceremony.

---

## Example 2: Deep Software Brainstorm

Sizing: Deep. Multiple unknowns, cross-cutting scope, real alternatives to evaluate.

> **User:** We need to add real-time notifications to the app. Users are complaining about stale data.
>
> **Assistant:** Before we get into solutions — a couple things to nail down:
>
> 1) What's actually going stale?
>    a) Dashboard metrics / analytics
>    b) Collaborative data (e.g., two users editing the same thing)
>    c) Status updates (order status, build progress, etc.)
>    d) Multiple of the above — which is the most painful?
>
> 2) How stale is "stale" right now — are we talking minutes or hours?
>
> **User:** 1c, order status. And it's minutes — they place an order and keep refreshing to see if it shipped.
>
> **Assistant:** Okay so the core problem is: a user takes an action, and the result of that action doesn't appear until they manually refresh. That's a feedback loop problem more than a general real-time data problem — which is good, because the scope is much narrower.
>
> That changes the approach. We don't need every piece of data to be live — we just need status transitions to push to the client when they happen.
>
> Before I look at approaches, one more: how many concurrent users are we talking about, roughly? That affects whether a simple solution will hold.
>
> **User:** Maybe 500 concurrent on a busy day. Not huge.
>
> **Assistant:** At 500 concurrent, all three common approaches will work fine. Here's how they compare for your case:
>
> | | **SSE** | **WebSockets** | **Polling (30s)** |
> |---|---|---|---|
> | Complexity | Low — server pushes, client listens | Medium — bidirectional, needs connection mgmt | Lowest — just a timer |
> | Latency | Near-instant | Near-instant | Up to 30s delay |
> | Infra impact | Minimal at 500 users | Needs sticky sessions or Redis pub/sub | Minimal |
> | Best for | One-way status updates | Chat, collab, bidirectional needs | When "good enough" is fine |
>
> **My recommendation: SSE.** You only need server-to-client push. It's simpler than WebSockets, near-instant, works through most proxies and load balancers, and you won't need the bidirectional channel. Polling would also work but you said users are frustrated by the delay — 30 seconds won't fix the feeling.
>
> Want to dig into the SSE implementation shape, or do you want to push back on the approach first?

What this demonstrates: adaptive entry (started at the problem, not step 1), question formatting with options, narrowed scope before exploring solutions, comparison table with clear recommendation and reasoning.

---

## Example 3: Universal Creative Brainstorm

Sizing: Standard. Not trivial but doesn't need deep branching.

> **User:** I need to name my new developer tool. It's a CLI that watches your test suite and re-runs only the tests affected by your code changes.
>
> **Assistant:** Good problem to name for — it's specific enough to be evocative. Before I generate candidates, what's your instinct so far? Any names you've tried and rejected, or a vibe you're going for?
>
> **User:** I tried "delta" but it's taken. I want something short, technical-feeling but not generic.
>
> **Assistant:** Got it — short, technical, not generic, and "delta" tells me you like the idea of *change* as the core metaphor. Let me explore a few different angles:
>
> **Change / difference metaphor:**
> - Drift — your tests drift with your code
> - Flux — continuous change
> - Diff (too generic, probably taken)
>
> **Watching / sensing metaphor:**
> - Sentry — watches and reacts (but overloaded in dev tools)
> - Reflex — automatic response to a stimulus
> - Pulse — checks the heartbeat of your test suite
>
> **Speed / precision metaphor:**
> - Snipe — picks off exactly the right tests
> - Stitch — reconnects tests to the code that changed
> - Tap — light, fast, targeted
>
> My top 3:
>
> 1. **Reflex** — captures the "automatic response to change" idea. Short, memorable, feels technical without being jargony. Risk: there's a Haskell framework called Reflex, but different enough audience.
> 2. **Drift** — evocative, unusual for a dev tool, ties to the delta/change metaphor you liked. Risk: could sound passive or negative ("drifting off course").
> 3. **Tap** — shortest, punchiest, implies precision. Risk: very common English word, might be hard to search for.
>
> Which of these directions feels warmest? Or did something I didn't star catch your eye?

What this demonstrates: asked for existing thinking first, explored multiple angles (not just synonyms), grouped by theme, evaluated top candidates on fit and risk, ended with a question that invites reaction.
