---
name: gitagent-harness-vcs
description: Use when designing, auditing, forking, remixing, or evolving a gitagent repository as a version-controlled agent harness. Triggers include "harness version control", "live memory", "knowledge tree", "agent hooks", "agent audit trail", "fork agent", "remix agent", "human in the loop", "agent CI/CD", and "segregation of duties".
---

# Gitagent Harness VCS

Use this skill when the task is not just "edit an agent", but "treat the agent repo as an operational harness with versioned control-plane, memory, knowledge, hooks, audit, and release flow".

## Core Model

Think in three planes:

- Control plane: `agent.yaml`, `SOUL.md`, `RULES.md`, `AGENTS.md`, `skills/`, `tools/`
- State plane: `knowledge/`, `memory/`, `workflows/`, `hooks/`, `compliance/`, `config/`, `agents/`
- Runtime plane: `.gitagent/` and any generated artifacts that must stay out of version control

The job is to make the versioned surfaces explicit, reviewable, diffable, and promotable through git.

## When To Reach For Full Harness Depth

Use full harness patterns when any of these are true:

- the agent needs persistent cross-session memory
- the agent must write decisions, daily logs, or operational context
- the agent depends on structured knowledge retrieval instead of one flat reference file
- the agent needs lifecycle hooks, audit logging, or compliance gates
- the agent will be forked, remixed, or inherited across repos
- the agent is deployed through branch promotion or CI gates
- a human must review skill or memory updates before they reach `main`

If none of those are true, keep the agent in standard form and avoid adding inert directories.

## Working Sequence

1. Inspect current harness shape.
   - Read `agent.yaml`, `SOUL.md`, `RULES.md`, `AGENTS.md`
   - Read `knowledge/index.yaml`, `memory/memory.yaml`, `hooks/hooks.yaml` if present
   - Run `gitagent validate` before changing structure
2. Decide the operating pattern.
   - Standard agent
   - Full harness with memory, hooks, workflows, compliance, and sub-agents
   - Fork/remix of an upstream agent using `extends`, `dependencies`, or a git fork
3. Encode durable state explicitly.
   - Use `memory/` for cross-session state the agent should re-read
   - Use `knowledge/` for structured reference material and retrieval surfaces
   - Use `hooks/` for lifecycle gates, audit, and policy checks
   - Use `workflows/` for named multi-step procedures
4. Add human review and role boundaries.
   - Put SOD and human-review policy in `compliance/`
   - Treat memory and skill changes as branch + PR candidates, not silent writes to `main`
5. Wire validation and release flow.
   - `gitagent validate`
   - registry validation and parity checks when the harness lives in `sage_registry`
   - branch promotion and CI gates before deployment

## Command Deck

```bash
# Scaffold the deeper harness directories and stubs for an existing agent
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/scaffold-harness-vcs.sh /path/to/agent

# Validate a harness with gitagent, and run registry parity if it lives in sage_registry
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/validate-harness-vcs.sh /path/to/agent

# Diff the versioned harness surfaces between two revisions
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/harness-diff.sh /path/to/repo v1.0.0 HEAD

# Audit one file's authorship trail
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/harness-blame.sh /path/to/repo SOUL.md
```

## Required Practices

- Never edit generated exports first when the source harness lives in `sage_registry`
- Keep `.gitagent/` out of version control
- Do not create fake binary embeddings just to satisfy a diagram; scaffold text nodes and let real embedding jobs populate them later
- Prefer `knowledge/index.yaml` plus focused context docs over one giant prompt dump
- Prefer hooks for auditable gates and post-action validation instead of burying enforcement only in prose
- Treat `memory/` as durable, reviewable state; if the write would matter in an audit, it deserves a branch, diff, and reviewer
- Use `extends` or `dependencies` when you mean composition or inheritance; use a repo fork when governance, release cadence, or ownership truly diverges

## Read These References

- For repo surfaces and file semantics: `references/gitagent-surfaces.md`
- For governance, remix, SOD, and human review: `references/harness-governance.md`
- For CI, release gates, and audit commands: `references/ci-audit.md`

## Registry Integration

When the harness is under `/home/david/Projects/sage_registry/definitions/<agent-name>`:

- use this skill to shape the source harness
- then use `panopticon-agent-registry` to re-register exports and metadata
- run parity checks before installing the Codex export locally
