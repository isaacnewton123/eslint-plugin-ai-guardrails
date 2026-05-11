import { TSESLint } from '@typescript-eslint/utils';
import { resolveSourceCode } from './utils/source-code';

type Options = [
  {
    requireReference?: boolean;
    requireDate?: boolean;
    dateFormat?: 'YYYY-MM-DD';
  }
];

type MessageIds = 'orphanTodo';

const defaultOptions = {
  requireReference: true,
  requireDate: false,
  dateFormat: 'YYYY-MM-DD' as const
};

const TODO_PATTERN = /\b(TODO|FIXME|HACK)\b/iu;
const URL_PATTERN = /https?:\/\/[^\s)]+/iu;
const ISSUE_PATTERN = /#[0-9]+/u;
const DATE_PATTERN = /\b\d{4}-\d{2}-\d{2}\b/u;

const isValidDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
};

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require TODO/FIXME/HACK comments to include a reference or deadline.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireReference: { type: 'boolean' },
          requireDate: { type: 'boolean' },
          dateFormat: { type: 'string', enum: ['YYYY-MM-DD'] }
        },
        additionalProperties: false
      }
    ],
    messages: {
      orphanTodo:
        'TODO comment without tracking reference or expiration date. AI often leaves orphan TODOs; please link an issue or add a deadline like TODO(2026-08-01) or TODO: https://...'
    }
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const options = { ...defaultOptions, ...(context.options[0] ?? {}) };
    const sourceCode = resolveSourceCode(context);

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          const text = comment.value;
          if (!TODO_PATTERN.test(text)) {
            continue;
          }

          const hasReference = URL_PATTERN.test(text) || ISSUE_PATTERN.test(text);
          const dateMatch = text.match(DATE_PATTERN)?.[0];
          const hasValidDate = dateMatch ? isValidDate(dateMatch) : false;

          const needsReference = options.requireReference && !hasReference;
          const needsDate = options.requireDate && !hasValidDate;

          if (needsReference || needsDate) {
            context.report({
              loc: comment.loc,
              messageId: 'orphanTodo'
            });
          }
        }
      }
    };
  }
};

export default rule;
