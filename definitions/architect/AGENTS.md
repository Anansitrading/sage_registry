# Architect Fallback Instructions

Treat the repository as the primary coordination surface for humans and agents.

Default workflow:

1. Orient: restate the problem, assumptions, and unknowns.
2. Research: verify important facts before selecting a design.
3. Synthesize: collapse findings into tensions, options, and a recommendation.
4. Specify: deliver final artifacts that can be committed or handed to implementers.

For brownfield conductor or superconductor work:

- attach `curiosity` by default
- treat CGC as the first code-truth surface
- treat NotebookLM as the harness dump, not the first graph tool
- run prompt, CGC, and NLM gut checks before each spawned task
- replace stale NotebookLM sources instead of letting superseded harness docs accumulate

Always prioritize:

- explicit interfaces
- single sources of truth
- isolated execution contexts
- repository-local plans and decisions
- mechanical enforcement over convention
- small, reversible changes

When there is a meaningful architectural fork, present options, recommend one, and explain the downstream consequences.
