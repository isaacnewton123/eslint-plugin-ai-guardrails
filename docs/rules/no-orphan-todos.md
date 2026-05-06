# ai-guardrails/no-orphan-todos

> **Type**: `problem` · **Default**: `error` · **Fixable**: No

Requires `TODO`, `FIXME`, and `HACK` comments to include a tracking reference (URL or issue number) and/or a deadline.

## Why This Rule Matters

AI coding tools frequently insert vague TODO comments like `// TODO: implement this later` with no tracking information. These orphan TODOs accumulate silently — they never get triaged, prioritized, or cleaned up. Over time they become invisible tech debt.

This rule enforces that every TODO-style comment is actionable: linked to an issue tracker or given an expiration date.

## What It Checks

Scans **all comments** (line and block) for the keywords `TODO`, `FIXME`, or `HACK` (case-insensitive) and enforces:

- **Reference** (when `requireReference: true`): a URL (`https://...`) or issue number (`#123`)
- **Date** (when `requireDate: true`): a valid date in `YYYY-MM-DD` format

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requireReference` | `boolean` | `true` | Require a URL or `#123` issue reference |
| `requireDate` | `boolean` | `false` | Require a `YYYY-MM-DD` date |
| `dateFormat` | `string` | `"YYYY-MM-DD"` | Expected date format |

```json
{
  "rules": {
    "ai-guardrails/no-orphan-todos": ["error", { "requireReference": true, "requireDate": false }]
  }
}
```

## Examples

### ✅ Valid

```ts
// TODO: https://github.com/user/repo/issues/42
const temp = useWorkaround();

// FIXME #199: handle null cache state after cold start
const cache = getOrCreateCache();

// HACK(2026-08-01): temporary workaround for upstream bug
const result = legacyApiCall();

// TODO(2027-01-15) #42: migrate to v2 API before deadline
await sendRequest();
```

### ❌ Invalid

```ts
// TODO implement this later
const placeholder = null;

// FIXME: clean this up someday
const messy = buildOutput();

// HACK quick workaround
const patched = applyPatch();

// todo: fix later (case-insensitive, still caught)
return fallback();
```

## Recommended Policy

### For most teams (default)

Require a reference — every TODO should link to something trackable:

```json
["error", { "requireReference": true }]
```

### For strict teams

Require both a reference and a deadline:

```json
["error", { "requireReference": true, "requireDate": true }]
```

### For adoption phase

Start with just warnings to surface orphan TODOs without blocking:

```json
["warn", { "requireReference": true }]
```

## When Not To Use This Rule

- Codebases that don't use an issue tracker (though you should consider starting)
- Rapid prototyping phases where you intentionally want quick TODOs (disable temporarily)
