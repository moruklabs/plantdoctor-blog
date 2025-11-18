#!/bin/bash

# prepare-machine.sh
# One-time setup script to prepare a remote machine for distributed testing
# Usage: ./scripts/prepare-machine.sh <remote-user@hostname> <remote-path>
# Example: ./scripts/prepare-machine.sh dev@moruk /home/user/news.plantdoctor.app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get arguments
REMOTE_HOST="${1:-dev@moruk}"
REMOTE_PATH="${2:-/home/user/news.plantdoctor.app}"

echo -e "${YELLOW}🔧 Preparing remote machine for distributed testing${NC}"
echo "Remote host: $REMOTE_HOST"
echo "Remote path: $REMOTE_PATH"
echo ""

# Step 1: Test SSH connectivity
echo -e "${YELLOW}1️⃣  Testing SSH connectivity...${NC}"
if ! ssh -q "$REMOTE_HOST" exit; then
  echo -e "${RED}❌ Cannot connect to $REMOTE_HOST${NC}"
  echo "Make sure:"
  echo "  - The machine is reachable via Tailscale"
  echo "  - SSH keys are configured"
  echo "  - The hostname/username is correct: $REMOTE_HOST"
  exit 1
fi
echo -e "${GREEN}✅ SSH connection successful${NC}"
echo ""

# Step 2: Sync repository files
echo -e "${YELLOW}2️⃣  Syncing repository files...${NC}"
LOCAL_PATH="/Users/fatih/workspace/news.plantdoctor.app"

# Create remote directory
ssh "$REMOTE_HOST" "bash -i -c 'mkdir -p \"$REMOTE_PATH\"'"

# Sync files using rsync (excludes node_modules, .next, etc.)
echo "  📁 Syncing files from local to remote..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'playwright-report' \
  --exclude 'test-results' \
  --exclude '.env.local' \
  "$LOCAL_PATH/" "$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${GREEN}✅ Files synced${NC}"
echo ""

# Step 3: Install Node.js dependencies
echo -e "${YELLOW}3️⃣  Installing Node.js dependencies...${NC}"
ssh "$REMOTE_HOST" "bash -i -c 'set -e; \
  cd \"$REMOTE_PATH\"; \
  echo \"  📦 Running pnpm install...\"; \
  pnpm install'"
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Install Playwright browsers
echo -e "${YELLOW}4️⃣  Installing Playwright browsers...${NC}"
ssh "$REMOTE_HOST" "bash -i -c 'set -e; \
  cd \"$REMOTE_PATH\"; \
  echo \"  🌐 Installing Playwright chromium browser...\"; \
  npx playwright install chromium'"
echo -e "${GREEN}✅ Playwright browsers installed${NC}"
echo ""

# Step 5: Verify setup
echo -e "${YELLOW}5️⃣  Verifying setup...${NC}"
ssh "$REMOTE_HOST" "bash -i -c 'set -e; \
  cd \"$REMOTE_PATH\"; \
  echo \"  📋 Node.js version:\"; \
  node --version; \
  echo \"  📋 pnpm version:\"; \
  pnpm --version; \
  echo \"  📋 Playwright version:\"; \
  npx playwright --version'"
echo -e "${GREEN}✅ Setup verified${NC}"
echo ""

echo -e "${GREEN}🎉 Remote machine prepared successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run distributed tests: node scripts/distribute-tests.js"
echo "  2. Once validated, prepare the other machines"
echo "  3. Scale to 4-way distribution"
