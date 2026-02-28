---
name: oracle
description: "Create a request to an expert assistant and bundle the relevant repo context into a zip. Use when the user says \"Oracle\", \"use Oracle\", \"second opinion\", or \"ask ChatGPT Pro\"."
---

# Oracle

Prepares an "ask an expert" bundle for ChatGPT Pro (web UI) to get a second opinion with real repo context.

**Produces two artifacts:**
- `prompt.md`: paste into ChatGPT Pro
- `context.zip`: upload to ChatGPT Pro (contains files + `MANIFEST.md`)

**Use cases:** debugging, code review, architecture validation, research, complex logic review.

## Output Location

Write artifacts to: `<project_root>/.agents/oracle/<feature-slug>/`

## Oracle Principles

Optimize for **correctness per token**. Apply these rules:

- Use only provided context; never invent missing facts
- Prefer falsifiable hypotheses over broad speculation
- No preambles, no prompt restatement, no giant code blocks
- If critical info is missing, state assumptions; do not ask questions

Expected downstream output structure:
1. **Answer**: 1-3 sentences
2. **Key Points**: Bullet the minimum reasoning/evidence
3. **Recommended Next Steps**: Concrete actions (commands/tests/checks)
4. **Risks / Unknowns**: Anything that could change the recommendation

## Workflow

1. Understand the task
2. Pick a role for the downstream model
3. Select a conservative file set
4. Write `prompt.md`
5. Create `context.zip`
6. Tell user what to upload/paste

---

## Instructions

### 1) Choose the downstream role

Pick one from `reference/prompt-templates.md#role-values` and encode as `{ROLE}` in prompt:

| Task Type | Role |
|-----------|------|
| Code review | staff engineer reviewing for correctness and maintainability |
| Debugging | senior engineer debugging with limited context |
| Architecture | principal engineer reviewing system design |
| Security | security engineer threat-modeling |
| Performance | performance engineer identifying bottlenecks |
| Data/SQL | database engineer reviewing correctness and performance |
| UI/UX | expert UI/UX designer reviewing visual and interaction design |

### 2) Select files (conservative)

Include the **smallest** set that gets a grounded answer:

1. **Documents**: README, relevant docs, architecture notes, conventions
2. **Feature folder**: entire folder for full local context
3. **Referenced context**: file paths, endpoints, functions, errors from conversation
4. **Related files**: what calls this, what it calls, config, types, error handling
5. **Final review**: "Would I be missing anything important?" Add only what changes decisions.

**Never include secrets** (.env, keys, credentials). Redact if truly required.

### 3) Select template and write `prompt.md`

Use templates from `reference/prompt-templates.md`:

| Template | Use when |
|----------|----------|
| Code Review | "review", "audit", "refactor", "sanity-check" |
| Debugging | errors, failing tests, crashes, unexpected behavior |
| Security Review | vulnerabilities, auth, secrets, hardening |
| Performance Audit | bottlenecks, slow, optimization, scalability |
| Architecture Review | design, structure, components, patterns |
| General | anything else (research, planning, "how should we") |

**If no template fits**, generate a custom prompt. See `reference/custom-prompt-guide.md`.

Prompt requirements:
- Assume model knows nothing beyond `context.zip`
- Tell it to **cite file paths** for concrete claims
- Prefer clear prose over jargon
- No questions; proceed with assumptions and label them

### 4) Create `context.zip`

Use the build script:

```bash
# Quick (using wrapper)
./scripts/oracle.sh \
  --out ".agents/oracle/<slug>/context.zip" \
  --task "Summary of what downstream model should do" \
  --entry "path/to/folder::Main feature folder"

# Full (direct Python)
python3 ./.agents/skills/oracle/scripts/build-context-zip.py \
  --repo-root . \
  --out ".agents/oracle/<slug>/context.zip" \
  --task "Summary" \
  --constraint "Key constraint" \
  --verify "Command to validate locally" \
  --entry "path/to/folder::Reason" \
  --entry "path/to/file.ts::Reason"
```

Options:
- `--entries-from <file>`: read entries from file (one `PATH::REASON` per line)
- `--dry-run`: print manifest without writing zip
- `--estimate-tokens`: estimate token count and warn if too large

### 5) Context Size Guidance

Use `--estimate-tokens` to check fit:

| Model | Max Tokens | Recommended |
|-------|-----------|-------------|
| GPT-4 Turbo | 128K | < 100K |
| GPT-4o | 128K | < 100K |
| Claude 3.5 | 200K | < 150K |

If too large: remove non-essential dirs, use `--exclude` for test fixtures/snapshots, focus on feature folder + direct dependencies.

### 6) Hand-off

Tell user:
- Upload `context.zip` in ChatGPT Pro
- Paste `prompt.md` contents as the message
- Verify advice by running tests / checking logs locally

---

## Custom Prompts

When no template fits, generate a custom prompt with this structure:

```markdown
### Role
You are {ROLE}.

### Context
I am uploading `context.zip` containing repository files. Treat as authoritative.

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from files
- For concrete claims, cite file paths
- Do not ask questions; state assumptions

### Task
{TASK_DESCRIPTION}

### Output format
#### {Primary Analysis}
[What to include]

#### {Evidence/Details}
[Supporting info format]

#### Verdict / Recommendation
[Clear conclusion]
```

Key principles:
- Lead with outcome, not process
- Cite file paths for claims
- Include verdict/recommendation section
- Keep output format minimal but specific

See `reference/custom-prompt-guide.md` for detailed guidance.
