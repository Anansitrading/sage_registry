#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: harness-blame.sh <repo-dir> <path>" >&2
  exit 1
fi

REPO_DIR="$1"
TARGET_PATH="$2"

git -C "$REPO_DIR" blame -- "$TARGET_PATH"
