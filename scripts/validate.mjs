import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  ROOT,
  listCatalogFolders,
  parseArgs,
  readJson,
} from './lib.mjs';

const schema = readJson(join(ROOT, 'schema', 'metadata.schema.json'));
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

function validateFolder(folder) {
  const errors = [];
  const warnings = [];
  const absFolder = resolve(folder);
  const metadataPath = join(absFolder, 'metadata.json');
  const readmePath = join(absFolder, 'README.md');

  if (!existsSync(metadataPath)) {
    errors.push('metadata.json not found');
    return { pass: false, errors, warnings };
  }

  let metadata;
  try {
    metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
  } catch (error) {
    errors.push(`metadata.json is not valid JSON: ${error.message}`);
    return { pass: false, errors, warnings };
  }

  if (!validateSchema(metadata)) {
    for (const issue of validateSchema.errors ?? []) {
      errors.push(`Schema: ${issue.instancePath} ${issue.message}`);
    }
  }

  if (!existsSync(readmePath) || readFileSync(readmePath, 'utf-8').trim().length === 0) {
    errors.push('README.md missing or empty');
  }

  const expectedFolder = `${metadata.author}__${metadata.name}`;
  if (!absFolder.endsWith(expectedFolder)) {
    errors.push(`Folder name mismatch: expected ${expectedFolder}`);
  }

  if (typeof metadata.path === 'string' && metadata.path.length > 0) {
    const definitionRoot = join(ROOT, metadata.path);
    const required = [
      'agent.yaml',
      'SOUL.md',
      'RULES.md',
      'AGENTS.md',
      'exports/claude-code/CLAUDE.md',
      `exports/codex/skills/${metadata.name}/SKILL.md`,
      'exports/openai/agent.py',
      'exports/system-prompt/SYSTEM_PROMPT.md',
    ];
    for (const rel of required) {
      if (!existsSync(join(definitionRoot, rel))) {
        errors.push(`Missing required artifact: ${metadata.path}/${rel}`);
      }
    }
  } else {
    errors.push('metadata.path must point at the in-repo gitagent definition');
  }

  if (!Array.isArray(metadata.adapters) || !metadata.adapters.includes('codex')) {
    warnings.push('Adapters do not include codex');
  }
  if (!Array.isArray(metadata.adapters) || !metadata.adapters.includes('claude-code')) {
    warnings.push('Adapters do not include claude-code');
  }

  return { pass: errors.length === 0, errors, warnings };
}

const args = parseArgs(process.argv.slice(2));
const explicitFolder = args.folder ? [resolve(args.folder)] : listCatalogFolders().map((folder) => join(ROOT, 'agents', folder));
let allPassed = true;

for (const folder of explicitFolder) {
  console.log(`Validating ${folder}`);
  const result = validateFolder(folder);
  for (const error of result.errors) {
    console.log(`  x ${error}`);
  }
  for (const warning of result.warnings) {
    console.log(`  ! ${warning}`);
  }
  if (result.pass) {
    console.log('  ok');
  } else {
    allPassed = false;
  }
}

process.exit(allPassed ? 0 : 1);
