---
name: oracle
description: Use when explicitly packaging a focused repository-context bundle and prompt for an external model, reviewer, or planning pass; not for generic second opinions without a repo-context export.
---

# Oracle

Package one focused repo-context handoff for an external model, reviewer, or planning pass.

## Activation Rule

Use this skill only when the user explicitly asks to package, export, bundle, or prepare repository context for an external model or reviewer.

Do not auto-activate for:

- ordinary mentions of Oracle the company or database
- generic "second opinion" requests with no packaging request
- ordinary model mentions with no repo-context handoff

## Modes

Pick one mode and produce one primary context artifact:

- `review`: a grounded second opinion, diagnosis, critique, or recommendation.
  - write `prompt.md`
  - write `context.zip`
  - show the exact prompt inline in chat as a fenced `xml` block
- `planning`: a planning-only pass.
  - write `prompt.md`
  - write `context.txt`
  - show the exact prompt inline in chat as a fenced `xml` block

Only create both `context.zip` and `context.txt` if the user explicitly asks for both.

Write artifacts to `<project_root>/.agents/oracle/<feature-slug>/`.

## Workflow

1. Reduce the request to one downstream task.
2. Choose `review` or `planning`.
3. Pick the smallest file set that can support a grounded answer.
4. Write `prompt.md` from the smallest fitting template in [references/prompt-templates.md](references/prompt-templates.md), or use [references/custom-prompt-guide.md](references/custom-prompt-guide.md) when the task needs a custom prompt.
5. For non-trivial bundles, run a dry-run token estimate before writing.
6. Build the one required context artifact.
7. Show the exact prompt inline in chat.
8. Tell the user exactly what to upload and paste.

## File Selection

Include the smallest repo slice that can still support a confident answer:

1. Start with the docs, specs, or conventions that define expected behavior.
2. Add the smallest complete feature slice involved.
3. Add the concrete files mentioned by the user.
4. Add nearby callers, callees, shared types, config, or validation only if they materially change the answer.
5. Leave out everything that would not change the downstream conclusion.

Never include secrets such as `.env` files, private keys, tokens, or generated Oracle output. Never disable secret-like excludes for an external-model bundle. If the selected scope requires sensitive files, stop and ask for a safer substitute such as schemas, redacted examples, or summarized configuration.

## Prompt Rules

- Assume the downstream model knows nothing beyond the uploaded artifact and pasted prompt.
- In `review` mode, tell it to read `MANIFEST.md` at the root of `context.zip` first.
- In `planning` mode, tell it to read the manifest section at the top of `context.txt` first.
- Require file-path citations for concrete codebase claims.
- Tell the downstream model to proceed with assumptions and list unknowns instead of asking routine questions.
- Keep the prompt compact. If a bundled template fits, use it instead of building a custom prompt from scratch.

Use these references only as needed:

- [references/prompt-templates.md](references/prompt-templates.md)
- [references/custom-prompt-guide.md](references/custom-prompt-guide.md)
- [references/prompt-blocks.md](references/prompt-blocks.md)

## Commands

Run [scripts/oracle.sh](scripts/oracle.sh), which wraps [scripts/build-context-zip.py](scripts/build-context-zip.py).

Resolve the installed Oracle skill without hard-coded plugin versions:

```bash
ORACLE_SKILL_DIR="${ORACLE_SKILL_DIR:-}"

if [ -z "$ORACLE_SKILL_DIR" ] && [ -d "skills/oracle" ]; then
  ORACLE_SKILL_DIR="skills/oracle"
fi

if [ -z "$ORACLE_SKILL_DIR" ]; then
  ORACLE_SKILL_DIR="$(
    find \
      "${CODEX_HOME:-$HOME/.codex}" \
      "$HOME/.claude" \
      -path '*/skills/oracle' \
      -type d 2>/dev/null | head -n 1
  )"
fi

test -d "$ORACLE_SKILL_DIR" || {
  echo "Could not find the Oracle skill directory. Set ORACLE_SKILL_DIR explicitly." >&2
  exit 1
}
```

For non-trivial bundles, preview before writing:

```bash
REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --dry-run \
  --estimate-tokens \
  --task "Summary of the downstream task" \
  --entry "path/to/file-or-folder::Why it matters"
```

### Review bundle

```bash
REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --out ".agents/oracle/<slug>/context.zip" \
  --task "Summary of the review task" \
  --entry "path/to/file-or-folder::Why it matters"
```

### Planning bundle

```bash
REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --text-out ".agents/oracle/<slug>/context.txt" \
  --task "Summary of the planning task" \
  --entry "path/to/file-or-folder::Why it matters"
```

Useful options:

- `--entry-file path/to/entries.txt`
- `--max-tokens 80000`
- `--constraint "Key constraint"`
- `--verify "Command to validate locally"`
- `--exclude "**/*.snap"`
- `--estimate-tokens`
- `--dry-run`

## Handoff

Tell the user:

- `review`: upload `context.zip`, then paste the prompt shown in chat or from `prompt.md`.
- `planning`: open a fresh model chat, select the strongest available reasoning setting, upload `context.txt`, then paste the prompt shown in chat or from `prompt.md`. Treat the result as a planning draft and verify locally before implementation.

If the bundle feels too large or vague, cut scope or split the request into separate Oracle runs instead of adding more files.
