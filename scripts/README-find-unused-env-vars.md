# Environment Variables Usage Checker

## Overview

This script analyzes `.env-sample` to identify environment variables that are defined but not used anywhere in the codebase.

## Purpose

- **Maintain clean configuration** - Remove unused variables that add confusion
- **Improve documentation** - Keep environment variable documentation accurate
- **Reduce onboarding friction** - Developers only configure what's needed
- **Security hygiene** - Fewer credentials to manage means smaller attack surface

## Usage

### Basic Analysis

```bash
# Via npm script (recommended)
pnpm env:check

# Or directly
node scripts/find-unused-env-vars.js
```

### Verbose Mode

Shows detailed usage locations for each used variable:

```bash
# Via npm script
pnpm env:check:verbose

# Or directly
node scripts/find-unused-env-vars.js --verbose
```

## Output

### Summary Section

- Total variables defined in `.env-sample`
- Count of used vs unused variables
- Percentage breakdown

### Usage Analysis

- ✓ Used variables (shows reference count)
- ✗ Unused variables (marked as UNUSED)

### Detailed Report (Verbose Mode)

- File paths where each variable is referenced
- Code snippets showing actual usage
- Limited to first 5 references per variable

## Exit Codes

- `0` - All variables are in use
- `1` - Unused variables detected (useful for CI integration)

## Detection Method

The script searches for these usage patterns:

1. `process.env.VAR_NAME` - Standard Node.js access
2. `process.env['VAR_NAME']` - Bracket notation with single quotes
3. `process.env["VAR_NAME"]` - Bracket notation with double quotes
4. `env.VAR_NAME` - Destructured or aliased access
5. `${VAR_NAME}` - Shell script variable interpolation
6. `$VAR_NAME` - Shell script variable reference

### File Coverage

Searches these file types:

- TypeScript: `.ts`, `.tsx`
- JavaScript: `.js`, `.jsx`, `.mjs`
- Shell scripts: `.sh`
- Workflows: `.yml`, `.yaml`

### Exclusions

Ignores these directories/files:

- `node_modules/`
- `.next/`
- `pnpm-lock.yaml`
- `.env-sample` itself

## CI Integration

Add to your CI workflow to prevent accumulation of unused variables:

```yaml
- name: Check for unused environment variables
  run: pnpm env:check
```

This will fail the build if unused variables are detected.

## Example Output

```
🔍 Analyzing Environment Variables
ℹ Parsing .env-sample...
✓ Found 7 environment variables

📊 Usage Analysis
✓ TELEGRAM_BOT_TOKEN                            (2 references)
✓ EMAIL_COLLECTION_ENDPOINT                     (1 reference)
✗ UNUSED_VAR                                    UNUSED

📋 Summary
  Total variables:   7
  Used variables:    6
  Unused variables:  1

🗑️  Unused Environment Variables
  • UNUSED_VAR (line 42)

These variables can likely be removed from .env-sample.
```

## Maintenance

### After Adding New Environment Variables

1. Add the variable to `.env-sample`
2. Implement the feature using the variable
3. Run `pnpm env:check` to verify it's detected as used

### Before Removing Code

1. Check if removed code used environment variables
2. Run `pnpm env:check` to identify newly unused variables
3. Remove unused variables from `.env-sample`
4. Update documentation

## Related Scripts

- `env:push` - Push local .env to remote storage
- `env:pull` - Pull .env from remote storage
- `env:sync` - Sync .env to Vercel
- `env:push:dry` - Dry run of Vercel sync

## See Also

- [UNUSED_ENV_VARS_REPORT.md](../UNUSED_ENV_VARS_REPORT.md) - Latest analysis report
- [AGENTS.md](../AGENTS.md) - Documentation on required environment variables
