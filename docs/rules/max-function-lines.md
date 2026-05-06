# ai-guardrails/max-function-lines

> **Type**: `suggestion` · **Default**: `warn` · **Fixable**: No

Limits the number of effective lines inside function and method bodies to prevent "god functions."

## Why This Rule Matters

AI coding tools commonly generate monolithic functions that handle validation, business logic, error handling, and formatting all in one block. These functions are hard to test in isolation, difficult to debug, and encourage copy-paste over composition.

This rule catches function bloat early so you can decompose into smaller, focused helpers.

## What It Checks

- Function declarations (`function foo() {}`)
- Function expressions (`const foo = function() {}`)
- Arrow functions with block bodies (`const foo = () => {}`)
- Class methods and object methods
- Nested functions (each is checked independently)

Arrow functions with expression bodies (e.g., `const fn = () => 42`) are not checked since they are inherently single-expression.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | `number` | `50` | Maximum effective lines per function body |
| `skipBlankLines` | `boolean` | `true` | Don't count blank lines |
| `skipComments` | `boolean` | `true` | Don't count comment-only lines |
| `skipSingleLine` | `boolean` | `false` | Ignore single-line functions |

```json
{
  "rules": {
    "ai-guardrails/max-function-lines": ["warn", { "max": 50, "skipBlankLines": true, "skipComments": true }]
  }
}
```

## Examples

### ❌ Invalid — function too long

```ts
function processOrder(order: Order) {
  // Validate input
  if (!order.id) throw new Error('Missing ID');
  if (!order.items.length) throw new Error('Empty order');
  // ...20 lines of validation

  // Calculate totals
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  // ...15 lines of calculation

  // Format response
  const response = { id: order.id, total, status: 'processed' };
  // ...15 lines of formatting

  return response;
}
```

### ✅ Valid — decomposed into helpers

```ts
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order.items);
  return formatOrderResponse(order, total);
}

function validateOrder(order: Order): void {
  if (!order.id) throw new Error('Missing ID');
  if (!order.items.length) throw new Error('Empty order');
}

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## Custom Configuration

Lower the limit for strict teams:

```json
["warn", { "max": 30, "skipComments": true }]
```

Skip single-line utility functions:

```json
["warn", { "max": 50, "skipSingleLine": true }]
```

## When Not To Use This Rule

- Reducer functions with many cases (consider extracting case handlers instead)
- Configuration objects that look like functions (e.g., long `switch` blocks)
- Test setup functions that need extensive inline mocking
