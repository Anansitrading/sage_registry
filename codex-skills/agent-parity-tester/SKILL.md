---
name: agent-parity-tester
description: Use when verifying that a registered agent keeps Codex and Claude exports in parity with the gitagent source definition in sage_registry. Triggers include "check agent parity", "verify codex/claude parity", and "test export parity".
---

# Agent Parity Tester

This skill verifies that registered agents in:

- `/home/david/Projects/sage_registry`

keep their generated Codex and Claude exports aligned with the gitagent source definition.

## What It Checks

- `SOUL.md` is represented in both exports
- `RULES.md` is represented in both exports
- `DUTIES.md` is represented when defined
- `AGENTS.md` fallback is preserved in the Codex export
- source skill metadata is represented in both exports
- `knowledge/index.yaml` `always_load` documents are represented in both exports
- required generated artifacts exist

## Commands

```bash
# Check one agent
/home/david/.codex/skills/agent-parity-tester/scripts/check-parity.sh architect

# Check every registered agent
/home/david/.codex/skills/agent-parity-tester/scripts/check-parity.sh
```

## Policy

Parity is required. Registration and validation are expected to fail if parity checks fail.
