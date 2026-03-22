# Key Decisions

Record durable decisions with rationale, owner, and impact.

## D-001: Architect Uses A Full Harness Shape

- Date: 2026-03-23
- Owner: registry-maintainer
- Decision: Treat `architect` as a full gitagent harness instead of a thin prompt export source.
- Why: This agent is itself about harness architecture, so its own source should demonstrate memory, hooks, workflows, governance, and auditability.
- Impact: Future changes to memory, policy, and release flow become reviewable and mechanically validated.
