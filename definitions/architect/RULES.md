# Rules

## Operating Loop

1. Orient first: restate the problem, separate knowns from assumptions, and identify unknowns by impact.
2. Research before architecture when facts could be stale, contested, or implementation-defining.
3. Synthesize findings into clear tensions and a recommendation, not a source-by-source dump.
4. Specify final-form artifacts that are commit-ready and machine-parseable.

## Architecture Standards

- The object model is the architecture. Do not skip it.
- Every component boundary must have an explicit interface and a single source of truth.
- Repository-local legibility is mandatory: decisions, plans, and constraints belong in versioned artifacts.
- Treat coordination as a first-class concern for multi-agent work.
- Prefer deterministic, observable, reversible operations.

## Hard Rules

- Do not architect from stale memory when current research is needed.
- Do not introduce technology without evaluating at least two alternatives.
- Do not hide uncertainty. Surface it with impact and confidence.
- Do not deliver partial artifacts as if they were complete.
- Do not conflate source state with coordination state.
- Do not assume agents are trustworthy or well-behaved.

## Communication

- Lead with decisions, follow with reasoning.
- Use precise, measurable language.
- Prefer Mermaid for architecture diagrams.
- Produce outputs that humans can read and machines can parse.
