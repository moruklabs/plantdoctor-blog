# Quick tracking update command

## Updates all tracking files based on current context

1. Syncs TodoWrite with TODO.md
2. Updates STATUS.md with current state
3. Adds any undocumented decisions to DECISIONS.md
4. Commits tracking files if changed

## Usage Examples:

- `/track` - Update all tracking files
- `/track task-complete` - Mark current task complete
- `/track decision` - Add architectural decision
- `/track blocker` - Document a blocker

## Ensures Protocol Compliance:

- Validates only 1 task in progress
- Enforces commit after changes
- Maintains file formats
