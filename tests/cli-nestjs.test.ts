import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { TPLS } from '../src/cli/templates';
import { detectProject, selectProjectKind } from '../src/cli/utils';

const withTempProject = (fn: (cwd: string) => void): void => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-guardrails-nestjs-'));
  try {
    fn(cwd);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
};

describe('NestJS CLI init support', () => {
  it('detects NestJS from package dependencies', () => {
    withTempProject((cwd) => {
      const detected = detectProject(cwd, {
        dependencies: {
          '@nestjs/core': '^10.0.0'
        }
      });

      expect(detected.isNest).toBe(true);
      expect(selectProjectKind(detected)).toBe('nestjs');
    });
  });

  it('detects NestJS from nest-cli.json', () => {
    withTempProject((cwd) => {
      fs.writeFileSync(path.join(cwd, 'nest-cli.json'), '{}\n', 'utf8');

      const detected = detectProject(cwd, {});

      expect(detected.isNest).toBe(true);
      expect(selectProjectKind(detected)).toBe('nestjs');
    });
  });

  it('routes NestJS before the generic and Elysia flows', () => {
    const projectKind = selectProjectKind({
      isVite: false,
      isNext: false,
      isNest: true,
      isElysia: true
    });

    expect(projectKind).toBe('nestjs');
  });

  it('provides NestJS-specific config and scripts', () => {
    expect(TPLS.nestjs.eslintConfigMjs).toContain("ignores: ['dist', 'coverage', 'node_modules']");
    expect(TPLS.nestjs.eslintConfigMjs).toContain('aiGuardrails.flatConfigs.recommended');
    expect(TPLS.nestjs.eslintConfigMjs).toContain("'ai-guardrails/max-function-lines': ['warn', { max: 40 }]");
    expect(TPLS.nestjs.packageScripts).toEqual({
      lint: 'eslint "src/**/*.ts" --max-warnings 0',
      typecheck: 'tsc --noEmit',
      build: 'npm run lint && npm run typecheck && nest build'
    });
  });
});
