import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/max-function-lines';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('max-function-lines', rule, {
  valid: [
    {
      code: `
        function shortFn() {
          const x = 1;
          return x;
        }
      `,
      options: [{ max: 4 }]
    },
    {
      code: `
        function skipComments() {
          // comment
          const x = 1;

          return x;
        }
      `,
      options: [{ max: 4, skipComments: true, skipBlankLines: true }]
    },
    // Edge case: arrow function expression body (no block)
    {
      code: `const fn = () => 42;`,
      options: [{ max: 1 }]
    },
    // Edge case: single-line function
    {
      code: `function single() { return 1; }`,
      options: [{ max: 1 }]
    },
    // Edge case: skipSingleLine option
    {
      code: `function single() { return 1; }`,
      options: [{ max: 1, skipSingleLine: true }]
    },
    // Edge case: nested function — inner is short
    {
      code: `
        function outer() {
          const inner = () => {
            return 1;
          };
          return inner;
        }
      `,
      options: [{ max: 6 }]
    },
    // Edge case: class method
    {
      code: `
        class Foo {
          bar() {
            return 1;
          }
        }
      `,
      options: [{ max: 3 }]
    }
  ],
  invalid: [
    {
      code: `
        function longFn() {
          const a = 1;
          const b = 2;
          const c = 3;
          return a + b + c;
        }
      `,
      options: [{ max: 4 }],
      errors: [{ messageId: 'tooManyFunctionLines' }]
    },
    {
      code: `
        const obj = {
          compute() {
            const a = 1;
            const b = 2;
            return a + b;
          }
        };
      `,
      options: [{ max: 3 }],
      errors: [{ messageId: 'tooManyFunctionLines' }]
    },
    // Edge case: arrow function exceeds limit
    {
      code: `
        const fn = () => {
          const a = 1;
          const b = 2;
          const c = 3;
          return a + b + c;
        };
      `,
      options: [{ max: 4 }],
      errors: [{ messageId: 'tooManyFunctionLines' }]
    },
    // Edge case: function expression in variable
    {
      code: `
        const fn = function() {
          const a = 1;
          const b = 2;
          const c = 3;
          return a + b + c;
        };
      `,
      options: [{ max: 4 }],
      errors: [{ messageId: 'tooManyFunctionLines' }]
    },
    // Edge case: nested functions — both exceed
    {
      code: `
        function outer() {
          const a = 1;
          const b = 2;
          const inner = () => {
            const c = 1;
            const d = 2;
            const e = 3;
            return c + d + e;
          };
          const f = 3;
          return a + b + f + inner();
        }
      `,
      options: [{ max: 4 }],
      errors: [
        { messageId: 'tooManyFunctionLines' },
        { messageId: 'tooManyFunctionLines' }
      ]
    },
    // Edge case: comments not skipped push over limit
    {
      code: `
        function fn() {
          // a comment
          // another comment
          const x = 1;
          return x;
        }
      `,
      options: [{ max: 4, skipComments: false, skipBlankLines: true }],
      errors: [{ messageId: 'tooManyFunctionLines' }]
    }
  ]
});
