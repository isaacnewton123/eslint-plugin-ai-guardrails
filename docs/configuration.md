# Configuration Guide

This guide covers all configuration options for `eslint-plugin-ai-guardrails`.

---

## Supported File Types

AI Guardrails only applies to TypeScript files:

- `*.ts`, `*.tsx`, `*.mts`, `*.cts`

JavaScript files are intentionally excluded — this plugin targets TypeScript-first workflows where AI tools generate the most structural debt.

---

## One-Command Setup

The fastest way to configure everything:

```bash
npx eslint-plugin-ai-guardrails init
```

This smart automation CLI will:
- Detect your framework automatically (Vite, Next.js, Elysia, NestJS, etc.)
- Completely configure your project to match the AI-Guardrails standards, replacing legacy configs where necessary
- Add strict `lint`, `typecheck`, and `build` scripts to your `package.json`
- Ensure all required dev dependencies are installed
- Auto-generate strict AI guardrail instructions for `.windsurf`, `.cursor`, `.agents`, and `.kiro`
- Provide a beautiful, interactive terminal experience to guide you through the process

---

## ESLint v9 — Flat Config

### Minimal

```js
// eslint.config.mjs
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  aiGuardrails.flatConfigs.recommended
];
```

### With `@eslint/js` + `typescript-eslint`

```js
// eslint.config.mjs
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

### CJS (CommonJS)

```js
// eslint.config.cjs
const aiGuardrails = require('eslint-plugin-ai-guardrails');

module.exports = [
  aiGuardrails.flatConfigs.recommended
];
```

---

## ESLint v8 — Legacy Config

### Using `extends`

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["ai-guardrails"],
  "extends": ["plugin:ai-guardrails/recommended"]
}
```

### Manual rule configuration

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["ai-guardrails"],
  "rules": {
    "ai-guardrails/max-file-lines": "warn",
    "ai-guardrails/max-function-lines": "warn",
    "ai-guardrails/no-orphan-todos": "error",
    "ai-guardrails/no-ai-obvious-comments": "warn"
  }
}
```

---

## Rule Options Reference

### `max-file-lines`

```json
["warn", { "max": 300, "skipBlankLines": true, "skipComments": false }]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | `number` | `300` | Maximum effective lines per file |
| `skipBlankLines` | `boolean` | `true` | Don't count blank lines |
| `skipComments` | `boolean` | `false` | Don't count comment lines |

### `max-function-lines`

```json
["warn", { "max": 50, "skipBlankLines": true, "skipComments": true, "skipSingleLine": false }]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | `number` | `50` | Maximum effective lines per function body |
| `skipBlankLines` | `boolean` | `true` | Don't count blank lines |
| `skipComments` | `boolean` | `true` | Don't count comment lines |
| `skipSingleLine` | `boolean` | `false` | Ignore single-line functions |

### `no-orphan-todos`

```json
["error", { "requireReference": true, "requireDate": false, "dateFormat": "YYYY-MM-DD" }]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requireReference` | `boolean` | `true` | Require a URL or issue reference (`#123`) |
| `requireDate` | `boolean` | `false` | Require a date in `YYYY-MM-DD` format |
| `dateFormat` | `string` | `"YYYY-MM-DD"` | Expected date format |

### `no-ai-obvious-comments`

```json
"warn"
```

No options. Strictly enforces density constraints (max 20%), horizontal limits (80 chars), and content quality to ensure professional comments.

---

## Recommended Team Configurations

### Relaxed (getting started)

```json
{
  "rules": {
    "ai-guardrails/max-file-lines": ["warn", { "max": 500 }],
    "ai-guardrails/max-function-lines": ["warn", { "max": 80 }],
    "ai-guardrails/no-orphan-todos": "warn",
    "ai-guardrails/no-ai-obvious-comments": "warn"
  }
}
```

### Strict (established teams)

```json
{
  "rules": {
    "ai-guardrails/max-file-lines": ["error", { "max": 200 }],
    "ai-guardrails/max-function-lines": ["error", { "max": 30 }],
    "ai-guardrails/no-orphan-todos": [
      "error",
      { "requireReference": true, "requireDate": true }
    ],
    "ai-guardrails/no-ai-obvious-comments": "error"
  }
}
```

---

## CI: Fail Build on Warnings

Use `--max-warnings 0` to treat warnings as errors in CI:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && <build-step>"
  }
}
```
