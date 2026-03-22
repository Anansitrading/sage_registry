# sage_registry

This repository is the permanent, versioned home for registered agent profiles and their generated exports.

It combines two roles:

- `definitions/` holds each agent's canonical `gitagent` source of truth
- `agents/` holds the registry catalog entries in the `open-gitagent/registry` style

## Source Of Truth

Every agent definition starts as a `gitagent` directory:

```text
definitions/<agent-name>/
```

That definition is then exported into:

- Claude Code format via `gitagent export --format claude-code`
- OpenAI SDK format via `gitagent export --format openai`
- Codex format via `scripts/lib.mjs` and the Codex skill exporter

## Layout

```text
sage_registry/
├── agents/                  # Registry catalog entries
├── codex-skills/            # Versioned Codex utility skills for registry operations
├── definitions/             # Canonical gitagent definitions
├── index.json               # Built registry index
├── schema/                  # Registry metadata schema
└── scripts/                 # Registration, export, validation
```

## Commands

Run these from `agent-registry/`:

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

## Standards

- Upstream registry pattern: `https://github.com/open-gitagent/registry.git`
- Upstream gitagent source: `https://github.com/open-gitagent/gitagent.git`
- This registry keeps both Claude Code and Codex exports in-repo so agent profiles are never single-homed again.
