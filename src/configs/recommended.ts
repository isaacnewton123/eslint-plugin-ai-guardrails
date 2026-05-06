import { TSESLint } from '@typescript-eslint/utils';

const recommendedConfig: TSESLint.Linter.Config = {
  plugins: ['ai-guardrails'],
  overrides: [
    {
      files: ['**/*.{ts,tsx,mts,cts}'],
      parser: '@typescript-eslint/parser',
      rules: {
        'ai-guardrails/max-file-lines': 'warn',
        'ai-guardrails/max-function-lines': 'warn',
        'ai-guardrails/no-orphan-todos': 'error',
        'ai-guardrails/no-ai-obvious-comments': 'warn'
      }
    }
  ]
};

export default recommendedConfig;
