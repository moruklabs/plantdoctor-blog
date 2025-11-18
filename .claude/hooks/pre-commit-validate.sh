#!/bin/bash
# Pre-commit validation hook

echo "🔍 Running pre-commit validation..."

# 1. TypeScript check
echo "📘 Checking TypeScript..."
pnpm type-check || {
    echo "❌ TypeScript errors found. Fix before committing."
    exit 1
}

# 2. Lint check
echo "🧹 Running linter..."
pnpm lint || {
    echo "❌ Lint errors found. Run 'pnpm lint --fix' to auto-fix."
    exit 1
}

# 3. Check tracking files are up to date
echo "📋 Validating tracking files..."
if [ -f "TODO.md" ]; then
    # Check if there's more than 1 task in progress
    IN_PROGRESS=$(grep -c "^\- \[ \]" TODO.md | head -5)
    if [ "$IN_PROGRESS" -gt 1 ]; then
        echo "⚠️ Warning: Multiple tasks in progress in TODO.md"
    fi
fi

# 4. Bundle size check
echo "📦 Checking bundle size..."
BUNDLE_SIZE=$(pnpm analyze --json 2>/dev/null | grep "totalSize" | head -1 | cut -d':' -f2 | tr -d ' ,')
if [ "$BUNDLE_SIZE" -gt 150000 ]; then
    echo "⚠️ Warning: Bundle size exceeds 150kB target"
fi

echo "✅ Pre-commit validation passed!"