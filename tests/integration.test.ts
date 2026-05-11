/**
 * Integration smoke tests — verify the plugin loads correctly
 * and exports match the expected public API surface.
 */
import type { TSESLint } from '@typescript-eslint/utils';

describe('plugin exports', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const plugin = require('../src/index');

  it('exports rules', () => {
    expect(plugin.rules).toBeDefined();
    expect(Object.keys(plugin.rules)).toEqual(
      expect.arrayContaining([
        'max-file-lines',
        'max-function-lines',
        'no-orphan-todos',
        'no-ai-obvious-comments'
      ])
    );
  });

  it('exports configs.recommended (legacy)', () => {
    expect(plugin.configs).toBeDefined();
    expect(plugin.configs.recommended).toBeDefined();
    expect(plugin.configs.recommended.plugins).toContain('ai-guardrails');
  });

  it('exports flatConfigs.recommended (ESLint v9)', () => {
    expect(plugin.flatConfigs).toBeDefined();
    expect(plugin.flatConfigs.recommended).toBeDefined();
    expect(plugin.flatConfigs.recommended.name).toBe('ai-guardrails/recommended');
    expect(plugin.flatConfigs.recommended.plugins).toHaveProperty('ai-guardrails');
    expect(plugin.flatConfigs.recommended.rules).toEqual({
      'ai-guardrails/max-file-lines': 'warn',
      'ai-guardrails/max-function-lines': 'warn',
      'ai-guardrails/no-orphan-todos': 'error',
      'ai-guardrails/no-ai-obvious-comments': 'warn'
    });
  });

  it('default export has flatConfigs (CJS interop)', () => {
    const defaultExport = plugin.default;
    expect(defaultExport).toBeDefined();
    expect(defaultExport.flatConfigs).toBeDefined();
    expect(defaultExport.flatConfigs.recommended).toBeDefined();
    expect(defaultExport.rules).toBeDefined();
    expect(defaultExport.configs).toBeDefined();
  });

  it('plugin.meta has name and version', () => {
    const defaultExport = plugin.default;
    expect(defaultExport.meta).toBeDefined();
    expect(defaultExport.meta.name).toBe('eslint-plugin-ai-guardrails');
    expect(typeof defaultExport.meta.version).toBe('string');
  });

  it('flatConfigs.recommended.plugins["ai-guardrails"] references the plugin itself', () => {
    const pluginRef = plugin.flatConfigs.recommended.plugins['ai-guardrails'];
    expect(pluginRef.rules).toBe(plugin.rules);
  });

  it('each rule has required meta fields', () => {
    type AnyRuleModule = TSESLint.RuleModule<string, readonly object[]>;
    const rules = plugin.rules as Record<string, AnyRuleModule>;
    for (const r of Object.values(rules)) {
      expect(r.meta).toBeDefined();
      expect(r.meta.type).toBeDefined();
      expect(r.meta.docs).toBeDefined();
      expect(r.meta.docs?.description).toBeDefined();
      expect(r.meta.schema).toBeDefined();
      expect(r.meta.messages).toBeDefined();
      expect(typeof r.create).toBe('function');
    }
  });
});
