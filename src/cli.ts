#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

type PackageJson = {
  type?: string;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
};

type DetectedProject = {
  isVite: boolean;
  isNext: boolean;
  isNest: boolean;
  isElysia: boolean;
  isReact: boolean;
};

type TsConfig = {
  compilerOptions?: Record<string, unknown>;
  include?: string[];
  exclude?: string[];
  extends?: string;
  [key: string]: unknown;
};

const readJson = <T>(filePath: string): T | null => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
};

const fileExists = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const writeJson = (filePath: string, value: unknown): void => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const existsAny = (cwd: string, names: string[]): boolean =>
  names.some((name) => fs.existsSync(path.join(cwd, name)));

const detectPackageManager = (cwd: string): 'npm' | 'pnpm' | 'yarn' | 'bun' => {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
};

const run = (cwd: string, command: string, args: string[]): void => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const info = (message: string): void => {
  // eslint-disable-next-line no-console
  console.log(`ai-guardrails: ${message}`);
};

const warn = (message: string): void => {
  // eslint-disable-next-line no-console
  console.warn(`ai-guardrails: ${message}`);
};

const error = (message: string): never => {
  // eslint-disable-next-line no-console
  console.error(`ai-guardrails: ${message}`);
  process.exit(1);
};

const getInstalledDeps = (pkg: PackageJson): Set<string> => {
  const installed = new Set<string>();
  for (const record of [pkg.dependencies, pkg.devDependencies]) {
    for (const name of Object.keys(record ?? {})) {
      installed.add(name);
    }
  }
  return installed;
};

const ensureDevDeps = (
  cwd: string,
  pkg: PackageJson,
  packageManager: string,
  extraDevDeps: string[] = []
): void => {
  const required = ['eslint', 'eslint-plugin-ai-guardrails', '@typescript-eslint/parser', 'typescript', 'typescript-eslint'];

  const installed = getInstalledDeps(pkg);
  const requested = [...required, ...extraDevDeps];
  const missing = requested.filter((name) => !installed.has(name));
  if (missing.length === 0) {
    info('All required dependencies already present; skipping install.');
    return;
  }

  const installArgsByPm: Record<string, string[]> = {
    npm: ['install', '--save-dev', ...missing],
    pnpm: ['add', '-D', ...missing],
    yarn: ['add', '-D', ...missing],
    bun: ['add', '-d', ...missing]
  };

  const args = installArgsByPm[packageManager];
  run(cwd, packageManager, args);
};

const eslintConfigTemplate = `import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
]
`;

const detectProject = (cwd: string, pkg: PackageJson): DetectedProject => {
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

  return {
    isVite: Boolean(deps.vite) || existsAny(cwd, ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.cjs']),
    isNext: Boolean(deps.next),
    isNest: Boolean(deps['@nestjs/core']) || Boolean(deps['@nestjs/common']),
    isElysia: Boolean(deps.elysia) || existsAny(cwd, ['bun.lock', 'bun.lockb']),
    isReact: Boolean(deps.react)
  };
};

const readTextIfExists = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
};

const writeText = (filePath: string, content: string): void => {
  fs.writeFileSync(filePath, content, 'utf8');
};

const findViteConfigPath = (cwd: string): string | null => {
  const candidates = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.cjs'];
  for (const candidate of candidates) {
    const fullPath = path.join(cwd, candidate);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
};

const ensureViteChecker = (cwd: string): void => {
  const viteConfigPath = findViteConfigPath(cwd);
  if (!viteConfigPath) {
    warn('Vite detected but no vite.config.* found; skipping vite-plugin-checker wiring.');
    return;
  }

  const original = readTextIfExists(viteConfigPath);
  if (!original) {
    warn('Could not read Vite config; skipping vite-plugin-checker wiring.');
    return;
  }

  if (original.includes('vite-plugin-checker')) {
    info('vite-plugin-checker already present; skipping Vite wiring.');
    return;
  }

  // Add import.
  let updated = original;
  updated = updated.replace(
    /(^import\s+\{\s*defineConfig\s*\}\s+from\s+['"]vite['"]\s*[\r\n]+)/u,
    `$1import checker from 'vite-plugin-checker'\n`
  );

  // Add plugin usage (best-effort).
  const checkerSnippet = `checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}" --max-warnings 0'
      }
    })`;

  if (updated.includes('plugins: [') && !updated.includes('checker({')) {
    updated = updated.replace(/plugins:\s*\[(.*?)\]/su, (match, inner) => {
      const trimmedInner = String(inner).trim();
      if (trimmedInner.length === 0) {
        return `plugins: [${checkerSnippet}]`;
      }
      return `plugins: [${trimmedInner},\n    ${checkerSnippet}]`;
    });
  } else if (!updated.includes('checker({')) {
    warn('Could not safely patch Vite plugins array; skipping Vite wiring.');
    return;
  }

  writeText(viteConfigPath, updated);
  info(`Wired vite-plugin-checker in ${path.basename(viteConfigPath)}`);
};

const ensureTsConfig = (cwd: string, detected: DetectedProject): void => {
  const tsconfigPath = path.join(cwd, 'tsconfig.json');
  const tsconfigExists = fileExists(tsconfigPath);
  const existing = readJson<TsConfig>(tsconfigPath);

  const baselineCompilerOptions: Record<string, unknown> = {
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true
  };

  const frameworkCompilerOptions: Record<string, unknown> = {};
  if (detected.isVite) {
    frameworkCompilerOptions.moduleResolution = 'bundler';
    frameworkCompilerOptions.noEmit = true;
    frameworkCompilerOptions.types = ['vite/client'];
  }
  if (detected.isReact) {
    frameworkCompilerOptions.jsx = 'react-jsx';
  }

  const baseline: TsConfig = {
    compilerOptions: {
      ...baselineCompilerOptions,
      ...frameworkCompilerOptions
    },
    include: ['src/**/*.ts', 'src/**/*.tsx']
  };

  if (!existing && !tsconfigExists) {
    writeJson(tsconfigPath, baseline);
    info('Created tsconfig.json (strict TypeScript baseline).');
    return;
  }

  if (!existing && tsconfigExists) {
    warn('Existing tsconfig.json is not valid JSON; skipping tsconfig changes to avoid destructive overwrite.');
    return;
  }

  const safeExisting = existing as TsConfig;
  const compilerOptions = { ...(safeExisting.compilerOptions ?? {}) };
  for (const [key, value] of Object.entries(baseline.compilerOptions ?? {})) {
    if (!(key in compilerOptions)) {
      compilerOptions[key] = value;
    }
  }

  if (Array.isArray(compilerOptions.types) && Array.isArray(baseline.compilerOptions?.types)) {
    compilerOptions.types = Array.from(new Set([...(compilerOptions.types as unknown[]), ...(baseline.compilerOptions?.types as unknown[])]));
  }

  const include = Array.from(new Set([...(safeExisting.include ?? []), ...(baseline.include ?? [])]));

  const merged: TsConfig = {
    ...safeExisting,
    compilerOptions,
    include
  };

  writeJson(tsconfigPath, merged);
  info('Updated tsconfig.json (added safe strict defaults if missing).');
};

const init = (cwd: string): void => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const pkg = readJson<PackageJson>(packageJsonPath);
  if (!pkg) {
    error('package.json not found (run in a Node project).');
  }
  const packageJson = pkg as PackageJson;

  const hasFlatConfig = existsAny(cwd, ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts']);
  const hasLegacyConfig = existsAny(cwd, ['.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.yaml', '.eslintrc.yml']);
  const detected = detectProject(cwd, packageJson);
  ensureTsConfig(cwd, detected);

  if (!hasFlatConfig && !hasLegacyConfig) {
    // Prefer flat config for new projects.
    fs.writeFileSync(path.join(cwd, 'eslint.config.mjs'), eslintConfigTemplate, 'utf8');
    info('Created eslint.config.mjs');
  } else {
    info('ESLint config already exists; not overwriting.');
  }

  const scripts = { ...(packageJson.scripts ?? {}) };
  if (!scripts.lint) {
    scripts.lint = 'eslint . --ext .ts,.tsx,.mts,.cts --max-warnings 0';
  } else {
    info('lint script already exists; not overwriting.');
  }

  if (!scripts.typecheck) {
    scripts.typecheck = 'tsc --noEmit';
  }

  if (!scripts.build) {
    if (detected.isNext) {
      scripts.build = 'npm run lint && npm run typecheck && next build';
    } else if (detected.isNest) {
      scripts.build = 'npm run lint && npm run typecheck && nest build';
    } else {
      scripts.build = 'npm run lint && npm run typecheck';
    }
  } else {
    info('build script already exists; not overwriting.');
  }

  packageJson.scripts = scripts;
  writeJson(packageJsonPath, packageJson);
  info('Updated package.json scripts (lint/typecheck/build).');

  const pm = detectPackageManager(cwd);
  const extraDevDeps: string[] = [];
  if (detected.isVite) {
    extraDevDeps.push('vite-plugin-checker');
  }
  ensureDevDeps(cwd, packageJson, pm, extraDevDeps);

  if (detected.isVite) {
    ensureViteChecker(cwd);
  }

  info('Done.');
};

const [, , cmd] = process.argv;
const cwd = process.cwd();

if (!cmd || cmd === '--help' || cmd === '-h') {
  // eslint-disable-next-line no-console
  console.log(`ai-guardrails

Usage:
  ai-guardrails init

Creates ESLint config + strict scripts and installs required deps.
Also performs best-effort integration wiring for detected frameworks (e.g. Vite).
`);
  process.exit(0);
}

if (cmd === 'init') {
  init(cwd);
  process.exit(0);
}

// eslint-disable-next-line no-console
console.error(`ai-guardrails: unknown command "${cmd}". Use --help.`);
process.exit(1);

