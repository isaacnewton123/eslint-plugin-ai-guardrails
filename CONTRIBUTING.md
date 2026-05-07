# Contributing

Thanks for your interest in contributing to AI Guardrails!

## Prerequisites

- Node.js ≥ 18
- npm (comes with Node)

## Local Setup

```bash
git clone https://github.com/isaacnewton123/eslint-plugin-ai-guardrails.git
cd eslint-plugin-ai-guardrails
npm install
```

## Development Workflow

1. Add or update a rule in `src/rules/`.
2. Add tests in `tests/`.
3. Update rule docs in `docs/rules/`.
4. Run quality checks:

```bash
npm run lint      # Zero warnings
npm run build     # TypeScript compilation
npm test          # All tests must pass
```

## Architecture Overview

```
src/
  index.ts              Plugin entry point (rules, configs, flatConfigs)
  cli.ts                CLI initializer (npx eslint-plugin-ai-guardrails init)
  configs/
    recommended.ts      ESLint v8 legacy recommended config
  rules/
    max-file-lines.ts
    max-function-lines.ts
    no-orphan-todos.ts
    no-ai-obvious-comments.ts
tests/
  *.test.ts             Unit tests (RuleTester)
  integration.test.ts   Plugin export smoke tests
docs/
  rules/                Per-rule documentation
  configuration.md      Full options reference
  integrations.md       Framework-specific setup guides
  troubleshooting.md    Common issues and fixes
```

### Key Design Decisions

- **Lazy parser loading**: `@typescript-eslint/parser` is loaded via `require()` inside a try/catch so the plugin never crashes at import time if the parser isn't installed yet.
- **Self-referencing flat config**: `flatConfigs.recommended.plugins['ai-guardrails']` references the plugin object itself, which is required by ESLint v9.
- **CJS module with ESM compatibility**: The package uses `"type": "commonjs"` with TypeScript's `export default`, enabling both `require()` and `import` to work.

## Rule Authoring Checklist

- [ ] Add complete `meta` object: `type`, `docs.description`, `schema`, `messages`
- [ ] Set `defaultOptions` array
- [ ] Use the compatibility shim for `sourceCode`: `(context as unknown as { sourceCode?: ... }).sourceCode ?? context.getSourceCode()`
- [ ] Write tests covering: defaults, option overrides, edge cases, valid and invalid
- [ ] Add docs in `docs/rules/<rule-name>.md` with: description, options table, examples, "When Not To Use"
- [ ] Register the rule in `src/index.ts` (both `rules` object and `flatConfigs.recommended.rules`)
- [ ] Update `src/configs/recommended.ts` for ESLint v8

## Testing

```bash
# Run all tests
npm test

# Run a specific test file
npx jest tests/max-file-lines.test.ts

# Run with coverage
npx jest --coverage
```

## Pull Requests

- Keep changes focused and reviewable
- Include tests for behavior changes
- Update docs for user-facing changes
- Run `npm run build && npm test` before submitting

## Commit Messages

Use clear, imperative-mood messages:

```
fix: lazy-load parser to prevent import crashes
feat: add skipSingleLine option to max-function-lines
docs: add SvelteKit integration guide
test: add edge cases for empty files
```

## Maintainer

- **Hanif Maulana (Isaac Newton)** — [github.com/isaacnewton123](https://github.com/isaacnewton123)
