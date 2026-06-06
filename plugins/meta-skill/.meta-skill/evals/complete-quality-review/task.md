# Complete Registry-Quality Skill Review

Capability: Improve Skill
Topics: improve-skill, quality-review, review-criteria

## Problem Description

A maintainer asks for a read-only review of an existing skill. The review command has generated `.meta-skill/review.md` with deterministic Validation evidence and placeholders for Discovery and Implementation. The maintainer wants the completed review in the same shape as a public registry Quality page.

## Output Specification

Return a completed Quality review. The response must include:

- Quality Score as the rounded average of Discovery, Implementation, and Validation percentages
- Discovery overall assessment with 2-4 substantive sentences
- Discovery dimension rows with evidence-backed reasoning and calibrated 0-3 scores
- Implementation overall assessment with 2-4 substantive sentences
- Implementation dimension rows with evidence-backed reasoning and calibrated 0-3 scores
- deterministic Validation preserved as generated
- combined severity-ordered findings
- no `Judge Score`, no `Total Score`, no confidence, no basis, and no unavailable placeholders

## Task

Complete the generated review as an agent-authored Quality page. Do not edit the target skill.
