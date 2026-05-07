# Troubleshooting

Common issues and solutions for `eslint-plugin-ai-guardrails`.

---

## "ESLint couldn't find the plugin eslint-plugin-ai-guardrails"

The plugin is not installed in the consuming project.

**Fix**:

```bash
npm install --save-dev eslint-plugin-ai-guardrails
```

If you're developing this plugin repository itself, do **not** extend `plugin:ai-guardrails/recommended` in this repo's own `.eslintrc`. The repo uses a standard TypeScript ESLint config for local development.

---

## "Cannot find module '@typescript-eslint/parser'"

The parser is a peer dependency and must be installed separately.

**Fix**:

```bash
npm install --save-dev @typescript-eslint/parser
```

> **Note**: As of v1.0.0, the plugin lazily loads the parser. It will not crash during installation even if the parser isn't installed yet. However, linting will fail without it.

---

## Rules are not firing on my `.ts` files

**Check 1**: Verify the files match the glob pattern. The recommended config only applies to `**/*.{ts,tsx,mts,cts}`. JavaScript files are excluded by design.

**Check 2**: For ESLint v9 flat config, make sure `eslint.config.js` (not `.eslintrc`) is being used. ESLint v9 ignores `.eslintrc` files.

**Check 3**: For ESLint v8, make sure you have `"parser": "@typescript-eslint/parser"` in your config.

---

## `npx eslint-plugin-ai-guardrails init` changed my `tsconfig.json`

The initializer only **adds** safe strict baseline options when they're missing:

- `strict: true`
- `skipLibCheck: true`
- `esModuleInterop: true`
- `forceConsistentCasingInFileNames: true`

It never removes or overwrites existing settings. If you're using a framework-specific config (e.g., Next.js), the initializer will merge rather than replace.

---

## Warnings are shown but build still passes

You need `--max-warnings 0` in your lint script:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0"
  }
}
```

And gate your build on lint:

```json
{
  "scripts": {
    "build": "npm run lint && npm run typecheck && <build-step>"
  }
}
```

---

## ESLint v9 flat config: "Key 'plugins' is not an array"

You may be mixing ESLint v8 config syntax with v9 flat config. In flat config:

- ❌ `plugins: ["ai-guardrails"]` (v8 string array)
- ✅ `plugins: { "ai-guardrails": aiGuardrails }` (v9 object)

Use `aiGuardrails.flatConfigs.recommended` which handles this automatically.

---

## Peer dependency warnings during `npm install`

If you see peer dependency warnings like:

```
npm warn peer dep missing: eslint@^8.0.0, required by eslint-plugin-ai-guardrails
```

This is normal — the plugin supports both ESLint v8 and v9 via a flexible peer dependency range. As long as you have one of the supported versions installed, everything will work.

---

## TypeScript deprecation warnings in `tsconfig.json`

If you see TS6-series deprecation warnings, update your `tsconfig.json` to modern values:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext"
  }
}
```

---

## Monorepo: Plugin not found in workspace packages

In monorepos, `eslint-plugin-ai-guardrails` must be installed in each workspace that runs ESLint, not just the root.

**Fix** (npm workspaces):

```bash
npm install --save-dev eslint-plugin-ai-guardrails -w packages/my-package
```

**Fix** (pnpm):

```bash
pnpm add -D eslint-plugin-ai-guardrails --filter my-package
```

---

## ESLint is slow on large projects

The `no-ai-obvious-comments` rule does per-line heuristic analysis, which adds a small overhead. On very large files (1000+ lines), consider:

1. Raising the `max-file-lines` limit to catch excessively large files first
2. Using `eslint --cache` to avoid re-linting unchanged files
3. Using `.eslintignore` or `ignores` in flat config to exclude generated files

---

## Still having issues?

[Open an issue](https://github.com/isaacnewton123/eslint-plugin-ai-guardrails/issues) with:

1. Your ESLint version (`npx eslint --version`)
2. Your Node.js version (`node --version`)
3. Your config file
4. The error message
