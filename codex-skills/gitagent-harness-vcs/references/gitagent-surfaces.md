# Gitagent Surfaces

## Control Plane

These files define the agent's durable behavior contract:

- `agent.yaml`: manifest, model preference, runtime, delegation, compliance, dependencies
- `SOUL.md`: identity, values, tone, orientation
- `RULES.md`: hard constraints and guardrails
- `AGENTS.md`: framework-agnostic fallback instructions
- `skills/`: reusable operator capabilities
- `tools/`: MCP-compatible tools

Change these when the agent's intended behavior changes.

## State Plane

These directories make the harness operational instead of static:

- `knowledge/`: structured reference tree, indexed via `knowledge/index.yaml`
- `memory/`: durable cross-session state, configured via `memory/memory.yaml`
- `hooks/`: lifecycle gates and audit handlers, configured via `hooks/hooks.yaml`
- `workflows/`: named procedures and release playbooks
- `compliance/`: SOD, review policy, regulatory mappings, validation schedules
- `config/`: environment-specific overrides
- `agents/`: sub-agents and mounted capabilities

Change these when the agent needs durable operational context, supervision, or execution flow.

## Runtime Plane

- `.gitagent/`: installed dependencies, ephemeral state, cache

This should remain gitignored. It is part of execution, not the versioned contract.

## Memory Pattern

Use `memory/` for state the agent should revisit across sessions:

- `MEMORY.md`: concise working memory
- `runtime/dailylog.md`: chronological operational record
- `runtime/key-decisions.md`: decision ledger with rationale and impact

Keep memory reviewable. If a memory update changes behavior, it should be diffable and, when sensitive, PR-gated.

## Knowledge Tree Pattern

Use `knowledge/` to model entities and relations as directories plus `context.md` files:

- one folder per domain node
- one `context.md` per node
- optional `embedding.npy` written by a real embedding job later
- `knowledge/index.yaml` tracks what is always loaded versus on-demand

Prefer multiple focused nodes over a single oversized reference document.

## Hooks Pattern

Good hook targets:

- `on_session_start`: bootstrap context, verify config
- `pre_tool_use`: audit or block sensitive tool calls
- `post_tool_use`: validate output, redact, or persist audit entries
- `pre_response`: enforce communication or policy rules
- `post_response`: log response metadata
- `on_error`: escalate or mark incidents
- `on_session_end`: seal logs and persist memory

Hook scripts should be deterministic and return the JSON protocol the spec expects.
