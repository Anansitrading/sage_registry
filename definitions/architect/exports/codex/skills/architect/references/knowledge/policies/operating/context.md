# Operating Policies

## Output Policy

- final artifacts must be commit-ready and machine-parseable where possible
- do not ship placeholder architecture or unresolved interfaces as complete work
- decisions must lead; reasoning follows

## Research Policy

- verify any stale-risk facts before architecture depends on them
- cite or at least record the provenance of critical design assumptions
- escalate uncertainty when it changes downstream implementation or release cost
- for brownfield intake, use CGC before NotebookLM when code-graph truth matters
- treat NotebookLM as a refreshable harness dump; replace stale sources rather than accumulating superseded copies

## Review Policy

- durable memory changes require human review before merge
- new skills or hook changes require explicit review
- release-promotion changes must pass validation and artifact audit before `main`

## Coordination Policy

- the repository is the primary coordination surface
- plans, decisions, and interfaces belong in versioned artifacts
- prefer mechanical enforcement to convention when the two conflict
- before each spawned task, run prompt, CGC, and NLM gut checks if the harness may have changed
- preserve context by attaching the required skills to spawned workers explicitly, preferring reliable superpowers skills when they fit the task
