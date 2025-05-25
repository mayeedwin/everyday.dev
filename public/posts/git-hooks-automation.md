# Git Hooks: Automating the Boring Stuff

Setting up pre-commit hooks that actually help instead of annoying your team.

## The Problem

- Forgetting to run linters
- Committing broken tests
- Inconsistent code formatting
- Console.log statements in production

## The Solution: Smart Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint || exit 1

# Run tests
npm run test || exit 1

# Format code
npm run format

# Add formatted files
git add .
```

## Pro Tips

1. **Keep them fast** - Under 30 seconds or developers will skip
2. **Make them optional** - `git commit --no-verify` for emergencies
3. **Use tools** - Husky makes this setup trivial

Good hooks feel invisible but save you from embarrassing commits.