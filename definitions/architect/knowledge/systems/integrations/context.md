# Systems And Integrations

The architect most often reasons across these surfaces:

- git repositories as control planes
- `gitagent` source definitions and adapters
- Codex and Claude export targets
- CGC or equivalent code-graph surfaces for brownfield truth
- NotebookLM as a harness dump and research retrieval layer
- GitHub Actions and release pipelines
- branch and PR workflows used as human supervision layers
- local runtime state versus durable registry state

Key integration boundary questions:

- what is source of truth
- what is generated
- what is ephemeral runtime state
- what requires review before merge
- what can be validated mechanically
- which source is graph truth versus harness memory
