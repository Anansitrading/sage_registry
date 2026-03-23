# Superconductor Backup (2026-03-23)

This directory is a filesystem backup of the live Codex skill trees used for the
`codex app-server` + `superconductor` workflow on March 23, 2026.

Source session identified via Cass:

- `/home/david/.claude/projects/-home-david-Projects/06ed4a3a-0415-4618-b7fc-f056a9eb95cf.jsonl`

Live source directories copied into this backup:

- `/home/david/.codex/skills/superconductor/`
- `/home/david/.codex/skills/conductor/`

Notes:

- The user referred to "yesterday", but the app-server session located by Cass
  is dated March 23, 2026.
- `superconductor/` is copied as-is, including its package manifests, tests, and
  vendored `ws` dependency files.
- `conductor/` is copied as-is because the superconductor workflow depends on
  its supporting scripts, templates, and pipeline references.
