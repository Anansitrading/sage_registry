#!/usr/bin/env bash
set -euo pipefail

REGISTRY_ROOT="/home/david/Projects/sage_registry"

cd "$REGISTRY_ROOT"

if [[ $# -gt 0 ]]; then
  node scripts/test-parity.mjs --agent "$1"
else
  node scripts/test-parity.mjs
fi
