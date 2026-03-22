# Registry Context

The architect currently lives inside `sage_registry`, which means every definition change affects:

- source harness shape in `definitions/<agent>/`
- generated exports for Claude Code, Codex, OpenAI, and system-prompt
- catalog metadata in `agents/<author>__<agent>/`
- parity guarantees between Claude and Codex exports
- registry site visibility and release workflow

Practical consequences:

- never edit generated exports first
- always re-register after changing the source harness
- always run registry validation and parity checks before install or release
- treat registry docs and utility skills as part of the harness governance surface
