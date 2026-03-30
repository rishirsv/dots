# Evals Framework Refactor Plan

## Phase Outcomes

### Phase 1 - Create the project shell

Create a dedicated `skills/evals` project so the framework is easy to find, explain, and evolve without mixing it into unrelated top-level skills.

### Phase 2 - Simplify the skill surface

Replace the old many-skill model with four connected workflow skills and one standalone audit skill so users can choose the right entrypoint quickly.

### Phase 3 - Strengthen the optimization core

Make the system stricter than the prior framework and the Langfuse article by requiring narrow target slices, executable eval contracts, hard gates, and holdout validation.

### Phase 4 - Make the workflow self-explaining

Add a project README and cross-skill handoffs so each skill knows where it fits and can direct the user to the right next step.

## Implementation Checklist

- [x] 1.0 Create the `skills/evals` project structure
  - [x] 1.1 Create the project folder and nested `skills/` directory
  - [x] 1.2 Add the project README that explains the framework
  - [x] 1.3 Save this execution plan in `docs/exec-plans/active`
- [x] 2.0 Build the new skill surface
  - [x] 2.1 Add `eval-audit`
  - [x] 2.2 Add `error-analysis`
  - [x] 2.3 Add `eval-build`
  - [x] 2.4 Add `autoresearch`
  - [x] 2.5 Add standalone `skill-audit`
- [x] 3.0 Add supporting references and contracts
  - [x] 3.1 Add reference files for eval stack auditing
  - [x] 3.2 Add reference files for error analysis and slice selection
  - [x] 3.3 Add contract and path references for `eval-build`
  - [x] 3.4 Add scoring, mutation, and holdout references for `autoresearch`
  - [x] 3.5 Add rubric and report template references for the standalone `skill-audit`
- [x] 4.0 Wire workflow guidance and metadata
  - [x] 4.1 Add cross-skill handoff guidance to each skill body
  - [x] 4.2 Generate `agents/openai.yaml` for each skill
  - [x] 4.3 Keep `skill-audit` separate from the core workflow
- [x] 5.0 Validate the new package
  - [x] 5.1 Run structural validation on each new skill
  - [x] 5.2 Check the repo diff for the expected files only
