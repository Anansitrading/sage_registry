#!/usr/bin/env bash
set -euo pipefail

REGISTRY_ROOT="/home/david/Projects/sage_registry"

if [[ $# -lt 1 ]]; then
  echo "usage: register-agent.sh <agent-name>" >&2
  exit 1
fi

cd "$REGISTRY_ROOT"
node scripts/register-agent.mjs --agent "$1"
