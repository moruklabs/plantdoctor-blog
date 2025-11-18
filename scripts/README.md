# Scripts Directory

This directory contains build, validation, and utility scripts for the [[REPLACE_ME_APP_NAME]] Web project, organized by platform for optimal performance.

## Architecture

The scripts are organized by platform:

```
scripts/
├── *.ts      # TypeScript wrappers that execute bash scripts
└── bash/     # Unix/Linux/macOS bash implementations
    └── *.sh # Shell scripts for Unix systems
```

### How It Works

1. **TypeScript Wrappers** (`*.ts`): Execute bash scripts directly
2. **Bash Scripts** (`bash/*.sh`): Native Unix shell scripts (fast, ~5ms startup)

## Core Scripts

## diff-main.js

A simple Git diff analysis script that shows differences between the main branch's latest commit and your current working state, including all staged and unstaged changes. Designed for AI consumption.

### Usage

```bash
# Single pnpm command
pnpm diff

# Save output to file
pnpm diff > diff-analysis.xml
```

### Output Structure

The script generates XML-formatted output with these sections:

- **`<metadata>`** - Current branch and commit hashes
- **`<complete-diff>`** - Full diff from main to current state (including unstaged)
- **`<file-status>`** - List of changed files with their Git status
- **`<summary>`** - Statistical summary from `git diff --stat`

### Example Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<git-diff-analysis>
  <metadata>
    <current-branch>feature/new-feature</current-branch>
    <main-commit>abc123...</main-commit>
    <current-commit>def456...</current-commit>
  </metadata>

  <complete-diff>
    <![CDATA[
    diff --git a/src/file.js b/src/file.js
    ...diff content...
    ]]>
  </complete-diff>

  <file-status>
    <file status="M">src/modified-file.js</file>
    <file status="A">src/new-file.js</file>
  </file-status>

  <summary>
    <![CDATA[
    2 files changed, 10 insertions(+), 5 deletions(-)
    ]]>
  </summary>
</git-diff-analysis>
```

### Requirements

- Node.js
- Git repository with main branch

## Agent Instructions

This project uses centralized agent instructions managed through symlinks:

- `GEMINI.md` → `AGENTS.md`
- `WARP.md` → `AGENTS.md`
- `CLAUDE.md` → `AGENTS.md`

**External References** (symlinks to shared resources):

- `CLI_TOOLS.md` → `/Users/fatih/workspace/CLI_TOOLS.md`
- `MCP-SERVERS.md` → `/Users/fatih/workspace/MCP-SERVERS.md`

All agent instruction files are symlinks pointing to `AGENTS.md`, which serves as the single source of truth for agent instructions. External references provide access to shared CLI tools and MCP server configurations. Edit `AGENTS.md` to update instructions for all agents.

**Important**: Always keep `AGENTS.md`, `README.md`, `RULES.md`, and `CHANGELOG.md` up to date.

**Code Quality Rule**: All code must be DRY, clean, testable, readable, and maintainable.
