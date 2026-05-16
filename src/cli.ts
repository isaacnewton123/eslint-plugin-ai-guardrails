#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import * as readline from 'node:readline';

import { c } from './cli/colors';
import { TPLS } from './cli/templates';
import {
  type PackageJson,
  readJson,
  writeJson,
  writeText,
  fileExists,
  removeFileIfExists,
  detectProject,
  detectPackageManager,
  ensureDeps
} from './cli/utils';
import { generateAiRules } from './cli/ai-rules';

const runInit = async (cwd: string) => {
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!fileExists(packageJsonPath)) {
    console.error(c.red('❌ package.json not found. Please run this command in the root of your Node.js project.'));
    process.exit(1);
  }

  console.log(c.magenta(c.bold(`\n🚀 AI-Guardrails Init - Let's clean up your code vibe!\n`)));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (q: string): Promise<string> => new Promise((resolve) => rl.question(q, resolve));

  const answer = await question(c.yellow('⚠️ WARNING: This will overwrite your existing configs to match AI-Guardrails standards. Proceed? (y/n): '));
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log(c.cyan('Operation cancelled. Your vibe remains untouched. 😎'));
    rl.close();
    process.exit(0);
  }
  rl.close();

  const pkg = readJson<PackageJson>(packageJsonPath);
  if (!pkg) {
    console.error(c.red('❌ Failed to parse package.json.'));
    process.exit(1);
  }

  const detected = detectProject(cwd, pkg);
  const pm = detectPackageManager(cwd);

  const updateScripts = (scripts: Record<string, string>) => {
    pkg.scripts = { ...(pkg.scripts || {}), ...scripts };
    writeJson(packageJsonPath, pkg);
    console.log(c.green('Patching package.json... Done!'));
  };

  const removeLegacyEslint = () => {
    ['.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.yaml', '.eslintrc.yml'].forEach(f => removeFileIfExists(path.join(cwd, f)));
  };

  if (detected.isSvelteKit) {
    console.log(c.cyan('🛠️  SvelteKit configuration detected. Applying SvelteKit templates...'));

    removeLegacyEslint();
    writeText(path.join(cwd, 'eslint.config.mjs'), TPLS.sveltekit.eslintConfigMjs);
    console.log(c.green('Patching eslint.config.mjs... Done!'));

    updateScripts(TPLS.sveltekit.packageScripts);
    ensureDeps(cwd, pkg, pm, ['@eslint/js', 'eslint-plugin-svelte', 'svelte-eslint-parser', 'svelte-check', 'globals']);
  } else if (detected.isVite) {
    console.log(c.cyan('🛠️  Vite configuration detected. Applying Vite templates...'));

    writeText(path.join(cwd, 'vite.config.ts'), TPLS.vite.viteConfigTs);
    console.log(c.green('Patching vite.config.ts... Done!'));

    removeLegacyEslint();
    writeText(path.join(cwd, 'eslint.config.js'), TPLS.vite.eslintConfigJs);
    console.log(c.green('Patching eslint.config.js... Done!'));

    writeJson(path.join(cwd, 'tsconfig.app.json'), TPLS.vite.tsconfigAppJson);
    console.log(c.green('Patching tsconfig.app.json... Done!'));

    writeJson(path.join(cwd, 'tsconfig.node.json'), TPLS.vite.tsconfigNodeJson);
    console.log(c.green('Patching tsconfig.node.json... Done!'));

    writeText(path.join(cwd, 'tsconfig.json'), TPLS.vite.tsconfigJson);
    console.log(c.green('Patching tsconfig.json... Done!'));

    updateScripts(TPLS.vite.packageScripts);
    ensureDeps(cwd, pkg, pm, ['vite-plugin-checker', 'globals', 'eslint-plugin-react-hooks', 'eslint-plugin-react-refresh']);
  } else if (detected.isNext) {
    console.log(c.cyan('🛠️  Next.js configuration detected. Applying Next.js templates...'));

    removeLegacyEslint();
    writeText(path.join(cwd, 'eslint.config.mjs'), TPLS.nextjs.eslintConfigMjs);
    console.log(c.green('Patching eslint.config.mjs... Done!'));

    updateScripts(TPLS.nextjs.packageScripts);
    ensureDeps(cwd, pkg, pm, ['globals', 'eslint-plugin-react-hooks', 'eslint-plugin-react-refresh']);
  } else if (detected.isElysia) {
    console.log(c.cyan('🛠️  Elysia configuration detected. Applying Elysia templates...'));

    removeLegacyEslint();
    writeText(path.join(cwd, 'eslint.config.mjs'), TPLS.elysia.eslintConfigMjs);
    console.log(c.green('Patching eslint.config.mjs... Done!'));

    updateScripts(TPLS.elysia.packageScripts);
    ensureDeps(cwd, pkg, pm);
  } else {
    console.log(c.cyan('🛠️  Generic/NestJS configuration detected. Applying base templates...'));

    // Generic fallback
    const configPath = fileExists(path.join(cwd, 'eslint.config.js')) ? 'eslint.config.js' : 'eslint.config.mjs';
    if (!fileExists(path.join(cwd, configPath))) {
      writeText(path.join(cwd, configPath), TPLS.elysia.eslintConfigMjs); // Reuse simple config
    } else {
      const content = fs.readFileSync(path.join(cwd, configPath), 'utf8');
      if (!content.includes('eslint-plugin-ai-guardrails')) {
        writeText(path.join(cwd, configPath), content + TPLS.generic.eslintConfigAppend);
      }
    }
    console.log(c.green(`Patching ${configPath}... Done!`));

    updateScripts({
      lint: "eslint .",
      typecheck: "tsc --noEmit"
    });
    ensureDeps(cwd, pkg, pm);
  }

  generateAiRules(cwd);

  console.log(c.magenta(c.bold(`\n✨ Setup Complete! Your project is now AI-safe.\nPowered by @isaacnewton123\n`)));
};

const [, , cmd] = process.argv;

if (cmd === 'init') {
  runInit(process.cwd()).catch(err => {
    console.error(c.red(err.message));
    process.exit(1);
  });
} else {
  console.log(c.yellow(`Usage: npx eslint-plugin-ai-guardrails init`));
}
