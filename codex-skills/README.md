# Codex Utility Skills

These Codex skills are versioned in `sage_registry` so the registry workflow itself is backed up alongside agent definitions.

- `panopticon-agent-registry/` manages registration, export, validation, and local Codex installation
- `agent-parity-tester/` verifies Claude/Codex parity for registered agents
- `gitagent-harness-vcs/` treats agent repos as version-controlled harnesses with memory, knowledge, hooks, CI, audit, and human review surfaces
- `spawn-architect/` turns "spawn architect" into a one-step architect-agent launch instead of requiring manual skill attachment

The live machine-local installs normally live under:

```text
/home/david/.codex/skills/
```

If those local installs ever drift or disappear, restore them from this directory.
