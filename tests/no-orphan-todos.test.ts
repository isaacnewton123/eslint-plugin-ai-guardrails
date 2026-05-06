import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/no-orphan-todos';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('no-orphan-todos', rule, {
  valid: [
    // URL reference
    {
      code: '// TODO: https://github.com/user/repo/issues/42\nconst ok = true;'
    },
    // Date with requireDate
    {
      code: '// FIXME(2026-08-01): handle edge case\nconst ok = true;',
      options: [{ requireReference: false, requireDate: true }]
    },
    // Issue reference
    {
      code: '/* HACK #321 */\nconst ok = true;'
    },
    // Block comment with URL
    {
      code: '/* TODO https://jira.company.com/browse/PROJ-123 */\nconst a = 1;'
    },
    // Date + reference together
    {
      code: '// TODO(2026-12-01) #42: migrate to v2\nconst ok = true;',
      options: [{ requireReference: true, requireDate: true }]
    },
    // Not a TODO comment — should not trigger
    {
      code: '// This is a regular comment\nconst ok = true;'
    },
    // TODO with both URL and date
    {
      code: '// FIXME(2027-01-15): https://github.com/org/repo/issues/99\nconst a = 1;',
      options: [{ requireReference: true, requireDate: true }]
    },
    // requireReference false, requireDate false — everything is valid
    {
      code: '// TODO do something\nconst a = 1;',
      options: [{ requireReference: false, requireDate: false }]
    }
  ],
  invalid: [
    // No reference
    {
      code: '// TODO implement this later\nconst x = 1;',
      errors: [{ messageId: 'orphanTodo' }]
    },
    // No date when required
    {
      code: '// FIXME with no date\nconst x = 1;',
      options: [{ requireReference: false, requireDate: true }],
      errors: [{ messageId: 'orphanTodo' }]
    },
    // HACK without reference
    {
      code: '// HACK: quick workaround\nconst x = 1;',
      errors: [{ messageId: 'orphanTodo' }]
    },
    // Block comment without reference
    {
      code: '/* TODO: refactor this */\nconst x = 1;',
      errors: [{ messageId: 'orphanTodo' }]
    },
    // Invalid date format (MM-DD-YYYY instead of YYYY-MM-DD)
    {
      code: '// TODO(12-01-2026): fix this\nconst x = 1;',
      options: [{ requireReference: false, requireDate: true }],
      errors: [{ messageId: 'orphanTodo' }]
    },
    // Both required, only date present
    {
      code: '// TODO(2026-08-01): fix this\nconst x = 1;',
      options: [{ requireReference: true, requireDate: true }],
      errors: [{ messageId: 'orphanTodo' }]
    },
    // Case-insensitive: lowercase todo
    {
      code: '// todo: fix later\nconst x = 1;',
      errors: [{ messageId: 'orphanTodo' }]
    },
    // Invalid date (Feb 30)
    {
      code: '// TODO(2026-02-30): impossible date\nconst x = 1;',
      options: [{ requireReference: false, requireDate: true }],
      errors: [{ messageId: 'orphanTodo' }]
    }
  ]
});
