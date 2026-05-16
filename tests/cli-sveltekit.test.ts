import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { TPLS } from '../src/cli/templates';
import { detectProject, type PackageJson } from '../src/cli/utils';

const makeTempDir = (): string => fs.mkdtempSync(path.join(os.tmpdir(), 'ai-guardrails-sveltekit-'));

describe('SvelteKit CLI init support', () => {
  it('detects SvelteKit projects before generic Vite handling', () => {
    const cwd = makeTempDir();
    const pkg: PackageJson = {
      dependencies: {
        '@sveltejs/kit': '^2.0.0',
        vite: '^7.0.0'
      }
    };

    const detected = detectProject(cwd, pkg);

    expect(detected.isSvelteKit).toBe(true);
    expect(detected.isVite).toBe(true);
  });

  it('detects SvelteKit from the config file when dependencies are sparse', () => {
    const cwd = makeTempDir();
    fs.mkdirSync(path.join(cwd, 'src/routes'), { recursive: true });
    fs.writeFileSync(path.join(cwd, 'svelte.config.js'), 'export default {};\n', 'utf8');

    const detected = detectProject(cwd, {});

    expect(detected.isSvelteKit).toBe(true);
  });

  it('does not treat every Svelte Vite project as SvelteKit', () => {
    const cwd = makeTempDir();
    const pkg: PackageJson = {
      devDependencies: {
        '@sveltejs/vite-plugin-svelte': '^6.0.0',
        vite: '^7.0.0'
      }
    };

    const detected = detectProject(cwd, pkg);

    expect(detected.isSvelteKit).toBe(false);
    expect(detected.isVite).toBe(true);
  });

  it('generates Svelte-aware lint and typecheck templates', () => {
    const { eslintConfigMjs, packageScripts } = TPLS.sveltekit;

    expect(eslintConfigMjs).toContain("import svelte from 'eslint-plugin-svelte'");
    expect(eslintConfigMjs).toContain("...svelte.configs['flat/recommended']");
    expect(eslintConfigMjs).toContain("files: ['**/*.svelte']");
    expect(eslintConfigMjs).toContain("'ai-guardrails/no-orphan-todos': 'error'");
    expect(eslintConfigMjs).toContain('parser: tseslint.parser');

    expect(packageScripts.lint).toBe('eslint .');
    expect(packageScripts.typecheck).toContain('svelte-check --tsconfig ./tsconfig.json');
    expect(packageScripts.check).toBe(packageScripts.typecheck);
    expect(packageScripts.build).toContain('npm run lint');
    expect(packageScripts.build).toContain('npm run typecheck');
  });
});
