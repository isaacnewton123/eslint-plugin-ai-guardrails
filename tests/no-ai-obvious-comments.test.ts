import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/no-ai-obvious-comments';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('no-ai-obvious-comments', rule, {
  valid: [
    // Useful comment explaining WHY
    {
      code: `
        // Validate user input before persisting to storage.
        const result = saveUser(input);
      `
    },
    // Comment explaining a subtle edge case
    {
      code: `
        // This function has a subtle edge case around DST transitions.
        runScheduler();
      `
    },
    // Comment with no code below it
    {
      code: `
        // This is the last line
      `
    },
    // Comment far from next statement (blank lines between)
    {
      code: `
        // Some comment


        const unrelated = true;
      `
    },
    // Block comment (rule only targets line comments)
    {
      code: `
        /* Set x to 5 */
        const x = 5;
      `
    },
    // Comment with many unique words (size > 6, not trigger words)
    {
      code: `
        // ensure data integrity check before commit transaction finalization protocol
        const result = validate();
      `
    },
    // Comment before a different kind of statement
    {
      code: `
        // Log the current state for debugging purposes
        if (debug) { console.log(state); }
      `
    }
  ],
  invalid: [
    // Classic obvious comment
    {
      code: `
        // Set x to 5
        const x = 5;
      `,
      errors: [{ messageId: 'obviousComment' }]
    },
    // Increment narration
    {
      code: `
        // Increase counter
        i++;
      `,
      errors: [{ messageId: 'obviousComment' }]
    },
    // Assignment narration
    {
      code: `
        // assign value
        const value = 42;
      `,
      errors: [{ messageId: 'obviousComment' }]
    },
    // Increment with +=
    {
      code: `
        // increment counter
        counter += 1;
      `,
      errors: [{ messageId: 'obviousComment' }]
    },
    // Decrement narration
    {
      code: `
        // decrease count
        count--;
      `,
      errors: [{ messageId: 'obviousComment' }]
    }
  ]
});
