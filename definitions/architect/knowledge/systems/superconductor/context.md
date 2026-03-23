# Superconductor Context

For brownfield conductor work, the architect defaults to a superconductor posture:

1. align prompt intent before planning
2. audit harness docs before relying on them
3. use CGC as the primary code-graph surface
4. use NotebookLM as the harness dump and retrieval layer
5. keep worker context fresh through repeated gut checks

## Working Order

1. prompt claim extraction
2. harness doc audit
3. CGC investigation
4. sequential dependency closure
5. NotebookLM harness dump refresh
6. sufficiency decision
7. rendered artifacts and worker handoff

## Gut Check Habit

Before each spawned task and after each material harness update:

- run a prompt gut check
- run a CGC gut check
- run an NLM gut check
- attach the required skills explicitly, with superpowers skills preferred when they cover the work reliably

If NotebookLM is stale, replace or delete superseded sources before the next worker uses them.

## Source Of Truth Rule

- CGC answers where current code truth lives.
- NotebookLM answers what the harness currently says and what the current research packet contains.
- If code and docs disagree, trust code and write the doc correction requirement into the artifact set.
