# Integrations

> **🚀 Quick Setup**: For most projects, run `npx eslint-plugin-ai-guardrails init` to automatically detect your framework and configure your project to match the AI-Guardrails standards. It's well optimized, without having to make any code changes.

---

## ⭐ Vite + React + TypeScript

Use `vite-plugin-checker` to surface ESLint violations in both the terminal and browser overlay during development.

**ESLint config** (`eslint.config.mjs`):

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
];
```

**Vite config** (`vite.config.ts`):

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}" --max-warnings 0'
      }
    })
  ]
});
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && vite build"
  }
}
```

---

## ⭐ Next.js + TypeScript

Next.js 13+ supports ESLint v9 flat config natively.

**ESLint config** (`eslint.config.mjs`):

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  { ignores: ['.next', 'out', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
];
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && next build"
  }
}
```

---

## NestJS + TypeScript

NestJS projects typically have a `src/` directory with decorators and dependency injection patterns. AI assistants tend to generate oversized service files and controllers — guardrails help keep them modular.

**ESLint config** (`eslint.config.mjs`):

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      'ai-guardrails/max-file-lines': ['warn', { max: 250 }],
      'ai-guardrails/max-function-lines': ['warn', { max: 40 }]
    }
  }
];
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.ts\" --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && nest build"
  }
}
```

---

## Express + TypeScript

Express projects using ESLint v8 can use the legacy `.eslintrc` config.

**ESLint config** (`.eslintrc.json`):

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["ai-guardrails"],
  "extends": ["plugin:ai-guardrails/recommended"],
  "rules": {
    "ai-guardrails/max-file-lines": ["warn", { "max": 300 }],
    "ai-guardrails/max-function-lines": ["warn", { "max": 50 }],
    "ai-guardrails/no-orphan-todos": "error",
    "ai-guardrails/no-ai-obvious-comments": "warn"
  }
}
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && tsc"
  }
}
```

> **Migrating to ESLint v9?** Replace `.eslintrc.json` with an `eslint.config.mjs` that uses `aiGuardrails.flatConfigs.recommended` (see Vite or NestJS examples above).

---

## ⭐ Elysia / Hono / Bun + TypeScript

Bun-based backends (Elysia, Hono) work with ESLint v9 flat config.

**ESLint config** (`eslint.config.mjs`):

```js
import aiGuardrails from 'eslint-plugin-ai-guardrails';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'node_modules'] },
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
];
```

**package.json**:

```json
{
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "bun run --watch src/index.ts",
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "bun run lint && bun run typecheck"
  }
}
```

---

## SvelteKit + TypeScript

SvelteKit projects using ESLint v9 flat config:

**ESLint config** (`eslint.config.mjs`):

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  { ignores: ['.svelte-kit', 'build', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
];
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "typecheck": "svelte-check --tsconfig ./tsconfig.json",
    "build": "npm run lint && npm run typecheck && vite build"
  }
}
```

> **Note**: `ai-guardrails` rules only apply to `.ts` and `.tsx` files. Svelte component files (`.svelte`) are not linted by this plugin.

---

## Monorepo (Turborepo / pnpm / npm workspaces)

For monorepos, install `eslint-plugin-ai-guardrails` in each workspace package that runs ESLint.

### Setup per workspace

Run inside each package:

```bash
npx eslint-plugin-ai-guardrails init
```

### Example structure

```
repo/
  package.json          (workspaces)
  turbo.json            (optional)
  apps/
    web/                (Vite/Next)
      eslint.config.mjs
      package.json
    api/                (Nest/Express)
      eslint.config.mjs
      package.json
  packages/
    shared/             (shared library)
      eslint.config.mjs
      package.json
```

### Root scripts

```json
{
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "build": "turbo run build"
  }
}
```

Or without Turborepo:

```json
{
  "scripts": {
    "lint": "npm -ws run lint",
    "typecheck": "npm -ws run typecheck",
    "build": "npm -ws run build"
  }
}
```

---

## CI Integration

### GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

### GitLab CI

```yaml
lint:
  image: node:22
  script:
    - npm ci
    - npm run lint
    - npm run typecheck
    - npm test
```

### Pre-commit Hook (with Husky + lint-staged)

```json
{
  "lint-staged": {
    "*.{ts,tsx,mts,cts}": "eslint --max-warnings 0"
  }
}
```
