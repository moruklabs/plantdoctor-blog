# Start a new refactoring phase

## Steps:

1. Read STATUS.md, TODO.md, and DECISIONS.md
2. Create new branch from current: `refactor/phase-{number}-{description}`
3. Add phase tasks to TODO.md
4. Update STATUS.md to reflect new phase
5. Run validation suite: `pnpm validate`
6. Create initial ADR for phase decisions

## Usage:

Run `/phase-start 5 theme-architecture` to begin Phase 5
