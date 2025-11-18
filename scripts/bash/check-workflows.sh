#!/bin/bash

cd "$(dirname "$0")/.."
pnpm _chmod

echo "🔍 Validating GitHub workflow syntax..."
actionlint .github/workflows/*.yml
echo "✅ GitHub workflow validation completed"
