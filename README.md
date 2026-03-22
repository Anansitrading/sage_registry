# panopticon_swarm Agent Registry

This directory is the permanent, versioned home for Panopticon agent profiles.

It combines two roles:

- `definitions/` holds each agent's canonical `gitagent` source of truth
- `agents/` holds the registry catalog entries in the `open-gitagent/registry` style

## Source Of Truth

Every agent definition starts as a `gitagent` directory:

```text
agent-registry/definitions/<agent-name>/
```

That definition is then exported into:

- Claude Code format via `gitagent export --format claude-code`
- OpenAI SDK format via `gitagent export --format openai`
- Codex format via Panopticon's Codex skill exporter

## Layout

```text
agent-registry/
├── agents/                  # Registry catalog entries
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
npm run validate
npm run build:index
```

## Standards

- Upstream registry pattern: `https://github.com/open-gitagent/registry.git`
- Upstream gitagent source: `https://github.com/open-gitagent/gitagent.git`
- This registry keeps both Claude Code and Codex exports in-repo so agent profiles are never single-homed again.
