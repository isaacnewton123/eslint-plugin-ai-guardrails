# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [release]

## [1.2.0] - 2026-05-10

### Added

- **Smart CLI Initialization System (`npx eslint-plugin-ai-guardrails init`)**:
  - Auto-detects frameworks (Vite, Next.js, Elysia, NestJS) and applies optimal config templates.
  - Generates comprehensive baseline setups including `eslint.config.js/mjs`, `tsconfig.json`, and automatic `vite-plugin-checker` wiring.
  - Intelligently patches `package.json` to inject necessary `lint`, `typecheck`, and `build` scripts without overwriting user data.
  - Interactive safety prompts prevent accidental destructive overwrites.
- **Automated AI Rules Scaffolding**: 
  - The CLI now automatically generates and formats strict AI guardrail instructions for `.windsurf/rules/ai-guardrails.md`, `.cursor/rules/ai-guardrails.md`, `.agents/rules/ai-guardrails.md`, and `.kiro/steering/ai-guardrails.md`.
  - Injects a zero-tolerance "AI Cage" prompt to ensure future AI-generated code conforms strictly to project limitations (no redundant comments, strict lines limits).

### Changed

- **Comprehensive Comment Quality Linter**: The `no-ai-obvious-comments` rule has been completely overhauled from an absolute ban to a nuanced, professional-grade linter:
  - **Density Control**: Enforces maximum comment limits (20% for large files, 30% for files under 50 lines).
  - **Horizontal Limits**: Fails if any individual comment line exceeds 80 characters.
  - **Vertical Limits**: Allows 10 consecutive lines for docstrings but only 3 lines for inline logic.
  - **Content Heuristics**: Detects commented-out code snippets and flags redundant explanations that merely repeat the code's token logic.
- **Max Line Rules**: `max-file-lines` and `max-function-lines` now count both code AND comment lines towards their limits by default (`skipComments: false`).

## [1.1.0] - 2026-05-07

### Changed

- CLI initializer now creates `eslint.config.mjs` for new projects and preserves existing `lint`/`build` scripts.
- CLI initializer now skips `tsconfig.json` updates when the file exists but contains invalid JSON, preventing destructive overwrites.
- Documentation updated to reflect non-destructive `init` behavior and `.mjs` flat-config defaults.
- Added `.stress-tests/` multi-framework failure harness for validating that guardrail violations break builds as expected.

## [1.0.0] - 2026-05-07

### Added

- **4 ESLint rules** for AI-assisted codebase quality:
  - `max-file-lines` — prevent god files (default: 300 lines)
  - `max-function-lines` — prevent god functions (default: 50 lines)
  - `no-orphan-todos` — require tracking references on TODO/FIXME/HACK
  - `no-ai-obvious-comments` — detect redundant comments that repeat code
- **CLI initializer** (`npx eslint-plugin-ai-guardrails init`) with auto-detection for:
  - Package managers (npm, pnpm, yarn, bun)
  - Frameworks (Vite, Next.js, NestJS, Elysia)
  - Automatic `vite-plugin-checker` wiring
  - `tsconfig.json` strict baseline creation
- **ESLint v8 support** — legacy `.eslintrc` config via `plugin:ai-guardrails/recommended`
- **ESLint v9 support** — flat config via `aiGuardrails.flatConfigs.recommended`
- **Plugin metadata** — `plugin.meta.name` and `plugin.meta.version` for ESLint v9
- **Lazy parser loading** — `@typescript-eslint/parser` loaded on demand to prevent crashes during installation
- **CJS/ESM interop** — `flatConfigs` accessible via both `require()` and `import default`
- **Comprehensive test suite** — 60 tests covering all rules, edge cases, and plugin exports
- **Integration-tested** against ESLint v8 legacy, v9 flat CJS, v9 flat ESM, and framework-specific configs
- **CI workflow** — GitHub Actions with Node 18, 20, 22 matrix
- **Full documentation** — rule docs, configuration guide, integrations for 7+ frameworks, troubleshooting

### Changed

- CLI config template now uses standard flat config array export (compatible with all ESLint v9 versions)
- Version bumped from 0.1.0 to 1.0.0 for production release
