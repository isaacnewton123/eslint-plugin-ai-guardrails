import { TSESLint, TSESTree } from '@typescript-eslint/utils';

type Options = [
  {
    max?: number;
    skipBlankLines?: boolean;
    skipComments?: boolean;
    skipSingleLine?: boolean;
  }
];

type MessageIds = 'tooManyFunctionLines';

const defaultOptions = {
  max: 50,
  skipBlankLines: true,
  skipComments: true,
  skipSingleLine: false
};

const countEffectiveLines = (
  sourceCode: TSESLint.SourceCode,
  startLine: number,
  endLine: number,
  skipBlankLines: boolean,
  skipComments: boolean
): number => {
  const ignored = new Set<number>();
  const lines = sourceCode.getText().split(/\r?\n/u);

  if (skipBlankLines) {
    for (let line = startLine; line <= endLine; line += 1) {
      if ((lines[line - 1] ?? '').trim() === '') {
        ignored.add(line);
      }
    }
  }

  if (skipComments) {
    for (const comment of sourceCode.getAllComments()) {
      if (!comment.loc) {
        continue;
      }
      const commentStart = Math.max(startLine, comment.loc.start.line);
      const commentEnd = Math.min(endLine, comment.loc.end.line);
      for (let line = commentStart; line <= commentEnd; line += 1) {
        ignored.add(line);
      }
    }
  }

  return endLine - startLine + 1 - ignored.size;
};

const getFunctionName = (node: TSESTree.Node): string => {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return node.id.name;
  }

  if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && node.parent) {
    if (node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier') {
      return node.parent.id.name;
    }
    if (node.parent.type === 'AssignmentExpression' && node.parent.left.type === 'Identifier') {
      return node.parent.left.name;
    }
    if (node.parent.type === 'Property' && node.parent.key.type === 'Identifier') {
      return node.parent.key.name;
    }
    if (node.parent.type === 'MethodDefinition') {
      if (node.parent.key.type === 'Identifier') {
        return node.parent.key.name;
      }
      if (node.parent.key.type === 'Literal') {
        return String(node.parent.key.value);
      }
    }
  }

  return '<anonymous>';
};

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Limit function and method length to avoid god functions.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'number', minimum: 1 },
          skipBlankLines: { type: 'boolean' },
          skipComments: { type: 'boolean' },
          skipSingleLine: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      tooManyFunctionLines:
        "Function '{{name}}' is {{actual}} lines, exceeds maximum of {{max}}. AI often creates long functions; break it down into smaller helpers."
    }
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const sourceCode = (context as unknown as { sourceCode?: TSESLint.SourceCode }).sourceCode ?? context.getSourceCode();
    const options = { ...defaultOptions, ...(context.options[0] ?? {}) };

    const checkFunction = (
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression
    ): void => {
      if (node.body.type !== 'BlockStatement' || !node.body.loc) {
        return;
      }

      const startLine = node.body.loc.start.line;
      const endLine = node.body.loc.end.line;
      const rawLineCount = endLine - startLine + 1;
      if (options.skipSingleLine && rawLineCount <= 1) {
        return;
      }

      const actual = countEffectiveLines(
        sourceCode,
        startLine,
        endLine,
        options.skipBlankLines,
        options.skipComments
      );

      if (actual > options.max) {
        context.report({
          node,
          messageId: 'tooManyFunctionLines',
          data: {
            name: getFunctionName(node),
            actual: String(actual),
            max: String(options.max)
          }
        });
      }
    };

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction
    };
  }
};

export default rule;
