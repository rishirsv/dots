#!/bin/bash

# Git Worktree Creator for Claude Code
# Makes creating worktrees super simple with interactive prompts

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
BASE_BRANCH="main"
CUSTOM_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --base)
            BASE_BRANCH="$2"
            shift 2
            ;;
        --dir)
            CUSTOM_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --base <branch>    Base branch to branch from (default: main)"
            echo "  --dir <path>       Custom directory for worktree"
            echo "  -h, --help         Show this help"
            echo ""
            echo "Example:"
            echo "  $0"
            echo "  $0 --base develop"
            echo "  $0 --dir ~/worktrees/my-feature"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h for help"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Git Worktree Creator for Claude Code        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: Not in a git repository${NC}"
    echo "  Please run this script from within a git repository."
    exit 1
fi

# Get repository info
REPO_ROOT=$(git rev-parse --show-toplevel)
REPO_NAME=$(basename "$REPO_ROOT")
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${GREEN}✓${NC} Found git repository: ${CYAN}$REPO_NAME${NC}"
echo -e "${GREEN}✓${NC} Current branch: ${CYAN}$CURRENT_BRANCH${NC}"
echo ""

# Prompt for feature name
echo -e "${YELLOW}What are you building?${NC}"
echo -e "  Enter a feature name (e.g., new-feature, refactor-auth, hotfix-bug)"
echo -e "  ${CYAN}Branch will be created as: ${REPO_NAME}/<your-feature-name>${NC}"
echo ""
read -p "Feature name: " FEATURE_NAME

# Validate feature name
if [ -z "$FEATURE_NAME" ]; then
    echo -e "${RED}✗ Feature name cannot be empty${NC}"
    exit 1
fi

# Sanitize feature name (replace spaces with hyphens, lowercase)
FEATURE_NAME=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

if [ -z "$FEATURE_NAME" ]; then
    echo -e "${RED}✗ Invalid feature name${NC}"
    echo "  Use only letters, numbers, and hyphens"
    exit 1
fi

# Create branch name with project prefix: {project}/{feature}
BRANCH_NAME="${REPO_NAME}/${FEATURE_NAME}"

echo -e "${GREEN}✓${NC} Using branch name: ${CYAN}$BRANCH_NAME${NC}"
echo ""

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo -e "${YELLOW}⚠${NC}  Branch ${CYAN}$BRANCH_NAME${NC} already exists"
    echo ""
    read -p "Use existing branch? (y/n): " USE_EXISTING
    if [[ ! "$USE_EXISTING" =~ ^[Yy]$ ]]; then
        echo -e "${RED}✗ Cancelled${NC}"
        exit 1
    fi
    CREATE_BRANCH=false
else
    # Prompt for base branch
    echo -e "${YELLOW}Base branch${NC} (press Enter for default: $BASE_BRANCH)"
    read -p "Base branch: " CUSTOM_BASE
    if [ -n "$CUSTOM_BASE" ]; then
        BASE_BRANCH="$CUSTOM_BASE"
    fi

    # Verify base branch exists
    if ! git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
        echo -e "${RED}✗ Base branch '$BASE_BRANCH' does not exist${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓${NC} Will create branch from: ${CYAN}$BASE_BRANCH${NC}"
    CREATE_BRANCH=true
fi
echo ""

# Determine worktree directory
if [ -n "$CUSTOM_DIR" ]; then
    WORKTREE_DIR="$CUSTOM_DIR"
else
    # Default: create in .worktrees/ subfolder inside repo
    WORKTREE_DIR="$REPO_ROOT/.worktrees/${FEATURE_NAME}"

    # Ensure .worktrees directory exists
    mkdir -p "$REPO_ROOT/.worktrees"
fi

# Check if directory already exists
if [ -d "$WORKTREE_DIR" ]; then
    echo -e "${RED}✗ Directory already exists: $WORKTREE_DIR${NC}"
    echo "  Please remove it first or use --dir to specify a different location"
    exit 1
fi

echo -e "${BLUE}Creating worktree...${NC}"
echo ""
echo -e "  ${CYAN}Branch:${NC}    $BRANCH_NAME"
echo -e "  ${CYAN}Location:${NC}  $WORKTREE_DIR"
echo ""

# Create the worktree
if [ "$CREATE_BRANCH" = true ]; then
    echo -e "${CYAN}→${NC} Creating branch from $BASE_BRANCH..."
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_DIR" "$BASE_BRANCH"
else
    echo -e "${CYAN}→${NC} Using existing branch $BRANCH_NAME..."
    git worktree add "$WORKTREE_DIR" "$BRANCH_NAME"
fi

echo ""
echo -e "${CYAN}→${NC} Copying environment files (if present)..."

# Env files to copy from repo root into the new worktree
ENV_FILES=(
    ".env"
    ".env.local"
    ".env.development"
    ".env.development.local"
    ".env.production"
    ".env.production.local"
    ".env.test"
    ".env.test.local"
)

for env_file in "${ENV_FILES[@]}"; do
    src_file="$REPO_ROOT/$env_file"
    dest_file="$WORKTREE_DIR/$env_file"
    if [ -f "$src_file" ]; then
        if [ -f "$dest_file" ]; then
            echo -e "  ${YELLOW}↷${NC} Skipping existing: $env_file"
        else
            cp "$src_file" "$dest_file"
            echo -e "  ${GREEN}✓${NC} Copied: $env_file"
        fi
    fi
done

echo ""
echo -e "${GREEN}✓ Worktree created successfully!${NC}"
echo ""

# Success message with instructions
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Next Steps                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}1. Open in Cursor:${NC}"
echo -e "   ${YELLOW}cursor $WORKTREE_DIR${NC}"
echo ""
echo -e "${CYAN}2. In Claude Code, run /init to orient Claude:${NC}"
echo -e "   ${YELLOW}/init${NC}"
echo ""
echo -e "${CYAN}3. Give Claude your task:${NC}"
echo -e "   ${YELLOW}\"Build the $FEATURE_NAME feature\"${NC}"
echo ""
echo -e "${CYAN}4. When done, merge back to main:${NC}"
echo -e "   ${YELLOW}cd $REPO_ROOT${NC}"
echo -e "   ${YELLOW}git checkout main${NC}"
echo -e "   ${YELLOW}git merge $BRANCH_NAME${NC}"
echo ""
echo -e "${CYAN}5. Clean up the worktree:${NC}"
echo -e "   ${YELLOW}scripts/cleanup_worktrees.sh${NC}"
echo ""

# Offer to open in editor
echo ""
read -p "Open in Cursor now? (y/n): " OPEN_NOW
if [[ "$OPEN_NOW" =~ ^[Yy]$ ]]; then
    if command -v cursor &> /dev/null; then
        echo -e "${CYAN}→${NC} Opening in Cursor..."
        cursor "$WORKTREE_DIR"
        echo -e "${GREEN}✓${NC} Cursor opened!"
        echo ""
        echo -e "${YELLOW}Remember to run /init when Claude Code loads!${NC}"
    else
        echo -e "${YELLOW}⚠${NC}  Cursor command not found"
        echo "  Please open manually: $WORKTREE_DIR"
    fi
fi

echo ""
echo -e "${GREEN}✓ Done!${NC}"
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "Worktree:  ${CYAN}$WORKTREE_DIR${NC}"
echo -e "Branch:    ${CYAN}$BRANCH_NAME${NC}"
echo -e "Status:    ${GREEN}Ready for Claude Code${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
