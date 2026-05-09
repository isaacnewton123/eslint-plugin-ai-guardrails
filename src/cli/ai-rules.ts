import fs from 'node:fs';
import path from 'node:path';
import { c } from './colors';

const AI_INSTRUCTION = `
# AI-Guardrails Mandatory Instructions

You are interacting with a codebase protected by \`eslint-plugin-ai-guardrails\`. To avoid causing build failures, you MUST strictly adhere to the following rules:

1. **STRICT COMMENT LIMITS**: 
   - **Density**: Comments must not exceed 20% of the file's total lines (30% for files under 50 lines).
   - **Vertical**: Max 10 consecutive comment lines for function docstrings. Max 3 consecutive comment lines for inline logic.
   - **Horizontal**: No comment line can exceed 80 characters.
   - **Quality**: Explain "Why", not "What". Never state the obvious. Never leave commented-out code.
2. **NO ORPHAN TODOS**: If you must add a TODO, it MUST include a valid issue tracker link (e.g., \`// TODO: https://github.com/user/repo/issues/123\`).
3. **KEEP IT CONCISE**: 
   - Files must not exceed 300 lines.
   - Functions must not exceed 50 lines.
   Do not generate massive monolithic blocks of code. Break down your logic into smaller, modular helpers.

Violating these constraints will break the CI/CD pipeline.
`;

const KIRO_FOOTER = `
<!-- KIRO-INSTRUCTION: Enforce strict comment density and quality compliance across all code generation tasks. -->
`;

const PLATFORMS = [
  {
    name: '.windsurf/rules/ai-guardrails.md',
    content: `---\ntrigger: always_on\n---${AI_INSTRUCTION}`
  },
  {
    name: '.cursor/rules/ai-guardrails.md',
    content: `---\nalwaysApply: true\n---${AI_INSTRUCTION}`
  },
  {
    name: '.agents/rules/ai-guardrails.md',
    content: AI_INSTRUCTION.trim()
  },
  {
    name: '.kiro/steering/ai-guardrails.md',
    content: `---\ninclusion: always\n---${AI_INSTRUCTION}\n${KIRO_FOOTER}`
  }
];

export const generateAiRules = (cwd: string) => {
  console.log(c.cyan('\n🤖 Configuring AI assistant guardrails...'));
  
  for (const platform of PLATFORMS) {
    const fullPath = path.join(cwd, platform.name);
    const dirPath = path.dirname(fullPath);
    
    // Create directory recursively
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write rule file
    fs.writeFileSync(fullPath, platform.content, 'utf8');
    
    console.log(c.green(`✨ Generated ${platform.name}`));
  }
};
