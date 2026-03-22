#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "usage: harness-diff.sh <repo-dir> <from-rev> <to-rev>" >&2
  exit 1
fi

REPO_DIR="$1"
FROM_REV="$2"
TO_REV="$3"

git -C "$REPO_DIR" diff "$FROM_REV" "$TO_REV" -- \
  agent.yaml \
  SOUL.md \
  RULES.md \
  AGENTS.md \
  skills \
  tools \
  knowledge \
  memory \
  workflows \
  hooks \
  compliance \
  config \
  agents
