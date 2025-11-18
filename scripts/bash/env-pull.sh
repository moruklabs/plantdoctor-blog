#!/usr/bin/env bash

# Script: env-pull.sh
# Description: Pull environment variables from Vercel production to a local file
# Usage: ./scripts/env-pull.sh [output-file]
# Default output file: .env.vercel

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default output file
OUTPUT_FILE="${1:-.env.vercel}"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Error: Vercel CLI is not installed${NC}"
  echo "Install it with: npm i -g vercel"
  exit 1
fi

echo -e "${YELLOW}Pulling environment variables from Vercel production...${NC}\n"

# Pull environment variables from Vercel
if vercel env pull "$OUTPUT_FILE" --environment=production --yes; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}✓ Successfully pulled environment variables${NC}"
  echo -e "${GREEN}  Output file: $OUTPUT_FILE${NC}"
  echo -e "${GREEN}========================================${NC}"
  
  # Count variables in the file
  var_count=$(grep -c "^[^#].*=" "$OUTPUT_FILE" 2>/dev/null || echo 0)
  echo -e "${GREEN}Total variables: $var_count${NC}"
else
  echo -e "${RED}Error: Failed to pull environment variables from Vercel${NC}"
  exit 1
fi
