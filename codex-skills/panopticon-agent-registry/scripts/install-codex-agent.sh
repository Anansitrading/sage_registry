#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: install-codex-agent.sh <agent-name>" >&2
  exit 1
fi

AGENT_NAME="$1"
REGISTRY_ROOT="/home/david/Projects/sage_registry"
SOURCE_DIR="$REGISTRY_ROOT/definitions/$AGENT_NAME/exports/codex/skills/$AGENT_NAME"
TARGET_DIR="/home/david/.codex/skills/$AGENT_NAME"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Codex export not found: $SOURCE_DIR" >&2
  exit 1
fi

if [[ -d "$TARGET_DIR" ]]; then
  BACKUP_DIR="${TARGET_DIR}.bak-$(date +%Y%m%d-%H%M%S)"
  cp -R "$TARGET_DIR" "$BACKUP_DIR"
  echo "Backed up existing skill to $BACKUP_DIR"
fi

rm -rf "$TARGET_DIR"
cp -R "$SOURCE_DIR" "$TARGET_DIR"
echo "Installed $AGENT_NAME to $TARGET_DIR"
