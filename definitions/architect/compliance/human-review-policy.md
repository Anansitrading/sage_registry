# Human Review Policy

Require human review before merging:

- durable memory updates or changed decision logs
- new or materially changed skills
- hook changes that can block, modify, or audit actions
- workflow changes that alter release or review flow
- compliance, SOD, or policy changes
- production release promotions

Minimum review questions:

1. Does this change preserve repository-local legibility?
2. Does it improve or degrade reversibility?
3. Does it alter what gets auto-approved versus human-reviewed?
4. Does it change any interface, source of truth, or audit surface?
