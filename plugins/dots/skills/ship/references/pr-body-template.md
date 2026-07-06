# PR Body Template

Read this before drafting the PR title or body.

## The Rule: Plain Summary Leads, Detail Follows

Every PR body has two layers. The top layer is always visible on GitHub and
must be readable by a smart person who does not read code. The detail layer
is for reviewers and lives inside a collapsed `<details>` block below it.
Never swap the order — a reviewer can expand for detail, but a non-technical
reader should never have to.

## Top Layer: Plain-Language Summary

3-6 sentences, no `<details>` wrapper. Cover, in plain product/user terms:

- What changed, from the point of view of someone using the product or repo.
- Why it matters — the problem it fixes or the value it adds.
- What someone will notice (or explicitly: "nothing user-visible changes").

Rules:

- No internal codenames, module names, or class names without a one-word
  gloss (e.g. "the sync adapter (the code that talks to the server)").
- No unexplained acronyms.
- No implementation nouns in the first sentence. Say what changed for the
  user or the product, not what was refactored. "Refactored the
  `FooAdapter`" becomes "made syncing faster and more reliable."
- Write like you're explaining it to a sharp colleague who doesn't code, not
  writing a changelog entry.

Calibrate depth to the repo's audience:

- Personal or tooling repos (like this one): README-level plainness aimed at
  future-you or a curious collaborator.
- Product or app repos: stakeholder-level plainness aimed at a PM, support
  lead, or non-engineering teammate who needs to know what shipped.

## Detail Layer: For Reviewers

Wrap this in a collapsed block so it doesn't compete with the summary:

```markdown
<details>
<summary>Technical details</summary>

### What changed

- <Area or module>: <focused description, grouped by behavior not commit order>
- <Area or module>: <...>

### Why this approach

<1-3 sentences, only when the approach isn't obvious from the diff.>

### How it was verified

- <command or check>: <result>
- <command or check>: <result>

### Risk / rollback

<Only when behavior, data, or config changes. State the blast radius and how
to revert.>

### Breaking changes

<Call out explicitly, with migration steps, or "None.">

</details>
```

Never invent verification evidence. If a check wasn't run, say so and why.

## Screenshots and Recordings

Required whenever the change affects anything visible in a UI. Capture per
[../../../references/visual-proof.md](../../../references/visual-proof.md)
and place images/recordings inside the `<details>` block, near "How it was
verified."

## Title

Use a concise outcome title that describes the full PR:

```text
Add scoped PR publication skill
Fix retry loop for cloud sync failures
Document PR filing workflow
```

## Worked Example

```markdown
Make search results load instantly instead of showing a spinner

Search used to show a loading spinner for a second or two every time, even
for the same query. Now repeated searches feel instant because we remember
recent results instead of re-fetching them. Nothing about how search looks
or behaves changes — it just feels faster, especially when going back to a
search you already ran.

<details>
<summary>Technical details</summary>

### What changed

- Search: added an in-memory cache (a short-term result store) keyed by
  query string, with a 5-minute expiry.
- Search: cache is invalidated on logout to avoid leaking results across
  accounts.

### Why this approach

An in-memory cache was simpler and safer than a persistent one since search
results go stale quickly and don't need to survive an app restart.

### How it was verified

- `npm test -- search` — all 42 tests pass.
- Manually repeated the same search 3 times locally — first load ~800ms,
  repeats <10ms.

### Risk / rollback

Low risk. Cache is additive and only reduces network calls; revert by
removing the cache layer with no data migration needed.

### Breaking changes

None.

</details>
```

## Repo Template Override

If the repo has `.github/pull_request_template.md`, use it as the base shape
and preserve its required headings, but still lead with a plain-language
paragraph before any technical heading.
