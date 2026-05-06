# ai-guardrails/max-file-lines

> **Type**: `suggestion` · **Default**: `warn` · **Fixable**: No

Prevents "god files" by capping the effective line count of a file.

## Why This Rule Matters

AI coding assistants tend to keep appending code to the same file rather than creating new modules. This quickly produces 500+ line files that are hard to review, test, and maintain. The result is "god files" — monolithic modules that do too many things.

This rule catches file growth early so you can split before it becomes painful.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | `number` | `300` | Maximum effective lines per file |
| `skipBlankLines` | `boolean` | `true` | Don't count blank lines |
| `skipComments` | `boolean` | `true` | Don't count comment-only lines |

```json
{
  "rules": {
    "ai-guardrails/max-file-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }]
  }
}
```

## Examples

### ❌ Invalid — file exceeds limit

```ts
// A 400-line file with service logic, utilities, types, and constants
// all mixed together. AI tools commonly produce this pattern.
export class UserService { /* ... */ }
export function validateEmail() { /* ... */ }
export function formatPhone() { /* ... */ }
export type UserProfile = { /* ... */ };
export const ROLES = { /* ... */ };
// ...hundreds more lines
```

### ✅ Valid — properly split modules

```ts
// user.service.ts (focused, under 300 lines)
export class UserService {
  findById(id: string) { /* ... */ }
  create(data: CreateUserDto) { /* ... */ }
}
```

```ts
// user.validators.ts (separate module)
export function validateEmail(email: string): boolean { /* ... */ }
export function formatPhone(phone: string): string { /* ... */ }
```

## Custom Configuration

Lower the limit for stricter teams:

```json
["warn", { "max": 200, "skipComments": true }]
```

Or raise it for legacy codebases you're gradually refactoring:

```json
["warn", { "max": 500 }]
```

## When Not To Use This Rule

- Generated files (GraphQL codegen, Prisma, etc.) — add these to `.eslintignore` or the `ignores` array instead
- Test files that intentionally need many inline test cases
- Migration files
