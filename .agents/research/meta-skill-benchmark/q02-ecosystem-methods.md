# Ecosystem Benchmark Methods

## Research Question

What methods from leading benchmarkers outside OpenAI/Anthropic should shape a Meta-Skill benchmark capability?

## Scope

Public benchmark/framework sources for SWE-bench, Terminal-Bench, tau-bench, GAIA, HELM, METR, Inspect AI, EleutherAI LM Evaluation Harness, and recent benchmark-audit work.

## Answer

The ecosystem splits into four useful patterns:

1. Reproducible harnesses: SWE-bench, Terminal-Bench, Inspect, LM Evaluation Harness.
2. Realistic agent worlds: tau-bench, WebArena/OSWorld-style state checks, Terminal-Bench sandboxes.
3. Human-calibrated or human-comparable tasks: METR, RE-Bench, SWE-bench Verified, HealthBench-like rubric validation.
4. Benchmark integrity/audit discipline: contamination handling, answer-key isolation, verifier isolation, null-solution tests, held-out/private splits, and environment metadata.

Meta-Skill should use these patterns as guardrails for small, local benchmark profiles. It does not need a public leaderboard architecture.

## Key Evidence

- SWE-bench builds tasks from real GitHub issues and PRs, stages a Docker environment at the pre-fix commit, and uses fail-to-pass tests as the primary signal.
- SWE-bench Verified adds human filtering to ensure problem descriptions are clear, test patches are correct, and tasks are solvable.
- Terminal-Bench provides terminal tasks with English instructions, test scripts, and reference/oracle solutions, executed through a terminal sandbox and CLI.
- tau-bench models dynamic user-agent-tool interaction with realistic databases, APIs, domain policies, LLM user simulation, stateful database checks, and pass^k reliability.
- GAIA uses real-world assistant questions that combine reasoning, multimodality, web browsing, and tool use; it withholds most answers for leaderboard integrity.
- HELM emphasizes standardization, reproducibility, transparency, multiple metrics beyond accuracy, unified model interfaces, web UI, and leaderboards.
- METR's RE-Bench compares agents and humans in the same environments with the same resources and information, creates novel non-contaminated tasks, and reports limitations of small task count and simplified real-world goals.
- METR/Epoch time-horizon methodology evaluates repeated model attempts, gathers human completion times, and fits success probability against human task duration.
- Inspect AI exposes composable evaluation primitives: tasks, datasets, solvers/agents, tools, scorers, model grading, sandboxing, logs, and visualization.
- EleutherAI's LM Evaluation Harness is a mature open-source framework for many academic benchmarks and has moved toward YAML config and CLI validation.
- Berkeley RDI's benchmark-audit work argues that benchmark code must be audited like production code: isolate grader/reference material, distrust submitted output, test null submissions, add adversarial negatives, enforce honest baselines/tolerances, and report uncertainty.
- DebugML's cheating analysis distinguishes harness-level cheating from task-level cheating and shows that injected context, accessible verifier code, public solutions, and git history can invalidate agent benchmark results.

## Commands Or Searches Run

- Web searches for SWE-bench, Terminal-Bench, tau-bench, GAIA, HELM, METR, Inspect AI, LM Evaluation Harness, and benchmark cheating/audit analyses.
- Opened official project pages, GitHub repositories, and primary articles where available.

## Sources Consulted

- https://www.swebench.com/original.html
- https://www.swebench.com/verified.html
- https://github.com/harbor-framework/terminal-bench
- https://github.com/sierra-research/tau-bench
- https://sierra.ai/blog/benchmarking-ai-agents
- https://arxiv.org/abs/2311.12983
- https://github.com/stanford-crfm/helm
- https://metr.org/blog/2024-11-22-evaluating-r-d-capabilities-of-llms/
- https://github.com/METR/RE-Bench
- https://epoch.ai/benchmarks/metr-time-horizons
- https://inspect.aisi.org.uk/
- https://www.aisi.gov.uk/blog/inspect-evals
- https://github.com/EleutherAI/lm-evaluation-harness
- https://rdi.berkeley.edu/blog/trustworthy-benchmarks/
- https://debugml.github.io/cheating-agents/

## Sources Not Consulted

- Full source-code walkthroughs of every benchmark harness.
- Paid/private benchmark leaderboards.
- Full papers for all benchmarks beyond abstracts and official descriptions.

## Contradictions Or Caveats

- Public benchmark datasets aid reproducibility but increase contamination and answer leakage risk.
- Realistic agent tasks improve external validity but are noisier, costlier, and more vulnerable to environment artifacts than static Q&A.
- Human-calibrated benchmarks are more trustworthy but expensive and slow to maintain.
- Leaderboards encourage optimization and can incentivize harness gaming; internal benchmark profiles should prioritize decision quality over public ranking.

## Confidence

High on cross-benchmark patterns and risks. Medium on exact influence weights because Meta-Skill's target is local skill quality, not model capability leaderboard ranking.

## Gaps Or Next Checks

- Review Inspect task/scorer schemas if Meta-Skill wants a stronger plugin-like benchmark authoring model.
- Review Terminal-Bench task contribution docs for possible validator/reference-solution checklists.
- Review METR Task Standard in detail if benchmark tasks become portable beyond Meta-Skill.

## Durability Recommendation

Keep as research evidence. Distill only the benchmark-integrity checklist and profile schema into runtime/reference docs.
