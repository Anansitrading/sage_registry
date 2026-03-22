# Harness Governance

## Human In The Loop

Treat git branches and pull requests as the supervision layer for learning agents.

Use branch + PR when the agent:

- updates `memory/`
- adds or changes a skill
- changes compliance or hooks
- changes any behavior that affects production responses

Recommended branch naming:

- `agent/<name>/memory-<topic>`
- `agent/<name>/skill-<topic>`
- `agent/<name>/policy-<topic>`
- `agent/<name>/release-<version>`

## Forking And Remixing

Choose the mechanism intentionally:

- `extends`: child inherits a parent agent and overrides behavior
- `dependencies`: mount another agent as a capability
- git fork: ownership, governance, or release policy diverges enough that the whole repo should split

Use a git fork when you need:

- independent release cadence
- private governance or proprietary policies
- materially different SOUL, RULES, hooks, or compliance controls

Use `extends` when the upstream agent remains the conceptual base.

## Segregation Of Duties

Do not let one agent own a critical flow end-to-end when review is required.

Common roles:

- maker: drafts or proposes
- checker: reviews and approves
- executor: performs approved action
- auditor: monitors and reports

Encode these boundaries in `compliance/segregation-of-duties.yaml` and keep handoff requirements explicit.

## Memory Governance

Not every memory write should merge automatically.

Good candidates for mandatory human review:

- policy updates
- model behavior lessons
- incident retrospectives
- customer-impacting rules
- skill additions discovered from runtime

## Auditability

Any durable change should answer:

- what changed
- when it changed
- who changed it
- why it changed
- what validation ran before merge

Use git history for authorship and diffs, and hooks for runtime audit events.
