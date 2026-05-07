import { TSESLint } from '@typescript-eslint/utils';
import recommended from './configs/recommended';
import maxFileLines from './rules/max-file-lines';
import maxFunctionLines from './rules/max-function-lines';
import noOrphanTodos from './rules/no-orphan-todos';
import noAiObviousComments from './rules/no-ai-obvious-comments';

const rules = {
  'max-file-lines': maxFileLines,
  'max-function-lines': maxFunctionLines,
  'no-orphan-todos': noOrphanTodos,
  'no-ai-obvious-comments': noAiObviousComments
};

const configs = {
  recommended
};

/**
 * Lazily resolve @typescript-eslint/parser to avoid hard crashes when the
 * peer dependency is not yet installed (e.g. during `npx eslint-plugin-ai-guardrails init`).
 */
const loadParser = (): unknown => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@typescript-eslint/parser');
  } catch {
    return undefined;
  }
};

/**
 * Build the flat-config recommended preset.
 * The parser is resolved lazily so that importing the plugin never crashes.
 */
const buildFlatConfigs = (pluginRef: TSESLint.Linter.Plugin) => ({
  recommended: {
    name: 'ai-guardrails/recommended',
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {
      'ai-guardrails': pluginRef
    },
    languageOptions: {
      parser: loadParser()
    },
    rules: {
      'ai-guardrails/max-file-lines': 'warn' as const,
      'ai-guardrails/max-function-lines': 'warn' as const,
      'ai-guardrails/no-orphan-todos': 'error' as const,
      'ai-guardrails/no-ai-obvious-comments': 'warn' as const
    }
  }
});

type PluginWithMeta = TSESLint.Linter.Plugin & {
  meta: { name: string; version: string };
  flatConfigs: ReturnType<typeof buildFlatConfigs>;
};

const plugin = {
  meta: {
    name: 'eslint-plugin-ai-guardrails',
    version: '1.0.0'
  },
  rules,
  configs
} as unknown as PluginWithMeta;

/**
 * Attach flatConfigs to the plugin object so that both of these work:
 *   - `import aiGuardrails from '...'`  →  aiGuardrails.flatConfigs.recommended
 *   - `require('...')`                  →  module.flatConfigs.recommended
 *   - `require('...').default`          →  default.flatConfigs.recommended
 */
plugin.flatConfigs = buildFlatConfigs(plugin);

export default plugin;
export { rules, configs };
export const flatConfigs = plugin.flatConfigs;
