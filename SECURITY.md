# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Active |
| < 1.0   | ❌ No     |

## Reporting a Vulnerability

If you discover a security vulnerability in `eslint-plugin-ai-guardrails`, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email the maintainer directly or use [GitHub's private vulnerability reporting](https://github.com/isaacnewton123/eslint-plugin-ai-guardrails/security/advisories/new).

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: within 48 hours
- **Assessment**: within 7 days
- **Fix release**: as soon as practical, typically within 14 days

## Scope

This package is a **development-only ESLint plugin**. It:

- Runs only during development/CI (not in production bundles)
- Does not make network requests
- Does not access sensitive data
- Does not execute arbitrary code beyond ESLint rule evaluation

The primary security concern is supply chain integrity — ensuring the published package matches the source repository.

## Best Practices

- Always install from npm: `npm install --save-dev eslint-plugin-ai-guardrails`
- Verify the package integrity using `npm audit`
- Pin dependency versions in `package-lock.json`
