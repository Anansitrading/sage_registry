import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT,
  buildParityReport,
  buildCatalogReadme,
  buildCodexSkill,
  catalogDir,
  definitionDir,
  definitionRelPath,
  ensureDir,
  loadConfig,
  loadManifest,
  loadRegistrySpec,
  parseArgs,
  runGitagent,
  writeJson,
  writeText,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const agentName = args.agent;

if (!agentName || typeof agentName !== 'string') {
  console.error('Usage: node scripts/register-agent.mjs --agent <agent-name>');
  process.exit(1);
}

const config = loadConfig();
const manifest = loadManifest(agentName);
const registrySpec = loadRegistrySpec(agentName);
const sourceDir = definitionDir(agentName);

for (const required of ['agent.yaml', 'SOUL.md', 'RULES.md', 'AGENTS.md', 'README.md', 'registry.json']) {
  if (!existsSync(join(sourceDir, required))) {
    console.error(`Missing required file: ${definitionRelPath(agentName)}/${required}`);
    process.exit(1);
  }
}

const exportDir = join(sourceDir, 'exports');
ensureDir(join(exportDir, 'claude-code'));
ensureDir(join(exportDir, 'openai'));
ensureDir(join(exportDir, 'system-prompt'));

runGitagent([
  'export',
  '--format',
  'claude-code',
  '--dir',
  sourceDir,
  '--output',
  join(exportDir, 'claude-code', 'CLAUDE.md'),
]);

runGitagent([
  'export',
  '--format',
  'openai',
  '--dir',
  sourceDir,
  '--output',
  join(exportDir, 'openai', 'agent.py'),
]);

runGitagent([
  'export',
  '--format',
  'system-prompt',
  '--dir',
  sourceDir,
  '--output',
  join(exportDir, 'system-prompt', 'SYSTEM_PROMPT.md'),
]);

buildCodexSkill(agentName, manifest);

const parityReport = buildParityReport(agentName);
if (!parityReport.pass) {
  for (const error of parityReport.errors) {
    console.error(`Parity error: ${error}`);
  }
  process.exit(1);
}

const metadata = {
  name: manifest.name,
  author: config.author,
  description: manifest.description.slice(0, 200),
  repository: config.repository_url,
  path: definitionRelPath(agentName),
  version: manifest.version,
  category: registrySpec.category,
  tags: registrySpec.tags,
  license: manifest.license ?? 'MIT',
  model: manifest.model?.preferred ?? 'gpt-5.4',
  adapters: registrySpec.adapters,
  icon: false,
  banner: false,
};

const catalogRoot = catalogDir(config.author, manifest.name);
ensureDir(catalogRoot);
writeJson(join(catalogRoot, 'metadata.json'), metadata);
writeText(join(catalogRoot, 'README.md'), `${buildCatalogReadme(manifest, metadata).trim()}\n`);

execFileSync('npx', ['tsx', 'scripts/build-index.ts'], {
  cwd: ROOT,
  stdio: 'inherit',
});

for (const warning of parityReport.warnings) {
  console.log(`Parity warning: ${warning}`);
}
console.log(`Registered ${manifest.name} at ${join('agents', `${config.author}__${manifest.name}`)}`);
