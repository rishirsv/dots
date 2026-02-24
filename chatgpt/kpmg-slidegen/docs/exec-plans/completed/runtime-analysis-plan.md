# Runtime Architecture Analysis Plan
## Phase outcomes
1. Phase 1 clarifies the current generator runtime surface and how the key files in `generator/` and `generator/runtime` fit together so other engineers can navigate the codebase confidently.
2. Phase 2 records the runtime’s deterministic behaviors, overflow/pagination handling, and template contracts so we know where the generator enforces structure and where regressions could hide.
3. Phase 3 surfaces concrete integration points for text-density or prompt contracts and prioritizes improvements that tighten QA around slide rendering.

## Task list
- [ ] 1.0 Inventory the key runtime files
  - [ ] 1.1 Review `generator/index.js`, `generator/app/*.js`, and `generator/runtime/*.js` for orchestration responsibilities
  - [ ] 1.2 Capture helper/builder responsibilities from `generator/builders/*.js` and `generator/helpers/*.js`
  - [ ] 1.3 Validation: summary references each reviewed file so readers can follow the structure
- [ ] 2.0 Analyze deterministic behaviors and overflow handling
  - [ ] 2.1 Identify deterministic data flows (input validation, layout selection, slot enforcement)
  - [ ] 2.2 Describe overflow/pagination handling with reference to `generator/runtime/paginate.js` and relevant helpers
  - [ ] 2.3 Validation: pair each behavior with a concrete file/location and explain why it matters
- [ ] 3.0 Recommend text-density/prompt contract integrations and improvements
  - [ ] 3.1 Find where content is mapped to templates and where density constraints could be enforced
  - [ ] 3.2 Prioritize improvements based on risk and feasibility
  - [ ] 3.3 Validation: provide a list of prioritized changes each tied to a file or module
