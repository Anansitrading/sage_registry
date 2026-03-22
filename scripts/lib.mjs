import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import yaml from 'js-yaml';

export const ROOT = resolve(import.meta.dirname, '..');
export const REPO_ROOT = resolve(ROOT, '..');

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

export function writeText(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, 'utf-8');
}

export function readYaml(path) {
  return yaml.load(readFileSync(path, 'utf-8'));
}

export function loadConfig() {
  return readJson(join(ROOT, 'config.json'));
}

export function definitionDir(agentName) {
  return join(ROOT, 'definitions', agentName);
}

export function definitionRelPath(agentName) {
  return `agent-registry/definitions/${agentName}`;
}

export function catalogDir(author, agentName) {
  return join(ROOT, 'agents', `${author}__${agentName}`);
}

export function listCatalogFolders() {
  const dir = join(ROOT, 'agents');
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir).filter((entry) => {
    const abs = join(dir, entry);
    return entry.includes('__') && statSync(abs).isDirectory();
  });
}

export function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith('--')) {
      continue;
    }
    const key = part.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

export function loadManifest(agentName) {
  return readYaml(join(definitionDir(agentName), 'agent.yaml'));
}

export function loadRegistrySpec(agentName) {
  return readJson(join(definitionDir(agentName), 'registry.json'));
}

export function runGitagent(args) {
  execFileSync('npx', ['--no-install', 'gitagent', ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  });
}

export function gitAddedDate(relPath) {
  try {
    const date = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--format=%aI', '--', relPath],
      {
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      },
    ).trim().split('\n').at(-1);
    if (date) {
      return date.split('T')[0];
    }
  } catch {
    // fall through
  }
  return new Date().toISOString().split('T')[0];
}

export function mtimeIso(path) {
  return statSync(path).mtime.toISOString();
}

export function buildCodexSkill(agentName, manifest) {
  const sourceDir = definitionDir(agentName);
  const exportRoot = join(sourceDir, 'exports', 'codex');
  const skillRoot = join(exportRoot, 'skills', manifest.name);
  const soul = readFileSync(join(sourceDir, 'SOUL.md'), 'utf-8').trim();
  const rules = readFileSync(join(sourceDir, 'RULES.md'), 'utf-8').trim();
  const fallback = readFileSync(join(sourceDir, 'AGENTS.md'), 'utf-8').trim();
  const sourceRef = join(sourceDir, 'knowledge', 'source-harness-architect.md');
  const sourceCopy = join(skillRoot, 'references', 'source-harness-architect.md');
  const skillMd = `---
name: ${manifest.name}
description: ${manifest.description} This Codex export is generated from the gitagent source in ${definitionRelPath(agentName)}.
---

# ${manifest.name}

This skill is the Codex export of the gitagent definition at \`${definitionRelPath(agentName)}\`.

## Identity

${soul}

## Constraints

${rules}

## Codex Fallback

${fallback}

## Source Of Truth

- Canonical gitagent definition: \`${definitionRelPath(agentName)}\`
- Claude Code export: \`${definitionRelPath(agentName)}/exports/claude-code/CLAUDE.md\`
- Full architect source reference: \`references/source-harness-architect.md\`
`;

  const openaiYaml = `display_name: "${manifest.name.replace(/(^|-)\\w/g, (match) => match.replace('-', '').toUpperCase())}"
short_description: "${manifest.description}"
default_prompt: "Work this problem as ${manifest.name}: define boundaries, tradeoffs, and implementation slices"
invocation_policy: "implicit"
`;

  ensureDir(join(skillRoot, 'references'));
  ensureDir(join(skillRoot, 'agents'));
  writeText(join(skillRoot, 'SKILL.md'), `${skillMd.trim()}\n`);
  writeText(join(skillRoot, 'agents', 'openai.yaml'), openaiYaml);
  copyFileSync(sourceRef, sourceCopy);
  writeText(join(exportRoot, 'AGENTS.md'), `${fallback}\n`);
}

export function buildCatalogReadme(manifest, metadata) {
  return `# ${manifest.name}

${manifest.description}

## Registry Entry

- Repository: \`${metadata.repository}\`
- Definition path: \`${metadata.path}\`
- Version: \`${metadata.version}\`
- Category: \`${metadata.category}\`
- Adapters: ${metadata.adapters.map((item) => `\`${item}\``).join(', ')}

## Generated Exports

- Claude Code: \`${metadata.path}/exports/claude-code/CLAUDE.md\`
- Codex skill: \`${metadata.path}/exports/codex/skills/${manifest.name}/SKILL.md\`
- OpenAI SDK: \`${metadata.path}/exports/openai/agent.py\`
- System prompt: \`${metadata.path}/exports/system-prompt/SYSTEM_PROMPT.md\`

## Source Definition

The canonical source of truth is the gitagent definition committed under:

\`\`\`text
${metadata.path}
\`\`\`

This entry is maintained by the Panopticon registry workflow so agent changes and export changes are versioned together.
`;
}
