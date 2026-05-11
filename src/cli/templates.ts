export const TPLS = {
  vite: {
    viteConfigTs: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      }
    }),
  ],
})
`,
    eslintConfigJs: `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules']),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  aiGuardrails.flatConfigs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
`,
    packageScripts: {
      dev: "vite",
      build: "bun run typecheck && bun run lint && vite build",
      lint: "eslint .",
      preview: "vite preview",
      typecheck: "tsc --noEmit"
    },
    tsconfigAppJson: {
      "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "target": "es2023",
        "lib": ["ES2023", "DOM"],
        "module": "esnext",
        "types": ["vite/client"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "noEmit": true,
        "jsx": "react-jsx",
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": true,
        "noFallthroughCasesInSwitch": true,
        "composite": true
      },
      "include": ["src"]
    },
    tsconfigNodeJson: {
      "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        "target": "es2023",
        "lib": ["ES2023"],
        "module": "esnext",
        "types": ["node"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "noEmit": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": true,
        "noFallthroughCasesInSwitch": true,
        "composite": true
      },
      "include": ["vite.config.ts"]
    },
    tsconfigJson: `

{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
}
`
  },
  nextjs: {
    eslintConfigMjs: `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules']),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  aiGuardrails.flatConfigs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
`,
    packageScripts: {
      dev: "next dev",
      build: "bun run lint && bun run typecheck && next build",
      start: "next start",
      lint: "eslint .",
      "lint:watch": "bunx nodemon --exec \"eslint .\" --ext ts,tsx",
      typecheck: "tsc --noEmit"
    }
  },
  nestjs: {
    eslintConfigMjs: `import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'

export default [
  { ignores: ['dist', 'coverage', 'node_modules'] },
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      'ai-guardrails/max-file-lines': ['warn', { max: 250 }],
      'ai-guardrails/max-function-lines': ['warn', { max: 40 }],
    },
  },
]
`,
    packageScripts: {
      lint: "eslint \"src/**/*.ts\" --max-warnings 0",
      typecheck: "tsc --noEmit",
      build: "npm run lint && npm run typecheck && nest build"
    }
  },
  elysia: {
    eslintConfigMjs: `import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
]
`,
    packageScripts: {
      test: "echo \"Error: no test specified\" && exit 1",
      dev: "bun run --watch src/index.ts",
      lint: "eslint . --max-warnings 0",
      typecheck: "tsc --noEmit",
      build: "bun run lint && bun run typecheck"
    }
  },
  generic: {
    eslintConfigAppend: `\n// Inserted by AI-Guardrails\nimport aiGuardrails from 'eslint-plugin-ai-guardrails';\n\nexport default [\n  // ... existing config\n  aiGuardrails.flatConfigs.recommended,\n];\n`
  }
};
