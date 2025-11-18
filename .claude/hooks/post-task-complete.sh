#!/bin/bash
# Post-task completion hook

echo "📝 Task completed - updating tracking files..."

# 1. Ensure TODO.md is updated
if [ -f "TODO.md" ]; then
    echo "✓ TODO.md exists"
    # Commit TODO.md changes
    git add TODO.md
    git diff --cached TODO.md > /dev/null && {
        git commit -m "chore: Update TODO.md after task completion"
        echo "✓ TODO.md committed"
    }
fi

# 2. Update STATUS.md last modified
if [ -f "STATUS.md" ]; then
    CURRENT_DATE=$(date -u +"%Y-%m-%d %H:%M UTC")
    sed -i '' "s/\*\*Last Updated:\*\*.*/\*\*Last Updated:\*\* $CURRENT_DATE/" STATUS.md
    git add STATUS.md
    git diff --cached STATUS.md > /dev/null && {
        git commit -m "docs: Update STATUS.md timestamp"
        echo "✓ STATUS.md updated"
    }
fi

echo "✅ Tracking files updated!"