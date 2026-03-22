#!/usr/bin/env bash
set -euo pipefail

EVENT_NAME="${1:-unknown}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/memory/runtime"
LOG_PATH="$RUNTIME_DIR/hook-events.jsonl"

mkdir -p "$RUNTIME_DIR"
PAYLOAD="$(cat)"

TIMESTAMP="$(date -Iseconds)"
ENTRY="$(EVENT_NAME="$EVENT_NAME" TIMESTAMP="$TIMESTAMP" PAYLOAD="$PAYLOAD" node - <<'NODE'
const entry = {
  timestamp: process.env.TIMESTAMP,
  event: process.env.EVENT_NAME,
  payload: process.env.PAYLOAD
};
process.stdout.write(JSON.stringify(entry));
NODE
)"

printf '%s\n' "$ENTRY" >> "$LOG_PATH"
printf '%s\n' "{\"action\":\"allow\",\"modifications\":null,\"audit\":{\"logged\":true,\"log_id\":\"$EVENT_NAME\"}}"
