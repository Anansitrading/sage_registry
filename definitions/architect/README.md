# Architect

The first registered Panopticon agent profile and the first source definition in `sage_registry` upgraded to a full gitagent harness.

This agent is a system architect focused on AI agent harnesses, repository-native coordination, and version control systems designed for concurrent autonomous workers.

## Source Materials

- Canonical gitagent definition files live in this directory.
- The original example prompt is preserved under `knowledge/source-harness-architect.md`.
- Registry metadata is stored in `registry.json`.

## Harness Surfaces

This definition now uses the richer gitagent harness surfaces:

- `knowledge/` for architecture context, policies, and system relationships
- `memory/` for durable working state, runtime logs, and key decisions
- `hooks/` for lifecycle audit logging and artifact gate checks
- `workflows/` for architecture engagements, remix control, and release promotion
- `compliance/` for human review, SOD, and validation cadence
- `config/` for environment-specific runtime expectations
- `agents/` for focused research and artifact-audit sub-agents

## Exports

Generated exports are written to `exports/`:

- `claude-code/CLAUDE.md`
- `codex/skills/architect/SKILL.md`
- `openai/agent.py`
- `system-prompt/SYSTEM_PROMPT.md`
