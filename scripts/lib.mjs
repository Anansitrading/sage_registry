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
export const REPO_ROOT = ROOT;

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

export function yamlScalar(value) {
  return JSON.stringify(String(value));
}

export function readYaml(path) {
  return yaml.load(readFileSync(path, 'utf-8'));
}

export function readText(path) {
  return readFileSync(path, 'utf-8');
}

export function loadConfig() {
  return readJson(join(ROOT, 'config.json'));
}

export function definitionDir(agentName) {
  return join(ROOT, 'definitions', agentName);
}

export function definitionRelPath(agentName) {
  return `definitions/${agentName}`;
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

export function readOptionalText(path) {
  if (!existsSync(path)) {
    return '';
  }
  return readText(path);
}

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) {
    return { frontmatter: {}, body: markdown };
  }

  const end = markdown.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontmatter: {}, body: markdown };
  }

  const rawFrontmatter = markdown.slice(4, end);
  const body = markdown.slice(end + 5);
  const frontmatter = yaml.load(rawFrontmatter) ?? {};
  return { frontmatter, body };
}

export function listSourceSkills(sourceDir) {
  const skillsDir = join(sourceDir, 'skills');
  if (!existsSync(skillsDir)) {
    return [];
  }

  return readdirSync(skillsDir)
    .map((entry) => {
      const skillDir = join(skillsDir, entry);
      const skillMdPath = join(skillDir, 'SKILL.md');
      if (!statSync(skillDir).isDirectory() || !existsSync(skillMdPath)) {
        return null;
      }

      const parsed = parseFrontmatter(readText(skillMdPath));
      return {
        directory: entry,
        skillDir,
        skillMdPath,
        frontmatter: parsed.frontmatter,
        body: parsed.body.trim(),
      };
    })
    .filter(Boolean);
}

export function listAlwaysLoadKnowledge(sourceDir) {
  const knowledgeDir = join(sourceDir, 'knowledge');
  const indexPath = join(knowledgeDir, 'index.yaml');
  if (!existsSync(indexPath)) {
    return [];
  }

  const index = readYaml(indexPath) ?? {};
  const documents = Array.isArray(index.documents) ? index.documents : [];
  return documents
    .filter((doc) => doc && doc.always_load && typeof doc.path === 'string')
    .map((doc) => {
      const absPath = join(knowledgeDir, doc.path);
      return {
        path: doc.path,
        absPath,
        content: existsSync(absPath) ? readText(absPath).trim() : '',
      };
    })
    .filter((doc) => doc.content);
}

export function buildParityReport(agentName) {
  const sourceDir = definitionDir(agentName);
  const manifest = loadManifest(agentName);
  const claudeExport = readOptionalText(join(sourceDir, 'exports', 'claude-code', 'CLAUDE.md'));
  const codexExport = readOptionalText(join(sourceDir, 'exports', 'codex', 'skills', manifest.name, 'SKILL.md'));
  const codexAgentsExport = readOptionalText(join(sourceDir, 'exports', 'codex', 'AGENTS.md'));
  const soul = readOptionalText(join(sourceDir, 'SOUL.md')).trim();
  const rules = readOptionalText(join(sourceDir, 'RULES.md')).trim();
  const duties = readOptionalText(join(sourceDir, 'DUTIES.md')).trim();
  const fallback = readOptionalText(join(sourceDir, 'AGENTS.md')).trim();
  const sourceSkills = listSourceSkills(sourceDir);
  const alwaysLoadKnowledge = listAlwaysLoadKnowledge(sourceDir);
  const errors = [];
  const warnings = [];

  if (!claudeExport) {
    errors.push('Missing Claude export at exports/claude-code/CLAUDE.md');
  }
  if (!codexExport) {
    errors.push(`Missing Codex export at exports/codex/skills/${manifest.name}/SKILL.md`);
  }

  if (claudeExport && soul && !claudeExport.includes(soul)) {
    errors.push('Claude export does not include SOUL.md content');
  }
  if (codexExport && soul && !codexExport.includes(soul)) {
    errors.push('Codex export does not include SOUL.md content');
  }

  if (claudeExport && rules && !claudeExport.includes(rules)) {
    errors.push('Claude export does not include RULES.md content');
  }
  if (codexExport && rules && !codexExport.includes(rules)) {
    errors.push('Codex export does not include RULES.md content');
  }

  if (duties) {
    if (claudeExport && !claudeExport.includes(duties)) {
      errors.push('Claude export does not include DUTIES.md content');
    }
    if (codexExport && !codexExport.includes(duties)) {
      errors.push('Codex export does not include DUTIES.md content');
    }
  }

  if (fallback && codexAgentsExport.trim() !== fallback) {
    errors.push('Codex AGENTS export is not in parity with source AGENTS.md');
  }
  if (fallback && codexExport && !codexExport.includes(fallback)) {
    errors.push('Codex skill export does not include AGENTS.md fallback instructions');
  }

  for (const skill of sourceSkills) {
    const name = skill.frontmatter.name ?? skill.directory;
    const description = skill.frontmatter.description ?? '';
    if (claudeExport && !claudeExport.includes(`### ${name}`)) {
      errors.push(`Claude export does not include source skill heading for ${name}`);
    }
    if (codexExport && !codexExport.includes(`### ${name}`)) {
      errors.push(`Codex export does not include source skill heading for ${name}`);
    }
    if (description && claudeExport && !claudeExport.includes(description)) {
      errors.push(`Claude export does not include source skill description for ${name}`);
    }
    if (description && codexExport && !codexExport.includes(description)) {
      errors.push(`Codex export does not include source skill description for ${name}`);
    }

    const copiedSkillMd = join(sourceDir, 'exports', 'codex', 'skills', manifest.name, 'references', 'source-skills', skill.directory, 'SKILL.md');
    if (!existsSync(copiedSkillMd)) {
      errors.push(`Codex export missing copied source skill file for ${name}`);
    }
  }

  for (const doc of alwaysLoadKnowledge) {
    if (claudeExport && !claudeExport.includes(`## Reference: ${doc.path}`)) {
      errors.push(`Claude export does not include always_load knowledge header for ${doc.path}`);
    }
    if (codexExport && !codexExport.includes(`## Reference: ${doc.path}`)) {
      errors.push(`Codex export does not include always_load knowledge header for ${doc.path}`);
    }
    if (claudeExport && !claudeExport.includes(doc.content)) {
      errors.push(`Claude export does not inline always_load knowledge content for ${doc.path}`);
    }
    if (codexExport && !codexExport.includes(doc.content)) {
      errors.push(`Codex export does not inline always_load knowledge content for ${doc.path}`);
    }

    const copiedReference = join(sourceDir, 'exports', 'codex', 'skills', manifest.name, 'references', 'knowledge', doc.path);
    if (!existsSync(copiedReference)) {
      errors.push(`Codex export missing copied knowledge reference for ${doc.path}`);
    }
  }

  if (sourceSkills.length === 0) {
    warnings.push('Source definition has no source skills to parity-check');
  }
  if (alwaysLoadKnowledge.length === 0) {
    warnings.push('Source definition has no always_load knowledge documents to parity-check');
  }

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    checked: {
      skills: sourceSkills.map((skill) => skill.frontmatter.name ?? skill.directory),
      knowledge: alwaysLoadKnowledge.map((doc) => doc.path),
    },
  };
}

export function buildCodexSkill(agentName, manifest) {
  const sourceDir = definitionDir(agentName);
  const exportRoot = join(sourceDir, 'exports', 'codex');
  const skillRoot = join(exportRoot, 'skills', manifest.name);
  const soul = readText(join(sourceDir, 'SOUL.md')).trim();
  const rules = readText(join(sourceDir, 'RULES.md')).trim();
  const duties = readOptionalText(join(sourceDir, 'DUTIES.md')).trim();
  const fallback = readText(join(sourceDir, 'AGENTS.md')).trim();
  const sourceSkills = listSourceSkills(sourceDir);
  const alwaysLoadKnowledge = listAlwaysLoadKnowledge(sourceDir);

  const codexSkillSections = [];
  if (sourceSkills.length > 0) {
    const skillParts = ['## Source Skills'];
    for (const skill of sourceSkills) {
      const name = skill.frontmatter.name ?? skill.directory;
      const description = skill.frontmatter.description ?? '';
      skillParts.push(`### ${name}`);
      if (description) {
        skillParts.push(description);
      }
      skillParts.push(`Full source instructions: \`references/source-skills/${skill.directory}/SKILL.md\``);
      skillParts.push('');
    }
    codexSkillSections.push(skillParts.join('\n'));
  }

  const codexKnowledgeSections = [];
  if (alwaysLoadKnowledge.length > 0) {
    for (const doc of alwaysLoadKnowledge) {
      codexKnowledgeSections.push(`## Reference: ${doc.path}\n${doc.content}`);
    }
  }

  const skillMd = `---
name: ${yamlScalar(manifest.name)}
description: ${yamlScalar(`${manifest.description} This Codex export is generated from the gitagent source in ${definitionRelPath(agentName)}.`)}
---

# ${manifest.name}

This skill is the Codex export of the gitagent definition at \`${definitionRelPath(agentName)}\`.

## Identity

${soul}

## Constraints

${rules}

${duties ? `## Duties\n\n${duties}\n` : ''}

${codexSkillSections.join('\n\n')}

${codexKnowledgeSections.join('\n\n')}

## Codex Fallback

${fallback}

## Source Of Truth

- Canonical gitagent definition: \`${definitionRelPath(agentName)}\`
- Claude Code export: \`${definitionRelPath(agentName)}/exports/claude-code/CLAUDE.md\`
- Knowledge references: \`references/knowledge/\`
- Source skill references: \`references/source-skills/\`
`;

  const openaiYaml = `display_name: "${manifest.name.replace(/(^|-)\\w/g, (match) => match.replace('-', '').toUpperCase())}"
short_description: "${manifest.description}"
default_prompt: "Work this problem as ${manifest.name}: define boundaries, tradeoffs, and implementation slices"
invocation_policy: "implicit"
`;

  ensureDir(join(skillRoot, 'references'));
  ensureDir(join(skillRoot, 'references', 'knowledge'));
  ensureDir(join(skillRoot, 'references', 'source-skills'));
  ensureDir(join(skillRoot, 'agents'));
  writeText(join(skillRoot, 'SKILL.md'), `${skillMd.trim()}\n`);
  writeText(join(skillRoot, 'agents', 'openai.yaml'), openaiYaml);
  for (const skill of sourceSkills) {
    const targetSkillMd = join(skillRoot, 'references', 'source-skills', skill.directory, 'SKILL.md');
    ensureDir(dirname(targetSkillMd));
    copyFileSync(skill.skillMdPath, targetSkillMd);
  }
  for (const doc of alwaysLoadKnowledge) {
    const targetDoc = join(skillRoot, 'references', 'knowledge', doc.path);
    ensureDir(dirname(targetDoc));
    copyFileSync(doc.absPath, targetDoc);
  }
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
