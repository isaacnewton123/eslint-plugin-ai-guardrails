# Contributing to AI Guardrails

Thank you for helping improve `eslint-plugin-ai-guardrails`. This guide focuses on maximum efficiency and zero boilerplate to get you building quickly.

## Architecture & Folder Structure

```
src/
  index.ts                  # Core plugin entry (exports rules & flatConfigs)
  cli.ts                    # CLI execution script (npx eslint-plugin-ai-guardrails init)
  configs/
    recommended.ts          # Legacy (ESLint v8) recommended preset
  rules/                    # Individual linting rules
    max-file-lines.ts
    max-function-lines.ts
    no-orphan-todos.ts
    no-ai-obvious-comments.ts
    utils/
      source-code.ts        # Shared `resolveSourceCode(context)` helper (ESLint v8/v9 compat)
  cli/
    templates.ts            # Framework-specific config generation (Next.js, Vite, etc.)
    utils.ts                # Project auto-detection logic
    ai-rules.ts             # Scaffolding logic for .cursorrules / .windsurfrules
    colors.ts               # ANSI terminal color helpers
    json.ts                 # `JsonValue` / `JsonObject` type aliases
tests/                      # Jest test suite
```

## Adding New Framework Support to the CLI

If you want the `init` command to automatically configure a new framework (e.g., SvelteKit, Express), follow these 3 steps:

1. **Detection**: Update `src/cli/utils.ts` -> `detectProject()` to identify the framework via dependencies or unique files (e.g., `svelte.config.js`).
2. **Templates**: Open `src/cli/templates.ts` and add a new framework object to `TPLS`. Include the appropriate `eslintConfigMjs` template and the correct `packageScripts` (for linting and building).
3. **Execution**: In `src/cli.ts`, map the newly detected framework boolean to the template you created in Step 2.

## Type-Safety Conventions

This project keeps the source free of ambiguous type annotations (no bare `any`, `unknown`, or empty `{}` in public surfaces). When adding or modifying rules and CLI helpers, prefer the shared utilities:

- **`resolveSourceCode(context)`** from `src/rules/utils/source-code.ts` — use this inside any `create(context)` to obtain a `TSESLint.SourceCode`. It works under both ESLint v8 (`context.getSourceCode()`) and ESLint v9 (`context.sourceCode`) without `as unknown as` casts.
- **`JsonValue` / `JsonObject`** from `src/cli/json.ts` — use these instead of `unknown` when accepting JSON-serializable input (e.g., for `writeJson()` or arbitrary `package.json` fields).

## Local Testing

Before submitting a PR, ensure all quality checks pass. The build pipeline enforces strict typing and linting.

```bash
npm install

# 1. Ensure the code is warning-free
npm run lint

# 2. Compile TypeScript
npm run build

# 3. Run all tests
npm test
```

## PR Guidelines

- Write tests for new rules or CLI logic.
- Keep PRs focused on a single issue or feature.
- Run the 3 local testing commands above. If they pass, you're ready to submit!
