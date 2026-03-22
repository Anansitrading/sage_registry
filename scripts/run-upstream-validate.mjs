import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT, listCatalogFolders } from './lib.mjs';

const folders = listCatalogFolders().map((folder) => join('agents', folder));

if (folders.length === 0) {
  console.log('No agent folders found to validate with upstream validator.');
  process.exit(0);
}

execFileSync('npx', ['tsx', 'scripts/validate.ts', ...folders], {
  cwd: ROOT,
  stdio: 'inherit',
});
