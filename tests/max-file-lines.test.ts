import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/max-file-lines';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('max-file-lines', rule, {
  valid: [
    {
      code: ['const a = 1;', 'const b = 2;', 'const c = 3;'].join('\n'),
      options: [{ max: 3 }]
    },
    {
      code: ['const a = 1;', '', '// comment', 'const b = 2;'].join('\n'),
      options: [{ max: 2, skipBlankLines: true, skipComments: true }]
    },
    // Edge case: empty file
    {
      code: '',
      options: [{ max: 1 }]
    },
    // Edge case: file with only comments
    {
      code: ['// comment 1', '// comment 2', '// comment 3'].join('\n'),
      options: [{ max: 1, skipComments: true }]
    },
    // Edge case: file with only blank lines
    {
      code: ['', '', '', ''].join('\n'),
      options: [{ max: 1, skipBlankLines: true }]
    },
    // Edge case: exactly at the limit
    {
      code: ['const a = 1;', 'const b = 2;', 'const c = 3;'].join('\n'),
      options: [{ max: 3, skipBlankLines: false, skipComments: false }]
    },
    // Edge case: multi-line block comment (skipped)
    {
      code: ['/* comment', ' * continued', ' */', 'const a = 1;'].join('\n'),
      options: [{ max: 1, skipComments: true }]
    }
  ],
  invalid: [
    {
      code: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;'].join('\n'),
      options: [{ max: 3 }],
      errors: [{ messageId: 'tooManyLines' }]
    },
    {
      code: ['const a = 1;', '', 'const b = 2;'].join('\n'),
      options: [{ max: 2, skipBlankLines: false }],
      errors: [{ messageId: 'tooManyLines' }]
    },
    // Edge case: blank lines not skipped push over limit
    {
      code: ['const a = 1;', '', '', 'const b = 2;'].join('\n'),
      options: [{ max: 3, skipBlankLines: false }],
      errors: [{ messageId: 'tooManyLines' }]
    },
    // Edge case: comments not skipped push over limit
    {
      code: ['const a = 1;', '// comment', 'const b = 2;'].join('\n'),
      options: [{ max: 2, skipComments: false, skipBlankLines: true }],
      errors: [{ messageId: 'tooManyLines' }]
    },
    // Edge case: one over the limit
    {
      code: ['const a = 1;', 'const b = 2;'].join('\n'),
      options: [{ max: 1 }],
      errors: [{ messageId: 'tooManyLines' }]
    }
  ]
});
