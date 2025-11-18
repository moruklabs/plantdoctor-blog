#!/usr/bin/env bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Checking package manager...${NC}"

# Check for package-lock.json
if [ -f "package-lock.json" ]; then
  echo -e "${RED}❌ Error: package-lock.json found!${NC}"
  echo -e "${YELLOW}This is a pnpm project. Please remove package-lock.json and use pnpm.${NC}"
  echo -e "${YELLOW}Run: rm package-lock.json && pnpm install${NC}"
  exit 1
fi

# Check for yarn.lock
if [ -f "yarn.lock" ]; then
  echo -e "${RED}❌ Error: yarn.lock found!${NC}"
  echo -e "${YELLOW}This is a pnpm project. Please remove yarn.lock and use pnpm.${NC}"
  echo -e "${YELLOW}Run: rm yarn.lock && pnpm install${NC}"
  exit 1
fi

# Check that pnpm-lock.yaml exists
if [ ! -f "pnpm-lock.yaml" ]; then
  echo -e "${YELLOW}⚠️  Warning: pnpm-lock.yaml not found. Run 'pnpm install' to generate it.${NC}"
fi

echo -e "${GREEN}✅ Package manager check passed!${NC}"
