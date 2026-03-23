# Key Decisions

Record durable decisions with rationale, owner, and impact.

## D-001: Architect Uses A Full Harness Shape

- Date: 2026-03-23
- Owner: registry-maintainer
- Decision: Treat `architect` as a full gitagent harness instead of a thin prompt export source.
- Why: This agent is itself about harness architecture, so its own source should demonstrate memory, hooks, workflows, governance, and auditability.
- Impact: Future changes to memory, policy, and release flow become reviewable and mechanically validated.

## D-002: Brownfield Architect Work Defaults To Curiosity

- Date: 2026-03-23
- Owner: registry-maintainer
- Decision: For conductor superconductor work, the architect defaults to `curiosity`, uses CGC as the first graph surface, and treats NotebookLM as a refreshable harness dump.
- Why: Brownfield drift comes from prompt, docs, and implementation diverging. The architect needs a repeatable way to align those surfaces before planning.
- Impact: Architect exports, knowledge surfaces, and worker handoff behavior now assume recurring prompt/CGC/NLM gut checks and canonical source replacement in NotebookLM.
