import type { TSESLint } from '@typescript-eslint/utils';

/**
 * ESLint v8 exposes `context.getSourceCode()`; v9 exposes `context.sourceCode`.
 * This structural interface captures the union without resorting to `unknown`.
 */
export interface RuleContextWithSourceCode {
  sourceCode?: TSESLint.SourceCode;
  getSourceCode(): TSESLint.SourceCode;
}

export const resolveSourceCode = (
  context: RuleContextWithSourceCode
): TSESLint.SourceCode => context.sourceCode ?? context.getSourceCode();
