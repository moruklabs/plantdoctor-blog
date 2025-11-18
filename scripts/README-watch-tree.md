# File Watcher & Tree Generator

A production-ready script that automatically generates and maintains a project structure tree for AI assistant context and developer reference.

## Features

- **Efficient File Watching**: Uses `chokidar` (not polling) for minimal resource usage
- **Gitignore Support**: Automatically respects `.gitignore` patterns - only shows tracked files
- **Smart Filtering**: Additional safety filters for critical directories (node_modules, .git, etc.)
- **Debounced Updates**: Waits 1000ms after last change before regenerating (prevents excessive updates)
- **Clear Console Output**: Shows timestamps and change types when running
- **Two Modes**: Watch mode for development, one-time generation for CI/CD
- **Self-Excluding**: Always excludes itself and the output file from the tree
- **Production-Ready**: Comprehensive error handling and graceful shutdown

## Usage

### Watch Mode (Development)

Continuously watch for file changes and auto-update the tree:

```bash
pnpm watch:tree
```

This will:

1. Generate initial `PROJECT_STRUCTURE.md`
2. Watch for file changes in relevant directories
3. Regenerate the tree when changes are detected (debounced)
4. Show console output with timestamps

Press `Ctrl+C` to stop watching.

### One-Time Generation

Generate the tree once and exit (useful for CI/CD or pre-commit hooks):

```bash
pnpm tree:generate
```

## Configuration

Edit `scripts/watch-tree.ts` to customize:

### Watch Paths

```typescript
watchPaths: [
  'app',
  'components',
  'lib',
  'content',
  'tests',
  'public',
  'scripts',
  '.github',
  '*.md',
  '*.json',
  '*.ts',
  '*.js',
  '*.mjs',
  '*.config.*',
]
```

### Ignore Patterns

The script excludes:

- `node_modules`, `.git`, `.next`, `dist`, `build`, `out`
- `.turbo`, `.swc`, `coverage`, `test-results`
- `.vscode`, `.idea`, `.cursor`, `.fleet`
- Lighthouse artifacts, Vercel deployment files
- Python cache files (`__pycache__`, `*.pyc`)
- Log files, OS files (`.DS_Store`, `Thumbs.db`)
- TypeScript build info (`*.tsbuildinfo`)
- The output file itself and the script

Add more patterns to `ignorePaths` array if needed.

### Other Options

```typescript
const CONFIG = {
  outputFile: 'PROJECT_STRUCTURE.md', // Output file name
  maxDepth: 0, // Tree depth (0 = unlimited)
  debounceMs: 1000, // Debounce delay in ms
  showHidden: true, // Show hidden files (starting with .)
}
```

## Output Format

The generated `PROJECT_STRUCTURE.md` includes:

### 1. Header

- Timestamp of last update
- Auto-generation notice

### 2. Directory Tree

```
news.plantdoctor.app/
├── app/ (45 files, 12 dirs)
│   ├── components/
│   ├── page.tsx
│   └── layout.tsx
├── components/ (89 files, 15 dirs)
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
└── package.json
```

### 3. Statistics

- Total file count
- Total directory count
- Top 10 file types by count

### 4. Footer

- Regeneration instructions

## Integration with CLAUDE.md

Reference the generated tree in your CLAUDE.md:

```markdown
## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete auto-generated directory tree.

**Note**: This file is automatically updated when files change (if `pnpm watch:tree` is running).
```

## Development Workflow

### Option 1: Manual Generation

Run `pnpm tree:generate` when you want to update documentation.

### Option 2: Watch Mode

Keep `pnpm watch:tree` running in a terminal during development:

```bash
# Terminal 1: Dev server
pnpm dev

# Terminal 2: Tree watcher
pnpm watch:tree
```

### Option 3: Pre-Commit Hook

Add to `.githooks/pre-commit` or `.husky/pre-commit`:

```bash
# Regenerate project structure
pnpm tree:generate
git add PROJECT_STRUCTURE.md
```

**Note**: The file is currently in `.gitignore` to avoid noise in commits. Remove from `.gitignore` if you want to commit the generated tree.

## Troubleshooting

### Tree includes too many files

Check the ignore patterns in `CONFIG.ignorePaths`. The pattern syntax:

- `*` matches anything except `/`
- `**` matches anything including `/`
- `?` matches a single character

Example: `**/.cache/**` matches `.cache/` at any depth.

### Watcher not detecting changes

1. Verify the path is in `watchPaths`
2. Verify the path is NOT in `ignorePaths`
3. Check console for watcher errors

### Performance issues

1. Reduce `watchPaths` to only essential directories
2. Add more patterns to `ignorePaths`
3. Increase `debounceMs` (e.g., to 2000ms)

## Dependencies

- `chokidar`: Efficient file watching
- `tsx`: TypeScript execution

Both are installed as dev dependencies.

## Technical Details

### File Watching Strategy

The script uses `chokidar` with these settings:

```typescript
{
  persistent: true,           // Keep process running
  ignoreInitial: true,        // Don't fire events for existing files
  awaitWriteFinish: {
    stabilityThreshold: 100,  // Wait 100ms for writes to finish
    pollInterval: 100,        // Check every 100ms
  },
}
```

### Event Types Watched

- `add`: File added
- `change`: File modified
- `unlink`: File deleted
- `addDir`: Directory added
- `unlinkDir`: Directory deleted

### Debouncing

All events are debounced with a single timer. The tree regenerates only after the specified delay (default 1000ms) with no new events.

### Tree Generation Algorithm

1. Recursively scan directories using `fs.readdir`
2. Filter out ignored paths using pattern matching
3. Sort: directories first, then files (both alphabetically)
4. Format using tree notation (`├──`, `│`, `└──`)
5. Add file/directory counts for non-leaf directories
6. Generate statistics (file counts, extension breakdown)

### Error Handling

- Permission errors: Logged, continue processing
- File deletion during scan: Caught, skip file
- Watcher errors: Logged, watcher continues running
- Signal handling: Graceful shutdown on `Ctrl+C`

## License

Part of the news.plantdoctor.app project.
