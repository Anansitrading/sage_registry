#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: validate-harness-vcs.sh <agent-dir>" >&2
  exit 1
fi

AGENT_DIR="$(cd "$1" && pwd)"
REGISTRY_ROOT="/home/david/Projects/sage_registry"

cd "$REGISTRY_ROOT"
npx --no-install gitagent validate -d "$AGENT_DIR"

if [[ "$AGENT_DIR" == "$REGISTRY_ROOT"/definitions/* ]]; then
  AGENT_NAME="$(basename "$AGENT_DIR")"
  node scripts/test-parity.mjs --agent "$AGENT_NAME"
fi
