
# eslint-plugin-ai-guardrails

<p align="center">
  <img src="https://raw.githubusercontent.com/isaacnewton123/ai-guardrails/refs/heads/main/public/og-image.webp" alt="AI Guardrails Logo" width="200" />
</p>

#

[![npm version](https://img.shields.io/npm/v/eslint-plugin-ai-guardrails)](https://www.npmjs.com/package/eslint-plugin-ai-guardrails)
[![CI](https://img.shields.io/github/actions/workflow/status/isaacnewton123/eslint-plugin-ai-guardrails/ci.yml?branch=main&label=CI&logo=github)](https://github.com/isaacnewton123/eslint-plugin-ai-guardrails/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/eslint-plugin-ai-guardrails)](./LICENSE)
[![typescript](https://img.shields.io/badge/built%20with-TypeScript-3178C6)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/ESLint-v8%20%26%20v9-4B32C3)](https://eslint.org/)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933)](https://nodejs.org/)
[![website](https://img.shields.io/badge/website-eslint--ai--guardrails.vercel.app-blue)](https://eslint-ai-guardrails.vercel.app/)
[![Sponsor](https://img.shields.io/badge/sponsor-isaacnewton123-ea4aaa?logo=githubsponsors)](https://github.com/sponsors/isaacnewton123)

**ESLint guardrails for AI-assisted codebases.**

🌐 **Website & Docs:** [https://eslint-ai-guardrails.vercel.app](https://eslint-ai-guardrails.vercel.app/)

Stop AI-generated code from becoming long-term tech debt. `eslint-plugin-ai-guardrails` enforces structure-first linting rules that catch the patterns AI coding tools get wrong most often.

---

## Why AI Guardrails?

AI coding assistants (Copilot, Cursor, ChatGPT, Claude, etc.) are incredibly productive — but they introduce predictable quality drift:

| Problem | What AI Does | What Guardrails Catches |
|---------|-------------|------------------------|
| **God files** | Keeps appending to one file instead of splitting | `max-file-lines` warns when a file exceeds 300 lines |
| **God functions** | Generates monolithic functions with everything inlined | `max-function-lines` warns when a function exceeds 50 lines |
| **Orphan TODOs** | Leaves `TODO` / `FIXME` / `HACK` with no tracking | `no-orphan-todos` errors without a link or deadline |
| **Redundant comments** | Adds massive blocks of unnecessary explanations | `no-ai-obvious-comments` enforces max density (20%), length, and quality |

These aren't style nitpicks — they're the exact patterns that turn a productive AI-assisted sprint into months of refactoring.

---

## Compatibility

| Requirement | Supported Versions |
|------------|-------------------|
| **Node.js** | `>=18.0.0` |
| **ESLint** | `v8.x` · `v9.x` |
| **TypeScript** | `>=5.0.0` |
| **@typescript-eslint/parser** | `v6.x` · `v7.x` · `v8.x` |

> **TypeScript-only** — this plugin applies to `.ts`, `.tsx`, `.mts`, and `.cts` files. If your project isn't using TypeScript, this plugin is not the right fit.

### Tested With

This plugin is integration-tested against these framework configurations:

- ✅ **Vite + React + TypeScript** (ESLint v9 flat config)
- ✅ **Next.js** (ESLint v9 flat config with `@eslint/js` + `typescript-eslint`)
- ✅ **SvelteKit** (ESLint v9 flat config with `eslint-plugin-svelte` + `svelte-check`)
- ✅ **NestJS** (ESLint v9 flat config with strict overrides)
- ✅ **Express + TypeScript** (ESLint v8 legacy `.eslintrc`)
- ✅ **ESM projects** (`"type": "module"` with `eslint.config.mjs`)
- ✅ **CJS projects** (`require()` with `eslint.config.cjs`)
- ✅ **Monorepo workspaces** (npm / pnpm / yarn workspaces)

### Support Matrix

| Framework | Status | CLI `init` Support |
|-----------|--------|-------------------|
| **Elysia** | Native | Full |
| **Next.js** | Native | Full |
| **Vite** | Native | Full |
| **NestJS** | Basic | Partial (In Progress) |
| **Express** | Basic | Partial (In Progress) |
| **SvelteKit** | Native | Full |

---

## Installation

```bash
# npm
npm install --save-dev eslint-plugin-ai-guardrails @typescript-eslint/parser

# pnpm
pnpm add -D eslint-plugin-ai-guardrails @typescript-eslint/parser

# yarn
yarn add -D eslint-plugin-ai-guardrails @typescript-eslint/parser

# bun
bun add -d eslint-plugin-ai-guardrails @typescript-eslint/parser
```

---

## 🚀 Quick Setup

### One-command setup (recommended)

```bash
npx eslint-plugin-ai-guardrails init
```

This smart automation CLI will:

1. Detect your framework (Vite, Next.js, Elysia, NestJS, etc.) automatically.
2. Completely configure your project to match the AI-Guardrails standards, replacing legacy configs where necessary.
3. Add strict `lint`, `typecheck`, and `build` scripts to your `package.json`.
4. Ensure all required dev dependencies are installed.
5. Auto-generate strict AI guardrail instructions for `.windsurf`, `.cursor`, `.agents`, and `.kiro`.
6. Provide a beautiful, interactive terminal experience to guide you through the process.

### ESLint v9 — Flat Config (recommended)

```js
// eslint.config.mjs
import aiGuardrails from 'eslint-plugin-ai-guardrails';

export default [
  aiGuardrails.flatConfigs.recommended
];
```

### ESLint v8 — Legacy Config

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["ai-guardrails"],
  "extends": ["plugin:ai-guardrails/recommended"]
}
```

---

## Rules

| Rule | Default | Type | Description |
|------|---------|------|-------------|
| [`max-file-lines`](docs/rules/max-file-lines.md) | `warn` | suggestion | Prevent files from exceeding 300 lines |
| [`max-function-lines`](docs/rules/max-function-lines.md) | `warn` | suggestion | Prevent functions/methods from exceeding 50 lines |
| [`no-orphan-todos`](docs/rules/no-orphan-todos.md) | `error` | problem | Require `TODO`/`FIXME`/`HACK` to include a tracking reference |
| [`no-ai-obvious-comments`](docs/rules/no-ai-obvious-comments.md) | `warn` | suggestion | Enforce strict comment density, length, and quality constraints |

### Custom Configuration

```json
{
  "rules": {
    "ai-guardrails/max-file-lines": ["warn", { "max": 250 }],
    "ai-guardrails/max-function-lines": ["warn", { "max": 40 }],
    "ai-guardrails/no-orphan-todos": [
      "error",
      { "requireReference": true, "requireDate": true }
    ],
    "ai-guardrails/no-ai-obvious-comments": "warn"
  }
}
```

---

## CI / Build Enforcement

Fail the build on any lint warning or error:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "build": "npm run lint && npm run typecheck && <your-build-step>"
  }
}
```

This guarantees:
- Any ESLint warning or error fails the pipeline
- Any TypeScript error fails the pipeline

---

## Integrations

Ready-to-copy setup guides for popular frameworks:

- [Vite + React](docs/integrations.md#vite--react--typescript)
- [Next.js](docs/integrations.md#nextjs--typescript)
- [NestJS](docs/integrations.md#nestjs--typescript)
- [Express](docs/integrations.md#express--typescript)
- [Elysia / Hono](docs/integrations.md#elysia--hono--bun--typescript)
- [SvelteKit](docs/integrations.md#sveltekit--typescript)
- [Monorepos](docs/integrations.md#monorepo-turborepo--pnpm--npm-workspaces)

See also:
- [Configuration Guide](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)

---

## Development

```bash
git clone https://github.com/isaacnewton123/eslint-plugin-ai-guardrails.git
cd eslint-plugin-ai-guardrails
npm install
npm run lint
npm run build
npm test
```

See:
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
- [Versioning & Release](docs/versioning-and-release.md)
- [Security Policy](SECURITY.md)

---

## Roadmap

- **Phase 1 (Done)**: Core rules (`max-file-lines`, `max-function-lines`, `no-orphan-todos`, `no-ai-obvious-comments`), ESLint v8/v9 support, CLI `init` for Vite/Next.js/Elysia.
- **Phase 2 (In Progress)**: CLI Optimization for NestJS and Express; SvelteKit native init support is available.
- **Phase 3 (Future)**: AI Hallucination Guard, Automated CI Bot.

---

## 🤝 Contributions

A massive thank you to everyone who has helped build and improve AI Guardrails!

<a href="https://github.com/isaacnewton123/eslint-plugin-ai-guardrails/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=isaacnewton123/eslint-plugin-ai-guardrails" />
</a>

---

## Creator

**Hanif Maulana (Isaac Newton)**

- Website: [eslint-ai-guardrails.vercel.app](https://eslint-ai-guardrails.vercel.app/)
- GitHub: [github.com/isaacnewton123](https://github.com/isaacnewton123)
- X: [x.com/isaac_newton252](https://x.com/isaac_newton252)
- Facebook: [facebook.com/hanif.maulana.108](https://www.facebook.com/hanif.maulana.108/)
- LinkedIn: [linkedin.com/in/hanif-maulana-210b4721b](https://www.linkedin.com/in/hanif-maulana-210b4721b/)
- Instagram: [instagram.com/hanifmaulana2](https://www.instagram.com/hanifmaulana2/)

## Support

If this plugin saves you from AI-generated chaos, consider supporting development:

- Ko-fi: [ko-fi.com/isaacnewton1](https://ko-fi.com/isaacnewton1)
- Trakteer: [trakteer.id/isaacnewton1/link](https://trakteer.id/isaacnewton1/link)
- Github: [github.com/sponsors/isaacnewton123](https://github.com/sponsors/isaacnewton123)

---

## License

[MIT](LICENSE) — Built with care for maintainable AI-assisted development.
