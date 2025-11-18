#!/usr/bin/env bash

# Script: env-push.sh
# Description: Push all environment variables from .env to Vercel production
# Usage: ./scripts/env-push.sh

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}Error: $ENV_FILE file not found${NC}"
  exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Error: Vercel CLI is not installed${NC}"
  echo "Install it with: npm i -g vercel"
  exit 1
fi

echo -e "${YELLOW}Pushing environment variables from $ENV_FILE to Vercel production...${NC}\n"

# Counter for tracking
count=0
errors=0

# Read .env file and push each variable
while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*# ]]; then
    continue
  fi
  
  # Extract key and value
  if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
    key="${BASH_REMATCH[1]}"
    value="${BASH_REMATCH[2]}"
    
    # Remove surrounding quotes from value if present
    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
    
    echo -e "${YELLOW}Pushing: $key${NC}"
    
    # Push to Vercel using stdin
    if echo "$value" | vercel env add "$key" production --force > /dev/null 2>&1; then
      echo -e "${GREEN}✓ $key${NC}"
      ((count++))
    else
      echo -e "${RED}✗ Failed to push $key${NC}"
      ((errors++))
    fi
  fi
done < "$ENV_FILE"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Summary:${NC}"
echo -e "${GREEN}  Successfully pushed: $count variables${NC}"
if [ $errors -gt 0 ]; then
  echo -e "${RED}  Failed: $errors variables${NC}"
fi
echo -e "${GREEN}========================================${NC}"

if [ $errors -gt 0 ]; then
  exit 1
fi
