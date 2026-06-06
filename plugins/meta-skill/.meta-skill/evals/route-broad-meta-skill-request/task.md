# Route Broad Meta Skill Request Across Lanes

Capability: Meta Skill router
Topics: routing, lane-handoff, human-gates

## Problem Description

A user says:

"I want to build a skill for summarizing incident retros, set up evals for it, run the evals, and then improve whatever fails. If it looks good, package it."

This is a multi-lane request. The right behavior is not to do everything at once blindly; the agent should route the work through the proper lanes, name the sequence, and preserve human approval gates.

## Output Specification

Return a routed execution plan. It must include:

- Create Skill as the first lane
- Evaluate Skill as the eval authoring and run lane
- Improve Skill only after evidence exists
- explicit evidence artifacts expected at each stage
- validation commands
- package as a later explicit-approval gate, not an automatic final step
- no stale commands such as `report`, `plan`, `promote`, `decide`, or old review folders

## Task

Sequence the work across the three focused lanes and name proof limits.
