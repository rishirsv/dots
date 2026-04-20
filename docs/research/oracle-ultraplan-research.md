# Oracle Ultraplan Research

Date: 2026-04-11

## Question

How does `ultraplan` work in the local `cc` codebase, what current ChatGPT web capabilities matter for an Oracle-based equivalent, and what diff would best update `skills/oracle` so it can prepare a GPT-5.x Pro web planning handoff?

## Executive Summary

`cc`'s `ultraplan` is not just "ask a stronger model for a plan." The useful parts are:

- a planning-only prompt with optional seed-plan refinement
- a curated repo-context handoff to a remote web session
- a long-running high-effort planning loop
- a deterministic plan-shaped output that can come back local

For Oracle, the best equivalent is not to recreate Claude Code's remote polling lifecycle. It is to add an explicit `ultraplan` mode that prepares:

- a planning-specific `prompt.md`
- a web-friendly `context.txt` upload artifact
- the existing `context.zip` as an optional secondary artifact for tools that accept archives

The biggest product constraint is that current OpenAI help docs do not document `.zip` as a supported ChatGPT upload type, while they do document `.txt`, `.pdf`, `.docx`, spreadsheets, and presentations. That makes a single text bundle the safest context artifact for GPT-5.x Pro on the web.

## Local Repo Findings

### What `cc` `ultraplan` actually does

1. `ultraplan` launches a remote Claude Code on the web session in `plan` permission mode, using the configured high-end model and a detached poller so the terminal stays free while planning runs. Local references:
   - `/Users/rishi/Code/ai-tools/cc-src/commands/ultraplan.tsx:23`
   - `/Users/rishi/Code/ai-tools/cc-src/commands/ultraplan.tsx:314`
   - `/Users/rishi/Code/ai-tools/cc-src/commands/ultraplan.tsx:330`

2. The initial prompt is assembled from:
   - an internal planning scaffold
   - an optional seed plan, prefixed with `Here is a draft plan to refine:`
   - the user blurb

   Local reference:
   - `/Users/rishi/Code/ai-tools/cc-src/commands/ultraplan.tsx:59`

3. The session is polled for `ExitPlanMode` approval state. The state machine explicitly distinguishes:
   - `running`
   - `needs_input`
   - `plan_ready`

   Local references:
   - `/Users/rishi/Code/ai-tools/cc-src/utils/ultraplan/ccrSession.ts:58`
   - `/Users/rishi/Code/ai-tools/cc-src/utils/ultraplan/ccrSession.ts:198`

4. The remote result has two paths:
   - `executionTarget: 'remote'`: keep executing in the web session
   - `executionTarget: 'local'`: "teleport" the approved plan back locally

   Local references:
   - `/Users/rishi/Code/ai-tools/cc-src/utils/ultraplan/ccrSession.ts:183`
   - `/Users/rishi/Code/ai-tools/cc-src/commands/ultraplan.tsx:100`

5. The plan extractor expects the approved plan in a deterministic marker:
   - `## Approved Plan:`
   - or `## Approved Plan (edited by user):`

   Local references:
   - `/Users/rishi/Code/ai-tools/cc-src/utils/ultraplan/ccrSession.ts:190`
   - `/Users/rishi/Code/ai-tools/cc-src/utils/ultraplan/ccrSession.ts:331`

6. `ultraplan` can also be triggered from natural language: if the user includes the word `ultraplan` in an interactive prompt, `cc` rewrites and routes it through `/ultraplan`.

   Local reference:
   - `/Users/rishi/Code/ai-tools/cc-src/utils/processUserInput/processUserInput.ts:455`

### What matters for Oracle

The valuable behavior to preserve is:

- planning-only framing
- seed-plan refinement when one exists
- strong repo grounding
- explicit assumptions instead of back-and-forth clarification
- a plan output that is easy to paste back into local planning docs

The parts that do **not** need to be recreated inside Oracle are the Claude-specific remote polling, approval modal wiring, and teleport sentinel plumbing.

### Local gap

I could not recover the checked-in contents of `cc-src/utils/ultraplan/prompt.txt` from this checkout. The repo shows how the prompt is consumed and what shape the downstream output must have, but not the exact hidden scaffold text. The recommendation below is therefore based on the observable launch and extraction contract, not on the internal prompt wording.

## Web Findings

All external findings below are from official OpenAI sources and were checked on 2026-04-11.

### GPT-5.4 Pro is the right ChatGPT web target

OpenAI's current ChatGPT model article says:

- GPT-5.4 Pro is "the highest-capability GPT-5.4 option in ChatGPT for the hardest tasks and long-running workflows"
- Pro is available from the model picker on Pro, Business, Enterprise, and Edu
- when GPT-5.4 Thinking or GPT-5.4 Pro starts reasoning, the user can add instructions while it is still thinking
- on ChatGPT web, Pro users get access to the thinking-time controls including `Heavy`

Source:
- [GPT-5.3 and GPT-5.4 in ChatGPT](https://help.openai.com/en/articles/11909943-gpt-52-in-chatgpt)

Relevant lines:
- model positioning: lines 18-24
- model picker and Pro availability: lines 27-45
- thinking-time controls on web: lines 117-131

### GPT-5.4 Pro has important web limitations

The same OpenAI article says:

- "Apps, Memory, Canvas, and image generation are not available with Pro."

Source:
- [GPT-5.3 and GPT-5.4 in ChatGPT](https://help.openai.com/en/articles/11909943-gpt-52-in-chatgpt)

Relevant line:
- line 35

### Projects are useful, but the docs are not fully consistent with the Pro limitation

OpenAI's Projects article says:

- for Plus and Pro users, ChatGPT can reference previous chats within a project
- when you ask a question in a project, ChatGPT prioritizes the project chats and files
- Pro users can upload up to 40 files per project

Source:
- [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)

Relevant lines:
- project focus/memory behavior: lines 268-271
- project file limits: lines 276-286

This is slightly in tension with the GPT-5.4 Pro article saying Memory is not available with Pro. My recommendation is to treat project memory as a convenience, not a dependency. The Oracle `ultraplan` bundle should keep critical context in the uploaded artifact and in the first prompt message.

### File uploads support text/document formats, not documented archive uploads

OpenAI's file upload help article documents support for common document and text formats including:

- XLSX / XLS / CSV / TSV
- DOCX / PPTX / PDF / TXT

Source:
- [What types of files are supported?](https://help.openai.com/en/articles/8983675-what-types-of-files-are-supported)

Relevant lines:
- lines 7-15

This article does **not** mention `.zip`. I am inferring from that omission that `context.zip` is not a safe primary artifact for ChatGPT web uploads.

### Large pasted prompts are handled better now

OpenAI's release notes say that for Plus, Pro, and Business users, pastes over 5k characters are automatically converted into attachments instead of staying inline in the composer.

Source:
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)

Relevant lines:
- lines 63-68

That makes a slightly longer Oracle planning prompt more tolerable on the web, but I would still keep `prompt.md` compact and structured.

## Recommendation

Add an explicit `ultraplan` mode to Oracle with these rules:

1. Keep the mode planning-only.
   - No code generation request.
   - Ask for a high-confidence implementation plan.

2. Use a dedicated planning template.
   - Require an `## Approved Plan` section.
   - Require phase outcomes and an implementation checklist so it lines up with this repo's planning expectations.

3. Generate a web-safe context artifact.
   - Keep `context.zip` for compatibility.
   - Add `context.txt` that contains the manifest plus the contents of the selected files in a single uploadable text file for ChatGPT web.

4. Make the handoff explicit.
   - Start a fresh ChatGPT web chat or fresh project chat.
   - Select `GPT-5.4 Pro` or the latest GPT-5.x Pro available.
   - Use `Heavy` thinking time if available.
   - Upload `context.txt`, not just `context.zip`.
   - Paste `prompt.md`.

5. Do not rely on project memory or other web-side persistence.
   - The important instructions should stay in the first message.
   - The important repo context should stay in `context.txt`.

## Proposed Diff

```diff
diff --git a/skills/oracle/SKILL.md b/skills/oracle/SKILL.md
index 9d5d2f1..ultraplan 100644
--- a/skills/oracle/SKILL.md
+++ b/skills/oracle/SKILL.md
@@
-Prepare an "ask an expert" bundle for ChatGPT Pro or another external model that will review real repo context.
+Prepare an external-model bundle for either:
+- a second-opinion review / diagnosis / recommendation, or
+- an `ultraplan` planning pass in ChatGPT on the web using GPT-5.x Pro.
@@
-**Produces two artifacts:**
+**Produces artifacts:**
 - `prompt.md`: paste as the message
- `context.zip`: upload alongside it (contains files plus `MANIFEST.md`)
+- `context.zip`: zipped repo slice for tools that accept archive uploads
+- `context.txt` in `ultraplan` mode: a single web-friendly text bundle containing the manifest plus selected file contents
@@
-**Good fits:** debugging, code review, architecture validation, research, prompt critique, or a careful second opinion on a risky change.
+**Good fits:** debugging, code review, architecture validation, research, prompt critique, careful second opinions on risky changes, or high-confidence implementation planning.
+
+## Bundle Modes
+
+Choose one mode before assembling artifacts:
+
+- `review` (default): package repo context for review, diagnosis, critique, or recommendation.
+- `ultraplan`: package repo context for ChatGPT on the web to study the codebase and produce a planning-only implementation plan. Use this when the user wants GPT-5.x Pro to think hard and draft the plan, not write code.
@@
 ## Workflow
 
-1. Understand the user's real question and reduce it to one clear downstream task.
+1. Understand the user's real question and choose `review` or `ultraplan`.
+2. Reduce it to one clear downstream task.
-2. Pick the downstream role.
-3. Select the smallest file set that can support a grounded answer.
-4. Choose the smallest prompt recipe that fits and add only the blocks that matter.
-5. Write `prompt.md`.
-6. Create `context.zip`.
-7. Tell the user exactly what to paste, upload, and verify locally.
+3. Pick the downstream role.
+4. Select the smallest file set that can support a grounded answer.
+5. Choose the smallest prompt recipe that fits and add only the blocks that matter.
+6. Write `prompt.md`.
+7. Create the context artifact(s).
+8. Tell the user exactly what to paste, upload, and verify locally.
 
 ## Instructions
 
+### 0) Choose the bundle mode
+
+Use `ultraplan` mode when the external model's job is to create a high-confidence implementation plan.
+
+In `ultraplan` mode:
+- planning only; do not ask the downstream model to write code
+- require a final `## Approved Plan` section so the result is easy to paste back into local planning docs
+- require phase outcomes and an implementation checklist
+- tell the downstream model to proceed with assumptions and list unknowns instead of asking routine questions
+- avoid fallback solutions unless the task explicitly requires them
+- keep the bundle self-contained; do not rely on project memory, apps, or canvas-like features being available
+
 ### 1) Choose the downstream role
@@
 | Data/SQL | a database engineer reviewing correctness and performance |
 | UI/UX | an expert UI/UX designer doing a rigorous visual and interaction review |
 | Prompting | a prompt engineer improving Codex or GPT-5.4 prompts for reliability and clarity |
+| Planning | a principal engineer creating a high-confidence implementation plan for a complex change in an unfamiliar codebase |
@@
 ### 3) Write `prompt.md`
 
-Start from the smallest template in [reference/prompt-templates.md](reference/prompt-templates.md). If none fit, assemble a custom prompt using [reference/custom-prompt-guide.md](reference/custom-prompt-guide.md).
+Start from the smallest template in [reference/prompt-templates.md](reference/prompt-templates.md). For `ultraplan` mode, start from the Ultraplan template. If none fit, assemble a custom prompt using [reference/custom-prompt-guide.md](reference/custom-prompt-guide.md).
@@
 - Assume the model knows nothing beyond `context.zip`.
- - Tell it to read `context/MANIFEST.md` first.
+- In `review` mode, tell it to read `context/MANIFEST.md` first.
+- In `ultraplan` mode, tell it to read the manifest section at the top of `context.txt` first.
 - Use XML blocks consistently so the prompt has stable internal structure.
 - Add only the blocks that matter for this task; do not dump every possible rule into every prompt.
 - Require file-path citations for concrete claims.
 - Prefer explicit output contracts over vague instructions.
 - Do not ask the downstream model to ask questions; have it proceed with assumptions and list unknowns.
+- In `ultraplan` mode, require a plan that can be used directly in this repo's plan docs: phase outcomes, implementation checklist, and validation steps.
@@
-### 4) Create `context.zip`
+### 4) Create context artifacts
@@
 REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
   --out ".agents/oracle/<slug>/context.zip" \
+  --text-out ".agents/oracle/<slug>/context.txt" \
   --task "Summary of what downstream model should do" \
   --entry "path/to/folder::Main feature folder"
@@
 REPO_ROOT="$(pwd)" python3 "$ORACLE_SKILL_DIR/scripts/build-context-zip.py" \
   --repo-root "$REPO_ROOT" \
   --out ".agents/oracle/<slug>/context.zip" \
+  --text-out ".agents/oracle/<slug>/context.txt" \
   --task "Summary" \
   --constraint "Key constraint" \
   --verify "Command to validate locally" \
   --entry "path/to/folder::Reason" \
   --entry "path/to/file.ts::Reason"
@@
 Useful options:
 - `--entries-from <file>`: read entries from a file with one `PATH::REASON` per line
 - `--dry-run`: preview the manifest without writing the zip
 - `--estimate-tokens`: estimate bundle size before hand-off
+- `--text-out <file>`: also write a single text bundle for ChatGPT web uploads
@@
 ### 6) Hand-off
 
 Tell the user:
- upload `context.zip`
- paste the contents of `prompt.md`
- treat the response as a second opinion, then verify locally with tests, logs, or manual checks
+- in `review` mode: upload `context.zip` and paste `prompt.md`
+- in `ultraplan` mode:
+  - open a fresh ChatGPT web chat or fresh project chat
+  - select `GPT-5.4 Pro` or the newest GPT-5.x Pro available
+  - if thinking-time controls are available, choose `Heavy`
+  - upload `context.txt`
+  - paste `prompt.md`
+  - treat the result as a planning draft, then verify locally before implementation
+- if using a project, still upload `context.txt` and paste the full prompt; do not assume project memory alone contains enough context

diff --git a/skills/oracle/reference/prompt-templates.md b/skills/oracle/reference/prompt-templates.md
index 88e6805..ultraplan 100644
--- a/skills/oracle/reference/prompt-templates.md
+++ b/skills/oracle/reference/prompt-templates.md
@@
 | Data/SQL | a database engineer reviewing correctness and performance |
 | UI/UX | an expert UI/UX designer doing a rigorous visual and interaction review |
 | Prompting | a prompt engineer improving Codex or GPT-5.4 prompts for reliability and clarity |
+| Planning | a principal engineer creating a high-confidence implementation plan for a complex change in an unfamiliar codebase |
+
+## Ultraplan Template
+
+```xml
+<task>
+You are {ROLE}.
+
+I am uploading `context.txt` containing a curated repository slice and manifest.
+Treat `context.txt` as authoritative.
+Start by reading the manifest section at the top of `context.txt`.
+
+Create a high-confidence implementation plan for this task.
+Do not write code.
+Do not stop for routine clarification.
+Proceed with the best reasonable assumptions and label them explicitly.
+
+Task: {TASK}
+Success criteria: {SUCCESS_CRITERIA}
+Constraints: {CONSTRAINTS}
+Draft plan to refine, if provided: {SEED_PLAN}
+
+Repository-specific preferences:
+- Prefer the smallest change that fits the existing codebase.
+- Avoid fallback solutions unless the task explicitly requires them.
+- Separate observed facts, assumptions, and recommendations.
+</task>
+
+<structured_output_contract>
+Return exactly these sections:
+1. Current understanding
+2. Assumptions and unknowns
+3. Relevant file and system touchpoints
+4. Options considered
+5. Recommended approach
+6. ## Approved Plan
+7. Validation checklist
+8. Risks and follow-ups
+
+Inside `## Approved Plan`, include:
+- phases with a short non-technical outcome for each phase
+- an implementation checklist
+- concrete validation steps
+</structured_output_contract>
+
+<default_follow_through_policy>
+Default to the most reasonable low-risk interpretation and keep going.
+Only stop to ask questions when a missing detail changes correctness or safety materially.
+</default_follow_through_policy>
+
+<completeness_contract>
+Resolve the planning task fully before stopping.
+Do not stop at the first plausible plan.
+Check for edge cases, sequencing issues, missing validations, and risky assumptions before finalizing.
+</completeness_contract>
+
+<grounding_rules>
+Ground every concrete claim in `context.txt`.
+Cite file paths for codebase claims.
+If a point is an inference, label it clearly.
+</grounding_rules>
+
+<action_safety>
+Keep the recommended plan tightly scoped to the stated task.
+Avoid unrelated refactors, renames, or cleanup unless they are required for correctness.
+Call out risky or irreversible actions explicitly.
+</action_safety>
+
+<verification_loop>
+Before finalizing, verify that the plan matches the uploaded repository slice and the requested outcome.
+If the first draft is underspecified, revise it instead of stopping early.
+</verification_loop>
+```
 
 ## Code Review Template

diff --git a/skills/oracle/scripts/build-context-zip.py b/skills/oracle/scripts/build-context-zip.py
index 5bc0d90..ultraplan 100644
--- a/skills/oracle/scripts/build-context-zip.py
+++ b/skills/oracle/scripts/build-context-zip.py
@@
-        description="Build context.zip for Oracle (ChatGPT Pro) uploads.",
+        description="Build Oracle context artifacts for external model uploads.",
@@
     parser.add_argument(
         "--out",
         required=True,
         help="Output zip path (e.g., /path/to/context.zip).",
     )
+    parser.add_argument(
+        "--text-out",
+        default="",
+        help="Optional text bundle path for ChatGPT web uploads (e.g., /path/to/context.txt).",
+    )
@@
 def render_manifest(
@@
     return "\n".join(lines)
+
+
+def _language_hint(path: Path) -> str:
+    suffix = path.suffix.lower()
+    return {
+        ".ts": "ts",
+        ".tsx": "tsx",
+        ".js": "js",
+        ".jsx": "jsx",
+        ".py": "python",
+        ".rb": "ruby",
+        ".go": "go",
+        ".rs": "rust",
+        ".java": "java",
+        ".kt": "kotlin",
+        ".swift": "swift",
+        ".sh": "bash",
+        ".zsh": "bash",
+        ".json": "json",
+        ".yml": "yaml",
+        ".yaml": "yaml",
+        ".toml": "toml",
+        ".md": "md",
+        ".sql": "sql",
+        ".html": "html",
+        ".css": "css",
+    }.get(suffix, "")
+
+
+def render_text_bundle(
+    repo_root: Path,
+    entries: list[BundleEntry],
+    *,
+    task: str = "",
+    constraints: list[str] | None = None,
+    verify: list[str] | None = None,
+    exclude_patterns: list[str] | None = None,
+    default_excludes_enabled: bool = True,
+) -> str:
+    manifest = render_manifest(
+        repo_root,
+        entries,
+        task=task,
+        constraints=constraints,
+        verify=verify,
+        exclude_patterns=exclude_patterns,
+        default_excludes_enabled=default_excludes_enabled,
+    )
+
+    lines: list[str] = []
+    lines.append("# Oracle text context bundle")
+    lines.append("")
+    lines.append("This file is intended for ChatGPT web uploads.")
+    lines.append("Treat the manifest and file contents below as the authoritative repository slice.")
+    lines.append("")
+    lines.append(manifest)
+    lines.append("")
+    lines.append("## File contents")
+    lines.append("")
+
+    for entry in entries:
+        lines.append(f"### File: {entry.rel_path.as_posix()}")
+        if entry.reason.strip():
+            lines.append(f"Reason: {entry.reason.strip()}")
+        lines.append("")
+        try:
+            text = entry.abs_path.read_text(encoding=\"utf-8\")
+        except UnicodeDecodeError:
+            lines.append("[Skipped: file is not valid UTF-8 text.]")
+            lines.append("")
+            continue
+
+        lang = _language_hint(entry.rel_path)
+        lines.append(f\"```{lang}\")
+        lines.append(text.rstrip(\"\\n\"))
+        lines.append(\"```\")
+        lines.append(\"\")
+
+    return \"\\n\".join(lines)
@@
     out_path = Path(args.out).expanduser()
+    text_out_path = Path(args.text_out).expanduser() if str(args.text_out or "").strip() else None
@@
     manifest = render_manifest(
         repo_root,
         entries,
@@
     out_path.parent.mkdir(parents=True, exist_ok=True)
@@
     size_kb = os.path.getsize(out_path) / 1024
     print(f"Wrote: {out_path} ({size_kb:.1f} KB; {len(entries)} files)", file=sys.stderr)
+
+    if text_out_path is not None:
+        text_out_path.parent.mkdir(parents=True, exist_ok=True)
+        text_bundle = render_text_bundle(
+            repo_root,
+            entries,
+            task=args.task,
+            constraints=args.constraint,
+            verify=args.verify,
+            exclude_patterns=exclude_patterns,
+            default_excludes_enabled=default_excludes_enabled,
+        )
+        text_out_path.write_text(text_bundle, encoding="utf-8")
+        print(f"Wrote: {text_out_path}", file=sys.stderr)
     return 0

diff --git a/skills/oracle/scripts/oracle.sh b/skills/oracle/scripts/oracle.sh
index 8c2d6b1..ultraplan 100755
--- a/skills/oracle/scripts/oracle.sh
+++ b/skills/oracle/scripts/oracle.sh
@@
-#   oracle.sh --out <path> --task "..." --entry "path::reason" [options]
+#   oracle.sh --out <path> [--text-out <path>] --task "..." --entry "path::reason" [options]
@@
-#   oracle.sh --estimate-tokens ...  # Estimate token count
+#   oracle.sh --estimate-tokens ...  # Estimate token count
+#   oracle.sh --text-out ...         # Also write a ChatGPT-web-friendly text bundle

diff --git a/skills/oracle/agents/openai.yaml b/skills/oracle/agents/openai.yaml
index a2ad5b6..ultraplan 100644
--- a/skills/oracle/agents/openai.yaml
+++ b/skills/oracle/agents/openai.yaml
@@
 interface:
   display_name: "Oracle"
-  short_description: "Package repo context for external expert review"
-  default_prompt: "Prepare a second-opinion bundle with prompt.md and context.zip for this repository question or review request."
+  short_description: "Package repo context for external expert review or GPT-5 web planning"
+  default_prompt: "Prepare either a second-opinion bundle or an ultraplan bundle with prompt.md and context artifacts for this repository task."
```

## Why This Diff

This proposal intentionally mirrors the useful `cc` `ultraplan` conventions without copying Claude-specific implementation details:

- `seedPlan` refinement becomes an explicit `Draft plan to refine` field in the planning template.
- the `## Approved Plan` marker is preserved because it is a proven, deterministic output contract in `cc`.
- the web handoff uses GPT-5.4 Pro plus `Heavy` thinking because that is the current OpenAI-supported high-effort web path.
- the new `context.txt` artifact avoids depending on `.zip` uploads, which are not documented as supported in current ChatGPT help docs.

## Uncertainties

1. OpenAI's help docs are slightly inconsistent about how Memory interacts with Projects for Pro users. I would not design the skill around project memory until that is clearer.
2. I did not find an official OpenAI page explicitly stating whether `.zip` uploads are rejected. My recommendation to add `context.txt` is based on the documented supported file types, which list text/document formats but not archives.
3. I could not inspect the exact hidden `cc` `ultraplan` scaffold prompt from `prompt.txt`, so the proposed planning template is a functional equivalent, not a literal port.
