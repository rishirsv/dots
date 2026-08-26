# Discover failures

Use real traces, outputs, accepted examples, complaints, and corrections before
synthetic data. Preserve privacy and stable evidence locators.

## Alternate breadth and depth

1. Inspect representative records and identify the content a reviewer must see.
2. Begin with random samples plus cluster representatives, structural outliers,
   feedback, and evaluator disagreement.
3. Ask the human for free-text observations. Do not make them choose a taxonomy
   before failure boundaries emerge.
4. Organize grounded observations into a provisional taxonomy.
5. After several distinct human-reviewed examples establish a mode, use one
   fresh agent per mode to scan the corpus for similar instances.
6. Present agent matches as suggestions. Favor recall, distinguish them
   visually, and require accept or dismiss.
7. Revisit earlier records as criteria evolve, then return to broad sampling.

Show complete relevant work, including tool calls or intermediate state when
they affect judgment. Do not expose hidden reasoning unavailable from the host.

## Track convergence

Track reviewed records, clusters or dimensions covered, confirmed and suggested
instances, and which new samples reveal new modes. Keep random exploration in
every broad sample. Suggest stopping or narrowing when new records mostly repeat
known modes; treat saturation as judgment rather than a fixed trace count.

Produce a taxonomy, representative evidence, coverage gaps, and candidate
regression cases. Do not build a grader until the failure boundary is clear.
Use [the review interface](review-interface.md) for substantial sessions and
[Synthetic data](synthetic-data.md) only for a named evidence gap.
