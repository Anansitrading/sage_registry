---
name: spawn-architect
description: Use when the user wants to launch the architect agent in one step. Triggers include "spawn architect", "launch architect", "use the architect agent", "architect this", and "run architect on this".
---

# Spawn Architect

Use this skill when the user is clearly asking to invoke the `architect` profile, not merely discuss architecture in the abstract.

## Default Action

Launch a sub-agent immediately with the local `architect` skill attached instead of making the user remember the worker-plus-skill pattern.

Use `spawn_agent` with:

- `agent_type: "worker"`
- `fork_context: true`
- a skill item pointing at `/home/david/.codex/skills/architect`
- the user's requested task as the worker message

Default to `reasoning_effort: "high"` unless the task is obviously lightweight.

## Message Pattern

Frame the spawned task so the worker acts as the architecture lead for the current request. Include the user's actual goal, constraints already present in the thread, and the expectation that it should produce boundaries, tradeoffs, and implementation slices.

Use wording close to:

```text
Work this task as the architect. Define system boundaries, tradeoffs, risks, and implementation slices. Produce architecture-first recommendations and concrete next actions for the current request: <user task>
```

## Response Behavior

- If the user asked to start the architect and wait for output, spawn it and continue the task.
- If the user only asked how to invoke it, explain that `spawn-architect` is now the one-step trigger.
- Do not ask the user to manually attach `/home/david/.codex/skills/architect`.
- Do not turn this back into a generic worker unless the user explicitly asks for a different profile.

## When Not To Use

Do not use this skill when the user only wants a normal answer from the main assistant and did not ask to invoke a separate architect agent.
