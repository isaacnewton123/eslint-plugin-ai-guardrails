import { TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'obviousComment';
type Options = [];

const TRIGGER_WORDS = ['set', 'assign', 'increase', 'increment', 'decrease', 'decrement', 'counter'];

const extractWords = (input: string): string[] =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/gu, ' ')
    .split(/\s+/u)
    .filter(Boolean);

const collectIdentifiersAndStrings = (node: TSESTree.Node): Set<string> => {
  const values = new Set<string>();
  const stack: TSESTree.Node[] = [node];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    if (current.type === 'Identifier') {
      values.add(current.name.toLowerCase());
    }

    if (current.type === 'Literal' && typeof current.value === 'string') {
      for (const word of extractWords(current.value)) {
        values.add(word);
      }
    }

    for (const [key, value] of Object.entries(current)) {
      if (key === 'parent') {
        continue;
      }
      if (!value) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object' && 'type' in item) {
            stack.push(item as TSESTree.Node);
          }
        }
      } else if (typeof value === 'object' && 'type' in value) {
        stack.push(value as TSESTree.Node);
      }
    }
  }

  return values;
};

const isIncrementLikeStatement = (statement: TSESTree.Statement): boolean => {
  if (statement.type !== 'ExpressionStatement') {
    return false;
  }
  const expression = statement.expression;
  return (
    expression.type === 'UpdateExpression' ||
    (expression.type === 'AssignmentExpression' &&
      expression.operator === '+=' &&
      expression.right.type === 'Literal' &&
      expression.right.value === 1)
  );
};

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect obvious comments that repeat the following line of code.'
    },
    schema: [],
    messages: {
      obviousComment:
        'Comment appears to repeat the following code. AI sometimes adds redundant comments; remove or improve it.'
    }
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = (context as unknown as { sourceCode?: TSESLint.SourceCode }).sourceCode ?? context.getSourceCode();
    const lines = sourceCode.getText().split(/\r?\n/u);

    return {
      Program(program) {
        const statements = program.body;
        const lineComments = sourceCode.getAllComments().filter((comment) => comment.type === 'Line');

        for (const comment of lineComments) {
          if (!comment.loc) {
            continue;
          }
          const commentLine = comment.loc.end.line;
          const nextStatement = statements.find(
            (statement) => statement.loc && statement.loc.start.line > commentLine
          );
          if (!nextStatement || !nextStatement.loc) {
            continue;
          }

          const onlyWhitespaceBetween = lines
            .slice(commentLine, nextStatement.loc.start.line - 1)
            .every((line) => line.trim() === '');

          if (!onlyWhitespaceBetween || nextStatement.loc.start.line !== commentLine + 1) {
            continue;
          }

          const commentWords = new Set(extractWords(comment.value));
          if (commentWords.size === 0) {
            continue;
          }

          const statementTokens = collectIdentifiersAndStrings(nextStatement);
          let overlap = 0;
          for (const word of commentWords) {
            if (statementTokens.has(word)) {
              overlap += 1;
            }
          }

          const hasTriggerWords = TRIGGER_WORDS.some((word) => commentWords.has(word));
          const obviousIncrementComment =
            isIncrementLikeStatement(nextStatement) &&
            (commentWords.has('increase') ||
              commentWords.has('increment') ||
              commentWords.has('counter'));

          if (
            obviousIncrementComment ||
            (overlap >= 1 && (hasTriggerWords || commentWords.size <= 6))
          ) {
            context.report({
              loc: comment.loc,
              messageId: 'obviousComment'
            });
          }
        }
      }
    };
  }
};

export default rule;
