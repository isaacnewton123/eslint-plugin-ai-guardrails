import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { resolveSourceCode } from './utils/source-code';

type AstChild =
  | TSESTree.Node
  | TSESTree.Node[]
  | string
  | number
  | boolean
  | null
  | undefined;

const isAstNode = (value: AstChild): value is TSESTree.Node =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  'type' in value;

type MessageIds =
  | 'densityLimit'
  | 'horizontalLimit'
  | 'verticalLimitDocstring'
  | 'verticalLimitInline'
  | 'commentedOutCode'
  | 'obviousComment';

type Options = [];

const TRIGGER_WORDS = ['set', 'assign', 'increase', 'increment', 'decrease', 'decrement', 'counter'];
const COMMENTED_CODE_REGEX = /(?:const|let|var|function|class|interface|type|import|export)\s+\w+|(?:=>)|(?:===|!==)/i;

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
    if (!current) continue;

    if (current.type === 'Identifier') {
      values.add(current.name.toLowerCase());
    }

    if (current.type === 'Literal' && typeof current.value === 'string') {
      for (const word of extractWords(current.value)) {
        values.add(word);
      }
    }

    const record = current as unknown as Record<string, AstChild>;
    for (const key of Object.keys(record)) {
      if (key === 'parent') continue;
      const value = record[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          if (isAstNode(item)) stack.push(item);
        }
      } else if (isAstNode(value)) {
        stack.push(value);
      }
    }
  }

  return values;
};

const isIncrementLikeStatement = (statement: TSESTree.Statement): boolean => {
  if (statement.type !== 'ExpressionStatement') return false;
  const expression = statement.expression;
  return (
    expression.type === 'UpdateExpression' ||
    (expression.type === 'AssignmentExpression' &&
      expression.operator === '+=' &&
      expression.right.type === 'Literal' &&
      expression.right.value === 1)
  );
};

const isFunctionNode = (node: TSESTree.Node | null | undefined): boolean => {
  if (!node) return false;
  if (
    node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  ) {
    return true;
  }
  if (node.type === 'VariableDeclaration') {
    return node.declarations.some((d) => d.init && isFunctionNode(d.init));
  }
  if (node.type === 'ExportNamedDeclaration') {
    return isFunctionNode(node.declaration);
  }
  if (node.type === 'ExportDefaultDeclaration') {
    return isFunctionNode(node.declaration);
  }
  return false;
};

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Strict, multi-faceted rule enforcing professional comment standards.'
    },
    schema: [],
    messages: {
      densityLimit: 'Comment density exceeds the allowed limit ({{percent}}%). Code should be self-documenting.',
      horizontalLimit: 'Comment line exceeds 80 characters. Please wrap the text.',
      verticalLimitDocstring: 'Too many consecutive comment lines for a docstring (found {{lines}}, max 10). Please move extensive explanations to external documentation or link the code.',
      verticalLimitInline: 'Too many consecutive comment lines for inline logic (found {{lines}}, max 3). Please move extensive explanations to external documentation or link the code.',
      commentedOutCode: 'Commented-out code detected. Please use Version Control (Git) to track historical code and remove this.',
      obviousComment: 'Comment repeats the code\'s function. Prioritize explaining "Why" instead of "What", or remove it.'
    }
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = resolveSourceCode(context);
    const lines = sourceCode.lines;
    const totalLines = lines.length;

    return {
      Program(program) {
        const allComments = sourceCode.getAllComments();
        if (allComments.length === 0) return;

        let commentLinesCount = 0;
        const commentedLineNumbers = new Set<number>();

        // 1. Horizontal Limit & Basic Collection
        for (const comment of allComments) {
          // Density collection
          for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
            commentedLineNumbers.add(i);
          }

          // Content: Commented-out code
          if (COMMENTED_CODE_REGEX.test(comment.value)) {
            // Ignore standard eslint directives
            if (!comment.value.trim().startsWith('eslint-') && !comment.value.trim().startsWith('@ts-')) {
              context.report({
                loc: comment.loc,
                messageId: 'commentedOutCode'
              });
            }
          }
        }

        // Horizontal checking based on actual source lines (to include // or /* markers)
        for (const lineNum of commentedLineNumbers) {
          const lineStr = lines[lineNum - 1];
          if (lineStr.length > 80) {
            context.report({
              loc: {
                start: { line: lineNum, column: 0 },
                end: { line: lineNum, column: lineStr.length }
              },
              messageId: 'horizontalLimit'
            });
          }
        }

        // Density Check
        commentLinesCount = commentedLineNumbers.size;
        const density = (commentLinesCount / totalLines) * 100;
        const densityThreshold = totalLines < 50 ? 30 : 20;

        if (density > densityThreshold) {
          context.report({
            node: program,
            messageId: 'densityLimit',
            data: { percent: density.toFixed(1) }
          });
        }

        // 2. Vertical Limit & Obvious Comments
        // Group consecutive comments into blocks
        const blocks: { comments: TSESTree.Comment[]; startLine: number; endLine: number }[] = [];
        let currentBlock: TSESTree.Comment[] = [];

        for (const comment of allComments) {
          if (currentBlock.length === 0) {
            currentBlock.push(comment);
          } else {
            const prev = currentBlock[currentBlock.length - 1];
            // Only group if they are separated by purely whitespace lines or directly adjacent
            let isConsecutive = true;
            for (let i = prev.loc.end.line + 1; i < comment.loc.start.line; i++) {
              if (lines[i - 1].trim() !== '') {
                isConsecutive = false;
                break;
              }
            }
            if (isConsecutive) {
              currentBlock.push(comment);
            } else {
              blocks.push({
                comments: currentBlock,
                startLine: currentBlock[0].loc.start.line,
                endLine: currentBlock[currentBlock.length - 1].loc.end.line
              });
              currentBlock = [comment];
            }
          }
        }
        if (currentBlock.length > 0) {
          blocks.push({
            comments: currentBlock,
            startLine: currentBlock[0].loc.start.line,
            endLine: currentBlock[currentBlock.length - 1].loc.end.line
          });
        }

        const statements = program.body;

        for (const block of blocks) {
          const blockLineCount = block.endLine - block.startLine + 1;
          
          const nextStatement = statements.find(
            (stmt) => stmt.loc && stmt.loc.start.line > block.endLine
          );

          // Vertical Limit Check
          const isDocstring = isFunctionNode(nextStatement);
          if (isDocstring) {
            if (blockLineCount > 10) {
              context.report({
                loc: { start: block.comments[0].loc.start, end: block.comments[block.comments.length - 1].loc.end },
                messageId: 'verticalLimitDocstring',
                data: { lines: blockLineCount }
              });
            }
          } else {
            if (blockLineCount > 3) {
              context.report({
                loc: { start: block.comments[0].loc.start, end: block.comments[block.comments.length - 1].loc.end },
                messageId: 'verticalLimitInline',
                data: { lines: blockLineCount }
              });
            }
          }

          // Obvious Comment Check
          if (nextStatement && nextStatement.loc) {
            // Only check if it's strictly adjacent (no blank lines between block end and statement)
            let isAdjacent = true;
            for (let i = block.endLine + 1; i < nextStatement.loc.start.line; i++) {
              if (lines[i - 1].trim() === '') {
                isAdjacent = false;
                break;
              }
            }

            if (isAdjacent) {
              const combinedCommentText = block.comments.map(c => c.value).join(' ');
              const commentWords = new Set(extractWords(combinedCommentText));
              
              if (commentWords.size > 0) {
                const statementTokens = collectIdentifiersAndStrings(nextStatement);
                let overlap = 0;
                for (const word of commentWords) {
                  if (statementTokens.has(word)) overlap++;
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
                    loc: { start: block.comments[0].loc.start, end: block.comments[block.comments.length - 1].loc.end },
                    messageId: 'obviousComment'
                  });
                }
              }
            }
          }
        }
      }
    };
  }
};

export default rule;
