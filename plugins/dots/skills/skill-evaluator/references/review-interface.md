# Build the local review interface

Use the interface when chat would hide important evidence: many cases, blind
pairs, traces, visual artifacts, error discovery, grader disagreement, trigger
queries, or benchmark drill-down.

## Prepare review data

Create a typed `review-data.json` using the contract in [Artifacts](artifacts.md).
Choose one mode:

- `case-review` for case output and evidence;
- `blind-comparison` for neutral A/B review;
- `error-discovery` for free-text and span observations, suggestions, taxonomy,
  coverage, and re-review;
- `grader-calibration` for human labels and disagreements;
- `trigger-review` for should-trigger and near-miss queries; or
- `benchmark` for aggregate overview with case drill-down.

Choose a view that fits the evidence. Make primary content visually dominant;
extract useful metadata; collapse repeated context; group tool calls
with results; render prose, code, diffs, tables, images, and files with their
native structure. Show the full relevant trace when process matters. Do not
include hidden reasoning the host did not provide.

For error discovery, keep human annotations and agent suggestions distinct.
Preserve stable record and text-range locators. Show taxonomy and sampling
coverage, accept or dismiss suggestions, and encourage re-review when new modes
make earlier records worth revisiting.

For blind comparisons, keep summary, coverage, taxonomy, annotations,
suggestions, provenance, evidence references, and the coordinator-only identity
map out of the review envelope until after the decision is exported.

Text selections are Unicode-code-point ranges in each block's canonical text,
bound to that block's content hash. A quote that is absent or occurs more than
once needs a longer selection; DOM offsets are not durable evidence locators.

## Generate and review

Run:

```bash
python3 <skill-evaluator-dir>/scripts/generate_review.py <review-data.json> --out <review.html>
```

The generator resolves contained local paths, embeds safe data, and produces a
single browser-openable page. The page makes no network requests or direct
writes to the suite. In-progress feedback stays in local browser storage; the
reviewer exports `feedback.json` for durable handoff.

Customize a working data file or copy of the asset when the domain needs a new
block type. Define its allowed fields before adding a renderer; never pass raw
executable HTML from evaluated content.

Inspect representative desktop and narrow layouts. Exercise navigation,
keyboard use, long content, empty and partial states, invalid runs, unsupported
files, local-storage recovery, feedback export, and untrusted output. Browser
source inspection alone does not prove the interface works.
