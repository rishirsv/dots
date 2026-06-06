# Author Eval Infrastructure from Scenarios

Capability: Evaluate Skill
Topics: evaluate-skill, eval-authoring, criteria-json

## Problem Description

A reusable skill already has a filled `.meta-skill/eval-scenarios.md` with three accepted scenarios:

- "Generate API docs from FastAPI routes"
- "Document Express router behavior"
- "Summarize Django view parameters and responses"

The maintainer now wants concrete executable eval files so the scenarios can be run later. They also want deterministic checks for file shape where possible.

## Output Specification

Return the exact eval file plan for the three scenarios. The response must include:

- `.meta-skill/evals/<slug>/task.md` contents or detailed outlines
- `.meta-skill/evals/<slug>/criteria.json` contents or detailed outlines
- at least one Quality, one Implementation, and one Validation criterion per eval
- fixture declarations when a task refers to solver-visible files
- flat `.meta-skill/tests/<id>` deterministic checks, with no nested test folders
- an honest run plan that does not claim execution has happened

## Task

Use Meta Skill's Evaluate Skill lane to turn the accepted high-level scenarios into concrete eval cases. Keep criteria evaluator-only and do not edit the skill implementation.
