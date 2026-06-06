# Evaluate Skill Workbench

This workbench protects the `evaluate-skill` lane itself. The portable skill teaches agents to create realistic eval tasks, keep criteria hidden, run evidence collection, and report proof limits honestly.

The deterministic tests should focus on stable invariants that are easy to regress:

- solver-visible task examples must read like real user or maintainer requests
- solver-visible prompts must not say they are tests, benchmarks, grader passes, or self-eval cases
- evaluator-only criteria and parent hypotheses stay out of solver-visible examples
- evidence paths and run semantics match the current Meta Skill runner contract
