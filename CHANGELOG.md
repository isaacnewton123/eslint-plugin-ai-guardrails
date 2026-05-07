# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [release]

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
