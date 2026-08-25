# Feature Development

Use this playbook for building or materially changing software, including new
features, bug fixes, refactors, and behavior-changing configuration. Keep one
compact working record in the active task with the outcome, non-goals, settled
decisions, responsible code, chosen direction, and proof status.

1. **Discover.** Read the request and repository instructions. Identify the
   intended result, what must stay true, and what would prove completion.
2. **Explore.** Trace the current path, owners, state, side effects, analogous
   patterns, tests, and real verification surface. Use read-only investigators
   only when distinct evidence lanes make the work faster or broader.
3. **Settle decisions.** Answer repository-owned questions from source. Ask the
   user only for product choices, preferences, authority, or information that a
   focused probe cannot establish.
4. **Choose the design.** Select the smallest coherent approach that fits the
   existing system. Use focused skills such as `$design`, `$plan`, or
   `$orchestrate` when their full method is needed, then return here.
5. **Implement.** Build the complete authorized change in checkable units.
   Verify each meaningful unit before depending on it.
6. **Prove it.** Run focused repository checks and exercise the real product
   path when one exists. A build or unit test does not by itself prove an
   integration or visible behavior.
7. **Review and finish.** Apply `$review-change`, repair retained in-scope
   findings, rerun affected checks, inspect the final diff, and summarize the
   result, proof, intentional exclusions, and remaining risk.

Scale review to the change:

- **Low:** one localized, reversible change with a narrow proof surface and no
  material security, data, migration, permission, concurrency, or public-contract
  risk. One reviewer applies all core lenses.
- **Default:** normal multi-file product work or a change whose blast radius is
  not obviously narrow. Independent Correctness, Simplicity, and Systems lanes
  inspect the complete change.
- **Deep:** security-sensitive, data-changing, migration-heavy, cross-system,
  concurrency-sensitive, difficult-to-reverse, or otherwise high-blast-radius
  work. Add relevant specialists, independent verification, and a gap sweep.
- **Challenge:** use only when the user explicitly asks for adversarial review.

The playbook is complete when the requested behavior works through its real
path, proof supports the result, review is complete at the selected depth, and
every material gap is stated honestly.
