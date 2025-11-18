#!/bin/sh
cd "$(dirname "$0")/../.."
pnpm _chmod
# Run type-check and tests concurrently with fail-fast
npx concurrently \
  --kill-others-on-fail \
  --prefix-colors "cyan,magenta" \
  --prefix "[{name}]" \
  --names "lint,typecheck,test" \
  "pnpm build" \
  "pnpm lint" \
  "pnpm type-check" \
  "pnpm test";

echo "✅ Pre-commit validation completed successfully!"
