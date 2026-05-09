export const c = {
  reset: '\x1b[0m',
  green: (m: string) => `\x1b[32m${m}\x1b[0m`,
  yellow: (m: string) => `\x1b[33m${m}\x1b[0m`,
  cyan: (m: string) => `\x1b[36m${m}\x1b[0m`,
  red: (m: string) => `\x1b[31m${m}\x1b[0m`,
  magenta: (m: string) => `\x1b[35m${m}\x1b[0m`,
  bold: (m: string) => `\x1b[1m${m}\x1b[0m`,
};
