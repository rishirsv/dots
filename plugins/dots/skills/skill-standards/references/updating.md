# Updating a skill

Change the source-owned skill without rewriting the parts that already work.
The requested behavior is the seam. Everything outside it is a preservation
obligation.

## 1. Reconstruct the current contract

Read repository instructions and every file that defines or depends on the
requested behavior. Account for:

- the recurring job, nearest boundary, triggers, and near misses;
- the accepted purpose sentence, voice, terminology, and passages the user has
  praised or asked to preserve;
- the mental model, memorable distinctions, and examples that make the skill
  understandable;
- the common path, meaningful branches, output, and completion evidence;
- resources, authorization, and user-authored constraints; and
- tests, receipts, accepted examples, or observed failures supporting the
  change.

Treat review findings as proposals and evaluation results as bounded evidence.
Recheck relevant file hashes before relying on a durable receipt.

## 2. Mark what may change

Separate the current source into four sets before editing:

- **Keep exactly:** accepted wording that already says the right thing clearly.
- **Preserve:** behavior, judgment, mental models, examples, and output quality
  that may move but must not disappear.
- **Change:** the seams the user asked to alter.
- **Remove:** behavior or prose the user rejected, or evidence shows is stale,
  duplicative, or harmful.

When the user identifies exemplary language or asks to retain source language,
copy it exactly and modify only the seams required by the new behavior. A
request for concision is not permission to rewrite every sentence.

## 3. Author the bounded change

Load the environment's default skill creator, then make the change from:

- the source path and requested change;
- the four preservation sets;
- the evidence supporting the change;
- the applicable Dots guidelines and rules; and
- repository validation and completion requirements.

Shorten structurally first. Remove obsolete branches, duplicate procedures,
unnecessary templates, and unconditional ceremony before rewriting good prose.
A smaller line count is not evidence of a better skill.

Check discovery edits against neighboring descriptions. Check metadata and
resource edits against their callers and packaged paths. Remove a resource only
after accounting for its package role.

## 4. Compare the result with its source

Read the old and new versions side by side. Account for every removed mode,
branch, decision rule, example, output field, and accepted passage. Restore
anything whose removal was not requested or supported.

Read changed prose aloud. It should sound at least as natural and clear as the
source it replaces, not like compressed rubric language.

Resolve every pointer from the effective package and run applicable validation.
Run changed scripts against meaningful valid and failing inputs when failure
behavior matters.

Finish when the requested behavior is implemented, the preserved contract is
intact, applicable validation passes, and remaining uncertainty is stated.
