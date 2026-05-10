# Contributing to AI Guardrails

Thank you for helping improve `eslint-plugin-ai-guardrails`. This guide focuses on maximum efficiency and zero boilerplate to get you building quickly.

## Architecture & Folder Structure

```
src/
  index.ts              # Core plugin entry (exports rules & flatConfigs)
  rules/                # Individual linting rules
  cli/
    index.ts            # CLI execution script (npx eslint-plugin-ai-guardrails init)
    templates.ts        # Framework-specific config generation (Next.js, Vite, etc.)
    utils.ts            # Project auto-detection logic
    ai-rules.ts         # Scaffolding logic for .cursorrules / .windsurfrules
tests/                  # Jest test suite
```

## Adding New Framework Support to the CLI

If you want the `init` command to automatically configure a new framework (e.g., SvelteKit, Express), follow these 3 steps:

1. **Detection**: Update `src/cli/utils.ts` -> `detectProject()` to identify the framework via dependencies or unique files (e.g., `svelte.config.js`).
2. **Templates**: Open `src/cli/templates.ts` and add a new framework object to `TPLS`. Include the appropriate `eslintConfigMjs` template and the correct `packageScripts` (for linting and building).
3. **Execution**: In `src/cli/index.ts`, map the newly detected framework boolean to the template you created in Step 2.

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
