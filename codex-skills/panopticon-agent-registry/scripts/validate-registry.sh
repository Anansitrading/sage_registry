#!/usr/bin/env bash
set -euo pipefail

REGISTRY_ROOT="/home/david/Projects/sage_registry"

cd "$REGISTRY_ROOT"
node scripts/validate.mjs
