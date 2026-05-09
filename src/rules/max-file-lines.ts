import { TSESLint } from '@typescript-eslint/utils';

type Options = [
  {
    max?: number;
    skipBlankLines?: boolean;
    skipComments?: boolean;
  }
];

type MessageIds = 'tooManyLines';

const defaultOptions = {
  max: 300,
  skipBlankLines: true,
  skipComments: false
};

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent files from becoming too large (god files).'
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'number', minimum: 1 },
          skipBlankLines: { type: 'boolean' },
          skipComments: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      tooManyLines:
        'File has {{actual}} lines, exceeds maximum of {{max}}. AI-generated code often bloats files. Please split this file into smaller modules.'
    }
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const sourceCode = (context as unknown as { sourceCode?: TSESLint.SourceCode }).sourceCode ?? context.getSourceCode();
    const options = { ...defaultOptions, ...(context.options[0] ?? {}) };

    return {
      Program(node) {
        const lines = sourceCode.getText().split(/\r?\n/u);
        const ignoreLines = new Set<number>();

        if (options.skipBlankLines) {
          lines.forEach((line, index) => {
            if (line.trim() === '') {
              ignoreLines.add(index + 1);
            }
          });
        }

        if (options.skipComments) {
          for (const comment of sourceCode.getAllComments()) {
            if (!comment.loc) {
              continue;
            }
            for (let line = comment.loc.start.line; line <= comment.loc.end.line; line += 1) {
              ignoreLines.add(line);
            }
          }
        }

        const actual = lines.length - ignoreLines.size;
        if (actual > options.max) {
          context.report({
            node,
            messageId: 'tooManyLines',
            data: {
              actual: String(actual),
              max: String(options.max)
            }
          });
        }
      }
    };
  }
};

export default rule;
