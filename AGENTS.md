# Agent Instructions

## Workflow

Commit when a task is completed.

## Pre-commit

```bash
npx tsc --noEmit
npx prettier --write src/index.ts package.json
```

## Commit Style

Match existing commits:
- `Add pi-package manifest to package.json`
- `Update README with GitHub installation instructions`
- `Format code with Prettier`

## Documentation

Use proper formatting when writing documentation, but do not go overboard with the formatting. The content should speak for itself.
