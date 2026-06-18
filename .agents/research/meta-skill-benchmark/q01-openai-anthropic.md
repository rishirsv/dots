# Vendor Benchmark Methods: OpenAI And Anthropic

## Research Question

What benchmark and eval-design methods from OpenAI and Anthropic should inform a benchmark capability for Meta-Skill's `skill-evaluator`?

## Scope

Public OpenAI and Anthropic sources available on 2026-06-18, prioritizing official articles, docs, and open-source repositories.

## Answer

OpenAI's public benchmark work is strongest on benchmark construction patterns: open implementations, narrowly defined task formats, human validation, rubric decomposition, held-out or protected answer material, and explicit treatment of saturation/contamination. Anthropic's public writing is strongest on agent-eval practice: task/candidate/trial/transcript/outcome vocabulary, grader selection, capability-vs-regression separation, repeated trials, calibration, transcript review, infrastructure noise, and contamination/eval-awareness caveats.

For Meta-Skill, the useful synthesis is not "copy a leaderboard." It is: make benchmarks a named, stable profile over evaluator suites, with fixed task sets, candidate comparisons, calibrated grader policy, explicit gates, repeated-trial reliability metrics, environment metadata, and report language that refuses overclaiming.

## Key Evidence

- OpenAI Evals is an open-source framework and registry for evaluating LLMs and LLM systems, including custom/private evals for workflow-specific patterns.
- OpenAI `simple-evals` hosts reference implementations for HealthBench, BrowseComp, and SimpleQA, but is marked deprecated for new model/result updates as of July 2025.
- SimpleQA emphasizes simple grading: short factual questions with ground-truth answers and labels like correct/incorrect/uncertain.
- BrowseComp contains 1,266 hard web-browsing problems with short verifiable answers, and OpenAI reports using many trials per question to understand difficulty distribution.
- MLE-bench uses 75 Kaggle-style ML engineering competitions, open-source scaffolds, human baselines from public leaderboards, and resource-scaling/contamination analysis.
- PaperBench evaluates long-horizon replication of 20 ICML 2024 papers, using hierarchical rubrics that decompose each replication into smaller graded subtasks.
- HealthBench uses 5,000 realistic health conversations and physician-created weighted rubric criteria; it also uses meta-evaluations to compare model grading with physician judgment.
- SWE-bench Verified was initially introduced as a human-validated subset, but OpenAI later said it no longer measures frontier coding capability well because of contamination and flawed tests.
- Anthropic's agent-eval guide defines task, trial, grader, transcript, outcome, eval harness, agent harness, and suite in a way that closely matches Meta-Skill's current evaluator vocabulary.
- Anthropic recommends mixing code, model, and human graders; grading outcomes over paths; giving model judges an "unknown" escape; calibrating LLM judges against humans; and reading transcripts.
- Anthropic distinguishes capability/quality evals from regression evals, and describes graduation of saturated capability tasks into regression suites.
- Anthropic highlights pass@k for "one success matters" and pass^k for reliability across repeated attempts.
- Anthropic's infrastructure-noise article shows agentic benchmark scores can move by more than leaderboard margins due to environment/resource configuration alone.
- Anthropic's BrowseComp eval-awareness writeup documents contamination and benchmark-identification behavior in web-enabled settings.
- Anthropic's statistical approach recommends paired comparison information, confidence intervals, correlations, and power analysis when comparing models/candidates.

## Commands Or Searches Run

- Web searches for OpenAI SimpleQA, BrowseComp, MLE-bench, PaperBench, HealthBench, SWE-bench Verified, OpenAI Evals, Frontier Evals.
- Web searches for Anthropic agent eval methodology, infrastructure noise, statistical eval reporting, BrowseComp eval awareness, and Claude docs on evals.
- Opened official vendor pages and GitHub repositories listed below.

## Sources Consulted

- https://github.com/openai/evals
- https://github.com/openai/simple-evals
- https://github.com/openai/frontier-evals
- https://openai.com/index/introducing-simpleqa/
- https://openai.com/index/browsecomp/
- https://openai.com/index/mle-bench/
- https://openai.com/index/paperbench/
- https://openai.com/index/healthbench/
- https://openai.com/index/introducing-swe-bench-verified/
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- https://www.anthropic.com/engineering/infrastructure-noise
- https://www.anthropic.com/research/statistical-approach-to-model-evals
- https://www.anthropic.com/research/measuring-agent-autonomy
- https://www.anthropic.com/engineering/eval-awareness-browsecomp
- https://platform.claude.com/docs/en/test-and-evaluate/develop-tests

## Sources Not Consulted

- Private OpenAI or Anthropic benchmark suites.
- Full PDF line-by-line review for every benchmark paper.
- Current live model-card appendices beyond the official pages opened.

## Contradictions Or Caveats

- OpenAI has both promoted SWE-bench Verified and later argued it is no longer adequate for frontier coding measurement. That is not a contradiction so much as benchmark lifecycle evidence: a benchmark can be valid for a period, then saturate or become contaminated.
- Anthropic uses public benchmarks in model announcements, but its engineering posts warn that benchmark scores can be misleading without transcript inspection, grader audits, repeated trials, and environment control.
- HealthBench and PaperBench show sophisticated rubric scoring, but they are resource-intensive. Meta-Skill should adopt the pattern, not the scale.

## Confidence

High on the methodological direction. Medium on exact implementation sequencing because it depends on how much CLI surface the next iteration should expose.

## Gaps Or Next Checks

- Inspect OpenAI Frontier Evals subproject READMEs in detail if Meta-Skill wants a concrete task-layout inspiration beyond current workbench layout.
- Check if Anthropic's Claude docs include newer API-specific eval runner schemas that should influence CLI ergonomics.
- If benchmarking becomes a real feature, audit local App Server runner evidence for token/latency fields before promising efficiency metrics.

## Durability Recommendation

Keep this under `.agents/research/` as evidence. Promote only the distilled rules and planned reference-file shape into `plugins/meta-skill/skills/skill-evaluator/references/benchmarking.md` if the feature proceeds.
