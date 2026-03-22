import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT,
  gitAddedDate,
  listCatalogFolders,
  loadConfig,
  mtimeIso,
  readJson,
  writeJson,
} from './lib.mjs';

function buildIndex() {
  const config = loadConfig();
  const agents = [];

  for (const folder of listCatalogFolders()) {
    const catalogPath = join(ROOT, 'agents', folder);
    const metadataPath = join(catalogPath, 'metadata.json');
    if (!existsSync(metadataPath)) {
      continue;
    }

    const metadata = readJson(metadataPath);
    const definitionPath = metadata.path ?? '';
    const exportBase = definitionPath ? `${definitionPath}/exports` : null;
    const readmePath = join(catalogPath, 'README.md');

    agents.push({
      ...metadata,
      catalog_path: `agent-registry/agents/${folder}`,
      definition_path: definitionPath,
      registry_readme_path: `agent-registry/agents/${folder}/README.md`,
      exports: exportBase
        ? {
            claude_code: `${exportBase}/claude-code/CLAUDE.md`,
            codex_skill: `${exportBase}/codex/skills/${metadata.name}/SKILL.md`,
            openai: `${exportBase}/openai/agent.py`,
            system_prompt: `${exportBase}/system-prompt/SYSTEM_PROMPT.md`,
          }
        : {},
      added_at: gitAddedDate(`agent-registry/agents/${folder}`),
      updated_at: mtimeIso(metadataPath),
      readme_preview: existsSync(readmePath)
        ? readFileSync(readmePath, 'utf-8').split('\n').slice(0, 6).join('\n')
        : '',
      registry: config.name,
    });
  }

  agents.sort((left, right) => left.name.localeCompare(right.name));

  return {
    registry: config.name,
    repository_url: config.repository_url,
    total: agents.length,
    generated_at: new Date().toISOString(),
    agents,
  };
}

const index = buildIndex();
writeJson(join(ROOT, 'index.json'), index);
console.log(`Wrote ${index.total} agent entries to agent-registry/index.json`);
