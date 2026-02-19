---
name: git-worktrees
description: "Manage Git worktrees for parallel Claude Code development. Use this skill when engineers ask to \"create a worktree\", \"run parallel Claude sessions\", \"work on multiple features simultaneously\", or need help with worktree management."
---

# Git Worktrees for Parallel Claude Sessions

Run 2-3 Claude sessions simultaneously on different features. Each session gets its own isolated folder.

## Rules (MUST follow)

1. **Location**: ALWAYS create worktrees in `<repo-root>/.worktrees/<feature-name>/`
   - Get repo root: `git rev-parse --show-toplevel`
   - NEVER create worktrees directly in the repo root
   - ALWAYS create `.worktrees/` directory first: `mkdir -p "$(git rev-parse --show-toplevel)/.worktrees"`

2. **Branch naming**: Use format `{repo-name}/{feature-name}`
   - Example: `capital/mobile-nav`, `api/auth-refactor`

3. **Creating a worktree manually** (if not using scripts):
   ```bash
   REPO_ROOT=$(git rev-parse --show-toplevel)
   REPO_NAME=$(basename "$REPO_ROOT")
   FEATURE="my-feature"
   mkdir -p "$REPO_ROOT/.worktrees"
   git worktree add -b "$REPO_NAME/$FEATURE" "$REPO_ROOT/.worktrees/$FEATURE" main
   ```

4. **Prefer scripts**: When possible, use the provided scripts in `.agents/skills/git-worktrees/scripts/`

---

## Quick Start

### Create a Worktree
```bash
./.agents/skills/git-worktrees/scripts/create_worktree.sh
```

You'll be prompted for:
- Feature name (e.g., `mobile-nav`)
- Base branch (default: `main`)

Creates: `<repo-root>/.worktrees/mobile-nav/` with branch `{repo-name}/mobile-nav`

### Check Status
```bash
./.agents/skills/git-worktrees/scripts/list_worktrees.sh
```

Shows all active sessions with numbers:
```
[1] capital/mobile-nav    - 3 uncommitted changes
[2] capital/api-refactor  - clean
```

### Clean Up
```bash
./.agents/skills/git-worktrees/scripts/cleanup_worktrees.sh
```

### Sync with Main
```bash
./.agents/skills/git-worktrees/scripts/sync_worktree.sh
```

---

## Typical Workflow

```
1. CREATE   →  ./scripts/create_worktree.sh
                 Feature name: mobile-nav
                 Open in Cursor? y

2. WORK     →  In Cursor: /init, then give Claude the task

3. CHECK    →  ./scripts/list_worktrees.sh (anytime)

4. MERGE    →  git merge {repo-name}/mobile-nav

5. CLEANUP  →  ./scripts/cleanup_worktrees.sh
```

---

## Folder Structure

```
<repo-root>/                    ← Main repo (main branch)
├── .worktrees/                 ← All worktrees here (REQUIRED location)
│   ├── mobile-nav/             ← Session 1
│   └── api-refactor/           ← Session 2
├── src/
└── ...
```

---

## Branch Naming

Format: `{repo-name}/{feature-name}`

Examples:
- `capital/mobile-nav`
- `myapp/api-refactor`
- `backend/hotfix-bug`

---

## Tips

1. **Run /init** in each new Cursor window
2. **3 sessions max** for best performance
3. **Sync weekly** with main on long-running features
4. **Cleanup weekly** to remove merged worktrees

---

## Script Locations

```
./.agents/skills/git-worktrees/scripts/create_worktree.sh
./.agents/skills/git-worktrees/scripts/list_worktrees.sh
./.agents/skills/git-worktrees/scripts/cleanup_worktrees.sh
./.agents/skills/git-worktrees/scripts/sync_worktree.sh
```
