# Selecting Oracle Context

Use this reference when it is unclear what evidence an advisor needs. Start
from the decision and the advisor's actual access, not from a fixed package
shape.

## Match context to access

- **Repository access:** name the repository and revision, then give a few
  starting paths or symbols. Attach only local changes or unavailable evidence.
- **Local workspace access:** give exact paths. Do not copy files the advisor
  can already read.
- **Attachment access only:** package the smallest files or excerpts that let
  the advisor answer without guessing.

## Add evidence when a claim depends on it

Typical useful evidence includes:

- the failing path and exact error for diagnosis;
- the changed surface, governing constraints, and relevant verification for a
  review;
- the entrypoints, local patterns, and migration constraints for an
  architecture decision;
- the artifact and the parts of its contract being questioned for an artifact
  review; and
- the precise claim, freshness requirement, and local assumptions for external
  research.

Do not include an entire repository, directory, test suite, or review procedure
by default. Expand context only when a specific unanswered claim requires it.
When an accessible source already owns the method or facts, point to it.

Stop collecting context when the advisor can find or verify every fact needed
for the requested decision. If that boundary remains uncertain, ask the advisor
to name the smallest missing item that would change its answer.
