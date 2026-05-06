# Versioning and Release Guide

This project uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

## Versioning Policy

| Change Type | Version Bump | Examples |
|------------|-------------|---------|
| **PATCH** | `x.x.+1` | Bug fixes, docs-only fixes, non-breaking behavior adjustments |
| **MINOR** | `x.+1.0` | New rules, new options, backward-compatible enhancements |
| **MAJOR** | `+1.0.0` | Breaking changes to rule behavior, defaults, or public exports |

## Release Checklist

1. **Ensure clean working tree**

```bash
git status  # should be clean
```

2. **Update `CHANGELOG.md`**
   - Move items from `[Unreleased]` to a new version section
   - Add release date in `YYYY-MM-DD` format

3. **Run full quality checks**

```bash
npm run clean
npm run build
npm test
npm pack --dry-run    # verify package contents
```

4. **Bump version**

```bash
npm version patch   # for bug fixes
npm version minor   # for new features
npm version major   # for breaking changes
```

5. **Push tags and commits**

```bash
git push --follow-tags
```

6. **Publish to npm**

```bash
npm publish
```

7. **Create GitHub release**
   - Go to [Releases](https://github.com/isaacnewton123/eslint-plugin-ai-guardrails/releases)
   - Create a release from the new tag
   - Copy the relevant `CHANGELOG.md` section as release notes

## Pre-publish Verification

Before every publish, verify the package contents:

```bash
npm pack --dry-run
```

Expected output should include:
- `dist/index.js` and `dist/index.d.ts`
- `dist/rules/*.js` and `dist/rules/*.d.ts`
- `dist/configs/*.js` and `dist/configs/*.d.ts`
- `dist/cli.js`
- `docs/**/*.md`
- `README.md` and `LICENSE`

It should **not** include:
- `src/` (TypeScript source)
- `tests/`
- `node_modules/`
- `.stress-tests/`
