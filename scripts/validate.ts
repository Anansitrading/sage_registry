#!/usr/bin/env npx tsx

/**
 * Validate a gitagent registry submission folder.
 *
 * Usage: npx tsx scripts/validate.ts agents/<author>__<agent-name>/
 *
 * Checks:
 * 1. metadata.json exists and validates against schema
 * 2. Folder name matches <author>__<name> from metadata
 * 3. README.md exists and is non-empty
 * 4. If icon: true, icon.png exists
 * 5. If banner: true, banner.png exists
 * 6. Clones the repository and verifies agent.yaml + SOUL.md exist
 */

import { readFileSync, existsSync, statSync, rmSync } from "fs";
import { resolve, basename } from "path";
import { execSync } from "child_process";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const SCHEMA_PATH = resolve(import.meta.dirname, "../schema/metadata.schema.json");
const REPO_ROOT = resolve(import.meta.dirname, "..");
const LOCAL_REGISTRY_REPO = "https://github.com/Anansitrading/sage_registry";

interface ValidationResult {
  pass: boolean;
  errors: string[];
  warnings: string[];
}

function validate(folderPath: string): ValidationResult {
  const result: ValidationResult = { pass: true, errors: [], warnings: [] };
  const absPath = resolve(folderPath);

  // Check folder exists
  if (!existsSync(absPath) || !statSync(absPath).isDirectory()) {
    result.pass = false;
    result.errors.push(`Folder does not exist: ${absPath}`);
    return result;
  }

  const folderName = basename(absPath);

  // Check folder name format
  if (!folderName.includes("__")) {
    result.pass = false;
    result.errors.push(`Folder name must use <author>__<name> format, got: ${folderName}`);
    return result;
  }

  // Check metadata.json exists
  const metadataPath = resolve(absPath, "metadata.json");
  if (!existsSync(metadataPath)) {
    result.pass = false;
    result.errors.push("metadata.json not found");
    return result;
  }

  // Parse metadata
  let metadata: Record<string, unknown>;
  try {
    metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
  } catch (e) {
    result.pass = false;
    result.errors.push(`metadata.json is not valid JSON: ${(e as Error).message}`);
    return result;
  }

  // Validate against schema
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8"));
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);

  if (!validateSchema(metadata)) {
    result.pass = false;
    for (const err of validateSchema.errors || []) {
      result.errors.push(`Schema: ${err.instancePath} ${err.message}`);
    }
  }

  // Check folder name matches metadata
  const expectedFolder = `${metadata.author}__${metadata.name}`;
  if (folderName !== expectedFolder) {
    result.pass = false;
    result.errors.push(
      `Folder name mismatch: expected "${expectedFolder}" from metadata, got "${folderName}"`
    );
  }

  // Check README.md
  const readmePath = resolve(absPath, "README.md");
  if (!existsSync(readmePath)) {
    result.pass = false;
    result.errors.push("README.md not found");
  } else {
    const readmeContent = readFileSync(readmePath, "utf-8").trim();
    if (readmeContent.length === 0) {
      result.pass = false;
      result.errors.push("README.md is empty");
    } else if (readmeContent.length < 50) {
      result.warnings.push("README.md is very short — consider adding more detail");
    }
  }

  // Check icon.png if icon: true
  if (metadata.icon === true) {
    const iconPath = resolve(absPath, "icon.png");
    if (!existsSync(iconPath)) {
      result.pass = false;
      result.errors.push('icon.png not found but metadata has "icon": true');
    }
  }

  // Check banner.png if banner: true
  if (metadata.banner === true) {
    const bannerPath = resolve(absPath, "banner.png");
    if (!existsSync(bannerPath)) {
      result.pass = false;
      result.errors.push('banner.png not found but metadata has "banner": true');
    }
  }

  // Clone and verify repository
  if (typeof metadata.repository === "string") {
    const repository = metadata.repository.replace(/\.git$/, "");
    const tmpDir = resolve(absPath, ".tmp-validate");
    try {
      const agentRoot =
        repository === LOCAL_REGISTRY_REPO
          ? metadata.path
            ? resolve(REPO_ROOT, metadata.path as string)
            : REPO_ROOT
          : (() => {
              console.log(`  Cloning ${metadata.repository}...`);
              execSync(`git clone --depth 1 ${metadata.repository} ${tmpDir}`, {
                stdio: "pipe",
                timeout: 30_000,
              });
              return metadata.path
                ? resolve(tmpDir, metadata.path as string)
                : tmpDir;
            })();

      // Check agent.yaml
      const agentYaml = resolve(agentRoot, "agent.yaml");
      if (!existsSync(agentYaml)) {
        result.pass = false;
        result.errors.push(
          `agent.yaml not found in repository${metadata.path ? ` at path "${metadata.path}"` : ""}`
        );
      }

      // Check SOUL.md
      const soulMd = resolve(agentRoot, "SOUL.md");
      if (!existsSync(soulMd)) {
        result.pass = false;
        result.errors.push(
          `SOUL.md not found in repository${metadata.path ? ` at path "${metadata.path}"` : ""}`
        );
      }
    } catch (e) {
      result.pass = false;
      result.errors.push(`Failed to clone repository: ${(e as Error).message}`);
    } finally {
      // Clean up
      if (existsSync(tmpDir)) {
        rmSync(tmpDir, { recursive: true, force: true });
      }
    }
  }

  return result;
}

// Main
const folders = process.argv.slice(2);

if (folders.length === 0) {
  console.error("Usage: npx tsx scripts/validate.ts <agent-folder> [agent-folder...]");
  process.exit(1);
}

let allPassed = true;

for (const folder of folders) {
  console.log(`\nValidating: ${folder}`);
  const result = validate(folder);

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.log(`  ✗ ${err}`);
    }
  }

  if (result.warnings.length > 0) {
    for (const warn of result.warnings) {
      console.log(`  ⚠ ${warn}`);
    }
  }

  if (result.pass) {
    console.log("  ✓ Valid");
  } else {
    allPassed = false;
  }
}

process.exit(allPassed ? 0 : 1);
