import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const built = readFileSync(resolve(root, 'dist', 'index.html'), 'utf8');

const rewritten = built
  .replace(
    /(href|src)="\.\/gwent-checklist\.(css|js)"/g,
    '$1="./dist/gwent-checklist.$2"',
  )
  .replace(
    /(href|src)="\/gwent-checklist\.(css|js)"/g,
    '$1="./dist/gwent-checklist.$2"',
  );

writeFileSync(resolve(root, 'index.html'), rewritten, 'utf8');
console.log('Wrote production root index.html → ./dist/gwent-checklist.*');
