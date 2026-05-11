import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { c } from './colors';

export type PackageJson = {
  type?: string;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
};

export type DetectedProject = {
  isVite: boolean;
  isNext: boolean;
  isNest: boolean;
  isElysia: boolean;
};

export type ProjectKind = 'vite' | 'nextjs' | 'nestjs' | 'elysia' | 'generic';

export const readJson = <T>(filePath: string): T | null => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
};

export const writeJson = (filePath: string, value: unknown): void => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

export const writeText = (filePath: string, content: string): void => {
  fs.writeFileSync(filePath, content, 'utf8');
};

export const fileExists = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

export const removeFileIfExists = (filePath: string): void => {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const detectProject = (cwd: string, pkg: PackageJson): DetectedProject => {
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  return {
    isVite: Boolean(deps.vite) || fileExists(path.join(cwd, 'vite.config.ts')),
    isNext: Boolean(deps.next),
    isNest: Boolean(deps['@nestjs/core']) || Boolean(deps['@nestjs/common']) || fileExists(path.join(cwd, 'nest-cli.json')),
    isElysia: Boolean(deps.elysia) || fileExists(path.join(cwd, 'bun.lock')) || fileExists(path.join(cwd, 'bun.lockb')),
  };
};

export const selectProjectKind = (detected: DetectedProject): ProjectKind => {
  if (detected.isVite) return 'vite';
  if (detected.isNext) return 'nextjs';
  if (detected.isNest) return 'nestjs';
  if (detected.isElysia) return 'elysia';
  return 'generic';
};

export const detectPackageManager = (cwd: string): 'npm' | 'pnpm' | 'yarn' | 'bun' => {
  if (fileExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fileExists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fileExists(path.join(cwd, 'bun.lockb')) || fileExists(path.join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
};

export const runCommand = (cwd: string, command: string, args: string[]): void => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(c.red(`Failed to execute: ${command} ${args.join(' ')}`));
    process.exit(result.status ?? 1);
  }
};

export const getInstalledDeps = (pkg: PackageJson): Set<string> => {
  const installed = new Set<string>();
  for (const record of [pkg.dependencies, pkg.devDependencies]) {
    for (const name of Object.keys(record ?? {})) {
      installed.add(name);
    }
  }
  return installed;
};

export const ensureDeps = (cwd: string, pkg: PackageJson, pm: string, additionalDevDeps: string[] = []): void => {
  const required = ['eslint', 'eslint-plugin-ai-guardrails', '@typescript-eslint/parser', 'typescript', 'typescript-eslint', ...additionalDevDeps];
  const installed = getInstalledDeps(pkg);
  const missing = required.filter((name) => !installed.has(name));

  if (missing.length === 0) return;

  console.log(c.cyan(`Installing missing dependencies: ${missing.join(', ')}...`));
  const installArgsByPm: Record<string, string[]> = {
    npm: ['install', '--save-dev', ...missing],
    pnpm: ['add', '-D', ...missing],
    yarn: ['add', '-D', ...missing],
    bun: ['add', '-d', ...missing]
  };

  runCommand(cwd, pm, installArgsByPm[pm]);
};
