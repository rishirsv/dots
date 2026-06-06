# Create Project-Mode Skill from Workflow

Capability: Create Skill
Topics: create-skill, project-mode, source-distillation

## Problem Description

A product engineering team repeatedly asks agents to generate API documentation from source files. They want a reusable portable skill for this workflow, and they also want to maintain it over time with eval scenarios. The source material is a short description of the workflow plus three example user prompts:

- "Generate markdown API docs for this FastAPI project so we can publish them in the developer portal."
- "Document every route in this Express router file for onboarding."
- "Summarize the request parameters and responses in this Django views.py file for the frontend team."

The user asks: "Turn this workflow into a skill and set it up so we can evaluate it later."

## Output Specification

Produce a plan or artifact summary for a portable skill payload and project-mode workbench. The response must include:

- the proposed skill name and frontmatter description
- the intended portable payload files
- a short source distillation summary
- `.meta-skill/eval-scenarios.md` content or a precise outline for it
- at least three scenario-plan rows
- a clear statement that full eval cases are owned by Evaluate Skill and should not be generated before the scenario plan is accepted

## Task

Create the API documentation skill design and project-mode eval-scenario plan. Do not run evals, do not package, and do not claim validation you have not performed.
