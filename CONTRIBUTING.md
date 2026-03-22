# Contributing to the gitagent Registry

Thanks for sharing your agent with the community! This guide walks you through submitting an agent to the registry.

## Requirements

Your agent must:

1. Be hosted in a **public GitHub repository**
2. Have a valid `agent.yaml` at the repo root (or specified path)
3. Have a `SOUL.md` file
4. Follow the [gitagent standard](https://gitagent.sh)

## Submission Steps

### 1. Fork this repository

### 2. Create your agent folder

```
agents/<your-github-username>__<agent-name>/
```

The folder name uses a **double underscore** (`__`) to separate your GitHub username from the agent name.

### 3. Add required files

#### `metadata.json`

```json
{
  "name": "my-agent",
  "author": "your-github-username",
  "description": "A short description of what your agent does",
  "repository": "https://github.com/your-username/your-repo",
  "path": "",
  "version": "1.0.0",
  "category": "developer-tools",
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "model": "claude-sonnet-4-5-20250929",
  "adapters": ["claude-code", "system-prompt"],
  "icon": false
}
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Agent name (lowercase, hyphens) |
| `author` | Yes | Your GitHub username |
| `description` | Yes | What the agent does (max 200 chars) |
| `repository` | Yes | Public GitHub repo URL |
| `path` | No | Subdirectory within repo (default: root) |
| `version` | Yes | Semver version |
| `category` | Yes | One of the allowed categories (see below) |
| `tags` | Yes | Array of tags (max 10) |
| `license` | Yes | SPDX license identifier |
| `model` | Yes | Preferred model identifier |
| `adapters` | Yes | Supported adapters |
| `icon` | No | `true` if `icon.png` is included |
| `banner` | No | `true` if `banner.png` is included |

**Categories:** `developer-tools`, `data-engineering`, `devops`, `compliance`, `security`, `documentation`, `testing`, `research`, `productivity`, `finance`, `customer-support`, `creative`, `education`, `other`

#### `README.md`

A markdown file describing your agent. This is displayed on the agent's detail page. Include:

- What the agent does
- Key capabilities
- Example usage
- Screenshots (optional)

#### `icon.png` (optional)

A 256x256 PNG icon for your agent. If not provided, an auto-generated avatar will be shown.

#### `banner.png` (optional)

A 1200x630 PNG banner image for your agent. Used as the Open Graph / social sharing image when your agent's page is shared on Twitter, Slack, Discord, etc. If not provided, a default registry banner is used.

### 4. Open a Pull Request

Push your branch and open a PR. CI will automatically:

- Validate your `metadata.json` against the schema
- Check that folder name matches `<author>__<name>`
- Verify `README.md` exists and is non-empty
- Clone your repository and verify `agent.yaml` and `SOUL.md` exist

### 5. Wait for review

Once CI passes, a maintainer will review your submission. After merge, your agent appears on [registry.gitagent.sh](https://registry.gitagent.sh) within minutes.

## Updating your agent

To update your agent's registry entry, open a new PR modifying your folder under `agents/`. Bump the `version` in `metadata.json`.

## Questions?

Open an issue or start a discussion in this repository.
