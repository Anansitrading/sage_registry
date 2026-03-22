import { join, resolve } from 'node:path';
import {
  ROOT,
  buildParityReport,
  listCatalogFolders,
  parseArgs,
  readJson,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));

function resolveAgentNames() {
  if (typeof args.agent === 'string' && args.agent.length > 0) {
    return [args.agent];
  }

  if (typeof args.folder === 'string' && args.folder.length > 0) {
    const metadata = readJson(join(resolve(args.folder), 'metadata.json'));
    return [metadata.name];
  }

  return listCatalogFolders().map((folder) => {
    const metadata = readJson(join(ROOT, 'agents', folder, 'metadata.json'));
    return metadata.name;
  });
}

const agentNames = resolveAgentNames();
let allPassed = true;

for (const agentName of agentNames) {
  const report = buildParityReport(agentName);
  console.log(`Parity check: ${agentName}`);
  for (const error of report.errors) {
    console.log(`  x ${error}`);
  }
  for (const warning of report.warnings) {
    console.log(`  ! ${warning}`);
  }
  if (report.pass) {
    console.log(`  ok skills=${report.checked.skills.length} knowledge=${report.checked.knowledge.length}`);
  } else {
    allPassed = false;
  }
}

process.exit(allPassed ? 0 : 1);
