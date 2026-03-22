# sage_registry

`sage_registry` is a private registry built on top of the upstream [`open-gitagent/registry`](https://github.com/open-gitagent/registry.git) layout.

It keeps the upstream registry structure for `agents/`, schema validation, index generation, site assets, and CI, while adding a private source-of-truth layer for agent definitions and enforced Claude/Codex parity.

## How It Works

- `definitions/` holds each agent's canonical `gitagent` source definition
- `agents/` holds the registry catalog entries in the upstream registry format
- `scripts/register-agent.mjs` exports the source definition into Claude Code, Codex, OpenAI, and system-prompt outputs
- `scripts/test-parity.mjs` verifies the generated Claude and Codex exports stay in parity

## Layout

```text
sage_registry/
├── agents/                  # Upstream registry-style catalog entries
├── codex-skills/            # Versioned Codex utility skills for registry operations
├── definitions/             # Canonical private gitagent definitions
├── index.json               # Registry index
├── schema/                  # Metadata schema
├── scripts/                 # Upstream + private registry automation
└── site/                    # Upstream registry website
```

## Commands

```bash
npm install
npm run register -- --agent architect
npm run test:parity -- --agent architect
npm run validate
npm run build:index
```

## Parity Policy

- Registration fails if Claude and Codex exports drift from the source definition
- Validation fails if any registered agent loses Claude/Codex parity
- `knowledge/index.yaml` `always_load` documents must be represented in both exports
- Source skill metadata must be represented in both exports
- Codex reference copies for source skills and knowledge must exist

## Upstream Basis

- Registry base: `https://github.com/open-gitagent/registry.git`
- Agent definition standard: `https://github.com/open-gitagent/gitagent.git`
- Local custom layer: `definitions/`, `codex-skills/`, parity enforcement, and Codex export installation workflow
