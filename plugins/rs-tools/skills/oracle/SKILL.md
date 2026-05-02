---
name: oracle
description: Prepare a focused repository-context package for an external model or reviewer. Use when the user explicitly asks to package code, docs, or a repo slice for ChatGPT Pro, GPT-5.x Pro, an outside review, a second opinion, or an external planning pass. Produces a prompt plus either context.zip for review or context.txt for planning.
---

# Oracle

Prepare one clean external-model handoff for either:
- `review`: a grounded second opinion, diagnosis, critique, or recommendation
- `ultraplan`: a planning-only pass in ChatGPT web using GPT-5.x Pro

## Activation Rule

Use this skill only when the user explicitly asks to package repo context for an external model or reviewer.

Do not auto-activate for:
- ordinary mentions of Oracle the company or database
- generic "second opinion" requests with no packaging request
- ordinary mentions of ChatGPT Pro with no repo-context handoff

## Canonical Output

Pick one mode and produce one primary context artifact:

- `review`
  - write `prompt.md`
  - write `context.zip`
  - show the exact prompt inline in chat as a fenced `xml` block
- `ultraplan`
  - write `prompt.md`
  - write `context.txt`
  - show the exact prompt inline in chat as a fenced `xml` block

Only create both `context.zip` and `context.txt` if the user explicitly asks for both.

Write artifacts to `<project_root>/.agents/oracle/<feature-slug>/`.

## Workflow

1. Reduce the request to one downstream task.
2. Choose `review` or `ultraplan`.
3. Pick the smallest file set that can support a grounded answer.
4. Write `prompt.md` from the smallest fitting template in [reference/prompt-templates.md](reference/prompt-templates.md).
5. Build the one required context artifact.
6. Show the exact prompt inline in chat.
7. Tell the user exactly what to upload and paste.

## File Selection

Include the smallest repo slice that can still support a confident answer:

1. Start with the docs, specs, or conventions that define the expected behavior.
2. Add the smallest complete feature slice involved.
3. Add the concrete files mentioned by the user.
4. Add nearby callers, callees, shared types, config, or validation only if they materially change the answer.
5. Leave out everything that would not change the downstream conclusion.

Never include secrets such as `.env` files, private keys, tokens, or generated Oracle output.

## Prompt Rules

- Assume the downstream model knows nothing beyond the uploaded artifact and pasted prompt.
- In `review` mode, tell it to read `MANIFEST.md` at the root of `context.zip` first.
- In `ultraplan` mode, tell it to read the manifest section at the top of `context.txt` first.
- Require file-path citations for concrete codebase claims.
- Tell the downstream model to proceed with assumptions and list unknowns instead of asking routine questions.
- Keep the prompt compact. If a bundled template fits, use it instead of building a custom prompt from scratch.

Use these references only as needed:
- [reference/prompt-templates.md](reference/prompt-templates.md)
- [reference/custom-prompt-guide.md](reference/custom-prompt-guide.md)

## Commands

Use the installed skill path so Oracle works from any repo. If the skill is installed through a plugin, resolve `ORACLE_SKILL_DIR` to the plugin skill folder that contains this `SKILL.md` before running the bundled script:

```bash
ORACLE_SKILL_DIR="${ORACLE_SKILL_DIR:-$HOME/.codex/skills/oracle}"
if [ ! -d "$ORACLE_SKILL_DIR" ] && [ -d "$HOME/.claude/skills/oracle" ]; then
  ORACLE_SKILL_DIR="$HOME/.claude/skills/oracle"
fi
```

### Review bundle

```bash
REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --out ".agents/oracle/<slug>/context.zip" \
  --task "Summary of the review task" \
  --entry "path/to/file-or-folder::Why it matters"
```

### Ultraplan bundle

```bash
REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --text-out ".agents/oracle/<slug>/context.txt" \
  --task "Summary of the planning task" \
  --entry "path/to/file-or-folder::Why it matters"
```

Useful options:
- `--constraint "Key constraint"`
- `--verify "Command to validate locally"`
- `--exclude "**/*.snap"`
- `--estimate-tokens`
- `--dry-run`

## Hand-off

Tell the user:

- `review`
  - upload `context.zip`
  - paste the prompt shown in chat or from `prompt.md`
- `ultraplan`
  - open a fresh ChatGPT web chat or project chat
  - select `GPT-5.x Pro` and the highest available thinking setting
  - upload `context.txt`
  - paste the prompt shown in chat or from `prompt.md`
  - treat the result as a planning draft and verify locally before implementation

If the bundle feels too large or vague, cut scope or split the request into separate Oracle runs instead of adding more files.
