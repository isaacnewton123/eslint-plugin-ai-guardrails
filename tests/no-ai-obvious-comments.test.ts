import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/no-ai-obvious-comments';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

const generateLines = (count: number, content: string = 'const x = 1;'): string => {
  return Array(count).fill(content).join('\n');
};

ruleTester.run('no-ai-obvious-comments', rule, {
  valid: [
    {
      // Valid density (< 50 lines, <= 30%)
      code: `
        // 1
        // 2
        // 3
        function test() {}
        ${generateLines(10)}
      `
    },
    {
      // Valid density (>= 50 lines, <= 20%)
      code: `
        // 1
        // 2
        // 3
        function test() {}
        // 4
        // 5
        // 6
        function test2() {}
        // 7
        // 8
        // 9
        function test3() {}
        // 10
        ${generateLines(50)}
      `
    },
    {
      // Valid horizontal limit
      code: `
        // This is a short comment
        ${generateLines(10)}
      `
    },
    {
      // Valid vertical docstring (<= 10 lines)
      code: `
        // 1
        // 2
        // 3
        // 4
        // 5
        // 6
        // 7
        // 8
        // 9
        // 10
        function test() {}
        ${generateLines(50)}
      `
    },
    {
      // Valid vertical inline (<= 3 lines)
      code: `
        function test() {
          // 1
          // 2
          // 3
          const a = 1;
        }
        ${generateLines(50)}
      `
    },
    {
      // Valid non-obvious comment
      code: `
        // We need to fetch user data before parsing
        const result = getUser();
        ${generateLines(10)}
      `
    }
  ],
  invalid: [
    {
      // Invalid density (< 50 lines, > 30%)
      code: `
        // 1
        // 2
        // 3
        const x = 1;
        // 4
        // 5
        const y = 2;
        const z = 3;
      `,
      errors: [{ messageId: 'densityLimit' }]
    },
    {
      // Invalid density (>= 50 lines, > 20%)
      code: `
        // 1
        // 2
        // 3
        const x = 1;
        // 4
        // 5
        // 6
        const y = 1;
        // 7
        // 8
        // 9
        const z = 1;
        // 10
        // 11
        // 12
        const a = 1;
        // 13
        // 14
        // 15
        const b = 1;
        ${generateLines(40)}
      `,
      errors: [
        { messageId: 'densityLimit' }
      ]
    },
    {
      // Invalid horizontal limit
      code: `
        // This is a very long comment that exceeds the eighty character limit horizontally causing an error to be reported.
        ${generateLines(20)}
      `,
      errors: [{ messageId: 'horizontalLimit' }]
    },
    {
      // Invalid vertical docstring (> 10 lines)
      code: `
        // 1
        // 2
        // 3
        // 4
        // 5
        // 6
        // 7
        // 8
        // 9
        // 10
        // 11
        function test() {}
        ${generateLines(60)}
      `,
      errors: [{ messageId: 'verticalLimitDocstring' }]
    },
    {
      // Invalid vertical inline (> 3 lines)
      code: `
        function test() {
          // 1
          // 2
          // 3
          // 4
          const a = 1;
        }
        ${generateLines(50)}
      `,
      errors: [{ messageId: 'verticalLimitInline' }]
    },
    {
      // Commented out code
      code: `
        // const x = 10;
        doSomethingCompletelyUnrelated();
        ${generateLines(20)}
      `,
      errors: [{ messageId: 'commentedOutCode' }]
    },
    {
      // Obvious comment (repeating code)
      code: `
        // Increment i
        i++;
        ${generateLines(20)}
      `,
      errors: [{ messageId: 'obviousComment' }]
    }
  ]
});
