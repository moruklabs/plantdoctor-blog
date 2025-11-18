#!/bin/bash
#
# Install git hooks from .githooks/ directory
#
# This script configures git to use hooks from .githooks/ instead of .git/hooks/
# This allows hooks to be version controlled and shared across the team.
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔧 Installing git hooks..."

# Check if .githooks directory exists
if [ ! -d ".githooks" ]; then
    echo -e "${YELLOW}⚠️  .githooks directory not found${NC}"
    echo "Run this script from the project root"
    exit 1
fi

# Configure git to use .githooks directory
git config core.hooksPath .githooks

echo -e "${GREEN}✅ Git hooks configured successfully${NC}"
echo ""
echo "Installed hooks:"
echo "  - pre-commit:  Validates tracking files before commit"
echo "  - commit-msg:  Validates commit message format and requirements"
echo ""
echo "To disable hooks temporarily:"
echo "  git commit --no-verify"
echo ""
echo "To uninstall hooks:"
echo "  git config --unset core.hooksPath"
echo ""
