---
name: panopticon-agent-registry
description: Use when registering, updating, exporting, validating, or installing agent profiles from the permanent sage_registry. Triggers include "register agent", "update agent profile", "sync codex agent", "build claude export", "test parity", and "version agent changes".
---

# Sage Registry Workflow

This skill manages the permanent agent registry in:

- `/home/david/Projects/sage_registry`

Use it whenever an agent profile needs to be created, updated, exported, validated, or installed locally.

If the task involves harness structure, live memory, hooks, workflows, knowledge trees, auditability, fork/remix strategy, or human-review gating, use `gitagent-harness-vcs` first and then return here for registration.

## Source Of Truth

Every agent starts in:

```text
/home/david/Projects/sage_registry/definitions/<agent-name>
```

Never edit generated exports first. Update the gitagent source definition, then regenerate exports and registry metadata.

## Core Commands

```bash
# Install or refresh registry tooling
cd /home/david/Projects/sage_registry && npm install

# Register or re-register an agent from its gitagent source
/home/david/.codex/skills/panopticon-agent-registry/scripts/register-agent.sh architect

# Scaffold deeper harness surfaces for a source definition before registration
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/scaffold-harness-vcs.sh /home/david/Projects/sage_registry/definitions/architect

# Validate every catalog entry
/home/david/.codex/skills/panopticon-agent-registry/scripts/validate-registry.sh

# Verify Claude/Codex parity for one agent
/home/david/.codex/skills/agent-parity-tester/scripts/check-parity.sh architect

# Install an agent's Codex export into ~/.codex/skills
/home/david/.codex/skills/panopticon-agent-registry/scripts/install-codex-agent.sh architect
```

## Workflow

1. Shape the source harness in `definitions/<agent-name>/`.
   - For deeper harness work, use `gitagent-harness-vcs`.
2. Re-run registration.
3. Validate the registry.
4. Verify parity.
5. Install the refreshed Codex export locally if this machine should use that agent directly.

## Outputs

Registration updates:

- `definitions/<agent-name>/exports/claude-code/CLAUDE.md`
- `definitions/<agent-name>/exports/codex/skills/<agent-name>/...`
- `definitions/<agent-name>/exports/openai/agent.py`
- `definitions/<agent-name>/exports/system-prompt/SYSTEM_PROMPT.md`
- `agents/<author>__<agent-name>/metadata.json`
- `index.json`
