#!/bin/sh

repomix \
  --include "app/**/*.{ts,tsx}" \
  --include "components/**/*.{ts,tsx}" \
  --include "hooks/**/*.{ts,tsx}" \
  --include "lib/**/*.{ts,tsx}" \
  --include "scripts/**/*.{ts,js,sh}" \
  --include "posts/**/*.mdx" \
  --include "public/images/webp/tips/*" \
  --include "styles/**/*.css" \
  --include "globals.css" \
  --include "tailwind.config.ts" \
  --include "postcss.config.mjs" \
  --include "next.config.mjs" \
  --include "package.json" \
  --include "pnpm-lock.yaml" \
  --include "tsconfig.json" \
  --include "lighthouse.ci.js" \
  --include "docs/**/*.md" \
  --include "*.md" \
  --ignore "node_modules/**" \
  --ignore "out/**" \
  --ignore "__tests__/**" \
  --ignore "*.tsbuildinfo"
