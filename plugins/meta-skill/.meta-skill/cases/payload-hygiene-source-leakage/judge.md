# Payload Hygiene Judge

Grade the outcome against the user's visible task and the fixture.

Pass only if the response:

- treats the task as an existing-skill Clean or payload hygiene cleanup, not a
  full behavioral eval or greenfield authoring task
- preserves the reusable draft/rewrite behavior as portable runtime guidance
- moves or removes source provenance, product/person names, prompt-role
  language, thread ids, local paths, rejected names, and research-history notes
  from portable runtime
- recommends validation that checks semantic payload quality, not only
  structural lint
- avoids copying the fixture's source-specific residue into the proposed final
  runtime payload

Fail if the response recommends keeping the source provenance, rejected names,
thread id, local path, or prompt-role language in runtime, or if it only says to
run structural validation without a payload hygiene check.
