# ai-guardrails/no-ai-obvious-comments

> **Type**: `suggestion` · **Default**: `warn` · **Fixable**: No

Detects comments that simply restate the following line of code.

## Why This Rule Matters

AI coding assistants frequently generate comments like `// Set x to 5` above `const x = 5`, or `// Increase counter` above `i++`. These comments add noise without adding understanding. They restate *what* the code does instead of explaining *why*.

Good comments explain intent, edge cases, or non-obvious behavior. This rule catches the obvious ones so your codebase stays signal-rich.

## How Detection Works

The rule uses heuristic analysis to compare each inline comment (`//`) with the statement directly below it:

1. Extracts words from the comment
2. Extracts identifiers and string literals from the next statement
3. Checks for significant overlap between comment words and code tokens
4. Flags comments that match trigger patterns (e.g., "set", "assign", "increase", "increment", "decrease", "decrement", "counter")

The rule only checks **line comments** (`//`), not block comments (`/* */`). It only checks comments that are immediately followed by a statement on the next line.

## Examples

### ❌ Invalid

```ts
// Set x to 5
const x = 5;

// Increase counter
i++;

// Assign value
const value = 42;

// Increment counter
counter += 1;

// Decrease count
count--;
```

### ✅ Valid

```ts
// Keep this call here because auth headers are injected by side effect.
initializeRequestContext();

// Use UTC here to avoid timezone drift in monthly reports.
const monthKey = toUtcMonthKey(inputDate);

// Retry up to 3 times — the upstream API has transient 503 errors.
const result = await fetchWithRetry(url, { retries: 3 });

// This regex handles the edge case where emails contain "+" aliases.
const normalized = email.replace(/\+.*@/, '@');
```

## Options

This rule has no configuration options. It uses built-in heuristics to detect obvious comments.

## When Not To Use This Rule

- Codebases with strict documentation requirements that mandate comments on every statement (e.g., some government or medical software standards)
- Generated documentation blocks (JSDoc) — this rule only targets inline `//` comments, not block comments
- If your team uses comments primarily as section dividers rather than explanations
