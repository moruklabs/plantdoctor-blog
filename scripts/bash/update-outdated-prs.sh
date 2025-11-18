#!/usr/bin/env zsh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}Checking for outdated PRs...${NC}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it with: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Get all open PRs with their mergeable state
echo "Fetching open PRs..."
PRS=$(gh pr list --state open --json number,headRefName,baseRefName,mergeable --jq '.[] | "\(.number)|\(.headRefName)|\(.baseRefName)|\(.mergeable)"')

if [ -z "$PRS" ]; then
    echo "${YELLOW}No open PRs found${NC}"
    exit 0
fi

UPDATED_COUNT=0
SKIPPED_COUNT=0
CONFLICT_COUNT=0

# Process each PR
while IFS='|' read -r PR_NUMBER BRANCH BASE_BRANCH MERGEABLE; do
    echo ""
    echo "Checking PR #${PR_NUMBER} (${BRANCH} -> ${BASE_BRANCH})"
    
    # Check if PR is behind base branch using gh API
    COMPARISON=$(gh api "repos/{owner}/{repo}/compare/${BASE_BRANCH}...${BRANCH}" --jq '.behind_by')
    
    if [ "$COMPARISON" -gt 0 ]; then
        echo "${YELLOW}Branch is ${COMPARISON} commit(s) behind ${BASE_BRANCH}${NC}"
        
        # Check mergeable state
        if [ "$MERGEABLE" = "CONFLICTING" ]; then
            echo "${RED}✗ PR #${PR_NUMBER} has merge conflicts - skipping${NC}"
            CONFLICT_COUNT=$((CONFLICT_COUNT + 1))
            continue
        fi
        
        # Update the branch using gh CLI
        echo "Updating branch via GitHub API..."
        if gh pr update-branch "${PR_NUMBER}" 2>&1; then
            echo "${GREEN}✓ PR #${PR_NUMBER} updated successfully${NC}"
            UPDATED_COUNT=$((UPDATED_COUNT + 1))
        else
            echo "${RED}✗ Failed to update PR #${PR_NUMBER}${NC}"
            SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
        fi
    else
        echo "${GREEN}Branch is up to date${NC}"
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    fi
done <<< "$PRS"

# Summary
echo ""
echo "${GREEN}=== Summary ===${NC}"
echo "Updated: ${UPDATED_COUNT}"
echo "Skipped/Up-to-date: ${SKIPPED_COUNT}"
echo "Conflicts: ${CONFLICT_COUNT}"
