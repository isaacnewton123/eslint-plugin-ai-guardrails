const fs = require('node:fs');
const path = require('node:path');

const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');

if (!fs.existsSync(cliPath)) {
  process.exit(0);
}

const contents = fs.readFileSync(cliPath, 'utf8');
const shebang = '#!/usr/bin/env node\n';

if (!contents.startsWith(shebang)) {
  fs.writeFileSync(cliPath, `${shebang}${contents}`, 'utf8');
}

