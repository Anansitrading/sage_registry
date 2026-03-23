---
name: curiosity
description: Use when brownfield requirements, harness docs, and live code may disagree, when graph gaps or peripheral modules matter more than central utilities, or when you need forensic investigation questions before planning.
---

# curiosity

Curiosity is the architect's brownfield alignment skill. It protects user intent from drifting away from harness docs and implementation reality.

## Overview

Curiosity compares three surfaces:

1. prompt intent
2. harness docs
3. live code graph evidence

It then converts mismatches and graph absences into targeted forensic questions.

## Core Loop

1. Restate the user's prompt as explicit claims.
2. Audit the harness docs before planning.
3. Query CGC first and treat it as the primary graph truth.
4. Suppress central utility nodes and inspect negative space:
   - missing expected edges
   - orphaned modules
   - bridge nodes
   - ownership gaps
   - boundary fragility
   - spec drift
   - silent-failure paths
5. Use `sequential-thinking` to order the open questions into dependency closure.
6. Use NotebookLM as the harness dump for requirements, docs, research notes, and rendered artifacts.
7. Before every spawn, run prompt, CGC, and NLM gut checks.
8. When a canonical harness source changes, delete or replace the stale NotebookLM source under the same canonical title.
9. Preserve context by attaching required skills explicitly to spawned workers, preferring reliable superpowers skills when they cover the task.

## Gap Classes

- `intent-doc drift`
- `doc-code drift`
- `missing documentation`
- `undocumented implementation`

## Operating Rules

- Trust code over docs when they conflict.
- Do not use NotebookLM as the first-pass graph tool when CGC is available.
- Do not declare sufficiency until each high-impact claim maps to code, docs, or an explicit unresolved question.
- Recommend doc refreshes, source replacement, and structural clarifications when the harness is stale or hard to follow.
