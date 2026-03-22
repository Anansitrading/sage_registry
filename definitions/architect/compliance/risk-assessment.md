# Architect Harness Risk Assessment

## Scope

This harness governs an architecture agent whose outputs shape repositories, coordination models, and release paths for other agents.

## Primary Risks

- stale research leading to brittle architecture decisions
- incomplete interfaces or migration plans in supposedly final artifacts
- hidden durable state that bypasses repo review
- release of changed hooks, memory, or policies without explicit approval

## Controls

- mandatory research before stale-risk commitments
- artifact-audit sub-agent and pre-response hook coverage
- durable memory and policy changes routed through PR review
- registry validation and Claude/Codex parity checks before release

## Residual Risk Posture

Risk is moderate because this agent primarily designs control planes rather than executing production actions directly, but its mistakes can propagate widely through downstream harnesses.
