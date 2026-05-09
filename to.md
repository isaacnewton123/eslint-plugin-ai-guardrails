# vite 

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
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
```

### eslint.config.js

```javascript
import js from '@eslint/js'
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
```

### package.json

```json
  "scripts": {
    "dev": "vite",
    "build": "bun run typecheck && bun run lint && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  ```

  ### tsconfig.app.json

  ```json
  {
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": [
      "ES2023",
      "DOM"
    ],
    "module": "esnext",
    "types": [
      "vite/client"
    ],
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "composite": true
  },
  "include": [
    "src"
  ]
}
```


### tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": [
      "ES2023"
    ],
    "module": "esnext",
    "types": [
      "node"
    ],
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "composite": true
  },
  "include": [
    "vite.config.ts"
  ]
}
```


### tsconfig.json

```json

//note : only for tsconfig.json on vite , please delete all config firs and replace with this , if can't, please just comment everything

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

```

# nextjs

### eslint.config.mjs

```javascript
import js from '@eslint/js'
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
```


### package.json

```json
  "scripts": {
    "dev": "next dev",
    "build": "bun run lint && bun run typecheck && next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:watch": "bunx nodemon --exec \"eslint .\" --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  },
  ```

  # elysia


  ### package.json

  ```json
    "scripts": {
    "dev": "next dev",
    "build": "bun run lint && bun run typecheck && next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:watch": "bunx nodemon --exec \"eslint .\" --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  },
  ```

  ### eslint.config.mjs 

  ```javascript
  import tseslint from 'typescript-eslint'
import aiGuardrails from 'eslint-plugin-ai-guardrails'

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  ...tseslint.configs.recommended,
  aiGuardrails.flatConfigs.recommended
]
```
 