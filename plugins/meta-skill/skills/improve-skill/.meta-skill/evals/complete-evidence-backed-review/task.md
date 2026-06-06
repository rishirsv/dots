# Complete Evidence-Backed Review

Capability: Improve Skill
Topics: skill-review, eval-dimension-alignment, deterministic-validation

## Problem Description

A maintainer has an existing skill with `.meta-skill/eval-scenarios.md`, eval `criteria.json` files, and a generated `.meta-skill/review.md` worksheet. The maintainer wants a read-only quality review, not source edits.

## Output Specification

Return a completed review summary that:

- selects Improve Skill as the lane
- uses the skill's eval dimensions as review lenses
- completes Discovery and Implementation with 2-4 sentence overall assessments
- cites concrete skill text, reference sections, eval dimensions, validation output, or missing evidence
- preserves deterministic Validation exactly as generated
- reports combined findings in severity order
- does not invent validation rows, lint output, deterministic test status, run IDs, evidence files, or scores
- does not edit the target skill

## Task

Complete the read-only review from the generated worksheet and existing evidence.
