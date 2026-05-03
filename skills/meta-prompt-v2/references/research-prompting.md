# Research Prompting

Use with the Research template or any prompt where citations, recency, grounding, or web/document retrieval are central.

## GPT-5.5 Research Defaults

- Define the target outcome, success criteria, source requirements, and stop rules.
- Use current information checks when facts may have changed.
- Avoid unsupported factual claims. If evidence is thin, state what is known, what is uncertain, and what would resolve the uncertainty.
- Add citation rules only for claims that need support.
- Distinguish source-backed facts from creative wording in drafts, slides, messaging, or narrative outputs.

## Retrieval Budget Pattern

Use this when search/tool behavior matters:

```text
Start with one broad search using short, discriminative keywords. Search again only if the top results do not answer the core question, a required fact is missing, sources conflict, the user asked for exhaustive coverage, or a specific document/URL must be read. Stop when you can answer the core request with enough citable evidence.
```

## Citation Pattern

```text
Use inline numeric citations for important factual claims. Include a final References section mapping each number to source title, publisher, publication/update date when available, and link.
```

## Missing Evidence

For factual work, specify one of these behaviors:

- ask for the smallest missing input
- answer with labeled assumptions
- mark fields as `unknown`
- omit unsupported rows
- provide a confidence or evidence-quality note

## Useful Source Rules

- Prefer primary sources for laws, technical docs, APIs, pricing, and model behavior.
- Prefer recent sources for market, product, policy, and company facts.
- For comparisons, require consistent dates and definitions before ranking.
- For financial, legal, medical, or safety-sensitive claims, require direct source support and caveats.
