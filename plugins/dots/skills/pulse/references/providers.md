# Pulse Providers

Read only the source sections selected for the run.

## Shared Access Rules

Prefer explicit APIs, connectors, and public agent tools. Record provider,
collection surface, content type, canonical URL, publication date when known,
and whether the item is direct evidence or discovery-only.

Pulse reads credentials from shell variables or
`$XDG_CONFIG_HOME/pulse/provider-credentials.env`, defaulting to
`~/.config/pulse/provider-credentials.env`. Shell values take precedence.
`PULSE_CREDENTIALS_FILE` may point to another user-owned file outside the skill.
The bundled credential file is a placeholder template only.

Do not extract credentials or browser cookies, bypass access controls, rotate
identities, or collect private/session-only material. An authorization,
payment, rate-limit, or provider error is an access gap—not a zero-result scan.

## Reddit

Use Reddit for community experience, practical detail, complaints, and comment
texture. Public RSS/listing surfaces provide a keyless baseline;
`SCRAPECREATORS_API_KEY` may add bounded search or comment enrichment.

Keep posts and comments typed separately. Preserve subreddit, post/comment ID,
parent relationship, direct permalink, date, and available score fields. A
thread without captured comments does not support attributed comment quotes or
comment-level sentiment. Web-discovered threads remain discovery-only unless
their underlying content is opened and recorded directly.

## X

Use X for fast public reactions, influential framing, and visible disagreement.
`XAI_API_KEY` or `X_BEARER_TOKEN` enables direct search. The vendored Bird route
is permitted only when the user explicitly supplied `AUTH_TOKEN` and `CT0` in
the environment and selected `PULSE_X_BACKEND=bird`.

Do not obtain cookies from Chrome or another session store. Apply the requested
date window, deduplicate posts, and preserve post IDs, authors, dates, metrics,
and canonical URLs. Web pages discussing X do not establish an X narrative;
only specific public posts may be retained as discovery-only fallback evidence.

## TikTok

Use TikTok only when creator, video, hashtag, demonstration, or comment signal
is material. `SCRAPECREATORS_API_KEY` enables bounded collection.

Preserve video ID, creator, caption, transcript when returned, publication
date, engagement fields, and canonical URL. Keep comments as separate records.
A caption or transcript supports what the creator said; viewer reaction
requires captured comments.

## Web

The agent's Web tool supplies Web evidence. Search snippets are discovery leads.
Open the underlying page when its contents support a claim, and record the exact
URL, relevant passage or summary, publication date when available, and access
surface. Label discovered social links by their actual source.

## Polymarket

Use Polymarket only for a plausible live forecast. Public Gamma and CLOB
read-only endpoints require no trading credentials. Preserve exact market
wording, outcomes, price, freshness, volume/liquidity when available, and why
the contract is or is not a sound proxy for the user's question.

Never request wallet keys, trading credentials, authenticated order endpoints,
or order placement. Exclude markets that share keywords but measure a different
event.
