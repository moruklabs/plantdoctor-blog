#!/usr/bin/env bash
# Sync code to all distributed testing workers

set -e

# Load distributed test config
CONFIG_FILE="distributed-test-config.yaml"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}  📦 Syncing Code to Workers${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo

# Get list of machines from config (excluding local)
MACHINES=(
  "dev@moruk:/home/dev/news.plantdoctor.app"
  "ilko2:/home/yavuz5/news.plantdoctor.app"
  "pi:/home/fatih/news.plantdoctor.app"
)

# Files and directories to exclude
EXCLUDE_OPTS=(
  --exclude=".git"
  --exclude="node_modules"
  --exclude=".next"
  --exclude="coverage"
  --exclude=".DS_Store"
  --exclude="*.log"
  --exclude=".pnpm-store"
  --exclude="playwright-report"
  --exclude="test-results"
  --exclude=".claude"
)

# Current directory
SOURCE_DIR="$(pwd)"

echo -e "${YELLOW}Source: ${SOURCE_DIR}${NC}"
echo

# Sync to each machine
for MACHINE_PATH in "${MACHINES[@]}"; do
  IFS=':' read -r HOST REMOTE_PATH <<< "$MACHINE_PATH"

  echo -e "${BLUE}[${HOST}]${NC} Syncing to ${REMOTE_PATH}..."

  # Create remote directory if it doesn't exist
  ssh "${HOST}" "mkdir -p ${REMOTE_PATH}" || {
    echo -e "${YELLOW}⚠️  Failed to create directory on ${HOST}${NC}"
    continue
  }

  # Sync code using rsync
  rsync -az --delete \
    "${EXCLUDE_OPTS[@]}" \
    --progress \
    "${SOURCE_DIR}/" \
    "${HOST}:${REMOTE_PATH}/" || {
    echo -e "${YELLOW}⚠️  Failed to sync to ${HOST}${NC}"
    continue
  }

  echo -e "${GREEN}✅ [${HOST}] Code synced successfully${NC}"
  echo
done

echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN}  ✅ Code Sync Complete${NC}"
echo -e "${BLUE}======================================================================${NC}"
