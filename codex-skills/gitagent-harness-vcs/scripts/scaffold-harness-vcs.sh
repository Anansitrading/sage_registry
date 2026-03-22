#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: scaffold-harness-vcs.sh <agent-dir>" >&2
  exit 1
fi

AGENT_DIR="$1"

if [[ ! -d "$AGENT_DIR" ]]; then
  echo "agent dir not found: $AGENT_DIR" >&2
  exit 1
fi

if [[ ! -f "$AGENT_DIR/agent.yaml" ]]; then
  echo "agent.yaml not found in $AGENT_DIR" >&2
  exit 1
fi

mkdir -p \
  "$AGENT_DIR/memory/runtime" \
  "$AGENT_DIR/knowledge/context/agent" \
  "$AGENT_DIR/knowledge/policies/operating" \
  "$AGENT_DIR/knowledge/systems/integrations" \
  "$AGENT_DIR/hooks/scripts" \
  "$AGENT_DIR/workflows" \
  "$AGENT_DIR/compliance" \
  "$AGENT_DIR/config"

write_if_missing() {
  local path="$1"
  local content="$2"
  if [[ -e "$path" ]]; then
    return 0
  fi
  printf '%s' "$content" > "$path"
}

write_if_missing "$AGENT_DIR/memory/MEMORY.md" '# Memory

Persistent working memory for this agent. Keep this short, durable, and reviewable.

## Current State

- Replace with the current operating context.
'

write_if_missing "$AGENT_DIR/memory/memory.yaml" 'layers:
  - name: working
    path: MEMORY.md
    max_lines: 200
    format: markdown
  - name: runtime
    path: runtime/
    format: markdown
    rotation: weekly
update_triggers:
  - on_session_end
  - on_explicit_save
  - on_milestone
archive_policy:
  max_entries: 365
  compress_after: 90d
  retention_period: 365d
'

write_if_missing "$AGENT_DIR/memory/runtime/dailylog.md" '# Daily Log

Append dated notes about important runtime events, incidents, and releases.
'

write_if_missing "$AGENT_DIR/memory/runtime/key-decisions.md" '# Key Decisions

Record durable decisions with rationale, owner, and impact.
'

write_if_missing "$AGENT_DIR/knowledge/index.yaml" 'documents:
  - path: context/agent/context.md
    tags: [identity, operating-context]
    priority: high
    always_load: true
    description: Core operating context the agent should always inherit
  - path: policies/operating/context.md
    tags: [policy, operations]
    priority: high
    description: Operating policies and review constraints
  - path: systems/integrations/context.md
    tags: [systems, integrations]
    priority: medium
    description: External systems and interface assumptions
'

write_if_missing "$AGENT_DIR/knowledge/context/agent/context.md" '# Agent Context

Describe the stable mission, operating environment, and current deployment assumptions.

If embeddings are generated for this node later, write them to `embedding.npy` beside this file.
'

write_if_missing "$AGENT_DIR/knowledge/policies/operating/context.md" '# Operating Policies

Document the policies, approval paths, and review requirements that should shape agent behavior.
'

write_if_missing "$AGENT_DIR/knowledge/systems/integrations/context.md" '# Systems And Integrations

Document the upstream systems, interfaces, contracts, and operational dependencies this agent relies on.
'

write_if_missing "$AGENT_DIR/hooks/hooks.yaml" 'hooks:
  on_session_start:
    - script: scripts/on-session-start.sh
      description: Bootstrap session context and confirm harness assumptions
      timeout: 10
      fail_open: false
  pre_tool_use:
    - script: scripts/pre-tool-use.sh
      description: Log or gate sensitive tool invocations
      timeout: 10
      fail_open: false
  post_response:
    - script: scripts/post-response.sh
      description: Persist audit metadata and decision traces after each response
      timeout: 10
      fail_open: false
  on_session_end:
    - script: scripts/on-session-end.sh
      description: Finalize logs and persist memory updates at session end
      timeout: 10
      fail_open: false
'

write_if_missing "$AGENT_DIR/hooks/scripts/on-session-start.sh" '#!/usr/bin/env bash
set -euo pipefail
cat >/dev/null
printf "%s\n" "{\"action\":\"allow\",\"modifications\":null,\"audit\":{\"logged\":true,\"log_id\":\"on_session_start\"}}"
'

write_if_missing "$AGENT_DIR/hooks/scripts/pre-tool-use.sh" '#!/usr/bin/env bash
set -euo pipefail
cat >/dev/null
printf "%s\n" "{\"action\":\"allow\",\"modifications\":null,\"audit\":{\"logged\":true,\"log_id\":\"pre_tool_use\"}}"
'

write_if_missing "$AGENT_DIR/hooks/scripts/post-response.sh" '#!/usr/bin/env bash
set -euo pipefail
cat >/dev/null
printf "%s\n" "{\"action\":\"allow\",\"modifications\":null,\"audit\":{\"logged\":true,\"log_id\":\"post_response\"}}"
'

write_if_missing "$AGENT_DIR/hooks/scripts/on-session-end.sh" '#!/usr/bin/env bash
set -euo pipefail
cat >/dev/null
printf "%s\n" "{\"action\":\"allow\",\"modifications\":null,\"audit\":{\"logged\":true,\"log_id\":\"on_session_end\"}}"
'

chmod +x \
  "$AGENT_DIR/hooks/scripts/on-session-start.sh" \
  "$AGENT_DIR/hooks/scripts/pre-tool-use.sh" \
  "$AGENT_DIR/hooks/scripts/post-response.sh" \
  "$AGENT_DIR/hooks/scripts/on-session-end.sh"

write_if_missing "$AGENT_DIR/workflows/review-memory-update.yaml" 'name: review-memory-update
description: Human-reviewed flow for merging durable memory or policy learning
version: 1.0.0
inputs:
  - name: branch
    type: string
    required: true
steps:
  - id: validate
    action: Validate harness and inspect changed memory surfaces
  - id: review
    action: Open PR for human review of memory, policy, or skill updates
    depends_on: [validate]
  - id: merge
    action: Merge only after explicit approval
    depends_on: [review]
'

write_if_missing "$AGENT_DIR/workflows/release-promotion.yaml" 'name: release-promotion
description: Promote a harness from development through release branches
version: 1.0.0
inputs:
  - name: source_branch
    type: string
    required: true
  - name: target_branch
    type: string
    required: true
steps:
  - id: validate
    action: Run harness validation and required CI gates
  - id: approve
    action: Confirm release approval and outstanding review gates
    depends_on: [validate]
  - id: promote
    action: Merge source branch into target branch
    depends_on: [approve]
'

write_if_missing "$AGENT_DIR/compliance/segregation-of-duties.yaml" 'segregation_of_duties:
  enforcement: strict
  roles:
    - id: maker
      description: Creates proposals and drafts updates
      permissions: [create, submit]
    - id: checker
      description: Reviews and approves or rejects changes
      permissions: [review, approve, reject]
    - id: executor
      description: Applies approved operational actions
      permissions: [execute]
    - id: auditor
      description: Monitors process integrity and traceability
      permissions: [inspect, report]
  conflicts:
    - [maker, checker]
    - [checker, executor]
  handoffs:
    - action: memory_update
      required_roles: [maker, checker]
      approval_required: true
    - action: production_release
      required_roles: [checker, executor]
      approval_required: true
'

write_if_missing "$AGENT_DIR/compliance/human-review-policy.md" '# Human Review Policy

Require human review before merging:

- durable memory updates
- new or materially changed skills
- hook changes that can block, modify, or audit actions
- compliance, SOD, or policy changes
- production release promotions
'

write_if_missing "$AGENT_DIR/compliance/validation-schedule.yaml" 'schedule:
  - type: full_validation
    cadence: monthly
    last_completed: null
    owner: harness-maintainer
  - type: supervisory_review
    cadence: monthly
    last_completed: null
    owner: human-reviewer
  - type: audit_review
    cadence: quarterly
    last_completed: null
    owner: audit-owner
'

write_if_missing "$AGENT_DIR/config/default.yaml" 'log_level: info
compliance_mode: false
memory_autosave: false
'

write_if_missing "$AGENT_DIR/config/development.yaml" 'log_level: debug
compliance_mode: false
memory_autosave: false
'

write_if_missing "$AGENT_DIR/config/production.yaml" 'log_level: warn
compliance_mode: true
memory_autosave: false
audit_logging: true
'

if [[ -f "$AGENT_DIR/.gitignore" ]]; then
  if ! grep -qxF '.gitagent/' "$AGENT_DIR/.gitignore"; then
    printf '\n.gitagent/\n' >> "$AGENT_DIR/.gitignore"
  fi
else
  printf '.gitagent/\n' > "$AGENT_DIR/.gitignore"
fi

printf 'Scaffolded harness surfaces in %s\n' "$AGENT_DIR"
