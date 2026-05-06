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
npx ai-guardrails init
```

This creates or updates:
- `eslint.config.js` — flat config with recommended rules
- `tsconfig.json` — strict baseline (only if missing)
- `package.json` scripts — `lint`, `typecheck`, `build`
- Dev dependencies — installs what's missing

---

## ESLint v9 — Flat Config

### Minimal

```js
// eslint.config.js
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  aiGuardrails.flatConfigs.recommended
];
```

### With `@eslint/js` + `typescript-eslint`

```js
// eslint.config.js
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
// eslint.config.js
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
["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | `number` | `300` | Maximum effective lines per file |
| `skipBlankLines` | `boolean` | `true` | Don't count blank lines |
| `skipComments` | `boolean` | `true` | Don't count comment lines |

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

No options. This rule uses heuristic analysis to detect comments that repeat the following line of code.

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
